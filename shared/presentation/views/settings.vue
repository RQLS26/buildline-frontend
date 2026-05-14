<template>
  <div class="max-w-4xl mx-auto mt-2 pb-6">

    <div class="mb-5">
      <h1 class="m-0 text-gray-900 font-bold text-3xl">{{ $t('settings.title') }}</h1>
      <p class="text-gray-500 mt-1">{{ $t('settings.subtitle') }}</p>
    </div>

    <div class="flex flex-column gap-4">

      <pv-card class="shadow-1 border-none border-round-xl">
        <template #title>
          <div class="flex align-items-center gap-2 text-xl font-bold">
            <i class="pi pi-bell text-primary"></i>
            {{ $t('settings.notifications') }}
          </div>
          <p class="text-sm font-normal text-gray-500 m-0">{{ $t('settings.notif_desc') }}</p>
        </template>
        <template #content>
          <div class="flex flex-column gap-3">
            <div class="flex align-items-center justify-content-between p-2 border-round-lg hover:bg-gray-50 transition-colors">
              <span class="font-medium text-gray-700">{{ $t('settings.email_alerts') }}</span>
              <pv-toggle-switch v-model="settings.emailNotifications" />
            </div>
            <div class="flex align-items-center justify-content-between p-2 border-round-lg hover:bg-gray-50 transition-colors">
              <span class="font-medium text-gray-700">{{ $t('settings.stock_alerts') }}</span>
              <pv-toggle-switch v-model="settings.lowStockAlerts" />
            </div>
          </div>
        </template>
      </pv-card>

      <pv-card class="shadow-1 border-none border-round-xl">
        <template #title>
          <div class="flex align-items-center gap-2 text-xl font-bold">
            <i class="pi pi-cog text-primary"></i>
            {{ $t('settings.preferences') }}
          </div>
          <p class="text-sm font-normal text-gray-500 m-0">{{ $t('settings.pref_desc') }}</p>
        </template>
        <template #content>
          <div class="grid p-fluid">
            <div class="col-12 md:col-6 flex flex-column gap-2">
              <label class="font-bold text-gray-700 text-sm">{{ $t('settings.theme') }}</label>
              <pv-select v-model="settings.theme" :options="['Light', 'Dark']" placeholder="Select Theme" />
            </div>
            <div class="col-12 md:col-6 flex flex-column gap-2">
              <label class="font-bold text-gray-700 text-sm">{{ $t('settings.currency') }}</label>
              <pv-select v-model="settings.currency" :options="['USD ($)', 'PEN (S/)']" placeholder="Select Currency" />
            </div>
          </div>
        </template>
      </pv-card>

      <pv-card class="shadow-1 border-none border-round-xl">
        <template #title>
          <div class="flex align-items-center gap-2 text-xl font-bold">
            <i class="pi pi-lock text-primary"></i>
            {{ $t('settings.security') }}
          </div>
          <p class="text-sm font-normal text-gray-500 m-0">{{ $t('settings.sec_desc') }}</p>
        </template>
        <template #content>
          <div class="flex flex-column gap-4 p-fluid">
            <div class="flex flex-column gap-2">
              <label class="font-bold text-gray-700 text-sm">{{ $t('settings.change_pass') }}</label>
              <pv-input-text type="password" v-model="settings.password" placeholder="New Password" />
            </div>
            <div class="flex justify-content-end">
              <pv-button :label="$t('settings.save_changes')" icon="pi pi-check" @click="saveSettings"
                         class="bg-orange-500 border-orange-500 hover:bg-orange-600 px-4 font-bold" />
            </div>
          </div>
        </template>
      </pv-card>

    </div>
    <pv-toast />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const settings = ref({
  emailNotifications: true,
  lowStockAlerts: true,
  theme: 'Light',
  currency: 'USD ($)',
  password: ''
});

const saveSettings = () => {
  toast.add({ severity: 'success', summary: 'Success', detail: 'Settings updated successfully', life: 3000 });
};
</script>