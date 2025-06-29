<template>
          <q-card style="height: 100%;">
            <q-card-section class="flex items-center justify-start no-wrap">
              <div class="q-mr-md text-h4 text-weight-bold text-blue-7">{{ trips.reduce((acc, trip) => acc + trip.days, 0) }}</div>
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
import { useDataStore } from 'src/stores/dataStore'
import 'chartjs-adapter-date-fns'
import { de } from 'date-fns/locale'

const dataStore = useDataStore()

Chart.register(CategoryScale, LinearScale,TimeScale, BarElement, Tooltip, Legend)

const props = defineProps({
  ascentIDs: {
    type: Array,
    required: true,
  }
})
function groupAscentsIntoTrips(ascents) {
  // Group ascents by day (YYYY-MM-DD)
  const ascentsByDay = ascents
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .reduce((grouped, ascent) => {
      const dayString = new Date(ascent.date).toISOString().slice(0, 10)
      if (!grouped[dayString]) grouped[dayString] = 0
      grouped[dayString]++
      return grouped
    }, {})

  const sortedDays = Object.keys(ascentsByDay).sort().reverse()
  let trips = []
  let currentTrip = []
  let lastDayDate = null

  // Split days into trips, allowing max 1 off day between
  for (const dayString of sortedDays) {
    const currentDayDate = new Date(dayString)
    if (
      lastDayDate &&
      (lastDayDate - currentDayDate) / (1000 * 60 * 60 * 24) > 2 // more than 1 off day
    ) {
      if (currentTrip.length) trips.push(currentTrip)
      currentTrip = []
    }
    currentTrip.push({ day: dayString, ascents: ascentsByDay[dayString] })
    lastDayDate = currentDayDate
  }
  if (currentTrip.length) trips.push(currentTrip)

  // Add trip name (months/year) to each trip
  return trips.map(trip => {
    const months = [...new Set(trip.map(dayObj => new Date(dayObj.day).toLocaleString('de-DE', { month: 'long' })))]
    const year = new Date(trip[0].day).toLocaleString('de-DE', { year: 'numeric' })
    const tripName = months.join('/') + ' ' + year
    const days = trip.length
    const ascents = trip.reduce((acc, day) => acc + day.ascents, 0)
    const date = new Date(trip[0].day).toISOString().split('T')[0]
    return { tripName, days, ascents, date }
  })
}
const trips = computed(() => {
  const ascents = props.ascentIDs.map(id => dataStore.getAscentById(id))
  return groupAscentsIntoTrips(ascents)
})
const chartData = computed(() => {
  const ascents = props.ascentIDs.map(id => dataStore.getAscentById(id))

  // Get date range from last ascent to today
  const lastAscentDate = new Date(Math.max(...ascents.map(a => new Date(a.date))))
  const today = new Date()
  
  // Generate all dates from last ascent to today
  const allDates = []
  const currentDate = new Date(lastAscentDate)
  while (currentDate <= today) {
    allDates.push(currentDate.toISOString().split('T')[0])
    currentDate.setDate(currentDate.getDate() + 1)
  }

  const data = trips.value.map(trip => {
    return {
      x: trip.date,
      y: trip.ascents,
      tripName: trip.tripName,
      days: trip.days,
      ascents: trip.ascents
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
            return `Tage: ${context.raw.days} | Begehungen: ${context.raw.ascents}`
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