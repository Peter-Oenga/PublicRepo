<template>
    <div class="p-4">
      <h1 class="text-2xl font-bold mb-4">Projects</h1>
      <table class="min-w-full bg-white border border-gray-300 rounded-md shadow-md">
        <thead class="bg-gray-200 text-gray-700">
          <tr>
            <th class="py-3 px-4 border-b text-left">#</th>
            <th class="py-3 px-4 border-b text-left">Title</th>
            <th class="py-3 px-4 border-b text-left">Description</th>
            <th class="py-3 px-4 border-b text-left">Start Date</th>
            <th class="py-3 px-4 border-b text-left">End Date</th>
            <th class="py-3 px-4 border-b text-left">Audience</th>
            <th class="py-3 px-4 border-b"></th> <!-- Silent column for actions -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="project in projects" :key="project.id" @click="viewProject(project.id)" class="cursor-pointer">
            <td class="py-2 px-4 border-b text-left">{{ project.id }}</td>
            <td class="py-2 px-4 border-b text-left">{{ project.title }}</td>
            <td class="py-2 px-4 border-b text-left">
              {{ project.description.length > 50 ? project.description.substring(0, 50) + '...' : project.description }}
            </td>
            <td class="py-2 px-4 border-b text-left">{{ formatDate(project.start_date) }}</td>
            <td class="py-2 px-4 border-b text-left">{{ formatDate(project.end_date) }}</td>
            <td class="py-2 px-4 border-b text-left">{{ project.audience.name }}</td>
            <td class="py-2 px-4 border-b text-center">
              <button 
                @click.stop="editProject(project)" 
                class="text-blue-500 hover:text-blue-700 mr-4"
                aria-label="Edit Project"
              >
                <font-awesome-icon icon="pen"/>
              </button>
              <button 
                @click.stop="confirmDelete(project)" 
                class="text-red-500 hover:text-red-700"
                aria-label="Delete Project"
              >
                <font-awesome-icon icon="trash"/>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <CreateProjectModal v-if="showProjectModal"
      :isVisible="showProjectModal" :id="selectedProjectId" @close="showProjectModal=false"/>
      
      <!-- Use the Paginator component -->
      <PaginatorComp :pagination="pagination" @page-changed="fetchProjects" />
    </div>
  </template>
  
  <script>
  import CreateProjectModal from '@/components/CreateProjectModal.vue';
  import PaginatorComp from '@/components/PaginatorComp.vue';
  import { mapGetters, mapActions } from 'vuex';
  
  export default {
    components : {
      CreateProjectModal,
      PaginatorComp
    },
    data() {
      return {
        selectedProjectId : '',
        showProjectModal : false
      }
    },
    computed: {
      ...mapGetters('project', ['projects','pagination']),
    },
    async created() {
      await this.fetchProjects(1);
    },
    methods: {
      ...mapActions('project', ['fetchProjects', 'deleteProject']),
      formatDate(date) {
        return new Date(date).toLocaleDateString(); // Customize date format as needed
      },
      editProject(project) {
        this.selectedProjectId = project.id;
        this.showProjectModal = true;
      },
      confirmDelete(project) {
        if (confirm(`Are you sure you want to delete project "${project.title}"?`)) {
          this.deleteProject(project.id);
        }
      },
      viewProject(id) {
        this.$router.push({ name: 'ProjectDetail', params: { id } });
      }
    }
  };
  </script>
  
  <style scoped>
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
    font-size: 1.25rem;
  }
  </style>
  