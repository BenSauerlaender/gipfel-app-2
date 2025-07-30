# GipfelApp

## 🛠 Tech Stack

- **Framework**: [Vue 3](https://vuejs.org/) mit Composition API
- **UI Framework**: [Quasar Framework](https://quasar.dev/)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Mapping**: [MapLibre GL](https://maplibre.org/)
- **Charts**: [Chart.js](https://www.chartjs.org/) mit Vue-chartjs
- **Build Tool**: [Vite](https://vitejs.dev/)
- **PWA**: Workbox Service Worker

## 📋 Prerequisites

- Node.js (v24 or higher)
- Quasar CLI: `npm install -g @quasar/cli`

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Development Server

```bash
# Start development server with hot-reload
quasar dev
```

The app will be available at `http://localhost:9000`

### 3. Build for Production

```bash
# Build PWA for production
quasar build -m pwa

# Or using npm script
npm run build
```

## 📁 Project Structure

```
src/
├── api/                    # API layer and authentication
├── assets/                 # Static assets (images, logos)
├── boot/                   # Quasar boot files
├── components/             # Reusable Vue components
│   ├── Chips/             # Route information chips
│   ├── FilterCards/       # Filter components
│   ├── StatCards/         # Statistics cards
│   └── tables/            # Table components
├── composables/           # Vue composables
├── css/                   # Global styles and variables
├── helper/                # Utility functions
├── layouts/               # Page layouts
├── pages/                 # Application pages
│   ├── detailPages/       # Detail view pages
│   ├── others/            # Misc pages
│   └── statPages/         # Statistics pages
├── resourceManagers/      # Data and resource management
├── router/                # Vue Router configuration
└── stores/                # Pinia stores
```

## 🔧 Development

### Configuration

- **Quasar Config**: `quasar.config.js`
- **ESLint**: `eslint.config.js`
- **PostCSS**: `postcss.config.js`
- **PWA Manifest**: `src-pwa/manifest.json`

## 📱 PWA Features

- **Offline Functionality**: Service Worker caches resources
- **Installable**: Can be installed on devices
- **Responsive**: Works on all screen sizes
- **App-like Experience**: Native app feel

## 🗺 Map Integration

The app uses MapLibre GL for interactive maps with:

- Offline map support via PMTiles
- Custom map styles
- Route and summit markers
- Clustering and heatmap visualization

## 💾 Data Management

### Resource Managers

- `JsonResourceManager`: Handles JSON data resources
- `OfflineMapResourceManager`: Manages offline map tiles
- `ResourceManager`: Base class for resource management

### Stores

- `dataStore`: Application data state
- `filterStore`: Filter and search state
- `resourceStore`: Resource loading and caching
- `userStore`: User authentication and preferences

## 🚀 Deployment

### Build PWA

```bash
quasar build -m pwa
```

### Deploy to Server

```bash
# Example deployment script
rsync -avzP --delete -e "ssh" ./dist/pwa/ user@server:/var/www/gipfelapp/pwa/
```

## 📄 Additional Documentation

- [TODO.md](./TODO.md) - Development roadmap and known issues
- [Quasar Documentation](https://v2.quasar.dev/)
- [Vue 3 Documentation](https://vuejs.org/)
