<template>
  <div id="placeholdermap" class="mapContainer">
  </div>
</template>

<script setup lang="ts">
import 'leaflet/dist/leaflet.css'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import L, { LeafletEventHandlerFn } from 'leaflet'
import { useDataStore } from 'src/stores/dataStore'
import { useFilterStore } from 'src/stores/filterStore'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

const dataStore = useDataStore()
const filterStore = useFilterStore()
const router = useRouter()

const leafletMap = ref<L.Map>(null)

const summitsAscendedIDs = computed(() => dataStore.summits.filter(summit => dataStore.f_AscentsPerSummit[summit._id] > 0).map(s => s._id))

watch(summitsAscendedIDs,() => updateMarkers());
watch(() => filterStore.applyFilter,() => updateMarkers());
watch(() => filterStore.filters.route.region,() => updateMarkers());

const allSummits = dataStore.summits
const allMarkers = ref(null)

const showNotAscended = ref(true)

const popupDialogElement = ref(null)

onMounted(() => {
  // Inject the leaflet map after the page is fully rendered
  nextTick(() => {
    initLeafletMap()
  })
})

const initLeafletMap = () => {
  // Find div element 'placeholdermap' in html and inject the leaflet map object
  leafletMap.value = L.map('placeholdermap', {
    center: new L.LatLng(50.92857467871431, 14.155593920476328),
    zoom: 11,
    zoomAnimation:false,
    fadeAnimation:true,
    markerZoomAnimation:true
  })

  // Example how to set center and zoom level (with intellisense)
  // leafletMap.value.setView([52.103839, 4.252742], 13 /* zoom level */)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    minZoom: 11,
    attribution: '© OpenStreetMap contributors',

  }).addTo(leafletMap.value)
  allMarkers.value = allSummits.map(summit => {
    if (!summit.gpsPosition) return
    if (!summit.gpsPosition.lat) return
    if (!summit.gpsPosition.lng) return
    if (leafletMap.value) {
      const popupHtml = `<div class="text-bold">${summit.name}</div>
        <a href="#" data-route="/routes/${summit._id}" class="leaflet-popup-link">mehr</a>`;
      const marker = L.circleMarker(summit.gpsPosition, {
        radius: 10,
        stroke: false,
        fillColor: 'blue',
        fillOpacity: 0.3
      })
      .addTo(leafletMap.value)
      .bindPopup(popupHtml)
      marker.on('popupopen', function(e) {
        const popupEl = document.querySelector('.leaflet-popup-link[data-route="/routes/' + summit._id + '"]')
        if (popupEl) {
          (popupEl).onclick = (evt) => {
            evt.preventDefault()
            router.push(`/summits/${summit._id}`)
          }
        }
      })
      return {summit,marker}
    }else return null
  }).filter(x => x !== null).filter(x => x)

  updateMarkers()
}

const updateMarkers = () => {
  allMarkers.value.forEach(marker => {
    if (filterStore.applyFilter && filterStore.filters.route.region != null) {
      console.log(filterStore.filters.route.region)
      if (marker.summit.region._id != filterStore.filters.route.region){
        marker.marker.setStyle({fill: false, strole: false})
        return
      }
    }
    if(summitsAscendedIDs.value.includes(marker.summit._id)){
      const style = {
        fillColor: 'blue',
        fill: true
      }
      marker.marker.setStyle(style)
      marker.marker.bringToFront()
    }else{
      const style = {
        fillColor: 'grey',
        fill: true
      }
      if(!showNotAscended.value) style.fill = false
      marker.marker.setStyle(style)
    }
  })
}

</script>
<style>
.my-labels {
  background-color: transparent;
  border: transparent;
  box-shadow: none;
  font-weight: bold;
  font-size: 16px;
  color: red;
}
</style>

<style scoped>
.mapContainer {
  width: 100%;
  height: calc(100vh - 100px);
  z-index: 0;
}
</style>