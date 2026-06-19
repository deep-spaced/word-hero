# Word Hero — Claude Agent Guide

## Project overview

Word Hero is a phonics arcade game for early readers built with React 18 and Vite. Words fall from the sky; the player clicks the one that matches the prompt (rhyme, starting sound, or sight word recognition) before it hits the ground.

## Dev commands

```bash
npm run dev           # local dev server at http://localhost:5173
npm run build         # production build → dist/
npm run preview       # serve dist/ locally
npm test              # run all tests once (Vitest)
npm run test:watch    # watch mode
npm run test:coverage # coverage report
```

## Source layout

```
src/
  components/
    TitleScreen.jsx     # title screen + difficulty picker
    PlayScreen.jsx      # falling-word game area
    GameOverScreen.jsx  # final score + return to title
  data/
    rounds.js           # round sets and difficulty config (DIFFICULTY_LEVELS, DIFFICULTY_IDS)
  utils/
    game.js             # pure helpers: shuffle, buildLane, kindLabel, LANES
  styles.js             # shared CSS-in-JS object
  WordHero.jsx          # state orchestrator — owns screen transitions and game logic
  main.jsx              # React root
  test/
    setup.js            # @testing-library/jest-dom import
```

## Testing conventions

**Stack:** Vitest + React Testing Library + `@testing-library/user-event` v14. Tests live next to the files they test: `foo.jsx` → `foo.test.jsx`, `bar.js` → `bar.test.js`.

### Test file structure

```
src/utils/game.test.js                 — unit tests for pure helpers
src/data/rounds.test.js                — data-integrity tests (structure, no dupes, valid modes)
src/components/GameOverScreen.test.jsx — render + interaction
src/components/TitleScreen.test.jsx    — render + difficulty selection + onStart callback
src/components/PlayScreen.test.jsx     — HUD values, prompt bar, falling-word clicks, feedback colours
src/WordHero.test.jsx                  — integration: screen transitions, scoring, lives
```

### Key patterns

**rAF stub** — jsdom doesn't provide `requestAnimationFrame`. Use `vi.stubGlobal` (not `vi.spyOn`) in `beforeEach` / `afterEach`:

```js
beforeEach(() => {
  vi.stubGlobal("requestAnimationFrame", vi.fn(() => 0));
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
});
afterEach(() => vi.unstubAllGlobals());
```

**userEvent** — always instantiate with `delay: null` so pointer delays don't stall tests:

```js
const user = userEvent.setup({ delay: null });
```

**Async transitions** — component uses `setTimeout` for screen changes; await them with `waitFor`:

```js
await waitFor(() => expect(screen.getByText("RUN COMPLETE")).toBeInTheDocument());
```

**Disambiguation** — when multiple elements share the same text (e.g. SCORE and STREAK both show "0"), scope with `within`:

```js
const scoreLabel = screen.getByText("SCORE");
expect(within(scoreLabel.parentElement).getByText("0")).toBeInTheDocument();
```

**data-testid usage** — falling-word buttons carry `data-testid="answer-word"` or `data-testid="decoy-word"` so integration tests can reliably target them without coupling to round data.

### Coverage targets

- Pure utilities (`utils/game.js`, `data/rounds.js`): aim for 100 % line coverage.
- UI components: cover all render states and every user interaction path.
- Integration (`WordHero.test.jsx`): cover all screen transitions and stat mutations.

---

## Automatic test generation — agent instructions

**Rule: whenever you create or modify a source file under `src/` (excluding `src/test/setup.js`, `src/main.jsx`, and `src/styles.js`), you must also create or update the corresponding test file in the same directory before reporting the task done.**

### Workflow

1. **Identify the test file.** `src/foo/bar.jsx` → `src/foo/bar.test.jsx`. If it already exists, update it; if not, create it from scratch.
2. **Cover every exported symbol.** For pure functions: happy path, edge cases, type contracts. For React components: every prop combination, every interaction, every render branch.
3. **Run `npm test` and fix failures before finishing.** Do not report a task as complete if tests are red.
4. **Prefer specificity over quantity.** Ten sharp assertions beat fifty redundant ones. Each test should fail for exactly one reason.

### Per-file checklist

| File type | Minimum coverage |
|-----------|-----------------|
| Pure utility (`utils/*.js`) | All exported functions, all branches |
| Data module (`data/*.js`) | Structural integrity: required keys, no duplicates, valid enum values |
| React component (`components/*.jsx`) | All props, all event handlers, all conditional render branches |
| Orchestrator (`WordHero.jsx`) | All screen transitions, stat mutations (score, lives, streak), difficulty variants |

### Updating existing tests

- When you rename, remove, or change the signature of an export, update every test that imports it.
- When you add a new prop or render branch to a component, add a test case for it.
- When you add a new round or difficulty level to `rounds.js`, the `rounds.test.js` data-integrity loop will cover it automatically — no manual test addition needed.

---

## Adding a new difficulty level

1. Add a new entry to the `earlyReader*Rounds` arrays (or create a new const) in `src/data/rounds.js`.
2. Add the level to `DIFFICULTY_LEVELS` with `id`, `label`, `description`, `startSpeed`, `speedStep`, and `rounds`.
3. `DIFFICULTY_IDS` is derived automatically — no manual update needed.
4. The `rounds.test.js` data-integrity suite will automatically validate the new level's rounds.
5. Add a test in `WordHero.test.jsx` that starts a game with the new difficulty and asserts the play screen appears.

## Deployment

Push to `main` → GitHub Actions runs tests, then builds, then deploys to GitHub Pages.

One-time setup: **Settings → Pages → Source → GitHub Actions**.
