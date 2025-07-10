<template>
  <router-view />
</template>

<script setup>
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useResourceStore } from './stores/resourceStore'
import { useUserStore } from './stores/user'
import { onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'

const $q = useQuasar()
const resourceStore = useResourceStore()
const router = useRouter()
const userStore = useUserStore()

const { loggedIn } = storeToRefs(userStore)

const checkForUpdatesAndNotify = async () => {
  const res = await resourceStore.checkForUpdates()
  if (res) {
    $q.notify({
      message: 'Updates verfügbar',
      actions: [{ label: 'Update', handler: () => router.push('/status') }],
    })
  }
}

watch(
  () => loggedIn,
  () => {
    if (loggedIn) {
      checkForUpdatesAndNotify()
    }
  },
)

onMounted(async () => {
  await Promise.all([userStore.refreshAccessToken(), resourceStore.loadAll()]).then(() => {
    if (loggedIn.value) {
      checkForUpdatesAndNotify()
    }
  })
})
</script>
