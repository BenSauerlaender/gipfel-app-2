<template>
  <div class="page-container">
    <q-card>
      <q-tabs v-model="tab" class="text-blue-7" align="justify">
        <q-tab name="timeline" icon="book" label="Chronik" />
        <q-tab name="table" icon="table_chart" label="Tabelle" />
      </q-tabs>
      <q-separator />
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="timeline">
          <div class="space"></div>
          <div class="row justify-center">
            <div>
              <q-card-section>
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
              </q-card-section>
            </div>
          </div>
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
    </q-card>
  </div>
</template>

<script setup>
import { useDataStore } from 'src/stores/dataStore'
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import TimelineTripEntry from 'src/components/TimelineTripEntry.vue'
import AscentTable from 'src/components/tables/AscentTable.vue'

const dataStore = useDataStore()

const { f_Ascents, f_PopulatedTrips } = storeToRefs(dataStore)

const tab = ref('timeline')
</script>

<style scoped lang="scss">
.space {
  height: 40px;
}
.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 10px;
}

.q-tab--inactive {
}
</style>
