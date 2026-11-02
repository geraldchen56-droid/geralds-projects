# geralds-projects

My projects page, live at geralds-projects.vercel.app. Push to `main` and Vercel redeploys.

## What is what

- `projects.json`: **the one file to edit.** It controls the order, the sections, how the cards look, and every project's name, links, "why I built it" and "what it does". The `_help` lines at the top explain each setting.
- `media/`: each project's cover clip, `<slug>.mp4` (864x1080, about 7 s, muted) and its poster `<slug>.jpg`. Free Mixkit footage; sources are in `media/sources.json`.
- `covers/`: `<slug>-wide.jpg`, a 1440x900 at 2x screenshot of the real site, shown lower on each project page.
- `index.html`: home page (outline, then the sections). `project.html`: the template every project page uses.
- `assets/site.js`: reads `projects.json` and draws the pages. `assets/site.css`: the look.
- `vercel.json`: one rewrite per project slug, so `/edge-lab` opens that project's page.

## Common edits (all in `projects.json`)

- **Reorder projects:** move a slug up or down inside a section's `projects` list.
- **Reorder sections:** move a whole section block up or down.
- **Move a project to another section:** cut its slug from one list, paste it into another.
- **New section:** copy a section block; give it a new `id`, `title`, `note` and slugs.
- **Make a card bigger:** add `"featured": true` to the project.
- **Hide a project:** add `"hidden": true` (its page still works by direct link).
- **Tag a project:** add `"status": "In progress"`.
- **Layout:** `settings.homeLayout` is `"sections"` or `"strip"`; `settings.cardsPerRow` is 2, 3 or 4; `settings.outline` and `settings.showKind` turn the contents list and card subtitles on or off.

A project not listed in any section still shows, under "More" at the end.

## Adding a project

Add a block to `projects` in `projects.json`, put its slug in a section, add its clip, poster and wide screenshot, and add its slug to `vercel.json`.
