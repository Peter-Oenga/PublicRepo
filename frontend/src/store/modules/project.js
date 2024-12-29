import axios from '@/axios';

const state = {
  projects: [],
  activeProject: null,
  errors: {},
  pagination: {
    currentPage: 1,
    lastPage: null,
    perPage: 10,
    total: null,
  },
};

const mutations = {
  SET_PROJECTS(state, projects) {
    state.projects = projects;
  },
  SET_PAGINATION(state, pagination) {
    state.pagination = pagination;
  },
  SET_ACTIVE_PROJECT(state, project) {
    state.activeProject = project;
  },
  SET_ERRORS(state, errors) {
    state.errors = errors;
  },
  CLEAR_ERRORS(state) {
    state.errors = {};
  },
};

const actions = {
  async fetchProjects({ commit, dispatch },page = 1) {
    try {
      dispatch('global/setLoading', true, { root: true });
      const response = await axios.get(`/projects?page=${page}`);
      // Update projects and pagination data
      commit('SET_PROJECTS', response.data.data);
      commit('SET_PAGINATION', {
        currentPage: response.data.current_page,
        lastPage: response.data.last_page,
        perPage: response.data.per_page,
        total: response.data.total,
      });
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      dispatch('global/setLoading', false, { root: true });
    }
  },

  async fetchProjectById({ commit, dispatch }, projectId) {
    try {
      dispatch('global/setLoading', true, { root: true });
      const response = await axios.get(`/projects/${projectId}`);
      commit('SET_ACTIVE_PROJECT', response.data);
    } catch (error) {
      console.error('Failed to fetch project:', error);
    } finally {
      dispatch('global/setLoading', false, { root: true });
    }
  },

  async createProject({ commit, dispatch }, projectData) {
    try {
      dispatch('global/setLoading', true,{ root: true });
      commit('CLEAR_ERRORS');
      await axios.post('/projects', projectData);
      await dispatch('fetchProjects'); // Refresh the project list
    } catch (error) {
      if (error.response && error.response.data.errors) {
        commit('SET_ERRORS', error.response.data.errors);
      } else {
        commit('SET_ERRORS', { message: 'Failed to create project. Please try again later.' });
      }
      console.error('Failed to create project:', error);
    } finally {
      dispatch('global/setLoading', false,{ root: true });
    }
  },

  async updateProject({ commit, dispatch }, projectData) {
    try {
      dispatch('global/setLoading', true,{ root: true });
      commit('CLEAR_ERRORS');
      await axios.post(`/projects/${projectData.id}/update`, projectData);
      await dispatch('fetchProjectById',projectData.id); // Refresh the project list
    } catch (error) {
      if (error.response && error.response.data.errors) {
        commit('SET_ERRORS', error.response.data.errors);
      } else {
        commit('SET_ERRORS', { message: 'Failed to update project. Please try again later.' });
      }
      console.error('Failed to update project:', error);
    } finally {
      dispatch('global/setLoading', false,{ root: true });
    }
  },

  async deleteProject({ commit, dispatch }, projectId) {
    try {
      dispatch('global/setLoading', true,{ root: true });
      commit('CLEAR_ERRORS');
      await axios.post(`/projects/${projectId}/delete`);
      await dispatch('fetchProjects'); // Refresh the project list
    } catch (error) {
      if (error.response && error.response.data.errors) {
        commit('SET_ERRORS', error.response.data.errors);
      } else {
        commit('SET_ERRORS', { message: 'Failed to delete project. Please try again later.' });
      }
      console.error('Failed to delete project:', error);
    } finally {
      dispatch('global/setLoading', false,{ root: true });
    }
  },
  setErrors({ commit }, errors) {
    commit('SET_ERRORS', errors);
  },
};

const getters = {
  projects: (state) => state.projects,
  activeProject: (state) => state.activeProject,
  errors: (state) => state.errors,
  pagination:(state)=>state.pagination
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
