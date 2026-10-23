#!/usr/bin/env python3
"""Browser QA for the production landing page (not a replacement for a manual audit).

Prerequisites: Python Playwright, Chromium and axe-core.
Run: python scripts/audit.py --url http://localhost:3000
Override the Chromium or axe installation using --chromium / --axe.
Reports and screenshots are written to the ignored artifacts/ directory.
"""

import argparse
import asyncio
import json
import os
from pathlib import Path
from urllib.parse import urlparse

from playwright.async_api import async_playwright


async def run(args):
    output = Path(args.output_dir).resolve() if args.output_dir else Path(__file__).resolve().parents[1] / "artifacts"
    output.mkdir(parents=True, exist_ok=True)
    results = {"url": args.url, "responsive": [], "interactions": {}, "errors": []}

    async with async_playwright() as playwright:
        local_target = urlparse(args.url).hostname in {"localhost", "127.0.0.1", "::1", "0.0.0.0"}
        proxy_server = None if local_target else os.environ.get("HTTPS_PROXY") or os.environ.get("HTTP_PROXY")
        browser = await playwright.chromium.launch(
            executable_path=args.chromium,
            proxy={"server": proxy_server} if proxy_server else None,
            headless=True,
            args=["--no-sandbox", "--disable-dev-shm-usage"],
        )
        context = await browser.new_context(viewport={"width": 1440, "height": 1000}, device_scale_factor=1)
        page = await context.new_page()
        page.on("pageerror", lambda error: results["errors"].append(str(error)))

        response = await page.goto(args.url, wait_until="networkidle")
        assert response and response.status == 200, "Home page must return HTTP 200"
        await page.evaluate("document.fonts.ready")
        await page.wait_for_timeout(750)

        results["seo"] = await page.evaluate("""() => ({
          title: document.title,
          language: document.documentElement.lang,
          h1Count: document.querySelectorAll('h1').length,
          canonical: document.querySelector('link[rel="canonical"]')?.href,
          description: document.querySelector('meta[name="description"]')?.content,
          openGraph: document.querySelector('meta[property="og:image"]')?.content,
          twitterCard: document.querySelector('meta[name="twitter:card"]')?.content,
          structuredData: [...document.querySelectorAll('script[type="application/ld+json"]')].map(s=>JSON.parse(s.textContent)),
          brokenAnchors: [...document.querySelectorAll('a[href^="#"]')].map(a=>a.getAttribute('href')).filter(href=>href.length>1&&!document.getElementById(decodeURIComponent(href.slice(1)))),
          ctas: [...document.querySelectorAll('a[data-cta-location]')].map(a=>({placement:a.dataset.ctaLocation,href:a.href})),
          imagesWithoutAlt: [...document.querySelectorAll('img')].filter(img=>!img.hasAttribute('alt')).length
        })""")
        assert results["seo"]["h1Count"] == 1, "Exactly one H1 is required"
        assert results["seo"]["language"] == "fr-SN", "The document language must be fr-SN"
        assert not results["seo"]["brokenAnchors"], "Internal anchors must resolve"
        assert results["seo"]["imagesWithoutAlt"] == 0, "Every image needs an alt attribute"
        assert len(results["seo"]["ctas"]) >= 4, "Conversion links are required throughout the page"
        assert len({cta["href"] for cta in results["seo"]["ctas"]}) == 1, "All application CTAs must use the configured URL"

        results["groupage"] = await page.evaluate("""() => {
          const section=document.querySelector('#groupage');
          const data=[...document.querySelectorAll('script[type="application/ld+json"]')].flatMap(s=>{const value=JSON.parse(s.textContent);return value['@graph']||[value]});
          const faq=data.find(item=>item['@type']==='FAQPage');
          const questions=[...document.querySelectorAll('details summary')].map(e=>e.textContent.replace(/\\s+/g,' ').trim().replace(/^0\\d\\s*/,''));
          return {
            present:!!section,
            mentionsAlibaba:section?.textContent.includes('Alibaba')||false,
            moneyStatement:section?.textContent.includes('SamaJaay ne reçoit et ne garde aucun argent.')||false,
            faqCount:questions.length,
            schemaFaqCount:faq?.mainEntity?.length||0,
            faqMatchesSchema:questions.length===(faq?.mainEntity?.length||0)&&questions.every((q,i)=>q===faq.mainEntity[i].name),
            appHasGroupage:data.some(item=>item['@type']==='SoftwareApplication'&&item.featureList?.some(feature=>/group/i.test(feature)))
          };
        }""")
        assert all(results["groupage"][key] for key in ["present", "mentionsAlibaba", "moneyStatement", "faqMatchesSchema", "appHasGroupage"]), "Groupage content and structured data must be coherent"

        for route in ["/robots.txt", "/sitemap.xml", "/opengraph-image", "/icon.png", "/apple-icon.png"]:
            resource = await context.request.get(args.url.rstrip("/") + route)
            results.setdefault("routes", {})[route] = {"status": resource.status, "contentType": resource.headers.get("content-type")}
            assert resource.status == 200, f"SEO/brand resource {route} must return HTTP 200"

        missing = await context.request.get(args.url.rstrip("/") + "/page-introuvable-qa")
        missing_html = await missing.text()
        results["notFound"] = {
            "status": missing.status,
            "hasFaqSchema": "FAQPage" in missing_html,
            "hasJsonLd": "application/ld+json" in missing_html,
        }
        assert missing.status == 404, "An unknown URL must return HTTP 404"
        assert not results["notFound"]["hasJsonLd"], "The 404 page must not inherit home page JSON-LD"

        if not args.skip_axe:
            await page.add_script_tag(path=args.axe)

        for width in [360, 390, 430, 768, 1024, 1440]:
            await page.set_viewport_size({"width": width, "height": 1000 if width >= 768 else 844})
            await page.evaluate("window.scrollTo(0,0)")
            await page.wait_for_timeout(350)
            result = await page.evaluate("""() => ({
              width: innerWidth,
              documentWidth: document.documentElement.scrollWidth,
              bodyWidth: document.body.scrollWidth,
              overflow: document.documentElement.scrollWidth > innerWidth,
              headerCta: (()=>{const e=document.querySelector('.header-cta');const r=e.getBoundingClientRect();return {width:r.width,height:r.height,visible:r.x>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight}})(),
              heroCta: (()=>{const e=document.querySelector('[data-cta-location="hero"]');const r=e.getBoundingClientRect();return {width:r.width,height:r.height,visible:r.x>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight}})(),
              readableText: [...document.querySelectorAll('.hero-description,.section-description,.sj-feature-text p,.groupage-steps p,.sj-faq-item>p,.demo-caption p')].map(e=>({selector:e.className||e.parentElement.className,text:e.textContent.trim().slice(0,70),fontSize:parseFloat(getComputedStyle(e).fontSize)})),
              touchTargets: [...document.querySelectorAll('.header-cta,.menu-toggle,.demo-tabs>button,a[data-cta-location]')].filter(e=>e.getBoundingClientRect().width>0).map(e=>({name:e.getAttribute('aria-label')||e.textContent.trim(),width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height})),
              clippedText: [...document.querySelectorAll('h1,h2,h3,p,button,summary')].filter(e=>getComputedStyle(e).display!=='none'&&e.getBoundingClientRect().width>0&&e.scrollWidth>e.clientWidth+2&&getComputedStyle(e).overflow==='hidden').map(e=>e.textContent.slice(0,100))
            })""")
            if not args.skip_axe:
                axe = await page.evaluate("""async () => {
                  const result=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});
                  return {violations:result.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,helpUrl:v.helpUrl,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),passes:result.passes.length,incomplete:result.incomplete.length};
                }""")
                result["axe"] = axe
            results["responsive"].append(result)
            await page.screenshot(path=str(output / f"responsive-{width}.png"), full_page=True)

        await page.set_viewport_size({"width": 1440, "height": 1000})
        tablist = page.get_by_role("tablist")
        tabs = tablist.get_by_role("tab")
        tab_count = await tabs.count()
        for index in range(tab_count):
            await tabs.nth(index).click()
            assert await tabs.nth(index).get_attribute("aria-selected") == "true"
            assert await page.get_by_role("tabpanel").count() == 1
        await tabs.nth(0).focus()
        await tabs.nth(0).press("ArrowDown")
        assert await tabs.nth(1).get_attribute("aria-selected") == "true"
        assert await tabs.nth(1).evaluate("e=>e===document.activeElement")
        await tabs.nth(1).press("End")
        assert await tabs.nth(tab_count - 1).get_attribute("aria-selected") == "true"
        await tabs.nth(tab_count - 1).press("Home")
        assert await tabs.nth(0).get_attribute("aria-selected") == "true"
        results["interactions"]["tabs"] = {"count": tab_count, "click": True, "arrows": True, "homeEnd": True, "singleVisiblePanel": True}

        faq = page.locator("details").first
        await faq.locator("summary").click()
        assert await faq.get_attribute("open") is not None
        await faq.locator("summary").press("Enter")
        assert await faq.get_attribute("open") is None
        results["interactions"]["faq"] = {"nativeClick": True, "keyboard": True}

        await page.set_viewport_size({"width": 390, "height": 844})
        menu = page.get_by_role("button", name="Ouvrir le menu")
        await menu.click()
        assert await page.get_by_role("navigation", name="Navigation mobile").is_visible()
        await page.keyboard.press("Escape")
        assert await page.get_by_role("button", name="Ouvrir le menu").get_attribute("aria-expanded") == "false"
        assert await menu.evaluate("e=>e===document.activeElement")
        await menu.click()
        await page.get_by_role("navigation", name="Navigation mobile").get_by_role("link").first.click()
        assert await page.get_by_role("button", name="Ouvrir le menu").get_attribute("aria-expanded") == "false"
        results["interactions"]["mobileMenu"] = {"open": True, "escape": True, "focusRestored": True, "linkCloses": True}

        results["interactions"]["analytics"] = await page.evaluate("""() => {
          const calls=[];
          const target=document.querySelector('[data-cta-location="hero"]');
          const prevent=e=>{if(e.target.closest('a[data-cta-location]'))e.preventDefault()};
          document.addEventListener('click',prevent);
          const click=()=>target.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
          window.samajaayAnalytics={hasConsent:()=>false,track:(...args)=>calls.push(args)};
          click(); const deniedCount=calls.length;
          window.samajaayAnalytics.hasConsent=()=>true;
          click(); const grantedCount=calls.length;
          window.samajaayAnalytics.track=()=>{throw new Error('Intentional failing test adapter')};
          let failureContained=true;
          try{click()}catch{failureContained=false}
          delete window.samajaayAnalytics;
          document.removeEventListener('click',prevent);
          return {deniedCount,grantedCount,failureContained,event:calls[0]};
        }""")

        reduced_context = await browser.new_context(viewport={"width": 390, "height": 844}, reduced_motion="reduce")
        reduced = await reduced_context.new_page()
        await reduced.goto(args.url, wait_until="networkidle")
        results["reducedMotion"] = await reduced.evaluate("""() => ({
          requested:matchMedia('(prefers-reduced-motion: reduce)').matches,
          scrollBehavior:getComputedStyle(document.documentElement).scrollBehavior,
          buttonTransition:getComputedStyle(document.querySelector('.button')).transitionDuration,
          h1Visible:document.querySelector('h1').getBoundingClientRect().height>0
        })""")
        await reduced_context.close()

        nojs_context = await browser.new_context(viewport={"width": 390, "height": 844}, java_script_enabled=False)
        nojs = await nojs_context.new_page()
        await nojs.goto(args.url, wait_until="networkidle")
        assert await nojs.get_by_role("heading", level=1).is_visible()
        assert await nojs.locator('[data-cta-location="hero"]').is_visible()
        await nojs.locator("details summary").first.click()
        assert await nojs.locator("details").first.get_attribute("open") is not None
        results["noJavaScript"] = {"h1Visible": True, "heroCtaVisible": True, "faqWorks": True, "directScreenshotLinks": await nojs.locator(".demo-noscript a").count()}
        await nojs_context.close()
        await browser.close()

    (output / "browser-audit.json").write_text(json.dumps(results, ensure_ascii=False, indent=2))
    summary = {
        "responsiveOverflow": {r["width"]: r["overflow"] for r in results["responsive"]},
        "axeViolations": {r["width"]: len(r.get("axe", {}).get("violations", [])) for r in results["responsive"]},
        "brokenAnchors": results["seo"]["brokenAnchors"],
        "interactions": results["interactions"],
        "errors": results["errors"],
    }
    print(json.dumps(summary, ensure_ascii=False, indent=2))
    assert all(not item["overflow"] for item in results["responsive"]), "Responsive overflow detected"
    assert all(not item["clippedText"] for item in results["responsive"]), "Clipped text detected"
    assert all(all(text["fontSize"] >= 16 for text in item["readableText"]) for item in results["responsive"]), "Functional paragraph text must be at least 16px"
    assert all(all(target["height"] >= 44 for target in item["touchTargets"]) for item in results["responsive"]), "Primary controls need at least 44px height"
    assert all(item["headerCta"]["visible"] and item["heroCta"]["visible"] for item in results["responsive"]), "Header and hero CTAs must be visible on the first screen"
    assert not results["errors"], "Unexpected JavaScript errors detected"
    assert results["interactions"]["analytics"]["deniedCount"] == 0, "Analytics must respect denied consent"
    assert results["interactions"]["analytics"]["grantedCount"] == 1, "Consented CTA tracking must be delivered once"
    assert results["interactions"]["analytics"]["failureContained"], "Analytics failure must not stop navigation"
    if not args.skip_axe:
        assert all(not item["axe"]["violations"] for item in results["responsive"]), "Accessibility violations detected; inspect artifacts/browser-audit.json"


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--url", default="http://localhost:3000")
    parser.add_argument("--chromium", default=None, help="Optional system Chromium executable; otherwise use Playwright's installed browser")
    parser.add_argument("--axe", default="/tmp/samajaay-qa/node_modules/axe-core/axe.min.js")
    parser.add_argument("--skip-axe", action="store_true")
    parser.add_argument("--output-dir", default=None, help="Optional report and screenshot directory")
    asyncio.run(run(parser.parse_args()))
