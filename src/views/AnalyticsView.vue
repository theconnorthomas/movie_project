<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useFilmStore } from '@/stores/films'

const filmStore = useFilmStore()

const totalRevenue = computed(() => {
  return filmStore.films.reduce((sum, film) => sum + film.revenue, 0)
})

const totalBudget = computed(() => {
  return filmStore.films.reduce((sum, film) => sum + film.budget, 0)
})

const totalProfit = computed(() => {
  return totalRevenue.value - totalBudget.value
})

const averageRevenue = computed(() => {
  return filmStore.films.length > 0 ? totalRevenue.value / filmStore.films.length : 0
})

const filmsByGenre = computed(() => {
  const genres: Record<string, number> = {}
  filmStore.films.forEach(film => {
    genres[film.genre] = (genres[film.genre] || 0) + 1
  })
  return Object.entries(genres).map(([genre, count]) => ({
    genre,
    count,
    percentage: Math.round((count / filmStore.films.length) * 100)
  }))
})

const filmsByStatus = computed(() => {
  const statuses: Record<string, number> = {}
  filmStore.films.forEach(film => {
    statuses[film.status] = (statuses[film.status] || 0) + 1
  })
  return Object.entries(statuses).map(([status, count]) => ({
    status,
    count,
    percentage: Math.round((count / filmStore.films.length) * 100)
  }))
})

const distributionsByType = computed(() => {
  const types: Record<string, number> = {}
  filmStore.distributions.forEach(dist => {
    types[dist.distribution_type] = (types[dist.distribution_type] || 0) + 1
  })
  return Object.entries(types).map(([type, count]) => ({
    type,
    count,
    percentage: Math.round((count / filmStore.distributions.length) * 100)
  }))
})

const topPerformingFilms = computed(() => {
  return [...filmStore.films]
    .sort((a, b) => (b.revenue - b.budget) - (a.revenue - a.budget))
    .slice(0, 5)
})

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

onMounted(async () => {
  await filmStore.fetchFilms()
  await filmStore.fetchDistributions()
})
</script>

<template>
  <div class="analytics-view">
    <div class="analytics-header">
      <h1>Analytics</h1>
      <p>Performance insights for your film distribution business</p>
    </div>

    <div v-if="filmStore.loading" class="loading">
      Loading analytics...
    </div>

    <div v-else-if="filmStore.error" class="error">
      {{ filmStore.error }}
    </div>

    <div v-else-if="filmStore.films.length === 0" class="empty-state">
      <h2>No data available</h2>
      <p>Add films to your catalog to see analytics.</p>
      <RouterLink to="/films/new" class="btn btn-primary">Add Your First Film</RouterLink>
    </div>

    <div v-else class="analytics-content">
      <!-- Financial Overview -->
      <section class="analytics-section">
        <h2>Financial Overview</h2>
        <div class="financial-stats">
          <div class="stat-card">
            <h3>Total Revenue</h3>
            <div class="stat-number positive">{{ formatCurrency(totalRevenue) }}</div>
          </div>
          <div class="stat-card">
            <h3>Total Budget</h3>
            <div class="stat-number">{{ formatCurrency(totalBudget) }}</div>
          </div>
          <div class="stat-card">
            <h3>Net Profit</h3>
            <div class="stat-number" :class="{ positive: totalProfit > 0, negative: totalProfit < 0 }">
              {{ formatCurrency(totalProfit) }}
            </div>
          </div>
          <div class="stat-card">
            <h3>Average Revenue</h3>
            <div class="stat-number">{{ formatCurrency(averageRevenue) }}</div>
          </div>
        </div>
      </section>

      <!-- Film Distribution -->
      <section class="analytics-section">
        <h2>Film Portfolio</h2>
        <div class="portfolio-grid">
          <div class="chart-card">
            <h3>Films by Status</h3>
            <div class="chart-content">
              <div v-for="item in filmsByStatus" :key="item.status" class="chart-item">
                <div class="chart-bar">
                  <div class="bar-fill" :style="{ width: item.percentage + '%' }" :class="item.status"></div>
                </div>
                <div class="chart-labels">
                  <span class="label">{{ item.status.replace('_', ' ') }}</span>
                  <span class="value">{{ item.count }} ({{ item.percentage }}%)</span>
                </div>
              </div>
            </div>
          </div>

          <div class="chart-card">
            <h3>Films by Genre</h3>
            <div class="chart-content">
              <div v-for="item in filmsByGenre" :key="item.genre" class="chart-item">
                <div class="chart-bar">
                  <div class="bar-fill" :style="{ width: item.percentage + '%' }"></div>
                </div>
                <div class="chart-labels">
                  <span class="label">{{ item.genre }}</span>
                  <span class="value">{{ item.count }} ({{ item.percentage }}%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Distribution Analysis -->
      <section class="analytics-section" v-if="filmStore.distributions.length > 0">
        <h2>Distribution Analysis</h2>
        <div class="distribution-stats">
          <div class="stat-card">
            <h3>Total Distributions</h3>
            <div class="stat-number">{{ filmStore.distributions.length }}</div>
          </div>
          <div class="stat-card">
            <h3>Active Deals</h3>
            <div class="stat-number">
              {{ filmStore.distributions.filter(d => d.status === 'active').length }}
            </div>
          </div>
          <div class="stat-card">
            <h3>Completed Deals</h3>
            <div class="stat-number">
              {{ filmStore.distributions.filter(d => d.status === 'completed').length }}
            </div>
          </div>
        </div>

        <div class="chart-card" v-if="distributionsByType.length > 0">
          <h3>Distribution Types</h3>
          <div class="chart-content">
            <div v-for="item in distributionsByType" :key="item.type" class="chart-item">
              <div class="chart-bar">
                <div class="bar-fill" :style="{ width: item.percentage + '%' }"></div>
              </div>
              <div class="chart-labels">
                <span class="label">{{ item.type.replace('_', ' ') }}</span>
                <span class="value">{{ item.count }} ({{ item.percentage }}%)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Top Performing Films -->
      <section class="analytics-section">
        <h2>Top Performing Films</h2>
        <div class="performance-table">
          <div class="table-header">
            <div>Title</div>
            <div>Budget</div>
            <div>Revenue</div>
            <div>Profit</div>
            <div>ROI</div>
          </div>
          <div v-for="film in topPerformingFilms" :key="film.id" class="table-row">
            <div class="film-title">{{ film.title }}</div>
            <div>{{ formatCurrency(film.budget) }}</div>
            <div>{{ formatCurrency(film.revenue) }}</div>
            <div :class="{ positive: film.revenue > film.budget, negative: film.revenue < film.budget }">
              {{ formatCurrency(film.revenue - film.budget) }}
            </div>
            <div :class="{ positive: film.revenue > film.budget, negative: film.revenue < film.budget }">
              {{ film.budget > 0 ? Math.round(((film.revenue - film.budget) / film.budget) * 100) : 0 }}%
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.analytics-view {
  padding: 1rem;
}

.analytics-header {
  margin-bottom: 2rem;
}

.analytics-header h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.analytics-header p {
  color: #666;
  margin: 0;
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

.analytics-content {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.analytics-section {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.analytics-section h2 {
  font-size: 1.5rem;
  color: #333;
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.financial-stats,
.distribution-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: #f9fafb;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
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

.stat-number.positive {
  color: #065f46;
}

.stat-number.negative {
  color: #dc2626;
}

.portfolio-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.chart-card {
  background: #f9fafb;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.chart-card h3 {
  font-size: 1.1rem;
  color: #333;
  margin: 0 0 1rem 0;
}

.chart-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.chart-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.chart-bar {
  background: #e5e7eb;
  height: 24px;
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: #667eea;
  transition: width 0.3s ease;
}

.bar-fill.draft {
  background: #f59e0b;
}

.bar-fill.in_distribution {
  background: #3b82f6;
}

.bar-fill.distributed {
  background: #10b981;
}

.bar-fill.archived {
  background: #6b7280;
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.label {
  color: #374151;
  font-weight: 500;
  text-transform: capitalize;
}

.value {
  color: #6b7280;
  font-weight: 600;
}

.performance-table {
  background: #f9fafb;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.table-header,
.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 1rem;
  align-items: center;
}

.table-header {
  background: #f3f4f6;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

.table-row {
  border-bottom: 1px solid #e5e7eb;
}

.table-row:last-child {
  border-bottom: none;
}

.film-title {
  font-weight: 600;
  color: #333;
}

.positive {
  color: #065f46;
}

.negative {
  color: #dc2626;
}

@media (max-width: 768px) {
  .portfolio-grid {
    grid-template-columns: 1fr;
  }
  
  .financial-stats,
  .distribution-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .table-header {
    display: none;
  }
  
  .table-row {
    display: flex;
    flex-direction: column;
    text-align: left;
  }
}
</style>