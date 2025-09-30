<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useFilmStore } from '@/stores/films'
import { RouterLink } from 'vue-router'

import type { Film } from '@/lib/supabase'

const filmStore = useFilmStore()
const selectedStatus = ref<string>('all')

const filteredFilms = computed(() => {
  if (selectedStatus.value === 'all') {
    return filmStore.films
  }
  return filmStore.getFilmsByStatus(selectedStatus.value as Film['status'])
})

onMounted(() => {
  filmStore.fetchFilms()
})
</script>

<template>
  <div class="films-view">
    <div class="films-header">
      <h1>Films</h1>
      <RouterLink to="/films/new" class="btn btn-primary">Add New Film</RouterLink>
    </div>

    <div class="filters">
      <label for="status-filter">Filter by status:</label>
      <select id="status-filter" v-model="selectedStatus" class="filter-select">
        <option value="all">All Films</option>
        <option value="draft">Draft</option>
        <option value="in_distribution">In Distribution</option>
        <option value="distributed">Distributed</option>
        <option value="archived">Archived</option>
      </select>
    </div>

    <div v-if="filmStore.loading" class="loading">
      Loading films...
    </div>

    <div v-else-if="filmStore.error" class="error">
      {{ filmStore.error }}
    </div>

    <div v-else-if="filteredFilms.length === 0" class="empty-state">
      <h2>No films found</h2>
      <p>Get started by adding your first film.</p>
      <RouterLink to="/films/new" class="btn btn-primary">Add Film</RouterLink>
    </div>

    <div v-else class="films-grid">
      <div v-for="film in filteredFilms" :key="film.id" class="film-card">
        <div class="film-header">
          <h3>{{ film.title }}</h3>
          <span class="status-badge" :class="film.status">{{ film.status }}</span>
        </div>
        <div class="film-details">
          <p><strong>Director:</strong> {{ film.director }}</p>
          <p><strong>Genre:</strong> {{ film.genre }}</p>
          <p><strong>Year:</strong> {{ film.release_year }}</p>
          <p><strong>Duration:</strong> {{ film.duration_minutes }} minutes</p>
        </div>
        <div class="film-description">
          <p>{{ film.description }}</p>
        </div>
        <div class="film-footer">
          <RouterLink :to="`/films/${film.id}`" class="view-details-btn">
            View Details
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.films-view {
  padding: 1rem;
}

.films-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.films-header h1 {
  font-size: 2rem;
  color: #333;
  margin: 0;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;
  display: inline-block;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5a67d8;
}

.filters {
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.filter-select {
  padding: 0.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-size: 1rem;
}

.loading,
.error {
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;
}

.error {
  color: #dc2626;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-state h2 {
  color: #333;
  margin-bottom: 1rem;
}

.empty-state p {
  color: #666;
  margin-bottom: 2rem;
}

.films-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.film-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 1.5rem;
  transition: all 0.2s;
}

.film-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.film-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.film-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.3rem;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.draft {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.in_distribution {
  background: #dbeafe;
  color: #1e40af;
}

.status-badge.distributed {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.archived {
  background: #f3f4f6;
  color: #374151;
}

.film-details {
  margin-bottom: 1rem;
}

.film-details p {
  margin: 0.25rem 0;
  color: #666;
  font-size: 0.9rem;
}

.film-description {
  margin-bottom: 1rem;
}

.film-description p {
  color: #555;
  line-height: 1.5;
  font-size: 0.9rem;
  margin: 0;
}

.film-footer {
  display: flex;
  justify-content: flex-end;
}

.view-details-btn {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
}

.view-details-btn:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .films-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .films-grid {
    grid-template-columns: 1fr;
  }
}
</style>