# ZooCompass

[![CI](https://github.com/ianoff/zoo-compass/actions/workflows/ci.yml/badge.svg)](https://github.com/ianoff/zoo-compass/actions/workflows/ci.yml)

An unofficial web app to browse AZA-accredited zoos and aquariums, compare membership reciprocity tiers, filter by location, and estimate straight-line distance from your home facility or ZIP code.

> **Disclaimer:** ZooCompass is not affiliated with, endorsed by, or sponsored by the Association of Zoos and Aquariums (AZA). Institution data is derived from publicly available AZA materials. Reciprocity policies change — always verify current benefits with each institution before visiting.

Based on the [AZA Reciprocity Chart](https://www.aza.org/reciprocity) as of 2026-06-18.

## Stack

- [Next.js 16](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) + [TanStack Table](https://tanstack.com/table)
- [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/)

## Prerequisites

- Node.js 24+ (see `.nvmrc`)
- Yarn (enabled via Corepack — see `packageManager` in `package.json`)

## Getting started

```bash
corepack enable
yarn install
yarn dev
```

Open [http://localhost:3041](http://localhost:3041).

No environment variables are required to run the app. Copy `.env.example` to `.env` only if you plan to run the geocoding maintenance script.

## Scripts

| Script                  | Description                                                                |
| ----------------------- | -------------------------------------------------------------------------- |
| `yarn dev`              | Start the development server (port 3041)                                   |
| `yarn build`            | Create a production build                                                  |
| `yarn start`            | Serve the production build                                                 |
| `yarn lint`             | Run ESLint                                                                 |
| `yarn typecheck`        | Run TypeScript without emitting files                                      |
| `yarn format`           | Format files with Prettier                                                 |
| `yarn test`             | Run unit tests once                                                        |
| `yarn test:watch`       | Run tests in watch mode                                                    |
| `yarn data:fetch-aza`   | Fetch AZA directory HTML into local cache                                  |
| `yarn data:build`       | Rebuild `lib/data/institutions.json` from source + AZA directory fetch     |
| `yarn data:build-zips`  | Rebuild `lib/data/us-zip-centroids.json` from CSV                          |
| `yarn enrich:addresses` | Geocode missing addresses in `data/source/institutions.json` via Nominatim |
| `yarn validate`         | Lint, typecheck, test, and build                                           |

## Data

Institution data is stored as static JSON in `lib/data/institutions.json`, built from:

- `data/source/institutions.json` — canonical institution records (names, locations, addresses, coordinates, reciprocity, accreditation, alternate names for AZA website matching)
- AZA's [Find a Zoo or Aquarium](https://www.aza.org/find-a-zoo-or-aquarium) page — fetched at build time to attach website URLs

See [data/source/README.md](data/source/README.md) for provenance, disclaimers, and maintainer notes.

Edit `data/source/institutions.json` directly to update names, addresses, or reciprocity tiers. Each record can include:

- `alternateNames` — AZA website / formal names for matching saved HTML
- `geocodeQuery` — optional override for Nominatim (when `name` + `city` isn't enough)

Geocode missing locations with:

```bash
NOMINATIM_EMAIL=you@example.com yarn enrich:addresses
```

Regenerate the app dataset with:

```bash
yarn data:build
```

This writes `lib/data/institutions.json` and a reviewable `data/source/match-report.json`. Website URLs are attached from a live fetch of AZA's directory page (cached under `data/source/.cache/`).

## User settings

Your home facility is saved in `localStorage` under `zoo-compass:home-facility-id`. When set, the table adds a **Your benefit** column calculated from the official AZA reciprocity chart based on your home facility tier and each destination's tier.

## Deploying to Vercel

1. Push this repository to GitHub.
2. Import the project in [Vercel](https://vercel.com/new).
3. Use the default Next.js framework preset — no extra configuration required.

CI runs on every push and pull request to `main` via GitHub Actions.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE)
