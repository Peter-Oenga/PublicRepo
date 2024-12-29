<template>
    <ModalLayout :isVisible="isVisible" @close="close">
      <template #header>
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
          {{ isEditing ? 'Edit Expected Result' : 'Create Expected Result' }}
        </h3>
      </template>
      <template #body>
        <form @submit.prevent="submitExpectedResult">
          <!-- Description Input -->
          <CustomText
            v-model="expectedResultData.description"
            prompt="Description"
            :error="errors.description ? errors.description.join(' ') : ''"
            required
          />
        </form>
      </template>
      <template #footer>
        <!-- Submit Button -->
        <button
          @click="submitExpectedResult"
          class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-4"
        >
          {{ isEditing ? 'Update Expected Result' : 'Create Expected Result' }}
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
        default: null, // Prop to hold the expected result ID for editing
      },
    },
    data() {
      return {
        expectedResultData: {
          description: '',
        },
      };
    },
    computed: {
      ...mapGetters('expectedResult', ['errors', 'activeExpectedResult']),
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
      ...mapActions('expectedResult', [
        'createExpectedResult',
        'updateExpectedResult',
        'setErrors',
        'fetchExpectedResultById',
      ]),
      async submitExpectedResult() {
        if (this.isEditing) {
          await this.updateExpectedResult({
            expectedResultData: { ...this.expectedResultData, id: this.id },
            projectId: this.projectId,
          });
          if (!this.hasErrors) {
            this.close();
          }
        } else {
          await this.createExpectedResult({
            expectedResultData: this.expectedResultData,
            projectId: this.projectId,
          });
          if (!this.hasErrors) {
            this.close();
          }
        }
      },
      reset() {
        this.expectedResultData = {
          description: ''
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
        immediate: true, // Fetch expected result on component load or when id changes
        async handler(newId) {
          if (newId) {
            await this.fetchExpectedResultById({
              expectedResultId: newId,
              projectId: this.projectId,
            });
            this.expectedResultData = {
              description: this.activeExpectedResult?.description || '',
            };
          }
        },
      },
    },
  };
  </script>
  