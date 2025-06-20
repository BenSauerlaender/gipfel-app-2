<template>
    <q-timeline-entry heading>
        {{ props.trip.tripName }}
    </q-timeline-entry>
    <q-timeline-entry v-for="day in props.trip.days"
      :key="day.day"
      :subtitle="formatDate(day.day)"
    >
      <div v-for="ascent in day.ascents" :key="ascent._id">
          <RouteInline :route="ascent.route"></RouteInline> 
          <q-icon name="chevron_right" />
          <span>{{ ascent.leadClimber.firstName }}</span>
          <q-icon name="chevron_right" />
          <span>{{ otherClimberString(ascent) }}</span>
      </div>
    </q-timeline-entry>
</template>

<script setup>
import RouteInline from 'src/components/RouteInline.vue'

const props = defineProps({
  trip: {
    type: Object,
    required: true
  }
})
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('de-DE', { year: 'numeric', month: 'numeric', day: 'numeric' })
}
const otherClimberString = (ascent) => {
    return ascent.climbers.filter(climber => climber._id !== ascent.leadClimber._id).map(climber => climber.firstName).join(', ')
}
</script>