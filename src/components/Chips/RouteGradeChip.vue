<script setup>
import { getGradeColor } from 'src/helper/route'
const props = defineProps({
  grade: { type: String, required: true },
  color: { type: String, required: false }
})
</script>

<template>
  <q-chip :style="{backgroundColor: props.color?? getGradeColor(props.grade), color: 'white'}" dense>{{ props.grade }}</q-chip>
</template> 