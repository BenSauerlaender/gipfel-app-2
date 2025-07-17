<template>
  <q-table
    class="table-green"
    :rows="ascents"
    :columns="columns"
    row-key="_id"
    style="height: 800px"
    virtual-scroll
    :rows-per-page-options="[0]"
    binary-state-sort
    flat
    :filter="filter"
    ref="ascentsTable"
  >
    <template v-slot:top-right>
      <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>
    <template v-slot:body-cell-date="props">
      <q-td :props="props">
        {{ new Date(props.value).toLocaleDateString('de-DE') }}
      </q-td>
    </template>

    <template v-slot:body-cell-summit="props">
      <q-td :props="props">
        <router-link
          style="text-decoration: none; color: inherit"
          :to="`/summits/${props.row.route.summitID}`"
          >{{ props.value }}</router-link
        >
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
          >{{ props.value }}</router-link
        >
      </q-td>
    </template>

    <template v-slot:body-cell-climbers="props">
      <q-td :props="props">
        {{ props.value }}
      </q-td>
    </template>

    <template v-slot:body-cell-grade="props">
      <q-td :props="props">
        <RouteGradeChip v-memo="[props.value]" :grade="props.value" />
      </q-td>
    </template>
    <template v-slot:body-cell-stars="props">
      <q-td :props="props">
        <RouteStarsChip
          v-memo="[props.value]"
          :stars="props.value"
          v-if="props.value > 0"
        ></RouteStarsChip>
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

const columns = [
  { name: 'date', label: 'Datum', field: 'date', align: 'left', sortable: true },
  { name: 'route', label: 'Weg', field: (row) => row.route?.name, align: 'left', sortable: true },
  {
    name: 'summit',
    label: 'Gipfel',
    field: (row) => row.route?.summit?.name,
    align: 'left',
    sortable: true,
  },
  {
    name: 'region',
    label: 'Gebiet',
    field: (row) => row.route?.summit?.region?.name,
    align: 'left',
    sortable: true,
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
  { name: 'notes', label: 'Notizen', field: (row) => row.notes, align: 'left', sortable: true },
].filter((column) => props.columns.includes(column.name))

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
