<template>
  <div class="q-pa-md container">
    <div class="row q-col-gutter-md">
      <DateFilter />
      <GradeFilter />
      <AscentTypeFilter />
      <ClimberFilter />
      <LeadClimberFilter />
      <RouteFilter />
      <RouteTagFilter />
    </div>
  </div>
</template>

<script setup>
import AscentTypeFilter from './FilterCards/AscentTypeFilter.vue'
import ClimberFilter from './FilterCards/ClimberFilter.vue'
import RouteFilter from './FilterCards/RouteFilter.vue'
import DateFilter from './FilterCards/DateFilter.vue'
import GradeFilter from './FilterCards/GradeFilter.vue'
import LeadClimberFilter from './FilterCards/LeadClimberFilter.vue'
import RouteTagFilter from './FilterCards/RouteTagFilter.vue'
</script>

<style lang="scss" scoped>
.container {
  max-width: 1200px;
  margin: auto;
}

:deep(.filter-card) {
  background-color: $offwhite3;
  border-radius: 1.5rem;
  .filter-header {
    font-size: 1.2rem;
    font-weight: bold;
    color: $darkgreen;
  }
  .q-range {
    width: 90%;
    margin: 48px 16px 0px 16px;
  }
  height: 100%;
}
</style>
