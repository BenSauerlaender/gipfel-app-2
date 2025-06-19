<template>
  <b>{{ route.summit }}</b>, {{ route.name }}
</template>

<script setup>
const props = defineProps({
  route: {
    type: Object,
    required: true
  }
})

const route = props.route
</script>

<style scoped>
</style>
