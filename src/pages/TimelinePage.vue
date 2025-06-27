<template>
  <div class="page-container">
    <div class="space"></div>
    <div class="row justify-center">
      <q-timeline color="secondary" layout="dense" side="right" class="col-10">
        <TimelineTripEntry v-for="trip in trips" :key="trip.tripName" :trip="trip" />
      </q-timeline>
    </div>
  </div>
</template>

<script setup>
import { useAscentStore } from 'src/stores/ascent'
import TimelineTripEntry from 'src/components/TimelineTripEntry.vue'
import { useRouteStore } from 'src/stores/route'
import { useSummitStore } from 'src/stores/summit'
import { useClimberStore } from 'src/stores/climber'

const routeStore = useRouteStore()
const summitStore = useSummitStore()
const climberStore = useClimberStore()
const ascentStore = useAscentStore()

const ascents = ascentStore.getAscentsPopulated
const trips = groupAscentsIntoTrips(ascents)
console.log(trips)

// Groups ascents into trips (sequences of days with max 1 off day)
function groupAscentsIntoTrips(ascents) {
  // Group ascents by day (YYYY-MM-DD)
  const ascentsByDay = ascents
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .reduce((grouped, ascent) => {
      const dayString = new Date(ascent.date).toISOString().slice(0, 10)
      if (!grouped[dayString]) grouped[dayString] = []
      grouped[dayString].push(ascent)
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
    return { tripName, days:trip }
  })
}
</script>

<style scoped>
.space {
  height: 80px;
}
.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 10px;
}
</style> 