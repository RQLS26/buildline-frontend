<template>
  <div class="max-w-7xl mx-auto pb-5">

    <div class="mb-5">
      <h1 class="text-4xl text-gray-800 font-bold m-0 mb-2">Hello, {{ iamStore.currentUser?.name || 'Team' }}</h1>
      <p class="text-gray-500 m-0">Manage your company profile and view your assigned projects.</p>
    </div>

    <div class="mb-5">
      <h3 class="text-xl text-gray-800 font-bold mt-0 mb-3">Your Projects</h3>

      <div class="flex gap-4 overflow-x-auto pb-3">
        <div v-for="project in projects" :key="project.id" style="min-width: 320px; max-width: 350px;">
          <pv-card class="shadow-2 border-round-2xl h-full border-none cursor-pointer hover:shadow-4 transition-all border-1 border-transparent hover:border-primary">
            <template #content>
              <div class="flex align-items-center gap-3 mb-4">
                <div class="bg-blue-100 text-blue-600 border-circle flex align-items-center justify-content-center" style="width: 50px; height: 50px;">
                  <i class="pi pi-building text-2xl"></i>
                </div>
                <div>
                  <h2 class="m-0 text-lg text-gray-800 font-bold">{{ project.name }}</h2>
                  <span class="text-gray-500 text-sm">Project ID: #{{ project.id.padStart(4, '0') }}</span>
                </div>
              </div>

              <div class="flex flex-column gap-2 mb-4">
                <div class="flex align-items-center gap-2 text-gray-700 text-sm">
                  <i class="pi pi-map-marker text-primary"></i> <span class="font-medium">Location:</span> {{ project.location }}
                </div>
                <div class="flex align-items-center gap-2 text-gray-700 text-sm">
                  <i class="pi pi-wallet text-primary"></i> <span class="font-medium">Budget:</span> $ {{ project.budget.toLocaleString() }}
                </div>
                <div class="flex align-items-center gap-2 text-gray-700 text-sm">
                  <i class="pi pi-calendar text-primary"></i> <span class="font-medium">Start Date:</span> {{ project.date }}
                </div>
                <div class="flex align-items-center gap-2 text-gray-700 text-sm mt-1">
                  <i class="pi pi-info-circle text-primary"></i> <span class="font-medium">Status:</span>
                  <pv-tag :severity="project.progress === 100 ? 'success' : (project.progress > 20 ? 'info' : 'warning')" :value="project.status" rounded></pv-tag>
                </div>
              </div>

              <div class="pt-3 border-top-1 border-gray-100">
                <div class="flex justify-content-between text-xs mb-2 font-medium">
                  <span class="text-gray-600">Progress</span>
                  <span class="text-primary">{{ project.progress }}%</span>
                </div>
                <div class="w-full bg-gray-200 border-round-xl h-1rem overflow-hidden">
                  <div class="bg-primary h-full border-round-xl" :style="`width: ${project.progress}%`"></div>
                </div>
              </div>
            </template>
          </pv-card>
        </div>
      </div>
    </div>

    <div>
      <h3 class="text-xl text-gray-800 font-bold mt-0 mb-3">Quick Access Modules</h3>
      <div class="grid">
        <div class="col-12 sm:col-6 md:col-4 lg:col-2" v-for="module in modules" :key="module.key">
          <div class="bg-white p-4 border-round-2xl shadow-1 hover:shadow-3 transition-all cursor-pointer flex flex-column align-items-center justify-content-center gap-3 h-full border-1 border-transparent hover:border-primary"
               @click="$router.push(module.route)">
            <div :class="`bg-${module.color}-100 text-${module.color}-600 border-circle flex align-items-center justify-content-center`" style="width: 60px; height: 60px;">
              <i :class="['pi', module.icon, 'text-3xl']"></i>
            </div>
            <span class="font-bold text-gray-800 text-sm text-center">{{ $t(`option.${module.key}`) }}</span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useIamStore } from "@/iam/application/iam.store.js";

const iamStore = useIamStore();
const projects = ref([]);

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3000/projects');
    projects.value = response.data;
  } catch (error) {
    console.error("Error cargando proyectos:", error);
  }
});

const modules = ref([
  { key: 'purchase_orders', icon: 'pi-shopping-cart', color: 'teal', route: '/procurement/inbox' },
  { key: 'inventory', icon: 'pi-clone', color: 'orange', route: '/inventory/list' },
  { key: 'suppliers', icon: 'pi-users', color: 'indigo', route: '/suppliers/directory' },
  { key: 'incidents', icon: 'pi-exclamation-triangle', color: 'red', route: '/suppliers/incidents' },
  { key: 'reports', icon: 'pi-chart-bar', color: 'purple', route: '/reports' },
  { key: 'communication', icon: 'pi-comments', color: 'green', route: '/communication/messages' }
]);
</script>