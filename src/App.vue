<template>
  <router-view />
</template>

<script setup>
import { useUserStore } from 'src/stores/user'
import { dataFields, useDataStore } from 'src/stores/dataStore'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const userStore = useUserStore()
const dataStore = useDataStore()
const router = useRouter()

const promises = []
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
    promises.push(dataStore.getAllRemoteDates())
  }
  Promise.all(promises).finally(() => {
    dataFields.forEach((field) => {
      if (dataStore.needUpdate(field) && !notifySend) {
        $q.notify({
          message: 'Updates verfügbar',
          actions: [{ label: 'Update', handler: router.push('/status') }],
        })
        notifySend = true
      }
    })
  })
})
</script>
