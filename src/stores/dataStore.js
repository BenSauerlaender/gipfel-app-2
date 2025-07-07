import { defineStore } from 'pinia'
import { getlastModified, getData } from 'src/api'
import { useFilterStore } from 'src/stores/filterStore'
import { NORMAL_SCALA } from 'src/helper/route'

import { openDB } from 'idb'

// Initialize the database
async function initDB() {
  const db = await openDB('gipfel-app', 1, {
    upgrade(db) {
      // Create object store if it doesn't exist
      if (!db.objectStoreNames.contains('data')) {
        db.createObjectStore('data', { keyPath: 'id' })
      }
    },
  })
  return db
}

export const dataFields = ['ascents', 'climbers', 'routes', 'summits', 'regions', 'trips']

export const useDataStore = defineStore('data', {
  state: () => ({
    ascents: [],
    climbers: [], // Array of climber objects
    routes: {}, // Object of route objects grouped by summit ID
    summits: [], // Array of summit objects
    regions: [], // Array of region objects
    trips: [],
    meta: {
      ascents: {
        status: '',
        date: null,
        remoteDate: null,
      },
      climbers: {
        status: '',
        date: null,
        remoteDate: null,
      },
      routes: {
        status: '',
        date: null,
        remoteDate: null,
      },
      summits: {
        status: '',
        date: null,
        remoteDate: null,
      },
      regions: {
        status: '',
        date: null,
        remoteDate: null,
      },
      trips: {
        status: '',
        date: null,
        remoteDate: null,
      },
    },
  }),

  getters: {
    getDataLength(state) {
      return (field) => {
        if (!state[field]) return 0
        return Array.isArray(state[field]) ? state[field].length : Object.keys(state[field]).length
      }
    },
    isLoaded(state) {
      return (
        dataFields.every((field) => state.meta[field].status === 'loaded') &&
        dataFields.every((field) => this.getDataLength(field) > 0)
      )
    },
    needUpdate(state) {
      return (dataName) => {
        if (!state.meta[dataName].remoteDate) {
          return false // No remote date means no update needed
        }
        if (!state.meta[dataName].date) {
          return true // No local date means data is outdated
        }
        const remoteDate = new Date(state.meta[dataName].remoteDate)
        const localDate = new Date(state.meta[dataName].date)
        return remoteDate > localDate
      }
    },
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
    // Load data from API and save to IndexedDB and load into state
    async loadDataFromApi(dataName) {
      try {
        this.meta[dataName].status = 'downloading'
        console.log(`Loading ${dataName} data from API...`)
        const response = await getData(dataName)

        if (response?.data?.data?.length === 1) response.data.data = response.data.data[0]
        if (!response || !response.data || !response.data.data || response.data.data.length === 0) {
          throw new Error(`No data received for ${dataName}`)
        }

        this.meta[dataName].status = 'saving'
        console.log(`Saving ${dataName} data to IndexedDB...`)
        const db = await initDB()
        await db.put('data', { id: dataName, data: response.data })

        this.meta[dataName].status = 'loading'
        this.meta[dataName].date = response.data.date || new Date().toISOString()
        this[dataName] = response.data.data
        this.meta[dataName].status = 'loaded'
        console.log(`${dataName} data loaded successfully`)
      } catch (error) {
        console.error(`Error loading ${dataName} data from API:`, error)
        this.meta[dataName].status = 'error'
      }
    },
    // Load data from IndexedDB
    async loadDataFromIndexedDB(dataName) {
      try {
        this.meta[dataName].status = 'loading'
        console.log(`Loading ${dataName} data from IndexedDB...`)
        const db = await initDB()
        const { id, data } = await db.get('data', dataName)
        if (!data || !data.data || data.data.length === 0) {
          throw new Error(`No data found for ${dataName} in IndexedDB`)
        }
        this[dataName] = data.data
        this.meta[dataName].date = data.date
        this.meta[dataName].status = 'loaded'
        console.log(`${dataName} data loaded successfully from IndexedDB`)
      } catch (error) {
        this.meta[dataName].status = ''
        throw error
      }
    },
    // check if data is outdated
    async getRemoteDate(dataName) {
      const lastModifiedResponse = await getlastModified(dataName)
      if (!lastModifiedResponse || !lastModifiedResponse.data) {
        this.meta[dataName].remoteDate = null
        throw new Error(`No last modified date received for ${dataName}`)
      }
      this.meta[dataName].remoteDate = lastModifiedResponse.data
    },
    async getAllRemoteDates() {
      for (const dataName of dataFields) {
        await this.getRemoteDate(dataName)
      }
    },
  },
})
