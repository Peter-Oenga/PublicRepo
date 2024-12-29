<template>
    <button
      :class="buttonClasses"
      @mouseover="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <slot></slot>
    </button>
  </template>
  
  <script>
  export default {
    name: "CustomButton",
    props: {
      type: {
        type: String,
        default: "primary",
      },
      inactiveColor: {
        type: String,
        default: "bg-blue-500",
      },
      activeColor: {
        type: String,
        default: "bg-blue-700",
      },
      inactiveTextColor: {
        type: String,
        default: "text-white",
      },
      activeTextColor: {
        type: String,
        default: "text-white",
      },
    },
    data() {
      return {
        isHovered: false,
      };
    },
    computed: {
      buttonClasses() {
        const baseClasses = "px-4 py-2 rounded-full transition duration-200 ease-in-out";
  
        if (this.type === "primary") {
          return [
            baseClasses,
            this.isHovered ? this.activeColor : this.inactiveColor,
            this.inactiveTextColor,
          ];
        } else if (this.type === "secondary") {
          return [
            baseClasses,
            "bg-transparent border border-blue-500",
            this.isHovered ? "bg-blue-100 text-blue-700" : "text-blue-500",
          ];
        }
  
        return baseClasses;
      },
    },
  };
  </script>
  
  <style scoped>
  button {
    @apply focus:outline-none;
  }
  </style>
  