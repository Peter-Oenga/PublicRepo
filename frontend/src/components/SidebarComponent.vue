<template>
  <aside :class="sidebarClass" @click.self="closeOverlay">
    <ul class="menu">
      <li 
        v-for="item in menuItems" 
        :key="item.id" 
        class="menu-item cursor-pointer"
        @click="navigateTo(item.route)"
      >
        <font-awesome-icon :icon="['fas', item.icon]" class="icon" />
        <span v-if="!isCollapsed || isTablet" class="label">{{ item.label }}</span>
      </li>
    </ul>
    <div class="action-buttons">
      <button 
        v-if="isAudienceRoute" 
        @click="handleCreateAudience" 
        class="action-button"
      >
        <font-awesome-icon icon="plus" class="mr-4"/>
        <span v-if="!isCollapsed || isTablet">Create Audience</span>
      </button>
      <button 
        v-if="isProjectRoute" 
        @click="handleCreateProject" 
        class="action-button"
      >
        <font-awesome-icon icon="plus" class="mr-4"/>
        <span v-if="!isCollapsed || isTablet">Create Project</span>
      </button>
      <button 
        v-if="isCollectionRoute" 
        @click="handleCreateDocument" 
        class="action-button"
      >
        <font-awesome-icon icon="plus" class="mr-4"/>
        <span v-if="!isCollapsed || isTablet">Upload Document</span>
      </button>
      <button 
        v-if="isCollectionRoute" 
        @click="handleCreateCollection" 
        class="action-button"
      >
        <font-awesome-icon icon="folder-plus" class="mr-4"/>
        <span v-if="!isCollapsed || isTablet">Create Collection</span>
      </button>
      <button 
        v-if="isEventRoute" 
        @click="handleCreateEvent" 
        class="action-button"
      >
        <font-awesome-icon icon="list-alt" class="mr-4"/>
        <span v-if="!isCollapsed || isTablet">Create Event</span>
      </button>
      <button 
        v-if="isEventDetailRoute" 
        @click="handleCreateEventOutcome" 
        class="action-button"
      >
        <font-awesome-icon icon="plus" class="mr-4"/>
        <span v-if="!isCollapsed || isTablet">Add Event Outcome</span>
      </button>
      <button 
        v-if="isTagRoute" 
        @click="$emit('create-tag')" 
        class="action-button"
      >
        <font-awesome-icon icon="plus" class="mr-4"/>
        <span v-if="!isCollapsed || isTablet">Add Tag</span>
      </button>
      <button 
        v-if="isRoleRoute" 
        @click="$emit('create-role')" 
        class="action-button"
      >
        <font-awesome-icon icon="plus" class="mr-4"/>
        <span v-if="!isCollapsed || isTablet">Add Role</span>
      </button>
    </div>
  </aside>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { mapGetters,mapActions } from 'vuex';
export default {
  name: 'SidebarComponent',
  components: {
    FontAwesomeIcon
  },
  props: {
    menuItems: {
      type: Array,
      required: true,
    },
    isOverlay: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isCollapsed: false,
      isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
    };
  },
  computed: {
    ...mapGetters('collection',['rootId']),
    sidebarClass() {
      return {
        'sidebar': true,
        'collapsed': this.isCollapsed,
        'tablet': this.isTablet,
        'overlay': this.isOverlay
      };
    },
    isAudienceRoute() {
      return this.$route.name === 'Audience';
    },
    isProjectRoute() {
      return this.$route.name === 'Project';
    },
    isCollectionRoute() {
      return this.$route.name === 'Collection';
    },
    isEventRoute() {
      return this.$route.name === 'Event';
    },
    isEventDetailRoute() {
      return this.$route.name === 'EventDetail';
    },
    isTagRoute() {
      return this.$route.name === 'Tag';
    },
    isRoleRoute() {
      return this.$route.name === 'Role';
    }
  },
  methods: {
    ...mapActions('collection',['fetchRootId']),
    closeOverlay() {
      if (this.isOverlay) {
        this.$emit('close-overlay');
      }
    },
    handleResize() {
      this.isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
      if (window.innerWidth >= 1024) {
        this.isCollapsed = false; // Ensure collapse state is reset on desktop
      }
    },
    handleCreateAudience() {
      this.closeOverlay();
      this.$emit('create-audience');
    },
    handleCreateProject() {
      this.closeOverlay();
      this.$emit('create-project');
    },
    handleCreateDocument() {
      this.closeOverlay();
      this.$emit('create-document');
    },
    handleCreateCollection() {
      this.closeOverlay();
      this.$emit('create-collection');
    },
    handleCreateEvent() {
      this.closeOverlay();
      this.$emit('create-event');
    },
    handleCreateEventOutcome() {
      this.closeOverlay();
      this.$emit('create-event-outcome');
    },
    async navigateTo(routeName) {
      this.closeOverlay();
      if (routeName === 'Collection') {
        if (!this.rootId) {
          await this.fetchRootId();
        }
        this.$router.push({name:routeName, params:{id: this.rootId}});
      } else {
        this.$router.push({ name: routeName });
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
.sidebar {
  width: 250px;
  transition: width 0.3s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #2d3748; /* Set a different background color */
  color: #fff; /* Ensure text is visible */
}

.sidebar.collapsed {
  width: 80px;
}

.sidebar.tablet {
  width: 80px;
}

.sidebar.overlay {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  z-index: 10;
  background-color: #1a202c;
  width: 250px;
}

.menu {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 10px;
}

.menu-item .icon {
  margin-right: 10px;
}

.menu-item .label {
  font-size: 1rem;
}

.sidebar.collapsed .menu-item .label,
.sidebar.tablet .menu-item .label {
  display: block;
  font-size: 0.75rem;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
}

.action-button {
  background-color: #4caf50; /* Accent color */
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-button .icon {
  margin-right: 5px;
}

.action-button span {
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .sidebar {
    display: none;
  }

  .sidebar.overlay {
    display: block;
  }
}
</style>
