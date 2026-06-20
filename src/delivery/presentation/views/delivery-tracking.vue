<template>
  <div class="view-content font-inter">

    <!-- Summary Row -->
    <div class="summary-row">
      <div class="summary-card">
        <div class="section-header">
          <h2 class="m-0">{{ $t('delivery.active_shipments') }}</h2>
        </div>
        <div class="content-card p-4">
          <div class="shipment-stats">
            <div class="stat-block">
              <p class="stat-number">{{ deliveryStore.inTransit.length }}</p>
              <p class="stat-label">{{ $t('delivery.in_transit') }}</p>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-block">
              <p class="stat-number warning">{{ deliveryStore.delayed.length }}</p>
              <p class="stat-label">{{ $t('delivery.delayed') }}</p>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-block">
              <p class="stat-number success">{{ deliveryStore.delivered.length }}</p>
              <p class="stat-label">{{ $t('delivery.delivered') }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="summary-card">
        <div class="section-header">
          <h2 class="m-0">{{ $t('delivery.delivery_performance') }}</h2>
        </div>
        <div class="content-card p-4">
          <div class="perf-row">
            <div class="perf-metric">
              <p class="perf-value">{{ deliveryStore.onTimeRate }}%</p>
              <p class="perf-label">{{ $t('delivery.on_time_rate') }}</p>
            </div>
            <div class="perf-bar-container">
              <div class="perf-bar">
                <div class="perf-bar-fill" :style="{ width: deliveryStore.onTimeRate + '%' }"></div>
              </div>
              <div class="perf-bar-labels">
                <span>0%</span><span>{{ deliveryStore.onTimeRate }}%</span><span>100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="summary-card">
        <div class="section-header">
          <h2 class="m-0">{{ $t('delivery.next_arrival') }}</h2>
        </div>
        <div class="content-card p-4">
          <div v-if="deliveryStore.nextArrival" class="next-arrival">
            <div class="arrival-date-box">
              <span class="arrival-month">{{ getMonth(deliveryStore.nextArrival.eta) }}</span>
              <span class="arrival-day">{{ getDay(deliveryStore.nextArrival.eta) }}</span>
            </div>
            <div class="arrival-info">
              <p class="arrival-id">{{ deliveryStore.nextArrival.trackingId }}</p>
              <p class="arrival-supplier">{{ deliveryStore.nextArrival.supplier }}</p>
              <p class="arrival-dest">{{ deliveryStore.nextArrival.destination }}</p>
            </div>
            <div class="arrival-status">
              <span :class="['status-badge', getStatusClass(deliveryStore.nextArrival.status)]">{{ deliveryStore.nextArrival.status }}</span>
            </div>
          </div>
          <div v-else class="text-center text-gray-400 py-3">{{ $t('delivery.no_pending') }}</div>
        </div>
      </div>
    </div>

    <!-- Shipment List -->
    <div class="section-header mt-4">
      <h2 class="m-0">{{ $t('delivery.shipment_tracking') }}</h2>
      <pv-button :label="$t('delivery.register_delivery')" icon="pi pi-plus" class="add-btn" @click="openRegisterDialog" />
    </div>
    <div class="content-card shipment-list-card">
      <!-- Table header -->
      <div class="shipment-table-header">
        <span class="col-tracking">{{ $t('delivery.tracking_id') }}</span>
        <span class="col-po">{{ $t('delivery.po_number') }}</span>
        <span class="col-supplier">{{ $t('delivery.supplier') }}</span>
        <span class="col-origin">{{ $t('delivery.origin') }}</span>
        <span class="col-dest">{{ $t('delivery.destination') }}</span>
        <span class="col-eta">{{ $t('delivery.eta') }}</span>
        <span class="col-status">{{ $t('delivery.status') }}</span>
      </div>

      <!-- Shipment rows loaded from the delivery store -->
      <div v-for="ship in deliveryStore.deliveries" :key="ship.id" class="shipment-block">
        <div class="shipment-row">
          <span class="col-tracking font-bold">{{ ship.trackingId }}</span>
          <span class="col-po">{{ ship.purchaseOrder }}</span>
          <span class="col-supplier">{{ ship.supplier }}</span>
          <span class="col-origin">{{ ship.origin }}</span>
          <span class="col-dest">{{ ship.destination }}</span>
          <span class="col-eta">{{ ship.eta }}</span>
          <span class="col-status">
            <span :class="['status-badge', getStatusClass(ship.status)]">{{ ship.status }}</span>
          </span>
        </div>

        <!-- Expandable tracking bar -->
        <div class="tracking-toggle" @click="toggleTracking(ship.id)">
          <i :class="['pi', expandedId === ship.id ? 'pi-chevron-up' : 'pi-chevron-down']"></i>
          <span>{{ $t('delivery.tracking') }}</span>
          <div class="toggle-line"></div>
          <span class="toggle-map" @click.stop>
            <i class="pi pi-map-marker"></i> {{ $t('delivery.view_map') }}
          </span>
        </div>

        <!-- Expanded tracking panel -->
        <div v-if="expandedId === ship.id" class="tracking-panel">
          <div class="timeline-horizontal">
            <div v-for="(step, idx) in getSteps(ship)" :key="idx"
                 :class="['timeline-step', step.completed ? 'completed' : '', step.active ? 'active' : '']">
              <div class="step-dot">
                <i v-if="step.completed" class="pi pi-check"></i>
                <i v-else-if="step.active" class="pi pi-spin pi-spinner"></i>
              </div>
              <div v-if="idx < getSteps(ship).length - 1" :class="['step-line', step.completed ? 'completed' : '']"></div>
              <div class="step-info">
                <span class="step-title">{{ step.title }}</span>
                <span class="step-date">{{ step.date }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Register Delivery Dialog -->
    <pv-dialog v-model:visible="showRegisterDialog" modal :header="$t('delivery.register_delivery')" :style="{ width: '620px' }">
      <div class="delivery-form-grid pt-2">
        <div class="field-block">
          <label class="filter-label">{{ $t('delivery.tracking_id') }} *</label>
          <pv-input-text v-model="newDelivery.trackingId" class="w-full" readonly />
        </div>
        <div class="field-block">
          <label class="filter-label">{{ $t('delivery.po_number') }}</label>
          <pv-select
            v-model="newDelivery.purchaseOrder"
            :options="purchaseOrderOptions"
            optionLabel="label"
            optionValue="value"
            :placeholder="$t('delivery.select_po')"
            class="w-full"
            showClear
            @update:modelValue="syncFromPurchaseOrder"
          />
        </div>
        <div class="field-block">
          <label class="filter-label">{{ $t('delivery.supplier') }} *</label>
          <pv-select
            v-model="newDelivery.supplier"
            :options="supplierOptions"
            :placeholder="$t('delivery.select_supplier')"
            class="w-full"
            editable
          />
        </div>
        <div class="field-block">
          <label class="filter-label">{{ $t('delivery.material') }} *</label>
          <pv-select
            v-model="newDelivery.material"
            :options="materialOptions"
            :placeholder="$t('delivery.select_material')"
            class="w-full"
            editable
          />
        </div>
        <div class="field-block">
          <label class="filter-label">{{ $t('delivery.origin') }}</label>
          <pv-select
            v-model="newDelivery.origin"
            :options="originOptions"
            :placeholder="$t('delivery.select_origin')"
            class="w-full"
            editable
          />
        </div>
        <div class="field-block">
          <label class="filter-label">{{ $t('delivery.destination') }}</label>
          <pv-select
            v-model="newDelivery.destination"
            :options="destinationOptions"
            :placeholder="$t('delivery.select_destination')"
            class="w-full"
            editable
          />
        </div>
        <div class="field-block">
          <label class="filter-label">{{ $t('delivery.eta') }} *</label>
          <pv-date-picker v-model="newDelivery.eta" dateFormat="M dd, yy" class="w-full" :placeholder="$t('delivery.select_date')" />
        </div>
        <div class="field-block">
          <label class="filter-label">{{ $t('delivery.dispatch_date') }}</label>
          <pv-date-picker v-model="newDelivery.dispatchDate" dateFormat="M dd, yy" class="w-full" :placeholder="$t('delivery.select_date')" />
        </div>
      </div>
      <template #footer>
        <pv-button :label="$t('common.cancel')" class="p-button-text" @click="showRegisterDialog = false" />
        <pv-button :label="$t('delivery.register')" icon="pi pi-check" class="add-btn" @click="handleRegisterDelivery" />
      </template>
    </pv-dialog>

    <pv-toast />
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import { useDeliveryStore } from '../../application/delivery.store.js';
import { useProcurementStore } from '../../../procurement/application/procurement.store.js';
import { useSuppliersStore } from '../../../suppliers/application/suppliers.store.js';
import { useReferenceDataStore } from '../../../shared/application/reference-data.store.js';
import { buildNextPlainCode } from '../../../shared/application/business-code.js';

const toast = useToast();
const { t } = useI18n();
const deliveryStore = useDeliveryStore();
const procurementStore = useProcurementStore();
const suppliersStore = useSuppliersStore();
const referenceStore = useReferenceDataStore();
const expandedId = ref(null);
const showRegisterDialog = ref(false);

const newDelivery = ref({
  trackingId: '', purchaseOrder: '', supplier: '', material: '',
  origin: '', destination: '', eta: null, dispatchDate: null
});

const uniqueValues = (items) => [...new Set(items.filter(Boolean))];
const purchaseOrderOptions = computed(() => procurementStore.purchaseOrders.map(order => ({
  label: `${order.orderId} - ${order.supplierName || t('delivery.supplier')} - ${order.material || t('delivery.material')}`,
  value: order.orderId
})));
const supplierOptions = computed(() => uniqueValues([
  ...suppliersStore.suppliersList.map(supplier => supplier.companyName),
  ...procurementStore.purchaseOrders.map(order => order.supplierName),
  ...deliveryStore.deliveries.map(delivery => delivery.supplier)
]));
const materialOptions = computed(() => uniqueValues([
  ...referenceStore.materialNames,
  ...procurementStore.purchaseOrders.map(order => order.material),
  ...deliveryStore.deliveries.map(delivery => delivery.material)
]));
const originOptions = computed(() => uniqueValues(deliveryStore.deliveries.map(delivery => delivery.origin)));
const destinationOptions = computed(() => uniqueValues([
  ...referenceStore.projectNames.map(project => `${project} Site`),
  ...procurementStore.purchaseOrders.map(order => order.project ? `${order.project} Site` : null),
  ...deliveryStore.deliveries.map(delivery => delivery.destination)
]));

onMounted(async () => {
  await Promise.all([
    deliveryStore.fetchDeliveries(),
    procurementStore.fetchOrders(),
    suppliersStore.fetchSuppliers(),
    referenceStore.fetchAll()
  ]);
});

watch(showRegisterDialog, (isOpen) => {
  if (isOpen && !newDelivery.value.trackingId) {
    newDelivery.value.trackingId = buildNextPlainCode(deliveryStore.deliveries, 'trackingId', 'TRK', 3);
  }
});

const openRegisterDialog = () => {
  newDelivery.value = {
    trackingId: buildNextPlainCode(deliveryStore.deliveries, 'trackingId', 'TRK', 3),
    purchaseOrder: '', supplier: '', material: '', origin: '', destination: '', eta: null, dispatchDate: null
  };
  showRegisterDialog.value = true;
};

const syncFromPurchaseOrder = (orderId) => {
  const order = procurementStore.purchaseOrders.find(item => item.orderId === orderId);
  if (!order) return;
  newDelivery.value.supplier = order.supplierName || newDelivery.value.supplier;
  newDelivery.value.material = order.material || newDelivery.value.material;
  newDelivery.value.destination = order.project ? `${order.project} Site` : newDelivery.value.destination;
};

const formatDate = (d) => {
  if (!d) return '';
  const date = new Date(d);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const handleRegisterDelivery = async () => {
  if (!newDelivery.value.trackingId || !newDelivery.value.supplier || !newDelivery.value.material || !newDelivery.value.eta) {
    toast.add({ severity: 'warn', summary: t('common.warning'), detail: t('delivery.required_fields'), life: 3000 });
    return;
  }

  const data = {
    trackingId: newDelivery.value.trackingId,
    purchaseOrder: newDelivery.value.purchaseOrder || null,
    supplier: newDelivery.value.supplier,
    material: newDelivery.value.material,
    origin: newDelivery.value.origin || 'Lima, Peru',
    destination: newDelivery.value.destination || 'Project Site',
    eta: formatDate(newDelivery.value.eta),
    dispatchDate: formatDate(newDelivery.value.dispatchDate),
    status: 'Shipped',
    items: newDelivery.value.material
  };
  const success = await deliveryStore.createDelivery(data);
  if (success) {
    showRegisterDialog.value = false;
    toast.add({ severity: 'success', summary: t('common.success'), detail: t('delivery.registered_message', { id: data.trackingId }), life: 3000 });
  }
};

const toggleTracking = (id) => {
  expandedId.value = expandedId.value === id ? null : id;
};

const getMonth = (dateStr) => {
  if (!dateStr) return '';
  return dateStr.split(' ')[0] || '';
};

const getDay = (dateStr) => {
  if (!dateStr) return '';
  return dateStr.split(' ')[1]?.replace(',', '') || '';
};

const addDaysToDisplayDate = (value, days) => {
  const parsed = value ? new Date(value) : null;
  if (!parsed || Number.isNaN(parsed.getTime())) return '';
  parsed.setDate(parsed.getDate() + days);
  return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Generate tracking steps based on delivery status and calendar progression.
const getSteps = (delivery) => {
  const statusOrder = [
    t('delivery.step_order_placed'),
    t('delivery.step_confirmed'),
    t('delivery.shipped'),
    t('delivery.in_transit'),
    t('delivery.delivered')
  ];
  const stepDates = [
    addDaysToDisplayDate(delivery.dispatchDate, -2) || delivery.dispatchDate,
    addDaysToDisplayDate(delivery.dispatchDate, -1) || delivery.dispatchDate,
    delivery.dispatchDate,
    addDaysToDisplayDate(delivery.dispatchDate, 1),
    delivery.eta
  ];
  const statusIndex = {
    'Confirmed': 1,
    'Shipped': 2,
    'In Transit': 3,
    'Delivered': 4,
    'Delayed': 3
  };
  const currentIdx = statusIndex[delivery.status] ?? 1;

  return statusOrder.map((title, idx) => ({
    title,
    date: idx <= currentIdx ? stepDates[idx] || delivery.dispatchDate || delivery.eta : t('common.pending'),
    completed: idx < currentIdx,
    active: idx === currentIdx && delivery.status !== 'Delivered'
  }));
};

const getStatusClass = (status) => {
  const map = { 'Confirmed': 'status-pending', 'In Transit': 'status-intransit', 'Shipped': 'status-shipped', 'Delivered': 'status-approved', 'Pending': 'status-pending', 'Delayed': 'status-rejected' };
  return map[status] || 'status-pending';
};
</script>

<style scoped>
.view-content { width: 100%; }

/* === Consistent section headers === */
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
.content-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.04);
}

/* Summary Row */
.summary-row {
  display: grid;
  grid-template-columns: 1fr 1.2fr 1fr;
  gap: 20px;
  margin-bottom: 8px;
}
.shipment-stats {
  display: flex;
  align-items: center;
}
.stat-block { flex: 1; text-align: center; }
.stat-number {
  font-size: 28px;
  font-weight: 800;
  color: #3d63a1;
  margin: 0;
  line-height: 1;
}
.stat-number.warning { color: #D97706; }
.stat-number.success { color: #3D9F7D; }
.stat-label {
  font-size: 12px;
  font-weight: 600;
  color: #9CA3AF;
  margin: 6px 0 0 0;
}
.stat-divider {
  width: 1px;
  height: 40px;
  background: #F0F0F0;
}

/* Performance bar */
.perf-row {
  display: flex;
  align-items: center;
  gap: 20px;
}
.perf-metric { flex-shrink: 0; }
.perf-value {
  font-size: 28px;
  font-weight: 800;
  color: #3D9F7D;
  margin: 0;
  line-height: 1;
}
.perf-label {
  font-size: 12px;
  font-weight: 600;
  color: #9CA3AF;
  margin: 4px 0 0 0;
}
.perf-bar-container { flex: 1; }
.perf-bar {
  height: 8px;
  background: #F3F4F6;
  border-radius: 4px;
  overflow: hidden;
}
.perf-bar-fill {
  height: 100%;
  background: #3D9F7D;
  border-radius: 4px;
}
.perf-bar-labels {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: #9CA3AF;
  font-weight: 600;
  margin-top: 4px;
}

/* Next Arrival */
.next-arrival {
  display: flex;
  align-items: center;
  gap: 16px;
}
.arrival-date-box {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  background: #F1F5F9;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.arrival-month {
  font-size: 10px;
  font-weight: 700;
  color: #64748B;
  text-transform: uppercase;
}
.arrival-day {
  font-size: 20px;
  font-weight: 800;
  color: #1E293B;
  line-height: 1;
}
.arrival-info { flex: 1; }
.arrival-id { font-size: 14px; font-weight: 800; color: #1E293B; margin: 0; }
.arrival-supplier { font-size: 12px; color: #64748B; margin: 2px 0 0 0; }
.arrival-dest { font-size: 11px; color: #9CA3AF; margin: 2px 0 0 0; }
.arrival-status { flex-shrink: 0; }

/* Status badges */
.status-badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 6px;
}
.status-intransit { background: #F3F4F6; color: #64748B; }
.status-shipped { background: #F3F4F6; color: #64748B; }
.status-approved { background: #EAF8F0; color: #3D9F7D; }
.status-pending { background: #F3F4F6; color: #64748B; }
.status-rejected { background: #FEECEB; color: #E02424; }

/* Shipment list */
.shipment-list-card {
  overflow: hidden;
}

.shipment-table-header {
  display: grid;
  grid-template-columns: 1fr 1fr 1.3fr 0.9fr 1.1fr 1fr 0.9fr;
  padding: 14px 24px;
  font-size: 12px;
  font-weight: 700;
  color: #9CA3AF;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  border-bottom: 1px solid #F1F5F9;
}

.shipment-block {
  border-bottom: 1px solid #F3F4F6;
}
.shipment-block:last-child { border-bottom: none; }

.shipment-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1.3fr 0.9fr 1.1fr 1fr 0.9fr;
  padding: 16px 24px;
  align-items: center;
  font-size: 13px;
  color: #374151;
}
.shipment-row .font-bold {
  font-weight: 800;
  color: #1E293B;
}

/* Tracking toggle bar */
.tracking-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 24px 12px 24px;
  cursor: pointer;
  user-select: none;
}
.tracking-toggle i {
  font-size: 10px;
  color: #3d63a1;
}
.tracking-toggle > span {
  font-size: 11px;
  font-weight: 700;
  color: #3d63a1;
}
.toggle-line {
  flex: 1;
  height: 1px;
  background: #E2E8F0;
}
.toggle-map {
  font-size: 11px;
  font-weight: 700;
  color: #64748B;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: color 0.15s;
}
.toggle-map:hover { color: #3d63a1; }

/* Expanded tracking panel */
.tracking-panel {
  padding: 8px 24px 24px 24px;
  background: #FAFBFC;
  border-top: 1px solid #F1F5F9;
  animation: slideDown 0.2s ease;
}

@keyframes slideDown {
  from { opacity: 0; max-height: 0; }
  to { opacity: 1; max-height: 200px; }
}

/* Horizontal Timeline */
.timeline-horizontal {
  display: flex;
  align-items: flex-start;
  padding: 16px 0 8px 0;
}
.timeline-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex: 1;
}
.step-dot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 3px solid #E2E8F0;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  font-size: 12px;
  color: #9CA3AF;
}
.timeline-step.completed .step-dot {
  background: #3D9F7D;
  border-color: #3D9F7D;
  color: white;
}
.timeline-step.active .step-dot {
  border-color: #3d63a1;
  color: #3d63a1;
  box-shadow: 0 0 0 4px rgba(61, 99, 161, 0.12);
}
.step-line {
  position: absolute;
  top: 16px;
  left: calc(50% + 16px);
  width: calc(100% - 32px);
  height: 3px;
  background: #E2E8F0;
  z-index: 1;
}
.step-line.completed { background: #3D9F7D; }

.step-info {
  text-align: center;
  margin-top: 8px;
}
.step-title {
  display: block;
  font-size: 11px;
  font-weight: 700;
  color: #374151;
}
.step-date {
  display: block;
  font-size: 10px;
  color: #9CA3AF;
  margin-top: 2px;
}

.mt-4 { margin-top: 20px; }

.add-btn { background: #F96116 !important; border-color: #F96116 !important; border-radius: 12px !important; font-weight: 700 !important; font-size: 13px !important; padding: 10px 24px !important; }
.filter-label { font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.03em; }

.delivery-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px 16px;
}

.field-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

:deep(.delivery-form-grid .p-select),
:deep(.delivery-form-grid .p-inputtext),
:deep(.delivery-form-grid .p-datepicker) {
  width: 100%;
  min-width: 0;
}

</style>
