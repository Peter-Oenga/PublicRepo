import axios from '@/axios';

const state = {
  expectedResults: [],
  activeExpectedResult: null,
  errors: {},
};

const mutations = {
  SET_EXPECTED_RESULTS(state, expectedResults) {
    state.expectedResults = expectedResults;
  },
  SET_ACTIVE_EXPECTED_RESULT(state, expectedResult) {
    state.activeExpectedResult = expectedResult;
  },
  SET_ERRORS(state, errors) {
    state.errors = errors;
  },
  CLEAR_ERRORS(state) {
    state.errors = {};
  },
};

const actions = {
  async fetchExpectedResults({ commit, dispatch }, projectId) {
    try {
      dispatch('global/setLoading', true, { root: true });
      const response = await axios.get(`/projects/${projectId}/expected-results`);
      commit('SET_EXPECTED_RESULTS', response.data);
    } catch (error) {
      console.error('Failed to fetch expected results:', error);
    } finally {
      dispatch('global/setLoading', false, { root: true });
    }
  },

  async fetchExpectedResultById({ commit, dispatch }, { expectedResultId, projectId }) {
    try {
      dispatch('global/setLoading', true, { root: true });
      const response = await axios.get(`/projects/${projectId}/expected-results/${expectedResultId}`);
      commit('SET_ACTIVE_EXPECTED_RESULT', response.data);
    } catch (error) {
      console.error('Failed to fetch expected result:', error);
    } finally {
      dispatch('global/setLoading', false, { root: true });
    }
  },

  async createExpectedResult({ commit, dispatch }, { expectedResultData, projectId }) {
    try {
      dispatch('global/setLoading', true, { root: true });
      commit('CLEAR_ERRORS');
      await axios.post(`/projects/${projectId}/expected-results`, expectedResultData);
      await dispatch('project/fetchProjectById',projectId,{root:true});
    } catch (error) {
      if (error.response && error.response.data.errors) {
        commit('SET_ERRORS', error.response.data.errors);
      } else {
        commit('SET_ERRORS', { message: 'Failed to create expected result. Please try again later.' });
      }
      console.error('Failed to create expected result:', error);
    } finally {
      dispatch('global/setLoading', false, { root: true });
    }
  },

  async updateExpectedResult({ commit, dispatch }, { expectedResultData, projectId }) {
    try {
      dispatch('global/setLoading', true, { root: true });
      commit('CLEAR_ERRORS');
      await axios.post(`/projects/${projectId}/expected-results/${expectedResultData.id}/update`, expectedResultData);
      await dispatch('project/fetchProjectById',projectId,{root:true});
    } catch (error) {
      if (error.response && error.response.data.errors) {
        commit('SET_ERRORS', error.response.data.errors);
      } else {
        commit('SET_ERRORS', { message: 'Failed to update expected result. Please try again later.' });
      }
      console.error('Failed to update expected result:', error);
    } finally {
      dispatch('global/setLoading', false, { root: true });
    }
  },

  async deleteExpectedResult({ commit, dispatch }, { expectedResultId, projectId }) {
    try {
      dispatch('global/setLoading', true, { root: true });
      commit('CLEAR_ERRORS');
      await axios.post(`/projects/${projectId}/expected-results/${expectedResultId}/delete`);
      await dispatch('project/fetchProjectById',projectId,{root:true});
    } catch (error) {
      if (error.response && error.response.data.errors) {
        commit('SET_ERRORS', error.response.data.errors);
      } else {
        commit('SET_ERRORS', { message: 'Failed to delete expected result. Please try again later.' });
      }
      console.error('Failed to delete expected result:', error);
    } finally {
      dispatch('global/setLoading', false, { root: true });
    }
  },

  setErrors({ commit }, errors) {
    commit('SET_ERRORS', errors);
  },
};

const getters = {
  expectedResults: (state) => state.expectedResults,
  activeExpectedResult: (state) => state.activeExpectedResult,
  errors: (state) => state.errors,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
