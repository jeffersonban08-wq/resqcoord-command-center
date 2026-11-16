# ResQCoord — Complete Source Code

This document contains the **full, byte-for-byte source** of every project file written for ResQCoord: HTML, CSS, JavaScript, the SVG logo, the Windows launcher, and the static server. Each section starts with the file path, size, line count, and SHA-256 so you can confirm you are reading the exact file.

Generated: **2026-11-13 18:08 UTC**

> **Third-party files:** Leaflet 1.9.4 is vendored under `assets/vendor/leaflet` so the demo works without a CDN. Its minified CSS/JS and PNG marker images are third-party assets, not project code. They are listed with their source and checksums in the [Vendor assets](#vendor-assets) appendix instead of being reproduced inline.

---

## Inventory

| # | File | Type | Size | Lines |
| --- | --- | --- | ---: | ---: |
| 1 | `index.html` | html | 28587 B | 505 |
| 2 | `start.bat` | bat | 670 B | 31 |
| 3 | `server.js` | js | 3837 B | 113 |
| 4 | `admin/login.html` | html | 9340 B | 193 |
| 5 | `admin/register.html` | html | 10294 B | 209 |
| 6 | `admin/dashboard.html` | html | 61874 B | 1076 |
| 7 | `user/login.html` | html | 7478 B | 158 |
| 8 | `user/register.html` | html | 8687 B | 173 |
| 9 | `user/dashboard.html` | html | 59933 B | 980 |
| 10 | `assets/css/base.css` | css | 24166 B | 1402 |
| 11 | `assets/css/app.css` | css | 41789 B | 2343 |
| 12 | `assets/img/logo.svg` | xml | 574 B | 12 |
| 13 | `assets/js/util.js` | js | 17788 B | 386 |
| 14 | `assets/js/db.js` | js | 22976 B | 584 |
| 15 | `assets/js/auth.js` | js | 9011 B | 247 |
| 16 | `assets/js/routing.js` | js | 7894 B | 217 |
| 17 | `assets/js/mapkit.js` | js | 13334 B | 409 |
| 18 | `assets/js/tracking.js` | js | 14370 B | 456 |
| 19 | `assets/js/auth-page.js` | js | 7713 B | 220 |
| 20 | `assets/js/user-app.js` | js | 66530 B | 1679 |
| 21 | `assets/js/admin-app.js` | js | 79303 B | 1704 |

Total project-authored code: **484.5 KB** across **21** files and **13097** lines.

---

## Contents

- [index.html](#file-1) — Landing page
- [start.bat](#file-2) — Windows one-click launcher
- [server.js](#file-3) — Zero-dependency static server
- [admin/login.html](#file-4) — Admin sign-in
- [admin/register.html](#file-5) — Admin registration with access code
- [admin/dashboard.html](#file-6) — Admin command dashboard markup
- [user/login.html](#file-7) — Responder sign-in
- [user/register.html](#file-8) — Responder registration
- [user/dashboard.html](#file-9) — Responder field dashboard markup
- [assets/css/base.css](#file-10) — Design tokens, forms, buttons, cards, modals
- [assets/css/app.css](#file-11) — Dashboard, map, table, chart and admin styles
- [assets/img/logo.svg](#file-12) — ResQCoord logo mark
- [assets/js/util.js](#file-13) — DOM/format helpers, icons, toasts, modals, CSV, hashing
- [assets/js/db.js](#file-14) — IndexedDB/localStorage layer and seeded demo data
- [assets/js/auth.js](#file-15) — Registration, login, sessions, role guards, audit
- [assets/js/routing.js](#file-16) — OSRM, Nominatim, offline routing, route playback
- [assets/js/mapkit.js](#file-17) — Leaflet wrapper: layers, sectors, markers, trails, routes
- [assets/js/tracking.js](#file-18) — Simulation, GPS, demo movement, check-in, SOS
- [assets/js/auth-page.js](#file-19) — Login and registration page behavior
- [assets/js/user-app.js](#file-20) — Responder dashboard behavior
- [assets/js/admin-app.js](#file-21) — Admin dashboard behavior

---

<a id="file-1"></a>

## 1. index.html

**Purpose:** Landing page  
**Size:** 28587 bytes · **Lines:** 505 · **SHA-256:** `9DB104CAC6BD538BED0F0B6F8E77D13F81671763753C8C380D4F4AC76FFAF509`

````html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ResQCoord — Rescue Coordination Command Center</title>
  <meta name="description" content="ResQCoord is a browser-based rescue coordination command center with live GPS tracking, mapping, routing, incident reporting and separate responder and admin portals.">
  <link rel="icon" href="assets/img/logo.svg" type="image/svg+xml">
  <link rel="stylesheet" href="assets/css/base.css">
  <style>
    .landing {
      min-height: 100vh;
      background:
        radial-gradient(900px 480px at 15% -5%, rgba(61, 220, 151, 0.09), transparent 65%),
        radial-gradient(800px 420px at 90% 5%, rgba(70, 184, 255, 0.05), transparent 65%),
        var(--bg);
      overflow-x: hidden;
    }
    .wrap { width: min(1180px, calc(100% - 48px)); margin: 0 auto; }
    .land-nav {
      height: 78px; display: flex; align-items: center; justify-content: space-between; gap: 20px;
    }
    .land-links { display: flex; align-items: center; gap: 26px; }
    .land-links a { font-size: 12.5px; color: var(--muted); font-weight: 500; }
    .land-links a:hover { color: var(--text); }
    .land-nav .actions { display: flex; gap: 9px; align-items: center; }

    .hero {
      display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 0.92fr);
      gap: 56px; align-items: center; padding: 64px 0 74px;
    }
    .eyebrow {
      display: inline-flex; align-items: center; gap: 8px; font-size: 10px;
      letter-spacing: 2.1px; text-transform: uppercase; color: var(--accent);
      font-weight: 700; margin-bottom: 20px;
    }
    .hero h1 {
      font-size: clamp(38px, 5vw, 60px); line-height: 1.02; letter-spacing: -2.6px;
      font-weight: 720;
    }
    .hero h1 em { font-style: normal; color: var(--accent); }
    .hero .lead {
      margin-top: 22px; font-size: 15px; line-height: 1.75; color: var(--muted);
      max-width: 490px;
    }
    .hero .cta { display: flex; gap: 11px; margin-top: 30px; flex-wrap: wrap; }
    .hero .cta .btn { height: 46px; padding: 0 20px; font-size: 13.5px; }
    .hero .meta {
      display: flex; gap: 26px; flex-wrap: wrap; margin-top: 30px;
      padding-top: 22px; border-top: 1px solid var(--line-soft);
      font-size: 11px; color: var(--muted-2);
    }
    .hero .meta span { display: inline-flex; align-items: center; gap: 7px; }
    .hero .meta svg { width: 14px; height: 14px; color: var(--accent); }

    /* Tactical preview illustration */
    .tac {
      position: relative; border: 1px solid #22374c; border-radius: 18px;
      background: linear-gradient(160deg, #0d1a27, #081220);
      padding: 14px; box-shadow: 0 40px 90px -40px #000;
    }
    .tac-head {
      display: flex; align-items: center; justify-content: space-between; gap: 10px;
      padding: 2px 4px 12px; font-size: 9.5px; letter-spacing: 1.4px; text-transform: uppercase;
      color: var(--muted-2); font-weight: 700;
    }
    .tac-head .live {
      display: inline-flex; align-items: center; gap: 6px; color: var(--danger);
      font-size: 9px; padding: 4px 7px; border: 1px solid rgba(255,90,106,.3);
      border-radius: 5px; background: rgba(255,90,106,.07);
    }
    .tac-map {
      position: relative; border-radius: 12px; overflow: hidden; border: 1px solid #1c3045;
      background:
        radial-gradient(ellipse at 30% 25%, rgba(61,220,151,.08), transparent 45%),
        radial-gradient(ellipse at 75% 70%, rgba(70,184,255,.07), transparent 46%),
        #0a1622;
      aspect-ratio: 1 / 0.86;
    }
    .tac-map svg { position: absolute; inset: 0; width: 100%; height: 100%; }
    .tac-grid {
      position: absolute; inset: 0;
      background-image: linear-gradient(rgba(61,220,151,.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(61,220,151,.05) 1px, transparent 1px);
      background-size: 38px 38px;
    }
    .tac-marker {
      position: absolute; display: grid; place-items: center;
      width: 26px; height: 26px; border-radius: 50% 50% 50% 4px;
      transform: rotate(-45deg); font-size: 8px; font-weight: 800;
      border: 2px solid rgba(255,255,255,.8);
      box-shadow: 0 4px 12px rgba(0,0,0,.6);
    }
    .tac-marker span { transform: rotate(45deg); }
    .tac-marker.red { background: var(--danger); color: #2a0409; animation: heroPulse 1.6s infinite; }
    .tac-marker.green { background: var(--accent); color: #042418; }
    .tac-marker.amber { background: var(--warn); color: #2a1d00; }
    .tac-marker.blue { background: var(--accent-2); color: #03202e; }
    @keyframes heroPulse {
      0%,100% { box-shadow: 0 0 0 0 rgba(255,90,106,.55); }
      50% { box-shadow: 0 0 0 10px rgba(255,90,106,0); }
    }
    .tac-tag {
      position: absolute; font-size: 8.5px; font-family: var(--mono);
      background: rgba(6,14,23,.85); border: 1px solid #263e55; color: #b9cbdc;
      padding: 3px 6px; border-radius: 4px; white-space: nowrap;
      backdrop-filter: blur(4px);
    }
    .tac-legend {
      display: flex; gap: 12px; flex-wrap: wrap; padding: 12px 4px 2px;
      font-size: 9px; color: var(--muted-2); text-transform: uppercase; letter-spacing: .7px;
    }
    .tac-legend span { display: inline-flex; align-items: center; gap: 5px; }
    .tac-legend i { width: 6px; height: 6px; border-radius: 50%; }
    .float-card {
      position: absolute; background: rgba(10, 21, 33, .94); border: 1px solid #29425a;
      border-radius: 11px; padding: 10px 12px; box-shadow: 0 18px 40px -18px #000;
      backdrop-filter: blur(10px); z-index: 2;
    }
    .float-card.one { left: -26px; bottom: 46px; }
    .float-card.two { right: -18px; top: 60px; }
    .float-card .fc-k { font-size: 8px; letter-spacing: 1.2px; text-transform: uppercase; color: var(--muted-2); font-weight: 700; }
    .float-card .fc-v { font-size: 18px; font-weight: 720; letter-spacing: -.5px; margin-top: 2px; }
    .float-card .fc-v small { font-size: 9px; color: var(--accent); font-weight: 600; margin-left: 3px; }
    .float-card .fc-d { font-size: 9px; color: var(--muted-2); margin-top: 2px; }
    .float-card .bar { height: 4px; border-radius: 4px; background: #1b2e42; margin-top: 7px; width: 118px; overflow: hidden; }
    .float-card .bar i { display: block; height: 100%; background: var(--accent); border-radius: 4px; }

    /* Portals */
    .section { padding: 66px 0; border-top: 1px solid var(--line-soft); }
    .section-head { max-width: 620px; margin-bottom: 34px; }
    .section-head .kicker {
      font-size: 10px; letter-spacing: 2px; text-transform: uppercase;
      color: var(--accent); font-weight: 700; margin-bottom: 12px;
    }
    .section-head h2 { font-size: clamp(26px, 3vw, 36px); letter-spacing: -1.2px; line-height: 1.12; }
    .section-head p { color: var(--muted); font-size: 13.5px; margin-top: 12px; line-height: 1.7; }

    .portals { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
    .portal-card {
      position: relative; overflow: hidden; border: 1px solid var(--line);
      border-radius: 18px; background: linear-gradient(155deg, #0d1a29, #091420);
      padding: 28px; display: flex; flex-direction: column; min-height: 330px;
      transition: border-color .2s, transform .2s;
    }
    .portal-card:hover { transform: translateY(-3px); }
    .portal-card.user:hover { border-color: rgba(61,220,151,.4); }
    .portal-card.admin:hover { border-color: rgba(167,139,250,.4); }
    .portal-card::after {
      content: ""; position: absolute; width: 240px; height: 240px; border-radius: 50%;
      right: -110px; top: -110px; pointer-events: none;
    }
    .portal-card.user::after { background: radial-gradient(circle, rgba(61,220,151,.15), transparent 68%); }
    .portal-card.admin::after { background: radial-gradient(circle, rgba(167,139,250,.16), transparent 68%); }
    .portal-card > * { position: relative; z-index: 1; }
    .portal-badge {
      display: inline-flex; align-items: center; gap: 7px; font-size: 9px; font-weight: 700;
      letter-spacing: 1.4px; text-transform: uppercase; padding: 5px 9px; border-radius: 6px;
      width: fit-content;
    }
    .portal-card.user .portal-badge { color: var(--accent); background: var(--accent-dim); border: 1px solid rgba(61,220,151,.2); }
    .portal-card.admin .portal-badge { color: var(--purple); background: var(--purple-dim); border: 1px solid rgba(167,139,250,.2); }
    .portal-card h3 { font-size: 24px; letter-spacing: -.7px; margin-top: 15px; }
    .portal-card p { font-size: 12.5px; color: var(--muted); line-height: 1.65; margin-top: 8px; max-width: 400px; }
    .portal-list { display: grid; gap: 7px; margin: 18px 0 22px; font-size: 11.5px; color: var(--muted); }
    .portal-list li { display: flex; align-items: center; gap: 8px; }
    .portal-list svg { width: 13px; height: 13px; color: var(--accent); flex: 0 0 auto; }
    .portal-card.admin .portal-list svg { color: var(--purple); }
    .portal-actions { margin-top: auto; display: flex; gap: 9px; flex-wrap: wrap; }
    .portal-cred {
      margin-top: 15px; padding-top: 13px; border-top: 1px solid var(--line-soft);
      font-family: var(--mono); font-size: 10px; color: var(--muted-2); line-height: 1.7;
    }
    .portal-cred b { color: var(--muted); font-weight: 600; }

    /* Features */
    .features { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
    .feature {
      border: 1px solid var(--line); border-radius: 14px; padding: 20px;
      background: linear-gradient(160deg, #0d1928, #0a1421);
    }
    .feature .fi {
      width: 34px; height: 34px; border-radius: 9px; display: grid; place-items: center;
      background: var(--accent-dim); color: var(--accent); border: 1px solid rgba(61,220,151,.15);
      margin-bottom: 14px;
    }
    .feature .fi.blue { background: var(--accent-2-dim); color: var(--accent-2); border-color: rgba(70,184,255,.15); }
    .feature .fi.amber { background: var(--warn-dim); color: var(--warn); border-color: rgba(247,191,79,.15); }
    .feature .fi.purple { background: var(--purple-dim); color: var(--purple); border-color: rgba(167,139,250,.15); }
    .feature .fi svg { width: 17px; height: 17px; }
    .feature h4 { font-size: 13px; font-weight: 650; }
    .feature p { font-size: 11.5px; color: var(--muted-2); line-height: 1.6; margin-top: 6px; }

    /* Steps strip */
    .steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; border: 1px solid var(--line); border-radius: 16px; overflow: hidden; }
    .step { padding: 22px; border-right: 1px solid var(--line-soft); background: #0b1624; }
    .step:last-child { border-right: 0; }
    .step .n { font-family: var(--mono); font-size: 10px; color: var(--accent); letter-spacing: 1px; }
    .step h4 { font-size: 12.5px; margin-top: 9px; font-weight: 650; }
    .step p { font-size: 11px; color: var(--muted-2); line-height: 1.55; margin-top: 5px; }

    /* Portal login modal-ish reveal: not needed */
    .foot {
      border-top: 1px solid var(--line-soft); padding: 28px 0 40px;
      display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;
      font-size: 10.5px; color: var(--muted-2);
    }
    .foot .links { display: flex; gap: 18px; flex-wrap: wrap; }
    .foot a { color: var(--muted-2); }
    .foot a:hover { color: var(--text); }

    @media (max-width: 1000px) {
      .hero { grid-template-columns: 1fr; gap: 44px; padding-top: 40px; }
      .tac { max-width: 560px; }
      .float-card.one { left: 8px; }
      .float-card.two { right: 8px; }
      .portals { grid-template-columns: 1fr; }
      .features { grid-template-columns: repeat(2, 1fr); }
      .steps { grid-template-columns: repeat(2, 1fr); }
      .step:nth-child(2) { border-right: 0; }
      .step:nth-child(1), .step:nth-child(2) { border-bottom: 1px solid var(--line-soft); }
      .land-links { display: none; }
    }
    @media (max-width: 620px) {
      .wrap { width: calc(100% - 28px); }
      .hero { padding: 28px 0 50px; }
      .hero h1 { letter-spacing: -1.8px; }
      .features, .steps { grid-template-columns: 1fr; }
      .step { border-right: 0; border-bottom: 1px solid var(--line-soft); }
      .step:last-child { border-bottom: 0; }
      .portal-card { padding: 22px; }
      .land-nav .actions .btn:not(.btn-primary) { display: none; }
      .section { padding: 46px 0; }
    }
  </style>
</head>
<body>
  <div class="landing">
    <div class="wrap">
      <header class="land-nav">
        <a class="brand" href="index.html" aria-label="ResQCoord home">
          <span class="brand-mark">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z"/>
              <path d="M12 7v6M9 10h6"/>
            </svg>
          </span>
          <span class="brand-text">
            <span class="brand-name">ResQ<em>Coord</em></span>
            <span class="brand-sub">Command Center</span>
          </span>
        </a>
        <nav class="land-links" aria-label="Primary">
          <a href="#portals">Portals</a>
          <a href="#capabilities">Capabilities</a>
          <a href="#start">Get started</a>
          <a href="docs/STEP-BY-STEP.md">Documentation</a>
        </nav>
        <div class="actions">
          <a class="btn btn-ghost btn-sm" href="admin/login.html">Admin sign in</a>
          <a class="btn btn-primary btn-sm" href="user/login.html">Responder sign in</a>
        </div>
      </header>

      <section class="hero">
        <div>
          <div class="eyebrow">
            <span class="pulse-dot"></span>
            Provincial Rescue Coordination Office
          </div>
          <h1>One command center.<br>Every responder.<br><em>Every second.</em></h1>
          <p class="lead">
            ResQCoord brings live GPS tracking, tactical mapping, route planning, incident
            reporting and mission check-ins into a single browser-based command center —
            with a dedicated responder portal and a separate admin portal.
          </p>
          <div class="cta">
            <a class="btn btn-primary" href="user/login.html">
              Open responder portal
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
            <a class="btn" href="admin/login.html">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>
              Admin command center
            </a>
          </div>
          <div class="meta">
            <span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              Live GPS + tracking
            </span>
            <span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 6 9-3 9 3v12l-9 3-9-3Z"/><path d="M3 6l9 3 9-3M12 9v12"/></svg>
              OSM mapping + routes
            </span>
            <span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5"/></svg>
              Local database
            </span>
          </div>
        </div>

        <div class="tac" aria-label="Live tactical map preview">
          <div class="tac-head">
            <span>Mt. Lantin operational area</span>
            <span class="live"><span class="pulse-dot red" style="width:5px;height:5px"></span> LIVE</span>
          </div>
          <div class="tac-map">
            <div class="tac-grid"></div>
            <svg viewBox="0 0 460 396" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="ridge" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stop-color="#1c3a3a" stop-opacity=".8"/>
                  <stop offset="1" stop-color="#0d1a27" stop-opacity=".1"/>
                </linearGradient>
                <linearGradient id="river" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stop-color="#46b8ff" stop-opacity=".5"/>
                  <stop offset="1" stop-color="#46b8ff" stop-opacity=".05"/>
                </linearGradient>
              </defs>
              <path d="M-20 300 L70 250 L120 268 L180 190 L250 210 L310 130 L380 160 L470 80 L470 420 L-20 420Z" fill="url(#ridge)"/>
              <path d="M-10 336 C60 300, 95 325, 130 300 S210 250, 250 262 S330 240, 360 220 S420 210, 470 180" fill="none" stroke="url(#river)" stroke-width="2"/>
              <path d="M-10 120 C50 130, 90 100, 140 118 S230 90, 290 105 S380 70, 470 92" fill="none" stroke="#243d52" stroke-width="1" stroke-dasharray="4 6"/>
              <path d="M-10 220 C60 210, 100 240, 150 220 S240 190, 300 205 S390 180, 470 200" fill="none" stroke="#243d52" stroke-width="1" stroke-dasharray="4 6"/>
              <path d="M150 30 C165 90, 150 140, 175 190 S190 280, 175 380" fill="none" stroke="#2a475c" stroke-width="1.4" stroke-dasharray="3 7"/>
              <path d="M300 20 C310 80, 295 130, 315 180 S305 270, 320 380" fill="none" stroke="#2a475c" stroke-width="1.4" stroke-dasharray="3 7"/>
              <path d="M175 120 L250 210 L310 130 L380 160" fill="none" stroke="#46b8ff" stroke-width="2.4" stroke-opacity=".85" stroke-dasharray="6 5"/>
              <circle cx="175" cy="120" r="4" fill="#3ddc97"/>
              <circle cx="380" cy="160" r="5" fill="#46b8ff" fill-opacity=".2" stroke="#46b8ff" stroke-width="1.6"/>
            </svg>
            <span class="tac-tag" style="left: 12%; top: 15%;">SECTOR A</span>
            <span class="tac-tag" style="right: 9%; top: 26%;">SECTOR B</span>
            <span class="tac-tag" style="left: 24%; bottom: 16%;">SECTOR C</span>
            <div class="tac-marker green" style="left: 46%; top: 40%;" title="Team Alpha"><span>TA</span></div>
            <span class="tac-tag" style="left: calc(46% + 20px); top: 47%;">Team Alpha</span>
            <div class="tac-marker amber" style="left: 66%; top: 24%;" title="Team Bravo"><span>TB</span></div>
            <span class="tac-tag" style="left: calc(66% + 20px); top: 31%;">Team Bravo</span>
            <div class="tac-marker red" style="left: 31%; top: 68%;" title="SOS — Sector C"><span>SOS</span></div>
            <span class="tac-tag" style="left: calc(31% + 20px); top: 75%; color:#ff8f9a; border-color:#5c2a33;">SOS · Sector C</span>
            <div class="tac-marker blue" style="right: 12%; bottom: 15%;" title="Air Unit 2"><span>AU2</span></div>
            <div class="float-card one">
              <div class="fc-k">Deployed personnel</div>
              <div class="fc-v">47 <small>+8 teams</small></div>
              <div class="fc-d">7 of 8 reporting · 1 overdue</div>
              <div class="bar"><i style="width: 87%"></i></div>
            </div>
            <div class="float-card two">
              <div class="fc-k">Next check-in</div>
              <div class="fc-v" style="color: var(--accent)">14:45</div>
              <div class="fc-d">Team Alpha · 13 min</div>
            </div>
          </div>
          <div class="tac-legend">
            <span><i style="background:var(--accent)"></i> On site</span>
            <span><i style="background:var(--warn)"></i> En route</span>
            <span><i style="background:var(--accent-2)"></i> Standby</span>
            <span><i style="background:var(--danger)"></i> SOS</span>
          </div>
        </div>
      </section>

      <section class="section" id="portals">
        <div class="section-head">
          <div class="kicker">Two portals · one system</div>
          <h2>Separate dashboards for the field and the command post</h2>
          <p>
            Responders get a focused field view. Commanders get full situational awareness.
            Both share the same local database, so check-ins, incidents and live positions stay in sync.
          </p>
        </div>
        <div class="portals">
          <article class="portal-card user">
            <span class="portal-badge">User portal · Responder</span>
            <h3>Field Dashboard</h3>
            <p>Everything a responder needs on the ground, without command-level clutter.</p>
            <ul class="portal-list">
              <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="m20 6-11 11-5-5"/></svg> Live GPS map with your position and route</li>
              <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="m20 6-11 11-5-5"/></svg> Check-in, status updates and SOS</li>
              <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="m20 6-11 11-5-5"/></svg> Incident reports with GPS lock</li>
              <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="m20 6-11 11-5-5"/></svg> Mission brief, timeline and checkpoints</li>
              <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="m20 6-11 11-5-5"/></svg> Secure messages from command</li>
            </ul>
            <div class="portal-actions">
              <a class="btn btn-primary" href="user/login.html">Sign in as responder</a>
              <a class="btn" href="user/register.html">Create account</a>
            </div>
            <div class="portal-cred">
              Demo: <b>j.reyes@resqcoord.ph</b> / <b>User@123</b>
            </div>
          </article>

          <article class="portal-card admin">
            <span class="portal-badge">Admin portal · Command</span>
            <h3>Command Dashboard</h3>
            <p>Full deployment monitoring, team assignment and incident command.</p>
            <ul class="portal-list">
              <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="m20 6-11 11-5-5"/></svg> Live map of every team and unit</li>
              <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="m20 6-11 11-5-5"/></svg> Missions, personnel and resources</li>
              <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="m20 6-11 11-5-5"/></svg> Incident triage with acknowledge / resolve</li>
              <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="m20 6-11 11-5-5"/></svg> Broadcasts to teams and individuals</li>
              <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="m20 6-11 11-5-5"/></svg> User management and reports</li>
            </ul>
            <div class="portal-actions">
              <a class="btn btn-primary" href="admin/login.html">Sign in as admin</a>
              <a class="btn" href="admin/register.html">Create admin</a>
            </div>
            <div class="portal-cred">
              Demo: <b>admin@resqcoord.ph</b> / <b>Admin@123</b>
            </div>
          </article>
        </div>
      </section>

      <section class="section" id="capabilities">
        <div class="section-head">
          <div class="kicker">Built for the field</div>
          <h2>Fully functional, in the browser</h2>
          <p>No Python, no build step, no framework. HTML, CSS and JavaScript with a local database.</p>
        </div>
        <div class="features">
          <div class="feature">
            <div class="fi">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>
            </div>
            <h4>Live GPS tracking</h4>
            <p>Use the browser Geolocation API for a real fix, or the built-in patrol simulation for a working demo anywhere.</p>
          </div>
          <div class="feature">
            <div class="fi blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21 3 6"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>
            </div>
            <h4>Mapping + routing</h4>
            <p>OpenStreetMap, satellite and terrain layers with OSRM turn-by-turn routing and a graceful offline fallback.</p>
          </div>
          <div class="feature">
            <div class="fi amber">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <h4>Incidents + SOS</h4>
            <p>Report from the field with GPS lock. Critical reports and SOS alerts surface instantly in the admin portal.</p>
          </div>
          <div class="feature">
            <div class="fi purple">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5"/><path d="M3 12c0 1.7 4 3 9 3s9-1.3 9-3"/></svg>
            </div>
            <h4>Real local database</h4>
            <p>IndexedDB storage for users, teams, missions, incidents, messages and position history — with a localStorage fallback.</p>
          </div>
        </div>
      </section>

      <section class="section" id="start">
        <div class="section-head">
          <div class="kicker">Start here</div>
          <h2>From zero to a working command center</h2>
          <p>The complete build guide, file map and every line of code are in the documentation folder.</p>
        </div>
        <div class="steps">
          <div class="step">
            <div class="n">01</div>
            <h4>Run a local server</h4>
            <p>Open the folder in VS Code, run <span class="mono">node server.js</span> or use Live Server.</p>
          </div>
          <div class="step">
            <div class="n">02</div>
            <h4>Register or sign in</h4>
            <p>Create a responder or admin account, or use one of the demo accounts.</p>
          </div>
          <div class="step">
            <div class="n">03</div>
            <h4>Go live on the map</h4>
            <p>Start GPS or demo movement, plan a route, and watch markers update.</p>
          </div>
          <div class="step">
            <div class="n">04</div>
            <h4>Command the field</h4>
            <p>Open the admin dashboard in another tab to monitor teams, incidents and alerts.</p>
          </div>
        </div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:22px">
          <a class="btn btn-primary" href="docs/STEP-BY-STEP.md">Read the step-by-step guide</a>
          <a class="btn" href="docs/ALL-CODE.md">View all source code</a>
          <a class="btn btn-ghost" href="README.md">README</a>
        </div>
      </section>

      <footer class="foot">
        <div class="brand" style="gap:9px">
          <span class="brand-mark" style="width:28px;height:28px;border-radius:8px">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z"/><path d="M12 7v6M9 10h6"/></svg>
          </span>
          <span style="font-size:12px;color:var(--muted)">ResQCoord · Provincial Rescue Coordination Office</span>
        </div>
        <div class="links">
          <a href="user/login.html">Responder portal</a>
          <a href="admin/login.html">Admin portal</a>
          <a href="docs/STEP-BY-STEP.md">Documentation</a>
          <a href="README.md">README</a>
        </div>
        <div>Demo build · All data stays in your browser</div>
      </footer>
    </div>
  </div>
</body>
</html>
````

---

<a id="file-2"></a>

## 2. start.bat

**Purpose:** Windows one-click launcher  
**Size:** 670 bytes · **Lines:** 31 · **SHA-256:** `CEAD119B7A23FD6014825DC5EB5A1D1A380C566CD820C85A6C58A8CED6AFD68C`

````bat
@echo off
setlocal
title ResQCoord - Local Server
cd /d "%~dp0"

set "PORT=%~1"
if "%PORT%"=="" set "PORT=3000"

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo  Node.js was not found on this computer.
  echo  Install the LTS version from https://nodejs.org, then run start.bat again.
  echo.
  pause
  exit /b 1
)

echo.
echo  Starting ResQCoord on http://localhost:%PORT%
echo  Keep this window open while you use the app.
echo  Press Ctrl+C to stop the server.
echo.

start "" powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 2; Start-Process 'http://localhost:%PORT%'"

node server.js %PORT%

echo.
echo  The server has stopped.
pause
````

---

<a id="file-3"></a>

## 3. server.js

**Purpose:** Zero-dependency static server  
**Size:** 3837 bytes · **Lines:** 113 · **SHA-256:** `117776AC153B87DE4EEC6C52296113AE7F9FFDD8FEB18AF082FAE755C5FDC9A2`

````js
/* ============================================================
   ResQCoord — server.js
   Zero-dependency static file server for local development.
   Usage:  node server.js            (http://localhost:3000)
           node server.js 8080       (custom port)
   ============================================================ */
"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const ROOT = __dirname;
const PORT = Number(process.argv[2] || process.env.PORT || 3000);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".htm": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".txt": "text/plain; charset=utf-8",
  ".map": "application/json; charset=utf-8",
};

const send = (res, status, body, headers = {}) => {
  res.writeHead(status, {
    "Cache-Control": "no-cache, no-store, must-revalidate",
    "Access-Control-Allow-Origin": "*",
    ...headers,
  });
  res.end(body);
};

const server = http.createServer((req, res) => {
  let pathname;
  try {
    pathname = decodeURIComponent(url.parse(req.url).pathname || "/");
  } catch {
    return send(res, 400, "Bad request", { "Content-Type": "text/plain; charset=utf-8" });
  }

  if (pathname === "/") pathname = "/index.html";
  if (pathname.endsWith("/")) pathname += "index.html";

  // Resolve inside ROOT only (prevents path traversal).
  const filePath = path.normalize(path.join(ROOT, pathname));
  const relative = path.relative(ROOT, filePath);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    return send(res, 403, "Forbidden", { "Content-Type": "text/plain; charset=utf-8" });
  }

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      const notFound = path.join(ROOT, "404.html");
      if (fs.existsSync(notFound)) {
        return fs.readFile(notFound, (readErr, data) => {
          if (readErr) return send(res, 404, "Not found");
          send(res, 404, data, { "Content-Type": MIME[".html"] });
        });
      }
      return send(res, 404, `Not found: ${pathname}`, { "Content-Type": "text/plain; charset=utf-8" });
    }

    const ext = path.extname(filePath).toLowerCase();
    const type = MIME[ext] || "application/octet-stream";
    res.writeHead(200, {
      "Content-Type": type,
      "Content-Length": stat.size,
      "Cache-Control": "no-cache",
      "Access-Control-Allow-Origin": "*",
    });
    const stream = fs.createReadStream(filePath);
    stream.on("error", () => send(res, 500, "Unable to read file"));
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log("");
  console.log("  ResQCoord command center is running");
  console.log(`  Local URL:   http://localhost:${PORT}`);
  console.log(`  Landing:     http://localhost:${PORT}/index.html`);
  console.log(`  Responder:   http://localhost:${PORT}/user/login.html`);
  console.log(`  Admin:       http://localhost:${PORT}/admin/login.html`);
  console.log("");
  console.log("  Demo accounts");
  console.log("  Admin:       admin@resqcoord.ph / Admin@123");
  console.log("  Responder:   j.reyes@resqcoord.ph / User@123");
  console.log("");
  console.log("  Press Ctrl+C to stop the server.");
  console.log("");
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`\n  Port ${PORT} is already in use. Try: node server.js ${PORT + 1}\n`);
  } else {
    console.error("\n  Server error:", err.message, "\n");
  }
  process.exitCode = 1;
});
````

---

<a id="file-4"></a>

## 4. admin/login.html

**Purpose:** Admin sign-in  
**Size:** 9340 bytes · **Lines:** 193 · **SHA-256:** `5A1B04A691CECAF82A523F651CDA47A4A5F5EB7392F3B3CBA1CA455B1D29A2A6`

````html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Sign In — ResQCoord Command Center</title>
  <link rel="icon" href="../assets/img/logo.svg" type="image/svg+xml">
  <link rel="stylesheet" href="../assets/css/base.css">
  <link rel="stylesheet" href="../assets/css/app.css">
  <style>
    .auth-page {
      background:
        radial-gradient(900px 500px at 8% 0%, rgba(167, 139, 250, 0.09), transparent 60%),
        radial-gradient(700px 500px at 90% 100%, rgba(70, 184, 255, 0.06), transparent 60%),
        var(--bg);
    }
    .auth-brand::before {
      background-image:
        linear-gradient(rgba(167, 139, 250, 0.06) 1px, transparent 1px),
        linear-gradient(90deg, rgba(167, 139, 250, 0.06) 1px, transparent 1px);
    }
    .auth-brand::after { background: radial-gradient(circle, rgba(167, 139, 250, 0.13), transparent 65%); }
    .auth-hero .eyebrow { color: var(--purple); }
    .auth-hero h1 span { color: var(--purple); }
    .auth-feature svg { color: var(--purple); }
    .brand-mark {
      background:
        radial-gradient(circle at 28% 22%, rgba(255, 255, 255, 0.32), transparent 42%),
        linear-gradient(145deg, #a78bfa 0%, #6d4fd0 55%, #3c2a78 100%);
      box-shadow: 0 6px 18px -8px rgba(167, 139, 250, 0.9);
      color: #170b33;
    }
    .brand-name em { color: var(--purple); }
    .auth-card .btn-primary {
      background: linear-gradient(180deg, #b49cff, #8c6cf0);
      border-color: #b49cff;
      color: #170b33;
      box-shadow: 0 10px 24px -14px rgba(167, 139, 250, 0.95);
    }
    .auth-card .btn-primary:hover {
      background: linear-gradient(180deg, #c4b1ff, #9a7dfa);
      border-color: #c4b1ff;
    }
    .auth-card .input:focus { border-color: rgba(167, 139, 250, 0.65); box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.12); }
    .auth-kicker .badge-purple { color: var(--purple); }
    .auth-stat .v em { color: var(--purple); }
  </style>
</head>
<body class="auth-page" data-portal="admin" data-page="login">
  <section class="auth-brand">
    <a class="brand" href="../index.html">
      <span class="brand-mark">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg>
      </span>
      <span class="brand-text">
        <span class="brand-name">ResQ<em>Coord</em></span>
        <span class="brand-sub">Command Center</span>
      </span>
    </a>

    <div class="auth-hero">
      <div class="eyebrow"><span class="pulse-dot" style="background:var(--purple)"></span> Admin portal · Command only</div>
      <h1>Command the field.<br>See every team.<br><span>In real time.</span></h1>
      <p>
        The admin dashboard gives duty commanders a live operational picture:
        deployed personnel, team positions, active missions, open incidents and
        SOS alerts — all on one map.
      </p>
      <div class="auth-stats">
        <div class="auth-stat">
          <div class="v">47<em>deployed</em></div>
          <div class="l">Personnel in field</div>
        </div>
        <div class="auth-stat">
          <div class="v">3<em>active</em></div>
          <div class="l">Missions</div>
        </div>
        <div class="auth-stat">
          <div class="v">5<em>open</em></div>
          <div class="l">Incidents</div>
        </div>
      </div>
      <div class="auth-features">
        <div class="auth-feature">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21 3 6"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>
          Live deployment map
        </div>
        <div class="auth-feature">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          Personnel and resource control
        </div>
        <div class="auth-feature">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          Incident triage and SOS
        </div>
      </div>
    </div>

    <div class="auth-footer">
      <span>ResQCoord 2.4.1</span>
      <span>Admin scope · Secure channel</span>
      <span>© 2026 PRCO</span>
    </div>
  </section>

  <section class="auth-panel">
    <a class="auth-back" href="../index.html">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
      Back to overview
    </a>

    <div class="auth-card">
      <div class="brand">
        <span class="brand-mark">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg>
        </span>
        <span class="brand-text">
          <span class="brand-name">ResQ<em>Coord</em></span>
          <span class="brand-sub">Admin Command</span>
        </span>
      </div>

      <div class="portal-switch" role="tablist" aria-label="Portal">
        <a class="user" href="../user/login.html">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Responder
        </a>
        <a class="active admin" href="login.html">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>
          Admin
        </a>
      </div>

      <div class="auth-kicker">
        <span class="badge badge-purple">Admin only</span>
        <span class="tiny muted-2">Duty commander access</span>
      </div>
      <h2>Sign in to the command center</h2>
      <p class="lead">Admin credentials are required. Responder accounts cannot access this portal.</p>

      <div id="sessionNotice" class="demo-box" style="display:none;margin:0 0 16px"></div>

      <form id="authForm" class="auth-form" novalidate autocomplete="on">
        <div id="formError" class="field-error" style="display:none" role="alert"></div>

        <div class="field">
          <label for="email">Admin email</label>
          <input class="input" id="email" name="email" type="email" inputmode="email" autocomplete="username" placeholder="admin@resqcoord.ph" required>
        </div>

        <div class="field">
          <label for="password">Password</label>
          <div class="pw-wrap">
            <input class="input" id="password" name="password" type="password" autocomplete="current-password" placeholder="Enter your password" required>
            <button type="button" class="pw-toggle" data-toggle-pw="password" aria-label="Show password">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
          </div>
          <div class="row between">
            <span class="field-hint">Role-checked · admin scope only</span>
            <a id="forgotLink" href="#" class="small">Forgot password?</a>
          </div>
        </div>

        <button class="btn btn-primary btn-block" id="submitBtn" type="submit">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg>
          Enter command center
        </button>
      </form>

      <p class="auth-alt">Need an admin account? <a href="register.html">Register with an access code</a></p>
      <p class="auth-alt" style="margin-top:8px">Field responder? <a href="../user/login.html">Use the responder portal</a></p>

      <div class="demo-box">
        <div class="demo-title">
          <span>Demo admin account</span>
          <button type="button" class="btn btn-sm" data-fill="admin" style="height:24px;font-size:10px">Fill in</button>
        </div>
        <div class="demo-creds">
          <span>Email&nbsp;&nbsp;&nbsp; <b>admin@resqcoord.ph</b></span>
          <span>Password <b>Admin@123</b></span>
          <span>Admin code <b>RESQ-ADMIN-2026</b></span>
        </div>
      </div>
    </div>
  </section>

  <script src="../assets/js/util.js"></script>
  <script src="../assets/js/db.js"></script>
  <script src="../assets/js/auth.js"></script>
  <script src="../assets/js/auth-page.js"></script>
</body>
</html>
````

---

<a id="file-5"></a>

## 5. admin/register.html

**Purpose:** Admin registration with access code  
**Size:** 10294 bytes · **Lines:** 209 · **SHA-256:** `BFB22C7B128B69BF2349448D2D84226EF1975DF0BBCB658D4E416D82B2DF32E8`

````html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Registration — ResQCoord Command Center</title>
  <link rel="icon" href="../assets/img/logo.svg" type="image/svg+xml">
  <link rel="stylesheet" href="../assets/css/base.css">
  <link rel="stylesheet" href="../assets/css/app.css">
  <style>
    .auth-page {
      background:
        radial-gradient(900px 500px at 8% 0%, rgba(167, 139, 250, 0.09), transparent 60%),
        radial-gradient(700px 500px at 90% 100%, rgba(70, 184, 255, 0.06), transparent 60%),
        var(--bg);
    }
    .auth-brand::before {
      background-image:
        linear-gradient(rgba(167, 139, 250, 0.06) 1px, transparent 1px),
        linear-gradient(90deg, rgba(167, 139, 250, 0.06) 1px, transparent 1px);
    }
    .auth-brand::after { background: radial-gradient(circle, rgba(167, 139, 250, 0.13), transparent 65%); }
    .auth-hero .eyebrow { color: var(--purple); }
    .auth-hero h1 span { color: var(--purple); }
    .auth-feature svg { color: var(--purple); }
    .brand-mark {
      background:
        radial-gradient(circle at 28% 22%, rgba(255, 255, 255, 0.32), transparent 42%),
        linear-gradient(145deg, #a78bfa 0%, #6d4fd0 55%, #3c2a78 100%);
      box-shadow: 0 6px 18px -8px rgba(167, 139, 250, 0.9);
      color: #170b33;
    }
    .brand-name em { color: var(--purple); }
    .auth-card .btn-primary {
      background: linear-gradient(180deg, #b49cff, #8c6cf0);
      border-color: #b49cff;
      color: #170b33;
      box-shadow: 0 10px 24px -14px rgba(167, 139, 250, 0.95);
    }
    .auth-card .btn-primary:hover {
      background: linear-gradient(180deg, #c4b1ff, #9a7dfa);
      border-color: #c4b1ff;
    }
    .auth-card .input:focus { border-color: rgba(167, 139, 250, 0.65); box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.12); }
    .auth-stat .v em { color: var(--purple); }
    .access-code {
      font-family: var(--mono);
      letter-spacing: 1px;
      background: rgba(167, 139, 250, 0.1);
      border: 1px dashed rgba(167, 139, 250, 0.35);
      color: var(--purple);
      border-radius: 7px;
      padding: 2px 7px;
      font-size: 10.5px;
    }
  </style>
</head>
<body class="auth-page" data-portal="admin" data-page="register">
  <section class="auth-brand">
    <a class="brand" href="../index.html">
      <span class="brand-mark">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg>
      </span>
      <span class="brand-text">
        <span class="brand-name">ResQ<em>Coord</em></span>
        <span class="brand-sub">Admin Command</span>
      </span>
    </a>

    <div class="auth-hero">
      <div class="eyebrow"><span class="pulse-dot" style="background:var(--purple)"></span> Admin onboarding · Verified access</div>
      <h1>Take command.<br>Run the mission.<br><span>Protect the team.</span></h1>
      <p>
        Admin accounts are created with a command access code. Once verified you get the full
        deployment picture: live positions, missions, personnel, incidents, broadcasts and reports.
      </p>
      <div class="auth-features">
        <div class="auth-feature">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 6 9-3 9 3v12l-9 3-9-3Z"/><path d="M3 6l9 3 9-3M12 9v12"/></svg>
          Operational live map
        </div>
        <div class="auth-feature">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"/></svg>
          Broadcast to every team
        </div>
        <div class="auth-feature">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M16 13H8M16 17H8M10 9H8"/></svg>
          Reports and audit trail
        </div>
      </div>
    </div>

    <div class="auth-footer">
      <span>ResQCoord 2.4.1</span>
      <span>Admin scope · Verified accounts</span>
      <span>© 2026 PRCO</span>
    </div>
  </section>

  <section class="auth-panel">
    <a class="auth-back" href="login.html">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
      Back to admin sign in
    </a>

    <div class="auth-card">
      <div class="brand">
        <span class="brand-mark">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg>
        </span>
        <span class="brand-text">
          <span class="brand-name">ResQ<em>Coord</em></span>
          <span class="brand-sub">Admin Command</span>
        </span>
      </div>

      <div class="portal-switch" role="tablist" aria-label="Portal">
        <a class="user" href="../user/register.html">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Responder
        </a>
        <a class="active admin" href="register.html">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>
          Admin
        </a>
      </div>

      <div class="auth-kicker">
        <span class="badge badge-purple">Admin only</span>
        <span class="tiny muted-2">Access code required</span>
      </div>
      <h2>Create a command account</h2>
      <p class="lead">Register a duty commander or coordination officer account.</p>

      <form id="authForm" class="auth-form" novalidate>
        <div id="formError" class="field-error" style="display:none" role="alert"></div>

        <div class="field">
          <label for="name">Full name</label>
          <input class="input" id="name" name="name" type="text" autocomplete="name" placeholder="e.g. Carl R. Miller" required>
        </div>

        <div class="field">
          <label for="org">Organization</label>
          <input class="input" id="org" name="org" type="text" autocomplete="organization" placeholder="Provincial Rescue Coordination Office" required>
        </div>

        <div class="field">
          <label for="email">Admin email</label>
          <input class="input" id="email" name="email" type="email" inputmode="email" autocomplete="username" placeholder="admin@resqcoord.ph" required>
        </div>

        <div class="form-grid cols-2">
          <div class="field">
            <label for="password">Password</label>
            <div class="pw-wrap">
              <input class="input" id="password" name="password" type="password" autocomplete="new-password" placeholder="At least 8 characters" required>
              <button type="button" class="pw-toggle" data-toggle-pw="password" aria-label="Show password">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
          </div>
          <div class="field">
            <label for="confirm">Confirm password</label>
            <div class="pw-wrap">
              <input class="input" id="confirm" name="confirm" type="password" autocomplete="new-password" placeholder="Repeat password" required>
              <button type="button" class="pw-toggle" data-toggle-pw="confirm" aria-label="Show password">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
          </div>
        </div>

        <div>
          <div class="strength" id="strength" data-score="0" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
          <div class="field-hint" id="strengthLabel" style="margin-top:6px">At least 8 characters with letters and a number</div>
        </div>

        <div class="field">
          <label for="adminCode">Command access code</label>
          <input class="input" id="adminCode" name="adminCode" type="text" autocomplete="off" placeholder="RESQ-XXXX-XXXX" style="font-family:var(--mono);letter-spacing:1px" required>
          <span class="field-hint">Demo code: <span class="access-code">RESQ-ADMIN-2026</span></span>
        </div>

        <button class="btn btn-primary btn-block" id="submitBtn" type="submit">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/></svg>
          Create admin account
        </button>
      </form>

      <p class="auth-alt">Already have an account? <a href="login.html">Sign in as admin</a></p>
      <p class="auth-alt" style="margin-top:8px">Field responder? <a href="../user/register.html">Register in the user portal</a></p>

      <div class="demo-box">
        <div class="demo-title"><span>Demo access</span></div>
        <div class="demo-creds">
          <span>Admin <b>admin@resqcoord.ph</b> / <b>Admin@123</b></span>
          <span>Code&nbsp;&nbsp; <b>RESQ-ADMIN-2026</b></span>
        </div>
      </div>
    </div>
  </section>

  <script src="../assets/js/util.js"></script>
  <script src="../assets/js/db.js"></script>
  <script src="../assets/js/auth.js"></script>
  <script src="../assets/js/auth-page.js"></script>
</body>
</html>
````

---

<a id="file-6"></a>

## 6. admin/dashboard.html

**Purpose:** Admin command dashboard markup  
**Size:** 61874 bytes · **Lines:** 1076 · **SHA-256:** `D6F7E7AC50C8A7911FF186B8339B004670599A9E0DD326991F80125B1006A90B`

````html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Command Dashboard — ResQCoord</title>
  <link rel="icon" href="../assets/img/logo.svg" type="image/svg+xml">
  <link rel="stylesheet" href="../assets/vendor/leaflet/leaflet.css">
  <link rel="stylesheet" href="../assets/css/base.css">
  <link rel="stylesheet" href="../assets/css/app.css">
  <style>
    .leaflet-tile-pane { filter: brightness(0.7) saturate(0.72) contrast(1.12); }
    .admin-map-layout {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 340px;
      gap: 16px;
      align-items: start;
    }
    .admin-side-stack { display: flex; flex-direction: column; gap: 14px; }
    .team-card {
      width: 100%;
      text-align: left;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      border-bottom: 1px solid var(--line-soft);
      border-left: 2px solid transparent;
      transition: 0.14s;
      cursor: pointer;
    }
    .team-card:last-child { border-bottom: 0; }
    .team-card:hover { background: rgba(21, 36, 56, 0.5); }
    .team-card.selected {
      background: rgba(167, 139, 250, 0.08);
      border-left-color: var(--purple);
    }
    .team-card .tc-body { flex: 1; min-width: 0; }
    .team-card .tc-name { font-size: 12px; font-weight: 650; color: var(--text); }
    .team-card .tc-sub { font-size: 10px; color: var(--muted-2); margin-top: 2px; }
    .team-card .tc-right { text-align: right; flex: 0 0 auto; }
    .team-card .tc-right b { display: block; font-size: 10.5px; color: var(--muted); }
    .team-card .tc-right span { font-size: 9px; color: var(--muted-2); }
    .status-dot {
      width: 8px; height: 8px; border-radius: 50%;
      display: inline-block; margin-right: 5px;
      background: var(--muted-2);
    }
    .status-dot.onsite { background: var(--accent); }
    .status-dot.enroute { background: var(--warn); }
    .status-dot.standby { background: var(--accent-2); }
    .status-dot.sos { background: var(--danger); animation: pulseRingRed 1.6s infinite; }
    .mini-stat-row {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 10px;
    }
    .mini-stat {
      border: 1px solid var(--line);
      border-radius: 10px;
      background: #0a1522;
      padding: 12px;
    }
    .mini-stat .ms-label {
      font-size: 9px; letter-spacing: 1.1px; text-transform: uppercase;
      color: var(--muted-2); font-weight: 700;
    }
    .mini-stat .ms-value {
      font-size: 22px; font-weight: 720; letter-spacing: -0.7px; margin-top: 4px;
    }
    .mini-stat .ms-foot { font-size: 10px; color: var(--muted-2); margin-top: 2px; }
    .severity-pill {
      display: inline-flex; align-items: center; gap: 5px;
      font-size: 9px; font-weight: 800; letter-spacing: 0.7px;
      text-transform: uppercase; border-radius: 5px; padding: 3px 6px;
    }
    .severity-pill.Low { background: var(--accent-dim); color: var(--accent); }
    .severity-pill.Medium { background: var(--warn-dim); color: var(--warn); }
    .severity-pill.High { background: rgba(255, 158, 92, 0.12); color: #ff9e5c; }
    .severity-pill.Critical { background: var(--danger-dim); color: var(--danger); }
    .admin-detail-list { display: flex; flex-direction: column; }
    .admin-detail-list .kv { font-size: 11px; }
    @media (max-width: 1180px) {
      .admin-map-layout { grid-template-columns: 1fr; }
    }
    @media (max-width: 720px) {
      .mini-stat-row { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="app admin-scope" id="app">
    <!-- ==================== SIDEBAR ==================== -->
    <aside class="sidebar" aria-label="Administrator navigation">
      <div class="sidebar-head">
        <a class="brand" href="../index.html">
          <span class="brand-mark">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z"/><path d="M12 7v6M9 10h6"/>
            </svg>
          </span>
          <span class="brand-text">
            <span class="brand-name">ResQ<em>Coord</em></span>
            <span class="brand-sub">Command Center</span>
          </span>
        </a>
        <div class="sidebar-scope admin"><span class="dot"></span> Admin view · Command</div>
      </div>

      <nav class="side-nav" aria-label="Command sections">
        <div class="nav-label">Operations</div>
        <button class="nav-item active" data-view="overview">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
          Overview
        </button>
        <button class="nav-item" data-view="map">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21 3 6"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>
          Live Map
          <span class="count neutral" id="mapTeamCount">0</span>
        </button>
        <button class="nav-item" data-view="missions">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.1V12a10 10 0 1 1-5.9-9.1"/><path d="m9 11 3 3L22 4"/></svg>
          Missions
        </button>
        <button class="nav-item" data-view="personnel">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          Personnel
        </button>
        <button class="nav-item" data-view="incidents">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          Incidents
          <span class="count" id="incidentNavCount" style="display:none">0</span>
        </button>
        <button class="nav-item" data-view="messages">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"/></svg>
          Broadcast
        </button>

        <div class="nav-label">Insight</div>
        <button class="nav-item" data-view="reports">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 5-5"/></svg>
          Reports
        </button>
        <button class="nav-item" data-view="audit">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M16 13H8M16 17H8M10 9H8"/></svg>
          Activity Log
        </button>
        <button class="nav-item" data-view="settings">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/></svg>
          Settings
        </button>

        <div class="nav-label">Quick actions</div>
        <button class="nav-item" data-action="newMission">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          New mission
        </button>
        <button class="nav-item" data-action="broadcast">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4.9 19.1a10 10 0 0 1 0-14.2"/><path d="M7.8 16.2a6 6 0 0 1 0-8.4"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8a6 6 0 0 1 0 8.4"/><path d="M19.1 4.9a10 10 0 0 1 0 14.2"/></svg>
          Broadcast
        </button>
        <button class="nav-item" data-action="addPersonnel">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/></svg>
          Add responder
        </button>
      </nav>

      <div class="sidebar-foot">
        <div class="side-user" id="sideUser" role="button" tabindex="0">
          <div class="avatar" id="sidebarAvatar" style="background:#251d3d;border-color:#45336b;color:var(--purple)">CM</div>
          <div class="meta">
            <div class="name" id="sidebarName">Carl R. Miller</div>
            <div class="role" id="sidebarRole">Administrator · Duty Commander</div>
          </div>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </div>
      </div>
    </aside>

    <!-- ==================== MAIN ==================== -->
    <div class="main-wrap">
      <div class="offline-banner" id="offlineBanner">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        You are offline. Map tiles and road routing need a connection — the local command database and live team tracking still work.
      </div>

      <header class="topbar">
        <button class="btn-icon mobile-toggle" id="sidebarToggle" aria-label="Open navigation">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
        <div class="crumb">
          <span>Command</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          <b id="crumb">Overview</b>
          <span class="badge badge-purple" style="height:20px;font-size:9px">ADMIN</span>
        </div>
        <div class="topbar-spacer"></div>
        <div class="topbar-status">
          <span class="sync-mini" title="Last database sync">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-2.6-6.3"/><path d="M21 3v6h-6"/></svg>
            <span id="lastSync">Synced just now</span>
          </span>
          <span class="net-status" id="netStatus"><span class="dot"></span> Online</span>
          <div class="topbar-user">
            <div class="meta">
              <div class="name" id="topName">Carl R. Miller</div>
              <div class="role" id="topRole">Duty Commander</div>
            </div>
            <div class="avatar" id="topAvatar" style="background:#251d3d;border-color:#45336b;color:var(--purple)">CM</div>
            <button class="btn-icon" data-action="logout" title="Sign out" aria-label="Sign out">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/></svg>
            </button>
          </div>
        </div>
      </header>

      <main class="main">
        <!-- ==================== OVERVIEW ==================== -->
        <section class="view active" id="view-overview">
          <div class="view-head">
            <div>
              <div class="title-row">
                <h1>Command Overview</h1>
                <span class="badge badge-purple">Administrator</span>
              </div>
              <div class="sub">
                <span>Mt. Lantin operational area</span>
                <span class="sep">·</span>
                <span id="overviewClock">--:-- PHT</span>
                <span class="sep">·</span>
                <span class="row" style="gap:5px"><span class="pulse-dot"></span> Live command sync</span>
              </div>
            </div>
            <div class="view-actions">
              <button class="btn" data-action="broadcast">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.9 19.1a10 10 0 0 1 0-14.2"/><path d="M7.8 16.2a6 6 0 0 1 0-8.4"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8a6 6 0 0 1 0 8.4"/><path d="M19.1 4.9a10 10 0 0 1 0 14.2"/></svg>
                Broadcast
              </button>
              <button class="btn btn-primary" data-action="newMission">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                New mission
              </button>
            </div>
          </div>

          <div class="kpis">
            <div class="kpi">
              <div class="kpi-top">
                <span class="kpi-label">Active missions</span>
                <span class="kpi-icon purple"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.1V12a10 10 0 1 1-5.9-9.1"/><path d="m9 11 3 3L22 4"/></svg></span>
              </div>
              <div class="kpi-value"><span id="kpiActiveMissions">0</span><small>open</small></div>
              <div class="kpi-foot" id="kpiActiveMissionsFoot"><span class="up">—</span> in progress</div>
            </div>
            <div class="kpi">
              <div class="kpi-top">
                <span class="kpi-label">Teams deployed</span>
                <span class="kpi-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></span>
              </div>
              <div class="kpi-value"><span id="kpiTeams">0</span><small>teams</small></div>
              <div class="kpi-foot" id="kpiTeamsFoot"><span class="up">—</span> personnel tracked</div>
            </div>
            <div class="kpi">
              <div class="kpi-top">
                <span class="kpi-label">Open incidents</span>
                <span class="kpi-icon red"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span>
              </div>
              <div class="kpi-value"><span id="kpiIncidents">0</span><small>unresolved</small></div>
              <div class="kpi-foot" id="kpiIncidentsFoot"><span class="warn">—</span> critical priority</div>
            </div>
            <div class="kpi">
              <div class="kpi-top">
                <span class="kpi-label">Personnel on duty</span>
                <span class="kpi-icon blue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>
              </div>
              <div class="kpi-value"><span id="kpiPersonnel">0</span><small>responders</small></div>
              <div class="kpi-foot" id="kpiPersonnelFoot"><span class="up">—</span> active accounts</div>
            </div>
          </div>

          <div class="dash-grid">
            <div class="stack">
              <div class="card map-card">
                <div class="card-head">
                  <h3>All-team live map <span class="badge badge-purple" style="height:20px;font-size:9px">Command view</span></h3>
                  <button class="btn btn-sm btn-ghost" data-view-link="map">Open command map</button>
                </div>
                <div class="map-shell" style="height:380px">
                  <div class="map" id="overviewMap"></div>
                  <div class="map-overlay-head">
                    <span class="map-pill"><span class="live-dot"></span> Live · 2.6 s refresh</span>
                    <span class="map-pill" id="overviewMapBadge">0 teams tracked</span>
                  </div>
                  <div class="map-overlay-foot">
                    <span class="map-coords">16.40370, 120.60120 · <b>Mt. Lantin</b></span>
                    <span class="map-legend">
                      <span><i class="lg-onsite"></i> On site</span>
                      <span><i class="lg-enroute"></i> En route</span>
                      <span><i class="lg-standby"></i> Standby</span>
                      <span><i class="lg-sos"></i> SOS</span>
                    </span>
                  </div>
                </div>
              </div>

              <div class="card">
                <div class="card-head">
                  <h3>Active missions</h3>
                  <span class="hint" id="overviewMissionMeta">—</span>
                </div>
                <div class="table-wrap">
                  <table class="data">
                    <thead>
                      <tr><th>Mission</th><th>Status</th><th>Priority</th><th>Lead / team</th><th>Progress</th><th style="text-align:right">Action</th></tr>
                    </thead>
                    <tbody id="overviewMissionRows"><tr><td colspan="6"><div class="empty">Loading missions…</div></td></tr></tbody>
                  </table>
                </div>
              </div>
            </div>

            <div class="stack">
              <div class="card">
                <div class="card-head">
                  <h3>Command alerts</h3>
                  <span class="badge badge-red" id="alertCount">0</span>
                </div>
                <div class="side-list" id="alertList"><div class="empty">Loading alerts…</div></div>
              </div>

              <div class="card">
                <div class="card-head">
                  <h3>Team status</h3>
                  <button class="btn btn-sm btn-ghost" data-view-link="map">View map</button>
                </div>
                <div id="overviewTeams" class="side-list"><div class="empty">Loading teams…</div></div>
              </div>

              <div class="card">
                <div class="card-head">
                  <h3>Quick command</h3>
                  <span class="hint">Admin tools</span>
                </div>
                <div class="card-body">
                  <div class="quick-grid">
                    <button class="quick-btn" data-action="newMission">
                      <span class="qi purple"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg></span>
                      <span><b>New mission</b><small>Dispatch a team</small></span>
                    </button>
                    <button class="quick-btn" data-action="broadcast">
                      <span class="qi blue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.9 19.1a10 10 0 0 1 0-14.2"/><path d="M7.8 16.2a6 6 0 0 1 0-8.4"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8a6 6 0 0 1 0 8.4"/><path d="M19.1 4.9a10 10 0 0 1 0 14.2"/></svg></span>
                      <span><b>Broadcast</b><small>All teams</small></span>
                    </button>
                    <button class="quick-btn" data-view-link="incidents">
                      <span class="qi amber"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span>
                      <span><b>Incidents</b><small>Triage queue</small></span>
                    </button>
                    <button class="quick-btn" data-view-link="reports">
                      <span class="qi"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 5-5"/></svg></span>
                      <span><b>Reports</b><small>Export CSV</small></span>
                    </button>
                  </div>
                </div>
              </div>

              <div class="card">
                <div class="card-head">
                  <h3>Recent activity</h3>
                  <button class="btn btn-sm btn-ghost" data-view-link="audit">Audit log</button>
                </div>
                <div id="overviewActivity" class="side-list"><div class="empty">Loading activity…</div></div>
              </div>
            </div>
          </div>
        </section>

        <!-- ==================== LIVE MAP ==================== -->
        <section class="view" id="view-map">
          <div class="view-head">
            <div>
              <div class="title-row">
                <h1>Command Map</h1>
                <span class="badge badge-purple">All teams</span>
              </div>
              <div class="sub">
                <span>Mt. Lantin operational area</span>
                <span class="sep">·</span>
                <span id="mapClock">--:-- PHT</span>
                <span class="sep">·</span>
                <span id="mapSelectedLabel">No team selected</span>
              </div>
            </div>
            <div class="view-actions">
              <button class="btn" id="fitTeamsBtn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8V5a2 2 0 0 1 2-2h3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3"/></svg>
                Fit all teams
              </button>
              <button class="btn" id="toggleTrailsBtn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/></svg>
                Trails
              </button>
              <button class="btn btn-primary" data-action="broadcast">Broadcast</button>
            </div>
          </div>

          <div class="admin-map-layout">
            <div class="card map-card">
              <div class="map-shell tall" style="height:640px">
                <div class="map" id="adminMap"></div>
                <div class="map-overlay-head">
                  <span class="map-pill"><span class="live-dot"></span> Live tracking</span>
                  <div class="map-tools">
                    <button class="map-tool active" data-layer="streets">Streets</button>
                    <button class="map-tool" data-layer="satellite">Satellite</button>
                    <button class="map-tool" data-layer="terrain">Terrain</button>
                    <button class="map-tool active" id="sectorsToggle">Sectors</button>
                  </div>
                </div>
                <div class="map-overlay-foot">
                  <span class="map-coords" id="mapCoords">16.40370, 120.60120</span>
                  <span class="map-legend">
                    <span><i class="lg-onsite"></i> On site</span>
                    <span><i class="lg-enroute"></i> En route</span>
                    <span><i class="lg-standby"></i> Standby</span>
                    <span><i class="lg-sos"></i> SOS</span>
                  </span>
                </div>
              </div>
            </div>

            <div class="admin-side-stack">
              <div class="card">
                <div class="card-head">
                  <h3>Deployed teams</h3>
                  <span class="hint" id="mapTeamHint">0 tracked</span>
                </div>
                <div class="card-body" style="padding:11px 12px">
                  <div class="field" style="margin-bottom:8px">
                    <input class="input" id="teamSearch" placeholder="Search team, lead or sector" style="height:33px;font-size:11.5px">
                  </div>
                  <div class="filters">
                    <select class="select" id="teamFilter" aria-label="Filter teams by status">
                      <option value="">All statuses</option>
                      <option value="onsite">On site</option>
                      <option value="enroute">En route</option>
                      <option value="standby">Standby</option>
                      <option value="sos">SOS</option>
                    </select>
                  </div>
                </div>
                <div id="adminTeamList" class="side-list"><div class="empty">Loading teams…</div></div>
              </div>

              <div class="card" id="teamDetailCard">
                <div class="card-head">
                  <h3>Team detail</h3>
                  <span class="badge badge-muted" id="detailStatus">—</span>
                </div>
                <div class="card-body">
                  <div class="profile-strip" style="margin-bottom:12px">
                    <div class="team-avatar purple" id="detailMonogram" style="width:38px;height:38px">—</div>
                    <div class="meta">
                      <div class="n" id="detailName">Select a team</div>
                      <div class="r" id="detailSector">Click a team on the map or list</div>
                    </div>
                  </div>
                  <div class="admin-detail-list">
                    <div class="kv"><span class="k">Lead</span><span class="v" id="detailLead">—</span></div>
                    <div class="kv"><span class="k">Personnel</span><span class="v" id="detailMembers">—</span></div>
                    <div class="kv"><span class="k">Speed</span><span class="v" id="detailSpeed">—</span></div>
                    <div class="kv"><span class="k">Battery</span><span class="v" id="detailBattery">—</span></div>
                    <div class="kv"><span class="k">Last update</span><span class="v" id="detailUpdated">—</span></div>
                    <div class="kv"><span class="k">Coordinates</span><span class="v mono" id="detailCoords">—</span></div>
                  </div>
                  <div class="row wrap" style="margin-top:11px;gap:6px">
                    <button class="btn btn-sm" id="detailFocus">Focus</button>
                    <button class="btn btn-sm btn-ghost" id="detailTrail">Show trail</button>
                    <button class="btn btn-sm btn-ghost" id="detailClearTrail">Clear trail</button>
                    <button class="btn btn-sm btn-danger" id="detailSos">Clear SOS</button>
                  </div>
                  <div class="divider" style="margin:13px 0"></div>
                  <div class="field">
                    <label for="assignTarget">Assign a destination</label>
                    <select class="select" id="assignTarget"></select>
                  </div>
                  <div class="row" style="gap:6px;margin-top:8px">
                    <button class="btn btn-primary btn-sm" id="assignRouteBtn" style="flex:1">Route team</button>
                    <button class="btn btn-sm btn-ghost" id="clearRouteBtn">Clear</button>
                  </div>
                  <div class="field-hint" id="assignResult" style="margin-top:8px">Routes are drawn on the command map.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ==================== MISSIONS ==================== -->
        <section class="view" id="view-missions">
          <div class="view-head">
            <div>
              <div class="title-row">
                <h1>Missions</h1>
                <span class="badge badge-purple" id="missionBadge">0 active</span>
              </div>
              <div class="sub">
                <span>Dispatch, monitor and close operations</span>
                <span class="sep">·</span>
                <span id="missionsClock">--:-- PHT</span>
              </div>
            </div>
            <div class="view-actions">
              <button class="btn" id="exportMissionsBtn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/></svg>
                Export CSV
              </button>
              <button class="btn btn-primary" data-action="newMission">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                New mission
              </button>
            </div>
          </div>

          <div class="mini-stat-row" style="margin-bottom:16px">
            <div class="mini-stat"><div class="ms-label">Active</div><div class="ms-value" id="missionActiveCount">0</div><div class="ms-foot">In progress missions</div></div>
            <div class="mini-stat"><div class="ms-label">Monitoring</div><div class="ms-value" id="missionMonitoringCount">0</div><div class="ms-foot">Watch list</div></div>
            <div class="mini-stat"><div class="ms-label">Completed</div><div class="ms-value" id="missionCompletedCount">0</div><div class="ms-foot">Closed missions</div></div>
          </div>

          <div class="card">
            <div class="card-head">
              <h3>Mission register</h3>
              <div class="filters">
                <input class="input" id="missionSearch" placeholder="Search mission, code or lead">
                <select class="select" id="missionStatusFilter">
                  <option value="">All statuses</option>
                  <option value="In progress">In progress</option>
                  <option value="Monitoring">Monitoring</option>
                  <option value="Completed">Completed</option>
                  <option value="Planned">Planned</option>
                </select>
                <select class="select" id="missionPriorityFilter">
                  <option value="">All priorities</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>
            <div class="table-wrap">
              <table class="data">
                <thead>
                  <tr><th>Mission</th><th>Status</th><th>Priority</th><th>Lead / team</th><th>Progress</th><th>Started</th><th style="text-align:right">Actions</th></tr>
                </thead>
                <tbody id="missionRows"><tr><td colspan="7"><div class="empty">Loading missions…</div></td></tr></tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- ==================== PERSONNEL ==================== -->
        <section class="view" id="view-personnel">
          <div class="view-head">
            <div>
              <div class="title-row">
                <h1>Personnel</h1>
                <span class="badge badge-purple">Accounts & teams</span>
              </div>
              <div class="sub">
                <span>Responder accounts, roles and deployment</span>
                <span class="sep">·</span>
                <span id="personnelClock">--:-- PHT</span>
              </div>
            </div>
            <div class="view-actions">
              <button class="btn" id="exportPersonnelBtn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/></svg>
                Export CSV
              </button>
              <button class="btn btn-primary" data-action="addPersonnel">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/></svg>
                Add responder
              </button>
            </div>
          </div>

          <div class="mini-stat-row" style="margin-bottom:16px">
            <div class="mini-stat"><div class="ms-label">Total accounts</div><div class="ms-value" id="personnelTotal">0</div><div class="ms-foot">Responders + admins</div></div>
            <div class="mini-stat"><div class="ms-label">Field responders</div><div class="ms-value" id="personnelField">0</div><div class="ms-foot">Active field accounts</div></div>
            <div class="mini-stat"><div class="ms-label">Suspended</div><div class="ms-value" id="personnelSuspended">0</div><div class="ms-foot">Access revoked</div></div>
          </div>

          <div class="card" style="margin-bottom:16px">
            <div class="card-head">
              <h3>Account register</h3>
              <div class="filters">
                <input class="input" id="personnelSearch" placeholder="Search name, email or ID">
                <select class="select" id="personnelRoleFilter">
                  <option value="">All roles</option>
                  <option value="user">Responder</option>
                  <option value="admin">Administrator</option>
                </select>
                <select class="select" id="personnelStatusFilter">
                  <option value="">All statuses</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
            <div class="table-wrap">
              <table class="data">
                <thead>
                  <tr><th>Account</th><th>Role</th><th>Team</th><th>Responder ID</th><th>Status</th><th>Last login</th><th style="text-align:right">Actions</th></tr>
                </thead>
                <tbody id="personnelRows"><tr><td colspan="7"><div class="empty">Loading personnel…</div></td></tr></tbody>
              </table>
            </div>
          </div>

          <div class="card">
            <div class="card-head">
              <h3>Team roster</h3>
              <span class="hint">Live team summary</span>
            </div>
            <div class="table-wrap">
              <table class="data">
                <thead>
                  <tr><th>Team</th><th>Kind</th><th>Lead</th><th>Personnel</th><th>Sector</th><th>Status</th><th>Last check-in</th></tr>
                </thead>
                <tbody id="teamRosterRows"><tr><td colspan="7"><div class="empty">Loading teams…</div></td></tr></tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- ==================== INCIDENTS ==================== -->
        <section class="view" id="view-incidents">
          <div class="view-head">
            <div>
              <div class="title-row">
                <h1>Incident Triage</h1>
                <span class="badge badge-red" id="incidentBadge">0 open</span>
              </div>
              <div class="sub">
                <span>Field reports and SOS alerts</span>
                <span class="sep">·</span>
                <span id="incidentsClock">--:-- PHT</span>
              </div>
            </div>
            <div class="view-actions">
              <button class="btn" id="exportIncidentsBtn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/></svg>
                Export CSV
              </button>
            </div>
          </div>

          <div class="card" style="margin-bottom:16px">
            <div class="card-head">
              <h3>Triage queue</h3>
              <div class="filters">
                <input class="input" id="incidentSearch" placeholder="Search incident, reporter or sector">
                <select class="select" id="incidentSeverityFilter">
                  <option value="">All severities</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <select class="select" id="incidentStatusFilter">
                  <option value="">All states</option>
                  <option value="open">Open</option>
                  <option value="acknowledged">Acknowledged</option>
                  <option value="escalated">Escalated</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>
            <div class="card-body" style="padding:0">
              <div id="incidentList" class="side-list"><div class="empty">Loading incidents…</div></div>
            </div>
          </div>
        </section>

        <!-- ==================== MESSAGES ==================== -->
        <section class="view" id="view-messages">
          <div class="view-head">
            <div>
              <div class="title-row">
                <h1>Broadcast & Traffic</h1>
                <span class="badge badge-purple">Command channel</span>
              </div>
              <div class="sub">
                <span>Send instructions and monitor field traffic</span>
                <span class="sep">·</span>
                <span id="messagesClock">--:-- PHT</span>
              </div>
            </div>
          </div>

          <div class="page-grid wide-left">
            <div class="stack">
              <div class="card">
                <div class="card-head">
                  <h3>Command broadcast</h3>
                  <span class="hint">Delivered instantly to every open dashboard</span>
                </div>
                <div class="card-body">
                  <form id="broadcastForm">
                    <div class="form-grid cols-2">
                      <div class="field">
                        <label for="broadcastChannel">Channel</label>
                        <select class="select" id="broadcastChannel">
                          <option value="command">Command · all teams</option>
                        </select>
                      </div>
                      <div class="field">
                        <label for="broadcastPriority">Priority</label>
                        <select class="select" id="broadcastPriority">
                          <option value="normal">Normal</option>
                          <option value="urgent">Urgent</option>
                          <option value="emergency">Emergency</option>
                        </select>
                      </div>
                    </div>
                    <div class="field">
                      <label for="broadcastInput">Message</label>
                      <textarea class="input" id="broadcastInput" rows="3" maxlength="500" placeholder="e.g. Team Alpha, advance to ridge marker and report on arrival."></textarea>
                      <div class="row between" style="margin-top:5px">
                        <span class="field-hint" id="broadcastCount">0 / 500 characters</span>
                        <span class="field-hint">Signed as <b id="broadcastSender">Command Center</b></span>
                      </div>
                    </div>
                    <div class="row between" style="margin-top:12px">
                      <div class="filters">
                        <button class="btn btn-sm" type="button" data-template="advance">Advance</button>
                        <button class="btn btn-sm" type="button" data-template="checkin">Check-in</button>
                        <button class="btn btn-sm" type="button" data-template="weather">Weather</button>
                        <button class="btn btn-sm" type="button" data-template="sos">Emergency</button>
                      </div>
                      <button class="btn btn-primary" type="submit">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                        Send broadcast
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              <div class="card">
                <div class="card-head">
                  <h3>Command channel</h3>
                  <span class="badge badge-blue" id="broadcastFeedCount">0 messages</span>
                </div>
                <div id="broadcastFeed" class="side-list" style="max-height:440px;overflow:auto"><div class="empty">Loading channel…</div></div>
              </div>
            </div>

            <div class="stack">
              <div class="card">
                <div class="card-head">
                  <h3>Team traffic</h3>
                  <span class="hint">Latest field messages</span>
                </div>
                <div id="teamTraffic" class="side-list" style="max-height:520px;overflow:auto"><div class="empty">Loading traffic…</div></div>
              </div>
            </div>
          </div>
        </section>

        <!-- ==================== REPORTS ==================== -->
        <section class="view" id="view-reports">
          <div class="view-head">
            <div>
              <div class="title-row">
                <h1>Reports</h1>
                <span class="badge badge-purple">Operational insight</span>
              </div>
              <div class="sub">
                <span>Mission load, incident mix and team readiness</span>
                <span class="sep">·</span>
                <span id="reportsClock">--:-- PHT</span>
              </div>
            </div>
            <div class="view-actions">
              <select class="select" id="reportRange" style="height:37px">
                <option value="7">Last 7 days</option>
                <option value="30" selected>Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="all">All data</option>
              </select>
              <button class="btn btn-primary" id="exportAllDataBtn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/></svg>
                Export snapshot
              </button>
            </div>
          </div>

          <div class="kpis">
            <div class="kpi">
              <div class="kpi-top"><span class="kpi-label">Missions</span><span class="kpi-icon purple"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.1V12a10 10 0 1 1-5.9-9.1"/><path d="m9 11 3 3L22 4"/></svg></span></div>
              <div class="kpi-value"><span id="reportMissions">0</span><small>total</small></div>
              <div class="kpi-foot"><span class="up" id="reportMissionsActive">0</span> active now</div>
            </div>
            <div class="kpi">
              <div class="kpi-top"><span class="kpi-label">Incidents</span><span class="kpi-icon red"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span></div>
              <div class="kpi-value"><span id="reportIncidents">0</span><small>reported</small></div>
              <div class="kpi-foot"><span class="warn" id="reportIncidentsOpen">0</span> unresolved</div>
            </div>
            <div class="kpi">
              <div class="kpi-top"><span class="kpi-label">Check-ins</span><span class="kpi-icon blue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg></span></div>
              <div class="kpi-value"><span id="reportCheckins">0</span><small>records</small></div>
              <div class="kpi-foot"><span class="up" id="reportCheckinsToday">0</span> today</div>
            </div>
            <div class="kpi">
              <div class="kpi-top"><span class="kpi-label">Team readiness</span><span class="kpi-icon amber"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg></span></div>
              <div class="kpi-value"><span id="reportReadiness">0</span><small>%</small></div>
              <div class="kpi-foot"><span class="up" id="reportTeamsReady">0</span> teams ready</div>
            </div>
          </div>

          <div class="dash-grid">
            <div class="stack">
              <div class="card">
                <div class="card-head">
                  <h3>Incident load by day</h3>
                  <span class="hint" id="trendHint">Last 7 days</span>
                </div>
                <div class="card-body">
                  <div class="bar-chart" id="incidentTrendChart"></div>
                </div>
              </div>

              <div class="card">
                <div class="card-head">
                  <h3>Mission summary</h3>
                  <span class="hint">Current register</span>
                </div>
                <div class="table-wrap">
                  <table class="data">
                    <thead><tr><th>Status</th><th>Count</th><th>Average progress</th><th>Priority mix</th></tr></thead>
                    <tbody id="reportSummaryRows"><tr><td colspan="4"><div class="empty">Loading summary…</div></td></tr></tbody>
                  </table>
                </div>
              </div>
            </div>

            <div class="stack">
              <div class="card">
                <div class="card-head">
                  <h3>Team status mix</h3>
                  <span class="hint">Live</span>
                </div>
                <div class="card-body">
                  <div class="donut-wrap">
                    <div class="donut" id="statusDonut" style="background:conic-gradient(#1d3147 0 100%)">
                      <div class="donut-center"><b id="donutTotal">0</b><span>teams</span></div>
                    </div>
                    <div class="donut-legend" id="statusLegend"></div>
                  </div>
                </div>
              </div>

              <div class="card">
                <div class="card-head">
                  <h3>Export data</h3>
                  <span class="hint">CSV / JSON</span>
                </div>
                <div class="card-body">
                  <div class="stack" style="gap:8px">
                    <button class="btn btn-block" id="exportMissionsBtn2">Missions CSV</button>
                    <button class="btn btn-block" id="exportPersonnelBtn2">Personnel CSV</button>
                    <button class="btn btn-block" id="exportIncidentsBtn2">Incidents CSV</button>
                    <button class="btn btn-block" id="exportAuditBtn2">Activity log CSV</button>
                    <button class="btn btn-block btn-primary" id="exportJsonBtn">Full database JSON</button>
                  </div>
                  <div class="field-hint" style="margin-top:10px">Exports are generated locally in the browser from the command database.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ==================== AUDIT ==================== -->
        <section class="view" id="view-audit">
          <div class="view-head">
            <div>
              <div class="title-row">
                <h1>Activity Log</h1>
                <span class="badge badge-purple">Audit trail</span>
              </div>
              <div class="sub">
                <span>Every login, broadcast, status change and data operation</span>
                <span class="sep">·</span>
                <span id="auditClock">--:-- PHT</span>
              </div>
            </div>
            <div class="view-actions">
              <button class="btn" id="exportAuditBtn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/></svg>
                Export CSV
              </button>
            </div>
          </div>

          <div class="card">
            <div class="card-head">
              <h3>Audit entries</h3>
              <div class="filters">
                <input class="input" id="auditSearch" placeholder="Search actor, action or detail">
                <select class="select" id="auditActionFilter">
                  <option value="">All actions</option>
                  <option value="LOGIN">Login</option>
                  <option value="BROADCAST">Broadcast</option>
                  <option value="MISSION">Mission</option>
                  <option value="INCIDENT">Incident</option>
                  <option value="PERSONNEL">Personnel</option>
                  <option value="SOS">SOS</option>
                  <option value="DATA">Data</option>
                </select>
              </div>
            </div>
            <div class="table-wrap">
              <table class="data">
                <thead><tr><th>Time</th><th>Actor</th><th>Action</th><th>Detail</th></tr></thead>
                <tbody id="auditRows"><tr><td colspan="4"><div class="empty">Loading activity…</div></td></tr></tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- ==================== SETTINGS ==================== -->
        <section class="view" id="view-settings">
          <div class="view-head">
            <div>
              <div class="title-row">
                <h1>Settings</h1>
                <span class="badge badge-purple">Command account</span>
              </div>
              <div class="sub">
                <span>Profile, security and system data</span>
                <span class="sep">·</span>
                <span id="settingsClock">--:-- PHT</span>
              </div>
            </div>
          </div>

          <div class="settings-grid">
            <nav class="settings-nav" aria-label="Settings sections">
              <button class="active" data-settings="profile">Profile</button>
              <button data-settings="security">Security</button>
              <button data-settings="system">System</button>
              <button data-settings="data">Data & backup</button>
              <button data-settings="about">About</button>
            </nav>

            <div class="stack">
              <div class="card" id="settings-profile">
                <div class="card-head"><h3>Administrator profile</h3><span class="hint">Visible to field teams</span></div>
                <div class="card-body">
                  <div class="profile-strip" style="margin-bottom:16px">
                    <div class="avatar avatar-lg" id="settingsAvatar" style="background:#251d3d;border-color:#45336b;color:var(--purple)">CM</div>
                    <div class="meta">
                      <div class="n" id="settingsName">Carl R. Miller</div>
                      <div class="r" id="settingsRole">Administrator · Duty Commander</div>
                    </div>
                    <span class="badge badge-purple" id="settingsResponderId">ADM-0001</span>
                  </div>
                  <form id="adminProfileForm">
                    <div class="form-grid cols-2">
                      <div class="field"><label for="setName">Full name</label><input class="input" id="setName" required></div>
                      <div class="field"><label for="setEmail">Email</label><input class="input" id="setEmail" type="email" readonly></div>
                      <div class="field"><label for="setPhone">Phone</label><input class="input" id="setPhone" placeholder="+63 917 000 0000"></div>
                      <div class="field"><label for="setTitle">Title</label><input class="input" id="setTitle" placeholder="Administrator · Duty Commander"></div>
                    </div>
                    <div class="field"><label for="setOrg">Organization</label><input class="input" id="setOrg" placeholder="Provincial Rescue Coordination Office"></div>
                    <button class="btn btn-primary" type="submit" style="margin-top:12px">Save profile</button>
                  </form>
                </div>
              </div>

              <div class="card" id="settings-security">
                <div class="card-head"><h3>Security</h3><span class="hint">Password & sessions</span></div>
                <div class="card-body">
                  <form id="adminPasswordForm">
                    <div class="form-grid cols-3">
                      <div class="field"><label for="curPass">Current password</label><input class="input" id="curPass" type="password" autocomplete="current-password" required></div>
                      <div class="field"><label for="newPass">New password</label><input class="input" id="newPass" type="password" autocomplete="new-password" required></div>
                      <div class="field"><label for="confPass">Confirm new</label><input class="input" id="confPass" type="password" autocomplete="new-password" required></div>
                    </div>
                    <button class="btn btn-primary" type="submit" style="margin-top:12px">Change password</button>
                  </form>
                  <div class="divider" style="margin:16px 0"></div>
                  <div class="setting-row">
                    <div class="s-text"><div class="s-title">Session timeout</div><div class="s-desc">Admin sessions expire after 12 hours of inactivity. Signing in again replaces the previous session.</div></div>
                    <span class="badge badge-blue">12 h</span>
                  </div>
                  <div class="setting-row">
                    <div class="s-text"><div class="s-title">Role guard</div><div class="s-desc">Responder accounts cannot open the admin portal, and admins are redirected away from the field dashboard.</div></div>
                    <span class="badge badge-green">Enforced</span>
                  </div>
                </div>
              </div>

              <div class="card" id="settings-system">
                <div class="card-head"><h3>System</h3><span class="hint">Demo command preferences</span></div>
                <div class="card-body">
                  <div class="setting-row">
                    <div class="s-text"><div class="s-title">Automatic team simulation</div><div class="s-desc">Moves demo patrols along their sectors so live tracking can be shown without field devices.</div></div>
                    <label class="switch"><input type="checkbox" id="setSimulation" checked></label>
                  </div>
                  <div class="setting-row">
                    <div class="s-text"><div class="s-title">SOS sound alert</div><div class="s-desc">Play a browser tone when a new SOS arrives. Audio may be blocked until you interact with the page.</div></div>
                    <label class="switch"><input type="checkbox" id="setSosSound"></label>
                  </div>
                  <div class="setting-row">
                    <div class="s-text"><div class="s-title">Strict check-in windows</div><div class="s-desc">Highlight teams whose check-in window has expired in the alert panel and reports.</div></div>
                    <label class="switch"><input type="checkbox" id="setStrictCheckin" checked></label>
                  </div>
                  <div class="setting-row">
                    <div class="s-text"><div class="s-title">Show team accuracy radius</div><div class="s-desc">Draw the GPS accuracy circle around the selected team on the command map.</div></div>
                    <label class="switch"><input type="checkbox" id="setAccuracy" checked></label>
                  </div>
                  <button class="btn btn-primary" id="saveSystemBtn" style="margin-top:14px">Save system settings</button>
                </div>
              </div>

              <div class="card" id="settings-data">
                <div class="card-head"><h3>Data & backup</h3><span class="hint">Local command database</span></div>
                <div class="card-body">
                  <div class="kv-list">
                    <div class="kv"><span class="k">Storage engine</span><span class="v" id="settingsDbMode">—</span></div>
                    <div class="kv"><span class="k">Records</span><span class="v" id="settingsDbRecords">—</span></div>
                    <div class="kv"><span class="k">Last export</span><span class="v" id="settingsLastExport">Never</span></div>
                    <div class="kv"><span class="k">Admin access code</span><span class="v mono" id="settingsAdminCode">RESQ-ADMIN-2026</span></div>
                  </div>
                  <div class="divider" style="margin:14px 0"></div>
                  <div class="row wrap" style="gap:8px">
                    <button class="btn" id="exportJsonBtn2">Download full JSON backup</button>
                    <button class="btn btn-danger" id="resetDataBtn">Reset demo database</button>
                  </div>
                  <div class="field-hint" style="margin-top:10px">Resetting restores the seeded demo accounts, teams, missions, incidents and messages. All local changes are lost.</div>
                </div>
              </div>

              <div class="card" id="settings-about">
                <div class="card-head"><h3>About ResQCoord</h3><span class="hint">Build information</span></div>
                <div class="card-body">
                  <div class="kv-list">
                    <div class="kv"><span class="k">Application</span><span class="v">ResQCoord · Command Center</span></div>
                    <div class="kv"><span class="k">Version</span><span class="v mono">2.0.0 · demo</span></div>
                    <div class="kv"><span class="k">Stack</span><span class="v">HTML · CSS · JavaScript · IndexedDB</span></div>
                    <div class="kv"><span class="k">Map engine</span><span class="v">Leaflet with OpenStreetMap tiles</span></div>
                    <div class="kv"><span class="k">Routing</span><span class="v">OSRM with offline fallback</span></div>
                    <div class="kv"><span class="k">Storage mode</span><span class="v" id="aboutDbMode">—</span></div>
                  </div>
                  <div class="field-hint" style="margin-top:12px">This is a local-first demonstration build. Data stays in this browser profile; use the JSON backup to move it elsewhere.</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>

  <script src="../assets/js/util.js"></script>
  <script src="../assets/js/db.js"></script>
  <script src="../assets/js/auth.js"></script>
  <script src="../assets/js/routing.js"></script>
  <script src="../assets/vendor/leaflet/leaflet.js"></script>
  <script src="../assets/js/mapkit.js"></script>
  <script src="../assets/js/tracking.js"></script>
  <script src="../assets/js/admin-app.js"></script>
</body>
</html>
````

---

<a id="file-7"></a>

## 7. user/login.html

**Purpose:** Responder sign-in  
**Size:** 7478 bytes · **Lines:** 158 · **SHA-256:** `94C81AEDC024AB0DB72289153D0D5D6AC19E0FF49B619833C0BB3E44FECC714D`

````html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Responder Sign In — ResQCoord</title>
  <link rel="icon" href="../assets/img/logo.svg" type="image/svg+xml">
  <link rel="stylesheet" href="../assets/css/base.css">
  <link rel="stylesheet" href="../assets/css/app.css">
</head>
<body class="auth-page" data-portal="user" data-page="login">
  <section class="auth-brand">
    <a class="brand" href="../index.html">
      <span class="brand-mark">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z"/><path d="M12 7v6M9 10h6"/>
        </svg>
      </span>
      <span class="brand-text">
        <span class="brand-name">ResQ<em>Coord</em></span>
        <span class="brand-sub">Command Center</span>
      </span>
    </a>

    <div class="auth-hero">
      <div class="eyebrow"><span class="pulse-dot"></span> User portal · Field responder</div>
      <h1>Every move.<br>Every check-in.<br><span>On the map.</span></h1>
      <p>
        Your field dashboard connects you to command, your team and your mission.
        Share your live position, plan a route, file an incident and call for help
        from one screen.
      </p>
      <div class="auth-stats">
        <div class="auth-stat">
          <div class="v">12<em>active</em></div>
          <div class="l">Team Alpha</div>
        </div>
        <div class="auth-stat">
          <div class="v">70<em>%</em></div>
          <div class="l">Sector cleared</div>
        </div>
        <div class="auth-stat">
          <div class="v">3.2<em>km</em></div>
          <div class="l">To ridge marker</div>
        </div>
      </div>
      <div class="auth-features">
        <div class="auth-feature">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>
          Live GPS with a real device fix
        </div>
        <div class="auth-feature">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z"/><circle cx="12" cy="10" r="2"/></svg>
          Route planning and turn-by-turn steps
        </div>
        <div class="auth-feature">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"/></svg>
          Secure channel to command
        </div>
      </div>
    </div>

    <div class="auth-footer">
      <span>ResQCoord 2.4.1</span>
      <span>Local-first</span>
      <span>© 2026 PRCO</span>
    </div>
  </section>

  <section class="auth-panel">
    <a class="auth-back" href="../index.html">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
      Back to overview
    </a>

    <div class="auth-card">
      <div class="brand">
        <span class="brand-mark">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z"/><path d="M12 7v6M9 10h6"/>
          </svg>
        </span>
        <span class="brand-text">
          <span class="brand-name">ResQ<em>Coord</em></span>
          <span class="brand-sub">Command Center</span>
        </span>
      </div>

      <div class="portal-switch" role="tablist" aria-label="Portal">
        <a class="active user" href="login.html">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Responder
        </a>
        <a class="admin" href="../admin/login.html">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>
          Admin
        </a>
      </div>

      <div class="auth-kicker">
        <span class="badge badge-green">User view</span>
        <span class="tiny muted-2">Field responder access</span>
      </div>
      <h2>Sign in to your field dashboard</h2>
      <p class="lead">Enter your credentials to access your mission, live map and secure channel.</p>

      <div id="sessionNotice" class="demo-box" style="display:none;margin:0 0 16px"></div>

      <form id="authForm" class="auth-form" novalidate autocomplete="on">
        <div id="formError" class="field-error" style="display:none" role="alert"></div>

        <div class="field">
          <label for="email">Email address</label>
          <input class="input" id="email" name="email" type="email" inputmode="email" autocomplete="username" placeholder="you@resqcoord.ph" required>
        </div>

        <div class="field">
          <label for="password">Password</label>
          <div class="pw-wrap">
            <input class="input" id="password" name="password" type="password" autocomplete="current-password" placeholder="Enter your password" required>
            <button type="button" class="pw-toggle" data-toggle-pw="password" aria-label="Show password">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
          </div>
          <div class="row between">
            <span class="field-hint">12-hour local secure session</span>
            <a id="forgotLink" href="#" class="small">Forgot password?</a>
          </div>
        </div>

        <button class="btn btn-primary btn-block" id="submitBtn" type="submit">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><path d="m10 17 5-5-5-5"/><path d="M15 12H3"/></svg>
          Sign in to dashboard
        </button>
      </form>

      <p class="auth-alt">Don't have an account? <a href="register.html">Register as a responder</a></p>
      <p class="auth-alt" style="margin-top:8px">Command staff? <a href="../admin/login.html">Open the admin portal</a></p>

      <div class="demo-box">
        <div class="demo-title">
          <span>Demo responder account</span>
          <button type="button" class="btn btn-sm" data-fill="user" style="height:24px;font-size:10px">Fill in</button>
        </div>
        <div class="demo-creds">
          <span>Email&nbsp;&nbsp;&nbsp; <b>j.reyes@resqcoord.ph</b></span>
          <span>Password <b>User@123</b></span>
        </div>
      </div>
    </div>
  </section>

  <script src="../assets/js/util.js"></script>
  <script src="../assets/js/db.js"></script>
  <script src="../assets/js/auth.js"></script>
  <script src="../assets/js/auth-page.js"></script>
</body>
</html>
````

---

<a id="file-8"></a>

## 8. user/register.html

**Purpose:** Responder registration  
**Size:** 8687 bytes · **Lines:** 173 · **SHA-256:** `A95FD63EA67F8EFFA7A063A4FBF8B20AA378022F8C723355789E045C197D0C4C`

````html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Responder Registration — ResQCoord</title>
  <link rel="icon" href="../assets/img/logo.svg" type="image/svg+xml">
  <link rel="stylesheet" href="../assets/css/base.css">
  <link rel="stylesheet" href="../assets/css/app.css">
</head>
<body class="auth-page" data-portal="user" data-page="register">
  <section class="auth-brand">
    <a class="brand" href="../index.html">
      <span class="brand-mark">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z"/><path d="M12 7v6M9 10h6"/>
        </svg>
      </span>
      <span class="brand-text">
        <span class="brand-name">ResQ<em>Coord</em></span>
        <span class="brand-sub">Command Center</span>
      </span>
    </a>

    <div class="auth-hero">
      <div class="eyebrow"><span class="pulse-dot"></span> Field responder onboarding</div>
      <h1>Join the team.<br>Get on the map.<br><span>Stay connected.</span></h1>
      <p>
        Create a responder account to receive missions, share your live position with command,
        and file reports from the field — on any phone, tablet or desktop browser.
      </p>
      <div class="auth-features">
        <div class="auth-feature">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/></svg>
          Assigned to your real team
        </div>
        <div class="auth-feature">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg>
          Private, locally stored account
        </div>
        <div class="auth-feature">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
          Check-in reminders and SOS
        </div>
      </div>
    </div>

    <div class="auth-footer">
      <span>ResQCoord 2.4.1</span>
      <span>Data stays on this device</span>
      <span>© 2026 PRCO</span>
    </div>
  </section>

  <section class="auth-panel">
    <a class="auth-back" href="login.html">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
      Back to sign in
    </a>

    <div class="auth-card">
      <div class="brand">
        <span class="brand-mark">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z"/><path d="M12 7v6M9 10h6"/>
          </svg>
        </span>
        <span class="brand-text">
          <span class="brand-name">ResQ<em>Coord</em></span>
          <span class="brand-sub">Command Center</span>
        </span>
      </div>

      <div class="portal-switch" role="tablist" aria-label="Portal">
        <a class="active user" href="register.html">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Responder
        </a>
        <a class="admin" href="../admin/register.html">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>
          Admin
        </a>
      </div>

      <div class="auth-kicker">
        <span class="badge badge-green">User view</span>
        <span class="tiny muted-2">Responder account</span>
      </div>
      <h2>Create your responder account</h2>
      <p class="lead">Set up field access for the Provincial Rescue Coordination Office.</p>

      <form id="authForm" class="auth-form" novalidate>
        <div id="formError" class="field-error" style="display:none" role="alert"></div>

        <div class="field">
          <label for="name">Full name</label>
          <input class="input" id="name" name="name" type="text" autocomplete="name" placeholder="e.g. J. Reyes" required>
        </div>

        <div class="field">
          <label for="org">Organization <span class="label-optional">(optional)</span></label>
          <input class="input" id="org" name="org" type="text" autocomplete="organization" placeholder="Provincial Rescue Coordination Office">
        </div>

        <div class="field">
          <label for="email">Email address</label>
          <input class="input" id="email" name="email" type="email" inputmode="email" autocomplete="username" placeholder="you@resqcoord.ph" required>
        </div>

        <div class="field">
          <label for="teamId">Assign me to a team</label>
          <select class="select" id="teamId" name="teamId">
            <option value="">Unassigned · assign me later</option>
          </select>
          <span class="field-hint">Your team determines which mission and messages you see.</span>
        </div>

        <div class="form-grid cols-2">
          <div class="field">
            <label for="password">Password</label>
            <div class="pw-wrap">
              <input class="input" id="password" name="password" type="password" autocomplete="new-password" placeholder="At least 8 characters" required>
              <button type="button" class="pw-toggle" data-toggle-pw="password" aria-label="Show password">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
          </div>
          <div class="field">
            <label for="confirm">Confirm password</label>
            <div class="pw-wrap">
              <input class="input" id="confirm" name="confirm" type="password" autocomplete="new-password" placeholder="Repeat password" required>
              <button type="button" class="pw-toggle" data-toggle-pw="confirm" aria-label="Show password">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
          </div>
        </div>

        <div>
          <div class="strength" id="strength" data-score="0" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
          <div class="field-hint" id="strengthLabel" style="margin-top:6px">At least 8 characters with letters and a number</div>
        </div>

        <div class="field">
          <label for="phone">Mobile number <span class="label-optional">(optional)</span></label>
          <input class="input" id="phone" name="phone" type="tel" autocomplete="tel" placeholder="+63 917 000 0000">
        </div>

        <button class="btn btn-primary btn-block" id="submitBtn" type="submit">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/></svg>
          Create responder account
        </button>
      </form>

      <p class="auth-alt">Already have an account? <a href="login.html">Sign in</a></p>
      <p class="auth-alt" style="margin-top:8px">Need command access? <a href="../admin/register.html">Register as admin</a></p>

      <div class="demo-box">
        <div class="demo-title"><span>Demo accounts</span></div>
        <div class="demo-creds">
          <span>Responder <b>j.reyes@resqcoord.ph</b> / <b>User@123</b></span>
          <span>Second user <b>m.santos@resqcoord.ph</b> / <b>User@123</b></span>
        </div>
      </div>
    </div>
  </section>

  <script src="../assets/js/util.js"></script>
  <script src="../assets/js/db.js"></script>
  <script src="../assets/js/auth.js"></script>
  <script src="../assets/js/auth-page.js"></script>
</body>
</html>
````

---

<a id="file-9"></a>

## 9. user/dashboard.html

**Purpose:** Responder field dashboard markup  
**Size:** 59933 bytes · **Lines:** 980 · **SHA-256:** `6AB7042BB5F235918F02789250752A5E2BB07ABE8EFDDFC349A4647DC525401E`

````html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Field Dashboard — ResQCoord</title>
  <link rel="icon" href="../assets/img/logo.svg" type="image/svg+xml">
  <link rel="stylesheet" href="../assets/vendor/leaflet/leaflet.css">
  <link rel="stylesheet" href="../assets/css/base.css">
  <link rel="stylesheet" href="../assets/css/app.css">
  <style>
    .leaflet-tile-pane { filter: brightness(0.7) saturate(0.72) contrast(1.12); }
  </style>
</head>
<body>
  <div class="app" id="app">
    <aside class="sidebar" aria-label="Responder navigation">
      <div class="sidebar-head">
        <a class="brand" href="../index.html">
          <span class="brand-mark">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z"/><path d="M12 7v6M9 10h6"/>
            </svg>
          </span>
          <span class="brand-text">
            <span class="brand-name">ResQ<em>Coord</em></span>
            <span class="brand-sub">Command Center</span>
          </span>
        </a>
        <div class="sidebar-scope"><span class="dot"></span> User view · Field responder</div>
      </div>

      <nav class="side-nav" aria-label="Dashboard sections">
        <div class="nav-label">Operations</div>
        <button class="nav-item active" data-view="dashboard">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
          Dashboard
        </button>
        <button class="nav-item" data-view="mission">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
          My Mission
        </button>
        <button class="nav-item" data-view="map">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21 3 6"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>
          Live Map
        </button>
        <button class="nav-item" data-view="messages">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"/></svg>
          Messages
          <span class="count" id="msgUnread" style="display:none">0</span>
        </button>
        <button class="nav-item" data-view="incident">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          Report Incident
        </button>
        <div class="nav-label">Account</div>
        <button class="nav-item" data-view="settings">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/></svg>
          Settings
        </button>

        <div class="nav-label">Quick actions</div>
        <button class="nav-item" data-action="checkin">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.1V12a10 10 0 1 1-5.9-9.1"/><path d="m9 11 3 3L22 4"/></svg>
          Check in
        </button>
        <button class="nav-item" data-action="sos" style="color:var(--danger)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 9.5h4.5M8 14.5h4.5M15 9.5v5"/></svg>
          SOS Alert
        </button>
      </nav>

      <div class="sidebar-foot">
        <div class="side-user" id="sideUser" role="button" tabindex="0">
          <div class="avatar green" id="sidebarAvatar">JR</div>
          <div class="meta">
            <div class="name" id="sidebarName">J. Reyes</div>
            <div class="role" id="sidebarRole">Field Responder · Team Alpha</div>
          </div>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </div>
      </div>
    </aside>

    <div class="main-wrap">
      <div class="offline-banner" id="offlineBanner">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        You are offline. The map tiles and road routing need a connection — cached data and your local database still work.
      </div>

      <header class="topbar">
        <button class="btn-icon mobile-toggle" id="sidebarToggle" aria-label="Open navigation">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
        <div class="crumb">
          <span>Responder</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          <b id="crumb">Dashboard</b>
          <span class="badge badge-green" style="height:20px;font-size:9px">USER</span>
        </div>
        <div class="topbar-spacer"></div>
        <div class="topbar-status">
          <span class="sync-mini" title="Last database sync">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-2.6-6.3"/><path d="M21 3v6h-6"/></svg>
            <span id="lastSync">Synced just now</span>
          </span>
          <span class="net-status" id="netStatus"><span class="dot"></span> Online</span>
          <div class="topbar-user">
            <div class="meta">
              <div class="name" id="topName">J. Reyes</div>
              <div class="role" id="topRole">Field Responder</div>
            </div>
            <div class="avatar green" id="topAvatar">JR</div>
            <button class="btn-icon" data-action="logout" title="Sign out" aria-label="Sign out">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/></svg>
            </button>
          </div>
        </div>
      </header>

      <main class="main">
        <!-- ============ DASHBOARD ============ -->
        <section class="view active" id="view-dashboard">
          <div class="view-head">
            <div>
              <div class="title-row">
                <h1>My Dashboard</h1>
                <span class="badge badge-green">Field team view</span>
              </div>
              <div class="sub">
                <span id="dashSub">Team Alpha</span>
                <span class="sep">·</span>
                <span id="clock">--:-- PHT</span>
                <span class="sep">·</span>
                <span class="row" style="gap:5px"><span class="pulse-dot"></span> Live sync</span>
              </div>
            </div>
            <div class="view-actions">
              <button class="btn" data-action="status">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m9 12 2 2 4-4"/></svg>
                Update status
              </button>
              <button class="btn btn-primary" data-action="checkin">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.1V12a10 10 0 1 1-5.9-9.1"/><path d="m9 11 3 3L22 4"/></svg>
                Check in
              </button>
            </div>
          </div>

          <div class="kpis">
            <div class="kpi">
              <div class="kpi-top">
                <span class="kpi-label">Deployed team</span>
                <span class="kpi-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></span>
              </div>
              <div class="kpi-value"><span id="kpiTeam">12</span><small>personnel</small></div>
              <div class="kpi-foot"><span class="up" id="kpiTeamName">Team Alpha</span> · on site</div>
            </div>
            <div class="kpi">
              <div class="kpi-top">
                <span class="kpi-label">Mission progress</span>
                <span class="kpi-icon blue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.1V12a10 10 0 1 1-5.9-9.1"/><path d="m9 11 3 3L22 4"/></svg></span>
              </div>
              <div class="kpi-value"><span id="kpiProgress">70</span><small>%</small></div>
              <div class="kpi-foot"><span class="up" id="kpiSector">N-2</span> · 7 of 10 grid cells</div>
            </div>
            <div class="kpi">
              <div class="kpi-top">
                <span class="kpi-label">Next check-in</span>
                <span class="kpi-icon amber"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg></span>
              </div>
              <div class="kpi-value"><span id="kpiCheckin">--:--</span></div>
              <div class="kpi-foot"><span class="warn" id="kpiCheckinIn">--</span> remaining in window</div>
            </div>
            <div class="kpi">
              <div class="kpi-top">
                <span class="kpi-label">My status</span>
                <span class="kpi-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></span>
              </div>
              <div class="kpi-value" id="kpiStatus" style="font-size:22px">On site</div>
              <div class="kpi-foot"><span class="up">GPS locked</span> · <span id="kpiAccuracy">8 m</span></div>
            </div>
          </div>

          <div class="dash-grid">
            <div class="stack">
              <div class="status-hero">
                <div class="row between wrap">
                  <div>
                    <div class="sh-label">My status</div>
                    <div class="sh-value">
                      <span class="dot-big"></span>
                      <span id="statusValue">On site</span>
                    </div>
                  </div>
                  <select class="status-select" id="statusSelect" aria-label="Update my status">
                    <option value="onsite">On site</option>
                    <option value="enroute">En route</option>
                    <option value="standby">Standby</option>
                  </select>
                </div>
                <div class="sh-meta">
                  <div class="item">
                    <div class="k">Next check-in</div>
                    <div class="v" id="nextCheckin">14:45 · 13 min</div>
                  </div>
                  <div class="item">
                    <div class="k">Team</div>
                    <div class="v" id="heroTeam">Team Alpha · 12</div>
                  </div>
                  <div class="item">
                    <div class="k">Assigned mission</div>
                    <div class="v" id="heroMission">Mt. Lantin Rescue</div>
                  </div>
                  <div class="item">
                    <div class="k">Last check-in</div>
                    <div class="v" id="heroLastCheckin">--</div>
                  </div>
                </div>
              </div>

              <div class="card map-card">
                <div class="card-head">
                  <h3>
                    My location
                    <span class="badge badge-blue" style="height:20px;font-size:9px">Own sector only</span>
                    <span class="gps-badge" id="miniGpsBadge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg> Locked</span>
                  </h3>
                  <button class="btn btn-sm btn-ghost" data-view-link="map">Open full map</button>
                </div>
                <div class="map-shell short" style="height:300px">
                  <div class="map" id="userMiniMap"></div>
                  <div class="map-overlay-foot">
                    <span class="map-coords" id="miniCoords">16.40680, 120.60120 · <b>±8 m</b></span>
                    <span class="map-pill"><span class="live-dot green"></span> Tracking</span>
                  </div>
                </div>
              </div>

              <div class="grid grid-2">
                <div class="card">
                  <div class="card-head">
                    <h3><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--muted)"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"/></svg> Messages from command</h3>
                    <button class="btn btn-sm btn-ghost" data-view-link="messages">View all</button>
                  </div>
                  <div id="dashMessages" class="side-list"><div class="empty">Loading messages…</div></div>
                </div>

                <div class="card">
                  <div class="card-head">
                    <h3>My team</h3>
                    <span class="hint" id="dashTeamMeta">Team Alpha</span>
                  </div>
                  <div id="dashTeam" class="side-list"><div class="empty">Loading team…</div></div>
                </div>
              </div>
            </div>

            <div class="stack">
              <div class="card">
                <div class="card-head">
                  <h3>Quick actions</h3>
                  <span class="hint">Field tools</span>
                </div>
                <div class="card-body">
                  <div class="quick-grid">
                    <button class="quick-btn" data-action="checkin">
                      <span class="qi"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.1V12a10 10 0 1 1-5.9-9.1"/><path d="m9 11 3 3L22 4"/></svg></span>
                      <span><b>Check in</b><small>Send position</small></span>
                    </button>
                    <button class="quick-btn" data-action="status">
                      <span class="qi blue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></span>
                      <span><b>Update status</b><small>On site / en route</small></span>
                    </button>
                    <button class="quick-btn" data-action="report">
                      <span class="qi amber"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span>
                      <span><b>Report incident</b><small>File from field</small></span>
                    </button>
                    <button class="quick-btn" data-action="sos">
                      <span class="qi red"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 9.5h4.5M8 14.5h4.5M15 9.5v5"/></svg></span>
                      <span><b>SOS alert</b><small>Emergency</small></span>
                    </button>
                    <button class="quick-btn" data-view-link="map">
                      <span class="qi purple"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/></svg></span>
                      <span><b>Plan route</b><small>Map + navigation</small></span>
                    </button>
                    <button class="quick-btn" data-action="message">
                      <span class="qi blue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"/></svg></span>
                      <span><b>Message command</b><small>Secure channel</small></span>
                    </button>
                  </div>
                </div>
              </div>

              <div class="card">
                <div class="card-head">
                  <h3>Assigned mission</h3>
                  <span class="badge badge-amber" id="dashMissionStatus">In progress</span>
                </div>
                <div class="card-body">
                  <div class="mission-id" id="dashMissionCode">MSN-2026-014</div>
                  <h2 style="margin-top:10px;font-size:18px" id="dashMissionTitle">Mt. Lantin Rescue</h2>
                  <div class="small muted-2" style="margin-top:5px" id="dashMissionSector">Sector N-2 · Mountain SAR</div>
                  <div class="row between small" style="margin-top:16px">
                    <span class="muted-2">Sector progress</span>
                    <b id="dashMissionPct">70%</b>
                  </div>
                  <div class="big-progress" style="margin-top:7px"><i id="dashMissionBar" style="width:70%"></i></div>
                  <div class="kv-list" style="margin-top:14px">
                    <div class="kv"><span class="k">Mission lead</span><span class="v" id="dashMissionLead">Lt. Mara Santos</span></div>
                    <div class="kv"><span class="k">Checkpoints</span><span class="v" id="dashMissionCp">3 of 5 reached</span></div>
                    <div class="kv"><span class="k">Next waypoint</span><span class="v" id="dashMissionNext">Ridge marker</span></div>
                  </div>
                  <button class="btn btn-block" style="margin-top:14px" data-view-link="mission">Open mission brief</button>
                </div>
              </div>

              <div class="card">
                <div class="card-head">
                  <h3>Check-in window</h3>
                  <span class="badge badge-amber">Due soon</span>
                </div>
                <div class="card-body">
                  <div class="row between">
                    <div>
                      <div class="tiny uppercase muted-2">Scheduled</div>
                      <div style="font-size:20px;font-weight:700;letter-spacing:-.5px" id="checkinDue">14:45 PHT</div>
                    </div>
                    <div class="avatar green" style="width:44px;height:44px">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
                    </div>
                  </div>
                  <div class="field-hint" style="margin-top:10px">Check in every 15 minutes during active missions. Command is notified automatically if you miss a window.</div>
                  <button class="btn btn-primary btn-block" style="margin-top:13px" data-action="checkin">Check in now</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ============ MISSION ============ -->
        <section class="view" id="view-mission">
          <div class="view-head">
            <div>
              <div class="title-row">
                <h1>My Mission</h1>
                <span class="badge badge-amber" id="missionBadge">In progress</span>
              </div>
              <div class="sub">
                <span id="missionSub">Assigned mission · Mt. Lantin Rescue</span>
                <span class="sep">·</span>
                <span id="missionClock">--:-- PHT</span>
              </div>
            </div>
            <div class="view-actions">
              <button class="btn" data-action="backup">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/></svg>
                Request backup
              </button>
              <button class="btn btn-primary" data-view-link="map">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21 3 6"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>
                Open map
              </button>
            </div>
          </div>

          <div class="mission-hero">
            <div class="row between wrap" style="align-items:flex-start">
              <div>
                <span class="mission-id" id="missionCode">MSN-2026-014</span>
                <h2 style="font-size:25px;letter-spacing:-.8px;margin-top:11px" id="missionTitle">Mt. Lantin Rescue</h2>
                <div class="small muted" style="margin-top:6px" id="missionType">Priority: High · Mountain SAR · Sector N-2</div>
              </div>
              <div style="text-align:right;min-width:190px">
                <div class="tiny uppercase muted-2">Elapsed time</div>
                <div style="font-size:28px;font-weight:720;letter-spacing:-1px" id="missionElapsed">3h 12m</div>
                <div class="tiny muted-2" id="missionDispatched">Dispatched 11:20 PHT</div>
              </div>
            </div>
            <div class="row between" style="margin-top:20px">
              <span class="tiny uppercase muted-2">Sector progress · <b id="missionSector">N-2</b></span>
              <b id="missionPct">70%</b>
            </div>
            <div class="big-progress" style="margin-top:8px"><i id="missionBar" style="width:70%"></i></div>
            <div class="row between tiny muted-2" style="margin-top:7px">
              <span id="missionCells">7 of 10 grid cells cleared</span>
              <span>Updated just now</span>
            </div>
          </div>

          <div class="grid grid-2" style="margin-top:16px">
            <div class="card">
              <div class="card-head">
                <h3>Mission briefing</h3>
                <span class="badge badge-red">Priority: High</span>
              </div>
              <div class="card-body">
                <div class="brief-grid">
                  <div class="brief-item"><div class="k">Subjects</div><div class="v" id="briefSubjects">2 lost hikers</div></div>
                  <div class="brief-item"><div class="k">Last seen</div><div class="v" id="briefLastSeen">North spur trailhead</div></div>
                  <div class="brief-item"><div class="k">Weather</div><div class="v" id="briefWeather">Light rain</div></div>
                  <div class="brief-item"><div class="k">Hazards</div><div class="v" id="briefHazards">Rockfall in Sector C</div></div>
                  <div class="brief-item"><div class="k">Mission lead</div><div class="v" id="briefLead">Lt. Mara Santos</div></div>
                  <div class="brief-item"><div class="k">Assigned team</div><div class="v" id="briefTeam">Team Alpha</div></div>
                </div>
                <div class="divider" style="margin:16px 0"></div>
                <p class="small" style="color:var(--muted);line-height:1.7" id="briefDescription">Mission description.</p>
              </div>
            </div>

            <div class="card">
              <div class="card-head">
                <h3>Mission timeline</h3>
                <span class="badge badge-green">Live</span>
              </div>
              <div class="card-body">
                <div class="timeline" id="missionTimeline"></div>
              </div>
            </div>
          </div>

          <div class="page-grid" style="margin-top:16px">
            <div class="card">
              <div class="card-head">
                <h3>Checkpoints</h3>
                <span class="hint" id="cpSummary">3 of 5 reached</span>
              </div>
              <div class="card-body" id="missionCheckpoints"></div>
            </div>

            <div class="stack">
              <div class="card">
                <div class="card-head">
                  <h3>Sector progress</h3>
                  <span class="badge badge-blue">N-2</span>
                </div>
                <div class="card-body">
                  <div class="sector-grid" id="sectorGrid"></div>
                  <div class="row between tiny muted-2" style="margin-top:10px">
                    <span><i style="display:inline-block;width:6px;height:6px;border-radius:2px;background:var(--accent);margin-right:4px"></i> Cleared</span>
                    <span><i style="display:inline-block;width:6px;height:6px;border-radius:2px;background:var(--accent-2);margin-right:4px"></i> Current</span>
                    <span><i style="display:inline-block;width:6px;height:6px;border-radius:2px;background:#21384f;margin-right:4px"></i> Pending</span>
                  </div>
                  <div class="divider" style="margin:14px 0"></div>
                  <div class="kv-list">
                    <div class="kv"><span class="k">Grid cells cleared</span><span class="v">7 / 10</span></div>
                    <div class="kv"><span class="k">Area covered</span><span class="v">1.8 km²</span></div>
                    <div class="kv"><span class="k">Team on task</span><span class="v">12 responders</span></div>
                    <div class="kv"><span class="k">Drone support</span><span class="v">Air Unit 2 · standby</span></div>
                  </div>
                </div>
              </div>
              <div class="card">
                <div class="card-head"><h3>Need help?</h3></div>
                <div class="card-body">
                  <p class="small muted" style="line-height:1.6">Request additional personnel or a medic for your sector. Command will acknowledge on the secure channel.</p>
                  <button class="btn btn-block" style="margin-top:12px" data-action="backup">Request backup</button>
                  <button class="btn btn-danger btn-block" style="margin-top:8px" data-action="sos">Activate SOS</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ============ LIVE MAP ============ -->
        <section class="view" id="view-map">
          <div class="view-head">
            <div>
              <div class="title-row">
                <h1>Live Map</h1>
                <span class="badge badge-green">Tracking</span>
              </div>
              <div class="sub">
                <span>Mt. Lantin operational area</span>
                <span class="sep">·</span>
                <span id="mapClock">--:-- PHT</span>
                <span class="sep">·</span>
                <span class="gps-badge" id="mapGpsBadge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg> GPS locked</span>
              </div>
            </div>
            <div class="view-actions">
              <button class="btn" id="gpsBtn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>
                <span id="gpsBtnLabel">Use my GPS</span>
              </button>
              <button class="btn" id="demoBtn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
                <span id="demoBtnLabel">Demo movement</span>
              </button>
              <button class="btn btn-primary" data-action="checkin">Check in here</button>
            </div>
          </div>

          <div class="card map-card">
            <div class="map-shell tall">
              <div class="map" id="userMap"></div>
              <div class="map-overlay-head">
                <span class="map-pill"><span class="live-dot"></span> Live · auto-refresh 2.6 s</span>
                <div class="map-tools">
                  <button class="map-tool active" data-layer="streets">Streets</button>
                  <button class="map-tool" data-layer="satellite">Satellite</button>
                  <button class="map-tool" data-layer="terrain">Terrain</button>
                  <button class="map-tool active" id="sectorsToggle">Sectors</button>
                  <button class="map-tool active" id="routeToggle">Route</button>
                  <button class="map-tool" id="centerBtn">Center me</button>
                </div>
              </div>
              <div class="map-overlay-foot">
                <span class="map-coords" id="mapCoords">16.40680, 120.60120 · <b>±8 m</b></span>
                <span class="map-legend">
                  <span><i class="lg-onsite"></i> On site</span>
                  <span><i class="lg-enroute"></i> En route</span>
                  <span><i class="lg-standby"></i> Standby</span>
                  <span><i class="lg-sos"></i> SOS</span>
                </span>
              </div>

              <div class="map-route-panel" id="routePanel">
                <div class="rp-head">
                  <span>Route planner</span>
                  <button class="btn-icon" id="routeClose" style="width:24px;height:24px" aria-label="Close route panel">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                  </button>
                </div>
                <div class="rp-body">
                  <div class="field">
                    <label for="routeFrom">Start</label>
                    <select class="select" id="routeFrom" style="height:36px;font-size:12px">
                      <option value="me">My current location</option>
                      <option value="base">Base Camp</option>
                      <option value="trailhead">Trailhead</option>
                    </select>
                  </div>
                  <div class="field">
                    <label for="routeTo">Destination</label>
                    <select class="select" id="routeTo" style="height:36px;font-size:12px"></select>
                  </div>
                  <div class="field">
                    <label for="routeSearch">Search a place</label>
                    <div class="input-group">
                      <input class="input" id="routeSearch" style="height:36px;font-size:12px" placeholder="e.g. Baguio, ridge marker">
                      <button class="btn btn-sm" id="routeSearchBtn" style="height:36px">Find</button>
                    </div>
                  </div>
                  <label class="check" style="font-size:11px;color:var(--muted-2)">
                    <input type="checkbox" id="routeDirect"> Off-road direct route
                  </label>
                  <button class="btn btn-primary btn-block btn-sm" id="routeBtn" style="height:36px">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/></svg>
                    Get route
                  </button>
                </div>
                <div class="rp-result" id="routeResult" style="display:none"></div>
              </div>
            </div>
          </div>

          <div class="grid grid-3" style="margin-top:16px">
            <div class="card">
              <div class="card-head">
                <h3>GPS & location</h3>
                <span class="gps-badge" id="gpsBadge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg> Locked</span>
              </div>
              <div class="card-body">
                <div class="kv-list">
                  <div class="kv"><span class="k">Latitude</span><span class="v mono" id="gpsLat">16.40680</span></div>
                  <div class="kv"><span class="k">Longitude</span><span class="v mono" id="gpsLng">120.60120</span></div>
                  <div class="kv"><span class="k">Accuracy</span><span class="v" id="gpsAccuracy">±8 m</span></div>
                  <div class="kv"><span class="k">Speed</span><span class="v" id="gpsSpeed">3.2 km/h</span></div>
                  <div class="kv"><span class="k">Source</span><span class="v" id="gpsSource">Demo tracker</span></div>
                  <div class="kv"><span class="k">Updated</span><span class="v" id="gpsUpdated">just now</span></div>
                </div>
                <div class="divider" style="margin:13px 0"></div>
                <div class="form-grid cols-2">
                  <div class="field">
                    <label for="latInput">Set latitude</label>
                    <input class="input" id="latInput" inputmode="decimal" style="height:35px;font-size:12px" placeholder="16.4068">
                  </div>
                  <div class="field">
                    <label for="lngInput">Set longitude</label>
                    <input class="input" id="lngInput" inputmode="decimal" style="height:35px;font-size:12px" placeholder="120.6012">
                  </div>
                </div>
                <div class="row" style="margin-top:9px;gap:6px;flex-wrap:wrap">
                  <button class="btn btn-sm" id="applyLocation">Change location</button>
                  <button class="btn btn-sm btn-ghost" id="pickMapBtn">Pick on map</button>
                  <button class="btn btn-sm btn-ghost" id="gpsFixBtn">Use GPS fix</button>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-head">
                <h3>Movement trail</h3>
                <span class="hint">Last positions</span>
              </div>
              <div class="card-body">
                <div class="kv-list">
                  <div class="kv"><span class="k">Points recorded</span><span class="v" id="trailCount">—</span></div>
                  <div class="kv"><span class="k">Distance tracked</span><span class="v" id="trailDistance">—</span></div>
                  <div class="kv"><span class="k">Tracking mode</span><span class="v" id="trackingMode">Demo simulation</span></div>
                  <div class="kv"><span class="k">Live updates</span><span class="v" id="liveUpdates">Local channel</span></div>
                </div>
                <div class="divider" style="margin:13px 0"></div>
                <label class="switch" style="font-size:12px">
                  <input type="checkbox" id="simToggle" checked>
                  Follow live team movement
                </label>
                <div class="field-hint" style="margin-top:8px">The demo tracker moves your marker along the patrol route every 2.2 seconds and stores each point in the database.</div>
                <button class="btn btn-sm btn-block" style="margin-top:11px" id="recenterTrail">Show my trail</button>
              </div>
            </div>

            <div class="card">
              <div class="card-head">
                <h3>Nearby waypoints</h3>
                <span class="hint">Tap to route</span>
              </div>
              <div id="nearbyPlaces" class="side-list"></div>
            </div>
          </div>
        </section>

        <!-- ============ MESSAGES ============ -->
        <section class="view" id="view-messages">
          <div class="view-head">
            <div>
              <div class="title-row">
                <h1>Messages</h1>
                <span class="badge badge-green">Secure channel</span>
              </div>
              <div class="sub">
                <span>Command and team communications</span>
                <span class="sep">·</span>
                <span id="msgClock">--:-- PHT</span>
              </div>
            </div>
            <div class="view-actions">
              <div class="row" style="gap:7px">
                <span class="badge badge-red">Check-in due</span>
                <button class="btn btn-sm btn-primary" data-action="checkin">Check in now</button>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="msg-layout">
              <div class="msg-side">
                <div class="msg-side-head">
                  <div class="label" style="margin-bottom:8px">Channels</div>
                  <div class="input-group">
                    <input class="input" id="threadSearch" placeholder="Search messages" style="height:33px;font-size:11.5px">
                    <button class="btn btn-sm" id="threadSearchBtn" style="height:33px">Go</button>
                  </div>
                </div>
                <div id="threadList"></div>
              </div>
              <div class="chat">
                <div class="chat-head">
                  <div class="avatar green" id="chatAvatar">C</div>
                  <div class="meta">
                    <div class="name" id="chatTitle">Command Center</div>
                    <div class="sub" id="chatSub">Broadcast channel · all teams</div>
                  </div>
                  <span class="badge badge-green">Online</span>
                </div>
                <div class="chat-body" id="chatBody"></div>
                <form class="chat-compose" id="chatForm">
                  <textarea id="chatInput" placeholder="Message Command Center…" aria-label="Message"></textarea>
                  <button class="btn btn-primary" type="submit" aria-label="Send message">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        <!-- ============ REPORT INCIDENT ============ -->
        <section class="view" id="view-incident">
          <div class="view-head">
            <div>
              <div class="title-row">
                <h1>Report Incident</h1>
                <span class="badge badge-amber">Draft</span>
              </div>
              <div class="sub">
                <span>File an incident from the field</span>
                <span class="sep">·</span>
                <span id="incidentClock">--:-- PHT</span>
              </div>
            </div>
            <div class="view-actions">
              <button class="btn" id="incidentSos" style="color:var(--danger)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 9.5h4.5M8 14.5h4.5M15 9.5v5"/></svg>
                SOS instead
              </button>
            </div>
          </div>

          <div class="page-grid">
            <div class="card">
              <div class="card-head">
                <h3>New incident report</h3>
                <span class="gps-badge" id="incidentGpsBadge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg> GPS locked</span>
              </div>
              <form class="card-body" id="incidentForm">
                <div class="form-grid">
                  <div class="field">
                    <label for="incType">Incident type</label>
                    <select class="select" id="incType">
                      <option>Injured person</option>
                      <option>Hazard</option>
                      <option>Missing person</option>
                      <option>Equipment</option>
                      <option>Weather</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div class="field">
                    <label>Severity</label>
                    <div class="sev-picker" id="sevPicker">
                      <button type="button" class="sev-opt" data-sev="Low"><i></i> Low</button>
                      <button type="button" class="sev-opt" data-sev="Medium"><i></i> Medium</button>
                      <button type="button" class="sev-opt active" data-sev="High"><i></i> High</button>
                      <button type="button" class="sev-opt" data-sev="Critical"><i></i> Critical</button>
                    </div>
                    <input type="hidden" id="incSeverity" value="High">
                  </div>

                  <div class="field">
                    <label for="incLoc">Location</label>
                    <div class="input-group">
                      <input class="input" id="incLoc" placeholder="Capturing GPS…" readonly>
                      <button type="button" class="btn btn-sm" id="incLocRefresh">Refresh GPS</button>
                    </div>
                    <span class="field-hint">Coordinates are attached automatically from your live position.</span>
                  </div>

                  <div class="field">
                    <label for="incDesc">Description</label>
                    <textarea class="textarea" id="incDesc" placeholder="Describe what you see, hazards, injuries, and recommended action…" rows="5"></textarea>
                    <span class="field-hint" id="incDescCount">0 / 500 characters</span>
                  </div>

                  <div class="field">
                    <label>Attachments <span class="label-optional">(optional)</span></label>
                    <div class="row" style="gap:8px;flex-wrap:wrap">
                      <span class="chip"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg> IMG_0412</span>
                      <span class="chip"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg> IMG_0413</span>
                      <button type="button" class="chip" id="addPhoto">+ Add photo</button>
                    </div>
                    <span class="field-hint">File uploads are stubbed in this local build; photo references are saved with the report.</span>
                  </div>
                </div>

                <div class="row wrap" style="margin-top:18px;gap:8px">
                  <button class="btn btn-primary" type="submit" id="submitIncident">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                    Submit report
                  </button>
                  <button class="btn" type="button" id="saveDraft">Save draft</button>
                  <button class="btn btn-ghost" type="reset">Cancel</button>
                </div>
              </form>
            </div>

            <div class="stack">
              <div class="card">
                <div class="card-head"><h3>Auto-attached</h3></div>
                <div class="card-body" style="padding-top:8px">
                  <div class="kv-list">
                    <div class="kv"><span class="k">Reporter</span><span class="v" id="autoReporter">J. Reyes · Field Responder</span></div>
                    <div class="kv"><span class="k">Team</span><span class="v" id="autoTeam">Team Alpha</span></div>
                    <div class="kv"><span class="k">Mission</span><span class="v" id="autoMission">MSN-2026-014</span></div>
                    <div class="kv"><span class="k">Time</span><span class="v" id="autoTime">--:-- PHT</span></div>
                    <div class="kv"><span class="k">Network</span><span class="v">Online · secure channel</span></div>
                    <div class="kv"><span class="k">GPS accuracy</span><span class="v" id="autoAccuracy">±8 m</span></div>
                  </div>
                  <div class="divider" style="margin:14px 0"></div>
                  <div class="tiny uppercase muted-2" style="margin-bottom:7px">What happens next</div>
                  <p class="small muted" style="line-height:1.6;margin:0">
                    High severity notifies the duty commander immediately. Critical severity also raises an SOS alert for the nearest team.
                  </p>
                  <div class="row" style="margin-top:11px;gap:6px;flex-wrap:wrap">
                    <span class="badge badge-purple">High → notify</span>
                    <span class="badge badge-red">Critical → SOS</span>
                  </div>
                </div>
              </div>

              <div class="card">
                <div class="card-head">
                  <h3>Recent reports</h3>
                  <span class="hint">Team Alpha</span>
                </div>
                <div id="recentReports" class="side-list"></div>
              </div>
            </div>
          </div>
        </section>

        <!-- ============ SETTINGS ============ -->
        <section class="view" id="view-settings">
          <div class="view-head">
            <div>
              <div class="title-row">
                <h1>Settings</h1>
                <span class="badge badge-muted">Account</span>
              </div>
              <div class="sub">
                <span>Profile, alerts, location and privacy</span>
                <span class="sep">·</span>
                <span id="settingsClock">--:-- PHT</span>
              </div>
            </div>
          </div>

          <div class="settings-grid">
            <div class="settings-nav" id="settingsNav">
              <button class="active" data-settings="profile">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Profile
              </button>
              <button data-settings="notifications">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>
                Notifications
              </button>
              <button data-settings="privacy">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                Location &amp; privacy
              </button>
              <button data-settings="security">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Security
              </button>
            </div>

            <div>
              <div class="card settings-section" data-section="profile">
                <div class="card-head">
                  <h3>Profile</h3>
                  <span class="hint">Visible to command and your team</span>
                </div>
                <div class="card-body">
                  <div class="profile-strip">
                    <div class="avatar avatar-lg green" id="settingsAvatar">JR</div>
                    <div class="meta">
                      <div class="n" id="settingsName">J. Reyes</div>
                      <div class="r" id="settingsRole">Field Responder · Team Alpha</div>
                      <div class="row" style="margin-top:7px;gap:6px">
                        <span class="badge badge-green">Active</span>
                        <span class="badge badge-muted no-dot" id="settingsResponderId">FR-0214</span>
                      </div>
                    </div>
                  </div>
                  <form id="profileForm" class="form-grid cols-2">
                    <div class="field"><label for="profName">Full name</label><input class="input" id="profName" name="name"></div>
                    <div class="field"><label for="profPhone">Contact number</label><input class="input" id="profPhone" name="phone"></div>
                    <div class="field"><label for="profEmail">Email</label><input class="input" id="profEmail" readonly></div>
                    <div class="field"><label for="profTeam">Team</label><input class="input" id="profTeam" readonly></div>
                    <div class="field"><label for="profOrg">Organization</label><input class="input" id="profOrg" name="org"></div>
                    <div class="field"><label for="profCert">Certification</label><input class="input" id="profCert" name="cert" placeholder="e.g. Wilderness First Responder"></div>
                    <div class="field" style="grid-column:1/-1"><label for="profTitle">Role title</label><input class="input" id="profTitle" name="title"></div>
                    <div style="grid-column:1/-1"><button class="btn btn-primary" type="submit">Save profile</button></div>
                  </form>
                </div>
              </div>

              <div class="card settings-section" data-section="notifications" style="display:none">
                <div class="card-head"><h3>Notifications</h3><span class="hint">Alert behaviour</span></div>
                <div class="card-body" style="padding-top:4px">
                  <div class="setting-row">
                    <div class="s-text"><div class="s-title">SOS &amp; critical alerts</div><div class="s-desc">Always on · overrides silent mode</div></div>
                    <label class="switch"><input type="checkbox" checked disabled></label>
                  </div>
                  <div class="setting-row">
                    <div class="s-text"><div class="s-title">Check-in reminders</div><div class="s-desc">Remind me 5 minutes before each check-in window</div></div>
                    <label class="switch"><input type="checkbox" class="notif-toggle" data-notif="checkin" checked></label>
                  </div>
                  <div class="setting-row">
                    <div class="s-text"><div class="s-title">Messages from command</div><div class="s-desc">Sound and vibration for secure channel messages</div></div>
                    <label class="switch"><input type="checkbox" class="notif-toggle" data-notif="messages" checked></label>
                  </div>
                  <div class="setting-row">
                    <div class="s-text"><div class="s-title">Weather warnings</div><div class="s-desc">Rain, wind and lightning alerts for your sector</div></div>
                    <label class="switch"><input type="checkbox" class="notif-toggle" data-notif="weather" checked></label>
                  </div>
                </div>
              </div>

              <div class="card settings-section" data-section="privacy" style="display:none">
                <div class="card-head"><h3>Location &amp; privacy</h3><span class="hint">Who can see you</span></div>
                <div class="card-body" style="padding-top:4px">
                  <div class="setting-row">
                    <div class="s-text"><div class="s-title">Share location with command</div><div class="s-desc">Live during active missions · visible to command center and your team</div></div>
                    <label class="switch"><input type="checkbox" id="shareLocation" checked></label>
                  </div>
                  <div class="setting-row">
                    <div class="s-text"><div class="s-title">Background tracking</div><div class="s-desc">Keep sharing GPS while this dashboard is open in a tab</div></div>
                    <label class="switch"><input type="checkbox" id="backgroundTracking" checked></label>
                  </div>
                  <div class="setting-row">
                    <div class="s-text"><div class="s-title">Visible to</div><div class="s-desc">Command center and my team</div></div>
                    <span class="badge badge-blue">Own sector only</span>
                  </div>
                  <div class="setting-row">
                    <div class="s-text"><div class="s-title">Check-in interval</div><div class="s-desc">How often command expects a field check-in</div></div>
                    <select class="select" id="checkinInterval" style="width:130px;height:34px;font-size:12px">
                      <option value="10">Every 10 min</option>
                      <option value="15" selected>Every 15 min</option>
                      <option value="30">Every 30 min</option>
                    </select>
                  </div>
                  <div class="setting-row">
                    <div class="s-text"><div class="s-title">Offline map pack</div><div class="s-desc">Mt. Lantin · 142 MB downloaded</div></div>
                    <span class="badge badge-green">Ready</span>
                  </div>
                </div>
              </div>

              <div class="card settings-section" data-section="security" style="display:none">
                <div class="card-head"><h3>Security</h3><span class="hint">Local account</span></div>
                <div class="card-body">
                  <div class="setting-row">
                    <div class="s-text"><div class="s-title">Password</div><div class="s-desc">Hashed with PBKDF2-SHA256 (120,000 iterations) when Web Crypto is available</div></div>
                    <span class="badge badge-green">Protected</span>
                  </div>
                  <form id="passwordForm" class="form-grid" style="max-width:420px;margin-top:16px">
                    <div class="field"><label for="curPw">Current password</label><input class="input" id="curPw" type="password" autocomplete="current-password"></div>
                    <div class="form-grid cols-2">
                      <div class="field"><label for="newPw">New password</label><input class="input" id="newPw" type="password" autocomplete="new-password"></div>
                      <div class="field"><label for="confirmPw">Confirm new</label><input class="input" id="confirmPw" type="password" autocomplete="new-password"></div>
                    </div>
                    <div><button class="btn btn-primary" type="submit">Change password</button></div>
                  </form>
                  <div class="divider" style="margin:18px 0"></div>
                  <div class="setting-row">
                    <div class="s-text"><div class="s-title">Sign out everywhere</div><div class="s-desc">Clears the local session on this browser</div></div>
                    <button class="btn btn-sm" data-action="logout">Sign out</button>
                  </div>
                  <div class="kv-list" style="margin-top:14px">
                    <div class="kv"><span class="k">App version</span><span class="v">ResQCoord 2.4.1 · local build</span></div>
                    <div class="kv"><span class="k">Storage</span><span class="v" id="storageMode">IndexedDB</span></div>
                    <div class="kv"><span class="k">Session</span><span class="v">12 hours · local</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div class="status-bar">
          <div class="left">
            <span class="item"><span class="pulse-dot"></span> Live sync</span>
            <span class="item" id="footerSync">Last sync just now</span>
            <span class="item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg> GPS ready</span>
            <span class="item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> Secure channel</span>
          </div>
          <div class="row" style="gap:12px;flex-wrap:wrap">
            <span class="item" id="dataMode">Local database</span>
            <span>ResQCoord 2.4.1</span>
          </div>
        </div>
      </main>
    </div>
  </div>

  <script src="../assets/vendor/leaflet/leaflet.js"></script>
  <script src="../assets/js/util.js"></script>
  <script src="../assets/js/db.js"></script>
  <script src="../assets/js/auth.js"></script>
  <script src="../assets/js/routing.js"></script>
  <script src="../assets/js/mapkit.js"></script>
  <script src="../assets/js/tracking.js"></script>
  <script src="../assets/js/user-app.js"></script>
</body>
</html>
````

---

<a id="file-10"></a>

## 10. assets/css/base.css

**Purpose:** Design tokens, forms, buttons, cards, modals  
**Size:** 24166 bytes · **Lines:** 1402 · **SHA-256:** `D15B9B257316B3080FE099A629616F4886736340CD1C66289316C094D68A73F7`

````css
/* ============================================================
   ResQCoord — base.css
   Design tokens, reset, shared components (buttons, inputs,
   badges, cards, modal, toast, auth screens).
   ============================================================ */

:root {
  --bg: #060b12;
  --bg-2: #08101b;
  --panel: #0c1624;
  --panel-2: #101d2e;
  --panel-3: #152438;
  --line: #1b2b3f;
  --line-soft: #162334;
  --text: #e9f0f9;
  --muted: #8a9cb1;
  --muted-2: #62748a;
  --accent: #3ddc97;
  --accent-dim: rgba(61, 220, 151, 0.14);
  --accent-2: #46b8ff;
  --accent-2-dim: rgba(70, 184, 255, 0.14);
  --warn: #f7bf4f;
  --warn-dim: rgba(247, 191, 79, 0.14);
  --danger: #ff5a6a;
  --danger-dim: rgba(255, 90, 106, 0.14);
  --purple: #a78bfa;
  --purple-dim: rgba(167, 139, 250, 0.14);
  --radius: 14px;
  --radius-sm: 10px;
  --radius-lg: 20px;
  --shadow: 0 18px 40px -18px rgba(0, 0, 0, 0.85);
  --shadow-sm: 0 8px 20px -14px rgba(0, 0, 0, 0.9);
  --font: "Segoe UI", Inter, system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif;
  --mono: "Cascadia Code", "Consolas", "SFMono-Regular", ui-monospace, monospace;
  --sidebar-w: 252px;
  --topbar-h: 66px;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body {
  height: 100%;
}

body {
  margin: 0;
  font-family: var(--font);
  background: var(--bg);
  color: var(--text);
  font-size: 14px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

h1,
h2,
h3,
h4,
h5,
p {
  margin: 0;
}

h1 {
  font-size: 26px;
  letter-spacing: -0.4px;
  font-weight: 650;
}

h2 {
  font-size: 19px;
  letter-spacing: -0.2px;
  font-weight: 620;
}

h3 {
  font-size: 15px;
  font-weight: 620;
}

a {
  color: var(--accent);
  text-decoration: none;
}

a:hover {
  color: #6ff0b9;
}

button,
input,
select,
textarea {
  font: inherit;
  color: inherit;
}

button {
  cursor: pointer;
  border: 0;
  background: none;
}

ul,
ol {
  margin: 0;
  padding: 0;
  list-style: none;
}

table {
  border-collapse: collapse;
  width: 100%;
}

img {
  max-width: 100%;
}

::selection {
  background: rgba(61, 220, 151, 0.28);
}

/* Scrollbars */
* {
  scrollbar-width: thin;
  scrollbar-color: #24374e transparent;
}

*::-webkit-scrollbar {
  width: 9px;
  height: 9px;
}

*::-webkit-scrollbar-track {
  background: transparent;
}

*::-webkit-scrollbar-thumb {
  background: #24374e;
  border-radius: 20px;
  border: 2px solid transparent;
  background-clip: content-box;
}

*::-webkit-scrollbar-thumb:hover {
  background: #33506e;
  background-clip: content-box;
}

/* ---------- Brand / logo ---------- */
.brand {
  display: flex;
  align-items: center;
  gap: 11px;
  min-width: 0;
}

.brand-mark {
  width: 38px;
  height: 38px;
  flex: 0 0 auto;
  border-radius: 11px;
  background:
    radial-gradient(circle at 28% 22%, rgba(255, 255, 255, 0.38), transparent 42%),
    linear-gradient(145deg, #3ddc97 0%, #1a9f76 55%, #0d5c55 100%);
  display: grid;
  place-items: center;
  box-shadow: 0 6px 18px -8px rgba(61, 220, 151, 0.9);
  color: #04241a;
}

.brand-mark svg {
  width: 21px;
  height: 21px;
}

.brand-text {
  min-width: 0;
  line-height: 1.1;
}

.brand-name {
  font-weight: 750;
  letter-spacing: -0.3px;
  font-size: 16px;
  display: block;
  white-space: nowrap;
}

.brand-name em {
  font-style: normal;
  color: var(--accent);
}

.brand-sub {
  display: block;
  margin-top: 5px;
  font-size: 9.5px;
  letter-spacing: 2.1px;
  text-transform: uppercase;
  color: var(--muted-2);
  font-weight: 600;
  white-space: nowrap;
}

/* ---------- Buttons ---------- */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 38px;
  padding: 0 15px;
  border-radius: 10px;
  border: 1px solid var(--line);
  background: var(--panel-2);
  color: var(--text);
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  transition: background 0.15s, border-color 0.15s, transform 0.12s, color 0.15s, box-shadow 0.15s;
}

.btn:hover {
  background: var(--panel-3);
  border-color: #2a415a;
}

.btn:active {
  transform: translateY(1px);
}

.btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none;
}

.btn svg {
  width: 16px;
  height: 16px;
  flex: 0 0 auto;
}

.btn-primary {
  background: linear-gradient(180deg, #46e3a1, #2fc386);
  border-color: #46e3a1;
  color: #04241a;
  box-shadow: 0 10px 24px -14px rgba(61, 220, 151, 0.95);
}

.btn-primary:hover {
  background: linear-gradient(180deg, #63edb1, #37d493);
  border-color: #63edb1;
  color: #04241a;
}

.btn-danger {
  background: linear-gradient(180deg, #ff6070, #e83f50);
  border-color: #ff6070;
  color: #2a0409;
  box-shadow: 0 10px 24px -14px rgba(255, 90, 106, 0.9);
}

.btn-danger:hover {
  background: linear-gradient(180deg, #ff7b89, #f25262);
  border-color: #ff7b89;
  color: #2a0409;
}

.btn-ghost {
  background: transparent;
  border-color: transparent;
  color: var(--muted);
}

.btn-ghost:hover {
  background: var(--panel-2);
  color: var(--text);
  border-color: var(--line);
}

.btn-outline {
  background: transparent;
}

.btn-sm {
  height: 31px;
  padding: 0 11px;
  font-size: 12px;
  border-radius: 8px;
}

.btn-sm svg {
  width: 14px;
  height: 14px;
}

.btn-block {
  width: 100%;
}

.btn-icon {
  width: 36px;
  height: 36px;
  padding: 0;
  border-radius: 9px;
  display: grid;
  place-items: center;
  color: var(--muted);
  border: 1px solid transparent;
  background: transparent;
}

.btn-icon:hover {
  background: var(--panel-2);
  border-color: var(--line);
  color: var(--text);
}

.btn-icon svg {
  width: 18px;
  height: 18px;
}

/* ---------- Forms ---------- */
.field {
  display: flex;
  flex-direction: column;
  gap: 7px;
  min-width: 0;
}

.field > label,
.label {
  font-size: 11px;
  letter-spacing: 0.9px;
  text-transform: uppercase;
  color: var(--muted);
  font-weight: 650;
}

.label-optional {
  text-transform: none;
  letter-spacing: 0;
  color: var(--muted-2);
  font-weight: 500;
}

.input,
.select,
.textarea {
  width: 100%;
  background: #0a1522;
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 0 13px;
  height: 42px;
  color: var(--text);
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
  font-size: 13.5px;
}

.textarea {
  height: auto;
  min-height: 96px;
  padding: 11px 13px;
  resize: vertical;
  line-height: 1.55;
}

.input::placeholder,
.textarea::placeholder {
  color: #56687e;
}

.input:focus,
.select:focus,
.textarea:focus {
  border-color: rgba(61, 220, 151, 0.65);
  box-shadow: 0 0 0 3px rgba(61, 220, 151, 0.12);
  background: #0b1927;
}

.input[readonly] {
  color: var(--muted);
  background: #081220;
}

.select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%238a9cb1' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 34px;
  cursor: pointer;
}

.select option {
  background: #0c1624;
}

.input-group {
  display: flex;
  align-items: stretch;
}

.input-group .input {
  border-radius: 10px 0 0 10px;
}

.input-group .btn {
  border-radius: 0 10px 10px 0;
  border-left: 0;
}

.field-hint {
  font-size: 11.5px;
  color: var(--muted-2);
  line-height: 1.45;
}

.field-error {
  font-size: 12px;
  color: var(--danger);
  min-height: 0;
}

.form-grid {
  display: grid;
  gap: 16px;
}

.form-grid.cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.form-grid.cols-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.form-row {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.check {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
  font-size: 13px;
  color: var(--muted);
}

.check input {
  appearance: none;
  width: 17px;
  height: 17px;
  min-width: 17px;
  margin-top: 2px;
  border-radius: 5px;
  border: 1px solid #2b4058;
  background: #0a1522;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: 0.15s;
}

.check input:checked {
  background: var(--accent);
  border-color: var(--accent);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='11' viewBox='0 0 24 24' fill='none' stroke='%2304241a' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m20 6-11 11-5-5'/%3E%3C/svg%3E");
  background-position: center;
  background-repeat: no-repeat;
}

/* Toggle switch */
.switch {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 11px;
  cursor: pointer;
  font-size: 13px;
  color: var(--text);
}

.switch input {
  appearance: none;
  width: 40px;
  height: 23px;
  border-radius: 20px;
  background: #1a2b3f;
  border: 1px solid #263b52;
  position: relative;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
  flex: 0 0 auto;
}

.switch input::after {
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  width: 17px;
  height: 17px;
  border-radius: 50%;
  background: #7d8fa3;
  transition: transform 0.2s, background 0.2s;
}

.switch input:checked {
  background: rgba(61, 220, 151, 0.28);
  border-color: rgba(61, 220, 151, 0.65);
}

.switch input:checked::after {
  transform: translateX(17px);
  background: var(--accent);
}

/* ---------- Cards ---------- */
.card {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  min-width: 0;
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 15px 18px;
  border-bottom: 1px solid var(--line-soft);
  min-height: 55px;
}

.card-head h2,
.card-head h3 {
  display: flex;
  align-items: center;
  gap: 9px;
}

.card-head .hint {
  font-size: 11.5px;
  color: var(--muted-2);
}

.card-body {
  padding: 18px;
}

.card-body.tight {
  padding: 12px;
}

.card-foot {
  padding: 13px 18px;
  border-top: 1px solid var(--line-soft);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}

.section-title {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
  flex-wrap: wrap;
}

.section-title .sub {
  font-size: 12px;
  color: var(--muted-2);
  margin-top: 3px;
}

/* ---------- Badges / pills ---------- */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 23px;
  padding: 0 9px;
  border-radius: 999px;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.45px;
  text-transform: uppercase;
  background: var(--panel-3);
  color: var(--muted);
  border: 1px solid transparent;
  white-space: nowrap;
}

.badge::before {
  content: "";
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.9;
}

.badge.no-dot::before {
  display: none;
}

.badge-green {
  background: var(--accent-dim);
  color: var(--accent);
  border-color: rgba(61, 220, 151, 0.22);
}

.badge-blue {
  background: var(--accent-2-dim);
  color: var(--accent-2);
  border-color: rgba(70, 184, 255, 0.22);
}

.badge-amber {
  background: var(--warn-dim);
  color: var(--warn);
  border-color: rgba(247, 191, 79, 0.24);
}

.badge-red {
  background: var(--danger-dim);
  color: var(--danger);
  border-color: rgba(255, 90, 106, 0.26);
}

.badge-purple {
  background: var(--purple-dim);
  color: var(--purple);
  border-color: rgba(167, 139, 250, 0.24);
}

.badge-muted {
  background: rgba(138, 156, 177, 0.1);
  color: var(--muted);
  border-color: rgba(138, 156, 177, 0.16);
}

.badge-lg {
  height: 27px;
  font-size: 11px;
  padding: 0 11px;
}

.pulse-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 0 rgba(61, 220, 151, 0.65);
  animation: pulseRing 2s infinite;
  flex: 0 0 auto;
}

.pulse-dot.red {
  background: var(--danger);
  box-shadow: 0 0 0 0 rgba(255, 90, 106, 0.65);
  animation-name: pulseRingRed;
}

@keyframes pulseRing {
  0% { box-shadow: 0 0 0 0 rgba(61, 220, 151, 0.55); }
  70% { box-shadow: 0 0 0 7px rgba(61, 220, 151, 0); }
  100% { box-shadow: 0 0 0 0 rgba(61, 220, 151, 0); }
}

@keyframes pulseRingRed {
  0% { box-shadow: 0 0 0 0 rgba(255, 90, 106, 0.55); }
  70% { box-shadow: 0 0 0 9px rgba(255, 90, 106, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 90, 106, 0); }
}

/* ---------- Avatar ---------- */
.avatar {
  width: 38px;
  height: 38px;
  border-radius: 11px;
  background: linear-gradient(145deg, #1d3a52, #12283a);
  border: 1px solid #29445e;
  color: var(--accent-2);
  display: grid;
  place-items: center;
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 0.4px;
  flex: 0 0 auto;
}

.avatar-sm {
  width: 30px;
  height: 30px;
  border-radius: 9px;
  font-size: 10.5px;
}

.avatar-lg {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  font-size: 16px;
}

.avatar.green {
  color: var(--accent);
  background: linear-gradient(145deg, #143b31, #0d2925);
  border-color: #1e5141;
}

.avatar.red {
  color: var(--danger);
  background: linear-gradient(145deg, #3d1a21, #281115);
  border-color: #5a2a33;
}

/* ---------- Layout helpers ---------- */
.stack {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.row.between {
  justify-content: space-between;
}

.row.wrap {
  flex-wrap: wrap;
}

.grow {
  flex: 1 1 auto;
  min-width: 0;
}

.grid {
  display: grid;
  gap: 16px;
}

.grid-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.grid-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.grid-4 {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.muted {
  color: var(--muted);
}

.muted-2 {
  color: var(--muted-2);
}

.mono {
  font-family: var(--mono);
  font-size: 12px;
  letter-spacing: -0.2px;
}

.small {
  font-size: 12px;
}

.tiny {
  font-size: 10.5px;
}

.uppercase {
  text-transform: uppercase;
  letter-spacing: 1.1px;
  font-weight: 650;
}

.nowrap {
  white-space: nowrap;
}

.text-green { color: var(--accent); }
.text-red { color: var(--danger); }
.text-amber { color: var(--warn); }
.text-blue { color: var(--accent-2); }

.divider {
  height: 1px;
  background: var(--line-soft);
  margin: 4px 0;
}

.empty {
  padding: 26px 14px;
  text-align: center;
  color: var(--muted-2);
  font-size: 13px;
}

.empty svg {
  width: 28px;
  height: 28px;
  display: block;
  margin: 0 auto 9px;
  opacity: 0.5;
}

/* ---------- Toast ---------- */
.toast-wrap {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 9000;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 360px;
  pointer-events: none;
}

.toast {
  display: flex;
  gap: 11px;
  align-items: flex-start;
  background: #101f2f;
  border: 1px solid #273e56;
  border-left: 3px solid var(--accent);
  border-radius: 11px;
  padding: 12px 14px;
  box-shadow: 0 20px 45px -14px rgba(0, 0, 0, 0.9);
  color: var(--text);
  font-size: 13px;
  pointer-events: auto;
  animation: toastIn 0.22s ease-out;
}

.toast.error { border-left-color: var(--danger); }
.toast.warn { border-left-color: var(--warn); }
.toast.info { border-left-color: var(--accent-2); }

.toast strong {
  display: block;
  font-size: 12.5px;
  margin-bottom: 2px;
}

.toast .toast-msg {
  color: var(--muted);
  font-size: 12px;
  line-height: 1.45;
}

.toast svg {
  width: 17px;
  height: 17px;
  margin-top: 1px;
  flex: 0 0 auto;
}

.toast.out {
  animation: toastOut 0.2s ease-in forwards;
}

@keyframes toastIn {
  from { opacity: 0; transform: translateY(12px) scale(0.98); }
  to { opacity: 1; transform: none; }
}

@keyframes toastOut {
  to { opacity: 0; transform: translateY(6px); }
}

/* ---------- Modal ---------- */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(3, 8, 14, 0.76);
  backdrop-filter: blur(3px);
  z-index: 8000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  animation: fadeIn 0.15s ease-out;
}

.modal {
  background: var(--panel);
  border: 1px solid #243950;
  border-radius: 16px;
  width: min(560px, 100%);
  max-height: min(86vh, 900px);
  display: flex;
  flex-direction: column;
  box-shadow: 0 30px 80px -20px #000;
  animation: modalIn 0.18s ease-out;
}

.modal.wide {
  width: min(820px, 100%);
}

.modal-head {
  padding: 17px 20px;
  border-bottom: 1px solid var(--line-soft);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.modal-head h2 {
  font-size: 17px;
}

.modal-head .sub {
  font-size: 12px;
  color: var(--muted-2);
  margin-top: 3px;
}

.modal-body {
  padding: 20px;
  overflow: auto;
}

.modal-foot {
  padding: 14px 20px;
  border-top: 1px solid var(--line-soft);
  display: flex;
  justify-content: flex-end;
  gap: 9px;
  flex-wrap: wrap;
}

@keyframes fadeIn {
  from { opacity: 0; }
}

@keyframes modalIn {
  from { opacity: 0; transform: translateY(14px) scale(0.985); }
}

/* ---------- Auth screens ---------- */
.auth-page {
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(440px, 0.95fr);
  background:
    radial-gradient(900px 500px at 8% 0%, rgba(61, 220, 151, 0.07), transparent 60%),
    radial-gradient(700px 500px at 90% 100%, rgba(70, 184, 255, 0.06), transparent 60%),
    var(--bg);
}

.auth-brand {
  position: relative;
  padding: 42px 48px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  border-right: 1px solid var(--line-soft);
}

.auth-brand::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(61, 220, 151, 0.055) 1px, transparent 1px),
    linear-gradient(90deg, rgba(61, 220, 151, 0.055) 1px, transparent 1px);
  background-size: 54px 54px;
  mask-image: radial-gradient(ellipse at 45% 42%, #000 20%, transparent 76%);
  pointer-events: none;
}

.auth-brand::after {
  content: "";
  position: absolute;
  width: 520px;
  height: 520px;
  border-radius: 50%;
  right: -220px;
  bottom: -240px;
  background: radial-gradient(circle, rgba(61, 220, 151, 0.12), transparent 65%);
  pointer-events: none;
}

.auth-brand > * {
  position: relative;
  z-index: 1;
}

.auth-hero {
  margin: auto 0;
  padding: 44px 0;
  max-width: 530px;
}

.auth-hero .eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 10.5px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--accent);
  font-weight: 700;
  margin-bottom: 18px;
}

.auth-hero h1 {
  font-size: clamp(32px, 3.4vw, 46px);
  line-height: 1.08;
  letter-spacing: -1.6px;
  font-weight: 700;
}

.auth-hero h1 span {
  color: var(--accent);
}

.auth-hero p {
  margin-top: 18px;
  color: var(--muted);
  font-size: 14.5px;
  line-height: 1.7;
  max-width: 440px;
}

.auth-stats {
  display: flex;
  gap: 34px;
  margin-top: 38px;
  flex-wrap: wrap;
}

.auth-stat .v {
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.8px;
}

.auth-stat .v em {
  font-style: normal;
  color: var(--accent);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0;
  margin-left: 4px;
}

.auth-stat .l {
  font-size: 10px;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  color: var(--muted-2);
  margin-top: 3px;
  font-weight: 600;
}

.auth-features {
  display: flex;
  gap: 22px;
  flex-wrap: wrap;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid var(--line-soft);
}

.auth-feature {
  display: flex;
  gap: 9px;
  align-items: flex-start;
  font-size: 12px;
  color: var(--muted);
  max-width: 200px;
}

.auth-feature svg {
  width: 16px;
  height: 16px;
  color: var(--accent);
  flex: 0 0 auto;
  margin-top: 1px;
}

.auth-footer {
  display: flex;
  gap: 20px;
  align-items: center;
  font-size: 11px;
  color: var(--muted-2);
  flex-wrap: wrap;
}

.auth-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 28px;
  position: relative;
}

.auth-card {
  width: 100%;
  max-width: 408px;
}

.auth-card .brand {
  margin-bottom: 34px;
}

.auth-kicker {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 12px;
}

.auth-kicker .badge {
  height: 21px;
  font-size: 9.5px;
}

.auth-card h2 {
  font-size: 25px;
  letter-spacing: -0.6px;
}

.auth-card .lead {
  color: var(--muted);
  font-size: 13.5px;
  margin-top: 8px;
  margin-bottom: 26px;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.auth-form .btn-primary {
  height: 44px;
  margin-top: 4px;
}

.auth-alt {
  margin-top: 22px;
  text-align: center;
  font-size: 13px;
  color: var(--muted);
}

.auth-alt a {
  font-weight: 650;
}

.auth-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--muted-2);
  font-size: 10.5px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  margin: 4px 0;
}

.auth-divider::before,
.auth-divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: var(--line-soft);
}

.demo-box {
  margin-top: 20px;
  border: 1px dashed #294159;
  border-radius: 11px;
  padding: 12px 14px;
  background: rgba(12, 22, 36, 0.55);
}

.demo-box .demo-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: var(--muted-2);
  font-weight: 700;
  margin-bottom: 8px;
}

.demo-creds {
  display: grid;
  gap: 5px;
  font-family: var(--mono);
  font-size: 11.5px;
  color: var(--muted);
}

.demo-creds b {
  color: var(--text);
  font-weight: 600;
}

.auth-back {
  position: absolute;
  top: 22px;
  left: 22px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--muted);
  padding: 7px 11px;
  border-radius: 8px;
  border: 1px solid transparent;
}

.auth-back:hover {
  color: var(--text);
  background: var(--panel);
  border-color: var(--line);
}

.auth-back svg {
  width: 14px;
  height: 14px;
}

/* Role switch on login pages */
.portal-switch {
  display: flex;
  gap: 4px;
  padding: 4px;
  background: #091320;
  border: 1px solid var(--line);
  border-radius: 11px;
  margin-bottom: 22px;
}

.portal-switch a {
  flex: 1;
  text-align: center;
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 11.5px;
  font-weight: 650;
  color: var(--muted);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  transition: 0.15s;
}

.portal-switch a svg {
  width: 14px;
  height: 14px;
}

.portal-switch a:hover {
  color: var(--text);
  background: var(--panel-2);
}

.portal-switch a.active {
  background: var(--panel-3);
  color: var(--text);
  box-shadow: 0 2px 8px -4px #000;
}

.portal-switch a.active.user {
  color: var(--accent);
}

.portal-switch a.active.admin {
  color: var(--purple);
}

/* Password field */
.pw-wrap {
  position: relative;
}

.pw-wrap .input {
  padding-right: 42px;
}

.pw-toggle {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  width: 30px;
  height: 30px;
  border-radius: 7px;
  display: grid;
  place-items: center;
  color: var(--muted-2);
}

.pw-toggle:hover {
  color: var(--text);
  background: var(--panel-2);
}

.pw-toggle svg {
  width: 16px;
  height: 16px;
}

/* Strength meter */
.strength {
  display: flex;
  gap: 4px;
  margin-top: 2px;
}

.strength i {
  flex: 1;
  height: 3px;
  border-radius: 4px;
  background: #1e3045;
  transition: background 0.2s;
}

.strength[data-score="1"] i:nth-child(1) { background: var(--danger); }
.strength[data-score="2"] i:nth-child(-n+2) { background: var(--warn); }
.strength[data-score="3"] i:nth-child(-n+3) { background: var(--accent-2); }
.strength[data-score="4"] i { background: var(--accent); }

@media (max-width: 1020px) {
  .auth-page {
    grid-template-columns: 1fr;
  }
  .auth-brand {
    display: none;
  }
  .auth-panel {
    min-height: 100vh;
  }
}

@media (max-width: 720px) {
  .form-grid.cols-2,
  .form-grid.cols-3,
  .grid-2,
  .grid-3,
  .grid-4 {
    grid-template-columns: 1fr;
  }
  .auth-panel {
    padding: 26px 18px;
  }
  .toast-wrap {
    left: 14px;
    right: 14px;
    bottom: 14px;
    max-width: none;
  }
}
````

---

<a id="file-11"></a>

## 11. assets/css/app.css

**Purpose:** Dashboard, map, table, chart and admin styles  
**Size:** 41789 bytes · **Lines:** 2343 · **SHA-256:** `5A59B33DD5CB75F152B0A9B8A164191490769D10EC5C5F9D4092152ED825A388`

````css
/* ============================================================
   ResQCoord — app.css
   Dashboard shell + application components.
   ============================================================ */

/* ---------------- Shell ---------------- */
.app {
  min-height: 100vh;
  display: grid;
  grid-template-columns: var(--sidebar-w) minmax(0, 1fr);
  background:
    radial-gradient(1000px 480px at 60% -10%, rgba(61, 220, 151, 0.035), transparent 65%),
    var(--bg);
}

.sidebar {
  position: sticky;
  top: 0;
  height: 100vh;
  background: linear-gradient(180deg, #09121d, #070f19);
  border-right: 1px solid var(--line-soft);
  display: flex;
  flex-direction: column;
  z-index: 60;
}

.sidebar-head {
  padding: 20px 18px;
  border-bottom: 1px solid var(--line-soft);
}

.sidebar-scope {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-top: 14px;
  font-size: 9.5px;
  letter-spacing: 1.6px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--muted-2);
  padding: 0 2px;
}

.sidebar-scope .dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--accent);
}

.sidebar-scope.admin {
  color: rgba(167, 139, 250, 0.75);
}

.sidebar-scope.admin .dot {
  background: var(--purple);
}

.side-nav {
  flex: 1;
  overflow-y: auto;
  padding: 14px 11px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.nav-label {
  padding: 15px 10px 7px;
  font-size: 9.5px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #52657a;
  font-weight: 700;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 11px;
  height: 40px;
  padding: 0 11px;
  border-radius: 9px;
  color: var(--muted);
  font-size: 13px;
  font-weight: 550;
  position: relative;
  border: 1px solid transparent;
  transition: 0.14s;
  cursor: pointer;
}

.nav-item svg {
  width: 17px;
  height: 17px;
  flex: 0 0 auto;
  opacity: 0.9;
}

.nav-item:hover {
  background: rgba(21, 36, 56, 0.7);
  color: var(--text);
}

.nav-item.active {
  background: linear-gradient(90deg, rgba(61, 220, 151, 0.13), rgba(61, 220, 151, 0.035));
  border-color: rgba(61, 220, 151, 0.17);
  color: var(--accent);
}

.nav-item.active::before {
  content: "";
  position: absolute;
  left: -11px;
  top: 9px;
  bottom: 9px;
  width: 2px;
  border-radius: 4px;
  background: var(--accent);
}

.admin-scope .nav-item.active {
  background: linear-gradient(90deg, rgba(167, 139, 250, 0.14), rgba(167, 139, 250, 0.035));
  border-color: rgba(167, 139, 250, 0.18);
  color: var(--purple);
}

.admin-scope .nav-item.active::before {
  background: var(--purple);
}

.nav-item .count {
  margin-left: auto;
  min-width: 20px;
  height: 18px;
  padding: 0 6px;
  border-radius: 9px;
  background: var(--danger);
  color: #2a0409;
  font-size: 10px;
  font-weight: 800;
  display: grid;
  place-items: center;
}

.nav-item .count.neutral {
  background: #1d3147;
  color: var(--muted);
}

.sidebar-foot {
  border-top: 1px solid var(--line-soft);
  padding: 12px;
}

.side-user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px;
  border-radius: 10px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: 0.15s;
}

.side-user:hover {
  background: var(--panel-2);
  border-color: var(--line);
}

.side-user .meta {
  min-width: 0;
  flex: 1;
}

.side-user .name {
  font-size: 12.5px;
  font-weight: 650;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.side-user .role {
  font-size: 10.5px;
  color: var(--muted-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 1px;
}

.side-user > svg {
  width: 15px;
  height: 15px;
  color: var(--muted-2);
  flex: 0 0 auto;
}

/* ---------------- Topbar ---------------- */
.main-wrap {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.topbar {
  height: var(--topbar-h);
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 24px;
  background: rgba(7, 15, 25, 0.86);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--line-soft);
}

.topbar .crumb {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 12.5px;
  color: var(--muted-2);
  min-width: 0;
}

.topbar .crumb b {
  color: var(--text);
  font-weight: 600;
}

.topbar .crumb svg {
  width: 13px;
  height: 13px;
  opacity: 0.5;
}

.topbar-spacer {
  flex: 1;
}

.topbar-status {
  display: flex;
  align-items: center;
  gap: 18px;
  font-size: 11px;
  color: var(--muted-2);
}

.net-status {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid var(--line);
  background: #0a1421;
  font-size: 10px;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-weight: 700;
  color: var(--accent);
}

.net-status.offline {
  color: var(--danger);
}

.net-status .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.topbar-user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-left: 16px;
  border-left: 1px solid var(--line);
}

.topbar-user .meta {
  line-height: 1.25;
}

.topbar-user .name {
  font-size: 12px;
  font-weight: 650;
}

.topbar-user .role {
  font-size: 10px;
  color: var(--muted-2);
}

.sync-mini {
  font-family: var(--mono);
  font-size: 10.5px;
  color: var(--muted-2);
  display: flex;
  align-items: center;
  gap: 6px;
}

.sync-mini svg {
  width: 12px;
  height: 12px;
}

/* ---------------- Main / views ---------------- */
.main {
  padding: 24px;
  max-width: 1600px;
  width: 100%;
  margin: 0 auto;
  flex: 1;
}

.view {
  display: none;
  animation: viewIn 0.22s ease-out;
}

.view.active {
  display: block;
}

@keyframes viewIn {
  from { opacity: 0; transform: translateY(5px); }
}

.view-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.view-head .title-row {
  display: flex;
  align-items: center;
  gap: 11px;
  flex-wrap: wrap;
}

.view-head .sub {
  margin-top: 5px;
  font-size: 12.5px;
  color: var(--muted-2);
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.view-head .sub .sep {
  opacity: 0.4;
}

.view-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.page-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  gap: 16px;
  align-items: start;
}

.page-grid.wide-left {
  grid-template-columns: minmax(0, 1.6fr) minmax(300px, 0.9fr);
}

.dash-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(310px, 0.85fr);
  gap: 16px;
  align-items: start;
}

/* ---------------- KPI cards ---------------- */
.kpis {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 16px;
}

.kpi {
  background: linear-gradient(160deg, #101d2e 0%, #0c1624 65%);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 16px 17px;
  position: relative;
  overflow: hidden;
}

.kpi::after {
  content: "";
  position: absolute;
  right: -30px;
  top: -40px;
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(61, 220, 151, 0.09), transparent 68%);
  pointer-events: none;
}

.kpi .kpi-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.kpi .kpi-label {
  font-size: 9.5px;
  letter-spacing: 1.35px;
  text-transform: uppercase;
  color: var(--muted-2);
  font-weight: 700;
}

.kpi .kpi-icon {
  width: 29px;
  height: 29px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  background: rgba(61, 220, 151, 0.09);
  color: var(--accent);
  border: 1px solid rgba(61, 220, 151, 0.14);
}

.kpi .kpi-icon svg {
  width: 15px;
  height: 15px;
}

.kpi .kpi-icon.blue { background: var(--accent-2-dim); color: var(--accent-2); border-color: rgba(70, 184, 255, 0.15); }
.kpi .kpi-icon.amber { background: var(--warn-dim); color: var(--warn); border-color: rgba(247, 191, 79, 0.15); }
.kpi .kpi-icon.red { background: var(--danger-dim); color: var(--danger); border-color: rgba(255, 90, 106, 0.16); }
.kpi .kpi-icon.purple { background: var(--purple-dim); color: var(--purple); border-color: rgba(167, 139, 250, 0.16); }

.kpi .kpi-value {
  font-size: 30px;
  font-weight: 720;
  letter-spacing: -1.2px;
  margin-top: 9px;
  line-height: 1;
  display: flex;
  align-items: baseline;
  gap: 7px;
}

.kpi .kpi-value small {
  font-size: 12px;
  font-weight: 500;
  color: var(--muted-2);
  letter-spacing: 0;
}

.kpi .kpi-foot {
  margin-top: 7px;
  font-size: 11px;
  color: var(--muted-2);
  display: flex;
  align-items: center;
  gap: 6px;
}

.kpi .kpi-foot .up { color: var(--accent); font-weight: 650; }
.kpi .kpi-foot .warn { color: var(--warn); font-weight: 650; }
.kpi .kpi-foot .bad { color: var(--danger); font-weight: 650; }

/* ---------------- Map ---------------- */
.map-card {
  overflow: hidden;
}

.map-shell {
  position: relative;
  background: #0a1622;
  min-height: 320px;
}

.map-shell.tall {
  min-height: 520px;
}

.map-shell.short {
  min-height: 280px;
}

.map-shell .map {
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    linear-gradient(rgba(61, 220, 151, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(61, 220, 151, 0.04) 1px, transparent 1px),
    #0a1622;
  background-size: 44px 44px;
}

.map-overlay-head {
  position: absolute;
  z-index: 400;
  top: 12px;
  left: 12px;
  right: 12px;
  display: flex;
  justify-content: space-between;
  gap: 10px;
  pointer-events: none;
}

.map-overlay-head > * {
  pointer-events: auto;
}

.map-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(8, 18, 29, 0.9);
  border: 1px solid #22374e;
  border-radius: 9px;
  padding: 7px 11px;
  font-size: 10px;
  letter-spacing: 1.1px;
  text-transform: uppercase;
  font-weight: 700;
  color: var(--text);
  backdrop-filter: blur(8px);
  box-shadow: var(--shadow-sm);
}

.map-pill .live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--danger);
  animation: pulseRingRed 1.8s infinite;
}

.map-pill .live-dot.green {
  background: var(--accent);
  animation-name: pulseRing;
}

.map-tools {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.map-tool {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 10.5px;
  font-weight: 650;
  letter-spacing: 0.4px;
  padding: 7px 10px;
  border-radius: 8px;
  background: rgba(8, 18, 29, 0.92);
  border: 1px solid #22374e;
  color: var(--muted);
  backdrop-filter: blur(8px);
}

.map-tool:hover {
  color: var(--text);
  border-color: #33506e;
}

.map-tool.active {
  color: var(--accent);
  border-color: rgba(61, 220, 151, 0.45);
  background: rgba(13, 39, 32, 0.94);
}

.map-tool svg {
  width: 12px;
  height: 12px;
}

.map-overlay-foot {
  position: absolute;
  z-index: 400;
  bottom: 12px;
  left: 12px;
  right: 12px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  pointer-events: none;
}

.map-overlay-foot > * {
  pointer-events: auto;
}

.map-coords {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  background: rgba(8, 18, 29, 0.92);
  border: 1px solid #22374e;
  border-radius: 8px;
  padding: 6px 10px;
  font-family: var(--mono);
  font-size: 10px;
  color: var(--muted);
  backdrop-filter: blur(8px);
}

.map-coords b {
  color: var(--accent);
  font-weight: 600;
}

.map-legend {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  background: rgba(8, 18, 29, 0.92);
  border: 1px solid #22374e;
  border-radius: 8px;
  padding: 7px 11px;
  font-size: 9.5px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.7px;
  font-weight: 600;
  backdrop-filter: blur(8px);
}

.map-legend span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
}

.map-legend i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  display: inline-block;
}

.lg-onsite { background: var(--accent); }
.lg-enroute { background: var(--warn); }
.lg-standby { background: var(--accent-2); }
.lg-sos { background: var(--danger); }

.map-route-panel {
  position: absolute;
  z-index: 450;
  top: 58px;
  right: 12px;
  width: min(310px, calc(100% - 24px));
  background: rgba(9, 19, 31, 0.96);
  border: 1px solid #243b53;
  border-radius: 12px;
  box-shadow: var(--shadow);
  backdrop-filter: blur(12px);
  overflow: hidden;
}

.map-route-panel .rp-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 13px;
  border-bottom: 1px solid var(--line-soft);
  font-size: 10.5px;
  letter-spacing: 1.1px;
  text-transform: uppercase;
  font-weight: 700;
  color: var(--muted);
}

.map-route-panel .rp-body {
  padding: 12px;
  display: grid;
  gap: 9px;
}

.map-route-panel .rp-result {
  border-top: 1px solid var(--line-soft);
  padding: 11px 12px;
  display: grid;
  gap: 6px;
  font-size: 12px;
}

.rp-stat-row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  font-size: 11.5px;
  color: var(--muted);
}

.rp-stat-row b {
  color: var(--text);
  font-weight: 650;
}

.rp-steps {
  max-height: 140px;
  overflow: auto;
  border-top: 1px solid var(--line-soft);
  margin-top: 4px;
  padding-top: 8px;
  display: grid;
  gap: 7px;
  font-size: 11px;
  color: var(--muted);
}

.rp-step {
  display: flex;
  gap: 8px;
  line-height: 1.4;
}

.rp-step i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--accent-2);
  margin-top: 5px;
  flex: 0 0 auto;
}

/* Leaflet tweaks */
.leaflet-container {
  font-family: var(--font);
  background: #0a1622;
}

.leaflet-control-zoom a {
  background: #0d1a29 !important;
  color: var(--text) !important;
  border-color: #243950 !important;
}

.leaflet-control-zoom a:hover {
  background: #15283c !important;
}

.leaflet-control-attribution {
  background: rgba(8, 18, 29, 0.8) !important;
  color: #6b7f95 !important;
  font-size: 9px !important;
}

.leaflet-control-attribution a {
  color: #8fa6bd !important;
}

.leaflet-popup-content-wrapper,
.leaflet-popup-tip {
  background: #0f1e2e;
  color: var(--text);
  border: 1px solid #2a4259;
  box-shadow: 0 20px 50px -16px #000;
}

.leaflet-popup-content-wrapper {
  border-radius: 11px;
}

.leaflet-popup-content {
  margin: 12px 14px;
  font-size: 12px;
  line-height: 1.5;
  min-width: 170px;
}

.leaflet-popup-close-button {
  color: #8a9cb1 !important;
  padding: 7px 7px 0 0 !important;
}

.leaflet-popup-content b {
  color: var(--text);
}

.leaflet-tooltip {
  background: #0c1a29;
  border: 1px solid #2a4259;
  color: var(--text);
  font-size: 10.5px;
  border-radius: 7px;
  box-shadow: 0 8px 20px -10px #000;
  padding: 4px 8px;
}

.leaflet-tooltip-top::before {
  border-top-color: #2a4259;
}

/* Map markers */
.mk {
  position: relative;
  display: grid;
  place-items: center;
}

.mk-inner {
  width: 30px;
  height: 30px;
  border-radius: 50% 50% 50% 4px;
  transform: rotate(-45deg);
  display: grid;
  place-items: center;
  border: 2px solid rgba(255, 255, 255, 0.85);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.55);
  background: var(--accent);
  color: #042418;
  font-size: 10px;
  font-weight: 800;
}

.mk-inner span {
  transform: rotate(45deg);
  letter-spacing: -0.4px;
}

.mk.enroute .mk-inner { background: var(--warn); color: #2a1d00; }
.mk.standby .mk-inner { background: var(--accent-2); color: #03202e; }
.mk.sos .mk-inner { background: var(--danger); color: #2a0409; animation: markerPulse 1.25s infinite; }
.mk.me .mk-inner { background: #c4f5df; border-color: var(--accent); color: #062b1f; }

.mk.sos::after {
  content: "";
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  border: 2px solid rgba(255, 90, 106, 0.6);
  animation: ringOut 1.6s infinite;
}

@keyframes markerPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(255, 90, 106, 0.5); }
  50% { box-shadow: 0 0 0 9px rgba(255, 90, 106, 0); }
}

@keyframes ringOut {
  0% { transform: scale(0.8); opacity: 0.9; }
  100% { transform: scale(1.9); opacity: 0; }
}

.sector-label {
  font-size: 9px;
  letter-spacing: 1.6px;
  color: rgba(233, 240, 249, 0.62);
  font-weight: 700;
  text-shadow: 0 1px 6px #000, 0 0 2px #000;
  background: transparent;
  border: 0;
  box-shadow: none;
}

.sector-label::before {
  display: none;
}

/* ---------------- Team / personnel rows ---------------- */
.list {
  display: flex;
  flex-direction: column;
}

.list-row {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 11px 16px;
  border-bottom: 1px solid var(--line-soft);
  transition: background 0.12s;
  min-width: 0;
}

.list-row:last-child {
  border-bottom: 0;
}

.list-row:hover {
  background: rgba(21, 36, 56, 0.42);
}

.list-row.clickable {
  cursor: pointer;
}

.list-row .meta {
  min-width: 0;
  flex: 1;
}

.list-row .name {
  font-size: 12.5px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  gap: 7px;
}

.list-row .sub {
  font-size: 10.5px;
  color: var(--muted-2);
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.list-row .right {
  text-align: right;
  flex: 0 0 auto;
}

.team-avatar {
  width: 33px;
  height: 33px;
  border-radius: 9px;
  display: grid;
  place-items: center;
  font-size: 11px;
  font-weight: 750;
  background: #12273a;
  border: 1px solid #26455f;
  color: var(--accent-2);
  flex: 0 0 auto;
}

.team-avatar.green { background: #0e2e26; border-color: #1e5141; color: var(--accent); }
.team-avatar.amber { background: #302510; border-color: #5c451c; color: var(--warn); }
.team-avatar.red { background: #351419; border-color: #5f2630; color: var(--danger); }
.team-avatar.purple { background: #251d3d; border-color: #45336b; color: var(--purple); }

.mini-progress {
  height: 5px;
  border-radius: 5px;
  background: #182a3d;
  overflow: hidden;
  margin-top: 7px;
}

.mini-progress > i {
  display: block;
  height: 100%;
  border-radius: 5px;
  background: linear-gradient(90deg, #2fc386, #56e8a8);
}

/* ---------------- Quick actions ---------------- */
.quick-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 9px;
}

.quick-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 12px;
  border-radius: 10px;
  border: 1px solid var(--line);
  background: var(--panel-2);
  text-align: left;
  transition: 0.15s;
  min-width: 0;
}

.quick-btn:hover {
  background: var(--panel-3);
  border-color: #2d465f;
  transform: translateY(-1px);
}

.quick-btn .qi {
  width: 29px;
  height: 29px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  background: var(--accent-dim);
  color: var(--accent);
  flex: 0 0 auto;
}

.quick-btn .qi.red { background: var(--danger-dim); color: var(--danger); }
.quick-btn .qi.blue { background: var(--accent-2-dim); color: var(--accent-2); }
.quick-btn .qi.amber { background: var(--warn-dim); color: var(--warn); }
.quick-btn .qi.purple { background: var(--purple-dim); color: var(--purple); }

.quick-btn .qi svg {
  width: 15px;
  height: 15px;
}

.quick-btn b {
  display: block;
  font-size: 11.5px;
  font-weight: 650;
}

.quick-btn small {
  display: block;
  color: var(--muted-2);
  font-size: 9.5px;
  margin-top: 1px;
}

/* ---------------- Status hero (user dashboard) ---------------- */
.status-hero {
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(600px 220px at 100% -20%, rgba(61, 220, 151, 0.15), transparent 70%),
    linear-gradient(150deg, #102231, #0b1725 70%);
  border: 1px solid #1e3448;
  border-radius: var(--radius);
  padding: 20px;
}

.status-hero::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(115deg, rgba(255, 255, 255, 0.02) 0 1px, transparent 1px 16px);
  pointer-events: none;
}

.status-hero > * {
  position: relative;
}

.status-hero .sh-label {
  font-size: 9.5px;
  letter-spacing: 1.6px;
  text-transform: uppercase;
  color: var(--muted-2);
  font-weight: 700;
}

.status-hero .sh-value {
  display: flex;
  align-items: center;
  gap: 11px;
  font-size: 32px;
  font-weight: 720;
  letter-spacing: -1.2px;
  margin-top: 7px;
  line-height: 1.05;
}

.status-hero .sh-value .dot-big {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 5px rgba(61, 220, 151, 0.12);
  flex: 0 0 auto;
}

.status-hero .sh-meta {
  display: flex;
  gap: 20px;
  margin-top: 17px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  flex-wrap: wrap;
}

.status-hero .sh-meta .item {
  min-width: 0;
}

.status-hero .sh-meta .k {
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 1.3px;
  color: var(--muted-2);
  font-weight: 650;
}

.status-hero .sh-meta .v {
  font-size: 13px;
  font-weight: 650;
  margin-top: 3px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-select {
  height: 30px;
  border-radius: 7px;
  background: #0b1927;
  border: 1px solid #29425b;
  padding: 0 26px 0 9px;
  font-size: 11px;
  color: var(--text);
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%238a9cb1' stroke-width='3'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  cursor: pointer;
}

/* ---------------- Mission ---------------- */
.mission-hero {
  border-radius: var(--radius);
  border: 1px solid #243e55;
  background:
    linear-gradient(120deg, rgba(61, 220, 151, 0.09), transparent 52%),
    #0e1a28;
  padding: 20px;
}

.mission-id {
  font-family: var(--mono);
  font-size: 10.5px;
  letter-spacing: 0.8px;
  color: var(--accent);
  background: rgba(61, 220, 151, 0.08);
  border: 1px solid rgba(61, 220, 151, 0.18);
  padding: 4px 8px;
  border-radius: 6px;
}

.big-progress {
  height: 8px;
  border-radius: 8px;
  background: #172b3e;
  overflow: hidden;
}

.big-progress > i {
  display: block;
  height: 100%;
  border-radius: 8px;
  background: linear-gradient(90deg, #27b47c, #5ce8ab);
  position: relative;
  transition: width 0.5s ease;
}

.brief-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.brief-item .k {
  font-size: 9.5px;
  letter-spacing: 1.1px;
  text-transform: uppercase;
  color: var(--muted-2);
  font-weight: 700;
}

.brief-item .v {
  font-size: 12.5px;
  margin-top: 4px;
  line-height: 1.5;
}

.timeline {
  position: relative;
  padding-left: 20px;
}

.timeline::before {
  content: "";
  position: absolute;
  left: 4px;
  top: 5px;
  bottom: 8px;
  width: 1px;
  background: linear-gradient(var(--accent), #1d3348 75%, transparent);
  opacity: 0.5;
}

.tl-item {
  position: relative;
  padding: 0 0 16px;
}

.tl-item:last-child {
  padding-bottom: 0;
}

.tl-item::before {
  content: "";
  position: absolute;
  left: -20px;
  top: 4px;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--panel);
  border: 2px solid var(--accent);
  box-shadow: 0 0 0 3px rgba(61, 220, 151, 0.08);
}

.tl-item.muted::before {
  border-color: #3a5068;
  box-shadow: none;
}

.tl-time {
  font-family: var(--mono);
  font-size: 10px;
  color: var(--accent);
  letter-spacing: 0.3px;
}

.tl-item.muted .tl-time {
  color: var(--muted-2);
}

.tl-text {
  font-size: 12px;
  color: var(--muted);
  margin-top: 2px;
  line-height: 1.45;
}

.tl-text b {
  color: var(--text);
  font-weight: 600;
}

/* Checkpoints */
.checkpoint {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 11px 0;
  border-bottom: 1px solid var(--line-soft);
}

.checkpoint:last-child {
  border-bottom: 0;
}

.cp-dot {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid #2c455e;
  color: #5f7488;
  display: grid;
  place-items: center;
  font-size: 9px;
  font-weight: 800;
  flex: 0 0 auto;
  margin-top: 1px;
  background: #0b1724;
}

.checkpoint.done .cp-dot {
  background: var(--accent);
  border-color: var(--accent);
  color: #04241a;
}

.checkpoint.next .cp-dot {
  border-color: var(--accent);
  color: var(--accent);
  box-shadow: 0 0 0 4px rgba(61, 220, 151, 0.08);
}

.checkpoint .cp-name {
  font-size: 12.5px;
  font-weight: 600;
}

.checkpoint.done .cp-name {
  color: var(--muted);
  text-decoration: line-through;
  text-decoration-color: rgba(138, 156, 177, 0.4);
}

.checkpoint .cp-meta {
  font-size: 10.5px;
  color: var(--muted-2);
  margin-top: 1px;
}

/* Sector grid visualization */
.sector-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;
}

.sector-cell {
  aspect-ratio: 1;
  border-radius: 6px;
  border: 1px solid #21384f;
  background: #0c1927;
  display: grid;
  place-items: center;
  font-size: 10px;
  font-weight: 700;
  color: #4f647a;
}

.sector-cell.cleared {
  background: rgba(61, 220, 151, 0.14);
  border-color: rgba(61, 220, 151, 0.35);
  color: var(--accent);
}

.sector-cell.active {
  background: rgba(70, 184, 255, 0.13);
  border-color: rgba(70, 184, 255, 0.4);
  color: var(--accent-2);
  box-shadow: 0 0 0 3px rgba(70, 184, 255, 0.07);
}

/* ---------------- Messages ---------------- */
.msg-layout {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  min-height: 540px;
}

.msg-side {
  border-right: 1px solid var(--line-soft);
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.msg-side-head {
  padding: 13px 14px;
  border-bottom: 1px solid var(--line-soft);
}

.msg-thread {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 12px 14px;
  border-bottom: 1px solid var(--line-soft);
  cursor: pointer;
  transition: 0.12s;
  min-width: 0;
}

.msg-thread:hover {
  background: rgba(21, 36, 56, 0.45);
}

.msg-thread.active {
  background: rgba(61, 220, 151, 0.07);
  box-shadow: inset 2px 0 0 var(--accent);
}

.msg-thread .meta {
  min-width: 0;
  flex: 1;
}

.msg-thread .name {
  font-size: 12px;
  font-weight: 650;
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.msg-thread .name time {
  font-size: 9.5px;
  color: var(--muted-2);
  font-weight: 500;
  flex: 0 0 auto;
}

.msg-thread .preview {
  font-size: 10.5px;
  color: var(--muted-2);
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.msg-thread .unread {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--accent);
  flex: 0 0 auto;
  margin-top: 5px;
}

.chat {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.chat-head {
  padding: 12px 16px;
  border-bottom: 1px solid var(--line-soft);
  display: flex;
  align-items: center;
  gap: 10px;
}

.chat-head .meta {
  flex: 1;
  min-width: 0;
}

.chat-head .name {
  font-size: 12.5px;
  font-weight: 650;
}

.chat-head .sub {
  font-size: 10px;
  color: var(--muted-2);
}

.chat-body {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background:
    radial-gradient(500px 200px at 100% 0%, rgba(61, 220, 151, 0.03), transparent 70%);
  max-height: 430px;
}

.chat-date {
  text-align: center;
  font-size: 9.5px;
  color: var(--muted-2);
  letter-spacing: 0.6px;
  text-transform: uppercase;
  font-weight: 600;
}

.bubble {
  max-width: 78%;
  align-self: flex-start;
}

.bubble.me {
  align-self: flex-end;
}

.bubble .sender {
  font-size: 9.5px;
  color: var(--muted-2);
  margin-bottom: 3px;
  padding: 0 3px;
}

.bubble.me .sender {
  text-align: right;
}

.bubble .text {
  background: #112335;
  border: 1px solid #1e374d;
  padding: 9px 12px;
  border-radius: 4px 11px 11px 11px;
  font-size: 12.5px;
  line-height: 1.5;
  color: #cfe0ef;
}

.bubble.me .text {
  background: rgba(61, 220, 151, 0.11);
  border-color: rgba(61, 220, 151, 0.23);
  border-radius: 11px 4px 11px 11px;
  color: #d8f7e9;
}

.bubble .at {
  font-size: 9px;
  color: var(--muted-2);
  margin-top: 3px;
  padding: 0 3px;
}

.bubble.me .at {
  text-align: right;
}

.chat-compose {
  border-top: 1px solid var(--line-soft);
  padding: 11px;
  display: flex;
  gap: 8px;
  align-items: flex-end;
}

.chat-compose textarea {
  flex: 1;
  background: #0a1522;
  border: 1px solid var(--line);
  border-radius: 9px;
  padding: 9px 11px;
  resize: none;
  height: 40px;
  max-height: 110px;
  font-size: 12.5px;
  outline: none;
}

.chat-compose textarea:focus {
  border-color: rgba(61, 220, 151, 0.55);
}

.chat-compose .btn {
  height: 40px;
}

/* ---------------- Incident ---------------- */
.sev-picker {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 7px;
}

.sev-opt {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  padding: 9px 5px;
  border-radius: 9px;
  border: 1px solid var(--line);
  background: #0a1522;
  font-size: 11px;
  font-weight: 650;
  color: var(--muted);
  cursor: pointer;
}

.sev-opt i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  display: block;
}

.sev-opt[data-sev="Low"] i { background: var(--accent); }
.sev-opt[data-sev="Medium"] i { background: var(--warn); }
.sev-opt[data-sev="High"] i { background: #ff9e5c; }
.sev-opt[data-sev="Critical"] i { background: var(--danger); }

.sev-opt.active {
  border-color: currentColor;
  background: rgba(255, 255, 255, 0.04);
  color: var(--text);
}

.incident-card {
  border: 1px solid var(--line);
  border-radius: 11px;
  padding: 13px 14px;
  background: var(--panel-2);
  display: grid;
  gap: 7px;
}

.incident-card .ic-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}

.incident-card .ic-title {
  font-size: 12.5px;
  font-weight: 650;
  line-height: 1.35;
}

.incident-card .ic-desc {
  font-size: 11.5px;
  color: var(--muted);
  line-height: 1.5;
}

.incident-card .ic-meta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  font-size: 10px;
  color: var(--muted-2);
}

.incident-card .ic-meta span {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.incident-card .ic-meta svg {
  width: 11px;
  height: 11px;
}

/* ---------------- Tables ---------------- */
.table-wrap {
  overflow-x: auto;
}

table.data {
  font-size: 12px;
}

table.data th {
  text-align: left;
  padding: 10px 14px;
  font-size: 9px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: var(--muted-2);
  font-weight: 700;
  border-bottom: 1px solid var(--line);
  white-space: nowrap;
  background: rgba(12, 22, 36, 0.6);
}

table.data td {
  padding: 11px 14px;
  border-bottom: 1px solid var(--line-soft);
  vertical-align: middle;
  color: var(--muted);
}

table.data tbody tr:last-child td {
  border-bottom: 0;
}

table.data tbody tr:hover td {
  background: rgba(21, 36, 56, 0.36);
}

table.data td.strong {
  color: var(--text);
  font-weight: 600;
}

table.data .row-user {
  display: flex;
  align-items: center;
  gap: 9px;
  min-width: 0;
}

table.data .row-user .n {
  color: var(--text);
  font-weight: 600;
  white-space: nowrap;
}

table.data .row-user .e {
  color: var(--muted-2);
  font-size: 10px;
}

table.data td.actions {
  text-align: right;
  white-space: nowrap;
}

table.data .tbtn {
  display: inline-grid;
  place-items: center;
  width: 27px;
  height: 27px;
  border-radius: 6px;
  color: var(--muted-2);
  border: 1px solid transparent;
}

table.data .tbtn:hover {
  background: var(--panel-3);
  border-color: var(--line);
  color: var(--text);
}

table.data .tbtn svg {
  width: 13px;
  height: 13px;
}

.filters {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.filters .input,
.filters .select {
  height: 33px;
  font-size: 11.5px;
  border-radius: 8px;
}

.chip-row {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.chip {
  height: 27px;
  padding: 0 10px;
  border-radius: 7px;
  border: 1px solid var(--line);
  background: #0a1522;
  color: var(--muted);
  font-size: 10.5px;
  font-weight: 650;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.chip:hover {
  color: var(--text);
  border-color: #2a4259;
}

.chip.active {
  background: rgba(61, 220, 151, 0.11);
  border-color: rgba(61, 220, 151, 0.32);
  color: var(--accent);
}

/* ---------------- Dashboard side panels ---------------- */
.side-card .card-head {
  padding: 13px 15px;
}

.side-list {
  display: flex;
  flex-direction: column;
}

.alert-item {
  display: flex;
  gap: 10px;
  padding: 11px 15px;
  border-bottom: 1px solid var(--line-soft);
  font-size: 11.5px;
  line-height: 1.45;
}

.alert-item:last-child {
  border-bottom: 0;
}

.alert-item .ai-icon {
  width: 27px;
  height: 27px;
  border-radius: 7px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  background: var(--danger-dim);
  color: var(--danger);
}

.alert-item .ai-icon svg {
  width: 13px;
  height: 13px;
}

.alert-item .ai-icon.amber { background: var(--warn-dim); color: var(--warn); }
.alert-item .ai-icon.blue { background: var(--accent-2-dim); color: var(--accent-2); }
.alert-item .ai-icon.green { background: var(--accent-dim); color: var(--accent); }

.alert-item .ai-body {
  min-width: 0;
  flex: 1;
}

.alert-item .ai-title {
  font-weight: 600;
  color: var(--text);
}

.alert-item .ai-meta {
  color: var(--muted-2);
  font-size: 10px;
  margin-top: 2px;
}

.msg-preview {
  display: flex;
  gap: 9px;
  padding: 10px 15px;
  border-bottom: 1px solid var(--line-soft);
  font-size: 11.5px;
  line-height: 1.45;
}

.msg-preview:last-child {
  border-bottom: 0;
}

.msg-preview .mp-body {
  min-width: 0;
  flex: 1;
}

.msg-preview .mp-head {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-size: 10.5px;
  color: var(--muted-2);
}

.msg-preview .mp-head b {
  color: var(--text);
  font-weight: 600;
}

.msg-preview .mp-text {
  color: var(--muted);
  margin-top: 2px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ---------------- Settings ---------------- */
.settings-grid {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  gap: 18px;
  align-items: start;
}

.settings-nav {
  display: flex;
  flex-direction: column;
  gap: 3px;
  position: sticky;
  top: 86px;
}

.settings-nav button {
  text-align: left;
  padding: 9px 12px;
  border-radius: 8px;
  font-size: 12.5px;
  color: var(--muted);
  border: 1px solid transparent;
  display: flex;
  align-items: center;
  gap: 9px;
}

.settings-nav button svg {
  width: 14px;
  height: 14px;
}

.settings-nav button:hover {
  background: var(--panel-2);
  color: var(--text);
}

.settings-nav button.active {
  background: var(--panel-2);
  border-color: var(--line);
  color: var(--accent);
}

.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 15px 0;
  border-bottom: 1px solid var(--line-soft);
}

.setting-row:last-child {
  border-bottom: 0;
}

.setting-row .s-text {
  min-width: 0;
  max-width: 560px;
}

.setting-row .s-title {
  font-size: 12.5px;
  font-weight: 600;
}

.setting-row .s-desc {
  font-size: 11px;
  color: var(--muted-2);
  margin-top: 2px;
  line-height: 1.45;
}

.setting-row .s-desc b {
  color: var(--accent-2);
  font-weight: 600;
}

/* ---------------- Reports / charts ---------------- */
.bar-chart {
  display: flex;
  align-items: flex-end;
  gap: 9px;
  height: 150px;
  padding-top: 12px;
}

.bar-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
  height: 100%;
  justify-content: flex-end;
  min-width: 0;
}

.bar-col .bar {
  width: 100%;
  max-width: 42px;
  border-radius: 5px 5px 2px 2px;
  background: linear-gradient(180deg, rgba(61, 220, 151, 0.85), rgba(61, 220, 151, 0.22));
  min-height: 3px;
  transition: height 0.4s ease;
}

.bar-col .bar.blue { background: linear-gradient(180deg, rgba(70, 184, 255, 0.85), rgba(70, 184, 255, 0.2)); }
.bar-col .bar.amber { background: linear-gradient(180deg, rgba(247, 191, 79, 0.85), rgba(247, 191, 79, 0.18)); }
.bar-col .bar.red { background: linear-gradient(180deg, rgba(255, 90, 106, 0.85), rgba(255, 90, 106, 0.18)); }
.bar-col .bv {
  font-size: 10px;
  color: var(--muted);
  font-weight: 650;
}
.bar-col .bl {
  font-size: 9px;
  color: var(--muted-2);
  letter-spacing: 0.4px;
  text-transform: uppercase;
  white-space: nowrap;
}

.donut-wrap {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.donut {
  width: 124px;
  height: 124px;
  border-radius: 50%;
  position: relative;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
}

.donut::before {
  content: "";
  position: absolute;
  inset: 14px;
  border-radius: 50%;
  background: var(--panel);
}

.donut .donut-center {
  position: relative;
  text-align: center;
}

.donut .donut-center b {
  display: block;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.8px;
}

.donut .donut-center span {
  font-size: 8.5px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--muted-2);
}

.donut-legend {
  display: grid;
  gap: 8px;
  font-size: 11px;
  color: var(--muted);
}

.donut-legend span {
  display: flex;
  align-items: center;
  gap: 7px;
}

.donut-legend i {
  width: 7px;
  height: 7px;
  border-radius: 2px;
}

.donut-legend b {
  margin-left: auto;
  color: var(--text);
  font-weight: 650;
  padding-left: 16px;
}

/* ---------------- Misc ---------------- */
.profile-strip {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 4px 0 16px;
}

.profile-strip .meta {
  min-width: 0;
}

.profile-strip .n {
  font-size: 15px;
  font-weight: 650;
}

.profile-strip .r {
  font-size: 11.5px;
  color: var(--muted-2);
  margin-top: 2px;
}

.gps-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 9.5px;
  letter-spacing: 0.9px;
  text-transform: uppercase;
  font-weight: 700;
  color: var(--accent);
  background: var(--accent-dim);
  border: 1px solid rgba(61, 220, 151, 0.2);
  border-radius: 6px;
  padding: 4px 7px;
}

.gps-badge.searching {
  color: var(--warn);
  background: var(--warn-dim);
  border-color: rgba(247, 191, 79, 0.2);
}

.gps-badge.off {
  color: var(--muted-2);
  background: rgba(138, 156, 177, 0.08);
  border-color: rgba(138, 156, 177, 0.14);
}

.gps-badge svg {
  width: 11px;
  height: 11px;
}

.kv-list {
  display: flex;
  flex-direction: column;
}

.kv {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 8px 0;
  border-bottom: 1px solid var(--line-soft);
  font-size: 11.5px;
}

.kv:last-child {
  border-bottom: 0;
}

.kv .k {
  color: var(--muted-2);
}

.kv .v {
  color: var(--text);
  font-weight: 550;
  text-align: right;
  word-break: break-word;
}

.offline-banner {
  display: none;
  align-items: center;
  gap: 9px;
  padding: 9px 14px;
  background: rgba(247, 191, 79, 0.09);
  border-bottom: 1px solid rgba(247, 191, 79, 0.2);
  color: var(--warn);
  font-size: 11.5px;
}

.offline-banner.show {
  display: flex;
}

.offline-banner svg {
  width: 14px;
  height: 14px;
  flex: 0 0 auto;
}

.status-bar {
  margin-top: 26px;
  padding-top: 16px;
  border-top: 1px solid var(--line-soft);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  font-size: 10px;
  color: var(--muted-2);
}

.status-bar .left {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.status-bar .item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.status-bar svg {
  width: 11px;
  height: 11px;
}

.mobile-toggle {
  display: none;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* ---------------- Responsive ---------------- */
@media (max-width: 1280px) {
  .kpis {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .page-grid,
  .dash-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 1080px) {
  .app {
    grid-template-columns: 1fr;
  }
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 268px;
    transform: translateX(-102%);
    transition: transform 0.22s ease;
    box-shadow: 30px 0 60px -20px #000;
  }
  .app.sidebar-open .sidebar {
    transform: none;
  }
  .app.sidebar-open::after {
    content: "";
    position: fixed;
    inset: 0;
    background: rgba(3, 8, 14, 0.6);
    z-index: 55;
  }
  .mobile-toggle {
    display: grid;
  }
  .topbar {
    padding: 0 16px;
  }
  .main {
    padding: 18px 16px;
  }
  .topbar-status .sync-mini,
  .topbar-user .meta {
    display: none;
  }
}

@media (max-width: 900px) {
  .msg-layout {
    grid-template-columns: 1fr;
  }
  .msg-side {
    border-right: 0;
    border-bottom: 1px solid var(--line-soft);
    max-height: 260px;
    overflow: auto;
  }
  .msg-thread:nth-child(n + 5) {
    display: none;
  }
  .settings-grid {
    grid-template-columns: 1fr;
  }
  .settings-nav {
    position: static;
    flex-direction: row;
    overflow-x: auto;
  }
  .settings-nav button {
    white-space: nowrap;
  }
}

@media (max-width: 720px) {
  .kpis {
    grid-template-columns: 1fr;
  }
  .form-grid.cols-2,
  .form-grid.cols-3,
  .brief-grid {
    grid-template-columns: 1fr;
  }
  .view-head {
    flex-direction: column;
    align-items: stretch;
  }
  .topbar {
    gap: 8px;
  }
  .topbar .crumb {
    display: none;
  }
  .map-shell.tall {
    min-height: 420px;
  }
  .map-route-panel {
    top: 52px;
  }
  .map-legend {
    display: none;
  }
  .quick-grid {
    grid-template-columns: 1fr;
  }
  .status-hero .sh-value {
    font-size: 26px;
  }
  .modal-overlay {
    padding: 12px;
  }
  .modal-body {
    padding: 15px;
  }
  .main {
    padding: 15px 12px;
  }
  .topbar {
    padding: 0 12px;
  }
}
````

---

<a id="file-12"></a>

## 12. assets/img/logo.svg

**Purpose:** ResQCoord logo mark  
**Size:** 574 bytes · **Lines:** 12 · **SHA-256:** `43AF970447F3325A1E0F8BE948AF35D16C0A79029536D468D03A9E3965B8B5B7`

````xml
/* ResQCoord logo — used as favicon and inline */
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#56e8a8"/>
      <stop offset="1" stop-color="#149070"/>
    </linearGradient>
  </defs>
  <rect width="48" height="48" rx="13" fill="url(#g)"/>
  <path d="M24 9c-5 0-9 4-9 9 0 6.6 9 15 9 15s9-8.4 9-15c0-5-4-9-9-9Z" fill="#04241a"/>
  <path d="M20 18h8M20 22h8M24 18v9" stroke="#56e8a8" stroke-width="2.4" stroke-linecap="round"/>
</svg>
````

---

<a id="file-13"></a>

## 13. assets/js/util.js

**Purpose:** DOM/format helpers, icons, toasts, modals, CSV, hashing  
**Size:** 17788 bytes · **Lines:** 386 · **SHA-256:** `DB7A35A9A89A14FB2F79898189C8FCDD2A5F546AE5C2395BBDC51265C8D093CB`

````js
/* ============================================================
   ResQCoord — util.js
   Shared helpers: DOM, formatting, hashing, toasts, modals,
   icons and small utilities.
   ============================================================ */
"use strict";

const U = (() => {
  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const escapeHtml = (value) =>
    String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

  const pad = (n) => String(n).padStart(2, "0");

  const PHT = "Asia/Manila";

  const fmtTime = (date = new Date()) =>
    new Intl.DateTimeFormat("en-PH", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: PHT,
    }).format(new Date(date));

  const fmtTimeSec = (date = new Date()) =>
    new Intl.DateTimeFormat("en-PH", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: PHT,
    }).format(new Date(date));

  const fmtDate = (date = new Date()) =>
    new Intl.DateTimeFormat("en-PH", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: PHT,
    }).format(new Date(date));

  const fmtDateTime = (date = new Date()) => `${fmtDate(date)} · ${fmtTime(date)}`;

  const fmtRelative = (value) => {
    const ts = new Date(value).getTime();
    if (!Number.isFinite(ts)) return "—";
    const diff = Date.now() - ts;
    const abs = Math.abs(diff);
    const future = diff < 0;
    const units = [
      [86400000 * 7, "week"],
      [86400000, "day"],
      [3600000, "hour"],
      [60000, "minute"],
      [1000, "second"],
    ];
    for (const [ms, label] of units) {
      if (abs >= ms) {
        const n = Math.floor(abs / ms);
        return future ? `in ${n} ${label}${n > 1 ? "s" : ""}` : `${n} ${label}${n > 1 ? "s" : ""} ago`;
      }
    }
    return "just now";
  };

  const initials = (name = "") =>
    name
      .replace(/[^\p{L}\p{N}\s.]/gu, "")
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "??";

  const haversine = (a, b) => {
    const R = 6371000;
    const toRad = (d) => (d * Math.PI) / 180;
    const dLat = toRad(b[0] - a[0]);
    const dLng = toRad(b[1] - a[1]);
    const lat1 = toRad(a[0]);
    const lat2 = toRad(b[0]);
    const h =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  };

  const formatDistance = (meters) => {
    if (!Number.isFinite(meters)) return "—";
    if (meters < 1000) return `${Math.round(meters)} m`;
    return `${(meters / 1000).toFixed(meters > 10000 ? 1 : 2)} km`;
  };

  const formatDuration = (seconds) => {
    if (!Number.isFinite(seconds)) return "—";
    const m = Math.round(seconds / 60);
    if (m < 60) return `${Math.max(1, m)} min`;
    const h = Math.floor(m / 60);
    return `${h} h ${pad(m % 60)} min`;
  };

  const randomId = (prefix = "id") => {
    if (globalThis.crypto?.randomUUID) return `${prefix}_${crypto.randomUUID().slice(0, 12)}`;
    return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
  };

  const debounce = (fn, wait = 250) => {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  };

  const download = (filename, text, mime = "text/plain") => {
    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  const csvEscape = (value) => {
    const s = String(value ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };

  const toCSV = (rows) => {
    if (!rows.length) return "";
    const headers = Object.keys(rows[0]);
    return [
      headers.join(","),
      ...rows.map((row) => headers.map((h) => csvEscape(row[h])).join(",")),
    ].join("\n");
  };

  /* ---------------- Password hashing ----------------
     PBKDF2-SHA256 with 120k iterations when Web Crypto is
     available (https / localhost). A clearly-labelled fallback
     keeps the demo usable on file:// origins. */
  const toHex = (buffer) =>
    Array.from(new Uint8Array(buffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

  const fallbackHash = (input) => {
    let h1 = 5381;
    let h2 = 52711;
    for (let i = 0; i < input.length; i++) {
      const c = input.charCodeAt(i);
      h1 = (h1 * 33) ^ c;
      h2 = (h2 * 31) ^ c;
    }
    return `djb2$${(h1 >>> 0).toString(16)}${(h2 >>> 0).toString(16)}`;
  };

  const makeSalt = () => {
    const bytes = new Uint8Array(16);
    if (globalThis.crypto?.getRandomValues) crypto.getRandomValues(bytes);
    else for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
    return toHex(bytes);
  };

  const hashPassword = async (password, salt = makeSalt()) => {
    if (globalThis.crypto?.subtle) {
      try {
        const enc = new TextEncoder();
        const keyMaterial = await crypto.subtle.importKey(
          "raw",
          enc.encode(password),
          "PBKDF2",
          false,
          ["deriveBits"]
        );
        const bits = await crypto.subtle.deriveBits(
          {
            name: "PBKDF2",
            salt: enc.encode(salt),
            iterations: 120000,
            hash: "SHA-256",
          },
          keyMaterial,
          256
        );
        return { algo: "pbkdf2-sha256", salt, hash: toHex(bits) };
      } catch (err) {
        console.warn("[ResQCoord] PBKDF2 unavailable, using demo hash.", err);
      }
    }
    return { algo: "djb2-demo", salt, hash: fallbackHash(`${salt}:${password}`) };
  };

  const verifyPassword = async (password, user) => {
    if (!user?.hash || !user?.salt) return false;
    if (user.algo === "pbkdf2-sha256" && globalThis.crypto?.subtle) {
      const result = await hashPassword(password, user.salt);
      return result.hash === user.hash;
    }
    return fallbackHash(`${user.salt}:${password}`) === user.hash;
  };

  const passwordScore = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password) && password.length >= 12) score++;
    return clamp(score, 0, 4);
  };

  /* ---------------- Icons ---------------- */
  const ICONS = {
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    map: '<polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21 3 6"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    radio: '<path d="M4.9 19.1a10 10 0 0 1 0-14.2"/><path d="M7.8 16.2a6 6 0 0 1 0-8.4"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8a6 6 0 0 1 0 8.4"/><path d="M19.1 4.9a10 10 0 0 1 0 14.2"/>',
    alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    check: '<path d="m20 6-11 11-5-5"/>',
    checkCircle: '<path d="M22 11.1V12a10 10 0 1 1-5.9-9.1"/><path d="m9 11 3 3L22 4"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
    route: '<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',
    gps: '<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/>',
    message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M16 13H8M16 17H8M10 9H8"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    refresh: '<path d="M21 12a9 9 0 1 1-2.6-6.3"/><path d="M21 3v6h-6"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    eyeOff: '<path d="M9.9 4.2A9.8 9.8 0 0 1 12 4c6.5 0 10 7 10 7a17 17 0 0 1-3 4"/><path d="M6.6 6.6A17 17 0 0 0 2 11s3.5 7 10 7a9.7 9.7 0 0 0 5.4-1.6"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/><path d="m2 2 20 20"/>',
    arrowLeft: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
    arrowRight: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.6 2.8.7a2 2 0 0 1 1.7 2Z"/>',
    battery: '<rect x="2" y="7" width="16" height="10" rx="2"/><path d="M22 11v2"/>',
    wifi: '<path d="M5 12.5a10 10 0 0 1 14 0"/><path d="M8.5 16a5.5 5.5 0 0 1 7 0"/><circle cx="12" cy="19.5" r="0.5" fill="currentColor"/>',
    lock: '<rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
    trash: '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
    power: '<path d="M18.4 6.6a9 9 0 1 1-12.8 0"/><path d="M12 2v10"/>',
    sos: '<circle cx="12" cy="12" r="10"/><path d="M8 9.5h4.5M8 14.5h4.5M15 9.5v5"/>',
    cross: '<path d="M11 2h2v7h7v2h-7v7h-2v-7H4V9h7Z"/>',
    layers: '<path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>',
    close: '<path d="M18 6 6 18M6 6l12 12"/>',
    sparkles: '<path d="m12 3 1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9Z"/><path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9Z"/>',
    database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5"/><path d="M3 12c0 1.7 4 3 9 3s9-1.3 9-3"/>',
    key: '<circle cx="7.5" cy="15.5" r="4.5"/><path d="m10.7 12.3 8.8-8.8M17 6l2 2M14.5 8.5l2 2"/>',
    building: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/>',
    navigation: '<polygon points="3 11 22 2 13 21 11 13 3 11"/>',
    mountain: '<path d="m8 3 4 8 5-5 5 15H2L8 3Z"/>',
    satellite: '<path d="m13 7 4 4"/><path d="M9 3 5 7l4 4"/><path d="m15 17 4-4-4-4"/><path d="m3 21 6-6"/><path d="M14 10 10 14"/><path d="m17 21 4-4-4-4-4 4Z"/><path d="m3 7 4 4 4-4-4-4Z"/>',
    signal: '<path d="M2 20h.01M7 20v-4M12 20v-8M17 20V8M22 20V4"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/>',
    userPlus: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/>',
    eye2: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/>',
  };

  const icon = (name, cls = "") => {
    const path = ICONS[name] || ICONS.alert;
    return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
  };

  /* ---------------- Toast ---------------- */
  const ensureToastWrap = () => {
    let wrap = qs(".toast-wrap");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.className = "toast-wrap";
      document.body.appendChild(wrap);
    }
    return wrap;
  };

  const toast = (message, opts = {}) => {
    const { type = "success", title } = typeof opts === "string" ? { type: opts } : opts;
    const wrap = ensureToastWrap();
    const el = document.createElement("div");
    el.className = `toast ${type}`;
    const ic = type === "error" ? "alert" : type === "warn" ? "alert" : type === "info" ? "radio" : "checkCircle";
    el.innerHTML = `${icon(ic)}<div class="grow"><strong>${escapeHtml(
      title || (type === "error" ? "Something went wrong" : type === "warn" ? "Heads up" : type === "info" ? "Live update" : "Success")
    )}</strong><div class="toast-msg">${escapeHtml(message)}</div></div>`;
    wrap.appendChild(el);
    setTimeout(() => {
      el.classList.add("out");
      setTimeout(() => el.remove(), 220);
    }, opts.duration || 4200);
  };

  /* ---------------- Modal ---------------- */
  const modal = ({ title, subtitle = "", body = "", footer = "", wide = false, onClose = null }) => {
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.innerHTML = `
      <div class="modal ${wide ? "wide" : ""}" role="dialog" aria-modal="true">
        <div class="modal-head">
          <div><h2>${escapeHtml(title)}</h2>${subtitle ? `<div class="sub">${escapeHtml(subtitle)}</div>` : ""}</div>
          <button class="btn-icon" data-close aria-label="Close">${icon("close")}</button>
        </div>
        <div class="modal-body">${body}</div>
        ${footer ? `<div class="modal-foot">${footer}</div>` : ""}
      </div>`;
    document.body.appendChild(overlay);
    const close = () => {
      overlay.remove();
      document.removeEventListener("keydown", onKey);
      if (onClose) onClose();
    };
    const onKey = (e) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay || e.target.closest("[data-close]")) close();
    });
    return { el: overlay, close, body: qs(".modal-body", overlay), footer: qs(".modal-foot", overlay) };
  };

  const confirm = ({ title = "Confirm", message = "Are you sure?", confirmText = "Confirm", danger = false }) =>
    new Promise((resolve) => {
      const m = modal({
        title,
        body: `<p style="color:var(--muted);font-size:13px;line-height:1.65">${escapeHtml(message)}</p>`,
        footer: `<button class="btn" data-close>Cancel</button><button class="btn ${danger ? "btn-danger" : "btn-primary"}" data-ok>${escapeHtml(confirmText)}</button>`,
      });
      m.el.addEventListener("click", (e) => {
        if (e.target.closest("[data-ok]")) { resolve(true); m.close(); }
        else if (e.target.closest("[data-close]") || e.target === m.el) resolve(false);
      });
    });

  const debounceInput = debounce;

  const statusMeta = {
    onsite: { label: "On site", badge: "badge-green", css: "onsite", icon: "checkCircle" },
    enroute: { label: "En route", badge: "badge-amber", css: "enroute", icon: "navigation" },
    standby: { label: "Standby", badge: "badge-blue", css: "standby", icon: "clock" },
    sos: { label: "SOS", badge: "badge-red", css: "sos", icon: "alert" },
  };

  const severityMeta = {
    Low: { badge: "badge-green", color: "var(--accent)" },
    Medium: { badge: "badge-amber", color: "var(--warn)" },
    High: { badge: "badge-purple", color: "#ff9e5c" },
    Critical: { badge: "badge-red", color: "var(--danger)" },
  };

  const incidentStatusMeta = {
    open: { badge: "badge-red", label: "Open" },
    acknowledged: { badge: "badge-amber", label: "Acknowledged" },
    escalated: { badge: "badge-purple", label: "Escalated" },
    resolved: { badge: "badge-green", label: "Resolved" },
  };

  return {
    qs, qsa, escapeHtml, clamp, pad,
    fmtTime, fmtTimeSec, fmtDate, fmtDateTime, fmtRelative,
    initials, haversine, formatDistance, formatDuration,
    randomId, debounce, download, toCSV,
    makeSalt, hashPassword, verifyPassword, passwordScore,
    icon, ICONS, toast, modal, confirm, debounceInput,
    statusMeta, severityMeta, incidentStatusMeta,
    sleep: (ms) => new Promise((r) => setTimeout(r, ms)),
  };
})();
````

---

<a id="file-14"></a>

## 14. assets/js/db.js

**Purpose:** IndexedDB/localStorage layer and seeded demo data  
**Size:** 22976 bytes · **Lines:** 584 · **SHA-256:** `5C620FB1D2D275B3EE8CEEABB1623684B3BC41CEFF7C4A1F363304C5E3A7C419`

````js
/* ============================================================
   ResQCoord — db.js
   Local database layer. Uses IndexedDB when available, with a
   localStorage fallback so the demo also runs from file://.
   Seeds demo accounts, teams, missions, incidents and messages.
   ============================================================ */
"use strict";

const DB = (() => {
  const NAME = "resqcoord";
  const VERSION = 1;
  const LS_KEY = "resqcoord.fallback.v1";

  const STORES = {
    users: { keyPath: "id", indexes: { email: "email", role: "role" } },
    sessions: { keyPath: "token", indexes: { userId: "userId" } },
    missions: { keyPath: "id", indexes: { status: "status" } },
    teams: { keyPath: "id", indexes: { status: "status" } },
    positions: { keyPath: "id", indexes: { teamId: "teamId", ts: "ts" } },
    incidents: { keyPath: "id", indexes: { status: "status", severity: "severity" } },
    messages: { keyPath: "id", indexes: { channel: "channel", ts: "ts" } },
    checkins: { keyPath: "id", indexes: { userId: "userId" } },
    audit: { keyPath: "id", indexes: { ts: "ts" } },
    settings: { keyPath: "userId" },
  };

  const DEMO = {
    admin: { email: "admin@resqcoord.ph", password: "Admin@123" },
    user: { email: "j.reyes@resqcoord.ph", password: "User@123" },
    user2: { email: "m.santos@resqcoord.ph", password: "User@123" },
    adminCode: "RESQ-ADMIN-2026",
  };

  let db = null;
  let mode = "idb";
  let readyPromise = null;

  const hasIDB = () => {
    try {
      return typeof indexedDB !== "undefined" && indexedDB !== null;
    } catch {
      return false;
    }
  };

  /* ---------------- IndexedDB backend ---------------- */
  const openIdb = () =>
    new Promise((resolve, reject) => {
      const req = indexedDB.open(NAME, VERSION);
      req.onupgradeneeded = () => {
        const idb = req.result;
        Object.entries(STORES).forEach(([name, def]) => {
          if (idb.objectStoreNames.contains(name)) return;
          const store = idb.createObjectStore(name, { keyPath: def.keyPath });
          Object.entries(def.indexes || {}).forEach(([idx, field]) => {
            store.createIndex(idx, field, { unique: idx === "email" });
          });
        });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error || new Error("IndexedDB failed to open"));
      req.onblocked = () => reject(new Error("IndexedDB is blocked by another tab"));
    });

  const idbTx = (store, modeName = "readonly") => {
    const tx = db.transaction(store, modeName);
    return { tx, os: tx.objectStore(store) };
  };

  const idbRequest = (request) =>
    new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

  /* ---------------- localStorage fallback ---------------- */
  const lsRead = () => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      Object.keys(STORES).forEach((k) => {
        if (!Array.isArray(parsed[k])) parsed[k] = [];
      });
      return parsed;
    } catch {
      return Object.fromEntries(Object.keys(STORES).map((k) => [k, []]));
    }
  };

  const lsWrite = (data) => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(data));
    } catch (err) {
      console.error("[ResQCoord] localStorage write failed", err);
    }
  };

  /* ---------------- Public API ---------------- */
  const getAll = async (store) => {
    if (mode === "idb") {
      const { os } = idbTx(store);
      return (await idbRequest(os.getAll())) || [];
    }
    return [...lsRead()[store]];
  };

  const get = async (store, key) => {
    if (mode === "idb") {
      const { os } = idbTx(store);
      return (await idbRequest(os.get(key))) ?? null;
    }
    return lsRead()[store].find((row) => row[STORES[store].keyPath] === key) ?? null;
  };

  const put = async (store, value) => {
    if (mode === "idb") {
      const { tx, os } = idbTx(store, "readwrite");
      os.put(value);
      await new Promise((resolve, reject) => {
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error);
      });
      return value;
    }
    const data = lsRead();
    const kp = STORES[store].keyPath;
    const idx = data[store].findIndex((row) => row[kp] === value[kp]);
    if (idx >= 0) data[store][idx] = value;
    else data[store].push(value);
    lsWrite(data);
    return value;
  };

  const add = async (store, value) => put(store, value);

  const del = async (store, key) => {
    if (mode === "idb") {
      const { tx, os } = idbTx(store, "readwrite");
      os.delete(key);
      await new Promise((resolve, reject) => {
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error);
      });
      return true;
    }
    const data = lsRead();
    const kp = STORES[store].keyPath;
    data[store] = data[store].filter((row) => row[kp] !== key);
    lsWrite(data);
    return true;
  };

  const clear = async (store) => {
    if (mode === "idb") {
      const { tx, os } = idbTx(store, "readwrite");
      os.clear();
      await new Promise((resolve, reject) => {
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error);
      });
      return true;
    }
    const data = lsRead();
    data[store] = [];
    lsWrite(data);
    return true;
  };

  const count = async (store) => (await getAll(store)).length;

  const byIndex = async (store, index, value) => {
    if (mode === "idb") {
      const { os } = idbTx(store);
      return (await idbRequest(os.index(index).getAll(value))) || [];
    }
    const field = STORES[store].indexes?.[index] || index;
    return lsRead()[store].filter((row) => row[field] === value);
  };

  /* ---------------- Demo seed ---------------- */
  const minutesAgo = (n) => Date.now() - n * 60000;

  async function seed() {
    if ((await count("users")) > 0) return;

    const specs = [
      {
        id: "u_admin",
        name: "Carl R. Miller",
        email: DEMO.admin.email,
        password: DEMO.admin.password,
        role: "admin",
        title: "Administrator · Duty Commander",
        org: "Provincial Rescue Coordination Office",
        teamId: "team_command",
        team: "Command Center",
        phone: "+63 917 555 0100",
        status: "active",
        responderId: "ADM-0001",
        createdAt: minutesAgo(60 * 24 * 90),
        lastLogin: minutesAgo(12),
      },
      {
        id: "u_reyes",
        name: "J. Reyes",
        email: DEMO.user.email,
        password: DEMO.user.password,
        role: "user",
        title: "Field Responder · Team Alpha",
        org: "Provincial Rescue Coordination Office",
        teamId: "team_alpha",
        team: "Team Alpha",
        phone: "+63 917 555 4821",
        status: "active",
        responderId: "FR-0214",
        cert: "Wilderness First Responder",
        createdAt: minutesAgo(60 * 24 * 40),
        lastLogin: minutesAgo(3),
      },
      {
        id: "u_santos",
        name: "Lt. Mara Santos",
        email: DEMO.user2.email,
        password: DEMO.user.password,
        role: "user",
        title: "Mission Lead · Team Alpha",
        org: "Provincial Rescue Coordination Office",
        teamId: "team_alpha",
        team: "Team Alpha",
        phone: "+63 917 555 3390",
        status: "active",
        responderId: "FR-0101",
        cert: "Incident Command / WFR",
        createdAt: minutesAgo(60 * 24 * 120),
        lastLogin: minutesAgo(22),
      },
      {
        id: "u_delacruz",
        name: "Cpl. Dela Cruz",
        email: "d.delacruz@resqcoord.ph",
        password: DEMO.user.password,
        role: "user",
        title: "Field Responder · Team Bravo",
        org: "Provincial Rescue Coordination Office",
        teamId: "team_bravo",
        team: "Team Bravo",
        phone: "+63 917 555 7712",
        status: "active",
        responderId: "FR-0188",
        cert: "Rope Rescue Technician",
        createdAt: minutesAgo(60 * 24 * 30),
        lastLogin: minutesAgo(41),
      },
      {
        id: "u_navarro",
        name: "A. Navarro",
        email: "a.navarro@resqcoord.ph",
        password: DEMO.user.password,
        role: "user",
        title: "Field Responder · Team Charlie",
        org: "Provincial Rescue Coordination Office",
        teamId: "team_charlie",
        team: "Team Charlie",
        phone: "+63 917 555 6204",
        status: "active",
        responderId: "FR-0233",
        cert: "Mountain Rescue",
        createdAt: minutesAgo(60 * 24 * 18),
        lastLogin: minutesAgo(88),
      },
    ];

    for (const spec of specs) {
      const { password, ...rest } = spec;
      const { salt, hash, algo } = await U.hashPassword(password);
      await put("users", { ...rest, salt, hash, algo });
      await put("settings", {
        userId: spec.id,
        shareLocation: true,
        backgroundTracking: true,
        checkinMinutes: 15,
        notifications: { sos: true, checkin: true, messages: true, weather: true },
        createdAt: Date.now(),
      });
    }

    const patrolAlpha = [
      [16.3998, 120.5965], [16.4032, 120.5989], [16.4068, 120.6012],
      [16.4103, 120.6041], [16.4072, 120.6068], [16.4030, 120.6080],
      [16.4001, 120.6033], [16.3979, 120.5999],
    ];
    const patrolBravo = [
      [16.4010, 120.6070], [16.4062, 120.6088], [16.4108, 120.6072],
      [16.4088, 120.6034], [16.4040, 120.6046],
    ];
    const patrolCharlie = [
      [16.3968, 120.6015], [16.3948, 120.6042], [16.3972, 120.6064],
      [16.3992, 120.6032],
    ];
    const patrolRescue = [
      [16.4008, 120.5940], [16.4040, 120.5960], [16.4075, 120.5985],
      [16.4109, 120.6007], [16.4075, 120.5985], [16.4040, 120.5960],
    ];
    const patrolAir = [
      [16.3990, 120.5902], [16.4005, 120.5928], [16.3982, 120.5946],
      [16.3968, 120.5918],
    ];

    const teams = [
      {
        id: "team_alpha", name: "Team Alpha", short: "TA", kind: "Ground",
        status: "onsite", members: 12, lead: "Lt. Mara Santos", missionId: "msn_014",
        lat: 16.4068, lng: 120.6012, heading: 28, speed: 2.4, battery: 78,
        patrol: patrolAlpha, patrolIdx: 3, lastCheckin: minutesAgo(9),
        lastSeen: minutesAgo(1), sector: "Sector A", note: "Ridge approach",
      },
      {
        id: "team_bravo", name: "Team Bravo", short: "TB", kind: "Ground",
        status: "enroute", members: 9, lead: "Sgt. R. Ocampo", missionId: "msn_013",
        lat: 16.4062, lng: 120.6088, heading: 315, speed: 3.8, battery: 64,
        patrol: patrolBravo, patrolIdx: 2, lastCheckin: minutesAgo(4),
        lastSeen: minutesAgo(1), sector: "Sector B", note: "North spur",
      },
      {
        id: "team_charlie", name: "Team Charlie", short: "TC", kind: "Ground",
        status: "onsite", members: 8, lead: "A. Navarro", missionId: "msn_014",
        lat: 16.3972, lng: 120.6064, heading: 190, speed: 1.1, battery: 41,
        patrol: patrolCharlie, patrolIdx: 3, lastCheckin: minutesAgo(31),
        lastSeen: minutesAgo(2), sector: "Sector C", note: "Check-in overdue",
      },
      {
        id: "team_rescue12", name: "Rescue 12", short: "R12", kind: "Ground",
        status: "onsite", members: 6, lead: "F. Aquino", missionId: "msn_014",
        lat: 16.4040, lng: 120.5960, heading: 64, speed: 0, battery: 88,
        patrol: patrolRescue, patrolIdx: 1, lastCheckin: minutesAgo(6),
        lastSeen: minutesAgo(1), sector: "North spur", note: "Staging at Km 6",
      },
      {
        id: "team_air2", name: "Air Unit 2", short: "AU2", kind: "Air",
        status: "standby", members: 4, lead: "Capt. L. Bautista", missionId: null,
        lat: 16.3990, lng: 120.5902, heading: 0, speed: 0, battery: 92,
        patrol: patrolAir, patrolIdx: 0, lastCheckin: minutesAgo(14),
        lastSeen: minutesAgo(1), sector: "Helipad H2", note: "Medevac standby",
      },
    ];

    for (const team of teams) {
      await put("teams", { ...team, updatedAt: Date.now(), tracking: true });
      // Seed a short position trail behind each team.
      for (let i = 4; i >= 1; i--) {
        const base = team.patrol[Math.max(0, team.patrolIdx - i)] || team.patrol[0];
        await put("positions", {
          id: U.randomId("pos"),
          teamId: team.id,
          lat: base[0] + (Math.random() - 0.5) * 0.0006,
          lng: base[1] + (Math.random() - 0.5) * 0.0006,
          ts: minutesAgo(i * 3),
          speed: team.speed,
        });
      }
    }

    const checkpoints = [
      { name: "Trailhead", detail: "Km 0", time: "12:10", done: true },
      { name: "Creek crossing", detail: "Km 4", time: "12:52", done: true },
      { name: "North spur saddle", detail: "Km 6", time: "13:48", done: true },
      { name: "Ridge marker", detail: "Km 7.5", time: "ETA 14:50", done: false, next: true },
      { name: "Helipad H2", detail: "Evac point", time: "Pending", done: false },
    ];

    const missions = [
      {
        id: "msn_014", code: "MSN-2026-014", name: "Mt. Lantin Rescue",
        status: "In progress", priority: "High", type: "Mountain SAR",
        sector: "N-2", lead: "Lt. Mara Santos", teamId: "team_alpha",
        progress: 70, lat: 16.4103, lng: 120.6041,
        description: "Search and extraction of two lost hikers last seen on the north spur trailhead. Team Alpha is clearing grid N-2 with drone support.",
        subjects: "2 lost hikers (1 male, 1 female)",
        lastSeen: "North spur trailhead · 09:40",
        weather: "Light rain · visibility 300 m · wind 18 km/h",
        hazards: "Rockfall in Sector C · wet slopes",
        startedAt: new Date(new Date().setHours(11, 20, 0, 0)).getTime(),
        createdAt: minutesAgo(192), updatedAt: minutesAgo(4),
        checkpoints, timeline: [
          { t: "11:20", text: "Mission dispatched" },
          { t: "12:05", text: "Team Alpha on site" },
          { t: "13:40", text: "Drone scan started in sector N-2" },
          { t: "14:21", text: "2 heat signatures detected" },
          { t: "14:28", text: "Advance to ridge marker" },
        ],
        createdBy: "u_admin",
      },
      {
        id: "msn_013", code: "MSN-2026-013", name: "Kennon Road Landslide",
        status: "Monitoring", priority: "Medium", type: "Landslide response",
        sector: "Sector B", lead: "Sgt. R. Ocampo", teamId: "team_bravo",
        progress: 35, lat: 16.4108, lng: 120.6072,
        description: "Slope assessment and clearing crew protection along the Kennon corridor after overnight rainfall.",
        subjects: "Road corridor · 2 barangays",
        lastSeen: "Km 7 Kennon Road",
        weather: "Overcast · light drizzle",
        hazards: "Loose debris · unstable cut slope",
        startedAt: minutesAgo(320), createdAt: minutesAgo(330), updatedAt: minutesAgo(22),
        checkpoints: [
          { name: "Staging area", detail: "Km 5", time: "09:10", done: true },
          { name: "Slope assessment", detail: "Km 7", time: "10:05", done: true },
          { name: "Clearing operations", detail: "Km 7.4", time: "Ongoing", done: false, next: true },
          { name: "Road reopen", detail: "All lanes", time: "Pending", done: false },
        ],
        timeline: [
          { t: "09:10", text: "Bravo deployed to staging area" },
          { t: "10:05", text: "Slope assessment completed" },
          { t: "11:40", text: "Partial lane closure established" },
        ],
        createdBy: "u_admin",
      },
      {
        id: "msn_012", code: "MSN-2026-012", name: "Missing Hiker · Camp 3",
        status: "Completed", priority: "Low", type: "Search",
        sector: "Sector C", lead: "A. Navarro", teamId: "team_charlie",
        progress: 100, lat: 16.3948, lng: 120.6042,
        description: "Hiker reported overdue at Camp 3. Located safe at the creek junction and escorted to the trailhead.",
        subjects: "1 hiker",
        lastSeen: "Camp 3 junction",
        weather: "Clear",
        hazards: "None",
        startedAt: minutesAgo(1440), createdAt: minutesAgo(1500), updatedAt: minutesAgo(900),
        checkpoints: [{ name: "Camp 3", detail: "Search start", time: "08:20", done: true }],
        timeline: [
          { t: "08:20", text: "Search initiated" },
          { t: "09:55", text: "Subject located safe" },
        ],
        createdBy: "u_admin",
      },
    ];

    for (const mission of missions) await put("missions", mission);

    const incidents = [
      {
        id: "inc_001", code: "INC-0412", type: "Hazard", severity: "High",
        title: "Rockfall near Sector C", status: "escalated",
        description: "Active rockfall at the gully crossing below Km 6. Trail partially blocked. Recommend rerouting via the upper saddle.",
        lat: 16.3972, lng: 120.6015, sector: "Sector C",
        reporterId: "u_delacruz", reporterName: "Cpl. Dela Cruz", teamId: "team_bravo",
        ts: minutesAgo(87), updatedAt: minutesAgo(70), assignedTo: "Team Bravo",
      },
      {
        id: "inc_002", code: "INC-0411", type: "Equipment", severity: "Medium",
        title: "Radio battery low", status: "acknowledged",
        description: "Spare battery depleted on the primary handheld. Switching to backup channel and conserving power.",
        lat: 16.4068, lng: 120.6012, sector: "Sector A",
        reporterId: "u_reyes", reporterName: "J. Reyes", teamId: "team_alpha",
        ts: minutesAgo(61), updatedAt: minutesAgo(40),
      },
      {
        id: "inc_003", code: "INC-0410", type: "Hazard", severity: "Low",
        title: "Slippery trail section", status: "acknowledged",
        description: "Wet clay on the switchbacks above the creek. No injuries. Route marked with flagging tape.",
        lat: 16.4010, lng: 120.6005, sector: "Sector A",
        reporterId: "u_reyes", reporterName: "J. Reyes", teamId: "team_alpha",
        ts: minutesAgo(116), updatedAt: minutesAgo(100),
      },
      {
        id: "inc_004", code: "INC-0413", type: "Injured person", severity: "Critical",
        title: "Hiker with leg injury at gully", status: "open",
        description: "One hiker reported with a suspected lower-leg fracture near the gully crossing. Conscious and stable. Requesting medic and evacuation route.",
        lat: 16.4008, lng: 120.5996, sector: "Sector A · Km 6.2",
        reporterId: "u_santos", reporterName: "Lt. Mara Santos", teamId: "team_alpha",
        ts: minutesAgo(12), updatedAt: minutesAgo(12),
      },
    ];

    for (const incident of incidents) await put("incidents", incident);

    const messages = [
      {
        id: "msg_001", channel: "command", senderId: "u_admin", senderName: "Command Center",
        text: "Team Alpha, advance to ridge marker. Report on arrival.", ts: minutesAgo(8), readBy: [],
      },
      {
        id: "msg_002", channel: "command", senderId: "u_admin", senderName: "Command Center",
        text: "Drone scan found 2 heat signatures in grid N-2. Coordinates sent to your device.", ts: minutesAgo(14), readBy: ["u_reyes"],
      },
      {
        id: "msg_003", channel: "command", senderId: "u_admin", senderName: "Command Center",
        text: "Rockfall near Sector C — route flagged. Use the upper saddle detour.", ts: minutesAgo(22), readBy: ["u_reyes", "u_santos"],
      },
      {
        id: "msg_004", channel: "team:team_alpha", senderId: "u_delacruz", senderName: "Cpl. Dela Cruz",
        text: "Copy, moving out.", ts: minutesAgo(6), readBy: [],
      },
      {
        id: "msg_005", channel: "team:team_alpha", senderId: "u_santos", senderName: "Lt. Mara Santos",
        text: "Keep radio checks every 15 minutes. Weather is closing in.", ts: minutesAgo(28), readBy: [],
      },
      {
        id: "msg_006", channel: "command", senderId: "u_admin", senderName: "Command Center",
        text: "Check-in window opens 14:45. Use the Check in action when you reach the ridge.", ts: minutesAgo(35), readBy: [],
      },
      {
        id: "msg_007", channel: "team:team_alpha", senderId: "u_reyes", senderName: "J. Reyes",
        text: "Copy. Team Alpha holding at the saddle. Visual on trail marker 14.", ts: minutesAgo(18), readBy: ["u_santos"],
      },
    ];

    for (const message of messages) await put("messages", message);

    await put("checkins", {
      id: U.randomId("chk"), userId: "u_reyes", teamId: "team_alpha",
      ts: minutesAgo(35), lat: 16.4068, lng: 120.6012, note: "All clear at the saddle",
    });
    await put("checkins", {
      id: U.randomId("chk"), userId: "u_santos", teamId: "team_alpha",
      ts: minutesAgo(64), lat: 16.4032, lng: 120.5989, note: "Moving to ridge",
    });

    await put("audit", {
      id: U.randomId("aud"), ts: minutesAgo(8), actorId: "u_admin",
      actorName: "Carl R. Miller", action: "BROADCAST",
      detail: "Broadcast to all teams: advance to ridge marker",
    });
    await put("audit", {
      id: U.randomId("aud"), ts: minutesAgo(12), actorId: "u_santos",
      actorName: "Lt. Mara Santos", action: "INCIDENT",
      detail: "Reported critical incident INC-0413",
    });
  }

  const ensureReady = async () => {
    if (readyPromise) return readyPromise;
    readyPromise = (async () => {
      if (hasIDB()) {
        try {
          db = await openIdb();
          mode = "idb";
        } catch (err) {
          console.warn("[ResQCoord] IndexedDB unavailable, using localStorage fallback.", err);
          mode = "local";
        }
      } else {
        mode = "local";
      }
      await seed();
      // Remove expired sessions on boot.
      const sessions = await getAll("sessions");
      for (const session of sessions) {
        if (session.expiresAt < Date.now()) await del("sessions", session.token);
      }
      console.info(`[ResQCoord] Database ready (${mode}).`);
      return { mode };
    })();
    return readyPromise;
  };

  const reset = async () => {
    // Preserve signed-in sessions so a demo reset does not kick the
    // operator out; seeded user ids are stable, and restore() drops any
    // session whose account no longer exists or is suspended.
    const keepSessions = await getAll("sessions");
    for (const store of Object.keys(STORES)) {
      if (store === "sessions") continue;
      await clear(store);
    }
    if (mode === "local") localStorage.removeItem(LS_KEY);
    readyPromise = null;
    await ensureReady();
    for (const session of keepSessions) {
      if (session.expiresAt > Date.now()) await put("sessions", session);
    }
  };

  const exportAll = async () => {
    const snapshot = { exportedAt: new Date().toISOString(), version: VERSION, mode, data: {} };
    for (const store of Object.keys(STORES)) snapshot.data[store] = await getAll(store);
    return snapshot;
  };

  return {
    STORES, DEMO, ensureReady, getAll, get, put, add, del, clear, count, byIndex,
    reset, exportAll, get mode() { return mode; },
  };
})();
````

---

<a id="file-15"></a>

## 15. assets/js/auth.js

**Purpose:** Registration, login, sessions, role guards, audit  
**Size:** 9011 bytes · **Lines:** 247 · **SHA-256:** `E6418B0A6E4E0FF583097B97A54E7DE1D682F8ED6208977FC6A663A65042F9EC`

````js
/* ============================================================
   ResQCoord — auth.js
   Registration, login, sessions and role-based route guards.
   ============================================================ */
"use strict";

const Auth = (() => {
  const SESSION_KEY = "resqcoord.session";
  const SESSION_HOURS = 12;
  let currentUser = null;
  let currentToken = null;

  const emailOk = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

  const audit = async (actor, action, detail) => {
    await DB.put("audit", {
      id: U.randomId("aud"),
      ts: Date.now(),
      actorId: actor?.id || "system",
      actorName: actor?.name || "System",
      action,
      detail,
    });
  };

  const cleanupSession = () => {
    localStorage.removeItem(SESSION_KEY);
    currentUser = null;
    currentToken = null;
  };

  const restore = async () => {
    await DB.ensureReady();
    const token = localStorage.getItem(SESSION_KEY);
    if (!token) return null;
    const session = await DB.get("sessions", token);
    if (!session) {
      cleanupSession();
      return null;
    }
    if (session.expiresAt < Date.now()) {
      await DB.del("sessions", token);
      cleanupSession();
      return null;
    }
    const user = await DB.get("users", session.userId);
    if (!user || user.status !== "active") {
      cleanupSession();
      return null;
    }
    currentToken = token;
    currentUser = user;
    return user;
  };

  const createSession = async (user) => {
    const token = U.randomId("ses") + Math.random().toString(36).slice(2, 10);
    const session = {
      token,
      userId: user.id,
      role: user.role,
      createdAt: Date.now(),
      expiresAt: Date.now() + SESSION_HOURS * 3600 * 1000,
    };
    await DB.put("sessions", session);
    localStorage.setItem(SESSION_KEY, token);
    currentToken = token;
    currentUser = user;
    return session;
  };

  const login = async (email, password, portal = "user") => {
    await DB.ensureReady();
    email = String(email || "").trim().toLowerCase();
    if (!email || !password) return { ok: false, error: "Enter your email and password." };
    if (!emailOk(email)) return { ok: false, error: "That email address doesn't look right." };

    const users = await DB.getAll("users");
    const user = users.find((row) => row.email.toLowerCase() === email);
    if (!user) return { ok: false, error: "No account found for that email." };
    if (user.status !== "active") return { ok: false, error: "This account is suspended. Contact the command center." };

    const valid = await U.verifyPassword(password, user);
    if (!valid) return { ok: false, error: "Incorrect password. Please try again." };

    if (portal === "admin" && user.role !== "admin") {
      return { ok: false, error: "This is the admin portal. Use the responder portal to sign in." };
    }
    if (portal === "user" && user.role === "admin") {
      return { ok: false, error: "Administrators must sign in through the admin portal." };
    }

    if (currentToken) await DB.del("sessions", currentToken).catch(() => {});
    await createSession(user);
    user.lastLogin = Date.now();
    await DB.put("users", user);
    await audit(user, "LOGIN", `${portal === "admin" ? "Admin" : "Responder"} signed in`);
    return { ok: true, user };
  };

  const register = async (data, portal = "user") => {
    await DB.ensureReady();
    const name = String(data.name || "").trim();
    const email = String(data.email || "").trim().toLowerCase();
    const password = String(data.password || "");
    const confirm = String(data.confirm || "");
    const org = String(data.org || "").trim();
    const phone = String(data.phone || "").trim();
    const teamId = data.teamId || "";

    if (name.length < 2) return { ok: false, error: "Enter your full name." };
    if (!emailOk(email)) return { ok: false, error: "Enter a valid email address." };
    if (password.length < 8) return { ok: false, error: "Password must be at least 8 characters." };
    if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      return { ok: false, error: "Password must include letters and at least one number." };
    }
    if (password !== confirm) return { ok: false, error: "Passwords do not match." };

    if (portal === "admin") {
      if (!data.adminCode) return { ok: false, error: "Enter the admin access code." };
      if (String(data.adminCode).trim().toUpperCase() !== DB.DEMO.adminCode) {
        return { ok: false, error: "Invalid admin access code. Ask the duty commander for the current code." };
      }
    }

    const users = await DB.getAll("users");
    if (users.some((row) => row.email.toLowerCase() === email)) {
      return { ok: false, error: "An account with that email already exists." };
    }

    let team = null;
    if (portal === "user" && teamId) team = await DB.get("teams", teamId);

    const id = U.randomId(portal === "admin" ? "u" : "u");
    const { salt, hash, algo } = await U.hashPassword(password);
    const now = Date.now();
    const user = {
      id,
      name,
      email,
      role: portal === "admin" ? "admin" : "user",
      title:
        portal === "admin"
          ? data.title || "Administrator · Duty Commander"
          : data.title || `Field Responder · ${team?.name || "Unassigned"}`,
      org: org || "Provincial Rescue Coordination Office",
      phone,
      teamId: portal === "admin" ? "team_command" : teamId || null,
      team: portal === "admin" ? "Command Center" : team?.name || "Unassigned",
      status: "active",
      responderId:
        portal === "admin"
          ? `ADM-${String(users.filter((u) => u.role === "admin").length + 1).padStart(4, "0")}`
          : `FR-${String(200 + users.filter((u) => u.role === "user").length + 1).padStart(4, "0")}`,
      cert: data.cert || "",
      salt,
      hash,
      algo,
      createdAt: now,
      lastLogin: now,
    };

    await DB.put("users", user);
    await DB.put("settings", {
      userId: id,
      shareLocation: true,
      backgroundTracking: true,
      checkinMinutes: 15,
      notifications: { sos: true, checkin: true, messages: true, weather: true },
      createdAt: now,
    });

    if (currentToken) await DB.del("sessions", currentToken).catch(() => {});
    await createSession(user);
    await audit(user, "REGISTER", `${portal === "admin" ? "Admin" : "Responder"} account created`);
    return { ok: true, user };
  };

  const logout = async (redirectTo = null) => {
    if (currentToken) {
      await DB.del("sessions", currentToken).catch(() => {});
    }
    if (currentUser) await audit(currentUser, "LOGOUT", "Signed out of the command center");
    cleanupSession();
    if (redirectTo) location.replace(redirectTo);
  };

  const guard = async (portal) => {
    const user = await restore();
    if (!user) {
      location.replace("login.html");
      return null;
    }
    if (user.role !== portal) {
      location.replace(portal === "admin" ? "../user/dashboard.html" : "../admin/dashboard.html");
      return null;
    }
    return user;
  };

  const refresh = async () => {
    if (!currentUser) return null;
    const row = await DB.get("users", currentUser.id);
    if (row) currentUser = row;
    return currentUser;
  };

  const getTeam = async () => {
    if (!currentUser?.teamId) return null;
    return DB.get("teams", currentUser.teamId);
  };

  const updateProfile = async (patch) => {
    if (!currentUser) return { ok: false, error: "Not signed in." };
    const updated = { ...currentUser, ...patch, id: currentUser.id, role: currentUser.role, email: currentUser.email };
    await DB.put("users", updated);
    currentUser = updated;
    await audit(updated, "PROFILE", "Profile details updated");
    return { ok: true, user: updated };
  };

  const changePassword = async (currentPassword, newPassword, confirmPassword) => {
    if (!currentUser) return { ok: false, error: "Not signed in." };
    if (!(await U.verifyPassword(currentPassword, currentUser))) {
      return { ok: false, error: "Current password is incorrect." };
    }
    if (newPassword.length < 8) return { ok: false, error: "New password must be at least 8 characters." };
    if (!/[A-Za-z]/.test(newPassword) || !/\d/.test(newPassword)) {
      return { ok: false, error: "New password must include letters and a number." };
    }
    if (newPassword !== confirmPassword) return { ok: false, error: "New passwords do not match." };
    const { salt, hash, algo } = await U.hashPassword(newPassword);
    const updated = { ...currentUser, salt, hash, algo, passwordChangedAt: Date.now() };
    await DB.put("users", updated);
    currentUser = updated;
    await audit(updated, "SECURITY", "Password changed");
    return { ok: true };
  };

  return {
    restore, login, register, logout, guard, refresh, getTeam, updateProfile,
    changePassword, audit,
    get user() { return currentUser; },
    get token() { return currentToken; },
    emailOk,
  };
})();
````

---

<a id="file-16"></a>

## 16. assets/js/routing.js

**Purpose:** OSRM, Nominatim, offline routing, route playback  
**Size:** 7894 bytes · **Lines:** 217 · **SHA-256:** `65A37791EA6239074FC2C01232DE24E013D9EC67A66F160E5DB41AFA54CC3477`

````js
/* ============================================================
   ResQCoord — routing.js
   Route calculation (OSRM + offline fallback), geocoding,
   place presets and route playback for live navigation.
   ============================================================ */
"use strict";

const Routing = (() => {
  const OSRM = "https://router.project-osrm.org/route/v1/driving";
  const NOMINATIM = "https://nominatim.openstreetmap.org/search";

  const PLACES = [
    { name: "Base Camp", detail: "Command post · Mt. Lantin", lat: 16.3998, lng: 120.5965 },
    { name: "Sector A", detail: "Search grid · N-2", lat: 16.4050, lng: 120.5990 },
    { name: "Sector B", detail: "North spur approach", lat: 16.4090, lng: 120.6080 },
    { name: "Sector C", detail: "Gully crossing · rockfall", lat: 16.3972, lng: 120.6015 },
    { name: "Ridge Marker", detail: "Km 7.5 · checkpoint 4", lat: 16.4103, lng: 120.6041 },
    { name: "Helipad H2", detail: "Evacuation point", lat: 16.3990, lng: 120.5902 },
    { name: "Trailhead", detail: "Km 0 · north spur", lat: 16.3945, lng: 120.5930 },
    { name: "Creek Crossing", detail: "Km 4 · water point", lat: 16.4010, lng: 120.6005 },
    { name: "Command Post", detail: "Provincial rescue office", lat: 16.4020, lng: 120.5960 },
  ];

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const fetchJson = async (url, timeoutMs = 9000) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } finally {
      clearTimeout(timer);
    }
  };

  const bearing = (a, b) => {
    const toRad = (d) => (d * Math.PI) / 180;
    const toDeg = (r) => (r * 180) / Math.PI;
    const y = Math.sin(toRad(b[1] - a[1])) * Math.cos(toRad(b[0]));
    const x =
      Math.cos(toRad(a[0])) * Math.sin(toRad(b[0])) -
      Math.sin(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.cos(toRad(b[1] - a[1]));
    return (toDeg(Math.atan2(y, x)) + 360) % 360;
  };

  const pathDistance = (coords) => {
    let total = 0;
    for (let i = 1; i < coords.length; i++) total += U.haversine(coords[i - 1], coords[i]);
    return total;
  };

  /* Local fallback: a gently curved line so the route is visible and
     usable even when the OSRM demo server is unreachable. */
  const offlineRoute = (from, to, profile = "driving") => {
    const [lat1, lng1] = from;
    const [lat2, lng2] = to;
    const mx = (lat1 + lat2) / 2;
    const my = (lng1 + lng2) / 2;
    const dx = lat2 - lat1;
    const dy = lng2 - lng1;
    const curve = 0.16;
    const cx = mx - dy * curve;
    const cy = my + dx * curve;
    const coords = [];
    const steps = 40;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const a = (1 - t) * (1 - t);
      const b = 2 * (1 - t) * t;
      const c = t * t;
      coords.push([a * lat1 + b * cx + c * lat2, a * lng1 + b * cy + c * lng2]);
    }
    const distance = pathDistance(coords);
    const speed = profile === "foot" ? 1.15 : 7.2; // m/s
    const duration = distance / speed;
    return {
      ok: true,
      source: "offline",
      coords,
      distance,
      duration,
      steps: [
        { text: "Head out from your current position", distance: distance * 0.35 },
        { text: "Follow the marked trail toward the destination", distance: distance * 0.4 },
        { text: "Arrive at the destination waypoint", distance: distance * 0.25 },
      ],
      note: "Offline fallback route (direct path). Start the local server and connect to the internet for road routing.",
    };
  };

  const getRoute = async (from, to, profile = "driving") => {
    if (!from || !to) return { ok: false, error: "Pick both a start and a destination." };
    if (profile === "direct") {
      return offlineRoute(from, to, "foot");
    }
    const url = `${OSRM}/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson&steps=true`;
    try {
      const data = await fetchJson(url, 8500);
      if (!data.routes?.length) throw new Error("No route returned");
      const route = data.routes[0];
      const coords = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
      let steps = [];
      const leg = route.legs?.[0];
      if (leg?.steps) {
        steps = leg.steps
          .filter((s) => s.maneuver?.type !== "arrive" || true)
          .slice(0, 12)
          .map((s) => ({
            text: `${s.name ? s.name + " · " : ""}${s.maneuver?.type || "continue"}${
              s.maneuver?.modifier ? ` ${s.maneuver.modifier}` : ""
            }`,
            distance: s.distance,
          }));
      }
      return {
        ok: true,
        source: "osrm",
        coords,
        distance: route.distance,
        duration: route.duration,
        steps,
        note: "Road route via OSRM · OpenStreetMap",
      };
    } catch (err) {
      console.warn("[ResQCoord] OSRM route failed, using offline fallback.", err);
      return offlineRoute(from, to, "foot");
    }
  };

  const geocode = async (query) => {
    if (!query || query.trim().length < 3) return [];
    const url = `${NOMINATIM}?format=jsonv2&limit=6&accept-language=en&q=${encodeURIComponent(query.trim())}`;
    try {
      const rows = await fetchJson(url, 8000);
      return rows
        .filter((row) => row.lat && row.lon)
        .map((row) => ({
          name: row.name || row.display_name.split(",")[0],
          detail: row.display_name,
          lat: Number(row.lat),
          lng: Number(row.lon),
        }));
    } catch (err) {
      console.warn("[ResQCoord] Geocoding unavailable.", err);
      return [];
    }
  };

  /* Playback: walk the polyline over a fixed duration and report
     interpolated positions. Used by the "Start navigation" action. */
  const followRoute = (coords, { durationMs = 24000, onMove, onDone } = {}) => {
    if (!coords?.length) return { stop: () => {} };
    const cumulative = [0];
    for (let i = 1; i < coords.length; i++) {
      cumulative.push(cumulative[i - 1] + U.haversine(coords[i - 1], coords[i]));
    }
    const total = cumulative[cumulative.length - 1] || 1;
    const startedAt = Date.now();
    let stopped = false;

    const pointAt = (fraction) => {
      const target = U.clamp(fraction, 0, 1) * total;
      let idx = 1;
      while (idx < cumulative.length - 1 && cumulative[idx] < target) idx++;
      const segStart = cumulative[idx - 1];
      const segLen = Math.max(cumulative[idx] - segStart, 0.0001);
      const t = (target - segStart) / segLen;
      const a = coords[idx - 1];
      const b = coords[idx];
      return {
        lat: a[0] + (b[0] - a[0]) * t,
        lng: a[1] + (b[1] - a[1]) * t,
        index: idx,
        bearing: bearing(a, b),
        remaining: Math.max(total - target, 0),
      };
    };

    const timer = setInterval(() => {
      if (stopped) return;
      const fraction = U.clamp((Date.now() - startedAt) / durationMs, 0, 1);
      const point = pointAt(fraction);
      if (onMove) onMove({ ...point, progress: fraction, total });
      if (fraction >= 1) {
        clearInterval(timer);
        stopped = true;
        if (onDone) onDone();
      }
    }, 700);

    return {
      stop: () => {
        clearInterval(timer);
        stopped = true;
      },
      pointAt,
      total,
    };
  };

  const searchPlaces = (query) => {
    const q = query.trim().toLowerCase();
    if (!q) return PLACES;
    return PLACES.filter(
      (p) => p.name.toLowerCase().includes(q) || p.detail.toLowerCase().includes(q)
    );
  };

  return {
    PLACES, OSRM, getRoute, geocode, followRoute, pathDistance, bearing, searchPlaces, offlineRoute, sleep,
  };
})();
````

---

<a id="file-17"></a>

## 17. assets/js/mapkit.js

**Purpose:** Leaflet wrapper: layers, sectors, markers, trails, routes  
**Size:** 13334 bytes · **Lines:** 409 · **SHA-256:** `B3D0E9546374B9D99BE17BA370C410F6E6F5E416CD27BC1D9DE708EE66004560`

````js
/* ============================================================
   ResQCoord — mapkit.js
   Leaflet wrapper: base layers, sector overlays, team markers,
   position trails, route rendering and map interactions.
   ============================================================ */
"use strict";

const MapKit = (() => {
  const SECTORS = [
    {
      name: "SECTOR A",
      color: "#3ddc97",
      polygon: [
        [16.4055, 120.594], [16.413, 120.5965], [16.412, 120.6045],
        [16.406, 120.603], [16.4025, 120.5985],
      ],
      label: [16.4088, 120.5985],
    },
    {
      name: "SECTOR B",
      color: "#46b8ff",
      polygon: [
        [16.413, 120.604], [16.4168, 120.614], [16.4075, 120.615],
        [16.4045, 120.608], [16.406, 120.604],
      ],
      label: [16.4105, 120.6095],
    },
    {
      name: "SECTOR C",
      color: "#f7bf4f",
      polygon: [
        [16.402, 120.6], [16.404, 120.608], [16.397, 120.6125],
        [16.3915, 120.606], [16.3945, 120.5985],
      ],
      label: [16.398, 120.6045],
    },
  ];

  const BASEMAPS = {
    streets: {
      label: "Streets",
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    },
    satellite: {
      label: "Satellite",
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: "&copy; Esri · Maxar · Earthstar Geographics",
      maxZoom: 19,
    },
    terrain: {
      label: "Terrain",
      url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      attribution: "&copy; OpenTopoMap · OSM contributors",
      maxZoom: 17,
    },
  };

  const markerHtml = (team, isMe = false) => {
    const cls = isMe ? "me" : U.statusMeta[team.status]?.css || "standby";
    const label = isMe ? "YOU" : U.escapeHtml(team.short || team.name?.slice(0, 3) || "TM");
    return `<div class="mk ${cls}"><div class="mk-inner"><span>${label}</span></div></div>`;
  };

  const popupHtml = (team, isMe = false) => {
    const meta = U.statusMeta[team.status] || U.statusMeta.standby;
    return `
      <div style="min-width:172px">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px">
          <b>${U.escapeHtml(isMe ? "My location" : team.name)}</b>
          <span class="badge ${meta.badge}" style="height:19px;font-size:9px">${meta.label}</span>
        </div>
        <div style="color:#8a9cb1;margin-top:5px">${U.escapeHtml(team.sector || "Mt. Lantin area")}</div>
        <div style="display:grid;gap:2px;margin-top:7px;font-size:11px;color:#8a9cb1">
          <span><b style="color:#e9f0f9">${team.members || 1}</b> personnel</span>
          <span>Speed <b style="color:#e9f0f9">${(team.speed ?? 0).toFixed(1)} km/h</b></span>
          <span>Battery <b style="color:#e9f0f9">${team.battery ?? "—"}%</b></span>
          <span>Updated <b style="color:#e9f0f9">${U.fmtRelative(team.updatedAt || Date.now())}</b></span>
        </div>
        <div style="margin-top:7px;font-family:var(--mono);font-size:10px;color:#62748a">
          ${team.lat?.toFixed(5)}, ${team.lng?.toFixed(5)}
        </div>
      </div>`;
  };

  const create = (container, opts = {}) => {
    if (typeof L === "undefined") {
      container.innerHTML =
        '<div class="empty">Map library failed to load. Check that assets/vendor/leaflet is present.</div>';
      return null;
    }
    const map = L.map(container, {
      center: opts.center || [16.4037, 120.6012],
      zoom: opts.zoom || 14,
      zoomControl: false,
      attributionControl: true,
      preferCanvas: true,
    });

    L.control.zoom({ position: "bottomright" }).addTo(map);
    L.control.scale({ imperial: false, position: "bottomleft" }).addTo(map);

    const base = {};
    Object.entries(BASEMAPS).forEach(([key, def]) => {
      base[key] = L.tileLayer(def.url, {
        attribution: def.attribution,
        maxZoom: def.maxZoom,
        crossOrigin: true,
      });
    });
    let activeBase = opts.layers || "streets";
    base[activeBase]?.addTo(map);

    const sectorLayer = L.layerGroup().addTo(map);
    const teamLayer = L.layerGroup().addTo(map);
    const trailLayer = L.layerGroup().addTo(map);
    const routeLayer = L.layerGroup().addTo(map);
    const markerLayer = L.layerGroup().addTo(map);

    let tileErrorNotified = false;
    Object.values(base).forEach((layer) => {
      layer.on("tileerror", () => {
        if (tileErrorNotified) return;
        tileErrorNotified = true;
        if (opts.onTileError) opts.onTileError();
      });
    });

    /* Sector overlays */
    let sectorsVisible = true;
    SECTORS.forEach((sector) => {
      L.polygon(sector.polygon, {
        color: sector.color,
        weight: 1.2,
        opacity: 0.5,
        dashArray: "5 6",
        fillColor: sector.color,
        fillOpacity: 0.035,
        interactive: false,
      }).addTo(sectorLayer);
      L.marker(sector.label, {
        icon: L.divIcon({
          className: "sector-label",
          html: sector.name,
          iconSize: [90, 14],
          iconAnchor: [45, 7],
        }),
        interactive: false,
      }).addTo(sectorLayer);
    });

    const markers = new Map();
    let meMarker = null;
    let meAccuracy = null;
    let routeLine = null;
    let meTrail = null;

    const teamIcon = (team, isMe) =>
      L.divIcon({
        className: "team-marker-wrap",
        html: markerHtml(team, isMe),
        iconSize: [34, 40],
        iconAnchor: [17, 34],
        popupAnchor: [0, -30],
      });

    const hasSize = () => {
      const el = map.getContainer();
      return !!(el && el.clientWidth > 0 && el.clientHeight > 0);
    };

    const validLatLng = (lat, lng) => {
      const a = Number(lat);
      const b = Number(lng);
      return Number.isFinite(a) && Number.isFinite(b) && a >= -90 && a <= 90 && b >= -180 && b <= 180;
    };

    const addTeam = (team, isMe = false) => {
      if (!team || !validLatLng(team.lat, team.lng)) return null;
      const marker = L.marker([team.lat, team.lng], {
        icon: teamIcon(team, isMe),
        zIndexOffset: isMe ? 1000 : team.status === "sos" ? 900 : 0,
        keyboard: true,
      });
      marker.bindPopup(popupHtml(team, isMe), { closeButton: true, maxWidth: 270 });
      marker.bindTooltip(`${isMe ? "You" : team.name} · ${U.statusMeta[team.status]?.label || ""}`, {
        direction: "top",
        offset: [0, -28],
        opacity: 0.95,
      });
      marker.on("click", () => {
        if (opts.onTeamClick) opts.onTeamClick(team, isMe);
      });
      marker.addTo(teamLayer);
      if (isMe) {
        meMarker = marker;
        markers.set("me", marker);
      } else {
        markers.set(team.id, marker);
      }
      return marker;
    };

    const updateTeam = (team, isMe = false) => {
      const key = isMe ? "me" : team.id;
      if (!team || !validLatLng(team.lat, team.lng)) return;
      const marker = markers.get(key);
      if (!marker) {
        addTeam(team, isMe);
        return;
      }
      marker.setLatLng([team.lat, team.lng]);
      marker.setIcon(teamIcon(team, isMe));
      marker.setPopupContent(popupHtml(team, isMe));
      marker.setTooltipContent(`${isMe ? "You" : team.name} · ${U.statusMeta[team.status]?.label || ""}`);
      marker.setZIndexOffset(isMe ? 1000 : team.status === "sos" ? 900 : 0);
    };

    const removeTeam = (id) => {
      const marker = markers.get(id);
      if (marker) {
        marker.remove();
        markers.delete(id);
      }
    };

    const clearTeams = () => {
      markers.forEach((marker) => marker.remove());
      markers.clear();
      meMarker = null;
    };

    const setAccuracy = (lat, lng, radius) => {
      if (meAccuracy) {
        meAccuracy.setLatLng([lat, lng]).setRadius(radius);
        return;
      }
      meAccuracy = L.circle([lat, lng], {
        radius,
        color: "#3ddc97",
        weight: 1,
        opacity: 0.4,
        fillColor: "#3ddc97",
        fillOpacity: 0.08,
        interactive: false,
      }).addTo(map);
    };

    const setMyTrail = (coords) => {
      if (meTrail) {
        meTrail.setLatLngs(coords);
        return;
      }
      meTrail = L.polyline(coords, {
        color: "#3ddc97",
        weight: 2,
        opacity: 0.5,
        dashArray: "3 5",
        interactive: false,
      }).addTo(map);
    };

    const showTrail = (coords, color = "#46b8ff") => {
      trailLayer.clearLayers();
      if (!coords || coords.length < 2) return;
      L.polyline(coords, {
        color,
        weight: 2.5,
        opacity: 0.55,
        dashArray: "4 6",
        interactive: false,
      }).addTo(trailLayer);
    };

    const clearTrail = () => trailLayer.clearLayers();

    const drawRoute = (route, { fit = true } = {}) => {
      routeLayer.clearLayers();
      routeLine = null;
      if (!route?.coords?.length) return;
      const offline = route.source === "offline";
      routeLine = L.polyline(route.coords, {
        color: offline ? "#f7bf4f" : "#46b8ff",
        weight: 5,
        opacity: 0.92,
        lineJoin: "round",
        dashArray: offline ? "8 8" : null,
      }).addTo(routeLayer);
      L.polyline(route.coords, {
        color: "#04121c",
        weight: 9,
        opacity: 0.28,
        interactive: false,
      }).addTo(routeLayer).bringToBack();
      const start = route.coords[0];
      const end = route.coords[route.coords.length - 1];
      L.circleMarker(start, {
        radius: 6, color: "#3ddc97", weight: 2, fillColor: "#0b1a28", fillOpacity: 1,
      }).addTo(routeLayer).bindTooltip("Start", { direction: "top" });
      L.circleMarker(end, {
        radius: 7, color: "#46b8ff", weight: 3, fillColor: "#0b1a28", fillOpacity: 1,
      }).addTo(routeLayer).bindTooltip("Destination", { direction: "top" });
      if (fit) {
        if (!hasSize()) return;
        map.fitBounds(routeLine.getBounds(), { padding: [46, 46], maxZoom: 16 });
      }
    };

    const clearRoute = () => {
      routeLayer.clearLayers();
      routeLine = null;
    };

    const moveMe = (lat, lng, { pan = true } = {}) => {
      if (meMarker) {
        meMarker.setLatLng([lat, lng]);
        if (pan) map.panTo([lat, lng], { animate: true, duration: 0.4 });
      }
    };

    const setBaseLayer = (key) => {
      if (!base[key] || key === activeBase) return;
      map.removeLayer(base[activeBase]);
      base[key].addTo(map);
      base[key].bringToBack();
      activeBase = key;
    };

    const toggleSectors = (force) => {
      sectorsVisible = typeof force === "boolean" ? force : !sectorsVisible;
      if (sectorsVisible) sectorLayer.addTo(map);
      else map.removeLayer(sectorLayer);
      return sectorsVisible;
    };

    if (opts.onMapClick) map.on("click", (e) => opts.onMapClick(e.latlng, e));

    return {
      map,
      addTeam,
      updateTeam,
      removeTeam,
      clearTeams,
      setAccuracy,
      setMyTrail,
      showTrail,
      clearTrail,
      drawRoute,
      clearRoute,
      moveMe,
      setBaseLayer,
      toggleSectors,
      get activeBase() { return activeBase; },
      get markers() { return markers; },
      focus: (lat, lng, zoom = 16) => {
        if (!validLatLng(lat, lng)) return false;
        const a = Number(lat);
        const b = Number(lng);
        let tries = 0;
        const go = () => {
          // A hidden view has a zero-size container; projecting into it yields
          // NaN LatLngs. Wait for layout instead of calling flyTo too early.
          if (!hasSize()) {
            if (tries++ < 12) return setTimeout(go, 120);
            return false;
          }
          map.invalidateSize();
          map.flyTo([a, b], zoom, { duration: 0.7 });
          return true;
        };
        return go();
      },
      fitTeams: () => {
        if (!hasSize()) return;
        const latlngs = Array.from(markers.values()).map((m) => m.getLatLng());
        if (latlngs.length > 1) map.fitBounds(L.latLngBounds(latlngs), { padding: [50, 50], maxZoom: 16 });
      },
      addWaypoint: (lat, lng, label = "Destination") => {
        markerLayer.clearLayers();
        L.marker([lat, lng], {
          icon: L.divIcon({
            className: "team-marker-wrap",
            html: `<div class="mk standby"><div class="mk-inner"><span>◎</span></div></div>`,
            iconSize: [34, 40],
            iconAnchor: [17, 34],
          }),
        }).addTo(markerLayer).bindTooltip(label, { direction: "top", offset: [0, -28] }).openTooltip();
      },
      clearWaypoint: () => markerLayer.clearLayers(),
      addCircleAt: (lat, lng, radius = 250, color = "#f7bf4f") =>
        L.circle([lat, lng], {
          radius, color, weight: 1.5, opacity: 0.7, fillColor: color, fillOpacity: 0.08,
        }).addTo(markerLayer),
      invalidate: () => setTimeout(() => map.invalidateSize(), 60),
      fitSector: (name) => {
        const sector = SECTORS.find((s) => s.name.toLowerCase().includes(String(name).toLowerCase()));
        if (sector && hasSize()) map.fitBounds(L.latLngBounds(sector.polygon), { padding: [30, 30] });
      },
      clearAllOverlays: () => {
        clearRoute();
        clearTrail();
        markerLayer.clearLayers();
      },
    };
  };

  return { create, SECTORS, BASEMAPS };
})();
````

---

<a id="file-18"></a>

## 18. assets/js/tracking.js

**Purpose:** Simulation, GPS, demo movement, check-in, SOS  
**Size:** 14370 bytes · **Lines:** 456 · **SHA-256:** `39B09385721CC93DD71D3864FA9A9D0350F13DB965984FA048A572676F709FBE`

````js
/* ============================================================
   ResQCoord — tracking.js
   Live tracking engine: demo patrol simulation (one leader tab),
   real GPS watch, position persistence, cross-tab events,
   check-ins and SOS handling.
   ============================================================ */
"use strict";

const Tracking = (() => {
  const CHANNEL = "resqcoord.live";
  const PING_KEY = "resqcoord.ping";
  const SIM_LOCK = "resqcoord.simulation";

  let channel = null;
  try {
    channel = new BroadcastChannel(CHANNEL);
  } catch {
    channel = null;
  }

  const listeners = new Set();

  const dispatch = (message) => {
    listeners.forEach((fn) => {
      try {
        fn(message);
      } catch (err) {
        console.error("[ResQCoord] tracking listener failed", err);
      }
    });
    window.dispatchEvent(new CustomEvent("resqcoord:changed", { detail: message }));
  };

  if (channel) channel.onmessage = (event) => dispatch(event.data);

  window.addEventListener("storage", (event) => {
    if (event.key !== PING_KEY || !event.newValue) return;
    try {
      dispatch(JSON.parse(event.newValue));
    } catch {
      /* ignore malformed ping */
    }
  });

  const notify = (type, payload = {}) => {
    const message = { type, ...payload, ts: Date.now() };
    try {
      channel?.postMessage(message);
    } catch {
      /* channel closed */
    }
    try {
      localStorage.setItem(PING_KEY, JSON.stringify(message));
    } catch {
      /* storage full / private mode */
    }
    dispatch(message);
  };

  const subscribe = (fn) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
  };

  /* ---------------- Position helpers ---------------- */
  const recordPosition = async (team, source = "simulation") => {
    await DB.put("positions", {
      id: U.randomId("pos"),
      teamId: team.id,
      lat: team.lat,
      lng: team.lng,
      ts: Date.now(),
      speed: team.speed || 0,
      source,
    });
  };

  const setTeamPosition = async (teamId, lat, lng, { source = "manual", status, speed } = {}) => {
    const team = await DB.get("teams", teamId);
    if (!team) return null;
    team.lat = Number(lat);
    team.lng = Number(lng);
    team.updatedAt = Date.now();
    team.lastSeen = Date.now();
    if (status) team.status = status;
    if (typeof speed === "number") team.speed = speed;
    await DB.put("teams", team);
    await recordPosition(team, source);
    notify("teams", { teamId, source });
    return team;
  };

  const getTrail = async (teamId, limit = 40) => {
    const rows = await DB.byIndex("positions", "teamId", teamId);
    rows.sort((a, b) => a.ts - b.ts);
    return rows.slice(-limit).map((row) => [row.lat, row.lng]);
  };

  const prune = async () => {
    const rows = await DB.getAll("positions");
    const cutoff = Date.now() - 45 * 60000;
    const stale = rows.filter((row) => row.ts < cutoff);
    for (const row of stale.slice(0, 200)) await DB.del("positions", row.id);
  };

  /* ---------------- Demo simulation ----------------
     Only one tab writes team movement at a time, using the Web Locks
     API when available. Movement is accelerated for demonstration. */
  let simTimer = null;
  let simRelease = null;
  let simTick = 0;
  let simLeader = false;

  const stepTeam = async (team) => {
    if (!team.patrol?.length || team.gpsLocked) return false;
    const target = team.patrol[team.patrolIdx % team.patrol.length] || team.patrol[0];
    const to = [target[0], target[1]];
    const distance = U.haversine([team.lat, team.lng], to);
    const step = team.status === "standby" ? 6 : team.kind === "Air" ? 70 : 42;
    const heading = Routing.bearing([team.lat, team.lng], to);
    let moved = false;

    if (distance < step + 2) {
      team.lat = to[0];
      team.lng = to[1];
      team.patrolIdx = (team.patrolIdx + 1) % team.patrol.length;
      moved = true;
    } else {
      const ratio = step / distance;
      team.lat += (to[0] - team.lat) * ratio;
      team.lng += (to[1] - team.lng) * ratio;
      moved = true;
    }

    if (team.status === "standby") {
      team.speed = 0;
    } else {
      team.speed = Number((1.5 + Math.random() * 2.2).toFixed(1));
    }
    team.heading = Math.round(heading);
    team.updatedAt = Date.now();
    team.lastSeen = Date.now();
    team.battery = Math.max(15, (team.battery ?? 80) - 0.02);
    await DB.put("teams", team);
    if (simTick % 3 === 0 && moved) await recordPosition(team, "simulation");
    return moved;
  };

  const simulationTick = async () => {
    simTick++;
    const teams = await DB.getAll("teams");
    const updates = [];
    for (const team of teams) {
      const moved = await stepTeam(team);
      if (moved) updates.push(team);
    }
    // Age out stale check-ins for the admin alert panel.
    if (simTick % 20 === 0) await prune();
    if (updates.length) notify("teams", { count: updates.length, tick: simTick });
  };

  const beginInterval = (intervalMs, onTick) => {
    if (simTimer) return;
    simLeader = true;
    simTimer = setInterval(async () => {
      try {
        await simulationTick();
        if (onTick) {
          const teams = await DB.getAll("teams");
          onTick(teams);
        }
      } catch (err) {
        console.warn("[ResQCoord] Simulation tick failed", err);
      }
    }, intervalMs);
    simulationTick().catch(() => {});
  };

  const startSimulation = ({ intervalMs = 2600, onTick } = {}) => {
    if (simTimer) return Promise.resolve(true);
    if (navigator.locks?.request) {
      return new Promise((resolve) => {
        navigator.locks
          .request(SIM_LOCK, { mode: "exclusive", ifAvailable: true }, (lock) => {
            if (!lock) {
              simLeader = false;
              resolve(false);
              return Promise.resolve();
            }
            beginInterval(intervalMs, onTick);
            resolve(true);
            return new Promise((release) => {
              simRelease = release;
            });
          })
          .catch(() => {
            beginInterval(intervalMs, onTick);
            resolve(true);
          });
      });
    }
    beginInterval(intervalMs, onTick);
    return Promise.resolve(true);
  };

  const stopSimulation = () => {
    if (simTimer) clearInterval(simTimer);
    simTimer = null;
    simLeader = false;
    if (simRelease) {
      simRelease();
      simRelease = null;
    }
  };

  /* ---------------- Real GPS ---------------- */
  let watchId = null;
  let lastFix = null;
  let gpsTeamId = null;
  let gpsStatus = "off";
  let demo = null;

  const GPS_MESSAGES = {
    1: "Location permission was denied. Allow location access in the browser, or use demo movement.",
    2: "GPS position unavailable. Move to an open area and try again.",
    3: "GPS timed out. Retrying automatically while live tracking stays on.",
  };

  const startGps = ({ teamId, onFix, onError, onStatus } = {}) => {
    if (!navigator.geolocation) {
      onError?.("This browser does not support the Geolocation API.");
      return false;
    }
    if (watchId !== null) return true;
    gpsTeamId = teamId;
    gpsStatus = "searching";
    onStatus?.("searching");
    lastFix = null;

    watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude, accuracy, speed, heading } = position.coords;
        const now = Date.now();
        let calcSpeed = speed != null ? speed * 3.6 : 0;
        if ((!calcSpeed || Number.isNaN(calcSpeed)) && lastFix) {
          const dt = (now - lastFix.ts) / 1000;
          const dist = U.haversine([lastFix.lat, lastFix.lng], [latitude, longitude]);
          calcSpeed = dt > 0 ? (dist / dt) * 3.6 : 0;
        }
        lastFix = { lat: latitude, lng: longitude, ts: now, accuracy };

        const team = await DB.get("teams", teamId);
        if (team) {
          team.lat = latitude;
          team.lng = longitude;
          team.accuracy = Math.round(accuracy);
          team.speed = Number((calcSpeed || 0).toFixed(1));
          team.heading = heading != null ? Math.round(heading) : team.heading;
          team.gpsLocked = true;
          team.updatedAt = now;
          team.lastSeen = now;
          await DB.put("teams", team);
          await recordPosition(team, "gps");
          notify("teams", { teamId, source: "gps" });
        }

        gpsStatus = "live";
        onStatus?.("live", { accuracy, speed: calcSpeed });
        onFix?.({
          lat: latitude,
          lng: longitude,
          accuracy,
          speed: Number((calcSpeed || 0).toFixed(1)),
          heading,
          ts: now,
        });
      },
      (error) => {
        gpsStatus = error.code === 1 ? "denied" : "error";
        onStatus?.(gpsStatus, error);
        onError?.(GPS_MESSAGES[error.code] || "Unable to read your GPS position.", error);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 2500 }
    );

    onStatus?.("searching");
    return true;
  };

  const stopGps = async () => {
    if (watchId !== null && navigator.geolocation) navigator.geolocation.clearWatch(watchId);
    watchId = null;
    lastFix = null;
    gpsStatus = "off";
    if (gpsTeamId) {
      const team = await DB.get("teams", gpsTeamId);
      if (team) {
        team.gpsLocked = false;
        await DB.put("teams", team);
        notify("teams", { teamId: gpsTeamId, source: "gps-off" });
      }
    }
    gpsTeamId = null;
  };

  /* Demo movement for environments without a GPS fix. */
  const startDemoMovement = async ({ teamId, onFix } = {}) => {
    stopDemoMovement();
    const team = await DB.get("teams", teamId);
    if (!team) return false;
    team.gpsLocked = true;
    team.speed = 3.2;
    await DB.put("teams", team);

    demo = setInterval(async () => {
      const row = await DB.get("teams", teamId);
      if (!row?.patrol?.length) return;
      const target = row.patrol[row.patrolIdx % row.patrol.length];
      const from = [row.lat, row.lng];
      const to = [target[0], target[1]];
      const distance = U.haversine(from, to);
      const step = 32;
      let lat = to[0];
      let lng = to[1];
      if (distance > step) {
        lat = row.lat + (to[0] - row.lat) * (step / distance);
        lng = row.lng + (to[1] - row.lng) * (step / distance);
      } else {
        row.patrolIdx = (row.patrolIdx + 1) % row.patrol.length;
      }
      row.lat = lat;
      row.lng = lng;
      row.heading = Math.round(Routing.bearing(from, [lat, lng]));
      row.speed = 3.2;
      row.updatedAt = Date.now();
      row.lastSeen = Date.now();
      await DB.put("teams", row);
      await recordPosition(row, "demo");
      notify("teams", { teamId, source: "demo" });
      onFix?.({ lat, lng, accuracy: 8, speed: 3.2, source: "demo" });
    }, 2200);
    return true;
  };

  const stopDemoMovement = async () => {
    if (demo) clearInterval(demo);
    demo = null;
    if (gpsTeamId) {
      const team = await DB.get("teams", gpsTeamId);
      if (team) {
        team.gpsLocked = false;
        await DB.put("teams", team);
      }
    }
  };

  /* ---------------- Check-in / SOS ---------------- */
  const checkIn = async (user, { lat, lng, note = "", status = "onsite" } = {}) => {
    const team = await Auth.getTeam();
    const now = Date.now();
    const record = {
      id: U.randomId("chk"),
      userId: user.id,
      teamId: team?.id || null,
      ts: now,
      lat: lat ?? team?.lat ?? null,
      lng: lng ?? team?.lng ?? null,
      note,
      status,
    };
    await DB.put("checkins", record);
    if (team) {
      team.lastCheckin = now;
      if (status) team.status = status;
      await DB.put("teams", team);
    }
    await Auth.audit(user, "CHECKIN", note || "Field check-in submitted");
    notify("checkins", { teamId: team?.id, userId: user.id });
    return record;
  };

  const triggerSos = async (user, reason = "Emergency assistance requested") => {
    const team = await Auth.getTeam();
    if (!team) return null;
    team.status = "sos";
    team.sosAt = Date.now();
    team.sosReason = reason;
    await DB.put("teams", team);

    const incident = {
      id: U.randomId("inc"),
      code: `INC-${String(Math.floor(1000 + Math.random() * 9000))}`,
      type: "SOS",
      severity: "Critical",
      title: `SOS activated · ${team.name}`,
      status: "open",
      description: reason,
      lat: team.lat,
      lng: team.lng,
      sector: team.sector || "Mt. Lantin area",
      reporterId: user.id,
      reporterName: user.name,
      teamId: team.id,
      ts: Date.now(),
      updatedAt: Date.now(),
    };
    await DB.put("incidents", incident);

    await DB.put("messages", {
      id: U.randomId("msg"),
      channel: "command",
      senderId: user.id,
      senderName: `${user.name} · ${team.name}`,
      text: `SOS · ${reason}`,
      ts: Date.now(),
      readBy: [],
      sos: true,
    });
    await Auth.audit(user, "SOS", `${team.name}: ${reason}`);
    notify("sos", { teamId: team.id, incidentId: incident.id });
    return { team, incident };
  };

  const clearSos = async (teamId, actor) => {
    const team = await DB.get("teams", teamId);
    if (!team) return null;
    team.status = "onsite";
    team.sosAt = null;
    team.sosReason = null;
    await DB.put("teams", team);
    if (actor) await Auth.audit(actor, "SOS_CLEARED", `SOS cleared for ${team.name}`);
    notify("teams", { teamId, source: "sos-cleared" });
    return team;
  };

  const heartbeatStatus = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    if (diff < 5 * 60000) return { label: "Live", cls: "badge-green" };
    if (diff < 20 * 60000) return { label: "Recent", cls: "badge-amber" };
    return { label: "Stale", cls: "badge-red" };
  };

  return {
    subscribe, notify, getTrail, setTeamPosition, recordPosition,
    startSimulation, stopSimulation, stepTeam,
    startGps, stopGps, startDemoMovement, stopDemoMovement,
    checkIn, triggerSos, clearSos, heartbeatStatus, prune,
    get gpsStatus() { return gpsStatus; },
    get isSimLeader() { return simLeader; },
    get gpsActive() { return watchId !== null; },
    get demoActive() { return demo !== null; },
    get gpsTeamId() { return gpsTeamId; },
    set gpsTeam(id) { gpsTeamId = id; },
    set gpsTeamId(id) { gpsTeamId = id; },
  };
})();
````

---

<a id="file-19"></a>

## 19. assets/js/auth-page.js

**Purpose:** Login and registration page behavior  
**Size:** 7713 bytes · **Lines:** 220 · **SHA-256:** `E45440AD583D9269EC5066F08023CD681F751A5F051ADC30B58D424B30927DCB`

````js
/* ============================================================
   ResQCoord — auth-page.js
   Shared logic for the responder/admin login and register pages.
   ============================================================ */
"use strict";

(async () => {
  const portal = document.body.dataset.portal || "user";
  const page = document.body.dataset.page || "login";
  const dashboard = "dashboard.html";
  const otherPortal = portal === "admin" ? "user" : "admin";

  const form = U.qs("#authForm");
  const errorBox = U.qs("#formError");
  const submitBtn = U.qs("#submitBtn");
  const submitLabel = submitBtn?.innerHTML;

  const setError = (message) => {
    if (!errorBox) return;
    errorBox.textContent = message || "";
    errorBox.style.display = message ? "block" : "none";
    if (message) errorBox.scrollIntoView({ block: "nearest", behavior: "smooth" });
  };

  const busy = (isBusy, label = "Working…") => {
    if (!submitBtn) return;
    submitBtn.disabled = isBusy;
    submitBtn.innerHTML = isBusy
      ? `<span class="pulse-dot" style="background:currentColor"></span> ${U.escapeHtml(label)}`
      : submitLabel;
  };

  /* Show a "already signed in" hint instead of forcing a redirect,
     so both portals can be demoed in the same browser. */
  try {
    await DB.ensureReady();
    const existing = await Auth.restore();
    const notice = U.qs("#sessionNotice");
    if (existing && notice) {
      notice.style.display = "block";
      notice.innerHTML = `
        <div class="row between wrap" style="gap:8px">
          <div class="small" style="color:var(--muted)">
            Signed in as <b style="color:var(--text)">${U.escapeHtml(existing.name)}</b>
            <span class="badge ${existing.role === "admin" ? "badge-purple" : "badge-green"}" style="margin-left:6px">${existing.role}</span>
          </div>
          <div class="row" style="gap:6px">
            <a class="btn btn-sm" href="${existing.role === "admin" ? "../admin/dashboard.html" : "../user/dashboard.html"}">Continue</a>
            <button type="button" class="btn btn-sm btn-ghost" id="sessionSignOut">Sign out</button>
          </div>
        </div>`;
      U.qs("#sessionSignOut")?.addEventListener("click", async () => {
        await Auth.logout();
        notice.style.display = "none";
        U.toast("Signed out. You can sign in with another account.", "info");
      });
    }
  } catch (err) {
    console.warn("[ResQCoord] Session check failed", err);
  }

  /* Password show/hide */
  U.qsa("[data-toggle-pw]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = U.qs(`#${btn.dataset.togglePw}`);
      if (!input) return;
      const showing = input.type === "text";
      input.type = showing ? "password" : "text";
      btn.innerHTML = U.icon(showing ? "eye" : "eyeOff");
      btn.setAttribute("aria-label", showing ? "Show password" : "Hide password");
    });
  });

  /* Password strength */
  const pw = U.qs("#password");
  const meter = U.qs("#strength");
  if (pw && meter) {
    pw.addEventListener("input", () => {
      const score = U.passwordScore(pw.value);
      meter.dataset.score = String(score);
      const label = U.qs("#strengthLabel");
      if (label) {
        label.textContent = pw.value
          ? ["Too weak", "Weak", "Fair", "Good", "Strong"][score]
          : "At least 8 characters with letters and a number";
      }
    });
  }

  /* Demo credential fill */
  U.qsa("[data-fill]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const kind = btn.dataset.fill;
      const creds = DB.DEMO[kind];
      if (!creds) return;
      const email = U.qs("#email");
      const password = U.qs("#password");
      if (email) email.value = creds.email;
      if (password) password.value = creds.password;
      setError("");
      U.toast("Demo credentials filled in. Press sign in.", "info");
    });
  });

  /* Forgot password informational modal */
  U.qs("#forgotLink")?.addEventListener("click", (e) => {
    e.preventDefault();
    U.modal({
      title: "Password recovery",
      subtitle: "Demo build",
      body: `<p style="color:var(--muted);font-size:13px;line-height:1.7">
        Password reset email delivery is not connected in this local build. Accounts and hashes live in
        IndexedDB on this device only. For the demo, use the seeded accounts in the panel below,
        or ask an administrator to create a new account from <b>User Management</b>.
      </p>`,
      footer: `<button class="btn btn-primary" data-close>Got it</button>`,
    });
  });

  /* Populate team picker on responder registration */
  if (page === "register" && portal === "user") {
    const select = U.qs("#teamId");
    if (select) {
      try {
        const teams = await DB.getAll("teams");
        select.innerHTML =
          `<option value="">Unassigned · assign me later</option>` +
          teams
            .map(
              (team) =>
                `<option value="${U.escapeHtml(team.id)}">${U.escapeHtml(team.name)} · ${team.members} personnel</option>`
            )
            .join("");
        const alpha = teams.find((t) => t.id === "team_alpha");
        if (alpha && !select.value) select.value = alpha.id;
      } catch (err) {
        console.warn("[ResQCoord] Team list unavailable", err);
      }
    }
  }

  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setError("");
    const data = Object.fromEntries(new FormData(form).entries());

    if (page === "login") {
      if (!data.email || !data.password) {
        setError("Enter your email and password.");
        return;
      }
      busy(true, "Signing in…");
      try {
        const result = await Auth.login(data.email, data.password, portal);
        if (!result.ok) {
          setError(result.error);
          busy(false);
          return;
        }
        U.toast(`Welcome back, ${result.user.name.split(" ")[0]}.`, {
          title: "Secure session established",
          type: "success",
        });
        setTimeout(() => location.replace(dashboard), 420);
      } catch (err) {
        console.error(err);
        setError("Could not sign in. Check the browser console for details.");
        busy(false);
      }
      return;
    }

    /* Registration */
    if (!data.name || data.name.trim().length < 2) {
      setError("Enter your full name.");
      return;
    }
    if (!data.email || !Auth.emailOk(data.email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (!data.password || data.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (data.password !== data.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (portal === "admin" && !data.adminCode) {
      setError("Enter the admin access code. Demo code: RESQ-ADMIN-2026");
      return;
    }

    busy(true, "Creating account…");
    try {
      const result = await Auth.register(data, portal);
      if (!result.ok) {
        setError(result.error);
        busy(false, "Create account");
        return;
      }
      U.toast(`Account created for ${result.user.name}.`, {
        title: "Welcome to ResQCoord",
        type: "success",
      });
      setTimeout(() => location.replace(dashboard), 450);
    } catch (err) {
      console.error(err);
      setError("Could not create the account. Check the browser console for details.");
      busy(false);
    }
  });

  /* Keep link targets honest */
  const portalSwitch = U.qs(`.portal-switch a[href*="${otherPortal}"]`);
  if (portalSwitch) portalSwitch.removeAttribute("aria-disabled");
})();
````

---

<a id="file-20"></a>

## 20. assets/js/user-app.js

**Purpose:** Responder dashboard behavior  
**Size:** 66530 bytes · **Lines:** 1679 · **SHA-256:** `95F42BBA1F910B5407AF6FF44376A205B697539CD9753CFA56C5A976FA9CB5AA`

````js
/* ============================================================
   ResQCoord — user-app.js
   Field responder dashboard: mission, live map, GPS, routing,
   messages, incidents, check-ins, SOS and settings.
   ============================================================ */
"use strict";

(() => {
  const $ = U.qs;
  const state = {
    user: null,
    team: null,
    teams: [],
    mission: null,
    settings: null,
    messages: [],
    incidents: [],
    maps: { mini: null, full: null },
    activeThread: "command",
    route: null,
    routeTargets: [],
    routeFollow: null,
    picking: false,
    ready: false,
    lastSync: Date.now(),
    msgSig: "",
    follow: true,
    navigation: null,
  };

  const clockIds = ["clock", "missionClock", "mapClock", "msgClock", "incidentClock", "settingsClock"];

  const intervalMinutes = () => state.settings?.checkinMinutes || 15;

  const statusLabel = (status) => U.statusMeta[status]?.label || "On site";

  const visibleMessages = () => {
    const channels = ["command"];
    if (state.team?.id) channels.push(`team:${state.team.id}`);
    return state.messages.filter((m) => channels.includes(m.channel));
  };

  const isUnread = (message) => !(message.readBy || []).includes(state.user?.id);
  const unreadCount = () => visibleMessages().filter(isUnread).length;

  const setSync = () => {
    state.lastSync = Date.now();
    const text = `Synced ${U.fmtTimeSec(state.lastSync)}`;
    if ($("#lastSync")) $("#lastSync").textContent = text;
    if ($("#footerSync")) $("#footerSync").textContent = text;
  };

  /* ---------------- Data ---------------- */
  const reload = async () => {
    const [teams, missions, messages, incidents, checkins, settings] = await Promise.all([
      DB.getAll("teams"),
      DB.getAll("missions"),
      DB.getAll("messages"),
      DB.getAll("incidents"),
      DB.byIndex("checkins", "userId", state.user.id),
      DB.get("settings", state.user.id),
    ]);
    state.teams = teams;
    state.settings = settings || {
      shareLocation: true,
      backgroundTracking: true,
      checkinMinutes: 15,
      notifications: { sos: true, checkin: true, messages: true, weather: true },
    };
    state.team =
      teams.find((t) => t.id === state.user.teamId) ||
      teams.find((t) => t.name === state.user.team) ||
      teams[0];
    if (state.team) state.user.teamId = state.team.id;

    state.mission =
      missions.find((m) => m.teamId === state.team?.id && m.status !== "Completed") ||
      missions.find((m) => m.id === state.team?.missionId) ||
      missions.find((m) => m.status === "In progress") ||
      null;

    state.messages = messages.sort((a, b) => a.ts - b.ts);
    state.incidents = incidents.sort((a, b) => b.ts - a.ts);
    state.checkins = checkins.sort((a, b) => b.ts - a.ts);
    return { checkins };
  };

  /* ---------------- Identity ---------------- */
  const renderIdentity = () => {
    const u = state.user;
    const initials = U.initials(u.name);
    ["sidebarName", "topName", "settingsName"].forEach((id) => {
      if ($(`#${id}`)) $(`#${id}`).textContent = u.name;
    });
    ["sidebarRole", "settingsRole"].forEach((id) => {
      if ($(`#${id}`)) $(`#${id}`).textContent = u.title || `Field Responder · ${u.team}`;
    });
    if ($("#topRole")) $("#topRole").textContent = u.role === "admin" ? "Administrator" : "Field Responder";
    ["sidebarAvatar", "topAvatar", "settingsAvatar"].forEach((id) => {
      if ($(`#${id}`)) $(`#${id}`).textContent = initials;
    });
    if ($("#settingsResponderId")) $("#settingsResponderId").textContent = u.responderId || "—";
    if ($("#profName")) $("#profName").value = u.name || "";
    if ($("#profPhone")) $("#profPhone").value = u.phone || "";
    if ($("#profEmail")) $("#profEmail").value = u.email || "";
    if ($("#profTeam")) $("#profTeam").value = state.team?.name || u.team || "";
    if ($("#profOrg")) $("#profOrg").value = u.org || "";
    if ($("#profCert")) $("#profCert").value = u.cert || "";
    if ($("#profTitle")) $("#profTitle").value = u.title || "";
    if ($("#autoReporter")) $("#autoReporter").textContent = `${u.name} · ${u.title || "Field responder"}`;
    if ($("#autoTeam")) $("#autoTeam").textContent = state.team?.name || u.team || "—";
    if ($("#autoMission")) $("#autoMission").textContent = state.mission?.code || "—";
    if ($("#storageMode")) $("#storageMode").textContent = DB.mode === "idb" ? "IndexedDB (local)" : "localStorage fallback";
    if ($("#dataMode")) $("#dataMode").textContent = DB.mode === "idb" ? "IndexedDB" : "localStorage";
  };

  /* ---------------- Dashboard ---------------- */
  const renderDashboard = () => {
    const team = state.team;
    const mission = state.mission;
    if (!team) return;

    const meta = U.statusMeta[team.status] || U.statusMeta.onsite;
    const last = team.lastCheckin || Date.now();
    const interval = intervalMinutes();
    const due = last + interval * 60000;
    const diffMin = Math.round((due - Date.now()) / 60000);
    const dueText = `${U.fmtTime(due)} PHT`;
    const remaining =
      diffMin > 0 ? `${diffMin} min` : diffMin === 0 ? "due now" : `${Math.abs(diffMin)} min overdue`;

    const setText = (id, value) => {
      const el = $(`#${id}`);
      if (el) el.textContent = value;
    };
    setText("dashSub", `${team.name} · ${team.sector || "Mt. Lantin"}`);
    setText("statusValue", statusLabel(team.status));
    setText("kpiStatus", statusLabel(team.status));
    setText("kpiTeam", team.members || 1);
    setText("kpiTeamName", team.name);
    setText("kpiAccuracy", `±${team.accuracy || 8} m`);
    setText("heroTeam", `${team.name} · ${team.members || 1}`);
    setText("heroMission", mission?.name || "No active mission");
    setText("heroLastCheckin", team.lastCheckin ? U.fmtRelative(team.lastCheckin) : "—");
    setText("nextCheckin", `${U.fmtTime(due)} · ${remaining}`);
    setText("checkinDue", dueText);
    setText("kpiCheckin", U.fmtTime(due));
    setText("kpiCheckinIn", remaining);

    const dot = $("#statusValue")?.parentElement?.querySelector(".dot-big");
    if (dot) {
      dot.style.background = meta.css === "sos" ? "var(--danger)" : meta.css === "enroute" ? "var(--warn)" : meta.css === "standby" ? "var(--accent-2)" : "var(--accent)";
    }
    const select = $("#statusSelect");
    if (select) {
      if (team.status === "sos") {
        select.value = "onsite";
        select.disabled = true;
        select.title = "Clear the SOS alert first";
      } else {
        select.disabled = false;
        select.value = team.status;
      }
    }

    if (mission) {
      const done = (mission.checkpoints || []).filter((c) => c.done).length;
      const total = (mission.checkpoints || []).length || 1;
      setText("kpiProgress", mission.progress ?? Math.round((done / total) * 100));
      setText("kpiSector", mission.sector || "N-2");
      setText("dashMissionStatus", mission.status);
      setText("dashMissionCode", mission.code);
      setText("dashMissionTitle", mission.name);
      setText("dashMissionSector", `${mission.type} · Sector ${mission.sector}`);
      setText("dashMissionPct", `${mission.progress ?? 0}%`);
      setText("dashMissionLead", mission.lead || "—");
      setText("dashMissionCp", `${done} of ${total} reached`);
      setText("dashMissionNext", mission.checkpoints?.find((c) => !c.done)?.name || "All checkpoints cleared");
      const bar = $("#dashMissionBar");
      if (bar) bar.style.width = `${mission.progress ?? 0}%`;
    }

    renderMiniMessages();
    renderTeamList();
    renderRecentReports();
    updateUnread();
    if ($("#autoAccuracy")) $("#autoAccuracy").textContent = `±${team.accuracy || 8} m`;
    if ($("#autoTime")) $("#autoTime").textContent = `${U.fmtTime()} PHT`;
  };

  const renderMiniMessages = () => {
    const wrap = $("#dashMessages");
    if (!wrap) return;
    const recent = visibleMessages().slice(-3).reverse();
    if (!recent.length) {
      wrap.innerHTML = `<div class="empty">No messages yet. Command will reach you here.</div>`;
      return;
    }
    wrap.innerHTML = recent
      .map(
        (m) => `
        <div class="msg-preview">
          <div class="avatar avatar-sm ${m.sos ? "red" : "green"}">${U.initials(m.senderName)}</div>
          <div class="mp-body">
            <div class="mp-head"><b>${U.escapeHtml(m.senderName)}</b><time>${U.fmtTime(m.ts)}</time></div>
            <div class="mp-text">${U.escapeHtml(m.text)}</div>
          </div>
        </div>`
      )
      .join("");
  };

  const renderTeamList = () => {
    const wrap = $("#dashTeam");
    if (!wrap) return;
    const related = state.teams
      .filter((t) => t.id !== state.team?.id)
      .slice(0, 4);
    const rows = [
      `<div class="list-row">
        <div class="team-avatar green">${U.escapeHtml(state.team?.short || "TA")}</div>
        <div class="meta">
          <div class="name">${U.escapeHtml(state.team?.name || "Team Alpha")} <span class="badge badge-green" style="font-size:8.5px;height:18px">You</span></div>
          <div class="sub">${U.escapeHtml(state.team?.lead || "—")} · ${state.team?.members || 0} personnel</div>
        </div>
        <span class="badge ${U.statusMeta[state.team?.status]?.badge || "badge-green"}">${statusLabel(state.team?.status)}</span>
      </div>`,
      ...related.map(
        (t) => `
        <div class="list-row">
          <div class="team-avatar ${t.status === "sos" ? "red" : t.status === "enroute" ? "amber" : "purple"}">${U.escapeHtml(t.short)}</div>
          <div class="meta">
            <div class="name">${U.escapeHtml(t.name)}</div>
            <div class="sub">${U.escapeHtml(t.sector || t.kind)} · ${t.members} personnel</div>
          </div>
          <span class="badge ${U.statusMeta[t.status]?.badge}">${statusLabel(t.status)}</span>
        </div>`
      ),
    ];
    wrap.innerHTML = rows.join("");
    if ($("#dashTeamMeta")) $("#dashTeamMeta").textContent = `${state.teams.length} units deployed`;
  };

  /* ---------------- Mission ---------------- */
  const renderMission = () => {
    const mission = state.mission;
    if (!mission) {
      if ($("#missionTitle")) $("#missionTitle").textContent = "No active mission";
      return;
    }
    const setText = (id, value) => {
      const el = $(`#${id}`);
      if (el) el.textContent = value;
    };
    setText("missionBadge", mission.status);
    setText("missionSub", `Assigned mission · ${mission.name}`);
    setText("missionCode", mission.code);
    setText("missionTitle", mission.name);
    setText("missionType", `Priority: ${mission.priority} · ${mission.type} · Sector ${mission.sector}`);
    setText("missionSector", mission.sector);
    setText("missionPct", `${mission.progress}%`);
    setText("missionDispatched", `Dispatched ${U.fmtTime(mission.startedAt)} PHT`);
    setText("briefSubjects", mission.subjects);
    setText("briefLastSeen", mission.lastSeen);
    setText("briefWeather", mission.weather);
    setText("briefHazards", mission.hazards);
    setText("briefLead", mission.lead);
    setText("briefTeam", state.team?.name || "—");
    setText("briefDescription", mission.description);

    const elapsedMin = Math.max(0, Math.round((Date.now() - mission.startedAt) / 60000));
    setText("missionElapsed", `${Math.floor(elapsedMin / 60)}h ${U.pad(elapsedMin % 60)}m`);
    const done = (mission.checkpoints || []).filter((c) => c.done).length;
    const total = (mission.checkpoints || []).length || 1;
    setText("missionCells", `${Math.round((mission.progress / 100) * 10) || 0} of 10 grid cells cleared`);
    setText("cpSummary", `${done} of ${total} reached`);
    const bar = $("#missionBar");
    if (bar) bar.style.width = `${mission.progress}%`;

    const tl = $("#missionTimeline");
    if (tl) {
      tl.innerHTML = (mission.timeline || [])
        .map(
          (item) => `
          <div class="tl-item">
            <div class="tl-time">${U.escapeHtml(item.t)}</div>
            <div class="tl-text">${U.escapeHtml(item.text)}</div>
          </div>`
        )
        .join("");
    }

    const cp = $("#missionCheckpoints");
    if (cp) {
      cp.innerHTML = (mission.checkpoints || [])
        .map((c, i) => {
          const cls = c.done ? "done" : c.next ? "next" : "";
          return `
            <div class="checkpoint ${cls}">
              <div class="cp-dot">${c.done ? "✓" : i + 1}</div>
              <div class="grow">
                <div class="cp-name">${U.escapeHtml(c.name)} <span class="muted-2" style="font-weight:400;font-size:10.5px">· ${U.escapeHtml(c.detail)}</span></div>
                <div class="cp-meta">${U.escapeHtml(c.time)}${c.done ? " · reached" : ""}</div>
              </div>
              ${c.done ? "" : `<button class="btn btn-sm" data-checkpoint="${i}">Mark reached</button>`}
            </div>`;
        })
        .join("");
    }

    const grid = $("#sectorGrid");
    if (grid) {
      const cleared = Math.max(0, Math.min(10, Math.round((mission.progress / 100) * 10)));
      grid.innerHTML = Array.from({ length: 10 })
        .map((_, i) => {
          const cls = i < cleared ? "cleared" : i === cleared ? "active" : "";
          return `<div class="sector-cell ${cls}">${i + 1}</div>`;
        })
        .join("");
    }
  };

  const completeCheckpoint = async (index) => {
    const mission = state.mission;
    if (!mission?.checkpoints?.[index]) return;
    const checkpoint = mission.checkpoints[index];
    if (checkpoint.done) return;
    checkpoint.done = true;
    checkpoint.time = `${U.fmtTime()} PHT`;
    checkpoint.next = false;
    const next = mission.checkpoints.find((c) => !c.done);
    if (next) next.next = true;
    const done = mission.checkpoints.filter((c) => c.done).length;
    mission.progress = Math.round((done / mission.checkpoints.length) * 100);
    mission.timeline = mission.timeline || [];
    mission.timeline.push({ t: U.fmtTime(), text: `Checkpoint reached: ${checkpoint.name}` });
    mission.updatedAt = Date.now();
    await DB.put("missions", mission);
    await Auth.audit(state.user, "CHECKPOINT", `${mission.code}: ${checkpoint.name}`);
    Tracking.notify("missions", { missionId: mission.id });
    U.toast(`${checkpoint.name} marked as reached.`, "success");
    renderMission();
    renderDashboard();
  };

  /* ---------------- Messages ---------------- */
  const threadDefs = () => {
    const threads = [
      {
        id: "command",
        name: "Command Center",
        sub: "Broadcast · all teams",
        avatar: "C",
        cls: "green",
        messages: state.messages.filter((m) => m.channel === "command"),
      },
    ];
    if (state.team?.id) {
      threads.push({
        id: `team:${state.team.id}`,
        name: state.team.name,
        sub: `Team channel · ${state.team.members} personnel`,
        avatar: state.team.short || "TA",
        cls: "green",
        messages: state.messages.filter((m) => m.channel === `team:${state.team.id}`),
      });
    }
    return threads;
  };

  const renderMessages = () => {
    const threads = threadDefs();
    const list = $("#threadList");
    if (list) {
      list.innerHTML = threads
        .map((t) => {
          const last = t.messages[t.messages.length - 1];
          const unread = t.messages.filter(isUnread).length;
          return `
            <div class="msg-thread ${state.activeThread === t.id ? "active" : ""}" data-thread="${U.escapeHtml(t.id)}">
              <div class="avatar avatar-sm ${t.cls}">${U.escapeHtml(t.avatar)}</div>
              <div class="meta">
                <div class="name">${U.escapeHtml(t.name)} <time>${last ? U.fmtTime(last.ts) : ""}</time></div>
                <div class="preview">${last ? U.escapeHtml(last.text) : "No messages yet"}</div>
              </div>
              ${unread ? `<span class="unread"></span>` : ""}
            </div>`;
        })
        .join("");
    }

    const thread = threads.find((t) => t.id === state.activeThread) || threads[0];
    if (!thread) return;
    state.activeThread = thread.id;
    if ($("#chatTitle")) $("#chatTitle").textContent = thread.name;
    if ($("#chatSub")) $("#chatSub").textContent = thread.sub;
    if ($("#chatAvatar")) {
      $("#chatAvatar").textContent = thread.avatar;
      $("#chatAvatar").className = `avatar ${thread.cls}`;
    }

    const signature = `${thread.id}:${thread.messages.map((m) => `${m.id}${m.ts}`).join("|")}`;
    if (signature === state.msgSig) {
      updateUnread();
      return;
    }
    state.msgSig = signature;

    const body = $("#chatBody");
    if (!body) return;
    if (!thread.messages.length) {
      body.innerHTML = `<div class="empty">No messages in this channel yet. Say hello to command.</div>`;
    } else {
      body.innerHTML =
        `<div class="chat-date">Today · ${U.fmtDate()}</div>` +
        thread.messages
          .map((m) => {
            const me = m.senderId === state.user.id;
            return `
              <div class="bubble ${me ? "me" : ""}">
                <div class="sender">${U.escapeHtml(me ? "You" : m.senderName)}</div>
                <div class="text">${U.escapeHtml(m.text).replace(/\n/g, "<br>")}</div>
                <div class="at">${U.fmtTime(m.ts)} PHT${m.sos ? " · SOS" : ""}</div>
              </div>`;
          })
          .join("");
      body.scrollTop = body.scrollHeight;
    }
    updateUnread();
  };

  const updateUnread = () => {
    const count = unreadCount();
    const badge = $("#msgUnread");
    if (badge) {
      badge.textContent = count;
      badge.style.display = count ? "grid" : "none";
    }
  };

  const markThreadRead = async (threadId) => {
    const affected = state.messages.filter(
      (m) => m.channel === threadId && !(m.readBy || []).includes(state.user.id)
    );
    for (const message of affected) {
      message.readBy = [...(message.readBy || []), state.user.id];
      await DB.put("messages", message);
    }
    if (affected.length) Tracking.notify("messages", { read: true });
    updateUnread();
  };

  const openThread = async (id) => {
    state.activeThread = id;
    state.msgSig = "";
    await markThreadRead(id);
    renderMessages();
    renderMiniMessages();
  };

  const sendMessage = async (text) => {
    const clean = text.trim();
    if (!clean) return;
    const message = {
      id: U.randomId("msg"),
      channel: state.activeThread,
      senderId: state.user.id,
      senderName: state.team ? `${state.user.name} · ${state.team.name}` : state.user.name,
      text: clean.slice(0, 600),
      ts: Date.now(),
      readBy: [state.user.id],
    };
    await DB.put("messages", message);
    state.messages.push(message);
    await Auth.audit(state.user, "MESSAGE", `Sent a message on ${message.channel}`);
    Tracking.notify("messages", { messageId: message.id });
    state.msgSig = "";
    renderMessages();
    renderMiniMessages();
    U.toast("Message sent on the secure channel.", "success");
  };

  /* ---------------- Incidents ---------------- */
  const renderRecentReports = () => {
    const wrap = $("#recentReports");
    if (!wrap) return;
    const rows = state.incidents
      .filter((i) => i.teamId === state.team?.id || i.reporterId === state.user.id)
      .slice(0, 4);
    if (!rows.length) {
      wrap.innerHTML = `<div class="empty">No incident reports from your team yet.</div>`;
      return;
    }
    wrap.innerHTML = rows
      .map((incident) => {
        const sev = U.severityMeta[incident.severity] || U.severityMeta.Medium;
        const st = U.incidentStatusMeta[incident.status] || U.incidentStatusMeta.open;
        return `
          <div class="list-row">
            <div class="ai-icon ${incident.severity === "Critical" ? "" : incident.severity === "High" ? "amber" : "blue"}" style="width:30px;height:30px;border-radius:8px;display:grid;place-items:center;background:${incident.severity === "Critical" ? "var(--danger-dim)" : "var(--warn-dim)"};color:${sev.color}">
              ${U.icon("alert")}
            </div>
            <div class="meta">
              <div class="name">${U.escapeHtml(incident.title)}</div>
              <div class="sub">${U.fmtTime(incident.ts)} · ${U.escapeHtml(incident.type)}</div>
            </div>
            <span class="badge ${st.badge}">${st.label}</span>
          </div>`;
      })
      .join("");
  };

  const refreshIncidentLocation = () => {
    if (!state.team) return;
    const text = `${state.team.lat.toFixed(5)} N, ${state.team.lng.toFixed(5)} E · ${state.team.sector || "Mt. Lantin area"}`;
    if ($("#incLoc")) $("#incLoc").value = text;
    if ($("#autoAccuracy")) $("#autoAccuracy").textContent = `±${state.team.accuracy || 8} m`;
    if ($("#autoTime")) $("#autoTime").textContent = `${U.fmtTime()} PHT`;
  };

  const submitIncident = async () => {
    const desc = $("#incDesc")?.value.trim() || "";
    if (desc.length < 10) {
      U.toast("Add a short description (at least 10 characters).", "warn");
      return;
    }
    const severity = $("#incSeverity")?.value || "High";
    const type = $("#incType")?.value || "Hazard";
    const team = state.team;
    const titleMap = {
      "Injured person": "Injured person reported",
      Hazard: "Field hazard reported",
      "Missing person": "Missing person report",
      Equipment: "Equipment issue",
      Weather: "Weather hazard",
      Other: "Field report",
    };
    const incident = {
      id: U.randomId("inc"),
      code: `INC-${String(Math.floor(1000 + Math.random() * 9000))}`,
      type,
      severity,
      title: `${titleMap[type] || "Field report"} · ${team?.sector || "Sector"}`,
      status: "open",
      description: desc.slice(0, 500),
      lat: team?.lat,
      lng: team?.lng,
      sector: team?.sector || "Mt. Lantin",
      reporterId: state.user.id,
      reporterName: state.user.name,
      teamId: team?.id,
      ts: Date.now(),
      updatedAt: Date.now(),
    };
    await DB.put("incidents", incident);
    state.incidents.unshift(incident);

    const message = {
      id: U.randomId("msg"),
      channel: "command",
      senderId: state.user.id,
      senderName: `${state.user.name} · ${team?.name || "Field"}`,
      text: `[${severity}] ${incident.title} — ${desc.slice(0, 180)}`,
      ts: Date.now(),
      readBy: [state.user.id],
      incidentId: incident.id,
    };
    await DB.put("messages", message);
    state.messages.push(message);

    if (severity === "Critical" && team) {
      team.status = "sos";
      team.sosAt = Date.now();
      team.sosReason = `${incident.code}: ${incident.title}`;
      await DB.put("teams", team);
    }

    await Auth.audit(state.user, "INCIDENT", `${incident.code} ${severity} — ${incident.title}`);
    Tracking.notify("incidents", { incidentId: incident.id });
    Tracking.notify("messages", { messageId: message.id });

    U.toast(
      severity === "Critical"
        ? "Critical report filed and an SOS alert was raised for the nearest team."
        : "Incident report submitted to command.",
      { type: severity === "Critical" ? "error" : "success", title: incident.code }
    );

    $("#incidentForm")?.reset();
    if ($("#sevPicker")) {
      U.qsa(".sev-opt", $("#sevPicker")).forEach((b) => b.classList.toggle("active", b.dataset.sev === "High"));
    }
    if ($("#incSeverity")) $("#incSeverity").value = "High";
    if ($("#incDescCount")) $("#incDescCount").textContent = "0 / 500 characters";
    localStorage.removeItem(`resqcoord.draft.${state.user.id}`);
    await reload();
    renderDashboard();
    renderRecentReports();
    renderMission();
    refreshIncidentLocation();
    state.msgSig = "";
    renderMessages();
    renderMarkers();
  };

  /* ---------------- Maps ---------------- */
  const initMaps = () => {
    const team = state.team;
    if (!team) return;
    const common = {
      center: [team.lat, team.lng],
      zoom: 15,
      onTileError: () => {
        console.warn("[ResQCoord] Map tiles unavailable — running on the local grid.");
      },
    };

    state.maps.mini = MapKit.create($("#userMiniMap"), { ...common, zoom: 15 });
    state.maps.full = MapKit.create($("#userMap"), {
      ...common,
      zoom: 15,
      onMapClick: async (latlng) => {
        if (!state.picking) return;
        state.picking = false;
        const container = $("#userMap");
        if (container) container.style.cursor = "";
        await applyLocation(latlng.lat, latlng.lng, "map-pick");
      },
    });

    [state.maps.mini, state.maps.full].forEach((map) => {
      if (!map) return;
      map.addTeam(team, true);
      map.setAccuracy(team.lat, team.lng, team.accuracy || 12);
    });

    if (state.maps.full) {
      state.maps.full.invalidate();
      setTimeout(() => state.maps.full?.invalidate(), 400);
    }
    refreshTrail();
  };

  const renderMarkers = () => {
    const team = state.team;
    if (!team) return;
    [state.maps.mini, state.maps.full].forEach((map) => {
      if (!map) return;
      map.updateTeam(team, true);
      map.setAccuracy(team.lat, team.lng, Math.max(team.accuracy || 10, 10));
    });
    const coords = `${team.lat.toFixed(5)}, ${team.lng.toFixed(5)} · <b>±${team.accuracy || 8} m</b>`;
    if ($("#miniCoords")) $("#miniCoords").innerHTML = coords;
    if ($("#mapCoords")) $("#mapCoords").innerHTML = coords;
    if ($("#gpsLat")) $("#gpsLat").textContent = team.lat.toFixed(5);
    if ($("#gpsLng")) $("#gpsLng").textContent = team.lng.toFixed(5);
    if ($("#gpsAccuracy")) $("#gpsAccuracy").textContent = `±${team.accuracy || 8} m`;
    if ($("#gpsSpeed")) $("#gpsSpeed").textContent = `${(team.speed || 0).toFixed(1)} km/h`;
    if ($("#gpsSource")) {
      $("#gpsSource").textContent = Tracking.gpsActive
        ? "Device GPS"
        : Tracking.demoActive
        ? "Demo tracker"
        : "Team simulation";
    }
    if ($("#gpsUpdated")) $("#gpsUpdated").textContent = U.fmtRelative(team.updatedAt || Date.now());
    if ($("#trackingMode")) {
      $("#trackingMode").textContent = Tracking.gpsActive
        ? "Live device GPS"
        : Tracking.demoActive
        ? "Demo movement"
        : "Team simulation";
    }
    if ($("#latInput") && document.activeElement !== $("#latInput")) $("#latInput").value = team.lat.toFixed(5);
    if ($("#lngInput") && document.activeElement !== $("#lngInput")) $("#lngInput").value = team.lng.toFixed(5);

    if (state.follow && $("#view-map")?.classList.contains("active") && state.maps.full && !state.picking) {
      state.maps.full.map.panTo([team.lat, team.lng], { animate: true, duration: 0.4, noMoveStart: true });
    }
  };

  const refreshTrail = async () => {
    if (!state.team) return;
    try {
      const trail = await Tracking.getTrail(state.team.id, 40);
      const distance = Routing.pathDistance(trail);
      if ($("#trailCount")) $("#trailCount").textContent = `${trail.length} points`;
      if ($("#trailDistance")) $("#trailDistance").textContent = U.formatDistance(distance);
      if (state.maps.full && trail.length > 1) state.maps.full.setMyTrail(trail);
      if (state.maps.mini && trail.length > 1) state.maps.mini.setMyTrail(trail);
    } catch (err) {
      console.warn("[ResQCoord] Trail unavailable", err);
    }
  };

  const setGpsBadges = (status, label) => {
    const cls = status === "live" ? "" : status === "searching" ? "searching" : "off";
    ["mapGpsBadge", "gpsBadge", "miniGpsBadge", "incidentGpsBadge"].forEach((id) => {
      const el = $(`#${id}`);
      if (!el) return;
      el.className = `gps-badge ${cls}`;
      el.innerHTML = `${U.icon("gps")} ${U.escapeHtml(label)}`;
    });
  };

  const applyLocation = async (lat, lng, source = "manual") => {
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
      U.toast("Enter a valid latitude (-90 to 90) and longitude (-180 to 180).", "warn");
      return;
    }
    const team = await Tracking.setTeamPosition(state.team.id, lat, lng, { source });
    if (!team) return;
    state.team = team;
    const distance = U.haversine(
      [team.lat, team.lng],
      [16.4027, 120.5973]
    );
    if (distance > 20000) {
      U.toast("Location updated — note this is outside the Mt. Lantin operational area.", "info");
    } else {
      U.toast(`Location updated to ${lat.toFixed(5)}, ${lng.toFixed(5)}.`, "success");
    }
    await Auth.audit(state.user, "LOCATION", `Position changed manually (${source})`);
    renderMarkers();
    renderDashboard();
    refreshIncidentLocation();
    if (state.maps.full) state.maps.full.focus(lat, lng, 16);
    refreshTrail();
  };

  const setLocation = () => {
    const lat = parseFloat($("#latInput")?.value);
    const lng = parseFloat($("#lngInput")?.value);
    applyLocation(lat, lng, "manual");
  };

  /* ---------------- GPS / demo ---------------- */
  const startGps = async () => {
    if (!state.team) return;
    Tracking.gpsTeam = state.team.id;
    const started = Tracking.startGps({
      teamId: state.team.id,
      onStatus: (status) => {
        if (status === "searching") {
          setGpsBadges("searching", "Searching…");
          if ($("#gpsBtnLabel")) $("#gpsBtnLabel").textContent = "Stop GPS";
          U.toast("Requesting a GPS fix from this device…", "info");
        }
        if (status === "live") {
          setGpsBadges("live", "Live GPS");
          if ($("#gpsBtnLabel")) $("#gpsBtnLabel").textContent = "Stop GPS";
        }
        if (status === "denied" || status === "error") {
          setGpsBadges("off", "GPS unavailable");
          if ($("#gpsBtnLabel")) $("#gpsBtnLabel").textContent = "Use my GPS";
        }
      },
      onFix: (fix) => {
        if ($("#gpsAccuracy")) $("#gpsAccuracy").textContent = `±${Math.round(fix.accuracy)} m`;
        if ($("#gpsSpeed")) $("#gpsSpeed").textContent = `${fix.speed.toFixed(1)} km/h`;
        if ($("#gpsSource")) $("#gpsSource").textContent = "Device GPS";
        const coords = `${fix.lat.toFixed(5)}, ${fix.lng.toFixed(5)} · <b>±${Math.round(fix.accuracy)} m</b>`;
        if ($("#mapCoords")) $("#mapCoords").innerHTML = coords;
        if ($("#miniCoords")) $("#miniCoords").innerHTML = coords;
        if (state.maps.full) {
          state.maps.full.moveMe(fix.lat, fix.lng);
          state.maps.full.setAccuracy(fix.lat, fix.lng, fix.accuracy);
          state.maps.full.addCircleAt(fix.lat, fix.lng, Math.max(fix.accuracy, 20));
        }
        refreshIncidentLocation();
        setSync();
      },
      onError: (message, error) => {
        U.toast(message, "error");
        if (error?.code === 1) {
          setGpsBadges("off", "Permission denied");
        }
      },
    });

    if (!started) {
      U.toast("GPS is not available in this browser. Use demo movement instead.", "warn");
      return;
    }
  };

  const stopGps = async () => {
    await Tracking.stopGps();
    if ($("#gpsBtnLabel")) $("#gpsBtnLabel").textContent = "Use my GPS";
    setGpsBadges("live", "GPS off");
    await reload();
    renderMarkers();
    renderDashboard();
    U.toast("Live GPS tracking stopped.", "info");
  };

  const toggleGps = async () => {
    if (Tracking.gpsActive) await stopGps();
    else await startGps();
  };

  const toggleDemo = async () => {
    if (!state.team) return;
    if (Tracking.demoActive) {
      await Tracking.stopDemoMovement();
      if ($("#demoBtnLabel")) $("#demoBtnLabel").textContent = "Demo movement";
      setGpsBadges("off", "Demo stopped");
      await reload();
      renderMarkers();
      renderDashboard();
      U.toast("Demo movement stopped.", "info");
      return;
    }
    Tracking.gpsTeam = state.team.id;
    const ok = await Tracking.startDemoMovement({
      teamId: state.team.id,
      onFix: async (fix) => {
        const team = await DB.get("teams", state.team.id);
        if (team) {
          state.team = team;
          renderMarkers();
          renderDashboard();
          if (state.maps.full && state.follow) {
            state.maps.full.moveMe(fix.lat, fix.lng);
            state.maps.full.setAccuracy(fix.lat, fix.lng, fix.accuracy);
          }
        }
        setSync();
      },
    });
    if (ok) {
      if ($("#demoBtnLabel")) $("#demoBtnLabel").textContent = "Stop demo";
      setGpsBadges("live", "Demo live");
      U.toast("Demo movement started — your marker will patrol the sector every 2.2 s.", {
        title: "Live simulation",
        type: "success",
      });
      if (state.maps.full) state.maps.full.invalidate();
    }
  };

  /* ---------------- Routing ---------------- */
  const setRouteTargets = (places) => {
    state.routeTargets = places;
    const select = $("#routeTo");
    if (!select) return;
    select.innerHTML = places
      .map(
        (p, i) =>
          `<option value="${i}">${U.escapeHtml(p.name)}${p.detail ? ` · ${U.escapeHtml(p.detail)}` : ""}</option>`
      )
      .join("");
  };

  const renderNearbyPlaces = () => {
    const wrap = $("#nearbyPlaces");
    if (!wrap || !state.team) return;
    const places = Routing.PLACES
      .map((p) => ({ ...p, distance: U.haversine([state.team.lat, state.team.lng], [p.lat, p.lng]) }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 6);
    wrap.innerHTML = places
      .map(
        (p) => `
        <button type="button" class="list-row clickable" data-place="${U.escapeHtml(p.name)}" style="width:100%;border-left:0;border-right:0;border-top:0;background:transparent;text-align:left">
          <div class="team-avatar blue" style="color:var(--accent-2);background:#102638;border-color:#24445e">${U.icon("pin")}</div>
          <div class="meta">
            <div class="name">${U.escapeHtml(p.name)}</div>
            <div class="sub">${U.escapeHtml(p.detail)}</div>
          </div>
          <div class="right">
            <div class="small" style="color:var(--text)">${U.formatDistance(p.distance)}</div>
            <div class="tiny muted-2">route</div>
          </div>
        </button>`
      )
      .join("");
  };

  const originCoords = () => {
    const from = $("#routeFrom")?.value || "me";
    if (from === "me") return [state.team.lat, state.team.lng];
    if (from === "base") {
      const base = Routing.PLACES.find((p) => p.name === "Base Camp");
      return [base.lat, base.lng];
    }
    const trailhead = Routing.PLACES.find((p) => p.name === "Trailhead");
    return [trailhead.lat, trailhead.lng];
  };

  const getRoute = async () => {
    const target = state.routeTargets[Number($("#routeTo")?.value || 0)];
    if (!target) {
      U.toast("Choose a destination first.", "warn");
      return;
    }
    const button = $("#routeBtn");
    if (button) {
      button.disabled = true;
      button.textContent = "Calculating…";
    }
    const direct = $("#routeDirect")?.checked;
    const route = await Routing.getRoute(originCoords(), [target.lat, target.lng], direct ? "direct" : "driving");
    if (button) {
      button.disabled = false;
      button.innerHTML = `${U.icon("route")} Get route`;
    }
    if (!route.ok) {
      U.toast(route.error || "Could not calculate a route.", "error");
      return;
    }
    state.route = route;
    if (state.maps.full) {
      state.maps.full.drawRoute(route);
      state.maps.full.addWaypoint(target.lat, target.lng, target.name);
      state.maps.full.invalidate();
    }
    const panel = $("#routeResult");
    if (panel) {
      panel.style.display = "grid";
      panel.innerHTML = `
        <div class="rp-stat-row"><span>Distance</span><b>${U.formatDistance(route.distance)}</b></div>
        <div class="rp-stat-row"><span>Est. travel time</span><b>${U.formatDuration(route.duration)}</b></div>
        <div class="rp-stat-row"><span>Destination</span><b>${U.escapeHtml(target.name)}</b></div>
        <div class="rp-stat-row"><span>Source</span><b style="color:${route.source === "osrm" ? "var(--accent)" : "var(--warn)"}">${route.source === "osrm" ? "OSRM / OSM" : "Offline fallback"}</b></div>
        <div class="rp-steps">
          ${(route.steps || []).map((s) => `<div class="rp-step"><i></i><span>${U.escapeHtml(s.text)}${s.distance ? ` · ${U.formatDistance(s.distance)}` : ""}</span></div>`).join("")}
        </div>
        <div class="row" style="gap:6px;margin-top:5px">
          <button class="btn btn-sm btn-primary grow" data-nav-route>Start navigation</button>
          <button class="btn btn-sm" data-clear-route>Clear</button>
        </div>
        ${route.note ? `<div class="field-hint">${U.escapeHtml(route.note)}</div>` : ""}
      `;
    }
    if (route.source === "offline") {
      U.toast("Road routing unavailable — drew the offline direct route instead.", "warn");
    } else {
      U.toast(`Route ready: ${U.formatDistance(route.distance)} · ${U.formatDuration(route.duration)}.`, "success");
    }
  };

  const startNavigation = () => {
    const route = state.route;
    if (!route || !state.maps.full) return;
    if (state.navigation) {
      state.navigation.stop();
      state.navigation = null;
      U.toast("Navigation stopped.", "info");
      return;
    }
    const btn = $("[data-nav-route]");
    if (btn) btn.textContent = "Stop navigation";
    const durationMs = U.clamp(route.distance / 8, 16000, 46000);
    state.navigation = Routing.followRoute(route.coords, {
      durationMs,
      onMove: (point) => {
        if (state.maps.full) {
          state.maps.full.moveMe(point.lat, point.lng);
          state.maps.full.map.panTo([point.lat, point.lng], { animate: true, duration: 0.4 });
        }
        if ($("#mapCoords")) $("#mapCoords").innerHTML = `${point.lat.toFixed(5)}, ${point.lng.toFixed(5)} · <b>${U.formatDistance(point.remaining)} left</b>`;
        if ($("#gpsSpeed")) $("#gpsSpeed").textContent = "18.0 km/h";
        if ($("#gpsSource")) $("#gpsSource").textContent = "Route navigation";
      },
      onDone: async () => {
        state.navigation = null;
        const last = route.coords[route.coords.length - 1];
        await Tracking.setTeamPosition(state.team.id, last[0], last[1], { source: "navigation", speed: 0 });
        await reload();
        renderMarkers();
        renderDashboard();
        refreshTrail();
        if ($("#routeResult")) {
          const old = $("#routeResult");
          old.innerHTML = `<div class="rp-stat-row"><span>Arrived</span><b style="color:var(--accent)">Destination reached</b></div>
            <div class="rp-stat-row"><span>Final position</span><b class="mono">${last[0].toFixed(5)}, ${last[1].toFixed(5)}</b></div>
            <button class="btn btn-sm" data-clear-route>Clear route</button>`;
        }
        U.toast("You have arrived at the destination. Position saved.", "success");
      },
    });
    U.toast("Navigation started — following the route on the map.", "info");
  };

  const clearRoute = () => {
    if (state.navigation) {
      state.navigation.stop();
      state.navigation = null;
    }
    state.route = null;
    state.maps.full?.clearRoute();
    state.maps.full?.clearWaypoint();
    const panel = $("#routeResult");
    if (panel) {
      panel.style.display = "none";
      panel.innerHTML = "";
    }
  };

  const searchRoute = async () => {
    const query = $("#routeSearch")?.value.trim();
    if (!query) {
      U.toast("Type a place to search.", "warn");
      return;
    }
    const btn = $("#routeSearchBtn");
    if (btn) btn.textContent = "…";
    const results = await Routing.geocode(query);
    if (btn) btn.textContent = "Find";
    if (!results.length) {
      U.toast("No places found (or geocoding is offline). Try one of the preset destinations.", "warn");
      return;
    }
    const merged = [
      ...results.map((r) => ({ name: r.name, detail: r.detail.slice(0, 70), lat: r.lat, lng: r.lng })),
      ...Routing.PLACES,
    ];
    setRouteTargets(merged);
    U.toast(`Found ${results.length} place${results.length > 1 ? "s" : ""}. Choose one and get the route.`, "success");
  };

  /* ---------------- Check-in / status / SOS ---------------- */
  const openCheckin = () => {
    const team = state.team;
    if (!team) return;
    const modal = U.modal({
      title: "Field check-in",
      subtitle: `Send your position to command · ${team.name}`,
      body: `
        <div class="stack">
          <div class="card" style="background:var(--panel-2)">
            <div class="card-body" style="padding:13px 15px">
              <div class="row between">
                <div><div class="tiny uppercase muted-2">Current position</div>
                <div class="mono" style="margin-top:4px">${team.lat.toFixed(5)}, ${team.lng.toFixed(5)}</div></div>
                <span class="gps-badge">${U.icon("gps")} ±${team.accuracy || 8} m</span>
              </div>
              <div class="kv-list" style="margin-top:8px">
                <div class="kv"><span class="k">Team</span><span class="v">${U.escapeHtml(team.name)}</span></div>
                <div class="kv"><span class="k">Mission</span><span class="v">${U.escapeHtml(state.mission?.code || "—")}</span></div>
              </div>
            </div>
          </div>
          <div class="field">
            <label for="checkinStatus">Status</label>
            <select class="select" id="checkinStatus">
              <option value="onsite" ${team.status === "onsite" ? "selected" : ""}>On site</option>
              <option value="enroute" ${team.status === "enroute" ? "selected" : ""}>En route</option>
              <option value="standby" ${team.status === "standby" ? "selected" : ""}>Standby</option>
            </select>
          </div>
          <div class="field">
            <label for="checkinNote">Check-in note <span class="label-optional">(optional)</span></label>
            <textarea class="textarea" id="checkinNote" placeholder="e.g. All clear at the saddle, moving to ridge marker"></textarea>
          </div>
          <div class="field-hint">Your position, status and note are stored locally and synced to the admin dashboard instantly.</div>
        </div>`,
      footer: `<button class="btn" data-close>Cancel</button><button class="btn btn-primary" id="doCheckin">Send check-in</button>`,
    });
    modal.el.querySelector("#doCheckin").addEventListener("click", async () => {
      const status = modal.el.querySelector("#checkinStatus").value;
      const note = modal.el.querySelector("#checkinNote").value.trim();
      const record = await Tracking.checkIn(state.user, {
        lat: state.team.lat,
        lng: state.team.lng,
        note: note || `Check-in · ${statusLabel(status)}`,
        status,
      });
      modal.close();
      state.team.lastCheckin = record.ts;
      state.team.status = status;
      await reload();
      renderDashboard();
      renderMission();
      setSync();
      U.toast("Check-in sent. Command can see your position and status.", {
        title: "You're checked in",
        type: "success",
      });
    });
  };

  const openStatus = () => {
    const team = state.team;
    if (!team) return;
    const isSos = team.status === "sos";
    const modal = U.modal({
      title: "Update my status",
      subtitle: `${team.name} · this is visible to command`,
      body: `
        <div class="stack">
          ${isSos ? `<div class="incident-card" style="border-color:rgba(255,90,106,.35)">
            <div class="ic-head"><div class="ic-title" style="color:var(--danger)">SOS is active</div><span class="badge badge-red">Emergency</span></div>
            <div class="ic-desc">Command has been alerted. Clear the SOS only if the emergency is over or it was raised by mistake.</div>
          </div>` : ""}
          <div class="field">
            <label for="statusChoice">Status</label>
            <select class="select" id="statusChoice">
              <option value="onsite">On site</option>
              <option value="enroute">En route</option>
              <option value="standby">Standby</option>
            </select>
          </div>
          <div class="field">
            <label for="statusNote">Note <span class="label-optional">(optional)</span></label>
            <input class="input" id="statusNote" placeholder="e.g. At ridge marker, GPS locked">
          </div>
        </div>`,
      footer: `${isSos ? '<button class="btn btn-danger" id="clearSos">Clear SOS</button>' : ""}
        <button class="btn" data-close>Cancel</button>
        <button class="btn btn-primary" id="saveStatus">Save status</button>`,
    });
    if (isSos) {
      modal.el.querySelector("#clearSos").addEventListener("click", async () => {
        await Tracking.clearSos(team.id, state.user);
        modal.close();
        await reload();
        renderDashboard();
        setGpsBadges("live", "GPS locked");
        U.toast("SOS cleared. Command has been notified.", "success");
      });
    }
    modal.el.querySelector("#saveStatus").addEventListener("click", async () => {
      const status = modal.el.querySelector("#statusChoice").value;
      const note = modal.el.querySelector("#statusNote").value.trim();
      team.status = status;
      team.updatedAt = Date.now();
      if (note) team.note = note;
      await DB.put("teams", team);
      await Auth.audit(state.user, "STATUS", `Status set to ${status}${note ? " — " + note : ""}`);
      Tracking.notify("teams", { teamId: team.id });
      modal.close();
      renderDashboard();
      U.toast(`Status updated to “${statusLabel(status)}”.`, "success");
    });
  };

  const openSos = () => {
    const team = state.team;
    if (!team) return;
    const modal = U.modal({
      title: "Activate SOS alert",
      subtitle: "This immediately notifies the command center",
      body: `
        <div class="incident-card" style="border-color:rgba(255,90,106,.35);background:rgba(255,90,106,.04)">
          <div class="ic-head"><div class="ic-title" style="color:var(--danger)">Emergency assistance</div><span class="badge badge-red">Critical</span></div>
          <div class="ic-desc">An SOS sets ${U.escapeHtml(team.name)} to emergency status, creates a critical incident, and broadcasts your position to command.</div>
        </div>
        <div class="field" style="margin-top:14px">
          <label for="sosReason">What is the emergency?</label>
          <textarea class="textarea" id="sosReason" placeholder="e.g. Hiker with leg injury, need medic at the gully crossing">${team.sosReason ? U.escapeHtml(team.sosReason) : ""}</textarea>
        </div>
        <div class="field-hint" style="margin-top:10px">Only use this for a real emergency. You can clear the alert from Update status.</div>`,
      footer: `<button class="btn" data-close>Cancel</button><button class="btn btn-danger" id="confirmSos">${U.icon("sos")} Activate SOS now</button>`,
    });
    modal.el.querySelector("#confirmSos").addEventListener("click", async () => {
      const reason = modal.el.querySelector("#sosReason").value.trim() || "Emergency assistance requested";
      modal.close();
      const result = await Tracking.triggerSos(state.user, reason);
      if (result) {
        state.team = result.team;
        await reload();
        renderDashboard();
        renderMarkers();
        renderRecentReports();
        setGpsBadges("live", "SOS active");
        state.msgSig = "";
        renderMessages();
        U.toast("SOS ACTIVATED. Command has your position and a critical incident was created.", {
          title: "Emergency alert sent",
          type: "error",
          duration: 9000,
        });
      }
    });
  };

  /* ---------------- Settings ---------------- */
  const saveSettings = async (patch) => {
    state.settings = { ...state.settings, ...patch };
    await DB.put("settings", { ...state.settings, userId: state.user.id });
    U.toast("Settings saved.", "success");
  };

  const bindSettings = () => {
    U.qsa("#settingsNav button").forEach((button) => {
      button.addEventListener("click", () => {
        U.qsa("#settingsNav button").forEach((b) => b.classList.toggle("active", b === button));
        U.qsa(".settings-section").forEach((section) => {
          section.style.display = section.dataset.section === button.dataset.settings ? "" : "none";
        });
      });
    });

    $("#profileForm")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const result = await Auth.updateProfile({
        name: $("#profName").value.trim(),
        phone: $("#profPhone").value.trim(),
        org: $("#profOrg").value.trim(),
        cert: $("#profCert").value.trim(),
        title: $("#profTitle").value.trim() || state.user.title,
      });
      if (!result.ok) {
        U.toast(result.error || "Could not save your profile.", "error");
        return;
      }
      state.user = result.user;
      renderIdentity();
      U.toast("Profile updated.", "success");
    });

    U.qsa(".notif-toggle").forEach((input) => {
      input.checked = state.settings.notifications?.[input.dataset.notif] !== false;
      input.addEventListener("change", () => {
        const notifications = { ...(state.settings.notifications || {}), [input.dataset.notif]: input.checked };
        saveSettings({ notifications });
      });
    });

    if ($("#shareLocation")) {
      $("#shareLocation").checked = state.settings.shareLocation !== false;
      $("#shareLocation").addEventListener("change", () => {
        saveSettings({ shareLocation: $("#shareLocation").checked });
        if (!state.settings.shareLocation) U.toast("Location sharing is off — command will see your last position only.", "warn");
      });
    }
    if ($("#backgroundTracking")) {
      $("#backgroundTracking").checked = state.settings.backgroundTracking !== false;
      $("#backgroundTracking").addEventListener("change", () => saveSettings({ backgroundTracking: $("#backgroundTracking").checked }));
    }
    if ($("#checkinInterval")) {
      $("#checkinInterval").value = String(intervalMinutes());
      $("#checkinInterval").addEventListener("change", () => {
        saveSettings({ checkinMinutes: Number($("#checkinInterval").value) });
        renderDashboard();
      });
    }

    $("#passwordForm")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const result = await Auth.changePassword($("#curPw").value, $("#newPw").value, $("#confirmPw").value);
      if (!result.ok) {
        U.toast(result.error, "error");
        return;
      }
      $("#passwordForm").reset();
      U.toast("Password changed. Use the new password next time you sign in.", "success");
    });
  };

  /* ---------------- Navigation ---------------- */
  const viewTitles = {
    dashboard: "Dashboard",
    mission: "My Mission",
    map: "Live Map",
    messages: "Messages",
    incident: "Report Incident",
    settings: "Settings",
  };

  const switchView = (view) => {
    if (!$(`#view-${view}`)) return;
    U.qsa(".view").forEach((section) => section.classList.toggle("active", section.id === `view-${view}`));
    U.qsa(".nav-item[data-view]").forEach((button) => button.classList.toggle("active", button.dataset.view === view));
    if ($("#crumb")) $("#crumb").textContent = viewTitles[view] || view;
    if (view === "map") {
      setTimeout(() => {
        state.maps.full?.invalidate();
        if (state.team) state.maps.full?.focus(state.team.lat, state.team.lng, 15);
      }, 120);
    }
    if (view === "dashboard") {
      setTimeout(() => state.maps.mini?.invalidate(), 120);
    }
    if (view === "incident") refreshIncidentLocation();
    if (view === "messages") renderMessages();
    if (view === "mission") renderMission();
    if (window.innerWidth <= 1080) $("#app")?.classList.remove("sidebar-open");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const bindNavigation = () => {
    U.qsa(".nav-item[data-view]").forEach((button) => {
      button.addEventListener("click", () => switchView(button.dataset.view));
    });
    U.qsa("[data-view-link]").forEach((button) => {
      button.addEventListener("click", () => switchView(button.dataset.viewLink));
    });
    $("#sidebarToggle")?.addEventListener("click", () => $("#app")?.classList.toggle("sidebar-open"));
    $("#sideUser")?.addEventListener("click", () => switchView("settings"));
    $("#sideUser")?.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        switchView("settings");
      }
    });
  };

  const bindActions = () => {
    document.addEventListener("click", async (event) => {
      const actionEl = event.target.closest("[data-action]");
      if (actionEl) {
        const action = actionEl.dataset.action;
        if (action === "checkin") openCheckin();
        if (action === "status") openStatus();
        if (action === "sos") openSos();
        if (action === "report") switchView("incident");
        if (action === "message") {
          switchView("messages");
          setTimeout(() => $("#chatInput")?.focus(), 250);
        }
        if (action === "backup") {
          const message = {
            id: U.randomId("msg"),
            channel: "command",
            senderId: state.user.id,
            senderName: `${state.user.name} · ${state.team?.name || "Field"}`,
            text: `Backup requested at ${state.team?.sector || "my sector"}. Position ${state.team?.lat.toFixed(5)}, ${state.team?.lng.toFixed(5)}.`,
            ts: Date.now(),
            readBy: [state.user.id],
          };
          await DB.put("messages", message);
          state.messages.push(message);
          Tracking.notify("messages", { messageId: message.id });
          state.msgSig = "";
          renderMessages();
          renderMiniMessages();
          U.toast("Backup request sent to command with your position.", "success");
        }
        if (action === "logout") {
          const ok = await U.confirm({
            title: "Sign out?",
            message: "You will need your email and password to sign back in.",
            confirmText: "Sign out",
            danger: true,
          });
          if (ok) await Auth.logout("../user/login.html");
        }
        return;
      }

      const checkpoint = event.target.closest("[data-checkpoint]");
      if (checkpoint) {
        await completeCheckpoint(Number(checkpoint.dataset.checkpoint));
        return;
      }

      const thread = event.target.closest("[data-thread]");
      if (thread) {
        await openThread(thread.dataset.thread);
        return;
      }

      const place = event.target.closest("[data-place]");
      if (place) {
        const target = Routing.PLACES.find((p) => p.name === place.dataset.place);
        if (target) {
          const idx = state.routeTargets.findIndex((p) => p.name === target.name);
          if (idx >= 0 && $("#routeTo")) $("#routeTo").value = String(idx);
          switchView("map");
          setTimeout(getRoute, 350);
        }
        return;
      }

      if (event.target.closest("[data-nav-route]")) {
        startNavigation();
        return;
      }
      if (event.target.closest("[data-clear-route]")) {
        clearRoute();
      }
    });

    $("#statusSelect")?.addEventListener("change", async (event) => {
      const team = state.team;
      if (!team) return;
      team.status = event.target.value;
      team.updatedAt = Date.now();
      await DB.put("teams", team);
      await Auth.audit(state.user, "STATUS", `Status set to ${team.status}`);
      Tracking.notify("teams", { teamId: team.id });
      renderDashboard();
      U.toast(`Status updated to “${statusLabel(team.status)}”.`, "success");
    });

    $("#chatForm")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const input = $("#chatInput");
      const text = input.value;
      input.value = "";
      await sendMessage(text);
    });
    $("#chatInput")?.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        $("#chatForm")?.requestSubmit();
      }
    });

    $("#threadSearchBtn")?.addEventListener("click", () => {
      const query = $("#threadSearch")?.value.trim().toLowerCase();
      U.qsa("#threadList .msg-thread").forEach((el) => {
        el.style.display = !query || el.textContent.toLowerCase().includes(query) ? "" : "none";
      });
    });
    $("#threadSearch")?.addEventListener("input", U.debounce(() => $("#threadSearchBtn")?.click(), 250));

    /* Incident form */
    U.qsa("#sevPicker .sev-opt").forEach((button) => {
      button.addEventListener("click", () => {
        U.qsa("#sevPicker .sev-opt").forEach((b) => b.classList.toggle("active", b === button));
        if ($("#incSeverity")) $("#incSeverity").value = button.dataset.sev;
      });
    });
    $("#incDesc")?.addEventListener("input", (event) => {
      if ($("#incDescCount")) $("#incDescCount").textContent = `${event.target.value.length} / 500 characters`;
    });
    $("#incLocRefresh")?.addEventListener("click", refreshIncidentLocation);
    $("#addPhoto")?.addEventListener("click", () => {
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.textContent = `IMG_04${Math.floor(14 + Math.random() * 80)}`;
      $("#addPhoto")?.before(chip);
      U.toast("Photo reference attached to the draft.", "info");
    });
    $("#incidentForm")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const button = $("#submitIncident");
      if (button) button.disabled = true;
      try {
        await submitIncident();
      } finally {
        if (button) button.disabled = false;
      }
    });
    $("#saveDraft")?.addEventListener("click", () => {
      const draft = {
        type: $("#incType")?.value,
        severity: $("#incSeverity")?.value,
        description: $("#incDesc")?.value,
        savedAt: Date.now(),
      };
      localStorage.setItem(`resqcoord.draft.${state.user.id}`, JSON.stringify(draft));
      U.toast("Draft saved locally on this device.", "success");
    });
    $("#incidentSos")?.addEventListener("click", openSos);
    $("#incidentForm")?.addEventListener("reset", () => {
      setTimeout(() => {
        if ($("#incDescCount")) $("#incDescCount").textContent = "0 / 500 characters";
        U.qsa("#sevPicker .sev-opt").forEach((b) => b.classList.toggle("active", b.dataset.sev === "High"));
        if ($("#incSeverity")) $("#incSeverity").value = "High";
        refreshIncidentLocation();
      }, 0);
    });

    /* Map controls */
    U.qsa(".map-tool[data-layer]").forEach((button) => {
      button.addEventListener("click", () => {
        U.qsa(".map-tool[data-layer]").forEach((b) => b.classList.toggle("active", b === button));
        state.maps.full?.setBaseLayer(button.dataset.layer);
      });
    });
    $("#sectorsToggle")?.addEventListener("click", () => {
      const visible = state.maps.full?.toggleSectors();
      $("#sectorsToggle")?.classList.toggle("active", !!visible);
    });
    $("#centerBtn")?.addEventListener("click", () => {
      if (!state.team) return;
      state.maps.full?.focus(state.team.lat, state.team.lng, 16);
      U.toast("Centered on your live position.", "info");
    });
    $("#gpsBtn")?.addEventListener("click", toggleGps);
    $("#gpsFixBtn")?.addEventListener("click", toggleGps);
    $("#demoBtn")?.addEventListener("click", toggleDemo);
    $("#simToggle")?.addEventListener("change", (event) => {
      state.follow = event.target.checked;
      if (state.follow && state.team) state.maps.full?.focus(state.team.lat, state.team.lng, 16);
    });
    $("#recenterTrail")?.addEventListener("click", () => {
      refreshTrail();
      if (state.team && state.maps.full) state.maps.full.focus(state.team.lat, state.team.lng, 16);
    });
    $("#applyLocation")?.addEventListener("click", setLocation);
    $("#pickMapBtn")?.addEventListener("click", () => {
      state.picking = true;
      const container = $("#userMap");
      if (container) container.style.cursor = "crosshair";
      switchView("map");
      U.toast("Click anywhere on the map to move your position.", "info");
    });
    $("#routeBtn")?.addEventListener("click", getRoute);
    $("#routeSearchBtn")?.addEventListener("click", searchRoute);
    $("#routeSearch")?.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        searchRoute();
      }
    });
    $("#routeClose")?.addEventListener("click", () => {
      $("#routePanel")?.style.setProperty("display", "none");
      $("#routeToggle")?.classList.remove("active");
    });
    $("#routeToggle")?.addEventListener("click", () => {
      const panel = $("#routePanel");
      if (!panel) return;
      const hidden = panel.style.display === "none";
      panel.style.display = hidden ? "" : "none";
      $("#routeToggle")?.classList.toggle("active", hidden);
    });
    $("#routeTo")?.addEventListener("change", () => {
      const target = state.routeTargets[Number($("#routeTo")?.value || 0)];
      if (target && state.maps.full) {
        state.maps.full.addWaypoint(target.lat, target.lng, target.name);
        state.maps.full.focus(target.lat, target.lng, 15);
      }
    });
    $("#latInput")?.addEventListener("keydown", (event) => {
      if (event.key === "Enter") setLocation();
    });
    $("#lngInput")?.addEventListener("keydown", (event) => {
      if (event.key === "Enter") setLocation();
    });
  };

  /* ---------------- Windows / timers ---------------- */
  const updateClock = () => {
    const time = `${U.fmtTime()} PHT`;
    clockIds.forEach((id) => {
      if ($(`#${id}`)) $(`#${id}`).textContent = time;
    });
    if (state.ready) {
      const team = state.team;
      if (team) {
        const due = (team.lastCheckin || Date.now()) + intervalMinutes() * 60000;
        const diff = Math.round((due - Date.now()) / 60000);
        const remaining = diff > 0 ? `${diff} min` : diff === 0 ? "due now" : `${Math.abs(diff)} min overdue`;
        if ($("#kpiCheckinIn")) $("#kpiCheckinIn").textContent = remaining;
        if ($("#nextCheckin")) $("#nextCheckin").textContent = `${U.fmtTime(due)} · ${remaining}`;
      }
      if (state.mission) {
        const mins = Math.max(0, Math.round((Date.now() - state.mission.startedAt) / 60000));
        if ($("#missionElapsed")) $("#missionElapsed").textContent = `${Math.floor(mins / 60)}h ${U.pad(mins % 60)}m`;
      }
      if ($("#gpsUpdated") && state.team) $("#gpsUpdated").textContent = U.fmtRelative(state.team.updatedAt || Date.now());
    }
  };

  const updateNetwork = () => {
    const online = navigator.onLine;
    const status = $("#netStatus");
    if (status) {
      status.classList.toggle("offline", !online);
      status.innerHTML = `<span class="dot"></span> ${online ? "Online" : "Offline"}`;
    }
    $("#offlineBanner")?.classList.toggle("show", !online);
  };

  const refresh = async () => {
    if (!state.ready) return;
    try {
      await reload();
      renderDashboard();
      renderMission();
      renderMessages();
      renderMarkers();
      refreshIncidentLocation();
      setSync();
    } catch (err) {
      console.warn("[ResQCoord] Refresh failed", err);
    }
  };

  const startTimers = () => {
    updateClock();
    setInterval(updateClock, 1000);
    setInterval(refresh, 3200);
    setInterval(refreshTrail, 9000);
    setInterval(() => {
      renderNearbyPlaces();
      setSync();
    }, 8000);

    Tracking.subscribe((event) => {
      if (["teams", "messages", "checkins", "sos", "incidents", "missions"].includes(event.type)) {
        if (event.type === "sos") {
          U.toast("SOS state changed — check the live map and your status.", {
            type: "warn",
            title: "Emergency update",
          });
        }
        if (event.type === "messages") {
          state.msgSig = "";
        }
        setTimeout(refresh, 250);
      }
    });

    window.addEventListener("online", updateNetwork);
    window.addEventListener("offline", updateNetwork);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        state.maps.mini?.invalidate();
        state.maps.full?.invalidate();
        refresh();
      }
    });
  };

  /* ---------------- Boot ---------------- */
  const boot = async () => {
    const user = await Auth.guard("user");
    if (!user) return;
    state.user = user;
    await reload();
    renderIdentity();
    renderDashboard();
    renderMission();
    renderMessages();
    renderRecentReports();
    renderNearbyPlaces();
    refreshIncidentLocation();
    initMaps();
    renderMarkers();
    setRouteTargets(Routing.PLACES);
    bindNavigation();
    bindActions();
    bindSettings();
    updateNetwork();

    const draft = localStorage.getItem(`resqcoord.draft.${user.id}`);
    if (draft) {
      try {
        const data = JSON.parse(draft);
        if (data.description && $("#incDesc") && !$("#incDesc").value) {
          $("#incDesc").value = data.description;
          if ($("#incType") && data.type) $("#incType").value = data.type;
          if ($("#incDescCount")) $("#incDescCount").textContent = `${data.description.length} / 500 characters`;
          if (data.severity && $("#incSeverity")) $("#incSeverity").value = data.severity;
          U.toast("An unsaved incident draft was restored.", "info");
        }
      } catch {
        /* ignore malformed draft */
      }
    }

    state.ready = true;
    setSync();
    if ($("#simToggle")) $("#simToggle").checked = true;

    await Tracking.startSimulation({
      intervalMs: 2600,
      onTick: (teams) => {
        if (!state.ready) return;
        state.teams = teams;
        const own = teams.find((t) => t.id === state.team?.id);
        if (own) {
          state.team = own;
          renderMarkers();
        }
        setSync();
      },
    });

    U.toast(`Signed in as ${user.name}.`, {
      title: "Field dashboard ready",
      type: "success",
    });

    console.info("[ResQCoord] User dashboard ready.", { db: DB.mode, team: state.team?.name, mission: state.mission?.code });
  };

  boot().catch((err) => {
    console.error("[ResQCoord] Failed to start the dashboard", err);
    U.toast("The dashboard could not start. Check the browser console for details.", "error");
  });
})();
````

---

<a id="file-21"></a>

## 21. assets/js/admin-app.js

**Purpose:** Admin dashboard behavior  
**Size:** 79303 bytes · **Lines:** 1704 · **SHA-256:** `9AFEE7BA1535899829DE0EB326BFB6936F6D13E4D79A42D15749A9DE6302BC94`

````js
/* ============================================================
   ResQCoord — admin-app.js
   Administrator command dashboard: overview KPIs, all-team live
   map, team tracking and routing, mission dispatch, personnel
   management, incident triage, broadcasts, reports, audit log
   and system data tools.
   ============================================================ */
"use strict";

(() => {
  const $ = U.qs;
  const $$ = U.qsa;
  const esc = U.escapeHtml;

  const SYS_KEY = "resqcoord.admin.settings";

  const state = {
    user: null,
    teams: [],
    missions: [],
    incidents: [],
    messages: [],
    users: [],
    checkins: [],
    audit: [],
    settings: null,
    system: {
      simulation: true,
      sosSound: false,
      strictCheckin: true,
      accuracy: true,
    },
    maps: { overview: null, admin: null },
    selectedTeamId: null,
    route: null,
    routeTeamId: null,
    showTrails: true,
    ready: false,
    lastSync: Date.now(),
    lastExport: null,
    views: {},
  };

  const clockIds = [
    "overviewClock", "mapClock", "missionsClock", "personnelClock",
    "incidentsClock", "messagesClock", "reportsClock", "auditClock", "settingsClock",
  ];

  const MISSION_STATUS_ORDER = { "In progress": 0, Monitoring: 1, Planned: 2, Completed: 3 };

  /* ---------------- small helpers ---------------- */
  const setText = (id, value) => {
    const el = $(`#${id}`);
    if (el) el.textContent = value;
  };

  const statusLabel = (status) => U.statusMeta[status]?.label || "Standby";
  const statusDot = (status) => `<span class="status-dot ${U.statusMeta[status]?.css || "standby"}"></span>`;

  const teamMonogram = (team) => esc((team?.short || team?.name || "TM").slice(0, 3).toUpperCase());

  const teamById = (id) => state.teams.find((t) => t.id === id) || null;

  const fmtMinutesAgo = (ts) => (ts ? U.fmtRelative(ts) : "never");

  const setSync = () => {
    state.lastSync = Date.now();
    const text = `Synced ${U.fmtTimeSec(state.lastSync)}`;
    if ($("#lastSync")) $("#lastSync").textContent = text;
  };

  const loadSystem = () => {
    try {
      const raw = localStorage.getItem(SYS_KEY);
      if (raw) state.system = { ...state.system, ...JSON.parse(raw) };
    } catch {
      /* ignore */
    }
  };

  const saveSystem = () => {
    localStorage.setItem(SYS_KEY, JSON.stringify(state.system));
  };

  const toast = (msg, type = "success", title) => U.toast(msg, { type, title });

  /* ---------------- Data ---------------- */
  const reload = async () => {
    const [teams, missions, incidents, messages, users, checkins, audit, settings] = await Promise.all([
      DB.getAll("teams"),
      DB.getAll("missions"),
      DB.getAll("incidents"),
      DB.getAll("messages"),
      DB.getAll("users"),
      DB.getAll("checkins"),
      DB.getAll("audit"),
      DB.get("settings", state.user.id),
    ]);
    state.teams = teams.sort((a, b) => a.name.localeCompare(b.name));
    state.missions = missions;
    state.incidents = incidents;
    state.messages = messages.sort((a, b) => a.ts - b.ts);
    state.users = users;
    state.checkins = checkins;
    state.audit = audit.sort((a, b) => b.ts - a.ts);
    state.settings = settings || null;
    if (state.selectedTeamId && !teamById(state.selectedTeamId)) state.selectedTeamId = null;
  };

  /* ---------------- Identity ---------------- */
  const renderIdentity = () => {
    const u = state.user;
    const initials = U.initials(u.name);
    ["sidebarName", "topName", "settingsName"].forEach((id) => setText(id, u.name));
    ["sidebarRole", "settingsRole"].forEach((id) => setText(id, u.title || "Administrator · Duty Commander"));
    ["sidebarAvatar", "topAvatar", "settingsAvatar"].forEach((id) => {
      if ($(`#${id}`)) $(`#${id}`).textContent = initials;
    });
    setText("settingsResponderId", u.responderId || "—");
    if ($("#setName")) $("#setName").value = u.name || "";
    if ($("#setEmail")) $("#setEmail").value = u.email || "";
    if ($("#setPhone")) $("#setPhone").value = u.phone || "";
    if ($("#setTitle")) $("#setTitle").value = u.title || "";
    if ($("#setOrg")) $("#setOrg").value = u.org || "";
    if ($("#broadcastSender")) $("#broadcastSender").textContent = u.name;
    const mode = DB.mode === "idb" ? "IndexedDB (local)" : "localStorage fallback";
    setText("settingsDbMode", mode);
    setText("aboutDbMode", DB.mode === "idb" ? "IndexedDB" : "localStorage");
    setText("settingsAdminCode", DB.DEMO.adminCode);
  };

  /* ---------------- Overview ---------------- */
  const renderOverview = () => {
    const active = state.missions.filter((m) => m.status === "In progress");
    const monitoring = state.missions.filter((m) => m.status === "Monitoring");
    const openIncidents = state.incidents.filter((i) => i.status !== "resolved");
    const critical = openIncidents.filter((i) => i.severity === "Critical");
    const fieldUsers = state.users.filter((u) => u.role === "user" && u.status === "active");
    const deployed = state.teams.filter((t) => t.status === "onsite" || t.status === "enroute");
    const personnel = state.teams.reduce((sum, t) => sum + (t.members || 0), 0);

    setText("kpiActiveMissions", active.length + monitoring.length);
    setText("kpiActiveMissionsFoot", `${active.length} in progress · ${monitoring.length} monitoring`);
    setText("kpiTeams", state.teams.length);
    setText("kpiTeamsFoot", `${personnel} personnel tracked · ${deployed.length} deployed`);
    setText("kpiIncidents", openIncidents.length);
    setText("kpiIncidentsFoot", `${critical.length} critical priority`);
    setText("kpiPersonnel", fieldUsers.length);
    setText("kpiPersonnelFoot", `${state.teams.length} teams · ${state.users.filter((u) => u.role === "admin").length} admins`);
    setText("overviewMissionMeta", `${state.missions.length} total`);
    setText("mapTeamCount", state.teams.length);
    setText("mapTeamHint", `${state.teams.length} tracked`);

    const badge = $("#overviewMapBadge");
    if (badge) badge.textContent = `${state.teams.length} teams tracked`;

    const incidentCount = $("#incidentNavCount");
    if (incidentCount) {
      incidentCount.textContent = String(openIncidents.length);
      incidentCount.style.display = openIncidents.length ? "grid" : "none";
    }
    setText("incidentBadge", `${openIncidents.length} open`);
    setText("missionBadge", `${active.length} active`);
  };

  const renderAlerts = () => {
    const wrap = $("#alertList");
    if (!wrap) return;
    const alerts = [];
    state.teams.forEach((team) => {
      if (team.status === "sos") {
        alerts.push({
          icon: "sos", cls: "", title: `SOS · ${team.name}`,
          meta: `${team.sosReason || "Emergency assistance requested"} · ${fmtMinutesAgo(team.sosAt || team.updatedAt)}`,
          ts: team.sosAt || Date.now(), action: "sos", teamId: team.id,
        });
      }
    });
    state.incidents.filter((i) => i.status !== "resolved").forEach((inc) => {
      alerts.push({
        icon: inc.severity === "Critical" ? "alert" : "radio",
        cls: inc.severity === "Critical" ? "" : "amber",
        title: `${inc.code} · ${inc.title}`,
        meta: `${inc.severity} · ${inc.status} · ${inc.reporterName || "field"} · ${fmtMinutesAgo(inc.ts)}`,
        ts: inc.ts, action: "incident", incidentId: inc.id,
      });
    });
    const interval = state.settings?.checkinMinutes || 15;
    state.teams.forEach((team) => {
      const due = (team.lastCheckin || 0) + interval * 60000;
      if (team.status !== "sos" && due < Date.now()) {
        const over = Math.round((Date.now() - due) / 60000);
        alerts.push({
          icon: "clock", cls: "blue", title: `Check-in overdue · ${team.name}`,
          meta: `${over} min past window · last seen ${fmtMinutesAgo(team.lastSeen)}`,
          ts: due, action: "team", teamId: team.id,
        });
      }
    });

    alerts.sort((a, b) => b.ts - a.ts);
    setText("alertCount", alerts.length);
    if (!alerts.length) {
      wrap.innerHTML = `<div class="empty">${U.icon("checkCircle")}<div>No active alerts. All teams are within their check-in windows.</div></div>`;
      return;
    }
    wrap.innerHTML = alerts.slice(0, 8).map((a) => `
      <div class="alert-item" data-alert-action="${a.action}" data-team-id="${a.teamId || ""}" data-incident-id="${a.incidentId || ""}" role="button" tabindex="0">
        <div class="ai-icon ${a.cls}">${U.icon(a.icon)}</div>
        <div class="ai-body">
          <div class="ai-title">${esc(a.title)}</div>
          <div class="ai-meta">${esc(a.meta)}</div>
        </div>
        <span style="color:var(--muted-2);align-self:center">${U.icon("arrowRight")}</span>
      </div>`).join("");
  };

  const renderOverviewTeams = () => {
    const wrap = $("#overviewTeams");
    if (!wrap) return;
    if (!state.teams.length) {
      wrap.innerHTML = '<div class="empty">No teams registered.</div>';
      return;
    }
    wrap.innerHTML = state.teams.map((team) => {
      const meta = U.statusMeta[team.status] || U.statusMeta.standby;
      return `
        <div class="list-row clickable" data-team-id="${team.id}">
          <div class="team-avatar ${meta.css === "onsite" ? "green" : meta.css === "enroute" ? "amber" : meta.css === "sos" ? "red" : "purple"}">${teamMonogram(team)}</div>
          <div class="meta">
            <div class="name">${esc(team.name)} ${statusDot(team.status)}</div>
            <div class="sub">${esc(team.sector || "Mt. Lantin")} · ${team.members || 0} personnel</div>
          </div>
          <div class="right">
            <span class="badge ${meta.badge}">${meta.label}</span>
          </div>
        </div>`;
    }).join("");
  };

  const renderOverviewMissions = () => {
    const body = $("#overviewMissionRows");
    if (!body) return;
    const list = [...state.missions].sort((a, b) =>
      (MISSION_STATUS_ORDER[a.status] ?? 9) - (MISSION_STATUS_ORDER[b.status] ?? 9)
    );
    if (!list.length) {
      body.innerHTML = '<tr><td colspan="6"><div class="empty">No missions yet. Create one to get started.</div></td></tr>';
      return;
    }
    body.innerHTML = list.slice(0, 6).map((m) => {
      const meta = U.statusMeta;
      const statusBadge = m.status === "Completed" ? "badge-green" : m.status === "Monitoring" ? "badge-blue" : "badge-amber";
      const priorityCls = U.severityMeta[m.priority]?.badge || "badge-muted";
      return `
        <tr>
          <td class="strong">${esc(m.code)}<div class="e" style="color:var(--muted-2);font-size:10px">${esc(m.name)}</div></td>
          <td><span class="badge ${statusBadge}">${esc(m.status)}</span></td>
          <td><span class="badge ${priorityCls}">${esc(m.priority || "—")}</span></td>
          <td>${esc(m.lead || "—")}<div class="e" style="color:var(--muted-2);font-size:10px">${esc(teamById(m.teamId)?.name || "Unassigned")}</div></td>
          <td style="min-width:110px">
            <div class="mini-progress"><i style="width:${m.progress || 0}%"></i></div>
            <span class="tiny muted-2">${m.progress || 0}%</span>
          </td>
          <td><button class="tbtn" data-mission-view="${m.id}" title="Open mission">${U.icon("eye")}</button></td>
        </tr>`;
    }).join("");
  };

  const renderOverviewActivity = () => {
    const wrap = $("#overviewActivity");
    if (!wrap) return;
    const rows = state.audit.slice(0, 6);
    if (!rows.length) {
      wrap.innerHTML = '<div class="empty">No activity recorded yet.</div>';
      return;
    }
    wrap.innerHTML = rows.map((a) => `
      <div class="msg-preview">
        <div class="mp-body">
          <div class="mp-head"><b>${esc(a.actorName || "System")}</b><span>${U.fmtRelative(a.ts)}</span></div>
          <div class="mp-text"><b style="color:var(--accent-2)">${esc(a.action)}</b> · ${esc(a.detail || "")}</div>
        </div>
      </div>`).join("");
  };

  /* ---------------- Maps ---------------- */
  const initMaps = () => {
    state.maps.overview = MapKit.create($("#overviewMap"), {
      center: [16.4037, 120.6012],
      zoom: 13,
      layers: "streets",
      onTeamClick: (team) => selectTeam(team.id, { jump: true }),
      onTileError: () => toast("Map tiles could not load. Check your connection.", "warn", "Map tiles offline"),
    });
    state.maps.admin = MapKit.create($("#adminMap"), {
      center: [16.4037, 120.6012],
      zoom: 14,
      layers: "streets",
      onTeamClick: (team) => selectTeam(team.id),
      onTileError: () => {},
    });
  };

  const renderMarkers = () => {
    const ids = new Set(state.teams.map((t) => t.id));
    [state.maps.overview, state.maps.admin].forEach((mk) => {
      if (!mk) return;
      mk.markers.forEach((_, key) => {
        if (key !== "me" && !ids.has(key)) mk.removeTeam(key);
      });
      state.teams.forEach((team) => mk.updateTeam(team, false));
    });
    if (state.maps.admin && state.route) state.maps.admin.drawRoute(state.route, { fit: false });
  };

  const renderTeamList = () => {
    const wrap = $("#adminTeamList");
    if (!wrap) return;
    const query = ($("#teamSearch")?.value || "").trim().toLowerCase();
    const filter = $("#teamFilter")?.value || "";
    const list = state.teams.filter((t) => {
      if (filter && t.status !== filter) return false;
      if (!query) return true;
      return [t.name, t.lead, t.sector, t.short].some((v) => String(v || "").toLowerCase().includes(query));
    });
    if (!list.length) {
      wrap.innerHTML = '<div class="empty">No teams match this filter.</div>';
      return;
    }
    wrap.innerHTML = list.map((team) => {
      const meta = U.statusMeta[team.status] || U.statusMeta.standby;
      const selected = team.id === state.selectedTeamId ? " selected" : "";
      return `
        <button class="team-card${selected}" data-team-id="${team.id}">
          <div class="team-avatar ${meta.css === "onsite" ? "green" : meta.css === "enroute" ? "amber" : meta.css === "sos" ? "red" : "purple"}" style="width:32px;height:32px;font-size:11px">${teamMonogram(team)}</div>
          <div class="tc-body">
            <div class="tc-name">${esc(team.name)} ${statusDot(team.status)}</div>
            <div class="tc-sub">${esc(team.lead || "—")} · ${esc(team.sector || "—")}</div>
          </div>
          <div class="tc-right">
            <b>${(team.speed ?? 0).toFixed(1)} km/h</b>
            <span>${fmtMinutesAgo(team.lastSeen)}</span>
          </div>
        </button>`;
    }).join("");
  };

  const updateTeamDetail = () => {
    const team = teamById(state.selectedTeamId);
    const badge = $("#detailStatus");
    if (!team) {
      setText("detailName", "Select a team");
      setText("detailSector", "Click a team on the map or list");
      setText("detailLead", "—"); setText("detailMembers", "—");
      setText("detailSpeed", "—"); setText("detailBattery", "—");
      setText("detailUpdated", "—"); setText("detailCoords", "—");
      if ($("#detailMonogram")) $("#detailMonogram").textContent = "—";
      if (badge) { badge.className = "badge badge-muted"; badge.textContent = "—"; }
      setText("mapSelectedLabel", "No team selected");
      return;
    }
    const meta = U.statusMeta[team.status] || U.statusMeta.standby;
    if ($("#detailMonogram")) $("#detailMonogram").textContent = teamMonogram(team);
    setText("detailName", team.name);
    setText("detailSector", `${team.sector || "Mt. Lantin area"} · ${team.kind || "Ground"} unit`);
    setText("detailLead", team.lead || "—");
    setText("detailMembers", `${team.members || 0} personnel`);
    setText("detailSpeed", `${(team.speed ?? 0).toFixed(1)} km/h`);
    setText("detailBattery", `${Math.round(team.battery ?? 0)}%`);
    setText("detailUpdated", fmtMinutesAgo(team.updatedAt || team.lastSeen));
    setText("detailCoords", `${team.lat?.toFixed(5)}, ${team.lng?.toFixed(5)}`);
    if (badge) { badge.className = `badge ${meta.badge}`; badge.textContent = meta.label; }
    setText("mapSelectedLabel", `${team.name} selected · ${team.sector || "Mt. Lantin"}`);
  };

  const focusSelectedTeam = (zoom = 15) => {
    const team = teamById(state.selectedTeamId);
    if (!team || !state.maps.admin) return;
    // Never call flyTo on a hidden (zero-size) map — Leaflet can
    // otherwise compute NaN coordinates.
    if (!$("#view-map")?.classList.contains("active")) return;
    state.maps.admin.invalidate();
    state.maps.admin.focus(team.lat, team.lng, zoom);
    if (state.showTrails) refreshSelectedTrail();
  };

  const selectTeam = (teamId, { jump = false } = {}) => {
    state.selectedTeamId = teamId;
    renderTeamList();
    updateTeamDetail();
    if (jump) {
      switchView("map");
      setTimeout(() => focusSelectedTeam(15), 220);
    } else {
      focusSelectedTeam(15);
    }
  };

  const refreshSelectedTrail = async () => {
    const team = teamById(state.selectedTeamId);
    if (!team || !state.maps.admin) return;
    const coords = await Tracking.getTrail(team.id, 40);
    coords.push([team.lat, team.lng]);
    state.maps.admin.showTrail(coords, team.status === "sos" ? "#ff5a6a" : "#a78bfa");
  };

  const clearTrail = () => {
    state.maps.admin?.clearTrail();
  };

  const populateAssignTargets = () => {
    const select = $("#assignTarget");
    if (!select) return;
    select.innerHTML = Routing.PLACES.map((p, i) => `<option value="${i}">${esc(p.name)} — ${esc(p.detail)}</option>`).join("");
  };

  const assignRoute = async () => {
    const team = teamById(state.selectedTeamId);
    if (!team) {
      toast("Select a team first, then choose a destination.", "warn", "No team selected");
      return;
    }
    const target = Routing.PLACES[Number($("#assignTarget")?.value || 0)];
    if (!target) return;
    const hint = $("#assignResult");
    if (hint) hint.textContent = "Calculating route…";
    const route = await Routing.getRoute([team.lat, team.lng], [target.lat, target.lng], "driving");
    if (!route.ok) {
      if (hint) hint.textContent = "Route could not be calculated.";
      return;
    }
    state.route = route;
    state.routeTeamId = team.id;
    state.maps.admin?.drawRoute(route);
    if (hint) {
      hint.innerHTML = `${U.formatDistance(route.distance)} · ${U.formatDuration(route.duration)} · ${route.source === "osrm" ? "road route" : "offline route"}`;
    }
    await DB.put("messages", {
      id: U.randomId("msg"),
      channel: team.id ? `team:${team.id}` : "command",
      senderId: state.user.id,
      senderName: "Command Center",
      text: `Route assigned: proceed to ${target.name} (${U.formatDistance(route.distance)}, ${U.formatDuration(route.duration)}).`,
      ts: Date.now(),
      readBy: [state.user.id],
    });
    await Auth.audit(state.user, "MISSION", `Routed ${team.name} to ${target.name}`);
    Tracking.notify("messages", { teamId: team.id });
    toast(`Route sent to ${team.name}.`, "success", "Route assigned");
  };

  /* ---------------- Missions ---------------- */
  const missionFilters = () => ({
    query: ($("#missionSearch")?.value || "").trim().toLowerCase(),
    status: $("#missionStatusFilter")?.value || "",
    priority: $("#missionPriorityFilter")?.value || "",
  });

  const renderMissions = () => {
    const body = $("#missionRows");
    if (!body) return;
    const { query, status, priority } = missionFilters();
    const list = [...state.missions]
      .filter((m) => {
        if (status && m.status !== status) return false;
        if (priority && m.priority !== priority) return false;
        if (!query) return true;
        return [m.name, m.code, m.lead, m.sector, m.type].some((v) => String(v || "").toLowerCase().includes(query));
      })
      .sort((a, b) => (MISSION_STATUS_ORDER[a.status] ?? 9) - (MISSION_STATUS_ORDER[b.status] ?? 9) || b.updatedAt - a.updatedAt);

    setText("missionActiveCount", state.missions.filter((m) => m.status === "In progress").length);
    setText("missionMonitoringCount", state.missions.filter((m) => m.status === "Monitoring").length);
    setText("missionCompletedCount", state.missions.filter((m) => m.status === "Completed").length);

    if (!list.length) {
      body.innerHTML = '<tr><td colspan="7"><div class="empty">No missions match this filter.</div></td></tr>';
      return;
    }
    body.innerHTML = list.map((m) => {
      const statusBadge = m.status === "Completed" ? "badge-green" : m.status === "Monitoring" ? "badge-blue" : m.status === "Planned" ? "badge-muted" : "badge-amber";
      const priorityCls = U.severityMeta[m.priority]?.badge || "badge-muted";
      return `
        <tr>
          <td class="strong">${esc(m.code)}<div class="e" style="color:var(--muted-2);font-size:10px">${esc(m.name)}</div></td>
          <td><span class="badge ${statusBadge}">${esc(m.status)}</span></td>
          <td><span class="badge ${priorityCls}">${esc(m.priority || "—")}</span></td>
          <td>${esc(m.lead || "—")}<div class="e" style="color:var(--muted-2);font-size:10px">${esc(teamById(m.teamId)?.name || "Unassigned")}</div></td>
          <td style="min-width:120px">
            <div class="mini-progress"><i style="width:${m.progress || 0}%"></i></div>
            <span class="tiny muted-2">${m.progress || 0}%</span>
          </td>
          <td class="mono tiny">${U.fmtDateTime(m.startedAt || m.createdAt)}</td>
          <td class="actions">
            <button class="tbtn" data-mission-view="${m.id}" title="View">${U.icon("eye")}</button>
            <button class="tbtn" data-mission-edit="${m.id}" title="Edit">${U.icon("edit")}</button>
            <button class="tbtn" data-mission-advance="${m.id}" title="Advance progress">${U.icon("check")}</button>
          </td>
        </tr>`;
    }).join("");
  };

  const nextMissionCode = () => {
    const year = new Date().getFullYear();
    const nums = state.missions
      .map((m) => Number(String(m.code || "").split("-").pop()))
      .filter((n) => Number.isFinite(n));
    const next = (nums.length ? Math.max(...nums) : 0) + 1;
    return `MSN-${year}-${String(next).padStart(3, "0")}`;
  };

  const teamOptions = (selected) =>
    state.teams.map((t) => `<option value="${t.id}" ${t.id === selected ? "selected" : ""}>${esc(t.name)} · ${esc(t.lead || "—")}</option>`).join("");

  const openMissionModal = (mission = null) => {
    const editing = !!mission;
    const placeOptions = Routing.PLACES.map((p, i) =>
      `<option value="${i}" ${mission && Math.abs(p.lat - mission.lat) < 0.0001 ? "selected" : ""}>${esc(p.name)} — ${esc(p.detail)}</option>`
    ).join("");
    const m = U.modal({
      title: editing ? `Edit ${mission.code}` : "Dispatch new mission",
      subtitle: editing ? mission.name : "Create a mission and assign a team",
      wide: true,
      body: `
        <form id="missionForm" class="form-grid cols-2">
          <div class="field" style="grid-column:1/-1"><label for="msnName">Mission name</label><input class="input" id="msnName" required value="${editing ? esc(mission.name) : ""}" placeholder="e.g. Mt. Lantin Rescue"></div>
          <div class="field"><label for="msnType">Type</label>
            <select class="select" id="msnType">
              ${["Mountain SAR", "Search", "Landslide response", "Medevac", "Flood rescue", "Fire support", "Other"]
                .map((t) => `<option ${editing && mission.type === t ? "selected" : ""}>${t}</option>`).join("")}
            </select>
          </div>
          <div class="field"><label for="msnPriority">Priority</label>
            <select class="select" id="msnPriority">
              ${["Critical", "High", "Medium", "Low"].map((p) => `<option ${editing ? (mission.priority === p ? "selected" : "") : (p === "High" ? "selected" : "")}>${p}</option>`).join("")}
            </select>
          </div>
          <div class="field"><label for="msnStatus">Status</label>
            <select class="select" id="msnStatus">
              ${["Planned", "In progress", "Monitoring", "Completed"].map((s) => `<option ${editing ? (mission.status === s ? "selected" : "") : (s === "In progress" ? "selected" : "")}>${s}</option>`).join("")}
            </select>
          </div>
          <div class="field"><label for="msnSector">Sector</label><input class="input" id="msnSector" value="${editing ? esc(mission.sector || "") : "Sector A"}" placeholder="Sector A"></div>
          <div class="field"><label for="msnTeam">Assigned team</label><select class="select" id="msnTeam">${teamOptions(editing ? mission.teamId : null)}</select></div>
          <div class="field"><label for="msnLead">Mission lead</label><input class="input" id="msnLead" value="${editing ? esc(mission.lead || "") : ""}" placeholder="Team lead name"></div>
          <div class="field"><label for="msnPlace">Staging / target location</label><select class="select" id="msnPlace">${placeOptions}</select></div>
          <div class="field"><label for="msnProgress">Progress (%)</label><input class="input" id="msnProgress" type="number" min="0" max="100" value="${editing ? mission.progress || 0 : 0}"></div>
          <div class="field"><label for="msnSubjects">Subjects / scope</label><input class="input" id="msnSubjects" value="${editing ? esc(mission.subjects || "") : ""}" placeholder="e.g. 2 lost hikers"></div>
          <div class="field" style="grid-column:1/-1"><label for="msnDesc">Briefing</label><textarea class="input" id="msnDesc" rows="3" placeholder="Operational brief for the field team">${editing ? esc(mission.description || "") : ""}</textarea></div>
          <div class="field" style="grid-column:1/-1"><label for="msnHazards">Hazards</label><input class="input" id="msnHazards" value="${editing ? esc(mission.hazards || "") : ""}" placeholder="e.g. Rockfall in Sector C"></div>
        </form>`,
      footer: `<button class="btn" data-close>Cancel</button><button class="btn btn-primary" data-save>${editing ? "Save mission" : "Dispatch mission"}</button>`,
    });

    m.el.querySelector("[data-save]").addEventListener("click", async () => {
      const form = m.el.querySelector("#missionForm");
      if (!form.reportValidity()) return;
      const place = Routing.PLACES[Number(m.el.querySelector("#msnPlace").value || 0)];
      const teamId = m.el.querySelector("#msnTeam").value;
      const team = teamById(teamId);
      const payload = {
        name: m.el.querySelector("#msnName").value.trim(),
        type: m.el.querySelector("#msnType").value,
        priority: m.el.querySelector("#msnPriority").value,
        status: m.el.querySelector("#msnStatus").value,
        sector: m.el.querySelector("#msnSector").value.trim(),
        teamId,
        lead: m.el.querySelector("#msnLead").value.trim() || team?.lead || "",
        lat: place?.lat ?? 16.4037,
        lng: place?.lng ?? 120.6012,
        progress: U.clamp(Number(m.el.querySelector("#msnProgress").value || 0), 0, 100),
        subjects: m.el.querySelector("#msnSubjects").value.trim(),
        description: m.el.querySelector("#msnDesc").value.trim(),
        hazards: m.el.querySelector("#msnHazards").value.trim(),
      };
      if (editing) {
        Object.assign(mission, payload, { updatedAt: Date.now() });
        mission.timeline = mission.timeline || [];
        mission.timeline.push({ t: U.fmtTime(), text: `Brief updated by command` });
        await DB.put("missions", mission);
        await Auth.audit(state.user, "MISSION", `Updated ${mission.code}`);
        toast(`${mission.code} updated.`, "success", "Mission saved");
      } else {
        const code = nextMissionCode();
        const now = Date.now();
        const record = {
          id: U.randomId("msn"),
          code,
          ...payload,
          weather: "To be confirmed",
          lastSeen: place?.name || "—",
          startedAt: now,
          createdAt: now,
          updatedAt: now,
          checkpoints: [{ name: "Staging area", detail: place?.name || "—", time: U.fmtTime(), done: true, next: true }],
          timeline: [{ t: U.fmtTime(), text: `Mission dispatched to ${team?.name || "team"}` }],
          createdBy: state.user.id,
        };
        await DB.put("missions", record);
        if (team) {
          team.missionId = record.id;
          if (team.status === "standby") team.status = "enroute";
          team.updatedAt = now;
          await DB.put("teams", team);
        }
        await DB.put("messages", {
          id: U.randomId("msg"),
          channel: team ? `team:${team.id}` : "command",
          senderId: state.user.id,
          senderName: "Command Center",
          text: `New mission ${code}: ${record.name}. ${record.description || "Await further instructions."}`,
          ts: now,
          readBy: [state.user.id],
        });
        await Auth.audit(state.user, "MISSION", `Dispatched ${code} to ${team?.name || "unassigned"}`);
        Tracking.notify("missions", { missionId: record.id });
        toast(`${code} dispatched.`, "success", "Mission created");
      }
      m.close();
      await refresh();
    });
  };

  const openMissionDetail = (missionId) => {
    const m = state.missions.find((x) => x.id === missionId);
    if (!m) return;
    const team = teamById(m.teamId);
    const priorityCls = U.severityMeta[m.priority]?.badge || "badge-muted";
    const modal = U.modal({
      title: `${m.code} · ${m.name}`,
      subtitle: `${m.type} · ${m.sector || "—"} · ${team?.name || "Unassigned"}`,
      wide: true,
      body: `
        <div class="row between wrap" style="margin-bottom:14px">
          <span class="badge ${m.status === "Completed" ? "badge-green" : "badge-amber"}">${esc(m.status)}</span>
          <span class="badge ${priorityCls}">Priority: ${esc(m.priority)}</span>
          <span class="badge badge-blue">${m.progress || 0}% complete</span>
        </div>
        <div class="big-progress" style="margin-bottom:16px"><i style="width:${m.progress || 0}%"></i></div>
        <div class="brief-grid">
          <div class="brief-item"><div class="k">Lead</div><div class="v">${esc(m.lead || "—")}</div></div>
          <div class="brief-item"><div class="k">Team</div><div class="v">${esc(team?.name || "Unassigned")}</div></div>
          <div class="brief-item"><div class="k">Subjects</div><div class="v">${esc(m.subjects || "—")}</div></div>
          <div class="brief-item"><div class="k">Last seen</div><div class="v">${esc(m.lastSeen || "—")}</div></div>
          <div class="brief-item"><div class="k">Weather</div><div class="v">${esc(m.weather || "—")}</div></div>
          <div class="brief-item"><div class="k">Hazards</div><div class="v">${esc(m.hazards || "—")}</div></div>
        </div>
        <div class="divider" style="margin:16px 0"></div>
        <p class="small" style="color:var(--muted);line-height:1.7">${esc(m.description || "No briefing recorded.")}</p>
        <div class="grid grid-2" style="margin-top:16px">
          <div>
            <div class="tiny uppercase muted-2" style="margin-bottom:9px">Checkpoints</div>
            ${(m.checkpoints || []).map((c) => `
              <div class="checkpoint ${c.done ? "done" : c.next ? "next" : ""}">
                <span class="cp-dot"></span>
                <div class="cp-name">${esc(c.name)}</div>
                <div class="cp-meta">${esc(c.detail || "")} · ${esc(c.time || "")}</div>
              </div>`).join("") || '<div class="empty">No checkpoints.</div>'}
          </div>
          <div>
            <div class="tiny uppercase muted-2" style="margin-bottom:9px">Timeline</div>
            <div class="timeline">
              ${(m.timeline || []).map((t) => `<div class="tl-item"><div class="tl-time">${esc(t.t)}</div><div class="tl-text">${esc(t.text)}</div></div>`).join("")}
            </div>
          </div>
        </div>`,
      footer: `
        <button class="btn" data-close>Close</button>
        <button class="btn" data-edit>Edit</button>
        <button class="btn" data-advance>Advance 10%</button>
        <button class="btn btn-primary" data-complete>Mark complete</button>`,
    });
    modal.el.querySelector("[data-edit]").addEventListener("click", () => { modal.close(); openMissionModal(m); });
    modal.el.querySelector("[data-advance]").addEventListener("click", async () => {
      m.progress = U.clamp((m.progress || 0) + 10, 0, 100);
      m.updatedAt = Date.now();
      m.timeline = m.timeline || [];
      m.timeline.push({ t: U.fmtTime(), text: `Progress advanced to ${m.progress}%` });
      if (m.progress >= 100) m.status = "Completed";
      await DB.put("missions", m);
      await Auth.audit(state.user, "MISSION", `${m.code} advanced to ${m.progress}%`);
      modal.close();
      toast(`${m.code} now ${m.progress}%.`, "success", "Mission updated");
      await refresh();
    });
    modal.el.querySelector("[data-complete]").addEventListener("click", async () => {
      m.progress = 100;
      m.status = "Completed";
      m.updatedAt = Date.now();
      m.timeline = m.timeline || [];
      m.timeline.push({ t: U.fmtTime(), text: "Mission marked complete by command" });
      await DB.put("missions", m);
      if (team && team.missionId === m.id) {
        team.missionId = null;
        await DB.put("teams", team);
      }
      await Auth.audit(state.user, "MISSION", `${m.code} completed`);
      Tracking.notify("missions", { missionId: m.id });
      modal.close();
      toast(`${m.code} completed.`, "success", "Mission closed");
      await refresh();
    });
  };

  const advanceMission = async (missionId) => {
    const m = state.missions.find((x) => x.id === missionId);
    if (!m) return;
    m.progress = U.clamp((m.progress || 0) + 10, 0, 100);
    if (m.progress >= 100) m.status = "Completed";
    m.updatedAt = Date.now();
    m.timeline = m.timeline || [];
    m.timeline.push({ t: U.fmtTime(), text: `Progress advanced to ${m.progress}%` });
    await DB.put("missions", m);
    await Auth.audit(state.user, "MISSION", `${m.code} advanced to ${m.progress}%`);
    toast(`${m.code} now ${m.progress}%.`, "success", "Mission updated");
    await refresh();
  };

  /* ---------------- Personnel ---------------- */
  const renderPersonnel = () => {
    const body = $("#personnelRows");
    if (!body) return;
    const query = ($("#personnelSearch")?.value || "").trim().toLowerCase();
    const role = $("#personnelRoleFilter")?.value || "";
    const status = $("#personnelStatusFilter")?.value || "";

    const list = state.users.filter((u) => {
      if (role && u.role !== role) return false;
      if (status && u.status !== status) return false;
      if (!query) return true;
      return [u.name, u.email, u.responderId, u.team, u.title].some((v) => String(v || "").toLowerCase().includes(query));
    }).sort((a, b) => (a.role === b.role ? a.name.localeCompare(b.name) : a.role === "admin" ? -1 : 1));

    setText("personnelTotal", state.users.length);
    setText("personnelField", state.users.filter((u) => u.role === "user").length);
    setText("personnelSuspended", state.users.filter((u) => u.status !== "active").length);

    if (!list.length) {
      body.innerHTML = '<tr><td colspan="7"><div class="empty">No accounts match this filter.</div></td></tr>';
      return;
    }
    body.innerHTML = list.map((u) => {
      const active = u.status === "active";
      const isAdmin = u.role === "admin";
      return `
        <tr>
          <td>
            <div class="row-user">
              <div class="avatar ${isAdmin ? "" : "green"}" style="width:30px;height:30px;font-size:10px;${isAdmin ? "background:#251d3d;border-color:#45336b;color:var(--purple)" : ""}">${U.initials(u.name)}</div>
              <div><div class="n">${esc(u.name)}</div><div class="e">${esc(u.email)}</div></div>
            </div>
          </td>
          <td><span class="badge ${isAdmin ? "badge-purple" : "badge-blue"}">${isAdmin ? "Admin" : "Responder"}</span></td>
          <td>${esc(u.team || "Unassigned")}</td>
          <td class="mono tiny">${esc(u.responderId || "—")}</td>
          <td><span class="badge ${active ? "badge-green" : "badge-red"}">${active ? "Active" : "Suspended"}</span></td>
          <td class="tiny">${u.lastLogin ? U.fmtRelative(u.lastLogin) : "—"}</td>
          <td class="actions">
            <button class="tbtn" data-user-toggle="${u.id}" title="${active ? "Suspend" : "Activate"}">${U.icon(active ? "lock" : "power")}</button>
            <button class="tbtn" data-user-edit="${u.id}" title="Edit">${U.icon("edit")}</button>
            <button class="tbtn" data-user-delete="${u.id}" title="Delete">${U.icon("trash")}</button>
          </td>
        </tr>`;
    }).join("");
  };

  const renderTeamRoster = () => {
    const body = $("#teamRosterRows");
    if (!body) return;
    if (!state.teams.length) {
      body.innerHTML = '<tr><td colspan="7"><div class="empty">No teams registered.</div></td></tr>';
      return;
    }
    const interval = state.settings?.checkinMinutes || 15;
    body.innerHTML = state.teams.map((t) => {
      const meta = U.statusMeta[t.status] || U.statusMeta.standby;
      const overdue = (t.lastCheckin || 0) + interval * 60000 < Date.now() && t.status !== "sos";
      return `
        <tr>
          <td class="strong">${esc(t.name)} <span class="tiny muted-2">${esc(t.short || "")}</span></td>
          <td>${esc(t.kind || "Ground")}</td>
          <td>${esc(t.lead || "—")}</td>
          <td>${t.members || 0}</td>
          <td>${esc(t.sector || "—")}</td>
          <td><span class="badge ${meta.badge}">${meta.label}</span></td>
          <td class="${overdue ? "" : "tiny"}" style="${overdue ? "color:var(--warn)" : ""}">${t.lastCheckin ? U.fmtRelative(t.lastCheckin) : "never"}${overdue ? " · overdue" : ""}</td>
        </tr>`;
    }).join("");
  };

  const openPersonnelModal = (user = null) => {
    const editing = !!user;
    const m = U.modal({
      title: editing ? `Edit ${user.name}` : "Add responder",
      subtitle: editing ? user.email : "Create a field account",
      body: `
        <form id="personnelForm" class="form-grid cols-2">
          <div class="field" style="grid-column:1/-1"><label for="perName">Full name</label><input class="input" id="perName" required value="${editing ? esc(user.name) : ""}"></div>
          <div class="field"><label for="perEmail">Email</label><input class="input" id="perEmail" type="email" required ${editing ? "readonly" : ""} value="${editing ? esc(user.email) : ""}"></div>
          <div class="field"><label for="perPhone">Phone</label><input class="input" id="perPhone" value="${editing ? esc(user.phone || "") : ""}"></div>
          <div class="field"><label for="perRole">Role</label>
            <select class="select" id="perRole" ${editing ? "disabled" : ""}>
              <option value="user" ${editing && user.role === "user" ? "selected" : ""}>Responder</option>
              <option value="admin" ${editing && user.role === "admin" ? "selected" : ""}>Administrator</option>
            </select>
          </div>
          <div class="field"><label for="perTeam">Team</label><select class="select" id="perTeam">${teamOptions(editing ? user.teamId : null)}</select></div>
          <div class="field"><label for="perTitle">Title</label><input class="input" id="perTitle" value="${editing ? esc(user.title || "") : ""}" placeholder="Field Responder"></div>
          <div class="field"><label for="perCert">Certification</label><input class="input" id="perCert" value="${editing ? esc(user.cert || "") : ""}" placeholder="Wilderness First Responder"></div>
          ${editing ? "" : `<div class="field"><label for="perPass">Temporary password</label><input class="input" id="perPass" type="text" value="Rescue@2026" required></div>`}
        </form>`,
      footer: `<button class="btn" data-close>Cancel</button><button class="btn btn-primary" data-save>${editing ? "Save changes" : "Create account"}</button>`,
    });
    m.el.querySelector("[data-save]").addEventListener("click", async () => {
      const form = m.el.querySelector("#personnelForm");
      if (!form.reportValidity()) return;
      const name = m.el.querySelector("#perName").value.trim();
      const email = m.el.querySelector("#perEmail").value.trim().toLowerCase();
      const phone = m.el.querySelector("#perPhone").value.trim();
      const role = editing ? user.role : m.el.querySelector("#perRole").value;
      const teamId = m.el.querySelector("#perTeam").value;
      const team = teamById(teamId);
      const title = m.el.querySelector("#perTitle").value.trim();
      const cert = m.el.querySelector("#perCert").value.trim();

      if (editing) {
        Object.assign(user, {
          name, phone, teamId: teamId || null, team: team?.name || user.team,
          title: title || user.title, cert,
        });
        await DB.put("users", user);
        await Auth.audit(state.user, "PERSONNEL", `Updated account ${user.email}`);
        toast(`${name} updated.`, "success", "Account saved");
      } else {
        if (!Auth.emailOk(email)) { toast("Enter a valid email address.", "error"); return; }
        if (state.users.some((u) => u.email.toLowerCase() === email)) {
          toast("An account with that email already exists.", "error"); return;
        }
        const password = m.el.querySelector("#perPass").value || "Rescue@2026";
        const { salt, hash, algo } = await U.hashPassword(password);
        const now = Date.now();
        const record = {
          id: U.randomId("u"), name, email, role,
          title: title || (role === "admin" ? "Administrator" : `Field Responder · ${team?.name || "Unassigned"}`),
          org: state.user.org || "Provincial Rescue Coordination Office",
          phone,
          teamId: role === "admin" ? "team_command" : (teamId || null),
          team: role === "admin" ? "Command Center" : (team?.name || "Unassigned"),
          status: "active",
          responderId: role === "admin"
            ? `ADM-${String(state.users.filter((u) => u.role === "admin").length + 1).padStart(4, "0")}`
            : `FR-${String(200 + state.users.filter((u) => u.role === "user").length + 1).padStart(4, "0")}`,
          cert, salt, hash, algo, createdAt: now, lastLogin: null,
        };
        await DB.put("users", record);
        await DB.put("settings", {
          userId: record.id, shareLocation: true, backgroundTracking: true,
          checkinMinutes: 15, notifications: { sos: true, checkin: true, messages: true, weather: true }, createdAt: now,
        });
        await Auth.audit(state.user, "PERSONNEL", `Created ${role} account ${email}`);
        toast(`${name} can sign in with the temporary password.`, "success", "Responder added");
      }
      m.close();
      await refresh();
    });
  };

  const toggleUser = async (userId) => {
    const u = state.users.find((x) => x.id === userId);
    if (!u) return;
    if (u.id === state.user.id) { toast("You cannot suspend your own account.", "warn"); return; }
    const suspend = u.status === "active";
    if (suspend) {
      const ok = await U.confirm({ title: `Suspend ${u.name}?`, message: "The account will be blocked from signing in until reactivated.", confirmText: "Suspend", danger: true });
      if (!ok) return;
    }
    u.status = suspend ? "suspended" : "active";
    await DB.put("users", u);
    await Auth.audit(state.user, "PERSONNEL", `${suspend ? "Suspended" : "Reactivated"} ${u.email}`);
    toast(`${u.name} ${suspend ? "suspended" : "reactivated"}.`, suspend ? "warn" : "success");
    await refresh();
  };

  const deleteUser = async (userId) => {
    const u = state.users.find((x) => x.id === userId);
    if (!u) return;
    if (u.id === state.user.id) { toast("You cannot delete your own account.", "warn"); return; }
    const ok = await U.confirm({ title: `Delete ${u.name}?`, message: "This removes the account and its settings from the local database. This cannot be undone.", confirmText: "Delete", danger: true });
    if (!ok) return;
    await DB.del("users", u.id);
    await DB.del("settings", u.id).catch(() => {});
    await Auth.audit(state.user, "PERSONNEL", `Deleted account ${u.email}`);
    toast(`${u.name} removed.`, "success");
    await refresh();
  };

  /* ---------------- Incidents ---------------- */
  const severityRank = { Critical: 0, High: 1, Medium: 2, Low: 3 };

  const renderIncidents = () => {
    const wrap = $("#incidentList");
    if (!wrap) return;
    const query = ($("#incidentSearch")?.value || "").trim().toLowerCase();
    const severity = $("#incidentSeverityFilter")?.value || "";
    const status = $("#incidentStatusFilter")?.value || "";
    const list = state.incidents.filter((i) => {
      if (severity && i.severity !== severity) return false;
      if (status && i.status !== status) return false;
      if (!query) return true;
      return [i.title, i.code, i.reporterName, i.sector, i.type].some((v) => String(v || "").toLowerCase().includes(query));
    }).sort((a, b) => (severityRank[a.severity] ?? 9) - (severityRank[b.severity] ?? 9) || b.ts - a.ts);

    if (!list.length) {
      wrap.innerHTML = '<div class="empty">No incidents match this filter.</div>';
      return;
    }
    wrap.innerHTML = list.map((inc) => {
      const statusMeta = U.incidentStatusMeta[inc.status] || { badge: "badge-muted", label: inc.status };
      const team = teamById(inc.teamId);
      return `
        <div class="incident-card" style="border-radius:0;border-left:0;border-right:0;border-top:0">
          <div class="ic-head">
            <div>
              <div class="ic-title">${esc(inc.title)} <span class="severity-pill ${inc.severity}">${esc(inc.severity)}</span></div>
              <div class="ic-meta">
                <span>${U.icon("file")} ${esc(inc.code)}</span>
                <span>${U.icon("user")} ${esc(inc.reporterName || "field")}</span>
                <span>${U.icon("pin")} ${esc(inc.sector || "—")}</span>
                <span>${U.icon("clock")} ${U.fmtRelative(inc.ts)}</span>
                ${team ? `<span>${U.icon("users")} ${esc(team.name)}</span>` : ""}
              </div>
            </div>
            <span class="badge ${statusMeta.badge}">${statusMeta.label}</span>
          </div>
          <div class="ic-desc">${esc(inc.description || "")}</div>
          <div class="row wrap" style="gap:6px;margin-top:10px">
            ${inc.status === "open" ? `<button class="btn btn-sm" data-incident-status="acknowledged" data-incident-id="${inc.id}">Acknowledge</button>` : ""}
            ${inc.status !== "escalated" && inc.status !== "resolved" ? `<button class="btn btn-sm btn-danger" data-incident-status="escalated" data-incident-id="${inc.id}">Escalate</button>` : ""}
            ${inc.status !== "resolved" ? `<button class="btn btn-sm btn-primary" data-incident-status="resolved" data-incident-id="${inc.id}">Resolve</button>` : ""}
            <button class="btn btn-sm btn-ghost" data-incident-locate="${inc.id}">Show on map</button>
            <button class="btn btn-sm btn-ghost" data-incident-assign="${inc.id}">Assign team</button>
          </div>
        </div>`;
    }).join("");
  };

  const setIncidentStatus = async (incidentId, status) => {
    const inc = state.incidents.find((i) => i.id === incidentId);
    if (!inc) return;
    inc.status = status;
    inc.updatedAt = Date.now();
    await DB.put("incidents", inc);
    if (status === "resolved" && inc.type === "SOS" && inc.teamId) {
      await Tracking.clearSos(inc.teamId, state.user);
    }
    await Auth.audit(state.user, "INCIDENT", `${inc.code} marked ${status}`);
    Tracking.notify("incidents", { incidentId: inc.id });
    toast(`${inc.code} ${status}.`, status === "resolved" ? "success" : "info", "Incident updated");
    await refresh();
  };

  const assignIncidentTeam = async (incidentId) => {
    const inc = state.incidents.find((i) => i.id === incidentId);
    if (!inc) return;
    const m = U.modal({
      title: `Assign ${inc.code}`,
      subtitle: inc.title,
      body: `
        <div class="field"><label for="incTeam">Responding team</label>
          <select class="select" id="incTeam">${teamOptions(inc.teamId)}</select>
        </div>
        <div class="field" style="margin-top:12px"><label for="incNote">Instruction to team</label>
          <textarea class="input" id="incNote" rows="2" placeholder="Optional note sent with the assignment"></textarea>
        </div>`,
      footer: `<button class="btn" data-close>Cancel</button><button class="btn btn-primary" data-save>Assign</button>`,
    });
    m.el.querySelector("[data-save]").addEventListener("click", async () => {
      const teamId = m.el.querySelector("#incTeam").value;
      const team = teamById(teamId);
      const note = m.el.querySelector("#incNote").value.trim();
      inc.teamId = teamId;
      inc.assignedTo = team?.name || "";
      inc.status = inc.status === "open" ? "acknowledged" : inc.status;
      inc.updatedAt = Date.now();
      await DB.put("incidents", inc);
      if (team) {
        await DB.put("messages", {
          id: U.randomId("msg"),
          channel: `team:${team.id}`,
          senderId: state.user.id,
          senderName: "Command Center",
          text: `Incident ${inc.code} assigned to ${team.name}. ${note || inc.title}`,
          ts: Date.now(),
          readBy: [state.user.id],
        });
        Tracking.notify("messages", { teamId: team.id });
      }
      await Auth.audit(state.user, "INCIDENT", `${inc.code} assigned to ${team?.name || "team"}`);
      m.close();
      toast(`${inc.code} assigned to ${team?.name || "team"}.`, "success", "Incident assigned");
      await refresh();
    });
  };

  /* ---------------- Messages / broadcast ---------------- */
  const renderBroadcast = () => {
    const feed = $("#broadcastFeed");
    const traffic = $("#teamTraffic");
    if (feed) {
      const command = state.messages.filter((m) => m.channel === "command").slice().reverse().slice(0, 40);
      setText("broadcastFeedCount", `${command.length} messages`);
      feed.innerHTML = command.length ? command.map((msg) => {
        const mine = msg.senderId === state.user.id;
        return `
          <div class="msg-preview">
            <div class="avatar ${mine ? "" : "green"}" style="width:28px;height:28px;font-size:9px;${mine ? "background:#251d3d;border-color:#45336b;color:var(--purple)" : ""}">${U.initials(msg.senderName || "CMD")}</div>
            <div class="mp-body">
              <div class="mp-head"><b>${esc(msg.senderName || "Field")}</b><span>${U.fmtRelative(msg.ts)}</span></div>
              <div class="mp-text">${msg.sos ? `<b style="color:var(--danger)">SOS</b> · ` : ""}${esc(msg.text)}</div>
            </div>
          </div>`;
      }).join("") : '<div class="empty">No command messages yet.</div>';
    }
    if (traffic) {
      const teamMsgs = state.messages.filter((m) => m.channel?.startsWith("team:")).slice().reverse().slice(0, 40);
      traffic.innerHTML = teamMsgs.length ? teamMsgs.map((msg) => {
        const teamId = msg.channel.split(":")[1];
        const team = teamById(teamId);
        return `
          <div class="msg-preview">
            <div class="team-avatar purple" style="width:28px;height:28px;font-size:9px">${teamMonogram(team)}</div>
            <div class="mp-body">
              <div class="mp-head"><b>${esc(msg.senderName || team?.name || "Team")}</b><span>${U.fmtRelative(msg.ts)}</span></div>
              <div class="mp-text">${esc(msg.text)}</div>
            </div>
          </div>`;
      }).join("") : '<div class="empty">No team traffic yet.</div>';
    }
  };

  const populateBroadcastChannels = () => {
    const select = $("#broadcastChannel");
    if (!select) return;
    const current = select.value;
    select.innerHTML = `<option value="command">Command · all teams</option>` +
      state.teams.map((t) => `<option value="team:${t.id}">${esc(t.name)} · direct</option>`).join("");
    if (current && [...select.options].some((o) => o.value === current)) select.value = current;
  };

  const sendBroadcast = async () => {
    const text = ($("#broadcastInput")?.value || "").trim();
    if (!text) { toast("Type a message before broadcasting.", "warn"); return; }
    const channel = $("#broadcastChannel")?.value || "command";
    const priority = $("#broadcastPriority")?.value || "normal";
    const message = {
      id: U.randomId("msg"),
      channel,
      senderId: state.user.id,
      senderName: "Command Center",
      text,
      priority,
      ts: Date.now(),
      readBy: [state.user.id],
      sos: priority === "emergency",
    };
    await DB.put("messages", message);
    await Auth.audit(state.user, "BROADCAST", `${priority === "normal" ? "" : priority.toUpperCase() + " "}${channel === "command" ? "All teams" : teamById(channel.split(":")[1])?.name || "team"}: ${text.slice(0, 80)}`);
    Tracking.notify("messages", { messageId: message.id });
    if ($("#broadcastInput")) $("#broadcastInput").value = "";
    setText("broadcastCount", "0 / 500 characters");
    toast("Broadcast sent to every open dashboard.", "success", "Message sent");
    await refresh();
  };

  const BROADCAST_TEMPLATES = {
    advance: "All teams, advance to your assigned waypoint and report on arrival. Maintain radio contact every 15 minutes.",
    checkin: "Check-in window is open. Send your position and status when you reach the next checkpoint.",
    weather: "Weather advisory: visibility is dropping in the upper sectors. Reduce speed, use the marked trail and confirm receipt.",
    sos: "Emergency: all available teams confirm availability to respond to an active SOS. Report ETA to command.",
  };

  /* ---------------- Reports ---------------- */
  const rangeDays = () => {
    const value = $("#reportRange")?.value || "30";
    return value === "all" ? null : Number(value);
  };

  const withinRange = (ts) => {
    const days = rangeDays();
    if (days == null) return true;
    return ts >= Date.now() - days * 86400000;
  };

  const renderReports = () => {
    const missions = state.missions.filter((m) => withinRange(m.startedAt || m.createdAt));
    const incidents = state.incidents.filter((i) => withinRange(i.ts));
    const checkins = state.checkins.filter((c) => withinRange(c.ts));
    const activeMissions = state.missions.filter((m) => m.status === "In progress").length;
    const openIncidents = state.incidents.filter((i) => i.status !== "resolved").length;
    const todayStart = new Date().setHours(0, 0, 0, 0);
    const checkinsToday = state.checkins.filter((c) => c.ts >= todayStart).length;

    const ready = state.teams.filter((t) => t.status === "onsite" || t.status === "enroute").length;
    const readiness = state.teams.length ? Math.round((ready / state.teams.length) * 100) : 0;

    setText("reportMissions", missions.length);
    setText("reportMissionsActive", activeMissions);
    setText("reportIncidents", incidents.length);
    setText("reportIncidentsOpen", openIncidents);
    setText("reportCheckins", checkins.length);
    setText("reportCheckinsToday", checkinsToday);
    setText("reportReadiness", readiness);
    setText("reportTeamsReady", ready);

    /* Bar chart: incidents per day for the last 7 days. */
    const chart = $("#incidentTrendChart");
    if (chart) {
      const days = 7;
      const buckets = [];
      for (let i = days - 1; i >= 0; i--) {
        const day = new Date();
        day.setHours(0, 0, 0, 0);
        day.setDate(day.getDate() - i);
        const start = day.getTime();
        const end = start + 86400000;
        const count = state.incidents.filter((inc) => inc.ts >= start && inc.ts < end).length;
        buckets.push({ label: new Intl.DateTimeFormat("en-PH", { weekday: "short" }).format(day), count });
      }
      const max = Math.max(1, ...buckets.map((b) => b.count));
      chart.innerHTML = buckets.map((b) => `
        <div class="bar-col">
          <span class="bv">${b.count}</span>
          <div class="bar ${b.count >= 3 ? "red" : b.count >= 2 ? "amber" : ""}" style="height:${Math.max(6, (b.count / max) * 100)}%"></div>
          <span class="bl">${b.label}</span>
        </div>`).join("");
      setText("trendHint", "Last 7 days");
    }

    /* Donut: team status mix. */
    const donut = $("#statusDonut");
    const legend = $("#statusLegend");
    if (donut && legend) {
      const colors = { onsite: "#3ddc97", enroute: "#f7bf4f", standby: "#46b8ff", sos: "#ff5a6a" };
      const counts = { onsite: 0, enroute: 0, standby: 0, sos: 0 };
      state.teams.forEach((t) => { counts[t.status] = (counts[t.status] || 0) + 1; });
      const total = state.teams.length || 1;
      let acc = 0;
      const stops = [];
      Object.entries(counts).forEach(([key, value]) => {
        if (!value) return;
        const from = (acc / total) * 100;
        acc += value;
        const to = (acc / total) * 100;
        stops.push(`${colors[key]} ${from}% ${to}%`);
      });
      donut.style.background = stops.length ? `conic-gradient(${stops.join(",")})` : "#1d3147";
      setText("donutTotal", state.teams.length);
      legend.innerHTML = Object.entries(counts).map(([key, value]) => `
        <span><i style="background:${colors[key]}"></i> ${U.statusMeta[key]?.label || key} <b>${value}</b></span>`).join("");
    }

    /* Summary table. */
    const body = $("#reportSummaryRows");
    if (body) {
      const statuses = ["In progress", "Monitoring", "Planned", "Completed"];
      body.innerHTML = statuses.map((status) => {
        const set = state.missions.filter((m) => m.status === status);
        const avg = set.length ? Math.round(set.reduce((s, m) => s + (m.progress || 0), 0) / set.length) : 0;
        const mix = ["Critical", "High", "Medium", "Low"]
          .map((p) => `${p.slice(0, 1)}:${set.filter((m) => m.priority === p).length}`).join(" · ");
        return `<tr>
          <td class="strong">${status}</td>
          <td>${set.length}</td>
          <td>${set.length ? avg + "%" : "—"}</td>
          <td class="tiny mono">${set.length ? mix : "—"}</td>
        </tr>`;
      }).join("");
    }
  };

  /* ---------------- Audit ---------------- */
  const renderAudit = () => {
    const body = $("#auditRows");
    if (!body) return;
    const query = ($("#auditSearch")?.value || "").trim().toLowerCase();
    const action = $("#auditActionFilter")?.value || "";
    const list = state.audit.filter((a) => {
      if (action && a.action !== action) return false;
      if (!query) return true;
      return [a.actorName, a.action, a.detail].some((v) => String(v || "").toLowerCase().includes(query));
    });
    if (!list.length) {
      body.innerHTML = '<tr><td colspan="4"><div class="empty">No audit entries match this filter.</div></td></tr>';
      return;
    }
    const actionBadge = (a) => {
      if (a === "LOGIN" || a === "LOGOUT" || a === "REGISTER") return "badge-blue";
      if (a === "SOS") return "badge-red";
      if (a === "BROADCAST") return "badge-purple";
      if (a === "MISSION") return "badge-amber";
      return "badge-muted";
    };
    body.innerHTML = list.slice(0, 200).map((a) => `
      <tr>
        <td class="mono tiny">${U.fmtDateTime(a.ts)}<div class="e" style="font-size:9px;color:var(--muted-2)">${U.fmtRelative(a.ts)}</div></td>
        <td>${esc(a.actorName || "System")}</td>
        <td><span class="badge ${actionBadge(a.action)}">${esc(a.action)}</span></td>
        <td>${esc(a.detail || "")}</td>
      </tr>`).join("");
  };

  /* ---------------- Exports ---------------- */
  const exportMissions = () => {
    const rows = state.missions.map((m) => ({
      code: m.code, name: m.name, status: m.status, priority: m.priority, type: m.type,
      sector: m.sector, lead: m.lead, team: teamById(m.teamId)?.name || "", progress: m.progress,
      startedAt: new Date(m.startedAt || m.createdAt).toISOString(),
    }));
    U.download(`resqcoord-missions-${Date.now()}.csv`, U.toCSV(rows), "text/csv");
    markExport();
  };

  const exportPersonnel = () => {
    const rows = state.users.map((u) => ({
      name: u.name, email: u.email, role: u.role, title: u.title, team: u.team,
      responderId: u.responderId, status: u.status, phone: u.phone || "",
      lastLogin: u.lastLogin ? new Date(u.lastLogin).toISOString() : "",
    }));
    U.download(`resqcoord-personnel-${Date.now()}.csv`, U.toCSV(rows), "text/csv");
    markExport();
  };

  const exportIncidents = () => {
    const rows = state.incidents.map((i) => ({
      code: i.code, title: i.title, type: i.type, severity: i.severity, status: i.status,
      sector: i.sector, reporter: i.reporterName, team: teamById(i.teamId)?.name || "",
      description: i.description, reportedAt: new Date(i.ts).toISOString(),
    }));
    U.download(`resqcoord-incidents-${Date.now()}.csv`, U.toCSV(rows), "text/csv");
    markExport();
  };

  const exportAudit = () => {
    const rows = state.audit.map((a) => ({
      time: new Date(a.ts).toISOString(), actor: a.actorName, action: a.action, detail: a.detail,
    }));
    U.download(`resqcoord-activity-${Date.now()}.csv`, U.toCSV(rows), "text/csv");
    markExport();
  };

  const exportJson = async () => {
    const snapshot = await DB.exportAll();
    snapshot.exportedBy = state.user.email;
    U.download(`resqcoord-backup-${Date.now()}.json`, JSON.stringify(snapshot, null, 2), "application/json");
    await Auth.audit(state.user, "DATA", "Downloaded full database backup");
    markExport();
    toast("Database backup downloaded.", "success", "Backup ready");
    await refresh();
  };

  const markExport = () => {
    state.lastExport = Date.now();
    setText("settingsLastExport", U.fmtDateTime(state.lastExport));
  };

  const resetData = async () => {
    const ok = await U.confirm({
      title: "Reset demo database?",
      message: "All local missions, incidents, messages, accounts and positions will be replaced with the seeded demo data.",
      confirmText: "Reset everything",
      danger: true,
    });
    if (!ok) return;
    await DB.reset();
    await Auth.audit(state.user, "DATA", "Reset demo database to seed state");
    state.selectedTeamId = null;
    state.route = null;
    toast("Demo database restored.", "success", "Data reset");
    await refresh();
    populateBroadcastChannels();
  };

  /* ---------------- Settings ---------------- */
  const bindSettings = () => {
    $$(".settings-nav button").forEach((button) => {
      button.addEventListener("click", () => {
        $$(".settings-nav button").forEach((b) => b.classList.toggle("active", b === button));
        const target = `#settings-${button.dataset.settings}`;
        const el = $(target);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    $("#adminProfileForm")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const result = await Auth.updateProfile({
        name: $("#setName").value.trim(),
        phone: $("#setPhone").value.trim(),
        title: $("#setTitle").value.trim(),
        org: $("#setOrg").value.trim(),
      });
      if (result.ok) {
        state.user = result.user;
        renderIdentity();
        toast("Profile updated.", "success", "Saved");
      } else {
        toast(result.error, "error");
      }
    });

    $("#adminPasswordForm")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const result = await Auth.changePassword($("#curPass").value, $("#newPass").value, $("#confPass").value);
      if (result.ok) {
        event.target.reset();
        toast("Password changed.", "success", "Security updated");
      } else {
        toast(result.error, "error");
      }
    });

    if ($("#setSimulation")) $("#setSimulation").checked = state.system.simulation;
    if ($("#setSosSound")) $("#setSosSound").checked = state.system.sosSound;
    if ($("#setStrictCheckin")) $("#setStrictCheckin").checked = state.system.strictCheckin;
    if ($("#setAccuracy")) $("#setAccuracy").checked = state.system.accuracy;

    $("#saveSystemBtn")?.addEventListener("click", async () => {
      state.system = {
        simulation: $("#setSimulation").checked,
        sosSound: $("#setSosSound").checked,
        strictCheckin: $("#setStrictCheckin").checked,
        accuracy: $("#setAccuracy").checked,
      };
      saveSystem();
      await Auth.audit(state.user, "SETTINGS", "System preferences updated");
      toast("System settings saved.", "success");
    });

    $("#exportJsonBtn2")?.addEventListener("click", exportJson);
    $("#resetDataBtn")?.addEventListener("click", resetData);
  };

  /* ---------------- System data panel ---------------- */
  const renderSystemInfo = async () => {
    const counts = await Promise.all(Object.keys(DB.STORES).map((s) => DB.count(s)));
    const total = counts.reduce((a, b) => a + b, 0);
    setText("settingsDbRecords", `${total} records`);
    setText("settingsLastExport", state.lastExport ? U.fmtDateTime(state.lastExport) : "Never");
  };

  /* ---------------- SOS sound ---------------- */
  const playSosTone = () => {
    if (!state.system.sosSound) return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      const ctx = new Ctx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.value = 880;
      gain.gain.value = 0.05;
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.frequency.setValueAtTime(620, ctx.currentTime + 0.25);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.5);
      setTimeout(() => { osc.stop(); ctx.close(); }, 800);
    } catch {
      /* audio blocked */
    }
  };

  /* ---------------- Navigation ---------------- */
  const viewTitles = {
    overview: "Overview",
    map: "Command Map",
    missions: "Missions",
    personnel: "Personnel",
    incidents: "Incidents",
    messages: "Broadcast",
    reports: "Reports",
    audit: "Activity Log",
    settings: "Settings",
  };

  const switchView = (view) => {
    if (!$(`#view-${view}`)) return;
    $$(".view").forEach((section) => section.classList.toggle("active", section.id === `view-${view}`));
    $$(".nav-item[data-view]").forEach((button) => button.classList.toggle("active", button.dataset.view === view));
    setText("crumb", viewTitles[view] || view);
    state.views[view] = true;

    if (view === "overview") setTimeout(() => state.maps.overview?.invalidate(), 120);
    if (view === "map") setTimeout(() => {
      state.maps.admin?.invalidate();
      renderTeamList();
      updateTeamDetail();
      if (state.selectedTeamId) focusSelectedTeam(14);
    }, 120);
    if (view === "missions") renderMissions();
    if (view === "personnel") { renderPersonnel(); renderTeamRoster(); }
    if (view === "incidents") renderIncidents();
    if (view === "messages") { populateBroadcastChannels(); renderBroadcast(); }
    if (view === "reports") renderReports();
    if (view === "audit") renderAudit();
    if (view === "settings") renderSystemInfo();
    if (window.innerWidth <= 1080) $("#app")?.classList.remove("sidebar-open");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const bindNavigation = () => {
    $$(".nav-item[data-view]").forEach((button) => {
      button.addEventListener("click", () => switchView(button.dataset.view));
    });
    $$("[data-view-link]").forEach((button) => {
      button.addEventListener("click", () => switchView(button.dataset.viewLink));
    });
    $("#sidebarToggle")?.addEventListener("click", () => $("#app")?.classList.toggle("sidebar-open"));
    $("#sideUser")?.addEventListener("click", () => switchView("settings"));
    $("#sideUser")?.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); switchView("settings"); }
    });
  };

  const bindActions = () => {
    document.addEventListener("click", async (event) => {
      const actionEl = event.target.closest("[data-action]");
      if (actionEl) {
        const action = actionEl.dataset.action;
        if (action === "newMission") openMissionModal();
        if (action === "addPersonnel") openPersonnelModal();
        if (action === "broadcast") { switchView("messages"); setTimeout(() => $("#broadcastInput")?.focus(), 250); }
        if (action === "logout") {
          const ok = await U.confirm({ title: "Sign out?", message: "You will need your email and password to sign back in.", confirmText: "Sign out", danger: true });
          if (ok) await Auth.logout("../admin/login.html");
        }
        return;
      }

      const teamEl = event.target.closest("[data-team-id]");
      if (teamEl && !event.target.closest("[data-alert-action]")) {
        selectTeam(teamEl.dataset.teamId);
        return;
      }

      const alertEl = event.target.closest("[data-alert-action]");
      if (alertEl) {
        const kind = alertEl.dataset.alertAction;
        if (kind === "sos" || kind === "team") selectTeam(alertEl.dataset.teamId, { jump: true });
        if (kind === "incident") { switchView("incidents"); }
        return;
      }

      const missionView = event.target.closest("[data-mission-view]");
      if (missionView) { openMissionDetail(missionView.dataset.missionView); return; }
      const missionEdit = event.target.closest("[data-mission-edit]");
      if (missionEdit) {
        const m = state.missions.find((x) => x.id === missionEdit.dataset.missionEdit);
        if (m) openMissionModal(m);
        return;
      }
      const missionAdvance = event.target.closest("[data-mission-advance]");
      if (missionAdvance) { await advanceMission(missionAdvance.dataset.missionAdvance); return; }

      const userToggle = event.target.closest("[data-user-toggle]");
      if (userToggle) { await toggleUser(userToggle.dataset.userToggle); return; }
      const userEdit = event.target.closest("[data-user-edit]");
      if (userEdit) {
        const u = state.users.find((x) => x.id === userEdit.dataset.userEdit);
        if (u) openPersonnelModal(u);
        return;
      }
      const userDelete = event.target.closest("[data-user-delete]");
      if (userDelete) { await deleteUser(userDelete.dataset.userDelete); return; }

      const incStatus = event.target.closest("[data-incident-status]");
      if (incStatus) { await setIncidentStatus(incStatus.dataset.incidentId, incStatus.dataset.incidentStatus); return; }
      const incLocate = event.target.closest("[data-incident-locate]");
      if (incLocate) {
        const inc = state.incidents.find((x) => x.id === incLocate.dataset.incidentLocate);
        if (inc) { switchView("map"); setTimeout(() => state.maps.admin?.focus(inc.lat, inc.lng, 16), 220); }
        return;
      }
      const incAssign = event.target.closest("[data-incident-assign]");
      if (incAssign) { await assignIncidentTeam(incAssign.dataset.incidentAssign); return; }

      const template = event.target.closest("[data-template]");
      if (template) {
        const text = BROADCAST_TEMPLATES[template.dataset.template];
        if (text && $("#broadcastInput")) {
          $("#broadcastInput").value = text;
          setText("broadcastCount", `${text.length} / 500 characters`);
        }
        return;
      }
    });

    $("#broadcastForm")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      await sendBroadcast();
    });
    $("#broadcastInput")?.addEventListener("input", (event) => {
      setText("broadcastCount", `${event.target.value.length} / 500 characters`);
    });

    $("#fitTeamsBtn")?.addEventListener("click", () => {
      state.maps.admin?.fitTeams();
      toast("Map fitted to all tracked teams.", "info");
    });
    $("#toggleTrailsBtn")?.addEventListener("click", async () => {
      state.showTrails = !state.showTrails;
      $("#toggleTrailsBtn")?.classList.toggle("active", state.showTrails);
      if (state.showTrails) await refreshSelectedTrail();
      else clearTrail();
      toast(state.showTrails ? "Trails on for the selected team." : "Trails hidden.", "info");
    });
    $("#detailFocus")?.addEventListener("click", () => {
      const team = teamById(state.selectedTeamId);
      if (team) state.maps.admin?.focus(team.lat, team.lng, 16);
    });
    $("#detailTrail")?.addEventListener("click", refreshSelectedTrail);
    $("#detailClearTrail")?.addEventListener("click", clearTrail);
    $("#detailSos")?.addEventListener("click", async () => {
      const team = teamById(state.selectedTeamId);
      if (!team) return;
      if (team.status !== "sos") { toast(`${team.name} is not in an SOS state.`, "info"); return; }
      await Tracking.clearSos(team.id, state.user);
      toast(`SOS cleared for ${team.name}.`, "success", "Emergency cleared");
      await refresh();
    });
    $("#assignRouteBtn")?.addEventListener("click", assignRoute);
    $("#clearRouteBtn")?.addEventListener("click", () => {
      state.route = null;
      state.routeTeamId = null;
      state.maps.admin?.clearRoute();
      setText("assignResult", "Routes are drawn on the command map.");
    });

    ["#teamSearch", "#teamFilter"].forEach((sel) => {
      $(sel)?.addEventListener("input", renderTeamList);
      $(sel)?.addEventListener("change", renderTeamList);
    });
    ["#missionSearch", "#missionStatusFilter", "#missionPriorityFilter"].forEach((sel) => {
      $(sel)?.addEventListener("input", renderMissions);
      $(sel)?.addEventListener("change", renderMissions);
    });
    ["#personnelSearch", "#personnelRoleFilter", "#personnelStatusFilter"].forEach((sel) => {
      $(sel)?.addEventListener("input", renderPersonnel);
      $(sel)?.addEventListener("change", renderPersonnel);
    });
    ["#incidentSearch", "#incidentSeverityFilter", "#incidentStatusFilter"].forEach((sel) => {
      $(sel)?.addEventListener("input", renderIncidents);
      $(sel)?.addEventListener("change", renderIncidents);
    });
    ["#auditSearch", "#auditActionFilter"].forEach((sel) => {
      $(sel)?.addEventListener("input", renderAudit);
      $(sel)?.addEventListener("change", renderAudit);
    });
    $("#reportRange")?.addEventListener("change", renderReports);

    $$(".map-tool[data-layer]").forEach((button) => {
      button.addEventListener("click", () => {
        $$(".map-tool[data-layer]").forEach((b) => b.classList.toggle("active", b === button));
        state.maps.admin?.setBaseLayer(button.dataset.layer);
      });
    });
    $("#sectorsToggle")?.addEventListener("click", () => {
      const visible = state.maps.admin?.toggleSectors();
      $("#sectorsToggle")?.classList.toggle("active", !!visible);
    });

    ["exportMissionsBtn", "exportMissionsBtn2"].forEach((id) => $(`#${id}`)?.addEventListener("click", exportMissions));
    ["exportPersonnelBtn", "exportPersonnelBtn2"].forEach((id) => $(`#${id}`)?.addEventListener("click", exportPersonnel));
    ["exportIncidentsBtn", "exportIncidentsBtn2"].forEach((id) => $(`#${id}`)?.addEventListener("click", exportIncidents));
    ["exportAuditBtn", "exportAuditBtn2"].forEach((id) => $(`#${id}`)?.addEventListener("click", exportAudit));
    $("#exportAllDataBtn")?.addEventListener("click", exportJson);
    $("#exportJsonBtn")?.addEventListener("click", exportJson);
  };

  /* ---------------- Clock / network ---------------- */
  const updateClock = () => {
    const time = `${U.fmtTime()} PHT`;
    clockIds.forEach((id) => setText(id, time));
  };

  const updateNetwork = () => {
    const online = navigator.onLine;
    const status = $("#netStatus");
    if (status) {
      status.classList.toggle("offline", !online);
      status.innerHTML = `<span class="dot"></span> ${online ? "Online" : "Offline"}`;
    }
    $("#offlineBanner")?.classList.toggle("show", !online);
  };

  /* ---------------- Refresh loop ---------------- */
  const refresh = async () => {
    if (!state.ready) return;
    try {
      await reload();
      renderOverview();
      renderAlerts();
      renderOverviewTeams();
      renderOverviewMissions();
      renderOverviewActivity();
      renderMarkers();
      renderTeamList();
      updateTeamDetail();
      if (state.views.missions) renderMissions();
      if (state.views.personnel) { renderPersonnel(); renderTeamRoster(); }
      if (state.views.incidents) renderIncidents();
      if (state.views.messages) renderBroadcast();
      if (state.views.reports) renderReports();
      if (state.views.audit) renderAudit();
      setSync();
    } catch (err) {
      console.warn("[ResQCoord] Admin refresh failed", err);
    }
  };

  const startTimers = () => {
    updateClock();
    setInterval(updateClock, 1000);
    setInterval(refresh, 3200);
    setInterval(() => {
      if (state.views.settings) renderSystemInfo();
    }, 15000);

    Tracking.subscribe((event) => {
      if (!["teams", "messages", "checkins", "sos", "incidents", "missions"].includes(event.type)) return;
      if (event.type === "sos") {
        playSosTone();
        U.toast("An SOS was activated. Open the live map or incident triage.", { type: "warn", title: "Emergency alert" });
      }
      setTimeout(refresh, 250);
    });

    window.addEventListener("online", updateNetwork);
    window.addEventListener("offline", updateNetwork);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        state.maps.overview?.invalidate();
        state.maps.admin?.invalidate();
        refresh();
      }
    });
  };

  /* ---------------- Boot ---------------- */
  const boot = async () => {
    const user = await Auth.guard("admin");
    if (!user) return;
    state.user = user;
    loadSystem();
    await reload();
    renderIdentity();
    renderOverview();
    renderAlerts();
    renderOverviewTeams();
    renderOverviewMissions();
    renderOverviewActivity();
    renderMissions();
    renderPersonnel();
    renderTeamRoster();
    renderIncidents();
    renderAudit();
    renderReports();
    populateBroadcastChannels();
    populateAssignTargets();
    renderBroadcast();
    bindNavigation();
    bindActions();
    bindSettings();
    updateNetwork();

    initMaps();
    renderMarkers();

    if (state.teams.length) selectTeam(state.teams[0].id, { jump: false });
    state.ready = true;
    setSync();
    renderSystemInfo();

    await Tracking.startSimulation({
      intervalMs: 2600,
      onTick: (teams) => {
        if (!state.ready) return;
        state.teams = teams.sort((a, b) => a.name.localeCompare(b.name));
        renderMarkers();
        renderTeamList();
        updateTeamDetail();
      },
    });

    U.toast(`Signed in as ${user.name}. Command view is live.`, { title: "Command dashboard ready", type: "success" });
    console.info("[ResQCoord] Admin dashboard ready.", { db: DB.mode, teams: state.teams.length, missions: state.missions.length });
  };

  boot().catch((err) => {
    console.error("[ResQCoord] Failed to start the admin dashboard", err);
    U.toast("The command dashboard could not start. Check the browser console for details.", "error");
  });
})();
````

---

<a id="vendor-assets"></a>

## Vendor assets (third-party, not project code)

These files are included so the app runs offline. They are unmodified upstream releases.

| File | Size | SHA-256 | Source |
| --- | ---: | --- | --- |
| `assets/vendor/leaflet/leaflet.css` | 14806 B | `A7837102824184820DFA198D1EBCD109FF6D0FF9A2672A074B9A1B4D147D04C6` | unpkg.com/leaflet@1.9.4/dist/leaflet.css |
| `assets/vendor/leaflet/leaflet.js` | 147552 B | `DB49D009C841F5CA34A888C96511AE936FD9F5533E90D8B2C4D57596F4E5641A` | unpkg.com/leaflet@1.9.4/dist/leaflet.js |
| `assets/vendor/leaflet/images/marker-icon.png` | 1466 B | `574C3A5CCA85F4114085B6841596D62F00D7C892C7B03F28CBFA301DEB1DC437` | unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png |
| `assets/vendor/leaflet/images/marker-icon-2x.png` | 2464 B | `00179C4C1EE830D3A108412AE0D294F55776CFEB085C60129A39AA6FC4AE2528` | unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png |
| `assets/vendor/leaflet/images/marker-shadow.png` | 618 B | `264F5C640339F042DD729062CFC04C17F8EA0F29882B538E3848ED8F10EDB4DA` | unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png |

Leaflet is copyright (c) 2010-2023 Volodymyr Agafonkin and contributors, distributed under the BSD-2-Clause license. Map tiles belong to OpenStreetMap contributors, Esri/Maxar/Earthstar Geographics, and OpenTopoMap. Routing and geocoding results come from OSRM and Nominatim public services.

---

## End of source listing

Every project-authored file above is complete. The application has no build step and no npm dependencies.
