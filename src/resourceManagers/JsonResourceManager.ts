//baseclass to manage resources like ascents, trips, summits, etc

import api from 'src/api'
import { ResourceManager } from './ResourceManager'

export class JsonResourceManager<A> extends ResourceManager {
  data: A | null = null

  private getEntryCount(): number {
    if (this.data === null) {
      return 0
    }
    if (Array.isArray(this.data)) {
      return this.data.length
    }
    return Object.keys(this.data).length
  }

  async update(): Promise<void> {
    try {
      this.state = 'processing'
      console.log(`Loading ${this.id} data from API...`)
      const response = await api.get(`/api/${this.apiUrl}`)

      if (!response || !response.data || !response.data.data || response.status !== 200) {
        throw new Error(`No data received for ${this.id}`)
      }
      let data = response.data.data
      const date = new Date(response.data.date)

      if (Array.isArray(data) && data.length === 1) {
        data = data[0]
      }

      this.data = data
      this.entryCount = this.getEntryCount()

      console.log(`Saving ${this.id} data to IndexedDB...`)
      await this.db.put(this.id, { id: 'data', value: { data, date } })

      this.localLastModified = date
      this.data = data
      this.state = 'loaded'
      this.error = null
      console.log(`${this.id} data loaded successfully`)
    } catch (error) {
      console.error(`Error updating ${this.id} data`, error)
      this.error = error
      this.state = 'empty'
      this.entryCount = 0
      this.localLastModified = null
      this.data = null
    }
  }
  // Load data from IndexedDB
  async load() {
    try {
      console.log(`Loading ${this.id} data from IndexedDB...`)
      const response = await this.db.get(this.id, 'data')
      this.data = response?.value?.data ?? null
      this.localLastModified = response?.value?.date ?? null
      if (this.getEntryCount() > 0) {
        this.state = 'loaded'
        this.entryCount = this.getEntryCount()
      }

      console.log(`${this.id} data loaded successfully from IndexedDB`)
    } catch (error) {
      console.error(`Error loading ${this.id} data from IndexedDB`, error)
    }
  }
  async clear(): Promise<void> {
    return await super.clear().then(() => {
      this.data = null
    })
  }
}
