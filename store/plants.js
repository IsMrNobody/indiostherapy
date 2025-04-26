// La importación de sweetApi en la parte superior del archivo
import { createPlant } from '~/plugins/sweetApi'

// Estado inicial
export const state = () => ({
  plants: [], // Lista de plantas guardadas
  currentPlant: null, // Planta actual seleccionada
  loading: false,
  error: null
})

// Getters
export const getters = {
  getPlants: (state) => state.plants,
  getCurrentPlant: (state) => state.currentPlant,
  isLoading: (state) => state.loading,
  hasError: (state) => state.error
}

// Mutaciones
export const mutations = {
  // Establecer estado de carga
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  
  // Establecer mensaje de error
  SET_ERROR(state, error) {
    state.error = error
  },
  
  // Guardar planta actual
  SET_CURRENT_PLANT(state, plant) {
    state.currentPlant = plant
  },
  
  // Agregar planta a la lista
  ADD_PLANT(state, plant) {
    state.plants.push(plant)
  },
  
  // Establecer lista completa de plantas
  SET_PLANTS(state, plants) {
    state.plants = plants
  }
}

// Acciones
export const actions = {
  // Crear una nueva planta
  async createPlant({ commit }, plantData) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    
    try {
      // Preparar los datos en el formato correcto para la API
      const apiData = {
        nombre: plantData.name || "",
        descripcion: plantData.description || "",
        fruta: plantData.descriptionFrutal || "",
        flor: plantData.descriptionFloral || "",
        hoja: plantData.descriptionHojal || "",
        propiedadesMedicinales: Array.isArray(plantData.properties) 
          ? plantData.properties.join(", ") 
          : plantData.properties || "",
        usosTradicionales: plantData.traditionalUses || "",
        comoUsarla: plantData.howToUse || ""
      }
      
      // Llamada a la API utilizando la función de sweetApi.js
      const response = await createPlant(apiData)
      
      // Guardar la planta en el estado
      commit('ADD_PLANT', { ...plantData, id: response.id })
      commit('SET_CURRENT_PLANT', { ...plantData, id: response.id })
      
      return response
    } catch (error) {
      console.error('Error al crear la planta:', error)
      commit('SET_ERROR', 'Error al guardar la planta en la base de datos')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  // Obtener todas las plantas
  async getPlants({ commit }) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    
    try {
      // Implementar cuando haya un endpoint para obtener todas las plantas
      const response = [] // Por ahora retorna un array vacío
      commit('SET_PLANTS', response)
      return response
    } catch (error) {
      console.error('Error al obtener las plantas:', error)
      commit('SET_ERROR', 'Error al cargar las plantas desde la base de datos')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  // Buscar una planta por nombre (simulado - implementar cuando exista el endpoint)
  async searchPlant({ commit }, name) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    
    try {
      // Esta función es simulada por ahora
      const response = []
      if (response && response.length > 0) {
        commit('SET_CURRENT_PLANT', response[0])
      } else {
        commit('SET_CURRENT_PLANT', null)
      }
      return response
    } catch (error) {
      console.error('Error al buscar la planta:', error)
      commit('SET_ERROR', 'Error al buscar la planta en la base de datos')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  }
} 