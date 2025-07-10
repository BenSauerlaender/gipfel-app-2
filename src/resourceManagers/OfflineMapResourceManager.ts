//baseclass to manage resources like ascents, trips, summits, etc

import api from 'src/api'
import { ResourceManager } from './ResourceManager'
import untar from 'js-untar'

export class OfflineMapResourceManager extends ResourceManager {
  fontFileCount: number = 0
  styleJson = null
  spriteJson = null
  spritePNG = null

  clearPrivateFields() {
    this.fontFileCount = 0
    this.styleJson = null
    this.spriteJson = null
    this.spritePNG = null
    super.clearPrivateFields()
  }

  /**
   * Common abstraction for API requests
   */
  private async apiRequest(endpoint: string, options: any = {}): Promise<any> {
    const response = await api.get(`/api/${this.apiUrl}/${endpoint}`, options)

    if (!response || !response.data || response.status !== 200) {
      throw new Error(`No data received for ${this.id} endpoint: ${endpoint}`)
    }
    return response.data
  }

  async update(): Promise<void> {
    try {
      this.state = 'processing'
      console.log(`Loading ${this.id} data from API...`)
      const [fontFiles, spritePNG, spriteJson, styleJson, mapTiles] = await Promise.all([
        this.apiRequest('fonts', {
          responseType: 'arraybuffer',
          headers: {
            Accept: 'application/gzip',
          },
        }).then((response) => untar(response)),
        this.apiRequest('sprite/png', {
          responseType: 'blob',
          headers: {
            Accept: 'image/png',
          },
        }),
        this.apiRequest('sprite/json'),
        this.apiRequest('style'),
        this.apiRequest('tiles'),
      ])

      const tx = this.db.transaction(this.id, 'readwrite')
      const store = tx.objectStore(this.id)
      this.fontFileCount = 0
      const date = new Date()
      for (const file of fontFiles) {
        if (file.name.startsWith('fonts/') && file.name.endsWith('.pbf')) {
          const fontId = file.name.replace('fonts/', '').replace('.pbf', '')
          await store.put({ id: fontId, value: file.buffer })
          this.fontFileCount++
        }
      }
      await store.put({ id: 'fontCount', value: this.fontFileCount })

      await store.put({ id: 'spritePNG', value: spritePNG })
      await store.put({ id: 'spriteJson', value: spriteJson })
      await store.put({ id: 'styleJson', value: styleJson })
      await store.put({ id: 'mapTiles', value: mapTiles })

      await store.put({ id: 'date', value: date })
      await tx.done

      await this.load() // Load data after saving to ensure state is updated
      console.log(`${this.id} data loaded successfully`)
    } catch (error) {
      console.error(`Error updating ${this.id} data`, error)
      this.clearPrivateFields()
      this.error = error
    }
  }
  // Load data from IndexedDB
  async load() {
    try {
      console.log(`Loading ${this.id} data from IndexedDB...`)
      const tx = this.db.transaction(this.id, 'readwrite')
      const store = tx.objectStore(this.id)
      const { value: date } = await store.get('date')
      const { value: fontCount } = await store.get('fontCount')
      const { value: spritePNG } = await store.get('spritePNG')
      const { value: spriteJson } = await store.get('spriteJson')
      const { value: styleJson } = await store.get('styleJson')
      const { value: mapTiles } = await store.get('mapTiles')
      await tx.done
      if (
        !date ||
        !fontCount ||
        !spritePNG ||
        !spriteJson ||
        !styleJson ||
        !mapTiles ||
        fontCount === 0
      ) {
        console.log(`No data found for ${this.id} in IndexedDB`)
        this.clearPrivateFields
      } else {
        this.styleJson = styleJson
        this.spriteJson = spriteJson
        this.spritePNG = await createImageBitmap(spritePNG)
        this.fontFileCount = fontCount
        this.entryCount = 5
        this.localLastModified = new Date(date)
        this.state = 'loaded'
        this.error = null
        console.log(`${this.id} data loaded successfully from IndexedDB`)
      }
    } catch (error) {
      console.error(`Error loading ${this.id} data from IndexedDB`, error)
    }
  }
  async clear(): Promise<void> {
    return await super.clear().then(() => {
      this.clearPrivateFields()
      console.log(`Cleared resource ${this.id} from IndexedDB`)
    })
  }
  async getMapFontsGlyph(font, range) {
    const res = await this.db.get(this.id, font + '/' + range)

    if (!res || !res.value) {
      throw new Error(`No glyphs found for font ${font} and range ${range}`)
    }
    return res.value
  }
}
