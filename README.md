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

-deploy?

## Consistensy/Robustness

- use ColorUtils for all colors
- use DomUtils for height of Map and BottomPanel

## Features

- use URL parameter for tabViews
- On Mobile: getLocation in MapView
- MapView HeatMap Style Or Cluster?

## BUG

- per direketem url aufruf http://localhost:9000/#/routes/6851d0442e8d5658ef9f2621
  - Zurueck button -> beendet die Seite
  - Expected behavior: fuehrt zu summitDetail
- update notification funktioniert nicht (boot/initStore)

## Performance

- Tagebuch performance analysieren.

### PWA

- Service Workers

## Electron

## Capacitor

# Limitations:

- Schwierigkeitsgrad von Routen
  - RP wird nicht beachtet
  - Grad mit Unterstuetzung wird nicht beachtet
  - Normaler Grad wird nicht beachtet, wenn es auch einen Sprung Grad gibt
