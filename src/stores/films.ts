import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase, type Film, type Distribution } from '@/lib/supabase'

export const useFilmStore = defineStore('films', () => {
  const films = ref<Film[]>([])
  const distributions = ref<Distribution[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getFilmsByStatus = computed(() => (status: Film['status']) => {
    return films.value.filter(film => film.status === status)
  })

  const getDistributionsByFilm = computed(() => (filmId: string) => {
    return distributions.value.filter(dist => dist.film_id === filmId)
  })

  const fetchFilms = async () => {
    loading.value = true
    error.value = null
    try {
      const { data, error: fetchError } = await supabase
        .from('films')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      films.value = data || []
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch films'
      console.error('Error fetching films:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchDistributions = async () => {
    loading.value = true
    error.value = null
    try {
      const { data, error: fetchError } = await supabase
        .from('distributions')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      distributions.value = data || []
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch distributions'
      console.error('Error fetching distributions:', err)
    } finally {
      loading.value = false
    }
  }

  const createFilm = async (filmData: Omit<Film, 'id' | 'created_at' | 'updated_at'>) => {
    loading.value = true
    error.value = null
    try {
      const { data, error: createError } = await supabase
        .from('films')
        .insert([filmData])
        .select()
        .single()

      if (createError) throw createError
      
      if (data) {
        films.value.unshift(data)
      }
      
      return { data, error: null }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create film'
      return { data: null, error: err }
    } finally {
      loading.value = false
    }
  }

  const updateFilm = async (id: string, updates: Partial<Film>) => {
    loading.value = true
    error.value = null
    try {
      const { data, error: updateError } = await supabase
        .from('films')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (updateError) throw updateError

      if (data) {
        const index = films.value.findIndex(film => film.id === id)
        if (index !== -1) {
          films.value[index] = data
        }
      }

      return { data, error: null }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update film'
      return { data: null, error: err }
    } finally {
      loading.value = false
    }
  }

  const deleteFilm = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      const { error: deleteError } = await supabase
        .from('films')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      films.value = films.value.filter(film => film.id !== id)
      return { error: null }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete film'
      return { error: err }
    } finally {
      loading.value = false
    }
  }

  const createDistribution = async (distributionData: Omit<Distribution, 'id' | 'created_at' | 'updated_at'>) => {
    loading.value = true
    error.value = null
    try {
      const { data, error: createError } = await supabase
        .from('distributions')
        .insert([distributionData])
        .select()
        .single()

      if (createError) throw createError
      
      if (data) {
        distributions.value.unshift(data)
      }
      
      return { data, error: null }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create distribution'
      return { data: null, error: err }
    } finally {
      loading.value = false
    }
  }

  return {
    films,
    distributions,
    loading,
    error,
    getFilmsByStatus,
    getDistributionsByFilm,
    fetchFilms,
    fetchDistributions,
    createFilm,
    updateFilm,
    deleteFilm,
    createDistribution
  }
})