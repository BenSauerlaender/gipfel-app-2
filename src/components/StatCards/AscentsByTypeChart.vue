<template>
          <q-card style="height: 100%;">
            <q-card-section class="flex items-center justify-start no-wrap">
              <div class="q-mr-md text-h4 text-weight-bold text-blue-7">{{ ascentIDs.length }}</div>
              <div class="text-h6 text-grey-9">Begehungen</div>
            </q-card-section>
  
            <q-separator />

            <q-card-section>
              <Doughnut :data="chartData" :options="chartOptions" />
            </q-card-section>
          </q-card>
</template>

<script setup>
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js'
import { useDataStore } from 'src/stores/dataStore'

Chart.register(ArcElement, Tooltip, Legend)

const dataStore = useDataStore()

const props = defineProps({
  ascentIDs: {
    type: Array,
    required: true,
  }
})

const chartData = computed(() => {
  const ascents = props.ascentIDs.map(id => dataStore.getAscentById(id))
  const leadCount = ascents.filter(ascent => !ascent.isSolo && !ascent.isTopRope && ascent.leadClimber).length
  const soloCount = ascents.filter(ascent => ascent.isSolo).length
  const topRopeCount = ascents.filter(ascent => ascent.isTopRope).length
  const otherCount = ascents.length - leadCount - soloCount - topRopeCount

  return {
    labels: ['Vorstieg', 'Solo', 'von oben gesichert'],
    datasets: [
      {
        data: [leadCount, soloCount, topRopeCount],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        padding: 20,
        usePointStyle: true
      }
    }
  }
}
</script>