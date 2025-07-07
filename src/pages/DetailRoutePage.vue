<template>
  <div class="q-pa-md page-container">
    <q-card v-if="route">
      <q-card-section>
        <div class="row justify-between items-center">
          <div class="row items-center">
            <q-btn round color="primary" icon="arrow_back" @click="router.back()" />
            <div class="text-h5 q-ml-md">
              {{ route.name }} , {{ route.summitName }}
              <span class="text-grey-6">({{ route.regionName }})</span>
            </div>
          </div>
          <RouteTTScoreChip
            v-if="route.teufelsturmScore"
            :score="route.teufelsturmScore"
            :ttrouteid="route.teufelsturmId"
            dense="false"
          />
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="row justify-center items-center">
          <div class="col-12 col-sm-5 text-center">
            <div class="row justify-center">
              <RouteGradeChip v-memo="[getRouteGrade(route)]" :grade="getRouteGrade(route)" />
              <RouteStarsChip v-memo="[route.stars]" v-if="route.stars > 0" :stars="route.stars" />
              <RouteUnsecureChip v-if="route.unsecure"></RouteUnsecureChip>
            </div>
          </div>
          <div class="col-12 col-sm-5 text-center">
            <span class="text-h4 text-weight-bold text-blue-7">{{ ascents.length }}</span>
            Begehungen
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <AscentTable
          :ascents="ascents"
          :columns="['date', 'climbers', 'ascentType', 'leadClimber', 'isAborted', 'notes']"
          :defaultSort="['date', 'asc']"
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import AscentTable from 'src/components/tables/AscentTable.vue'
import RouteGradeChip from 'src/components/Chips/RouteGradeChip.vue'
import RouteStarsChip from 'src/components/Chips/RouteStarsChip.vue'
import RouteUnsecureChip from 'src/components/Chips/RouteUnsecureChip.vue'
import { useDataStore } from 'src/stores/dataStore'
import { computed, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getRouteGrade } from 'src/helper/route'
import RouteTTScoreChip from 'src/components/Chips/RouteTTScoreChip.vue'

const router = useRouter()

const dataStore = useDataStore()

const route = computed(() => {
  let foundRoute = undefined
  for (const region of Object.values(dataStore.routes)) {
    foundRoute = region.find((route) => route._id === useRoute().params.id)
    if (foundRoute) break
  }
  return foundRoute
})

const ascents = computed(() =>
  dataStore.f_Ascents.filter((ascent) => ascent.route._id === route.value._id),
)

onMounted(() => {
  if (!route.value) {
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
