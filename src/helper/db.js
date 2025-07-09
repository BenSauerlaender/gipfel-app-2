import { openDB } from 'idb'

// Initialize the database
async function initDB() {
  const db = await openDB('gipfel-app', 2, {
    upgrade(db) {
      // Create object store if it doesn't exist
      if (!db.objectStoreNames.contains('data')) {
        db.createObjectStore('data', { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains('map-fonts')) {
        db.createObjectStore('map-fonts', { keyPath: 'id' })
      }
    },
  })
  return db
}
export { initDB }
