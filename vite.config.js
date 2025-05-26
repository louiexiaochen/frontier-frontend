import { fileURLToPath, URL } from 'node:url'
import { performanceTrackerPlugin } from "./plugins/vite-plugin-performance-tracker";
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
// https://vite.dev/config/
export default defineConfig(({ command })=> {
  const isProd = command === 'build';
  return {
    // 根据环境动态设置基础路径
    // base: isProd ? 'https://mybox-1257251314.cos.ap-chengdu.myqcloud.com/www/test/aitest/' : '/',
    base: '/',
    plugins: [
      performanceTrackerPlugin({
        enabled: true, // 仅生产环境启用
        sampleRate: 0.1, // 10% 采样率
        endpoint: "https://your-backend.com/api/performance", // 自定义接口
      }),
      vue(),
      vueDevTools(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    server: {
      proxy: {
        '/api': {
          // target: "https://www.frontierx.cn/api/",
          target: "http://long.free.idcfengye.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
        // '/api': {
        //   target: "http://121.41.59.178:5000/api",
        //   changeOrigin: true,
        //   rewrite: (path) => path.replace(/^\/api/, '')
        // }
      },
      hmr: {
        overlay: false // 禁用错误覆盖层
      }
    },
    // 禁用Vite的开发状态指示器
    devtools: false
  }
})
