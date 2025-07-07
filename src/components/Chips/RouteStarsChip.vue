<script setup>
const props = defineProps({
  stars: { type: Number, required: false, default: 1 },
  color: { type: String, required: false },
})
</script>

<template>
  <q-chip
    v-once
    v-if="props.stars > 0"
    :style="{ backgroundColor: props.color ?? '#26a69a', color: 'white' }"
    dense
  >
    <template v-for="n in props.stars" v-bind:key="n">
      <q-icon name="star" />
    </template>
  </q-chip>
</template>
