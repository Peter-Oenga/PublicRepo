<template>
    <div class="w-screen max-w-md mx-auto p-6 bg-white shadow-md rounded-lg my-4">
    <!-- Spinner Component -->
    <SpinnerComp :loading="loading" />

    <header class="text-center mb-6">
      <img :src="logoSrc" alt="Logo" class="mx-auto h-16 w-auto" />
      <h2 class="text-3xl font-bold mt-2 mb-2">Register</h2>
      <p class="mb-6">Create your account</p>
    </header>
    
    <form @submit.prevent="handleRegisterUser">
      <!-- Error Message -->
      <p v-if="errors.message" class="text-red-500 text-center text-sm mb-4">{{ errors.message }}</p>
      
      <CustomInput
        v-model="form.first_name"
        type="text"
        prompt="First Name"
        :error="errors.first_name ? errors.first_name.join(' ') : ''"
        :inactiveColor="'border-gray-300'"
        :activeColor="'border-blue-500'"
      />
      
      <CustomInput
        v-model="form.middle_name"
        type="text"
        prompt="Middle Name (optional)"
        :error="errors.middle_name ? errors.middle_name.join(' ') : ''"
        :inactiveColor="'border-gray-300'"
        :activeColor="'border-blue-500'"
      />
      
      <CustomInput
        v-model="form.last_name"
        type="text"
        prompt="Last Name"
        :error="errors.last_name ? errors.last_name.join(' ') : ''"
        :inactiveColor="'border-gray-300'"
        :activeColor="'border-blue-500'"
      />
      
      <CustomInput
        v-model="form.email"
        type="email"
        prompt="Email"
        :error="errors.email ? errors.email.join(' ') : ''"
        :inactiveColor="'border-gray-300'"
        :activeColor="'border-blue-500'"
      />

      <CustomInput
        v-model="form.phone"
        type="text"
        prompt="Phone Number"
        :error="errors.phone ? errors.phone.join(' ') : ''"
        :inactiveColor="'border-gray-300'"
        :activeColor="'border-blue-500'"
      />
      
      <CustomInput
        v-model="form.password"
        type="password"
        prompt="Password"
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

      <div class="mt-4">
        <label class="block text-sm font-medium text-gray-700">Avatar (optional)</label>
        <input
          type="file"
          @change="handleFileUpload"
          class="mt-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border file:border-gray-300
            file:text-sm file:font-semibold
            hover:file:bg-gray-100
          "
        />
        <img v-if="avatarPreview" :src="avatarPreview" alt="Avatar Preview" class="mt-2 w-32 h-32 object-cover rounded-full" />
      </div>

      <div class="mt-6 flex justify-between items-center">
        <CustomButton
          type="primary"
          :inactiveColor="'bg-blue-500'"
          :activeColor="'bg-blue-700'"
        >
          Register
        </CustomButton>
      </div>
    </form>
    <!-- Router Links for Forgot Password and Register -->
    <div class="mt-2 text-center">
      <p class="text-sm text-gray-500 mt-4">
        Already have an account?
        <router-link
          to="/login"
          class="text-blue-500 hover:text-blue-700"
        >
          Login
        </router-link>
      </p>
    </div>
  </div>
</template>

<script>
import CustomInput from '@/components/CustomInput.vue';
import CustomButton from '@/components/CustomButton.vue';
import SpinnerComp from '@/components/SpinnerComp.vue'; // Import the spinner component
import logo from '@/assets/logo.png';
import { mapGetters,mapActions } from 'vuex';

export default {
  components: {
    CustomInput,
    CustomButton,
    SpinnerComp // Register the spinner component
  },
  data() {
    return {
      form: {
        first_name: '',
        middle_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone: '',
        avatar: null // Added for file upload
      },
      avatarPreview: null, // To show avatar preview
      logoSrc : logo
    };
  },
  computed: {
    ...mapGetters('user',['errors']),
    ...mapGetters('global',['loading'])
  },
  methods: {
    ...mapActions('user', ['registerUser']),
    handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            this.form.avatar = file;
            // Preview the selected avatar
            const reader = new FileReader();
            reader.onload = (e) => {
                this.avatarPreview = e.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            this.form.avatar = null;
            this.avatarPreview = null;
        }
    },
    async handleRegisterUser() {
        const formData = new FormData();
        Object.keys(this.form).forEach(key => {
            if (key !== 'avatar' || (key === 'avatar' && this.form[key])) {
                formData.append(key, this.form[key]);
            }
        });
        const success = await this.registerUser(formData);
        if (success) {
            this.$router.push({ name: 'Login' });
        }
    },
  },

};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500&family=Roboto:wght@400;500&family=Noto+Sans+Myanmar+UI:wght@400;500&family=Arial:wght@400;500&family=Sans-serif:wght@400;500&display=swap');

* {
  font-family: 'Google Sans', Roboto, 'Noto Sans Myanmar UI', Arial, sans-serif;
}
</style>
