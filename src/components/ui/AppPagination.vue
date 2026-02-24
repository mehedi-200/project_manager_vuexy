<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  currentPage: number
  lastPage: number
  total: number
  perPage: number
  from: number
  to: number
}>()

const emit = defineEmits<{
  (e: 'change', page: number): void
  (e: 'perPageChange', perPage: number): void
}>()

const perPageOptions = [5, 10, 15, 20, 30, 50, 100]

const pages = computed(() => {
  const total = props.lastPage
  const cur = props.currentPage
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const result: (number | '...')[] = [1]
  if (cur > 3) result.push('...')
  for (let i = Math.max(2, cur - 1); i <= Math.min(total - 1, cur + 1); i++) result.push(i)
  if (cur < total - 2) result.push('...')
  result.push(total)
  return result
})

function go(page: number | '...') {
  if (page === '...' || page === props.currentPage) return
  emit('change', page as number)
}

function refresh() {
  emit('change', props.currentPage)
}
</script>

<template>
  <div v-if="total > 0" class="pg-footer">

    <!-- LEFT: info + refresh -->
    <div class="pg-left">
      <button class="pg-refresh" @click="refresh" title="Refresh">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M23 4v6h-6"/>
          <path d="M1 20v-6h6"/>
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
        </svg>
      </button>
      <span class="pg-info">
        Showing <b>{{ from }}</b> to <b>{{ to }}</b> of <b>{{ total }}</b> entries
      </span>
    </div>

    <!-- RIGHT: per-page + buttons -->
    <div class="pg-right">

      <!-- Per page dropdown -->
      <div class="pg-per-page">
        <select
          :value="perPage"
          class="pg-select"
          @change="emit('perPageChange', Number(($event.target as HTMLSelectElement).value))"
        >
          <option v-for="opt in perPageOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>
        <svg class="pg-select-arrow" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
      </div>

      <!-- Pagination buttons — always visible -->
      <div class="pg-btns">

        <!-- First -->
        <button class="pg-btn" :disabled="currentPage === 1" @click="go(1)" title="First page">
          «
        </button>

        <!-- Prev -->
        <button class="pg-btn" :disabled="currentPage === 1" @click="go(currentPage - 1)" title="Previous">
          ‹
        </button>

        <!-- Page numbers -->
        <template v-for="(page, i) in pages" :key="i">
          <span v-if="page === '...'" class="pg-dots">…</span>
          <button
            v-else
            class="pg-btn pg-num"
            :class="{ 'pg-active': page === currentPage }"
            @click="go(page)"
          >{{ page }}</button>
        </template>

        <!-- Next -->
        <button class="pg-btn" :disabled="currentPage === lastPage" @click="go(currentPage + 1)" title="Next">
          ›
        </button>

        <!-- Last -->
        <button class="pg-btn" :disabled="currentPage === lastPage" @click="go(lastPage)" title="Last page">
          »
        </button>

      </div>
    </div>

  </div>
</template>

<style scoped>
.pg-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 24px;
  padding: 14px 18px;
  background: #ffffff;
  border: 1px solid #e8ecf4;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

/* LEFT */
.pg-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pg-refresh {
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #f1f3f9;
  border: 1px solid #e2e6f0;
  border-radius: 7px;
  cursor: pointer;
  color: #667eea;
  transition: all 0.2s;
  flex-shrink: 0;
}
.pg-refresh:hover {
  background: #667eea;
  border-color: #667eea;
  color: white;
  transform: rotate(180deg);
}

.pg-info {
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
}
.pg-info b {
  color: #1e293b;
  font-weight: 700;
}

/* RIGHT */
.pg-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Per page select */
.pg-per-page {
  position: relative;
  display: inline-flex;
  align-items: center;
}
.pg-select {
  height: 34px;
  padding: 0 28px 0 10px;
  border: 1px solid #e2e6f0;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  background: #f8fafc;
  cursor: pointer;
  appearance: none;
  outline: none;
  transition: border-color 0.2s;
}
.pg-select:hover, .pg-select:focus {
  border-color: #667eea;
}
.pg-select-arrow {
  position: absolute;
  right: 8px;
  pointer-events: none;
  color: #94a3b8;
}

/* Buttons wrapper */
.pg-btns {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Base button */
.pg-btn {
  min-width: 34px;
  height: 34px;
  padding: 0 8px;
  border: 1px solid #e2e6f0;
  background: #f8fafc;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  color: #475569;
  transition: all 0.18s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}
.pg-btn:hover:not(:disabled):not(.pg-active) {
  background: #eef0f8;
  border-color: #c7cee8;
  color: #334155;
}
.pg-btn:disabled {
  opacity: 0.38;
  cursor: not-allowed;
}

/* Page number button */
.pg-num {
  font-size: 13px;
  min-width: 34px;
}

/* Active page */
.pg-active {
  background: #e74c3c !important;
  border-color: #e74c3c !important;
  color: #ffffff !important;
  font-weight: 700;
  box-shadow: 0 3px 10px rgba(231, 76, 60, 0.35);
  cursor: default;
}

/* Ellipsis */
.pg-dots {
  min-width: 28px;
  text-align: center;
  font-size: 14px;
  color: #94a3b8;
  user-select: none;
}

/* Dark layout support */
.admin-layout.dark .pg-footer {
  background: #1e2435;
  border-color: rgba(255,255,255,0.08);
  box-shadow: none;
}
.admin-layout.dark .pg-info { color: #94a3b8; }
.admin-layout.dark .pg-info b { color: #e2e8f0; }
.admin-layout.dark .pg-refresh { background: #252d40; border-color: rgba(255,255,255,0.1); }
.admin-layout.dark .pg-select { background: #252d40; border-color: rgba(255,255,255,0.1); color: #e2e8f0; }
.admin-layout.dark .pg-btn { background: #252d40; border-color: rgba(255,255,255,0.1); color: #a0aec0; }
.admin-layout.dark .pg-btn:hover:not(:disabled):not(.pg-active) { background: #2a3349; }

@media (max-width: 600px) {
  .pg-footer { flex-direction: column; align-items: stretch; }
  .pg-left, .pg-right { justify-content: center; }
  .pg-btns { justify-content: center; flex-wrap: wrap; }
}
</style>
