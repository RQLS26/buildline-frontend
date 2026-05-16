<template>
  <div class="view-content">

    <!-- Filters Row -->
    <div class="filters-row">
      <div class="filter-group">
        <label class="filter-label">Project</label>
        <pv-select v-model="filters.project" :options="projects" placeholder="All projects" class="filter-select" />
      </div>
      <div class="filter-group">
        <label class="filter-label">Status</label>
        <pv-select v-model="filters.status" :options="statuses" placeholder="All status" class="filter-select" />
      </div>
      <div class="filter-group">
        <label class="filter-label">Priority</label>
        <pv-select v-model="filters.priority" :options="priorities" placeholder="All priority" class="filter-select" />
      </div>
      <div class="filter-group">
        <label class="filter-label">Date from</label>
        <div class="date-input-wrapper">
          <pv-input-text type="text" placeholder="Select date" class="date-input" />
          <i class="pi pi-calendar date-icon"></i>
        </div>
      </div>
      <div class="filter-group">
        <label class="filter-label">Date to</label>
        <div class="date-input-wrapper">
          <pv-input-text type="text" placeholder="Select date" class="date-input" />
          <i class="pi pi-calendar date-icon"></i>
        </div>
      </div>
      <div class="filter-group filter-action">
        <pv-button label="Clear filters" icon="pi pi-times" iconPos="right"
                   class="p-button-outlined clear-filters-btn" />
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
        <pv-column field="id" header="Request ID"></pv-column>
        <pv-column field="material" header="Material">
          <template #body="slotProps">
            <span class="font-semibold">{{ slotProps.data.material }}</span>
          </template>
        </pv-column>
        <pv-column field="project" header="Project"></pv-column>
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
import { ref, onMounted } from 'vue';

const activeTab = ref('All');
const searchQuery = ref('');
const filters = ref({ project: null, status: null, priority: null });
const requests = ref([]);

const projects = ['Skyline Tower', 'Coastal Bridge', 'Grand Park'];
const statuses = ['Pending', 'Approved', 'Rejected'];
const priorities = ['High', 'Medium', 'Low'];

const tabs = [
  { name: 'All', label: 'All (17)' },
  { name: 'Pending', label: 'Pending (9)' },
  { name: 'Approved', label: 'Approved (8)' },
  { name: 'Rejected', label: 'Rejected (0)' }
];

const fetchRequests = async () => {
  try {
    const response = await fetch(((import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000') + '/requests'));
    requests.value = await response.json();
  } catch (error) {
    // Fallback data if server is not running
    requests.value = [
      { id: 'MR-2026-00024', material: 'Steel Rebar 1/2"', project: 'Skyline Tower', priority: 'High', status: 'Pending', requestedOn: 'May 19, 2026' },
      { id: 'MR-2026-00023', material: 'Concrete 3000 PSI', project: 'Skyline Tower', priority: 'Medium', status: 'Approved', requestedOn: 'May 18, 2026' },
      { id: 'MR-2026-00022', material: 'Cement Type I', project: 'Skyline Tower', priority: 'High', status: 'Pending', requestedOn: 'May 17, 2026' },
      { id: 'MR-2026-00021', material: 'Sand Fine', project: 'Skyline Tower', priority: 'Low', status: 'Approved', requestedOn: 'May 17, 2026' },
      { id: 'MR-2026-00020', material: 'Steel Rebar 1/2"', project: 'Skyline Tower', priority: 'High', status: 'Pending', requestedOn: 'May 16, 2026' },
      { id: 'MR-2026-00019', material: 'Concrete 3000 PSI', project: 'Coastal Bridge', priority: 'Medium', status: 'Approved', requestedOn: 'May 16, 2026' },
      { id: 'MR-2026-00018', material: 'Cement Type I', project: 'Coastal Bridge', priority: 'High', status: 'Pending', requestedOn: 'May 15, 2026' },
      { id: 'MR-2026-00017', material: 'Sand Fine', project: 'Grand Park', priority: 'Low', status: 'Approved', requestedOn: 'May 15, 2026' },
      { id: 'MR-2026-00016', material: 'Steel Beams W8', project: 'Skyline Tower', priority: 'High', status: 'Pending', requestedOn: 'May 14, 2026' },
      { id: 'MR-2026-00015', material: 'Concrete 3000 PSI', project: 'Grand Park', priority: 'Medium', status: 'Approved', requestedOn: 'May 14, 2026' },
      { id: 'MR-2026-00014', material: 'Cement Type I', project: 'Skyline Tower', priority: 'High', status: 'Pending', requestedOn: 'May 13, 2026' },
      { id: 'MR-2026-00013', material: 'PVC Pipes 4"', project: 'Coastal Bridge', priority: 'Low', status: 'Approved', requestedOn: 'May 13, 2026' },
      { id: 'MR-2026-00012', material: 'Copper Wire 12 AWG', project: 'Skyline Tower', priority: 'Medium', status: 'Pending', requestedOn: 'May 12, 2026' },
      { id: 'MR-2026-00011', material: 'Plywood Sheets', project: 'Grand Park', priority: 'High', status: 'Pending', requestedOn: 'May 12, 2026' },
      { id: 'MR-2026-00010', material: 'Gravel 3/4"', project: 'Coastal Bridge', priority: 'Low', status: 'Approved', requestedOn: 'May 11, 2026' },
    ];
  }
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

:deep(.filter-select) {
  min-width: 160px;
  border: 1px solid #E5E7EB !important;
  border-radius: 12px !important;
  background: white !important;
}
</style>
