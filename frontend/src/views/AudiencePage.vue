<template>
    <div class="p-4">
      <h1 class="text-2xl font-bold mb-4">Audiences</h1>
      <p v-if="!hasAudiences" class="py-3">No records found</p>
      <table class="min-w-full bg-white border border-gray-300 rounded-md shadow-md" v-if="hasAudiences">
        <thead class="bg-gray-200 text-gray-700">
          <tr>
            <th class="py-3 px-4 border-b text-left">#</th>
            <th class="py-3 px-4 border-b text-left">Name</th>
            <th class="py-3 px-4 border-b text-left">Created</th>
            <th class="py-3 px-4 border-b"></th> <!-- Silent column for actions -->
          </tr>
        </thead>
        <tbody v-if="audiences">
          <tr v-for="(audience, index) in audiences" :key="audience.id">
            <td class="py-2 px-4 border-b text-left">{{ index + 1 }}</td>
            <td class="py-2 px-4 border-b text-left">{{ audience.name }}</td>
            <td class="py-2 px-4 border-b text-left">{{ formatDate(audience.created_at) }}</td>
            <td class="py-2 px-4 border-b text-center">
              <button 
                @click="editAudience(audience)" 
                class="text-blue-500 hover:text-blue-700 mr-4"
                aria-label="Edit Audience"
              >
                <font-awesome-icon icon="pen"/>
              </button>
              <button 
                @click="confirmDelete(audience)" 
                class="text-red-500 hover:text-red-700"
                aria-label="Delete Audience"
              >
                <font-awesome-icon icon="trash"/>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <CreateAudienceModal v-if="showAudienceModal" :isVisible="showAudienceModal"
       :id="selectedAudienceId" @close="showAudienceModal=false"/>
    </div>
  </template>
  
  <script>
  import CreateAudienceModal from '@/components/CreateAudienceModal.vue';
  import { mapGetters, mapActions } from 'vuex';
  
  export default {
    components: {
      CreateAudienceModal
    },
    data() {
      return {
        selectedAudienceId: '',
        showAudienceModal: false
      }
    },
    computed: {
      ...mapGetters('audience', ['audiences']),
      hasAudiences() {
        return this.audiences && this.audiences.length > 0;
      }
    },
    async mounted() {
      await this.fetchAudiences();
    },
    methods: {
      ...mapActions('audience', ['fetchAudiences', 'deleteAudience']),
      formatDate(date) {
        return new Date(date).toLocaleDateString(); // Customize date format as needed
      },
      editAudience(audience) {
        console.log(audience.id);
        this.selectedAudienceId = audience.id;
        this.showAudienceModal = true;
      },
      confirmDelete(audience) {
        if (confirm(`Are you sure you want to delete audience "${audience.name}"?`)) {
          this.deleteAudience(audience.id);
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
  