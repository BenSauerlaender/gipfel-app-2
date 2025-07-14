<template>
  <div class="col-12 col-sm-6">
    <q-card class="filter-card">
      <q-card-section>
        <div class="filter-header">Zeitraum</div>
        <q-range
          v-model="range"
          :min="0"
          :max="allDates.length - 1"
          :step="1"
          :left-label-value="allDates[range.min].toLocaleDateString('de-DE')"
          :right-label-value="allDates[range.max].toLocaleDateString('de-DE')"
          label-always
          label
          color="darkgreen"
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useDataStore } from 'src/stores/dataStore'
import { useFilterStore } from 'src/stores/filterStore'

const dataStore = useDataStore()
const filterStore = useFilterStore()
const filters = filterStore.filters

const ascentDates = dataStore.ascents
  .map((ascent) => new Date(ascent.date.split('T')[0]))
  .toSorted((a, b) => a - b)
const minDate = new Date(ascentDates[0])
const maxDate = new Date(ascentDates[ascentDates.length - 1])

const allDates = []
const currentDate = minDate
while (currentDate <= maxDate) {
  allDates.push(new Date(currentDate))
  currentDate.setDate(currentDate.getDate() + 1)
}

const range = ref({ min: 0, max: allDates.length - 1 })
watch(range, (newValue) => {
  filters.ascents.dateMin = allDates[newValue.min]
  filters.ascents.dateMax = allDates[newValue.max]
})
</script>

<style scoped></style>
