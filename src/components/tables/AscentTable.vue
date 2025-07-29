<template>
  <q-table
    class="table-green"
    :rows="ascents"
    :columns="columns"
    row-key="_id"
    virtual-scroll
    :rows-per-page-options="[0]"
    binary-state-sort
    flat
    :filter="filter"
    ref="ascentsTable"
  >
    <template v-slot:top-right>
      <q-input borderless dense debounce="300" v-model="filter" placeholder="Suchen">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>
    <template v-slot:body-cell-date="props">
      <q-td :props="props">
        {{
          dense
            ? new Date(props.value).toLocaleDateString('de-DE', {
                day: 'numeric',
                month: 'numeric',
                year: '2-digit',
              })
            : new Date(props.value).toLocaleDateString('de-DE')
        }}
      </q-td>
    </template>

    <template v-slot:body-cell-summit="props">
      <q-td :props="props">
        <router-link
          style="text-decoration: none; color: inherit"
          :to="`/summits/${props.row.route.summitID}`"
          >{{ dense ? truncate(props.value, 10) : props.value }}
          <span v-if="dense && hasRegionColumn" class="text-grey-6"
            >({{ props.row.regionAbbr }})</span
          >
        </router-link>
      </q-td>
    </template>
    <template v-slot:body-cell-region="props">
      <q-td :props="props">
        <router-link
          style="text-decoration: none; color: inherit"
          :to="`/regions/${props.row.route.regionID}`"
          >{{ props.value }}</router-link
        >
      </q-td>
    </template>
    <template v-slot:body-cell-route="props">
      <q-td :props="props">
        <router-link
          style="text-decoration: none; color: inherit"
          :to="`/routes/${props.row.route._id}`"
          >{{ dense ? truncate(props.value, 15) : props.value }}
        </router-link>
      </q-td>
    </template>

    <template v-slot:body-cell-climbers="props">
      <q-td :props="props">
        {{ dense ? truncate(props.value, 15) : props.value }}
      </q-td>
    </template>
    <template v-slot:body-cell-combinedGrade="props">
      <q-td :props="props">
        <RouteGradeChip :grade="props.value" dense />
        <RouteStarsChip
          v-if="props.row.route.stars > 0"
          :stars="props.row.stars"
          dense
        ></RouteStarsChip>
        <RouteUnsecureChip v-if="props.row.route.unsecure" dense></RouteUnsecureChip>
      </q-td>
    </template>
    <template v-slot:body-cell-grade="props">
      <q-td :props="props">
        <RouteGradeChip :grade="props.value" />
      </q-td>
    </template>
    <template v-slot:body-cell-stars="props">
      <q-td :props="props">
        <RouteStarsChip :stars="props.value" v-if="props.value > 0"></RouteStarsChip>
        <span v-else>-</span>
      </q-td>
    </template>
    <template v-slot:body-cell-unsecure="props">
      <q-td :props="props">
        <RouteUnsecureChip v-if="props.value">-</RouteUnsecureChip>
        <span v-else>-</span>
      </q-td>
    </template>
  </q-table>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { getRouteGrade, sortGradeInTable } from 'src/helper/route'
import RouteGradeChip from 'src/components/Chips/RouteGradeChip.vue'
import RouteStarsChip from 'src/components/Chips/RouteStarsChip.vue'
import RouteUnsecureChip from 'src/components/Chips/RouteUnsecureChip.vue'
import { useQuasar } from 'quasar'
import { useStringUtils } from 'src/composables/stringUtils'
const { truncate } = useStringUtils()
const $q = useQuasar()

const props = defineProps({
  ascents: {
    type: Array,
    required: true,
  },
  columns: {
    type: Array,
    default: () => [
      'date',
      'route',
      'summit',
      'region',
      'grade',
      'stars',
      'unsecure',
      'ascentType',
      'climbers',
      'isAborted',
      'notes',
    ],
  },
  defaultSort: {
    type: Array,
    default: () => ['date', 'desc'],
  },
})

const ascentsTable = ref(null)
const filter = ref('')
const dense = computed(() => {
  return $q.screen.lt.sm
})

const hasRegionColumn = props.columns.includes('region')

const columns = computed(() =>
  [
    { name: 'date', label: 'Datum', field: 'date', align: 'left', sortable: true },
    { name: 'route', label: 'Weg', field: (row) => row.route?.name, align: 'left', sortable: true },
    {
      name: 'summit',
      label: 'Gipfel',
      field: (row) => row.route?.summitName,
      align: 'left',
      sortable: true,
    },
    {
      name: 'region',
      label: 'Gebiet',
      field: (row) => row.route?.summit?.regionName,
      align: 'left',
      sortable: true,
    },
    {
      name: 'combinedGrade',
      label: 'Grad',
      field: (row) => getRouteGrade(row.route) ?? '-',
      align: 'left',
      sortable: true,
      sort: sortGradeInTable,
    },
    {
      name: 'grade',
      label: 'Grad',
      field: (row) => getRouteGrade(row.route) ?? '-',
      align: 'center',
      sortable: true,
      sort: sortGradeInTable,
    },
    {
      name: 'stars',
      label: 'Sterne',
      field: (row) => row.route?.stars,
      align: 'center',
      sortable: true,
    },
    {
      name: 'unsecure',
      label: '!',
      field: (row) => row.route?.unsecure,
      align: 'left',
      sortable: true,
    },
    {
      name: 'ascentType',
      label: 'Art',
      field: (row) => row.ascentType,
      align: 'left',
      sortable: true,
    },
    {
      name: 'climbers',
      label: 'Kletterer',
      field: (row) => row.climbersText,
      align: 'left',
      sortable: true,
    },
    {
      name: 'isAborted',
      label: 'Abgebrochen',
      field: (row) => (row.isAborted ? 'X' : ''),
      align: 'center',
      sortable: true,
    },
    {
      name: 'notes',
      label: 'Notizen',
      field: (row) => {
        if (dense.value && row.isAborted && row.notes?.length < 1) return 'Abgebrochen'
        else return row.notes
      },
      align: 'left',
      sortable: true,
    },
  ]
    .filter(
      (column) =>
        props.columns.includes(column.name) || (dense.value && column.name === 'combinedGrade'),
    )
    .filter((column) => {
      if (dense.value) {
        if (['grade', 'stars', 'unsecure', 'region', 'isAborted'].includes(column.name)) {
          return false
        }
      }
      return true
    }),
)

const ascents = computed(() => {
  const ascents = props.ascents.map((ascent) => {
    if (ascent.leadClimber) ascent.ascentType = 'Kl.'
    if (ascent.isSolo) ascent.ascentType = 'solo'
    if (ascent.isTopRope) ascent.ascentType = 'v.o.g'

    ascent.climbersText = ''
    ascent.climbers.forEach((climber) => {
      if (climber.isAborted) ascent.climbersText += '(' + climber.firstName + ')'
      else ascent.climbersText += climber.firstName
      ascent.climbersText += ', '
    })
    ascent.climbersText = ascent.climbersText.slice(0, -2)

    return ascent
  })
  return ascents
})

onMounted(() => {
  ascentsTable.value.sort(props.defaultSort[0])
  if (props.defaultSort[1] == 'desc') {
    ascentsTable.value.sort(props.defaultSort[0])
  }
})
</script>

<style scoped></style>
