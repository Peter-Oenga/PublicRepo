<template>
  <div class="relative">
    <!-- File Input -->
    <input
      type="file"
      ref="fileInput"
      class="absolute inset-0 opacity-0"
      @change="handleFileChange"
      accept="image/*"
    />

    <!-- Image Preview and Add Rectangle -->
    <div
      class="w-full h-full flex items-center justify-center bg-gray-200 border border-dashed border-gray-400 rounded-lg cursor-pointer"
      @click="triggerFileInput"
    >
      <div v-if="image" class="relative w-full h-full flex items-center justify-center">
        <img :src="image" class="object-cover w-full h-full rounded-lg" />
        <button
          type="button"
          class="absolute top-1 right-1 text-red-500"
          @click.stop="removeImage"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div v-else>
        <i class="fas fa-plus"></i>
        <p>Add Image</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    image: {
      type: String,
      default: ''
    },
    imageIndex: {
      type: Number,
      required: true
    }
  },
  methods: {
    triggerFileInput() {
      const fileInput = this.$refs.fileInput;
      if (fileInput) {
        fileInput.click();
      } else {
        console.error(`fileInput ref is not defined`);
      }
    },
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        // Emit event to parent with file and index
        this.$emit('file-selected', { file, index: this.imageIndex });
      }
    },
    removeImage(event) {
      event.stopPropagation(); // Prevent triggering the file input click
      this.$emit('remove-image', this.imageIndex);
    }
  }
};
</script>


