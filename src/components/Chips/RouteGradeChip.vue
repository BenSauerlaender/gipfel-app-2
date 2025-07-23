<script setup>
import { getGradeColor } from 'src/helper/route'
import { colors } from 'quasar'
const { getPaletteColor } = colors
const props = defineProps({
  grade: { type: String, required: true },
  color: { type: String, required: false },
  dense: { type: Boolean, required: false, default: true },
})
</script>

<template>
  <q-chip
    :style="{
      backgroundColor: props.color ?? getGradeColor(props.grade),
      color: getPaletteColor('offwhite1'),
    }"
    :dense="props.dense"
    >{{ props.grade }}</q-chip
  >
</template>
