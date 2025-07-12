<template>
  <router-view />
</template>

<script setup>
import { onMounted, nextTick, watch } from 'vue'
import { useUserStore } from 'src/stores/user'
import { useResourceStore } from 'src/stores/resourceStore'
import { useQuasar } from 'quasar'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const resourceStore = useResourceStore()
const $q = useQuasar()
const router = useRouter()

const { loggedIn } = storeToRefs(userStore)

const checkForUpdatesAndNotify = async () => {
  resourceStore.checkForUpdates().then((res) => {
    if (res) {
      $q.notify({
        message: 'Updates verfügbar',
        actions: [{ label: 'Update', handler: () => router.push('/status') }],
      })
    }
  })
}

watch(
  () => loggedIn,
  () => {
    if (loggedIn) {
      checkForUpdatesAndNotify()
    }
  },
)

onMounted(() => {
  nextTick(() => {
    Promise.all([userStore.refreshAccessToken(), resourceStore.loadAll()]).then(() => {
      if (loggedIn.value) {
        checkForUpdatesAndNotify()
      }
    })
  })
})
</script>
