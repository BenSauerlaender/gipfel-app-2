import { defineStore } from 'pinia'
import { getClimbers } from 'src/api'

const colors = ['red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue', 'light-blue', 'cyan', 'teal', 'green', 'light-green', 'lime', 'yellow', 'amber', 'orange', 'deep-orange', 'brown', 'grey', 'blue-grey']

export const useClimberStore = defineStore('climber', {
  state: () => ({
    climbers: [] // Array of climber objects, e.g. { id, name }
  }),

  getters: {
    isClimbersLoaded() {
      return this.climbers.length > 0
    }
  },

  actions: {
    getClimberById(id) {
      return this.climbers.find(c => c._id === id)
    },

    getClimberIds() {
      return this.climbers.map(c => c._id)
    },

    async loadClimbers() {
      const response = await getClimbers()
      function seededHash(str) {
        let hash = 0
        for (let i = 0; i < str.length; i++) {
          hash = ((hash << 5) - hash) + str.charCodeAt(i)
          hash |= 0 // Convert to 32bit integer
        }
        return Math.abs(hash)
      }
      this.climbers = response.data.map(climber => {
        const hash = seededHash(climber.firstName + climber.lastName)
        climber.color = colors[hash % colors.length]
        climber.shortName = climber.firstName.slice(0, 2)
        return climber
      })
    },
  }
}) 