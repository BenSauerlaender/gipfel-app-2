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
        mode: 'or',
        lead: null
      },
      route: {
        region: null,
        summit: null,
        route: null,
        tags: {
          star: null,
          unsecure: null
        }
      },
      grade: {
        min: null,
        max: null
      }
    }
  }),
  getters: {
  },
  actions: {
  }
}) 