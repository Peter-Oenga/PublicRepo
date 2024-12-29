<template>
  <div class="collection-page">
    <BreadcrumbComponent v-if="!loading"/>
    <!-- Show message when there are no items -->
    <div v-if="isEmptyCollection && loading==false" class="empty-collection">
      <img src="@/assets/empty_collection.jpg" alt="No Collections" class="empty-icon" />
      <p class="empty-message">There are no collections or documents here yet. Start by creating a new collection!</p>
    </div>

    <!-- Grid of Collections and Documents -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      <ItemCard
        v-for="item in items"
        :key="item.id"
        :title="item.name"
        :description="item.description || ''"
        :type="item.type"
        :file-type="item.fileType"
        :author-name="item.authorName || 'Unknown Author'"
        :author-avatar="item.authorAvatar || 'default-avatar.png'"
        :upload-date="item.uploadDate"
        :tags="item.tags ? item.tags : []"
        @click="navigateTo(item)"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters,mapActions } from 'vuex';
import ItemCard from '@/components/ItemCard.vue';
import BreadcrumbComponent from '@/components/BreadcrumbComponent.vue';

export default {
  name: 'CollectionPage',
  components: {
    ItemCard,
    BreadcrumbComponent,
  },
  computed: {
    ...mapGetters('global',['loading']),
    ...mapGetters('collection',['activeCollection','rootId']),
    items() {
      const collections = this.activeCollection?.children?.map((collection) => ({
        ...collection,
        type: 'collection',
      })) || [];

      const documents = this.activeCollection?.documents?.map((document) => ({
        ...document,
        type: 'document',
        fileType: document.file_type,
        uploadDate: document.created_at,
        authorName: document.user ? `${document.user.first_name} ${document.user.last_name}` : null,
        authorAvatar: document.user?.avatar,
      })) || [];
      return [...collections, ...documents];
    },
    isEmptyCollection() {
      return !this.activeCollection || (!this.activeCollection.children?.length && !this.activeCollection.documents?.length);
    },
  },
  methods: {
    ...mapActions('collection',['setActiveCollection',
      'fetchRootCollection','fetchCollectionById','fetchRootId']),
    ...mapActions('document',['setActiveDocument']),
    ...mapActions('breadcrumb',['addbBreadcrumItem','clearBreadcrumb']),
    navigateTo(item) {
      const breadcrumbItem = {
        id : item.id,
        name : item.name,
        type : item.type
      };
      this.addbBreadcrumItem(breadcrumbItem);
      if (item.type === 'collection') {
        this.$router.push({name:'Collection',params: {id:item.id}});
      } else if (item.type === 'document') {
        this.$router.push({ name: 'Document',params: {id:item.id}}); // Navigate to the document page
      }
    }
  },
  watch : {
    '$route.params.id': {
      async handler(newId) {
        if (newId == this.rootId) {
          this.clearBreadcrumb();
          await this.fetchRootCollection({tag:'',search:''});
        } else {
          await this.fetchCollectionById({collectionId:newId,tag:'',search:''});
        }   
      },
      immediate: true, // This will call the handler immediately on component mount
    }
  }
};
</script>

<style scoped>
.collection-page {
  display: flex;
  flex-direction: column;
}

.grid {
  display: grid;
  gap: 16px;
}

.empty-collection {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 300px; /* Adjust as needed */
}

.empty-icon {
  width: 180px;
  height: 180px;
  margin-bottom: 20px;
}

.empty-message {
  font-size: 1.2rem;
  color: #777;
}
</style>
