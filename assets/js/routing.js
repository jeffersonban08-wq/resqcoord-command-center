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
