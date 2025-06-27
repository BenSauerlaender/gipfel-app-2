<template>
          <q-card style="height: 100%;">
            <q-card-section class="flex items-center justify-start no-wrap">
              <div class="q-mr-md text-h4 text-weight-bold text-blue-7">{{ data[0].value }}</div>
              <div class="text-h6 text-grey-9">{{ data[0].name }}</div>
            </q-card-section>
  
            <q-separator />

            <q-card-section >
            <div v-for="field in data.slice(1)" :key="field.name" class="flex items-center">
              <span class="text-h6 text-weight-bold text-right q-mr-sm" style="min-width: 2em;">{{ field.value }}</span>
              <span class="text-h8 text-grey-9">{{ field.name }}</span>
            </div>
            </q-card-section>
          </q-card>
</template>

<script setup>
const props = defineProps({
    data: {
        type: Array,
        required: true,
        default: () => [
            {name: 'Begehungen', value: 100},
            {name: 'im Vorstieg', value: 100},
        ]
    }
})

</script>