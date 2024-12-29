import axiosInstance from '../../axios'; // Your axios instance with the '/api' prefix
import axios from 'axios'; // Plain axios for the CSRF token request

const state = {
    users: [],
    errors: {},
    currentUser: null,
    token : '',
};

const mutations = {
    SET_USERS(state, users) {
        state.users = users;
    },
    SET_ERRORS(state, errors) {
        state.errors = errors;
    },
    CLEAR_ERRORS(state) {
        state.errors = {};
    },
    SET_CURRENT_USER(state, user) {
        state.currentUser = user; 
    },
    SET_TOKEN(state,token) {
        state.token = token;
    }
};

const actions = {
    async loginUser({commit},credentials) {
        try {
            commit('global/SET_LOADING', true, { root: true });
            await axios.get(process.env.VUE_APP_CSRF_URL, {
                withCredentials: true
            });
            const response = await axiosInstance.post('/users/login', credentials);
            const token = response.data.token;
            const user = JSON.stringify(response.data.user);
            localStorage.setItem('token', token);
            localStorage.setItem('user',user);
            commit('SET_TOKEN',token);
            commit('SET_CURRENT_USER',user);
            commit('SET_ERRORS',{});
            return true;
        }catch(error) {
            let errors = {};
            // Handle validation errors or 401 unauthorized error
            if (error.response && error.response.status === 401) {
                errors = { message: 'Invalid credentials. Please check your email and password.' };
            } else if (error.response && error.response.data.errors) {
                errors = error.response.data.errors;
            } else {
                errors = { message: 'Something went wrong. Please try again later.' };
            }
            commit('SET_ERRORS',errors);
        }finally {
            commit('global/SET_LOADING', false, { root: true });
        }
    },
    async registerUser({commit},formData) {
        try {
            commit('global/SET_LOADING', true, { root: true });
            await axios.get(process.env.VUE_APP_CSRF_URL, {
                withCredentials: true
            });
            await axiosInstance.post('/users/register',formData,{
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            commit('SET_ERRORS',{});
            return true;
        }catch(error) {
            let errors = {};
             // Handle validation errors or 401 unauthorized error
            if (error.response && error.response.status === 401) {
                errors = { message: 'Invalid data. Please check your input and try again.' };
            } else if (error.response && error.response.data.errors) {
                errors = error.response.data.errors;
            } else {
                errors = { message: 'Something went wrong. Please try again later.' };
            }
            commit('SET_ERRORS',errors);
        }finally {
            commit('global/SET_LOADING', false, { root: true });
        }
    },
    async logoutUser({ commit }) {
        try {
            commit('global/SET_LOADING', true, { root: true });

            // Revoke the token on the backend
            await axiosInstance.post('/users/logout');

            // Clear the user state and token
            commit('SET_CURRENT_USER', null);
            commit('SET_TOKEN', '');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            commit('SET_ERRORS', {});
            return true;
        } catch (error) {
            let errors = {};
            // Handle errors
            if (error.response && error.response.status === 401) {
                errors = { message: 'Unauthorized request. Please log in again.' };
            } else {
                errors = { message: 'Something went wrong. Please try again later.' };
            }
            commit('SET_ERRORS', errors);
        } finally {
            commit('global/SET_LOADING', false, { root: true });
        }
    },
    async requestPasswordReset({ commit }, email) {
        try {
            commit('global/SET_LOADING', true, { root: true });

            // Send the password reset request
            const response = await axiosInstance.post('/users/request-password-reset', { email });

            // Clear any existing errors
            commit('SET_ERRORS', {});
            console.log(response.data.message);
            // Return a success message from the response
            return response.data.message;
        } catch (error) {
            let errors = {};
            // Handle errors
            if (error.response && error.response.status === 400) {
                errors = { message: error.response.data.message || 'Invalid email address.' };
            } else {
                errors = { message: 'Something went wrong. Please try again later.' };
            }
            commit('SET_ERRORS', errors);
            return false;
        } finally {
            commit('global/SET_LOADING', false, { root: true });
        }
    },
    async resetPassword({ commit }, data) {
        try {
            commit('global/SET_LOADING', true, { root: true });

            // Send the password reset request
            const response = await axiosInstance.post('/users/reset-password',data);

            // Clear any existing errors
            commit('SET_ERRORS', {});
            console.log(response.data.message);
            // Return a success message from the response
            return response.data.message;
        } catch (error) {
            let errors = {};
            // Handle errors
            if (error.response && error.response.status === 400) {
                errors = { message: error.response.data.message || 'Invalid email address.' };
            } else {
                errors = { message: 'Something went wrong. Please try again later.' };
            }
            commit('SET_ERRORS', errors);
            return false;
        } finally {
            commit('global/SET_LOADING', false, { root: true });
        }
    },

    async fetchUserById({ commit }, userId) {
        try {
            commit('global/SET_LOADING', true, { root: true });
            const response = await axiosInstance.get(`/users/${userId}`);
            commit('SET_CURRENT_USER', response.data);
        } catch (error) {
            console.error('Failed to fetch user:', error);
            commit('SET_ERRORS', { message: 'Failed to fetch user. Please try again later.' });
        } finally {
            commit('global/SET_LOADING',false, { root: true });
        }
    },

    async updateUser({ commit }, userData) {
        try {
            commit('global/SET_LOADING', true, { root: true });
            await axiosInstance.post(`/users/${userData.id}/update`, userData);
            commit('SET_CURRENT_USER', userData); // Update the current user in the store
        } catch (error) {
            let errors = {};
            if (error.response && error.response.data.errors) {
                errors = error.response.data.errors;
            } else {
                errors = { message: 'Failed to update user. Please try again later.' };
            }
            commit('SET_ERRORS', errors);
            console.error('Failed to update user:', error);
        } finally {
            commit('global/SET_LOADING',false, { root: true });
        }
    },
    setErrors({ commit }, errors) {
        commit('SET_ERRORS', errors);
    },
};

const getters = {
    users: (state) => state.users,
    errors: (state) => state.errors,
    currentUser: (state) => {
        // If the current user is not in the state, try to fetch it from localStorage
        if (!state.currentUser) {
            const user = localStorage.getItem('user');
            if (user) {
                return JSON.parse(user);
            }
            return null;
        }
        return state.currentUser;
    },
    token: (state) => {
        // If the token is not in the state, try to fetch it from localStorage
        if (!state.token) {
            return localStorage.getItem('token') || '';
        }
        return state.token;
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};


