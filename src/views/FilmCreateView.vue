<script setup lang="ts">
import { ref } from 'vue'
import { useFilmStore } from '@/stores/films'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const filmStore = useFilmStore()
const authStore = useAuthStore()
const router = useRouter()

const form = ref({
  title: '',
  director: '',
  genre: '',
  release_year: new Date().getFullYear(),
  duration_minutes: 0,
  description: '',
  budget: 0,
  revenue: 0,
  status: 'draft' as const
})

const error = ref('')
const submitting = ref(false)

const handleSubmit = async () => {
  if (!form.value.title || !form.value.director || !form.value.genre) {
    error.value = 'Please fill in the required fields'
    return
  }

  submitting.value = true
  error.value = ''

  const filmData = {
    ...form.value,
    user_id: authStore.user?.id || ''
  }

  const { error: createError } = await filmStore.createFilm(filmData)

  if (createError) {
    error.value = 'Failed to create film'
  } else {
    router.push('/films')
  }

  submitting.value = false
}
</script>

<template>
  <div class="film-create-view">
    <div class="create-header">
      <h1>Add New Film</h1>
      <p>Enter the details for your film</p>
    </div>

    <form @submit.prevent="handleSubmit" class="film-form">
      <div class="form-row">
        <div class="form-group">
          <label for="title">Title *</label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            placeholder="Enter film title"
            class="form-input"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="director">Director *</label>
          <input
            id="director"
            v-model="form.director"
            type="text"
            placeholder="Enter director name"
            class="form-input"
            required
          />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="genre">Genre *</label>
          <select id="genre" v-model="form.genre" class="form-input" required>
            <option value="">Select genre</option>
            <option value="Action">Action</option>
            <option value="Comedy">Comedy</option>
            <option value="Drama">Drama</option>
            <option value="Horror">Horror</option>
            <option value="Romance">Romance</option>
            <option value="Thriller">Thriller</option>
            <option value="Documentary">Documentary</option>
            <option value="Animation">Animation</option>
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="Fantasy">Fantasy</option>
          </select>
        </div>

        <div class="form-group">
          <label for="release_year">Release Year</label>
          <input
            id="release_year"
            v-model.number="form.release_year"
            type="number"
            min="1900"
            max="2030"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="duration_minutes">Duration (minutes)</label>
          <input
            id="duration_minutes"
            v-model.number="form.duration_minutes"
            type="number"
            min="1"
            class="form-input"
          />
        </div>
      </div>

      <div class="form-group">
        <label for="description">Description</label>
        <textarea
          id="description"
          v-model="form.description"
          placeholder="Enter film description"
          class="form-textarea"
          rows="4"
        ></textarea>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="budget">Budget ($)</label>
          <input
            id="budget"
            v-model.number="form.budget"
            type="number"
            min="0"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="revenue">Revenue ($)</label>
          <input
            id="revenue"
            v-model.number="form.revenue"
            type="number"
            min="0"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="status">Status</label>
          <select id="status" v-model="form.status" class="form-input">
            <option value="draft">Draft</option>
            <option value="in_distribution">In Distribution</option>
            <option value="distributed">Distributed</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div class="form-actions">
        <RouterLink to="/films" class="btn btn-secondary">Cancel</RouterLink>
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="submitting"
        >
          {{ submitting ? 'Creating...' : 'Create Film' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.film-create-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.create-header {
  margin-bottom: 2rem;
}

.create-header h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.create-header p {
  color: #666;
  margin: 0;
}

.film-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
}

.form-input,
.form-textarea {
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #667eea;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.error-message {
  background: #fef2f2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid #fecaca;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
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
  font-size: 1rem;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #5a67d8;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

@media (max-width: 768px) {
  .form-actions {
    flex-direction: column;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>