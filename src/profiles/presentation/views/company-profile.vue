<template>
  <div class="view-content font-inter">
    <pv-toast />

    <div class="section-header">
      <div>
        <h2 class="m-0">{{ $t('company-profile.title') }}</h2>
        <p class="section-subtitle">{{ $t('company-profile.subtitle') }}</p>
      </div>
    </div>

    <div v-if="store.isLoading" class="content-card loading-card">
      <i class="pi pi-spin pi-spinner"></i>
    </div>

    <form v-else class="content-card profile-card" @submit.prevent="saveProfile">
      <div class="profile-grid">
        <div class="field-block">
          <label class="field-label">{{ $t('company-profile.company_name') }}</label>
          <pv-input-text v-model="formData.companyName" required class="profile-input" />
        </div>

        <div class="field-block">
          <label class="field-label">{{ $t('company-profile.ruc') }}</label>
          <div class="ruc-row">
            <pv-input-text v-model="formData.ruc" :disabled="hasConfirmedRuc" class="profile-input" />
            <pv-button
              v-if="!hasConfirmedRuc"
              :label="$t('company-profile.confirm_ruc')"
              class="confirm-ruc-btn"
              type="button"
              @click="requestRucConfirmation"
            />
          </div>
          <small class="field-hint">{{ hasConfirmedRuc ? $t('company-profile.ruc_hint') : $t('company-profile.ruc_pending_hint') }}</small>
        </div>

        <div class="field-block wide">
          <label class="field-label">{{ $t('company-profile.address') }}</label>
          <pv-input-text v-model="formData.address" required class="profile-input" />
        </div>

        <div class="field-block">
          <label class="field-label">{{ $t('company-profile.phone') }}</label>
          <pv-input-text v-model="formData.phone" required class="profile-input" />
        </div>

        <div class="field-block">
          <label class="field-label">{{ $t('company-profile.email') }}</label>
          <pv-input-text v-model="formData.email" type="email" required class="profile-input" />
        </div>
      </div>

      <div class="form-footer">
        <pv-button :label="$t('company-profile.save')" icon="pi pi-save" type="submit" class="save-btn" :loading="store.isLoading" />
      </div>
    </form>

    <pv-dialog v-model:visible="showRucDialog" modal :header="$t('company-profile.confirm_ruc_title')" :style="{ width: '440px' }">
      <p class="confirm-copy">{{ $t('company-profile.confirm_ruc_message', { ruc: formData.ruc || '-' }) }}</p>
      <template #footer>
        <pv-button :label="$t('common.cancel')" class="p-button-text" @click="showRucDialog = false" />
        <pv-button :label="$t('common.confirm')" class="save-btn" @click="confirmRucAndSave" />
      </template>
    </pv-dialog>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useProfilesStore } from '../../application/profiles.store.js';
import { useToast } from 'primevue/usetoast';

const store = useProfilesStore();
const toast = useToast();
const { t } = useI18n();

const formData = ref({
  companyName: '',
  ruc: '',
  address: '',
  phone: '',
  email: ''
});
const originalRuc = ref('');
const showRucDialog = ref(false);
const hasConfirmedRuc = computed(() => Boolean(originalRuc.value));

onMounted(async () => {
  await store.fetchProfile();
});

watch(() => store.companyProfile, (newProfile) => {
  if (newProfile) {
    formData.value = { ...newProfile };
    originalRuc.value = newProfile.ruc || '';
  }
}, { immediate: true });

const saveProfile = async () => {
  if (!hasConfirmedRuc.value && formData.value.ruc) {
    showRucDialog.value = true;
    return;
  }
  const success = await store.updateProfile(formData.value);
  toast.add({
    severity: success ? 'success' : 'error',
    summary: success ? t('common.success') : t('common.error'),
    detail: success ? t('company-profile.saved_message') : t('company-profile.save_error'),
    life: 3000
  });
};

const requestRucConfirmation = () => {
  if (!formData.value.ruc) {
    toast.add({ severity: 'warn', summary: t('common.warning'), detail: t('company-profile.ruc_required'), life: 3000 });
    return;
  }
  showRucDialog.value = true;
};

const confirmRucAndSave = async () => {
  showRucDialog.value = false;
  const success = await store.updateProfile(formData.value);
  if (success) originalRuc.value = formData.value.ruc;
  toast.add({
    severity: success ? 'success' : 'error',
    summary: success ? t('common.success') : t('common.error'),
    detail: success ? t('company-profile.ruc_confirmed_message') : t('company-profile.save_error'),
    life: 3000
  });
};
</script>

<style scoped>
.view-content { width: 100%; }

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 18px;
}

.section-header h2 {
  font-size: 14px;
  font-weight: 700;
  color: #64748B;
}

.section-subtitle {
  margin: 6px 0 0;
  color: #94A3B8;
  font-size: 13px;
}

.content-card {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.04);
}

.loading-card {
  min-height: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3d63a1;
  font-size: 28px;
}

.profile-card {
  padding: 28px 32px 32px;
}

.profile-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px 28px;
}

.field-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.field-block.wide {
  grid-column: 1 / -1;
}

.field-label {
  font-size: 11px;
  font-weight: 700;
  color: #64748B;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.field-hint {
  color: #94A3B8;
  font-size: 11px;
  line-height: 1.4;
}

:deep(.profile-input) {
  width: 100%;
  border: 1px solid #E5E7EB !important;
  border-radius: 10px !important;
  background: #FAFBFC !important;
  font-size: 13px !important;
}

.ruc-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 10px;
}

.confirm-ruc-btn {
  background: #3d63a1 !important;
  border-color: #3d63a1 !important;
  border-radius: 10px !important;
  font-weight: 700 !important;
  white-space: nowrap;
}

.confirm-copy {
  margin: 0;
  color: #374151;
  line-height: 1.6;
}

.form-footer {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #F1F5F9;
  margin-top: 28px;
  padding-top: 24px;
}

.save-btn {
  background: #3D9F7D !important;
  border-color: #3D9F7D !important;
  border-radius: 10px !important;
  font-weight: 700 !important;
}

@media (max-width: 768px) {
  .profile-grid { grid-template-columns: 1fr; }
}
</style>
