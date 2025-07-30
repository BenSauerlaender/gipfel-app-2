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

## Design Updates

- logo rework ?
- logo aus topbar in drawer ?
- drawer zwischen top und bottom bar ?
- status und login/out mit in drawer?
- remame menu?

## Features

- On Mobile: getLocation in MapView
- MapView HeatMap Style Or Cluster?
- Online map fallback
- DEV Debug features? console log anzeigen...
- Datengroesse auf die Statusseite
- Tagebuch trips einklappen
- Status Page: gescheite download balken
- animations / transitions ?
- gendern?
- add a version number in status page

## BUG

- auf anderen Bildschirmen ist loader der kaputt (immer noch?)
- statcard height on mobile?
- timeline tabbar hiding on scroll down
- laggy bottom drawer on mobile using the handle

## Performance

- Tagebuch performance analysieren.
- Map tiles komplett in cache?
- Die Resourcemanager in Service Worker?

## Dokumentation

# Limitations:

- Schwierigkeitsgrad von Routen
  - RP wird nicht beachtet
  - Grad mit Unterstuetzung wird nicht beachtet
  - Normaler Grad wird nicht beachtet, wenn es auch einen Sprung Grad gibt

### deploy

quasar build -m pwa
rsync -avzP --delete -e "ssh" ./dist/pwa/ appuser@gipfelapp.ben-sauerlaender.de:/var/www/gipfelapp/pwa/
