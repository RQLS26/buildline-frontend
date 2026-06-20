<template>
  <div class="view-content font-inter">

    <!-- Action Row -->
    <div class="action-row">
      <div class="filter-group">
        <label class="filter-label">Category</label>
        <pv-select v-model="filters.category" :options="categories" placeholder="All categories" class="filter-select"/>
      </div>
      <div class="filter-group">
        <label class="filter-label">{{ $t('inventory.stock_level') }}</label>
        <pv-select v-model="filters.stock" :options="stockLevels" placeholder="All levels" class="filter-select"/>
      </div>
      <div class="filter-group">
        <label class="filter-label">Project</label>
        <pv-select v-model="filters.project" :options="projectOptions" placeholder="All projects"
                   class="filter-select"/>
      </div>
      <div class="ml-auto flex gap-2">
        <pv-button label="Add Item" icon="pi pi-plus" class="add-btn" @click="openAddDialog"/>
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

    <!-- Table -->
    <div class="section-header">
      <h2 class="m-0">{{ $t('inventory.inventory_items') }}</h2>
      <p class="compare-note m-0">{{ filteredItems.length }} items</p>
    </div>
    <div class="content-card p-0 overflow-hidden">
      <pv-data-table :value="filteredItems" class="buildline-datatable" :rows="12">
        <pv-column field="sku" header="Item ID"></pv-column>
        <pv-column field="name" header="Material">
          <template #body="slotProps">
            <span class="font-semibold" style="color: #1E293B;">{{ slotProps.data.name }}</span>
          </template>
        </pv-column>
        <pv-column field="category" header="Category"></pv-column>
        <pv-column field="project" header="Project"></pv-column>
        <pv-column header="Stock">
          <template #body="slotProps">
            <div class="stock-cell">
              <div class="stock-bar">
                <div class="stock-fill"
                     :style="{ width: Math.min(100, (slotProps.data.currentStock / slotProps.data.maxStock) * 100) + '%', background: getStockColor(slotProps.data.currentStock, slotProps.data.minStock) }"></div>
              </div>
              <span class="stock-text">{{ slotProps.data.currentStock }} / {{ slotProps.data.maxStock }}</span>
            </div>
          </template>
        </pv-column>
        <pv-column header="Status">
          <template #body="slotProps">
            <span :class="['status-badge', getStockStatusClass(slotProps.data.currentStock, slotProps.data.minStock)]">
              {{ getStockLabel(slotProps.data.currentStock, slotProps.data.minStock) }}
            </span>
          </template>
        </pv-column>
        <pv-column header="">
          <template #body="slotProps">
            <button class="edit-item-btn" title="Edit" @click="openEditDialog(slotProps.data)"><i
                class="pi pi-pencil"></i></button>
          </template>
        </pv-column>
        <template #empty>
          <div class="tenant-empty-state">{{ $t('common.company_empty_data') }}</div>
        </template>
      </pv-data-table>
    </div>

    <!-- Add Item Dialog -->
    <pv-dialog v-model:visible="showAddDialog" modal :header="$t('inventory.add_inventory_item')" :style="{ width: '500px' }">
      <div class="flex flex-column gap-4 pt-2">
        <div class="flex flex-column gap-2">
          <label class="filter-label">{{ $t('inventory.material_name') }} *</label>
          <pv-select v-model="newItem.name" :options="materialOptions" placeholder="Select material" class="w-full"/>
        </div>
        <div class="flex gap-3">
          <div class="flex flex-column gap-2 flex-1">
            <label class="filter-label">{{ $t('inventory.category') }}</label>
            <pv-select v-model="newItem.category" :options="categories" placeholder="Select" class="w-full"/>
          </div>
          <div class="flex flex-column gap-2 flex-1">
            <label class="filter-label">{{ $t('inventory.project') }}</label>
            <pv-select v-model="newItem.project" :options="projectOptions" placeholder="Select" class="w-full"/>
          </div>
        </div>
        <div class="flex gap-3">
          <div class="flex flex-column gap-2 flex-1">
            <label class="filter-label">{{ $t('inventory.current_stock') }}</label>
            <pv-input-number v-model="newItem.currentStock" :min="0" class="w-full"/>
          </div>
          <div class="flex flex-column gap-2 flex-1">
            <label class="filter-label">{{ $t('inventory.max_stock') }}</label>
            <pv-input-number v-model="newItem.maxStock" :min="1" class="w-full"/>
          </div>
        </div>
        <div class="flex flex-column gap-2">
          <label class="filter-label">{{ $t('inventory.min_stock') }}</label>
          <pv-input-number v-model="newItem.minStock" :min="0" class="w-full"/>
        </div>
      </div>
      <template #footer>
        <pv-button label="Cancel" class="p-button-text" @click="showAddDialog = false"/>
        <pv-button label="Add Item" icon="pi pi-check" class="add-btn" @click="handleAddItem"/>
      </template>
    </pv-dialog>

    <!-- Edit Item Dialog -->
    <pv-dialog v-model:visible="showEditDialog" modal :header="$t('inventory.edit_item')" :style="{ width: '500px' }">
      <div class="flex flex-column gap-4 pt-2">
        <div class="flex flex-column gap-2">
          <label class="filter-label">{{ $t('inventory.material_name') }}</label>
          <pv-input-text v-model="editItem.name" class="w-full"/>
        </div>
        <div class="flex gap-3">
          <div class="flex flex-column gap-2 flex-1">
            <label class="filter-label">{{ $t('inventory.category') }}</label>
            <pv-select v-model="editItem.category" :options="categories" class="w-full"/>
          </div>
          <div class="flex flex-column gap-2 flex-1">
            <label class="filter-label">{{ $t('inventory.project') }}</label>
            <pv-select v-model="editItem.project" :options="projectOptions" class="w-full"/>
          </div>
        </div>
        <div class="flex gap-3">
          <div class="flex flex-column gap-2 flex-1">
            <label class="filter-label">{{ $t('inventory.current_stock') }}</label>
            <pv-input-number v-model="editItem.currentStock" :min="0" class="w-full"/>
          </div>
          <div class="flex flex-column gap-2 flex-1">
            <label class="filter-label">{{ $t('inventory.max_stock') }}</label>
            <pv-input-number v-model="editItem.maxStock" :min="1" class="w-full"/>
          </div>
        </div>
        <div class="flex flex-column gap-2">
          <label class="filter-label">{{ $t('inventory.min_stock') }}</label>
          <pv-input-number v-model="editItem.minStock" :min="0" class="w-full"/>
        </div>
      </div>
      <template #footer>
        <pv-button :label="$t('common.cancel')" class="p-button-text" @click="showEditDialog = false"/>
        <pv-button :label="$t('inventory.save_changes')" icon="pi pi-check" class="add-btn" @click="handleEditItem"/>
      </template>
    </pv-dialog>

    <pv-toast/>
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue';
import {useInventoryStore} from '../../application/inventory.store.js';
import {useReferenceDataStore} from '../../../shared/application/reference-data.store.js';
import {buildNextPlainCode} from '../../../shared/application/business-code.js';
import {useToast} from 'primevue/usetoast';

const toast = useToast();
const inventoryStore = useInventoryStore();
const referenceStore = useReferenceDataStore();
const showAddDialog = ref(false);
const showEditDialog = ref(false);
const activeTab = ref('All');
const filters = ref({category: null, stock: null, project: null});

const categories = computed(() => referenceStore.categoryNames);
const stockLevels = computed(() => ['In Stock', 'Low Stock', 'Out of Stock']);
const projectOptions = computed(() => referenceStore.projectNames);
const materialOptions = computed(() => referenceStore.materialNames);

onMounted(async () => {
  await Promise.all([
    inventoryStore.fetchInventory(),
    referenceStore.fetchAll()
  ]);
});

const items = computed(() => inventoryStore.inventoryList);

const tabs = computed(() => {
  const summary = inventoryStore.inventorySummary;
  return [
    {name: 'All', label: `All (${summary.total})`},
    {name: 'InStock', label: `In Stock (${summary.inStock})`},
    {name: 'LowStock', label: `Low Stock (${summary.lowStock})`},
    {name: 'OutOfStock', label: `Out of Stock (${summary.outOfStock})`}
  ];
});

const filteredItems = computed(() => {
  return items.value.filter(item => {
    if (activeTab.value === 'InStock') return item.currentStock > item.minStock;
    if (activeTab.value === 'LowStock') return item.currentStock > 0 && item.currentStock <= item.minStock;
    if (activeTab.value === 'OutOfStock') return item.currentStock === 0;
    if (filters.value.category && item.category !== filters.value.category) return false;
    if (filters.value.project && item.project !== filters.value.project) return false;
    if (filters.value.stock) {
      const label = getStockLabel(item.currentStock, item.minStock);
      if (label !== filters.value.stock) return false;
    }
    return true;
  });
});

// Add item
const newItem = ref({name: '', category: null, project: null, currentStock: 0, maxStock: 100, minStock: 10});

const openAddDialog = () => {
  newItem.value = {name: '', category: null, project: null, currentStock: 0, maxStock: 100, minStock: 10};
  showAddDialog.value = true;
};

const handleAddItem = async () => {
  if (!newItem.value.name) {
    toast.add({severity: 'warn', summary: 'Warning', detail: 'Select a material.', life: 3000});
    return;
  }
  if (!newItem.value.category || !newItem.value.project) {
    toast.add({severity: 'warn', summary: 'Warning', detail: 'Select category and project.', life: 3000});
    return;
  }
  const itemData = {
    sku: buildNextPlainCode(items.value, 'sku', 'INV'),
    name: newItem.value.name,
    project: newItem.value.project,
    category: newItem.value.category,
    currentStock: newItem.value.currentStock || 0,
    maxStock: newItem.value.maxStock || 100,
    minStock: newItem.value.minStock || 10,
    lastUpdated: new Date().toISOString().split('T')[0]
  };
  const success = await inventoryStore.addItem(itemData);
  if (success) {
    showAddDialog.value = false;
    toast.add({severity: 'success', summary: 'Added', detail: `${itemData.name} added to inventory.`, life: 3000});
  }
};

// Edit item
const editItem = ref({id: null, name: '', category: null, project: null, currentStock: 0, maxStock: 100, minStock: 10});

const openEditDialog = (item) => {
  editItem.value = {...item};
  showEditDialog.value = true;
};

const handleEditItem = async () => {
  const success = await inventoryStore.updateItem(editItem.value.id, {
    name: editItem.value.name,
    category: editItem.value.category,
    project: editItem.value.project,
    currentStock: editItem.value.currentStock,
    maxStock: editItem.value.maxStock,
    minStock: editItem.value.minStock,
    lastUpdated: new Date().toISOString().split('T')[0]
  });
  if (success) {
    showEditDialog.value = false;
    toast.add({severity: 'success', summary: 'Updated', detail: 'Item updated.', life: 3000});
  }
};

const getStockColor = (current, min) => {
  if (current === 0) return '#E02424';
  if (current < min) return '#D97706';
  return '#3D9F7D';
};

const getStockStatusClass = (current, min) => {
  if (current === 0) return 'status-rejected';
  if (current < min) return 'status-pending';
  return 'status-approved';
};

const getStockLabel = (current, min) => {
  if (current === 0) return 'Out of Stock';
  if (current < min) return 'Low Stock';
  return 'In Stock';
};
</script>

<style scoped>
.view-content {
  width: 100%;
}

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

.add-btn {
  background: #F96116 !important;
  border-color: #F96116 !important;
  border-radius: 12px !important;
  font-weight: 700 !important;
  font-size: 13px !important;
  padding: 10px 24px !important;
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
  color: #94A3B8;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 3px solid transparent;
}

.tab-item:hover {
  color: #64748B;
}

.tab-active {
  color: #3d63a1;
  border-bottom-color: #3d63a1;
}

.stock-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stock-bar {
  width: 60px;
  height: 6px;
  background: #F1F5F9;
  border-radius: 3px;
  overflow: hidden;
}

.stock-fill {
  height: 100%;
  border-radius: 3px;
}

.stock-text {
  font-size: 12px;
  font-weight: 700;
  color: #374151;
}

.edit-item-btn {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: 1px solid #E2E8F0;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #3d63a1;
  transition: all 0.15s;
}

.edit-item-btn:hover {
  background: #3d63a1;
  color: white;
  border-color: #3d63a1;
}

:deep(.filter-select) {
  min-width: 160px;
  border: 1px solid #E5E7EB !important;
  border-radius: 12px !important;
  background: white !important;
}

:deep(.p-dialog-content) {
  overflow: hidden !important;
}

:deep(.p-inputnumber) {
  width: 100% !important;
}

:deep(.p-inputnumber-input) {
  width: 100% !important;
}

.tenant-empty-state {
  padding: 44px 24px;
  color: #94A3B8;
  font-size: 13px;
  font-weight: 700;
  text-align: center;
}
</style>
