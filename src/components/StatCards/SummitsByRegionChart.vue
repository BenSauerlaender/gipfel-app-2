<template>
  <q-card class="statCard" style="height: 100%">
    <q-card-section class="flex items-center justify-start no-wrap statCardHeader">
      <div class="q-mr-md text-h4 statCardMainNumber">{{ summits.length }}</div>
      <div class="text-h6 text-grey-9">Gipfel</div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <div>
        <Bar :data="chartData" :options="chartOptions" />
      </div>
      <div class="q-mt-md row justify-center">
        <q-btn no-caps flat dense label="Alle anzeigen" to="/stats/summits" icon="list" />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'
import { colors } from 'quasar'
const { getPaletteColor } = colors

Chart.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const props = defineProps({
  summits: {
    type: Array,
    required: true,
  },
})

const chartData = computed(() => {
  if (props.summits.length === 0) {
    return {
      datasets: [],
    }
  }
  const summits = props.summits

  // Group summits by region
  const regionCounts = {}
  summits.forEach((summit) => {
    const region = summit.regionName || 'Unknown'
    regionCounts[region] = (regionCounts[region] || 0) + 1
  })

  const labels = Object.keys(regionCounts)
  const data = Object.values(regionCounts)

  // Generate colors for each region
  const colors = [
    getPaletteColor('scale-red3'),
    getPaletteColor('scale-red4'),
    getPaletteColor('scale-red5'),
    getPaletteColor('scale-red6'),
    getPaletteColor('scale-red7'),
    getPaletteColor('scale-red8'),
  ]
  function seededRandom(seed) {
    let x = Math.sin(seed++) * 10000
    return x - Math.floor(x)
  }
  const seed = 421
  const shuffledColors = [...colors]
  for (let i = shuffledColors.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed + i) * (i + 1))
    ;[shuffledColors[i], shuffledColors[j]] = [shuffledColors[j], shuffledColors[i]]
  }
  const backgroundColor = labels.map((_, index) => shuffledColors[index % shuffledColors.length])

  return {
    labels: labels,
    datasets: [
      {
        label: 'Anzahl',
        data: data,
        backgroundColor: backgroundColor,
        borderWidth: 1,
        borderColor: getPaletteColor('offwhite1'),
        borderRadius: 10,
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
      },
    },
  },
}
</script>
