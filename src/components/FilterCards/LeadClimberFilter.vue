<template>
  <div class="col-12 col-sm-6 col-md-4 col-lg-3">
    <q-card class="filter-card">
      <q-card-section>
        <div class="text-h8">Vorstieg</div>
        <q-select
          v-model="selectedClimber"
          :options="climberOptions"
          class="q-mt-md"
          label="Vorsteiger"
          clearable
        />
      </q-card-section>
    </q-card>
  </div>
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
  return dataStore.climbers.map(climber => ({
    label: `${climber.firstName}`,
    value: climber._id
  }))
})

watch(selectedClimber, (newVal) => {
  filters.climbers.lead = newVal?.value ?? null
})
</script>

<style scoped>
.filter-card {
  height: 100%;
  transition: all 0.3s ease;
}

.filter-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style> 