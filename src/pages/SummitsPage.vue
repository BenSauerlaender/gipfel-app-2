<template>
  <div class="q-pa-md page-container">
    <BasePageCard
      title="Gipfel"
      :stats="[summits.length, summitPercentage + '%', ascentCount]"
      :stat-labels="['Gipfel', 'Begangen', 'Einträge']"
    >
      <q-card-section class="bg-offwhite1">
        <SummitTable :summits="summits" :defaultSort="['name', 'asc']" />
      </q-card-section>
    </BasePageCard>
  </div>
</template>

<script setup>
import SummitTable from 'src/components/tables/SummitTable.vue'
import BasePageCard from 'src/components/BasePageCard.vue'
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

<style lang="scss" scoped></style>
