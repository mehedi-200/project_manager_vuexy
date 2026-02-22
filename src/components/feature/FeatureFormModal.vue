<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Feature, Phase } from '@/types/index.ts'
import { useTheme } from '@/composables/useTheme.ts'

const props = defineProps<{
  mode: 'create' | 'edit'
  feature?: Feature
  projectId: number
  phases: Phase[]
  features: Feature[]
}>()

const emit = defineEmits<{
  (e: 'saved', data: Partial<Feature>): void
  (e: 'close'): void
}>()

const form = ref<Partial<Feature>>({
  title: '',
  description: '',
  phase_id: undefined,
  priority: 'medium',
  status: 'pending',
  estimated_hours: undefined,
  day_number: undefined,
  serial_number: undefined,
  dependency_feature_id: null,
})

const errors = ref<Record<string, string>>({})
const { isDark } = useTheme()

watch(
  () => props.feature,
  (f) => {
    if (f) {
      form.value = {
        title: f.title,
        description: f.description ?? '',
        phase_id: f.phase_id,
        priority: f.priority,
        status: f.status,
        estimated_hours: f.estimated_hours,
        day_number: f.day_number,
        serial_number: f.serial_number,
        dependency_feature_id: f.dependency_feature_id ?? null,
      }
    } else {
      const maxSerial = props.features.reduce((max, f) => Math.max(max, f.serial_number ?? 0), 0)
      form.value = {
        title: '', description: '', phase_id: undefined,
        priority: 'medium', status: 'pending',
        estimated_hours: undefined, day_number: undefined,
        serial_number: maxSerial + 1, dependency_feature_id: null,
      }
    }
  },
  { immediate: true }
)

function otherFeatures() {
  if (!props.feature) return props.features
  return props.features.filter(f => f.id !== props.feature!.id)
}

function handleSubmit() {
  errors.value = {}
  if (!form.value.title?.trim()) {
    errors.value.title = 'Title is required'
    return
  }
  const payload = { ...form.value }
  if (!payload.phase_id) delete payload.phase_id
  if (!payload.dependency_feature_id) payload.dependency_feature_id = null
  emit('saved', payload)
}
</script>

<template>
  <teleport to="body">
    <div class="modal-overlay" @click.self="$emit('close')">
      <div :class="['modal-box', { dark: isDark }]">
        <div class="modal-header">
          <h2 class="modal-title">{{ mode === 'create' ? '➕ New Feature' : '✏️ Edit Feature' }}</h2>
          <button class="modal-close" @click="$emit('close')">✕</button>
        </div>

        <form class="modal-form" @submit.prevent="handleSubmit">
          <div class="form-group">
            <label class="form-label">Title <span class="required">*</span></label>
            <input v-model="form.title" type="text" class="form-input" :class="{ error: errors.title }" placeholder="Feature title" />
            <span v-if="errors.title" class="form-error">{{ errors.title }}</span>
          </div>

          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea v-model="form.description" class="form-input form-textarea" placeholder="Describe the feature..."></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Phase</label>
              <select v-model="form.phase_id" class="form-input form-select">
                <option :value="undefined">No phase</option>
                <option v-for="p in phases" :key="p.id" :value="p.id">{{ p.name }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Priority</label>
              <select v-model="form.priority" class="form-input form-select">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Status</label>
              <select v-model="form.status" class="form-input form-select">
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Estimated Hours</label>
              <input v-model.number="form.estimated_hours" type="number" min="0" step="0.5" class="form-input" placeholder="0" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Day Number</label>
              <input v-model.number="form.day_number" type="number" min="1" class="form-input" placeholder="1" />
            </div>
            <div class="form-group">
              <label class="form-label">Serial Number</label>
              <input v-model.number="form.serial_number" type="number" min="1" class="form-input" placeholder="1" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Depends On</label>
            <select v-model="form.dependency_feature_id" class="form-input form-select">
              <option :value="null">No dependency</option>
              <option v-for="f in otherFeatures()" :key="f.id" :value="f.id">
                {{ f.serial_number ? `#${f.serial_number} ` : '' }}{{ f.title }}
              </option>
            </select>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-cancel" @click="$emit('close')">Cancel</button>
            <button type="submit" class="btn-primary">
              {{ mode === 'create' ? 'Create Feature' : 'Save Changes' }}
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
  z-index: 8000; padding: 16px; overflow-y: auto;
}
.modal-box {
  background: white; border-radius: 16px; width: 100%; max-width: 600px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.25); overflow: hidden; margin: auto;
}
.modal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 24px; border-bottom: 1px solid rgba(102,126,234,0.15);
  position: sticky; top: 0; background: white; z-index: 1;
}
.modal-title { font-size: 18px; font-weight: 700; }
.modal-close {
  background: none; border: none; font-size: 18px; cursor: pointer;
  opacity: 0.5; padding: 4px 8px; border-radius: 6px; color: inherit;
}
.modal-close:hover { opacity: 1; background: rgba(0,0,0,0.06); }
.modal-form { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
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
.form-textarea { resize: vertical; min-height: 80px; }
.form-select { cursor: pointer; }
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

@media (max-width: 480px) {
  .form-row { grid-template-columns: 1fr; }
}

/* Dark mode */
.modal-box.dark { background: #1e2435; color: #e2e8f0; }
.modal-box.dark .modal-header { background: #1e2435; border-bottom-color: rgba(255,255,255,0.08); }
.modal-box.dark .form-input { background: #252d40; border-color: rgba(255,255,255,0.12); color: #e2e8f0; }
.modal-box.dark .btn-cancel { background: #252d40; border-color: rgba(255,255,255,0.12); color: #a0aec0; }
.modal-box.dark .btn-cancel:hover { background: #2a3349; }
</style>
