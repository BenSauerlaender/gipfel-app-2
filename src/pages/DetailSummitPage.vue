<template>
  <div class="q-pa-md page-container">
    <q-card v-if="summit">
      <q-card-section>
        <div class="row justify-between">
          <div class="row items-center">
            <q-btn round color="primary" icon="arrow_back" @click="router.back()" />
            <div class="text-h5 q-ml-md">
              {{ summit.name }}
              <span class="text-grey-6"
                >(<router-link
                  style="text-decoration: none; color: inherit"
                  :to="`/regions/${summit.regionID}`"
                  >{{ summit.regionName }}</router-link
                >)</span
              >
            </div>
          </div>
          <q-btn flat round color="primary" icon="map" @click="router.push('/map/' + summit._id)">
            <q-tooltip> Auf Karte ansehen </q-tooltip>
          </q-btn>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="row justify-center">
          <div class="col-12 col-sm-3 text-center">
            <span class="text-h4 text-weight-bold text-blue-7">{{ routes.length }}</span> Wege
          </div>
          <div class="col-12 col-sm-3 text-center">
            <span class="text-h4 text-weight-bold text-blue-7">{{ routePercentage }}%</span>
            begangen
          </div>
          <div class="col-12 col-sm-3 text-center">
            <span class="text-h4 text-weight-bold text-blue-7">{{ ascentCount }}</span> Begehungen
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-tabs v-model="tab" class="text-blue-7 q-mt-md" inline-label align="justify">
          <q-tab name="routes" icon="book" label="Wege" />
          <q-tab name="ascents" icon="table_chart" label="Begehungen" />
        </q-tabs>
        <q-separator />
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="routes">
            <RouteTable
              :routes="routes"
              :columns="['name', 'grade', 'stars', 'unsecure', 'ascents']"
              :defaultSort="['name', 'asc']"
            />
          </q-tab-panel>
          <q-tab-panel name="ascents">
            <AscentTable
              :ascents="ascents"
              :columns="[
                'date',
                'route',
                'grade',
                'stars',
                'unsecure',
                'ascentType',
                'climbers',
                'isAborted',
                'notes',
              ]"
            />
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import AscentTable from 'src/components/tables/AscentTable.vue'
import RouteTable from 'src/components/tables/RouteTable.vue'
import { useDataStore } from 'src/stores/dataStore'
import { computed, ref, onMounted } from 'vue'
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router'

const router = useRouter()

const dataStore = useDataStore()

const summit = computed(() =>
  dataStore.summits.find((summit) => summit._id === useRoute().params.id),
)
const routes = computed(() => dataStore.routes[useRoute().params.id])
const ascentCount = computed(() => dataStore.f_AscentsPerSummit[summit.value._id] ?? 0)
const routeWithAscentsCount = computed(
  () => routes.value.filter((route) => dataStore.f_AscentsPerRoute[route._id] > 0).length,
)
const routePercentage = computed(() =>
  summit.value.routeCount == 0
    ? 0.0
    : ((routeWithAscentsCount.value / summit.value.routeCount) * 100).toFixed(1),
)

const tab = ref('routes')

const ascents = computed(() =>
  dataStore.f_Ascents.filter((ascent) => ascent.route.summitID === summit.value._id),
)

onMounted(() => {
  if (!summit.value) {
    router.push({ name: '404' })
  }
})

onBeforeRouteLeave((to, from) => {
  // Prüfe die History-Länge
  if (window.history.length > 1) {
    // Es gibt eine vorherige Seite
    const previousRoute = router.options.history.state?.current
    const newRoute = '/map/' + summit.value._id

    if (to.fullPath == newRoute) return true

    if (previousRoute.startsWith('/map') && to.fullPath.startsWith('/map')) {
      return newRoute
    }
  }
})
</script>

<style scoped>
.page-container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
