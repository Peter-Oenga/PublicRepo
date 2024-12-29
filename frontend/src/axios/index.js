// src/axios.js (Renamed from axiosInstance.js to axios.js)
import axios from 'axios';

// Create an instance of axios
const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  config => {
    // Do something before request is sent
    const token = localStorage.getItem('token'); // Retrieve token from local storage or any other place
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    // Handle unauthorized error
    if (error.response && error.response.status === 401) {
      // Redirect to login or handle unauthorized error
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
