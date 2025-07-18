<template>
  <div
    class="q-pa-<script setup> import RouteTable from 'src/components/tables/RouteTable.vue' import BasePageCard from 'src/components/BasePageCard.vue' import { computed } from 'vue'page-container"
  >
    <BasePageCard>
      <q-card-section>
        <div class="row items-center">
          <q-btn round color="primary" icon="arrow_back" @click="router.back()" />
          <div class="text-h5 q-ml-md">Begangene Wege</div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section class="bg-offwhite1">
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
    </BasePageCard>
  </div>
</template>

<script setup>
import RouteTable from 'src/components/tables/RouteTable.vue'
import { computed } from 'vue'
import { useDataStore } from 'src/stores/dataStore'
import { useRouter } from 'vue-router'

const router = useRouter()
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

<style scoped></style>
