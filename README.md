# geralds-projects

My projects page, live at geralds-projects.vercel.app. Push to `main` and Vercel redeploys.

- `assets/projects.js`: every project's name, links, "why I built it" and "what it does". Edit text here.
- `media/`: each project's cover clip, `<slug>.mp4` (864x1080, about 7 s, muted) and its poster `<slug>.jpg`. Free Mixkit footage; sources are in `media/sources.json`.
- `covers/`: `<slug>-wide.jpg`, a 1440x900 at 2x screenshot of the real site, shown lower on each project page.
- `index.html`: home page with the cover strip. `project.html`: the template every project page uses.
- `vercel.json`: one rewrite per project slug, so `/edge-lab` opens that project's page.

Adding a project: add a block in `projects.js`, add its clip, poster and wide screenshot, add its slug to `vercel.json`.
