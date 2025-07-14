<template>
  <router-view v-slot="{ Component }">
    <template v-if="Component">
      <component :is="Component" />
    </template>
    <template v-else>
      <div class="stats-section q-pa-md">
        <div>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6 col-md-4 col-lg-4">
              <AscentsByTypeChart :ascents="f_Ascents" />
            </div>
            <div class="col-12 col-sm-6 col-md-4 col-lg-4">
              <RoutesByGradeChart :routes="uniqueRoutes" />
            </div>
            <div class="col-12 col-sm-6 col-md-4 col-lg-4">
              <SummitsByRegionChart :summits="uniqueSummits" />
            </div>
            <div class="col-12 col-sm-6 col-md-4 col-lg-6">
              <TopSummitsChart :ascents="f_Ascents" />
            </div>
            <div class="col-12 col-sm-12 col-md-8 col-lg-6">
              <TopClimbersChart
                :ascents="f_Ascents"
                :allowAborted="filterStore.filters.ascents.allowedTypes.includes('aborted')"
              />
            </div>
            <div class="col-12">
              <AscentsByDayChart :trips="f_PopulatedTrips" />
            </div>
          </div>
        </div>
      </div>
    </template>
  </router-view>
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

const { f_Ascents, f_PopulatedTrips } = storeToRefs(dataStore)
const uniqueSummits = computed(() => {
  const uniqueSummits = new Map()
  f_Ascents.value.forEach((ascent) => {
    uniqueSummits.set(ascent.route.summitID, {
      _id: ascent.route.summitID,
      regionName: ascent.route.regionName,
    })
  })
  return Array.from(uniqueSummits.values()).sort((a, b) => a.regionName.localeCompare(b.regionName))
})

const uniqueRoutes = computed(() => {
  const routeIDs = new Set()
  const routes = []
  f_Ascents.value.forEach((ascent) => {
    if (!routeIDs.has(ascent.route._id)) {
      routeIDs.add(ascent.route._id)
      routes.push(ascent.route)
    }
  })
  return routes
})
</script>

<style scoped>
.stats-section {
  max-width: 1000px;
  margin: 0 auto;
}
</style>
