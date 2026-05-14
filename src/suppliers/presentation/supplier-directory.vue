<template>
  <div class="p-5 md:p-8">
    <div class="flex flex-column md:flex-row justify-content-between align-items-start md:align-items-center mb-5 gap-3">
      <div>
        <h2 class="m-0 text-primary"><i class="pi pi-users mr-2"></i>Directorio de Proveedores</h2>
        <p class="text-gray-500 mt-1">Gestiona tus proveedores y valida su estado en SUNAT.</p>
      </div>
      <pv-button label="Nuevo Proveedor" icon="pi pi-plus" @click="showNewSupplierDialog = true" />
    </div>

    <pv-card class="shadow-2 border-round-xl mb-5">
      <template #content>
        <pv-data-table :value="store.suppliersList" :loading="store.isLoading" responsiveLayout="scroll" :paginator="true" :rows="5">
          <pv-column field="ruc" header="RUC"></pv-column>
          <pv-column field="companyName" header="Razón Social"></pv-column>
          <pv-column header="Calificación">
            <template #body="slotProps">
              <pv-rating :modelValue="slotProps.data.rating" readonly :cancel="false" />
            </template>
          </pv-column>
          <pv-column header="Estado">
            <template #body="slotProps">
              <pv-tag :severity="slotProps.data.isActive ? 'success' : 'danger'" :value="slotProps.data.isActive ? 'Activo' : 'Inactivo'" />
            </template>
          </pv-column>
          <pv-column header="Acciones">
            <template #body>
              <pv-button icon="pi pi-pencil" class="p-button-text p-button-rounded p-button-info mr-2" />
              <pv-button icon="pi pi-trash" class="p-button-text p-button-rounded p-button-danger" />
            </template>
          </pv-column>
        </pv-data-table>
      </template>
    </pv-card>

    <pv-dialog v-model:visible="showNewSupplierDialog" modal header="Validar y Agregar Proveedor" :style="{ width: '400px' }">
      <div class="flex flex-column gap-3 mt-2">
        <label for="rucInput" class="font-medium text-gray-700">Ingrese RUC (11 dígitos)</label>
        <div class="p-inputgroup">
          <pv-input-text id="rucInput" v-model="rucToValidate" placeholder="Ej: 20123456789" :maxlength="11" />
          <pv-button icon="pi pi-search" @click="validateRuc" :loading="store.isValidatingRuc" />
        </div>

        <div v-if="store.rucValidationResult" class="mt-3 p-3 border-round" :class="store.rucValidationResult.isValid ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'">
          <div class="flex align-items-center gap-2">
            <i class="pi" :class="store.rucValidationResult.isValid ? 'pi-check-circle' : 'pi-times-circle'"></i>
            <span class="font-bold">{{ store.rucValidationResult.message }}</span>
          </div>
        </div>
      </div>
      <template #footer>
        <pv-button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="closeDialog" />
        <pv-button label="Registrar" icon="pi pi-check" :disabled="!store.rucValidationResult?.isValid" autofocus />
      </template>
    </pv-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useSuppliersStore} from "@/suppliers/application/suppliers.store.js";

const store = useSuppliersStore();
const showNewSupplierDialog = ref(false);
const rucToValidate = ref('');

// Cargar la lista de proveedores al renderizar la vista
onMounted(() => {
  store.fetchSuppliers();
});

const validateRuc = () => {
  if (rucToValidate.value.length === 11) {
    store.verifyRuc(rucToValidate.value);
  }
};

const closeDialog = () => {
  showNewSupplierDialog.value = false;
  rucToValidate.value = '';
  store.rucValidationResult = null;
};
</script>