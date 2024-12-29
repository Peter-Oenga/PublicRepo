import axios from '@/axios';

const state = {
  events: [],
  activeEvent: null,
  errors: {},
};

const mutations = {
  SET_EVENTS(state, events) {
    state.events = events;
  },
  SET_ACTIVE_EVENT(state, event) {
    state.activeEvent = event;
  },
  SET_ERRORS(state, errors) {
    state.errors = errors;
  },
  CLEAR_ERRORS(state) {
    state.errors = {};
  },
};

const actions = {
  async fetchEvents({ commit },{tag,search}) {
    try {
      commit('global/SET_LOADING', true, { root: true });
      const response = await axios.get(`/events?tag=${tag}&search=${search}`);
      commit('SET_EVENTS', response.data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      commit('global/SET_LOADING', false, { root: true });
    }
  },

  async fetchEventById({ commit }, eventId) {
    try {
      commit('global/SET_LOADING', true, { root: true });
      const response = await axios.get(`/events/${eventId}`);
      commit('SET_ACTIVE_EVENT', response.data);
    } catch (error) {
      console.error('Failed to fetch event:', error);
    } finally {
      commit('global/SET_LOADING', false, { root: true });
    }
  },

  async createEvent({ commit, state }, formData) {
    try {
      commit('global/SET_LOADING', true, { root: true });
      commit('CLEAR_ERRORS');
      const response = await axios.post('/events', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const newEvent = response.data;

      // Update the events array
      commit('SET_EVENTS', [...state.events, newEvent]);

      return newEvent; // Return created event data
    } catch (error) {
      if (error.response && error.response.data.errors) {
        commit('SET_ERRORS', error.response.data.errors);
      } else {
        commit('SET_ERRORS', { message: 'Failed to create event. Please try again later.' });
      }
      console.error('Failed to create event:', error);
    } finally {
      commit('global/SET_LOADING', false, { root: true });
    }
  },

  async updateEvent({ commit,dispatch }, { id, formData }) {
    try {
        commit('global/SET_LOADING', true, { root: true });
        commit('CLEAR_ERRORS');
        
        await axios.post(`/events/${id}/update`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        await dispatch('event/fetchEventById',id,{root:true});

    } catch (error) {
        if (error.response && error.response.data.errors) {
            commit('SET_ERRORS', error.response.data.errors);
        } else {
            commit('SET_ERRORS', { message: 'Failed to update event. Please try again later.' });
        }
        console.error('Failed to update event:', error);
    } finally {
        commit('global/SET_LOADING', false, { root: true });
    }
  },


  async deleteEvent({ commit, state }, eventId) {
    try {
      commit('global/SET_LOADING', true, { root: true });
      commit('CLEAR_ERRORS');
      await axios.post(`/events/${eventId}/delete`);

      // Remove the event from the events array
      const updatedEvents = state.events.filter(event => event.id !== eventId);
      commit('SET_EVENTS', updatedEvents);
    } catch (error) {
      if (error.response && error.response.data.errors) {
        commit('SET_ERRORS', error.response.data.errors);
      } else {
        commit('SET_ERRORS', { message: 'Failed to delete event. Please try again later.' });
      }
      console.error('Failed to delete event:', error);
    } finally {
      commit('global/SET_LOADING', false, { root: true });
    }
  },

  async uploadEventFile({ commit, state }, formData) {
    try {
        commit('global/SET_LOADING', true, { root: true });
        commit('CLEAR_ERRORS');

        const response = await axios.post(`/events/${state.activeEvent.id}/files`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        const uploadedFile = response.data.file;
        console.log(uploadedFile);

        // Add the new file to the active event
        const updatedEvent = {
            ...state.activeEvent,
            files: [...state.activeEvent.files, uploadedFile],
        };
        commit('SET_ACTIVE_EVENT', updatedEvent);

        return uploadedFile;
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

  async removeEventFile({ commit, state }, fileId) {
    try {
      commit('global/SET_LOADING', true, { root: true });
      commit('CLEAR_ERRORS');
      await axios.post(`/events/${state.activeEvent.id}/files/${fileId}/delete`);

      // Remove the file from the active event
      const updatedEvent = {
        ...state.activeEvent,
        files: state.activeEvent.files.filter(file => file.id !== fileId),
      };
      commit('SET_ACTIVE_EVENT', updatedEvent);
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

  async updateEventPoster({ commit, state }, { eventId, formData }) {
    try {
      commit('global/SET_LOADING', true, { root: true });
      commit('CLEAR_ERRORS');
      const response = await axios.post(`/events/${eventId}/poster`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const updatedPoster = response.data.poster;

      // Update the poster for the active event
      const updatedEvent = {
        ...state.activeEvent,
        poster: updatedPoster,
      };
      commit('SET_ACTIVE_EVENT', updatedEvent);

      return updatedPoster;
    } catch (error) {
      if (error.response && error.response.data.errors) {
        commit('SET_ERRORS', error.response.data.errors);
      } else {
        commit('SET_ERRORS', { message: 'Failed to update poster. Please try again later.' });
      }
      console.error('Failed to update poster:', error);
    } finally {
      commit('global/SET_LOADING', false, { root: true });
    }
  },

  setActiveEvent({ commit }, event) {
    commit('SET_ACTIVE_EVENT', event);
  },
  setErrors({ commit }, errors) {
    commit('SET_ERRORS', errors);
  },
};

const getters = {
  events: (state) => state.events,
  activeEvent: (state) => state.activeEvent,
  errors: (state) => state.errors,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
