<template>
    <div v-if="loading" class="spinner-overlay">
      <div class="spinner"></div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SpinnerComp',
    props: {
      loading: {
        type: Boolean,
        required: true
      }
    },
  };
  </script>
  
  <style scoped>
  .spinner-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.7);
    z-index: 9999;
  }
  
  .spinner {
    width: 50px;
    height: 50px;
    border: 5px solid rgba(0, 0, 0, 0.1); /* Light border for the spinner */
    border-radius: 50%;
    border-top: 5px solid #3490dc; /* Blue color */
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  </style>
  