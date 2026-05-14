<template>
  <div class="max-w-7xl mx-auto">
    <pv-toast />

    <div class="mb-5">
      <h2 class="m-0 text-gray-800 font-bold text-3xl">{{ $t('quotations.title') }}</h2>
    </div>

    <div class="mb-5">
      <h3 class="text-xl text-gray-700 font-medium mb-3">{{ $t('quotations.subtitle') }}</h3>
      <pv-card class="shadow-1 border-none border-round-xl">
        <template #content>
          <pv-data-table :value="store.requests" :loading="store.isLoading" responsiveLayout="scroll" :paginator="true" :rows="4" class="p-datatable-sm">
            <pv-column field="reqId" header="Request ID"></pv-column>
            <pv-column field="material" header="Material"></pv-column>
            <pv-column field="project" header="Project"></pv-column>
            <pv-column field="priority" header="Priority">
              <template #body="slotProps">
                <pv-tag :severity="getPrioritySeverity(slotProps.data.priority)" :value="slotProps.data.priority" class="text-xs" />
              </template>
            </pv-column>
            <pv-column field="status" header="Status">
              <template #body="slotProps">
                <pv-tag :severity="getStatusSeverity(slotProps.data.status)" :value="slotProps.data.status" class="text-xs" />
              </template>
            </pv-column>
            <pv-column field="requestedOn" header="Requested On"></pv-column>
          </pv-data-table>
        </template>
      </pv-card>
    </div>

    <div class="grid">
      <div class="col-12 lg:col-7">
        <pv-card class="shadow-1 border-none border-round-xl p-3">
          <template #title>
            <h3 class="m-0 text-xl font-bold text-gray-800 mb-4">{{ $t('quotations.generate_title') }}</h3>
          </template>
          <template #content>
            <form @submit.prevent="submitQuotation" class="flex flex-column gap-4">

              <div class="flex flex-column gap-2">
                <label class="font-bold text-gray-700">{{ $t('quotations.request_id') }}</label>
                <pv-select v-model="formData.requestId" :options="store.requests" optionLabel="reqId" optionValue="reqId" placeholder="Select Request ID..." class="w-full" required />
              </div>

              <div class="flex flex-column gap-2">
                <label class="font-bold text-gray-700">{{ $t('quotations.select_suppliers') }}</label>
                <pv-multi-select v-model="formData.suppliers" :options="store.suppliers" optionLabel="companyName" placeholder="Select Suppliers" :maxSelectedLabels="3" class="w-full" required />
              </div>

              <div class="flex flex-column gap-2">
                <label class="font-bold text-gray-700">{{ $t('quotations.message') }}</label>
                <pv-textarea v-model="formData.message" rows="3" :placeholder="$t('quotations.message_placeholder')" required />
              </div>

              <div class="flex flex-column gap-3 mt-2">
                <label class="font-bold text-gray-700">{{ $t('quotations.attach_details') }}</label>
                <div class="flex align-items-center gap-2">
                  <pv-checkbox v-model="formData.includeSpecs" inputId="specs" binary />
                  <label for="specs" class="text-gray-700">{{ $t('quotations.include_specs') }}</label>
                </div>
              </div>

              <div class="flex justify-content-end mt-3">
                <pv-button :label="$t('quotations.send')" type="submit" class="bg-orange-500 border-orange-500 hover:bg-orange-600 px-5" />
              </div>
            </form>
          </template>
        </pv-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useProcurementStore } from '../../application/procurement.store.js'; // Cambiado a procurement
import { useToast } from 'primevue/usetoast';

const store = useProcurementStore();
const toast = useToast();

const formData = ref({
  requestId: null,
  suppliers: [],
  message: '',
  includeSpecs: false
});

onMounted(() => {
  store.fetchQuotationData();
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

const submitQuotation = async () => {
  const payload = {
    ...formData.value,
    date: new Date().toISOString()
  };

  const success = await store.createQuotation(payload);

  if (success) {
    toast.add({ severity: 'success', summary: 'Success', detail: 'Quotation request sent to suppliers.', life: 3000 });
    formData.value = { requestId: null, suppliers: [], message: '', includeSpecs: false };
  } else {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to send quotation request.', life: 3000 });
  }
};
</script>