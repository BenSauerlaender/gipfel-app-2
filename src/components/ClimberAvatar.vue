<template>
  <q-avatar :color="color" text-color="white" :size="size" class="climber-avatar-relative">
    {{shortName}}
    <q-icon v-if="highlight" name="star" class="avatar-corner-icon" :size="starSize" />
  </q-avatar>
</template>

<script setup>
import { computed } from 'vue'
import { useClimberStore } from 'src/stores/climber'

const props = defineProps({
  climberId: String,
  size: {
    type: [String, Number],
    default: 40
  },
  highlight: {
    type: Boolean,
    default: false
  }
})

const climberStore = useClimberStore()
const climber = climberStore.getClimberById(props.climberId)
const shortName = climber.shortName
const color = climber.color

const starSize = computed(() => {
  let pxSize = 40
  if (props.size) {
    if (typeof props.size === 'number') pxSize = props.size
    else if (typeof props.size === 'string' && props.size.endsWith('px')) pxSize = parseInt(props.size)
    else if (typeof props.size === 'string') pxSize = parseInt(props.size)
  }
  return Math.round(pxSize * 0.4) + 'px' // 40% of avatar size
})
</script>

<style scoped>
.climber-avatar-relative {
  position: relative;
}
.avatar-corner-icon {
  position: absolute;
  top: -5px;
  right: -5px;
  color: rgb(255, 217, 0);
  border-radius: 50%;
  padding: 1px;
  z-index: 2;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.453));
}
</style>
