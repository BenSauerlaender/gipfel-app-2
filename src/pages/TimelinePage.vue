<template>
  <div class="page-container">
    <BasePageCard>
      <q-tabs v-model="tab" class="text-blue-7" align="justify">
        <q-tab name="timeline" icon="book" label="Chronik" />
        <q-tab name="table" icon="table_chart" label="Tabelle" />
      </q-tabs>

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="timeline" class="no-x-scroll">
          <div class="space"></div>
          <q-timeline color="scss" layout="dense" side="right" class="col-10">
            <div v-if="f_PopulatedTrips.length === 0">
              <div class="text-h6">Keine Einträge gefunden</div>
            </div>
            <div v-else>
              <TimelineTripEntry
                v-for="trip in f_PopulatedTrips.toReversed()"
                :key="trip.days[0].date"
                :trip="trip"
              />
            </div>
          </q-timeline>
        </q-tab-panel>
        <q-tab-panel name="table">
          <AscentTable
            :ascents="f_Ascents"
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
import { useDataStore } from 'src/stores/dataStore'
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import TimelineTripEntry from 'src/components/TimelineTripEntry.vue'
import AscentTable from 'src/components/tables/AscentTable.vue'
import BasePageCard from 'src/components/BasePageCard.vue'

const dataStore = useDataStore()

const { f_Ascents, f_PopulatedTrips } = storeToRefs(dataStore)

const tab = ref('timeline')

onMounted(() => {
  const el = document.querySelector('.no-x-scroll').getParentElement
  if (el) {
    el.style.overflowX = 'hidden'
  }
})
</script>

<style scoped lang="scss">
.space {
  height: 40px;
}

.q-timeline {
  margin-left: calc(0.5 * (100% - $breakpoint-xs-max));
  @media (max-width: $breakpoint-xs-max) {
    margin-left: 0px;
  }
}
</style>
