<template>
          <q-card style="height: 100%;">
            <q-card-section class="flex items-center justify-start no-wrap">
              <div class="q-mr-md text-h4 text-weight-bold text-blue-7">{{ sortedSummits[0][1].total }}</div>
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
import { useDataStore } from 'src/stores/dataStore'
import { SCALA, getGradeColor } from 'src/helper/route'

const dataStore = useDataStore()

Chart.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const props = defineProps({
  ascentIDs: {
    type: Array,
    required: true,
  }
})
const sortedSummits = computed(() => {
  const ascents = props.ascentIDs.map(id => dataStore.getAscentById(id))
  
  // Count ascents per summit
  const summitCounts = {}
  ascents.forEach(ascent => {
    const route = dataStore.getRouteById(ascent.route)
    const summitId = route.summit
    const summit = dataStore.getSummitById(summitId)
    if (summit) {
      const summitName = summit.name || 'Unknown Summit'
      if (!summitCounts[summitName]) {
        summitCounts[summitName] = {}
      }
      const grade = route.difficulty.normal
      summitCounts[summitName][grade] = (summitCounts[summitName][grade] || 0) + 1
      summitCounts[summitName].total = (summitCounts[summitName].total || 0) + 1
    }
  })
  
  // Sort by count and get top 10
  return Object.entries(summitCounts)
    .sort(([,a], [,b]) => b.total - a.total)
    .slice(0, 10)
})

const chartData = computed(() => {
  
  const labels = sortedSummits.value.map(([name]) => name)
  const data = sortedSummits.value.map(([,data]) => data.total)

  const datasets = SCALA.map(grade => {
    if (sortedSummits.value.some(([, data]) => Object.keys(data).includes(grade))) {
      return {
        label: grade,
        data: sortedSummits.value.map(([, data]) => data[grade] || 0),
        backgroundColor: getGradeColor(grade),
        stack: 'Stack 0',
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 4
      }
    }
  }).filter(dataset => dataset !== undefined)

  
  return {
    labels: labels,
    datasets: datasets
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        footer: (tooltipItems) => {
        let total = 0;
        tooltipItems.forEach(function(tooltipItem) {
            total += tooltipItem.parsed.y;
        });
        return 'Gesamt: ' + total ;
      }
    },
    filter: (tooltipItem, data) => {
    return tooltipItem.parsed.y > 0
    }
  },
  scales: {
    x: {
      ticks: {
        maxRotation: 45,
        minRotation: 0
      },
      stacked: true
    },
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1
      },
      stacked: true
    }
  }
}
}
</script> 