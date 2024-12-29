<template>
  <section class="w-screen h-screen flex items-center">
    <div class="w-screen max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
    <header class="text-center mb-6">
      <img :src="logoSrc" alt="Logo" class="mx-auto h-16 w-auto" />
      <h2 class="text-3xl font-bold mt-2 mb-2">Login</h2>
      <p class="mb-6">Log into your account</p>
    </header>
    
    <!-- Spinner Component -->
    <SpinnerComp :loading="loading" />

    <form @submit.prevent="handleLoginUser">
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
      
      <CustomInput
        v-model="form.password"
        type="password"
        prompt="Enter your password"
        :error="errors.password ? errors.password.join(' ') : ''"
        :inactiveColor="'border-gray-300'"
        :activeColor="'border-blue-500'"
      />
      
      <div class="mt-6 flex justify-between items-center">
        <CustomButton
          type="primary"
          @click="handleLoginUser"
          :inactiveColor="'bg-blue-500'"
          :activeColor="'bg-blue-700'"
        >
          Login
        </CustomButton>
      </div>
    </form>

    <!-- Router Links for Forgot Password and Register -->
    <div class="mt-6 text-center">
      <router-link
        to="/request-password-reset"
        class="text-sm text-blue-500 hover:text-blue-700"
      >
        Forgot Password?
      </router-link>
      <p class="text-sm text-gray-500 mt-4">
        Don't have an account?
        <router-link
          to="/register"
          class="text-blue-500 hover:text-blue-700"
        >
          Register
        </router-link>
      </p>
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
    SpinnerComp
  },
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      logoSrc: logo
    };
  },
  computed: {
    ...mapGetters('global', ['loading']),
    ...mapGetters('user', ['errors']),
    ...mapGetters('collection',['rootId'])
  },
  methods: {
    ...mapActions('user', ['loginUser']),
    ...mapActions('collection',['fetchRootId']),
    async handleLoginUser() {
      const success = await this.loginUser(this.form);
      if (success) {
        await this.fetchRootId();
        this.$router.push({ name: 'Collection',params:{id:this.rootId} });
      }
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500&family=Roboto:wght@400;500&family=Noto+Sans+Myanmar+UI:wght@400;500&family=Arial:wght@400;500&display=swap');

* {
  font-family: 'Google Sans', Roboto, 'Noto Sans Myanmar UI', Arial, sans-serif;
}
</style>
