// vite-plugin-performance-tracker.js
export function performanceTrackerPlugin(options = {}) {
    // 默认配置
    const config = {
      enabled: true, // 是否启用埋点
      sampleRate: 1, // 采样率（0到1，1表示100%采样）
      endpoint: "https://example.com/api/performance", // 后端接口
      ...options,
    };
  
    return {
      name: "vite-plugin-performance-tracker",
      // 应用到生产构建和开发模式
      apply: "serve", // 改为"serve"使其在开发模式下生效，或删除此行使其在两种模式下都生效
  
      // 转换代码钩子
      transform(code, id) {
        if (!config.enabled) return null;
  
        // 只处理 JS/TS 文件，且排除 node_modules
        if (
          (id.endsWith(".js") || id.endsWith(".ts")) &&
          !id.includes("node_modules")
        ) {
          // 埋点代码模板（与 Webpack 版本一致，但适配 ESM）
          const trackerCode = `
            (function() {
              // 采样控制
              if (Math.random() > ${config.sampleRate}) return;
  
              // 性能数据收集
              const performanceData = {
                pageLoadTime: 0,
                firstContentfulPaint: 0,
                timestamp: Date.now(),
                url: window.location.href
              };
  
              // 监听 DOMContentLoaded
              document.addEventListener('DOMContentLoaded', () => {
                performanceData.pageLoadTime = performance.now();
              });
  
              // 监听首屏渲染（FCP）
              if (window.PerformanceObserver) {
                const observer = new PerformanceObserver((list) => {
                  list.getEntries().forEach(entry => {
                    if (entry.name === 'first-contentful-paint') {
                      performanceData.firstContentfulPaint = entry.startTime;
                      sendData();
                    }
                  });
                });
                observer.observe({ type: 'paint', buffered: true });
              }
  
              // 发送数据到后端
              function sendData() {
                console.log('性能追踪数据已收集:', performanceData);
                /*
               fetch('${config.endpoint}', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(performanceData),
                  keepalive: true
                }).catch(err => console.warn('Performance data send failed:', err));
                */
              }
            })();
          `;
  
          // 在代码开头插入埋点代码
          return {
            code: `${trackerCode}\n${code}`,
            map: null, // 可选：生成 source map
          };
        }
  
        return null;
      },
    };
  }