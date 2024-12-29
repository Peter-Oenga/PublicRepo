// breadcrumb.js
const state = {
  breadcrumb: [], // This will hold the breadcrumb items
};

const mutations = {
  ADD_BREADCRUMB_ITEM(state, item) {
    state.breadcrumb.push(item);
  },
  TRIM_BREADCRUMB(state, index) {
    state.breadcrumb = state.breadcrumb.slice(0, index + 1);
  },
  CLEAR_BREADCRUMB(state) {
    state.breadcrumb = [];
  },
};

const actions = {
  addbBreadcrumItem({ commit }, item) {
    commit('ADD_BREADCRUMB_ITEM', item);
  },
  trimBreadcrumb({ commit }, index) {
    commit('TRIM_BREADCRUMB', index);
  },
  clearBreadcrumb({ commit }) {
    commit('CLEAR_BREADCRUMB');
  },
};

const getters = {
  breadcrumb: (state) => state.breadcrumb,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
