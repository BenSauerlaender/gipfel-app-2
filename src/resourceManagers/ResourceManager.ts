//baseclass to manage resources like ascents, trips, summits, map tiles, fonts, etc.
import api from 'src/api'
import type { IDBPDatabase as idbD } from 'idb'

export class ResourceManager {
  id: string
  db: idbD
  apiUrl: string
  remoteLastModified: Date | null = null
  localLastModified: Date | null = null
  state: 'empty' | 'loaded' | 'processing' = 'empty'
  error: Error | null = null
  entryCount: number = 0

  constructor(id: string, db: idbD, apiUrl: string) {
    this.id = id
    this.db = db
    this.apiUrl = apiUrl
  }

  clearPrivateFields(): void {
    this.remoteLastModified = null
    this.localLastModified = null
    this.state = 'empty'
    this.error = null
    this.entryCount = 0
  }

  async checkForUpdates(): Promise<boolean> {
    try {
      const lastModifiedResponse = await api.get(`/api/last-modified/${this.apiUrl}`)
      if (!lastModifiedResponse || !lastModifiedResponse.data) {
        this.remoteLastModified = null
      }
      this.remoteLastModified = new Date(lastModifiedResponse.data)
      return this.isOutdated()
    } catch (error) {
      console.log(`Failed to check for updates for resource ${this.id}`)
      this.remoteLastModified = null
    }
  }

  isOutdated(): boolean {
    if (!this.remoteLastModified) {
      return false // No remote date means no update needed
    }
    if (!this.localLastModified) {
      return true // No local date means data is outdated
    }
    return this.remoteLastModified > this.localLastModified
  }

  async clear(): Promise<void> {
    this.state = 'processing'
    return this.db
      .clear(this.id)
      .then(() => {
        this.clearPrivateFields()
        console.log(`Cleared resource ${this.id} from IndexedDB`)
      })
      .catch((error) => {
        this.state = 'empty' // Reset state on error
        this.error = error
        throw error
      })
  }

  async update(): Promise<void> {
    throw new Error('Method must be implemented by subclass')
  }

  async load(): Promise<void> {
    throw new Error('Method must be implemented by subclass')
  }
}
