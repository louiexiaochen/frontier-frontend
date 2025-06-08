/**
 * HTTP请求库
 * 基于Axios封装，提供统一的接口和错误处理
 */
import axios from 'axios';
import { getToken } from './tokenManager';
import { 
  addPendingRequest, 
  removePendingRequest, 
  isCancel 
} from './cancelRequest';
import message from '@/utils/message';
import { useUserStore } from '@/stores/user';
import { useModalStore } from '@/stores/modal';

// 创建axios实例
const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api', // 根据环境变量设置基础URL
  timeout: 15000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
});

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    // 添加token到请求头
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 处理重复请求
    addPendingRequest(config);
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
http.interceptors.response.use(
  (response) => {
    // 请求完成后，从pending列表中移除
    removePendingRequest(response.config);
    console.log("响应拦截", response.data);
    
    // 根据后端约定的数据结构处理响应
    const res = response.data;
    if (res.msg && !res.message) {
      res.message = res.msg;
    }

    // 处理token过期或未授权的情况
    if (res.code === 401 || res.code === 'TOKEN_EXPIRED') {
      handleUnauthorized(res.message);
      return Promise.reject(new Error(res.message || '登录已过期，请重新登录'));
    }
    // 处理401未授权错误
    if (res.code == 401) {
      handleUnauthorized(error.response.data?.message);
      return Promise.reject(error);
    }
    // 检查响应是否成功
    if (res.code != 0 || res.success === false || (res.code && !String(res.code).startsWith('2') && res.code != 0)) {
      message.error(res.message || '请求失败');
      return res;
    }
    
    // 成功情况下，可以显示成功消息（如果需要）
    if (res.message && response.config.showSuccessMessage) {
      message.success(res.message);
    }
    
    return res;
  },
  (error) => {
    // 如果是取消的请求，不做处理
    if (isCancel(error)) {
      console.log('请求被取消:', error.message);
      return Promise.reject(error);
    }
    
    // 请求已发出，但服务器响应的状态码不在 2xx 范围内
    if (error.response) {
      const { status } = error.response;
      
      // 移除已完成的请求
      if (error.config) {
        removePendingRequest(error.config);
      }
      
      // 处理401未授权错误
      if (status === 401) {
        handleUnauthorized(error.response.data?.message);
        return Promise.reject(error);
      }
      
      // 处理其他错误
      const errorMsg = error.response.data?.message || '请求失败';
      message.error(errorMsg);
      return Promise.reject(error);
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      message.error('网络错误，请检查您的网络连接');
    } else {
      // 请求配置有误
      message.error(`请求配置错误: ${error.message}`);
    }
    
    return Promise.reject(error);
  }
);

// 处理未授权的统一方法
const handleUnauthorized = (msg) => {
  const userStore = useUserStore();
  const modalStore = useModalStore();
  // 清除用户信息
  userStore.logout();
  // 显示登录模态框
  modalStore.openLoginModal();
  // 显示错误消息
  message.error(msg || '登录已过期，请重新登录');
};

/**
 * GET请求
 * @param {string} url - 请求地址
 * @param {Object} params - 请求参数
 * @param {Object} config - 额外配置
 * @returns {Promise} 请求Promise
 */
export const get = (url, params = {}, config = {}) => {
  return http.get(url, { params, ...config });
};

/**
 * POST请求
 * @param {string} url - 请求地址
 * @param {Object} data - 请求数据
 * @param {Object} config - 额外配置
 * @returns {Promise} 请求Promise
 */
export const post = (url, data = {}, config = {}) => {
  return http.post(url, data, config);
};

/**
 * PATCH请求
 * @param {string} url - 请求地址
 * @param {Object} data - 请求数据
 * @param {Object} config - 额外配置
 * @returns {Promise} 请求Promise
 */
export const patch = (url, data = {}, config = {}) => {
  return http.patch(url, data, config);
};

/**
 * PUT请求
 * @param {string} url - 请求地址
 * @param {Object} data - 请求数据
 * @param {Object} config - 额外配置
 * @returns {Promise} 请求Promise
 */
export const put = (url, data = {}, config = {}) => {
  return http.put(url, data, config);
};

/**
 * DELETE请求
 * @param {string} url - 请求地址
 * @param {Object} params - 请求参数
 * @param {Object} config - 额外配置
 * @returns {Promise} 请求Promise
 */
export const del = (url, params = {}, config = {}) => {
  return http.delete(url, { params, ...config });
};

// 导出http实例，以便可以直接使用其他方法
export default http;