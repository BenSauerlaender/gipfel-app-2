<template>
  <q-card class="statCard" style="height: 100%">
    <q-card-section class="flex items-center justify-start no-wrap statCardHeader">
      <div class="q-mr-md text-h4 statCardMainNumber">{{ props.routes.length }}</div>
      <div class="text-h6 text-grey-9">Wege</div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <div>
        <Bar :data="chartData" :options="chartOptions" />
      </div>
      <div class="q-mt-md row justify-center">
        <q-btn no-caps dense flat label="Alle anzeigen" to="/stats/routes" icon="list" />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'
import { getRouteGrade, getGradeColor, NORMAL_SCALA } from 'src/helper/route'

Chart.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const props = defineProps({
  routes: {
    type: Array,
    required: true,
  },
})

const chartData = computed(() => {
  if (props.routes.length === 0) {
    return {
      datasets: [],
    }
  }
  const routes = props.routes
  let labels = NORMAL_SCALA
  let data = labels.map((label) => 0)
  routes
    .map((route) => getRouteGrade(route))
    .forEach((grade) => {
      data[labels.indexOf(grade)]++
    })
  let lastIndex = data.length - 1
  for (let i = data.length - 1; i >= 0; i--) {
    if (data[i] !== 0) {
      lastIndex = i
      break
    }
  }
  labels = labels.slice(0, lastIndex + 1)
  data = data.slice(0, lastIndex + 1)

  return {
    labels: labels,
    datasets: [
      {
        label: 'Anzahl',
        data: data,
        backgroundColor: labels.map((label) => getGradeColor(label)),
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 5,
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
