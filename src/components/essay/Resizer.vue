<template>
  <div 
    class="resizer" 
    @mousedown="startResize" 
    @touchstart="startResize"
  ></div>
</template>

<script setup>
import { defineEmits } from 'vue';

const emit = defineEmits(['resize-start']);

const startResize = (event) => {
  // 阻止默认行为和冒泡
  event.preventDefault();
  event.stopPropagation();
  
  // 触发父组件的调整大小事件
  emit('resize-start', event);
};
</script>

<style scoped>
.resizer {
  width: 8px;
  cursor: col-resize;
  background-color: rgba(255, 255, 255, 0.1);
  transition: background-color 0.2s;
  z-index: 10;
}

.resizer:hover {
  background-color: rgba(74, 153, 233, 0.5);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .resizer {
    display: none;
  }
}
</style>