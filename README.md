# SECOND THOUGHT — Cybersecurity Culture

An interactive online-safety course for students in grades 5–11, with Uzbek and English content, five lessons, six practice scenarios, and a 20-question final test.

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
npm test
npm run build
npm start
```

The app uses the Next.js App Router and Webpack. The existing stylesheet and system-font stack are preserved; no Google Fonts download is needed. Production builds also check that the browser questions and server answer key agree.

## Updating questions

Edit `data/course-content.json` for the bilingual final questions, practice scenarios and lesson decisions. Each final item has one canonical answer, independent of its shuffled display letter. Practice scenarios and lesson decisions have feedback for each choice. Reflections and exploration controls are unscored; trying a decision still counts as practice.

Run `npm run prepare:answers` after changing the final answer indices. This updates only `data/answer-key.json`; it does not regenerate school data or SQL. `npm run check:answers` verifies synchronization. `npm test` checks bilingual content, scoring, practice feedback, saved attempts and the registration handler with a mocked database request.

After `npm run build`, `npm run test:production` starts a temporary production server on loopback port 3101 and checks the compiled page, assets and APIs over HTTP. It explicitly clears Supabase settings in that child process, so it cannot write test records to a live database, and stops its server afterward. It requires permission to access localhost.

Bump the content `version` when question meanings or canonical answer identities change. Existing local course attempts then restart while language and sidebar preferences remain. An earlier browser registration confirmation is preserved separately, and already submitted database records are untouched. The registration API rejects missing or stale versions with HTTP 409 before scoring. Current-version answers survive language changes, reloads and navigation; a retake starts a new shuffle.

The grades 5–11 wording and Uzbek translation are implemented from the approved plan. A fluent Uzbek educator review and the proposed student pilot remain human release checks; automated tests do not establish reading suitability or validate the 16/20 threshold. The 16/20 threshold remains the course registration rule.

## Publish from GitHub

1. Push this project folder to a GitHub repository. The included `.gitignore` excludes dependencies, local environment files, and generated build output.
2. In Vercel, import that repository and choose the **Next.js** framework preset.
3. Keep the project root as the root directory. Use `npm ci` to install and `npm run build` to build, then deploy.

## Supabase registration

1. Open Supabase SQL Editor and run [supabase-setup.sql](supabase-setup.sql). It creates the location tables and private registration table, then loads 14 regions, 209 districts or cities, and 11,308 distinct school entries.
2. Set `SUPABASE_URL` and `SUPABASE_SECRET_KEY` in Vercel project environment variables, then redeploy. Use a modern `sb_secret_...` key. These variables are server only; never use a `NEXT_PUBLIC_` prefix for the secret key. See `.env.example` for the names.
3. A student completes the five labs, six scenarios, and the 20 question test. A score of at least 16/20 unlocks registration. The form saves region, district, school, class, first name, surname, and score.

The school directory comes from the [community maintained schools_list dataset](https://github.com/Asadbek525/schools_list). Verify its coverage and spelling against your school roster before launch. The SQL and browser selector data were generated from the same source. Supabase has no public read policy for registration records; staff can view them in the Supabase dashboard.

The server recalculates the score from submitted answers. Since this is an anonymous web test whose questions and answers are present in the browser, the result is suitable for registration and educational monitoring, not a tamper-proof exam. Names and school choices are self-reported.

## Student feedback

Results show registration eligibility directly below the score, then optional feedback before the category breakdown and answer explanations. The “Share feedback” menu item also opens feedback at any time, without completing lessons or the test. It offers three ready-made opinions and a fourth write-in choice that opens a text box. It does not affect the score or registration. English and Uzbek are supported. Drafts remain across navigation and, when browser storage is available, reloads; “sent” appears only after the server confirms storage. Selecting a ready-made answer does not transmit a hidden custom-text draft. A late response after a reset or unmount cannot overwrite the new attempt. Submission IDs support HTTPS and plain-HTTP local-network testing without using `Math.random`.

For an existing Supabase project, run [supabase-feedback.sql](supabase-feedback.sql) once in SQL Editor. Fresh setup through `supabase-setup.sql` includes this table. The endpoint uses the existing server-only Supabase settings. Staff can read `student_feedback` in the Supabase dashboard; browser roles have no read or write access. Rows contain a random submission ID, course version, choice, optional text, language and timestamp, with no name, school, test answers, score or registration reference. Retries reuse the submission ID to avoid duplicate rows after a lost response. Free text is limited to 1,000 characters. If storage is unavailable, the draft stays local and students can retry.

## Preserved behavior

- Uzbek and English language switching
- Five interactive labs and six practice scenarios
- The 20-question final assessment, unlock rules, results, review, and retake
- Local progress storage, sidebar collapse, and mobile navigation
- Voice simulation, printing, reset controls, and source links

Learning progress stays in each visitor's browser through `localStorage`, using the original storage key. Registration details and score are sent to Supabase only when the student submits the form. Progress is not shared between devices or visitors.

## Files

- `reference/second_thought_cyberculture.html` — byte-for-byte copy of the original file
- `src/app/page.tsx` — Next.js home route
- `src/app/layout.tsx` — original language, title, description, and theme color
- `src/app/globals.css` — original styles, including responsive and print rules
- `src/components/cyberculture-app.tsx` — React application shell
- `src/lib/cyberculture.js` — course interactions and rendering, with React lifecycle cleanup
- `data/course-content.json` — versioned English and Uzbek questions, practice choices and feedback
- `src/lib/course-progress.mjs` — migration and restoration of versioned local attempts
- `src/lib/assessment.mjs` — answer validation and scoring used by the registration handler
