<template>
  <div class="relative">
    <label :for="id" class="block text-sm font-medium text-gray-700">{{ label }}</label>
    <input
      ref="fileInput"
      type="file"
      :id="id"
      :accept="accept"
      @change="handleFileChange"
      class="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-md"
    />
    <div v-if="file" class="mt-2 relative">
      <p class="text-sm font-medium text-gray-900">Preview:</p>
      <div v-if="isImage" class="mt-2 preview-container">
        <img :src="filePreview" alt="File Preview" class="preview-image" />
        <button @click="resetFile" class="absolute top-0 right-0 text-red-500 hover:text-red-700">
          <font-awesome-icon icon="xmark" />
        </button>
      </div>
      <div v-else>
        <p class="text-sm text-gray-600">File selected: {{ file.name }}</p>
        <button @click="resetFile" class="absolute top-0 right-0 text-red-500 hover:text-red-700">
          <font-awesome-icon icon="xmark" />
        </button>
      </div>
    </div>
    <p v-if="error" class="mt-2 text-red-600 text-sm">{{ error }}</p>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export default {
  components: {
    FontAwesomeIcon
  },
  props: {
    value: {
      type: File,
      default: null
    },
    label: {
      type: String,
      default: 'Upload File'
    },
    id: {
      type: String,
      default: 'file-input'
    },
    accept: {
      type: String,
      default: '*/*'
    },
    error: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      file: this.value,
      filePreview: null
    };
  },
  computed: {
    isImage() {
      return this.file && this.file.type.startsWith('image/');
    }
  },
  methods: {
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.file = file;
        this.filePreview = this.isImage ? URL.createObjectURL(file) : null;
        this.$emit('input', file);  // Ensure the file is emitted
        this.$emit('new-file',file);
      } else {
        this.resetFile();
      }
    },
    resetFile() {
      this.file = null;
      this.filePreview = null;
      this.$refs.fileInput.value = ''; // Clear the file input
      this.$emit('input', null);  // Clear the file in the parent component
    }
  },
  watch: {
    value(newFile) {
      this.file = newFile;
      this.filePreview = newFile && newFile.type.startsWith('image/') ? URL.createObjectURL(newFile) : null;
    }
  }
};
</script>

<style scoped>
.preview-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 100%;
  overflow: hidden;
}

.preview-image {
  max-width: 100%;
  max-height: 150px; /* Reduced height */
  object-fit: cover;
}
</style>
