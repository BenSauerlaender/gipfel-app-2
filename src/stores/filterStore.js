import { defineStore } from 'pinia'

export const useFilterStore = defineStore('filter', {
  state: () => ({
    filters: {
      ascents: {
        allowedTypes: ['lead', 'solo', 'topRope', 'aborted'],
        dateMin: null,
        dateMax: null
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