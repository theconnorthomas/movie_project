<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const handleSignOut = async () => {
  await authStore.signOut()
}
</script>

<template>
  <header class="app-header">
    <div class="header-content">
      <div class="logo-section">
        <RouterLink to="/" class="logo-link">
          <h1>Film Distribution Hub</h1>
        </RouterLink>
      </div>
      
      <nav class="main-nav" v-if="authStore.isAuthenticated">
        <RouterLink to="/" class="nav-link">Dashboard</RouterLink>
        <RouterLink to="/films" class="nav-link">Films</RouterLink>
        <RouterLink to="/distributions" class="nav-link">Distributions</RouterLink>
        <RouterLink to="/analytics" class="nav-link">Analytics</RouterLink>
      </nav>
      
      <div class="auth-section">
        <div v-if="authStore.isAuthenticated" class="user-menu">
          <span class="user-welcome">Welcome, {{ authStore.user?.full_name || 'User' }}</span>
          <button @click="handleSignOut" class="sign-out-btn">Sign Out</button>
        </div>
        <div v-else class="auth-links">
          <RouterLink to="/login" class="auth-link">Sign In</RouterLink>
          <RouterLink to="/register" class="auth-link primary">Sign Up</RouterLink>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  background: #1a1a1a;
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.logo-section h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.logo-link {
  text-decoration: none;
  color: white;
}

.main-nav {
  display: flex;
  gap: 1.5rem;
  flex: 1;
  justify-content: center;
}

.nav-link {
  text-decoration: none;
  color: #ccc;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.2s;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: white;
  background: rgba(255,255,255,0.1);
}

.auth-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-welcome {
  font-size: 0.9rem;
  color: #ccc;
}

.sign-out-btn {
  background: rgba(255,255,255,0.1);
  color: white;
  border: 1px solid rgba(255,255,255,0.2);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.sign-out-btn:hover {
  background: rgba(255,255,255,0.2);
}

.auth-links {
  display: flex;
  gap: 1rem;
}

.auth-link {
  text-decoration: none;
  color: #ccc;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.auth-link:hover {
  color: white;
  background: rgba(255,255,255,0.1);
}

.auth-link.primary {
  background: #4ade80;
  color: white;
  border-color: #4ade80;
}

.auth-link.primary:hover {
  background: #22c55e;
  border-color: #22c55e;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .main-nav {
    justify-content: flex-start;
    flex-wrap: wrap;
  }
  
  .logo-section h1 {
    font-size: 1.2rem;
  }
}
</style>