//baseclass to manage resources like ascents, trips, summits, etc

import api from 'src/api'
import { ResourceManager } from './ResourceManager'
import untar from 'js-untar'

export class OfflineMapResourceManager extends ResourceManager {
  fontFileCount: number = 0
  tileFileCount: number = 0
  styleJson = null
  spriteJson = null
  spritePNG = null

  clearPrivateFields() {
    this.fontFileCount = 0
    this.tileFileCount = 0
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
      const [fontFiles, spritePNG, spriteJson, styleJson, tileFiles] = await Promise.all([
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
        this.apiRequest('tiles', {
          responseType: 'arraybuffer',
          headers: {
            Accept: 'application/gzip',
          },
        }).then((response) => untar(response)),
      ])

      const tx = this.db.transaction(this.id, 'readwrite')
      const store = tx.objectStore(this.id)
      this.fontFileCount = 0
      this.tileFileCount = 0
      const date = new Date()
      for (const file of fontFiles) {
        if (file.name.startsWith('fonts/') && file.name.endsWith('.pbf')) {
          const fontId = file.name.replace('fonts/', '').replace('.pbf', '')
          await store.put({ id: fontId, value: file.buffer })
          this.fontFileCount++
        } else {
          //console.warn(`Skipping unexpected file in fonts: ${file.name}`)
        }
      }
      console.log(`Stored ${this.fontFileCount} fonts`)
      await store.put({ id: 'fontCount', value: this.fontFileCount })

      for (const file of tileFiles) {
        if (file.name.startsWith('tiles/') && file.name.endsWith('.pbf')) {
          const tileId = file.name.replace('.pbf', '')
          await store.put({ id: tileId, value: file.buffer })
          this.tileFileCount++
        } else {
          //console.warn(`Skipping unexpected file in tiles: ${file.name}`)
        }
      }
      console.log(`Stored ${this.tileFileCount} tiles`)
      await store.put({ id: 'tileCount', value: this.tileFileCount })

      await store.put({ id: 'spritePNG', value: spritePNG })
      await store.put({ id: 'spriteJson', value: spriteJson })
      await store.put({ id: 'styleJson', value: styleJson })

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
      const tx = this.db.transaction(this.id, 'readonly')
      const store = tx.objectStore(this.id)
      const dateResult = await store.get('date')
      const fontCountResult = await store.get('fontCount')
      const spritePNGResult = await store.get('spritePNG')
      const spriteJsonResult = await store.get('spriteJson')
      const styleJsonResult = await store.get('styleJson')
      const tileCountResult = await store.get('tileCount')
      await tx.done

      const date = dateResult?.value
      const fontCount = fontCountResult?.value
      const spritePNG = spritePNGResult?.value
      const spriteJson = spriteJsonResult?.value
      const styleJson = styleJsonResult?.value
      const tileCount = tileCountResult?.value

      if (
        !date ||
        !fontCount ||
        !spritePNG ||
        !spriteJson ||
        !styleJson ||
        !tileCount ||
        tileCount === 0 ||
        fontCount === 0
      ) {
        console.log(`No data found for ${this.id} in IndexedDB`)
        this.clearPrivateFields()
      } else {
        this.styleJson = styleJson
        this.spriteJson = spriteJson
        this.spritePNG = await createImageBitmap(spritePNG)
        this.fontFileCount = fontCount
        this.tileFileCount = tileCount
        this.entryCount = 5
        this.localLastModified = new Date(date)
        this.state = 'loaded'
        this.error = null
        console.log(`${this.id} data loaded successfully from IndexedDB`)
      }
    } catch (error) {
      this.clearPrivateFields()
      this.error = error
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
    const glyphId = `${font}/${range}`
    try {
      const tx = this.db.transaction(this.id, 'readonly')
      const store = tx.objectStore(this.id)
      const res = await store.get(glyphId)
      await tx.done

      if (!res || !res.value) {
        throw new Error(`No glyphs found for font ${font} and range ${range}`)
      }
      return res.value
    } catch (error) {
      console.error(`Error fetching glyph ${glyphId} from IndexedDB`, error)
      throw error
    }
  }
  async getMapTile(z: number, x: number, y: number): Promise<{ data: ArrayBuffer }> {
    const tileId = `tiles/${z}/${x}/${y}`
    try {
      const tx = this.db.transaction(this.id, 'readonly')
      const store = tx.objectStore(this.id)
      const res = await store.get(tileId)
      await tx.done

      if (!res || !res.value) {
        //console.warn(`No tile found for ${tileId}, returning empty data`)
        return
      }
      return { data: res.value }
    } catch (error) {
      console.error(`Error fetching tile ${tileId} from IndexedDB`, error)
      throw error
    }
  }
}
