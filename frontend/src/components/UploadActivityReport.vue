<template>
    <ModalLayout :isVisible="isVisible" @close="close">
      <template #header>
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Upload Activity Report</h3>
      </template>
      <template #body>
        <CustomFileInput
          v-model="file"
          :label="label"
          :accept="accept"
          :error="error"
          @new-file="handleFileInput"
        />
      </template>
      <template #footer>
        <button 
          @click="submitFile" 
          class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-4"
        >
          Upload
        </button>
      </template>
    </ModalLayout>
  </template>
  
  <script>
  import ModalLayout from './ModalLayout.vue';
  import CustomFileInput from './CustomFileInput.vue';
  import { mapActions } from 'vuex';
  
  export default {
    components: {
      ModalLayout,
      CustomFileInput
    },
    computed: {
        projectId() {
            return this.$route.params.id;
        }
    },
    props: {
      isVisible: {
        type: Boolean,
        default: false
      },
      activityId: { // Activity ID for which the report is being uploaded
        type: Number,
        required: true
      }
    },
    data() {
      return {
        file: null,
        label: 'Upload Report File',
        accept: '*/*',
        error: ''
      };
    },
    methods: {
      ...mapActions('activity', ['uploadActivityReport']),
      async submitFile() {
        /*
        if (!this.file) {
          this.error = 'Please select a file.';
          return;
        }
        */
        this.error = '';
  
        try {
          const formData = new FormData();
          formData.append('report', this.file); // Attach file to 'report' key
          formData.append('activityId',this.activityId);
          formData.append('projectId',this.projectId);
          await this.uploadActivityReport({ reportData : formData });
          this.$emit('close'); // Close modal on success
        } catch (error) {
          console.error('Upload failed:', error);
          this.error = 'Upload failed. Please try again.';
        }
      },
      reset() {
        this.file = null;
        this.error = '';
      },
      close() {
        this.reset();
        this.$emit('close');
      },
      handleFileInput(file) {
        this.file = file;
      }
    }
  };
  </script>
  