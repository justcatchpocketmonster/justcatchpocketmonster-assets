# justCatchPocketMonster assets

This repository stores shared assets and data used by the main bot project:
`https://github.com/justCatchPocketMonster/justCatchPocketMonster`.

## Structure

```
/
├── images/
└── json/
    ├── pokemon.json
    ├── language.json
    ├── eventData.json
    └── eventSeasonalData.json
```

- `images/`: Pokemon and project images (served through GitHub raw URLs).
- `json/`: Runtime data files loaded locally by the main project submodule.

## How the main project uses this repo

In the main repository, this repo is mounted as a Git submodule at `src/data`.

- JSON files are imported from `src/data/json/...`.
- Images are referenced using raw GitHub URLs from `images/...`.

## Images usage (updated)

Image files are stored in `images/` and are intended to be consumed through
GitHub raw URLs.

Raw URL format:

```txt
https://raw.githubusercontent.com/justCatchPocketMonster/justCatchPocketMonster-assets/main/images/<file-name>.png
```

Example:

```txt
https://raw.githubusercontent.com/justCatchPocketMonster/justCatchPocketMonster-assets/main/images/0001-001.png
```

In the main bot, keep image references stable and deterministic (ID/form-based
filenames) to avoid broken links.

## Contributing

1. Add/update files in `images/` or `json/`.
2. Commit and push changes in this repository.
3. Update the submodule pointer in the main repository.

## Naming rules

- Keep filenames descriptive and lowercase.
- Pokemon image format: `<four-digit-id>-<three-digit-variant>.png` (example: `0001-001.png`).
- Optional shiny suffix: `-shiny` (example: `0001-001-shiny.png`).
- Optional form suffix before shiny: `-<form>` (example: `0001-001-mega-shiny.png`).
- Avoid very large files (>50MB).

## Updating images safely

1. Add/replace files in `images/` with the same naming convention.
2. Commit/push in this assets repository.
3. Update the submodule pointer in the main repository.
4. Verify at least one raw URL after merge to confirm public access.
