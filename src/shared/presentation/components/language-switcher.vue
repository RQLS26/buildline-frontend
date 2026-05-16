<template>
  <pv-select-button
      v-model="locale"
      :options="languages"
      optionLabel="label"
      optionValue="value"
      class="p-button-sm"
  />
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();

const languages = [
  { label: 'EN', value: 'en' },
  { label: 'ES', value: 'es' }
];
</script>