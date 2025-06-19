<template>
  <div>
    <ClimberAvatar v-for="climberId in climberIds" :key="climberId" :climberId="climberId" size="80px" class="q-mr-sm" highlight=true />
  </div>
  <div class="timeline-wrapper q-px-lg q-py-md">
    <q-timeline color="secondary" layout="dense" side="right">
      <q-timeline-entry heading>
        Mai/Juni '25
      </q-timeline-entry>
  
      <q-timeline-entry v-for="ascent in ascents"
        :key="ascent._id"
        :subtitle="formatDate(ascent.date)"
      >
        <div>
            <RouteInline :route="ascent.route"></RouteInline> 
        </div>
      </q-timeline-entry>
  
    </q-timeline>
  </div>
</template>

<script setup>
import { useAscentStore } from 'src/stores/ascent'
import ClimberAvatar from 'src/components/ClimberAvatar.vue'
import RouteInline from 'src/components/RouteInline.vue'
import { useRouteStore } from 'src/stores/route'
import { useSummitStore } from 'src/stores/summit'
import { useClimberStore } from 'src/stores/climber'

const routeStore = useRouteStore()
const summitStore = useSummitStore()
const climberStore = useClimberStore()

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('de-DE', { year: 'numeric', month: 'numeric', day: 'numeric' })
}
const ascentStore = useAscentStore()

// Group ascents by day (YYYY-MM-DD)
const ascentsByDay = ascentStore.ascents
  .sort((a, b) => new Date(b.date) - new Date(a.date))
  .map(ascent => {
    ascent.route = routeStore.getRouteById(ascent.route)
    ascent.summit = summitStore.getSummitById(ascent.route.summit)
    ascent.leadClimber = climberStore.getClimberById(ascent.leadClimber)
    ascent.climbers = ascent.climbers.map(climber => climberStore.getClimberById(climber))
    return ascent
  })
  .reduce((groups, ascent) => {
    const day = new Date(ascent.date).toISOString().slice(0, 10) // YYYY-MM-DD
    if (!groups[day]) {
      groups[day] = []
    }
    groups[day].push(ascent)
    return groups
  }, {})
console.log(ascents)

</script>

<style scoped>
.timeline-wrapper {
  max-width: 800px;
  margin: 120px auto 0 auto;
}
</style> 