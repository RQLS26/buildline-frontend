<template>
  <div class="view-content font-inter">

    <!-- Action Row -->
    <div class="action-row">
      <div class="search-box">
        <i class="pi pi-search"></i>
        <input type="text" v-model="searchQuery" :placeholder="$t('notifications.search')" />
      </div>
      <div class="ml-auto">
        <pv-button :label="$t('notifications.compose')" icon="pi pi-pencil" class="compose-btn" @click="showCompose = true" />
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs-row">
      <div v-for="tab in tabs" :key="tab.name"
           :class="['tab-item', activeTab === tab.name ? 'tab-active' : '']"
           @click="activeTab = tab.name">
        {{ tab.label }} <span v-if="tab.count" class="tab-count">({{ tab.count }})</span>
      </div>
    </div>

    <!-- Notification list -->
    <div class="content-card notif-card">
      <div v-for="msg in filteredMessages" :key="msg.id"
           :class="['notif-row', !msg.isRead ? 'unread' : '']"
           @click="handleRead(msg)">
        <!-- Icon -->
        <div :class="['notif-icon', msg.iconClass]">
          <i :class="'pi ' + msg.icon"></i>
        </div>

        <!-- Content -->
        <div class="notif-content">
          <div class="notif-header-row">
            <span class="notif-sender">{{ msg.sender }}</span>
            <span v-if="msg.label" :class="['notif-label', msg.labelClass]">{{ msg.label }}</span>
          </div>
          <p class="notif-subject">{{ msg.subject }}</p>
          <p class="notif-preview">{{ msg.preview }}</p>
        </div>

        <!-- Time + actions -->
        <div class="notif-right">
          <span class="notif-time">{{ msg.time }}</span>
          <div class="notif-actions">
            <button class="notif-action" @click.stop="handleStar(msg)" :title="msg.starred ? $t('notifications.unstar') : $t('notifications.star')">
              <i :class="msg.starred ? 'pi pi-star-fill' : 'pi pi-star'" :style="{ color: msg.starred ? '#D97706' : '#D1D5DB' }"></i>
            </button>
            <button class="notif-action" @click.stop="handleArchive(msg)" :title="$t('notifications.archive')">
              <i class="pi pi-folder"></i>
            </button>
          </div>
        </div>
      </div>

      <div v-if="filteredMessages.length === 0" class="empty-state">
        <i class="pi pi-inbox"></i>
        <p>{{ $t('notifications.no_notifications') }}</p>
      </div>
    </div>

    <!-- Compose Dialog -->
    <pv-dialog v-model:visible="showCompose" modal :header="$t('notifications.new_message')" :style="{ width: '520px' }">
      <div class="flex flex-column gap-4 pt-2">
        <div class="flex flex-column gap-2">
          <label class="compose-label">{{ $t('notifications.to') }}</label>
          <pv-input-text v-model="newMsg.to" :placeholder="$t('notifications.recipient')" class="w-full" />
        </div>
        <div class="flex flex-column gap-2">
          <label class="compose-label">{{ $t('notifications.subject') }}</label>
          <pv-input-text v-model="newMsg.subject" :placeholder="$t('notifications.subject')" class="w-full" />
        </div>
        <div class="flex flex-column gap-2">
          <label class="compose-label">{{ $t('notifications.message') }}</label>
          <pv-textarea v-model="newMsg.body" rows="5" :placeholder="$t('notifications.message_placeholder')" class="w-full" />
        </div>
      </div>
      <template #footer>
        <pv-button :label="$t('notifications.discard')" class="p-button-text" @click="showCompose = false" />
        <pv-button :label="$t('notifications.send')" icon="pi pi-send" class="send-btn" @click="showCompose = false" />
      </template>
    </pv-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCommunicationStore } from '../../application/communication.store.js';

const store = useCommunicationStore();
const { t } = useI18n();
const showCompose = ref(false);
const activeTab = ref('All');
const searchQuery = ref('');
const newMsg = ref({ to: '', subject: '', body: '' });

onMounted(async () => {
  await store.fetchMessages();
});

const tabs = computed(() => [
  { name: 'All', label: t('common.all'), count: store.messages.length },
  { name: 'Unread', label: t('notifications.unread'), count: store.unreadMessages.length },
  { name: 'Alerts', label: t('notifications.alerts'), count: store.alertMessages.length },
  { name: 'Updates', label: t('notifications.updates'), count: store.updateMessages.length },
  { name: 'Starred', label: t('notifications.starred'), count: store.starredMessages.length },
]);

const filteredMessages = computed(() => {
  return store.messages.filter(m => {
    if (activeTab.value === 'Unread') return !m.isRead;
    if (activeTab.value === 'Alerts') return m.category === 'alerts';
    if (activeTab.value === 'Updates') return m.category === 'updates';
    if (activeTab.value === 'Starred') return m.starred;
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase();
      return m.subject.toLowerCase().includes(q) || m.sender.toLowerCase().includes(q);
    }
    return true;
  });
});

const handleRead = (msg) => {
  if (!msg.isRead) store.markAsRead(msg.id);
};

const handleStar = (msg) => {
  store.toggleStar(msg.id);
};

const handleArchive = (msg) => {
  store.archiveMessage(msg.id);
};
</script>

<style scoped>
.view-content { width: 100%; }

.action-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 10px;
  padding: 8px 14px;
}
.search-box i { color: #94A3B8; font-size: 13px; }
.search-box input {
  border: none;
  outline: none;
  font-size: 13px;
  font-weight: 500;
  color: #1E293B;
  background: transparent;
  width: 220px;
}

.compose-btn {
  background: #F96116 !important;
  border-color: #F96116 !important;
  border-radius: 12px !important;
  font-weight: 700 !important;
  font-size: 13px !important;
  padding: 10px 24px !important;
}
.compose-btn:hover { background: #e05510 !important; }

.tabs-row {
  display: flex;
  gap: 28px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 20px;
}
.tab-item {
  padding-bottom: 12px;
  font-size: 13px;
  font-weight: 700;
  color: #94A3B8;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 3px solid transparent;
}
.tab-item:hover { color: #64748B; }
.tab-active { color: #3d63a1; border-bottom-color: #3d63a1; }
.tab-count {
  font-weight: 700;
  color: inherit;
}

/* Main card */
.content-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

/* Notification rows */
.notif-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 18px 24px;
  border-bottom: 1px solid #F8FAFC;
  cursor: pointer;
  transition: background 0.1s;
}
.notif-row:hover { background: #FAFBFC; }
.notif-row:last-child { border-bottom: none; }
.notif-row.unread { background: #F8FAFF; }

/* Icon */
.notif-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
  margin-top: 2px;
}
.icon-green { background: #EAF8F0; color: #3D9F7D; }
.icon-red { background: #FEECEB; color: #E02424; }
.icon-blue { background: #E3F3FF; color: #2563EB; }
.icon-gray { background: #F3F4F6; color: #64748B; }

/* Content */
.notif-content { flex: 1; min-width: 0; }
.notif-header-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 2px;
}
.notif-sender {
  font-size: 12px;
  font-weight: 700;
  color: #64748B;
}
.unread .notif-sender { color: #374151; }

.notif-label {
  font-size: 9px;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}
.label-red { background: #FEECEB; color: #E02424; }

.notif-subject {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.unread .notif-subject { font-weight: 800; color: #1E293B; }

.notif-preview {
  font-size: 12px;
  color: #94A3B8;
  margin: 4px 0 0 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Right side */
.notif-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  flex-shrink: 0;
}
.notif-time {
  font-size: 11px;
  font-weight: 600;
  color: #94A3B8;
}
.unread .notif-time { color: #374151; font-weight: 700; }

.notif-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.15s;
}
.notif-row:hover .notif-actions { opacity: 1; }

.notif-action {
  width: 28px;
  height: 28px;
  border: none;
  background: #F3F4F6;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #64748B;
  transition: background 0.1s;
}
.notif-action:hover { background: #E2E8F0; }

.empty-state {
  padding: 80px;
  text-align: center;
  color: #94A3B8;
}
.empty-state i { font-size: 48px; display: block; margin-bottom: 12px; }
.empty-state p { font-size: 14px; font-weight: 600; margin: 0; }

/* Compose */
.compose-label {
  font-size: 11px;
  font-weight: 700;
  color: #64748B;
  text-transform: uppercase;
}
.send-btn {
  background: #3d63a1 !important;
  border-color: #3d63a1 !important;
  border-radius: 10px !important;
  font-weight: 700 !important;
}
</style>
