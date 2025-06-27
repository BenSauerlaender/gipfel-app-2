<template>
  <div>
    <!-- <ClimberAvatar v-for="climberId in climberIds" :key="climberId" :climberId="climberId" size="80px" class="q-mr-sm" highlight=true /> -->
  </div>
  <div class="timeline-wrapper q-px-lg q-py-md">
    <q-timeline color="secondary" layout="dense" side="right">
      <TimelineTripEntry v-for="trip in trips" :key="trip.tripName" :trip="trip" />
    </q-timeline>
  </div>
</template>

<script setup>
import { useAscentStore } from 'src/stores/ascent'
//import ClimberAvatar from 'src/components/ClimberAvatar.vue'
import TimelineTripEntry from 'src/components/TimelineTripEntry.vue'
import { useRouteStore } from 'src/stores/route'
import { useSummitStore } from 'src/stores/summit'
import { useClimberStore } from 'src/stores/climber'

const routeStore = useRouteStore()
const summitStore = useSummitStore()
const climberStore = useClimberStore()
const ascentStore = useAscentStore()

const ascents = ascentStore.ascents.map(ascent => {
  const ascentObj = {...ascent}
  const route = {...routeStore.getRouteById(ascent.route)}
  const summit = {...summitStore.getSummitById(route.summit)}
  ascentObj.route = { ...route, summit }
  ascentObj.leadClimber = {...climberStore.getClimberById(ascent.leadClimber)}
  ascentObj.climbers = ascent.climbers.map(climber => {
    return { ...climberStore.getClimberById(climber.climber), isAborted: climber.isAborted }
  })
  return ascentObj
})
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
.timeline-wrapper {
  max-width: 800px;
  margin: 120px auto 0 auto;
}
</style> 