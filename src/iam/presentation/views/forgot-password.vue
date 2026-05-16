<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="flex justify-content-center mb-6">
        <img src="/logo.png" alt="Buildline" style="width: 280px; height: auto;" />
      </div>

      <div class="flex flex-column gap-5">
        <div class="text-center mb-2">
          <h2 class="text-xl font-bold text-900 m-0">{{ $t('iam.reset_title') }}</h2>
          <p class="text-sm text-gray-500 mt-2">{{ $t('iam.reset_subtitle') }}</p>
        </div>

        <div class="flex flex-column gap-2">
          <label for="email" class="font-bold text-sm text-gray-700">{{ $t('iam.email') }}</label>
          <pv-input-text id="email" v-model="email" placeholder="example@email.com" class="w-full" />
        </div>

        <pv-button label="Send Reset Link" class="btn-login" @click="handleReset" />

        <div class="text-center mt-2">
          <router-link to="/iam/sign-in" class="auth-link text-sm">
            <i class="pi pi-arrow-left mr-2"></i>
            {{ $t('iam.back') }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');

const handleReset = () => {
  router.push('/iam/sign-in');
};
</script>

<style scoped>
.auth-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #F8F9FA;
}

.auth-card {
    background: white;
    padding: 3rem;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    width: 100%;
    max-width: 450px;
    text-align: left;
}

.btn-login {
    background-color: #4F679B !important;
    border-color: #4F679B !important;
    color: white !important;
    font-weight: 700 !important;
    width: 100%;
    padding: 0.85rem !important;
    border-radius: 6px !important;
}

.auth-link {
    color: #4F679B !important;
    text-decoration: none;
    font-weight: 600;
    transition: opacity 0.2s;
}
</style>