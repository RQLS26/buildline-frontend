<template>
  <div class="bg-white p-4 md:p-5 border-round-2xl shadow-1 max-w-7xl mx-auto mt-2">

    <div class="flex flex-wrap align-items-end gap-3 mb-4">

      <div class="flex flex-column gap-1" style="flex: 1; min-width: 200px;">
        <span class="text-xs font-bold text-gray-700">{{ $t('inventory.project') }}</span>
        <pv-select v-model="filters.project" :options="['All projects', 'Skyline Tower', 'Alpha Wing', 'Beta Foundation']" placeholder="All projects" class="w-full bg-gray-50 border-gray-300 text-sm" />
      </div>

      <div class="flex flex-column gap-1" style="flex: 1; min-width: 200px;">
        <span class="text-xs font-bold text-gray-700">{{ $t('inventory.category') }}</span>
        <pv-select v-model="filters.category" :options="['All categories', 'Steel', 'Concrete', 'Aggregate', 'Electrical', 'Equipment', 'Plumbing', 'Wood']" placeholder="All categories" class="w-full bg-gray-50 border-gray-300 text-sm" />
      </div>

      <div class="flex flex-column gap-1" style="flex: 1; min-width: 150px;">
        <span class="text-xs font-bold text-gray-700">{{ $t('inventory.date_from') }}</span>
        <pv-input-text type="date" v-model="filters.dateFrom" class="w-full bg-gray-50 border-gray-300 text-gray-500 text-sm py-2" />
      </div>

      <div class="flex flex-column gap-1" style="flex: 1; min-width: 150px;">
        <span class="text-xs font-bold text-gray-700">{{ $t('inventory.date_to') }}</span>
        <pv-input-text type="date" v-model="filters.dateTo" class="w-full bg-gray-50 border-gray-300 text-gray-500 text-sm py-2" />
      </div>

      <div class="flex flex-column">
        <pv-button :label="$t('inventory.clear_filters')" icon="pi pi-times" @click="clearFilters"
                   class="p-button-outlined p-button-secondary text-blue-600 border-blue-200 hover:bg-blue-50 bg-white border-round-3xl px-3 py-2 text-sm font-medium" />
      </div>

    </div>

    <div class="flex gap-5 border-bottom-1 border-gray-200 mb-4 overflow-x-auto">
      <div @click="activeTab = 'All'" :class="['pb-3 font-bold cursor-pointer text-sm whitespace-nowrap transition-colors', activeTab === 'All' ? 'border-bottom-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-900']">
        {{ $t('inventory.all') }} ({{ counts.all }})
      </div>
      <div @click="activeTab = 'In Stock'" :class="['pb-3 font-bold cursor-pointer text-sm whitespace-nowrap transition-colors', activeTab === 'In Stock' ? 'border-bottom-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-900']">
        {{ $t('inventory.in_stock') }} ({{ counts.inStock }})
      </div>
      <div @click="activeTab = 'Low Stock'" :class="['pb-3 font-bold cursor-pointer text-sm whitespace-nowrap transition-colors', activeTab === 'Low Stock' ? 'border-bottom-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-900']">
        {{ $t('inventory.low_stock') }} ({{ counts.lowStock }})
      </div>
      <div @click="activeTab = 'Out of Stock'" :class="['pb-3 font-bold cursor-pointer text-sm whitespace-nowrap transition-colors', activeTab === 'Out of Stock' ? 'border-bottom-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-900']">
        {{ $t('inventory.out_of_stock') }} ({{ counts.outOfStock }})
      </div>
    </div>

    <pv-data-table :value="filteredInventory" :loading="store.isLoading" responsiveLayout="scroll" :paginator="true" :rows="8" class="p-datatable-sm custom-table">
      <pv-column field="sku" :header="$t('inventory.item_id')" class="font-medium text-gray-900" style="width: 15%"></pv-column>
      <pv-column field="name" :header="$t('inventory.material')" class="text-gray-700" style="width: 25%"></pv-column>
      <pv-column field="project" :header="$t('inventory.project')" class="text-gray-700" style="width: 20%"></pv-column>
      <pv-column field="category" :header="$t('inventory.category')" class="text-gray-700 font-medium" style="width: 15%"></pv-column>
      <pv-column :header="$t('inventory.status')" style="width: 15%">
        <template #body="slotProps">
          <pv-tag :value="$t(`inventory.${getStockStatus(slotProps.data).toLowerCase().replace(/ /g, '_')}`)"
                  :class="['text-xs font-bold status-tag', getTagClass(slotProps.data)]" />
        </template>
      </pv-column>
      <pv-column field="lastUpdated" :header="$t('inventory.date')" class="text-gray-700" style="width: 10%"></pv-column>
    </pv-data-table>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useInventoryStore } from '../../application/inventory.store.js';

const store = useInventoryStore();
const activeTab = ref('All');

const filters = ref({
  project: 'All projects',
  category: 'All categories',
  dateFrom: '',
  dateTo: ''
});

onMounted(() => {
  store.fetchInventory();
});

const getStockStatus = (item) => {
  if (item.currentStock === 0) return 'Out of Stock';
  if (item.currentStock <= item.minStock) return 'Low Stock';
  return 'In Stock';
};

const getTagClass = (item) => {
  const status = getStockStatus(item);
  if (status === 'In Stock') return 'tag-instock';
  if (status === 'Low Stock') return 'tag-lowstock';
  return 'tag-outstock';
};

const filteredInventory = computed(() => {
  return store.inventoryList.filter(item => {
    const itemStatus = getStockStatus(item);
    if (activeTab.value !== 'All' && itemStatus !== activeTab.value) return false;
    if (filters.value.project !== 'All projects' && item.project !== filters.value.project) return false;
    if (filters.value.category !== 'All categories' && item.category !== filters.value.category) return false;
    if (filters.value.dateFrom || filters.value.dateTo) {
      const itemDate = new Date(item.lastUpdated);
      if (filters.value.dateFrom && itemDate < new Date(filters.value.dateFrom)) return false;
      if (filters.value.dateTo && itemDate > new Date(filters.value.dateTo)) return false;
    }
    return true;
  });
});

const clearFilters = () => {
  filters.value = { project: 'All projects', category: 'All categories', dateFrom: '', dateTo: '' };
  activeTab.value = 'All';
};

const counts = computed(() => {
  const all = store.inventoryList.length;
  const inStock = store.inventoryList.filter(i => getStockStatus(i) === 'In Stock').length;
  const lowStock = store.inventoryList.filter(i => getStockStatus(i) === 'Low Stock').length;
  const outOfStock = store.inventoryList.filter(i => getStockStatus(i) === 'Out of Stock').length;
  return { all, inStock, lowStock, outOfStock };
});
</script>

<style scoped>
:deep(.custom-table .p-datatable-thead > tr > th) {
  background-color: white; color: #374151; font-weight: 700; font-size: 0.85rem; border-bottom: 2px solid #e5e7eb; padding-bottom: 1rem;
}
:deep(.custom-table .p-datatable-tbody > tr > td) {
  border-bottom: 1px solid #f3f4f6; padding-top: 1rem; padding-bottom: 1rem; font-size: 0.85rem;
}
:deep(.status-tag) {
  width: 105px !important;
  display: inline-flex !important;
  justify-content: center !important;
  padding: 0.4rem 0 !important;
  border-radius: 6px !important;
}
:deep(.tag-instock) { background-color: #eff6ff !important; color: #1d4ed8 !important; }
:deep(.tag-lowstock) { background-color: #fef9c3 !important; color: #854d0e !important; }
:deep(.tag-outstock) { background-color: #fee2e2 !important; color: #991b1b !important; }
</style>