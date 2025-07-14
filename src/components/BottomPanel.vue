<template>
  <q-footer
    class="resizable-bottom-panel"
    :style="{ height: `${currentHeight}px` }"
    :class="{ collapsed: isCollapsed, 'drag-active': isResizing }"
    elevated
  >
    <div class="resize-handle" @mousedown="startResize" @touchstart="startResize"></div>

    <q-toolbar class="justify-between text-offwhite1">
      <div style="width: 33.6px"></div>
      <q-toolbar-title shrink class="text-weight-bold">
        Filter
        <q-toggle
          v-model="filterStore.applyFilter"
          checked-icon="check"
          color="yellow"
          unchecked-icon="clear"
        />
      </q-toolbar-title>
      <q-btn
        flat
        dense
        round
        :icon="!isCollapsed ? 'expand_more' : 'expand_less'"
        @click="togglePanel"
      >
      </q-btn>
    </q-toolbar>

    <div class="panel-content inset-shadow" v-show="!isCollapsed">
      <q-scroll-area class="fit">
        <div v-if="!filterStore.applyFilter" class="filter-overlay"></div>
        <slot></slot>
      </q-scroll-area>
    </div>
  </q-footer>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useFilterStore } from 'src/stores/filterStore'

const filterStore = useFilterStore()

const minHeight = 50
const defaultHeight = 300
const maxHeight = window.innerHeight * 0.8

// Reactive state
const currentHeight = ref(minHeight)
const isCollapsed = ref(true)
const isResizing = ref(false)

let startY = 0
let startHeight = 0

const startResize = (event) => {
  isResizing.value = true
  const clientY = event.type === 'mousedown' ? event.clientY : event.touches[0].clientY
  startY = clientY
  startHeight = currentHeight.value

  document.addEventListener('mousemove', onResize)
  document.addEventListener('mouseup', stopResize)
  document.addEventListener('touchmove', onResize)
  document.addEventListener('touchend', stopResize)

  // Prevent text selection during drag
  document.body.style.userSelect = 'none'
}

const onResize = (event) => {
  if (!isResizing.value) return

  const clientY = event.type === 'mousemove' ? event.clientY : event.touches[0].clientY
  const deltaY = startY - clientY
  const newHeight = Math.max(minHeight, Math.min(maxHeight, startHeight + deltaY))

  currentHeight.value = newHeight

  // Auto-collapse if dragged to minimum height
  if (newHeight <= minHeight && !isCollapsed.value) {
    isCollapsed.value = true
  } else if (newHeight > minHeight && isCollapsed.value) {
    isCollapsed.value = false
  }
}

const stopResize = () => {
  isResizing.value = false
  document.removeEventListener('mousemove', onResize)
  document.removeEventListener('mouseup', stopResize)
  document.removeEventListener('touchmove', onResize)
  document.removeEventListener('touchend', stopResize)
  document.body.style.userSelect = ''

  if (currentHeight.value < minHeight + 40) {
    currentHeight.value = minHeight
    isCollapsed.value = true
  }
}

const togglePanel = () => {
  if (isCollapsed.value) {
    // Expand
    currentHeight.value = defaultHeight
    isCollapsed.value = false
  } else {
    // Collapse
    currentHeight.value = minHeight
    isCollapsed.value = true
  }
}

// Handle window resize
const handleWindowResize = () => {
  const newMaxHeight = maxHeight
  if (currentHeight.value > newMaxHeight) {
    currentHeight.value = newMaxHeight
  }
}

// Initialize component
onMounted(() => {
  currentHeight.value = minHeight

  window.addEventListener('resize', handleWindowResize)
})
onUnmounted(() => {
  window.removeEventListener('resize', handleWindowResize)
  stopResize()
})
</script>

<style lang="scss" scoped>
.resizable-bottom-panel {
  background: $darkgreen;
  transition: height 0.3s ease;
  border-top: 1px solid var(--q-separator-color);
  z-index: 2000;
  color: $offblack2;
}

.resizable-bottom-panel.drag-active {
  transition: none;
}

.resize-handle {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: $darkgreen;
  cursor: ns-resize;
  transition: all 0.2s ease;
  z-index: 10;
}

.resize-handle:hover {
  background: $lightgreen;
}

.panel-content {
  height: calc(100% - 50px);
  position: relative;
  background-color: $darkgreen;
  color: offblack2;
}

.collapsed {
  height: 50px !important;
}

/* Touch support */
@media (hover: none) {
  .resize-handle {
    height: 12px;
  }

  .resize-grip {
    height: 6px;
    width: 50px;
  }
}

.filter-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
}
</style>
