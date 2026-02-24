<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { Feature } from '@/types/index.ts'
import { useTheme } from '@/composables/useTheme.ts'

const props = defineProps<{
  mode: 'create' | 'edit'
  feature?: Feature
  projectId: number
}>()

const emit = defineEmits<{
  (e: 'saved', data: object): void
  (e: 'close'): void
}>()

interface FormData {
  title: string
  description: string
  status: number
  priority: number
  start_date: string
  start_time: string
  end_date: string
  end_time: string
  order: number | undefined
}

const form = ref<FormData>({
  title: '', description: '', status: 1, priority: 2,
  start_date: '', start_time: '09:00:00',
  end_date: '', end_time: '18:00:00',
  order: undefined,
})

const errors = ref<Record<string, string>>({})
const { isDark } = useTheme()

// Today's date string yyyy-mm-dd
const todayStr = new Date().toISOString().slice(0, 10)

// Calculated estimated hours (live)
const estimatedHours = computed(() => {
  if (!form.value.start_date || !form.value.start_time || !form.value.end_date || !form.value.end_time) return null
  const start = new Date(`${form.value.start_date}T${form.value.start_time}`)
  const end   = new Date(`${form.value.end_date}T${form.value.end_time}`)
  const diffMs = end.getTime() - start.getTime()
  if (diffMs <= 0) return null
  return Math.round(diffMs / 3600000 * 10) / 10  // hours with 1 decimal
})

// Min end time when dates are the same (start_time + 1 hour)
const minEndTime = computed(() => {
  if (form.value.start_date && form.value.end_date && form.value.start_date === form.value.end_date && form.value.start_time) {
    const parts = form.value.start_time.split(':').map(Number)
    const h = parts[0] ?? 0
    const m = parts[1] ?? 0
    const s = parts[2] ?? 0
    const minH = h + 1
    if (minH > 23) return null  // can't fit, will be caught in validation
    return `${String(minH).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
  }
  return null
})

watch(
  () => props.feature,
  (f) => {
    if (f) {
      form.value = {
        title: f.title,
        description: f.description ?? '',
        status: f.status.value,
        priority: f.priority.value,
        start_date: f.start_date ?? '',
        start_time: f.start_time ?? '09:00:00',
        end_date: f.end_date ?? '',
        end_time: f.end_time ?? '18:00:00',
        order: f.order,
      }
    } else {
      form.value = {
        title: '', description: '', status: 1, priority: 2,
        start_date: '', start_time: '09:00:00',
        end_date: '', end_time: '18:00:00',
        order: undefined,
      }
    }
  },
  { immediate: true }
)

// When start_date changes, reset end_date if it's now before start
watch(() => form.value.start_date, (newStart) => {
  if (form.value.end_date && form.value.end_date < newStart) {
    form.value.end_date = newStart
  }
  errors.value.start_date = ''
  errors.value.end_date = ''
})

// When end_date changes clear end errors
watch(() => form.value.end_date, () => { errors.value.end_date = '' })
watch(() => form.value.end_time, () => { errors.value.end_time = '' })

function toDateTime(date: string, time: string): Date {
  return new Date(`${date}T${time}`)
}

function handleSubmit() {
  errors.value = {}
  let valid = true

  if (!form.value.title?.trim()) {
    errors.value.title = 'Title is required'
    valid = false
  }
  if (!form.value.start_date) {
    errors.value.start_date = 'Start date is required'
    valid = false
  } else if (form.value.start_date < todayStr) {
    errors.value.start_date = 'Start date cannot be in the past'
    valid = false
  }
  if (!form.value.start_time) {
    errors.value.start_time = 'Start time is required'
    valid = false
  }
  if (!form.value.end_date) {
    errors.value.end_date = 'End date is required'
    valid = false
  } else if (form.value.end_date < form.value.start_date) {
    errors.value.end_date = 'End date cannot be before start date'
    valid = false
  }
  if (!form.value.end_time) {
    errors.value.end_time = 'End time is required'
    valid = false
  }

  // Same-date: end time must be >= start time + 1 hour
  if (
    valid &&
    form.value.start_date &&
    form.value.end_date &&
    form.value.start_date === form.value.end_date
  ) {
    const start = toDateTime(form.value.start_date, form.value.start_time)
    const end   = toDateTime(form.value.end_date,   form.value.end_time)
    const diffHours = (end.getTime() - start.getTime()) / 3600000
    if (diffHours < 1) {
      errors.value.end_time = 'When dates are the same, end time must be at least 1 hour after start time'
      valid = false
    }
  }

  if (!valid) return

  const payload: Record<string, any> = {
    title: form.value.title.trim(),
    description: form.value.description || undefined,
    status: form.value.status,
    priority: form.value.priority,
    start_date: form.value.start_date,
    start_time: form.value.start_time,
    end_date: form.value.end_date,
    end_time: form.value.end_time,
    order: form.value.order ?? undefined,
    estimated_hours: estimatedHours.value ?? undefined,
  }
  // remove undefined keys
  Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k])
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
          <!-- Title -->
          <div class="form-group">
            <label class="form-label">Title <span class="required">*</span></label>
            <input v-model="form.title" type="text" class="form-input" :class="{ error: errors.title }" placeholder="Feature title" maxlength="255" />
            <span v-if="errors.title" class="form-error">{{ errors.title }}</span>
          </div>

          <!-- Description -->
          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea v-model="form.description" class="form-input form-textarea" placeholder="Describe the feature..."></textarea>
          </div>

          <!-- Status / Priority -->
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Status <span class="required">*</span></label>
              <select v-model.number="form.status" class="form-input form-select">
                <option :value="1">⏳ Pending</option>
                <option :value="2">🔄 In Progress</option>
                <option :value="3">✅ Completed</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Priority <span class="required">*</span></label>
              <select v-model.number="form.priority" class="form-input form-select">
                <option :value="1">🟢 Low</option>
                <option :value="2">🟡 Medium</option>
                <option :value="3">🔴 High</option>
              </select>
            </div>
          </div>

          <!-- Start Date / Time -->
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Start Date <span class="required">*</span></label>
              <input
                v-model="form.start_date"
                type="date"
                class="form-input"
                :class="{ error: errors.start_date }"
                :min="todayStr"
              />
              <span v-if="errors.start_date" class="form-error">{{ errors.start_date }}</span>
            </div>
            <div class="form-group">
              <label class="form-label">Start Time <span class="required">*</span></label>
              <input v-model="form.start_time" type="time" step="1" class="form-input" :class="{ error: errors.start_time }" />
              <span v-if="errors.start_time" class="form-error">{{ errors.start_time }}</span>
            </div>
          </div>

          <!-- End Date / Time -->
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">End Date <span class="required">*</span></label>
              <input
                v-model="form.end_date"
                type="date"
                class="form-input"
                :class="{ error: errors.end_date }"
                :min="form.start_date || todayStr"
              />
              <span v-if="errors.end_date" class="form-error">{{ errors.end_date }}</span>
            </div>
            <div class="form-group">
              <label class="form-label">End Time <span class="required">*</span></label>
              <input
                v-model="form.end_time"
                type="time"
                step="1"
                class="form-input"
                :class="{ error: errors.end_time }"
                :min="minEndTime || undefined"
              />
              <span v-if="errors.end_time" class="form-error">{{ errors.end_time }}</span>
            </div>
          </div>

          <!-- Estimated Hours (read-only, auto-calculated) -->
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">
                Estimated Hours
                <span class="auto-badge">auto</span>
              </label>
              <div class="calc-display">
                <span v-if="estimatedHours !== null">{{ estimatedHours }} hrs</span>
                <span v-else class="calc-placeholder">Fill dates &amp; times to calculate</span>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Order</label>
              <input v-model.number="form.order" type="number" min="0" class="form-input" placeholder="0" />
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-cancel" @click="$emit('close')">Cancel</button>
            <button type="submit" class="btn-primary">{{ mode === 'create' ? 'Create Feature' : 'Save Changes' }}</button>
          </div>
        </form>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 8000; padding: 16px; overflow-y: auto; }
.modal-box { background: white; border-radius: 16px; width: 100%; max-width: 600px; box-shadow: 0 20px 60px rgba(0,0,0,0.25); overflow: hidden; margin: auto; }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid rgba(102,126,234,0.15); position: sticky; top: 0; background: white; z-index: 1; }
.modal-title { font-size: 18px; font-weight: 700; }
.modal-close { background: none; border: none; font-size: 18px; cursor: pointer; opacity: 0.5; padding: 4px 8px; border-radius: 6px; color: inherit; }
.modal-close:hover { opacity: 1; background: rgba(0,0,0,0.06); }
.modal-form { padding: 24px; display: flex; flex-direction: column; gap: 16px; max-height: 75vh; overflow-y: auto; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-label { font-size: 13px; font-weight: 600; opacity: 0.75; display: flex; align-items: center; gap: 6px; }
.required { color: #f44336; }
.auto-badge { font-size: 10px; font-weight: 700; background: rgba(102,126,234,0.15); color: #667eea; border-radius: 4px; padding: 2px 5px; text-transform: uppercase; letter-spacing: 0.04em; }
.form-input { padding: 10px 14px; border: 1px solid rgba(102,126,234,0.25); border-radius: 8px; font-size: 14px; outline: none; transition: border-color 0.2s; background: inherit; color: inherit; width: 100%; box-sizing: border-box; }
.form-input:focus { border-color: #667eea; box-shadow: 0 0 0 3px rgba(102,126,234,0.12); }
.form-input.error { border-color: #f44336; }
.form-textarea { resize: vertical; min-height: 80px; }
.form-select { cursor: pointer; }
.form-error { font-size: 12px; color: #f44336; }
.calc-display { padding: 10px 14px; border: 1px dashed rgba(102,126,234,0.3); border-radius: 8px; font-size: 14px; font-weight: 600; color: #667eea; background: rgba(102,126,234,0.05); min-height: 42px; display: flex; align-items: center; }
.calc-placeholder { font-weight: 400; opacity: 0.5; font-size: 13px; color: inherit; }
.modal-footer { display: flex; justify-content: flex-end; gap: 12px; padding-top: 8px; }
.btn-cancel { padding: 10px 22px; background: #f5f5f5; border: 1px solid #ddd; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; color: #555; transition: all 0.2s; }
.btn-cancel:hover { background: #ebebeb; }
.btn-primary { padding: 10px 22px; background: linear-gradient(135deg,#667eea 0%,#764ba2 100%); color: white; border: none; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(102,126,234,0.3); }
.btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(102,126,234,0.4); }
@media (max-width: 480px) { .form-row { grid-template-columns: 1fr; } }
.modal-box.dark { background: #1e2435; color: #e2e8f0; }
.modal-box.dark .modal-header { background: #1e2435; border-bottom-color: rgba(255,255,255,0.08); }
.modal-box.dark .form-input { background: #252d40; border-color: rgba(255,255,255,0.12); color: #e2e8f0; }
.modal-box.dark .calc-display { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.12); }
.modal-box.dark .btn-cancel { background: #252d40; border-color: rgba(255,255,255,0.12); color: #a0aec0; }
.modal-box.dark .btn-cancel:hover { background: #2a3349; }
</style>
