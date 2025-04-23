<template>
  <transition name="toast-fade">
    <div 
      v-if="visible" 
      :class="[
        'message-toast', 
        `message-toast--${type}`, 
        `message-toast--${position}`,
        { 'message-toast--hover': isHover }
      ]"
      :style="customStyle"
    >
      <div class="message-toast__content">
        <div class="message-toast__icon" v-if="showIcon">
          <i class="icon" :class="iconClass"></i>
        </div>
        <div class="message-toast__text">{{ message }}</div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  message: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'info', // info, success, warning, error
    validator: (value) => ['info', 'success', 'warning', 'error'].includes(value)
  },
  duration: {
    type: Number,
    default: 3000 // 默认显示3秒
  },
  position: {
    type: String,
    default: 'bottom', // top, bottom, top-left, top-right, bottom-left, bottom-right
    validator: (value) => ['top', 'bottom', 'top-left', 'top-right', 'bottom-left', 'bottom-right'].includes(value)
  },
  isHover: {
    type: Boolean,
    default: false
  },
  showIcon: {
    type: Boolean,
    default: true
  },
  customStyle: {
    type: Object,
    default: () => ({})
  }
});

const visible = ref(false);
let timer = null;

const iconClass = computed(() => {
  const iconMap = {
    info: 'icon-info',
    success: 'icon-success',
    warning: 'icon-warning',
    error: 'icon-error'
  };
  return iconMap[props.type] || 'icon-info';
});

const show = () => {
  visible.value = true;
  
  if (props.duration > 0 && !props.isHover) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      hide();
    }, props.duration);
  }
};

const hide = () => {
  visible.value = false;
};

onMounted(() => {
  show();
});

onBeforeUnmount(() => {
  clearTimeout(timer);
});

// 暴露方法给父组件
defineExpose({
  show,
  hide
});
</script>

<style scoped>
.message-toast {
  position: fixed;
  z-index: 9999;
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  pointer-events: none;
  transition: all 0.3s;
  max-width: 80%;
}

.message-toast--hover {
  pointer-events: auto;
}

.message-toast--info {
  background-color: rgba(24, 144, 255, 0.9);
  color: white;
}

.message-toast--success {
  background-color: rgba(82, 196, 26, 0.9);
  color: white;
}

.message-toast--warning {
  background-color: rgba(250, 173, 20, 0.9);
  color: white;
}

.message-toast--error {
  background-color: rgba(245, 34, 45, 0.9);
  color: white;
}

.message-toast--top {
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
}

.message-toast--bottom {
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
}

.message-toast--top-left {
  top: 20px;
  left: 20px;
}

.message-toast--top-right {
  top: 20px;
  right: 20px;
}

.message-toast--bottom-left {
  bottom: 20px;
  left: 20px;
}

.message-toast--bottom-right {
  bottom: 20px;
  right: 20px;
}

.message-toast__content {
  display: flex;
  align-items: center;
}

.message-toast__icon {
  margin-right: 8px;
  font-size: 16px;
}

.message-toast__text {
  font-size: 14px;
  line-height: 1.5;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(10px) translateX(-50%);
}

/* 简单的图标样式，您可以替换为自己的图标库 */
.icon-info::before {
  content: "ℹ️";
}

.icon-success::before {
  content: "✅";
}

.icon-warning::before {
  content: "⚠️";
}

.icon-error::before {
  content: "❌";
}
</style>