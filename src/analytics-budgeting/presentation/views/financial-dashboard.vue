<template>
  <div class="max-w-7xl mx-auto">

    <div class="mb-5">
      <h2 class="m-0 text-gray-800 font-bold text-3xl">{{ $t('budget.title') }}</h2>
      <p class="text-gray-500 mt-1">{{ $t('budget.subtitle') }}</p>
    </div>

    <div class="grid mb-5">
      <div class="col-12 md:col-4">
        <pv-card class="shadow-1 border-none border-round-xl">
          <template #content>
            <div class="flex justify-content-between align-items-center">
              <div>
                <span class="block text-gray-500 font-medium mb-2">{{ $t('budget.total') }}</span>
                <div class="text-gray-900 font-bold text-3xl">$850,000</div>
              </div>
              <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width: 3rem; height: 3rem">
                <i class="pi pi-wallet text-blue-500 text-xl"></i>
              </div>
            </div>
          </template>
        </pv-card>
      </div>

      <div class="col-12 md:col-4">
        <pv-card class="shadow-1 border-none border-round-xl">
          <template #content>
            <div class="flex justify-content-between align-items-center">
              <div>
                <span class="block text-gray-500 font-medium mb-2">{{ $t('budget.spent') }}</span>
                <div class="text-gray-900 font-bold text-3xl">$435,000</div>
              </div>
              <div class="flex align-items-center justify-content-center bg-orange-100 border-round" style="width: 3rem; height: 3rem">
                <i class="pi pi-chart-line text-orange-500 text-xl"></i>
              </div>
            </div>
          </template>
        </pv-card>
      </div>

      <div class="col-12 md:col-4">
        <pv-card class="shadow-1 border-none border-round-xl">
          <template #content>
            <div class="flex justify-content-between align-items-center">
              <div>
                <span class="block text-gray-500 font-medium mb-2">{{ $t('budget.remaining') }}</span>
                <div class="text-gray-900 font-bold text-3xl">$415,000</div>
              </div>
              <div class="flex align-items-center justify-content-center bg-green-100 border-round" style="width: 3rem; height: 3rem">
                <i class="pi pi-dollar text-green-500 text-xl"></i>
              </div>
            </div>
          </template>
        </pv-card>
      </div>
    </div>

    <pv-card class="shadow-1 border-none border-round-xl">
      <template #content>
        <pv-data-table :value="store.budgets" :loading="store.isLoading" responsiveLayout="scroll" class="p-datatable-sm">
          <pv-column field="project" :header="$t('budget.project')">
            <template #body="slotProps"><span class="font-bold text-gray-800">{{ slotProps.data.project }}</span></template>
          </pv-column>
          <pv-column field="totalAmount" :header="$t('budget.total')">
            <template #body="slotProps">${{ slotProps.data.totalAmount.toLocaleString() }}</template>
          </pv-column>
          <pv-column field="spentAmount" :header="$t('budget.spent')">
            <template #body="slotProps">${{ slotProps.data.spentAmount.toLocaleString() }}</template>
          </pv-column>
          <pv-column field="status" :header="$t('budget.status')">
            <template #body="slotProps">
              <pv-tag :severity="getStatusSeverity(slotProps.data.status)" :value="slotProps.data.status" />
            </template>
          </pv-column>
        </pv-data-table>
      </template>
    </pv-card>

  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAnalyticsStore } from '../../application/analytics.store.js';

const store = useAnalyticsStore();

onMounted(() => {
  store.fetchBudgets();
});

const getStatusSeverity = (status) => {
  if (status === 'On Track') return 'success';
  if (status === 'At Risk') return 'warning';
  if (status === 'Over Budget') return 'danger';
  return 'info';
};
</script>