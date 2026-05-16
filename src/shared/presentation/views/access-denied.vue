<template>
  <div class="access-denied-container">
    <div class="denied-card">
      <div class="icon-circle"><i class="pi pi-lock"></i></div>
      <h2>{{ $t('common.access_denied') }}</h2>
      <p>{{ $t('common.access_denied_msg') }}</p>
      <div class="role-info"><i class="pi pi-user"></i><span>{{ $t('common.viewer_msg') }}</span></div>
      <pv-button :label="$t('page-not-found.go-home')" icon="pi pi-home" class="go-home-btn"
                 @click="$router.push('/home')"/>
    </div>
  </div>
</template>
<style scoped>
.access-denied-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.denied-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  padding: 48px;
  text-align: center;
  max-width: 480px;
  width: 100%;
}

.icon-circle {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #FEECEB;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
}

.icon-circle i {
  font-size: 28px;
  color: #E02424;
}

.denied-card h2 {
  font-size: 24px;
  font-weight: 800;
  color: #1E293B;
  margin: 0 0 12px;
}

.denied-card p {
  font-size: 14px;
  color: #64748B;
  margin: 0 0 24px;
  line-height: 1.6;
}

.role-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #FEF3C7;
  border: 1px solid #F59E0B;
  border-radius: 8px;
  padding: 10px 16px;
  margin-bottom: 24px;
  font-size: 13px;
  color: #92400E;
}

.go-home-btn {
  background: #3d63a1 !important;
  border-color: #3d63a1 !important;
  border-radius: 12px !important;
  font-weight: 700 !important;
  padding: 10px 32px !important;
}
</style>
