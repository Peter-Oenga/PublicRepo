import axios from '@/axios';

const state = {
  roles: [],
  errors: {},
  activeRole: null, // Holds the currently selected role
};

const mutations = {
  SET_ROLES(state, roles) {
    state.roles = roles;
  },
  SET_ERRORS(state, errors) {
    state.errors = errors;
  },
  CLEAR_ERRORS(state) {
    state.errors = {};
  },
  SET_ACTIVE_ROLE(state, role) {
    state.activeRole = role;
  },
  CLEAR_ACTIVE_ROLE(state) {
    state.activeRole = null;
  },
};

const actions = {
  async fetchRoles({ commit }) {
    try {
      commit('global/SET_LOADING', true, { root: true });
      const response = await axios.get('/roles');
      commit('SET_ROLES', response.data);
    } catch (error) {
      console.error('Failed to fetch roles:', error);
    } finally {
      commit('global/SET_LOADING', false, { root: true });
    }
  },

  async fetchRoleById({ commit }, roleId) {
    try {
      commit('global/SET_LOADING', true, { root: true });
      const response = await axios.get(`/roles/${roleId}`);
      commit('SET_ACTIVE_ROLE', response.data);
    } catch (error) {
      console.error('Failed to fetch role by ID:', error);
    } finally {
      commit('global/SET_LOADING', false, { root: true });
    }
  },

  async createRole({ commit, dispatch }, roleData) {
    try {
      commit('global/SET_LOADING', true, { root: true });
      commit('CLEAR_ERRORS');
      const response = await axios.post('/roles', roleData);
      await dispatch('fetchRoles'); // Refresh the role list
      return response.data; // Return the created role data
    } catch (error) {
      const errorData = error.response?.data?.errors || { message: 'Failed to create role. Please try again later.' };
      commit('SET_ERRORS', errorData);
      console.error('Failed to create role:', error);
    } finally {
      commit('global/SET_LOADING', false, { root: true });
    }
  },

  async updateRole({ commit, dispatch }, roleData) {
    try {
      commit('global/SET_LOADING', true, { root: true });
      commit('CLEAR_ERRORS');
      await axios.post(`/roles/${roleData.id}/update`, roleData);
      await dispatch('fetchRoles'); // Refresh the role list
    } catch (error) {
      const errorData = error.response?.data?.errors || { message: 'Failed to update role. Please try again later.' };
      commit('SET_ERRORS', errorData);
      console.error('Failed to update role:', error);
    } finally {
      commit('global/SET_LOADING', false, { root: true });
    }
  },

  async deleteRole({ commit, dispatch }, roleId) {
    try {
      commit('global/SET_LOADING', true, { root: true });
      commit('CLEAR_ERRORS');
      await axios.post(`/roles/${roleId}/delete`);
      await dispatch('fetchRoles'); // Refresh the role list
    } catch (error) {
      const errorData = error.response?.data?.errors || { message: 'Failed to delete role. Please try again later.' };
      commit('SET_ERRORS', errorData);
      console.error('Failed to delete role:', error);
    } finally {
      commit('global/SET_LOADING', false, { root: true });
    }
  },

  setErrors({ commit }, errors) {
    commit('SET_ERRORS', errors);
  },
};

const getters = {
  roles: (state) => state.roles,
  errors: (state) => state.errors,
  activeRole: (state) => state.activeRole,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
