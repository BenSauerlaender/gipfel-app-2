import { defineStore } from 'pinia'

export const useAscentFormStore = defineStore('ascentForm', {
  state: () => ({
    lastAscentDate: new Date().toISOString().slice(0, 10),
  }),

  actions: {
    setLastAscentDate(date) {
      this.lastAscentDate = date
    },
  },
})
