<template>
  <q-table
    :rows="routes"
    :columns="columns"
    row-key="_id"
    virtual-scroll
    :rows-per-page-options="[0]"
    binary-state-sort
    flat
    :filter="filter"
    ref="routesTable"
  >
    <template v-slot:top-right>
      <q-input borderless dense debounce="300" v-model="filter" placeholder="Suchen">
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
        <router-link
          style="text-decoration: none; color: inherit"
          :to="`/summits/${props.row.summitID}`"
          >{{ dense ? truncate(props.value, 10) : props.value }}
          <span v-if="dense && hasRegionColumn" class="text-grey-6"
            >({{ props.row.regionAbbr }})</span
          >
        </router-link>
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
        <router-link style="text-decoration: none; color: inherit" :to="`/routes/${props.row._id}`"
          >{{ dense ? truncate(props.value, 15) : props.value }}
        </router-link>
      </q-td>
    </template>

    <template v-slot:body-cell-grade="props">
      <q-td :props="props">
        <RouteGradeChip v-memo="[props.value]" :grade="props.value" />
      </q-td>
    </template>
    <template v-slot:body-cell-combinedGrade="props">
      <q-td :props="props">
        <RouteGradeChip :grade="props.value" dense />
        <RouteStarsChip v-if="props.row.stars > 0" :stars="props.row.stars" dense></RouteStarsChip>
        <RouteUnsecureChip v-if="props.row.unsecure" dense></RouteUnsecureChip>
      </q-td>
    </template>
    <template v-slot:body-cell-stars="props">
      <q-td :props="props">
        <RouteStarsChip
          v-memo="[props.value]"
          v-if="props.value > 0"
          :stars="props.value"
        ></RouteStarsChip>
        <span v-else>-</span>
      </q-td>
    </template>
    <template v-slot:body-cell-unsecure="props">
      <q-td :props="props">
        <RouteUnsecureChip v-if="props.value"></RouteUnsecureChip>
        <span v-else>-</span>
      </q-td>
    </template>
    <template v-slot:body-cell-ttScore="props">
      <q-td :props="props">
        <RouteTTScoreChip
          v-if="props.value"
          :score="props.value"
          :ttrouteid="props.row.teufelsturmId"
        />
        <span v-else>-</span>
      </q-td>
    </template>
  </q-table>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useDataStore } from 'src/stores/dataStore'
import { getRouteGrade, sortGradeInTable } from 'src/helper/route'
import RouteGradeChip from 'src/components/Chips/RouteGradeChip.vue'
import RouteStarsChip from 'src/components/Chips/RouteStarsChip.vue'
import RouteUnsecureChip from 'src/components/Chips/RouteUnsecureChip.vue'
import RouteTTScoreChip from '../Chips/RouteTTScoreChip.vue'
import { useQuasar } from 'quasar'
import { useStringUtils } from 'src/composables/stringUtils'
const { truncate } = useStringUtils()
const $q = useQuasar()

const props = defineProps({
  routes: {
    type: Array,
    required: true,
  },
  columns: {
    type: Array,
    default: () => ['name', 'summit', 'region', 'grade', 'stars', 'unsecure', 'ascents', 'ttScore'],
  },
  defaultSort: {
    type: Array,
    default: () => ['ascents', 'desc'],
  },
})

const routesTable = ref(null)
const dataStore = useDataStore()
const filter = ref('')
const dense = computed(() => {
  return $q.screen.lt.sm
})

const hasRegionColumn = props.columns.includes('region')

const columns = computed(() =>
  [
    { name: 'name', label: 'Weg', field: 'name', align: 'left', sortable: true },
    {
      name: 'summit',
      label: 'Gipfel',
      field: (row) => row.summitName,
      align: 'left',
      sortable: true,
    },
    {
      name: 'region',
      label: 'Gebiet',
      field: (row) => row.regionName,
      align: 'left',
      sortable: true,
    },
    {
      name: 'combinedGrade',
      label: 'Grad',
      field: (row) => getRouteGrade(row) ?? '-',
      align: 'left',
      sortable: true,
      sort: sortGradeInTable,
    },
    {
      name: 'grade',
      label: 'Grad',
      field: (row) => getRouteGrade(row) ?? '-',
      align: 'center',
      sortable: true,
      sort: sortGradeInTable,
    },
    { name: 'stars', label: 'Sterne', field: (row) => row.stars, align: 'center', sortable: true },
    { name: 'unsecure', label: '!', field: (row) => row.unsecure, align: 'left', sortable: true },
    {
      name: 'ascents',
      label: dense.value ? 'Eintr.' : 'Einträge',
      field: 'ascents',
      align: 'left',
      sortable: true,
    },
    {
      name: 'ttScore',
      label: dense.value ? 'TT' : 'TT Bewertung',
      field: 'teufelsturmScore',
      align: 'left',
      sortable: true,
    },
  ]
    .filter(
      (column) =>
        props.columns.includes(column.name) || (dense.value && column.name === 'combinedGrade'),
    )
    .filter((column) => {
      if (dense.value) {
        if (['grade', 'stars', 'unsecure', 'region'].includes(column.name)) {
          return false
        }
      }
      return true
    }),
)

const routes = computed(() => {
  const routes = props.routes.map((route) => {
    return {
      ...route,
      ascents: dataStore.f_AscentsPerRoute[route._id] ?? '-',
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

<style scoped></style>
