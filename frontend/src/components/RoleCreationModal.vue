<template>
  <ModalLayout :isVisible="isVisible" @close="close">
    <template #header>
      <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
        {{ isEditing ? 'Edit Role' : 'Create Role' }}
      </h3>
    </template>
    <template #body>
      <form @submit.prevent="submitRole">
        <!-- Name Input -->
        <CustomInput
          v-model="roleData.name"
          prompt="Name"
          :error="errors.name ? errors.name.join(' ') : ''"
          required
        />
      </form>
    </template>
    <template #footer>
      <!-- Submit Button -->
      <button 
        @click="submitRole" 
        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-4"
      >
        {{ isEditing ? 'Update Role' : 'Create Role' }}
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
    CustomInput
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
      roleData: {
        name: ''
      }
    };
  },
  computed: {
    ...mapGetters('role', ['errors', 'activeRole']),
    isEditing() {
      return !!this.id;
    }
  },
  methods: {
    ...mapActions('role', ['fetchRoleById', 'createRole', 'updateRole', 'setErrors']),
    async submitRole() {
      try {
        if (this.isEditing) {
          await this.updateRole({ id: this.id, name: this.roleData.name });
          this.$emit('close');
        } else {
          await this.createRole({ name: this.roleData.name });
        }

        if (Object.keys(this.errors).length === 0) {
          this.resetForm();
          alert('Role has been successfully saved!');
        }
      } catch (error) {
        console.error('Error saving role:', error);
      }
    },
    resetForm() {
      if (!this.isEditing) {
        this.roleData.name = '';
      }
    },
    close() {
      this.setErrors({});
      this.$emit('close');
    }
  },
  mounted() {
    if (this.isEditing && this.id) {
      this.fetchRoleById(this.id).then(() => {
        this.roleData.name = this.activeRole?.name || ''; // Safe access
      });
    }
  },
  watch: {
    id(newId) {
      if (this.isEditing && newId) {
        this.fetchRoleById(newId).then(() => {
          this.roleData.name = this.activeRole?.name || ''; // Safe access
        });
      } else {
        this.resetForm();
      }
    }
  }
};
</script>
