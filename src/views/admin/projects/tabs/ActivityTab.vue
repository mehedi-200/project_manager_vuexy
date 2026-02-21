<template>
  <div class="activity-tab">
    <div class="activity-placeholder">
      <div class="activity-icon">📜</div>
      <h3 class="activity-title">Activity Coming Soon</h3>
      <p class="activity-message">
        Project activity feed and audit log will be available here. Stay tuned!
      </p>
    </div>
  </div>
</template>

<style scoped>
.activity-tab {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
}

.activity-placeholder {
  text-align: center;
  max-width: 400px;
}

.activity-icon { font-size: 64px; margin-bottom: 16px; opacity: 0.6; }
.activity-title { font-size: 22px; font-weight: 700; margin-bottom: 10px; }
.activity-message { font-size: 15px; opacity: 0.6; line-height: 1.6; }
</style>
