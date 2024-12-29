<template>
  <div class="w-full">
    <!-- Dropdown for Selecting Tags -->
    <select
      v-model="selectedTagId"
      @change="addTag"
      class="w-full p-2 border border-gray-300 rounded-md mb-2"
    >
      <option value="" disabled>Select a tag</option>
      <option v-for="tag in availableTags" :key="tag?.id" :value="tag?.id">
        {{ tag?.name }}
      </option>
    </select>

    <!-- Display Selected Tags -->
    <div class="flex flex-wrap gap-2 mt-2">
      <span
        v-for="tag in selectedTags"
        :key="tag?.id"
        class="px-2 py-1 bg-gray-700 text-white rounded-full shadow cursor-pointer hover:bg-blue-200"
        @click="removeTag(tag)"
      >
        {{ tag?.name }}
      </span>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      selectedTagId: ''
    };
  },
  computed: {
    ...mapGetters('tag', ['tags']),
    availableTags() {
      return (this.tags || []).filter(tag => tag && !this.value?.includes(tag.id)) || [];
    },
    selectedTags() {
      return (this.value || [])
        .map(id => (this.tags || []).find(tag => tag?.id === id))
        .filter(tag => tag); // Safe access
    }
  },
  methods: {
    ...mapActions('tag', ['fetchTags']),
    addTag() {
      if (this.selectedTagId && !this.value?.includes(this.selectedTagId)) {
        this.$emit('tag-change', [...this.value, this.selectedTagId]);
        this.selectedTagId = ''; // Reset dropdown
      }
    },
    removeTag(tag) {
      this.$emit('tag-change', (this.value || []).filter(id => id !== tag?.id));
    }
  },
  created() {
    this.fetchTags({name:''}); // Fetch tags when the component is created
  }
};
</script>
