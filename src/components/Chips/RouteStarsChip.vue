<script setup>
import { colors } from 'quasar'
const { getPaletteColor } = colors
const props = defineProps({
  stars: { type: Number, required: false, default: 1 },
  color: { type: String, required: false },
  dense: { type: Boolean, required: false, default: true },
})
</script>

<template>
  <q-chip
    v-if="props.stars > 0"
    :style="{
      backgroundColor: props.color ?? getPaletteColor('blue'),
      color: getPaletteColor('offwhite1'),
    }"
    :dense="props.dense"
  >
    <template v-for="n in props.stars" v-bind:key="n">
      <q-icon name="star" />
    </template>
  </q-chip>
</template>
