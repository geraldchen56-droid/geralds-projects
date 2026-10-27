# geralds-projects

My projects page, live at geralds-projects.vercel.app. Push to `main` and Vercel redeploys.

- `assets/projects.js`: every project's name, links, "why I built it" and "what it does". Edit text here.
- `covers/`: two screenshots per project, `<slug>-tall.jpg` (1200x1600) and `<slug>-wide.jpg` (1440x900 at 2x).
- `index.html`: home page with the cover strip. `project.html`: the template every project page uses.
- `vercel.json`: one rewrite per project slug, so `/edge-lab` opens that project's page.

Adding a project: add a block in `projects.js`, add its two covers, add its slug to `vercel.json`.
