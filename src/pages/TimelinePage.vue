<template>
  <div class="page-container">
      <q-card>
        <q-card-section class="q-pa-xl row items-center justify-between">
          <div class="text-h2"></div>
          <q-toggle
            v-model="applyFilter"
            checked-icon="check"
            color="green"
            unchecked-icon="clear"
            label="Filter anwenden"
          />
        </q-card-section>
        <div class="space"></div>
        <div class="row justify-center">
          <div>
            <q-separator />
            <q-card-section>
              <q-timeline color="secondary" layout="dense" side="right" class="col-10">
                <div v-if="trips.length === 0">
                  <div class="text-h6">Keine Einträge gefunden</div>
                </div>
                <div v-else>
                  <TimelineTripEntry v-for="trip in trips" :key="trip.days[0].date" :trip="trip" />
                </div>
              </q-timeline>
            </q-card-section>
          </div>
        </div>
      </q-card>
  </div>
</template>

<script setup>
import { useDataStore } from 'src/stores/dataStore'
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import TimelineTripEntry from 'src/components/TimelineTripEntry.vue'

const dataStore = useDataStore()
const {f_PopulatedTrips} = storeToRefs(dataStore)

const applyFilter = ref(true)

const trips = computed(() => {
  console.log(applyFilter.value)
  if (applyFilter.value) {
    return [...f_PopulatedTrips.value].reverse()
  }
  return [...dataStore.populatedTrips].reverse()
})

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