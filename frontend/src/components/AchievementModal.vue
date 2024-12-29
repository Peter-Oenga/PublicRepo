<template>
    <ModalLayout :isVisible="isVisible" @close="close">
      <template #header>
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
          {{ isEditing ? 'Edit Achievement' : 'Create Achievement' }}
        </h3>
      </template>
      <template #body>
        <form @submit.prevent="submitAchievement">
          <!-- Description Input -->
          <CustomText
            v-model="achievementData.description"
            prompt="Description"
            :error="errors.description ? errors.description.join(' ') : ''"
          />
  
          <!-- Category Dropdown -->
          <select v-model="achievementData.category" required>
            <option value="" disabled>Select Category</option>
            <option value="main">Main</option>
            <option value="other">Other</option>
          </select>
          <p v-if="errors.category" class="text-red-500">{{ errors.category.join(' ') }}</p>
        </form>
      </template>
      <template #footer>
        <!-- Submit Button -->
        <button
          @click="submitAchievement"
          class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-4"
        >
          {{ isEditing ? 'Update Achievement' : 'Create Achievement' }}
        </button>
      </template>
    </ModalLayout>
  </template>
  
  <script>
  import ModalLayout from './ModalLayout.vue';
  import CustomText from './CustomText.vue';
  import { mapGetters, mapActions } from 'vuex';
  
  export default {
    components: {
      ModalLayout,
      CustomText,
    },
    props: {
      isVisible: {
        type: Boolean,
        default: false,
      },
      id: {
        type: [String, Number],
        default: null, // Prop to hold the achievement ID for editing
      },
    },
    data() {
      return {
        achievementData: {
          description: '',
          category: 'main', // Default to 'main'
        },
      };
    },
    computed: {
      ...mapGetters('achievement', ['errors','activeAchievement']),
      isEditing() {
        return this.id !== null;
      },
      hasErrors() {
        return Object.keys(this.errors).length > 0;
      },
      projectId() {
        return this.$route.params.id; // Get the project ID from route params
      },
    },
    methods: {
      ...mapActions('achievement', [
        'createAchievement',
        'updateAchievement',
        'setErrors',
        'fetchAchievementById',
      ]),
  
      async submitAchievement() {
        if (this.isEditing) {
          await this.updateAchievement({
            achievementData: { ...this.achievementData, id: this.id },
            projectId: this.projectId,
          });
          if (!this.hasErrors) {
            this.close();
          }
        } else {
          await this.createAchievement({
            achievementData: this.achievementData,
            projectId: this.projectId,
          });
          if (!this.hasErrors) {
            this.close();
          }
        }
      },
      reset() {
        this.achievementData = {
          description: '',
          category: 'main',
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
        immediate: true, // Fetch achievement on component load or when id changes
        async handler(newId) {
          if (newId) {
            await this.fetchAchievementById({
              achievementId: newId,
              projectId: this.projectId,
            });
            this.achievementData = {
              description: this.activeAchievement?.description || '',
              category: this.activeAchievement?.category || 'main',
            };
          }
        },
      },
    },
  };
  </script>
  