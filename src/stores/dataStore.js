import { defineStore } from 'pinia'
import { getAscents, getClimbers, getRoutes, getSummits } from 'src/api'

const colors = ['red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue', 'light-blue', 'cyan', 'teal', 'green', 'light-green', 'lime', 'yellow', 'amber', 'orange', 'deep-orange', 'brown', 'grey', 'blue-grey']

export const useDataStore = defineStore('data', {
  state: () => ({
    ascents: [], // Array of ascent objects
    climbers: [], // Array of climber objects
    routes: [], // Array of route objects
    summits: [] // Array of summit objects
  }),
  
  getters: {
    // Ascents getters
    getAscentsForTimeline() {
      // This getter was empty in the original ascent store
    },
    getAscentsPopulated(state) {
      return state.ascents.map(ascent => {
        const ascentObj = {...ascent}
        const route = {...this.getRouteById(ascent.route)}
        const summit = {...this.getSummitById(route.summit)}
        ascentObj.route = { ...route, summit }
        ascentObj.leadClimber = {...this.getClimberById(ascent.leadClimber)}
        ascentObj.climbers = ascent.climbers.map(climber => {
          return { ...this.getClimberById(climber.climber), isAborted: climber.isAborted }
        })
        return ascentObj
      })
    },
    isAscentsLoaded(state) {
      return state.ascents.length > 0
    },
    getAscentById(state) {
      return (id) => state.ascents.find(ascent => ascent._id === id)
    },

    // Climbers getters
    isClimbersLoaded(state) {
      return state.climbers.length > 0
    },
    getClimberById(state) {
      return (id) => state.climbers.find(c => c._id === id)
    },
    getClimberIds(state) {
      return state.climbers.map(c => c._id)
    },

    // Routes getters
    isRoutesLoaded(state) {
      return state.routes.length > 0
    },
    getRouteById(state) {
      return (id) => state.routes.find(r => r._id === id)
    },

    // Summits getters
    isSummitsLoaded(state) {
      return state.summits.length > 0
    },
    getSummitById(state) {
      return (id) => state.summits.find(s => s._id === id)
    },

    // Combined loading state
    isAllDataLoaded(state) {
      return state.ascents.length > 0 && 
             state.climbers.length > 0 && 
             state.routes.length > 0 && 
             state.summits.length > 0
    }
  },

  actions: {
    // Ascents actions
    async loadAscents() {
      const response = await getAscents()
      this.ascents = response.data
    },

    // Climbers actions
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

    // Routes actions
    async loadRoutes() {
      const response = await getRoutes()
      this.routes = response.data
    },

    // Summits actions
    async loadSummits() {
      const response = await getSummits()
      this.summits = response.data
    },

    // Combined loading action
    async loadAllData() {
      await Promise.all([
        this.loadAscents(),
        this.loadClimbers(),
        this.loadRoutes(),
        this.loadSummits()
      ])
    }
  }
}) 