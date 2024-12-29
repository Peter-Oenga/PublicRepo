import axios from '@/axios';

const state = {
  audiences: [],
  activeAudience: null,
  errors: {},
};

const mutations = {
  SET_AUDIENCES(state, audiences) {
    state.audiences = audiences;
  },
  SET_ACTIVE_AUDIENCE(state, audience) {
    state.activeAudience = audience;
  },
  SET_ERRORS(state, errors) {
    state.errors = errors;
  },
  CLEAR_ERRORS(state) {
    state.errors = {};
  },
};

const actions = {
  async fetchAudiences({ commit, dispatch }) {
    try {
      dispatch('global/setLoading', true, { root: true });
      const response = await axios.get('/audiences');
      commit('SET_AUDIENCES', response.data);
    } catch (error) {
      console.error('Failed to fetch audiences:', error);
    } finally {
      dispatch('global/setLoading', false, { root: true });
    }
  },

  async fetchAudienceById({ commit, dispatch }, audienceId) {
    try {
      dispatch('global/setLoading', true, { root: true });
      const response = await axios.get(`/audiences/${audienceId}`);
      commit('SET_ACTIVE_AUDIENCE', response.data);
    } catch (error) {
      console.error('Failed to fetch audience:', error);
    } finally {
      dispatch('global/setLoading', false, { root: true });
    }
  },

  async createAudience({ commit, dispatch }, audienceData) {
    try {
      dispatch('global/setLoading', true,{root:true});
      commit('CLEAR_ERRORS');
      await axios.post('/audiences', audienceData);
      await dispatch('fetchAudiences'); // Refresh the audience list
    } catch (error) {
      if (error.response && error.response.data.errors) {
        commit('SET_ERRORS', error.response.data.errors);
      } else {
        commit('SET_ERRORS', { message: 'Failed to create audience. Please try again later.' });
      }
      console.error('Failed to create audience:', error);
    } finally {
      dispatch('global/setLoading', false,{root:true});
    }
  },

  async updateAudience({ commit, dispatch }, audienceData) {
    try {
      dispatch('global/setLoading', true,{root:true});
      commit('CLEAR_ERRORS');
      await axios.post(`/audiences/${audienceData.id}/update`, audienceData);
      await dispatch('fetchAudiences'); // Refresh the audience list
    } catch (error) {
      if (error.response && error.response.data.errors) {
        commit('SET_ERRORS', error.response.data.errors);
      } else {
        commit('SET_ERRORS', { message: 'Failed to update audience. Please try again later.' });
      }
      console.error('Failed to update audience:', error);
    } finally {
      dispatch('global/setLoading', false,{root:true});
    }
  },

  async deleteAudience({ commit, dispatch }, audienceId) {
    try {
      dispatch('global/setLoading',true,{root:true});
      commit('CLEAR_ERRORS');
      await axios.post(`/audiences/${audienceId}/delete`);
      await dispatch('fetchAudiences'); // Refresh the audience list
    } catch (error) {
      if (error.response && error.response.data.errors) {
        commit('SET_ERRORS', error.response.data.errors);
      } else {
        commit('SET_ERRORS', { message: 'Failed to delete audience. Please try again later.' });
      }
      console.error('Failed to delete audience:', error);
    } finally {
      dispatch('global/setLoading', false,{root:true});
    }
  },
  setErrors({ commit }, errors) {
    commit('SET_ERRORS', errors);
  },
};

const getters = {
  audiences: (state) => state.audiences,
  activeAudience: (state) => state.activeAudience,
  errors: (state) => state.errors,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
