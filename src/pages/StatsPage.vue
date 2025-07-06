<template>
  <router-view v-slot="{ Component }">
    <template v-if="Component">
      <component :is="Component" />
    </template>
    <template v-else>
      <div class="stats-section q-pa-md">
        <div>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6 col-md-4 col-lg-3">
              <AscentsByTypeChart :ascents="f_Ascents" />
            </div>
            <div class="col-12 col-sm-6 col-md-4 col-lg-3">
              <RoutesByGradeChart :routes="uniqueRoutes" />
            </div>
            <div class="col-12 col-sm-6 col-md-4 col-lg-3">
              <SummitsByRegionChart :summits="uniqueSummits" />
            </div>
            <div class="col-12 col-sm-12 col-md-8 col-lg-6">
              <AscentsByDayChart :trips="f_PopulatedTrips" />
            </div>
            <div class="col-12 col-sm-6 col-md-4 col-lg-3">
              <TopSummitsChart :ascents="f_Ascents" />
            </div>
            <div class="col-12 col-sm-12 col-md-8 col-lg-6">
              <TopClimbersChart
                :ascents="f_Ascents"
                :allowAborted="filterStore.filters.ascents.allowedTypes.includes('aborted')"
              />
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

const uniqueRoutes = computed(() => [...new Set(f_Ascents.value.map((ascent) => ascent.route))])
</script>

<style scoped>
.stats-section {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
