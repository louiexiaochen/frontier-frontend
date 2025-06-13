/**
 * 防抖函数
 * @param {Function} fn - 需要防抖的函数
 * @param {Number} delay - 延迟时间，单位毫秒
 * @returns {Function} - 防抖后的函数
 */
export const debounce = (fn, delay = 300) => {
  let timer = null;
  
  return function(...args) {
    if (timer) clearTimeout(timer);
    
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};

/**
 * 节流函数
 * @param {Function} fn - 需要节流的函数
 * @param {Number} delay - 延迟时间，单位毫秒
 * @returns {Function} - 节流后的函数
 */
export const throttle = (fn, delay = 300) => {
  let lastCall = 0;
  
  return function(...args) {
    const now = Date.now();
    
    if (now - lastCall >= delay) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}; 