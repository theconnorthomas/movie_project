<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useFilmStore } from '@/stores/films'
import { RouterLink } from 'vue-router'

const authStore = useAuthStore()
const filmStore = useFilmStore()

const totalFilms = computed(() => filmStore.films.length)
const activeDistributions = computed(() => 
  filmStore.distributions.filter(d => d.status === 'active').length
)
const recentFilms = computed(() => filmStore.films.slice(0, 5))

onMounted(async () => {
  if (authStore.isAuthenticated) {
    await filmStore.fetchFilms()
    await filmStore.fetchDistributions()
  }
})
</script>

<template>
  <div class="home-view">
    <div v-if="!authStore.isAuthenticated" class="welcome-section">
      <div class="hero">
        <h1>Film Distribution Hub</h1>
        <p class="hero-description">
          Streamline your film distribution process with our comprehensive platform. 
          Manage films, coordinate with distributors, and track revenue all in one place.
        </p>
        <div class="hero-actions">
          <RouterLink to="/register" class="btn btn-primary">Get Started</RouterLink>
          <RouterLink to="/login" class="btn btn-secondary">Sign In</RouterLink>
        </div>
      </div>
      
      <div class="features">
        <h2>Key Features</h2>
        <div class="features-grid">
          <div class="feature-card">
            <h3>🎬 Film Management</h3>
            <p>Organize your film catalog with detailed information, status tracking, and revenue monitoring.</p>
          </div>
          <div class="feature-card">
            <h3>🌍 Distribution Coordination</h3>
            <p>Manage distribution deals across territories and platforms with comprehensive tracking.</p>
          </div>
          <div class="feature-card">
            <h3>📊 Analytics & Reporting</h3>
            <p>Get insights into your distribution performance with detailed analytics and reports.</p>
          </div>
          <div class="feature-card">
            <h3>🤝 Collaboration Tools</h3>
            <p>Work seamlessly with distributors, sales agents, and other stakeholders.</p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="dashboard">
      <div class="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back, {{ authStore.user?.full_name || 'User' }}!</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <h3>Total Films</h3>
          <div class="stat-number">{{ totalFilms }}</div>
        </div>
        <div class="stat-card">
          <h3>Active Distributions</h3>
          <div class="stat-number">{{ activeDistributions }}</div>
        </div>
        <div class="stat-card">
          <h3>Total Revenue</h3>
          <div class="stat-number">$0</div>
        </div>
        <div class="stat-card">
          <h3>Pending Deals</h3>
          <div class="stat-number">0</div>
        </div>
      </div>

      <div class="dashboard-sections">
        <div class="section">
          <div class="section-header">
            <h2>Recent Films</h2>
            <RouterLink to="/films" class="view-all-link">View All</RouterLink>
          </div>
          <div v-if="recentFilms.length > 0" class="films-list">
            <div v-for="film in recentFilms" :key="film.id" class="film-item">
              <div class="film-info">
                <h3>{{ film.title }}</h3>
                <p>{{ film.director }} • {{ film.release_year }}</p>
                <span class="status-badge" :class="film.status">{{ film.status }}</span>
              </div>
            </div>
          </div>
          <div v-else class="empty-state">
            <p>No films yet. <RouterLink to="/films/new">Add your first film</RouterLink></p>
          </div>
        </div>

        <div class="section">
          <div class="section-header">
            <h2>Quick Actions</h2>
          </div>
          <div class="quick-actions">
            <RouterLink to="/films/new" class="action-card">
              <h3>➕ Add New Film</h3>
              <p>Add a new film to your catalog</p>
            </RouterLink>
            <RouterLink to="/distributions" class="action-card">
              <h3>📋 View Distributions</h3>
              <p>Manage your distribution deals</p>
            </RouterLink>
            <RouterLink to="/analytics" class="action-card">
              <h3>📊 View Analytics</h3>
              <p>Check your performance metrics</p>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  max-width: 1200px;
  margin: 0 auto;
}

/* Welcome Section Styles */
.welcome-section {
  text-align: center;
}

.hero {
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  margin-bottom: 3rem;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.hero-description {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 1rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;
  display: inline-block;
}

.btn-primary {
  background: #4ade80;
  color: white;
}

.btn-primary:hover {
  background: #22c55e;
  transform: translateY(-2px);
}

.btn-secondary {
  background: rgba(255,255,255,0.2);
  color: white;
  border: 2px solid rgba(255,255,255,0.3);
}

.btn-secondary:hover {
  background: rgba(255,255,255,0.3);
  transform: translateY(-2px);
}

.features h2 {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #333;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  text-align: left;
}

.feature-card h3 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #333;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}

/* Dashboard Styles */
.dashboard {
  padding: 1rem;
}

.dashboard-header {
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.dashboard-header p {
  color: #666;
  font-size: 1.1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
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

.dashboard-sections {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.section {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  font-size: 1.5rem;
  color: #333;
  margin: 0;
}

.view-all-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.view-all-link:hover {
  text-decoration: underline;
}

.films-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.film-item {
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}

.film-info h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.film-info p {
  margin: 0 0 0.5rem 0;
  color: #666;
  font-size: 0.9rem;
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

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.action-card {
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
}

.action-card:hover {
  border-color: #667eea;
  background: #f8faff;
}

.action-card h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1rem;
}

.action-card p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.empty-state a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.empty-state a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .dashboard-sections {
    grid-template-columns: 1fr;
  }
  
  .hero h1 {
    font-size: 2rem;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
