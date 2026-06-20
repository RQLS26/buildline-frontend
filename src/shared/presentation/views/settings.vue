<template>
  <div class="view-content font-inter">

    <!-- Viewer Notice -->
    <div v-if="!iamStore.isAdmin" class="viewer-notice mb-4">
      <i class="pi pi-info-circle"></i>
      <span>{{ $t('common.viewer_msg') }}</span>
    </div>

    <!-- Row 1: General Settings -->
    <div class="section-header">
      <h2 class="m-0">{{ $t('settings.general') }}</h2>
    </div>
    <div class="content-card">
      <div class="settings-row">
        <div class="setting-item">
          <div class="setting-label">{{ $t('users.name') }}</div>
          <pv-input-text v-model="profile.name" class="w-full settings-input" :disabled="!iamStore.isAdmin" />
        </div>
        <div class="setting-item">
          <div class="setting-label">{{ $t('users.email') }}</div>
          <pv-input-text v-model="profile.email" class="w-full settings-input" :disabled="!iamStore.isAdmin" />
        </div>
        <div class="setting-item">
          <div class="setting-label">{{ $t('company-profile.phone') }}</div>
          <pv-input-text v-model="profile.phone" placeholder="+51 999 999 999" class="w-full settings-input" :disabled="!iamStore.isAdmin" />
        </div>
        <div class="setting-item">
          <div class="setting-label">{{ $t('users.role') }}</div>
          <pv-input-text :modelValue="profile.role" disabled class="w-full settings-input" />
        </div>
      </div>

      <div class="settings-divider"></div>

      <div class="settings-row">
        <div class="setting-item">
          <div class="setting-label">{{ $t('settings.language') }}</div>
          <pv-select v-model="preferences.language" :options="languageOptions" optionLabel="label" optionValue="value" class="w-full settings-input" />
        </div>
        <div class="setting-item">
          <div class="setting-label">{{ $t('settings.currency') }}</div>
          <pv-select v-model="preferences.currency" :options="currencyOptions" optionLabel="label" optionValue="value" class="w-full settings-input" />
        </div>
        <div class="setting-item">
          <div class="setting-label">{{ $t('settings.date_format') }}</div>
          <pv-select v-model="preferences.dateFormat" :options="dateFormatOptions" optionLabel="label" optionValue="value" class="w-full settings-input" />
        </div>
        <div class="setting-item">
          <div class="setting-label">{{ $t('settings.theme') }}</div>
          <pv-select v-model="preferences.theme" :options="themeOptions" optionLabel="label" optionValue="value" class="w-full settings-input" />
        </div>
      </div>
    </div>

    <!-- Row 2: Notifications & Security -->
    <div class="section-header mt-settings">
      <h2 class="m-0">{{ $t('settings.notifications') }} & {{ $t('settings.security') }}</h2>
    </div>
    <div class="content-card">
      <div class="settings-row-mixed">
        <!-- Toggles column -->
        <div class="toggles-section">
          <div class="toggle-row" v-for="toggle in toggles" :key="toggle.key">
            <div>
              <span class="toggle-label">{{ toggle.label }}</span>
              <span class="toggle-desc">{{ toggle.desc }}</span>
            </div>
            <pv-toggle-switch v-model="notifications[toggle.key]" />
          </div>
        </div>

        <div class="section-vertical-divider"></div>

        <!-- Security column -->
        <div class="security-section">
          <div class="setting-item">
            <div class="setting-label">{{ $t('settings.current_password') }}</div>
            <pv-input-text type="password" v-model="security.currentPassword" placeholder="••••••••" class="w-full settings-input" />
          </div>
          <div class="setting-item">
            <div class="setting-label">{{ $t('settings.new_password') }}</div>
            <pv-input-text type="password" v-model="security.newPassword" :placeholder="$t('settings.enter_new_password')" class="w-full settings-input" />
          </div>
          <div class="setting-item">
            <div class="setting-label">{{ $t('settings.confirm_password') }}</div>
            <pv-input-text type="password" v-model="security.confirmPassword" :placeholder="$t('settings.confirm_new_password')" class="w-full settings-input" />
          </div>
          <div class="toggle-row">
            <div>
              <span class="toggle-label">{{ $t('settings.two_factor') }}</span>
              <span class="toggle-desc">{{ $t('settings.extra_security') }}</span>
            </div>
            <pv-toggle-switch v-model="security.twoFactor" />
          </div>
        </div>
      </div>
    </div>

    <!-- Save -->
    <div class="save-row">
      <pv-button :label="$t('settings.save_changes')" icon="pi pi-check" class="save-btn" @click="saveSettings" />
    </div>

    <pv-toast />
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import { useIamStore } from '../../../iam/application/iam.store.js';

const toast = useToast();
const { locale, t } = useI18n();
const iamStore = useIamStore();
const preferencesKey = 'buildline.preferences';
const notificationsKey = 'buildline.notifications';

const profile = ref({ name: '', email: '', phone: '', role: '' });
const preferences = ref({ language: 'en', currency: 'USD', dateFormat: 'MM/DD/YYYY', theme: 'light' });
const notifications = ref({ email: true, lowStock: true, delivery: true, budget: false });
const security = ref({ currentPassword: '', newPassword: '', confirmPassword: '', twoFactor: Boolean(iamStore.currentUser?.twoFactorEnabled) });

const readStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch (error) {
    console.error(`Could not read ${key}:`, error);
    return fallback;
  }
};

const writeStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Could not persist ${key}:`, error);
  }
};

const languageOptions = computed(() => [
  { label: t('settings.language_english'), value: 'en' },
  { label: t('settings.language_spanish'), value: 'es' }
]);
const currencyOptions = computed(() => [
  { label: 'USD ($)', value: 'USD' },
  { label: 'PEN (S/)', value: 'PEN' },
  { label: 'EUR (€)', value: 'EUR' }
]);
const dateFormatOptions = computed(() => [
  { label: 'MM/DD/YYYY', value: 'MM/DD/YYYY' },
  { label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
  { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' }
]);
const themeOptions = computed(() => [
  { label: t('settings.theme_light'), value: 'light' },
  { label: t('settings.theme_dark'), value: 'dark' },
  { label: t('settings.theme_system'), value: 'system' }
]);
const toggles = computed(() => [
  { key: 'email', label: t('settings.email_notifications'), desc: t('settings.email_notifications_desc') },
  { key: 'lowStock', label: t('settings.low_stock_alerts'), desc: t('settings.low_stock_alerts_desc') },
  { key: 'delivery', label: t('settings.delivery_updates'), desc: t('settings.delivery_updates_desc') },
  { key: 'budget', label: t('settings.budget_alerts'), desc: t('settings.budget_alerts_desc') }
]);

const applyTheme = (theme) => {
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  const resolvedTheme = theme === 'system' ? (prefersDark ? 'dark' : 'light') : theme;
  document.documentElement.dataset.theme = resolvedTheme;
};

const syncProfile = (user) => {
  if (!user) return;
  profile.value = {
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    role: user.role || 'viewer'
  };
};

onMounted(() => {
  preferences.value = readStorage(preferencesKey, preferences.value);
  notifications.value = readStorage(notificationsKey, notifications.value);
  security.value.twoFactor = Boolean(iamStore.currentUser?.twoFactorEnabled);
  locale.value = preferences.value.language;
  applyTheme(preferences.value.theme);
  syncProfile(iamStore.currentUser);
});

watch(() => iamStore.currentUser, syncProfile, { immediate: true });
watch(() => iamStore.currentUser?.twoFactorEnabled, (value) => {
  security.value.twoFactor = Boolean(value);
});

const saveSettings = async () => {
  if (security.value.newPassword) {
    if (!security.value.currentPassword) {
      toast.add({ severity: 'warn', summary: t('common.warning'), detail: t('settings.current_password_required'), life: 3000 });
      return;
    }
    if (security.value.newPassword !== security.value.confirmPassword) {
      toast.add({ severity: 'error', summary: t('common.error'), detail: t('settings.passwords_mismatch'), life: 3000 });
      return;
    }
    if (security.value.newPassword.length < 6) {
      toast.add({ severity: 'warn', summary: t('common.warning'), detail: t('settings.password_min_length'), life: 3000 });
      return;
    }
  }

  writeStorage(preferencesKey, preferences.value);
  writeStorage(notificationsKey, notifications.value);
  locale.value = preferences.value.language;
  applyTheme(preferences.value.theme);

  let profileSaved = true;
  if (iamStore.isAdmin) {
    profileSaved = await iamStore.updateUserProfile({
      name: profile.value.name,
      email: profile.value.email,
      phone: profile.value.phone,
      twoFactorEnabled: security.value.twoFactor
    });
  } else if (iamStore.currentUser) {
    profileSaved = await iamStore.updateUserProfile({ twoFactorEnabled: security.value.twoFactor });
  }

  if (profileSaved && security.value.newPassword) {
    profileSaved = await iamStore.changePassword({
      currentPassword: security.value.currentPassword,
      newPassword: security.value.newPassword
    });
  }

  if (profileSaved) {
    security.value = { currentPassword: '', newPassword: '', confirmPassword: '', twoFactor: Boolean(iamStore.currentUser?.twoFactorEnabled) };
    toast.add({ severity: 'success', summary: t('common.success'), detail: t('settings.saved_message'), life: 3000 });
  } else {
    toast.add({ severity: 'error', summary: t('common.error'), detail: t('settings.save_error'), life: 3000 });
  }
};
</script>

<style scoped>
.view-content { width: 100%; }

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 10px;
}
.section-header h2 {
  font-size: 14px;
  font-weight: 600;
  color: #64748B;
}

.content-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.04);
  padding: 28px 32px;
}

.mt-settings { margin-top: 20px; }

.settings-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.settings-divider {
  height: 1px;
  background: #F1F5F9;
  margin: 24px 0;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.setting-label {
  font-size: 11px;
  font-weight: 700;
  color: #64748B;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.settings-row-mixed {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 32px;
}

.section-vertical-divider {
  width: 1px;
  background: #F1F5F9;
}

.toggles-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.security-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #F8FAFC;
}
.toggle-row:last-child { border-bottom: none; }

.toggle-label {
  display: block;
  font-size: 13px;
  font-weight: 700;
  color: #374151;
}
.toggle-desc {
  display: block;
  font-size: 11px;
  color: #94A3B8;
  margin-top: 2px;
}

.save-row {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
}
.save-btn {
  background: #3d63a1 !important;
  border-color: #3d63a1 !important;
  border-radius: 12px !important;
  font-weight: 700 !important;
  font-size: 14px !important;
  padding: 12px 32px !important;
}
.save-btn:hover { background: #2d4d82 !important; }

:deep(.settings-input) {
  border: 1px solid #E5E7EB !important;
  border-radius: 10px !important;
  background: #FAFBFC !important;
  font-size: 13px !important;
}

.viewer-notice {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #FEF3C7;
  border: 1px solid #F59E0B;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 13px;
  color: #92400E;
}

.viewer-notice i {
  font-size: 16px;
  color: #D97706;
}
</style>
