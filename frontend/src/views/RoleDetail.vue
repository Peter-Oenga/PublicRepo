<template>
  <div class="p-6 flex flex-col">
    <!-- Role Header -->
    <div v-if="activeRole" class="bg-white shadow rounded-lg p-6 mb-6">
      <h1 class="text-3xl font-medium mb-4">{{ activeRole.name }}</h1>
      <div class="flex space-x-4 mb-6">
        <button class="bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center" @click="editRole">
          <font-awesome-icon icon="edit" class="mr-2" />
          Edit Role
        </button>
        <button class="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center" @click="confirmDeleteRole">
          <font-awesome-icon icon="trash" class="mr-2" />
          Delete Role
        </button>
        <button class="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center" @click="showPermissionModal = true">
          <font-awesome-icon icon="plus" class="mr-2" />
          Add Permission
        </button>
      </div>
    </div>

    <!-- Permissions Table -->
    <div v-if="activeRole && activeRole.permissions && activeRole.permissions.length" class="bg-white shadow rounded-lg p-6">
      <h2 class="text-2xl font-bold mb-4">Permissions</h2>
      <table class="min-w-full bg-white border border-gray-300 rounded-md shadow-md">
        <thead class="bg-gray-200 text-gray-700">
          <tr>
            <th class="py-3 px-4 border-b text-left">#</th>
            <th class="py-3 px-4 border-b text-left">Action</th>
            <th class="py-3 px-4 border-b text-left">Entity</th>
            <th class="py-3 px-4 border-b"></th> <!-- Silent column for actions -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="(permission, index) in activeRole.permissions" :key="permission.id">
            <td class="py-2 px-4 border-b text-left">{{ index + 1 }}</td>
            <td class="py-2 px-4 border-b text-left">{{ permission.action.name }}</td>
            <td class="py-2 px-4 border-b text-left">{{ permission.entity.name }}</td>
            <td class="py-2 px-4 border-b text-center">
              <button 
                @click="confirmDeletePermission(permission)" 
                class="text-red-500 hover:text-red-700"
                aria-label="Delete Permission"
              >
                <font-awesome-icon icon="trash"/>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="activeRole && activeRole.permissions && !activeRole.permissions.length" class="bg-white shadow rounded-lg p-6">
      <p class="font-medium">No permissions available for this role.</p>
    </div>
    <!-- Role Creation Modal -->
    <RoleCreationModal 
      :isVisible="showRoleModal" 
      :id="$route.params.id"
      @close="handleCreationModalClose"
    />

    <!-- Permission Creation Modal -->
    <PermissionCreationModal 
      :role="activeRole || {}" 
      :isVisible="showPermissionModal" 
      @close="handlePermissionModalClose"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import RoleCreationModal from '@/components/RoleCreationModal.vue';
import PermissionCreationModal from '@/components/PermissionCreationModal.vue';

export default {
  components: {
    RoleCreationModal,
    PermissionCreationModal
  },
  data() {
    return {
      showRoleModal: false,
      showPermissionModal: false,
    };
  },
  computed: {
    ...mapGetters('role', ['activeRole']),
  },
  methods: {
    ...mapActions('role', ['fetchRoleById', 'deleteRole']),
    ...mapActions('permission',['deletePermission']),
    async confirmDeleteRole() {
      if (confirm('Are you sure you want to delete this role? This action cannot be undone.')) {
        try {
          await this.deleteRole(this.$route.params.id);
          this.$router.push({ name: 'Role' }); // Navigate to the roles page
        } catch (error) {
          console.error('Error deleting the role:', error);
        }
      }
    },
    editRole() {
      this.showRoleModal = true; // Show the role modal for editing
    },
    editPermission(permission) {
      // Logic to edit a permission
      console.log(permission);
    },
    async confirmDeletePermission(permission) {
      if (confirm(`Sure you want to delete the permission "${permission.action.name}-${permission.entity.name}"?`)) {
        await this.deletePermission(permission.id);
        this.fetchRoleById(this.$route.params.id);
      }
    },
    handlePermissionModalClose() {
      this.showPermissionModal = false;
      this.fetchRoleById(this.$route.params.id); // Refresh the role data
    },
    handleCreationModalClose() {
      this.showRoleModal = false;
      this.fetchRoleById(this.$route.params.id); // Refresh the role data
    }
  },
  async mounted() {
    const roleId = this.$route.params.id;
    try {
      await this.fetchRoleById(roleId);
    } catch (error) {
      console.error('Error fetching role by ID:', error);
    }
  },
  watch: {
    '$route.params.id': {
      immediate: true,
      handler(newId) {
        this.fetchRoleById(newId); // Refetch role data when the ID changes
      }
    }
  }
};
</script>
