<script setup>
import { getGradeColor } from 'src/helper/route'
const props = defineProps({
  grade: { type: String, required: true },
  color: { type: String, required: false },
  dense: { type: Boolean, required: false, default: true },
})
</script>

<template>
  <q-chip
    v-once
    :style="{ backgroundColor: props.color ?? getGradeColor(props.grade), color: 'white' }"
    :dense="props.dense"
    >{{ props.grade }}</q-chip
  >
</template>
