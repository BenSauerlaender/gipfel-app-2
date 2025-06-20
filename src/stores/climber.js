import { defineStore } from 'pinia'
import { getClimbers } from 'src/api'

const colors = ['red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue', 'light-blue', 'cyan', 'teal', 'green', 'light-green', 'lime', 'yellow', 'amber', 'orange', 'deep-orange', 'brown', 'grey', 'blue-grey']

export const useClimberStore = defineStore('climber', {
  state: () => ({
    climbers: [] // Array of climber objects, e.g. { id, name }
  }),

  getters: {
    isClimbersLoaded(state) {
      return state.climbers.length > 0
    },
    getClimberById(state) {
      return (id) => state.climbers.find(c => c._id === id)
    },
    getClimberIds(state) {
      return state.climbers.map(c => c._id)
    }
  },

  actions: {
    async loadClimbers() {
      function seededHash(str) {
        let hash = 0
        for (let i = 0; i < str.length; i++) {
          hash = ((hash << 5) - hash) + str.charCodeAt(i)
          hash |= 0 // Convert to 32bit integer
        }
        return Math.abs(hash)
      }

      const response = await getClimbers()
      this.climbers = response.data.map(climber => {
        const hash = seededHash(climber.firstName + climber.lastName)
        climber.color = colors[hash % colors.length]
        climber.shortName = climber.firstName.slice(0, 2)
        return climber
      })
    },
  }
}) 