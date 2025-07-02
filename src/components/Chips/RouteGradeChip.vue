<script setup>
import { getGradeColor } from 'src/helper/route'
const props = defineProps({
  grade: { type: String, required: true }
})
</script>

<template>
  <q-chip :style="{backgroundColor: getGradeColor(props.grade), color: 'white'}" dense>{{ props.grade }}</q-chip>
</template> 