<template>
  <div class="col-12 col-sm-6 col-md-4 col-lg-3">
    <q-card class="filter-card">
      <q-card-section>
        <div class="text-h8">Begehungsarten</div>
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
  </div>
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
