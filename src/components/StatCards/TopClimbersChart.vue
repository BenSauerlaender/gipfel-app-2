<template>
          <q-card style="height: 100%;">
            <q-card-section class="flex items-center justify-start no-wrap">
              <div class="q-mr-md text-h4 text-weight-bold text-blue-7">{{ sortedClimbers[0][1].total }}</div>
              <div class="text-h6 text-grey-9">Begehungen von {{ sortedClimbers[0][1].name }}</div>
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

const dataStore = useDataStore()

Chart.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const props = defineProps({
  ascents: {
    type: Array,
    required: true,
  }
})

const sortedClimbers = computed(() => {
  const ascents = props.ascents
  
  // Count ascents per climber by type
  const climberStats = {}
  
  ascents.forEach(ascent => {
    ascent.climbers.forEach(climber => {
        const climberId = climber._id
        if (climber.isAborted === true) return
        if (!climberStats[climberId]) {
            climberStats[climberId] = { lead: 0, solo: 0, topRope: 0, other: 0, total: 0}
        }
        if (ascent.isSolo) {
            climberStats[climberId].solo++
        } else if (ascent.isTopRope) {
            climberStats[climberId].topRope++
        } else if (climberId === ascent.leadClimber._id) {
            climberStats[climberId].lead++
        } else {
            climberStats[climberId].other++
        }
        climberStats[climberId].total++
    })
  })
    
  Object.keys(climberStats).forEach(key => {
    climberStats[key].name = dataStore.climbers.find(climber => climber._id === key).firstName
  })
  
  // Sort by total count and get top 10
  return Object.entries(climberStats)
    .sort(([,a], [,b]) => b.total - a.total)
    .slice(0, 10)
})

const chartData = computed(() => {
  const labels = sortedClimbers.value.map(([,stats]) => stats.name)
  
  return {
    labels: labels,
    datasets: [
      {
        label: 'Vorstieg',
        data: sortedClimbers.value.map(([,stats]) => stats.lead),
        backgroundColor: '#FF6384',
        stack: 'Stack 0'
      },
      {
        label: 'Solo',
        data: sortedClimbers.value.map(([,stats]) => stats.solo),
        backgroundColor: '#36A2EB',
        stack: 'Stack 0'
      },
      {
        label: 'v.o.g.',
        data: sortedClimbers.value.map(([,stats]) => stats.topRope),
        backgroundColor: '#FFCE56',
        stack: 'Stack 0'
      },
      {
        label: 'Nachstieg',
        data: sortedClimbers.value.map(([,stats]) => stats.other),
        backgroundColor: '#4BC0C0',
        stack: 'Stack 0'
      }
    ]
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
      position: 'bottom',
      labels: {
        usePointStyle: true,
        padding: 20
      }
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
    }
  },
  scales: {
    x: {
      stacked: true,
      ticks: {
        maxRotation: 45,
        minRotation: 0
      }
    },
    y: {
      stacked: true,
      beginAtZero: true,
      ticks: {
        stepSize: 1
      }
    }
  }
}
}
</script> 