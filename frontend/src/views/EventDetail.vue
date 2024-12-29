<template>
  <div class="p-6 flex flex-col">
    <!-- Event Header -->
    <div v-if="event" class="bg-white shadow rounded-lg p-6 mb-6">
      <h1 class="text-3xl font-bold mb-2">{{ event.name }}</h1>
      <p class="text-gray-700 mb-4">{{ event.description || 'No description available' }}</p>
      <div class="flex items-center space-x-4 mb-6">
        <!-- Event Poster -->
        <div class="relative">
          <img :src="formattedEventPoster" alt="Event Poster" class="w-32 h-32 object-cover rounded-lg shadow-lg" />
          <button @click="triggerPosterModal" class="absolute bottom-0 right-0 p-2 w-10 h-10 bg-white rounded-full shadow-md">
            <font-awesome-icon icon="pen" class="text-gray-600" />
          </button>
        </div>
        <div v-if="event.user">
          <p class="text-lg font-semibold">
            <router-link :to="{ name: 'UserDetail', params: { id: event.user.id } }">
              {{ formatUserName(event.user) }}
            </router-link>
          </p>
          <p class="text-sm text-gray-500">
            {{ new Date(event.created_at).toLocaleDateString() }}
          </p>
        </div>
      </div>
      <div class="flex space-x-4 mb-6">
        <button class="bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center" @click="showEventModal = true">
          <font-awesome-icon icon="edit" class="mr-2" />
          Edit
        </button>
        <button class="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center" @click="confirmDelete">
          <font-awesome-icon icon="trash" class="mr-2" />
          Delete
        </button>
        <button @click="handleCreateEventOutcome" class="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center">
          <font-awesome-icon icon="plus" class="mr-2" />
          Add Event Outcome
        </button>
      </div>
    </div>

    <!-- Event Files -->
    <section class="mb-4">
      <h2 class="text-xl font-semibold mb-2">Event Files</h2>
      <div v-if="event.files && event.files.length > 0">
        <ReusableTable
          :labels="['File Name','File Type','Uploaded By','Date','']"
          :headers="['file_name', 'file_type', 'user', 'created_at', 'Actions']"
          :rows="event.files"
        >
          <template v-slot:cell-0="{ row }">
            <a :href="`${baseUrl}storage/${row.file_path}`" class="text-blue-500 hover:underline" target="_blank">{{ row.file_name }}</a>
          </template>
          <template v-slot:cell-2="{ row }">
            <router-link v-if="row.user" :to="{ name: 'UserDetail', params: { id: row.user.id } }" class="text-blue-500 hover:underline">
              {{ formatUserName(row.user) }}
            </router-link>
          </template>
          <template v-slot:cell-4="{ row }">
            <button @click="handleRemoveEventFile(row.id)" class="text-red-500 hover:text-red-700">
              <font-awesome-icon icon="trash" />
            </button>
          </template>
        </ReusableTable>
      </div>
      <div v-else>
        <p class="text-gray-500">No files have been added to this event yet.</p>
      </div>
      <button @click="handleAddFile" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center">
        <font-awesome-icon icon="plus" class="mr-2" />
        Add File
      </button>
      <!-- ADD EVENT FILE -->
      <FileUploader :isVisible="showEventFileUploader" operationType="eventFile"
        @close="showEventFileUploader=false;" />
    </section>

    <!-- Event Outcomes -->
    <section>
      <h2 class="text-xl font-semibold mb-2">Event Outcomes</h2>
      <div v-if="event.outcomes && event.outcomes.length > 0">
        <div v-for="(outcome,index) in event.outcomes" :key="outcome.id" class="bg-white p-4 border rounded-lg shadow-md mb-4">
          <div class="flex justify-between items-center">
            <p class="font-medium">#{{index + 1}} : {{ outcome.description }}</p>
            <div>
              <button @click="editOutcome(outcome.id)" class="text-blue-500 hover:text-blue-700 mr-2">
                <font-awesome-icon icon="edit" />
              </button>
              <button @click="confirmOutcomeDelete(outcome.id)" class="text-red-500 hover:text-red-700">
                <font-awesome-icon icon="trash" />
              </button>
            </div>
          </div>
          <p class="text-gray-500 mt-2">
            Uploaded by
            <router-link v-if="outcome.user" :to="{ name: 'UserDetail', params: { id: outcome.user.id } }" class="text-blue-500 hover:underline">
              {{ formatUserName(outcome.user) }}
            </router-link>
            on {{ new Date(outcome.date).toLocaleDateString() }}
          </p>
          <div class="mt-4">
            <h3 class="text-lg font-semibold mb-4">Outcome Images</h3>
            <div v-if="outcome.images && outcome.images.length > 0" class="flex flex-wrap gap-4">
              <div v-for="image in outcome.images" :key="image.id" class="relative group">
                <a :href="`${baseUrl}storage/${image.image_path}`" target="_blank">
                  <img :src="`${baseUrl}storage/${image.image_path}`" alt="Outcome Image" class="w-32 h-32 object-cover rounded-md">
                </a>
                <button @click="handleRemoveOutcomeImage(outcome.id,image.id)" class="absolute bottom-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <font-awesome-icon icon="trash" />
                </button>
              </div>
            </div>
            <div v-else>
              <p class="text-gray-500">No images available for this outcome.</p>
            </div>
            <button @click="handleAddOutcomeImage(outcome.id)" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center">
              <font-awesome-icon icon="plus" class="mr-2" />
              Add Image
            </button>
          </div>
          <div class="mt-4">
            <h3 class="text-lg font-semibold">Outcome Files</h3>
            <ReusableTable
              :labels="['File Name', 'Type', 'Uploaded By', 'Date Uploaded', 'Actions']"
              :headers="['file_name','file_type','user','created_at','']"
              :rows="outcome.files || []" 
            >
              <template v-slot:cell-0="{ row }">
                <a :href="`${baseUrl}storage/${row.file_path}`" class="text-blue-500 hover:underline" target="_blank">{{ row.file_name }}</a>
              </template>
              <template v-slot:cell-2="{ row }">
                <router-link v-if="row.user" :to="{ name: 'UserDetail', params: { id: row.user.id } }" class="text-blue-500 hover:underline">
                  {{ formatUserName(row.user) }}
                </router-link>
              </template>
              <template v-slot:cell-4="{ row }">
                <button @click="handleRemoveOutcomeFile(outcome.id,row.id)" class="text-red-500 hover:text-red-700">
                  <font-awesome-icon icon="trash" />
                </button>
              </template>
            </ReusableTable>
            <div v-if="!outcome.files || outcome.files.length === 0">
              <p class="text-gray-500">No files available for this outcome.</p>
            </div>
            <button @click="handleAddOutcomeFile(outcome.id)" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center">
              <font-awesome-icon icon="plus" class="mr-2" />
              Add File
            </button>
          </div>
        </div>
      </div>
      <div v-else>
        <p class="text-gray-500">No outcomes have been added to this event yet.</p>
      </div>
    </section>

    <!-- EDIT EVENT -->
    <EventCreationModal 
      :isVisible="showEventModal" 
      :id="$route.params.id"
      @close="showEventModal = false"
    />

    <!-- EDIT OUTCOME -->
    <EventOutcomeModal 
      :isVisible="showEditOutcomeModal" 
      :id="theOutcomeId"
      @close="showEditOutcomeModal = false"
    />

    <!-- CREATE OUTCOME -->
    <EventOutcomeModal 
      :isVisible="showOutcomeModal" 
      @close="showOutcomeModal = false"
    />

    <!-- OUTCOME FILES-->
    <FileUploader :isVisible="showOutcomeFileUploader" operationType="outcomeFile"
    :id="theOutcomeId" @close="showOutcomeFileUploader=false;" />

    <!-- OUTCOME IMAGES-->
    <FileUploader :isVisible="showOutcomeImageUploader" operationType="outcomeImage"
    :id="theOutcomeId" @close="showOutcomeImageUploader=false" />

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import ReusableTable from '@/components/ReusableTable.vue';
import EventCreationModal from '@/components/EventCreationModal.vue';
import FileUploader from '@/components/FileUploader.vue';
import EventOutcomeModal from '@/components/EventOutcomeModal.vue';

export default {
  components: {
    ReusableTable,
    EventCreationModal,
    FileUploader,
    EventOutcomeModal
  },
  data() {
    return {
      showEventModal: false,
      showPosterModal: false,
      selectedOutcomeId: null,
      showEventFileUploader : false,
      showOutcomeFileUploader : false,
      showEditOutcomeModal : false,
      showOutcomeModal : false,
      showOutcomeImageUploader : false,
      theOutcomeId : ''
    };
  },
  computed: {
    ...mapGetters('event', ['activeEvent']),
    event() {
      return this.activeEvent;
    },
    baseUrl() {
      return process.env.VUE_APP_BACKEND_URL || '/';
    },
    formattedEventPoster() {
      return this.event.poster
        ? `${this.baseUrl}storage/${this.event.poster}`
        : `${this.baseUrl}storage/event_posters/default-poster.png`;
    }
  },
  methods: {
    ...mapActions('event', ['fetchEventById', 'deleteEvent','removeEventFile']),
    ...mapActions('eventOutcome',['deleteEventOutcome']),
    async confirmDelete() {
      if (confirm('Are you sure you want to delete this event?')) {
        await this.deleteEvent(this.$route.params.id);
        this.$router.push({ name: 'Event' });
      }
    },

    async handleRemoveEventFile(fileId) {
      if (confirm('Are you sure you want to remove this file?')) {
       await this.removeEventFile(fileId);
      }
    },

    async handleRemoveFile(fileId) {
      if (confirm('Are you sure you want to remove this file?')) {
        await this.$store.dispatch('event/deleteEventFile', fileId);
        this.fetchEventById(this.$route.params.id);
      }
    },

    async handleAddFile() {
      // Add file handling logic here
      this.showEventFileUploader = true;
    },

    async handleRemoveOutcomeImage(outcomeId,imageId) {
      if (confirm('Are you sure you want to remove this image?')) {
        await this.$store.dispatch('eventOutcome/removeOutcomeImage',{outcomeId,imageId});
      }
    },

    async handleAddOutcomeImage(outcomeId) {
      // Add outcome image handling logic here
      this.theOutcomeId = outcomeId;
      this.showOutcomeImageUploader = true;
    },

    async handleRemoveOutcomeFile(outcomeId,fileId) {
      if (confirm('Are you sure you want to remove this file?')) {
        await this.$store.dispatch('eventOutcome/removeOutcomeFile',{outcomeId,fileId});
      }
    },

    async handleAddOutcomeFile(outcomeId) {
      this.theOutcomeId = outcomeId;
      this.showOutcomeFileUploader = true;
    },

    triggerPosterModal() {
      this.showPosterModal = true;
    },

    editOutcome(outcomeId) {
      this.theOutcomeId = outcomeId;
      this.showEditOutcomeModal = true;
    },

    async confirmOutcomeDelete(outcomeId) {
      if (confirm('Are you sure you want to delete this outcome?')) {
        await this.deleteEventOutcome(outcomeId);
      }
    },

    formatUserName(user) {
      return `${user.first_name} ${user.middle_name ? `${user.middle_name} ` : ''}${user.last_name}`;
    },

    handleCreateEventOutcome() {
      this.showOutcomeModal = true;
    }
  },

  async created() {
    await this.fetchEventById(this.$route.params.id);
  },
  watch : {
    '$route.params.id': {
      handler(newId) {
        // Call your API method here
        this.fetchEventById(newId);
      },
      immediate: true, // This will call the handler immediately on component mount
    }
  }
};
</script>


