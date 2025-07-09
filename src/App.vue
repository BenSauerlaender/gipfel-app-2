<template>
  <router-view />
</template>

<script setup>
import { useUserStore } from 'src/stores/user'
import { dataFields, useDataStore } from 'src/stores/dataStore'
import { useResourceOldStore } from 'src/stores/resourceStoreOld'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const userStore = useUserStore()
const dataStore = useDataStore()
const resourceOldStore = useResourceOldStore()
const router = useRouter()

const notifyUpdateAvailable = () => {
  $q.notify({
    message: 'Updates verfügbar',
    actions: [{ label: 'Update', handler: router.push('/status') }],
  })
}

const promises = []

promises.push(resourceOldStore.fetchStatus())

dataFields.forEach((field) => {
  promises.push(
    dataStore.loadDataFromIndexedDB(field).catch((error) => {
      console.log(`${field} data not found in IndexedDB:`)
    }),
  )
})
let notifySend = false

userStore.refreshAccessToken().finally(() => {
  if (userStore.loggedIn) {
    promises.push(dataStore.fetchAllRemoteLastModified())
    promises.push(resourceOldStore.fetchAllRemoteLastModified())
  }
  Promise.all(promises).finally(() => {
    dataFields.forEach((field) => {
      if (dataStore.needUpdate(field) && !notifySend) {
        notifyUpdateAvailable()
        notifySend = true
      }
    })
    if (resourceOldStore.needUpdate && !notifySend) {
      notifyUpdateAvailable()
      notifySend = true
    }
  })
})
</script>
