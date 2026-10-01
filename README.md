# chonk.chat

> big rooms. little friends. zero corporate beige.

A playful, **highly themable** chat client that talks to the open-source
[Stoat](https://github.com/stoatchat) backend (formerly Revolt). Think Discord-shaped,
but with a sticker-and-marker aesthetic, a real theme engine, and **animated GIF
avatars and banners for everyone** — no paywall.

![bubblegum theme](docs/screens/general.png)

## What's in the box

- **Theme engine** — six built-in presets (Bubblegum Arcade, Midnight Cabinet,
  Pocket Handheld, Sunset Cassette, Paper Zine, Seafoam Motel). Every colour,
  radius, outline width, sticker-shadow depth, font and motion level is a token
  you can edit live. Fork any preset, export/import as JSON, set a GIF as your
  wallpaper.
- **Animated everything** — GIF/WebP avatars, den icons and profile banners.
  Static frame by default, animates on hover (or always / never — your call).
- **Dens & rooms** — servers, categorised channels, unread + mention badges,
  member list grouped by presence, profile cards with role pills and bios.
- **Chat that feels good** — grouped messages, replies, reactions (with a
  quick-react bar), markdown-lite, image attachments, typing indicators, and a
  send button with an actual *pop*.
- **Demo mode** — the whole UI runs on fake data with no backend, so you can
  try it, design themes, and screenshot it in seconds.

## Quick start (demo, no backend)

```bash
npm install
npm run dev
# open http://localhost:5173/?demo=1
```

## Run against a real Stoat server

1. Copy `.env.example` to `.env` and set `VITE_API_URL` to your API
   (e.g. `https://api.yourdomain.chat` for a self-host, or `https://stoat.chat/api`
   to use the public instance).
2. `npm run dev`, then log in with a Stoat account.

## Desktop app (Windows, per-user install, ~3 MB)

```bash
npm run dist:win        # → desktop/build/chonk-setup-<version>.exe
```

The desktop shell is a tiny Go program (`desktop/`) that embeds the web build and
renders it with the OS webview — WebView2 on Windows, so nothing heavy is bundled.
The NSIS installer runs as the current user (no UAC prompt), installs to
`%LOCALAPPDATA%\Programs\chonk`, adds Start-menu/desktop shortcuts and a
Settings › Apps uninstall entry. Needs `go`, `mingw-w64` and `nsis` to build
(cross-compiles fine from Linux/macOS). The same shell builds for macOS/Linux
with a plain `go build` in `desktop/`.

## Web app / PWA

The same build is the web app. Served over HTTPS it's installable from the browser
(manifest + service worker included). Users can point either client at any
Stoat-compatible server from the login screen.

## Self-hosting the whole thing

Full walkthrough with firewall, config, upload limits and swapping the stock client:
**[docs/SERVER-SETUP.md](docs/SERVER-SETUP.md)**. The short version:

chonk is the *front end*. You need a Stoat backend too:

1. Deploy the backend with the official Docker stack:
   <https://github.com/stoatchat/self-hosted> (2 vCPU / 2 GB is enough to start;
   voice needs UDP 50000–50100 + TCP 7881 open directly).
2. Build and run this client, pointing at that API:

   ```bash
   VITE_API_URL=https://api.yourdomain.chat docker compose up -d --build
   # serves on :8080 — put Caddy/nginx/Traefik in front for TLS
   ```

3. Point your domain at it. Done.

## Project layout

```
src/
  brand.ts              # name, tagline, vocabulary ("den", "room") — rebrand here
  theme/themes.ts       # presets + token → CSS variable mapping
  theme/ThemeProvider   # live theming, custom themes, import/export
  lib/client.ts         # stoat.js client, session persistence, login/register
  lib/demo.ts           # fake data hydration for demo mode
  components/           # Avatar, ServerRail, ChannelSidebar, ChatView, MessageItem,
                        # Composer, MemberList, ProfileCard, SettingsModal…
  pages/                # Login, Shell, Home, ChannelPage
scripts/gen-demo-media.py   # regenerates the demo GIF avatars/banners
docker/                 # production image (nginx)
```

## Stack

- [Solid.js](https://www.solidjs.com/) + Vite + TypeScript
- [stoat.js](https://www.npmjs.com/package/stoat.js) — the official SDK
  (its objects are Solid signals, so the UI is reactive for free)
- Plain CSS with custom properties. No component library.

## Roadmap

- [ ] Create / edit dens and rooms in-app
- [ ] File & GIF picker in the composer
- [ ] Voice rooms (LiveKit)
- [ ] Emoji picker + custom den emoji
- [ ] Message editing, pins, search
- [ ] Theme gallery / sharing
- [ ] PWA install + notifications
- [ ] Mobile layout

## License

Client code: MIT. The Stoat backend is AGPL-3.0 — if you modify *it* and run it
publicly, publish your changes. This client is a separate program talking to its
API, so you're free to keep any client-side changes to yourself if you want.
