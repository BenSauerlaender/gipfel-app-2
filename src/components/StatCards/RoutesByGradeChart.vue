<template>
          <q-card style="height: 100%;">
            <q-card-section class="flex items-center justify-start no-wrap">
              <div class="q-mr-md text-h4 text-weight-bold text-blue-7">{{ routeIDs.length }}</div>
              <div class="text-h6 text-grey-9">Wege</div>
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
import { useRouteStore } from 'src/stores/route'
import { getRouteGrade, getGradeColor, SCALA } from 'src/helper/route'

const routeStore = useRouteStore()


Chart.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const props = defineProps({
  routeIDs: {
    type: Array,
    required: true,
  }
})

const chartData = computed(() => {
  const routes = props.routeIDs.map(id => routeStore.getRouteById(id))
  let labels = SCALA
  let data = labels.map(label => 0)
  routes.map(route => getRouteGrade(route)).forEach(grade => {
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
  console.log(labels, data)

  return {
    labels: labels,
    datasets: [
      {
        label: 'Anzahl',
        data: data,
        backgroundColor: labels.map(label => getGradeColor(label)),
        borderWidth: 1,
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
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1
      }
    }
  }
}
</script>