<template>
  <q-card class="filter-card">
    <q-card-section>
      <div class="filter-header">Begehungsarten</div>
    </q-card-section>
    <q-card-section>
      <q-option-group
        v-model="ascentsAllowedTypes"
        :options="ascentTypeOptions"
        color="primary"
        type="checkbox"
      />
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'
import { useFilterStore } from 'src/stores/filterStore'

const filterStore = useFilterStore()
const filters = filterStore.filters

const ascentsAllowedTypes = computed({
  get: () => filters.ascents.allowedTypes,
  set: (newVal) => {
    filters.ascents.allowedTypes = newVal
  },
})

const ascentTypeOptions = [
  { label: 'Klassisch', value: 'lead' },
  { label: 'Solo', value: 'solo' },
  { label: 'v.o.g.', value: 'topRope' },
  { label: 'Abgebrochen', value: 'aborted' },
]
</script>

<style scoped></style>
