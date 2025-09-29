<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div class="flex items-center">
            <img alt="Vue logo" class="h-12 w-12" src="@/assets/logo.svg" />
            <h1 class="ml-4 text-2xl font-bold text-gray-900">Movie Project</h1>
          </div>

          <nav class="flex space-x-8">
            <RouterLink
              to="/"
              class="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              :class="{ 'text-blue-600 bg-blue-50': $route.path === '/' }"
            >
              Home
            </RouterLink>
            <RouterLink
              to="/about"
              class="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              :class="{ 'text-blue-600 bg-blue-50': $route.path === '/about' }"
            >
              About
            </RouterLink>
          </nav>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <HelloWorld msg="Welcome to the Movie Distribution Platform!" />
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
/* Using Tailwind CSS classes instead of custom CSS */
</style>
