<template>
  <div class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h5">Begangene Wege</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-table
          :rows="filteredRoutes"
          :columns="columns"
          row-key="_id"
          virtual-scroll
          :rows-per-page-options="[0]"
          dense
          flat
          bordered
          binary-state-sort
          ref="routesTable"
        >
          <template v-slot:body-cell-grade="props">
            <q-td :props="props">
              <q-chip :style="{backgroundColor: getGradeColor(props.value), color: 'white'}" dense>{{ props.value }}</q-chip>
            </q-td>
          </template>
          <template v-slot:body-cell-stars="props">
            <q-td :props="props">
              <q-chip v-if="props.value === 1" color="yellow" dense><q-icon name="star" /></q-chip>
              <q-chip v-else-if="props.value === 2" color="yellow" dense><q-icon name="star" /><q-icon name="star" /></q-chip>
              <span v-else>-</span>
            </q-td>
          </template>
          <template v-slot:body-cell-unsecure="props">
            <q-td :props="props">
              <q-chip v-if="props.value" color="red" dense>!</q-chip>
              <span v-else>-</span>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useDataStore } from 'src/stores/dataStore'
import { getGradeColor } from 'src/helper/route'
import { SCALA } from 'src/helper/route'

const routesTable = ref(null)
const dataStore = useDataStore()

const sortGrade = (a, b, rowA, rowB) => {
  const gradeA = SCALA.indexOf(rowA.difficulty.normal)
  const gradeB = SCALA.indexOf(rowB.difficulty.normal)
  return gradeA - gradeB
}

const columns = [
  { name: 'name', label: 'Weg', field: 'name', align: 'left', sortable: true },
  { name: 'summit', label: 'Gipfel', field: row => row.summit?.name, align: 'left', sortable: true },
  { name: 'region', label: 'Gebiet', field: row => row.summit?.region?.name, align: 'left', sortable: true },
  { name: 'ascentCount', label: 'Begehungen', field: 'ascentCount', align: 'left', sortable: true },
  { name: 'grade', label: 'Grad', field: row => row.difficulty.normal, align: 'left', sortable: true , sort: sortGrade},
  { name: 'stars', label: 'Sterne', field: row => row.stars, align: 'center', sortable: true },
  { name: 'unsecure', label: 'Unsicher', field: row => row.unsecure, align: 'center', sortable: true },
]

const filteredRoutes = computed(() => {
  // Get all filtered ascents, then unique routes
  const ascents = dataStore.filteredAscents
  const routeMap = {}
  ascents.forEach(ascent => {
    if (!routeMap[ascent.route._id]) {
      routeMap[ascent.route._id] = {
        ...ascent.route,
        ascentCount: 0
      }
    }
    routeMap[ascent.route._id].ascentCount++
  })
  return Object.values(routeMap)
})
onMounted(() => {
  routesTable.value.sort('ascentCount')
  routesTable.value.sort('ascentCount')
})
</script>

<style scoped>
</style> 