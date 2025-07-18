<template>
  <div class="q-pa-md page-container">
    <BasePageCard>
      <q-card-section>
        <div class="row items-center">
          <q-btn round color="primary" icon="arrow_back" @click="router.back()" />
          <div class="text-h5 q-ml-md">Begangene Gipfel</div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section class="bg-offwhite1">
        <SummitTable :summits="summits" :defaultSort="['ascents', 'desc']" />
      </q-card-section>
    </BasePageCard>
  </div>
</template>

<script setup>
import SummitTable from 'src/components/tables/SummitTable.vue'
import BasePageCard from 'src/components/BasePageCard.vue'
import { computed } from 'vue'
import { useDataStore } from 'src/stores/dataStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const dataStore = useDataStore()

const summits = computed(() => {
  const summitIDs = new Set()
  dataStore.f_Ascents.forEach((ascent) => {
    if (!summitIDs.has(ascent.route.summitID)) {
      summitIDs.add(ascent.route.summitID)
    }
  })
  return dataStore.summits.filter((summit) => summitIDs.has(summit._id))
})
</script>

<style scoped></style>
