<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="flex justify-content-center mb-6">
        <img src="/logo.png" alt="Buildline" style="width: 280px; height: auto;" />
      </div>

      <div class="flex flex-column gap-4">
        <div class="flex flex-column gap-2">
          <label for="name" class="font-bold text-sm text-gray-700">{{ $t('iam.full_name') }}</label>
          <pv-input-text id="name" v-model="name" placeholder="John Doe" class="w-full" />
        </div>

        <div class="flex flex-column gap-2">
          <label for="email" class="font-bold text-sm text-gray-700">{{ $t('iam.email') }}</label>
          <pv-input-text id="email" v-model="email" placeholder="example@email.com" class="w-full" />
        </div>
        <div class="flex flex-column gap-2">
          <label for="company" class="font-bold text-sm text-gray-700">{{ $t('iam.company_name') }}</label>
          <pv-input-text id="company" v-model="companyName" :placeholder="$t('iam.company_placeholder')" class="w-full" />
        </div>

        <div class="flex flex-column gap-2">
          <label for="password" class="font-bold text-sm text-gray-700">{{ $t('iam.password') }}</label>
          <pv-input-text id="password" v-model="password" type="password" placeholder="••••••••••••" class="w-full" />
        </div>

        <div class="text-xs text-gray-500 mt-2">
          {{ $t('iam.agree_terms') }}
          <span class="auth-link cursor-pointer">{{ $t('iam.terms') }}</span> {{ $t('common.and') || 'and' }}
          <span class="auth-link cursor-pointer">{{ $t('iam.privacy') }}</span>.
        </div>

        <pv-button :label="$t('iam.sign_up')" class="btn-login mt-2" @click="handleSignUp" :loading="isLoading" />

        <div v-if="errorMsg" class="error-box">
          <i class="pi pi-exclamation-circle"></i>
          <span>{{ errorMsg }}</span>
        </div>

        <div class="flex align-items-center justify-content-center gap-3 my-2">
          <div class="border-top-1 border-200 flex-1"></div>
          <span class="text-xs text-gray-400 font-medium">or continue with</span>
          <div class="border-top-1 border-200 flex-1"></div>
        </div>

        <pv-button class="btn-google">
          <div class="flex align-items-center justify-content-center gap-2 w-full">
            <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="Google" style="width: 18px;" />
            <span>{{ $t('iam.continue_google') }}</span>
          </div>
        </pv-button>

        <div class="text-center mt-4">
          <span class="text-sm text-gray-600 mr-2">{{ $t('iam.no_account') }}</span>
          <router-link to="/iam/sign-in" class="auth-link">{{ $t('iam.login') }}</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useIamStore } from '../../application/iam.store.js';

const router = useRouter();
const store = useIamStore();
const { t } = useI18n();
const name = ref('');
const email = ref('');
const companyName = ref('');
const password = ref('');
const isLoading = ref(false);
const errorMsg = ref('');
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const handleSignUp = async () => {
  errorMsg.value = '';
  if (!name.value.trim() || !email.value.trim() || !companyName.value.trim() || !password.value) {
    errorMsg.value = t('iam.required_fields');
    return;
  }
  if (!emailPattern.test(email.value.trim())) {
    errorMsg.value = t('iam.invalid_email');
    return;
  }
  if (password.value.length < 6) {
    errorMsg.value = t('iam.password_min_length');
    return;
  }

  isLoading.value = true;
  const success = await store.signUp({
    name: name.value.trim(),
    email: email.value.trim(),
    password: password.value,
    companyName: companyName.value.trim(),
    role: 'admin'
  });
  isLoading.value = false;

  if (success) router.push('/home');
  else errorMsg.value = store.error || t('iam.create_account_error');
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
}

.error-box i {
    font-size: 14px;
}
</style>