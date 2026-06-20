<template>
  <div class="view-content">

    <!-- Filters Row -->
    <div class="filters-row">
      <div class="filter-group">
        <label class="filter-label">{{ $t('material_request.project') }}</label>
        <pv-select v-model="filters.project" :options="projects" :placeholder="$t('common.all')" class="filter-select" />
      </div>
      <div class="filter-group">
        <label class="filter-label">{{ $t('material_request.status') }}</label>
        <pv-select v-model="filters.status" :options="statuses" :placeholder="$t('common.all')" class="filter-select" />
      </div>
      <div class="filter-group">
        <label class="filter-label">{{ $t('material_request.priority') }}</label>
        <pv-select v-model="filters.priority" :options="priorities" :placeholder="$t('common.all')" class="filter-select" />
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
      <pv-data-table :value="requests" class="buildline-datatable" :rows="15">
        <pv-column field="id" :header="$t('material_request.request_id')"></pv-column>
        <pv-column field="material" :header="$t('material_request.material')">
          <template #body="slotProps">
            <span class="font-semibold">{{ slotProps.data.material }}</span>
          </template>
        </pv-column>
        <pv-column field="project" :header="$t('material_request.project')"></pv-column>
        <pv-column field="priority" :header="$t('material_request.priority')">
          <template #body="slotProps">
            <span :class="['priority-badge', 'priority-' + slotProps.data.priority.toLowerCase()]">
              {{ translatePriority(slotProps.data.priority) }}
            </span>
          </template>
        </pv-column>
        <pv-column field="status" :header="$t('material_request.status')">
          <template #body="slotProps">
            <span :class="['status-badge', 'status-' + slotProps.data.status.toLowerCase()]">
              {{ translateStatus(slotProps.data.status) }}
            </span>
          </template>
        </pv-column>
        <pv-column field="requestedOn" :header="$t('material_request.requested_on')"></pv-column>
        <template #empty>
          <div class="tenant-empty-state">{{ $t('common.company_empty_data') }}</div>
        </template>
      </pv-data-table>

      <!-- Pagination -->
      <div class="pagination-row">
        <div class="pagination-info">
          {{ $t('users.items_per_page') }}:
          <span class="pagination-count">15 <i class="pi pi-caret-down"></i></span>
        </div>
        <div class="pagination-controls">
          <i class="pi pi-caret-left pagination-arrow"></i>
          <span v-for="n in 5" :key="n" :class="['page-num', n === 1 ? 'page-active' : '']">{{ n }}</span>
          <i class="pi pi-caret-right pagination-arrow"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRequisitionStore } from '../../application/requisition.store.js';
import { useReferenceDataStore } from '../../../shared/application/reference-data.store.js';
import { useI18n } from 'vue-i18n';

const requisitionStore = useRequisitionStore();
const referenceStore = useReferenceDataStore();
const { t } = useI18n();
const activeTab = ref('All');
const searchQuery = ref('');
const filters = ref({ project: null, status: null, priority: null });

const projects = computed(() => referenceStore.projectNames);
const statuses = computed(() => [...new Set(requisitionStore.requests.map(request => request.status).filter(Boolean))]);
const priorities = computed(() => [...new Set(requisitionStore.requests.map(request => request.priority).filter(Boolean))]);
const requests = computed(() => requisitionStore.requests.filter(request => {
  if (activeTab.value !== 'All' && request.status !== activeTab.value) return false;
  if (filters.value.project && request.project !== filters.value.project) return false;
  if (filters.value.status && request.status !== filters.value.status) return false;
  if (filters.value.priority && request.priority !== filters.value.priority) return false;
  return true;
}));

const tabs = computed(() => {
  const all = requisitionStore.requests;
  return [
    { name: 'All', label: `${t('common.all')} (${all.length})` },
    ...statuses.value.map(status => ({
      name: status,
      label: `${translateStatus(status)} (${all.filter(request => request.status === status).length})`
    }))
  ];
});

const clearFilters = () => {
  filters.value = { project: null, status: null, priority: null };
};

const translateStatus = (status) => t(`common.${String(status || '').toLowerCase()}`, status);
const translatePriority = (priority) => t(`common.${String(priority || '').toLowerCase()}`, priority);

const fetchRequests = async () => {
  await Promise.all([
    requisitionStore.fetchRequests(),
    referenceStore.fetchAll()
  ]);
};

onMounted(fetchRequests);
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
  color: #4338CA;
  border-bottom-color: #4338CA;
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
</style>
