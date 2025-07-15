<template>
  <q-card class="filter-card">
    <q-card-section>
      <div class="filter-header">Schwierigkeitsgrad</div>
      <q-range
        v-model="range"
        :min="minGrade"
        :max="maxGrade"
        :step="1"
        :left-label-value="NORMAL_SCALA[range.min]"
        :right-label-value="NORMAL_SCALA[range.max]"
        label-always
        label
        color="darkgreen"
      />
    </q-card-section>
  </q-card>
</template>

//only for normals not jumps

<script setup>
import { ref, watch } from 'vue'
import { useFilterStore } from 'src/stores/filterStore'
import { NORMAL_SCALA } from 'src/helper/route'
import { useDataStore } from 'src/stores/dataStore'

const filterStore = useFilterStore()
const filters = filterStore.filters

const dataStore = useDataStore()
const ascentGrades = new Set(
  dataStore.ascents.map((ascent) => NORMAL_SCALA.indexOf(ascent.route.difficulty.normal)),
)

const minGrade = Math.min(...ascentGrades)
const maxGrade = Math.max(...ascentGrades)

const range = ref({ min: minGrade, max: maxGrade })

watch(range, (newValue) => {
  filters.grade.normal.min = newValue.min
  filters.grade.normal.max = newValue.max
})
</script>

<style scoped></style>
