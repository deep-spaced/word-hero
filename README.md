# Word Hero

A phonics-catching arcade game for early readers. Words fall from the sky — click the one that matches the prompt before it hits the ground. Speed increases with every correct answer.

## Gameplay

| Mode | What to do |
|------|-----------|
| **Rhyme** | Click the word that rhymes with the prompt |
| **Sound** | Click the word that starts (or ends) with the given sound |
| **Sight Word** | Identify the correctly-spelled sight word among imposters |

Three missed answers ends the run. Streaks multiply your score.

## Running locally

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

## Building for production

```bash
npm run build      # outputs to dist/
npm run preview    # serve the dist/ folder locally
```

## Deploying to GitHub Pages

Push to `main` — the GitHub Actions workflow in [.github/workflows/deploy.yml](.github/workflows/deploy.yml) builds and deploys automatically.

**One-time setup required in your GitHub repository:**

1. Go to **Settings → Pages**
2. Set **Source** to **GitHub Actions**

The workflow derives the base path from `github.event.repository.name`, so no manual config is needed as long as you use GitHub Pages project pages (e.g. `https://you.github.io/word-hero/`).

## Project structure

```
word-hero/
├── public/
│   └── favicon.svg
├── src/
│   ├── main.jsx        # React entry point
│   └── WordHero.jsx    # Game component
├── .github/
│   └── workflows/
│       └── deploy.yml  # GitHub Pages CI/CD
├── index.html
├── vite.config.js
└── package.json
```

## Tech stack

- [React 18](https://react.dev/) — UI
- [Vite 6](https://vitejs.dev/) — build tool & dev server
- Vanilla CSS-in-JS (no external style library)

## License

MIT
