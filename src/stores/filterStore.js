import { defineStore } from 'pinia'

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
      summit: {
        selected: null
      }
    }
  }),
  getters: {
  },
  actions: {
  }
}) 