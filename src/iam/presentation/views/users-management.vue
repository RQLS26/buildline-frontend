<template>
  <div class="view-content">

    <!-- Action Row -->
    <div class="action-row">
      <div class="filter-group">
        <label class="filter-label">{{ $t('users.role') }}</label>
        <pv-select v-model="filters.role" :options="roleFilterOptions" :placeholder="$t('users.all_roles')" class="filter-select" />
      </div>
      <div class="filter-group">
        <label class="filter-label">{{ $t('users.status') }}</label>
        <pv-select v-model="filters.status" :options="statusFilterOptions" optionLabel="label" optionValue="value" :placeholder="$t('common.all')" class="filter-select" />
      </div>
      <div class="ml-auto">
        <pv-button :label="$t('users.add_user')" icon="pi pi-user-plus" class="add-user-btn" @click="showDialog = true" />
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
        <pv-column field="name" :header="$t('users.user')">
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
        <pv-column field="role" :header="$t('users.role')">
          <template #body="slotProps">
            <span class="role-badge" :style="{ background: getRoleColor(slotProps.data.role).bg, color: getRoleColor(slotProps.data.role).text }">
              {{ slotProps.data.role }}
            </span>
          </template>
        </pv-column>
        <pv-column field="department" :header="$t('users.department')"></pv-column>
        <pv-column field="lastLogin" :header="$t('users.last_login')"></pv-column>
        <pv-column :header="$t('users.status')">
          <template #body="slotProps">
            <span :class="['status-badge', slotProps.data.isActive ? 'status-approved' : 'status-rejected']">
              {{ getMembershipLabel(slotProps.data) }}
            </span>
          </template>
        </pv-column>
        <pv-column :header="$t('users.actions')">
          <template #body="slotProps">
            <div class="flex gap-2 align-items-center">
              <pv-select v-if="getAssignableRoles(slotProps.data).length > 0"
                :modelValue="getAssignableRoles(slotProps.data).includes(slotProps.data.role) ? slotProps.data.role : null"
                @update:modelValue="(val) => changeRole(slotProps.data, val)"
                :options="getAssignableRoles(slotProps.data)"
                :placeholder="$t('users.change_role')"
                class="role-select-sm" />
              <button
                v-if="canReviewMembership(slotProps.data)"
                type="button"
                class="status-action-btn activate"
                :title="$t('users.accept_invitation')"
                @click="reviewMembership(slotProps.data, 'active')"
              >
                <i class="pi pi-check"></i>
              </button>
              <button
                v-if="canReviewMembership(slotProps.data)"
                type="button"
                class="status-action-btn deactivate"
                :title="$t('users.reject_invitation')"
                @click="reviewMembership(slotProps.data, 'rejected')"
              >
                <i class="pi pi-times"></i>
              </button>
              <button
                v-if="canManageStatus(slotProps.data)"
                type="button"
                :class="['status-action-btn', slotProps.data.isActive ? 'deactivate' : 'activate']"
                :title="slotProps.data.isActive ? $t('users.deactivate_user') : $t('users.activate_user')"
                @click="toggleUserStatus(slotProps.data)"
              >
                <i :class="['pi', slotProps.data.isActive ? 'pi-user-minus' : 'pi-user-plus']"></i>
              </button>
              <span v-if="getAssignableRoles(slotProps.data).length === 0 && !canManageStatus(slotProps.data)" class="text-xs" style="color: #9CA3AF;">
                <i class="pi pi-lock"></i>
              </span>
            </div>
          </template>
        </pv-column>
        <template #empty>
          <div class="tenant-empty-state">{{ $t('common.company_empty_data') }}</div>
        </template>
      </pv-data-table>

      <!-- Pagination -->
      <div class="pagination-row">
        <div class="pagination-info">
          {{ $t('users.items_per_page') }}:
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
    <pv-dialog v-model:visible="showDialog" modal :header="$t('users.add_new_user')" :style="{ width: '480px' }">
      <div class="flex flex-column gap-4 pt-2">
        <div class="flex flex-column gap-2">
          <label class="filter-label">{{ $t('iam.full_name') }}</label>
          <pv-input-text v-model="newUser.name" placeholder="Enter full name" class="w-full" />
        </div>
        <div class="flex flex-column gap-2">
          <label class="filter-label">{{ $t('users.email') }}</label>
          <pv-input-text v-model="newUser.email" placeholder="user@buildline.com" class="w-full" />
        </div>
        <div class="flex flex-column gap-2">
          <label class="filter-label">{{ $t('iam.password') }}</label>
          <pv-input-text v-model="newUser.password" type="password" placeholder="Set password" class="w-full" />
        </div>
        <div class="flex flex-column gap-2">
          <label class="filter-label">{{ $t('users.role') }}</label>
          <pv-select v-model="newUser.role" :options="newUserRoleOptions" :placeholder="$t('users.select_role')" class="w-full" />
        </div>
        <div class="flex flex-column gap-2">
          <label class="filter-label">{{ $t('users.department') }}</label>
          <pv-select v-model="newUser.department" :options="departments" :placeholder="$t('users.select_department')" class="w-full" />
        </div>
      </div>
      <template #footer>
        <pv-button :label="$t('common.cancel')" class="p-button-text" @click="showDialog = false" />
        <pv-button :label="$t('users.create_user')" icon="pi pi-check" class="add-user-btn" @click="createUser" />
      </template>
    </pv-dialog>

    <!-- Access Denied Message for Viewers -->
    <div v-if="!iamStore.isAdmin" class="viewer-notice">
      <i class="pi pi-info-circle"></i>
      <span>{{ $t('users.admin_only') }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import { useIamStore } from '../../application/iam.store.js';

const toast = useToast();
const { t } = useI18n();
const iamStore = useIamStore();
const showDialog = ref(false);
const activeTab = ref('All');
const filters = ref({ role: null, status: null });
const newUser = ref({ name: '', email: '', password: '', role: null, department: null });
const roleCatalog = ['owner', 'admin', 'viewer'];
const mutableRoleCatalog = ['admin', 'viewer'];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const roleFilterOptions = computed(() => roleCatalog);
const newUserRoleOptions = computed(() => mutableRoleCatalog);
const statusFilterOptions = computed(() => [
  { label: t('common.active'), value: 'Active' },
  { label: t('common.inactive'), value: 'Inactive' },
  { label: t('users.pending_membership'), value: 'Pending' },
  { label: t('users.rejected_membership'), value: 'Rejected' }
]);
const displayedUsers = computed(() => {
  const users = [...(iamStore.allUsers || [])];
  const currentUser = iamStore.currentUser;
  if (!currentUser) return users;
  const hasCurrentUser = users.some(user => String(user.id) === String(currentUser.id) || user.email === currentUser.email);
  if (hasCurrentUser) return users;
  return [{
    ...currentUser,
    isActive: currentUser.isActive ?? true,
    membershipStatus: currentUser.membershipStatus || 'active',
    avatarColor: currentUser.avatarColor || getAvatarColor(currentUser.email),
    department: currentUser.department || 'Management',
    lastLogin: currentUser.lastLogin || 'Today'
  }, ...users];
});
const departments = computed(() => [...new Set(displayedUsers.value.map(user => user.department).filter(Boolean))]);

onMounted(() => {
  iamStore.fetchAllUsers();
});

const tabs = computed(() => {
  const users = displayedUsers.value;
  const owners = users.filter(u => u.role === 'owner').length;
  const admins = users.filter(u => u.role === 'admin').length;
  const viewers = users.filter(u => u.role === 'viewer').length;
  return [
    { name: 'All', label: `${t('common.all')} (${users.length})` },
    { name: 'owner', label: `${t('users.owners')} (${owners})` },
    { name: 'admin', label: `${t('users.admins')} (${admins})` },
    { name: 'viewer', label: `${t('users.viewers')} (${viewers})` }
  ];
});

const filteredUsers = computed(() => {
  return displayedUsers.value.filter(u => {
    if (activeTab.value !== 'All' && u.role !== activeTab.value) return false;
    if (filters.value.role && u.role !== filters.value.role) return false;
    if (filters.value.status) {
      const isActive = filters.value.status === 'Active';
      if (filters.value.status === 'Pending' && u.membershipStatus !== 'pending') return false;
      else if (filters.value.status === 'Rejected' && u.membershipStatus !== 'rejected') return false;
      else if ((filters.value.status === 'Active' || filters.value.status === 'Inactive') && u.isActive !== isActive) return false;
    }
    return true;
  });
});

const canManageStatus = (user) => {
  return iamStore.currentUser?.role === 'owner' && String(user.id) !== String(iamStore.currentUser?.id) && user.role !== 'owner' && user.membershipStatus !== 'pending';
};

const getAssignableRoles = (user) => {
  if (!canManageStatus(user)) return [];
  return mutableRoleCatalog.filter(role => role !== user.role);
};

const canReviewMembership = (user) => {
  return iamStore.currentUser?.role === 'owner' && String(user.id) !== String(iamStore.currentUser?.id) && user.membershipStatus === 'pending';
};

const getMembershipLabel = (user) => {
  if (user.membershipStatus === 'pending') return t('users.pending_membership');
  if (user.membershipStatus === 'rejected') return t('users.rejected_membership');
  return user.isActive ? t('common.active') : t('common.inactive');
};

const reviewMembership = async (user, membershipStatus) => {
  const success = await iamStore.updateUserMembership(user.id, membershipStatus);
  if (success) {
    toast.add({
      severity: membershipStatus === 'active' ? 'success' : 'warn',
      summary: t('common.success'),
      detail: t(membershipStatus === 'active' ? 'users.invitation_accepted' : 'users.invitation_rejected', { name: user.name }),
      life: 3000
    });
  }
};

const toggleUserStatus = async (user) => {
  const success = await iamStore.updateUserStatus(user.id, !user.isActive);
  if (success) {
    toast.add({
      severity: 'success',
      summary: t('common.success'),
      detail: t(user.isActive ? 'users.user_deactivated' : 'users.user_activated', { name: user.name }),
      life: 3000
    });
  }
};

const changeRole = async (user, newRole) => {
  if (!newRole || !getAssignableRoles(user).includes(newRole)) {
    toast.add({ severity: 'warn', summary: t('common.warning'), detail: t('users.owner_not_assignable'), life: 3000 });
    return;
  }
  const success = await iamStore.updateUserRole(user.id, newRole);
  if (success) {
    toast.add({ severity: 'success', summary: t('common.success'), detail: t('users.role_changed', { name: user.name, role: newRole }), life: 3000 });
  }
};

const createUser = async () => {
  if (!newUser.value.name || !newUser.value.email || !newUser.value.password || !newUser.value.role || !newUser.value.department) {
    toast.add({ severity: 'warn', summary: t('common.warning'), detail: t('users.required_fields'), life: 3000 });
    return;
  }
  if (!mutableRoleCatalog.includes(newUser.value.role)) {
    toast.add({ severity: 'warn', summary: t('common.warning'), detail: t('users.owner_not_assignable'), life: 3000 });
    return;
  }
  const userData = {
    name: newUser.value.name,
    email: newUser.value.email,
    password: newUser.value.password,
    role: newUser.value.role,
    department: newUser.value.department,
    isActive: true,
    avatarColor: getAvatarColor(newUser.value.email),
    companyId: iamStore.currentUser?.companyId,
    membershipStatus: 'active'
  };
  try {
    const success = await iamStore.createUser(userData);
    if (success) {
      showDialog.value = false;
      newUser.value = { name: '', email: '', password: '', role: null, department: null };
      toast.add({ severity: 'success', summary: t('common.success'), detail: t('users.user_created', { name: userData.name, role: userData.role }), life: 3000 });
    }
  } catch (e) {
    console.error(e);
  }
};

const getAvatarColor = (seed) => {
  const palette = ['#3d63a1', '#F96116', '#3D9F7D', '#64748B', '#E02424', '#7C3AED'];
  const index = String(seed || '').split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % palette.length;
  return palette[index];
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

.tenant-empty-state {
  padding: 40px 24px;
  color: #94A3B8;
  font-size: 13px;
  font-weight: 700;
  text-align: center;
}
</style>
