<template>
  <div class="flex align-items-center justify-content-center h-full w-full mt-4 md:mt-6">
    <div class="bg-white p-5 shadow-2 border-round-2xl w-full sm:w-8 md:w-6 lg:w-4 xl:w-3">

      <div class="text-center mb-5">
        <img src="/logo.png" alt="Buildline Logo" style="height: 45px;" class="mb-4" />
        <div class="text-gray-900 text-2xl font-bold mb-2">{{ $t('iam.welcome') }}</div>
        <span class="text-gray-500 font-medium text-sm">{{ $t('iam.subtitle') }}</span>
      </div>

      <form @submit.prevent="handleLogin">

        <div class="mb-4">
          <label for="email" class="block text-gray-700 text-sm font-bold mb-2">{{ $t('iam.email') }}</label>
          <pv-input-text id="email" v-model="email" type="email" class="w-full bg-gray-50 border-gray-300 py-2 text-sm" required autofocus />
        </div>

        <div class="mb-4">
          <label for="password" class="block text-gray-700 text-sm font-bold mb-2">{{ $t('iam.password') }}</label>
          <pv-input-text id="password" v-model="password" type="password" class="w-full bg-gray-50 border-gray-300 py-2 text-sm" required />
        </div>

        <div class="flex align-items-center justify-content-between mb-4">
          <div class="flex align-items-center gap-2">
            <pv-checkbox id="remember" v-model="rememberMe" :binary="true" />
            <label for="remember" class="text-gray-600 text-sm font-medium cursor-pointer">{{ $t('iam.remember') }}</label>
          </div>
          <a class="font-bold no-underline text-primary text-sm cursor-pointer hover:underline" @click="$router.push('/iam/forgot-password')">
            {{ $t('iam.forgot') }}
          </a>
        </div>

        <div v-if="store.error" class="text-red-500 text-sm font-bold text-center mb-3">
          <i class="pi pi-exclamation-circle mr-1"></i> {{ store.error }}
        </div>

        <pv-button :label="$t('iam.sign_in')" type="submit" :loading="store.isLoading" class="w-full bg-orange-500 border-orange-500 hover:bg-orange-600 py-2.5 font-bold mb-4" />

        <div class="text-center text-sm text-gray-600 font-medium">
          {{ $t('iam.no_account') }}
          <a class="font-bold no-underline text-primary cursor-pointer hover:underline ml-1" @click="$router.push('/iam/sign-up')">
            {{ $t('iam.sign_up') }}
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
const store = useIamStore(); // Conectamos el Store que valida la DB

const email = ref('');
const password = ref('');
const rememberMe = ref(false);

const handleLogin = async () => {
  // Ahora sí llamamos a la base de datos para verificar
  const success = await store.signIn(email.value, password.value);

  if (success) {
    router.push('/home'); // Solo entra si success es true
  }
};
</script>