<template>
  <div class="relative mb-6">
    <div class="relative">
      <input
        ref="input"
        :type="type"
        :value="modelValue"
        v-bind="$attrs"
        :class="inputClasses"
        @input="updateValue($event.target.value)"
        @focus="isFocused = true"
        @blur="isFocused = false"
        placeholder=" " 
      />
      <span :class="promptClasses">{{ prompt }}</span>
    </div>
    <p v-if="error" class="mt-2 text-red-600 text-sm">{{ error }}</p>
  </div>
</template>

<script>
export default {
  name: "CustomInput",
  props: {
    type: {
      type: String,
      default: "text",
    },
    error: {
      type: String,
      default: "",
    },
    prompt: {
      type: String,
      default: "",
    },
    inactiveColor: {
      type: String,
      default: "border-gray-500", // Gray border when inactive
    },
    activeColor: {
      type: String,
      default: "border-blue-500", // Blue border when active
    },
    modelValue: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      isFocused: false,
    };
  },
  computed: {
    inputClasses() {
      return [
        "block w-full px-4 py-3 rounded border",
        "transition duration-200 ease-in-out",
        this.isFocused || this.modelValue ? this.activeColor : this.inactiveColor,
      ];
    },
    promptClasses() {
      return [
        "absolute left-4 transition-all duration-200 ease-in-out",
        "text-gray-500 pointer-events-none",
        this.isFocused || this.modelValue ? "text-xs -top-2 left-4 bg-white px-1" : "text-base top-1/2 left-4 transform -translate-y-1/2",
      ];
    },
  },
  methods: {
    updateValue(value) {
      this.$emit('update:modelValue', value);
    },
    focusInput() {
      if (this.$refs.input) {
        this.$refs.input.focus();
      }
    },
  },
};
</script>

<style scoped>
span {
  top: 50%; /* Center vertically when not focused */
  left: 0.75rem; /* Adjust for proper alignment */
  padding: 0 0.25rem; /* Padding to make space around the text */
  background-color: white; /* Background to cover input border */
  pointer-events: none; /* Prevent interaction with the hint text */
  position: absolute; /* Ensure the hint is positioned absolutely */
}

/* Styles when input is focused or has a value */
input:focus + span,
input:not(:placeholder-shown) + span {
  top: -0.5rem; /* Move hint text to the top border when focused or has a value */
  font-size: 0.75rem; /* Shrink font size when focused or has a value */
}
</style>
