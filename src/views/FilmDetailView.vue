<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useFilmStore } from '@/stores/films'
import type { Film } from '@/lib/supabase'

const route = useRoute()
const filmStore = useFilmStore()

const film = ref<Film | null>(null)
const loading = ref(true)
const error = ref('')

const filmId = computed(() => route.params.id as string)

onMounted(async () => {
  await filmStore.fetchFilms()
  const foundFilm = filmStore.films.find(f => f.id === filmId.value)
  
  if (foundFilm) {
    film.value = foundFilm
  } else {
    error.value = 'Film not found'
  }
  
  loading.value = false
})

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}
</script>

<template>
  <div class="film-detail-view">
    <div v-if="loading" class="loading">
      Loading film details...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
      <RouterLink to="/films" class="back-link">← Back to Films</RouterLink>
    </div>

    <div v-else-if="film" class="film-detail">
      <div class="detail-header">
        <div class="header-content">
          <h1>{{ film.title }}</h1>
          <span class="status-badge" :class="film.status">{{ film.status }}</span>
        </div>
        <RouterLink to="/films" class="back-link">← Back to Films</RouterLink>
      </div>

      <div class="detail-content">
        <div class="detail-grid">
          <div class="detail-section">
            <h2>Film Information</h2>
            <div class="info-grid">
              <div class="info-item">
                <label>Director</label>
                <p>{{ film.director }}</p>
              </div>
              <div class="info-item">
                <label>Genre</label>
                <p>{{ film.genre }}</p>
              </div>
              <div class="info-item">
                <label>Release Year</label>
                <p>{{ film.release_year }}</p>
              </div>
              <div class="info-item">
                <label>Duration</label>
                <p>{{ film.duration_minutes }} minutes</p>
              </div>
            </div>
          </div>

          <div class="detail-section">
            <h2>Financial Information</h2>
            <div class="info-grid">
              <div class="info-item">
                <label>Budget</label>
                <p>{{ formatCurrency(film.budget) }}</p>
              </div>
              <div class="info-item">
                <label>Revenue</label>
                <p>{{ formatCurrency(film.revenue) }}</p>
              </div>
              <div class="info-item">
                <label>Profit/Loss</label>
                <p :class="{ 'profit': film.revenue > film.budget, 'loss': film.revenue < film.budget }">
                  {{ formatCurrency(film.revenue - film.budget) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="detail-section full-width">
          <h2>Description</h2>
          <p class="description">{{ film.description || 'No description available.' }}</p>
        </div>

        <div class="detail-section full-width">
          <h2>Distributions</h2>
          <div v-if="filmStore.getDistributionsByFilm(film.id).length === 0" class="empty-state">
            <p>No distributions yet for this film.</p>
          </div>
          <div v-else class="distributions-list">
            <div 
              v-for="distribution in filmStore.getDistributionsByFilm(film.id)" 
              :key="distribution.id"
              class="distribution-card"
            >
              <div class="distribution-header">
                <h3>{{ distribution.distributor_name }}</h3>
                <span class="status-badge" :class="distribution.status">{{ distribution.status }}</span>
              </div>
              <div class="distribution-details">
                <p><strong>Territory:</strong> {{ distribution.territory }}</p>
                <p><strong>Type:</strong> {{ distribution.distribution_type }}</p>
                <p><strong>Revenue Share:</strong> {{ distribution.revenue_share }}%</p>
                <p><strong>Guaranteed Minimum:</strong> {{ formatCurrency(distribution.guaranteed_minimum) }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="detail-section full-width">
          <h2>Timeline</h2>
          <div class="timeline">
            <div class="timeline-item">
              <label>Created</label>
              <p>{{ formatDate(film.created_at) }}</p>
            </div>
            <div class="timeline-item">
              <label>Last Updated</label>
              <p>{{ formatDate(film.updated_at) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.film-detail-view {
  max-width: 1000px;
  margin: 0 auto;
  padding: 1rem;
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

.back-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.back-link:hover {
  text-decoration: underline;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-content h1 {
  font-size: 2.5rem;
  color: #333;
  margin: 0;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.8rem;
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

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.detail-section {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.detail-section.full-width {
  grid-column: 1 / -1;
}

.detail-section h2 {
  font-size: 1.3rem;
  color: #333;
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-item label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-item p {
  font-size: 1.1rem;
  color: #333;
  margin: 0;
}

.profit {
  color: #065f46;
}

.loss {
  color: #dc2626;
}

.description {
  line-height: 1.6;
  color: #555;
  margin: 0;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.distributions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.distribution-card {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 1rem;
}

.distribution-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.distribution-header h3 {
  margin: 0;
  color: #333;
}

.distribution-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.5rem;
}

.distribution-details p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.timeline {
  display: flex;
  gap: 2rem;
}

.timeline-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.timeline-item label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.timeline-item p {
  color: #333;
  margin: 0;
}

@media (max-width: 768px) {
  .detail-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .detail-grid {
    grid-template-columns: 1fr;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .timeline {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>