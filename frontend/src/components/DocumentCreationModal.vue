<template>
  <ModalLayout :isVisible="isVisible" @close="close">
    <template #header>
      <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
        {{ isEditing ? 'Edit Document' : 'Create Document' }}
      </h3>
    </template>
    <template #body>
      <form @submit.prevent="submitDocument">
        <!-- Name Input -->
        <CustomInput
          v-model="documentData.name"
          prompt="Name"
          :error="errors.name ? errors.name.join(' ') : ''"
          required
        />

        <!-- Description Input -->
        <CustomText
          v-model="documentData.description"
          prompt="Description (optional)"
          :error="errors.description ? errors.description.join(' ') : ''"
          required
        />

        <!-- Tag Selector -->
        <CustomTagSelector
          :value="documentData.tag_ids"
          @tag-change="handleTagChange"
          class="mb-2"
        />

        <!-- File Upload Input (Hidden for Edit Mode) -->
        <CustomFileInput
          v-if="!isEditing"
          :value="documentData.file"
          @input="file => documentData.file = file"
          label="Upload Document"
          :error="errors.file ? errors.file.join(' ') : ''"
          required
        />
      </form>
    </template>
    <template #footer>
      <!-- Submit Button -->
      <button 
        @click="submitDocument" 
        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-4"
      >
        {{ isEditing ? 'Update Document' : 'Create Document' }}
      </button>
    </template>
  </ModalLayout>
</template>

<script>
import ModalLayout from './ModalLayout.vue';
import CustomInput from './CustomInput.vue';
import CustomText from './CustomText.vue';
import CustomFileInput from './CustomFileInput.vue';
import CustomTagSelector from './CustomTagSelector.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    ModalLayout,
    CustomInput,
    CustomText,
    CustomFileInput,
    CustomTagSelector
  },
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    document: {
      type: Object,
      default: () => ({})
    },
    isEditing: {
      type: Boolean,
      default: false
    }
  },
  data() { 
    return {
      documentData: {
        name: this.document.name || '',
        description: this.document.description || '',
        file: null,
        tag_ids: []
      }
    };
  },
  computed: {
    ...mapGetters('collection', ['errors']),
  },
  methods: {
    ...mapActions('collection', ['createDocument', 'updateDocument', 'setErrors']),
    submitDocument() {
      if (this.isEditing) {
        this.updateDocument({ ...this.documentData, id: this.document.id });
      } else {
        this.createDocument(this.documentData);
      }
    },
    handleTagChange(newTagIds) {
      this.documentData.tag_ids = newTagIds;
    },
    close() {
      const errors = {};
      this.setErrors(errors);
      this.$emit('close');
    }
  },
  watch: {
    document(newDocument) {
      if (this.isEditing) {
        this.documentData = {
          name: newDocument.name || '',
          description: newDocument.description || '',
          file: null,
          tag_ids: newDocument.tags ? newDocument.tags.map(tag=>tag.id) : []
        };
      }
    }
  }
}
</script>
