<template>
  <div class="q-pa-md page-container">
    <BasePageCard title="Gebiete">
      <q-card-section class="bg-offwhite1">
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
              <router-link
                style="text-decoration: none; color: inherit"
                :to="`/regions/${props.row._id}`"
                >{{ props.value }}</router-link
              >
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </BasePageCard>
  </div>
</template>

<script setup>
import BasePageCard from 'src/components/BasePageCard.vue'
import { useDataStore } from 'src/stores/dataStore'
import { computed, ref, onMounted } from 'vue'

const dataStore = useDataStore()
const regionsTable = ref(null)
const filter = ref('')

const columns = [
  { name: 'name', label: 'Gebiet', field: 'name', align: 'left', sortable: true },
  { name: 'summits', label: 'Gipfel', field: 'summits', align: 'left', sortable: true },
  {
    name: 'ascents',
    label: 'Einträge',
    field: (row) => (row.ascents > 0 ? row.ascents : '-'),
    align: 'left',
    sortable: true,
  },
]

const regions = computed(() =>
  dataStore.regions.map((region) => {
    const summitIDs = dataStore.summits
      .filter((summit) => summit.regionID === region._id)
      .map((summit) => summit._id)
    const summitsWithAscents = summitIDs.filter(
      (summitID) => dataStore.f_AscentsPerSummit[summitID] > 0,
    ).length
    const summitCount = region.summitCount
    const summitPercentage =
      summitCount == 0 ? 0.0 : ((summitsWithAscents / summitCount) * 100).toFixed(1)

    return {
      ...region,
      summits: summitCount,
      ascents: dataStore.f_AscentsPerRegion[region._id] ?? '-',
      summitPercentage: summitPercentage,
    }
  }),
)

onMounted(() => {
  regionsTable.value.sort('ascents')
  regionsTable.value.sort('ascents')
})
</script>

<style lang="scss" scoped></style>
