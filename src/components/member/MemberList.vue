<script setup lang="ts">
import type { Member } from '@/types/index.ts'
import Badge from '@/components/ui/Badge.vue'

defineProps<{
  members: Member[]
  currentRole?: string
}>()

const emit = defineEmits<{
  (e: 'remove', member: Member): void
}>()
</script>

<template>
  <div class="member-table-wrap">
    <table class="member-table">
      <thead>
        <tr>
          <th>Member</th>
          <th>Email</th>
          <th>Role</th>
          <th v-if="currentRole !== 'viewer'">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="members.length === 0">
          <td colspan="4" class="empty-row">No members found</td>
        </tr>
        <tr v-for="m in members" :key="m.id" class="member-row">
          <td>
            <div class="member-info">
              <div class="member-avatar">{{ m.name?.charAt(0)?.toUpperCase() ?? '?' }}</div>
              <span class="member-name">{{ m.name ?? '—' }}</span>
            </div>
          </td>
          <td class="member-email">{{ m.email }}</td>
          <td><Badge type="role" :value="m.role" /></td>
          <td v-if="currentRole !== 'viewer'">
            <button
              class="icon-btn delete-btn"
              title="Remove member"
              @click="$emit('remove', m)"
            >🗑️ Remove</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.member-table-wrap {
  overflow-x: auto;
  border-radius: 10px;
  border: 1px solid rgba(102,126,234,0.15);
}

.member-table {
  width: 100%; border-collapse: collapse; font-size: 14px;
}

.member-table th {
  padding: 12px 16px; text-align: left;
  font-size: 12px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.04em;
  opacity: 0.6; border-bottom: 2px solid rgba(102,126,234,0.12);
}

.member-row { transition: background 0.15s; }
.member-row:hover { background: rgba(102,126,234,0.04); }

.member-table td {
  padding: 14px 16px; border-bottom: 1px solid rgba(102,126,234,0.08);
  vertical-align: middle;
}

.member-info { display: flex; align-items: center; gap: 10px; }
.member-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: linear-gradient(135deg,#667eea,#764ba2);
  color: white; display: flex; align-items: center; justify-content: center;
  font-size: 14px; font-weight: 700; flex-shrink: 0;
}
.member-name { font-weight: 600; }
.member-email { opacity: 0.65; font-size: 13px; }

.empty-row { text-align: center; padding: 40px; opacity: 0.5; }

.icon-btn {
  background: none; border: 1px solid rgba(244,67,54,0.3);
  border-radius: 6px; cursor: pointer; padding: 5px 10px;
  font-size: 12px; font-weight: 600; color: #f44336;
  transition: all 0.2s;
}
.icon-btn:hover { background: rgba(244,67,54,0.1); }
</style>
