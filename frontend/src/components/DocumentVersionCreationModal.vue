<template>
    <ModalLayout :isVisible="isVisible" @close="close">
      <template #header>
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
          Upload New Version
        </h3>
      </template>
      <template #body>
        <form @submit.prevent="uploadVersion">
          <!-- Description Input -->
          <CustomText
            v-model="versionData.description"
            prompt="Version Description (optional)"
            :error="errors.description ? errors.description.join(' ') : ''"
            required
          />
  
          <!-- File Upload Input -->
          <CustomFileInput
            :value="versionData.file"
            @input="file => versionData.file = file"
            label="Upload New Version"
            :error="errors.file ? errors.file.join(' ') : ''"
            required
          />
        </form>
      </template>
      <template #footer>
        <!-- Submit Button -->
        <button 
          @click="uploadVersion" 
          class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-4"
        >
          Upload Version
        </button>
      </template>
    </ModalLayout>
  </template>
  
  <script>
  import ModalLayout from './ModalLayout.vue';
  import CustomText from './CustomText.vue';
  import CustomFileInput from './CustomFileInput.vue';
  import { mapGetters, mapActions } from 'vuex';
  
  export default {
    components: {
      ModalLayout,
      CustomText,
      CustomFileInput
    },
    props: {
      isVisible: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        versionData: {
          description: '',
          file: null
        }
      };
    },
    computed: {
      ...mapGetters('collection', ['errors']),
    },
    methods: {
      ...mapActions('collection', ['uploadDocumentVersion', 'setErrors']),
      close() {
        this.setErrors({});
        this.$emit('close');
      },
      uploadVersion() {
        if (this.versionData.file) {
          this.uploadDocumentVersion(this.versionData)
            .then(() => this.close());
        } else {
          this.setErrors({ file: ['File is required'] });
        }
      }
    }
  }
  </script>
  