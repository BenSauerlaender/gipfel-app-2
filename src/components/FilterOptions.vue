<template>
  <div class="q-pa-md container">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-6 col-md-8">
        <DateFilter />
      </div>
      <div class="col-12 col-sm-6 col-md-4">
        <GradeFilter />
      </div>
      <div class="col-12 col-sm-6 col-md-4">
        <ClimberFilter />
      </div>
      <div class="col-12 col-sm-6 col-md-4">
        <LeadClimberFilter />
      </div>
      <div class="col-12 col-sm-6 col-md-4">
        <AscentTypeFilter />
      </div>
      <div class="col-12 col-sm-6 col-md-4">
        <RouteFilter />
      </div>
      <div class="col-12 col-sm-6 col-md-4">
        <RouteTagFilter />
      </div>
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
  max-width: 1000px;
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
