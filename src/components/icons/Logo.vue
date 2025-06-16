<template>
  <div class="logo-component">
    <img src="./FrontierX-Logo.svg" alt="FrontierX Logo" class="logo-image" />
  </div>
</template>

<script setup>
// Logo 组件，用于显示 FrontierX Logo
</script>

<style scoped>
.logo-component {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  user-select: none;
  pointer-events: none;
}

.logo-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: brightness(0.8);
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  pointer-events: none;
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  user-drag: none;
  -webkit-touch-callout: none;
}
</style> 