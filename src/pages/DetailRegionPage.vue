<template>
  <div class="q-pa-md page-container">
    <div class="row items-center action-buttons">
      <q-btn
        size="sm"
        rounded
        padding="xs md"
        color="darkgreen"
        outline
        icon="arrow_back"
        @click="router.back()"
      />
    </div>
    <q-card v-if="region" class="bg-offwhite3">
      <q-card-section class="row justify-between items-center bg-offwhite3">
        <span class="text-h2 text-darkgreen text-weight-bold q-ml-md">{{ region.name }}</span>
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
      <q-tabs v-model="tab" class="text-blue-7 q-mt-md" inline-label align="justify">
        <q-tab name="summits" icon="book" label="Gipfel" />
        <q-tab name="ascents" icon="table_chart" label="Einträge" />
      </q-tabs>
      <q-separator />
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="summits">
          <SummitTable
            :summits="summits"
            :columns="['name', 'routes', 'ascents']"
            :defaultSort="['name', 'asc']"
          />
        </q-tab-panel>
        <q-tab-panel name="ascents">
          <AscentTable
            :ascents="ascents"
            :columns="[
              'date',
              'route',
              'summit',
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
    </q-card>
  </div>
</template>

<script setup>
import AscentTable from 'src/components/tables/AscentTable.vue'
import SummitTable from 'src/components/tables/SummitTable.vue'
import { useDataStore } from 'src/stores/dataStore'
import { computed, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()

const dataStore = useDataStore()

const tab = ref('summits')

const region = computed(() =>
  dataStore.regions.find((region) => region._id === useRoute().params.id),
)

const ascents = computed(() =>
  dataStore.f_Ascents.filter((ascent) => ascent.route.regionID === region.value._id),
)

const summits = dataStore.summits.filter((summit) => summit.regionID === region.value._id)
const ascentCount = computed(() => dataStore.f_AscentsPerRegion[region.value._id] ?? 0)
const summitWithAscentsCount = computed(
  () =>
    dataStore.summits
      .filter((summit) => summit.regionID === region.value._id)
      .filter((summitID) => dataStore.f_AscentsPerSummit[summitID] > 0).length,
)
const summitPercentage = computed(() =>
  region.value.summitCount == 0
    ? 0.0
    : ((summitWithAscentsCount.value / region.value.summitCount) * 100).toFixed(1),
)

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
