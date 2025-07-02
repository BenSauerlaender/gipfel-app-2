<template>
    <q-timeline-entry heading>
        {{ props.trip.name }}
    </q-timeline-entry>
    <q-timeline-entry v-for="day in props.trip.days"
      :key="day.name"
      :subtitle="formatDate(day.name)"
    >
      <div v-for="ascent in day.ascents" :key="ascent._id" class="row items-center q-ma-sm" :class="(ascent.isSolo ? 'solo' : '') + (ascent.isTopRope ? 'topRope' : '') + (ascent.isAborted ? 'aborted' : '')">
          <span v-if="ascent.isAborted == true">{{'('}}</span>

          <router-link class="summit text-weight-medium" style="text-decoration: inherit; color: inherit;" :to="`/summits/${ascent.route.summit._id}`">
            {{ ascent.route.summit.name }}
          </router-link>,
          <router-link class="q-ml-sm route" style="text-decoration: none; color: inherit;" :to="`/routes/${ascent.route._id}`">
            {{ ascent.route.name }}
          </router-link>

          <RouteUnsecureChip :unsecure="ascent.route.unsecure" :color="ascent.isAborted? colors.aborted : undefined"/>
          <RouteStarsChip :stars="ascent.route.stars" :color="ascent.isAborted? colors.aborted : undefined"/>
          <RouteGradeChip :grade="getRouteGrade(ascent.route)" :color="ascent.isAborted? colors.aborted : undefined"/>

          <q-icon name="chevron_right" />

          <template v-if="ascent.leadClimber">
            <span class="lead-climber">{{ ascent.leadClimber.firstName }}</span>
            <q-icon name="chevron_right" />
          </template>
          <template v-for="(c, idx) in climbers(ascent)" :key="c._id">
            <span class="climber q-ml-xs" :class="c.isAborted ? 'aborted' : ''">
              {{ c.isAborted ? '(' + c.firstName + ')' : c.firstName}}
            </span>
            <span v-if="idx < climbers(ascent).length - 1">,</span>
          </template>
          <span v-if="ascent.isSolo === true" class="solo-hint"> (solo)</span>
          <span v-if="ascent.isTopRope === true" class="topRope-hint"> (v.o.g.)</span>
          <span v-if="ascent.notes != null" class="notes">   ({{ ascent.notes }})</span>
          <span v-if="ascent.isAborted == true">{{')'}}</span>
      </div>
    </q-timeline-entry>
</template>

<script setup>
import RouteUnsecureChip from 'src/components/Chips/RouteUnsecureChip.vue'
import RouteStarsChip from 'src/components/Chips/RouteStarsChip.vue'
import RouteGradeChip from 'src/components/Chips/RouteGradeChip.vue'
import {getRouteGrade} from 'src/helper/route.js'

const props = defineProps({
  trip: {
    type: Object,
    required: true
  }
})
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('de-DE', { year: 'numeric', month: 'numeric', day: 'numeric' })
}
const climbers = (ascent) => {
  if(ascent.leadClimber){
    return ascent.climbers.filter(climber => climber._id !== ascent.leadClimber._id)
  }else{
    return ascent.climbes
  }
}


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