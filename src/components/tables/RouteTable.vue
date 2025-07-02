<template>
  <q-table
    :rows="routes"
    :columns="columns"
    row-key="_id"
    style="height: 800px"
    virtual-scroll
    :rows-per-page-options="[0]"
    binary-state-sort
    flat
    :filter="filter"
    ref="routesTable"
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

      <template v-slot:body-cell-summit="props">
      <q-td :props="props">
          <router-link style="text-decoration: none; color: inherit;" :to="`/summits/${props.row.summit._id}`">{{ props.value }}</router-link>
      </q-td>
      </template>
      <template v-slot:body-cell-region="props">
      <q-td :props="props">
          <router-link style="text-decoration: none; color: inherit;" :to="`/regions/${props.row.summit.region._id}`">{{ props.value }}</router-link>
      </q-td>
      </template>
      <template v-slot:body-cell-name="props">
      <q-td :props="props">
          <router-link style="text-decoration: none; color: inherit;" :to="`/routes/${props.row._id}`">{{ props.value }}</router-link>
      </q-td>
      </template>

      <template v-slot:body-cell-grade="props">
        <q-td :props="props">
            <RouteGradeChip :grade="props.value" />
        </q-td>
      </template>
      <template v-slot:body-cell-stars="props">
        <q-td :props="props">
          <RouteStarsChip :stars="props.value">-</RouteStarsChip>
        </q-td>
      </template>
      <template v-slot:body-cell-unsecure="props">
        <q-td :props="props">
          <RouteUnsecureChip :unsecure="props.value">-</RouteUnsecureChip>
        </q-td>
      </template>
  </q-table>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useDataStore } from 'src/stores/dataStore'
import { getRouteGrade, sortGradeInTable } from 'src/helper/route'
import RouteGradeChip from 'src/components/RouteGradeChip.vue'
import RouteStarsChip from 'src/components/RouteStarsChip.vue'
import RouteUnsecureChip from 'src/components/RouteUnsecureChip.vue'

const props = defineProps({
  routes: {
    type: Array,
    required: true
  },
  columns: {
    type: Array,
    default: () => ['name','summit', 'region', 'grade', 'stars', 'unsecure', 'ascents']
  },
  defaultSort: {
    type: Array,
    default: () => ['ascents', 'desc']
  }
})

const routesTable = ref(null)
const dataStore = useDataStore()
const filter = ref('')

const columns = [
  { name: 'name', label: 'Weg', field: 'name', align: 'left', sortable: true },
  { name: 'summit', label: 'Gipfel', field: row => row.summit?.name, align: 'left', sortable: true },
  { name: 'region', label: 'Gebiet', field: row => row.summit?.region?.name, align: 'left', sortable: true },
  { name: 'grade', label: 'Grad', field: row => getRouteGrade(row) ?? '-', align: 'center', sortable: true , sort: sortGradeInTable},
  { name: 'stars', label: 'Sterne', field: row => row.stars, align: 'center', sortable: true },
  { name: 'unsecure', label: '!', field: row => row.unsecure, align: 'left', sortable: true },
  { name: 'ascents', label: 'Begehungen', field: 'ascents', align: 'left', sortable: true },
].filter(column => props.columns.includes(column.name))

const routes = computed(() => {
  const routes = props.routes.map(route => {
    return {
      ...route,
      ascents: dataStore.f_AscentsPerRoute[route._id] ?? '-'
    }
  })
  return routes
})

onMounted(() => {
  routesTable.value.sort(props.defaultSort[0])
  if (props.defaultSort[1] == 'desc') {
    routesTable.value.sort(props.defaultSort[0])
  }
})
</script>

<style scoped>
.page-container {
  max-width: 1200px;
  margin: 0 auto;
}
</style> 