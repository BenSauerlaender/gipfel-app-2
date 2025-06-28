<template>
          <q-card style="height: 100%;">
            <q-card-section class="flex items-center justify-start no-wrap">
              <div class="q-mr-md text-h4 text-weight-bold text-blue-7">{{ sortedSummits[0][1] }}</div>
              <div class="text-h6 text-grey-9">Begehungen auf den {{ sortedSummits[0][0] }}</div>
            </q-card-section>
  
            <q-separator />

            <q-card-section>
              <Bar :data="chartData" :options="chartOptions" />
            </q-card-section>
          </q-card>
</template>

<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'
import { useAscentStore } from 'src/stores/ascent'
import { useRouteStore } from 'src/stores/route'
import { useSummitStore } from 'src/stores/summit'

const ascentStore = useAscentStore()
const summitStore = useSummitStore()
const routeStore = useRouteStore()

Chart.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const props = defineProps({
  ascentIDs: {
    type: Array,
    required: true,
  }
})
const sortedSummits = computed(() => {
  const ascents = props.ascentIDs.map(id => ascentStore.getAscentById(id))
  
  // Count ascents per summit
  const summitCounts = {}
  ascents.forEach(ascent => {
    const summitId = routeStore.getRouteById(ascent.route).summit
    const summit = summitStore.getSummitById(summitId)
    if (summit) {
      const summitName = summit.name || 'Unknown Summit'
      summitCounts[summitName] = (summitCounts[summitName] || 0) + 1
    }
  })
  
  // Sort by count and get top 10
  return Object.entries(summitCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
})

const chartData = computed(() => {
  
  const labels = sortedSummits.value.map(([name]) => name)
  const data = sortedSummits.value.map(([,count]) => count)
  
  return {
    labels: labels,
    datasets: [{
      label: 'Begehungen',
      data: data,
      backgroundColor: '#36A2EB',
      borderWidth: 1,
      borderColor: '#fff',
      borderRadius: 4
    }]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          return `${context.parsed.y} Begehungen`
        }
      }
    }
  },
  scales: {
    x: {
      ticks: {
        maxRotation: 45,
        minRotation: 0
      }
    },
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1
      }
    }
  }
}
</script> 