<script setup>
import SoundIcon from './SoundIcon.vue';

defineProps({
  size: {
    type: [Number, String],
    default: 40
  }
});
</script>

<template>
  <div class="pronunciation-button">
    <div class="content">
      <span class="english-text">英</span>
      <SoundIcon class="sound-icon" :width="9" :height="11" color="#7B7B7B" />
    </div>
  </div>
</template>

<style scoped>
.pronunciation-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 9999px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  vertical-align: middle;
  position: relative;
  top: 1px;
}

.pronunciation-button:hover {
  transform: scale(1.05);
}

.content {
  display: flex;
  align-items: center;
  gap: 1px;
  padding: 0px 3px;
}

.english-text {
  font-weight: 600;
  font-size: 9px;
  color: #7B7B7B;
}

.sound-icon {
  margin-top: 1px;
}
</style> 