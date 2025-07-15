<template>
  <q-card class="filter-card">
    <q-card-section>
      <div class="filter-header">Vorstieg</div>
      <q-select
        v-model="selectedClimber"
        :options="climberOptions"
        class="q-mt-md"
        label="Vorsteiger"
        clearable
      />
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useDataStore } from 'src/stores/dataStore'
import { useFilterStore } from 'src/stores/filterStore'

const dataStore = useDataStore()
const filterStore = useFilterStore()
const filters = filterStore.filters

const selectedClimber = ref(null)

const climberOptions = computed(() => {
  return dataStore.climbers.map((climber) => ({
    label: `${climber.firstName}`,
    value: climber._id,
  }))
})

watch(selectedClimber, (newVal) => {
  filters.climbers.lead = newVal?.value ?? null
})
</script>

<style scoped></style>
