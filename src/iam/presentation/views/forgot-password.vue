<template>
  <div class="flex align-items-center justify-content-center h-full w-full mt-4 md:mt-6">
    <div class="bg-white p-5 shadow-2 border-round-2xl w-full sm:w-8 md:w-6 lg:w-4 xl:w-3 text-center">

      <img src="/logo.png" alt="Buildline Logo" style="height: 50px;" class="mb-4" />

      <div class="text-blue-600 text-lg font-bold mb-2">Forgot Password?</div>
      <p class="text-gray-700 font-medium text-sm mb-4 px-3">
        Enter your email address to reset your password.
      </p>

      <form @submit.prevent="handleReset">
        <div class="text-left mb-4">
          <label class="block text-gray-900 text-xs font-bold mb-2">Email Address</label>
          <pv-input-text v-model="email" type="email" placeholder="example@email.com" class="w-full bg-gray-50 border-gray-300 py-2 text-sm" required autofocus />
        </div>

        <pv-button label="Login" type="submit" :loading="isLoading" class="w-full bg-blue-600 border-blue-600 hover:bg-blue-700 py-2 font-bold mb-4" />

        <a class="text-sm text-gray-500 font-medium cursor-pointer hover:text-gray-800 transition-colors" @click="$router.push('/iam/sign-in')">
          Back to login
        </a>
      </form>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const toast = useToast();
const email = ref('');
const isLoading = ref(false);

const handleReset = () => {
  isLoading.value = true;
  // Simulamos el envío del correo
  setTimeout(() => {
    isLoading.value = false;
    alert("Si el correo existe, enviaremos un enlace de recuperación.");
    router.push('/iam/sign-in');
  }, 1500);
};
</script>