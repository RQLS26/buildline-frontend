<template>
  <div class="flex h-screen overflow-hidden bg-gray-50">
    
    <!-- Sidebar Ultra-Curva Premium -->
    <aside v-if="!isIamRoute" class="sidebar-container shadow-4">
      <div class="flex flex-column gap-5">
        <div class="px-4 pt-4 pb-2 flex justify-content-center">
          <img src="/buildline-logo.png" alt="Buildline" class="w-9 h-auto" />
        </div>

        <nav class="flex flex-column gap-1">
          <router-link v-for="item in visibleMenuItems" :key="item.to" :to="item.to" 
                       class="menu-item" active-class="active">
            <i :class="item.icon"></i>
            <span class="text-sm font-semibold">{{ $t(item.labelKey) }}</span>
          </router-link>
        </nav>
      </div>

      <div class="mt-auto pb-4">
        <div @click="handleLogout" class="logout-box mb-4">
          <i class="pi pi-sign-out"></i>
          <span class="text-sm font-bold">{{ $t('option.logout') }}</span>
        </div>

        <div class="px-4">
            <div class="user-profile flex align-items-center justify-content-between p-3 border-round-md bg-white-alpha-5 cursor-pointer hover:bg-white-alpha-10 transition-colors"
                 @click="$router.push('/profiles/company')">
              <div class="flex align-items-center gap-3">
                <div class="user-avatar-sidebar" :style="{ background: iamStore.userAvatarColor }">
                  {{ iamStore.userName.split(' ').map(n => n[0]).join('') }}
                </div>
                <div class="flex flex-column">
                  <span class="text-white font-bold text-sm">{{ iamStore.userName }}</span>
                  <span class="text-gray-400 font-medium" style="font-size: 0.65rem;">{{ iamStore.userRole }}</span>
                </div>
              </div>
              <i class="pi pi-ellipsis-v text-gray-500 text-xs"></i>
            </div>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-column h-full overflow-hidden">
      
      <!-- Top Bar -->
      <header v-if="!isIamRoute" class="layout-header flex align-items-center justify-content-between px-6 py-4 bg-transparent">
        <div class="flex align-items-center gap-3">
          <h1 class="text-2xl font-black text-900 m-0" style="letter-spacing: -0.02em;">{{ pageTitle }}</h1>
          <div class="flex align-items-center gap-2 text-gray-400 font-bold mt-1" style="font-size: 0.9rem;">
            <i class="pi pi-angle-double-right text-xs"></i>
            <span>{{ todayDate }}</span>
          </div>
        </div>

        <div class="flex align-items-center gap-5">
          <!-- Notifications with badge -->
          <div class="cursor-pointer text-gray-500 hover:text-900 transition-colors relative" @click="router.push('/communication/messages')">
            <i class="pi pi-bell text-2xl"></i>
            <span v-if="unreadCount > 0" class="notif-badge">{{ unreadCount }}</span>
          </div>

          <!-- Search -->
          <div class="hidden md:block">
            <div class="p-inputgroup border-round-xl overflow-hidden bg-white border-1 border-gray-100 shadow-sm" style="height: 48px;">
                <pv-input-text :placeholder="$t('common.search_placeholder')" class="border-none bg-transparent px-4 w-24rem text-sm font-medium" />
                <span class="p-inputgroup-addon bg-transparent border-none px-3">
                    <i class="pi pi-search text-gray-400"></i>
                </span>
            </div>
          </div>

          <!-- Language Switcher -->
          <div class="language-container pl-2">
            <language-switcher />
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto px-6 pb-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useIamStore } from '../../../iam/application/iam.store.js';
import { useCommunicationStore } from '../../../communication/application/communication.store.js';
import LanguageSwitcher from './language-switcher.vue';

const route = useRoute();
const router = useRouter();
const iamStore = useIamStore();
const communicationStore = useCommunicationStore();
const { locale, t } = useI18n();

const isIamRoute = computed(() => route.path.startsWith('/iam'));

const routeTitleKeys = {
  'home': 'option.home',
  'quotations-management': 'option.quotations',
  'approval-inbox': 'option.purchase_orders',
  'purchase-orders': 'option.purchase_orders',
  'delivery-tracking': 'option.delivery',
  'inventory-list': 'option.inventory',
  'supplier-directory': 'option.suppliers',
  'incidents-list': 'option.incidents',
  'financial-dashboard': 'option.budget',
  'reports': 'option.reports',
  'users-management': 'option.users',
  'messages-inbox': 'option.notifications',
  'settings': 'option.settings',
  'company-profile': 'company-profile.title'
};

const pageTitle = computed(() => {
  const key = routeTitleKeys[route.name];
  return key ? t(key) : route.meta.title || t('option.home');
});

const todayDate = computed(() => {
  return new Date().toLocaleDateString(locale.value === 'es' ? 'es-PE' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' });
});

const unreadCount = computed(() => communicationStore.unreadCount);

onMounted(async () => {
  if (iamStore.isAuthenticated) {
    await communicationStore.fetchMessages();
  }
});

const menuItems = [
  { to: '/home', icon: 'pi pi-microsoft', labelKey: 'option.home' },
  { to: '/procurement/quotations', icon: 'pi pi-file-edit', labelKey: 'option.quotations' },
  { to: '/procurement/purchase-orders', icon: 'pi pi-wallet', labelKey: 'option.purchase_orders' },
  { to: '/delivery', icon: 'pi pi-truck', labelKey: 'option.delivery' },
  { to: '/inventory/list', icon: 'pi pi-box', labelKey: 'option.inventory' },
  { to: '/suppliers/directory', icon: 'pi pi-users', labelKey: 'option.suppliers' },
  { to: '/suppliers/incidents', icon: 'pi pi-exclamation-triangle', labelKey: 'option.incidents' },
  { to: '/budget', icon: 'pi pi-dollar', labelKey: 'option.budget' },
  { to: '/reports', icon: 'pi pi-chart-bar', labelKey: 'option.reports' },
  { to: '/users', icon: 'pi pi-user-plus', labelKey: 'option.users', adminOnly: true },
  { to: '/communication/messages', icon: 'pi pi-comments', labelKey: 'option.notifications' },
  { to: '/settings', icon: 'pi pi-cog', labelKey: 'option.settings' }
];

// Filter menu items based on user role
const visibleMenuItems = computed(() => {
  return menuItems.filter(item => {
    if (item.adminOnly && !iamStore.isAdmin) return false;
    return true;
  });
});

const handleLogout = () => {
  iamStore.logout();
  router.push('/iam/sign-in');
};
</script>

<style scoped>
.sidebar-container {
    background-color: #0b1727;
    width: 300px;
    height: calc(100vh - 22px);
    margin: 10px;
    border-radius: 16px;
    padding: 1rem 0;
    display: flex;
    flex-direction: column;
    border: none;
}

.menu-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.8rem 1.2rem;
    color: #94A3B8;
    text-decoration: none;
    border-radius: 8px;
    transition: all 0.2s ease;
    margin: 0 1rem;
    box-shadow: none;
}

.menu-item:hover {
    color: white;
    background-color: rgba(255, 255, 255, 0.05);
}

.menu-item.active {
    background-color: #df7a36;
    color: white;
    box-shadow: none;
}

.logout-box {
    background-color: #1a2839;
    margin: 0 1rem;
    padding: 0.8rem 1.2rem;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 1rem;
    color: #94A3B8;
    cursor: pointer;
    transition: all 0.2s ease;
}

.logout-box:hover {
    background-color: #24354a;
    color: white;
}

.icon-container {
    opacity: 0.8;
}

.active .icon-container {
    opacity: 1;
}

:deep(.p-inputgroup-addon) {
    border-left: none !important;
}

:deep(.p-inputtext:focus) {
    box-shadow: none !important;
}

.shadow-inner {
    box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.02);
}

.user-avatar-sidebar {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    font-size: 14px;
    flex-shrink: 0;
}

.notif-badge {
    position: absolute;
    top: -4px;
    right: -6px;
    background: #F96116;
    color: white;
    font-size: 10px;
    font-weight: 800;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #f4f5f7;
}

@media print {
    .sidebar-container {
        display: none !important;
        width: 0 !important;
    }
    .layout-header {
        display: none !important;
    }
}
</style>
