import { defineStore } from 'pinia'
import { getAscents, getClimbers, getRoutes, getSummits, getRegions, getTrips } from 'src/api'
import { useFilterStore } from 'src/stores/filterStore'
import { NORMAL_SCALA } from 'src/helper/route'

export const useDataStore = defineStore('data', {
  state: () => ({
    ascents: [], // Array of ascent objects
    climbers: [], // Array of climber objects
    routes: {}, // Object of route objects grouped by summit ID
    summits: [], // Array of summit objects
    regions: [], // Array of region objects
    trips: [],
    isLoaded: false,
  }),

  getters: {
    f_AscentsPerRegion(state) {
      const map = {}
      state.f_Ascents.forEach((ascent) => {
        const regionId = ascent.route.regionID
        if (!map[regionId]) map[regionId] = 0
        map[regionId]++
      })
      return map
    },
    f_AscentsPerSummit(state) {
      const map = {}
      state.f_Ascents.forEach((ascent) => {
        const summitId = ascent.route.summitID
        if (!map[summitId]) map[summitId] = 0
        map[summitId]++
      })
      return map
    },
    f_AscentsPerRoute(state) {
      const map = {}
      state.f_Ascents.forEach((ascent) => {
        const routeId = ascent.route._id
        if (!map[routeId]) map[routeId] = 0
        map[routeId]++
      })
      return map
    },
    f_Ascents(state) {
      const filterStore = useFilterStore()
      if (!filterStore.applyFilter) return state.ascents
      return state.ascents
        .filter((ascent) => {
          if (!filterStore.filters.ascents.allowedTypes.includes('aborted') && ascent.isAborted) {
            return false
          }
          if (!filterStore.filters.ascents.allowedTypes.includes('solo') && ascent.isSolo) {
            return false
          }
          if (!filterStore.filters.ascents.allowedTypes.includes('topRope') && ascent.isTopRope) {
            return false
          }
          if (!filterStore.filters.ascents.allowedTypes.includes('lead') && ascent.leadClimber) {
            return false
          }
          return true
        })
        .filter((ascent) => {
          const ascentDate = new Date(ascent.date.split('T')[0])
          if (
            filterStore.filters.ascents.dateMin &&
            ascentDate < filterStore.filters.ascents.dateMin
          ) {
            return false
          }
          if (
            filterStore.filters.ascents.dateMax &&
            ascentDate > filterStore.filters.ascents.dateMax
          ) {
            return false
          }
          return true
        })
        .filter((ascent) => {
          const isAllowed = (climber) =>
            filterStore.filters.ascents.allowedTypes.includes('aborted') ||
            climber.isAborted === false

          if (filterStore.filters.climbers.selected.length == 0) {
            return true
          }
          if (
            filterStore.filters.climbers.mode === 'or' &&
            !filterStore.filters.climbers.selected.some((climber) =>
              ascent.climbers.filter(isAllowed).some((c) => c._id === climber),
            )
          ) {
            return false
          }
          if (
            filterStore.filters.climbers.mode === 'and' &&
            !filterStore.filters.climbers.selected.every((climber) =>
              ascent.climbers.filter(isAllowed).some((c) => c._id === climber),
            )
          ) {
            return false
          }
          if (
            filterStore.filters.climbers.mode === 'exact' &&
            (!filterStore.filters.climbers.selected.every((climber) =>
              ascent.climbers.filter(isAllowed).some((c) => c._id === climber),
            ) ||
              ascent.climbers.length !== filterStore.filters.climbers.selected.length)
          ) {
            return false
          }
          if (
            filterStore.filters.climbers.mode === 'not' &&
            filterStore.filters.climbers.selected.some((climber) =>
              ascent.climbers.filter(isAllowed).some((c) => c._id === climber),
            )
          ) {
            return false
          }
          return true
        })
        .filter((ascent) => {
          if (ascent.leadClimber === null) return true
          if (
            filterStore.filters.climbers.lead !== null &&
            ascent.leadClimber._id !== filterStore.filters.climbers.lead
          ) {
            return false
          }
          return true
        })
        .filter((ascent) => {
          if (filterStore.filters.route.route !== null) {
            return ascent.route._id === filterStore.filters.route.route
          } else if (filterStore.filters.route.summit !== null) {
            return ascent.route.summitID === filterStore.filters.route.summit
          } else if (filterStore.filters.route.region !== null) {
            return ascent.route.regionID === filterStore.filters.route.region
          }
          return true
        })
        .filter((ascent) => {
          // Grade filter
          const grade = NORMAL_SCALA.indexOf(ascent.route.difficulty.normal)
          if (grade === -1) return true
          if (
            filterStore.filters.grade.normal.min !== null &&
            grade < filterStore.filters.grade.normal.min
          )
            return false
          if (
            filterStore.filters.grade.normal.max !== null &&
            grade > filterStore.filters.grade.normal.max
          )
            return false
          return true
        })
        .filter((ascent) => {
          if (filterStore.filters.route.tags.star === null) return true
          if (filterStore.filters.route.tags.star === 'none' && ascent.route.stars !== 0)
            return false
          if (filterStore.filters.route.tags.star === 'one' && ascent.route.stars !== 1)
            return false
          if (filterStore.filters.route.tags.star === 'two' && ascent.route.stars !== 2)
            return false
          if (filterStore.filters.route.tags.star === 'oneOrTwo' && ascent.route.stars === 0)
            return false
          return true
        })
        .filter((ascent) => {
          if (filterStore.filters.route.tags.unsecure === null) return true
          if (filterStore.filters.route.tags.unsecure === 'false' && ascent.route.unsecure === true)
            return false
          if (filterStore.filters.route.tags.unsecure === 'true' && ascent.route.unsecure === false)
            return false
          return true
        })
    },
    //TODO: maybe move to backend
    populatedTrips(state) {
      return state.trips.map((trip) => {
        return {
          ...trip,
          days: trip.days.map((day) => {
            return {
              ...day,
              ascents: day.ascents.map((id) => state.ascents.find((a) => a._id === id)),
            }
          }),
        }
      })
    },
    f_PopulatedTrips(state) {
      return state.trips
        .map((trip) => {
          return {
            ...trip,
            days: trip.days
              .map((day) => {
                return {
                  ...day,
                  ascents: day.ascents
                    .map((id) => state.f_Ascents.find((a) => a._id === id))
                    .filter((ascent) => ascent !== undefined),
                }
              })
              .filter((day) => day.ascents.length > 0),
          }
        })
        .filter((trip) => trip.days.length > 0)
    },
  },

  actions: {
    // Combined loading action
    async loadData() {
      const startTime = performance.now()
      // Load data from API
      const [
        ascentsResponse,
        climbersResponse,
        routesResponse,
        summitsResponse,
        regionsResponse,
        tripsResponse,
      ] = await Promise.all([
        getAscents(),
        getClimbers(),
        getRoutes(),
        getSummits(),
        getRegions(),
        getTrips(),
      ])
      console.log('Data Download time: ', performance.now() - startTime, 'ms')
      const startTime2 = performance.now()

      this.regions = regionsResponse.data
      this.summits = summitsResponse.data
      this.routes = routesResponse.data[0]
      this.climbers = climbersResponse.data
      this.ascents = ascentsResponse.data
      this.trips = tripsResponse.data

      console.log('Data Processing time: ', performance.now() - startTime2, 'ms')

      this.isLoaded = true
    },
  },
})
