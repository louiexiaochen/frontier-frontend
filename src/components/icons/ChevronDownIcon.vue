<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 9L12 15L18 9" :stroke="color" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  color: {
    type: String,
    default: 'white'
  },
  size: {
    type: [Number, String],
    default: 24
  }
});
</script> 