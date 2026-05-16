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
          <label for="password" class="font-bold text-sm text-gray-700">{{ $t('iam.password') }}</label>
          <pv-input-text id="password" v-model="password" type="password" placeholder="••••••••••••" class="w-full" />
        </div>

        <div class="text-xs text-gray-500 mt-2">
          {{ $t('iam.agree_terms') }}
          <span class="auth-link cursor-pointer">{{ $t('iam.terms') }}</span> {{ $t('common.and') || 'and' }}
          <span class="auth-link cursor-pointer">{{ $t('iam.privacy') }}</span>.
        </div>

        <pv-button :label="$t('iam.sign_up')" class="btn-login mt-2" @click="handleSignUp" />

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

const router = useRouter();
const name = ref('');
const email = ref('');
const password = ref('');

const handleSignUp = () => {
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
</style>