/**
 * Token管理器
 * 负责token的存储、获取和清除
 */

// token在localStorage中的键名
const TOKEN_KEY = 'auth_token';

/**
 * 保存token到localStorage
 * @param {string} token - 认证token
 */
export const saveToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * 从localStorage获取token
 * @returns {string|null} 认证token或null
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * 清除localStorage中的token
 */
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * 检查是否有token
 * @returns {boolean} 是否存在token
 */
export const hasToken = () => {
  return !!getToken();
};