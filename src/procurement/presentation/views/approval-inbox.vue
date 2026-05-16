<template>
  <div class="view-content">

    <!-- Filters Row -->
    <div class="filters-row">
      <div class="filter-group">
        <label class="filter-label">Supplier</label>
        <pv-select v-model="filters.supplier" :options="suppliers" placeholder="All suppliers" class="filter-select" />
      </div>
      <div class="filter-group">
        <label class="filter-label">Status</label>
        <pv-select v-model="filters.status" :options="statuses" placeholder="All status" class="filter-select" />
      </div>
      <div class="filter-group">
        <label class="filter-label">Amount Range</label>
        <pv-select v-model="filters.amount" :options="amountRanges" placeholder="Any amount" class="filter-select" />
      </div>
      <div class="filter-group filter-action">
        <pv-button label="Clear filters" icon="pi pi-times" iconPos="right"
                   class="p-button-outlined clear-filters-btn" />
      </div>
      <pv-button label="New PO" icon="pi pi-plus" class="new-po-btn" @click="showPODialog = true" />
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
      <pv-data-table :value="filteredOrders" class="buildline-datatable" :rows="10">
        <pv-column field="orderId" header="Order ID"></pv-column>
        <pv-column field="date" header="Issue Date"></pv-column>
        <pv-column field="supplierName" header="Supplier">
          <template #body="slotProps">
            <span class="font-semibold">{{ slotProps.data.supplierName }}</span>
          </template>
        </pv-column>
        <pv-column field="material" header="Material"></pv-column>
        <pv-column field="project" header="Project"></pv-column>
        <pv-column field="totalAmount" header="Total Amount">
          <template #body="slotProps">
            <span class="font-bold text-900">${{ slotProps.data.totalAmount.toLocaleString() }}</span>
          </template>
        </pv-column>
        <pv-column field="status" header="Status">
          <template #body="slotProps">
            <span :class="['status-badge', 'status-' + slotProps.data.status.toLowerCase().replace(/ /g, '')]">
              {{ slotProps.data.status }}
            </span>
          </template>
        </pv-column>
        <pv-column header="Actions">
          <template #body="slotProps">
            <div class="flex gap-2" v-if="slotProps.data.status === 'Pending'">
              <button class="action-btn approve-btn" @click="approveOrder(slotProps.data)" title="Approve">
                <i class="pi pi-check"></i>
              </button>
              <button class="action-btn reject-btn" @click="rejectOrder(slotProps.data)" title="Reject">
                <i class="pi pi-times"></i>
              </button>
            </div>
            <span v-else class="processed-label">
              <i class="pi pi-lock"></i> Processed
            </span>
          </template>
        </pv-column>
      </pv-data-table>

      <!-- Pagination -->
      <div class="pagination-row">
        <div class="pagination-info">
          Item per page:
          <span class="pagination-count">10 <i class="pi pi-caret-down"></i></span>
        </div>
        <div class="pagination-controls">
          <i class="pi pi-caret-left pagination-arrow"></i>
          <span v-for="n in 3" :key="n" :class="['page-num', n === 1 ? 'page-active' : '']">{{ n }}</span>
          <i class="pi pi-caret-right pagination-arrow"></i>
        </div>
      </div>
    </div>

    <pv-toast />

    <!-- New Purchase Order Dialog -->
    <pv-dialog v-model:visible="showPODialog" modal :style="{ width: '600px' }" :showHeader="false">
      <div class="dialog-form">
        <div class="dialog-header-row">
          <h3 class="dialog-title">New Purchase Order</h3>
          <button class="close-btn" @click="showPODialog = false"><i class="pi pi-times"></i></button>
        </div>

        <div class="form-row-2">
          <div class="form-field">
            <label class="form-label">Supplier <span class="required">*</span></label>
            <pv-select v-model="poForm.supplier" :options="suppliers" placeholder="Select supplier" class="w-full form-input" />
          </div>
          <div class="form-field">
            <label class="form-label">Project <span class="required">*</span></label>
            <pv-select v-model="poForm.project" :options="projectOptions" placeholder="Select project" class="w-full form-input" />
          </div>
        </div>

        <div class="form-field">
          <label class="form-label">Material / Service <span class="required">*</span></label>
          <pv-select v-model="poForm.material" :options="materialOptions" placeholder="Select material or service" class="w-full form-input" />
        </div>

        <div class="form-row-3">
          <div class="form-field">
            <label class="form-label">Quantity <span class="required">*</span></label>
            <pv-input-number v-model="poForm.quantity" :min="1" class="w-full form-input" />
          </div>
          <div class="form-field">
            <label class="form-label">Unit</label>
            <pv-select v-model="poForm.unit" :options="['PCS', 'Tons', 'Bags', 'm3', 'Hours']" class="w-full form-input" />
          </div>
          <div class="form-field">
            <label class="form-label">Unit Price ($) <span class="required">*</span></label>
            <pv-input-number v-model="poForm.unitPrice" :min="0" mode="currency" currency="USD" locale="en-US" class="w-full form-input" :inputStyle="{ maxWidth: '140px' }" />
          </div>
        </div>

        <div class="form-row-2">
          <div class="form-field">
            <label class="form-label">Delivery Date <span class="required">*</span></label>
            <pv-date-picker v-model="poForm.deliveryDate" dateFormat="M dd, yy" class="w-full form-input" placeholder="Select date" />
          </div>
          <div class="form-field">
            <label class="form-label">Payment Terms</label>
            <pv-select v-model="poForm.paymentTerms" :options="['Net 30', 'Net 60', 'Net 90', 'COD', '50% Advance']" class="w-full form-input" />
          </div>
        </div>

        <div class="form-field">
          <label class="form-label">Notes</label>
          <pv-textarea v-model="poForm.notes" rows="2" placeholder="Additional instructions or conditions..." class="w-full form-input" />
        </div>

        <div class="dialog-footer">
          <pv-button label="Cancel" class="p-button-outlined cancel-btn" @click="showPODialog = false" />
          <pv-button label="Create Order" icon="pi pi-check" class="create-btn" @click="createPurchaseOrder" />
        </div>
      </div>
    </pv-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useProcurementStore } from '../../application/procurement.store.js';
import { useIamStore } from '../../../iam/application/iam.store.js';
import { useSuppliersStore } from '../../../suppliers/application/suppliers.store.js';

const toast = useToast();
const store = useProcurementStore();
const iamStore = useIamStore();
const suppliersStore = useSuppliersStore();
const activeTab = ref('All');
const filters = ref({ supplier: null, status: null, amount: null });

const suppliers = computed(() => suppliersStore.suppliersList.map(s => s.companyName));
const statuses = ['Pending', 'Approved', 'Rejected'];
const amountRanges = ['< $10,000', '$10,000 - $50,000', '> $50,000'];

onMounted(async () => {
  await Promise.all([
    store.fetchOrders(),
    suppliersStore.fetchSuppliers()
  ]);
});

const tabs = computed(() => [
  { name: 'All', label: `All (${store.purchaseOrders.length})` },
  { name: 'Pending', label: `Pending (${store.pendingOrders.length})` },
  { name: 'Approved', label: `Approved (${store.approvedOrders.length})` },
  { name: 'Rejected', label: `Rejected (${store.rejectedOrders.length})` }
]);

// PO Dialog
const showPODialog = ref(false);
const projectOptions = ['Skyline Tower', 'Coastal Bridge', 'Grand Park'];
const materialOptions = ['Steel Rebar 1/2"', 'Concrete 3000 PSI', 'Cement Type I', 'Sand Fine', 'Gravel 3/4"', 'PVC Pipes 4"', 'Steel Beams W8', 'Safety Equipment', 'Plywood Sheets'];

const poForm = ref({
  supplier: null,
  project: null,
  material: null,
  quantity: 100,
  unit: 'PCS',
  unitPrice: null,
  deliveryDate: '',
  paymentTerms: 'Net 30',
  notes: ''
});

const createPurchaseOrder = async () => {
  const totalAmount = (poForm.value.quantity || 0) * (poForm.value.unitPrice || 0);
  const newPO = {
    orderId: `PO-2026-00${Math.floor(Math.random() * 90) + 16}`,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    supplierName: poForm.value.supplier || 'Unknown',
    material: poForm.value.material || 'Material',
    project: poForm.value.project || 'Project',
    totalAmount: totalAmount,
    status: 'Pending'
  };
  const success = await store.createOrder(newPO);
  if (success) {
    showPODialog.value = false;
    poForm.value = { supplier: null, project: null, material: null, quantity: 100, unit: 'PCS', unitPrice: null, deliveryDate: '', paymentTerms: 'Net 30', notes: '' };
    toast.add({ severity: 'success', summary: 'Created', detail: `Purchase order ${newPO.orderId} created.`, life: 3000 });
  }
};

const filteredOrders = computed(() => {
  return store.purchaseOrders.filter(order => {
    if (activeTab.value !== 'All' && order.status !== activeTab.value) return false;
    if (filters.value.supplier && order.supplierName !== filters.value.supplier) return false;
    return true;
  });
});

const approveOrder = async (order) => {
  await store.updateOrderStatus(order.id, 'Approved');
  toast.add({ severity: 'success', summary: 'Approved', detail: `Order ${order.orderId} has been approved.`, life: 3000 });
};

const rejectOrder = async (order) => {
  await store.updateOrderStatus(order.id, 'Rejected');
  toast.add({ severity: 'error', summary: 'Rejected', detail: `Order ${order.orderId} has been rejected.`, life: 3000 });
};
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

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  transition: all 0.15s ease;
}

.approve-btn {
  background: #EAF8F0;
  color: #16A34A;
}

.approve-btn:hover {
  background: #16A34A;
  color: white;
}

.reject-btn {
  background: #FEECEB;
  color: #E02424;
}

.reject-btn:hover {
  background: #E02424;
  color: white;
}

.processed-label {
  font-size: 12px;
  font-weight: 600;
  color: #9CA3AF;
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
}

.page-active {
  background: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  color: #111827;
}

:deep(.filter-select) {
  min-width: 160px;
  border: 1px solid #E5E7EB !important;
  border-radius: 12px !important;
  background: white !important;
}

.new-po-btn {
  background: #F96116 !important;
  border-color: #F96116 !important;
  border-radius: 12px !important;
  font-weight: 700 !important;
  font-size: 13px !important;
  padding: 10px 24px !important;
}
.new-po-btn:hover { background: #e05510 !important; }

/* Dialog form */
.dialog-form { padding: 32px; }
.dialog-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.dialog-title {
  font-size: 18px;
  font-weight: 800;
  color: #1E293B;
  margin: 0;
}
.close-btn {
  background: none;
  border: none;
  font-size: 16px;
  color: #94A3B8;
  cursor: pointer;
}
.close-btn:hover { color: #374151; }

.form-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.form-row-3 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
}
.form-field { margin-bottom: 18px; }
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
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
  padding-top: 20px;
  border-top: 1px solid #F1F5F9;
}
.cancel-btn {
  border-radius: 12px !important;
  color: #64748B !important;
  border-color: #E2E8F0 !important;
  font-weight: 700 !important;
  font-size: 13px !important;
  padding: 10px 24px !important;
}
.create-btn {
  background: #F96116 !important;
  border-color: #F96116 !important;
  border-radius: 12px !important;
  font-weight: 700 !important;
  font-size: 13px !important;
  padding: 10px 24px !important;
}
</style>