const state = () => ({
  loading: false,
  error: '',
  result: null
});

const mutations = {
  setLoading(state, loading) {
    state.loading = loading;
  },
  setError(state, error) {
    state.error = error;
  },
  setResult(state, result) {
    state.result = result;
  },
  clearResult(state) {
    state.result = null;
  },
  addMorePlants(state, plants) {
    if (state.result && state.result.recommendedPlants) {
      state.result.recommendedPlants = [
        ...state.result.recommendedPlants,
        ...plants
      ];
    }
  }
};

const actions = {
  // Si necesitamos acciones asíncronas en el futuro
};

const getters = {
  // Si necesitamos getters computados en el futuro
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}; 