import { defineStore } from 'pinia'
import api, { getlastModified, getMapFonts } from 'src/api'

import { initDB } from 'src/helper/db'
import untar from 'js-untar'

export const useResourceOldStore = defineStore('resourceOld', {
  state: () => ({
    meta: {
      mapFonts: {
        dbStoreName: 'map-fonts',
        apiRoute: 'map/fonts',
        status: '',
        date: null,
        remoteDate: null,
      },
    },
  }),

  getters: {
    needUpdate(state) {
      if (!state.meta.mapFonts.remoteDate) {
        return false // No remote date means no update needed
      }
      if (!state.meta.mapFonts.date) {
        return true // No local date means data is outdated
      }
      const remoteDate = new Date(state.meta.mapFonts.remoteDate)
      const localDate = new Date(state.meta.mapFonts.date)
      return remoteDate > localDate
    },
  },

  actions: {
    // Load data from API and save to IndexedDB and load into state
    async storeMapFontsFromApi() {
      try {
        this.meta.mapFonts.status = 'downloading'
        console.log(`Loading mapFonts from API...`)
        const response = await getMapFonts()

        console.log(response)

        if (!response || !response.data || response.status !== 200) {
          throw new Error(`No data received for mapFonts`)
        }

        this.meta.mapFonts.status = 'saving'

        const extractedFiles = await untar(response.data)
        const db = await initDB()
        db.clear('map-fonts') // Ensure we start fresh
        let count = 0
        for (const file of extractedFiles) {
          if (file.name.startsWith('fonts/') && file.name.endsWith('.pbf')) {
            const fontId = file.name.replace('fonts/', '').replace('.pbf', '')
            await db.put('map-fonts', { id: fontId, data: file.buffer })
            count++
          }
        }
        const date = new Date().toISOString()
        await db.put('map-fonts', { id: 'status', data: { status: 'loaded', date } })
        this.meta.mapFonts.status = 'loaded'
        this.meta.mapFonts.date = date
        console.log(`Stored ${count} font files to IndexedDB`)

        console.log(`mapFonts data loaded successfully`)
      } catch (error) {
        console.error(`Error loading mapFonts data from API:`, error)
        this.meta.mapFonts.status = 'error'
      }
    },

    async getMapFontsGlyph(font, range) {
      const db = await initDB()
      const res = await db.get('map-fonts', font + '/' + range)

      // log requests //TODO: evaluate and reduce fonts on server
      const requests = (await db.get('map-fonts', 'requests')) || []
      if (!requests.includes(font + '/' + range)) {
        requests.push(font + '/' + range)
        await db.put('map-fonts', { id: 'requests', data: requests })
      }

      console.log('Fetching glyphs for font:', font, 'range:', range)
      if (!res || !res.data) {
        throw new Error(`No glyphs found for font ${font} and range ${range}`)
      }
      return res.data
    },

    async fetchStatus() {
      const db = await initDB()
      const res = await db.get('map-fonts', 'status')
      if (!res || !res.data) {
        this.meta.mapFonts.status = ''
      } else {
        this.meta.mapFonts.status = res.data
      }
    },

    // check if data is outdated
    async fetchRemoteLastModified(resourceName) {
      const lastModifiedResponse = await getlastModified(this.meta[resourceName].apiRoute)
      if (!lastModifiedResponse || !lastModifiedResponse.data) {
        this.meta[resourceName].remoteDate = null
        throw new Error(`No last modified date received for ${resourceName}`)
      }
      this.meta[resourceName].remoteDate = lastModifiedResponse.data
    },
    async fetchAllRemoteLastModified() {
      return this.fetchRemoteLastModified('mapFonts')
    },
  },
})
