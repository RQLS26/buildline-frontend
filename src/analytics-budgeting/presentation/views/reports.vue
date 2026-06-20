<template>
  <div class="view-content font-inter">
    <div class="action-row">
      <div class="filter-group">
        <label class="filter-label">{{ $t('reports.report_type') }}</label>
        <pv-select v-model="selectedReport" :options="reportTypes" optionLabel="label" optionValue="value" :placeholder="$t('reports.select_report')" class="filter-select" />
      </div>
      <div class="filter-group">
        <label class="filter-label">{{ $t('reports.period') }}</label>
        <pv-select v-model="selectedPeriod" :options="periods" optionLabel="label" optionValue="value" :placeholder="$t('reports.select_period')" class="filter-select" />
      </div>
      <div class="ml-auto flex gap-2">
        <pv-button :label="$t('reports.export_pdf')" icon="pi pi-file-pdf" class="export-btn pdf" @click="exportPDF" />
      </div>
    </div>

    <div class="report-card">
      <div class="report-header">
        <div class="report-brand">
          <img src="/logo.png" alt="Buildline" class="report-logo" />
          <div>
            <h2 class="report-company">{{ companyName }}</h2>
            <span class="report-subtitle">{{ $t('reports.digital_construction') }}</span>
          </div>
        </div>
        <div class="report-meta">
          <h3 class="report-type">{{ selectedReportLabel }} {{ $t('reports.report') }}</h3>
          <span class="report-date">{{ $t('reports.generated') }}: {{ currentDate }}</span>
          <span class="report-period">{{ $t('reports.period') }}: {{ selectedPeriodLabel }}</span>
        </div>
      </div>

      <div class="report-kpi-row">
        <div class="report-kpi">
          <span class="report-kpi-value">{{ inventoryStore.totalItems }}</span>
          <span class="report-kpi-label">{{ $t('reports.items') }}</span>
        </div>
        <div class="report-kpi">
          <span class="report-kpi-value" style="color: #3D9F7D;">{{ $t('common.active') }}</span>
          <span class="report-kpi-label">{{ $t('reports.system_status') }}</span>
        </div>
        <div class="report-kpi">
          <span class="report-kpi-value">${{ analyticsStore.totalSpent.toLocaleString() }}</span>
          <span class="report-kpi-label">{{ $t('reports.total_spent') }}</span>
        </div>
        <div class="report-kpi">
          <span class="report-kpi-value">{{ projectCount }}</span>
          <span class="report-kpi-label">{{ $t('reports.active_projects') }}</span>
        </div>
      </div>

      <div class="report-table-section">
        <h4 class="report-section-title">{{ selectedReportLabel }} {{ $t('reports.details') }}</h4>
        <table class="report-table">
          <thead>
            <tr v-if="selectedReport === 'inventory'">
              <th>{{ $t('inventory.item_id') }}</th>
              <th>{{ $t('inventory.material') }}</th>
              <th>{{ $t('common.project') }}</th>
              <th>{{ $t('inventory.category') }}</th>
              <th class="text-right">{{ $t('inventory.current_stock') }}</th>
              <th class="text-right">{{ $t('common.status') }}</th>
            </tr>
            <tr v-else-if="selectedReport === 'purchase'">
              <th>{{ $t('purchase_orders.order_id') }}</th>
              <th>{{ $t('common.supplier') }}</th>
              <th>{{ $t('purchase_orders.material') }}</th>
              <th>{{ $t('common.project') }}</th>
              <th class="text-right">{{ $t('common.amount') }}</th>
              <th class="text-right">{{ $t('common.status') }}</th>
            </tr>
            <tr v-else-if="selectedReport === 'budget'">
              <th>{{ $t('common.project') }}</th>
              <th>{{ $t('common.status') }}</th>
              <th class="text-right">{{ $t('budget.budget') }}</th>
              <th class="text-right">{{ $t('budget.spent') }}</th>
              <th class="text-right">{{ $t('budget.allocated') }}</th>
              <th class="text-right">{{ $t('reports.usage') }}</th>
            </tr>
            <tr v-else>
              <th>{{ $t('common.supplier') }}</th>
              <th>{{ $t('suppliers.category') }}</th>
              <th>{{ $t('suppliers.contact') }}</th>
              <th class="text-right">{{ $t('suppliers.rating') }}</th>
              <th class="text-right">{{ $t('suppliers.on_time') }}</th>
              <th class="text-right">{{ $t('common.status') }}</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="selectedReport === 'inventory'">
              <tr v-for="item in reportItems" :key="item.id">
                <td>{{ item.sku }}</td>
                <td class="font-semibold">{{ item.name }}</td>
                <td>{{ item.project }}</td>
                <td>{{ item.category }}</td>
                <td class="text-right font-bold">{{ item.currentStock }}</td>
                <td class="text-right"><span :class="['report-status', getStatusClass(item)]">{{ getStatusLabel(item) }}</span></td>
              </tr>
            </template>
            <template v-else-if="selectedReport === 'purchase'">
              <tr v-for="item in reportItems" :key="item.id">
                <td>{{ item.orderId }}</td>
                <td class="font-semibold">{{ item.supplierName }}</td>
                <td>{{ item.material }}</td>
                <td>{{ item.project }}</td>
                <td class="text-right font-bold">${{ Number(item.totalAmount || 0).toLocaleString() }}</td>
                <td class="text-right">{{ translateStatus(item.status) }}</td>
              </tr>
            </template>
            <template v-else-if="selectedReport === 'budget'">
              <tr v-for="item in reportItems" :key="item.id">
                <td class="font-semibold">{{ item.project }}</td>
                <td>{{ translateBudgetStatus(item.status) }}</td>
                <td class="text-right font-bold">${{ Number(item.totalBudget || 0).toLocaleString() }}</td>
                <td class="text-right">${{ Number(item.spent || 0).toLocaleString() }}</td>
                <td class="text-right">${{ Number(item.allocated || 0).toLocaleString() }}</td>
                <td class="text-right">{{ item.totalBudget ? Math.round((item.spent / item.totalBudget) * 100) : 0 }}%</td>
              </tr>
            </template>
            <template v-else>
              <tr v-for="item in reportItems" :key="item.id">
                <td class="font-semibold">{{ item.companyName }}</td>
                <td>{{ item.category }}</td>
                <td>{{ item.email }}</td>
                <td class="text-right">{{ item.rating }}</td>
                <td class="text-right">{{ item.deliveryRate }}%</td>
                <td class="text-right">{{ item.isActive ? $t('common.active') : $t('common.inactive') }}</td>
              </tr>
            </template>
            <tr v-if="reportItems.length === 0">
              <td colspan="6" class="report-empty">{{ $t('common.no_data') }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="report-footer">
        <p>{{ $t('reports.automated_doc') }}</p>
        <p>{{ $t('reports.confidential') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useInventoryStore } from '../../../inventory/application/inventory.store.js';
import { useAnalyticsStore } from '../../application/analytics.store.js';
import { useProcurementStore } from '../../../procurement/application/procurement.store.js';
import { useSuppliersStore } from '../../../suppliers/application/suppliers.store.js';
import { useProfilesStore } from '../../../profiles/application/profiles.store.js';

const { t, locale } = useI18n();
const inventoryStore = useInventoryStore();
const analyticsStore = useAnalyticsStore();
const procurementStore = useProcurementStore();
const suppliersStore = useSuppliersStore();
const profilesStore = useProfilesStore();

const selectedReport = ref('inventory');
const selectedPeriod = ref(null);

const parseDisplayDate = (value) => {
  const parsed = value ? new Date(value) : null;
  return parsed && !Number.isNaN(parsed.getTime()) ? parsed : null;
};
const monthKey = (date) => date ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}` : null;
const formatPeriod = (key) => {
  const [year, month] = key.split('-').map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString(locale.value === 'es' ? 'es-PE' : 'en-US', { month: 'long', year: 'numeric' });
};

const reportTypes = computed(() => [
  { label: t('reports.inventory_summary'), value: 'inventory' },
  { label: t('reports.purchase_history'), value: 'purchase' },
  { label: t('reports.budget_overview'), value: 'budget' },
  { label: t('reports.supplier_performance'), value: 'suppliers' }
]);
const selectedReportLabel = computed(() => reportTypes.value.find(item => item.value === selectedReport.value)?.label || t('reports.inventory_summary'));
const periods = computed(() => {
  const monthKeys = new Set([monthKey(new Date())]);
  procurementStore.purchaseOrders.forEach(order => {
    const parsed = parseDisplayDate(order.date);
    if (parsed) monthKeys.add(monthKey(parsed));
  });
  return [...monthKeys]
    .sort((a, b) => b.localeCompare(a))
    .map(value => ({ value, label: formatPeriod(value) }));
});
const selectedPeriodLabel = computed(() => periods.value.find(item => item.value === selectedPeriod.value)?.label || t('reports.current_data'));

onMounted(async () => {
  await Promise.allSettled([
    inventoryStore.fetchInventory(),
    analyticsStore.fetchBudgets(),
    procurementStore.fetchOrders(),
    suppliersStore.fetchSuppliers(),
    profilesStore.fetchProfile()
  ]);
  selectedPeriod.value = periods.value[0]?.value || monthKey(new Date());
});

watch(periods, (options) => {
  if (!selectedPeriod.value && options.length) selectedPeriod.value = options[0].value;
});

const currentDate = computed(() => new Date().toLocaleDateString(locale.value === 'es' ? 'es-PE' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
const reportItems = computed(() => {
  if (selectedReport.value === 'purchase') return procurementStore.purchaseOrders.filter(order => !selectedPeriod.value || monthKey(parseDisplayDate(order.date)) === selectedPeriod.value);
  if (selectedReport.value === 'budget') return analyticsStore.budgets;
  if (selectedReport.value === 'suppliers') return suppliersStore.suppliersList;
  return inventoryStore.inventoryList;
});
const projectCount = computed(() => new Set(inventoryStore.inventoryList.map(i => i.project)).size);
const companyName = computed(() => profilesStore.companyProfile?.companyName || 'Buildline');

const getStatusLabel = (item) => {
  if (item.currentStock === 0) return t('inventory.out_of_stock');
  if (item.currentStock <= item.minStock) return t('inventory.low_stock');
  return t('inventory.in_stock');
};
const translateStatus = (status) => t(`common.${String(status || '').toLowerCase()}`, status);
const translateBudgetStatus = (status) => t(`budget.${String(status || '').toLowerCase().replaceAll(' ', '_')}`, status);
const getStatusClass = (item) => {
  if (item.currentStock === 0) return 'report-status-danger';
  if (item.currentStock <= item.minStock) return 'report-status-warn';
  return 'report-status-ok';
};
const exportPDF = () => window.print();
</script>

<style scoped>
.view-content { width: 100%; }

.action-row { display: flex; align-items: flex-end; gap: 16px; margin-bottom: 24px; }
.filter-group { display: flex; flex-direction: column; gap: 6px; }
.filter-label { font-size: 11px; font-weight: 700; color: #6B7280; text-transform: uppercase; letter-spacing: 0.03em; }
.export-btn { border-radius: 12px !important; font-weight: 700 !important; font-size: 13px !important; padding: 10px 20px !important; }
.export-btn.pdf { background: #E02424 !important; border-color: #E02424 !important; }

.report-card { background: white; border-radius: 20px; box-shadow: 0 1px 8px rgba(0, 0, 0, 0.04); padding: 48px; }

.report-header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 24px; border-bottom: 2px solid #1E293B; margin-bottom: 28px; }
.report-brand { display: flex; align-items: center; gap: 16px; }
.report-logo { height: 52px; width: auto; object-fit: contain; }
.report-company { font-size: 22px; font-weight: 800; color: #1E293B; margin: 0; }
.report-subtitle { font-size: 11px; font-weight: 600; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.05em; }
.report-meta { text-align: right; display: flex; flex-direction: column; gap: 2px; }
.report-type { font-size: 16px; font-weight: 800; color: #1E293B; margin: 0; }
.report-date, .report-period { font-size: 12px; color: #64748B; }

.report-kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
.report-kpi { padding: 20px; border: 1px solid #F1F5F9; border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 6px; }
.report-kpi-value { font-size: 26px; font-weight: 800; color: #1E293B; }
.report-kpi-label { font-size: 12px; font-weight: 600; color: #94A3B8; }

.report-section-title { font-size: 14px; font-weight: 800; color: #374151; margin: 0 0 16px 0; }
.report-table { width: 100%; border-collapse: collapse; table-layout: fixed; }
.report-table th { text-align: center; font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.03em; padding: 12px 16px; border-bottom: 1px solid #E2E8F0; }
.report-table td { padding: 14px 16px; font-size: 13px; color: #374151; border-bottom: 1px solid #F8FAFC; text-align: center; }
.report-table tbody tr:hover { background: #FAFBFC; }
.report-empty { padding: 36px 16px !important; color: #94A3B8 !important; font-weight: 700; text-align: center !important; }

.report-status { font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 4px; white-space: nowrap; }
.report-status-ok { background: #EAF8F0; color: #3D9F7D; }
.report-status-warn { background: #FEF6E5; color: #D97706; }
.report-status-danger { background: #FEECEB; color: #E02424; }

.report-footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #F1F5F9; text-align: center; }
.report-footer p { margin: 0; font-size: 11px; color: #94A3B8; line-height: 1.8; }

:deep(.filter-select) { min-width: 180px; border: 1px solid #E5E7EB !important; border-radius: 12px !important; background: white !important; }
</style>

<!-- Unscoped print styles — only report-specific rules (layout hides sidebar/header itself) -->
<style>
@media print {
  .action-row { display: none !important; }
  body { background: white !important; overflow: visible !important; }
  main {
    padding: 0 !important;
    margin: 0 !important;
    overflow: visible !important;
    width: 100% !important;
  }
  .view-content { padding: 0 !important; }
  .report-card {
    box-shadow: none !important;
    border: none !important;
    border-radius: 0 !important;
    margin: 0 !important;
    width: 100% !important;
  }
  .h-screen, [class*="h-screen"] {
    height: auto !important;
    overflow: visible !important;
  }
}
</style>
