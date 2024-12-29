import axios from '@/axios';

const state = {
  activities: [],
  activeActivity: null,
  errors: {},
};

const mutations = {
  SET_ACTIVITIES(state, activities) {
    state.activities = activities;
  },
  SET_ACTIVE_ACTIVITY(state, activity) {
    state.activeActivity = activity;
  },
  SET_ERRORS(state, errors) {
    state.errors = errors;
  },
  CLEAR_ERRORS(state) {
    state.errors = {};
  },
};

const actions = {
  async fetchActivities({ commit, dispatch }, projectId) {
    try {
      dispatch('global/setLoading', true, { root: true });
      const response = await axios.get(`/projects/${projectId}/activities`);
      commit('SET_ACTIVITIES', response.data);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    } finally {
      dispatch('global/setLoading', false, { root: true });
    }
  },

  async fetchActivityById({ commit, dispatch }, { activityId, projectId }) {
    try {
      dispatch('global/setLoading', true, { root: true });
      const response = await axios.get(`/projects/${projectId}/activities/${activityId}`);
      commit('SET_ACTIVE_ACTIVITY', response.data);
    } catch (error) {
      console.error('Failed to fetch activity:', error);
    } finally {
      dispatch('global/setLoading', false, { root: true });
    }
  },

  async createActivity({ commit, dispatch }, { activityData, projectId }) {
    try {
      dispatch('global/setLoading', true, { root: true });
      commit('CLEAR_ERRORS');
      await axios.post(`/projects/${projectId}/activities`, activityData,{
          headers: { 'Content-Type': 'multipart/form-data' },
      });
      await dispatch('project/fetchProjectById',projectId,{root:true});
    } catch (error) {
      if (error.response && error.response.data.errors) {
        commit('SET_ERRORS', error.response.data.errors);
      } else {
        commit('SET_ERRORS', { message: 'Failed to create activity. Please try again later.' });
      }
      console.error('Failed to create activity:', error);
    } finally {
      dispatch('global/setLoading', false, { root: true });
    }
  },

  async updateActivity({ commit, dispatch }, { activityData, projectId }) {
    try {
      dispatch('global/setLoading', true, { root: true });
      commit('CLEAR_ERRORS');
      const activityId = activityData.get('id');
      await axios.post(`/projects/${projectId}/activities/${activityId}/update`, activityData,{
          headers: { 'Content-Type': 'multipart/form-data' },
      });
      await dispatch('project/fetchProjectById',projectId,{root:true});
    } catch (error) {
      if (error.response && error.response.data.errors) {
        commit('SET_ERRORS', error.response.data.errors);
      } else {
        commit('SET_ERRORS', { message: 'Failed to update activity. Please try again later.' });
      }
      console.error('Failed to update activity:', error);
    } finally {
      dispatch('global/setLoading', false, { root: true });
    }
  },

  async deleteActivity({ commit, dispatch }, { activityId, projectId }) {
    try {
      dispatch('global/setLoading', true, { root: true });
      commit('CLEAR_ERRORS');
      await axios.post(`/projects/${projectId}/activities/${activityId}/delete`);
      await dispatch('project/fetchProjectById',projectId,{root:true});
    } catch (error) {
      if (error.response && error.response.data.errors) {
        commit('SET_ERRORS', error.response.data.errors);
      } else {
        commit('SET_ERRORS', { message: 'Failed to delete activity. Please try again later.' });
      }
      console.error('Failed to delete activity:', error);
    } finally {
      dispatch('global/setLoading', false, { root: true });
    }
  },
  async uploadActivityReport({commit,dispatch},{reportData}) {
    try {
      dispatch('global/setLoading', true, { root: true });
      const projectId = reportData.get('projectId');
      const activityId = reportData.get('activityId');
      await axios.post(`/projects/${projectId}/activities/${activityId}/upload-report`,reportData,{
          headers: { 'Content-Type': 'multipart/form-data' },
      });
      await dispatch('project/fetchProjectById',projectId,{root:true});
    } catch (error) {
      if (error.response && error.response.data.errors) {
        commit('SET_ERRORS', error.response.data.errors);
      } else {
        commit('SET_ERRORS', { message: 'Failed to upload report. Please try again later.' });
      }
      console.error('Failed to upload report:', error);
    } finally {
      dispatch('global/setLoading', false, { root: true });
    }
  },
  setErrors({ commit }, errors) {
    commit('SET_ERRORS', errors);
  },
};

const getters = {
  activities: (state) => state.activities,
  activeActivity: (state) => state.activeActivity,
  errors: (state) => state.errors,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
