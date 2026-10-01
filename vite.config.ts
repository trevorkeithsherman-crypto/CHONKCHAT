import { defineConfig, type Plugin } from "vite";
import solid from "vite-plugin-solid";
import fs from "node:fs";
import path from "node:path";

/**
 * Demo-mode media shim: mimics the Stoat file server ("Autumn") URL scheme so
 * the real SDK URL helpers work against files in /public/demo-media.
 *   /demo-media/<tag>/<id>           -> public/demo-media/<tag>/<id>.png (static frame)
 *   /demo-media/<tag>/<id>/original  -> public/demo-media/<tag>/<id>.gif (animated)
 */
function demoMedia(): Plugin {
  const handler = (req: any, res: any, next: () => void) => {
    const m = /^\/demo-media\/([a-z]+)\/([a-zA-Z0-9_-]+)(\/original)?(?:\?.*)?$/.exec(req.url ?? "");
    if (!m) return next();
    const [, tag, id, original] = m;
    const dir = path.resolve("public/demo-media", tag);
    const candidates = original ? [`${id}.gif`, `${id}.png`] : [`${id}.png`, `${id}.gif`];
    for (const c of candidates) {
      const p = path.join(dir, c);
      if (fs.existsSync(p)) {
        res.setHeader("Content-Type", c.endsWith(".gif") ? "image/gif" : "image/png");
        res.setHeader("Cache-Control", "public, max-age=3600");
        fs.createReadStream(p).pipe(res);
        return;
      }
    }
    next();
  };
  return {
    name: "chonk-demo-media",
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    },
  };
}

export default defineConfig({
  plugins: [solid(), demoMedia()],
  server: { port: 5173, host: true },
  preview: { port: 4173, host: true },
  build: { target: "es2022" },
});
