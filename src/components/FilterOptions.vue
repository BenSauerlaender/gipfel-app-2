<template>
  <div class="q-pa-md">
    <div class="row q-col-gutter-md">
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
</script>

<style scoped>
</style>
