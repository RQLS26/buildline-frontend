<template>
  <div class="flex align-items-center justify-content-center h-full w-full mt-4 md:mt-5">
    <div class="bg-white p-5 shadow-2 border-round-2xl w-full sm:w-8 md:w-6 lg:w-4 xl:w-3">

      <div class="text-center mb-4">
        <img src="/logo.png" alt="Buildline Logo" style="height: 40px;" class="mb-3" />
        <div class="text-gray-900 text-2xl font-bold mb-1">Crea tu cuenta</div>
        <span class="text-gray-500 font-medium text-sm">Únete a la plataforma logística</span>
      </div>

      <form @submit.prevent="handleRegister">

        <div class="mb-3">
          <label class="block text-gray-700 text-sm font-bold mb-2">Nombre Completo</label>
          <pv-input-text v-model="form.name" class="w-full bg-gray-50 border-gray-300 py-2 text-sm" required autofocus />
        </div>

        <div class="mb-3">
          <label class="block text-gray-700 text-sm font-bold mb-2">Correo Electrónico</label>
          <pv-input-text v-model="form.email" type="email" class="w-full bg-gray-50 border-gray-300 py-2 text-sm" required />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">Contraseña</label>
          <pv-input-text v-model="form.password" type="password" class="w-full bg-gray-50 border-gray-300 py-2 text-sm" required />
        </div>

        <pv-button label="Regístrate" type="submit" :loading="store.isLoading" class="w-full bg-orange-500 border-orange-500 hover:bg-orange-600 py-2.5 font-bold mb-4" />

        <div class="text-center text-sm text-gray-600 font-medium">
          ¿Ya tienes cuenta?
          <a class="font-bold no-underline text-primary cursor-pointer hover:underline ml-1" @click="$router.push('/iam/sign-in')">
            Ingresa aquí
          </a>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useIamStore } from '../../application/iam.store.js';

const router = useRouter();
const store = useIamStore();

const form = ref({
  name: '',
  email: '',
  password: '',
  role: 'user'
});

const handleRegister = async () => {
  const success = await store.signUp(form.value);
  if (success) {
    router.push('/home');
  }
};
</script>