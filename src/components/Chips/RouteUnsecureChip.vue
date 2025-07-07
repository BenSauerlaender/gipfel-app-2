<script setup>
import { computed } from 'vue'

const props = defineProps({
  color: { type: String, required: false },
})

const chipStyle = computed(() => ({
  backgroundColor: props.color ?? 'red',
  color: 'white',
}))
</script>

<template>
  <q-chip v-once :style="chipStyle" dense>
    <q-icon name="priority_high" />
  </q-chip>
</template>
