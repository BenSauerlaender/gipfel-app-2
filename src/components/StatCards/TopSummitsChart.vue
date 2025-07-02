<template>
          <q-card style="height: 100%;">
            <q-card-section class="flex items-center justify-start no-wrap">
              <div class="q-mr-md text-h4 text-weight-bold text-blue-7">{{ (ascents.length > 0) ? sortedSummits[0][1].total : 0 }}</div>
              <div class="text-h6 text-grey-9">Begehungen auf den {{ (ascents.length > 0) ? sortedSummits[0][0] : 'Nix' }}</div>
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
import { NORMAL_SCALA, getGradeColor } from 'src/helper/route'

Chart.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const props = defineProps({
  ascents: {
    type: Array,
    required: true,
  }
})
const sortedSummits = computed(() => {
  const ascents = props.ascents
  
  // Count ascents per summit
  const summitCounts = {}
  ascents.forEach(ascent => {
    const summit = ascent.route.summit
    if (summit) {
      const summitName = summit.name || 'Unknown Summit'
      if (!summitCounts[summitName]) {
        summitCounts[summitName] = {}
      }
      const jumpGrade = ascent.route.difficulty.jump
      const normalGrade = ascent.route.difficulty.normal
      if(jumpGrade){
         summitCounts[summitName][jumpGrade] = (summitCounts[summitName][jumpGrade] || 0) + 1
      }else{
         summitCounts[summitName][normalGrade] = (summitCounts[summitName][normalGrade] || 0) + 1
      }
      summitCounts[summitName].total = (summitCounts[summitName].total || 0) + 1
    }
  })
  
  // Sort by count and get top 10
  return Object.entries(summitCounts)
    .toSorted(([,a], [,b]) => b.total - a.total)
    .slice(0, 10)
})

const chartData = computed(() => {
  if (sortedSummits.value.length === 0) {
    return {
      datasets: []
    }
  }
  const labels = sortedSummits.value.map(([name]) => name)

  const datasets = NORMAL_SCALA.map(grade => {
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