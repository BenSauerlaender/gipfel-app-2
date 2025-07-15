<template>
  <q-card class="filter-card">
    <q-card-section>
      <div class="filter-header">Weg-Tags</div>
      <q-select v-model="starMode" :options="starModeOptions" class="q-mt-md" label="Sterne" />
      <q-select
        v-model="unsecureMode"
        :options="unsecureModeOptions"
        class="q-mt-md"
        label="Unsicher"
      />
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useDataStore } from 'src/stores/dataStore'
import { useFilterStore } from 'src/stores/filterStore'

const filterStore = useFilterStore()
const filters = filterStore.filters

const starModeOptions = [
  { label: 'egal', value: null },
  { label: 'keine', value: 'none' },
  { label: 'genau 1', value: 'one' },
  { label: 'genau 2', value: 'two' },
  { label: '1 oder 2', value: 'oneOrTwo' },
]

const unsecureModeOptions = [
  { label: 'egal', value: null },
  { label: 'ohne', value: 'false' },
  { label: 'mit', value: 'true' },
]

const starMode = ref(starModeOptions[0])
const unsecureMode = ref(unsecureModeOptions[0])
starMode.value.value = null
unsecureMode.value.value = null

watch(starMode, (newVal) => {
  filters.route.tags.star = newVal?.value ?? null
})

watch(unsecureMode, (newVal) => {
  filters.route.tags.unsecure = newVal?.value ?? null
})
</script>

<style scoped></style>
