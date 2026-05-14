<template>
  <div class="flex justify-content-center align-items-center min-h-screen bg-gray-100 px-3">
    <pv-card class="w-full md:w-6 lg:w-4 shadow-4 border-round-xl">
      <template #title>
        <div class="text-center mb-4">
          <h2 class="m-0 text-gray-800">Crear Cuenta</h2>
          <p class="text-gray-500 font-normal">Únete a la red logística de Buildline</p>
        </div>
      </template>
      <template #content>
        <form @submit.prevent="onSignUp" class="grid">
          <div class="col-12 md:col-6 flex flex-column gap-2 mb-3">
            <label class="font-medium">Nombre</label>
            <pv-input-text v-model="firstName" placeholder="Juan" required />
          </div>
          <div class="col-12 md:col-6 flex flex-column gap-2 mb-3">
            <label class="font-medium">Apellido</label>
            <pv-input-text v-model="lastName" placeholder="Pérez" required />
          </div>
          <div class="col-12 flex flex-column gap-2 mb-3">
            <label class="font-medium">Correo Electrónico</label>
            <pv-input-text v-model="email" type="email" placeholder="juan@mype.com" class="w-full" required />
          </div>
          <div class="col-12 flex flex-column gap-2 mb-4">
            <label class="font-medium">Contraseña</label>
            <pv-input-text v-model="password" type="password" placeholder="••••••••" class="w-full" required />
          </div>
          <div class="col-12">
            <pv-button type="submit" label="Registrarse" class="w-full py-3" :loading="loading" />
          </div>
          <div class="col-12 text-center mt-3 text-sm text-gray-600">
            ¿Ya tienes cuenta? <router-link to="/iam/sign-in" class="text-primary font-bold text-decoration-none">Inicia sesión</router-link>
          </div>
        </form>
      </template>
    </pv-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const loading = ref(false);
const router = useRouter();

const onSignUp = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    router.push('/iam/sign-in');
  }, 1000);
};
</script>