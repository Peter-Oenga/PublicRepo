<template>
  <div class="p-4 border rounded-md shadow-sm flex flex-col cursor-pointer transition-transform duration-300 transform hover:scale-105">
    <div class="mb-4">
      <img :src="formattedPoster" alt="Event Poster" class="w-full h-32 object-cover rounded-md" />
    </div>
    <h3 class="text-lg font-semibold mb-2">{{ title }}</h3>
    <p class="text-sm text-gray-600 mb-2">{{ shortDescription }}</p>
    <div class="flex items-center mb-2">
      <font-awesome-icon icon="calendar-day" class="w-4 h-4 mr-1" />
      <p class="text-sm">{{ startDate }}</p>
      <span class="mx-2">-</span>
      <font-awesome-icon icon="calendar-day" class="w-4 h-4 mr-1" />
      <p class="text-sm">{{ endDate }}</p>
    </div>
    <div class="mb-2">
      <span v-for="tag in tags" :key="tag.id" @click="handleTagFilter(tag.name,$event)" class="inline-block px-3 py-1 mr-2 mb-2 text-sm bg-gray-700 text-white rounded-full">
        {{ tag.name }}
      </span>
    </div>
    <div class="flex items-center mb-4">
      <font-awesome-icon icon="map-marker-alt" class="w-4 h-4 mr-2" />
      <p class="text-sm">{{ location }}</p>
    </div>
    <div v-if="user" class="flex items-center">
      <img :src="formattedUserAvatar" alt="User Avatar" class="w-8 h-8 rounded-full mr-2" />
      <p class="text-sm font-medium">{{ userFullName }}</p>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { mapActions } from 'vuex';
export default {
  name: "EventCard",
  components: {
    FontAwesomeIcon
  },
  props: {
    title: String,
    description: String,
    startDate: String,
    endDate: String,
    tags: Array,
    location: String,
    poster: String,
    user: Object // Expecting user object containing avatar and name details
  },
  computed: {
    shortDescription() {
      return this.description.length > 100 ? this.description.substring(0, 100) + '...' : this.description;
    },
    baseUrl() {
      return process.env.VUE_APP_BACKEND_URL || '/';
    },
    formattedPoster() {
      return this.poster ? `${this.baseUrl}storage/${this.poster}` : `${this.baseUrl}storage/event_posters/default-poster.png`;
    },
    formattedUserAvatar() {
      return this.user && this.user.avatar ? `${this.baseUrl}storage/${this.user.avatar}` : `${this.baseUrl}storage/avatars/default-avatar.png`;
    },
    userFullName() {
      return this.user ? `${this.user.first_name} ${this.user.last_name}` : '';
    }
  },
  methods: {
    ...mapActions('event',['fetchEvents']),
    async handleTagFilter(tag,event) {
      event.stopPropagation();
      if (this.$route.name === 'Event') {
        await this.fetchEvents({tag:tag,search:''});
      }
    }
  }
}
</script>
