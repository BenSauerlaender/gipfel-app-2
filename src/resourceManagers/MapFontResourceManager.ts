//baseclass to manage resources like ascents, trips, summits, etc

import api from 'src/api'
import { ResourceManager } from './ResourceManager'
import untar from 'js-untar'

export class MapFontResourceManager extends ResourceManager {
  async update(): Promise<void> {
    try {
      this.state = 'downloading'
      console.log(`Loading ${this.id} data from API...`)
      const response = await api.get(`/api/${this.apiUrl}`, {
        responseType: 'arraybuffer',
        headers: {
          Accept: 'application/gzip',
        },
      })

      if (!response || !response.data || response.status !== 200) {
        throw new Error(`No data received for ${this.id}`)
      }
      this.state = 'processing'
      console.log(`Saving ${this.id} data to IndexedDB...`)
      const extractedFiles = await untar(response.data)
      const tx = this.db.transaction(this.id, 'readwrite')
      const store = tx.objectStore(this.id)
      let count = 0
      const date = new Date()
      for (const file of extractedFiles) {
        if (file.name.startsWith('fonts/') && file.name.endsWith('.pbf')) {
          const fontId = file.name.replace('fonts/', '').replace('.pbf', '')
          await store.put({ id: fontId, value: file.buffer })
          count++
        }
      }
      await store.put({ id: 'date', value: date })
      await store.put({ id: 'count', value: count })
      await tx.done

      this.entryCount = count
      this.localLastModified = date

      this.state = 'loaded'
      this.error = null
      console.log(`${this.id} data loaded successfully`)
    } catch (error) {
      console.error(`Error updating ${this.id} data`, error)
      this.error = error
    }
  }
  // Load data from IndexedDB
  async load() {
    try {
      console.log(`Loading ${this.id} data from IndexedDB...`)
      const dateResponse = await this.db.get(this.id, 'date')
      const countResponse = await this.db.get(this.id, 'count')
      this.entryCount = countResponse?.value ?? null
      this.localLastModified = dateResponse?.value ?? null

      if (this.entryCount > 0) {
        this.state = 'loaded'
      }

      console.log(`${this.id} data loaded successfully from IndexedDB`)
    } catch (error) {
      console.error(`Error loading ${this.id} data from IndexedDB`, error)
    }
  }
  async clear(): Promise<void> {
    return await super.clear().then(() => {})
  }
  async getMapFontsGlyph(font, range) {
    const res = await this.db.get('map-fonts', font + '/' + range)

    console.log('Fetching glyphs for font:', font, 'range:', range)
    if (!res || !res.value) {
      throw new Error(`No glyphs found for font ${font} and range ${range}`)
    }
    return res.value
  }
}
