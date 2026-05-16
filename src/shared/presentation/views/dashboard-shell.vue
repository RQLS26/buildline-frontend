<template>
  <div class="overview-dashboard-wrapper font-inter">
    <div class="dashboard-grid">
      
      <!-- Fila 1 -->
      <section class="card-total-spend">
        <div class="section-header">
          <h2 class="m-0">{{ $t('home.total_spend') }}</h2>
        </div>
        <div class="content-card h-full flex flex-column p-4">
          <div class="spend-header">
            <div class="amount-section">
              <h3>${{ formatNumber(totalSpent) }}</h3>
              <button class="edit-btn">
                <i class="pi pi-pencil text-gray-500 text-sm"></i>
              </button>
            </div>
            <p class="period">May, 2026</p>
          </div>

          <div class="spend-details flex justify-content-between align-items-center flex-1">
            <div class="targets flex flex-column gap-4">
              <div class="target-item">
                <i class="pi pi-trophy text-[#525256] text-xl"></i>
                <div>
                  <p class="label">{{ $t('home.target_achieved') }}</p>
                  <p class="value">${{ formatNumber(Math.round(totalSpent * 0.67)) }}</p>
                </div>
              </div>
              <div class="target-item">
                <i class="pi pi-bullseye text-[#525256] text-xl"></i>
                <div>
                  <p class="label">{{ $t('home.month_target') }}</p>
                  <p class="value">${{ formatNumber(totalBudget) }}</p>
                </div>
              </div>
            </div>

            <div class="gauge-chart-container flex flex-column align-items-center">
              <div style="position: relative; width: 140px; height: 70px;">
                <pv-chart type="doughnut" :data="gaugeData" :options="gaugeOptions" style="width: 100%; height: 100%;" />
              </div>
              <div class="gauge-labels mt-2" style="width: 150px; display: flex; justify-content: space-between;">
                <span>$0</span>
                <span class="current">{{ Math.round(totalSpent / 1000) }}K</span>
                <span>${{ Math.round(totalBudget / 1000) }}k</span>
              </div>
              <p class="gauge-title mt-1 m-0">{{ $t('home.target_vs_achievement') }}</p>
            </div>
          </div>
        </div>
      </section>

      <section class="card-status-overview">
        <div class="section-header">
          <h2 class="m-0">{{ $t('home.status_overview') }}</h2>
          <button class="view-all" @click="$router.push('/requisition/material-request')">{{ $t('home.view_all') }} <i class="pi pi-chevron-right text-[10px]"></i></button>
        </div>
        <div class="content-card h-full flex flex-column p-3">
          <div v-for="(status, idx) in statusItems" :key="idx" class="status-item">
            <div class="date-box">
              <span class="month">{{ status.month }}</span>
              <span class="day">{{ status.day }}</span>
            </div>
            <div class="status-info">
              <p class="count">{{ status.count }}</p>
              <p class="title">{{ status.title }}</p>
              <p class="subtitle">{{ status.subtitle }}</p>
            </div>
            <div class="time-badge">{{ status.time }}</div>
          </div>
        </div>
      </section>

      <section class="card-quick-actions">
        <div class="section-header">
          <h2 class="m-0">{{ $t('home.quick_actions') }}</h2>
        </div>
        <div class="content-card h-full flex flex-column p-3">
          <div class="actions-grid flex-1 mb-3">
            <button v-for="action in quickActions" :key="action.label" class="action-button" @click="action.handler">
              <i :class="['pi', action.icon, 'text-[#F96116] text-xl']"></i>
              <span>{{ action.label }}</span>
            </button>
          </div>
          <div class="pagination mt-auto flex align-items-center justify-content-center gap-2">
            <i class="pi pi-chevron-left text-primary text-xs cursor-pointer mr-1"></i>
            <button v-for="page in 5" :key="page" :class="{ active: page === 1 }">{{ page }}</button>
            <i class="pi pi-chevron-right text-primary text-xs cursor-pointer ml-1"></i>
          </div>
        </div>
      </section>

      <!-- Fila 2 y 3 (Purchase orders a la izq y resto) -->
      <section class="card-purchase-orders">
        <div class="section-header">
          <h2 class="m-0">{{ $t('home.purchase_orders') }}</h2>
          <button class="view-all" @click="$router.push('/procurement/purchase-orders')">{{ $t('home.view_all') }} <i class="pi pi-chevron-right text-[10px]"></i></button>
        </div>
        <div class="content-card flex flex-column p-4" style="flex: 1; min-height: 0;">
          <div class="menu-tabs">
            <button :class="['tab', poTab === 'All' ? 'active' : '']" @click="poTab = 'All'">All</button>
            <button :class="['tab', poTab === 'Pending' ? 'active' : '']" @click="poTab = 'Pending'">Pending</button>
            <button :class="['tab', poTab === 'Approved' ? 'active' : '']" @click="poTab = 'Approved'">Approved</button>
          </div>
          
          <div class="item-list flex-1" style="overflow-y: auto;">
            <div v-for="order in filteredPOs" :key="order.id" class="order-item">
              <div class="icon-details">
                <div class="icon-container">
                  <i class="pi pi-shopping-bag text-gray-600 text-lg"></i>
                </div>
                <div class="item-info">
                  <p class="item-title">{{ order.orderId }}</p>
                  <p class="item-subtitle">{{ order.supplierName }}</p>
                </div>
              </div>
              <div class="price-info">
                <p class="price">${{ Number(order.totalAmount).toLocaleString() }}</p>
                <p class="date">{{ order.date }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="card-procurement">
        <div class="section-header">
          <h2 class="m-0">{{ $t('home.procurement_performance') }}</h2>
        </div>
        <div class="content-card h-full flex flex-column p-4">
          <div class="chart-header">
            <div class="chart-title">
              <span>{{ $t('home.supplier_response') }}</span>
              <i class="pi pi-chevron-down text-gray-600 text-xs"></i>
            </div>
            <div class="indicator">
              <div class="legend-item">
                <span class="color-box" style="background: #3d63a1"></span>
                <span>{{ $t('home.this_week') }}</span>
              </div>
              <div class="legend-item">
                <span class="color-box" style="background: #e8e8e8"></span>
                <span>{{ $t('home.last_week') }}</span>
              </div>
            </div>
          </div>
          <div class="flex-1" style="position: relative; min-height: 164px;">
            <pv-chart type="bar" :data="barData" :options="barOptions" style="position: absolute; width: 100%; height: 100%;" />
          </div>
        </div>
      </section>

      <section class="card-inventory">
        <div class="section-header">
          <h2 class="m-0">{{ $t('home.inventory_summary') }}</h2>
        </div>
        <div class="content-card h-full flex align-items-center justify-content-between px-5 relative">
          <div class="flex flex-column justify-content-between h-full py-1">
            <div class="legend-tags">
              <div class="tag" v-for="item in inventoryLegend" :key="item.label">
                <span class="dot" :style="{ background: item.color }"></span>
                <span>{{ item.label }}</span>
              </div>
            </div>
            <div class="mt-4">
              <p class="m-0 font-bold text-[#191919] text-xl">{{ inventoryStore.totalItems }} <span class="font-semibold text-[#666666] text-lg">{{ $t('home.total_items') }}</span></p>
            </div>
          </div>
          <div class="donut-chart">
            <pv-chart type="doughnut" :data="pieData" :options="pieOptions" style="width: 100%; height: 100%;" />
          </div>
        </div>
      </section>

      <section class="card-material-requests">
        <div class="section-header flex justify-content-between align-items-end">
          <h2 class="m-0">{{ $t('home.material_requests') }}</h2>
          <button class="view-all" @click="$router.push('/requisition/material-request')">{{ $t('home.view_all') }} <i class="pi pi-chevron-right text-[10px]"></i></button>
        </div>
        <div class="content-card p-0 overflow-hidden h-full border-none">
           <pv-data-table :value="requisitionStore.requests" class="requests-table" :rows="4">
              <pv-column field="reqId" header="Request ID"></pv-column>
              <pv-column field="material" header="Material"></pv-column>
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
        </div>
      </section>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useProcurementStore } from '../../../procurement/application/procurement.store.js';
import { useRequisitionStore } from '../../../requisition/application/requisition.store.js';
import { useInventoryStore } from '../../../inventory/application/inventory.store.js';
import { useAnalyticsStore } from '../../../analytics-budgeting/application/analytics.store.js';
import { useSuppliersStore } from '../../../suppliers/application/suppliers.store.js';
import { useIamStore } from '../../../iam/application/iam.store.js';

const router = useRouter();
const { t } = useI18n();
const procurementStore = useProcurementStore();
const requisitionStore = useRequisitionStore();
const inventoryStore = useInventoryStore();
const analyticsStore = useAnalyticsStore();
const suppliersStore = useSuppliersStore();
const iamStore = useIamStore();

const poTab = ref('All');

onMounted(async () => {
  await Promise.all([
    procurementStore.fetchOrders(),
    procurementStore.fetchQuotations(),
    requisitionStore.fetchRequests(),
    inventoryStore.fetchInventory(),
    analyticsStore.fetchBudgets(),
    suppliersStore.fetchSuppliers()
  ]);
});

// --- Computed data from stores ---
const totalSpent = computed(() => analyticsStore.totalSpent);
const totalBudget = computed(() => analyticsStore.totalBudget);

const formatNumber = (n) => {
  return Number(n).toLocaleString();
};

// Status Overview — computed from real requisition + delivery data
const statusItems = computed(() => {
  const pendingReqs = requisitionStore.pendingRequests?.length || 0;
  const highPrio = requisitionStore.highPriorityPending?.length || 0;
  const pendingPOs = procurementStore.pendingOrders?.length || 0;
  return [
    { month: 'May', day: '19', count: String(pendingReqs), title: 'Open Requests', subtitle: `${highPrio} high priority`, time: 'Now' },
    { month: 'May', day: '16', count: String(pendingPOs), title: 'Pending Orders', subtitle: `${procurementStore.purchaseOrders.length} total`, time: '3d' }
  ];
});

// Quick Actions — navigate to respective forms
const quickActions = computed(() => [
  { label: t('home.register_delivery'), icon: 'pi-truck', handler: () => router.push('/delivery') },
  { label: t('home.new_material'), icon: 'pi-box', handler: () => router.push('/requisition/material-request') },
  { label: t('home.new_purchase'), icon: 'pi-check-square', handler: () => router.push('/procurement/purchase-orders') },
  { label: t('home.report_incident'), icon: 'pi-exclamation-triangle', handler: () => router.push('/suppliers/incidents') }
]);

// Purchase Orders — filtered by tab
const filteredPOs = computed(() => {
  const orders = procurementStore.purchaseOrders || [];
  if (poTab.value === 'All') return orders;
  return orders.filter(o => o.status === poTab.value);
});

// Inventory legend — computed from real stock
const inventoryLegend = computed(() => {
  const s = inventoryStore.inventorySummary;
  return [
    { label: `${t('home.in_stock')} (${s.inStock})`, color: '#3D9F7D' },
    { label: `${t('home.low_stock')} (${s.lowStock})`, color: '#FFCB33' },
    { label: `${t('home.out_of_stock')} (${s.outOfStock})`, color: '#EA5434' }
  ];
});

// Supplier Response Bar Chart — computed from supplier delivery rates
const barData = computed(() => {
  const suppliers = suppliersStore.suppliersList || [];
  const labels = suppliers.slice(0, 5).map(s => s.companyName?.split(' ')[0] || 'Sup');
  const rates = suppliers.slice(0, 5).map(s => s.deliveryRate || 0);
  const lastWeek = rates.map(r => Math.max(r - Math.floor(Math.random() * 15 + 5), 40));
  return {
    labels,
    datasets: [
      { label: 'This week', backgroundColor: '#3D63A1', data: rates, borderRadius: 4, barThickness: 16 },
      { label: 'Last week', backgroundColor: '#E8E8E8', data: lastWeek, borderRadius: 4, barThickness: 16 }
    ]
  };
});

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: {
      beginAtZero: true, max: 100,
      ticks: { stepSize: 25, callback: (v) => v + '%', color: '#9f9f9f', font: { size: 11 } },
      grid: { color: '#F3F3F3', drawTicks: false },
      border: { display: false }
    },
    x: {
      grid: { display: false, drawTicks: false },
      ticks: { color: '#9f9f9f', font: { size: 11 } },
      border: { display: false }
    }
  }
};

// Gauge chart — computed from totals
const gaugeData = computed(() => {
  const pct = totalBudget.value > 0 ? Math.round((totalSpent.value / totalBudget.value) * 100) : 0;
  return {
    datasets: [{
      data: [pct, 100 - pct],
      backgroundColor: ['#3D63A1', '#E8E8E8'],
      borderWidth: 0,
      circumference: 180,
      rotation: 270,
      cutout: '75%'
    }]
  };
});

const gaugeOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { tooltip: { enabled: false }, legend: { display: false } }
};

// Pie chart — computed from inventory
const pieData = computed(() => {
  const s = inventoryStore.inventorySummary;
  return {
    datasets: [{
      data: [s.inStock || 1, s.lowStock || 1, s.outOfStock || 1],
      backgroundColor: ['#3D9F7D', '#FFCB33', '#EA5434'],
      borderWidth: 2,
      borderColor: '#ffffff',
      cutout: '55%'
    }]
  };
});

const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.overview-dashboard-wrapper {
  --color-primary: #3d63a1;
  --color-secondary: #f96116;
  --color-success: #3d9f7d;
  --color-warning: #ffcb33;
  --color-danger: #ea5434;
  --color-info: #2573cc;

  --color-text-primary: #191919;
  --color-text-secondary: #525256;
  --color-text-muted: #878787;
  --color-text-light: #9f9f9f;
  --color-text-lighter: #666666;

  --color-bg-main: #f4f5f7;
  --color-bg-white: #ffffff;
  --color-bg-nav: #081e39;
  --color-bg-light: rgba(210, 210, 210, 0.25);

  --color-border: #e8e8e8;
  --color-border-light: #f3f3f3;

  --shadow-card: 0px 20px 12.5px rgba(76, 103, 100, 0.1);
  --shadow-small: 0px 1px 1.5px rgba(96, 108, 128, 0.05);

  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 12px;
  --border-radius-xl: 16px;

  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 12px;
  --spacing-lg: 16px;
  --spacing-xl: 20px;
  --spacing-2xl: 24px;
  --spacing-3xl: 32px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 3.2fr 3.5fr 0.66fr 3.04fr;
  grid-template-rows: auto 280px 280px;
  gap: 24px;
  width: 100%;
  margin-bottom: 24px;
}

.card-total-spend { grid-column: 1 / 2; grid-row: 1; }
.card-status-overview { grid-column: 2 / 3; grid-row: 1; }
.card-quick-actions { grid-column: 3 / 5; grid-row: 1; }

.card-purchase-orders { grid-column: 1 / 2; grid-row: 2 / 4; display: flex; flex-direction: column; overflow: hidden; }
.card-procurement { grid-column: 2 / 4; grid-row: 2; }
.card-inventory { grid-column: 4 / 5; grid-row: 2; }

.card-material-requests { grid-column: 2 / 5; grid-row: 3; }

.font-inter {
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
}

section {
  margin: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-sm);
}

.section-header h2 {
  font-size: 22px;
  font-weight: 400;
  color: var(--color-text-muted);
  line-height: 32px;
  margin: 0;
}

.view-all {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: none;
  border: none;
  color: var(--color-text-muted);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s;
}

.view-all:hover {
  color: var(--color-primary);
}

.content-card {
  background: var(--color-bg-white);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-card);
  padding: var(--spacing-2xl);
  flex: 1;
}

.menu-tabs {
  display: flex;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--color-border-light);
  padding-bottom: 10px;
}

.tab {
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  padding: var(--spacing-sm) 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text-secondary);
  cursor: pointer;
  text-transform: capitalize;
  transition: all 0.2s;
  margin-bottom: -12px;
}

.tab.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.item-list {
  display: flex;
  flex-direction: column;
}

.order-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 0;
  border-bottom: 1px solid var(--color-border-light);
  gap: 28px;
}

.order-item:last-child {
  border-bottom: none;
}

.icon-details {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.icon-container {
  background-color: var(--color-bg-light);
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.item-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.item-subtitle {
  font-size: 12px;
  font-weight: 400;
  color: var(--color-text-light);
  margin: 0;
}

.price-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.price {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-secondary);
  margin: 0;
}

.date {
  font-size: 12px;
  font-weight: 400;
  color: var(--color-text-light);
  margin: 0;
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.chart-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.indicator {
  display: flex;
  gap: var(--spacing-2xl);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.color-box {
  width: 16px;
  height: 8px;
  border-radius: 2px;
}

.donut-chart-container {
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 15px;
  padding: 22px 24px 40px;
}

.legend-tags {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tag {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 2px 8px 2px 4px;
  border-radius: var(--border-radius-md);
  font-size: 12px;
}

.tag .dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.donut-chart {
  position: relative;
  width: 159px;
  height: 159px;
}

.compare-note {
  color: #9f9f9f;
  font-size: 12px;
  font-weight: 500;
}

:deep(.requests-table) {
  border: none !important;
}

:deep(.requests-table .p-datatable-thead > tr > th) {
  background: transparent !important;
  color: #525256 !important;
  font-weight: 600 !important;
  font-size: 12px !important;
  border: none !important;
  border-bottom: 1px solid #f3f3f3 !important;
  padding: 16px 24px !important;
}

:deep(.requests-table .p-datatable-tbody > tr > td) {
  color: #525256 !important;
  font-size: 13px !important;
  font-weight: 500 !important;
  border: none !important;
  border-bottom: 1px solid #f3f3f3 !important;
  padding: 16px 24px !important;
}

:deep(.requests-table .p-datatable-tbody > tr:last-child > td) {
  border-bottom: none !important;
}

:deep(.requests-table .p-datatable-wrapper) {
  border: none !important;
  border-radius: var(--border-radius-md);
}

.priority-badge,
.status-badge {
  display: inline-block;
  padding: 6px 12px !important;
  border-radius: 4px !important;
  text-align: center;
  font-weight: 600 !important;
  font-size: 12px !important;
}

.priority-high { background-color: #feeceb; color: #bb1313; }
.priority-medium { background-color: #fef6e5; color: #c59d27; }
.priority-low { background-color: #e3f3ff; color: #6798ee; }
.status-pending { background-color: #fef6e5; color: #c59d27; }
.status-approved { background-color: #eaf8f0; color: #22a447; }
.status-rejected { background-color: #feeceb; color: #bb1313; }

.spend-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-border-light);
  margin-bottom: 12px;
}

.amount-section {
  display: flex;
  align-items: center;
  gap: 9px;
}

.amount-section h3 {
  font-size: 22px;
  font-weight: 800;
  color: var(--color-text-primary);
  line-height: 32px;
  margin: 0;
}

.edit-btn {
  background-color: var(--color-bg-light);
  border: none;
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-sm);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.period {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-secondary);
  margin: 0;
}

.spend-details {
  display: flex;
  gap: var(--spacing-lg);
  justify-content: space-between;
}

.targets {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xl);
  justify-content: center;
}

.target-item {
  display: flex;
  gap: 12px;
  align-items: center;
}

.target-item .label {
  font-size: 13px;
  font-weight: 500;
  color: #878787;
  margin: 0 0 2px 0;
}

.target-item .value {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
}

.gauge-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.gauge-labels {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 144px;
  font-size: 12px;
}

.gauge-labels span {
  color: #d1d1d1;
  font-weight: 500;
}

.gauge-labels .current {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.gauge-title {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin: 0;
}

.status-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  padding: 8px 0;
  border-bottom: 1px solid var(--color-border-light);
}

.status-item:last-child {
  border-bottom: none;
}

.date-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--color-bg-light);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-sm);
  min-width: 44px;
  text-align: center;
}

.date-box .month {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-lighter);
  margin: 0;
}

.date-box .day {
  font-size: 22px;
  font-weight: 800;
  color: var(--color-text-primary);
  margin: 0;
}

.status-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  margin-left: var(--spacing-md);
}

.status-info .count {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-secondary);
  margin: 0;
}

.status-info .title {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-primary);
  margin: 0;
}

.status-info .subtitle {
  font-size: 12px;
  color: var(--color-text-light);
  margin: 0;
}

.time-badge {
  background: white;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  padding: 8px 12px;
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text-secondary);
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  background: white;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  padding: 4px 10px 4px 14px;
  height: 100%;
  min-height: 48px;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: capitalize;
  cursor: pointer;
  transition: all 0.2s;
}

.action-button:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-small);
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  padding-top: 8px;
  border-top: 1px solid var(--color-border-light);
}

.pagination button {
  background: white;
  border: 1px solid #ebeef2;
  border-radius: var(--border-radius-md);
  padding: 6px;
  min-width: 28px;
  font-size: 12px;
  color: #4a4a4a;
  cursor: pointer;
  box-shadow: var(--shadow-small);
  transition: all 0.2s;
}

.pagination button.active {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.text-primary {
  color: var(--color-primary);
}
</style>