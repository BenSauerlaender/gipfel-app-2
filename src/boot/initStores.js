import { defineBoot } from '#q-app/wrappers'
import { useResourceStore } from '../stores/resourceStore'

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli-vite/boot-files

export default defineBoot(async () => {
  const resourceStore = useResourceStore()
  resourceStore.init()
})
