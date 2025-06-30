<template>
  <div class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h5">Begangene Gipfel</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-table
          :rows="summits"
          :columns="columns"
          row-key="_id"
          virtual-scroll
          :rows-per-page-options="[0]"
          dense
          flat
          bordered
          binary-state-sort
          ref="summitsTable"
        >
        </q-table>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useDataStore } from 'src/stores/dataStore'

const summitsTable = ref(null)
const dataStore = useDataStore()

const columns = [
  { name: 'name', label: 'Gipfel', field: row => row.name, align: 'left', sortable: true },
  { name: 'region', label: 'Gebiet', field: row => row.region?.name, align: 'left', sortable: true },
  { name: 'routeCountDisplay', label: 'Wege', field: 'routeCountDisplay', align: 'left', sortable: true , sort: (a, b,rowA,rowB) => rowA.routeCount - rowB.routeCount},
  { name: 'ascentCount', label: 'Begehungen', field: 'ascentCount', align: 'left', sortable: true },
]

// Precompute summitId -> total route count for all summits
const summitRouteCounts = dataStore.summitRouteCounts

const summits = computed(() => {
  // Build a map of summitId -> { ...summit, routeIds: Set, ascentCount }
  const summitMap = new Map()
  dataStore.filteredAscents.forEach(ascent => {
    const summit = ascent.route.summit
    if (!summitMap.has(summit._id)) {
      summitMap.set(summit._id, {
        ...summit,
        routeIds: new Set(),
        ascentCount: 0
      })
    }
    const entry = summitMap.get(summit._id)
    entry.routeIds.add(ascent.route._id)
    entry.ascentCount++
  })

  // Build the final array
  return Array.from(summitMap.values()).map(summit => {
    const totalRoutes = summitRouteCounts.get(summit._id) || 0
    const routeCount = summit.routeIds.size
    const routePercentage = totalRoutes > 0 ? (routeCount / totalRoutes) * 100 : 0
    return {
      ...summit,
      routeCount,
      routeCountDisplay: `${routeCount} (${routePercentage.toFixed(1)}%)`,
      ascentCount: summit.ascentCount
    }
  })
})

onMounted(() => {
  summitsTable.value.sort('ascentCount')
  summitsTable.value.sort('ascentCount')
})
</script>

<style scoped>
</style> 