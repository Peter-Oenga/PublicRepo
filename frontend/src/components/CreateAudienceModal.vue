<template>
    <ModalLayout :isVisible="isVisible" @close="close">
      <template #header>
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
          {{ isEditing ? 'Edit Audience' : 'Create Audience' }}
        </h3>
      </template>
      <template #body>
        <form @submit.prevent="submitAudience">
          <!-- Name Input -->
          <CustomInput
            v-model="audienceData.name"
            prompt="Audience Name"
            :error="errors.name ? errors.name.join(' ') : ''"
            required
          />
        </form>
      </template>
      <template #footer>
        <!-- Submit Button -->
        <button 
          @click="submitAudience" 
          class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-4"
        >
          {{ isEditing ? 'Update Audience' : 'Create Audience' }}
        </button>
      </template>
    </ModalLayout>
  </template>
  
  <script>
  import ModalLayout from './ModalLayout.vue';
  import CustomInput from './CustomInput.vue';
  import { mapGetters, mapActions } from 'vuex';
  
  export default {
    components: {
      ModalLayout,
      CustomInput,
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
        audienceData: {
          name: ''
        }
      }
    },
    computed: {
      ...mapGetters('audience', ['errors','activeAudience']),
      ...mapGetters('global',['loading']),
      isEditing() {
        return this.id != null; 
      },
      hasErrors() {
        return Object.keys(this.errors).length > 0;
      },
    },
    methods: {
      ...mapActions('audience', ['createAudience', 'updateAudience', 'setErrors', 'fetchAudienceById']),
      async submitAudience() {
        try {
          if (this.isEditing) {
            await this.updateAudience({ id: this.id, ...this.audienceData });
          } else {
            await this.createAudience(this.audienceData);
          }
          if (!this.hasErrors) {
            this.close();
          }
        } catch (error) {
          console.error('Error saving audience:', error);
        }
      },
      reset() {
        this.audienceData = {
          name: ''
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
        immediate: true, // Fetch achievement on component load or when id changes
        async handler(newId) {
          if (newId && this.isEditing) {
            await this.fetchAudienceById(newId);
            this.audienceData = {
              name: this.activeAudience?.name || ''
            };
          }
        },
      },
    },
  }
  </script>
  