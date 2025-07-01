<template>
  <q-page-sticky expand position="bottom">
    <div
      class="bg-white bottom-panel" 
      :style="panelStyle"
    >
      <!-- Draggable handle for resizing -->
      <div 
        class="bottom-panel__resize-handle"
        @mousedown="startResize"
        @touchstart="startResize"
      ></div>
      
      <q-toolbar class="bg-grey-2 justify-between shadow-2" style="z-index: 1000;">
        <div></div>
        <q-toolbar-title shrink>
          Filter 
          <q-toggle
            v-model="filterStore.applyFilter"
            checked-icon="check"
            color="green"
            unchecked-icon="clear"
          />
        </q-toolbar-title>
        <q-btn
          flat
          dense
          round
          :icon="isExpanded ? 'expand_more' : 'expand_less'"
          @click="togglePanel"
          aria-label="Toggle Bottom Panel"
        />
      </q-toolbar>
      
      <div class="bottom-panel__content" v-show="isExpanded">
        <q-scroll-area class="bottom-panel__scroll-area">
          <div class="bottom-panel__inner-content">
      <div v-if="!filterStore.applyFilter" class="filter-overlay">
      </div>
            <slot>
              <!-- Default content -->
              <q-card class="q-ma-md">
                <q-card-section>
                  <div class="text-h6">Bottom Panel Content</div>
                  <p>This is a sticky bottom panel that appears on all pages.</p>
                  <p>You can expand and collapse it using the button above.</p>
                  <p>The content area has its own scroll bar when needed.</p>
                </q-card-section>
              </q-card>
              
              <!-- Add more content to demonstrate scrolling -->
              <q-card class="q-ma-md" v-for="i in 20" :key="i">
                <q-card-section>
                  <div class="text-subtitle1">Content Item {{ i }}</div>
                  <p>This is sample content to demonstrate the scrollable area. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                </q-card-section>
              </q-card>
            </slot>
          </div>
        </q-scroll-area>
      </div>
    </div>
  </q-page-sticky>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted} from 'vue'
import { useRouter } from 'vue-router'
import { useFilterStore } from 'src/stores/filterStore'

const filterStore = useFilterStore()
const router = useRouter()

const minHeight = 50
const maxHeight = 600

const isExpanded = ref(false)
const isResizing = ref(false)
const resizeStartY = ref(0)
const resizeStartHeight = ref(0)
const panelHeight = ref(minHeight) // Default collapsed height

const panelStyle = computed(() => ({
  height: `${panelHeight.value}px`
}))

//colapse panel when page changes using Router
//router.beforeEach((to, from, next) => {
  //isExpanded.value = false
  //panelHeight.value = minHeight
  //next()
//})

function startResize(event) {
  event.preventDefault()
  event.stopPropagation()
  isResizing.value = true
  
  const clientY = event.clientY || event.touches?.[0]?.clientY || 0
  resizeStartY.value = clientY
  resizeStartHeight.value = panelHeight.value
  
  document.addEventListener('mousemove', onResize)
  document.addEventListener('touchmove', onResize, { passive: false })
  document.addEventListener('mouseup', stopResize)
  document.addEventListener('touchend', stopResize)
}

function onResize(event) {
  if (!isResizing.value) return
  
  event.preventDefault()
  
  const clientY = event.clientY || event.touches?.[0]?.clientY || 0
  const deltaY = resizeStartY.value - clientY // Inverted because we're dragging up
  
  let newHeight = resizeStartHeight.value + deltaY
  
  // Constrain to min/max heights
  newHeight = Math.max(minHeight, Math.min(newHeight, maxHeight))
  
  panelHeight.value = newHeight
  
  // Auto-expand if height is greater than collapsed height
  if (newHeight > minHeight + 10) {
    isExpanded.value = true
  }
  //Auto collapse if height is less than collapsed height
  if (newHeight < minHeight + 10) {
    isExpanded.value = false
  }
}

function stopResize() {
  isResizing.value = false
  document.removeEventListener('mousemove', onResize)
  document.removeEventListener('touchmove', onResize)
  document.removeEventListener('mouseup', stopResize)
  document.removeEventListener('touchend', stopResize)
}

function togglePanel() {
  isExpanded.value = !isExpanded.value
  if (isExpanded.value) {
    panelHeight.value = 360 // Default expanded height
  } else {
    panelHeight.value = minHeight
  }
}

onMounted(() => {
  // Set initial height
  panelHeight.value = isExpanded.value ? 360 : minHeight
})

onUnmounted(() => {
  stopResize()
})
</script>

<style scoped>
.bottom-panel {
  width: 100%;
  user-select: none;
  touch-action: none;
  transition: height 0.2s ease;
  position: relative;
  border-top: 1px solid #e0e0e0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.bottom-panel__resize-handle {
  position: absolute;
  top: -4px;
  left: 0;
  right: 0;
  height: 8px;
  background: transparent;
  cursor: ns-resize;
  z-index: 1001;
}

.bottom-panel__resize-handle:hover {
  background: rgba(0, 0, 0, 0.1);
}

.bottom-panel__resize-handle:active {
  background: rgba(0, 0, 0, 0.2);
}

.bottom-panel__content {
  height: calc(100% - 50px); /* Subtract toolbar height */
  overflow: hidden;
}

.bottom-panel__scroll-area {
  height: 100%;
}

.bottom-panel__inner-content {
  padding: 8px;
  max-width: 1200px;
  margin: 0 auto;
}

.filter-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(128,128,128,0.6);
  z-index: 2000;
}

</style> 