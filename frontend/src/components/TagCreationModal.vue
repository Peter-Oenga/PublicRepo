<template>
  <ModalLayout :isVisible="isVisible" @close="close">
    <template #header>
      <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
        {{ isEditing ? 'Edit Tag' : 'Create Tag' }}
      </h3>
    </template>
    <template #body>
      <form @submit.prevent="submitTag">
        <!-- Name Input -->
        <CustomInput
          v-model="tagData.name"
          prompt="Name"
          :error="errors.name ? errors.name.join(' ') : ''"
          required
        />
      </form>
    </template>
    <template #footer>
      <!-- Submit Button -->
      <button 
        @click="submitTag" 
        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-4"
      >
        {{ isEditing ? 'Update Tag' : 'Create Tag' }}
      </button>
    </template>
  </ModalLayout>
</template>

<script>
import ModalLayout from './ModalLayout.vue';
import CustomInput from './CustomInput.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    ModalLayout,
    CustomInput
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
      tagData: {
        name: ''
      }
    };
  },
  computed: {
    ...mapGetters('tag', ['errors', 'activeTag']),
    isEditing() {
      return !!this.id;
    }
  },
  methods: {
    ...mapActions('tag', ['fetchTagById', 'createTag', 'updateTag', 'setErrors']),
    async submitTag() {
      try {
        if (this.isEditing) {
          await this.updateTag({ id: this.id, name: this.tagData.name });
        } else {
          await this.createTag({ name: this.tagData.name });
        }

        if (Object.keys(this.errors).length === 0) {
          this.resetForm();
          alert('Tag has been successfully saved!');
        }
      } catch (error) {
        console.error('Error saving tag:', error);
      }
    },
    resetForm() {
      if (!this.isEditing) {
        this.tagData.name = '';
      }
    },
    close() {
      this.setErrors({});
      this.$emit('close');
    }
  },
  mounted() {
    if (this.isEditing && this.id) {
      this.fetchTagById(this.id).then(() => {
        // Set the tag data after fetching
        this.tagData.name = this.activeTag.name || '';
      });
    }
  },
  watch: {
    id(newId) {
      if (this.isEditing && newId) {
        this.fetchTagById(newId).then(() => {
          // Set the tag data after fetching
          this.tagData.name = this.activeTag.name || '';
        });
      } else {
        this.resetForm();
      }
    }
  }
};
</script>
