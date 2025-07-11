import { defineStore } from 'pinia'
import { ResourceManager } from 'src/resourceManagers/ResourceManager'
import { openDB } from 'idb'
import { JsonResourceManager } from 'src/resourceManagers/JsonResourceManager'
import { isOnline } from 'src/api'
import { OfflineMapResourceManager } from 'src/resourceManagers/OfflineMapResourceManager'
import type { IDBPDatabase as idbD } from 'idb'

export interface State {
  db: idbD | null
  resources: ResourceManager[]
}
const jsonResources = ['ascents', 'trips', 'summits', 'climbers', 'routes', 'regions']

export const useResourceStore = defineStore('resource', {
  state: () => ({
    db: null,
    resources: [],
  }),

  getters: {
    getResourceById:
      (state: State) =>
      (id: string): ResourceManager | undefined => {
        return state.resources.find((resource) => resource.id === id)
      },
    isAllLoaded: (state: State): boolean => {
      return Array.from(state.resources).every((resource) => resource.state === 'loaded')
    },
    isMinimumLoaded: (state: State): boolean => {
      return state.resources
        .filter((resource) => jsonResources.includes(resource.id))
        .every((resource) => resource.state === 'loaded')
    },
  },

  actions: {
    async checkForUpdates(this: State): Promise<boolean> {
      const res = await isOnline()
      if (res.status !== 200) {
        console.log('Cannot check for updates, no internet connection')
        return false
      }
      const results = await Promise.all(
        this.resources.map((resource) => resource.checkForUpdates()),
      )
      return results.some((result) => result === true)
    },

    async updateAll(this: State): Promise<void> {
      await Promise.all(
        this.resources.map((resource) => {
          if (resource.isOutdated()) {
            return resource.update()
          }
        }),
      )
    },

    async clearAll(this: State): Promise<void> {
      await Promise.all(this.resources.map((resource) => resource.clear()))
    },
    async loadAll(this: State): Promise<void> {
      await Promise.all(this.resources.map((resource) => resource.load()))
    },
    async init(this: State): Promise<void> {
      this.db = await openDB('gipfel-app', 5, {
        upgrade(db) {
          // Create object store if it doesn't exist
          jsonResources.forEach((resource) => {
            if (!db.objectStoreNames.contains(resource)) {
              db.createObjectStore(resource, { keyPath: 'id' })
            }
          })
          if (!db.objectStoreNames.contains('offline-map')) {
            db.createObjectStore('offline-map', { keyPath: 'id' })
          }
        },
      })
      jsonResources.forEach((resource) => {
        const resourceManager = new JsonResourceManager(resource, this.db, `${resource}`)
        this.resources.push(resourceManager)
      })
      this.resources.push(new OfflineMapResourceManager('offline-map', this.db, 'map'))
    },
  },
})
