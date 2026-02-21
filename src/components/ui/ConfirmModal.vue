<script setup lang="ts">
import { useConfirm } from '@/composables/useConfirm.ts'
import { useTheme } from '@/composables/useTheme.ts'

const { isOpen, message, confirm, cancel } = useConfirm()
const { isDark } = useTheme()
</script>

<template>
  <teleport to="body">
    <transition name="modal">
      <div v-if="isOpen" class="confirm-overlay" @click.self="cancel">
        <div :class="['confirm-modal', { dark: isDark }]">
          <div class="confirm-icon">⚠️</div>
          <h3 class="confirm-title">Are you sure?</h3>
          <p class="confirm-message">{{ message }}</p>
          <div class="confirm-actions">
            <button class="btn-cancel" @click="cancel">Cancel</button>
            <button class="btn-delete" @click="confirm">Delete</button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
.confirm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9000;
}

.confirm-modal {
  background: white;
  border-radius: 16px;
  padding: 32px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.confirm-icon { font-size: 48px; margin-bottom: 16px; }
.confirm-title { font-size: 20px; font-weight: 700; margin-bottom: 10px; color: #333; }
.confirm-message { font-size: 15px; color: #666; margin-bottom: 28px; line-height: 1.5; }

.confirm-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn-cancel {
  padding: 10px 24px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  color: #555;
  transition: all 0.2s ease;
}
.btn-cancel:hover { background: #ebebeb; }

.btn-delete {
  padding: 10px 24px;
  background: linear-gradient(135deg, #f44336, #d32f2f);
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  color: white;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
}
.btn-delete:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(244, 67, 54, 0.4); }

.modal-enter-active, .modal-leave-active { transition: all 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .confirm-modal, .modal-leave-to .confirm-modal { transform: scale(0.9); }

/* Dark mode */
.confirm-modal.dark { background: #1e2435; color: #e2e8f0; }
.confirm-modal.dark .confirm-title { color: #e2e8f0; }
.confirm-modal.dark .confirm-message { color: #a0aec0; }
.confirm-modal.dark .btn-cancel {
  background: #252d40; border-color: rgba(255,255,255,0.12); color: #a0aec0;
}
.confirm-modal.dark .btn-cancel:hover { background: #2a3349; }
</style>
