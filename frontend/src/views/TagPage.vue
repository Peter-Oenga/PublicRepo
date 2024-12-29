<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Tags</h1>
    <table class="min-w-full bg-white border border-gray-300 rounded-md shadow-md">
      <thead class="bg-gray-200 text-gray-700">
        <tr>
          <th class="py-3 px-4 border-b text-left">#</th>
          <th class="py-3 px-4 border-b text-left">Name</th>
          <th class="py-3 px-4 border-b text-left">Created</th>
          <th class="py-3 px-4 border-b text-left">By</th>
          <th class="py-3 px-4 border-b"></th> <!-- Silent column for actions -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="(tag, index) in tags" :key="tag.id">
          <td class="py-2 px-4 border-b text-left">{{ index + 1 }}</td>
          <td class="py-2 px-4 border-b text-left">{{ tag.name }}</td>
          <td class="py-2 px-4 border-b text-left">{{ formatDate(tag.created_at) }}</td>
          <td class="py-2 px-4 border-b text-left">
            <div v-if="tag.user" class="flex items-center">
              <img :src="formattedUserAvatar(tag.user)" alt="User Avatar" class="w-8 h-8 rounded-full mr-2" />
              <p class="text-sm font-medium">{{ userFullName(tag.user) }}</p>
            </div>
            <p v-else class="text-sm text-gray-500">Unknown</p>
          </td>
          <td class="py-2 px-4 border-b text-center">
            <button 
              @click="editTag(tag)" 
              class="text-blue-500 hover:text-blue-700 mr-4"
              aria-label="Edit Tag"
            >
              <font-awesome-icon icon="pen"/>
            </button>
            <button 
              @click="confirmDelete(tag)" 
              class="text-red-500 hover:text-red-700"
              aria-label="Delete Tag"
            >
              <font-awesome-icon icon="trash"/>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <TagCreationModal :isVisible="showTagModal" :id="selectedTagId" @close="showTagModal=false"/>
  </div>
</template>

<script>
import TagCreationModal from '@/components/TagCreationModal.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  components : {
    TagCreationModal
  },
  data() {
    return {
      selectedTagId : '',
      showTagModal : false
    }
  },
  computed: {
    ...mapGetters('tag', ['tags']),
    baseUrl() {
      return process.env.VUE_APP_BACKEND_URL || ''; // Adjust according to your environment variable setup
    }
  },
  async mounted() {
    await this.fetchTags({name:''});
  },
  methods: {
    ...mapActions('tag', ['fetchTags', 'deleteTag']),
    formatDate(date) {
      return new Date(date).toLocaleDateString(); // Customize date format as needed
    },
    formattedUserAvatar(user) {
      return user && user.avatar ? `${this.baseUrl}storage/${user.avatar}` : `${this.baseUrl}storage/avatars/default-avatar.png`;
    },
    userFullName(user) {
      return `${user.first_name || ''} ${user.last_name || ''}`;
    },
    editTag(tag) {
      this.selectedTagId = tag.id;
      this.showTagModal = true;
    },
    confirmDelete(tag) {
      if (confirm(`Are you sure you want to delete tag "${tag.name}"?`)) {
        this.deleteTag(tag.id);
      }
    }
  }
};
</script>

<style scoped>
/* Optional: Add custom styles here if needed */
table {
  border-collapse: collapse;
  width: 100%;
}
th, td {
  text-align: left;
}
thead th {
  background-color: #f3f4f6;
}
tbody tr:nth-child(even) {
  background-color: #f9fafb;
}
tbody tr:hover {
  background-color: #f1f5f9;
}
button {
  background: none;
  border: none;
  cursor: pointer;
}
button i {
  font-size: 1.25rem; /* Adjust icon size if needed */
}
</style>
