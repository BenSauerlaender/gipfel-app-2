<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Quasar App
        </q-toolbar-title>

        <q-btn round flat icon="more_vert">
            <q-menu auto-close :offset="[110, 0]">
              <q-list style="min-width: 150px">
                <q-item clickable @click="handleLogout">
                  <q-item-section>Logout</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Menu
        </q-item-label>

        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view v-if="isLoaded" />
      <q-inner-loading v-else showing label="Loading..." label-color="primary" color="primary" class="big-loading" />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import { useUserStore } from 'src/stores/user'
import { useRouter } from 'vue-router'
import { useDataStore } from 'src/stores/dataStore'

const dataStore = useDataStore()
const userStore = useUserStore()
const router = useRouter()

const isLoaded = ref(false)

dataStore.loadData().then(() => {
  console.log('all data loaded')
  isLoaded.value = true
})

const linksList = [
  {
    title: 'Timeline',
    caption: 'Alle Begehungen',
    icon: 'timeline',
    link: '/timeline'
  },
  {
    title: 'Stats',
    caption: 'Stats',
    icon: 'bar_chart',
    link: '/stats'
  },
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev'
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework'
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev'
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev'
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev'
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev'
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev'
  }
]

const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function handleLogout() {
  userStore.logout().then(() => {
    router.push('/login')
  })
}
</script>

<style scoped>
.big-loading {
  justify-content: center !important;
  align-items: center !important;
  z-index: 1000;
}
.big-loading .q-inner-loading__content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.big-loading .q-spinner {
  width: 80px !important;
  height: 80px !important;
}
.big-loading .q-inner-loading__label {
  font-size: 2rem;
  font-weight: bold;
  margin-top: 24px;
}
</style>
