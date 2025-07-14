<template>
  <q-card style="height: 100%">
    <q-card-section class="flex items-center justify-start no-wrap">
      <div class="q-mr-md text-h4 text-weight-bold statsMainNumber">{{ props.ascents.length }}</div>
      <div class="text-h6 text-grey-9">Einträge</div>
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
import { colors } from 'quasar'
const { getPaletteColor } = colors

Chart.register(ArcElement, Tooltip, Legend)

const props = defineProps({
  ascents: {
    type: Array,
    required: true,
  },
})

const chartData = computed(() => {
  if (props.ascents.length === 0) {
    return {
      labels: [],
      datasets: [],
    }
  }
  const leadCount = props.ascents.filter(
    (ascent) => !ascent.isSolo && !ascent.isTopRope && ascent.leadClimber,
  ).length
  const soloCount = props.ascents.filter((ascent) => ascent.isSolo).length
  const topRopeCount = props.ascents.filter((ascent) => ascent.isTopRope).length

  return {
    labels: ['Klassisch', 'Solo', 'von oben gesichert'],
    datasets: [
      {
        data: [leadCount, soloCount, topRopeCount],
        backgroundColor: [
          getPaletteColor('darkgreen'),
          getPaletteColor('red'),
          getPaletteColor('yellow'),
        ],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
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
        usePointStyle: true,
      },
    },
  },
}
</script>
