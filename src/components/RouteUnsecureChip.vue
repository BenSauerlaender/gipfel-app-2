<script setup>
const props = defineProps({
  unsecure: { type: Boolean, required: false, default: false }
})
</script>

<template>
  <q-chip v-if="props.unsecure" :style="{backgroundColor: 'red', color: 'white'}" dense>!</q-chip>
  <span v-else><slot /></span>
</template> 