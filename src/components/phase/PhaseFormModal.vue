<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Phase } from '@/types/index.ts'
import { useTheme } from '@/composables/useTheme.ts'

const props = defineProps<{
  mode: 'create' | 'edit'
  phase?: Phase
  projectId: number
}>()

const emit = defineEmits<{
  (e: 'saved', phase: Partial<Phase>): void
  (e: 'close'): void
}>()

const form = ref({ name: '', order_number: 1 })
const errors = ref<Record<string, string>>({})
const { isDark } = useTheme()

watch(
  () => props.phase,
  (p) => {
    if (p) form.value = { name: p.name, order_number: p.order_number }
    else form.value = { name: '', order_number: 1 }
  },
  { immediate: true }
)

function handleSubmit() {
  errors.value = {}
  if (!form.value.name.trim()) {
    errors.value.name = 'Name is required'
    return
  }
  emit('saved', { ...form.value })
}
</script>

<template>
  <teleport to="body">
    <div class="modal-overlay" @click.self="$emit('close')">
      <div :class="['modal-box', { dark: isDark }]">
        <div class="modal-header">
          <h2 class="modal-title">{{ mode === 'create' ? '➕ New Phase' : '✏️ Edit Phase' }}</h2>
          <button class="modal-close" @click="$emit('close')">✕</button>
        </div>

        <form class="modal-form" @submit.prevent="handleSubmit">
          <div class="form-group">
            <label class="form-label">Name <span class="required">*</span></label>
            <input v-model="form.name" type="text" class="form-input" :class="{ error: errors.name }" placeholder="Phase name" />
            <span v-if="errors.name" class="form-error">{{ errors.name }}</span>
          </div>

          <div class="form-group">
            <label class="form-label">Order Number</label>
            <input v-model.number="form.order_number" type="number" min="1" class="form-input" />
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-cancel" @click="$emit('close')">Cancel</button>
            <button type="submit" class="btn-primary">
              {{ mode === 'create' ? 'Create Phase' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center;
  z-index: 8000; padding: 16px;
}
.modal-box {
  background: white; border-radius: 16px; width: 100%; max-width: 440px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.25); overflow: hidden;
}
.modal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 24px; border-bottom: 1px solid rgba(102,126,234,0.15);
}
.modal-title { font-size: 18px; font-weight: 700; }
.modal-close {
  background: none; border: none; font-size: 18px; cursor: pointer;
  opacity: 0.5; padding: 4px 8px; border-radius: 6px; color: inherit;
}
.modal-close:hover { opacity: 1; background: rgba(0,0,0,0.06); }
.modal-form { padding: 24px; display: flex; flex-direction: column; gap: 18px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-label { font-size: 13px; font-weight: 600; opacity: 0.75; }
.required { color: #f44336; }
.form-input {
  padding: 10px 14px; border: 1px solid rgba(102,126,234,0.25);
  border-radius: 8px; font-size: 14px; outline: none;
  transition: border-color 0.2s; background: inherit; color: inherit;
}
.form-input:focus { border-color: #667eea; box-shadow: 0 0 0 3px rgba(102,126,234,0.12); }
.form-input.error { border-color: #f44336; }
.form-error { font-size: 12px; color: #f44336; }
.modal-footer { display: flex; justify-content: flex-end; gap: 12px; padding-top: 8px; }
.btn-cancel {
  padding: 10px 22px; background: #f5f5f5; border: 1px solid #ddd;
  border-radius: 10px; font-size: 14px; font-weight: 600;
  cursor: pointer; color: #555; transition: all 0.2s;
}
.btn-cancel:hover { background: #ebebeb; }
.btn-primary {
  padding: 10px 22px; background: linear-gradient(135deg,#667eea 0%,#764ba2 100%);
  color: white; border: none; border-radius: 10px; font-size: 14px;
  font-weight: 600; cursor: pointer; transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102,126,234,0.3);
}
.btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(102,126,234,0.4); }

/* Dark mode */
.modal-box.dark { background: #1e2435; color: #e2e8f0; }
.modal-box.dark .modal-header { border-bottom-color: rgba(255,255,255,0.08); }
.modal-box.dark .form-input { background: #252d40; border-color: rgba(255,255,255,0.12); color: #e2e8f0; }
.modal-box.dark .btn-cancel { background: #252d40; border-color: rgba(255,255,255,0.12); color: #a0aec0; }
.modal-box.dark .btn-cancel:hover { background: #2a3349; }
</style>
