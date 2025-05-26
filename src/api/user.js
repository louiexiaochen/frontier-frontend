/**
 * 用户相关API
 */
import { get, post } from '@/utils/http';
import { saveToken, removeToken } from '@/utils/http/tokenManager';

/**
 * 用户注册
 * @param {Object} data - 注册信息 {username, email, password}
 * @returns {Promise} 注册结果
 */
export const register = async (data) => {
  const response = await post('/user/register', data);
  // 适配新的响应格式，token在data字段中，code为0表示成功
  if (response && response.code === 0 && response.data && response.data.token) {
    saveToken(response.data.token);
  }
  return response;
};

/**
 * 用户登录
 * @param {Object} data - 登录信息 {username, password}
 * @returns {Promise} 登录结果
 */
export const login = async (data) => {
  const response = await post('/user/login', data);
  console.log(response);
  
  // 适配新的响应格式，token在data字段中，code为0表示成功
  if (response && response.code === 0 && response.data && response.data.token) {
    saveToken(response.data.token);
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