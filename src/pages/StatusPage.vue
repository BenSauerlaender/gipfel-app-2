<template>
  <div class="row justify-center">
    <div class="col-12 col-md-8 col-lg-6">
      <h4 class="text-h4 q-mb-lg text-center">Status Übersicht</h4>

      <!-- Login Status Section -->
      <q-card class="q-mb-lg" bordered>
        <q-card-section>
          <div class="row items-center">
            <q-icon
              :name="userStore.loggedIn ? 'check_circle' : 'error'"
              :color="userStore.loggedIn ? 'positive' : 'negative'"
              size="md"
              class="q-mr-md"
            />
            <div class="col">
              <div class="text-h6">Login Status</div>
              <div class="text-caption text-grey-7">
                {{ userStore.loggedIn ? 'Erfolgreich angemeldet' : 'nicht angemeldet' }}
              </div>
            </div>
            <q-btn
              v-if="!userStore.loggedIn"
              color="primary"
              label="Login"
              @click="router.push('/login')"
              icon="login"
            />
          </div>
        </q-card-section>
      </q-card>

      <!-- Data Status Overview -->
      <q-card class="q-mb-lg" bordered>
        <q-card-section>
          <div class="row items-center q-mb-md">
            <q-icon
              :name="isAllLoaded ? 'check_circle' : 'error'"
              :color="isAllLoaded ? 'positive' : 'negative'"
              size="md"
              class="q-mr-md"
            />
            <div class="col">
              <div class="text-h6">App Daten</div>
              <div class="text-caption text-grey-7">
                {{
                  isAllLoaded
                    ? 'Alle Daten wurden erfolgreich geladen'
                    : 'Einige Daten fehlen oder konnten nicht geladen werden'
                }}
              </div>
            </div>
            <div class="q-gutter-sm">
              <q-btn
                color="primary"
                label="Refresh"
                @click="checkForUpdates"
                icon="refresh"
                :loading="checkingUpdates"
                :disable="checkingUpdates || isAnyResourceBusy || userStore.loggedIn !== true"
              >
                <q-tooltip v-if="userStore.loggedIn === true"
                  >Überprüfen, ob neuere Daten online verfügbar sind</q-tooltip
                >
                <q-tooltip v-else>Bitte zuerst einloggen</q-tooltip>
              </q-btn>
            </div>
          </div>

          <!-- Progress Bar -->
          <q-linear-progress
            :value="loadedDataFieldsPercentage"
            :color="isAllLoaded ? 'positive' : 'warning'"
            class="q-mb-sm"
            size="8px"
          />
          <div class="text-caption text-center">
            {{ loadedDataFields.length }} / {{ resources.length }} Datensätze geladen
          </div>
        </q-card-section>
      </q-card>

      <!-- Individual Data Fields -->
      <q-card bordered>
        <q-card-section>
          <div class="text-h6 q-mb-md row items-center">
            <q-icon name="storage" class="q-mr-sm" />
            Datensätze
            <q-space />
            <div v-if="hasUnloadedResources || hasOutdatedResources" class="q-gutter-sm">
              <q-btn
                :color="hasUnloadedResources ? 'primary' : 'warning'"
                :label="hasUnloadedResources ? 'Alle herunterladen' : 'Alle aktualisieren'"
                :icon="hasUnloadedResources ? 'cloud_download' : 'refresh'"
                @click="updateAllData"
                :loading="isAnyResourceBusy"
                :disable="isAnyResourceBusy || userStore.loggedIn !== true"
                size="sm"
              >
                <q-tooltip v-if="userStore.loggedIn === true">
                  {{
                    hasUnloadedResources
                      ? 'Alle fehlenden Daten herunterladen'
                      : 'Alle veralteten Daten aktualisieren'
                  }}
                </q-tooltip>
                <q-tooltip v-else>Bitte zuerst einloggen</q-tooltip>
              </q-btn>
            </div>
          </div>

          <div class="q-gutter-md q-mt-md">
            <q-card
              v-for="resource in resources"
              :key="resource.id"
              class="data-field-card"
              bordered
              flat
            >
              <q-card-section class="q-pa-md">
                <div class="row items-center">
                  <!-- Status Icon -->
                  <q-icon
                    :name="getStatusIcon(resource)"
                    :color="getStatusColor(resource)"
                    size="sm"
                    class="q-mr-md"
                  />

                  <!-- Field Info -->
                  <div class="col">
                    <div class="text-subtitle1 text-capitalize">{{ label(resource.id) }}</div>
                    <div class="text-caption text-grey-7">
                      Status:
                      {{ label(resource.state) || 'nicht geladen' }}
                    </div>
                    <div v-if="resource.localLastModified" class="text-caption text-grey-7">
                      Zuletzt aktualisiert:
                      {{ formatDate(resource.localLastModified) }}
                    </div>
                    <div class="text-caption text-grey-7">{{ resource.entryCount }} Einträge</div>
                  </div>

                  <!-- Action Buttons -->
                  <div class="q-gutter-sm">
                    <!-- Reload Button -->
                    <q-btn
                      color="info"
                      icon="cached"
                      @click="handleReloadResource(resource)"
                      :loading="isResourceBusy(resource)"
                      :disable="isResourceBusy(resource)"
                      size="sm"
                      round
                      flat
                    >
                      <q-tooltip>Lokale Daten neu laden</q-tooltip>
                    </q-btn>

                    <!-- Clear Button -->
                    <q-btn
                      v-if="resource.state === 'loaded' || resource.entryCount > 0"
                      color="negative"
                      icon="delete"
                      @click="handleClearResource(resource)"
                      :loading="isResourceBusy(resource)"
                      :disable="isResourceBusy(resource)"
                      size="sm"
                      round
                      flat
                    >
                      <q-tooltip>{{ label(resource.id) }} Daten löschen</q-tooltip>
                    </q-btn>

                    <!-- Download/Update Button -->
                    <q-btn
                      v-if="resource.state !== 'loaded' || resource.isOutdated()"
                      :color="getActionButtonColor(resource)"
                      :label="getActionButtonLabel(resource)"
                      :icon="getActionButtonIcon(resource)"
                      @click="handleDataFieldAction(resource)"
                      :loading="isResourceBusy(resource)"
                      :disable="isResourceBusy(resource) || userStore.loggedIn !== true"
                      size="sm"
                    >
                      <q-tooltip>{{ getActionButtonTooltip(resource) }}</q-tooltip>
                    </q-btn>
                  </div>
                </div>

                <!-- Error Message -->
                <div
                  v-if="resource.error"
                  class="q-mt-sm q-pa-sm bg-negative text-white rounded-borders"
                >
                  <q-icon name="error" class="q-mr-sm" />
                  Fehler beim Laden der {{ label(resource.id) }} Daten
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- Clear All Button at bottom -->
          <div class="row justify-center q-mt-md">
            <q-btn
              color="negative"
              label="Alle löschen"
              icon="delete"
              @click="clearAllData"
              :loading="isAnyResourceBusy"
              :disable="isAnyResourceBusy"
              size="sm"
            >
              <q-tooltip>Alle lokalen Daten löschen</q-tooltip>
            </q-btn>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useResourceStore } from 'src/stores/resourceStore'
import { useUserStore } from 'src/stores/user'
import { date } from 'quasar'
import { storeToRefs } from 'pinia'

const router = useRouter()
const resourceStore = useResourceStore()
const userStore = useUserStore()

const label = (s) => {
  switch (s) {
    case 'ascents':
      return 'Begehungen'
    case 'routes':
      return 'Wege'
    case 'summits':
      return 'Gipfel'
    case 'regions':
      return 'Gebiete'
    case 'trips':
      return 'Touren'
    case 'climbers':
      return 'Kletterer'
    case 'offline-map':
      return 'Offline Karte'
    case 'loaded':
      return 'geladen'
    case 'processing':
      return 'wird geladen...'
    case 'empty':
      return 'nicht geladen'
    default:
      return s
  }
}

const checkingUpdates = ref(false)

const { resources, isAllLoaded } = storeToRefs(resourceStore)

const loadedDataFields = computed(() =>
  resourceStore.resources.filter((resource) => resource.state === 'loaded'),
)

const loadedDataFieldsPercentage = computed(
  () => loadedDataFields.value.length / resourceStore.resources.length,
)

const hasUnloadedResources = computed(() =>
  resourceStore.resources.some((resource) => resource.state === 'empty'),
)

const hasOutdatedResources = computed(() =>
  resourceStore.resources.some((resource) => resource.isOutdated()),
)

const isAnyResourceBusy = computed(() =>
  resourceStore.resources.some((resource) => isResourceBusy(resource)),
)

const isResourceBusy = (resource) => {
  return resource.state === 'processing'
}

const formatDate = (dateString) => {
  if (!dateString) return 'error'
  return date.formatDate(new Date(dateString), 'DD.MM.YYYY HH:mm')
}

const getStatusIcon = (resource) => {
  switch (resource.state) {
    case 'loaded':
      return 'check_circle'
    case 'processing':
      return 'sync'
    case 'empty':
    default:
      return 'radio_button_unchecked'
  }
}

const getStatusColor = (resource) => {
  switch (resource.state) {
    case 'loaded':
      return 'positive'
    case 'processing':
      return 'warning'
    case 'empty':
    default:
      return 'grey'
  }
}

const getActionButtonColor = (resource) => {
  if (resource.state === 'empty') return 'primary'
  if (resource.isOutdated()) return 'warning'
  return ''
}

const getActionButtonLabel = (resource) => {
  if (resource.state === 'empty') return 'Download'
  if (resource.isOutdated()) return 'Update'
  return ''
}

const getActionButtonIcon = (resource) => {
  if (resource.state === 'empty') return 'cloud_download'
  if (resource.isOutdated()) return 'refresh'
  return ''
}

const getActionButtonTooltip = (resource) => {
  if (userStore.loggedIn !== true) return 'Bitte zuerst einloggen'

  if (resource.state === 'empty') return `Download ${label(resource.id)}`
  if (resource.isOutdated()) return `Update ${label(resource.id)}`
  return ''
}

const handleDataFieldAction = async (resource) => {
  if (isResourceBusy(resource)) return

  try {
    await resource.update()
  } catch (error) {
    console.error(`Error updating ${resource.id}:`, error)
  }
}

const handleReloadResource = async (resource) => {
  if (isResourceBusy(resource)) return

  try {
    await resource.load()
  } catch (error) {
    console.error(`Error reloading ${resource.id}:`, error)
  }
}

const handleClearResource = async (resource) => {
  if (isResourceBusy(resource)) return

  try {
    await resource.clear()
  } catch (error) {
    console.error(`Error clearing ${resource.id}:`, error)
  }
}

const checkForUpdates = async () => {
  checkingUpdates.value = true
  try {
    await resourceStore.checkForUpdates()
  } catch (error) {
    console.error('Error checking for updates:', error)
  } finally {
    checkingUpdates.value = false
  }
}

const clearAllData = async () => {
  if (isAnyResourceBusy.value) return

  try {
    await resourceStore.clearAll()
  } catch (error) {
    console.error('Error clearing all data:', error)
  }
}

const updateAllData = async () => {
  if (isAnyResourceBusy.value) return

  try {
    if (hasUnloadedResources.value) {
      // Download all resources that are not loaded
      await Promise.all(
        resourceStore.resources
          .filter((resource) => resource.state === 'empty')
          .map((resource) => resource.update()),
      )
    } else if (hasOutdatedResources.value) {
      // Update all outdated resources
      await resourceStore.updateAll()
    }
  } catch (error) {
    console.error('Error updating all data:', error)
  }
}

onMounted(async () => {})
</script>

<style scoped>
.data-field-card {
  transition: all 0.2s ease;
}

.data-field-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

pre {
  background: #f5f5f5;
  padding: 12px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 11px;
  line-height: 1.4;
}
</style>
