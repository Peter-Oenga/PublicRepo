<template>
  <ModalLayout :isVisible="isVisible" @close="close">
    <template #header>
      <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
        {{ isEditing ? 'Edit Event Outcome' : 'Create Event Outcome' }}
      </h3>
    </template>
    <template #body>
      <form @submit.prevent="submitEventOutcome">
        <!-- Description Input -->
        <CustomText
          v-model="eventOutcomeData.description"
          prompt="Description"
          :error="errors.description ? errors.description.join(' ') : ''"
          required
        />

        <!-- Date Input -->
        <CustomInput
          v-model="eventOutcomeData.date"
          prompt="Date"
          type="date"
          :error="errors.date ? errors.date.join(' ') : ''"
          required
        />
      </form>
    </template>
    <template #footer>
      <button 
        @click="submitEventOutcome" 
        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-4"
      >
        {{ isEditing ? 'Update Event Outcome' : 'Create Event Outcome' }}
      </button>
    </template>
  </ModalLayout>
</template>

<script>
import ModalLayout from './ModalLayout.vue';
import CustomInput from './CustomInput.vue';
import CustomText from './CustomText.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    ModalLayout,
    CustomInput,
    CustomText
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
      eventOutcomeData: {
        description: '',
        date: ''
      }
    };
  },
  computed: {
    ...mapGetters('eventOutcome', ['errors']),
    ...mapGetters('event', ['activeEvent']),
    eventId() {
      return this.activeEvent?.id || null;
    },
    isEditing() {
      return !!this.id;
    }
  },
  methods: {
    ...mapActions('eventOutcome', ['createEventOutcome', 'updateEventOutcome', 'setErrors']),
    async submitEventOutcome() {
      try {
        const payload = {
          eventId: this.eventId,
          outcomeData: this.eventOutcomeData
        };

        if (this.isEditing) {
          payload.outcomeId = this.id;
          await this.updateEventOutcome(payload);
        } else {
          await this.createEventOutcome(payload);
        }

        if (Object.keys(this.errors).length === 0) {
          if (!this.isEditing) {
            this.resetForm();
          }
          alert('Event outcome has been successfully saved!');
        }
      } catch (error) {
        console.error('Error saving event outcome:', error);
      }
    },
    resetForm() {
      this.eventOutcomeData = {
        description: '',
        date: ''
      };
    },
    close() {
      this.setErrors({});
      this.$emit('close');
    }
  },
  mounted() {
    if (this.isEditing && this.id) {
      // You could fetch the event outcome by ID here if needed
      const outcome = this.activeEvent.outcomes.find(outcome => outcome.id === this.id);
      this.eventOutcomeData = {
        description: outcome?.description || '',
        date: outcome?.date || ''
      };
    }
  },
  watch : {
    id(newId) {
      // You could fetch the event outcome by ID here if needed
      const outcome = this.activeEvent.outcomes.find(outcome => outcome.id === newId);
      this.eventOutcomeData = {
        description: outcome?.description || '',
        date: outcome?.date || ''
      };
    }
  }
};
</script>
