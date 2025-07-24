<template>
  <q-card class="page-card">
    <q-card-section
      v-if="title || subtitle || stats.length > 0 || $slots.titleChips"
      class="page-heading row justify-between items-start"
    >
      <div>
        <span v-if="subtitle || $slots.subtitle" class="subtitle">
          <slot name="subtitle">{{ subtitle }}</slot>
        </span>
        <span class="row items-start title-container">
          <span class="title">{{ title }}</span>
          <span v-if="$slots.titleChips" class="title-chips"><slot name="titleChips" /></span>
        </span>
      </div>
      <!-- Stats dont show on mobile currently (but styling for mobile is provided) -->
      <span v-if="stats.length > 0" class="gt-xs page-stats row">
        <span v-for="(stat, index) in stats" :key="index" class="column text-center">
          <span class="stat">{{ stat }}</span>
          <span class="stat-label">{{ statLabels[index] || '' }}</span>
        </span>
      </span>
    </q-card-section>
    <slot />
  </q-card>
</template>

<style lang="scss" scoped>
.page-heading {
  color: $darkgreen;
  flex-wrap: unset;
  gap: 2rem;
  overflow: hidden;
  padding-top: 2rem;
  padding-left: 2rem;
  padding-right: 2rem;
  @media (max-width: $breakpoint-xs-max) {
    padding-top: 1rem;
    display: block;
  }
}
.title {
  font-weight: 700;
  font-size: 3.75rem;
  line-height: 3.75rem;
  @media (max-width: $breakpoint-xs-max) {
    font-size: 2.5rem;
    line-height: 2.5rem;
  }
}
.subtitle {
  font-weight: 300;
  font-size: 1.75rem;
  line-height: 1.75rem;
  color: $lightgreen;
  @media (max-width: $breakpoint-xs-max) {
    font-size: 1.25rem;
    line-height: 1.25rem;
  }
}
.page-stats {
  flex-shrink: 0;
  color: $red;
  gap: 1rem;
  .stat {
    font-weight: 900;
    font-size: 2rem;
    line-height: 2rem;
  }
  .stat-label {
    color: $lightgreen;
    font-weight: 400;
    font-size: 1rem;
    line-height: 1.5rem;
  }
  @media (max-width: $breakpoint-xs-max) {
    border-top: 1px solid $lightgreen;
    border-bottom: 1px solid $lightgreen;
    padding: 0.5rem;
    margin-top: 1rem;
    margin-left: 1rem;
    margin-right: 1rem;
    justify-content: center;
    .stat {
      font-size: 1.75rem;
      line-height: 1.75rem;
    }
    .stat-label {
      font-size: 1rem;
      line-height: 1rem;
    }
  }
}

@media (max-width: $breakpoint-xs-max) {
  .page-card {
    border-radius: 0px;
    box-shadow: none;
  }
}
</style>

<script setup>
import { nextTick, onMounted, onUnmounted } from 'vue'
import { useQuasar } from 'quasar'
const $q = useQuasar()

defineProps({
  title: {
    type: String,
    default: '',
  },
  subtitle: {
    type: String,
    default: '',
  },
  stats: {
    type: Array,
    default: () => [],
  },
  statLabels: {
    type: Array,
    default: () => [],
  },
})

const calcTableHeight = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0
  const headingBottom = document.querySelector('.page-heading')?.getBoundingClientRect().bottom || 0
  let offset = headingBottom + scrollTop

  const table = document.querySelector('.q-table__container')
  if (table) {
    table.style.maxHeight = `calc(100vh - ${offset}px)`
  }
}
onMounted(() => {
  window.addEventListener('resize', calcTableHeight)
  nextTick(() => {
    calcTableHeight()
  })
})
onUnmounted(() => {
  window.removeEventListener('resize', calcTableHeight)
})
</script>
