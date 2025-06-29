<template>
          <q-card style="height: 100%;">
            <q-card-section class="flex items-center justify-start no-wrap">
              <div class="q-mr-md text-h4 text-weight-bold text-blue-7">{{ props.trips.reduce((acc, trip) => acc + trip.days.length, 0) }}</div>
              <div class="text-h6 text-grey-9">Tage am Fels</div>
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
import { Chart, CategoryScale, LinearScale, TimeScale, BarElement, Tooltip, Legend } from 'chart.js'
import 'chartjs-adapter-date-fns'
import { de } from 'date-fns/locale'

Chart.register(CategoryScale, LinearScale,TimeScale, BarElement, Tooltip, Legend)

const props = defineProps({
  trips: {
    type: Array,
    required: true,
  }
})

const chartData = computed(() => {
  if (props.trips.length === 0) {
    return {
      datasets: []
    }
  }
  // Get date range from last ascent to today
  const lastAscentDate = new Date(props.trips[0].days[0].name)
  const today = new Date()
  
  // Generate all dates from last ascent to today
  const allDates = []
  const currentDate = new Date(lastAscentDate)
  while (currentDate <= today) {
    allDates.push(currentDate.toISOString().split('T')[0])
    currentDate.setDate(currentDate.getDate() + 1)
  }

  const data = props.trips.map(trip => {
    return {
      x: trip.days[0].name,
      y: trip.days.reduce((acc, day) => acc + day.ascents.length, 0),
      tripName: trip.name,
      days: trip.days.length,
    }
  })
  
  return {
    datasets: [{
      label: 'Anzahl',
      data: data,
      backgroundColor: '#36A2EB',
      borderWidth: 1,
      borderColor: '#fff',
      barThickness: '20',
      borderRadius: 4,
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
        mode: 'index',
        intersect: false,
        callbacks: {
        label: (context) => {
            return `Tage: ${context.raw.days} | Begehungen: ${context.raw.y}`
        },
        title: (tooltipItems) => {
          return tooltipItems[0].raw.tripName
        }
        }
    }
  },
  scales: {
    x: {
              type: 'time',
              time: {
                unit: 'year',
                minUnit: 'day',
                displayFormats: {
                  day: 'dd.MM',
                  month: 'MMM yyyy',
                  year: 'yyyy'
                }
              },
              adapters: {
                date: {
                  locale: de
                }
              },
              grid: {
                display: true,
                color: 'rgba(0, 0, 0, 0.1)'
              }
            },
            y: {
              beginAtZero: true,
              grid: {
                display: true,
                color: 'rgba(0, 0, 0, 0.1)'
              }
            }
  }
}
</script> 