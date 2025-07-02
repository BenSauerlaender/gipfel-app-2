<template>
  <div id="placeholdermap" class="mapContainer">
  </div>
  <div class="controlContainer q-pa-sm">
    <q-card class="" flat bordered style="border-radius: 18px;">
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

<script setup lang="ts">
import 'leaflet/dist/leaflet.css'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import L, { LeafletEventHandlerFn } from 'leaflet'
import { useDataStore } from 'src/stores/dataStore'
import { useFilterStore } from 'src/stores/filterStore'
import { useRouter, useRoute } from 'vue-router'

const dataStore = useDataStore()
const filterStore = useFilterStore()
const router = useRouter()

const leafletMap = ref<L.Map>(null)
const showNotAscended = ref(true)

const allMarkers = ref(null)
const allSummits = dataStore.summits

const selectedSummit = allSummits.find(s => s._id == useRoute().params.id) ?? undefined

const summitsAscendedIDs = computed(() => dataStore.summits.filter(summit => dataStore.f_AscentsPerSummit[summit._id] > 0).map(s => s._id))

watch(summitsAscendedIDs,() => updateMarkers());
watch(() => filterStore.applyFilter,() => updateMarkers());
watch(() => filterStore.filters.route.region,() => updateMarkers());
watch(() => showNotAscended.value,() => updateMarkers());




const popupHtml = (summit) => {
    const routesWithAscents = summit.routeIDs.filter(routeID => dataStore.f_AscentsPerRoute[routeID] > 0).length
    const routeCount = summit.routeIDs.length
    const routePercentage = routeCount == 0 ? 0.0 : (routesWithAscents / routeCount * 100).toFixed(1)
    const ascents = dataStore.f_AscentsPerSummit[summit._id] ?? 0
    return `<div class="text-bold text-subtitle2">${summit.name}</div>
            <div><span class="">Wege: </span><span class="text-bold">${routeCount}</span></div>
            <div><span class="">begangen: </span><span class="text-bold">${routePercentage}%</span></div>
            <div><span class="">Begehungen: </span><span class="text-bold">${ascents}</span></div>
            <div class="row justify-center q-mt-sm"><a href="#" data-route="/routes/${summit._id}" class="leaflet-popup-link">details</a></div>`;
}
onMounted(() => {
  // Inject the leaflet map after the page is fully rendered
  nextTick(() => {
    initLeafletMap()
  })
})

const initLeafletMap = () => {
  var bounds = [[50.7, 13.7],[ 51.15, 14.6]]

  const center = new L.LatLng(50.92857467871431, 14.155593920476328)
  let zoom = 11
  if(selectedSummit){
    center.lat = selectedSummit.gpsPosition.lat
    center.lng = selectedSummit.gpsPosition.lng
    zoom = 17
  }
  // Find div element 'placeholdermap' in html and inject the leaflet map object
  leafletMap.value = L.map('placeholdermap', {
    center: center,
    zoom: zoom,
    zoomAnimation:false,
    fadeAnimation:true,
    maxBounds: bounds,
    markerZoomAnimation:true
  })

  // Example how to set center and zoom level (with intellisense)
  // leafletMap.value.setView([52.103839, 4.252742], 13 /* zoom level */)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    minZoom: 11,
    attribution: '© OpenStreetMap contributors',

  }).addTo(leafletMap.value)

  //L.rectangle(bounds, {color: "#ff7800", weight: 1}).addTo(leafletMap.value);

  allMarkers.value = allSummits.map(summit => {
    if (!summit.gpsPosition) return
    if (!summit.gpsPosition.lat) return
    if (!summit.gpsPosition.lng) return
    if (leafletMap.value) {

      const marker = L.circleMarker(summit.gpsPosition, {
        radius: 10,
        stroke: false,
        fillColor: 'blue',
        fillOpacity: 0.3
      })
      .addTo(leafletMap.value)
      .bindPopup(popupHtml(summit))
      marker.on('popupopen', function(e) {
        const popupEl = document.querySelector('.leaflet-popup-link[data-route="/routes/' + summit._id + '"]')
        if (popupEl) {
          (popupEl).onclick = (evt) => {
            evt.preventDefault()
            router.push(`/summits/${summit._id}`)
          }
        }
      })
      if(selectedSummit && summit._id == selectedSummit._id){
        marker.openPopup()
      }
      return {summit,marker}
    }else return null
  }).filter(x => x !== null).filter(x => x)

  updateMarkers()
}

const blueGradient = ["#0094ff", "#178eff", "#2e87ff", "#4680ff", "#5b78ff", "#6f6fff", "#8362ff", "#9750ff", "#aa38ff", "#bd00ff", "#bd00ff"]

const updateMarkers = () => {
  const maxAscents = 1.0*Math.max(...Object.values(dataStore.f_AscentsPerSummit))
  allMarkers.value.forEach(marker => {
    if (filterStore.applyFilter && filterStore.filters.route.region != null) {
      if (marker.summit.region._id != filterStore.filters.route.region){
        marker.marker.setStyle({fill: false, strole: false})
        return
      }
    }

    //const routesWithAscents = marker.summit.routeIDs.filter(routeID => dataStore.f_AscentsPerRoute[routeID] > 0).length
    //const routeCount = 1.0*marker.summit.routeIDs.length
    //const routePercentage = routeCount == 0 ? 0.0 : (routesWithAscents / routeCount )
    const ascents = dataStore.f_AscentsPerSummit[marker.summit._id] ?? 0.0
    const routePercentage = Math.pow(1.0*ascents / maxAscents,0.3)
    if(summitsAscendedIDs.value.includes(marker.summit._id)){
      const style = {
        fillColor: blueGradient[Math.floor(10*routePercentage)],
        fillOpacity: 0.3 + 0.3*routePercentage,
        fill: true,
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
</style>

<style scoped>
.mapContainer {
  width: 100%;
  height: calc(100vh - 100px);
  z-index: 0;
}
.controlContainer{
  z-index: 1;
  top: 40px;
  right: 0;
  position: absolute;
}
</style>