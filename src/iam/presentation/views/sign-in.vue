<template>
  <div class="flex justify-content-center align-items-center min-h-screen bg-gray-100 px-3">
    <pv-card class="w-full md:w-5 lg:w-3 shadow-4 border-round-xl">
      <template #title>
        <div class="text-center mb-4">
          <i class="pi pi-lock text-primary text-4xl mb-2"></i>
          <h2 class="m-0 text-gray-800">Bienvenido</h2>
          <p class="text-gray-500 font-normal">Inicia sesión en Buildline</p>
        </div>
      </template>
      <template #content>
        <form @submit.prevent="onSignIn" class="flex flex-column gap-4">
          <div class="flex flex-column gap-2">
            <label for="username" class="font-medium text-gray-700">Usuario</label>
            <pv-icon-field>
              <pv-input-icon class="pi pi-user" />
              <pv-input-text id="username" v-model="username" placeholder="juan.perez" class="w-full" required />
            </pv-icon-field>
          </div>

          <div class="flex flex-column gap-2">
            <label for="password" class="font-medium text-gray-700">Contraseña</label>
            <pv-icon-field>
              <pv-input-icon class="pi pi-key" />
              <pv-input-text id="password" v-model="password" type="password" placeholder="••••••••" class="w-full" required />
            </pv-icon-field>
          </div>

          <pv-button type="submit" label="Ingresar" class="w-full mt-2" :loading="loading" />

          <div class="text-center mt-3 text-sm text-gray-600">
            ¿No tienes una cuenta? <router-link to="/iam/sign-up" class="text-primary font-bold text-decoration-none">Regístrate</router-link>
          </div>
        </form>
      </template>
    </pv-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const loading = ref(false);
const router = useRouter();

const onSignIn = () => {
  loading.value = true;
  // Simulación de autenticación
  setTimeout(() => {
    loading.value = false;
    router.push('/home');
  }, 1000);
};
</script>