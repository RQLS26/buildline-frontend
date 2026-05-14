<template>
  <div class="max-w-7xl mx-auto">

    <div class="mb-5">
      <h1 class="text-4xl text-gray-800 font-bold m-0 mb-2">Hello, {{ iamStore.currentUser?.name || 'Team' }}</h1>
      <p class="text-gray-500 m-0">{{ $t('home.subtitle') }}</p>
    </div>

    <div class="grid">

      <div class="col-12 lg:col-5">
        <pv-card class="shadow-2 border-round-2xl h-full border-none">
          <template #content>
            <div class="flex align-items-center gap-3 mb-4">
              <div class="bg-blue-100 text-blue-600 border-circle flex align-items-center justify-content-center" style="width: 50px; height: 50px;">
                <i class="pi pi-building text-2xl"></i>
              </div>
              <div>
                <h2 class="m-0 text-xl text-gray-800 font-bold">Constructora RQLS</h2>
                <span class="text-gray-500 text-sm">{{ $t('home.project_name') }}</span>
              </div>
            </div>

            <div class="flex flex-column gap-3">
              <div class="flex align-items-center gap-2 text-gray-700">
                <i class="pi pi-map-marker text-primary"></i>
                <span class="font-medium">{{ $t('home.location') }}:</span> Lima, Peru
              </div>
              <div class="flex align-items-center gap-2 text-gray-700">
                <i class="pi pi-wallet text-primary"></i>
                <span class="font-medium">{{ $t('home.budget') }}:</span> $ 500,000
              </div>
              <div class="flex align-items-center gap-2 text-gray-700">
                <i class="pi pi-calendar text-primary"></i>
                <span class="font-medium">{{ $t('home.start_date') }}:</span> 12/05/2026
              </div>
              <div class="flex align-items-center gap-2 text-gray-700">
                <i class="pi pi-info-circle text-primary"></i>
                <span class="font-medium">{{ $t('home.status') }}:</span>
                <pv-tag severity="success" :value="$t('home.in_progress')" rounded></pv-tag>
              </div>
            </div>

            <div class="mt-4 pt-4 border-top-1 border-gray-100">
              <div class="flex justify-content-between text-sm mb-2 font-medium">
                <span class="text-gray-600">{{ $t('home.progress') }}</span>
                <span class="text-primary">35%</span>
              </div>
              <div class="w-full bg-gray-200 border-round-xl h-1rem overflow-hidden">
                <div class="bg-primary h-full border-round-xl" style="width: 35%"></div>
              </div>
            </div>
          </template>
        </pv-card>
      </div>


      <div class="col-12 lg:col-7">
        <h3 class="text-xl text-gray-800 font-bold mt-0 mb-4">{{ $t('home.question') }}</h3>

        <div class="grid">
          <div class="col-12 md:col-6 lg:col-4" v-for="module in modules" :key="module.key">
            <div
                class="bg-white p-4 border-round-2xl shadow-1 hover:shadow-3 transition-all cursor-pointer flex flex-column align-items-center justify-content-center gap-3 h-full border-1 border-transparent hover:border-primary"
                @click="$router.push(module.route)">

              <div :class="`bg-${module.color}-100 text-${module.color}-600 border-circle flex align-items-center justify-content-center`" style="width: 60px; height: 60px;">
                <i :class="['pi', module.icon, 'text-3xl']"></i>
              </div>
              <span class="font-bold text-gray-800">{{ $t(`option.${module.key}`) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useIamStore} from "@/iam/application/iam.store.js";

const iamStore = useIamStore();

const modules = ref([
  { key: 'requisition', icon: 'pi-box', color: 'blue', route: '/requisition/new' },
  { key: 'procurement', icon: 'pi-shopping-cart', color: 'teal', route: '/procurement/inbox' },
  { key: 'inventory', icon: 'pi-clone', color: 'orange', route: '/inventory/list' },
  { key: 'suppliers', icon: 'pi-users', color: 'indigo', route: '/suppliers/directory' },
  { key: 'analytics', icon: 'pi-chart-bar', color: 'purple', route: '/analytics-budgeting/dashboard' },
  { key: 'communication', icon: 'pi-comments', color: 'green', route: '/communication/messages' }
]);
</script>