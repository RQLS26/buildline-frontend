<template>
  <div class="flex h-screen overflow-hidden bg-gray-50">

    <aside v-if="!isIamRoute" class="w-16rem flex flex-column justify-content-between py-3 flex-shrink-0" style="background-color: #0a1f3c; color: #9ca3af;">

      <div class="overflow-y-auto">
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
            <router-link to="/suppliers/incidents" class="flex align-items-center gap-3 px-3 py-2 border-round-md text-gray-400 text-decoration-none transition-colors hover:text-white" active-class="active-menu-item font-medium">
              <i class="pi pi-exclamation-triangle text-base"></i>
              <span class="text-sm">{{ $t('option.incidents') }}</span>
            </router-link>
          </li>
          <li>
            <router-link to="/communication/messages" class="flex align-items-center gap-3 px-3 py-2 border-round-md text-gray-400 text-decoration-none transition-colors hover:text-white" active-class="active-menu-item font-medium">
              <i class="pi pi-comments text-base"></i>
              <span class="text-sm">{{ $t('option.communication') }}</span>
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

      <div>
        <div class="px-3 mb-3">
          <div @click="handleLogout" class="flex align-items-center gap-3 px-3 py-2 border-round-md text-white cursor-pointer transition-colors hover:bg-white-alpha-20" style="background-color: rgba(255, 255, 255, 0.08);">
            <i class="pi pi-sign-out text-base"></i>
            <span class="text-sm font-bold">Logout</span>
          </div>
        </div>

        <div class="px-3 pt-3 border-top-1 border-gray-800">
          <div class="flex align-items-center justify-content-between px-2 py-2 cursor-pointer border-round-md hover:bg-white-alpha-10 transition-colors">
            <div class="flex align-items-center gap-3">
              <img src="https://i.pravatar.cc/150?img=11" alt="Avatar" class="border-circle" style="width: 35px; height: 35px; object-fit: cover;" />
              <div class="flex flex-column">
                <span class="text-white font-medium text-sm">{{ iamStore.currentUser?.name || 'Usuario' }}</span>
                <span class="text-gray-500 capitalize" style="font-size: 0.75rem;">{{ iamStore.currentUser?.role || 'user' }}</span>
              </div>
            </div>
            <i class="pi pi-ellipsis-v text-gray-500 text-sm"></i>
          </div>
        </div>
      </div>
    </aside>

    <div class="flex-1 flex flex-column h-full overflow-hidden">

      <header v-if="!isIamRoute" class="h-5rem bg-white flex align-items-center justify-content-between px-5 z-1 flex-shrink-0" style="border: none !important; box-shadow: none !important; outline: none !important;">

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
              <pv-input-text v-model="globalSearch" @keyup.enter="executeSearch" placeholder="Search inventory..." class="w-full bg-gray-50 border-1 border-gray-200 border-round-3xl py-2 text-sm" />
            </pv-icon-field>
          </div>
          <i class="pi pi-bell text-gray-500 text-xl cursor-pointer hover:text-primary transition-colors"></i>
          <language-switcher />
        </div>
      </header>

      <main class="flex-1 overflow-y-auto flex flex-column" style="background-color: #f8fafc;">

        <div class="flex-grow-1 p-4 md:p-5">
          <router-view />
        </div>

        <footer v-if="!isIamRoute" class="w-full text-white pt-6 pb-4 px-5 md:px-8 mt-5" style="background-color: #555b61;">
          <div class="max-w-7xl mx-auto">
            <div class="grid">

              <div class="col-12 md:col-3 flex flex-column gap-4 mb-4 md:mb-0">
                <img src="/logo.png" alt="Buildline Logo" style="height: 40px; width: auto; filter: brightness(0) invert(1); object-fit: contain;" class="align-self-start" />
                <div class="flex gap-4 text-2xl mt-1">
                  <i class="pi pi-twitter cursor-pointer hover:text-gray-300 transition-colors"></i>
                  <i class="pi pi-instagram cursor-pointer hover:text-gray-300 transition-colors"></i>
                  <i class="pi pi-youtube cursor-pointer hover:text-gray-300 transition-colors"></i>
                  <i class="pi pi-linkedin cursor-pointer hover:text-gray-300 transition-colors"></i>
                </div>
              </div>

              <div class="col-12 md:col-3 flex flex-column gap-3">
                <span class="font-bold text-lg mb-1">Product</span>
                <a class="text-gray-300 hover:text-white cursor-pointer text-sm no-underline transition-colors">Templates</a>
                <a class="text-gray-300 hover:text-white cursor-pointer text-sm no-underline transition-colors">Guides</a>
                <a class="text-gray-300 hover:text-white cursor-pointer text-sm no-underline transition-colors">Inspiration</a>
                <a class="text-gray-300 hover:text-white cursor-pointer text-sm no-underline transition-colors">Product</a>
                <a class="text-gray-300 hover:text-white cursor-pointer text-sm no-underline transition-colors">Download the Mobile app</a>
                <a class="text-gray-300 hover:text-white cursor-pointer text-sm no-underline transition-colors">Download the Desktop app</a>
                <a class="text-gray-300 hover:text-white cursor-pointer text-sm no-underline transition-colors">Team collaboration</a>
              </div>

              <div class="col-12 md:col-3 flex flex-column gap-3">
                <span class="font-bold text-lg mb-1">Support</span>
                <a class="text-gray-300 hover:text-white cursor-pointer text-sm no-underline transition-colors">support@gmail.com</a>
                <a class="text-gray-300 hover:text-white cursor-pointer text-sm no-underline transition-colors">Help center</a>
                <a class="text-gray-300 hover:text-white cursor-pointer text-sm no-underline transition-colors">Plans & pricing</a>
                <a class="text-gray-300 hover:text-white cursor-pointer text-sm no-underline transition-colors">Upcoming features</a>
                <a class="text-gray-300 hover:text-white cursor-pointer text-sm no-underline transition-colors">Collaboration features</a>
                <a class="text-gray-300 hover:text-white cursor-pointer text-sm no-underline transition-colors">Release notes</a>
                <a class="text-gray-300 hover:text-white cursor-pointer text-sm no-underline transition-colors">Application status</a>
              </div>

              <div class="col-12 md:col-3 flex flex-column gap-3">
                <span class="font-bold text-lg mb-1">Resources</span>
                <a class="text-gray-300 hover:text-white cursor-pointer text-sm no-underline transition-colors">Blog</a>
                <a class="text-gray-300 hover:text-white cursor-pointer text-sm no-underline transition-colors">Careers</a>
                <a class="text-gray-300 hover:text-white cursor-pointer text-sm no-underline transition-colors">Social media</a>
                <a class="text-gray-300 hover:text-white cursor-pointer text-sm no-underline transition-colors">Resource library</a>
                <a class="text-gray-300 hover:text-white cursor-pointer text-sm no-underline transition-colors">Developers</a>
                <a class="text-gray-300 hover:text-white cursor-pointer text-sm no-underline transition-colors">Privacy policy</a>
                <a class="text-gray-300 hover:text-white cursor-pointer text-sm no-underline transition-colors">Terms of service</a>
              </div>

            </div>

            <div class="border-top-1 border-gray-500 mt-5 pt-4 flex flex-column align-items-center justify-content-center text-sm text-gray-300 gap-2">
              <span class="text-center">&copy; {{ new Date().getFullYear() }} Buildline Digital Construction & Logistics. Todos los derechos reservados.</span>
              <span class="text-center">
                <strong>Autores:</strong> Mauricio Castillo, David Morales, Jesús Paucar, Marlon Viza, Albino Cáceres.
              </span>
            </div>
          </div>
        </footer>

      </main>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import LanguageSwitcher from './language-switcher.vue';
import { useIamStore } from "@/iam/application/iam.store.js";

const route = useRoute();
const router = useRouter();
const iamStore = useIamStore();

const isIamRoute = computed(() => route.path.startsWith('/iam'));

const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
});

const globalSearch = ref('');

const executeSearch = () => {
  if (globalSearch.value.trim() !== '') {
    router.push('/inventory/list');
    globalSearch.value = '';
  }
};

const handleLogout = () => {
  iamStore.logout();
  router.push('/iam/sign-in');
};
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