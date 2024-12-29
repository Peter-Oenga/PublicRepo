<template>
  <ModalLayout :isVisible="isVisible" @close="close">
    <template #header>
      <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
        {{ isEditing ? 'Edit Event' : 'Create Event' }}
      </h3>
    </template>
    <template #body>
      <form @submit.prevent="submitEvent">
        <!-- Name Input -->
        <CustomInput
          v-model="eventData.name" 
          prompt="Name"
          :error="errors.name ? errors.name.join(' ') : ''"
          required
        />

        <!-- Description Input -->
        <CustomText
          v-model="eventData.description"
          prompt="Description"
          :error="errors.description ? errors.description.join(' ') : ''"
          required
        />

        <!-- Location Input -->
        <CustomInput
          v-model="eventData.location"
          prompt="Location"
          :error="errors.location ? errors.location.join(' ') : ''"
          required
        />

        <!-- Start Date Input -->
        <CustomInput
          v-model="eventData.start"
          prompt="Start Date"
          type="date"
          :error="errors.start ? errors.start.join(' ') : ''"
          required
        />

        <!-- End Date Input -->
        <CustomInput
          v-model="eventData.end"
          prompt="End Date"
          type="date"
          :error="errors.end ? errors.end.join(' ') : ''"
          required
        />

        <!-- Tag Selector -->
        <CustomTagSelector
          :value="eventData.tag_ids"
          @tag-change="handleTagChange"
          class="mb-2"
        />

        <!-- Poster Upload Input (Hidden for Edit Mode) -->
        <CustomFileInput
          v-if="!isEditing"
          :value="eventData.poster"
          @input="file => eventData.poster = file"
          label="Upload Event Poster"
          :error="errors.poster ? errors.poster.join(' ') : ''"
          required
        />
      </form>
    </template>
    <template #footer>
      <!-- Submit Button -->
      <button 
        @click="submitEvent" 
        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-4"
      >
        {{ isEditing ? 'Update Event' : 'Create Event' }}
      </button>
    </template>
  </ModalLayout>
</template>

<script>
import ModalLayout from './ModalLayout.vue';
import CustomInput from './CustomInput.vue';
import CustomText from './CustomText.vue';
import CustomFileInput from './CustomFileInput.vue';
import CustomTagSelector from './CustomTagSelector.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    ModalLayout,
    CustomInput,
    CustomText,
    CustomFileInput,
    CustomTagSelector
  },
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    id: {
      type: [String, Number],
      default: null
    }
  },
  data() {
    return {
      eventData: {
        name: '',
        description: '',
        location: '',
        start: '',
        end: '',
        tag_ids: [],
        poster: null
      }
    };
  },
  computed: {
    ...mapGetters('event', ['errors', 'activeEvent']),
    isEditing() {
      return !!this.id;
    }
  },
  methods: {
    ...mapActions('event', ['fetchEventById', 'createEvent', 'updateEvent', 'setErrors']),
    async submitEvent() {
      try {
        // Prepare FormData
        let formData = new FormData();
        formData.append('name', this.eventData.name);
        formData.append('description', this.eventData.description);
        formData.append('location', this.eventData.location);
        formData.append('start', this.eventData.start);
        formData.append('end', this.eventData.end);

        if (!this.isEditing && this.eventData.poster) {
          formData.append('poster', this.eventData.poster);
        }

        this.eventData.tag_ids.forEach(tagId => {
          formData.append('tag_ids[]', tagId);
        });

        // Call appropriate Vuex action
        if (this.isEditing) {
          
          await this.updateEvent({ id: this.id, formData });
        } else {
          await this.createEvent(formData);
        }

        // Check for errors and reset form
        if (Object.keys(this.errors).length === 0) {
          if (!this.isEditing) {
            this.resetForm();
          }
          alert('Event has been successfully saved!');
        }
      } catch (error) {
        console.error('Error saving event:', error);
      }
    },
    handleTagChange(newTagIds) {
      this.eventData.tag_ids = newTagIds;
    },
    resetForm() {
      this.eventData = {
        name: '',
        description: '',
        location: '',
        start: '',
        end: '',
        tag_ids: [],
        poster: null
      };
    },
    close() {
      this.setErrors({});
      this.$emit('close');
    }
  },
  mounted() {
    if (this.isEditing && this.id) {
      this.fetchEventById(this.id).then(() => {
        // Set the event data after fetching
        const event = this.activeEvent;
        this.eventData = {
          name: event.name || '',
          description: event.description || '',
          location: event.location || '',
          start: event.start ? new Date(event.start).toISOString().split('T')[0] : '',
          end: event.end ? new Date(event.end).toISOString().split('T')[0] : '',
          tag_ids: event.tags ? event.tags.map(tag => tag.id) : [],
          poster: null
        };
      });
    }
  },
  watch: {
    id(newId) {
      if (this.isEditing && newId) {
        this.fetchEventById(newId).then(() => {
          const event = this.activeEvent;
          this.eventData = {
            name: event.name || '',
            description: event.description || '',
            location: event.location || '',
            start: event.start ? new Date(event.start).toISOString().split('T')[0] : '',
            end: event.end ? new Date(event.end).toISOString().split('T')[0] : '',
            tag_ids: event.tags ? event.tags.map(tag => tag.id) : [],
            poster: null
          };
        });
      } else {
        this.resetForm();
      }
    }
  }
};
</script>
