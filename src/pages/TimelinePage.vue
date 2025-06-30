<template>
  <div class="page-container">
    <div class="space"></div>
    <div class="row justify-center">
      <q-timeline color="secondary" layout="dense" side="right" class="col-10">
        <div v-if="trips.length === 0">
          <div class="text-h6">Keine Einträge gefunden</div>
        </div>
        <div v-else>
          <TimelineTripEntry v-for="trip in trips" :key="trip.days[0].date" :trip="trip" />
        </div>
      </q-timeline>
    </div>
  </div>
</template>

<script setup>
import { useDataStore } from 'src/stores/dataStore'
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import TimelineTripEntry from 'src/components/TimelineTripEntry.vue'

const dataStore = useDataStore()
const {filteredPopulatedTrips} = storeToRefs(dataStore)

const trips = computed(() => [...filteredPopulatedTrips.value].reverse())

</script>

<style scoped>
.space {
  height: 80px;
}
.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 10px;
}
</style> 