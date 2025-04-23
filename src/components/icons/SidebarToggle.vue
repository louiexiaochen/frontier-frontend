<template>
  <div class="sidebar-toggle-icon" :class="{ 'active': isActive }">
    <div class="toggle-line"></div>
    <div class="toggle-line"></div>
    <div class="toggle-line"></div>
  </div>
</template>

<script setup>
defineProps({
  isActive: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
.sidebar-toggle-icon {
  width: 24px;
  height: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  padding: 4px;
}

.toggle-line {
  width: 100%;
  height: 2px;
  background-color: white;
  transition: all 0.3s;
}

.active .toggle-line:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
}

.active .toggle-line:nth-child(2) {
  opacity: 0;
}

.active .toggle-line:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
}
</style>