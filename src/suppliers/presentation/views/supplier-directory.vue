<template>
  <div class="view-content font-inter">

    <!-- Summary row (Overview-style, not generic KPIs) -->
    <div class="suppliers-summary-row">
      <section>
        <div class="section-header">
          <h2 class="m-0">{{ $t('suppliers.supplier_portfolio') }}</h2>
        </div>
        <div class="content-card p-4">
          <div class="portfolio-stats">
            <div class="stat-block">
              <p class="stat-number">{{ totalSuppliers }}</p>
              <p class="stat-label">{{ $t('suppliers.total_suppliers') }}</p>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-block">
              <p class="stat-number active">{{ activeCount }}</p>
              <p class="stat-label">Active</p>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-block">
              <p class="stat-number inactive">{{ inactiveCount }}</p>
              <p class="stat-label">Inactive</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div class="section-header">
          <h2 class="m-0">{{ $t('suppliers.average_rating') }}</h2>
        </div>
        <div class="content-card p-4">
          <div class="rating-display">
            <span class="rating-big">{{ avgRating }}</span>
            <div class="rating-stars">
              <i v-for="n in 5" :key="n" :class="['pi', n <= avgRatingRounded ? 'pi-star-fill' : 'pi-star']" :style="{ color: n <= avgRatingRounded ? '#D97706' : '#E2E8F0' }"></i>
            </div>
            <p class="rating-note">Based on {{ totalSuppliers }} suppliers</p>
          </div>
        </div>
      </section>

      <section>
        <div class="section-header">
          <h2 class="m-0">{{ $t('suppliers.top_performer') }}</h2>
        </div>
        <div class="content-card p-4">
          <div v-if="topPerformer" class="top-performer">
            <div class="performer-avatar">{{ topPerformer.companyName?.split(' ').map(w => w[0]).join('').substring(0,2) }}</div>
            <div class="performer-info">
              <p class="performer-name">{{ topPerformer.companyName }}</p>
              <p class="performer-meta">{{ topPerformer.deliveryRate }}% on-time · {{ topPerformer.rating }} ★</p>
              <p class="performer-orders">{{ $t('suppliers.best_delivery') }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Filter + Add -->
    <div class="action-row">
      <div class="filter-group">
        <label class="filter-label">Category</label>
        <pv-select v-model="filters.category" :options="categories" placeholder="All categories" class="filter-select" />
      </div>
      <div class="filter-group">
        <label class="filter-label">Status</label>
        <pv-select v-model="filters.status" :options="['Active', 'Inactive']" placeholder="All" class="filter-select" />
      </div>
      <div class="ml-auto">
        <pv-button label="Add Supplier" icon="pi pi-plus" class="add-btn" @click="showDialog = true" />
      </div>
    </div>

    <!-- Suppliers Table -->
    <div class="section-header">
      <h2 class="m-0">{{ $t('suppliers.title') }}</h2>
      <p class="compare-note m-0">{{ suppliers.length }} suppliers</p>
    </div>
    <div class="content-card p-0 overflow-hidden">
      <pv-data-table :value="suppliers" class="buildline-datatable" :rows="8">
        <pv-column header="Supplier">
          <template #body="slotProps">
            <div class="flex align-items-center gap-3">
              <div class="supplier-avatar" :style="{ background: slotProps.data.color }">
                {{ slotProps.data.initials }}
              </div>
              <div>
                <div class="font-semibold" style="color: #1E293B;">{{ slotProps.data.name }}</div>
                <div class="text-xs" style="color: #94A3B8;">{{ slotProps.data.ruc }}</div>
              </div>
            </div>
          </template>
        </pv-column>
        <pv-column field="category" header="Category"></pv-column>
        <pv-column field="contact" header="Contact"></pv-column>
        <pv-column header="Rating">
          <template #body="slotProps">
            <div class="flex align-items-center gap-1">
              <i class="pi pi-star-fill" style="color: #D97706; font-size: 12px;"></i>
              <span class="font-bold" style="color: #1E293B;">{{ slotProps.data.rating }}</span>
              <span style="color: #94A3B8; font-size: 11px;">({{ slotProps.data.reviews }})</span>
            </div>
          </template>
        </pv-column>
        <pv-column field="orders" header="Orders"></pv-column>
        <pv-column field="onTime" header="On-Time %">
          <template #body="slotProps">
            <div class="ontime-bar">
              <div class="ontime-fill" :style="{ width: slotProps.data.onTime + '%', background: slotProps.data.onTime >= 90 ? '#3D9F7D' : slotProps.data.onTime >= 75 ? '#D97706' : '#E02424' }"></div>
            </div>
            <span class="ontime-text">{{ slotProps.data.onTime }}%</span>
          </template>
        </pv-column>
        <pv-column header="Status">
          <template #body="slotProps">
            <span :class="['status-badge', slotProps.data.isActive ? 'status-approved' : 'status-rejected']">
              {{ slotProps.data.isActive ? 'Active' : 'Inactive' }}
            </span>
          </template>
        </pv-column>
      </pv-data-table>
    </div>

    <!-- Dialog -->
    <pv-dialog v-model:visible="showDialog" modal header="Add New Supplier" :style="{ width: '500px' }" class="supplier-dialog">
      <div class="flex flex-column gap-4 pt-2">
        <div class="flex flex-column gap-2">
          <label class="filter-label">Company Name</label>
          <pv-input-text v-model="newSupplier.name" placeholder="Enter company name" class="w-full" />
        </div>
        <div class="flex flex-column gap-2">
          <label class="filter-label">RUC</label>
          <pv-input-text v-model="newSupplier.ruc" placeholder="20XXXXXXXXX" class="w-full" />
        </div>
        <div class="flex flex-column gap-2">
          <label class="filter-label">Category</label>
          <pv-select v-model="newSupplier.category" :options="categories" placeholder="Select category" class="w-full" />
        </div>
        <div class="flex flex-column gap-2">
          <label class="filter-label">Contact Name</label>
          <pv-input-text v-model="newSupplier.contactName" placeholder="Primary contact" class="w-full" />
        </div>
        <div class="flex flex-column gap-2">
          <label class="filter-label">Contact Email</label>
          <pv-input-text v-model="newSupplier.email" placeholder="contact@supplier.com" class="w-full" />
        </div>
        <div class="flex flex-column gap-2">
          <label class="filter-label">Phone</label>
          <pv-input-text v-model="newSupplier.phone" placeholder="+51 999 999 999" class="w-full" />
        </div>
        <div class="supplier-metrics-grid">
          <div class="flex flex-column gap-2 min-w-0">
            <label class="filter-label">Rating</label>
            <pv-input-number v-model="newSupplier.rating" :min="1" :max="5" class="w-full metric-input" />
          </div>
          <div class="flex flex-column gap-2 min-w-0">
            <label class="filter-label">On-time %</label>
            <pv-input-number v-model="newSupplier.deliveryRate" :min="0" :max="100" class="w-full metric-input" />
          </div>
        </div>
      </div>
      <template #footer>
        <pv-button label="Cancel" class="p-button-text" @click="showDialog = false" />
        <pv-button label="Add Supplier" icon="pi pi-check" class="add-btn" @click="handleAddSupplier" />
      </template>
    </pv-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useSuppliersStore } from '../../application/suppliers.store.js';
import { useProcurementStore } from '../../../procurement/application/procurement.store.js';
import { useReferenceDataStore } from '../../../shared/application/reference-data.store.js';
import { useToast } from 'primevue/usetoast';

const suppliersStore = useSuppliersStore();
const procurementStore = useProcurementStore();
const referenceStore = useReferenceDataStore();
const toast = useToast();
const showDialog = ref(false);
const filters = ref({ category: null, status: null });
const newSupplier = ref({ name: '', ruc: '', category: null, contactName: '', email: '', phone: '', rating: null, deliveryRate: null });
const categories = computed(() => referenceStore.categoryNames);

onMounted(async () => {
  await Promise.all([
    suppliersStore.fetchSuppliers(),
    procurementStore.fetchOrders(),
    referenceStore.fetchAll()
  ]);
});

const suppliers = computed(() => {
  const avatarColors = ['#3d63a1', '#D97706', '#3D9F7D', '#64748B', '#E02424', '#7C3AED', '#0891B2'];
  return suppliersStore.suppliersList.map((s, idx) => {
    const name = s.companyName || '';
    const initials = name.split(' ').filter(w => w.length > 0).map(w => w[0].toUpperCase()).join('').substring(0, 2);
    return {
      ...s,
      name,
      initials,
      color: avatarColors[idx % avatarColors.length],
      contact: s.email,
      reviews: procurementStore.purchaseOrders.filter(order => order.supplierName === s.companyName).length,
      orders: procurementStore.purchaseOrders.filter(order => order.supplierName === s.companyName).length,
      onTime: s.deliveryRate || 0
    };
  }).filter(s => {
    if (filters.value.category && s.category !== filters.value.category) return false;
    if (filters.value.status === 'Active' && !s.isActive) return false;
    if (filters.value.status === 'Inactive' && s.isActive) return false;
    return true;
  });
});

const totalSuppliers = computed(() => suppliersStore.suppliersList.length);
const activeCount = computed(() => suppliersStore.activeSuppliers.length);
const inactiveCount = computed(() => suppliersStore.inactiveSuppliers.length);
const avgRating = computed(() => {
  const list = suppliersStore.suppliersList;
  if (list.length === 0) return 0;
  return (list.reduce((sum, s) => sum + (s.rating || 0), 0) / list.length).toFixed(1);
});
const avgRatingRounded = computed(() => Math.round(avgRating.value));
const topPerformer = computed(() => {
  const sorted = [...suppliersStore.suppliersList].sort((a, b) => (b.deliveryRate || 0) - (a.deliveryRate || 0));
  return sorted[0] || null;
});

const handleAddSupplier = async () => {
  if (!newSupplier.value.name || !newSupplier.value.ruc || !newSupplier.value.category || !newSupplier.value.email) {
    toast.add({ severity: 'warn', summary: 'Warning', detail: 'Please fill company, RUC, category and email.', life: 3000 });
    return;
  }
  const success = await suppliersStore.createSupplier({
    companyName: newSupplier.value.name,
    ruc: newSupplier.value.ruc,
    category: newSupplier.value.category,
    email: newSupplier.value.email,
    contactName: newSupplier.value.contactName,
    phone: newSupplier.value.phone,
    rating: newSupplier.value.rating,
    isActive: true,
    deliveryRate: newSupplier.value.deliveryRate
  });
  if (success) {
    showDialog.value = false;
    newSupplier.value = { name: '', ruc: '', category: null, contactName: '', email: '', phone: '', rating: null, deliveryRate: null };
    toast.add({ severity: 'success', summary: 'Success', detail: 'Supplier added.', life: 3000 });
  }
};
</script>

<style scoped>
.view-content { width: 100%; }

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 10px;
}
.section-header h2 {
  font-size: 14px;
  font-weight: 600;
  color: #64748B;
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

/* Summary */
.suppliers-summary-row {
  display: grid;
  grid-template-columns: 1fr 0.8fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}

.portfolio-stats {
  display: flex;
  align-items: center;
  gap: 0;
}
.stat-block { flex: 1; text-align: center; }
.stat-number {
  font-size: 28px;
  font-weight: 800;
  color: #3d63a1;
  margin: 0;
  line-height: 1;
}
.stat-number.active { color: #3D9F7D; }
.stat-number.inactive { color: #94A3B8; }
.stat-label {
  font-size: 12px;
  font-weight: 600;
  color: #94A3B8;
  margin: 6px 0 0 0;
}
.stat-divider {
  width: 1px;
  height: 40px;
  background: #F0F0F0;
}

/* Rating */
.rating-display { text-align: center; }
.rating-big {
  font-size: 36px;
  font-weight: 800;
  color: #1E293B;
  line-height: 1;
}
.rating-stars {
  display: flex;
  justify-content: center;
  gap: 4px;
  margin: 8px 0;
  font-size: 16px;
}
.rating-note {
  font-size: 11px;
  color: #94A3B8;
  font-weight: 600;
  margin: 0;
}

/* Top performer */
.top-performer {
  display: flex;
  align-items: center;
  gap: 14px;
}
.performer-avatar {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #3d63a1;
  color: white;
  font-weight: 800;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.performer-name {
  font-size: 14px;
  font-weight: 800;
  color: #1E293B;
  margin: 0;
}
.performer-meta {
  font-size: 12px;
  color: #64748B;
  margin: 2px 0 0 0;
}
.performer-orders {
  font-size: 11px;
  color: #94A3B8;
  margin: 2px 0 0 0;
}

/* Action row */
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
.add-btn {
  background: #F96116 !important;
  border-color: #F96116 !important;
  border-radius: 12px !important;
  font-weight: 700 !important;
  font-size: 13px !important;
  padding: 10px 24px !important;
}

/* Supplier avatar */
.supplier-avatar {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 12px;
}

/* On-time bar */
.ontime-bar {
  width: 60px;
  height: 6px;
  background: #F1F5F9;
  border-radius: 3px;
  overflow: hidden;
  display: inline-block;
  vertical-align: middle;
  margin-right: 6px;
}
.ontime-fill {
  height: 100%;
  border-radius: 3px;
}
.ontime-text {
  font-size: 12px;
  font-weight: 700;
  color: #374151;
}

:deep(.filter-select) {
  min-width: 160px;
  border: 1px solid #E5E7EB !important;
  border-radius: 12px !important;
  background: white !important;
}

.supplier-metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  width: 100%;
}

.min-w-0 { min-width: 0; }

:deep(.supplier-dialog .p-dialog-content) {
  overflow-x: hidden;
}

:deep(.metric-input),
:deep(.metric-input .p-inputnumber),
:deep(.metric-input .p-inputnumber-input) {
  width: 100% !important;
  min-width: 0 !important;
}

</style>
