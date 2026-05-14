<template>
  <div class="p-5 md:p-8 max-w-7xl mx-auto">
    <pv-toast />

    <div class="flex flex-column md:flex-row justify-content-between align-items-start md:align-items-center mb-5 gap-3">
      <div>
        <h2 class="m-0 text-primary"><i class="pi pi-comments mr-2"></i>{{ $t('communication.title') }}</h2>
        <p class="text-gray-500 mt-1">{{ $t('communication.subtitle') }}</p>
      </div>
      <pv-button :label="$t('communication.new')" icon="pi pi-send" @click="showDialog = true" />
    </div>

    <pv-card class="shadow-2 border-round-xl">
      <template #content>
        <pv-data-table :value="store.messages" :loading="store.isLoading" responsiveLayout="scroll" :paginator="true" :rows="5">
          <pv-column field="sender" :header="$t('communication.sender')" style="width: 25%"></pv-column>
          <pv-column field="subject" :header="$t('communication.subject')" style="width: 40%">
            <template #body="slotProps">
              <span :class="{'font-bold': !slotProps.data.isRead}">{{ slotProps.data.subject }}</span>
            </template>
          </pv-column>
          <pv-column field="date" :header="$t('communication.date')" style="width: 20%"></pv-column>
          <pv-column :header="$t('communication.actions')" style="width: 15%">
            <template #body="slotProps">
              <pv-button icon="pi pi-eye" class="p-button-text p-button-rounded p-button-info mr-2" />
              <pv-button icon="pi pi-trash" class="p-button-text p-button-rounded p-button-danger" @click="deleteMsg(slotProps.data.id)" />
            </template>
          </pv-column>
        </pv-data-table>
      </template>
    </pv-card>

    <pv-dialog v-model:visible="showDialog" modal :header="$t('communication.new')" :style="{ width: '500px' }">
      <form @submit.prevent="sendNewMessage" class="flex flex-column gap-4 mt-3">
        <div class="flex flex-column gap-2">
          <label class="font-medium text-gray-700">Para (Destinatario)</label>
          <pv-input-text v-model="newMessage.sender" placeholder="Ej: Equipo de Compras" required />
        </div>
        <div class="flex flex-column gap-2">
          <label class="font-medium text-gray-700">{{ $t('communication.subject') }}</label>
          <pv-input-text v-model="newMessage.subject" required />
        </div>
        <div class="flex flex-column gap-2">
          <label class="font-medium text-gray-700">{{ $t('communication.body') }}</label>
          <pv-textarea v-model="newMessage.body" rows="4" required />
        </div>

        <div class="flex justify-content-end gap-2 mt-2">
          <pv-button :label="$t('communication.cancel')" icon="pi pi-times" class="p-button-text" @click="showDialog = false" />
          <pv-button :label="$t('communication.send')" icon="pi pi-check" type="submit" />
        </div>
      </form>
    </pv-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCommunicationStore } from '../../application/communication.store.js';
import { useToast } from 'primevue/usetoast';

const store = useCommunicationStore();
const toast = useToast();
const showDialog = ref(false);

const newMessage = ref({
  sender: '',
  subject: '',
  body: ''
});

onMounted(() => {
  store.fetchMessages();
});

const sendNewMessage = async () => {
  const payload = {
    ...newMessage.value,
    date: new Date().toISOString().split('T')[0], // Fecha actual YYYY-MM-DD
    isRead: false
  };

  const success = await store.createMessage(payload);
  if (success) {
    toast.add({ severity: 'success', summary: 'Enviado', detail: 'El mensaje fue enviado correctamente.', life: 3000 });
    showDialog.value = false;
    newMessage.value = { sender: '', subject: '', body: '' }; // Limpiar form
  }
};

const deleteMsg = async (id) => {
  await store.deleteMessage(id);
  toast.add({ severity: 'info', summary: 'Eliminado', detail: 'El mensaje fue borrado.', life: 3000 });
};
</script>