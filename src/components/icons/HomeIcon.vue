<template>
  <svg :width="size" :height="size" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.5 0L1.75 12.25V35H14V22.75H21V35H33.25V12.25L17.5 0Z" :fill="color"/>
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