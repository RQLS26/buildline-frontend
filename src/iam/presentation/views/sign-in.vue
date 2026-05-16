<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="flex justify-content-center mb-6">
        <img src="/logo.png" alt="Buildline" style="width: 280px; height: auto;" />
      </div>

      <div class="flex flex-column gap-5">
        <div class="flex flex-column gap-2">
          <label for="email" class="font-bold text-sm text-gray-700">{{ $t('iam.email') }}</label>
          <pv-input-text id="email" v-model="email" placeholder="example@email.com" class="w-full" />
        </div>

        <div class="flex flex-column gap-2">
          <div class="flex justify-content-between align-items-center">
            <label for="password" class="font-bold text-sm text-gray-700">{{ $t('iam.password') }}</label>
            <router-link to="/iam/forgot-password" class="auth-link text-xs">{{ $t('iam.forgot') }}</router-link>
          </div>
          <pv-input-text id="password" v-model="password" type="password" placeholder="••••••••••••" class="w-full" />
        </div>

        <div class="flex align-items-center gap-2 mb-2">
          <pv-checkbox v-model="rememberMe" :binary="true" inputId="remember" />
          <label for="remember" class="text-sm text-gray-600 font-medium">{{ $t('iam.keep_signed_in') }}</label>
        </div>

        <pv-button :label="$t('iam.login')" class="btn-login" @click="handleLogin" :loading="isLoading" />

        <!-- Error message -->
        <div v-if="errorMsg" class="error-box">
          <i class="pi pi-exclamation-circle"></i>
          <span>{{ errorMsg }}</span>
        </div>

        <div class="flex align-items-center justify-content-center gap-3 my-2">
          <div class="border-top-1 border-200 flex-1"></div>
          <span class="text-xs text-gray-400 font-medium">or sign in with</span>
          <div class="border-top-1 border-200 flex-1"></div>
        </div>

        <pv-button class="btn-google">
          <div class="flex align-items-center justify-content-center gap-2 w-full">
            <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="Google" style="width: 18px;" />
            <span>{{ $t('iam.continue_google') }}</span>
          </div>
        </pv-button>

        <div class="text-center mt-4">
          <router-link to="/iam/sign-up" class="auth-link">{{ $t('iam.create_account') }}</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useIamStore } from '../../application/iam.store.js';

const router = useRouter();
const store = useIamStore();

const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const isLoading = ref(false);
const errorMsg = ref('');

const handleLogin = async () => {
  errorMsg.value = '';
  if (!email.value || !password.value) {
    errorMsg.value = 'Please enter email and password.';
    return;
  }
  isLoading.value = true;
  // Simulated delay for UX
  await new Promise(r => setTimeout(r, 800));
  const success = await store.signIn(email.value, password.value);
  isLoading.value = false;
  if (success) {
    router.push('/home');
  } else {
    errorMsg.value = store.error || 'Invalid credentials. Please try again.';
  }
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

.btn-google {
    background-color: #E5E7EB !important;
    border-color: #E5E7EB !important;
    color: #4B5563 !important;
    font-weight: 600 !important;
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

.auth-link:hover {
    opacity: 0.8;
}

.error-box {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #FEECEB;
    border: 1px solid #FECACA;
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 13px;
    font-weight: 600;
    color: #DC2626;
    margin-top: 4px;
}
.error-box i {
    font-size: 14px;
}
</style>