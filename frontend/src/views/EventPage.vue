<template>
  <div class="event-page">
    <!-- Show message when there are no events -->
    <div v-if="events.length === 0 && !loading" class="empty-event">
      <img src="@/assets/empty_event.jpg" alt="No Events" class="empty-icon" />
      <p class="empty-message">There are no events available at the moment. Start by creating a new event!</p>
    </div>

    <!-- Grid of Event Cards -->
    <div v-else class="container mx-auto p-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <EventCard
          v-for="event in events"
          :key="event.id"
          :title="event.name"
          :description="event.description"
          :startDate="event.start"
          :endDate="event.end"
          :tags="event.tags"
          :location="event.location"
          :poster="event.poster"
          :user="event.user"
          @click="navigateToEvent(event)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import EventCard from '@/components/EventCard.vue';

export default {
  name: 'EventPage',
  components: {
    EventCard,
  },
  computed: {
    ...mapGetters('event', ['events']),
    ...mapGetters('global', ['loading']),
  },
  methods: {
    ...mapActions('event', ['fetchEvents']),
    navigateToEvent(event) {
      this.$store.dispatch('event/setActiveEvent', event); // Set the active event in the store
      this.$router.push({ name: 'EventDetail', params: { id: event.id } }); // Navigate to the event detail page
    }
  },
  mounted() {
    this.fetchEvents({tag:'',search:''});
  },
};
</script>

<style scoped>
.event-page {
  display: flex;
  flex-direction: column;
}

.empty-event {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 300px; /* Adjust as needed */
}

.empty-icon {
  width: 250px;
  height: 200px;
  margin-bottom: 20px;
}

.empty-message {
  font-size: 1.2rem;
  color: #777;
}

.grid {
  display: grid;
  gap: 16px;
}
</style>
