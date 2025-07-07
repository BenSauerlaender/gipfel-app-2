# gipfelapp (gipfel-app-2)

A Quasar Project

## Install the dependencies

```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
quasar dev
```

### Lint the files

```bash
yarn lint
# or
npm run lint
```

### Format the files

```bash
yarn format
# or
npm run format
```

### Build the app for production

```bash
quasar build
```

### Customize the configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).

# TODO

## Consistensy/Robustness

- use ColorUtils for all colors
- use DomUtils for height of Map and BottomPanel

## Features

- Timeline indent
- use URL parameter for tabViews
- On Mobile: getLocation in MapView

### Server

- run DB Updates periodicly (Teufelsturm(Basic Data + userScore + Location), OSM-Location)
- save Server log

## Performance

- Tagebuch performance analysieren.

## Offline

- IndexedDB Data + MapTiles
- StatusPage, check for updates, update local IndexedDB

### PWA

- Service Workers

## Electron

## Capacitor

# Limitations:

- Schwierigkeitsgrad von Routen
  - RP wird nicht beachtet
  - Grad mit Unterstuetzung wird nicht beachtet
  - Normaler Grad wird nicht beachtet, wenn es auch einen Sprung Grad gibt
