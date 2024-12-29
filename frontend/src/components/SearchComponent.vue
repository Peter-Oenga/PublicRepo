<template>
  <div class="search-container relative">
    <input
      type="text"
      v-model="query"
      @keydown.enter="emitSearch"
      :placeholder="`Search ${label}...`"
      class="search-input w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md"
    />
    <button @click="performSearch" class="search-icon absolute right-3 top-1/2 transform -translate-y-1/2">
      <font-awesome-icon :icon="['fas', 'search']" class="w-5 h-5 text-gray-500" />
    </button>
    <button v-if="query" @click="clearQuery" class="search-clear absolute right-10 top-1/2 transform -translate-y-1/2">
      <font-awesome-icon :icon="['fas', 'times']" class="w-5 h-5 text-gray-500" />
    </button>
  </div>
</template>

<script>
import { mapGetters,mapActions } from 'vuex';
export default {
  name: 'SearchComponent',
  props: {
    label: String,
    value: String
  },
  data() {
    return {
      query: this.value
    };
  },
  computed:{
    ...mapGetters('collection',['rootId'])
  },
  watch: {
    value(newValue) {
      this.query = newValue;
    }
  },
  async mounted() {
    if (!this.rootId) {
      await this.fetchRootId();
    }
  },
  methods: {
    ...mapActions('collection',['fetchRootId','fetchCollectionById','fetchRootCollection']),
    ...mapActions('event',['fetchEvents']),
    ...mapActions('tag',['fetchTags']),
    async performSearch() {
      if (this.query.trim()) {
        if(this.$route.name === 'Collection') {
          const id = this.$route.params.id;
          if (id == this.rootId) {
            await this.fetchRootCollection({tag:'',search:this.query});
          } else if(id) {
            await this.fetchCollectionById({collectionId:id,tag:'',search:this.query});
          }
        } else if(this.$route.name === 'Event') {
          await this.fetchEvents({tag:'',search:this.query});
        } else if (this.$route.name === 'Tag') {
          console.log('tag route');
          await this.fetchTags({name:this.query});
        }
      }
    },
    clearQuery() {
      this.query = '';
      this.performSearch();
    }
  }
};
</script>



<style scoped>
.search-container {
  display: flex;
  align-items: center;
  width: 100%;
}

.search-icon {
  background: none;
  border: none;
  cursor: pointer;
  margin-right: 0.5rem;
}

.search-input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 0.25rem;
  background-color: #fff;
  color: #000;
  outline: none;
}

.search-clear {
  background: none;
  border: none;
  cursor: pointer;
  margin-left: 0.5rem;
}
</style>
