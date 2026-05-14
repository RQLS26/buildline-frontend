<template>
  <pv-select-button
      v-model="$i18n.locale"
      :options="languages"
      optionLabel="label"
      optionValue="value"
      aria-labelledby="basic"
      class="p-button-sm"
  />
</template>

<script setup>
import { ref } from 'vue';

const languages = ref([
  { label: 'EN', value: 'en' },
  { label: 'ES', value: 'es' }
]);
</script>