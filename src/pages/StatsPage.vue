<template>
    <div class="stats-section q-pa-md">
     <div>
      <div class="row q-col-gutter-md">
        <div v-for="stat in stats" :key="stat.name" class="col-12 col-sm-6 col-md-4 col-lg-3">
            <SimpleStatCard :data="stat" />
        </div>
      </div>
    </div>
    </div>
  </template>
  
  <script setup>
  import SimpleStatCard from 'src/components/StatCards/SimpleStatCard.vue'
  import { useRouteStore } from 'src/stores/route'
  import { useSummitStore } from 'src/stores/summit'
  import { useClimberStore } from 'src/stores/climber'
  import { useAscentStore } from 'src/stores/ascent'
  import { getRouteGrade } from 'src/helper/route'

  const routeStore = useRouteStore()
  const summitStore = useSummitStore()
  const climberStore = useClimberStore()
  const ascentStore = useAscentStore()

  const ascents = ascentStore.ascents.filter(ascent => ascent.isAborted === false)
  const uniqueRouteIDs = [...new Set(ascents.map(ascent => ascent.route))]
  const uniqueSummitIDs = [...new Set(uniqueRouteIDs.map(routeID => routeStore.getRouteById(routeID).summit))]
  const totalUniqueSummitsByRegion = uniqueSummitIDs.map(summitID => summitStore.getSummitById(summitID).region.name)
    .reduce((grouped, region) => {
      if (!grouped[region]) grouped[region] = 0
      grouped[region]++
      return grouped
    }, {})
  
  const totalRoutesByGrade = uniqueRouteIDs.map(routeID => getRouteGrade(routeStore.getRouteById(routeID)))
    .reduce((grouped, grade) => {
      if (!grouped[grade]) grouped[grade] = 0
      grouped[grade]++
      return grouped
    }, {})


  const stats = []
  stats.push([{
      name: 'Begehungen',
      value: ascents.length, },
    {
      name: 'im Vorstieg',
      value: ascents.filter(ascent => ascent.leadClimber).length,
    },
    {
      name: 'Solo',
      value: ascents.filter(ascent => ascent.isSolo).length,
    },
    {
      name: 'von oben gesichert',
      value: ascents.filter(ascent => ascent.isTopRope).length,
    }])

  stats.push([{
      name: 'Wege',
      value: uniqueRouteIDs.length,
    }, ...Object.keys(totalRoutesByGrade).map(grade => ({ name: grade, value: totalRoutesByGrade[grade]}))])

  stats.push([{
      name: 'Gipfel',
      value: uniqueSummitIDs.length,
    }, ...Object.keys(totalUniqueSummitsByRegion).map(region => ({ name: region, value: totalUniqueSummitsByRegion[region]}))])

  </script>
  
  <style scoped>
  .stats-section {
    max-width: 1200px;
    margin: 0 auto;
  }

  </style>