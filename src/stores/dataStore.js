import { defineStore } from 'pinia'
import { getAscents, getClimbers, getRoutes, getSummits, getRegions } from 'src/api'
import { useFilterStore } from 'src/stores/filterStore'
import { SCALA } from 'src/helper/route'

const colors = ['red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue', 'light-blue', 'cyan', 'teal', 'green', 'light-green', 'lime', 'yellow', 'amber', 'orange', 'deep-orange', 'brown', 'grey', 'blue-grey']

export const useDataStore = defineStore('data', {
  state: () => ({
    ascents: [], // Array of ascent objects
    climbers: [], // Array of climber objects
    routes: [], // Array of route objects
    summits: [], // Array of summit objects
    regions: [], // Array of region objects
    trips: [],
    isLoaded: false
  }),
  
  getters: {
    filteredAscents(state) {
        const filterStore = useFilterStore()
        return state.ascents
        .filter(ascent => {
            if (!filterStore.filters.ascents.allowedTypes.includes('aborted') && ascent.isAborted) { return false }
            if (!filterStore.filters.ascents.allowedTypes.includes('solo') && ascent.isSolo) { return false }
            if (!filterStore.filters.ascents.allowedTypes.includes('topRope') && ascent.isTopRope) { return false }
            if (!filterStore.filters.ascents.allowedTypes.includes('lead') && ascent.leadClimber) { return false }
            return true
        })
        .filter(ascent => {
            const ascentDate = new Date(ascent.date.split('T')[0])
            if (filterStore.filters.ascents.dateMin && ascentDate < filterStore.filters.ascents.dateMin) {
                return false
            }
            if (filterStore.filters.ascents.dateMax && ascentDate > filterStore.filters.ascents.dateMax) {
                return false
            }
            return true
        })
        .filter(ascent => {
            const isAllowed = (climber) => (filterStore.filters.ascents.allowedTypes.includes('aborted') || climber.isAborted === false)

            if (filterStore.filters.climbers.selected.length == 0) { return true  }
            if (filterStore.filters.climbers.mode === 'or' && 
                !filterStore.filters.climbers.selected.some(climber => ascent.climbers.filter(isAllowed).some(c => c._id === climber))) { 
                    return false 
            }
            if (filterStore.filters.climbers.mode === 'and' && 
                !filterStore.filters.climbers.selected.every(climber => ascent.climbers.filter(isAllowed).some(c => c._id === climber))) { 
                    return false 
            }
            if (filterStore.filters.climbers.mode === 'exact' && 
                (!filterStore.filters.climbers.selected.every(climber => ascent.climbers.filter(isAllowed).some(c => c._id === climber)) ||
                ascent.climbers.length !== filterStore.filters.climbers.selected.length)) { 
                    return false 
            }
            if (filterStore.filters.climbers.mode === 'not' && 
                filterStore.filters.climbers.selected.some(climber => ascent.climbers.filter(isAllowed).some(c => c._id === climber))) { 
                    return false 
            }
            return true
        })
        .filter(ascent => {
            if(ascent.leadClimber === null) return true
            if(filterStore.filters.climbers.lead !== null && ascent.leadClimber._id !== filterStore.filters.climbers.lead){
                return false
            }
            return true
        })
        .filter(ascent => {
            if(filterStore.filters.route.route !== null){
                return ascent.route._id === filterStore.filters.route.route
            }else if(filterStore.filters.route.summit !== null){
                return ascent.route.summit._id === filterStore.filters.route.summit
            }else if(filterStore.filters.route.region !== null){
                return ascent.route.summit.region._id === filterStore.filters.route.region
            }
            return true
        })
        .filter(ascent => {
            // Grade filter
            const grade = SCALA.indexOf(ascent.route.difficulty.normal)
            if(grade === -1) return true
            if(filterStore.filters.grade.min !== null && grade < filterStore.filters.grade.min) return false
            if(filterStore.filters.grade.max !== null && grade > filterStore.filters.grade.max) return false
            return true
        })
        .filter(ascent => {
            if(filterStore.filters.route.tags.star === null) return true
            if(filterStore.filters.route.tags.star === 'none' && ascent.route.stars !== 0) return false
            if(filterStore.filters.route.tags.star === 'one' && ascent.route.stars !== 1) return false
            if(filterStore.filters.route.tags.star === 'two' && ascent.route.stars !== 2) return false
            if(filterStore.filters.route.tags.star === 'oneOrTwo' && ascent.route.stars === 0) return false
            return true
        })
        .filter(ascent => {
            if(filterStore.filters.route.tags.unsecure === null) return true
            if(filterStore.filters.route.tags.unsecure === 'false' && ascent.route.unsecure === true) return false
            if(filterStore.filters.route.tags.unsecure === 'true' && ascent.route.unsecure === false) return false
            return true
        })
    },
    populatedTrips(state) {
      return state.trips.map(trip => {
        return {
             ...trip, 
             days: trip.days.map(day => { 
                return {
                    ...day, 
                    ascents: day.ascents.map(id =>  state.ascents.find(a => a._id === id))
                } 
            })
        }
      })
    },
    filteredPopulatedTrips(state) {
      return state.trips.map(trip => {
        return {
             ...trip, 
             days: trip.days.map(day => { 
                return {
                    ...day, 
                    ascents: day.ascents.map(id =>  state.filteredAscents.find(a => a._id === id)).filter(ascent => ascent !== undefined)
                } 
            }).filter(day => day.ascents.length > 0)
        }
      }).filter(trip => trip.days.length > 0)
    },
    summitRouteCounts(state) {
      return state.routes.reduce((counts, route) => {
        counts.set(route.summit._id, (counts.get(route.summit._id) || 0) + 1)
        return counts
      }, new Map())
    }
  },

  actions: {
    // Combined loading action
    async loadData() {
      function seededHash(str) {
        let hash = 0
        for (let i = 0; i < str.length; i++) {
          hash = ((hash << 5) - hash) + str.charCodeAt(i)
          hash |= 0 // Convert to 32bit integer
        }
        return Math.abs(hash)
      }

      const startTime = new Date().getTime()
      // Load data from API
      const [ascentsResponse, climbersResponse, routesResponse, summitsResponse, regionsResponse] = await Promise.all([
        getAscents(),
        getClimbers(),
        getRoutes(),
        getSummits(),
        getRegions()
      ])
      console.log('Data Download time: ', new Date().getTime() - startTime, 'ms')
      const startTime2 = new Date().getTime()

      this.regions = regionsResponse.data

      this.summits = summitsResponse.data.map(summit => {
        summit.region = this.regions.find(region => region._id === summit.region)
        return summit
      })

      // Populate routes with summits
      this.routes = routesResponse.data.map(route => {
        route.summit = this.summits.find(summit => summit._id === route.summit)
        return route
      })

      // Populate climbers with colors and short names
      this.climbers = climbersResponse.data.map(climber => {
        const hash = seededHash(climber.firstName + climber.lastName)
        climber.color = colors[hash % colors.length]
        climber.shortName = climber.firstName.slice(0, 2)
        return climber
      })

      // Populate ascents with routes and climbers
      this.ascents = ascentsResponse.data.map(ascent => {
        ascent.route = this.routes.find(route => route._id === ascent.route)
        ascent.climbers = ascent.climbers.map(climber => {
          return { ...this.climbers.find(c => c._id === climber.climber), isAborted: climber.isAborted }
        })
        if (ascent.leadClimber) {
          ascent.leadClimber = this.climbers.find(climber => climber._id === ascent.leadClimber)
        }
        return ascent
      })
      this.trips = this.computeTrips(this.ascents)

      // Sort climbers by number of ascents (descending)
      const climberCount = {};
      this.ascents.forEach(ascent => {
        ascent.climbers.forEach(c => {
          climberCount[c._id] = (climberCount[c._id] || 0) + 1;
        });
      });
      this.climbers.sort((a, b) => (climberCount[b._id] || 0) - (climberCount[a._id] || 0));
      console.log(this.climbers.map(climber => climber.firstName));

      console.log('Data Processing time: ', new Date().getTime() - startTime2, 'ms')

      this.isLoaded = true
    },

    computeTrips(ascents) {
        // Group ascents by day (YYYY-MM-DD)
        const ascentsByDay = ascents
            .map(ascent => { return { _id: ascent._id, date: ascent.date } })
            .toSorted((a, b) => new Date(a.date) - new Date(b.date))
            .reduce((grouped, ascent) => {
            const dayString = new Date(ascent.date).toISOString().slice(0, 10)
            if (!grouped[dayString]) grouped[dayString] = []
            grouped[dayString].push(ascent)
            return grouped
            }, {})

        const sortedDays = Object.keys(ascentsByDay).toSorted()
        let trips = []
        let currentTrip = []
        let lastDayDate = null

        // Split days into trips, allowing max 1 off day between
        for (const dayString of sortedDays) {
            const currentDayDate = new Date(dayString)
            if (
            lastDayDate &&
            (currentDayDate - lastDayDate) / (1000 * 60 * 60 * 24) > 4 // more than 3 off day
            ) {
            if (currentTrip.length) trips.push(currentTrip)
            currentTrip = []
            }
            currentTrip.push({ name: dayString, ascents: ascentsByDay[dayString].map(ascent => { return ascent._id })})
            lastDayDate = currentDayDate
        }
        if (currentTrip.length) trips.push(currentTrip)

        // Add trip name (months/year) to each trip
        return trips.map((trip) => {
            const months = [...new Set(trip.map(dayObj => new Date(dayObj.name).toLocaleString('de-DE', { month: 'long' })))]
            const year = new Date(trip[0].name).toLocaleString('de-DE', { year: 'numeric' })
            const name = months.join('/') + ' ' + year
            return {name, days:trip }
        })
    }
  }
}) 