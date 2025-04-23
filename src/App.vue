<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import './assets/css/global.css'

onMounted(() => {
  // 不再设置overflow为auto
  // document.documentElement.style.overflow = 'auto'
  // document.body.style.overflow = 'auto'
})
</script>

<style>
/* 重写全局样式 */
#app {
  max-width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  display: block !important;
}

/* 设置根字体大小，作为rem单位的基准 - 默认14寸屏幕 */
:root {
  font-size: 16px;
}

/* 为不同尺寸显示器设置不同的根字体大小 */
/* 15寸显示器 - 约1400×900像素 */
@media screen and (min-width: 1366px) and (max-width: 1440px) {
  :root {
    font-size: 17px;
  }
}

/* 16寸显示器 - 约1600×1000像素 */
@media screen and (min-width: 1441px) and (max-width: 1680px) {
  :root {
    font-size: 18px;
  }
}

/* 24寸显示器 - 约1920×1080像素 */
@media screen and (min-width: 1681px) and (max-width: 1920px) {
  :root {
    font-size: 20px;
  }
}

/* 27寸显示器 - 约2560×1440像素 */
@media screen and (min-width: 1921px) and (max-width: 2560px) {
  :root {
    font-size: 22px;
  }
}

/* 32寸显示器 - 约3840×2160像素及以上 */
@media screen and (min-width: 2561px) {
  :root {
    font-size: 24px;
  }
}

@media (min-width: 1024px) {
  body {
    display: block !important;
    place-items: normal !important;
  }

  #app {
    display: block !important;
    grid-template-columns: none !important;
    padding: 0 !important;
  }
}

/* 全局样式 */
html, body {
  margin: 0 !important;
  padding: 0 !important;
  background-color: #000 !important;
  color: #fff !important;
  min-height: 100vh !important;
  width: 100% !important;
  /* 不再设置overflow-x */
  /* overflow-x: hidden !important; */
}
</style>
