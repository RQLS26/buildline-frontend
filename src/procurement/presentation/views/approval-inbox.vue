<template>
  <div class="p-5 md:p-8">
    <pv-toast />

    <div class="mb-5">
      <h2 class="m-0 text-primary"><i class="pi pi-inbox mr-2"></i>Bandeja de Aprobaciones</h2>
      <p class="text-gray-500 mt-1">Revisa y aprueba las cotizaciones emitidas por logística antes de generar la orden de compra oficial.</p>
    </div>

    <pv-card class="shadow-2 border-round-xl">
      <template #content>
        <pv-data-table :value="store.purchaseOrders" :loading="store.isLoading" responsiveLayout="scroll" :paginator="true" :rows="5">
          <pv-column field="id" header="N° Orden" style="width: 15%"></pv-column>
          <pv-column field="date" header="Fecha de Emisión" style="width: 15%"></pv-column>
          <pv-column field="supplierName" header="Proveedor" style="width: 25%"></pv-column>

          <pv-column header="Monto Total" style="width: 15%">
            <template #body="slotProps">
              <span class="font-bold">S/ {{ slotProps.data.totalAmount.toFixed(2) }}</span>
            </template>
          </pv-column>

          <pv-column header="Estado" style="width: 15%">
            <template #body="slotProps">
              <pv-tag :severity="getSeverity(slotProps.data.status)" :value="slotProps.data.status" />
            </template>
          </pv-column>

          <pv-column header="Acciones" style="width: 15%">
            <template #body="slotProps">
              <div class="flex gap-2" v-if="slotProps.data.status === 'Pendiente'">
                <pv-button icon="pi pi-check" class="p-button-success p-button-sm p-button-rounded" @click="approveOrder(slotProps.data)" v-tooltip="'Aprobar Cotización'" />
                <pv-button icon="pi pi-times" class="p-button-danger p-button-sm p-button-rounded p-button-outlined" @click="rejectOrder(slotProps.data)" v-tooltip="'Rechazar Cotización'" />
              </div>
              <span v-else class="text-gray-400 text-sm">
                <i class="pi pi-lock mr-1"></i>Procesado
              </span>
            </template>
          </pv-column>
        </pv-data-table>
      </template>
    </pv-card>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useProcurementStore } from '../../application/procurement.store.js';
import { useToast } from 'primevue/usetoast';

const store = useProcurementStore();
const toast = useToast();

onMounted(() => {
  store.fetchOrders();
});

const getSeverity = (status) => {
  switch (status) {
    case 'Aprobada': return 'success';
    case 'Rechazada': return 'danger';
    case 'Pendiente': return 'warning';
    default: return 'info';
  }
};

const approveOrder = async (order) => {
  await store.updateStatus(order.id, 'Aprobada');
  toast.add({ severity: 'success', summary: 'Aprobación Exitosa', detail: `La orden ${order.id} ha sido aprobada y enviada al proveedor.`, life: 4000 });
};

const rejectOrder = async (order) => {
  await store.updateStatus(order.id, 'Rechazada');
  toast.add({ severity: 'error', summary: 'Orden Rechazada', detail: `La orden ${order.id} fue devuelta a logística para nueva cotización.`, life: 4000 });
};
</script>