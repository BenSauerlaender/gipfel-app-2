<template>
  <div class="q-pa-md page-container">
    <q-card>
      <q-card-section>
        <div class="text-h2 text-weight-regular">Gipfel</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="row justify-center">
          <div class="col-12 col-sm-3 text-center">
            <span class="text-h4 text-weight-bold text-blue-7">{{ summits.length }}</span> Gipfel
          </div>
          <div class="col-12 col-sm-3 text-center">
            <span class="text-h4 text-weight-bold text-blue-7">{{ summitPercentage }}%</span>
            begangen
          </div>
          <div class="col-12 col-sm-3 text-center">
            <span class="text-h4 text-weight-bold text-blue-7">{{ ascentCount }}</span> Begehungen
          </div>
        </div>
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

<style scoped>
.page-container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
