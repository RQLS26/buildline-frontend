<template>
  <div class="status-page">
    <section class="status-card">
      <img src="/logo.png" alt="Buildline" class="brand-logo" />
      <div class="status-icon" :class="statusClass">
        <i :class="statusIcon"></i>
      </div>
      <h1>{{ title }}</h1>
      <p>{{ message }}</p>
      <div class="status-actions">
        <pv-button :label="$t('iam.refresh_status')" icon="pi pi-refresh" class="primary-action" @click="refreshSession" />
        <pv-button :label="$t('option.logout')" text class="secondary-action" @click="logout" />
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useIamStore } from '../../application/iam.store.js';

const router = useRouter();
const { t } = useI18n();
const iamStore = useIamStore();

const statusClass = computed(() => iamStore.isRejectedMember ? 'rejected' : 'pending');
const statusIcon = computed(() => iamStore.isRejectedMember ? 'pi pi-times-circle' : 'pi pi-clock');
const title = computed(() => iamStore.isRejectedMember ? t('iam.invitation_rejected_title') : t('iam.invitation_pending_title'));
const message = computed(() => iamStore.isRejectedMember ? t('iam.invitation_rejected_message') : t('iam.invitation_pending_message'));

const refreshSession = async () => {
  await iamStore.refreshCurrentUser();
  if (iamStore.hasActiveMembership) router.push('/home');
};

const logout = () => {
  iamStore.logout();
  router.push('/iam/sign-in');
};
</script>

<style scoped>
.status-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F8F9FA;
  padding: 24px;
}

.status-card {
  width: min(460px, 100%);
  background: #fff;
  border: 1px solid #E5E7EB;
  border-radius: 16px;
  padding: 36px;
  text-align: center;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
}

.brand-logo {
  width: 230px;
  height: auto;
  margin-bottom: 28px;
}

.status-icon {
  width: 56px;
  height: 56px;
  margin: 0 auto 18px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.status-icon.pending {
  background: #FEF6E5;
  color: #D97706;
}

.status-icon.rejected {
  background: #FEECEB;
  color: #E02424;
}

h1 {
  margin: 0;
  color: #1E293B;
  font-size: 24px;
  font-weight: 800;
}

p {
  margin: 12px 0 0;
  color: #64748B;
  line-height: 1.6;
  font-size: 14px;
}

.status-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 28px;
}

.primary-action {
  background: #3d63a1 !important;
  border-color: #3d63a1 !important;
  border-radius: 10px !important;
  font-weight: 700 !important;
}

.secondary-action {
  color: #64748B !important;
  font-weight: 700 !important;
}
</style>
