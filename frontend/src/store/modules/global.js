// store/modules/global.js

const state = {
    loading: false,  // Universal loading state
  };
  
  const getters = {
    loading: state => state.loading,  // Getter to access the loading state
  };
  
  const mutations = {
    SET_LOADING(state, payload) {
      state.loading = payload;
    },
  };
  
  const actions = {
    setLoading({ commit }, payload) {
      commit('SET_LOADING', payload);
    },
  };
  
  export default {
    namespaced: true,  // Keep this namespaced to avoid conflicts with other modules
    state,
    getters,
    mutations,
    actions,
  };
  