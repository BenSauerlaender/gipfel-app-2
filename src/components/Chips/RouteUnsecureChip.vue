<script setup>
import { colors } from 'quasar'
import { computed } from 'vue'

const { getPaletteColor } = colors

const props = defineProps({
  color: { type: String, required: false },
})

const chipStyle = computed(() => ({
  backgroundColor: props.color ?? getPaletteColor('red'),
  color: getPaletteColor('offwhite1'),
}))
</script>

<template>
  <q-chip v-once :style="chipStyle" dense>
    <q-icon name="priority_high" />
  </q-chip>
</template>
