<template>
  <div v-if="isVisible" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
    <div class="relative bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:w-full sm:max-w-lg max-h-screen overflow-y-auto">
      <button @click="close" class="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
        <font-awesome-icon icon="xmark" />
      </button>
      <div class="px-4 py-5 sm:p-6">
        <slot name="header"></slot>
        <slot name="body"></slot>
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export default {
  components: {
    FontAwesomeIcon
  },
  props: {
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    close() {
      this.$emit('close');
    }
  }
}
</script>
