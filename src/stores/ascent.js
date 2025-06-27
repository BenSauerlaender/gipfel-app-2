import { defineStore } from 'pinia'
import { getAscents } from 'src/api'
import { useRouteStore } from 'src/stores/route'
import { useSummitStore } from 'src/stores/summit'
import { useClimberStore } from 'src/stores/climber'

const routeStore = useRouteStore()
const summitStore = useSummitStore()
const climberStore = useClimberStore()

export const useAscentStore = defineStore('ascent', {
  state: () => ({
    ascents: [] // Array of ascent objects
  }),
  
  getters: {
    getAscentsForTimeline() {
    },
    getAscentsPopulated() {
      return this.ascents.map(ascent => {
        const ascentObj = {...ascent}
        const route = {...routeStore.getRouteById(ascent.route)}
        const summit = {...summitStore.getSummitById(route.summit)}
        ascentObj.route = { ...route, summit }
        ascentObj.leadClimber = {...climberStore.getClimberById(ascent.leadClimber)}
        ascentObj.climbers = ascent.climbers.map(climber => {
          return { ...climberStore.getClimberById(climber.climber), isAborted: climber.isAborted }
        })
        return ascentObj
      })
    },
    isAscentsLoaded() {
      return this.ascents.length > 0
    },
    getAscentById() {
      return (id) => this.ascents.find(ascent => ascent._id === id)
    },
  },

  actions: {
    async loadAscents() {
      const response = await getAscents()
      this.ascents = response.data
    },

  }
}) 