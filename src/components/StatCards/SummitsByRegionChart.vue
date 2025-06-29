<template>
          <q-card style="height: 100%;">
            <q-card-section class="flex items-center justify-start no-wrap">
              <div class="q-mr-md text-h4 text-weight-bold text-blue-7">{{ summits.length }}</div>
              <div class="text-h6 text-grey-9">verschiedene Gipfel</div>
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

Chart.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const props = defineProps({
  summits: {
    type: Array,
    required: true,
  }
})

const chartData = computed(() => {
  const summits = props.summits
  
  // Group summits by region
  const regionCounts = {}
  summits.forEach(summit => {
    const region = summit.region.name || 'Unknown'
    regionCounts[region] = (regionCounts[region] || 0) + 1
  })
  
  const labels = Object.keys(regionCounts)
  const data = Object.values(regionCounts)
  
  // Generate colors for each region
  const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF']
  const backgroundColor = labels.map((_, index) => colors[index % colors.length])

  return {
    labels: labels,
    datasets: [
      {
        label: 'Anzahl',
        data: data,
        backgroundColor: backgroundColor,
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