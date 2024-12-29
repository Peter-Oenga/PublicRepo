<template>
  <ModalLayout :isVisible="isVisible" @close="close">
    <template #header>
      <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
        Create Collection
      </h3>
    </template>
    <template #body>
      <form @submit.prevent="createCollection">
        <!-- Name Input -->
        <CustomInput
          v-model="collectionData.name"
          prompt="Collection Name"
          :error="errors.name ? errors.name.join(' ') : ''"
          required
        />

        <!-- Description Input -->
        <CustomText
          v-model="collectionData.description"
          prompt="Description (optional)"
          :error="errors.description ? errors.description.join(' ') : ''"
          required
        />

        <!-- Tag Selector -->
        <CustomTagSelector
          :value="collectionData.tag_ids"
          @tag-change="handleTagChange"
          class="mb-2"
        />
      </form>
    </template>
    <template #footer>
      <!-- Submit Button -->
      <button 
        @click="createCollection(collectionData)" 
        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-4"
      >
        Create Collection
      </button>
    </template>
  </ModalLayout>
</template>

<script>
import ModalLayout from './ModalLayout.vue';
import CustomInput from './CustomInput.vue';
import CustomTagSelector from './CustomTagSelector.vue';
import { mapGetters,mapActions } from 'vuex';
import CustomText from './CustomText.vue';

export default {
  components: {
    ModalLayout,
    CustomInput,
    CustomText,
    CustomTagSelector
  },
  props: {
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      collectionData: {
        name: '',
        description: '',
        tag_ids : []
      }
    }
  }, 
  computed: {
    ...mapGetters('collection', ['errors']), // Use loading getter from Vuex
  },
  methods: {
    ...mapActions('collection',['createCollection','setErrors']),
    handleTagChange(newTagIds) {
      this.collectionData.tag_ids = newTagIds;
    },
    close() {
      const errors = {};
      this.setErrors(errors);
      this.$emit('close');
    }
  }
}
</script>
