<template>
  <b>{{ route.summit.name }}</b>, {{ route.name }} 
  <q-chip v-if="route.unsecure" color="undefined" outline :style="{color: unsecureColor}" text-color="white">!</q-chip>
  <q-chip v-if="route.stars == 1" color="undefined" outline :style="{color: starsColor}" text-color="white"><q-icon name="star"/></q-chip>
  <q-chip v-if="route.stars == 2" color="undefined" outline :style="{color: starsColor}" text-color="white"><q-icon name="star"/><q-icon name="star"/></q-chip>
  <q-chip color="undefined" outline :style="{color: gradeColor}">
    <b>{{ gradeString }}</b>
  </q-chip>
</template>

<script setup>
import { ref } from "vue";
import { setCssVar } from 'quasar'

setCssVar('text-brand', '#e87b06 !important')
setCssVar('bg-brand', '#e87b06 !important')

const props = defineProps({
  route: {
    type: Object,
    required: true
  },
  color: {
    type: String,
    required: false,
  }
})

const JUMP_SCALA = {
  "1":"#094a25",
  "2":"#0c6b37",
  "3":"#f8b324",
  "4":"#eb442c",
  "5":"#bc2023"
}
const SCALA = {
    "I": "#094a25",
    "II": "#094a25",
    "III": "#0c6b37",
    "IV": "#0c6b37",
    "V": "#f8b324",
    "VI": "#f8b324",
    "VIIa": "#eb442c",
    "VIIb": "#eb442c",
    "VIIc": "#eb442c",
    "VIIIa": "#bc2023",
    "VIIIb": "#bc2023",
    "VIIIc": "#bc2023",
    "IXa": "#bc2023",
    "IXb": "#bc2023",
    "IXc": "#bc2023",
    "Xa": "#bc2023",
    "Xb": "#bc2023",
    "Xc": "#bc2023",
    "XIa": "#bc2023",
    "XIb": "#bc2023",
    "XIc": "#bc2023",
    "XIIa": "#bc2023",
    "XIIb": "#bc2023",
    "XIIc": "#bc2023"}

const route = props.route

const gradeColor = ref('red')
const starsColor = ref('#3706e8')
const unsecureColor = ref('#3706e8')
const gradeString = ref('?')

if(route.difficulty.jump) {
  gradeColor.value = JUMP_SCALA[route.difficulty.jump]
  gradeString.value = route.difficulty.jump
} else if(route.difficulty.normal) {
  gradeColor.value = SCALA[route.difficulty.normal]
  gradeString.value = route.difficulty.normal
} 
if(props.color) {
  gradeColor.value = props.color
  starsColor.value = props.color
  unsecureColor.value = props.color
}
</script>

<style scoped>
</style>
