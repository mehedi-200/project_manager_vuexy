<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2 class="auth-title">Login</h2>
      <form class="auth-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            placeholder="Enter your email" 
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input 
            type="password" 
            id="password" 
            placeholder="Enter your password" 
            class="form-input"
          />
        </div>
        <button type="submit" class="btn-submit">Login</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style src="../assets/auth.css"></style>
