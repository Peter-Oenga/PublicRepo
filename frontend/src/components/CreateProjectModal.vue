<template>
    <ModalLayout :isVisible="isVisible" @close="close">
      <template #header>
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
          {{ isEditing ? 'Edit Project' : 'Create Project' }}
        </h3>
      </template>
      <template #body>
        <form @submit.prevent="submitProject">
          <!-- Title Input -->
          <CustomInput
            v-model="projectData.title"
            prompt="Project Title"
            :error="errors.title ? errors.title.join(' ') : ''"
            required
          />
  
          <!-- Description Input -->
          <CustomText
            v-model="projectData.description"
            prompt="Description"
            :error="errors.description ? errors.description.join(' ') : ''"
          />
  
          <!-- Start Date Input -->
          <CustomInput
            v-model="projectData.start_date"
            type="date"
            prompt="Start Date"
            :error="errors.start_date ? errors.start_date.join(' ') : ''"
            required
          />
  
          <!-- End Date Input -->
          <CustomInput
            v-model="projectData.end_date"
            type="date"
            prompt="End Date"
            :error="errors.end_date ? errors.end_date.join(' ') : ''"
            required
          />
  
          <!-- Audience Selector -->
          <select v-model="projectData.audience_id" required>
            <option value="" disabled>Select Audience</option>
            <option v-for="audience in audiences" :key="audience.id" :value="audience.id">
              {{ audience.name }}
            </option>
          </select>
          <p v-if="errors.audience_id" class="text-red-500">{{ errors.audience_id.join(' ') }}</p>
        </form>
      </template>
      <template #footer>
        <!-- Submit Button -->
        <button 
          @click="submitProject" 
          class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-4"
        >
          {{ isEditing ? 'Update Project' : 'Create Project' }}
        </button>
      </template>
    </ModalLayout>
  </template>
  
  <script>
  import ModalLayout from './ModalLayout.vue';
  import CustomInput from './CustomInput.vue';
  import CustomText from './CustomText.vue';
  import { mapGetters, mapActions } from 'vuex';
  
  export default {
    components: {
      ModalLayout,
      CustomInput,
      CustomText,
    },
    props: {
      isVisible: {
        type: Boolean,
        default: false
      },
      id: {
        type: [String, Number],
        default: null
      }
    },
    data() {
      return {
        projectData: {
          title: '',
          description: '',
          start_date: '',
          end_date: '',
          audience_id: ''
        }
      }
    },
    computed: {
      ...mapGetters('audience', ['audiences']),
      ...mapGetters('project', ['errors','activeProject']),
      isEditing() {
        return this.id !== null; 
      },
      hasErrors() {
        return Object.keys(this.errors).length > 0;
      },
    },
    methods: {
      ...mapActions('audience', ['fetchAudiences']),
      ...mapActions('project', ['createProject', 'updateProject', 'setErrors', 'fetchProjectById']),
      
      async submitProject() {
        try {
          if (this.isEditing) {
            await this.updateProject({ id: this.id, ...this.projectData });
          } else {
            await this.createProject(this.projectData);
          }
          if (!this.hasErrors) {
            this.close();
          }
        } catch (error) {
          console.error('Error saving project:', error);
        }
      },
      reset() {
        this.projectData = {
          title: '',
          description: '',
          start_date: '',
          end_date: '',
          audience_id: ''
        };
        const errors = {};
        this.setErrors(errors);
      },
      close() {
        this.reset();
        this.$emit('close');
      },
    },
    async mounted() {
      await this.fetchAudiences();
    },
    watch: {
      id: {
        immediate: true, // Fetch achievement on component load or when id changes
        async handler(newId) {
          if (newId && this.isEditing) {
            await this.fetchProjectById(newId);
            this.projectData = {
              title: this.activeProject.title || '',
              description: this.activeProject.description || '',
              start_date: this.activeProject.start_date || '',
              end_date: this.activeProject.end_date || '',
              audience_id: this.activeProject.audience_id || ''
            }
          }
        },
      },
    },
  }
  </script>
  