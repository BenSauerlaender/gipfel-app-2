<template>
  <div class="q-pa-md page-container">
    <q-card v-if="summit">
      <q-card-section>
        <div class="row items-center">
          <q-btn round color="primary" icon="arrow_back" @click="router.back()" />
          <div class="text-h5 q-ml-md">{{ summit.name }} <span class="text-grey-6">({{ summit.region.name }})</span></div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="row justify-center">
          <div class="col-12 col-sm-3 text-center">
            <span class="text-h4 text-weight-bold text-blue-7">{{ routes.length }}</span> Wege
          </div>
          <div class="col-12 col-sm-3 text-center">
            <span class="text-h4 text-weight-bold text-blue-7">{{ routePercentage }}%</span> begangen
          </div>
          <div class="col-12 col-sm-3 text-center">
            <span class="text-h4 text-weight-bold text-blue-7">{{ ascentCount }}</span> Begehungen
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <RouteTable :routes="routes" :columns="['name', 'grade', 'stars', 'ascents']" :defaultSort="['name', 'asc']" />
      </q-card-section>
    </q-card>
  </div>
</template>
  
<script setup>
import RouteTable from 'src/components/tables/RouteTable.vue'
import { useDataStore } from 'src/stores/dataStore'
import { computed, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const dataStore = useDataStore()

const summit = computed(() => dataStore.summits.find(summit => summit._id === route.params.id))
const routes = computed(() => dataStore.routes.filter(route => route.summit._id === summit.value._id))
const ascentCount = computed(() => dataStore.f_AscentsPerSummit[summit.value._id] ?? 0)
const routeWithAscentsCount = computed(() => summit.value.routeIDs.filter(routeID => dataStore.f_AscentsPerRoute[routeID] > 0).length)
const routePercentage = computed(() => summit.value.routeIDs.length == 0 ? 0.0 : (routeWithAscentsCount.value / summit.value.routeIDs.length * 100).toFixed(1))



onMounted(() => {
  if (!summit.value) {
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