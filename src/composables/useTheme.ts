import { ref } from 'vue'

// Module-level singleton — shared across all components
const isDark = ref(
  typeof localStorage !== 'undefined'
    ? (localStorage.getItem('admin-theme') ?? localStorage.getItem('theme')) === 'dark'
    : false
)

export function useTheme() {
  function setDark(dark: boolean) {
    isDark.value = dark
  }
  return { isDark, setDark }
}
