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
- refresh token (15 stueck in der db)


## Performance verbessern Strategie:
1. Download daten verringern, ohne Frontend umzuschreiben (Ziel unter 10MB)
  - timestamps und __v entfernen
  - unnoetige datenduplikate entfernen
    - route in routes braucht maximal summitID, summmitName, regionID, regionName
    - das gleiche fuer summits und ascents 
  - vielleicht summitIDs, ascentIDs und routeIDs in Region, Climber und Summits komplett entfernen
  
2. Wenn download noch zu hoch: lazy loading (pot. Offline faehigkeit geht bisschen verloren)
  - routes kann stueck fuer stueck geladen werden. Am Anfang nicht notwendig

3. SPA daten managment analysieren und verbessern
  
4. IndexedDB (fuer offline/ schnelleren start)


# Limitations:
- Schwierigkeitsgrad von Routen
    - RP wird nicht beachtet
    - Grad mit Unterstuetzung wird nicht beachtet
    - Normaler Grad wird nicht beachtet, wenn es auch einen Sprung Grad gibt
