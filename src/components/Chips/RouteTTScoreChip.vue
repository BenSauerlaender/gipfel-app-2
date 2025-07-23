<script setup>
import { colors, openURL } from 'quasar'
import { computed } from 'vue'

const { getPaletteColor } = colors

const props = defineProps({
  score: { type: String, required: true },
  color: { type: String, required: false },
  ttrouteid: { type: Number, required: false },
  dense: { type: Boolean, required: false, default: true },
  altc: { type: Boolean, required: false, default: false },
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
  '-3': getPaletteColor('scale-red3'),
  '-2': getPaletteColor('scale-red2'),
  '-1': getPaletteColor('scale-red1'),
  0: getPaletteColor('offwhite3'),
  1: getPaletteColor('scale-green1'),
  2: getPaletteColor('scale-green2'),
  3: getPaletteColor('scale-green3'),
}

const color = computed(() => {
  if (props.color) {
    return props.color
  } else if (props.altc && props.score === '0') {
    return getPaletteColor('offwhite1')
  } else {
    return colorsDict[props.score]
  }
})
</script>

<template>
  <q-chip
    :clickable="!!props.ttrouteid"
    @click="openURL(`https://teufelsturm.de/wege/bewertungen/anzeige.php?wegnr=${props.ttrouteid}`)"
    :style="{
      backgroundColor: color,
      color:
        props.altc && props.score === '0'
          ? getPaletteColor('offblack1')
          : getPaletteColor('offwhite1'),
    }"
    :dense="props.dense"
  >
    <q-tooltip> Teufelsturm öffnen </q-tooltip>
    <q-icon :name="icons[props.score]" />
  </q-chip>
</template>
