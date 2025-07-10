<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> Gipfel App </q-toolbar-title>

        <q-btn round flat icon="more_vert">
          <q-menu auto-close :offset="[110, 0]">
            <q-list style="min-width: 150px">
              <q-item clickable @click="router.push('/status')">
                <q-item-section>Status</q-item-section>
              </q-item>
              <q-item v-if="loggedIn === true" clickable @click="userStore.logout">
                <q-item-section>Logout</q-item-section>
              </q-item>
              <q-item v-else clickable @click="router.push('/login')">
                <q-item-section>Login</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Menu </q-item-label>

        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view v-if="isMinimumLoaded || router.currentRoute.value.fullPath === '/status'" />
      <div v-else class="column items-center justify-center relative-position loading-container">
        <q-circular-progress indeterminate rounded size="50px" color="primary" class="q-ma-md" />
        <q-btn
          v-if="showStatusButton"
          @click="router.push('/status')"
          label="Check Status"
          color="primary"
        />
      </div>
      <!-- Bottom Panel Component -->
      <BottomPanel v-if="isMinimumLoaded">
        <FilterOptions />
      </BottomPanel>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import BottomPanel from 'components/BottomPanel.vue'
import FilterOptions from 'components/FilterOptions.vue'
import { useUserStore } from 'src/stores/user'
import { useRouter } from 'vue-router'
import { useResourceStore } from 'src/stores/resourceStore'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const resourceStore = useResourceStore()
const router = useRouter()

const { isMinimumLoaded } = storeToRefs(resourceStore)
const { loggedIn } = storeToRefs(userStore)

const linksList = [
  {
    title: 'Tagebuch',
    caption: 'Alle Begehungen',
    icon: 'auto_stories',
    link: '/timeline',
  },
  {
    title: 'Statistiken',
    caption: 'über Begehungen',
    icon: 'bar_chart',
    link: '/stats',
  },

  {
    title: 'Gebiete',
    caption: 'Alle Gebiete',
    icon: 'interests',
    link: '/regions',
  },
  {
    title: 'Gipfel',
    caption: 'Alle Gipfel',
    icon: 'terrain',
    link: '/summits',
  },
  {
    title: 'Karte',
    caption: '',
    icon: 'map',
    link: '/map',
  },
]

const leftDrawerOpen = ref(false)
const showStatusButton = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

onMounted(() => {
  setTimeout(() => {
    if (!isMinimumLoaded.value) {
      showStatusButton.value = true
    }
  }, 3000)
})
</script>

<style scoped>
.loading-container {
  z-index: 1000;
  height: calc(100vh - 660px);
}

/* Add bottom padding to ensure content can scroll past the bottom panel */
:deep(.q-page-container) {
  padding-bottom: 600px; /* Maximum height of the bottom panel */
}
</style>
