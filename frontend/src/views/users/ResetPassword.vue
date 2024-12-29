<template>
    <section class="w-screen h-screen flex items-center justify-center">
      <div class="w-screen max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <header class="text-center mb-6">
        <img :src="logoSrc" alt="Logo" class="mx-auto h-16 w-auto" />
        <h2 class="text-3xl font-bold mt-2 mb-2">Reset Your Password</h2>
        <p class="mb-6">Enter your new password below</p>
      </header>
      
      <!-- Spinner Component -->
      <SpinnerComp :loading="loading" />
  
      <form @submit.prevent="handleResetPassword">
        <!-- Error Message -->
        <p v-if="errors.message" class="text-red-500 text-center text-sm mb-4">{{ errors.message }}</p>
        
        <CustomInput
          v-model="form.password"
          type="password"
          prompt="New Password"
          :error="errors.password ? errors.password.join(' ') : ''"
          :inactiveColor="'border-gray-300'"
          :activeColor="'border-blue-500'"
        />
        
        <CustomInput
          v-model="form.password_confirmation"
          type="password"
          prompt="Confirm Password"
          :error="errors.password_confirmation ? errors.password_confirmation.join(' ') : ''"
          :inactiveColor="'border-gray-300'"
          :activeColor="'border-blue-500'"
        />
        
        <div class="mt-6 flex justify-center">
          <CustomButton
            type="primary"
            :inactiveColor="'bg-blue-500'"
            :activeColor="'bg-blue-700'"
          >
            Reset Password
          </CustomButton>
        </div>
      </form>
      <!-- Router Link for Login -->
      <div class="mt-6 text-center">
        <router-link
          to="/login"
          class="text-sm text-blue-500 hover:text-blue-700"
        >
          Login
        </router-link>
      </div>
    </div>
    </section>
    
  </template>
<script>
import CustomInput from '@/components/CustomInput.vue';
import CustomButton from '@/components/CustomButton.vue';
import SpinnerComp from '@/components/SpinnerComp.vue';
import logo from '@/assets/logo.png';
import { mapGetters, mapActions } from 'vuex';
export default {
  components: {
    CustomInput,
    CustomButton,
    SpinnerComp // Register the spinner component
  },
  computed : {
    ...mapGetters('user',['errors']),
    ...mapGetters('global',['loading'])
  },
  data() {
    return {
      form: {
        password: '',
        password_confirmation: ''
      },
      logoSrc:logo
    };
  },
  methods: {
    ...mapActions('user',['resetPassword']),
    async handleResetPassword() {
      this.loading = true;
      this.errors = {};
      // Extract the reset token from the URL (assuming it's included as a query parameter)
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const email = urlParams.get('email');
      const data = {
        email,
        token,
        password: this.form.password,
        password_confirmation: this.form.password_confirmation
      };
      const response = await this.resetPassword(data);
      if (response) {
        this.$router.push({name:'Login'});
      }
    }
  }
};
</script>
  