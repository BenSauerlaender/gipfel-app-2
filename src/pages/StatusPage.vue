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
              :name="dataStore.isLoaded ? 'check_circle' : 'error'"
              :color="dataStore.isLoaded ? 'positive' : 'negative'"
              size="md"
              class="q-mr-md"
            />
            <div class="col">
              <div class="text-h6">App Daten</div>
              <div class="text-caption text-grey-7">
                {{
                  dataStore.isLoaded
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
            :color="dataStore.isLoaded ? 'positive' : 'warning'"
            class="q-mb-sm"
            size="8px"
          />
          <div class="text-caption text-center">
            {{ loadedDataFields.length }} / {{ dataFields.length }} Datensätze geladen
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
            <q-card v-for="field in dataFields" :key="field" class="data-field-card" bordered flat>
              <q-card-section class="q-pa-md">
                <div class="row items-center">
                  <!-- Status Icon -->
                  <q-icon
                    :name="getStatusIcon(field)"
                    :color="getStatusColor(field)"
                    size="sm"
                    class="q-mr-md"
                  />

                  <!-- Field Info -->
                  <div class="col">
                    <div class="text-subtitle1 text-capitalize">{{ label(field) }}</div>
                    <div class="text-caption text-grey-7">
                      Status: {{ label(dataStore.meta[field].status) || 'nicht geladen' }}
                    </div>
                    <div v-if="dataStore.meta[field].date" class="text-caption text-grey-7">
                      Zuletzt aktualisiert: {{ formatDate(dataStore.meta[field].date) }}
                    </div>
                    <div v-if="dataStore.getDataLength(field) > 0" class="text-caption text-grey-7">
                      {{ dataStore.getDataLength(field) }}
                      Einträge geladen
                    </div>
                  </div>

                  <!-- Action Button -->
                  <q-btn
                    v-if="dataStore.meta[field].status !== 'loaded' || dataStore.needUpdate(field)"
                    :color="getActionButtonColor(field)"
                    :label="getActionButtonLabel(field)"
                    :icon="getActionButtonIcon(field)"
                    @click="handleDataFieldAction(field)"
                    :loading="loadingFields.includes(field)"
                    :disable="loadingFields.includes(field) || userStore.loggedIn !== true"
                    size="sm"
                  >
                    <q-tooltip>{{ getActionButtonTooltip(field) }}</q-tooltip>
                  </q-btn>
                </div>

                <!-- Error Message -->
                <div
                  v-if="dataStore.meta[field].status === 'error'"
                  class="q-mt-sm q-pa-sm bg-negative text-white rounded-borders"
                >
                  <q-icon name="error" class="q-mr-sm" />
                  Fehler beim Laden der {{ label(field) }} Daten
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
import { useDataStore, dataFields } from 'src/stores/dataStore'
import { useUserStore } from 'src/stores/user'
import { date } from 'quasar'

const router = useRouter()
const dataStore = useDataStore()
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
    case 'loading':
      return 'wird geladen...'
    case 'downloading':
      return 'wird heruntergeladen...'
    case 'saving':
      return 'wird gespeichert...'
    default:
      return s
  }
}

const loadingFields = ref([])
const checkingUpdates = ref(false)

const loadedDataFields = computed(() =>
  dataFields.filter((field) => dataStore.meta[field].status === 'loaded'),
)

const loadedDataFieldsPercentage = computed(() => loadedDataFields.value.length / dataFields.length)

const formatDate = (dateString) => {
  if (!dateString) return 'error'
  return date.formatDate(new Date(dateString), 'DD.MM.YYYY HH:mm')
}

const getStatusIcon = (field) => {
  const status = dataStore.meta[field].status
  switch (status) {
    case 'loaded':
      return 'check_circle'
    case 'loading':
      return 'sync'
    case 'downloading':
      return 'cloud_download'
    case 'saving':
      return 'save'
    case 'error':
      return 'error'
    default:
      return 'radio_button_unchecked'
  }
}

const getStatusColor = (field) => {
  const status = dataStore.meta[field].status
  switch (status) {
    case 'loaded':
      return 'positive'
    case 'loading':
    case 'downloading':
    case 'saving':
      return 'warning'
    case 'error':
      return 'negative'
    default:
      return 'grey'
  }
}

const getActionButtonColor = (field) => {
  const status = dataStore.meta[field].status
  if (status === 'error' || !status || status === '') return 'primary'
  if (dataStore.needUpdate(field)) return 'warning'
  return ''
}

const getActionButtonLabel = (field) => {
  const status = dataStore.meta[field].status
  if (status === 'error' || !status || status === '') return 'Download'
  if (dataStore.needUpdate(field)) return 'Update'
  return ''
}

const getActionButtonIcon = (field) => {
  const status = dataStore.meta[field].status
  if (status === 'error' || !status || status === '') return 'cloud_download'
  if (dataStore.needUpdate(field)) return 'refresh'
  return ''
}

const getActionButtonTooltip = (field) => {
  const status = dataStore.meta[field].status
  if (userStore.loggedIn !== true) return 'Bitte zuerst einloggen'
  if (status === 'error' || !status || status === '') return `Download ${field}`
  if (dataStore.needUpdate(field)) return `Update ${field}`
  return ``
}

const handleDataFieldAction = async (field) => {
  if (loadingFields.value.includes(field)) return

  loadingFields.value.push(field)
  dataStore
    .loadDataFromApi(field)
    .catch((error) => {
      console.error(`Error loading ${field}:`, error)
    })
    .finally(() => {
      loadingFields.value = loadingFields.value.filter((f) => f !== field)
    })
}

const checkForUpdates = async () => {
  checkingUpdates.value = true
  dataStore
    .getAllRemoteDates()
    .catch((error) => {
      console.error('Error checking for updates:', error)
    })
    .finally(() => {
      checkingUpdates.value = false
    })
}
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
