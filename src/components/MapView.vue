<template>
  <!-- Map container for MapLibre GL map -->
  <div id="map" class="mapContainer"></div>
  <!-- Controls for filtering summits -->
  <div class="controlContainer q-pa-sm">
    <q-card class="" flat bordered style="border-radius: 18px">
      <!-- Toggle to show/hide not ascended summits -->
      <q-toggle
        class="q-pr-md"
        v-model="showNotAscended"
        checked-icon="check"
        color="blue-7"
        unchecked-icon="clear"
        label="Alle Gipfel"
      />
    </q-card>
  </div>
</template>

<script setup>
import 'maplibre-gl/dist/maplibre-gl.css'
import { nextTick, onMounted, ref, watch } from 'vue'
import { useDataStore } from 'src/stores/dataStore'
import { useFilterStore } from 'src/stores/filterStore'
import { useRouter, useRoute } from 'vue-router'
import maplibregl from 'maplibre-gl'
import { Protocol } from 'pmtiles'
import mapStyle from 'src/assets/mapStyle.json'
import { useResourceOldStore } from 'src/stores/resourceStoreOld'

const resourceOldStore = useResourceOldStore()

maplibregl.addProtocol('glyphs', async (params) => {
  const pattern = /glyphs:\/\/(.*)\/(.*)/i
  const url = params.url.match(pattern)
  const font = url[1].split(',')[0]
  const range = url[2]
  const glyph = await resourceOldStore.getMapFontsGlyph(font, range)

  return {
    data: glyph,
  }
})

// Register pmtiles protocol
const protocol = new Protocol()
maplibregl.addProtocol('pmtiles', protocol.tile)

const mapFileName = 'sachsen2.pmtiles' //filename in /public folder

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
  const routesWithAscents = dataStore.routes[summit._id].filter(
    (route) => dataStore.f_AscentsPerRoute[route._id] > 0,
  ).length
  const routeCount = summit.routeCount
  const routePercentage =
    routeCount == 0 ? 0.0 : ((routesWithAscents / routeCount) * 100).toFixed(1)
  const ascents = dataStore.f_AscentsPerSummit[summit._id] ?? 0
  return `<div class=q-px-sm><div class="text-bold text-subtitle2">${summit.name}</div>
            <div><span class="">Wege: </span><span class="text-bold">${routeCount}</span></div>
            <div><span class="">begangen: </span><span class="text-bold">${routePercentage}%</span></div>
            <div><span class="">Begehungen: </span><span class="text-bold">${ascents}</span></div>
            <div class="row justify-center q-mt-sm"><a href="/#/summits/${summit._id}">details</a></div></div>`
}
onMounted(() => {
  nextTick(() => {
    initMap()
  })
})

const initMap = () => {
  // Set pmtiles source for vector tiles
  mapStyle.sources.openmaptiles.url = 'pmtiles://./' + mapFileName
  mapStyle.glyphs = 'glyphs://{fontstack}/{range}'
  //mapStyle.glyphs = 'http://localhost:9000/fonts/{fontstack}/{range}.pbf'
  mapStyle.center = [14.155593920476328, 50.92857467871431]
  mapStyle.zoom = 11
  if (selectedSummit) {
    mapStyle.center = [selectedSummit.gpsPosition.lng, selectedSummit.gpsPosition.lat]
    mapStyle.zoom = 17
  }
  map.value = new maplibregl.Map({
    container: 'map',
    style: mapStyle,
    center: mapStyle.center,
    zoom: mapStyle.zoom,
  })
  map.value.on('load', () => {
    addSummitLayer()
    if (selectedSummit) {
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
