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
