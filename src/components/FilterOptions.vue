<template>
  <div class="q-pa-md">
    <div class="row q-col-gutter-md">
      <DateFilter />
      <AscentTypeFilter />
      <ClimberFilter />
      <RouteFilter />
    </div>
  </div>
</template>

<script setup>
import AscentTypeFilter from './FilterCards/AscentTypeFilter.vue'
import ClimberFilter from './FilterCards/ClimberFilter.vue'
import RouteFilter from './FilterCards/RouteFilter.vue'
import DateFilter from './FilterCards/DateFilter.vue'
</script>

<style scoped>
</style>
