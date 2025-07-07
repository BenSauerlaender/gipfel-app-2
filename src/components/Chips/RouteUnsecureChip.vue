<script setup>
const props = defineProps({
  color: { type: String, required: false },
})
</script>

<template>
  <q-chip :style="{ backgroundColor: props.color ?? 'red', color: 'white' }" dense>!</q-chip>
</template>
