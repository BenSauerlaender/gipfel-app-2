import { defineStore } from 'pinia'
import { useDataStore } from 'src/stores/dataStore'

const dataStore = useDataStore()

export const useFilterStore = defineStore('filter', {
  state: () => ({
    filters: {
      ascents: {
        allowedTypes: ['lead', 'solo', 'topRope', 'aborted']
      },
      climbers: {
        selected: [],
        mode: 'or'
      },
      route: {
        region: null,
        summit: null,
        route: null
      }
    }
  }),
  getters: {
  },
  actions: {
  }
}) 