<template>
  <div class="flex h-screen overflow-hidden bg-gray-50">

    <aside class="w-16rem flex flex-column justify-content-between py-3 flex-shrink-0" style="background-color: #0a1f3c; color: #9ca3af;">

      <div>
        <div class="flex justify-content-center mb-4 px-3 pt-2 cursor-pointer" @click="$router.push('/home')">
          <img src="/logo.png" alt="Buildline Logo" style="width: auto; height: 38px;" />
        </div>

        <ul class="list-none p-0 m-0 flex flex-column gap-1 px-3">
          <li>
            <router-link to="/home" class="flex align-items-center gap-3 px-3 py-2 border-round-md text-gray-400 text-decoration-none transition-colors hover:text-white" active-class="active-menu-item font-medium">
              <i class="pi pi-th-large text-base"></i>
              <span class="text-sm">{{ $t('option.home') }}</span>
            </router-link>
          </li>
          <li>
            <router-link to="/procurement/quotations" class="flex align-items-center gap-3 px-3 py-2 border-round-md text-gray-400 text-decoration-none transition-colors hover:text-white" active-class="active-menu-item font-medium">
              <i class="pi pi-file text-base"></i>
              <span class="text-sm">{{ $t('option.quotations') }}</span>
            </router-link>
          </li>
          <li>
            <router-link to="/procurement/inbox" class="flex align-items-center gap-3 px-3 py-2 border-round-md text-gray-400 text-decoration-none transition-colors hover:text-white" active-class="active-menu-item font-medium">
              <i class="pi pi-dollar text-base"></i>
              <span class="text-sm">{{ $t('option.purchase_orders') }}</span>
            </router-link>
          </li>
          <li>
            <router-link to="/delivery" class="flex align-items-center gap-3 px-3 py-2 border-round-md text-gray-400 text-decoration-none transition-colors hover:text-white" active-class="active-menu-item font-medium">
              <i class="pi pi-truck text-base"></i>
              <span class="text-sm">{{ $t('option.delivery') }}</span>
            </router-link>
          </li>
          <li>
            <router-link to="/inventory/list" class="flex align-items-center gap-3 px-3 py-2 border-round-md text-gray-400 text-decoration-none transition-colors hover:text-white" active-class="active-menu-item font-medium">
              <i class="pi pi-box text-base"></i>
              <span class="text-sm">{{ $t('option.inventory') }}</span>
            </router-link>
          </li>
          <li>
            <router-link to="/suppliers/directory" class="flex align-items-center gap-3 px-3 py-2 border-round-md text-gray-400 text-decoration-none transition-colors hover:text-white" active-class="active-menu-item font-medium">
              <i class="pi pi-users text-base"></i>
              <span class="text-sm">{{ $t('option.suppliers') }}</span>
            </router-link>
          </li>
          <li>
            <router-link to="/incidents" class="flex align-items-center gap-3 px-3 py-2 border-round-md text-gray-400 text-decoration-none transition-colors hover:text-white" active-class="active-menu-item font-medium">
              <i class="pi pi-exclamation-triangle text-base"></i>
              <span class="text-sm">{{ $t('option.incidents') }}</span>
            </router-link>
          </li>
          <li>
            <router-link to="/budget" class="flex align-items-center gap-3 px-3 py-2 border-round-md text-gray-400 text-decoration-none transition-colors hover:text-white" active-class="active-menu-item font-medium">
              <i class="pi pi-chart-line text-base"></i>
              <span class="text-sm">{{ $t('option.budget') }}</span>
            </router-link>
          </li>
          <li>
            <router-link to="/reports" class="flex align-items-center gap-3 px-3 py-2 border-round-md text-gray-400 text-decoration-none transition-colors hover:text-white" active-class="active-menu-item font-medium">
              <i class="pi pi-file-excel text-base"></i>
              <span class="text-sm">{{ $t('option.reports') }}</span>
            </router-link>
          </li>
          <li>
            <router-link to="/profiles/company" class="flex align-items-center gap-3 px-3 py-2 border-round-md text-gray-400 text-decoration-none transition-colors hover:text-white" active-class="active-menu-item font-medium">
              <i class="pi pi-id-card text-base"></i>
              <span class="text-sm">{{ $t('option.users') }}</span>
            </router-link>
          </li>
          <li>
            <router-link to="/settings" class="flex align-items-center gap-3 px-3 py-2 border-round-md text-gray-400 text-decoration-none transition-colors hover:text-white" active-class="active-menu-item font-medium">
              <i class="pi pi-cog text-base"></i>
              <span class="text-sm">{{ $t('option.settings') }}</span>
            </router-link>
          </li>
        </ul>
      </div>

      <div class="px-3 mt-2 pt-3 border-top-1 border-gray-800">
        <div class="flex align-items-center justify-content-between px-2 py-2 cursor-pointer border-round-md hover:bg-white-alpha-10 transition-colors">
          <div class="flex align-items-center gap-3">
            <img src="https://i.pravatar.cc/150?img=11" alt="Avatar" class="border-circle" style="width: 35px; height: 35px; object-fit: cover;" />
            <div class="flex flex-column">
              <span class="text-white font-medium text-sm">Equipo Buildline</span>
              <span class="text-gray-500" style="font-size: 0.75rem;">Superadmin</span>
            </div>
          </div>
          <i class="pi pi-ellipsis-v text-gray-500 text-sm"></i>
        </div>
      </div>
    </aside>

    <div class="flex-1 flex flex-column h-full overflow-hidden">

      <header class="h-5rem bg-white flex align-items-center justify-content-between px-5 z-1 flex-shrink-0" style="border: none !important; box-shadow: none !important; outline: none !important;">

        <div class="flex align-items-center gap-3">
          <span class="text-gray-900 font-bold text-xl">
            {{ $route.path.includes('inventory') ? $t('inventory.title') : ($route.meta.title || 'Dashboard') }}
          </span>
          <span class="text-gray-400 text-sm font-medium flex align-items-center gap-2">
            <i class="pi pi-angle-double-right" style="font-size: 0.8rem"></i>
            {{ currentDate }}
          </span>
        </div>

        <div class="flex align-items-center gap-4">
          <div class="w-18rem mr-2">
            <pv-icon-field iconPosition="left">
              <pv-input-icon class="pi pi-search text-gray-400" />
              <pv-input-text placeholder="Search here..." class="w-full bg-gray-50 border-1 border-gray-200 border-round-3xl py-2 text-sm" />
            </pv-icon-field>
          </div>
          <i class="pi pi-bell text-gray-500 text-xl cursor-pointer hover:text-primary transition-colors"></i>
          <language-switcher />
        </div>
      </header>

      <main class="flex-1 overflow-y-auto p-4 md:p-5 flex flex-column" style="background-color: #f8fafc;">
        <div class="flex-grow-1">
          <router-view />
        </div>

        <footer class="mt-5 pt-4 pb-2 border-top-1 border-gray-200 text-center text-gray-500 text-sm">
          &copy; {{ new Date().getFullYear() }} Buildline Digital Construction & Logistics. Todos los derechos reservados.
        </footer>
      </main>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import LanguageSwitcher from './language-switcher.vue';

const route = useRoute();

const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
});
</script>

<style>
a, .router-link-active, .router-link-exact-active {
  text-decoration: none !important;
}

header {
  border-bottom: 0px solid transparent !important;
  box-shadow: none !important;
}
</style>

<style scoped>
.active-menu-item {
  background-color: #f97316 !important;
  color: white !important;
  box-shadow: 0 4px 6px -1px rgba(249, 115, 22, 0.4);
}
</style>