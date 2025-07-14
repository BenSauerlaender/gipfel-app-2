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

- use DomUtils for height of Map and BottomPanel
- filter bereich als footer?

## Design

- pwa anzeigename aendern (erledigt?)

## Design 2

- Chartjs styling (Tooltips, weisse render in circluar chart)
- logo rework
- logo aus topbar in drawer
- drawer zwischen top und bottom bar
- status und login/out mit in drawer?
- rework mobile view

## Features

- use URL parameter for tabViews (oder doch nicht?)
- On Mobile: getLocation in MapView
- MapView HeatMap Style Or Cluster?
- Online map fallback
- DEV Debug features? console log anzeigen...
- Datengroesse auf die Statusseite
- Tagebuch trips einklappen
- tabellen on mobile dense (kleinere schrift, spalten zusammenfassen)
- Abk. fuer Gebiete und dann in Klammern dahinter
- Status Page: gescheite download balken
- animations / transitions ?

## BUG

- per direketem url aufruf http://localhost:9000/#/routes/6851d0442e8d5658ef9f2621
  - Zurueck button -> beendet die Seite
  - Expected behavior: fuehrt zu summitDetail
- update notification funktioniert nicht (boot/initStore)
- status page: download/reload button wenn resource bussy fixen _!_
- mobile: filter: slider tooltips visuel out of box
- mobile: filter: ausklapp handle zu klein und lagged
- filter: Vorstieg kaputt _!_
- filter: Karte updated nicht _!_

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
