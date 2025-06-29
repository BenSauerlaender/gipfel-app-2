<template>
    <div class="stats-section q-pa-md">
     <div>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-6 col-md-4 col-lg-3">
          <AscentsByTypeChart :ascentIDs="ascents.map(ascent => ascent._id)" />
        </div>
        <div class="col-12 col-sm-6 col-md-4 col-lg-3">
          <RoutesByGradeChart :routeIDs="uniqueRouteIDs" />
        </div>
        <div class="col-12 col-sm-6 col-md-4 col-lg-3">
          <SummitsByRegionChart :summitIDs="uniqueSummitIDs" />
        </div>
        <div class="col-12 col-sm-12 col-md-8 col-lg-6">
          <AscentsByDayChart :ascentIDs="ascents.map(ascent => ascent._id)" />
        </div>
        <div class="col-12 col-sm-6 col-md-4 col-lg-3">
          <TopSummitsChart :ascentIDs="ascents.map(ascent => ascent._id)" />
        </div>
        <div class="col-12 col-sm-12 col-md-8 col-lg-6">
          <TopClimbersChart :ascentIDs="ascents.map(ascent => ascent._id)" />
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

  const ascents = dataStore.ascents.filter(ascent => ascent.isAborted === false)
  const uniqueRouteIDs = [...new Set(ascents.map(ascent => ascent.route))]
  const uniqueSummitIDs = [...new Set(uniqueRouteIDs.map(routeID => dataStore.getRouteById(routeID).summit))]
  </script>
  
  <style scoped>
  .stats-section {
    max-width: 1200px;
    margin: 0 auto;
  }

  </style>