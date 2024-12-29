<template> 
  <header class="header">
    <div class="logo-and-hamburger" :class="{'hidden': isMobileSearchVisible}">
      <button @click="toggleSidebar" class="mr-4">
        <font-awesome-icon :icon="['fas', 'bars']" class="w-5 h-5" />
      </button>
      <img src="../assets/logo.png" class="h-8">
    </div>
    <div :class="{'hidden md:flex-1 md:mx-4': !isMobileSearchVisible && !isMediumUp, 'search-container': isMobileSearchVisible || isMediumUp}">
      <button v-if="isMobileSearchVisible" @click="hideSearch" class="text-white md:hidden mr-2">
        <font-awesome-icon :icon="['fas', 'arrow-left']" class="w-5 h-5" />
      </button>
      <SearchComponent class="search-bar" :items="['A', 'B', 'C']" label="for collection or document"/>
    </div>
    <div v-if="!isMobileSearchVisible || isMediumUp" class="actions-area">
      <button v-if="!isMobileSearchVisible && !isMediumUp" @click="showSearch" class="md:hidden">
        <font-awesome-icon :icon="['fas', 'search']" class="w-5 h-5" />
      </button>
      <button class="flex items-center" @click="handleLogout">
        <font-awesome-icon :icon="['fas', 'power-off']" class="w-5 h-5 mr-2" />
        Logout
      </button>
    </div>
  </header>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import SearchComponent from './SearchComponent.vue';
import { mapActions } from 'vuex';

export default {
  name: 'HeaderComponent',
  components: {
    FontAwesomeIcon,
    SearchComponent
  },
  data() {
    return {
      isMobileSearchVisible: false,
      isMediumUp: window.innerWidth >= 768
    };
  },
  methods: {
    ...mapActions('user',['logoutUser']),
    toggleSidebar() {
      this.$emit('toggle-sidebar');
    },
    showSearch() {
      this.isMobileSearchVisible = true;
    },
    hideSearch() {
      this.isMobileSearchVisible = false;
    },
    handleResize() {
      this.isMediumUp = window.innerWidth >= 768;
      if (this.isMediumUp) {
        this.hideSearch();
      }
    },
    async handleLogout() {
      const success = this.logoutUser();
      if (success) {
        this.$router.push({name:'Login'});
      }
    }
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }
};
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background-color: #1a202c; /* bg-gray-800 */
  color: white;
  width: 100%; /* Ensures the header takes the full width of the viewport */
  position: relative;
}

.logo-and-hamburger {
  display: flex;
  align-items: center;
}

.logo-and-hamburger.hidden {
  display: none;
}

.search-container {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center; /* Center the search container */
}

.search-bar {
  flex: 1;
  max-width: 600px; /* Set a max-width for the search bar */
  margin-left: 1rem;
  margin-right: 1rem;
}

.actions-area {
  display: flex;
  align-items: center;
}

.actions-area button {
  margin-left: 1rem;
}
</style>
