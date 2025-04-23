/**
 * 用户相关API
 */
import { get, post } from '@/utils/http';
import { saveToken, removeToken } from '@/utils/http/tokenManager';

/**
 * 用户注册
 * @param {Object} data - 注册信息 {username, email, password, level}
 * @returns {Promise} 注册结果
 */
export const register = async (data) => {
  const response = await post('/auth/register', data);
  if (response && response.token) {
    saveToken(response.token);
  }
  return response;
};

/**
 * 用户登录
 * @param {Object} data - 登录信息 {email, password}
 * @returns {Promise} 登录结果
 */
export const login = async (data) => {
  const response = await post('/auth/login', data);
  if (response && response.token) {
    saveToken(response.token);
  }
  return response;
};

/**
 * 用户登出
 * @returns {Promise} 登出结果
 */
export const logout = async () => {
  const response = await get('/auth/logout');
  removeToken();
  return response;
};

/**
 * 获取当前用户信息
 * @returns {Promise} 用户信息
 */
export const getUserInfo = () => {
  return get('/auth/me');
};