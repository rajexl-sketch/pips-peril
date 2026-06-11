# Security Policy

## Reporting a vulnerability

If you discover a security issue in Pip's Peril, please report it privately
via [GitHub Security Advisories](https://github.com/rajexl-sketch/pips-peril/security/advisories/new)
or by opening a minimal issue that does not include exploit details.
Please do not disclose publicly until it has been addressed.

## Security posture

Pip's Peril is a **fully static, client-side browser game**. This shapes its
threat model:

- **No backend, no server, no database.** There is no server-side code to
  attack and nothing to brute-force; the game is delivered as static files
  via GitHub Pages.
- **No network calls.** The game source makes zero `fetch`, `XMLHttpRequest`,
  or WebSocket calls. It cannot transmit player data anywhere.
- **No accounts, no authentication, no PII collected.** The only persisted
  data is local high scores and settings stored in the player's own
  `localStorage`. It never leaves the player's browser.
- **No third-party trackers, analytics, ads, or cookies.**
- **Original, self-contained assets.** All art, audio, and levels are
  generated from data in this repository; no external asset CDNs are used.

## Dependencies

- Runtime dependency: **Phaser 3** only. `npm audit --omit=dev` reports
  **0 vulnerabilities** in what ships to players.
- Dev tooling (Vite, Vitest, TypeScript) carries the well-known esbuild
  dev-server advisory (GHSA-67mh-4wv8-2f99). This affects only the local
  `npm run dev` server and never the built game, the repository, or CI.
  The dev server is bound to `localhost` to further limit exposure.

## CI/CD

The GitHub Actions workflow uses least-privilege permissions
(`contents: read`, `pages: write`, `id-token: write`), pins official
actions, takes no untrusted input, and uses no repository secrets.
