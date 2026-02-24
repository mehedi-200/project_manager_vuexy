<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Feature, ChecklistItem, Comment } from '@/types/index.ts'
import Badge from '@/components/ui/Badge.vue'
import { addChecklistItem, updateChecklistItem, deleteChecklistItem } from '@/api/checklistApi.ts'
import { addComment, deleteComment } from '@/api/commentsApi.ts'
import { authStore } from '@/stores/authStore.ts'
import { useToast } from '@/composables/useToast.ts'
import { useTheme } from '@/composables/useTheme.ts'

const props = defineProps<{
  feature: Feature | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { addToast } = useToast()
const store = authStore()
const { isDark } = useTheme()

const checklist = ref<ChecklistItem[]>([])
const comments = ref<Comment[]>([])
const newChecklistTitle = ref('')
const newComment = ref('')
const addingChecklist = ref(false)
const postingComment = ref(false)

watch(() => props.feature, () => {
  checklist.value = []
  comments.value = []
}, { immediate: true })

async function handleAddChecklist() {
  if (!newChecklistTitle.value.trim() || !props.feature) return
  addingChecklist.value = true
  try {
    const res = await addChecklistItem(props.feature.id, { title: newChecklistTitle.value.trim() })
    checklist.value.push(res.data.data)
    newChecklistTitle.value = ''
  } catch { addToast('Failed to add checklist item', 'error') }
  finally { addingChecklist.value = false }
}

async function handleToggleChecklist(item: ChecklistItem) {
  const prev = item.is_completed
  item.is_completed = !item.is_completed
  try { await updateChecklistItem(item.id, { is_completed: item.is_completed }) }
  catch { item.is_completed = prev; addToast('Failed to update item', 'error') }
}

async function handleDeleteChecklist(item: ChecklistItem) {
  checklist.value = checklist.value.filter(c => c.id !== item.id)
  try { await deleteChecklistItem(item.id) }
  catch { checklist.value.push(item); addToast('Failed to delete item', 'error') }
}

async function handlePostComment() {
  if (!newComment.value.trim() || !props.feature) return
  postingComment.value = true
  try {
    const res = await addComment(props.feature.id, { comment: newComment.value.trim() })
    comments.value.unshift(res.data.data)
    newComment.value = ''
  } catch { addToast('Failed to post comment', 'error') }
  finally { postingComment.value = false }
}

async function handleDeleteComment(comment: Comment) {
  comments.value = comments.value.filter(c => c.id !== comment.id)
  try { await deleteComment(comment.id) }
  catch { comments.value.unshift(comment); addToast('Failed to delete comment', 'error') }
}

function formatDate(d?: string) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

function formatTime(t?: string) {
  if (!t) return '—'
  return t.substring(0, 5)
}
</script>

<template>
  <teleport to="body">
    <transition name="drawer">
      <div v-if="feature" class="drawer-overlay">
        <div :class="['drawer', { dark: isDark }]">
          <div class="drawer-header">
            <div class="drawer-title-row">
              <h2 class="drawer-title">{{ feature.title }}</h2>
              <button class="drawer-close" @click="$emit('close')">✕</button>
            </div>
            <div class="drawer-badges">
              <Badge type="feature-status" :value="feature.status.value" />
              <Badge type="feature-priority" :value="feature.priority.value" />
              <span v-if="!feature.is_active" class="badge-inactive">⚠️ Inactive</span>
            </div>
          </div>

          <div class="drawer-body">
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Start</span>
                <span class="info-value">{{ formatDate(feature.start_date) }}</span>
                <span class="info-sub">{{ formatTime(feature.start_time) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">End</span>
                <span class="info-value">{{ formatDate(feature.end_date) }}</span>
                <span class="info-sub">{{ formatTime(feature.end_time) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Est. Hours</span>
                <span class="info-value">{{ feature.estimated_hours != null ? feature.estimated_hours + 'h' : '—' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Actual Hours</span>
                <span class="info-value">{{ feature.actual_hours != null ? feature.actual_hours + 'h' : '—' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Order</span>
                <span class="info-value">{{ feature.order ?? '—' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Created By</span>
                <span class="info-value">{{ feature.created_by?.name ?? '—' }}</span>
              </div>
            </div>

            <div v-if="feature.description" class="section">
              <h4 class="section-title">📝 Description</h4>
              <p class="feature-desc">{{ feature.description }}</p>
            </div>

            <div class="section">
              <h4 class="section-title">☑️ Checklist ({{ checklist.filter(c => c.is_completed).length }}/{{ checklist.length }})</h4>
              <div class="progress-bar"><div class="progress-fill" :style="{ width: checklist.length ? (checklist.filter(c => c.is_completed).length / checklist.length * 100) + '%' : '0%' }"></div></div>
              <div class="checklist-list">
                <div v-for="item in checklist" :key="item.id" class="checklist-item">
                  <input type="checkbox" :checked="item.is_completed" class="checklist-checkbox" @change="handleToggleChecklist(item)" />
                  <span :class="['checklist-text', { completed: item.is_completed }]">{{ item.title }}</span>
                  <button class="icon-btn-sm" @click="handleDeleteChecklist(item)">🗑️</button>
                </div>
              </div>
              <div class="add-row">
                <input v-model="newChecklistTitle" type="text" class="add-input" placeholder="Add checklist item..." @keydown.enter.prevent="handleAddChecklist" />
                <button class="btn-add" :disabled="addingChecklist" @click="handleAddChecklist">{{ addingChecklist ? '...' : '+ Add' }}</button>
              </div>
            </div>

            <div class="section">
              <h4 class="section-title">💬 Comments ({{ comments.length }})</h4>
              <div class="comment-input-row">
                <textarea v-model="newComment" class="comment-textarea" placeholder="Write a comment..." rows="2"></textarea>
                <button class="btn-post" :disabled="postingComment" @click="handlePostComment">{{ postingComment ? 'Posting...' : 'Post' }}</button>
              </div>
              <div class="comments-list">
                <div v-if="comments.length === 0" class="no-comments">No comments yet.</div>
                <div v-for="c in comments" :key="c.id" class="comment-item">
                  <div class="comment-avatar">{{ c.user?.name?.charAt(0)?.toUpperCase() ?? '?' }}</div>
                  <div class="comment-content">
                    <div class="comment-meta">
                      <span class="comment-author">{{ c.user?.name ?? 'Unknown' }}</span>
                      <span class="comment-date">{{ formatDate(c.created_at) }}</span>
                      <button v-if="store.user?.id === c.user.id" class="icon-btn-sm" @click="handleDeleteComment(c)">🗑️</button>
                    </div>
                    <p class="comment-text">{{ c.comment }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
.drawer-overlay { position: fixed; inset: 0; z-index: 7000; display: flex; justify-content: flex-end; pointer-events: none; }
.drawer { width: 480px; max-width: 100vw; height: 100%; background: white; box-shadow: -8px 0 32px rgba(0,0,0,0.25); display: flex; flex-direction: column; overflow: hidden; pointer-events: all; }
.drawer-header { padding: 20px 24px; border-bottom: 1px solid rgba(102,126,234,0.15); flex-shrink: 0; }
.drawer-title-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 10px; }
.drawer-title { font-size: 18px; font-weight: 700; line-height: 1.3; flex: 1; }
.drawer-close { background: rgba(102,126,234,0.08); border: 1px solid rgba(102,126,234,0.2); font-size: 16px; cursor: pointer; padding: 6px 10px; border-radius: 8px; color: inherit; flex-shrink: 0; transition: all 0.2s; }
.drawer-close:hover { background: rgba(244,67,54,0.1); border-color: #f44336; color: #f44336; }
.drawer-badges { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.badge-inactive { font-size: 12px; color: #e65100; font-weight: 600; }
.drawer-body { flex: 1; overflow-y: auto; padding: 20px 24px; display: flex; flex-direction: column; gap: 20px; }
.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.info-item { padding: 12px; border: 1px solid rgba(102,126,234,0.12); border-radius: 8px; display: flex; flex-direction: column; gap: 2px; }
.info-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.55; font-weight: 600; }
.info-value { font-size: 14px; font-weight: 600; }
.info-sub { font-size: 12px; opacity: 0.55; }
.section { display: flex; flex-direction: column; gap: 12px; }
.section-title { font-size: 14px; font-weight: 700; opacity: 0.8; }
.feature-desc { font-size: 14px; line-height: 1.6; opacity: 0.75; }
.progress-bar { height: 6px; background: rgba(102,126,234,0.15); border-radius: 3px; overflow: hidden; }
.progress-fill { height: 100%; background: linear-gradient(135deg,#667eea,#764ba2); border-radius: 3px; transition: width 0.3s; }
.checklist-list { display: flex; flex-direction: column; gap: 8px; }
.checklist-item { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 8px; border: 1px solid rgba(102,126,234,0.1); }
.checklist-checkbox { cursor: pointer; width: 16px; height: 16px; accent-color: #667eea; flex-shrink: 0; }
.checklist-text { flex: 1; font-size: 14px; }
.checklist-text.completed { text-decoration: line-through; opacity: 0.5; }
.add-row { display: flex; gap: 8px; }
.add-input { flex: 1; padding: 8px 12px; border: 1px solid rgba(102,126,234,0.25); border-radius: 8px; font-size: 13px; outline: none; background: inherit; color: inherit; }
.add-input:focus { border-color: #667eea; }
.btn-add { padding: 8px 16px; background: rgba(102,126,234,0.1); border: 1px solid rgba(102,126,234,0.3); border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; color: #667eea; white-space: nowrap; transition: all 0.2s; }
.btn-add:hover:not(:disabled) { background: rgba(102,126,234,0.2); }
.btn-add:disabled { opacity: 0.5; cursor: not-allowed; }
.comment-input-row { display: flex; flex-direction: column; gap: 8px; }
.comment-textarea { width: 100%; padding: 10px 14px; border: 1px solid rgba(102,126,234,0.25); border-radius: 8px; font-size: 14px; outline: none; resize: none; background: inherit; color: inherit; box-sizing: border-box; }
.comment-textarea:focus { border-color: #667eea; }
.btn-post { align-self: flex-end; padding: 8px 20px; background: linear-gradient(135deg,#667eea,#764ba2); color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.btn-post:hover:not(:disabled) { opacity: 0.9; }
.btn-post:disabled { opacity: 0.5; cursor: not-allowed; }
.comments-list { display: flex; flex-direction: column; gap: 14px; }
.no-comments { font-size: 13px; opacity: 0.45; text-align: center; padding: 12px 0; }
.comment-item { display: flex; gap: 10px; }
.comment-avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg,#667eea,#764ba2); color: white; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; flex-shrink: 0; }
.comment-content { flex: 1; }
.comment-meta { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; flex-wrap: wrap; }
.comment-author { font-size: 13px; font-weight: 700; }
.comment-date { font-size: 11px; opacity: 0.5; }
.comment-text { font-size: 13px; line-height: 1.5; opacity: 0.8; }
.icon-btn-sm { background: none; border: none; cursor: pointer; font-size: 12px; padding: 2px 4px; border-radius: 4px; opacity: 0.5; color: inherit; }
.icon-btn-sm:hover { opacity: 1; }
.drawer-enter-active .drawer, .drawer-leave-active .drawer { transition: transform 0.3s ease; }
.drawer-enter-from .drawer, .drawer-leave-to .drawer { transform: translateX(100%); }
.drawer.dark { background: #1e2435; color: #e2e8f0; }
.drawer.dark .drawer-header { border-bottom-color: rgba(255,255,255,0.08); }
.drawer.dark .info-item { border-color: rgba(255,255,255,0.08); }
.drawer.dark .add-input, .drawer.dark .comment-textarea { background: #252d40; border-color: rgba(255,255,255,0.12); color: #e2e8f0; }
.drawer.dark .checklist-item { border-color: rgba(255,255,255,0.06); }
@media (max-width: 600px) { .drawer { width: 100vw; } }
</style>
