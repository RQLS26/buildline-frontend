<template>
  <div class="view-content font-inter">
    <pv-toast />

    <!-- Action Row -->
    <div class="action-row">
      <div class="filter-group">
        <label class="filter-label">Priority</label>
        <pv-select v-model="filterPriority" :options="['All', 'High', 'Medium', 'Low']" placeholder="All" class="filter-select" />
      </div>
      <div class="filter-group">
        <label class="filter-label">Status</label>
        <pv-select v-model="filterStatus" :options="statusOptions" placeholder="All" class="filter-select" />
      </div>
      <div class="ml-auto">
        <pv-button label="New Request" icon="pi pi-plus" class="new-request-btn" @click="showDialog = true" />
      </div>
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
      <pv-data-table :value="filteredRequests" class="buildline-datatable" :rows="10">
        <pv-column field="reqId" header="Request ID"></pv-column>
        <pv-column field="material" header="Material">
          <template #body="slotProps">
            <span class="font-semibold">{{ slotProps.data.material }}</span>
          </template>
        </pv-column>
        <pv-column field="project" header="Project"></pv-column>
        <pv-column field="quantity" header="Qty">
          <template #body="slotProps">
            <span class="font-bold">{{ slotProps.data.quantity || '—' }}</span> <span style="color: #94A3B8;">{{ slotProps.data.unit || '' }}</span>
          </template>
        </pv-column>
        <pv-column field="priority" header="Priority">
          <template #body="slotProps">
            <span :class="['priority-badge', 'priority-' + slotProps.data.priority.toLowerCase()]">
              {{ slotProps.data.priority }}
            </span>
          </template>
        </pv-column>
        <pv-column field="status" header="Status">
          <template #body="slotProps">
            <span :class="['status-badge', 'status-' + slotProps.data.status.toLowerCase()]">
              {{ slotProps.data.status }}
            </span>
          </template>
        </pv-column>
        <pv-column field="requestedOn" header="Requested On"></pv-column>
      </pv-data-table>

      <!-- Pagination -->
      <div class="pagination-row">
        <div class="pagination-info">
          Item per page:
          <span class="pagination-count">10 <i class="pi pi-caret-down"></i></span>
        </div>
        <div class="pagination-controls">
          <i class="pi pi-caret-left pagination-arrow"></i>
          <span v-for="n in 2" :key="n" :class="['page-num', n === 1 ? 'page-active' : '']">{{ n }}</span>
          <i class="pi pi-caret-right pagination-arrow"></i>
        </div>
      </div>
    </div>

    <!-- New Material Request Dialog -->
    <pv-dialog v-model:visible="showDialog" modal :style="{ width: '560px' }" :showHeader="false">
      <div class="dialog-form">
        <div class="dialog-header-row">
          <h3 class="dialog-title">New Material Request</h3>
          <button class="close-btn" @click="showDialog = false"><i class="pi pi-times"></i></button>
        </div>

        <div class="form-row-2">
          <div class="form-field">
            <label class="form-label">Project <span class="required">*</span></label>
            <pv-select v-model="formData.project" :options="projects" placeholder="Select project" class="w-full form-input" />
          </div>
          <div class="form-field">
            <label class="form-label">Material <span class="required">*</span></label>
            <pv-select v-model="formData.material" :options="materials" placeholder="Search materials..." class="w-full form-input" />
          </div>
        </div>

        <div class="form-row-2">
          <div class="form-row-inner">
            <div class="form-field" style="flex: 0 0 80px;">
              <label class="form-label">Quantity <span class="required">*</span></label>
              <pv-input-number v-model="formData.quantity" :min="1" class="w-full form-input" />
            </div>
            <div class="form-field" style="flex: 0 0 90px;">
            <label class="form-label">Unit</label>
              <pv-select v-model="formData.unit" :options="unitOptions" class="w-full form-input" />
            </div>
          </div>
          <div class="form-field">
            <label class="form-label">Priority <span class="required">*</span></label>
            <pv-select v-model="formData.priority" :options="['Low', 'Medium', 'High']" class="w-full form-input" />
          </div>
        </div>

        <div class="form-field">
          <label class="form-label">Delivery Needed By <span class="required">*</span></label>
          <pv-input-text type="date" v-model="formData.deliveryDate" class="w-full form-input" />
        </div>

        <div class="form-field">
          <label class="form-label">Description</label>
          <pv-textarea v-model="formData.description" rows="2" placeholder="Steel rebar for columns on level 5." class="w-full form-input" />
        </div>

        <div class="form-field">
          <label class="form-label">Attach Evidence (JPG, PNG, PDF up to 10MB)</label>
          <div class="evidence-row">
            <div v-for="n in 3" :key="n" class="evidence-thumb">
              <i class="pi pi-image"></i>
            </div>
            <div class="evidence-add">
              <i class="pi pi-plus"></i>
            </div>
          </div>
        </div>

        <div class="dialog-footer">
          <pv-button label="Cancel" class="p-button-outlined cancel-btn" @click="showDialog = false" />
          <pv-button label="Submit Report" icon="pi pi-check" class="submit-btn" @click="submitRequest" />
        </div>
      </div>
    </pv-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRequisitionStore } from '../../application/requisition.store.js';
import { useReferenceDataStore } from '../../../shared/application/reference-data.store.js';
import { buildNextBusinessCode } from '../../../shared/application/business-code.js';
import { useIamStore } from '../../../iam/application/iam.store.js';
import { useToast } from 'primevue/usetoast';

const store = useRequisitionStore();
const referenceStore = useReferenceDataStore();
const iamStore = useIamStore();
const toast = useToast();
const showDialog = ref(false);
const activeTab = ref('All');
const filterPriority = ref('All');
const filterStatus = ref('All');

const projects = computed(() => referenceStore.projectNames);
const materials = computed(() => referenceStore.materialNames);
const unitOptions = computed(() => referenceStore.materialUnits);
const statusOptions = computed(() => ['All', ...new Set(store.requests.map(request => request.status).filter(Boolean))]);

const tabs = computed(() => {
  const reqs = store.requests || [];
  return [
    { name: 'All', label: `All (${reqs.length})` },
    { name: 'Pending', label: `Pending (${store.pendingRequests.length})` },
    { name: 'Approved', label: `Approved (${store.approvedRequests.length})` },
    { name: 'Rejected', label: `Rejected (${store.rejectedRequests.length})` }
  ];
});

const formData = ref({
  project: null,
  material: null,
  quantity: 150,
  unit: 'PCS',
  priority: 'High',
  deliveryDate: '',
  description: ''
});

onMounted(async () => {
  await Promise.all([
    store.fetchRequests(),
    referenceStore.fetchAll()
  ]);
});

const filteredRequests = computed(() => {
  return (store.requests || []).filter(r => {
    if (activeTab.value !== 'All' && r.status !== activeTab.value) return false;
    if (filterPriority.value && filterPriority.value !== 'All' && r.priority !== filterPriority.value) return false;
    if (filterStatus.value && filterStatus.value !== 'All' && r.status !== filterStatus.value) return false;
    return true;
  });
});

const submitRequest = async () => {
  if (!formData.value.project || !formData.value.material || !formData.value.quantity || !formData.value.priority || !formData.value.deliveryDate) {
    toast.add({ severity: 'warn', summary: 'Missing data', detail: 'Select project, material, quantity, priority and delivery date.', life: 3000 });
    return;
  }

  const selectedMaterial = referenceStore.materials.find(material => material.name === formData.value.material);
  const newReq = {
    reqId: buildNextBusinessCode(store.requests, 'reqId', 'MR'),
    material: formData.value.material,
    project: formData.value.project,
    quantity: formData.value.quantity,
    unit: formData.value.unit || selectedMaterial?.unit,
    priority: formData.value.priority,
    status: 'Pending',
    requestedOn: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    deliveryDate: formData.value.deliveryDate,
    requestedBy: iamStore.userName
  };

  const success = await store.createRequest(newReq);
  if (success) {
    toast.add({ severity: 'success', summary: 'Success', detail: 'Material request submitted.', life: 3000 });
    showDialog.value = false;
    formData.value = { project: null, material: null, quantity: 150, unit: 'PCS', priority: 'High', deliveryDate: '', description: '' };
  }
};
</script>

<style scoped>
.view-content { width: 100%; }

.action-row {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  margin-bottom: 16px;
}
.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.filter-label {
  font-size: 11px;
  font-weight: 700;
  color: #64748B;
  text-transform: uppercase;
  letter-spacing: 0.03em;
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

/* Tabs */
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
  color: #94A3B8;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 3px solid transparent;
}
.tab-item:hover { color: #64748B; }
.tab-active { color: #3d63a1; border-bottom-color: #3d63a1; }

/* Table */
.table-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}
.pagination-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-top: 1px solid #F1F5F9;
}
.pagination-info { font-size: 12px; font-weight: 600; color: #94A3B8; }
.pagination-count { color: #1E293B; font-weight: 800; margin-left: 4px; }
.pagination-controls { display: flex; align-items: center; gap: 4px; }
.pagination-arrow { color: #94A3B8; cursor: pointer; font-size: 14px; padding: 4px; }
.page-num {
  width: 32px; height: 32px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 8px; font-size: 12px; font-weight: 700;
  color: #94A3B8; cursor: pointer;
}
.page-active { background: white; box-shadow: 0 1px 4px rgba(0,0,0,0.1); color: #1E293B; }

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
  padding: 4px;
}
.close-btn:hover { color: #374151; }

.form-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.form-row-inner {
  display: flex;
  gap: 12px;
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

/* Evidence section */
.evidence-row {
  display: flex;
  gap: 12px;
  margin-top: 4px;
}
.evidence-thumb {
  width: 72px;
  height: 72px;
  border-radius: 8px;
  background: #F1F5F9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94A3B8;
  font-size: 24px;
}
.evidence-add {
  width: 72px;
  height: 72px;
  border-radius: 8px;
  border: 2px dashed #D1D5DB;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94A3B8;
  font-size: 20px;
  cursor: pointer;
  transition: border-color 0.15s;
}
.evidence-add:hover { border-color: #F96116; color: #F96116; }

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
.submit-btn {
  background: #F96116 !important;
  border-color: #F96116 !important;
  border-radius: 12px !important;
  font-weight: 700 !important;
  font-size: 13px !important;
  padding: 10px 24px !important;
}

:deep(.filter-select) {
  min-width: 140px;
  border: 1px solid #E5E7EB !important;
  border-radius: 12px !important;
  background: white !important;
}
</style>
