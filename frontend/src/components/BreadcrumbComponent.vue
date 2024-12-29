<template>
    <nav class="flex items-center space-x-2">
      <router-link
        v-if="!isRoot"
        :to="{ name: 'Collection', params: { id: rootId } }"
        class="text-blue-500 hover:underline"
      >
        Root
      </router-link>
      <span v-if="!isRoot">/</span>
      <template v-for="(item, index) in breadcrumb" :key="index">
        <router-link
          v-if="index !== breadcrumb.length - 1"
          @click.prevent="handleBreadcrumbClick(index, item)"
          class="text-blue-500 hover:underline"
          to="/"
        >
          {{ item.name }}
        </router-link>
        <span v-else>{{ item.name }}</span>
        <span v-if="index !== breadcrumb.length - 1">/</span>
      </template>
    </nav>
  </template>
  
  <script>
  import { mapGetters, mapActions } from 'vuex';
  
  export default {
    name: 'BreadcrumbComponent',
    computed: {
      ...mapGetters('breadcrumb', ['breadcrumb']),
      ...mapGetters('collection', ['rootId']),
      isRoot() {
        return this.breadcrumb.length === 0; // Check if breadcrumb is empty
      },
    },
    methods: {
      ...mapActions('breadcrumb', ['trimBreadcrumb']),
      handleBreadcrumbClick(index, item) {
        // Trim the breadcrumb to the clicked item
        this.trimBreadcrumb(index);
        // Navigate to the clicked item
        this.$router.push({ name: item.type.charAt(0).toUpperCase() + item.type.slice(1), params: { id: item.id } });
      },
    },
  };
  </script>
  