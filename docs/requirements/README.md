# Requirements docs

One markdown file per feature (or per page, for large page sets grouped under
their own folder with an index `README.md`). Nothing is duplicated across
files — cross-reference instead (`see feature-x.md`) so there's a single
source of truth per topic.

## Suggested layout, once this grows

```text
docs/requirements/
├── progress-report.md   — master index: what's covered/pending, links out
├── <feature>.md         — one file per core feature
├── landing-pages/        — one file per public page, own README.md index
└── <area>-dashboard/     — one file per page in a dashboard area, own README.md index
```

## How to read this folder (worth putting in root CLAUDE.md once it's populated)

- **Implementing a page** → that page's file, plus the one or two core
  feature docs it references.
- **Implementing a feature's backend logic** → that feature's root-level
  `.md` file only.
- **Unsure which file covers something** → check the index
  (`progress-report.md`) rather than grepping/reading every file.
- **Request is vague about which feature/page it concerns** → ask for
  clarification rather than reading broadly to compensate.

This keeps context usage proportional to the task, not the size of the whole
docs folder.
