"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { ArrowLeft, ArrowRight, Check, Eye } from "lucide-react";
import {
  screenshots as defaultScreenshots,
  type ProductScreenshot,
} from "@/lib/content";
import { PhoneMockup } from "./ui";

export function ProductDemo({
  screenshots = defaultScreenshots,
}: {
  screenshots?: readonly ProductScreenshot[];
}) {
  const [selected, setSelected] = useState(0);
  const [keyboard, setKeyboard] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const screen = screenshots[selected];

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowDown" || event.key === "ArrowRight")
      next = (index + 1) % screenshots.length;
    else if (event.key === "ArrowUp" || event.key === "ArrowLeft")
      next = (index - 1 + screenshots.length) % screenshots.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = screenshots.length - 1;
    else return;
    event.preventDefault();
    setKeyboard(true);
    setSelected(next);
    tabs.current[next]?.focus();
  }

  return (
    <div className="demo-grid" data-keyboard={keyboard}>
      <div className="demo-controls">
        <p className="demo-intro">
          Pas besoin de tout réapprendre.
          <br />
          <strong>Juste de mieux voir ton commerce.</strong>
        </p>
        <div
          className="demo-tabs"
          role="tablist"
          aria-label="Découvrir les écrans de SamaJaay"
          aria-orientation="vertical"
        >
          {screenshots.map((item, index) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`tab-${item.id}`}
              aria-controls={`screen-${item.id}`}
              aria-selected={selected === index}
              tabIndex={selected === index ? 0 : -1}
              ref={(element) => {
                tabs.current[index] = element;
              }}
              onClick={() => {
                setKeyboard(false);
                setSelected(index);
              }}
              onKeyDown={(event) => onKeyDown(event, index)}
            >
              <span>{item.label}</span>
              <ArrowUpRightIcon active={selected === index} />
            </button>
          ))}
        </div>
        <p className="demo-real-note">
          <Eye size={16} aria-hidden="true" />
          Explore les écrans de SamaJaay.
        </p>
      </div>
      <div className="demo-stage">
        <div className="demo-stage-circle" aria-hidden="true" />
        {screenshots.map((item, index) => (
          <div
            key={item.id}
            role="tabpanel"
            id={`screen-${item.id}`}
            aria-labelledby={`tab-${item.id}`}
            hidden={selected !== index}
            tabIndex={0}
            className="demo-panel"
          >
            <PhoneMockup src={item.src} alt={item.alt} />
          </div>
        ))}
        <span className="demo-screen-tag">
          <Check size={14} aria-hidden="true" />
          Aperçu de l’application
        </span>
      </div>
      <div className="demo-caption" aria-live="polite" aria-atomic="true">
        <div>
          <h3>{screen.title}</h3>
          <p>{screen.description}</p>
          <small>Les montants visibles illustrent un exemple d’activité.</small>
        </div>
        <div className="demo-pagination">
          <button
            type="button"
            aria-label="Capture précédente"
            onClick={() => {
              setKeyboard(false);
              setSelected(
                (selected - 1 + screenshots.length) % screenshots.length,
              );
            }}
          >
            <ArrowLeft size={18} aria-hidden="true" />
          </button>
          <span>
            {String(selected + 1).padStart(2, "0")}
            <i> / {String(screenshots.length).padStart(2, "0")}</i>
          </span>
          <button
            type="button"
            aria-label="Capture suivante"
            onClick={() => {
              setKeyboard(false);
              setSelected((selected + 1) % screenshots.length);
            }}
          >
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
      <noscript>
        <p className="demo-noscript">
          Les {screenshots.length} captures sont consultables directement :{" "}
          {screenshots.map((item) => (
            <a key={item.id} href={item.src}>
              {item.label} →{" "}
            </a>
          ))}
        </p>
      </noscript>
    </div>
  );
}

function ArrowUpRightIcon({ active }: { active: boolean }) {
  return (
    <span
      className={`demo-tab-arrow${active ? " is-active" : ""}`}
      aria-hidden="true"
    >
      <ArrowRight size={18} />
    </span>
  );
}
