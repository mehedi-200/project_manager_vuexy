<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2 class="auth-title">Register</h2>
      <form class="auth-form" @submit.prevent="submitForm">
        <div class="form-group">
          <label for="name">Name</label>
          <input
            type="text"
            id="name"
            v-model="user.name"
            placeholder="Enter your name"
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="user.email"
            placeholder="Enter your email"
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label for="new-password">New Password</label>
          <input
            type="password"
            id="new-password"
            v-model="user.password"
            placeholder="Enter new password"
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label for="confirm-password">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            v-model="user.password_confirmation"
            placeholder="Confirm your password"
            class="form-input"
          />
        </div>
        <button type="submit" class="btn-submit">Register</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { authStore } from '@/stores/authStore.ts';
import { reactive } from 'vue'
const store = authStore();
interface User {
  name:string,
  email:string,
  password:string,
  password_confirmation:string
}

const user = reactive <User>({
  name:'',
  email:'',
  password:'',
  password_confirmation:'',

})
const submitForm = async ()=>{
  try
  {
    const res = await store.register(user);
  }
  catch (e:any)
  {
    console.log(e.message);
  }
}

</script>

<style src="../assets/auth.css"></style>
