<template>
  <div class="q-pa-md page-container">
    <q-card>
      <q-card-section class="row justify-between items-center bg-offwhite3">
        <span class="text-h2 text-darkgreen text-weight-bold q-ml-md">Gipfel</span>
        <span class="row justify-center items-center bg-offwhite3">
          <span class="q-ma-md column text-center">
            <span class="text-h4 text-weight-bolder text-red">{{ summits.length }}</span>
            <span class="text-lightgreen">Gipfel</span>
          </span>
          <span class="q-ma-md column text-center">
            <span class="text-h4 text-weight-bolder text-red">{{ summitPercentage }}%</span>
            <span class="text-lightgreen">Begangen</span>
          </span>
          <span class="q-ma-md column text-center">
            <span class="text-h4 text-weight-bolder text-red">{{ ascentCount }}</span>
            <span class="text-lightgreen">Einträge</span>
          </span>
        </span>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <SummitTable :summits="summits" :defaultSort="['name', 'asc']" />
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import SummitTable from 'src/components/tables/SummitTable.vue'
import { useDataStore } from 'src/stores/dataStore'
import { computed } from 'vue'

const dataStore = useDataStore()

const summits = dataStore.summits
const ascentCount = computed(() => dataStore.f_Ascents.length)
const summitWithAscentsCount = computed(() => {
  const count = summits.filter((summit) =>
    dataStore.f_Ascents.some((ascent) => ascent.route.summitID === summit._id),
  ).length
  return count
})
const summitPercentage = computed(() =>
  summits.length == 0 ? 0.0 : ((summitWithAscentsCount.value / summits.length) * 100).toFixed(1),
)
</script>

<style lang="scss" scoped>
.page-container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
