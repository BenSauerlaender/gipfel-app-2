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
    <BasePageCard
      :title="region.name"
      :stats="[summits.length, summitPercentage + '%', ascentCount]"
      :stat-labels="['Gipfel', 'Begangen', 'Einträge']"
    >
      <q-tabs v-model="activeTab" class="text-blue-7" inline-label align="justify">
        <q-tab name="summits" icon="book" label="Gipfel" />
        <q-tab name="ascents" icon="table_chart" label="Einträge" />
      </q-tabs>

      <q-tab-panels v-model="activeTab" animated>
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
    </BasePageCard>
  </div>
</template>

<script setup>
import AscentTable from 'src/components/tables/AscentTable.vue'
import SummitTable from 'src/components/tables/SummitTable.vue'
import BasePageCard from 'src/components/BasePageCard.vue'
import { useDataStore } from 'src/stores/dataStore'
import { computed, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTabQuery } from 'src/composables/useTabQuery'

const router = useRouter()

const dataStore = useDataStore()

const { activeTab } = useTabQuery(['summits', 'ascents'], 'summits')

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

<style lang="scss" scoped>
@media (min-width: $breakpoint-xs-max) {
  .q-tabs {
    margin-top: 1rem;
  }
}
</style>
