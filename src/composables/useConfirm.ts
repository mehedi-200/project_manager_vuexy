import { ref } from 'vue'

const isOpen = ref(false)
const message = ref('')
let _resolve: ((value: boolean) => void) | null = null

function ask(msg: string): Promise<boolean> {
  message.value = msg
  isOpen.value = true
  return new Promise(resolve => {
    _resolve = resolve
  })
}

function confirm() {
  isOpen.value = false
  _resolve?.(true)
  _resolve = null
}

function cancel() {
  isOpen.value = false
  _resolve?.(false)
  _resolve = null
}

export function useConfirm() {
  return { isOpen, message, confirm, cancel, ask }
}
