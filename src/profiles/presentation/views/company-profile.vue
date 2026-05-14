<template>
  <div class="max-w-4xl mx-auto p-4">
    <pv-toast />

    <div class="mb-5">
      <h2 class="m-0 text-primary"><i class="pi pi-building mr-2"></i>{{ $t('company-profile.title') }}</h2>
      <p class="text-gray-500 mt-1">{{ $t('company-profile.subtitle') }}</p>
    </div>

    <div v-if="store.isLoading" class="flex justify-content-center p-5">
      <i class="pi pi-spin pi-spinner text-4xl text-primary"></i>
    </div>

    <pv-card class="shadow-2 border-round-xl" v-else>
      <template #content>
        <form @submit.prevent="saveProfile" class="grid p-fluid">

          <div class="col-12 md:col-8 mb-3">
            <label class="font-medium text-gray-700 block mb-2">{{ $t('company-profile.company_name') }}</label>
            <pv-input-text v-model="formData.companyName" required />
          </div>

          <div class="col-12 md:col-4 mb-3">
            <label class="font-medium text-gray-700 block mb-2">{{ $t('company-profile.ruc') }}</label>
            <pv-input-text v-model="formData.ruc" disabled />
            <small class="text-gray-400">{{ $t('company-profile.ruc_hint') }}</small>
          </div>

          <div class="col-12 mb-3">
            <label class="font-medium text-gray-700 block mb-2">{{ $t('company-profile.address') }}</label>
            <pv-input-text v-model="formData.address" required />
          </div>

          <div class="col-12 md:col-6 mb-3">
            <label class="font-medium text-gray-700 block mb-2">{{ $t('company-profile.phone') }}</label>
            <pv-input-text v-model="formData.phone" required />
          </div>

          <div class="col-12 md:col-6 mb-4">
            <label class="font-medium text-gray-700 block mb-2">{{ $t('company-profile.email') }}</label>
            <pv-input-text v-model="formData.email" type="email" required />
          </div>

          <div class="col-12 flex justify-content-end border-top-1 border-gray-200 pt-4 mt-2">
            <pv-button :label="$t('company-profile.save')" icon="pi pi-save" type="submit" :loading="store.isLoading" />
          </div>

        </form>
      </template>
    </pv-card>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useProfilesStore } from '../../application/profiles.store.js';
import { useToast } from 'primevue/usetoast';

const store = useProfilesStore();
const toast = useToast();

// Objeto por defecto a prueba de fallos del API
const formData = ref({
  companyName: '',
  ruc: '',
  address: '',
  phone: '',
  email: ''
});

onMounted(async () => {
  await store.fetchProfile();
});

// Cuando la data real llegue del servidor, sobreescribimos los campos vacíos
watch(() => store.companyProfile, (newProfile) => {
  if (newProfile) {
    formData.value = { ...newProfile };
  }
}, { immediate: true });

const saveProfile = async () => {
  const success = await store.updateProfile(formData.value);
  if (success) {
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Los datos se guardaron correctamente.', life: 3000 });
  } else {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar. Revisa que tu json-server esté corriendo.', life: 4000 });
  }
};
</script>