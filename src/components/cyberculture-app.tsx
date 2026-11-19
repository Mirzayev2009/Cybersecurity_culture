"use client";

import { useEffect, useRef } from "react";
import { initializeCyberculture } from "@/lib/cyberculture";

export default function CybercultureApp() {
  const appRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!appRef.current) return;
    return initializeCyberculture(appRef.current);
  }, []);

  return (
    <div className="app-shell" ref={appRef}>
      <aside className="rail" id="rail" aria-label="O‘quv bo‘limlari">
        <div className="railhead">
          <div className="monogram">S</div>
          <div className="brandlabel">
            <strong>SECOND THOUGHT</strong>
            <br />
            <span id="brandCaption">KIBERXAVFSIZLIK MADANIYATI</span>
          </div>
          <button
            className="collapsebtn"
            data-action="collapse"
            aria-label="Menyuni yig‘ish"
            title="Menyuni yig‘ish"
          >
            ‹
          </button>
        </div>
        <nav id="sideNav" className="railnav" />
        <div className="railfoot">
          <div className="railfoottext" id="railFooter">
            KOD YOZISH EMAS.
            <br />
            TO‘G‘RI QAROR QILISH.
            <br />
            <span style={{ color: "#f7ab87" }}>2026 / O‘QUV TAJRIBASI</span>
          </div>
        </div>
      </aside>
      <div
        className="mobile-overlay"
        id="overlay"
        data-action="closemenu"
      />
      <div className="main">
        <header className="top">
          <div className="topleft">
            <button
              className="mobilemenu"
              data-action="menu"
              aria-label="Menyuni ochish"
            >
              ☰
            </button>
            <span className="topcrumb" id="breadcrumb">
              BOSHLASH / KIBERXAVFSIZLIK MADANIYATI
            </span>
          </div>
          <div className="topright">
            <div className="header-progress">
              <span className="header-progress-label" id="headProgress">
                0% bajarildi
              </span>
              <div className="header-progress-track">
                <i id="headProgressBar" style={{ width: "0%" }} />
              </div>
            </div>
            <div
              className="lang-switch"
              role="group"
              aria-label="Tilni tanlash"
            >
              <button data-action="lang" data-value="uz" className="selected">
                UZ
              </button>
              <button data-action="lang" data-value="en">
                EN
              </button>
            </div>
          </div>
        </header>
        <main id="screen" tabIndex={-1} />
      </div>
    </div>
  );
}
