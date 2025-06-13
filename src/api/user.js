/**
 * 用户相关API
 */
import { get, post } from '@/utils/http/index';
import { setToken, removeToken } from '@/utils/http/tokenManager';

/**
 * 用户注册
 * @param {Object} data - 注册信息 {username, email, password, code}
 * @returns {Promise} 注册结果
 */
export const register = async (data) => {
  const response = await post('/user/register', data);
  // 适配新的响应格式，token在data字段中，code为0表示成功
  if (response && response.code === 0 && response.data && response.data.token) {
    setToken(response.data.token);
  }
  return response;
};

/**
 * 获取邮箱验证码
 * @param {Object} data - 邮箱信息 {email, t, type}
 * @returns {Promise} 发送结果
 */
export const getEmailCode = async (data) => {
  return await post('/user/code', data);
};

/**
 * 重置密码
 * @param {Object} data - 重置信息 {email, code, password}
 * @returns {Promise} 重置结果
 */
export const resetPassword = async (data) => {
  return await post('/user/reset', data);
};

/**
 * 用户登录
 * @param {Object} data - 登录信息 {username, password}
 * @returns {Promise} 登录结果
 */
export const login = async (data) => {
  const response = await post('/user/login', data);
  
  // 适配新的响应格式，token在data字段中，code为0表示成功
  if (response && response.code === 0 && response.data && response.data.token) {
    setToken(response.data.token);
  }
  return response;
};

/**
 * 用户登出
 * @returns {Promise} 登出结果
 */
export const logout = async () => {
  const response = await get('/user/logout');
  removeToken();
  return response;
};

/**
 * 获取当前用户信息
 * @returns {Promise} 用户信息
 */
export const getUserInfo = () => {
  return get('/user/info');
};

/**
 * 修改密码
 * @param {Object} data - 密码信息 {old_password, new_password}
 * @returns {Promise} 修改结果
 */
export const changePassword = (data) => {
  return post('/user/password', data);
};

/**
 * 更新用户资料
 * @param {Object} data - 用户资料
 * @returns {Promise} 更新结果
 */
export const updateProfile = (data) => {
  return post('/user/profile', data);
};