<template>
  <q-card class="statCard" style="height: 100%">
    <q-card-section class="flex items-end justify-start no-wrap statCardHeader">
      <div class="q-mr-md text-h4 statCardMainNumber">{{ headerNumber }}</div>
      <div class="text-h6 text-grey-9">{{ headerText }}</div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <slot />
    </q-card-section>
  </q-card>
</template>

<script setup>
defineProps({
  headerNumber: {
    type: [String, Number],
    required: true,
  },
  headerText: {
    type: String,
    required: true,
  },
})
</script>
