import axios from '@/axios';

const state = {
  eventOutcomes: [],
  errors: {},
};

const mutations = {
  SET_EVENT_OUTCOMES(state, outcomes) {
    state.eventOutcomes = outcomes;
  },
  SET_ERRORS(state, errors) {
    state.errors = errors;
  },
  CLEAR_ERRORS(state) {
    state.errors = {};
  },
};

const actions = {

  async createEventOutcome({ commit,rootState,dispatch }, payload) {
    try {
      commit('global/SET_LOADING', true, { root: true });
      commit('CLEAR_ERRORS');
      const activeEvent = rootState.event.activeEvent;
      const data = {
        event_id : payload?.eventId,
        description: payload?.outcomeData?.description,
        date: payload?.outcomeData?.date,
      };
      
      await axios.post(`/events/${activeEvent.id}/outcomes`, data);
      await dispatch('event/fetchEventById', activeEvent.id, { root: true });
    } catch (error) {
      if (error.response && error.response.data.errors) {
        commit('SET_ERRORS', error.response.data.errors);
      } else {
        commit('SET_ERRORS', { message: 'Failed to create event outcome. Please try again later.' });
      }
      console.error('Failed to create event outcome:', error);
    } finally {
      commit('global/SET_LOADING', false, { root: true });
    }
  },

  async updateEventOutcome({ commit, rootState,dispatch }, payload) {
    try {
      commit('global/SET_LOADING', true, { root: true });
      commit('CLEAR_ERRORS');
      const activeEvent = rootState.event.activeEvent;
      const data = {
        description: payload?.outcomeData?.description,
        date: payload?.outcomeData?.date,
      };
      await axios.post(`/events/${activeEvent.id}/outcomes/${payload?.outcomeId}/update`, data);
      
      await dispatch('event/fetchEventById', activeEvent.id,{root:true}); // Refresh the outcomes list
    } catch (error) {
      if (error.response && error.response.data.errors) {
        commit('SET_ERRORS', error.response.data.errors);
      } else {
        commit('SET_ERRORS', { message: 'Failed to update event outcome. Please try again later.' });
      }
      console.error('Failed to update event outcome:', error);
    } finally {
      commit('global/SET_LOADING', false, { root: true });
    }
  },

  async deleteEventOutcome({ commit,rootState,dispatch },outcomeId) { 
    try {
      commit('global/SET_LOADING', true, { root: true });
      commit('CLEAR_ERRORS');
      const activeEvent = rootState.event.activeEvent;
      const eventId = activeEvent.id;
      await axios.post(`/events/${eventId}/outcomes/${outcomeId}/delete`);
      await dispatch('event/fetchEventById', activeEvent.id, { root: true });
    } catch (error) {
      if (error.response && error.response.data.errors) {
        commit('SET_ERRORS', error.response.data.errors);
      } else {
        commit('SET_ERRORS', { message: 'Failed to delete event outcome. Please try again later.' });
      }
      console.error('Failed to delete event outcome:', error);
    } finally {
      commit('global/SET_LOADING', false, { root: true });
    }
  }, 
  async uploadOutcomeFile({ commit, rootState,dispatch },{outcomeId,formData}) {
    try {
        commit('global/SET_LOADING', true, { root: true });
        commit('CLEAR_ERRORS');

        const activeEvent = rootState.event.activeEvent;

        await axios.post(`/events/${activeEvent.id}/outcomes/${outcomeId}/files`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        
         // Use the setActiveEvent action to update the event
         await dispatch('event/fetchEventById',activeEvent.id, { root: true });

    } catch (error) {
        if (error.response && error.response.data.errors) {
            commit('SET_ERRORS', error.response.data.errors);
        } else {
            commit('SET_ERRORS', { message: 'Failed to upload file. Please try again later.' });
        }
        console.error('Failed to upload file:', error);
    } finally {
        commit('global/SET_LOADING', false, { root: true });
    }
  },
  async removeOutcomeFile({ commit,rootState,dispatch }, {outcomeId,fileId}) {
    try {
      commit('global/SET_LOADING', true, { root: true });
      commit('CLEAR_ERRORS');
      const activeEvent = rootState.event.activeEvent;
      await axios.post(`/events/${activeEvent.id}/outcomes/${outcomeId}/files/${fileId}/delete`);
      
      await dispatch('event/fetchEventById', activeEvent.id, { root: true });
    } catch (error) {
      if (error.response && error.response.data.errors) {
        commit('SET_ERRORS', error.response.data.errors);
      } else {
        commit('SET_ERRORS', { message: 'Failed to remove file. Please try again later.' });
      }
      console.error('Failed to remove file:', error);
    } finally {
      commit('global/SET_LOADING', false, { root: true });
    }
  },
  async uploadOutcomeImage({ commit, rootState,dispatch },{outcomeId,formData}) {
    try {
        commit('global/SET_LOADING', true, { root: true });
        commit('CLEAR_ERRORS');

        const activeEvent = rootState.event.activeEvent;

        await axios.post(`/events/${activeEvent.id}/outcomes/${outcomeId}/images`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        
         // Use the setActiveEvent action to update the event
         await dispatch('event/fetchEventById',activeEvent.id, { root: true });

    } catch (error) {
        if (error.response && error.response.data.errors) {
            commit('SET_ERRORS', error.response.data.errors);
        } else {
            commit('SET_ERRORS', { message: 'Failed to upload file. Please try again later.' });
        }
        console.error('Failed to upload file:', error);
    } finally {
        commit('global/SET_LOADING', false, { root: true });
    }
  },
  async removeOutcomeImage({ commit,rootState,dispatch }, {outcomeId,imageId}) {
    try {
      commit('global/SET_LOADING', true, { root: true });
      commit('CLEAR_ERRORS');
      const activeEvent = rootState.event.activeEvent;
      await axios.post(`/events/${activeEvent.id}/outcomes/${outcomeId}/images/${imageId}/delete`);
      
      await dispatch('event/fetchEventById', activeEvent.id, { root: true });
    } catch (error) {
      if (error.response && error.response.data.errors) {
        commit('SET_ERRORS', error.response.data.errors);
      } else {
        commit('SET_ERRORS', { message: 'Failed to remove file. Please try again later.' });
      }
      console.error('Failed to remove file:', error);
    } finally {
      commit('global/SET_LOADING', false, { root: true });
    }
  },
  setErrors({ commit }, errors) {
    commit('SET_ERRORS', errors);
  },
};

const getters = {
  eventOutcomes: (state) => state.eventOutcomes,
  errors: (state) => state.errors,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
