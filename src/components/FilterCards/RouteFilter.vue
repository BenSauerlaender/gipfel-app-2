<template>
  <div class="col-12 col-sm-6 col-md-4 col-lg-3">
    <q-card class="filter-card">
      <q-card-section>
        <div class="text-h8">Gebiet, Gipfel, Weg</div>
        <q-select
          v-model="selectedRegion"
          use-input
          clearable
          input-debounce="0"
          label="Gebiet"
          :options="regionOptions"
          @filter="regionFilter"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-select
          v-model="selectedSummit"
          use-input
          clearable
          input-debounce="0"
          label="Gipfel"
          :options="summitOptions"
          @filter="summitFilter"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-select
          v-model="selectedRoute"
          use-input
          clearable
          :disable="selectedSummit == null"
          input-debounce="0"
          label="Weg"
          :options="routeOptions"
          @filter="routeFilter"
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
</template>

<script setup>
import { computed, ref } from 'vue'
import { useDataStore } from 'src/stores/dataStore'
import { useFilterStore } from 'src/stores/filterStore'

const dataStore = useDataStore()
const filterStore = useFilterStore()
const filters = filterStore.filters

// get all unique regions from ascents
const regionOptionDefault = [...new Set(dataStore.ascents.map(ascent => ascent.route.summit.region))].map(region => ({ 
  label: region.name, 
  value: region._id 
})).sort((a, b) => a.label.localeCompare(b.label))
const regionOptions = ref(regionOptionDefault)

const regionFilter = (val, update) => {
  if (val === '') {
    update(() => {
      regionOptions.value = regionOptionDefault
    })
    return
  }
  update(() => {
    const needle = val.toLowerCase()
    regionOptions.value = regionOptionDefault.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
  })
}

const selectedRegion = computed({

  get: () => {
    if(filters.route.region == null) return null
    return {
      label: regionOptionDefault.find(option => option.value === filters.route.region).label,
      value: filters.route.region
    }
  },
  set: (newVal) => {
    if(newVal == null) filters.route.region = null
    else {
      filters.route.region = newVal.value
      if(filters.route.summit && dataStore.summits.find(summit => summit._id === filters.route.summit).region._id !== newVal.value) {
        filters.route.summit = null
      }
    }
  }
})

const uniqueSummits = computed(() => [...new Set(dataStore.ascents.map(ascent => ascent.route.summit))])
const summitOptionDefault = computed(() => uniqueSummits.value.filter(summit => {
  if(selectedRegion.value == null) return true
  return summit.region._id === selectedRegion.value.value
}).map(summit => ({ 
  label: summit.name, 
  value: summit._id 
})).sort((a, b) => a.label.localeCompare(b.label)))
const summitOptions = ref(summitOptionDefault.value)

const selectedSummit = computed({
  get: () => {
    if(filters.route.summit == null) return null
    const summit = dataStore.summits.find(summit => summit._id === filters.route.summit)
    if(summit == null) return null
    return {
      label: summit.name,
      value: filters.route.summit
    }
  },
  set: (newVal) => {
    if(newVal == null) {filters.route.summit = null}
    else {
      filters.route.summit = newVal.value
      filters.route.region = dataStore.summits.find(summit => summit._id === newVal.value).region._id
    }
    filters.route.route = null
  }
})

const summitFilter = (val, update) => {
  if (val === '') {
    update(() => {
      summitOptions.value = summitOptionDefault.value
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    summitOptions.value = summitOptionDefault.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
  })
}

const routeOptionDefault = computed(() => dataStore.ascents.map(ascent => ascent.route)
.filter(route => {
  if(selectedSummit.value == null) return true
  return route.summit._id === selectedSummit.value.value
}).map(route => ({ 
  label: route.name, 
  value: route._id 
})).sort((a, b) => a.label.localeCompare(b.label)))
const routeOptions = ref(routeOptionDefault.value)

const routeFilter = (val, update) => {
  if (val === '') {
    update(() => {
      routeOptions.value = routeOptionDefault.value
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    routeOptions.value = routeOptionDefault.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
  })
}

const selectedRoute = computed({
  get: () => {
    if(filters.route.route == null) return null
    return {
      label: routeOptionDefault.value.find(option => option.value === filters.route.route).label,
      value: filters.route.route
    }
  },
  set: (newVal) => {
    if(newVal == null) {filters.route.route = null}
    else {
      filters.route.route = newVal.value
    }
  }
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