<template>
    <ModalLayout :isVisible="isVisible" @close="close">
      <template #header>
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
          Upload File
        </h3>
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
  import { mapActions,mapGetters } from 'vuex';
  
  export default {
    components: {
      ModalLayout,
      CustomFileInput
    },
    props: {
      isVisible: {
        type: Boolean,
        default: false
      },
      operationType: {
        type: String,
        required: true
      },
      id: {
        type : Number,
        required : false
      }
    },
    computed: mapGetters('event',['activeEvent']),
    data() {
      return {
        file: null,
        label: 'Upload File',
        accept: '*/*',
        error: ''
      };
    },
    methods: {
      ...mapActions('event',['uploadEventFile']),
      ...mapActions('eventOutcome',['uploadOutcomeFile','uploadOutcomeImage']),
      async submitFile() {
        if (!this.file) {
          this.error = 'Please select a file.';
          console.log(this.file);
          return;
        }
  
        this.error = '';
  
        try {
          switch (this.operationType) {
            case 'eventFile':
              await this.handleEventFileUpload();
              break;
            case 'outcomeFile':
              await this.handleOutcomeFileUpload();
              break;
            case 'outcomeImage':
              await this.handleOutcomeImageUpload();
              break;
            default:
              throw new Error('Invalid operation type');
          }
          this.$emit('close'); // Close modal after successful upload
        } catch (error) {
          console.error('Upload failed:', error);
          this.error = 'Upload failed. Please try again.';
        }
      },
      async handleEventFileUpload() {
        if (!this.activeEvent || !this.activeEvent.id) {
            throw new Error('Active event is not available.');
        }
        const formData = new FormData();
        formData.append('file', this.file);
        await this.uploadEventFile(formData);
      },
      async handleOutcomeFileUpload() {
        if (!this.activeEvent || !this.activeEvent.id) {
            throw new Error('Active event is not available.');
        }
        const formData = new FormData();
        formData.append('file', this.file);
        await this.uploadOutcomeFile({outcomeId:this.id,formData});
      },
      async handleOutcomeImageUpload() {
        if (!this.activeEvent || !this.activeEvent.id) {
            throw new Error('Active event is not available.');
        }
        const formData = new FormData();
        formData.append('image', this.file);
        console.log(this.id);
        await this.uploadOutcomeImage({outcomeId:this.id,formData});
      },
      close() {
        this.file = null;
        this.$emit('close');
      },
      handleFileInput(file) {
        this.file = file;
      }
    }
  };
  </script>
  