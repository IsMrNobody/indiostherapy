// Archivo principal de Vuex Store
// Aquí configuramos el estado global y los módulos

import Vue from 'vue';
import Vuex from 'vuex';
import symptoms from './symptoms';

// Asegúrate de que Vue use Vuex
Vue.use(Vuex);

// Para SSR necesitamos una función que devuelva una nueva instancia de store
export const createStore = () => {
  return new Vuex.Store({
    // Estructura básica del store
    state: () => ({
      // Estado global de la aplicación
      appName: 'InDios Therapy',
      appLoaded: false
    }),
    mutations: {
      SET_APP_LOADED(state, value) {
        state.appLoaded = value
      }
    },
    actions: {
      // Acción que se ejecuta al iniciar la aplicación
      nuxtServerInit({ commit, dispatch }, { req }) {
        commit('SET_APP_LOADED', true)
        // Aquí podemos cargar datos iniciales desde la API si es necesario
      }
    },
    
    // Cargamos los módulos
    modules: {
      // Estos módulos serán registrados automáticamente en Nuxt
      symptoms
    }
  });
};

// Para Nuxt, esta función es necesaria
export default createStore;

export const getters = {
  isAppLoaded: state => state.appLoaded,
  getAppName: state => state.appName
} 