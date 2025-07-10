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
                :disable="
                  checkingUpdates || loadingFields.length > 0 || userStore.loggedIn !== true
                "
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

                  <!-- Action Button -->
                  <q-btn
                    v-if="resource.state !== 'loaded' || resource.isOutdated()"
                    :color="getActionButtonColor(resource)"
                    :label="getActionButtonLabel(resource)"
                    :icon="getActionButtonIcon(resource)"
                    @click="handleDataFieldAction(resource)"
                    :loading="loadingFields.includes(resource.id)"
                    :disable="loadingFields.includes(resource.id) || userStore.loggedIn !== true"
                    size="sm"
                  >
                    <q-tooltip>{{ getActionButtonTooltip(resource) }}</q-tooltip>
                  </q-btn>
                </div>

                <!-- Error Message -->
                <div
                  v-if="resource.downloadError"
                  class="q-mt-sm q-pa-sm bg-negative text-white rounded-borders"
                >
                  <q-icon name="error" class="q-mr-sm" />
                  Fehler beim Laden der {{ label(resource.id) }} Daten
                </div>
              </q-card-section>
            </q-card>
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
    case 'loaded':
      return 'geladen'
    case 'downloading':
      return 'wird heruntergeladen...'
    case 'processing':
      return 'wird verarbeitet...'
    case 'empty':
      return 'nicht geladen'
    default:
      return s
  }
}

const loadingFields = ref([])
const checkingUpdates = ref(false)

const { resources, isAllLoaded } = storeToRefs(resourceStore)

const loadedDataFields = computed(() =>
  resourceStore.resources.filter((resource) => resource.state === 'loaded'),
)

const loadedDataFieldsPercentage = computed(
  () => loadedDataFields.value.length / resourceStore.resources.length,
)

const formatDate = (dateString) => {
  if (!dateString) return 'error'
  return date.formatDate(new Date(dateString), 'DD.MM.YYYY HH:mm')
}

const getStatusIcon = (resource) => {
  switch (resource.state) {
    case 'loaded':
      return 'check_circle'
    case 'downloading':
      return 'cloud_download'
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
    case 'downloading':
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
  if (loadingFields.value.includes(resource.id)) return

  loadingFields.value.push(resource.id)
  try {
    await resource.update()
  } catch (error) {
    console.error(`Error updating ${resource.id}:`, error)
  } finally {
    loadingFields.value = loadingFields.value.filter((f) => f !== resource.id)
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
