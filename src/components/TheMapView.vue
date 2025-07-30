<template>
  <!-- Map container for MapLibre GL map -->
  <div id="map" class="mapContainer"></div>
  <!-- Controls for filtering summits -->
  <div class="controlContainer q-pa-sm">
    <q-card class="q-mt-md" flat bordered style="border-radius: 18px">
      <!-- Toggle to show/hide not ascended summits -->
      <q-toggle
        class="q-pr-md"
        v-model="showNotAscended"
        checked-icon="check"
        color="blue"
        unchecked-icon="clear"
        label="Alle Gipfel"
      />
    </q-card>
  </div>
</template>

<script setup>
import 'maplibre-gl/dist/maplibre-gl.css'
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useDataStore } from 'src/stores/dataStore'
import { useFilterStore } from 'src/stores/filterStore'
import { useRouter, useRoute } from 'vue-router'
import maplibregl from 'maplibre-gl'
import { Protocol } from 'pmtiles'
import { useResourceStore } from 'src/stores/resourceStore'

const resourceStore = useResourceStore()

const allFonts = ref(new Set()) // only for VITE_DEBUG_PRINT_USED_FONTS

maplibregl.addProtocol('glyphs', async (params) => {
  const pattern = /glyphs:\/\/(.*)\/(.*)/i
  const url = params.url.match(pattern)
  const font = url[1].split(',')[0]
  const range = url[2]

  if (import.meta.env.VITE_DEBUG_PRINT_USED_FONTS === 'true') {
    const fontString = `"${font}"/"${range}.pbf"`
    if (!allFonts.value.has(fontString)) {
      allFonts.value.add(fontString)
      console.log(
        'all font:\n',
        Array.from(allFonts.value.values()).reduce((acc, cur) => acc + '\n' + cur),
      )
    }
  }

  const glyph = await resourceStore.getResourceById('offline-map').getMapFontsGlyph(font, range)

  return {
    data: glyph,
  }
})
maplibregl.addProtocol('sprite', async (params) => {
  if (params.type === 'json') {
    const json = await resourceStore.getResourceById('offline-map').spriteJson
    return {
      data: json,
    }
  } else if (params.type === 'image') {
    const bitmap = await resourceStore.getResourceById('offline-map').spritePNG

    // Create ImageBitmap from the blob
    console.log('Sprite image bitmap:', bitmap)
    return {
      data: bitmap,
    }
  }
})
maplibregl.addProtocol('tiles', async (params) => {
  const pattern = /tiles:\/\/(\d+)\/(\d+)\/(\d+)\.pbf/i
  const url = params.url.match(pattern)
  if (!url) {
    throw new Error('Invalid tiles URL format')
  }
  const z = parseInt(url[1])
  const x = parseInt(url[2])
  const y = parseInt(url[3])
  const tileData = await resourceStore.getResourceById('offline-map').getMapTile(z, x, y)
  return {
    data: new Uint8Array(tileData.data), // Ensure data is in Uint8Array format
  }
})

// Register pmtiles protocol
const protocol = new Protocol()
maplibregl.addProtocol('pmtiles', protocol.tile)

const dataStore = useDataStore()
const filterStore = useFilterStore()

const map = ref(null)
const showNotAscended = ref(true)
const allSummits = dataStore.summits
const selectedSummit = allSummits.find((s) => s._id == useRoute().params.id) ?? undefined

const blueGradient = [
  '#0094ff',
  '#178eff',
  '#2e87ff',
  '#4680ff',
  '#5b78ff',
  '#6f6fff',
  '#8362ff',
  '#9750ff',
  '#aa38ff',
  '#bd00ff',
  '#bd00ff',
]

// Watchers: update markers when ascents, filters, or toggle changes
watch(
  () => Object.values(dataStore.f_AscentsPerSummit),
  () => updateSummitLayer(),
)
watch(
  () => filterStore.applyFilter,
  () => updateSummitLayer(),
)
watch(
  () => filterStore.filters.route.region,
  () => updateSummitLayer(),
)
watch(
  () => showNotAscended.value,
  () => updateSummitLayer(),
)

// Helper: create GeoJSON for visible summits
const getSummitsGeoJSON = () => {
  // Filter by region if needed
  let summits = allSummits
  if (filterStore.applyFilter && filterStore.filters.route.region != null) {
    summits = summits.filter((s) => s.regionID == filterStore.filters.route.region)
  }
  // Filter by ascension status if needed
  if (!showNotAscended.value) {
    summits = summits.filter((s) => dataStore.f_AscentsPerSummit[s._id] > 0)
  }
  // Only summits with valid GPS
  return {
    type: 'FeatureCollection',
    features: summits
      .filter((s) => s.gpsPosition && s.gpsPosition.lat && s.gpsPosition.lng)
      .map((summit) => {
        // Calculate color/opacity for marker
        const ascents = dataStore.f_AscentsPerSummit[summit._id] ?? 0
        const maxAscents = Math.max(1, ...Object.values(dataStore.f_AscentsPerSummit))
        const routePercentage = Math.pow((1.0 * ascents) / maxAscents, 0.3)
        let fillColor = 'grey',
          fillOpacity = 0.5
        if (ascents > 0) {
          fillColor = blueGradient[Math.floor(10 * routePercentage)]
          fillOpacity = 0.3 + 0.3 * routePercentage
        }
        return {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [summit.gpsPosition.lng, summit.gpsPosition.lat],
          },
          properties: {
            _id: summit._id,
            name: summit.name,
            fillColor,
            fillOpacity,
          },
        }
      }),
  }
}

// Generates HTML for the popup of each summit marker
const popupHtml = (summit) => {
  const routesWithAscents = dataStore
    .routesBySummitID(summit._id)
    .filter((route) => dataStore.f_AscentsPerRoute[route._id] > 0).length
  const routeCount = summit.routeCount
  const routePercentage =
    routeCount == 0 ? 0.0 : ((routesWithAscents / routeCount) * 100).toFixed(1)
  const ascents = dataStore.f_AscentsPerSummit[summit._id] ?? 0
  return `<div class=q-px-sm><div class="text-bold text-subtitle2">${summit.name}</div>
            <div><span class="">Wege: </span><span class="text-bold">${routeCount}</span></div>
            <div><span class="">begangen: </span><span class="text-bold">${routePercentage}%</span></div>
            <div><span class="">Einträge: </span><span class="text-bold">${ascents}</span></div>
            <div class="row justify-center q-mt-sm"><a href="/#/summits/${summit._id}">details</a></div></div>`
}

const isInit = ref(false)

onMounted(() => {
  nextTick(() => {
    if (resourceStore.getResourceById('offline-map').state === 'loaded') {
      initMap()
      isInit.value = true
    } else {
      watch(
        () => resourceStore.getResourceById('offline-map').state,
        (state) => {
          if (state === 'loaded' && !isInit.value) {
            initMap()
            isInit.value = true
          }
        },
      )
    }
  })
})

const initMap = () => {
  const mapStyle = resourceStore.getResourceById('offline-map').styleJson
  console.log('Map style:', mapStyle)
  // Set pmtiles source for vector tiles
  mapStyle.sources.openmaptiles = {
    type: 'vector',
    tiles: ['tiles://{z}/{x}/{y}.pbf'],
    minzoom: 0,
    maxzoom: 14,
  }
  mapStyle.glyphs = 'glyphs://{fontstack}/{range}'
  mapStyle.sprite = 'sprite://src/assets/sprite'
  mapStyle.center = [14.155593920476328, 50.92857467871431]
  mapStyle.zoom = 11
  //TODO: add correct attribtution claim
  if (selectedSummit && selectedSummit.gpsPosition?.lat && selectedSummit.gpsPosition?.lng) {
    mapStyle.center = [selectedSummit.gpsPosition.lng, selectedSummit.gpsPosition.lat]
    mapStyle.zoom = 17
  }
  map.value = new maplibregl.Map({
    container: 'map',
    style: mapStyle,
    center: mapStyle.center,
    zoom: mapStyle.zoom,
    minZoom: 10,
    maxBounds: [
      [13.5, 50.6], // Southwest corner
      [14.8, 51.2], // Northeast corner
    ],
  })
  map.value.on('load', () => {
    addSummitLayer()
    if (selectedSummit && selectedSummit.gpsPosition?.lat && selectedSummit.gpsPosition?.lng) {
      const popup = new maplibregl.Popup({ closeOnClick: true })
        .setLngLat(selectedSummit.gpsPosition)
        .setHTML(popupHtml(selectedSummit))
        .addTo(map.value)
    }
  })
}

// Add or update the summit markers as a GeoJSON layer
const addSummitLayer = () => {
  if (map.value.getSource('summits')) {
    map.value.removeLayer('summit-circles')
    map.value.removeSource('summits')
  }
  map.value.addSource('summits', {
    type: 'geojson',
    data: getSummitsGeoJSON(),
  })
  map.value.addLayer({
    id: 'summit-circles',
    type: 'circle',
    source: 'summits',
    paint: {
      'circle-radius': 10,
      'circle-color': ['get', 'fillColor'],
      'circle-opacity': ['get', 'fillOpacity'],
      'circle-stroke-width': 0,
    },
  })
  // Popup on click
  map.value.on('click', 'summit-circles', (e) => {
    const feature = e.features[0]
    const summit = allSummits.find((s) => s._id === feature.properties._id)
    if (!summit) return
    const popup = new maplibregl.Popup({ closeOnClick: true })
      .setLngLat(feature.geometry.coordinates)
      .setHTML(popupHtml(summit))
      .addTo(map.value)
  })
}

// Update summit layer on filter/toggle changes
const updateSummitLayer = () => {
  if (!map.value || !map.value.isStyleLoaded() || !map.value.getSource('summits')) return
  const src = map.value.getSource('summits')
  if (src && src.setData) {
    src.setData(getSummitsGeoJSON())
  }
}
onUnmounted(() => {
  if (map.value) {
    map.value.off('click', 'summit-circles')
    map.value.off('load')
    map.value.remove()
  }
})
</script>
<style></style>

<style scoped>
/* Map container styling */
.mapContainer {
  width: 100%;
  height: calc(100vh - 100px);
  z-index: 0;
}
/* Controls styling */
.controlContainer {
  z-index: 1;
  top: 40px;
  right: 0;
  position: absolute;
}
</style>
