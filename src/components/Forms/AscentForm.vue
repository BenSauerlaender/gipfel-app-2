<template>
  <q-form class="column q-gutter-md" @submit="onSubmit" greedy>
    <q-input
      outlined
      v-model="displayDate"
      readonly
      :rules="[(val) => !!val || 'Bitte ein Datum auswählen']"
    >
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date v-model="form.date" mask="YYYY-MM-DD">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>

    <q-option-group
      v-model="form.type"
      type="radio"
      label="Begehungsart"
      :options="ascentTypeOptions"
      inline
    />

    <q-select
      v-for="i in form.climbers.length + 1"
      :key="i"
      v-model="form.climbers[i - 1]"
      :options="climberOptions"
      :label="climberLabel(i)"
      outlined
      dense
      options-dense
      :rules="[
        (val) => {
          if (i === 1) {
            return !!val || 'Bitte auswählen'
          } else {
            return true
          }
        },
      ]"
    >
      <template v-slot:after>
        <q-btn
          :style="{ visibility: i <= form.climbers.length ? 'visible' : 'hidden' }"
          icon="close"
          color="negative"
          flat
          round
          @click="form.climbers.splice(i - 1, 1)"
        />
      </template>
    </q-select>

    <q-input v-model="form.notes" type="text" label="Notizen" outlined dense />

    <div class="row q-gutter-sm justify-end">
      <q-btn type="button" label="Abbrechen" color="grey-7" flat @click="onCancel" />
      <q-btn type="submit" label="Speichern" color="primary" unelevated />
    </div>
  </q-form>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAscentFormStore } from 'src/stores/ascentFormStore'
import { useDataStore } from 'src/stores/dataStore'
const router = useRouter()
const ascentFormStore = useAscentFormStore()
const dataStore = useDataStore()

const climbers = dataStore.climbers.map((climber) => ({
  label: climber.firstName,
  value: climber._id,
}))

const props = defineProps({
  routeID: {
    type: String,
    required: true,
  },
})

const ascentTypeOptions = [
  { label: 'Normal', value: 'normal' },
  { label: 'Toprope', value: 'topRope' },
  { label: 'Solo', value: 'solo' },
]

const form = ref({
  date: ascentFormStore.lastAscentDate || new Date().toDateString(),
  type: 'normal',
  notes: '',
  climbers: [],
})
const climberOptions = computed(() =>
  climbers.filter((climber) => !form.value.climbers.map((c) => c.value).includes(climber.value)),
)
const displayDate = computed(() => {
  const [year, month, day] = form.value.date.split('-')
  return `${day}.${month}.${year}`
})

function onSubmit() {
  ascentFormStore.setLastAscentDate(form.value.date)
  console.log('Submitting ascent form with values:', {
    routeID: props.routeID,
    date: form.value.date,
    type: form.value.type,
    notes: form.value.notes,
    climberIDs: form.value.climbers.map((c) => c.value),
  })
}

function onCancel() {
  router.back()
}

function climberLabel(index) {
  if (form.value.type === 'normal') {
    return index === 1 ? 'Vorsteiger' : `Nachsteiger ${index - 1}`
  }
  return `Kletterer ${index}`
}
</script>

<style scoped></style>
