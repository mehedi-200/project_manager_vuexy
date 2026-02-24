<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { Project } from '@/types/index.ts'
import { useTheme } from '@/composables/useTheme.ts'

const props = defineProps<{
  mode: 'create' | 'edit'
  project?: Project
}>()

const emit = defineEmits<{
  (e: 'saved', data: Partial<Project>): void
  (e: 'close'): void
}>()

const form = ref({
  name: '',
  description: '',
  start_date: '',
  deadline: '',
  is_active: 1 as 0 | 1,
})

const errors = ref<Record<string, string>>({})
const { isDark } = useTheme()
const today = computed(() => new Date().toISOString().split('T')[0])

watch(
  () => props.project,
  (p) => {
    errors.value = {}
    if (p) {
      form.value = {
        name: p.name,
        description: p.description ?? '',
        start_date: p.start_date ?? '',
        deadline: p.deadline ?? '',
        is_active: p.is_active,
      }
    } else {
      form.value = { name: '', description: '', start_date: '', deadline: '', is_active: 1 }
    }
  },
  { immediate: true }
)

function validate(): boolean {
  const e: Record<string, string> = {}

  if (!form.value.name.trim()) {
    e.name = 'Project name is required.'
  } else if (form.value.name.trim().length < 3) {
    e.name = 'Name must be at least 3 characters.'
  } else if (form.value.name.trim().length > 100) {
    e.name = 'Name must not exceed 100 characters.'
  }

  if (!form.value.start_date) {
    e.start_date = 'Start date is required.'
  } else if (form.value.start_date < (today.value ?? '')) {
    e.start_date = 'Start date cannot be in the past.'
  } else if (form.value.deadline && form.value.start_date >= form.value.deadline) {
    e.start_date = 'Start date cannot be the same as or after the deadline.'
  }

  if (!form.value.deadline) {
    e.deadline = 'Deadline is required.'
  } else if (form.value.deadline < (today.value ?? '')) {
    e.deadline = 'Deadline cannot be in the past.'
  } else if (form.value.start_date && form.value.deadline <= form.value.start_date) {
    e.deadline = 'Deadline cannot be the same as or before the start date.'
  }

  errors.value = e
  return Object.keys(e).length === 0
}

function clearError(field: string) {
  if (errors.value[field]) delete errors.value[field]
}

function close() {
  errors.value = {}
  emit('close')
}

function handleSubmit() {
  if (!validate()) return
  emit('saved', { ...form.value })
}
</script>

<template>
  <teleport to="body">
    <div class="modal-overlay" >      <div :class="['modal-box', { dark: isDark }]">

        <div class="modal-header">
          <h2 class="modal-title">{{ mode === 'create' ? '➕ New Project' : '✏️ Edit Project' }}</h2>
          <button type="button" class="modal-close" @click="close">✕</button>
        </div>

        <form class="modal-form" @submit.prevent="handleSubmit" novalidate>

          <!-- Name -->
          <div class="form-group">
            <label class="form-label">
              Project Name <span class="required">*</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              class="form-input"
              :class="{ 'is-error': errors.name }"
              placeholder="Enter project name"
              maxlength="100"
              @input="clearError('name')"
            />
            <span v-if="errors.name" class="form-error">{{ errors.name }}</span>
          </div>

          <!-- Description -->
          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea
              v-model="form.description"
              class="form-input form-textarea"
              placeholder="Project description..."
            ></textarea>
          </div>

          <!-- Dates -->
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Start Date</label>
              <input
                v-model="form.start_date"
                type="date"
                class="form-input"
                :class="{ 'is-error': errors.start_date }"
                :min="today"
                @change="clearError('start_date'); clearError('deadline')"
              />
              <span v-if="errors.start_date" class="form-error">{{ errors.start_date }}</span>
            </div>
            <div class="form-group">
              <label class="form-label">Deadline</label>
              <input
                v-model="form.deadline"
                type="date"
                class="form-input"
                :class="{ 'is-error': errors.deadline }"
                :min="form.start_date || today"
                @change="clearError('deadline'); clearError('start_date')"
              />
              <span v-if="errors.deadline" class="form-error">{{ errors.deadline }}</span>
            </div>
          </div>

          <!-- Status -->
          <div class="form-group">
            <label class="form-label">Status</label>
            <select v-model="form.is_active" class="form-input form-select">
              <option :value="1">Active</option>
              <option :value="0">Inactive</option>
            </select>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-cancel" @click="close">Cancel</button>
            <button type="submit" class="btn-primary">
              {{ mode === 'create' ? 'Create Project' : 'Save Changes' }}
            </button>
          </div>

        </form>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 8000;
  padding: 16px;
}

.modal-box {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 560px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(102, 126, 234, 0.15);
}

.modal-title { font-size: 18px; font-weight: 700; }

.modal-close {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  opacity: 0.5;
  padding: 4px 8px;
  border-radius: 6px;
  color: inherit;
}
.modal-close:hover { opacity: 1; background: rgba(0,0,0,0.06); }

.modal-form { padding: 24px; display: flex; flex-direction: column; gap: 18px; }

.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

.form-group { display: flex; flex-direction: column; gap: 6px; }

.form-label { font-size: 13px; font-weight: 600; opacity: 0.75; }

.required { color: #f44336; }

.form-input {
  padding: 10px 14px;
  border: 1px solid rgba(102, 126, 234, 0.25);
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
  background: inherit;
  color: inherit;
}
.form-input:focus { border-color: #667eea; box-shadow: 0 0 0 3px rgba(102,126,234,0.12); }
.form-input.is-error { border-color: #f44336; }

.form-textarea { resize: vertical; min-height: 90px; }
.form-select { cursor: pointer; }

.form-error { font-size: 12px; color: #b71c1c; font-weight: 500; }

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 8px;
}

.btn-cancel {
  padding: 10px 22px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  color: #555;
  transition: all 0.2s;
}
.btn-cancel:hover { background: #ebebeb; }

.btn-primary {
  padding: 10px 22px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102,126,234,0.3);
}
.btn-primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(102,126,234,0.4); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

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
