import axios from '@/axios';

const state = {
  achievements: [],
  activeAchievement: null,
  errors: {},
};

const mutations = {
  SET_ACHIEVEMENTS(state, achievements) {
    state.achievements = achievements;
  },
  SET_ACTIVE_ACHIEVEMENT(state, achievement) {
    state.activeAchievement = achievement;
  },
  SET_ERRORS(state, errors) {
    state.errors = errors;
  },
  CLEAR_ERRORS(state) {
    state.errors = {};
  },
};

const actions = {
  async fetchAchievements({ commit, dispatch }, projectId) {
    try {
      dispatch('global/setLoading', true, { root: true });
      const response = await axios.get(`/projects/${projectId}/achievements`);
      commit('SET_ACHIEVEMENTS', response.data);
    } catch (error) {
      console.error('Failed to fetch achievements:', error);
    } finally {
      dispatch('global/setLoading', false, { root: true });
    }
  },

  async fetchAchievementById({ commit, dispatch }, { achievementId, projectId }) {
    try {
      dispatch('global/setLoading', true, { root: true });
      const response = await axios.get(`/projects/${projectId}/achievements/${achievementId}`);
      commit('SET_ACTIVE_ACHIEVEMENT', response.data);
    } catch (error) {
      console.error('Failed to fetch achievement:', error);
    } finally {
      dispatch('global/setLoading', false, { root: true });
    }
  },

  async createAchievement({ commit, dispatch }, { achievementData, projectId }) {
    try {
      dispatch('global/setLoading', true, { root: true });
      commit('CLEAR_ERRORS');
      await axios.post(`/projects/${projectId}/achievements`, achievementData);
      await dispatch('project/fetchProjectById',projectId,{root:true});
    } catch (error) {
      if (error.response && error.response.data.errors) {
        commit('SET_ERRORS', error.response.data.errors);
      } else {
        commit('SET_ERRORS', { message: 'Failed to create achievement. Please try again later.' });
      }
      console.error('Failed to create achievement:', error);
    } finally {
      dispatch('global/setLoading', false, { root: true });
    }
  },

  async updateAchievement({ commit, dispatch }, { achievementData, projectId }) {
    try {
      dispatch('global/setLoading', true, { root: true });
      commit('CLEAR_ERRORS');
      await axios.post(`/projects/${projectId}/achievements/${achievementData.id}/update`, achievementData);
      await dispatch('project/fetchProjectById',projectId,{root:true});
    } catch (error) {
      if (error.response && error.response.data.errors) {
        commit('SET_ERRORS', error.response.data.errors);
      } else {
        commit('SET_ERRORS', { message: 'Failed to update achievement. Please try again later.' });
      }
      console.error('Failed to update achievement:', error);
    } finally {
      dispatch('global/setLoading', false, { root: true });
    }
  },

  async deleteAchievement({ commit, dispatch }, { achievementId, projectId }) {
    try {
      dispatch('global/setLoading', true, { root: true });
      commit('CLEAR_ERRORS');
      await axios.post(`/projects/${projectId}/achievements/${achievementId}/delete`);
      await dispatch('project/fetchProjectById',projectId,{root:true});
    } catch (error) {
      if (error.response && error.response.data.errors) {
        commit('SET_ERRORS', error.response.data.errors);
      } else {
        commit('SET_ERRORS', { message: 'Failed to delete achievement. Please try again later.' });
      }
      console.error('Failed to delete achievement:', error);
    } finally {
      dispatch('global/setLoading', false, { root: true });
    }
  },

  setErrors({ commit }, errors) {
    commit('SET_ERRORS', errors);
  },
};

const getters = {
  achievements: (state) => state.achievements,
  activeAchievement: (state) => state.activeAchievement,
  errors: (state) => state.errors,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
