import { defineBoot } from '#q-app/wrappers'
import { useResourceStore } from '../stores/resourceStore'
import { useUserStore } from 'src/stores/user'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli-vite/boot-files

export default defineBoot(async ({ app, router }) => {
  const userStore = useUserStore()
  const resourceStore = useResourceStore()
  const $q = app._context.app.config.globalProperties.$q
  console.log('Booting resource store...')
  resourceStore.init().then(() => {
    resourceStore.loadAll().then(() => {
      userStore.refreshAccessToken().then(() => {
        if (!resourceStore.isMinimumLoaded && userStore.loggedIn) {
          resourceStore.updateAll()
        } else if (!resourceStore.isMinimumLoaded && !userStore.loggedIn) {
          router.push('/status')
        } else if (userStore.loggedIn) {
          resourceStore.checkForUpdates().then((res) => {
            if (res) {
              $q.notify({
                message: 'Updates verfügbar',
                actions: [{ label: 'Update', handler: () => router.push('/status') }],
              })
            }
          })
        }
      })
    })
  })
})
