<template>
    <ModalLayout :isVisible="isVisible" @close="close">
      <template #header>
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
          Edit User
        </h3>
      </template>
      <template #body>
        <form @submit.prevent="updateUserData">
          <!-- First Name Input -->
          <CustomInput
            v-model="userData.first_name"
            prompt="First Name"
            :error="errors.first_name ? errors.first_name.join(' ') : ''"
            required
          />

          <!-- Middle Name Input -->
          <CustomInput
            v-model="userData.middle_name"
            prompt="Middle Name"
            :error="errors.middle_name ? errors.middle_name.join(' ') : ''"
          />

          <!-- Last Name Input -->
          <CustomInput
            v-model="userData.last_name"
            prompt="Last Name"
            :error="errors.last_name ? errors.last_name.join(' ') : ''"
            required
          />

          <!-- Email Input -->
          <CustomInput
            v-model="userData.email"
            type="email"
            prompt="Email"
            :error="errors.email ? errors.email.join(' ') : ''"
            required
          />

          <!-- Phone Input -->
          <CustomInput
            v-model="userData.phone"
            prompt="Phone"
            :error="errors.phone ? errors.phone.join(' ') : ''"
            required
          />
        </form>
      </template>
      <template #footer>
        <!-- Update Button -->
        <button 
          @click="updateUserData" 
          class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-4"
        >
          Update
        </button>
      </template>
    </ModalLayout>
</template>

<script>
import ModalLayout from './ModalLayout.vue';
import CustomInput from './CustomInput.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
    components: {
      ModalLayout,
      CustomInput,
    },
    props: {
      isVisible: {
        type: Boolean,
        default: false
      },
      id: {
        type: [String, Number],
        required: true // Only allow the modal to open with a valid user ID
      }
    },
    data() {
      return {
        userData: {
          first_name: '',
          middle_name: '',
          last_name: '',
          email: '',
          phone: ''
        }
      }
    },
    computed: {
      ...mapGetters('user', ['errors', 'currentUser']),
      hasErrors() {
        return Object.keys(this.errors).length > 0;
      },
    },
    methods: {
      ...mapActions('user', ['updateUser', 'setErrors', 'fetchUserById']),
      
      async updateUserData() {
        try {
          await this.updateUser({ id: this.id, ...this.userData });
          if (!this.hasErrors) {
            this.close();
          }
        } catch (error) {
          console.error('Error updating user:', error);
        }
      },
      reset() {
        this.userData = {
          first_name: '',
          middle_name: '',
          last_name: '',
          email: '',
          phone: ''
        };
        const errors = {};
        this.setErrors(errors);
      },
      close() {
        this.reset();
        this.$emit('close');
      },
    },
    watch: {
      id: {
        immediate: true,
        async handler(newId) {
          if (newId) {
            await this.fetchUserById(newId);
            this.userData = {
              first_name: this.currentUser.first_name || '',
              middle_name: this.currentUser.middle_name || '',
              last_name: this.currentUser.last_name || '',
              email: this.currentUser.email || '',
              phone: this.currentUser.phone || ''
            };
          }
        },
      },
    },
}
</script>
