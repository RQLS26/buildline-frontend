<template>
  <div class="max-w-7xl mx-auto">
    <pv-toast />

    <div class="flex flex-column md:flex-row justify-content-between align-items-start md:align-items-center mb-5 gap-3">
      <div>
        <h2 class="m-0 text-gray-800 font-bold text-3xl">{{ $t('requisition.title') }}</h2>
        <p class="text-gray-500 mt-1">{{ $t('requisition.subtitle') }}</p>
      </div>
      <pv-button :label="$t('requisition.new')" icon="pi pi-plus" @click="showDialog = true" class="bg-gray-900 border-gray-900 hover:bg-gray-800" />
    </div>

    <pv-card class="shadow-1 border-none border-round-xl">
      <template #content>
        <pv-data-table :value="store.requests" :loading="store.isLoading" responsiveLayout="scroll" :paginator="true" :rows="10" class="p-datatable-sm">
          <pv-column field="reqId" :header="$t('requisition.req_id')" style="width: 15%"></pv-column>
          <pv-column field="material" :header="$t('requisition.material')" style="width: 25%"></pv-column>
          <pv-column field="project" :header="$t('requisition.project')" style="width: 20%"></pv-column>

          <pv-column field="priority" :header="$t('requisition.priority')" style="width: 10%">
            <template #body="slotProps">
              <pv-tag :severity="getPrioritySeverity(slotProps.data.priority)" :value="slotProps.data.priority" class="text-xs" />
            </template>
          </pv-column>

          <pv-column field="status" :header="$t('requisition.status')" style="width: 15%">
            <template #body="slotProps">
              <pv-tag :severity="getStatusSeverity(slotProps.data.status)" :value="slotProps.data.status" class="text-xs" />
            </template>
          </pv-column>

          <pv-column field="requestedOn" :header="$t('requisition.requested_on')" style="width: 15%"></pv-column>
        </pv-data-table>
      </template>
    </pv-card>

    <pv-dialog v-model:visible="showDialog" modal header="New Material Request" :style="{ width: '600px' }" class="p-fluid">
      <form @submit.prevent="submitRequest" class="grid mt-2">

        <div class="col-12 md:col-6 mb-3">
          <label class="font-medium text-gray-700 block mb-2">Project *</label>
          <pv-select v-model="formData.project" :options="projects" placeholder="Select Project..." class="w-full" required />
        </div>

        <div class="col-12 md:col-6 mb-3">
          <label class="font-medium text-gray-700 block mb-2">Material *</label>
          <pv-select v-model="formData.material" :options="materials" placeholder="Search materials..." class="w-full" required />
        </div>

        <div class="col-12 md:col-4 mb-3">
          <label class="font-medium text-gray-700 block mb-2">Quantity *</label>
          <pv-input-number v-model="formData.quantity" :min="1" required />
        </div>

        <div class="col-12 md:col-4 mb-3">
          <label class="font-medium text-gray-700 block mb-2">Unit</label>
          <pv-select v-model="formData.unit" :options="['PCS', 'Tons', 'Bags', 'm3']" placeholder="PCS" class="w-full" />
        </div>

        <div class="col-12 md:col-4 mb-3">
          <label class="font-medium text-gray-700 block mb-2">Priority *</label>
          <pv-select v-model="formData.priority" :options="['Low', 'Medium', 'High']" placeholder="High" class="w-full" required />
        </div>

        <div class="col-12 mb-3">
          <label class="font-medium text-gray-700 block mb-2">Delivery Needed By *</label>
          <pv-input-text type="date" v-model="formData.deliveryDate" required />
        </div>

        <div class="col-12 mb-4">
          <label class="font-medium text-gray-700 block mb-2">Description</label>
          <pv-textarea v-model="formData.description" rows="3" placeholder="Provide any additional context..." />
        </div>

        <div class="col-12 flex justify-content-end gap-3 border-top-1 border-gray-200 pt-4">
          <pv-button :label="$t('requisition.cancel')" class="p-button-outlined p-button-secondary" @click="showDialog = false" />
          <pv-button :label="$t('requisition.submit')" type="submit" class="bg-orange-500 border-orange-500 hover:bg-orange-600" />
        </div>
      </form>
    </pv-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRequisitionStore } from '../../application/requisition.store.js';
import { useToast } from 'primevue/usetoast';

const store = useRequisitionStore();
const toast = useToast();
const showDialog = ref(false);

const projects = ref(['Skyline Tower', 'Alpha Wing', 'Beta Foundation']);
const materials = ref(['Steel Rebar 1/2"', 'Concrete 3000 PSI', 'Sand Fine', 'Cement Type I']);

const formData = ref({
  project: '',
  material: '',
  quantity: null,
  unit: 'PCS',
  priority: 'High',
  deliveryDate: '',
  description: ''
});

onMounted(() => {
  store.fetchRequests();
});

const getPrioritySeverity = (priority) => {
  if (priority === 'High') return 'danger';
  if (priority === 'Medium') return 'warning';
  return 'info';
};

const getStatusSeverity = (status) => {
  if (status === 'Approved') return 'success';
  if (status === 'Pending') return 'warning';
  return 'secondary';
};

const submitRequest = async () => {
  const newReq = {
    reqId: `MR-2026-000${Math.floor(Math.random() * 90) + 10}`, // Genera un ID falso
    material: formData.value.material,
    project: formData.value.project,
    priority: formData.value.priority,
    status: 'Pending',
    requestedOn: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  };

  const success = await store.createRequest(newReq);
  if (success) {
    toast.add({ severity: 'success', summary: 'Success', detail: 'Material request submitted.', life: 3000 });
    showDialog.value = false;
    // Reset form
    formData.value = { project: '', material: '', quantity: null, unit: 'PCS', priority: 'High', deliveryDate: '', description: '' };
  }
};
</script>