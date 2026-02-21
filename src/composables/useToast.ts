import { ref } from 'vue'

export interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
}

// singleton — module-level ref shared across components
const toasts = ref<Toast[]>([])
let _id = 0

function addToast(message: string, type: Toast['type'] = 'info') {
  const id = ++_id
  toasts.value.push({ id, message, type })
  setTimeout(() => removeToast(id), 3000)
}

function removeToast(id: number) {
  toasts.value = toasts.value.filter(t => t.id !== id)
}

export function useToast() {
  return { toasts, addToast, removeToast }
}
