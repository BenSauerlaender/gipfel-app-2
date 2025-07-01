<template>
  <div class="q-pa-md page-container">
    <q-card v-if="region">
      <q-card-section>
        <div class="row items-center">
          <q-btn round color="primary" icon="arrow_back" @click="router.back()" />
          <div class="text-h5 q-ml-md">{{ region.name }}</div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="row justify-center">
          <div class="col-12 col-sm-3 text-center">
            <span class="text-h4 text-weight-bold text-blue-7">{{ region.summitIDs.length }}</span> Gipfel
          </div>
          <div class="col-12 col-sm-3 text-center">
            <span class="text-h4 text-weight-bold text-blue-7">{{ summitPercentage }}%</span> begangen
          </div>
          <div class="col-12 col-sm-3 text-center">
            <span class="text-h4 text-weight-bold text-blue-7">{{ ascentCount }}</span> Begehungen
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <SummitTable :summits="summits" :columns="['name', 'routes', 'ascents']" :defaultSort="['name', 'asc']" />
      </q-card-section>
    </q-card>
  </div>
</template>
  
<script setup>
import SummitTable from 'src/components/tables/SummitTable.vue'
import { useDataStore } from 'src/stores/dataStore'
import { computed, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()

const dataStore = useDataStore()

const region = computed(() => dataStore.regions.find(region => region._id === useRoute().params.id))

const summits = dataStore.summits.filter(summit => summit.region._id === region.value._id)
const ascentCount = computed(() => dataStore.f_AscentsPerRegion[region.value._id] ?? 0)
const summitWithAscentsCount = computed(() => region.value.summitIDs.filter(summitID => dataStore.f_AscentsPerSummit[summitID] > 0).length)
const summitPercentage = computed(() => region.value.summitIDs.length == 0 ? 0.0 : (summitWithAscentsCount.value / region.value.summitIDs.length * 100).toFixed(1))



onMounted(() => {
  if (!region.value) {
    router.push({ name: '404' })
  }
})

</script>

<style scoped>
.page-container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>