<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Roles</h1>
    <table class="min-w-full bg-white border border-gray-300 rounded-md shadow-md">
      <thead class="bg-gray-200 text-gray-700">
        <tr>
          <th class="py-3 px-4 border-b text-left">#</th>
          <th class="py-3 px-4 border-b text-left">Name</th>
          <th class="py-3 px-4 border-b text-left">Created</th>
          <th class="py-3 px-4 border-b"></th> <!-- Silent column for actions -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="(role, index) in roles" :key="role.id" @click="viewRoleDetails(role.id)" class="cursor-pointer hover:bg-gray-100">
          <td class="py-2 px-4 border-b text-left">{{ index + 1 }}</td>
          <td class="py-2 px-4 border-b text-left">{{ role.name }}</td>
          <td class="py-2 px-4 border-b text-left">{{ formatDate(role.created_at) }}</td>
          <td class="py-2 px-4 border-b text-center">
            <button 
              @click.stop="editRole(role)" 
              class="text-blue-500 hover:text-blue-700 mr-4"
              aria-label="Edit Role"
            >
              <font-awesome-icon icon="pen"/>
            </button>
            <button 
              @click.stop="confirmDelete(role)" 
              class="text-red-500 hover:text-red-700"
              aria-label="Delete Role"
            >
              <font-awesome-icon icon="trash"/>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <RoleCreationModal :isVisible="showRoleModal" :id="selectedRoleId" @close="showRoleModal=false"/>
  </div>
</template>

<script>
import RoleCreationModal from '@/components/RoleCreationModal.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  components : {
    RoleCreationModal
  },
  data() {
    return {
      selectedRoleId : '',
      showRoleModal : false
    }
  },
  computed: {
    ...mapGetters('role', ['roles']),
    baseUrl() {
      return process.env.VUE_APP_BACKEND_URL || ''; // Adjust according to your environment variable setup
    }
  },
  async mounted() {
    await this.fetchRoles();
  },
  methods: {
    ...mapActions('role', ['fetchRoles', 'deleteRole']),
    formatDate(date) {
      return new Date(date).toLocaleDateString(); // Customize date format as needed
    },
    editRole(role) {
      this.selectedRoleId = role.id;
      this.showRoleModal = true;
    },
    confirmDelete(role) {
      if (confirm(`Are you sure you want to delete role "${role.name}"?`)) {
        this.deleteRole(role.id);
      }
    },
    viewRoleDetails(id) {
      this.$router.push({ name: 'RoleDetail', params: { id } });
    }
  }
}
</script>
