<template>
    <q-timeline-entry heading>
        {{ props.trip.tripName }}
    </q-timeline-entry>
    <q-timeline-entry v-for="day in props.trip.days"
      :key="day.day"
      :subtitle="formatDate(day.day)"
    >
      <div v-for="ascent in day.ascents" :key="ascent._id" :class="(ascent.isSolo ? 'solo' : '') + (ascent.isTopRope ? 'topRope' : '') + (ascent.isAborted ? 'aborted' : '')">
          <span v-if="ascent.isAborted == true">{{'('}}</span>
          <RouteInline :route="ascent.route" :color="ascent.isAborted ? colors.aborted : undefined"></RouteInline> 
          <q-icon name="chevron_right" />
          <span v-if="ascent.isSolo === true || ascent.isTopRope === true">
            <span v-for="(c, idx) in ascent.climbers" :key="c._id" >
              <span :class="'climber ' + (c.isAborted ? 'aborted' : '')">
              {{ c.isAborted ? '(' + c.firstName + ')' : c.firstName}}
              </span>
              <span v-if="idx < ascent.climbers.length - 1">, </span>
            </span>
            <span v-if="ascent.isSolo === true" class="solo-hint"> (solo)</span>
            <span v-if="ascent.isTopRope === true" class="topRope-hint"> (v.o.g.)</span>
          </span>
          <span v-else-if="ascent.leadClimber !== null" >
            <span class="lead-climber">{{ ascent.leadClimber.firstName }}</span>
            <q-icon name="chevron_right" />
            <span v-for="(c, idx) in otherClimbers(ascent)" :key="c._id" :class="c.isAborted ? 'aborted' : ''">
              {{ c.isAborted ? '(' + c.firstName + ')' : c.firstName}}
              <span v-if="idx < otherClimbers(ascent).length - 1">, </span>
            </span>
          </span>
          <span v-else>
            <span class="text-negative">ERROR</span>
          </span>
          <span v-if="ascent.notes != null" class="notes">   ({{ ascent.notes }})</span>
          <span v-if="ascent.isAborted == true">{{')'}}</span>
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
const otherClimbers = (ascent) => ascent.climbers.filter(climber => climber._id !== ascent.leadClimber._id)

const colors = {
  aborted: '#818181',
  topRope: '#5a5a5a'
}
</script>

<style scoped>
.aborted {
  color: v-bind('colors.aborted');
}
.solo .climber {
  text-decoration: underline;
}
.topRope .climber {
  color: v-bind('colors.topRope');
}
.lead-climber {
  text-decoration: underline;
}
.solo-hint {
  font-style: italic;
}
.topRope-hint {
  color: v-bind('colors.topRope');
  font-style: italic;
}
.notes {
  font-style: italic;
  color: #7a7a7a;
}
</style>