<template>
  <ModalLayout :isVisible="isVisible" @close="handleClose">
    <template #header>
      <h2 class="text-2xl font-bold mb-4">Create Permission for {{ activeRole?.name }}</h2>
    </template>

    <template #body>
      <!-- Action Dropdown -->
      <div class="mb-4">
        <label for="action" class="block text-sm font-medium text-gray-700">Action</label>
        <select v-model="selectedAction" id="action" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3">
          <option v-for="action in actions" :key="action.id" :value="action.id">
            {{ action.name }}
          </option>
        </select>
      </div>

      <!-- Entity Dropdown -->
      <div class="mb-4">
        <label for="entity" class="block text-sm font-medium text-gray-700">Entity</label>
        <select v-model="selectedEntity" id="entity" class="mt-1 block w-full border-gray-500 rounded-md shadow-sm p-3">
          <option v-for="entity in entities" :key="entity.id" :value="entity.id">
            {{ entity.name }}
          </option>
        </select>
      </div>
    </template>

    <template #footer>
      <div class="flex space-x-4">
        <button @click="submitPermission" class="bg-blue-500 text-white px-4 py-2 rounded-lg">
          Save
        </button>
        <button @click="handleClose" class="bg-gray-500 text-white px-4 py-2 rounded-lg">
          Cancel
        </button>
      </div>
    </template>
  </ModalLayout>
</template>

<script>
import axios from '@/axios';
import ModalLayout from '@/components/ModalLayout.vue'; // Assuming you have a ModalLayout component
import { mapGetters,mapActions } from 'vuex';

export default {
  computed: mapGetters('role', ['activeRole']),
  components: {
    ModalLayout
  },
  props: {
    isVisible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      actions: [],
      entities: [],
      selectedAction: null,
      selectedEntity: null
    };
  },
  async mounted() {
    await this.fetchActions();
    await this.fetchEntities();
  },
  methods: {
    ...mapActions('permission',['createPermission']),
    async fetchActions() {
      try {
        const response = await axios.get('/actions');
        this.actions = response.data;
      } catch (error) {
        console.error('Failed to fetch actions:', error);
      }
    },
    async fetchEntities() {
      try {
        const response = await axios.get('/entities');
        this.entities = response.data;
      } catch (error) {
        console.error('Failed to fetch entities:', error);
      }
    },
    async submitPermission() {
      const permissionData = {
        action_id: this.selectedAction,
        entity_id: this.selectedEntity,
        role_id: this.activeRole.id
      };
      await this.createPermission(permissionData);
      this.$emit('close');
      
    },
    handleClose() {
      this.$emit('close');
    }
  }
}
</script>

<style scoped>
select {
  padding: 0.5rem; /* Adjust padding as needed */
}
</style>
