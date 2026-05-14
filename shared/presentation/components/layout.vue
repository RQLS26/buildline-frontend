<template>
  <div class="flex h-screen overflow-hidden bg-gray-50">

    <aside class="w-16rem flex flex-column justify-content-between pb-3" style="background-color: #111827; color: #9ca3af;">

      <div class="flex-1 overflow-y-auto">
        <div class="flex justify-content-center mb-4 px-4 pt-4 cursor-pointer" @click="$router.push('/home')">
          <img src="/logo.png" alt="Buildline Logo" style="width: 100%; max-width: 180px; height: auto;" />
        </div>

        <ul class="list-none p-0 m-0 flex flex-column px-2 gap-1">
          <li>
            <router-link to="/home" class="flex align-items-center gap-3 px-3 py-3 border-round-md text-gray-400 text-decoration-none transition-colors hover:text-white" active-class="bg-orange-500 text-white shadow-2 font-medium">
              <i class="pi pi-th-large text-lg"></i>
              <span>{{ $t('option.home') }}</span>
            </router-link>
          </li>
          <li>
            <router-link to="/requisition/requests" class="flex align-items-center gap-3 px-3 py-3 border-round-md text-gray-400 text-decoration-none transition-colors hover:text-white" active-class="bg-orange-500 text-white shadow-2 font-medium">
              <i class="pi pi-file text-lg"></i>
              <span>{{ $t('option.quotations') }}</span>
            </router-link>
          </li>
          <li>
            <router-link to="/procurement/inbox" class="flex align-items-center gap-3 px-3 py-3 border-round-md text-gray-400 text-decoration-none transition-colors hover:text-white" active-class="bg-orange-500 text-white shadow-2 font-medium">
              <i class="pi pi-dollar text-lg"></i>
              <span>{{ $t('option.purchase_orders') }}</span>
            </router-link>
          </li>
          <li>
            <router-link to="/delivery" class="flex align-items-center gap-3 px-3 py-3 border-round-md text-gray-400 text-decoration-none transition-colors hover:text-white" active-class="bg-orange-500 text-white shadow-2 font-medium">
              <i class="pi pi-truck text-lg"></i>
              <span>{{ $t('option.delivery') }}</span>
            </router-link>
          </li>
          <li>
            <router-link to="/inventory/list" class="flex align-items-center gap-3 px-3 py-3 border-round-md text-gray-400 text-decoration-none transition-colors hover:text-white" active-class="bg-orange-500 text-white shadow-2 font-medium">
              <i class="pi pi-box text-lg"></i>
              <span>{{ $t('option.inventory') }}</span>
            </router-link>
          </li>
          <li>
            <router-link to="/suppliers/directory" class="flex align-items-center gap-3 px-3 py-3 border-round-md text-gray-400 text-decoration-none transition-colors hover:text-white" active-class="bg-orange-500 text-white shadow-2 font-medium">
              <i class="pi pi-users text-lg"></i>
              <span>{{ $t('option.suppliers') }}</span>
            </router-link>
          </li>
          <li>
            <router-link to="/incidents" class="flex align-items-center gap-3 px-3 py-3 border-round-md text-gray-400 text-decoration-none transition-colors hover:text-white" active-class="bg-orange-500 text-white shadow-2 font-medium">
              <i class="pi pi-exclamation-triangle text-lg"></i>
              <span>{{ $t('option.incidents') }}</span>
            </router-link>
          </li>
          <li>
            <router-link to="/budget" class="flex align-items-center gap-3 px-3 py-3 border-round-md text-gray-400 text-decoration-none transition-colors hover:text-white" active-class="bg-orange-500 text-white shadow-2 font-medium">
              <i class="pi pi-chart-line text-lg"></i>
              <span>{{ $t('option.budget') }}</span>
            </router-link>
          </li>
          <li>
            <router-link to="/reports" class="flex align-items-center gap-3 px-3 py-3 border-round-md text-gray-400 text-decoration-none transition-colors hover:text-white" active-class="bg-orange-500 text-white shadow-2 font-medium">
              <i class="pi pi-file-excel text-lg"></i>
              <span>{{ $t('option.reports') }}</span>
            </router-link>
          </li>
          <li>
            <router-link to="/profiles/company" class="flex align-items-center gap-3 px-3 py-3 border-round-md text-gray-400 text-decoration-none transition-colors hover:text-white" active-class="bg-orange-500 text-white shadow-2 font-medium">
              <i class="pi pi-id-card text-lg"></i>
              <span>{{ $t('option.users') }}</span>
            </router-link>
          </li>
          <li>
            <router-link to="/settings" class="flex align-items-center gap-3 px-3 py-3 border-round-md text-gray-400 text-decoration-none transition-colors hover:text-white" active-class="bg-orange-500 text-white shadow-2 font-medium">
              <i class="pi pi-cog text-lg"></i>
              <span>{{ $t('option.settings') }}</span>
            </router-link>
          </li>
        </ul>
      </div>

      <div class="px-2 mt-2">
        <ul class="list-none p-0 m-0 mb-3">
          <li>
            <router-link to="/iam/sign-in" class="flex align-items-center gap-3 px-3 py-3 border-round-md text-gray-400 text-decoration-none transition-colors hover:bg-white-alpha-10 hover:text-white">
              <i class="pi pi-sign-out text-lg"></i>
              <span class="font-medium">{{ $t('option.logout') }}</span>
            </router-link>
          </li>
        </ul>

        <div class="flex align-items-center justify-content-between px-3 py-2 cursor-pointer border-round-md hover:bg-white-alpha-10 transition-colors">
          <div class="flex align-items-center gap-2">
            <img src="https://i.pravatar.cc/150?img=11" alt="Avatar" class="border-circle" style="width: 35px; height: 35px; object-fit: cover;" />
            <div class="flex flex-column">
              <span class="text-white font-medium text-sm">Equipo Buildline</span>
              <span class="text-gray-500" style="font-size: 0.75rem;">{{ $t('option.view_profile') }}</span>
            </div>
          </div>
          <i class="pi pi-ellipsis-v text-gray-500"></i>
        </div>
      </div>
    </aside>

    <div class="flex-1 flex flex-column h-full">

      <header class="h-5rem bg-white border-bottom-1 border-gray-200 flex align-items-center justify-content-between px-5 z-1">

        <div class="flex align-items-center gap-3">
        </div>

        <div class="flex align-items-center gap-4">
          <div class="w-20rem mr-3">
            <pv-icon-field iconPosition="left">
              <pv-input-icon class="pi pi-search text-gray-400" />
              <pv-input-text placeholder="Search here..." class="w-full bg-gray-50 border-1 border-gray-200 border-round-3xl" />
            </pv-icon-field>
          </div>

          <i class="pi pi-bell text-gray-500 text-xl cursor-pointer hover:text-primary transition-colors"></i>
          <language-switcher />
        </div>
      </header>

      <main class="flex-1 overflow-y-auto p-5" style="background-color: #f1f5f9;">
        <router-view />
      </main>

    </div>
  </div>
</template>

<script setup>
import LanguageSwitcher from './language-switcher.vue';
</script>