/**
 * Token管理器
 * 负责token的存储、获取和清除
 */

// token在localStorage中的键名
const TOKEN_KEY = 'auth_token';

/**
 * 获取token
 * @returns {string|null} token
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * 设置token
 * @param {string} token 
 */
export const setToken = (token) => {
  if (!token) {
    removeToken();
    return;
  }
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * 移除token
 */
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * 检查是否有token
 * @returns {boolean}
 */
export const hasToken = () => {
  return !!getToken();
};