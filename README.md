# justCatchPocketMonster assets

This repository stores shared assets and data used by the main bot project:
`https://github.com/justCatchPocketMonster/justCatchPocketMonster`.

## Structure

```
/
├── .github/workflows/tests.yml
├── images/
│   ├── pokeHome/
│   ├── pokeHomeShadow/
│   └── eventImage/
└── json/
    ├── pokemon.json
    ├── language.json
    ├── eventData.json
    └── eventSeasonalData.json
    └── schemaRules.json

tests/
package.json
```

- `images/`: Pokemon and project images (served through GitHub raw URLs).
- `json/`: Runtime data files loaded locally by the main project submodule.
- `tests/`: Data validation tests (run with `vitest`).
- `.github/workflows/tests.yml`: CI running `npm test` on PRs and pushes to `main`.
- `json/schemaRules.json`: Shared validation rules (required languages, allowed values, image folders).

## How the main project uses this repo

In the main repository, this repo is mounted as a Git submodule at `src/data`.

- JSON files are imported from `src/data/json/...`.
- Images are referenced using raw GitHub URLs from `images/...`.

## Data validation (recommended)

This repo includes a test suite to guarantee consistency between:
- JSON structure and required languages (see `json/schemaRules.json`)
- Existing image files and naming/extension rules
- Event data formats

Run locally:

```bash
npm ci
npm test
```

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

## JSON files (what they contain)

- `json/pokemon.json`: Pokedex data used at runtime (IDs, forms, rarity, generation, etc.).
- `json/language.json`: All i18n strings. **Each key must contain all required languages** (see `json/schemaRules.json`).
- `json/eventData.json`: Main event definitions.
- `json/eventSeasonalData.json`: Seasonal event definitions.
- `json/schemaRules.json`: Validation rules consumed by tests (languages required, allowed forms/rarity/gens, image folders/extensions).

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
