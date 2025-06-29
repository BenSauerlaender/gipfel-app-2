<template>
    <div class="stats-section q-pa-md">
     <div>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-6 col-md-4 col-lg-3">
          <AscentsByTypeChart :ascents="filteredAscents" />
        </div>
        <div class="col-12 col-sm-6 col-md-4 col-lg-3">
          <RoutesByGradeChart :routes="uniqueRoutes" />
        </div>
        <div class="col-12 col-sm-6 col-md-4 col-lg-3">
          <SummitsByRegionChart :summits="uniqueSummits" />
        </div>
        <div class="col-12 col-sm-12 col-md-8 col-lg-6">
          <AscentsByDayChart :trips="filteredPopulatedTrips" />
        </div>
        <div class="col-12 col-sm-6 col-md-4 col-lg-3">
          <TopSummitsChart :ascents="filteredAscents" />
        </div>
        <div class="col-12 col-sm-12 col-md-8 col-lg-6">
          <TopClimbersChart :ascents="filteredAscents" :allowAborted="filterStore.filters.ascents.allowedTypes.includes('aborted')" />
        </div>
      </div>
    </div>
    </div>
  </template>
  
  <script setup>
  import AscentsByTypeChart from 'src/components/StatCards/AscentsByTypeChart.vue'
  import RoutesByGradeChart from 'src/components/StatCards/RoutesByGradeChart.vue'
  import SummitsByRegionChart from 'src/components/StatCards/SummitsByRegionChart.vue'
  import AscentsByDayChart from 'src/components/StatCards/AscentsByDayChart.vue'
  import TopSummitsChart from 'src/components/StatCards/TopSummitsChart.vue'
  import TopClimbersChart from 'src/components/StatCards/TopClimbersChart.vue'
  import { useDataStore } from 'src/stores/dataStore'
  import { useFilterStore } from 'src/stores/filterStore'
  import { storeToRefs } from 'pinia'
  import { computed } from 'vue'

  const dataStore = useDataStore()
  const filterStore = useFilterStore()

  const {filteredAscents, filteredPopulatedTrips} = storeToRefs(dataStore)
  const uniqueSummits = computed(() => [...new Set(filteredAscents.value.map(ascent => ascent.route.summit))])
  const uniqueRoutes = computed(() => [...new Set(filteredAscents.value.map(ascent => ascent.route))])
  </script>
  
  <style scoped>
  .stats-section {
    max-width: 1600px;
    margin: 0 auto;
  }

  </style>