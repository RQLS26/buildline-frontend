<template>
  <div class="p-5 md:p-8">
    <div class="mb-5">
      <h2 class="m-0 text-primary"><i class="pi pi-box mr-2"></i>Control de Almacén</h2>
      <p class="text-gray-500 mt-1">Visualiza el stock actual de los materiales en obra.</p>
    </div>

    <div class="grid mb-5">
      <div class="col-12 md:col-6 lg:col-3">
        <pv-card class="shadow-1 border-left-3 border-primary">
          <template #content>
            <div class="flex justify-content-between align-items-center">
              <div>
                <span class="block text-500 font-medium mb-3">Total Ítems</span>
                <div class="text-900 font-medium text-xl">{{ store.items.length }}</div>
              </div>
              <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width:2.5rem;height:2.5rem">
                <i class="pi pi-list text-blue-500 text-xl"></i>
              </div>
            </div>
          </template>
        </pv-card>
      </div>
      <div class="col-12 md:col-6 lg:col-3">
        <pv-card class="shadow-1 border-left-3 border-orange-500">
          <template #content>
            <div class="flex justify-content-between align-items-center">
              <div>
                <span class="block text-500 font-medium mb-3">Stock Crítico</span>
                <div class="text-900 font-medium text-xl text-orange-500">{{ store.lowStockItems.length }}</div>
              </div>
              <div class="flex align-items-center justify-content-center bg-orange-100 border-round" style="width:2.5rem;height:2.5rem">
                <i class="pi pi-exclamation-triangle text-orange-500 text-xl"></i>
              </div>
            </div>
          </template>
        </pv-card>
      </div>
    </div>

    <pv-card class="shadow-2 border-round-xl">
      <template #content>
        <pv-data-table :value="store.items" :loading="store.isLoading" responsiveLayout="scroll" :paginator="true" :rows="10">
          <pv-column field="id" header="Código" style="width: 10%"></pv-column>
          <pv-column field="materialName" header="Material" style="width: 30%"></pv-column>
          <pv-column field="category" header="Categoría" style="width: 15%"></pv-column>

          <pv-column header="Stock Actual" style="width: 15%">
            <template #body="slotProps">
              <span class="font-bold">{{ slotProps.data.stock }} {{ slotProps.data.unit }}</span>
            </template>
          </pv-column>

          <pv-column header="Estado" style="width: 15%">
            <template #body="slotProps">
              <pv-tag
                  :severity="slotProps.data.stock <= slotProps.data.minStock ? 'danger' : 'success'"
                  :value="slotProps.data.stock <= slotProps.data.minStock ? 'Stock Bajo' : 'Óptimo'"
              />
            </template>
          </pv-column>

          <pv-column header="Acciones" style="width: 15%">
            <template #body>
              <pv-button icon="pi pi-eye" class="p-button-text p-button-rounded p-button-info" v-tooltip="'Ver Kárdex'" />
            </template>
          </pv-column>
        </pv-data-table>
      </template>
    </pv-card>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useInventoryStore } from '../../application/inventory.store.js';

const store = useInventoryStore();

onMounted(() => {
  store.fetchInventory();
});
</script>