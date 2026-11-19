# SECOND THOUGHT — Cybersecurity Culture

The original SECOND THOUGHT experience, converted to Next.js without changing its design, content, or learning activities.

## Run locally

Requires Node.js 20.9 or newer and npm.

```bash
npm ci
npm run dev
```

Open http://localhost:3000.

## Production

```bash
npm run lint
npm run build
npm start
```

The app uses the Next.js App Router and Webpack. The original stylesheet and system-font stack are preserved; no Google Fonts download is needed.

## Publish from GitHub

1. Push this project folder to a GitHub repository. The included `.gitignore` excludes dependencies, local environment files, and generated build output.
2. In Vercel, import that repository and choose the **Next.js** framework preset.
3. Keep the project root as the root directory. Use `npm ci` to install and `npm run build` to build, then deploy.

No environment variables, database, or API keys are required. Other hosting services that support Next.js can run the production commands above.

## Preserved behavior

- Uzbek and English language switching
- Five interactive labs and six practice scenarios
- The 20-question final assessment, unlock rules, results, review, and retake
- Local progress storage, sidebar collapse, and mobile navigation
- Voice simulation, printing, reset controls, and source links

Progress stays in each visitor's browser through `localStorage`, using the original storage key. It is not shared between devices or visitors. The original offline-edition wording is preserved.

## Files

- `reference/second_thought_cyberculture.html` — byte-for-byte copy of the original file
- `src/app/page.tsx` — Next.js home route
- `src/app/layout.tsx` — original language, title, description, and theme color
- `src/app/globals.css` — original styles, including responsive and print rules
- `src/components/cyberculture-app.tsx` — React application shell
- `src/lib/cyberculture.js` — original content and interactions, with event cleanup for React mounts
