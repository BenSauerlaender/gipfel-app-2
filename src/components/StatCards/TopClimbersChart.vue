<template>
  <BaseStatCard
    :header-number="ascents.length > 0 ? sortedClimbers[0][1].total : 0"
    :header-text="`Einträge mit ${ascents.length > 0 ? sortedClimbers[0][1].name : 'Niemand'}`"
  >
    <Bar :data="chartData" :options="chartOptions" />
  </BaseStatCard>
</template>

<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'
import { useDataStore } from 'src/stores/dataStore'
import { colors } from 'quasar'
import BaseStatCard from './BaseStatCard.vue'

const { getPaletteColor } = colors

const dataStore = useDataStore()

Chart.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const props = defineProps({
  ascents: {
    type: Array,
    required: true,
  },
  allowAborted: {
    type: Boolean,
    required: true,
  },
})

const sortedClimbers = computed(() => {
  const ascents = props.ascents

  // Count ascents per climber by type
  const climberStats = {}

  ascents.forEach((ascent) => {
    ascent.climbers.forEach((climber) => {
      const climberId = climber._id
      if (climber.isAborted === true && !props.allowAborted) return
      if (!climberStats[climberId]) {
        climberStats[climberId] = { lead: 0, solo: 0, topRope: 0, other: 0, total: 0 }
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

  Object.keys(climberStats).forEach((key) => {
    climberStats[key].name = dataStore.climbers.find((climber) => climber._id === key).firstName
  })

  // Sort by total count and get top 10
  return Object.entries(climberStats)
    .toSorted(([, a], [, b]) => b.total - a.total)
    .slice(0, 10)
})

const chartData = computed(() => {
  if (sortedClimbers.value.length === 0) {
    return {
      datasets: [],
    }
  }
  const labels = sortedClimbers.value.map(([, stats]) => stats.name)

  return {
    labels: labels,
    datasets: [
      {
        label: 'Nachstieg',
        data: sortedClimbers.value.map(([, stats]) => stats.other),
        backgroundColor: getPaletteColor('lightgreen'),
        stack: 'Stack 0',
        borderRadius: 10,
      },
      {
        label: 'Vorstieg',
        data: sortedClimbers.value.map(([, stats]) => stats.lead),
        backgroundColor: getPaletteColor('darkgreen'),
        stack: 'Stack 0',
        borderRadius: 10,
      },
      {
        label: 'Solo',
        data: sortedClimbers.value.map(([, stats]) => stats.solo),
        backgroundColor: getPaletteColor('red'),
        stack: 'Stack 0',
        borderRadius: 10,
      },
      {
        label: 'v.o.g.',
        data: sortedClimbers.value.map(([, stats]) => stats.topRope),
        backgroundColor: getPaletteColor('yellow'),
        stack: 'Stack 0',
        borderRadius: 10,
      },
    ],
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
        padding: 20,
      },
    },
    tooltip: {
      callbacks: {
        footer: (tooltipItems) => {
          let total = 0
          tooltipItems.forEach(function (tooltipItem) {
            total += tooltipItem.parsed.y
          })
          return 'Gesamt: ' + total
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          maxRotation: 45,
          minRotation: 0,
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  },
}
</script>
