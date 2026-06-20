<template>
  <div class="view-content">

    <!-- Filters -->
    <div class="filters-row">
      <div class="filter-group">
        <label class="filter-label">{{ $t('quotations.supplier') }}</label>
        <pv-select v-model="filters.supplier" :options="suppliers" :placeholder="$t('purchase_orders.all_suppliers')" class="filter-select" />
      </div>
      <div class="filter-group">
        <label class="filter-label">{{ $t('quotations.status') }}</label>
        <pv-select v-model="filters.status" :options="statuses" :placeholder="$t('purchase_orders.all_status')" class="filter-select" />
      </div>
      <div class="filter-group">
        <label class="filter-label">{{ $t('common.date') }}</label>
        <div class="date-input-wrapper">
          <pv-input-text type="text" :placeholder="$t('reports.select_period')" class="date-input" />
          <i class="pi pi-calendar date-icon"></i>
        </div>
      </div>
      <div class="filter-group">
        <label class="filter-label">{{ $t('common.date') }}</label>
        <div class="date-input-wrapper">
          <pv-input-text type="text" :placeholder="$t('reports.select_period')" class="date-input" />
          <i class="pi pi-calendar date-icon"></i>
        </div>
      </div>
      <div class="filter-group filter-action">
        <pv-button :label="$t('common.clear_filters')" icon="pi pi-times" iconPos="right"
                   class="p-button-outlined clear-filters-btn" @click="clearFilters" />
      </div>
      <pv-button :label="$t('quotations.new_request')" icon="pi pi-plus" class="new-request-btn" @click="showRequestDialog = true" />
    </div>

    <!-- Tabs -->
    <div class="tabs-row">
      <div v-for="tab in tabs" :key="tab.name"
           :class="['tab-item', activeTab === tab.name ? 'tab-active' : '']"
           @click="activeTab = tab.name">
        {{ tab.label }}
      </div>
    </div>

    <!-- Table Card -->
    <div class="table-card">
      <pv-data-table :value="filteredQuotations" class="buildline-datatable" :rows="10">
        <pv-column field="quotationId" :header="$t('quotations.request_id')"></pv-column>
        <pv-column field="supplier" :header="$t('quotations.supplier')"></pv-column>
        <pv-column field="material" :header="$t('quotations.material')"></pv-column>
        <pv-column field="project" :header="$t('quotations.project')"></pv-column>
        <pv-column field="amount" :header="$t('quotations.amount')">
          <template #body="slotProps">
            <span class="font-bold text-900">${{ Number(slotProps.data.amount).toLocaleString() }}</span>
          </template>
        </pv-column>
        <pv-column field="status" :header="$t('quotations.status')">
          <template #body="slotProps">
            <span :class="['status-badge', 'status-' + slotProps.data.status.toLowerCase()]">
              {{ translateQuotationStatus(slotProps.data.status) }}
            </span>
          </template>
        </pv-column>
        <pv-column field="date" :header="$t('quotations.date')"></pv-column>
        <template #empty>
          <div class="tenant-empty-state">{{ $t('common.company_empty_data') }}</div>
        </template>
      </pv-data-table>

      <!-- Pagination -->
      <div class="pagination-row">
        <div class="pagination-info">
          {{ $t('users.items_per_page') }}:
          <span class="pagination-count">10 <i class="pi pi-caret-down"></i></span>
        </div>
        <div class="pagination-controls">
          <i class="pi pi-caret-left pagination-arrow"></i>
          <span v-for="n in 3" :key="n" :class="['page-num', n === 1 ? 'page-active' : '']">{{ n }}</span>
          <i class="pi pi-caret-right pagination-arrow"></i>
        </div>
      </div>
    </div>

    <!-- Generate Quotation Request Dialog -->
    <pv-dialog v-model:visible="showRequestDialog" modal :style="{ width: '540px' }" :showHeader="false" class="p-0">
      <div class="dialog-form">
        <h3 class="dialog-title">{{ $t('quotations.generate_request') }}</h3>

        <div class="form-field">
          <label class="form-label">{{ $t('quotations.request_id') }}</label>
          <pv-select v-model="reqForm.requestId" :options="requestIdOptions" :placeholder="$t('quotations.request_id')" class="w-full form-input" />
        </div>

        <div class="form-field">
          <label class="form-label">{{ $t('quotations.select_suppliers') }} <span class="required">*</span></label>
          <pv-multi-select v-model="reqForm.suppliers" :options="supplierOptions" :placeholder="$t('quotations.select_suppliers')" display="chip" class="w-full form-input" />
        </div>

        <div class="form-field">
          <label class="form-label">{{ $t('quotations.message') }}</label>
          <pv-textarea v-model="reqForm.message" rows="3" placeholder="Please provide your best quotation for the following material. Delivery required by: May 25, 2026" class="w-full form-input" />
        </div>

        <div class="form-field">
          <label class="form-label">{{ $t('quotations.attach_details') }}</label>
          <div class="flex align-items-center gap-2 mt-1">
            <pv-checkbox v-model="reqForm.attachSpecs" :binary="true" />
            <span class="checkbox-text">{{ $t('quotations.include_specs') }}</span>
          </div>
        </div>

        <div class="dialog-footer">
          <pv-button :label="$t('common.cancel')" class="p-button-text cancel-btn" @click="showRequestDialog = false" />
          <pv-button :label="$t('quotations.send_request')" icon="pi pi-send" class="send-request-btn" @click="sendQuotationRequest" />
        </div>
      </div>
    </pv-dialog>

    <pv-toast />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useProcurementStore } from '../../application/procurement.store.js';
import { useSuppliersStore } from '../../../suppliers/application/suppliers.store.js';
import { useRequisitionStore } from '../../../requisition/application/requisition.store.js';
import { buildNextBusinessCode } from '../../../shared/application/business-code.js';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';

const toast = useToast();
const { t } = useI18n();
const store = useProcurementStore();
const suppliersStore = useSuppliersStore();
const requisitionStore = useRequisitionStore();

const searchQuery = ref('');
const activeTab = ref('All');
const filters = ref({ supplier: null, status: null });

const statuses = computed(() => [...new Set(store.quotations.map(quotation => quotation.status).filter(Boolean))]);

onMounted(async () => {
  await Promise.all([
    store.fetchQuotations(),
    suppliersStore.fetchSuppliers(),
    requisitionStore.fetchRequests()
  ]);
});

const suppliers = computed(() => suppliersStore.suppliersList.map(s => s.companyName));

const tabs = computed(() => {
  const all = store.quotations.length;
  const pending = store.pendingQuotations.length;
  const accepted = store.acceptedQuotations.length;
  const rejected = store.quotations.filter(q => q.status === 'Rejected').length;
  return [
    { name: 'All', label: `${t('common.all')} (${all})` },
    { name: 'Pending', label: `${t('quotations.pending')} (${pending})` },
    { name: 'Accepted', label: `${t('quotations.accepted')} (${accepted})` },
    { name: 'Rejected', label: `${t('quotations.rejected')} (${rejected})` }
  ];
});

const filteredQuotations = computed(() => {
  return store.quotations.filter(q => {
    if (activeTab.value !== 'All' && q.status !== activeTab.value) return false;
    if (filters.value.supplier && q.supplier !== filters.value.supplier) return false;
    if (filters.value.status && q.status !== filters.value.status) return false;
    return true;
  });
});

// Dialog state
const showRequestDialog = ref(false);
const supplierOptions = computed(() => suppliersStore.suppliersList.map(s => s.companyName));
const requestIdOptions = computed(() => requisitionStore.requests.map(r => `${r.reqId} - ${r.material}`));
const selectedRequest = computed(() => {
  const requestCode = reqForm.value.requestId?.split(' - ')[0];
  return requisitionStore.requests.find(request => request.reqId === requestCode);
});

const reqForm = ref({
  requestId: null,
  suppliers: [],
  message: '',
  attachSpecs: false
});

const sendQuotationRequest = async () => {
  if (!selectedRequest.value || reqForm.value.suppliers.length === 0) {
    toast.add({ severity: 'warn', summary: 'Missing data', detail: 'Select a material request and at least one supplier.', life: 3000 });
    return;
  }

  const estimatedAmount = Math.max(
    1,
    Number(selectedRequest.value.quantity || 1) * Number(selectedRequest.value.unitPrice || 25)
  );
  const newQt = {
    quotationId: buildNextBusinessCode(store.quotations, 'quotationId', 'QT', new Date().getFullYear(), 4),
    supplier: reqForm.value.suppliers[0],
    material: selectedRequest.value.material,
    project: selectedRequest.value.project,
    amount: estimatedAmount,
    status: 'Pending',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  };
  const success = await store.createQuotation(newQt);
  if (success) {
    showRequestDialog.value = false;
    reqForm.value = { requestId: null, suppliers: [], message: '', attachSpecs: false };
    toast.add({ severity: 'success', summary: 'Sent', detail: 'Quotation request sent successfully.', life: 3000 });
  }
};

const clearFilters = () => {
  filters.value = { supplier: null, status: null };
};

const translateQuotationStatus = (status) => t(`quotations.${String(status || '').toLowerCase()}`, status);
</script>

<style scoped>
.view-content {
  width: 100%;
}

.filters-row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 16px;
  margin-bottom: 24px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-label {
  font-size: 11px;
  font-weight: 700;
  color: #6B7280;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.filter-action {
  margin-left: auto;
}

.date-input-wrapper {
  position: relative;
  width: 160px;
}

.date-input {
  width: 100%;
  padding-right: 36px !important;
}

.date-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9CA3AF;
  pointer-events: none;
}

.clear-filters-btn {
  color: #4F679B !important;
  border-color: #E2E8F0 !important;
  border-radius: 12px !important;
  font-weight: 600 !important;
  font-size: 13px !important;
  padding: 10px 20px !important;
}

.tabs-row {
  display: flex;
  gap: 28px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 20px;
}

.tab-item {
  padding-bottom: 12px;
  font-size: 13px;
  font-weight: 700;
  color: #9CA3AF;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 3px solid transparent;
}

.tab-item:hover {
  color: #6B7280;
}

.tab-active {
  color: #3d63a1;
  border-bottom-color: #3d63a1;
}

.table-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 1px 12px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.pagination-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-top: 1px solid #f3f3f3;
}

.pagination-info {
  font-size: 12px;
  font-weight: 600;
  color: #9CA3AF;
}

.pagination-count {
  color: #111827;
  font-weight: 800;
  margin-left: 4px;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}

.pagination-arrow {
  color: #9CA3AF;
  cursor: pointer;
  font-size: 14px;
  padding: 4px;
}

.page-num {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  color: #9CA3AF;
  cursor: pointer;
  transition: all 0.15s ease;
}

.page-num:hover {
  color: #374151;
}

.page-active {
  background: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  color: #111827;
}

.tenant-empty-state {
  padding: 40px 24px;
  color: #94A3B8;
  font-size: 13px;
  font-weight: 700;
  text-align: center;
}

:deep(.filter-select) {
  min-width: 160px;
  border: 1px solid #E5E7EB !important;
  border-radius: 12px !important;
  background: white !important;
}

.new-request-btn {
  background: #F96116 !important;
  border-color: #F96116 !important;
  border-radius: 12px !important;
  font-weight: 700 !important;
  font-size: 13px !important;
  padding: 10px 24px !important;
}
.new-request-btn:hover { background: #e05510 !important; }

/* Dialog form styles */
.dialog-form {
  padding: 32px;
}
.dialog-title {
  font-size: 18px;
  font-weight: 800;
  color: #1E293B;
  margin: 0 0 24px 0;
}
.form-field {
  margin-bottom: 20px;
}
.form-label {
  display: block;
  font-size: 13px;
  font-weight: 700;
  color: #374151;
  margin-bottom: 8px;
}
.required { color: #F96116; }
:deep(.form-input) {
  border: 1px solid #E5E7EB !important;
  border-radius: 10px !important;
  background: #FAFBFC !important;
  font-size: 13px !important;
}
.checkbox-text {
  font-size: 13px;
  color: #64748B;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
  padding-top: 20px;
  border-top: 1px solid #F1F5F9;
}
.cancel-btn {
  color: #64748B !important;
  font-weight: 700 !important;
  font-size: 13px !important;
}
.send-request-btn {
  background: #F96116 !important;
  border-color: #F96116 !important;
  border-radius: 12px !important;
  font-weight: 700 !important;
  font-size: 13px !important;
  padding: 10px 24px !important;
}
</style>
