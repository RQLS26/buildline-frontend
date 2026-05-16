<template>
  <div class="view-content">

    <!-- Action Row -->
    <div class="action-row">
      <div class="filter-group">
        <label class="filter-label">Role</label>
        <pv-select v-model="filters.role" :options="roles" placeholder="All roles" class="filter-select" />
      </div>
      <div class="filter-group">
        <label class="filter-label">Status</label>
        <pv-select v-model="filters.status" :options="['Active', 'Inactive']" placeholder="All" class="filter-select" />
      </div>
      <div class="ml-auto">
        <pv-button label="Add User" icon="pi pi-user-plus" class="add-user-btn" @click="showDialog = true" />
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

    <!-- Table Card -->
    <div class="table-card">
      <pv-data-table :value="filteredUsers" class="buildline-datatable" :rows="10">
        <pv-column field="name" header="User">
          <template #body="slotProps">
            <div class="flex align-items-center gap-3">
              <div class="user-avatar" :style="{ background: slotProps.data.avatarColor }">
                {{ slotProps.data.name.split(' ').map(n => n[0]).join('') }}
              </div>
              <div>
                <div class="font-semibold text-900">{{ slotProps.data.name }}</div>
                <div class="text-xs" style="color: #9CA3AF;">{{ slotProps.data.email }}</div>
              </div>
            </div>
          </template>
        </pv-column>
        <pv-column field="role" header="Role">
          <template #body="slotProps">
            <span class="role-badge" :style="{ background: getRoleColor(slotProps.data.role).bg, color: getRoleColor(slotProps.data.role).text }">
              {{ slotProps.data.role }}
            </span>
          </template>
        </pv-column>
        <pv-column field="department" header="Department"></pv-column>
        <pv-column field="lastLogin" header="Last Login"></pv-column>
        <pv-column header="Status">
          <template #body="slotProps">
            <span :class="['status-badge', slotProps.data.isActive ? 'status-approved' : 'status-rejected']">
              {{ slotProps.data.isActive ? 'Active' : 'Inactive' }}
            </span>
          </template>
        </pv-column>
        <pv-column header="Actions">
          <template #body="slotProps">
            <div class="flex gap-2 align-items-center">
              <pv-select v-if="iamStore.isAdmin && slotProps.data.id !== iamStore.currentUser?.id"
                :modelValue="slotProps.data.role"
                @update:modelValue="(val) => changeRole(slotProps.data, val)"
                :options="roles" class="role-select-sm" />
              <span v-else class="text-xs" style="color: #9CA3AF;">
                <i class="pi pi-lock"></i>
              </span>
            </div>
          </template>
        </pv-column>
      </pv-data-table>

      <!-- Pagination -->
      <div class="pagination-row">
        <div class="pagination-info">
          Item per page:
          <span class="pagination-count">10 <i class="pi pi-caret-down"></i></span>
        </div>
        <div class="pagination-controls">
          <i class="pi pi-caret-left pagination-arrow"></i>
          <span v-for="n in 2" :key="n" :class="['page-num', n === 1 ? 'page-active' : '']">{{ n }}</span>
          <i class="pi pi-caret-right pagination-arrow"></i>
        </div>
      </div>
    </div>

    <!-- Add User Dialog -->
    <pv-dialog v-model:visible="showDialog" modal header="Add New User" :style="{ width: '480px' }">
      <div class="flex flex-column gap-4 pt-2">
        <div class="flex flex-column gap-2">
          <label class="filter-label">Full Name</label>
          <pv-input-text v-model="newUser.name" placeholder="Enter full name" class="w-full" />
        </div>
        <div class="flex flex-column gap-2">
          <label class="filter-label">Email</label>
          <pv-input-text v-model="newUser.email" placeholder="user@buildline.com" class="w-full" />
        </div>
        <div class="flex flex-column gap-2">
          <label class="filter-label">Password</label>
          <pv-input-text v-model="newUser.password" type="password" placeholder="Set password" class="w-full" />
        </div>
        <div class="flex flex-column gap-2">
          <label class="filter-label">Department</label>
          <pv-select v-model="newUser.department" :options="departments" placeholder="Select department" class="w-full" />
        </div>
      </div>
      <template #footer>
        <pv-button label="Cancel" class="p-button-text" @click="showDialog = false" />
        <pv-button label="Create User" icon="pi pi-check" class="add-user-btn" @click="createUser" />
      </template>
    </pv-dialog>

    <!-- Access Denied Message for Viewers -->
    <div v-if="!iamStore.isAdmin" class="viewer-notice">
      <i class="pi pi-info-circle"></i>
      <span>You are logged in as a <strong>{{ iamStore.userRole }}</strong>. Only administrators can change user roles.</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useIamStore } from '../../application/iam.store.js';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const iamStore = useIamStore();
const showDialog = ref(false);
const activeTab = ref('All');
const filters = ref({ role: null, status: null });
const newUser = ref({ name: '', email: '', password: '', department: null });

const roles = ['owner', 'admin', 'viewer'];
const departments = ['Engineering', 'Procurement', 'Logistics', 'Finance', 'Management'];

onMounted(() => {
  iamStore.fetchAllUsers();
});

const tabs = computed(() => {
  const users = iamStore.allUsers || [];
  const owners = users.filter(u => u.role === 'owner').length;
  const admins = users.filter(u => u.role === 'admin').length;
  const viewers = users.filter(u => u.role === 'viewer').length;
  return [
    { name: 'All', label: `All (${users.length})` },
    { name: 'owner', label: `Owners (${owners})` },
    { name: 'admin', label: `Admins (${admins})` },
    { name: 'viewer', label: `Viewers (${viewers})` }
  ];
});

const filteredUsers = computed(() => {
  return (iamStore.allUsers || []).filter(u => {
    if (activeTab.value !== 'All' && u.role !== activeTab.value) return false;
    if (filters.value.role && u.role !== filters.value.role) return false;
    if (filters.value.status) {
      const isActive = filters.value.status === 'Active';
      if (u.isActive !== isActive) return false;
    }
    return true;
  });
});

const changeRole = async (user, newRole) => {
  if (!iamStore.isAdmin) {
    toast.add({ severity: 'warn', summary: 'Restricted', detail: 'Only administrators can change roles.', life: 3000 });
    return;
  }
  if (user.id === iamStore.currentUser?.id) {
    toast.add({ severity: 'warn', summary: 'Warning', detail: 'You cannot change your own role.', life: 3000 });
    return;
  }
  // Only owner can change another admin's role
  const currentUserRole = iamStore.currentUser?.role || 'admin';
  if (user.role === 'admin' && currentUserRole !== 'owner') {
    toast.add({ severity: 'warn', summary: 'Restricted', detail: 'Only an owner can change another admin\'s role.', life: 3000 });
    return;
  }
  const success = await iamStore.updateUserRole(user.id, newRole);
  if (success) {
    toast.add({ severity: 'success', summary: 'Updated', detail: `${user.name}'s role changed to ${newRole}.`, life: 3000 });
  }
};

const createUser = async () => {
  const userData = {
    name: newUser.value.name,
    email: newUser.value.email,
    password: newUser.value.password || 'viewer123',
    role: 'viewer',
    department: newUser.value.department || 'General',
    isActive: true,
    avatarColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
    lastLogin: 'Never'
  };
  try {
    const axios = (await import('axios')).default;
    await axios.post(`${import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || 'http://localhost:3000'}/users`, userData);
    await iamStore.fetchAllUsers();
    showDialog.value = false;
    newUser.value = { name: '', email: '', password: '', department: null };
    toast.add({ severity: 'success', summary: 'Created', detail: `User ${userData.name} created as viewer.`, life: 3000 });
  } catch (e) {
    console.error(e);
  }
};

const getRoleColor = (role) => {
  switch (role) {
    case 'owner': return { bg: '#FEF6E5', text: '#D97706' };
    case 'admin': return { bg: '#FEECEB', text: '#E02424' };
    case 'viewer': return { bg: '#F3F4F6', text: '#64748B' };
    default: return { bg: '#F3F4F6', text: '#64748B' };
  }
};
</script>

<style scoped>
.view-content {
  width: 100%;
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
  color: #6B7280;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.add-user-btn {
  background: #df7a36 !important;
  border-color: #df7a36 !important;
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
  color: #9CA3AF;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 3px solid transparent;
}

.tab-item:hover {
  color: #6B7280;
}

.tab-active {
  color: #4338CA;
  border-bottom-color: #4338CA;
}

.table-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 1px 12px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.user-avatar {
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

.role-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid #E5E7EB;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  transition: all 0.15s ease;
}

.edit-btn {
  color: #4338CA;
}

.edit-btn:hover {
  background: #4338CA;
  color: white;
  border-color: #4338CA;
}

.lock-btn {
  color: #D97706;
}

.lock-btn:hover {
  background: #D97706;
  color: white;
  border-color: #D97706;
}

.pagination-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-top: 1px solid #f3f3f3;
}

.pagination-info {
  font-size: 12px;
  font-weight: 600;
  color: #9CA3AF;
}

.pagination-count {
  color: #111827;
  font-weight: 800;
  margin-left: 4px;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}

.pagination-arrow {
  color: #9CA3AF;
  cursor: pointer;
  font-size: 14px;
  padding: 4px;
}

.page-num {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  color: #9CA3AF;
  cursor: pointer;
}

.page-active {
  background: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  color: #111827;
}

:deep(.filter-select) {
  min-width: 160px;
  border: 1px solid #E5E7EB !important;
  border-radius: 12px !important;
  background: white !important;
}

.viewer-notice {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #FEF3C7;
  border: 1px solid #F59E0B;
  border-radius: 8px;
  padding: 12px 16px;
  margin-top: 16px;
  font-size: 13px;
  color: #92400E;
}

.viewer-notice i {
  font-size: 16px;
  color: #D97706;
}

:deep(.role-select-sm) {
  min-width: 110px !important;
  max-width: 120px !important;
}

:deep(.role-select-sm .p-select-label) {
  font-size: 12px !important;
  padding: 4px 8px !important;
}
</style>
