import axios from '@/axios';

const state = {
  permissions: [],
  errors: {},
  activePermission: null, // Holds the currently selected permission
};

const mutations = {
  SET_PERMISSIONS(state, permissions) {
    state.permissions = permissions;
  },
  SET_ERRORS(state, errors) {
    state.errors = errors;
  },
  CLEAR_ERRORS(state) {
    state.errors = {};
  },
  SET_ACTIVE_PERMISSION(state, permission) {
    state.activePermission = permission;
  },
  CLEAR_ACTIVE_PERMISSION(state) {
    state.activePermission = null;
  },
};

const actions = {
  async fetchPermissions({ commit }) {
    try {
      commit('global/SET_LOADING', true, { root: true });
      const response = await axios.get('/permissions');
      commit('SET_PERMISSIONS', response.data);
    } catch (error) {
      console.error('Failed to fetch permissions:', error);
    } finally {
      commit('global/SET_LOADING', false, { root: true });
    }
  },

  async fetchPermissionById({ commit }, permissionId) {
    try {
      commit('global/SET_LOADING', true, { root: true });
      const response = await axios.get(`/permissions/${permissionId}`);
      commit('SET_ACTIVE_PERMISSION', response.data);
    } catch (error) {
      console.error('Failed to fetch permission by ID:', error);
    } finally {
      commit('global/SET_LOADING', false, { root: true });
    }
  },

  async createPermission({ commit, dispatch }, permissionData) {
    try {
      commit('global/SET_LOADING', true, { root: true });
      commit('CLEAR_ERRORS');
      const response = await axios.post('/permissions', permissionData);
      await dispatch('fetchPermissions'); // Refresh the permissions list
      return response.data; // Return the created permission data
    } catch (error) {
      const errorData = error.response?.data?.errors || { message: 'Failed to create permission. Please try again later.' };
      commit('SET_ERRORS', errorData);
      console.error('Failed to create permission:', error);
    } finally {
      commit('global/SET_LOADING', false, { root: true });
    }
  },

  async updatePermission({ commit, dispatch }, permissionData) {
    try {
      commit('global/SET_LOADING', true, { root: true });
      commit('CLEAR_ERRORS');
      await axios.post(`/permissions/${permissionData.id}/update`, permissionData);
      await dispatch('fetchPermissions'); // Refresh the permissions list
    } catch (error) {
      const errorData = error.response?.data?.errors || { message: 'Failed to update permission. Please try again later.' };
      commit('SET_ERRORS', errorData);
      console.error('Failed to update permission:', error);
    } finally {
      commit('global/SET_LOADING', false, { root: true });
    }
  },

  async deletePermission({ commit, dispatch }, permissionId) {
    try {
      commit('global/SET_LOADING', true, { root: true });
      commit('CLEAR_ERRORS');
      await axios.post(`/permissions/${permissionId}/delete`);
      await dispatch('fetchPermissions'); // Refresh the permissions list
    } catch (error) {
      const errorData = error.response?.data?.errors || { message: 'Failed to delete permission. Please try again later.' };
      commit('SET_ERRORS', errorData);
      console.error('Failed to delete permission:', error);
    } finally {
      commit('global/SET_LOADING', false, { root: true });
    }
  },

  setErrors({ commit }, errors) {
    commit('SET_ERRORS', errors);
  },
};

const getters = {
  permissions: (state) => state.permissions,
  errors: (state) => state.errors,
  activePermission: (state) => state.activePermission,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
