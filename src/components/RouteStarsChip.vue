<script setup>
const props = defineProps({
  stars: { type: Number, required: false, default: 0 }

})
</script>

<template>
  <q-chip v-if="props.stars === 1" :style="{backgroundColor: 'yellow', color: 'black'}" dense><q-icon name="star" /></q-chip>
  <q-chip v-else-if="props.stars === 2" :style="{backgroundColor: 'yellow', color: 'black'}" dense><q-icon name="star" /><q-icon name="star" /></q-chip>
  <span v-else><slot /></span>
</template> 