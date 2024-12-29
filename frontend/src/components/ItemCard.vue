<template>
  <div class="card p-4 border rounded-md shadow-sm flex">
    <div class="icon-container mr-4">
      <img :src="iconSrc" alt="Item Icon" class="w-12 h-12 object-cover" />
    </div>
    <div class="content flex-1">
      <h3 class="text-lg font-semibold">{{ title }}</h3>
      <p class="text-sm text-gray-600">{{ description }}</p>
      <div class="my-2">
        <span v-for="tag in tags" :key="tag.id" @click="handleTagFilter(tag.name,$event)" class="inline-block px-3 py-1 mr-2 mb-2 text-sm bg-gray-700 text-white rounded-full">
          {{ tag.name }}
        </span>
      </div>
      <div v-if="type === 'document'" class="flex items-center mt-2">
        <img :src="formattedAuthorAvatar" alt="Author Avatar" class="w-8 h-8 rounded-full mr-2" />
        <div>
          <p class="text-sm font-medium">{{ authorName }}</p>
          <p class="text-xs text-gray-500">{{ formattedDate }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters,mapActions } from 'vuex';
export default {
  name: "ItemCard",
  props: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: { // New prop to distinguish between document and collection
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      default: null,
    },
    authorName: {
      type: String,
      default: '',
    },
    authorAvatar: {
      type: String,
      default: null, // No default value for authorAvatar
    },
    uploadDate: {
      type: String,
      default: '',
    },
    tags: {
      type: Array,
      required : false
    }
  },
  computed: {
    iconSrc() {
      if (this.type === 'document') {
        switch (this.fileType) {
          case 'image/png':
          case 'image/jpeg':
          case 'image/gif':
            return require('@/assets/document_icons/image.png'); // Path to your image PNG
          case 'application/pdf':
            return require('@/assets/document_icons/pdf.png'); // Path to your PDF PNG
          case 'text/plain':
          case 'application/msword':
          case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            return require('@/assets/document_icons/text.png'); // Path to your text file PNG
          default:
            return require('@/assets/document_icons/default-file.png'); // Default file PNG
        }
      } else if (this.type === 'collection') {
        return require('@/assets/collection_icons/collection.png'); // Path to your collection PNG
      } else {
        return require('@/assets/document_icons/default-file.png'); // Default icon PNG
      }
    },
    formattedDate() {
      if (this.type === 'document') {
        const date = new Date(this.uploadDate);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
      }
      return '';
    },
    formattedAuthorAvatar() {
      const baseUrl = process.env.VUE_APP_BACKEND_URL || '/';
      return this.authorAvatar
        ? `${baseUrl}storage/${this.authorAvatar}`
        : `${baseUrl}storage/avatars/default-avatar.png`; // Use the default avatar if none is provided
    },
    ...mapGetters('collection',['rootId'])
  },
  methods : {
    ...mapActions('collection',['fetchRootCollection','fetchCollectionById']),
    async handleTagFilter(tag,event) {
      event.stopPropagation();
      if (this.$route.name === 'Collection') {
        const id = this.$route.params.id;
        if (this.rootId && id == this.rootId) {
          await this.fetchRootCollection({tag:tag,search:''});
        }else if(id) {
          await this.fetchCollectionById({collectionId:id,tag:tag,search:''});
        }
      }
    }
  }
}
</script>

<style scoped>
.card {
  display: flex;
  align-items: center;
  cursor:pointer;
  transition: all 0.5s;
}

.card:hover {
  transform: scale(1.05);
}

.icon-container img {
  width: 48px;
  height: 48px;
  object-fit: cover;
}
</style>
