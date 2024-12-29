import axios from '@/axios';

const state = {
  tags: [],
  errors: {},
  activeTag: null, // Renamed from currentTag to activeTag
};

const mutations = {
  SET_TAGS(state, tags) {
    state.tags = tags;
  },
  SET_ERRORS(state, errors) {
    state.errors = errors;
  },
  CLEAR_ERRORS(state) {
    state.errors = {};
  },
  SET_ACTIVE_TAG(state, tag) {
    state.activeTag = tag; // Renamed from SET_CURRENT_TAG to SET_ACTIVE_TAG
  },
  CLEAR_ACTIVE_TAG(state) {
    state.activeTag = null; // Renamed from CLEAR_CURRENT_TAG to CLEAR_ACTIVE_TAG
  },
};

const actions = {
  async fetchTags({ commit },{name}) {
    try {
      commit('global/SET_LOADING', true, { root: true });
      const response = await axios.get(`/tags?name=${name}`);
      commit('SET_TAGS', response.data);
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    } finally {
      commit('global/SET_LOADING', false, { root: true });
    }
  },

  async fetchTagById({ commit }, tagId) {
    try {
      commit('global/SET_LOADING', true, { root: true });
      const response = await axios.get(`/tags/${tagId}`);
      commit('SET_ACTIVE_TAG', response.data); // Renamed to SET_ACTIVE_TAG
    } catch (error) {
      console.error('Failed to fetch tag by ID:', error);
    } finally {
      commit('global/SET_LOADING', false, { root: true });
    }
  },

  async createTag({ commit, dispatch }, tagData) {
    try {
      commit('global/SET_LOADING', true, { root: true });
      commit('CLEAR_ERRORS');
      const response = await axios.post('/tags', tagData);
      await dispatch('fetchTags',{name:''}); // Refresh the tag list
      return response.data; // Return the created tag data
    } catch (error) {
      const errorData = error.response?.data?.errors || { message: 'Failed to create tag. Please try again later.' };
      commit('SET_ERRORS', errorData);
      console.error('Failed to create tag:', error);
    } finally {
      commit('global/SET_LOADING', false, { root: true });
    }
  },

  async updateTag({ commit, dispatch }, tagData) {
    try {
      commit('global/SET_LOADING', true, { root: true });
      commit('CLEAR_ERRORS');
      await axios.post(`/tags/${tagData.id}/update`, tagData);
      await dispatch('fetchTags',{name:''}); // Refresh the tag list
    } catch (error) {
      const errorData = error.response?.data?.errors || { message: 'Failed to update tag. Please try again later.' };
      commit('SET_ERRORS', errorData);
      console.error('Failed to update tag:', error);
    } finally {
      commit('global/SET_LOADING', false, { root: true });
    }
  },

  async deleteTag({ commit, dispatch }, tagId) {
    try {
      commit('global/SET_LOADING', true, { root: true });
      commit('CLEAR_ERRORS');
      await axios.post(`/tags/${tagId}/delete`);
      await dispatch('fetchTags',{name:''}); // Refresh the tag list
    } catch (error) {
      const errorData = error.response?.data?.errors || { message: 'Failed to delete tag. Please try again later.' };
      commit('SET_ERRORS', errorData);
      console.error('Failed to delete tag:', error);
    } finally {
      commit('global/SET_LOADING', false, { root: true });
    }
  },

  setErrors({ commit }, errors) {
    commit('SET_ERRORS', errors);
  },
};

const getters = {
  tags: (state) => state.tags,
  errors: (state) => state.errors,
  activeTag: (state) => state.activeTag, // Renamed from currentTag to activeTag
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
