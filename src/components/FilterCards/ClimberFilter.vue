<template>
  <div class="col-12 col-sm-6 col-md-3">
    <q-card class="filter-card">
      <q-card-section>
        <div class="filter-header">Bergsteiger</div>
        <q-select
          v-model="selectedClimbers"
          :options="climberOptions"
          multiple
          use-chips
          class="q-mt-md"
          label="Bergsteiger"
          clearable
        />
        <q-select
          v-model="climberMode"
          :options="climberModeOptions"
          class="q-mt-md"
          label="Modus"
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useDataStore } from 'src/stores/dataStore'
import { useFilterStore } from 'src/stores/filterStore'

const dataStore = useDataStore()
const filterStore = useFilterStore()
const filters = filterStore.filters

const selectedClimbers = computed({
  get: () => {
    if (filters.climbers.selected == null) return []
    return filters.climbers.selected.map((climber) => ({
      label: climberOptions.value.find((option) => option.value === climber).label,
      value: climber,
    }))
  },
  set: (newVal) => {
    if (newVal == null) filters.climbers.selected = []
    else filters.climbers.selected = newVal.map((climber) => climber.value)
  },
})

const climberOptions = computed(() => {
  return dataStore.climbers.map((climber) => ({
    label: `${climber.firstName}`,
    value: climber._id,
  }))
})

const climberMode = computed({
  get: () => {
    return {
      value: filters.climbers.mode,
      label: climberModeOptions.find((option) => option.value === filters.climbers.mode).label,
    }
  },
  set: (newVal) => {
    filters.climbers.mode = newVal.value
  },
})

const climberModeOptions = [
  { label: 'oder', value: 'or' },
  { label: 'und', value: 'and' },
  { label: 'genau', value: 'exact' },
  { label: 'nicht', value: 'not' },
]
</script>

<style scoped></style>
