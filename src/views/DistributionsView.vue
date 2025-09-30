<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useFilmStore } from '@/stores/films'

import type { Distribution } from '@/lib/supabase'

const filmStore = useFilmStore()
const selectedFilm = ref<string>('all')

const filteredDistributions = computed(() => {
  if (selectedFilm.value === 'all') {
    return filmStore.distributions
  }
  return filmStore.getDistributionsByFilm(selectedFilm.value)
})

const distributionsByStatus = computed(() => {
  const groups: Record<string, Distribution[]> = {}
  filteredDistributions.value.forEach(dist => {
    if (!groups[dist.status]) {
      groups[dist.status] = []
    }
    groups[dist.status]!.push(dist)
  })
  return groups
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

const getFilmTitle = (filmId: string) => {
  const film = filmStore.films.find(f => f.id === filmId)
  return film?.title || 'Unknown Film'
}

onMounted(async () => {
  await filmStore.fetchFilms()
  await filmStore.fetchDistributions()
})
</script>

<template>
  <div class="distributions-view">
    <div class="distributions-header">
      <h1>Distributions</h1>
      <p>Manage your film distribution deals</p>
    </div>

    <div class="filters">
      <div class="filter-group">
        <label for="film-filter">Filter by film:</label>
        <select id="film-filter" v-model="selectedFilm" class="filter-select">
          <option value="all">All Films</option>
          <option v-for="film in filmStore.films" :key="film.id" :value="film.id">
            {{ film.title }}
          </option>
        </select>
      </div>
    </div>

    <div v-if="filmStore.loading" class="loading">
      Loading distributions...
    </div>

    <div v-else-if="filmStore.error" class="error">
      {{ filmStore.error }}
    </div>

    <div v-else-if="filteredDistributions.length === 0" class="empty-state">
      <h2>No distributions found</h2>
      <p>Start by creating distribution deals for your films.</p>
    </div>

    <div v-else class="distributions-content">
      <div class="stats-overview">
        <div class="stat-card">
          <h3>Total Deals</h3>
          <div class="stat-number">{{ filteredDistributions.length }}</div>
        </div>
        <div class="stat-card">
          <h3>Active Deals</h3>
          <div class="stat-number">{{ distributionsByStatus.active?.length || 0 }}</div>
        </div>
        <div class="stat-card">
          <h3>Completed Deals</h3>
          <div class="stat-number">{{ distributionsByStatus.completed?.length || 0 }}</div>
        </div>
        <div class="stat-card">
          <h3>In Negotiation</h3>
          <div class="stat-number">{{ distributionsByStatus.negotiating?.length || 0 }}</div>
        </div>
      </div>

      <div class="distributions-by-status">
        <div v-for="(distributions, status) in distributionsByStatus" :key="status" class="status-section">
          <h2 class="status-title">
            {{ status.charAt(0).toUpperCase() + status.slice(1) }} 
            ({{ distributions.length }})
          </h2>
          
          <div class="distributions-grid">
            <div v-for="distribution in distributions" :key="distribution.id" class="distribution-card">
              <div class="card-header">
                <div class="card-title">
                  <h3>{{ distribution.distributor_name }}</h3>
                  <span class="status-badge" :class="distribution.status">{{ distribution.status }}</span>
                </div>
                <div class="film-title">{{ getFilmTitle(distribution.film_id) }}</div>
              </div>
              
              <div class="card-content">
                <div class="distribution-details">
                  <div class="detail-row">
                    <span class="label">Territory:</span>
                    <span class="value">{{ distribution.territory }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Type:</span>
                    <span class="value">{{ distribution.distribution_type }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Revenue Share:</span>
                    <span class="value">{{ distribution.revenue_share }}%</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Guaranteed Min:</span>
                    <span class="value">{{ formatCurrency(distribution.guaranteed_minimum) }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Start Date:</span>
                    <span class="value">{{ formatDate(distribution.start_date) }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">End Date:</span>
                    <span class="value">{{ formatDate(distribution.end_date) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.distributions-view {
  padding: 1rem;
}

.distributions-header {
  margin-bottom: 2rem;
}

.distributions-header h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.distributions-header p {
  color: #666;
  margin: 0;
}

.filters {
  margin-bottom: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
}

.filter-select {
  padding: 0.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-size: 1rem;
  min-width: 200px;
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
}

.distributions-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;
}

.stat-card h3 {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
}

.distributions-by-status {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.status-section {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.status-title {
  font-size: 1.3rem;
  color: #333;
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.distributions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1rem;
}

.distribution-card {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 1rem;
  transition: all 0.2s;
}

.distribution-card:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border-color: #667eea;
}

.card-header {
  margin-bottom: 1rem;
}

.card-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.card-title h3 {
  margin: 0;
  color: #333;
  font-size: 1.1rem;
}

.film-title {
  color: #666;
  font-size: 0.9rem;
  font-style: italic;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.negotiating {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.signed {
  background: #dbeafe;
  color: #1e40af;
}

.status-badge.active {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.completed {
  background: #f3f4f6;
  color: #374151;
}

.status-badge.cancelled {
  background: #fef2f2;
  color: #dc2626;
}

.distribution-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.label {
  color: #666;
  font-weight: 500;
}

.value {
  color: #333;
  font-weight: 600;
  text-align: right;
}

@media (max-width: 768px) {
  .distributions-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-overview {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .filters {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>