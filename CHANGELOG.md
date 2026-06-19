# Changelog

All notable changes to Word Hero are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [Unreleased]

### Added

- **Word Explorer** difficulty level — a third, harder tier featuring less common words: rare rhymes (`freeze`/`prance`), silent-letter sounds (`knight`, `wrench`), `ph`/`tion` patterns, and tricky spellings (`rhythm`, `squirrel`, `leopard`). Starts faster (0.24 speed, +0.016/round).
- Per-level difficulty icons on the title screen (⭐ / 🌟 / 🚀).

---

## [1.1.0] — 2026-06-18

### Added

- **Difficulty levels** on the title screen: Early Reader 1 (slower speed, simpler words) and Early Reader 2 (blends, tricky sight words). Each level has its own round set, starting speed, and speed-step increment.
- `src/data/rounds.js` — centralized round data organized by difficulty level.
- `src/utils/game.js` — extracted `shuffle`, `buildLane`, `kindLabel` helpers.
- `src/styles.js` — extracted shared style object.
- `src/components/TitleScreen.jsx`, `PlayScreen.jsx`, `GameOverScreen.jsx` — one file per screen.

### Changed

- `src/WordHero.jsx` is now a lean state-orchestrator; all rendering lives in the screen components.
- Game Over screen returns to the title screen (so the player can switch difficulty).
- Speed is now derived from the selected difficulty level rather than a fixed constant.

---

## [1.0.0] — 2026-06-18

### Added

- Initial release of Word Hero.
- Three phonics game modes: **Rhyme**, **Sound**, and **Sight Word**.
- 12 built-in rounds with escalating difficulty (speed increases 0.012 units per correct answer, capped at 0.5).
- Score system: 10 points per correct answer, +2 per active streak level.
- Three-life system — miss three times and the run ends.
- Streak counter rewarded for consecutive correct answers.
- Title screen with instructions and Game Over screen showing final score.
- Ink-on-paper visual theme: cream background, navy ink, coral accent, leaf-green hit, brick-red miss.
- Vite + React 18 project scaffold for local development (`npm run dev`).
- GitHub Actions workflow for zero-config deployment to GitHub Pages on push to `main`.
- `.gitignore`, `README.md`, and this `CHANGELOG.md`.
