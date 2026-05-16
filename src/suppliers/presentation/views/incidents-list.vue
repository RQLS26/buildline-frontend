<template>
  <div class="view-content font-inter">

    <!-- Action Row -->
    <div class="action-row">
      <div class="filter-group">
        <label class="filter-label">Severity</label>
        <pv-select v-model="filters.severity" :options="severities" placeholder="All" class="filter-select" />
      </div>
      <div class="filter-group">
        <label class="filter-label">Status</label>
        <pv-select v-model="filters.status" :options="statuses" placeholder="All" class="filter-select" />
      </div>
      <div class="ml-auto">
        <pv-button label="Report Incident" icon="pi pi-plus" class="report-btn" @click="showReportDialog = true" />
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

    <!-- Incident Log (timeline-style) -->
    <div class="incident-log">
      <div v-for="(group, gIdx) in groupedIncidents" :key="gIdx" class="log-group">
        <div class="log-date-header">
          <span class="log-date">{{ group.date }}</span>
          <span class="log-count">{{ group.items.length }} incident{{ group.items.length > 1 ? 's' : '' }}</span>
        </div>

        <div class="log-entries">
          <div v-for="inc in group.items" :key="inc.id" class="log-entry">
            <!-- Timeline dot -->
            <div class="log-timeline">
              <div :class="['log-dot', 'severity-' + inc.severity.toLowerCase()]"></div>
              <div class="log-line"></div>
            </div>

            <!-- Entry card -->
            <div class="log-card">
              <div class="log-card-header">
                <div class="log-card-left">
                  <span class="log-id">{{ inc.incidentId }}</span>
                  <span :class="['severity-tag', 'severity-' + inc.severity.toLowerCase()]">{{ inc.severity }}</span>
                  <span :class="['status-tag', getStatusClass(inc.status)]">{{ inc.status }}</span>
                </div>
                <span class="log-time">{{ inc.time }}</span>
              </div>

              <h4 class="log-title">{{ inc.title }}</h4>
              <p class="log-description">{{ inc.description }}</p>

              <div class="log-meta">
                <div class="meta-item">
                  <i class="pi pi-building"></i>
                  <span>{{ inc.supplier }}</span>
                </div>
                <div class="meta-item">
                  <i class="pi pi-shopping-bag"></i>
                  <span>{{ inc.purchaseOrder }}</span>
                </div>
                <div class="meta-item">
                  <i class="pi pi-user"></i>
                  <span>{{ inc.reportedBy }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Report Incident Dialog -->
    <pv-dialog v-model:visible="showReportDialog" modal header="Report Incident" :style="{ width: '550px' }">
      <div class="flex flex-column gap-4 pt-2">
        <div class="flex flex-column gap-2">
          <label class="filter-label">Title *</label>
          <pv-input-text v-model="newIncident.title" placeholder="Brief description of the incident" class="w-full" />
        </div>
        <div class="flex flex-column gap-2">
          <label class="filter-label">Description</label>
          <pv-textarea v-model="newIncident.description" rows="3" placeholder="Detailed description..." class="w-full" />
        </div>
        <div class="flex gap-3">
          <div class="flex flex-column gap-2 flex-1">
            <label class="filter-label">Supplier *</label>
            <pv-input-text v-model="newIncident.supplier" placeholder="Supplier name" class="w-full" />
          </div>
          <div class="flex flex-column gap-2 flex-1">
            <label class="filter-label">{{ $t('incidents.purchase_order') }}</label>
            <pv-input-text v-model="newIncident.purchaseOrder" placeholder="PO-2026-XXXX" class="w-full" />
          </div>
        </div>
        <div class="flex gap-3">
          <div class="flex flex-column gap-2 flex-1">
            <label class="filter-label">Severity *</label>
            <pv-select v-model="newIncident.severity" :options="severities" placeholder="Select" class="w-full" />
          </div>
          <div class="flex flex-column gap-2 flex-1">
            <label class="filter-label">{{ $t('incidents.reported_by') }}</label>
            <pv-input-text v-model="newIncident.reportedBy" placeholder="Your name" class="w-full" />
          </div>
        </div>
      </div>
      <template #footer>
        <pv-button label="Cancel" class="p-button-text" @click="showReportDialog = false" />
        <pv-button label="Submit Report" icon="pi pi-check" class="report-btn" @click="handleReportIncident" />
      </template>
    </pv-dialog>

    <pv-toast />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useSuppliersStore } from '../../application/suppliers.store.js';
import { useToast } from 'primevue/usetoast';

const suppliersStore = useSuppliersStore();
const toast = useToast();
const activeTab = ref('All');
const filters = ref({ severity: null, status: null });
const showReportDialog = ref(false);

const severities = ['High', 'Medium', 'Low'];
const statuses = ['Open', 'In Progress', 'Resolved'];

onMounted(async () => {
  await suppliersStore.fetchIncidents();
});

const tabs = computed(() => {
  const list = suppliersStore.incidentsList;
  return [
    { name: 'All', label: `All (${list.length})` },
    { name: 'Open', label: `Open (${suppliersStore.openIncidents.length})` },
    { name: 'InProgress', label: `In Progress (${suppliersStore.inProgressIncidents.length})` },
    { name: 'Resolved', label: `Resolved (${suppliersStore.resolvedIncidents.length})` }
  ];
});

const filteredIncidents = computed(() => {
  return suppliersStore.incidentsList.filter(inc => {
    if (activeTab.value === 'Open' && inc.status !== 'Open') return false;
    if (activeTab.value === 'InProgress' && inc.status !== 'In Progress') return false;
    if (activeTab.value === 'Resolved' && inc.status !== 'Resolved') return false;
    if (filters.value.severity && inc.severity !== filters.value.severity) return false;
    if (filters.value.status && inc.status !== filters.value.status) return false;
    return true;
  });
});

const groupedIncidents = computed(() => {
  const groups = {};
  filteredIncidents.value.forEach(inc => {
    const date = inc.date || 'Unknown';
    if (!groups[date]) groups[date] = [];
    groups[date].push(inc);
  });
  return Object.keys(groups).map(date => ({ date, items: groups[date] }));
});

const getStatusClass = (status) => {
  if (status === 'Open') return 'tag-open';
  if (status === 'In Progress') return 'tag-progress';
  return 'tag-resolved';
};

const newIncident = ref({
  title: '', description: '', supplier: '', purchaseOrder: '', severity: null, reportedBy: ''
});

const handleReportIncident = async () => {
  if (!newIncident.value.title || !newIncident.value.supplier || !newIncident.value.severity) {
    toast.add({ severity: 'warn', summary: 'Warning', detail: 'Fill required fields.', life: 3000 });
    return;
  }
  const incidentData = {
    incidentId: `INC-${String(suppliersStore.incidentsList.length + 1).padStart(3, '0')}`,
    title: newIncident.value.title,
    description: newIncident.value.description,
    supplier: newIncident.value.supplier,
    purchaseOrder: newIncident.value.purchaseOrder || 'N/A',
    severity: newIncident.value.severity,
    status: 'Open',
    reportedBy: newIncident.value.reportedBy || 'System',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  };
  const success = await suppliersStore.createIncident(incidentData);
  if (success) {
    showReportDialog.value = false;
    newIncident.value = { title: '', description: '', supplier: '', purchaseOrder: '', severity: null, reportedBy: '' };
    toast.add({ severity: 'success', summary: 'Reported', detail: `Incident ${incidentData.incidentId} registered.`, life: 3000 });
  }
};
</script>

<style scoped>
.view-content { width: 100%; }

.action-row {
  display: flex;
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
  color: #64748B;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}
.report-btn {
  background: #E02424 !important;
  border-color: #E02424 !important;
  border-radius: 12px !important;
  font-weight: 700 !important;
  font-size: 13px !important;
  padding: 10px 24px !important;
}

.tabs-row {
  display: flex;
  gap: 28px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 24px;
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

/* Incident Log */
.incident-log {
  display: flex;
  flex-direction: column;
  gap: 32px;
}
.log-date-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}
.log-date {
  font-size: 13px;
  font-weight: 800;
  color: #1E293B;
}
.log-count {
  font-size: 11px;
  font-weight: 600;
  color: #94A3B8;
  background: #F1F5F9;
  padding: 2px 10px;
  border-radius: 10px;
}

.log-entries {
  display: flex;
  flex-direction: column;
  gap: 0;
}
.log-entry {
  display: flex;
  gap: 16px;
}

/* Timeline */
.log-timeline {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 20px;
}
.log-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-top: 6px;
  flex-shrink: 0;
  border: 3px solid;
}
.log-dot.severity-high { background: #E02424; border-color: #FEECEB; }
.log-dot.severity-medium { background: #94A3B8; border-color: #F3F4F6; }
.log-dot.severity-low { background: #94A3B8; border-color: #F3F4F6; }
.log-line {
  width: 2px;
  flex: 1;
  background: #E2E8F0;
  min-height: 20px;
}
.log-entry:last-child .log-line { display: none; }

/* Log Card */
.log-card {
  flex: 1;
  background: white;
  border-radius: 16px;
  padding: 16px 20px;
  margin-bottom: 12px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.04);
  border-left: 3px solid transparent;
}
.log-entry:has(.log-dot.severity-high) .log-card { border-left-color: #E02424; }
.log-entry:nth-child(1) .log-card,
.log-entry:nth-child(2) .log-card { border-left-color: #E02424; }

.log-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.log-card-left {
  display: flex;
  align-items: center;
  gap: 8px;
}
.log-id {
  font-size: 12px;
  font-weight: 800;
  color: #3d63a1;
}
.severity-tag {
  font-size: 10px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 4px;
}
.severity-tag.severity-high { background: #FEECEB; color: #E02424; }
.severity-tag.severity-medium { background: #F3F4F6; color: #64748B; }
.severity-tag.severity-low { background: #F3F4F6; color: #64748B; }

.status-tag {
  font-size: 10px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 4px;
}
.tag-open { background: #FEECEB; color: #E02424; }
.tag-progress { background: #F3F4F6; color: #64748B; }
.tag-resolved { background: #EAF8F0; color: #3D9F7D; }

.log-time {
  font-size: 11px;
  font-weight: 600;
  color: #94A3B8;
}
.log-title {
  font-size: 14px;
  font-weight: 700;
  color: #1E293B;
  margin: 0 0 6px 0;
}
.log-description {
  font-size: 12px;
  color: #64748B;
  line-height: 1.5;
  margin: 0 0 12px 0;
}
.log-meta {
  display: flex;
  gap: 20px;
}
.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 600;
  color: #94A3B8;
}
.meta-item i {
  font-size: 12px;
  color: #CBD5E1;
}

:deep(.filter-select) {
  min-width: 160px;
  border: 1px solid #E5E7EB !important;
  border-radius: 12px !important;
  background: white !important;
}
</style>