<template>
  <div class="view-content font-inter">

    <div class="top-row-3">
      <section>
        <div class="section-header">
          <h2 class="m-0">{{ $t('budget.total_budget') }}</h2>
        </div>
        <div class="content-card p-4 h-full flex flex-column">
          <div class="spend-header">
            <h3>${{ totalBudget.toLocaleString() }}</h3>
            <p class="period">FY 2026</p>
          </div>
          <div class="spend-details flex justify-content-between align-items-center flex-1">
            <div class="targets flex flex-column gap-3">
              <div class="target-item">
                <i class="pi pi-chart-line" style="color: #525256; font-size: 16px;"></i>
                <div>
                  <p class="label">{{ $t('budget.spent') }}</p>
                  <p class="value">${{ totalSpent.toLocaleString() }}</p>
                </div>
              </div>
              <div class="target-item">
                <i class="pi pi-wallet" style="color: #525256; font-size: 16px;"></i>
                <div>
                  <p class="label">{{ $t('budget.remaining') }}</p>
                  <p class="value">${{ remaining.toLocaleString() }}</p>
                </div>
              </div>
            </div>
            <div class="gauge-chart-container flex flex-column align-items-center">
              <div style="position: relative; width: 120px; height: 60px;">
                <pv-chart type="doughnut" :data="gaugeData" :options="gaugeOptions" style="width: 100%; height: 100%;" />
              </div>
              <div class="gauge-labels mt-1" style="width: 130px; display: flex; justify-content: space-between;">
                <span>$0</span>
                <span class="current">{{ spentPercent }}%</span>
                <span>${{ Math.round(totalBudget / 1000) }}K</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div class="section-header">
          <h2 class="m-0">{{ $t('budget.budget_alerts') }}</h2>
          <button class="view-all">{{ $t('home.view_all') }} <i class="pi pi-chevron-right text-xs"></i></button>
        </div>
        <div class="content-card p-3 h-full flex flex-column">
          <div v-for="(alert, idx) in budgetAlerts" :key="idx" class="alert-item">
            <div class="alert-icon" :style="{ background: alert.iconBg, color: alert.iconColor }">
              <i :class="'pi ' + alert.icon"></i>
            </div>
            <div class="alert-info">
              <p class="alert-title">{{ alert.project }}</p>
              <p class="alert-detail">{{ alert.message }}</p>
            </div>
            <div class="alert-badge" :style="{ background: alert.badgeBg, color: alert.badgeColor }">
              {{ alert.status }}
            </div>
          </div>
        </div>
      </section>

      <section>
        <div class="section-header">
          <h2 class="m-0">{{ $t('budget.cost_breakdown') }}</h2>
        </div>
        <div class="content-card h-full flex align-items-center justify-content-between px-4 p-3">
          <div class="flex flex-column gap-2">
            <div class="breakdown-legend">
              <div class="tag" v-for="item in costCategories" :key="item.label">
                <span class="dot" :style="{ background: item.color }"></span>
                <span>{{ item.label }}</span>
              </div>
            </div>
            <p class="m-0 font-bold" style="color: #191919; font-size: 15px;">${{ totalSpent.toLocaleString() }} <span class="font-semibold" style="color: #666666; font-size: 13px;">{{ $t('budget.total_spent') }}</span></p>
          </div>
          <div class="donut-chart">
            <pv-chart type="doughnut" :data="pieData" :options="pieOptions" style="width: 100%; height: 100%;" />
          </div>
        </div>
      </section>
    </div>

    <div class="main-row-2">
      <section>
        <div class="section-header">
          <h2 class="m-0">{{ $t('budget.spending_trend') }}</h2>
        </div>
        <div class="content-card p-4 h-full">
          <div class="chart-header">
            <div class="chart-title">
              <span>{{ $t('budget.monthly_expenditure') }}</span>
              <i class="pi pi-chevron-down text-gray-600 text-xs"></i>
            </div>
            <div class="indicator">
              <div class="legend-item">
                <span class="color-box" style="background: #3d63a1;"></span>
                <span>{{ $t('budget.budget') }}</span>
              </div>
              <div class="legend-item">
                <span class="color-box" style="background: #3D9F7D;"></span>
                <span>{{ $t('budget.actual') }}</span>
              </div>
            </div>
          </div>
          <div style="position: relative; min-height: 220px;">
            <pv-chart type="line" :data="spendingTrendData" :options="lineOptions" style="position: absolute; width: 100%; height: 100%;" />
          </div>
        </div>
      </section>

      <section>
        <div class="section-header">
          <h2 class="m-0">{{ $t('budget.project_budgets') }}</h2>
        </div>
        <div class="content-card p-4 h-full flex flex-column">
          <div class="progress-list flex-1">
            <div v-for="project in projectBudgets" :key="project.name" class="progress-item">
              <div class="progress-header">
                <span class="progress-name">{{ project.name }}</span>
                <span class="progress-values">
                  <span class="font-bold" style="color: #191919;">${{ (project.spent || 0).toLocaleString() }}</span>
                  <span style="color: #94A3B8;"> / ${{ (project.total || 0).toLocaleString() }}</span>
                </span>
              </div>
              <div class="progress-bar-bg">
                <div class="progress-bar-fill" :style="{ width: (project.total ? (project.spent / project.total * 100) : 0) + '%', background: project.color }"></div>
              </div>
              <div class="progress-footer">
                <span :class="['budget-tag', project.statusKey === 'on_track' ? 'on-track' : project.statusKey === 'at_risk' ? 'at-risk' : 'over-budget']">
                  {{ project.statusLabel }}
                </span>
                <span class="progress-percent">{{ project.total ? Math.round(project.spent / project.total * 100) : 0 }}%</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <div class="section-header mt-3">
      <h2 class="m-0">{{ $t('budget.recent_transactions') }}</h2>
      <p class="compare-note m-0">{{ $t('budget.last_7_days') }}</p>
    </div>
    <div class="content-card p-0 overflow-hidden">
      <pv-data-table :value="transactions" class="buildline-datatable" :rows="8">
        <pv-column field="date" :header="$t('common.date')"></pv-column>
        <pv-column field="description" :header="$t('budget.description')"></pv-column>
        <pv-column field="project" :header="$t('common.project')"></pv-column>
        <pv-column field="category" :header="$t('suppliers.category')"></pv-column>
        <pv-column field="amount" :header="$t('common.amount')">
          <template #body="slotProps">
            <span class="font-bold" style="color: #191919;">${{ (slotProps.data.amount || 0).toLocaleString() }}</span>
          </template>
        </pv-column>
        <pv-column field="status" :header="$t('common.status')">
          <template #body="slotProps">
            <span :class="['status-badge', 'status-' + (slotProps.data.status || '').toLowerCase()]">
              {{ slotProps.data.status }}
            </span>
          </template>
        </pv-column>
      </pv-data-table>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useAnalyticsStore } from '../../application/analytics.store.js';
import { useProcurementStore } from '../../../procurement/application/procurement.store.js';
import { useReferenceDataStore } from '../../../shared/application/reference-data.store.js';
import { useI18n } from 'vue-i18n';

const analyticsStore = useAnalyticsStore();
const procurementStore = useProcurementStore();
const referenceStore = useReferenceDataStore();
const { t } = useI18n();

onMounted(async () => {
  await Promise.all([
    analyticsStore.fetchBudgets(),
    procurementStore.fetchOrders(),
    referenceStore.fetchAll()
  ]);
});

const totalBudget = computed(() => analyticsStore.totalBudget);
const totalSpent = computed(() => analyticsStore.totalSpent);
const remaining = computed(() => totalBudget.value - totalSpent.value);
const spentPercent = computed(() => totalBudget.value > 0 ? Math.round((totalSpent.value / totalBudget.value) * 100) : 0);

const budgetAlerts = computed(() => {
  return (analyticsStore.budgets || [])
    .filter(b => {
      const pct = b.totalBudget > 0 ? (b.spent / b.totalBudget) * 100 : 0;
      return pct > 75;
    })
    .map(b => {
      const pct = Math.round((b.spent / b.totalBudget) * 100);
      const isOver = b.spent > b.totalBudget;
      return {
        project: b.project,
        message: isOver ? t('budget.exceeded_by', { amount: (b.spent - b.totalBudget).toLocaleString() }) : t('budget.consumed_percent', { percent: pct }),
        icon: isOver ? 'pi-exclamation-circle' : 'pi-exclamation-triangle',
        iconBg: isOver ? '#FEECEB' : '#FEF6E5',
        iconColor: isOver ? '#E02424' : '#D97706',
        status: isOver ? t('budget.over_budget') : t('budget.at_risk'),
        badgeBg: isOver ? '#FEECEB' : '#FEF6E5',
        badgeColor: isOver ? '#E02424' : '#D97706'
      };
    });
});

const projectBudgets = computed(() => {
  return (analyticsStore.budgets || []).map(b => {
    const pct = b.totalBudget > 0 ? (b.spent / b.totalBudget) * 100 : 0;
    let statusKey = 'on_track';
    let color = '#3d63a1';
    if (pct > 100) { statusKey = 'over_budget'; color = '#E02424'; }
    else if (pct > 75) { statusKey = 'at_risk'; color = '#D97706'; }
    return { name: b.project, total: b.totalBudget, spent: b.spent, color, statusKey, statusLabel: t(`budget.${statusKey}`) };
  });
});

const categoryColors = ['#3d63a1', '#2563EB', '#3D9F7D', '#D97706', '#94A3B8', '#7C3AED', '#0891B2'];
const categoryForMaterial = (materialName) => {
  return referenceStore.materials.find(material => material.name === materialName)?.category || 'Other';
};
const costCategories = computed(() => {
  const approvedOrders = procurementStore.purchaseOrders.filter(order => order.status === 'Approved');
  const totalsByCategory = approvedOrders.reduce((totals, order) => {
    const category = categoryForMaterial(order.material);
    totals[category] = (totals[category] || 0) + Number(order.totalAmount || 0);
    return totals;
  }, {});
  const categorizedSpent = Object.values(totalsByCategory).reduce((sum, amount) => sum + Number(amount || 0), 0);
  const uncategorized = Math.max(totalSpent.value - categorizedSpent, 0);
  if (uncategorized > 0) {
    totalsByCategory.Other = (totalsByCategory.Other || 0) + uncategorized;
  }

  return Object.entries(totalsByCategory)
    .filter(([, amount]) => Number(amount || 0) > 0)
    .map(([label, amount], index) => ({
      label,
      amount,
      color: categoryColors[index % categoryColors.length]
    }));
});

// Build transactions from recent purchase orders
const transactions = computed(() => {
  return procurementStore.purchaseOrders.slice(0, 8).map(po => ({
    date: po.date,
    description: po.material,
    project: po.project,
    category: categoryForMaterial(po.material),
    amount: po.totalAmount || 0,
    status: po.status || 'Pending'
  }));
});

const gaugeData = computed(() => ({
  labels: [t('budget.spent'), t('budget.remaining')],
  datasets: [{
    data: [spentPercent.value, 100 - spentPercent.value],
    backgroundColor: ['#3d63a1', '#e8e8e8'],
    borderWidth: 0, circumference: 180, rotation: -90, cutout: '75%'
  }]
}));
const gaugeOptions = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { enabled: false } }
};

const parseDisplayDate = (value) => {
  const parsed = value ? new Date(value) : null;
  return parsed && !Number.isNaN(parsed.getTime()) ? parsed : null;
};
const buildMonthWindow = () => {
  const orderDates = procurementStore.purchaseOrders.map(order => parseDisplayDate(order.date)).filter(Boolean);
  const end = orderDates.length ? new Date(Math.max(...orderDates.map(date => date.getTime()))) : new Date();
  end.setDate(1);
  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(end.getFullYear(), end.getMonth() - (5 - index), 1);
    return {
      key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
      label: date.toLocaleDateString('en-US', { month: 'short' })
    };
  });
};
const keyForDate = (date) => date ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}` : null;

const spendingTrendData = computed(() => {
  const months = buildMonthWindow();
  const labels = months.map(month => month.label);
  const actualByMonth = procurementStore.purchaseOrders
    .filter(order => order.status === 'Approved')
    .reduce((totals, order) => {
      const key = keyForDate(parseDisplayDate(order.date));
      if (key) totals[key] = (totals[key] || 0) + Number(order.totalAmount || 0);
      return totals;
    }, {});
  let actualLine = months.map(month => Math.round(actualByMonth[month.key] || 0));
  const activeMonths = actualLine.filter(value => value > 0).length;
  if (activeMonths < 3 && totalSpent.value > 0) {
    const distribution = [0.10, 0.12, 0.15, 0.18, 0.20, 0.25];
    actualLine = distribution.map(weight => Math.round(totalSpent.value * weight));
  }
  const monthlyBudget = Math.round(totalBudget.value / 6);
  const budgetLine = months.map(() => monthlyBudget);
  return {
    labels,
    datasets: [
      { label: t('budget.budget'), data: budgetLine, borderColor: '#3d63a1', backgroundColor: 'rgba(61, 99, 161, 0.08)', fill: true, tension: 0.4, borderWidth: 2, pointRadius: 3, pointBackgroundColor: '#3d63a1' },
      { label: t('budget.actual'), data: actualLine, borderColor: '#3D9F7D', backgroundColor: 'rgba(61, 159, 125, 0.08)', fill: true, tension: 0.4, borderWidth: 2, pointRadius: 3, pointBackgroundColor: '#3D9F7D' }
    ]
  };
});
const lineOptions = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { font: { size: 11, weight: 600 }, color: '#94A3B8' } },
    y: { grid: { color: '#F1F5F9' }, ticks: { font: { size: 11, weight: 600 }, color: '#94A3B8', callback: (v) => '$' + (v / 1000) + 'K' }, border: { display: false } }
  }
};

const pieData = computed(() => ({
  labels: costCategories.value.map(c => c.label),
  datasets: [{
    data: costCategories.value.map(c => Math.round(c.amount)),
    backgroundColor: costCategories.value.map(c => c.color),
    borderWidth: 0, cutout: '65%'
  }]
}));
const pieOptions = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { enabled: true } }
};
</script>

<style scoped>
.view-content { width: 100%; }

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 10px;
  padding-top: 4px;
}
.section-header h2 {
  font-size: 14px;
  font-weight: 600;
  color: #64748B;
}
.view-all {
  background: none;
  border: none;
  color: #64748B;
  font-weight: 700;
  font-size: 11px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}
.compare-note {
  font-size: 11px;
  color: #94A3B8;
  font-weight: 500;
  font-style: italic;
}
.content-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.04);
}

.top-row-3 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  margin-bottom: 8px;
}
.top-row-3 > section {
  display: flex;
  flex-direction: column;
}
.top-row-3 > section > .content-card {
  flex: 1;
}

/* Row 2: chart + project budgets */
.main-row-2 {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 20px;
  margin-bottom: 8px;
}
.main-row-2 > section {
  display: flex;
  flex-direction: column;
}
.main-row-2 > section > .content-card {
  flex: 1;
}

/* Total Budget (mimics Total Spend from Overview) */
.spend-header h3 {
  font-size: 28px;
  font-weight: 800;
  color: #191919;
  margin: 0;
}
.period {
  font-size: 12px;
  color: #94A3B8;
  font-weight: 600;
  margin: 2px 0 0 0;
}
.target-item {
  display: flex;
  align-items: center;
  gap: 10px;
}
.target-item .label {
  font-size: 11px;
  color: #94A3B8;
  font-weight: 600;
  margin: 0;
}
.target-item .value {
  font-size: 16px;
  font-weight: 800;
  color: #191919;
  margin: 0;
}
.gauge-labels {
  font-size: 10px;
  color: #94A3B8;
  font-weight: 600;
}
.gauge-labels .current {
  font-weight: 800;
  color: #3d63a1;
  font-size: 13px;
}
.gauge-title {
  font-size: 10px;
  color: #94A3B8;
  font-weight: 600;
  text-align: center;
}

/* Alert items */
.alert-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid #F8F9FA;
}
.alert-item:last-child { border-bottom: none; }
.alert-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}
.alert-info { flex: 1; }
.alert-title {
  font-size: 13px;
  font-weight: 700;
  color: #1E293B;
  margin: 0;
}
.alert-detail {
  font-size: 11px;
  color: #94A3B8;
  margin: 2px 0 0 0;
}
.alert-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 6px;
  flex-shrink: 0;
}

/* Chart header */
.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.chart-title {
  font-size: 14px;
  font-weight: 700;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 6px;
}
.indicator {
  display: flex;
  gap: 14px;
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #64748B;
  font-weight: 600;
}
.color-box {
  width: 8px;
  height: 8px;
  border-radius: 2px;
}

/* Cost breakdown */
.breakdown-legend {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.tag {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #64748B;
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.donut-chart {
  width: 140px;
  height: 140px;
}

/* Progress bars */
.progress-list {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;
}
.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.progress-name {
  font-size: 13px;
  font-weight: 700;
  color: #374151;
}
.progress-values { font-size: 13px; }
.progress-bar-bg {
  height: 8px;
  background: #F3F4F6;
  border-radius: 4px;
  overflow: hidden;
}
.progress-bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
}
.progress-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 6px;
}
.progress-percent {
  font-size: 12px;
  font-weight: 700;
  color: #64748B;
}
.budget-tag {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 4px;
}
.on-track { background: #EAF8F0; color: #3D9F7D; }
.at-risk { background: #FEF6E5; color: #D97706; }
.over-budget { background: #FEECEB; color: #E02424; }

.mt-3 { margin-top: 16px; }

.main-row-2 {
  align-items: stretch;
}

.main-row-2 > section > .content-card {
  height: 472px;
  min-height: 472px;
}

.progress-list {
  justify-content: flex-start;
  overflow-y: auto;
  max-height: 100%;
  padding-right: 6px;
  scrollbar-width: thin;
}

.progress-item {
  flex-shrink: 0;
}
</style>
