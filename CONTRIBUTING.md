# Contributing

Thanks for your interest in ZooCompass!

## Getting started

1. Fork the repository and clone your fork.
2. Install dependencies:

   ```bash
   corepack enable
   yarn install
   ```

3. Start the dev server:

   ```bash
   yarn dev
   ```

   The app runs at [http://localhost:3041](http://localhost:3041).

## Before opening a pull request

Run the full validation suite:

```bash
yarn validate
```

This runs lint, typecheck, tests, and a production build.

## Data changes

Institution records live in `data/source/institutions.json`. After editing source data, regenerate the app dataset:

```bash
yarn data:build
```

If you change ZIP centroid source data:

```bash
yarn data:build-zips
```

See [data/source/README.md](data/source/README.md) for provenance and maintainer notes.

## Pull request guidelines

- Keep changes focused — one logical change per PR when possible.
- Update tests when behavior changes.
- Update README or data docs when you change scripts, env vars, or data workflows.

## Questions

Open a [GitHub issue](https://github.com/ianoff/zoo-compass/issues) for bugs, data corrections, or feature ideas.
