<template>
  <div class="page-container">
    <div class="space"></div>
    <div class="row justify-center">
      <q-timeline color="secondary" layout="dense" side="right" class="col-10">
        <TimelineTripEntry v-for="trip in trips" :key="trip.name" :trip="trip" />
      </q-timeline>
    </div>
  </div>
</template>

<script setup>
import { useDataStore } from 'src/stores/dataStore'
import TimelineTripEntry from 'src/components/TimelineTripEntry.vue'

const dataStore = useDataStore()

const trips = dataStore.getPopulatedTrips.reverse()
console.log(trips)

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