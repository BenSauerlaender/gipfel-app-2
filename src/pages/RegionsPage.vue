<template>
  <div class="q-pa-md page-container">
    <q-card>
      <q-card-section>
        <div class="text-h2 text-weight-regular">Gebiete</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
            <q-table
              ref="regionsTable"
              :rows="regions"
              :columns="columns"
              row-key="_id"
              virtual-scroll
              flat
              :filter="filter"
              binary-state-sort
              :rows-per-page-options="[0]"
            >
              <template v-slot:top-right>
                <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </template>
              <template v-slot:header-cell-summits="props">
                  <q-th :props="props">
                    {{ props.col.label }} <span class="text-grey-6">(% begangen)</span>
                  </q-th>
              </template>
              <template v-slot:body-cell-summits="props">
                <q-td :props="props">
                  {{ props.value }} <span class="text-grey-6">({{ props.row.summitPercentage }}%)</span>
                </q-td>
              </template>
              <template v-slot:body-cell-name="props">
                <q-td :props="props">
                  <router-link style="text-decoration: none; color: inherit;" :to="`/regions/${props.row._id}`">{{ props.value }}</router-link>
                </q-td>
              </template>
            </q-table>
      </q-card-section>
    </q-card>
  </div>
</template>
  
<script setup>
import { useDataStore } from 'src/stores/dataStore'
import { computed, ref, onMounted } from 'vue'

const dataStore = useDataStore()
const regionsTable = ref(null)
const filter = ref('')

const columns = [
  { name: 'name', label: 'Gebiet', field: 'name', align: 'left', sortable: true },
  { name: 'summits', label: 'Gipfel', field: 'summits', align: 'left', sortable: true },
  { name: 'ascents', label: 'Begehungen', field: row => row.ascents > 0 ? row.ascents : '-', align: 'left', sortable: true },
]

const regions = computed(() => dataStore.regions.map(region => {
  const summits = dataStore.summits.filter(summit => summit.region._id === region._id)
  const summitsWithAscents = summits.filter(summit => dataStore.f_Ascents.some(ascent => ascent.route.summit._id === summit._id)).length
  const summitPercentage = summitsWithAscents == 0 ? 0.0 : (summitsWithAscents / summits.length * 100).toFixed(1)

  return ({
  ...region,
  summits: summits.length,
  ascents: dataStore.f_Ascents.filter(ascent => ascent.route.summit.region._id === region._id).length,
  summitPercentage: summitPercentage
})}))

onMounted(() => {
  regionsTable.value.sort('ascents')
  regionsTable.value.sort('ascents')
})
</script>

<style scoped>
.page-container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>