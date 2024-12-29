<template>
  <div class="pagination flex items-center justify-center space-x-4 mt-4">
    <button
      @click="changePage(pagination.currentPage - 1)"
      :disabled="pagination.currentPage === 1"
      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
    >
      Previous
    </button>

    <span class="text-gray-700 font-medium">
      Page {{ pagination.currentPage }} of {{ pagination.lastPage }}
    </span>

    <button
      @click="changePage(pagination.currentPage + 1)"
      :disabled="pagination.currentPage === pagination.lastPage"
      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
    >
      Next
    </button>
  </div>
</template>

<script>
export default {
  props: {
    pagination: {
      type: Object,
      required: true,
    },
  },
  methods: {
    changePage(page) {
      this.$emit('page-changed', page);
    },
  },
};
</script>

