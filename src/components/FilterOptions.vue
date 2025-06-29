<template>
  <div class="q-pa-md">
    <div class="row q-col-gutter-md">

      <!-- Ascent Type Filter -->
      <div class="col-12 col-sm-6 col-md-4 col-lg-3">
        <q-card class="filter-card">
          <q-card-section>
            <div class="text-h8">Begehungen</div>
          </q-card-section>
          <q-card-section>
            <q-option-group
              v-model="filters.ascents.allowedTypes"
              :options="ascentTypeOptions"
              color="primary"
              type="checkbox"
            />
          </q-card-section>
        </q-card>
      </div>

      <!-- Climber Filter -->
      <div class="col-12 col-sm-6 col-md-4 col-lg-3">
        <q-card class="filter-card">
          <q-card-section>
            <div class="text-h8">Climbers</div>
            <q-select
              v-model="selectedClimbers"
              :options="climberOptions"
              multiple
              use-chips
              class="q-mt-md"
              label="Select Climbers"
              clearable
            />
          </q-card-section>
        </q-card>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDataStore } from 'src/stores/dataStore'
import { useFilterStore } from 'src/stores/filterStore'
import { storeToRefs } from 'pinia'

const dataStore = useDataStore()
const filterStore = useFilterStore()
// Filter state
const selectedClimbers = ref([])
const { filters } = storeToRefs(filterStore)

// Options for filters
const climberOptions = computed(() => {
  return dataStore.climbers.map(climber => ({
    label: `${climber.firstName} ${climber.lastName}`,
    value: climber._id
  }))
})

const ascentTypeOptions = [
  { label: 'Klassisch', value: 'lead' },
  { label: 'Solo', value: 'solo' },
  { label: 'v.o.g.', value: 'topRope' },
  { label: 'Abgebrochen', value: 'aborted' }
]

// Computed properties
const hasActiveFilters = computed(() => {
  return selectedClimbers.value.length > 0 ||
         filters.ascents.allowedTypes.length > 0
})

// Methods
function applyFilters() {
  // Emit filter change event or update store
  console.log('Applying filters:', {
    climbers: selectedClimbers.value,
    ascentTypes: filters.ascents.allowedTypes
  })
}

function clearFilters() {
  selectedClimbers.value = []
  filters.ascents.allowedTypes = []
}

function savePreset() {
  // Save current filter configuration
  console.log('Saving filter preset')
}

function removeClimber(climber) {
  selectedClimbers.value = selectedClimbers.value.filter(c => c !== climber)
}

onMounted(() => {
  // Initialize with any saved filters or defaults
  console.log(filters.value.ascents.allowedTypes)
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
