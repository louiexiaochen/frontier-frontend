<template>
  <div class="language-switcher">
    <div class="language-dropdown">
      <button @click="toggleDropdown" class="language-button">
        <span class="language-icon">🌐</span>
        <span class="current-language">{{ currentLanguageLabel }}</span>
      </button>
      <div v-if="isOpen" class="language-options">
        <button 
          v-for="lang in languages" 
          :key="lang.code" 
          @click="switchLanguage(lang.code)"
          :class="{ active: currentLocale === lang.code }"
          class="language-option"
        >
          {{ lang.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { setLocale } from '../../i18n';

const { locale } = useI18n();

// 下拉菜单状态
const isOpen = ref(false);

// 支持的语言列表
const languages = [
  { code: 'zh', label: '中文' },
  { code: 'en', label: 'English' }
];

// 计算当前语言
const currentLocale = computed(() => locale.value);
const currentLanguageLabel = computed(() => {
  const lang = languages.find(l => l.code === currentLocale.value);
  return lang ? lang.label : '中文';
});

// 切换下拉菜单
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

// 切换语言
const switchLanguage = (lang) => {
  setLocale(lang);
  isOpen.value = false;
};

// 点击外部关闭下拉菜单
const handleClickOutside = (event) => {
  const dropdown = document.querySelector('.language-dropdown');
  if (dropdown && !dropdown.contains(event.target)) {
    isOpen.value = false;
  }
};

// 组件挂载时添加点击事件监听
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

// 组件卸载时移除点击事件监听
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.language-switcher {
  position: relative;
  z-index: 100;
}

.language-dropdown {
  position: relative;
}

.language-button {
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.language-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.language-icon {
  font-size: 16px;
}

.current-language {
  font-size: 14px;
}

.language-options {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  background: rgba(30, 30, 30, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  min-width: 120px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.language-option {
  display: block;
  width: 100%;
  text-align: left;
  padding: 8px 12px;
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.language-option:hover {
  background: rgba(255, 255, 255, 0.1);
}

.language-option.active {
  background: rgba(74, 153, 233, 0.3);
  font-weight: 500;
}
</style>