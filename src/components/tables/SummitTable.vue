<template>
  <q-table
    :rows="summits"
    :columns="columns"
    row-key="_id"
    style="height: 800px"
    virtual-scroll
    :rows-per-page-options="[0]"
    binary-state-sort
    flat
    :filter="filter"
    ref="summitsTable"
  >
    <template v-slot:top-right>
      <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>
    <template v-slot:header-cell-routes="props">
      <q-th :props="props">
        {{ props.col.label }} <span class="text-grey-6">(% begangen)</span>
      </q-th>
    </template>

    <template v-slot:body-cell-routes="props">
      <q-td :props="props">
        {{ props.value }} <span class="text-grey-6">({{ props.row.routePercentage }}%)</span>
      </q-td>
    </template>

    <template v-slot:body-cell-region="props">
      <q-td :props="props">
        <router-link
          style="text-decoration: none; color: inherit"
          :to="`/regions/${props.row.regionID}`"
          >{{ props.value }}</router-link
        >
      </q-td>
    </template>
    <template v-slot:body-cell-name="props">
      <q-td :props="props">
        <router-link
          style="text-decoration: none; color: inherit"
          :to="`/summits/${props.row._id}`"
          >{{ props.value }}</router-link
        >
      </q-td>
    </template>
  </q-table>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useDataStore } from 'src/stores/dataStore'

const props = defineProps({
  summits: {
    type: Array,
    required: true,
  },
  columns: {
    type: Array,
    default: () => ['name', 'region', 'routes', 'ascents'],
  },
  defaultSort: {
    type: Array,
    default: () => ['ascents', 'desc'],
  },
})

const summitsTable = ref(null)
const dataStore = useDataStore()
const filter = ref('')

const columns = [
  { name: 'name', label: 'Gipfel', field: (row) => row.name, align: 'left', sortable: true },
  {
    name: 'region',
    label: 'Gebiet',
    field: (row) => row.regionName,
    align: 'left',
    sortable: true,
  },
  {
    name: 'routes',
    label: 'Wege',
    field: (row) => row.routeCount,
    align: 'left',
    sortable: true,
  },
  { name: 'ascents', label: 'Einträge', field: 'ascents', align: 'left', sortable: true },
].filter((column) => props.columns.includes(column.name))

const summits = computed(() => {
  const summits = props.summits.map((summit) => {
    const routesWithAscents = dataStore.routes[summit._id].filter(
      (route) => dataStore.f_AscentsPerRoute[route._id] > 0,
    ).length
    const routeCount = summit.routeCount
    const routePercentage =
      routeCount == 0 ? 0.0 : ((routesWithAscents / routeCount) * 100).toFixed(1)
    return {
      ...summit,
      routePercentage,
      ascents: dataStore.f_AscentsPerSummit[summit._id] ?? '-',
    }
  })
  return summits
})

onMounted(() => {
  summitsTable.value.sort(props.defaultSort[0])
  if (props.defaultSort[1] == 'desc') {
    summitsTable.value.sort(props.defaultSort[0])
  }
})
</script>

<style scoped>
.page-container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
