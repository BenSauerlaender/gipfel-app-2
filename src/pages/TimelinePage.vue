<template>
  <div class="page-container">
    <BasePageCard>
      <q-tabs v-model="activeTab" class="text-blue-7" align="justify">
        <q-tab name="timeline" icon="book" label="Chronik" />
        <q-tab name="table" icon="table_chart" label="Tabelle" />
      </q-tabs>

      <q-tab-panels v-model="activeTab" animated>
        <q-tab-panel name="timeline" class="no-x-scroll">
          <div class="space"></div>
          <q-timeline color="scss" layout="dense" side="right" class="col-10">
            <div v-if="f_PopulatedTrips.length === 0">
              <div class="text-h6">Keine Einträge gefunden</div>
            </div>
            <div v-else>
              <q-infinite-scroll @load="onLoad" :offset="900" style="max-height: 80vh">
                <template v-slot:loading></template>
                <TimelineTripEntry
                  v-for="trip in tripItems"
                  :key="trip.days[0].date"
                  :trip="trip"
                />
              </q-infinite-scroll>
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
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import TimelineTripEntry from 'src/components/TimelineTripEntry.vue'
import AscentTable from 'src/components/tables/AscentTable.vue'
import BasePageCard from 'src/components/BasePageCard.vue'
import { useTabQuery } from 'src/composables/useTabQuery'

const availableTabs = ['timeline', 'table']
const defaultTab = 'timeline'

const { activeTab } = useTabQuery(availableTabs, defaultTab)

const dataStore = useDataStore()

const { f_Ascents, f_PopulatedTrips } = storeToRefs(dataStore)
const allTripItems = computed(() => f_PopulatedTrips.value.toReversed())
const tripItems = ref([])
const onLoad = (index, done) => {
  if (tripItems.value.length >= allTripItems.value.length) {
    done()
    return
  }
  const currentLength = tripItems.value.length
  const newItems = allTripItems.value.slice(currentLength, currentLength + 3)
  if (newItems.length > 0) {
    tripItems.value.push(...newItems)
  }
  done()
}

watch(
  () => activeTab.value,
  (newTab) => {
    nextTick(() => {
      if (newTab === 'timeline') {
        fixTimelineScrollAndLoading()
      }
    })
  },
)
const fixTimelineScrollAndLoading = () => {
  //a hack to fix horizontal scroll on mobile in timeline tab
  const el = document.querySelector('.no-x-scroll')?.parentElement
  if (el) {
    el.style.overflowX = 'hidden'
  }

  const infiniteScrollLoading = document.querySelector('.q-infinite-scroll__loading')
  if (infiniteScrollLoading) {
    infiniteScrollLoading.remove()
  }
}

onMounted(() => {
  fixTimelineScrollAndLoading()
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
