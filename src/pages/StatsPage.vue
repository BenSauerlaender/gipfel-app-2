<template>
    <div class="stats-section q-pa-md">
     <div>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-6 col-md-4 col-lg-3">
          <AscentsByTypeChart :ascents="ascents" />
        </div>
        <div class="col-12 col-sm-6 col-md-4 col-lg-3">
          <RoutesByGradeChart :routes="uniqueRoutes" />
        </div>
        <div class="col-12 col-sm-6 col-md-4 col-lg-3">
          <SummitsByRegionChart :summits="uniqueSummits" />
        </div>
        <div class="col-12 col-sm-12 col-md-8 col-lg-6">
          <AscentsByDayChart :trips="trips" />
        </div>
        <div class="col-12 col-sm-6 col-md-4 col-lg-3">
          <TopSummitsChart :ascents="ascents" />
        </div>
        <div class="col-12 col-sm-12 col-md-8 col-lg-6">
          <TopClimbersChart :ascents="ascents" />
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
  import { getRouteGrade } from 'src/helper/route'

  const dataStore = useDataStore()

  const ascents = dataStore.getFilteredAscents
  const trips = dataStore.getFilteredPopulatedTrips
  const uniqueSummits = [...new Set(ascents.map(ascent => ascent.route.summit))]
  const uniqueRoutes = [...new Set(ascents.map(ascent => ascent.route))]
  </script>
  
  <style scoped>
  .stats-section {
    max-width: 1600px;
    margin: 0 auto;
  }

  </style>