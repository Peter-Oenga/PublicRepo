<template>
    <div class="p-6 max-w-3xl mx-auto">
      <h1 class="text-3xl font-bold mb-6">Profile</h1>
  
      <!-- Profile Header -->
      <div class="flex items-center mb-8" v-if="user">
        <div class="relative">
          <img :src="formattedUserAvatar" alt="User Avatar" class="w-32 h-32 rounded-full object-cover shadow-lg" />
          <button v-if="isOwnProfile" @click="triggerAvatarModal" class="absolute bottom-0 right-0 p-2 w-10 h-10 bg-white rounded-full shadow-md">
            <font-awesome-icon icon="pen" class="text-gray-600" />
          </button>

        </div>
        <div class="ml-4">
          <h2 class="text-2xl font-semibold">{{ fullName }}</h2>
          <p class="text-gray-600">{{ user.email }}</p>
          <p class="text-gray-600">{{ user.phone }}</p>
        </div>
      </div>
  
      <!-- User Details -->
      <div class="space-y-4" v-if="user">
        <div class="flex items-center">
          <font-awesome-icon icon="phone" class="w-6 h-6 text-gray-600 mr-2" />
          <p class="text-gray-600">{{ user.phone }}</p>
        </div>
        <div class="flex items-center">
          <font-awesome-icon icon="envelope" class="w-6 h-6 text-gray-600 mr-2" />
          <p class="text-gray-600">{{ user.email }}</p>
        </div>
      </div>
  
      <!-- Edit Details Button -->
      <button v-if="isOwnProfile" @click="triggerEditModal" class="mt-6 px-4 py-2 bg-blue-500 text-white rounded shadow-md hover:bg-blue-600">
        Edit Details
      </button>
      <EditUserModal v-if="showEditModal" :isVisible="showEditModal"
       :id="user.id" @close="closeEditModal"/>
    </div>
  </template>
  
  <script>
  import { mapGetters, mapActions } from 'vuex';
  import axios from '@/axios';
  import EditUserModal from '@/components/EditUserModal.vue';
  
  export default {
    components: {
      EditUserModal
    },
    data() {
      return {
        user: null,
        showAvatarModal: false,
        showEditModal: false,
        editUser: {
          first_name: '',
          middle_name: '',
          last_name: '',
          phone: '',
        },
        defaultAvatar: `${process.env.VUE_APP_BACKEND_URL}/storage/avatars/default-avatar.png`,
      };
    },
    computed: {
      ...mapGetters('global', ['loading']),
      ...mapGetters('user',['currentUser']),
      baseUrl() {
        return process.env.VUE_APP_BACKEND_URL || ''; // Adjust according to your environment variable setup
      },
      fullName() {
        if (!this.user) return '';
        const { first_name, middle_name, last_name } = this.user;
        return [first_name, middle_name, last_name].filter(Boolean).join(' ');
      },
      formattedUserAvatar() {
        return this.user && this.user.avatar ? `${this.baseUrl}storage/${this.user.avatar}`
         : `${this.baseUrl}storage/avatars/default-avatar.png`;
      },
      isOwnProfile() {
        return !this.$route.params.id;
      }
    },
    watch: {
      '$route.params.id': 'fetchUser'
    },
    async created() {
      await this.fetchUser();
    },
    methods: {
      ...mapActions('global', ['setLoading']),
      async fetchUser() {
        const userId = this.$route.params.id ? this.$route.params.id : 'profile';
        try {
          this.setLoading(true); // Show loading indicator
          const response = await axios.get(`/users/${userId}`);
          this.user = response.data;
          this.editUser = {
            first_name: this.user.first_name,
            middle_name: this.user.middle_name || '',
            last_name: this.user.last_name,
            phone: this.user.phone,
          };
        } catch (error) {
          console.error('Failed to fetch user details:', error);
          this.user = null; // Handle error by resetting user to null or showing an error message
        } finally {
          this.setLoading(false); // Hide loading indicator
        }
      },
      triggerAvatarModal() {
        this.showAvatarModal = true;
      },
      triggerEditModal() {
        this.showEditModal = true;
      },
      async closeEditModal() {
        this.showEditModal = false;
        await this.fetchUser();
      }
    }
  };
  </script>
  

  