<template>
  <div class="max-w-7xl mx-auto mt-2">

    <div class="flex justify-content-between align-items-center mb-5">
      <div>
        <h1 class="m-0 text-gray-900 font-bold text-3xl">{{ $t('incidents.title') }}</h1>
        <p class="text-gray-500 mt-1">{{ $t('incidents.subtitle') }}</p>
      </div>
      <pv-button :label="$t('incidents.report_new')" icon="pi pi-plus" class="bg-red-500 border-red-500 hover:bg-red-600 font-bold" />
    </div>

    <pv-card class="shadow-1 border-none border-round-xl p-0 overflow-hidden">
      <template #content>
        <pv-data-table :value="store.incidentsList" :loading="store.isLoading" responsiveLayout="scroll" :paginator="true" :rows="10" class="p-datatable-sm custom-table">

          <pv-column field="title" :header="$t('incidents.issue')" class="font-bold text-gray-900" style="width: 30%"></pv-column>
          <pv-column field="supplier" :header="$t('incidents.supplier')" class="text-gray-700" style="width: 20%"></pv-column>

          <pv-column :header="$t('incidents.severity')" style="width: 15%">
            <template #body="slotProps">
              <pv-tag :value="slotProps.data.severity" :class="['text-xs font-bold incident-tag', getSeverityClass(slotProps.data.severity)]" />
            </template>
          </pv-column>

          <pv-column :header="$t('incidents.status')" style="width: 15%">
            <template #body="slotProps">
              <pv-tag :value="slotProps.data.status" :class="['text-xs font-bold incident-tag', getStatusClass(slotProps.data.status)]" />
            </template>
          </pv-column>

          <pv-column field="date" :header="$t('incidents.date')" class="text-gray-700" style="width: 20%"></pv-column>

        </pv-data-table>
      </template>
    </pv-card>

  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useIncidentsStore } from '../../application/incidents.store.js';

const store = useIncidentsStore();

onMounted(() => {
  store.fetchIncidents();
});

const getSeverityClass = (severity) => {
  if (severity === 'High') return 'tag-high';
  if (severity === 'Medium') return 'tag-medium';
  return 'tag-low';
};

const getStatusClass = (status) => {
  if (status === 'Resolved') return 'tag-resolved';
  if (status === 'In Progress') return 'tag-progress';
  return 'tag-open';
};
</script>

<style scoped>
:deep(.custom-table .p-datatable-header) { display: none; }
:deep(.custom-table .p-datatable-thead > tr > th) {
  background-color: white; color: #374151; font-weight: 700; font-size: 0.85rem; border-bottom: 2px solid #e5e7eb; padding-bottom: 1rem;
}
:deep(.custom-table .p-datatable-tbody > tr > td) {
  border-bottom: 1px solid #f3f4f6; padding-top: 1.2rem; padding-bottom: 1.2rem; font-size: 0.85rem;
}

:deep(.incident-tag) {
  width: 90px !important;
  display: inline-flex !important;
  justify-content: center !important;
  padding: 0.4rem 0 !important;
  border-radius: 6px !important;
  border: none !important;
}

/* Colores para Severidad */
:deep(.tag-high) { background-color: #fee2e2 !important; color: #991b1b !important; }
:deep(.tag-medium) { background-color: #fef9c3 !important; color: #854d0e !important; }
:deep(.tag-low) { background-color: #eff6ff !important; color: #1d4ed8 !important; }

/* Colores para Estado */
:deep(.tag-resolved) { background-color: #dcfce7 !important; color: #166534 !important; }
:deep(.tag-progress) { background-color: #f3e8ff !important; color: #6b21a8 !important; }
:deep(.tag-open) { background-color: #f1f5f9 !important; color: #475569 !important; }
</style>