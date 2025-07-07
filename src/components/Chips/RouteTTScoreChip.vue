<script setup>
import { colors, openURL } from 'quasar'

const { getPaletteColor } = colors

const props = defineProps({
  score: { type: String, required: true },
  color: { type: String, required: false },
  ttrouteid: { type: String, required: false },
  dense: { type: Boolean, required: false, default: true },
})
const icons = {
  '-3': 'sym_o_stat_minus_3',
  '-2': 'sym_o_stat_minus_2',
  '-1': 'sym_o_stat_minus_1',
  0: 'sym_o_stat_0',
  1: 'sym_o_stat_1',
  2: 'sym_o_stat_2',
  3: 'sym_o_stat_3',
}
const colorsDict = {
  '-3': getPaletteColor('deep-orange-9'),
  '-2': getPaletteColor('deep-orange-7'),
  '-1': getPaletteColor('deep-orange-4'),
  0: getPaletteColor('grey-4'),
  1: getPaletteColor('light-green-4'),
  2: getPaletteColor('light-green-7'),
  3: getPaletteColor('light-green-9'),
}
</script>

<template>
  <q-chip
    v-once
    :clickable="!!props.ttrouteid"
    @click="openURL(`https://teufelsturm.de/wege/bewertungen/anzeige.php?wegnr=${props.ttrouteid}`)"
    :style="{ backgroundColor: props.color ?? colorsDict[props.score], color: 'white' }"
    :dense="props.dense"
  >
    <q-tooltip> Teufelsturm öffnen </q-tooltip>
    <q-icon v-once :name="icons[props.score]" />
  </q-chip>
</template>
