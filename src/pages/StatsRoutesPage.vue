<template>
  <div class="q-pa-md page-container">
    <q-card>
      <q-card-section>
        <div class="row items-center">
          <q-btn round color="primary" icon="arrow_back" @click="router.back()" />
          <div class="text-h5 q-ml-md">Begangene Wege</div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <RouteTable
          :routes="routes"
          :columns="[
            'name',
            'summit',
            'region',
            'grade',
            'stars',
            'ascents',
            'ttScore',
            'unsecure',
          ]"
          :defaultSort="['ascents', 'desc']"
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import RouteTable from 'src/components/tables/RouteTable.vue'
import { computed, ref } from 'vue'
import { useDataStore } from 'src/stores/dataStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const routesTable = ref(null)
const dataStore = useDataStore()

const routes = computed(() => {
  const routeMap = {}
  dataStore.f_Ascents.forEach((ascent) => {
    if (!routeMap[ascent.route._id]) {
      routeMap[ascent.route._id] = ascent.route
    }
  })
  return Object.values(routeMap)
})
</script>

<style scoped>
.page-container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
