<template>
    <section class="w-screen h-screen flex items-center justify-center">
      <div class="w-screen max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <header class="text-center mb-6">
        <img :src="logoSrc" alt="Logo" class="mx-auto h-16 w-auto" />
        <h2 class="text-3xl font-bold mt-2 mb-2">Request Password Reset</h2>
        <p class="mb-6">Enter your email to request a password reset link</p>
      </header>
      
      <!-- Spinner Component -->
      <SpinnerComp :loading="loading" />
  
      <form @submit.prevent="handleRequestPasswordReset">
        <!-- Error Message -->
        <p v-if="errors.message" class="text-red-500 text-center text-sm mb-4">{{ errors.message }}</p>
        
        <CustomInput
          v-model="form.email"
          type="email"
          prompt="Enter your email"
          :error="errors.email ? errors.email.join(' ') : ''"
          :inactiveColor="'border-gray-300'"
          :activeColor="'border-blue-500'"
        />
        
        <div class="mt-6 flex justify-center">
          <CustomButton
            type="primary"
            :inactiveColor="'bg-blue-500'"
            :activeColor="'bg-blue-700'"
          >
            Send Password Reset Link
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
import { mapGetters,mapActions } from 'vuex';

export default {
  components: {
    CustomInput,
    CustomButton,
    SpinnerComp
  },
  computed : {
    ...mapGetters('user',['errors']),
    ...mapGetters('global',['loading'])
  }, 
  data() {
    return {
      form: {
        email: ''
      },
      logoSrc: logo
    };
  },
  methods: {
    ...mapActions('user',['requestPasswordReset']),
    async handleRequestPasswordReset() {
      const response = await this.requestPasswordReset(this.form.email);
      if (response) {
        this.$router.push({name:'Login'});
      }
    }
  }
};
</script>
