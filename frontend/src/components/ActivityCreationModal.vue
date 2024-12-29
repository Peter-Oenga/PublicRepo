<template>
  <ModalLayout :isVisible="isVisible" @close="close">
    <template #header>
      <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
        {{ isEditing ? 'Edit Activity' : 'Create Activity' }}
      </h3>
    </template>
    <template #body>
      <form @submit.prevent="submitActivity">
        <!-- Title Input -->
        <CustomInput
          v-model="activityData.title"
          prompt="Title"
          :error="errors.title ? errors.title.join(' ') : ''"
          required
        />

        <!-- Description Input -->
        <CustomText
          v-model="activityData.description"
          prompt="Description"
          :error="errors.description ? errors.description.join(' ') : ''"
        />

        <!-- Start Date Input -->
        <CustomInput
          v-model="activityData.start_date"
          prompt="Start Date"
          type="date"
          :error="errors.start_date ? errors.start_date.join(' ') : ''"
          required
        />

        <!-- End Date Input -->
        <CustomInput
          v-model="activityData.end_date"
          prompt="End Date"
          type="date"
          :error="errors.end_date ? errors.end_date.join(' ') : ''"
          required
        />

        <!-- Audience Selector -->
        <select v-model="activityData.audience_id" required>
          <option value="" disabled>Select Audience</option>
          <option v-for="audience in audiences" :key="audience.id" :value="audience.id">
            {{ audience.name }}
          </option>
        </select>
        <p v-if="errors.audience_id" class="text-red-500">{{ errors.audience_id.join(' ') }}</p>

        <!-- Report File Upload (Hidden for Edit Mode) -->
        <CustomFileInput
          v-if="!isEditing"
          :value="activityData.report"
          @input="file => activityData.report = file"
          label="Upload Report"
          :error="errors.report ? errors.report.join(' ') : ''"
        />
      </form>
    </template>
    <template #footer>
      <!-- Submit Button -->
      <button
        @click="submitActivity"
        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-4"
      >
        {{ isEditing ? 'Update Activity' : 'Create Activity' }}
      </button>
    </template>
  </ModalLayout>
</template>

<script>
import ModalLayout from './ModalLayout.vue';
import CustomInput from './CustomInput.vue';
import CustomText from './CustomText.vue';
import CustomFileInput from './CustomFileInput.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    ModalLayout,
    CustomInput,
    CustomText,
    CustomFileInput,
  },
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    id: {
      type: [String, Number],
      default: null, // Prop to hold the activity ID for editing
    },
    
  },
  data() {
    return {
      activityData: {
        title: '',
        description: '',
        start_date: '',
        end_date: '',
        report: null,
        audience_id: null,
      },
    };
  },
  computed: {
    ...mapGetters('activity', ['errors','activeActivity']),
    ...mapGetters('audience', ['audiences', 'activeAudience']), // Fetch audiences from Vuex store
    isEditing() {
      return this.id !== null;
    },
    hasErrors() {
        return Object.keys(this.errors).length > 0;
    },
    projectId() {
      return this.$route.params.id; // Get the project ID from route params
    },
  },
  methods: {
    ...mapActions('activity', [
      'createActivity',
      'updateActivity',
      'setErrors',
      'fetchActivityById',
    ]),

    async submitActivity() {
      let formData = new FormData();
      formData.append('title', this.activityData?.title);
      formData.append('description', this.activityData?.description);
      formData.append('start_date', this.activityData?.start_date);
      formData.append('end_date', this.activityData?.end_date);
      formData.append('audience_id', this.activityData?.audience_id);

      if (!this.isEditing && this.activityData?.report) {
          formData.append('report', this.activityData?.poster);
      }

      if (this.isEditing) {
        formData.append('id',this.id);
        await this.updateActivity({
          activityData: formData,
          projectId: this.projectId,
        });
        if (!this.hasErrors) {
          this.close();
        }
      } else {
        await this.createActivity({
          activityData: formData,
          projectId: this.projectId,
        });
        if (!this.hasErrors) {
          this.close();
        }
      }
    },
    reset() {
      this.activityData = {
          title: '',
          description: '',
          start_date: '',
          end_date: '',
          report: null,
          audience_id: null,
        };
        const errors = {};
        this.setErrors(errors);
    },
    close() {
      this.reset();
      this.$emit('close');
    },
  },
  watch: {
    id: {
      immediate: true, // Fetch activity on component load or when id changes
      async handler(newId) {
        if (newId) {
          await this.fetchActivityById({
            activityId: newId,
            projectId: this.projectId,
          });
          this.activityData = {
            title: this.activeActivity?.title || '',
            description: this.activeActivity?.description || '',
            start_date: this.activeActivity?.start_date || '',
            end_date: this.activeActivity?.end_date || '',
            audience_id: this.activeActivity?.audience_id || null,
          };
        }
      },
    },
  },
};
</script>
