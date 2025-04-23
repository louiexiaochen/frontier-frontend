import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
// https://vite.dev/config/
export default defineConfig(({ command })=> {
  const isProd = command === 'build';
  return {
    // 根据环境动态设置基础路径
    base: isProd ? 'https://mybox-1257251314.cos.ap-chengdu.myqcloud.com/www/test/aitest/' : '/',
    plugins: [
      vue(),
      vueDevTools(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    server: {
      hmr: {
        overlay: false // 禁用错误覆盖层
      }
    },
    // 禁用Vite的开发状态指示器
    devtools: false
  }
})
