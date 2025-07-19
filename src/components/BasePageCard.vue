<template>
  <q-card class="page-card">
    <q-card-section
      v-if="title || subtitle || stats.length > 0 || $slots.titleChips"
      class="row justify-between items-center"
    >
      <div class="column q-ml-md">
        <span
          v-if="subtitle || $slots.subtitle"
          class="text-h6 text-weight-light text-lightgreen q-ml-xs"
        >
          <slot name="subtitle">{{ subtitle }}</slot>
        </span>
        <span v-if="title && $slots.titleChips" class="row items-start">
          <span class="page-header">{{ title }}</span>
          <slot name="titleChips" />
        </span>
        <div v-else-if="title" class="page-header q-pl-md">{{ title }}</div>
      </div>
      <span v-if="stats.length > 0" class="row justify-center items-end">
        <span v-for="(stat, index) in stats" :key="index" class="q-ma-md column text-center">
          <span class="text-h4 text-weight-bolder text-red">{{ stat }}</span>
          <span class="text-lightgreen">{{ statLabels[index] || '' }}</span>
        </span>
      </span>
    </q-card-section>
    <slot />
  </q-card>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: '',
  },
  subtitle: {
    type: String,
    default: '',
  },
  stats: {
    type: Array,
    default: () => [],
  },
  statLabels: {
    type: Array,
    default: () => [],
  },
})
</script>
