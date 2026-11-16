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
  ".md": "text/plain; charset=utf-8",
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

if (require.main === module) {
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
}

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`\n  Port ${PORT} is already in use. Try: node server.js ${PORT + 1}\n`);
  } else {
    console.error("\n  Server error:", err.message, "\n");
  }
  process.exitCode = 1;
});

module.exports = { server };
