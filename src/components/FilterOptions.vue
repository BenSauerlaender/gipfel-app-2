<template>
  <div class="q-pa-md">
    <div class="row q-col-gutter-md">

      <!-- Ascent Type Filter -->
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

      <!-- Climber Filter -->
      <div class="col-12 col-sm-6 col-md-4 col-lg-3">
        <q-card class="filter-card">
          <q-card-section>
            <div class="text-h8">Bergsteiger</div>
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

      <div class="col-12 col-sm-6 col-md-4 col-lg-3">
        <q-card class="filter-card">
          <q-card-section>
            <div class="text-h8">Route</div>
                <q-select
                filled
                v-model="selectedSummit"
                use-input
                clearable
                input-debounce="0"
                label="Gipfel"
                :options="summitOptions"
                @filter="summitFilter"
                style="width: 250px"
            >
                <template v-slot:no-option>
                    <q-item>
                        <q-item-section class="text-grey">
                        No results
                        </q-item-section>
                    </q-item>
                </template>
            </q-select>
          </q-card-section>
        </q-card>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useDataStore } from 'src/stores/dataStore'
import { useFilterStore } from 'src/stores/filterStore'
import { storeToRefs } from 'pinia'

const dataStore = useDataStore()
const filterStore = useFilterStore()
// Filter state
const filters = filterStore.filters

const ascentsAllowedTypes = computed({
    get: () => filters.ascents.allowedTypes,
    set: (newVal) => {
        filters.ascents.allowedTypes = newVal
    }
})
const ascentTypeOptions = [
  { label: 'Klassisch', value: 'lead' },
  { label: 'Solo', value: 'solo' },
  { label: 'v.o.g.', value: 'topRope' },
  { label: 'Abgebrochen', value: 'aborted' }
]


const selectedClimbers = computed({
    get: () => {
        if(filters.climbers.selected == null) return []
        return filters.climbers.selected.map(climber => ({
            label: climberOptions.value.find(option => option.value === climber).label,
            value: climber
        }))
    },
    set: (newVal) => {
        if(newVal == null) filters.climbers.selected = []
        else filters.climbers.selected = newVal.map(climber => climber.value)
    }
})
const climberOptions = computed(() => {
  return dataStore.climbers.map(climber => ({
    label: `${climber.firstName}`,
    value: climber._id
  }))
})


const climberMode = computed({
    get: () => {
        return {
            value: filters.climbers.mode,
            label: climberModeOptions.find(option => option.value === filters.climbers.mode).label
        }
    },
    set: (newVal) => {
        filters.climbers.mode = newVal.value
    }
})
const climberModeOptions = [
  { label: 'oder', value: 'or' },
  { label: 'und', value: 'and' },
  { label: 'genau', value: 'exact' },
  { label: 'nicht', value: 'not' }
]

const summitOptionDefault = dataStore.summits.map(summit => ({ 
    label: summit.name, 
    value: summit._id 
}))
const summitOptions = ref( summitOptionDefault )

const selectedSummit = computed({
  get: () => {
    if(filters.summit.selected == null) return null
    return {
      label: summitOptionDefault.find(option => option.value === filters.summit.selected).label,
      value: filters.summit.selected
    }
  },
  set: (newVal) => {
    if(newVal == null) filters.summit.selected = null
    else filters.summit.selected = newVal.value
  }
})

const summitFilter = (val, update) => {
        if (val === '') {
          update(() => {
            summitOptions.value = summitOptionDefault
          })
          return
        }

        update(() => {
          const needle = val.toLowerCase()
          summitOptions.value = summitOptionDefault.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
        })
      }




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

onMounted(() => {
  // Initialize with any saved filters or defaults
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
