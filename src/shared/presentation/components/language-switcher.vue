<template>
  <div class="language-switcher" @mouseenter="expanded = true" @mouseleave="expanded = false" @focusin="expanded = true" @focusout="expanded = false">
    <button class="globe-button" type="button" :aria-label="$t('settings.language')">
      <i class="pi pi-globe"></i>
    </button>
    <div class="language-options" :class="{ expanded }">
      <button
        v-for="language in languages"
        :key="language.value"
        type="button"
        :class="['language-option', locale === language.value ? 'active' : '']"
        @click="locale = language.value"
      >
        {{ language.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();
const expanded = ref(false);

const languages = [
  { label: 'EN', value: 'en' },
  { label: 'ES', value: 'es' }
];
</script>

<style scoped>
.language-switcher {
  display: inline-flex;
  align-items: center;
  height: 46px;
  border: 1px solid #B7C4D8;
  border-radius: 4px;
  background: #FFFFFF;
  overflow: hidden;
  transition: width 0.18s ease, box-shadow 0.18s ease;
}

.language-switcher:hover,
.language-switcher:focus-within {
  box-shadow: 0 6px 18px rgba(61, 99, 161, 0.12);
}

.globe-button,
.language-option {
  height: 44px;
  border: 0;
  background: transparent;
  color: #0F172A;
  font-weight: 700;
  cursor: pointer;
}

.globe-button {
  width: 52px;
  font-size: 17px;
  color: #64748B;
}

.language-options {
  display: grid;
  grid-template-columns: repeat(2, 52px);
  width: 0;
  opacity: 0;
  pointer-events: none;
  transition: width 0.18s ease, opacity 0.12s ease;
}

.language-options.expanded {
  width: 104px;
  opacity: 1;
  pointer-events: auto;
}

.language-option {
  border-left: 1px solid #B7C4D8;
  font-size: 14px;
}

.language-option.active {
  background: #EEF3FA;
  color: #0B1E39;
}

html[data-theme="dark"] .language-switcher {
  background: #111827;
  border-color: #334155;
}

html[data-theme="dark"] .globe-button,
html[data-theme="dark"] .language-option {
  color: #E5E7EB;
}

html[data-theme="dark"] .language-option {
  border-left-color: #334155;
}

html[data-theme="dark"] .language-option.active {
  background: #1E293B;
}
</style>
