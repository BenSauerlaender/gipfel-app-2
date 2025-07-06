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
              <q-item-section class="text-grey"> No results </q-item-section>
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
              <q-item-section class="text-grey"> No results </q-item-section>
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
              <q-item-section class="text-grey"> No results </q-item-section>
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
import { data } from 'autoprefixer'

const dataStore = useDataStore()
const filterStore = useFilterStore()
const filters = filterStore.filters

const uniqueRegions = new Map()
dataStore.ascents.forEach((ascent) => {
  uniqueRegions.set(ascent.route.regionID, {
    label: ascent.route.regionName,
    value: ascent.route.regionID,
  })
})
// get all unique regions from ascents
const regionOptionDefault = Array.from(uniqueRegions.values()).sort((a, b) =>
  a.label.localeCompare(b.label),
)
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
    regionOptions.value = regionOptionDefault.filter(
      (v) => v.label.toLowerCase().indexOf(needle) > -1,
    )
  })
}

const selectedRegion = computed({
  get: () => {
    if (filters.route.region == null) return null
    return {
      label: regionOptionDefault.find((option) => option.value === filters.route.region).label,
      value: filters.route.region,
    }
  },
  set: (newVal) => {
    if (newVal == null) filters.route.region = null
    else {
      filters.route.region = newVal.value
      if (
        filters.route.summit &&
        dataStore.summits.find((summit) => summit._id === filters.route.summit).regionID !==
          newVal.value
      ) {
        filters.route.summit = null
      }
    }
  },
})

const summitOptionDefault = computed(() => {
  const uniqueSummits = new Map()
  dataStore.summits
    .filter((summit) => {
      if (selectedRegion.value == null) return true
      return summit.regionID === selectedRegion.value.value
    })
    .filter((summit) => dataStore.f_AscentsPerSummit[summit._id] > 0)
    .forEach((summit) => {
      uniqueSummits.set(summit._id, {
        label: summit.name,
        value: summit._id,
      })
    })
  return Array.from(uniqueSummits.values()).sort((a, b) => a.label.localeCompare(b.label))
})
const summitOptions = ref(summitOptionDefault.value)

const selectedSummit = computed({
  get: () => {
    if (filters.route.summit == null) return null
    const summit = dataStore.summits.find((summit) => summit._id === filters.route.summit)
    if (summit == null) return null
    return {
      label: summit.name,
      value: filters.route.summit,
    }
  },
  set: (newVal) => {
    if (newVal == null) {
      filters.route.summit = null
    } else {
      filters.route.summit = newVal.value
      filters.route.region = dataStore.summits.find(
        (summit) => summit._id === newVal.value,
      ).regionID
    }
    filters.route.route = null
  },
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
    summitOptions.value = summitOptionDefault.value.filter(
      (v) => v.label.toLowerCase().indexOf(needle) > -1,
    )
  })
}

const routeOptionDefault = computed(() => {
  const uniqueRoutes = new Map()
  dataStore.ascents
    .map((ascent) => ascent.route)
    .filter((route) => {
      if (selectedSummit.value == null) return true
      return route.summitID === selectedSummit.value.value
    })
    .forEach((route) => {
      uniqueRoutes.set(route._id, {
        label: route.name,
        value: route._id,
      })
    })
  return Array.from(uniqueRoutes.values()).sort((a, b) => a.label.localeCompare(b.label))
})
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
    routeOptions.value = routeOptionDefault.value.filter(
      (v) => v.label.toLowerCase().indexOf(needle) > -1,
    )
  })
}

const selectedRoute = computed({
  get: () => {
    if (filters.route.route == null) return null
    return {
      label: routeOptionDefault.value.find((option) => option.value === filters.route.route).label,
      value: filters.route.route,
    }
  },
  set: (newVal) => {
    if (newVal == null) {
      filters.route.route = null
    } else {
      filters.route.route = newVal.value
    }
  },
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
