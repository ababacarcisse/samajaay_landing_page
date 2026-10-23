#!/usr/bin/env python3
"""Audit an isolated GA4 test build without sending data to Google.

Build/start with NEXT_PUBLIC_GA_MEASUREMENT_ID=G-TEST000001,
GOOGLE_SITE_VERIFICATION=qa-google-verification and
BING_SITE_VERIFICATION=qa-bing-verification. Never use those values in production.
Requires Python Playwright, Chromium and axe-core (QA tools only).
Override the expected public ID/tokens with --measurement-id/--google-token/--bing-token.
The audit stubs Google's tag and blocks all other Google measurement endpoints,
including when checking a build configured with the owner's public ID.
It verifies the site's consent contract, not the remote GA service itself.
"""

import argparse
import asyncio
import json
from pathlib import Path
from urllib.parse import urlparse

from playwright.async_api import async_playwright


TEST_ID = "G-TEST000001"
GOOGLE_TOKEN = "qa-google-verification"
BING_TOKEN = "qa-bing-verification"
TRACKING_DOMAINS = (
    "googletagmanager.com", "google-analytics.com", "doubleclick.net",
    "googleadservices.com", "googlesyndication.com", "google.com",
)


async def commands(page):
    return await page.evaluate("() => (window.dataLayer || []).map(item => Array.from(item))")


async def event_count(page, name):
    return sum(command[:2] == ["event", name] for command in await commands(page))


async def click_cta_without_navigation(page):
    # Exercise delegated tracking while preserving the audit page and no live app visits.
    await page.evaluate("""() => {
      const link = document.querySelector('[data-cta-location="hero"]');
      link.addEventListener('click', e => e.preventDefault(), {once: true});
      link.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true}));
    }""")


async def script_count(page):
    return await page.locator('script[src*="googletagmanager.com/gtag/js"]').count()


async def run(args):
    output = Path(args.output_dir).resolve()
    output.mkdir(parents=True, exist_ok=True)
    measurement_id = args.measurement_id
    report = {"url": args.url, "configuredMeasurementId": measurement_id, "googleNetwork": [], "errors": []}
    google_requests = report["googleNetwork"]

    async def intercept_google(route):
        request = route.request
        parsed = urlparse(request.url)
        host = parsed.hostname or ""
        if any(host == domain or host.endswith("." + domain) for domain in TRACKING_DOMAINS):
            google_requests.append({"url": request.url, "method": request.method})
            if host == "www.googletagmanager.com" and parsed.path == "/gtag/js":
                # No real GA implementation or outbound fetch is executed.
                await route.fulfill(status=200, content_type="application/javascript", body="window.__qaGoogleTagLoads = (window.__qaGoogleTagLoads || 0) + 1;")
            else:
                await route.abort()
            return
        await route.continue_()

    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(
            executable_path=args.chromium, headless=True,
            args=["--no-sandbox", "--disable-dev-shm-usage"],
        )
        context = await browser.new_context(viewport={"width": 1440, "height": 1000})
        await context.route("**/*", intercept_google)
        page = await context.new_page()
        page.on("pageerror", lambda error: report["errors"].append(str(error)))
        response = await page.goto(args.url, wait_until="networkidle")
        assert response and response.status == 200, "The isolated test page must load"

        report["seo"] = await page.evaluate("""() => ({
          canonical: document.querySelector('link[rel="canonical"]')?.href,
          google: document.querySelector('meta[name="google-site-verification"]')?.content ?? null,
          bing: document.querySelector('meta[name="msvalidate.01"]')?.content ?? null
        })""")
        assert report["seo"] == {
            "canonical": "https://samajaay.com/", "google": args.google_token or None, "bing": args.bing_token or None,
        }, "Verification metadata must match the configured build"
        redirect = await context.request.get(
            args.url.rstrip("/") + "/controle-seo?source=qa&device=mobile",
            headers={"Host": "www.samajaay.com"}, max_redirects=0,
        )
        report["redirect"] = {"status": redirect.status, "location": redirect.headers.get("location")}
        assert redirect.status == 308, "www must permanently redirect"
        assert redirect.headers.get("location") == "https://samajaay.com/controle-seo?source=qa&device=mobile", "Preserve path and query on the canonical host"

        accept = page.get_by_role("button", name="Accepter", exact=True)
        refuse = page.get_by_role("button", name="Refuser", exact=True)
        preferences = page.get_by_role("button", name="Préférences de mesure", exact=True)
        await accept.wait_for(state="visible")
        assert await refuse.is_visible(), "Refusal must be offered alongside acceptance"
        assert not google_requests and await script_count(page) == 0, "Do not load Google before a choice"
        assert not any(cookie["name"].startswith("_ga") for cookie in await context.cookies()), "No GA cookie before consent"
        await click_cta_without_navigation(page)
        assert await event_count(page, "cta_click") == 0, "Do not queue denied CTA events"

        await refuse.click()
        await page.reload(wait_until="networkidle")
        assert await accept.count() == 0, "Persist the visitor's refusal"
        assert not google_requests and await script_count(page) == 0, "Refusal must prevent Google requests on return"
        await click_cta_without_navigation(page)
        assert await event_count(page, "cta_click") == 0
        report["beforeConsentAndRefusal"] = {"googleRequests": 0, "ctaEvents": 0, "refusalPersists": True}

        # Reopen preferences via the keyboard, then grant measurement.
        await preferences.focus()
        await preferences.press("Enter")
        await accept.wait_for(state="visible")
        await accept.click()
        await page.wait_for_function("window.__qaGoogleTagLoads === 1")
        await page.wait_for_function("(window.dataLayer || []).some(item => item[0] === 'event' && item[1] === 'page_view')")
        assert await script_count(page) == 1
        assert await event_count(page, "page_view") == 1, "Send a single explicit page view"
        assert len(google_requests) == 1 and measurement_id in google_requests[0]["url"]
        await click_cta_without_navigation(page)
        assert await event_count(page, "cta_click") == 1, "A consented CTA emits once"
        cta = next(command for command in await commands(page) if command[:2] == ["event", "cta_click"])
        assert cta[2]["placement"] == "hero" and cta[2]["destination"] == args.app_url, "Include the verified app destination and CTA placement"
        config = next(command for command in await commands(page) if command[:2] == ["config", measurement_id])
        assert config[2]["send_page_view"] is False and config[2]["allow_google_signals"] is False and config[2]["allow_ad_personalization_signals"] is False
        consent_updates = [command[2] for command in await commands(page) if command[:2] == ["consent", "update"]]
        assert consent_updates and all(update["ad_storage"] == update["ad_user_data"] == update["ad_personalization"] == "denied" for update in consent_updates), "Advertising consent must remain denied"

        # Preferences reopening must not cause duplicate page views/scripts.
        await preferences.click()
        await accept.click()
        assert await script_count(page) == 1 and await event_count(page, "page_view") == 1
        report["accepted"] = {"singleScript": True, "singlePageView": True, "cta": cta}

        await page.reload(wait_until="networkidle")
        await page.wait_for_function("window.__qaGoogleTagLoads === 1")
        await page.wait_for_function("(window.dataLayer || []).some(item => item[0] === 'event' && item[1] === 'page_view')")
        assert await accept.count() == 0, "An accepted returning visitor need not choose again"
        assert await event_count(page, "page_view") == 1 and await script_count(page) == 1

        # The stub intentionally does not set cookies; seed accessible GA cookies to test revocation.
        await context.add_cookies([
            {"name": "_ga", "value": "GA1.1.123.456", "url": args.url},
            {"name": "_ga_" + measurement_id.removeprefix("G-"), "value": "GS1.1.123.456", "url": args.url},
        ])
        requests_before_revoke = len(google_requests)
        await preferences.click()
        await refuse.click()
        await click_cta_without_navigation(page)
        assert await event_count(page, "cta_click") == 0, "Revocation must stop further CTA events"
        assert await page.evaluate("id => window[`ga-disable-${id}`] === true", measurement_id), "Disable Google's already loaded tag on withdrawal"
        assert not any(cookie["name"].startswith("_ga") for cookie in await context.cookies()), "Remove accessible first-party GA cookies"
        assert len(google_requests) == requests_before_revoke, "Revocation must not initiate another Google request"
        await page.reload(wait_until="networkidle")
        assert await script_count(page) == 0 and len(google_requests) == requests_before_revoke
        report["revocation"] = {"eventsBlocked": True, "accessibleCookiesCleared": True, "refusalPersists": True}

        # Measure the consent UI at desktop and narrow Android widths, including reduced motion.
        report["responsive"] = []
        await page.emulate_media(reduced_motion="reduce")
        await preferences.focus()
        await preferences.press("Enter")
        await page.get_by_role("heading", name="Un mot sur la mesure d’audience").wait_for()
        await page.keyboard.press("Escape")
        assert await preferences.evaluate("element => element === document.activeElement"), "Restore focus when preferences close"
        await preferences.click()
        await page.add_script_tag(path=args.axe)
        for width in [360, 1440]:
            await page.set_viewport_size({"width": width, "height": 844 if width == 360 else 1000})
            await accept.wait_for(state="visible")
            geometry = await page.evaluate("""() => ({
              width: innerWidth, documentWidth: document.documentElement.scrollWidth,
              reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
              buttons: [...document.querySelectorAll('button')].filter(button => ['Accepter','Refuser'].includes(button.textContent.trim())).map(button => {
                const rect = button.getBoundingClientRect();
                return {label: button.textContent.trim(), width: rect.width, height: rect.height, visible: rect.x >= 0 && rect.right <= innerWidth && rect.y >= 0 && rect.bottom <= innerHeight};
              })
            })""")
            axe = await page.evaluate("""async () => {
              const result = await axe.run(document, {runOnly: {type: 'tag', values: ['wcag2a','wcag2aa','wcag21aa']}});
              return result.violations.map(item => ({id: item.id, impact: item.impact, nodes: item.nodes.map(node => node.target)}));
            }""")
            geometry["axeViolations"] = axe
            report["responsive"].append(geometry)
            await page.screenshot(path=str(output / f"analytics-consent-{width}.png"))
            assert geometry["documentWidth"] <= width and geometry["reducedMotion"]
            assert len(geometry["buttons"]) == 2 and all(button["height"] >= 44 and button["visible"] for button in geometry["buttons"])
            assert not axe, "Inspect consent UI accessibility violations in the audit report"

        assert not report["errors"], "No unexpected browser JavaScript errors"
        await browser.close()

    report["liveServiceValidated"] = False
    report["notice"] = "Google tag stubbed, no real collection or account verification performed."
    (output / "analytics-audit.json").write_text(json.dumps(report, ensure_ascii=False, indent=2))
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--url", default="http://localhost:3000")
    parser.add_argument("--chromium", default=None)
    parser.add_argument("--axe", default="/tmp/samajaay-qa/node_modules/axe-core/axe.min.js")
    parser.add_argument("--output-dir", default="artifacts/analytics")
    parser.add_argument("--measurement-id", default=TEST_ID)
    parser.add_argument("--google-token", default=GOOGLE_TOKEN)
    parser.add_argument("--bing-token", default=BING_TOKEN)
    parser.add_argument("--app-url", default="https://app.samajaay.com/")
    asyncio.run(run(parser.parse_args()))
