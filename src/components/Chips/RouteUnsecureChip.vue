<script setup>
const props = defineProps({
  unsecure: { type: Boolean, required: false, default: false },
  color: { type: String, required: false },
})
</script>

<template>
  <q-chip
    v-if="props.unsecure"
    :style="{ backgroundColor: props.color ?? 'red', color: 'white' }"
    dense
    >!</q-chip
  >
  <span v-else><slot /></span>
</template>
