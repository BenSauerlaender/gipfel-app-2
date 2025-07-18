<template>
  <div class="q-pa-md page-container">
    <div class="row justify-between items-center action-buttons">
      <q-btn size="sm" rounded color="darkgreen" outline icon="arrow_back" @click="router.back()" />
    </div>
    <BasePageCard :title="route.name" :stats="[ascents.length]" :stat-labels="['Einträge']">
      <template #subtitle>
        <router-link
          style="text-decoration: none; color: inherit"
          :to="`/summits/${route.summitID}`"
          >{{ route.summitName }}</router-link
        >
      </template>
      <template #titleChips>
        <RouteGradeChip
          v-memo="[getRouteGrade(route)]"
          :grade="getRouteGrade(route)"
          dense="false"
        />
        <RouteStarsChip
          v-memo="[route.stars]"
          v-if="route.stars > 0"
          :stars="route.stars"
          dense="false"
        />
        <RouteUnsecureChip v-if="route.unsecure" dense="false" />
        <RouteTTScoreChip
          v-if="route.teufelsturmScore"
          :score="route.teufelsturmScore"
          :ttrouteid="route.teufelsturmId"
          dense="false"
        />
      </template>

      <q-card-section class="bg-offwhite1">
        <AscentTable
          :ascents="ascents"
          :columns="['date', 'climbers', 'ascentType', 'leadClimber', 'isAborted', 'notes']"
          :defaultSort="['date', 'asc']"
        />
      </q-card-section>
    </BasePageCard>
  </div>
</template>

<script setup>
import AscentTable from 'src/components/tables/AscentTable.vue'
import RouteGradeChip from 'src/components/Chips/RouteGradeChip.vue'
import RouteStarsChip from 'src/components/Chips/RouteStarsChip.vue'
import RouteUnsecureChip from 'src/components/Chips/RouteUnsecureChip.vue'
import RouteTTScoreChip from 'src/components/Chips/RouteTTScoreChip.vue'
import BasePageCard from 'src/components/BasePageCard.vue'
import { useDataStore } from 'src/stores/dataStore'
import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getRouteGrade } from 'src/helper/route'

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

<style scoped></style>
