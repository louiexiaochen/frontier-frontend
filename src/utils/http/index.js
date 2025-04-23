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
    
    // 根据后端约定的数据结构处理响应
    const res = response.data;
    
    // 假设后端返回的数据结构为 { code: number, data: any, message: string }
    if (res.code !== 200 && res.code !== 0) {
      // 处理业务错误
      console.error(`请求错误: ${res.message || '未知错误'}`);
      return Promise.reject(new Error(res.message || '未知错误'));
    }
    
    return res.data;
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
      
      // 处理常见HTTP错误
      switch (status) {
        case 401:
          // 未授权，清除token并跳转到登录页
          console.error('未授权，请重新登录');
          // 这里可以调用清除token的方法并跳转到登录页
          // removeToken();
          // router.push('/login');
          break;
        case 403:
          console.error('拒绝访问');
          break;
        case 404:
          console.error('请求的资源不存在');
          break;
        case 500:
          console.error('服务器错误');
          break;
        default:
          console.error(`请求错误: ${status}`);
      }
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      console.error('网络错误，请检查您的网络连接');
    } else {
      // 请求配置有误
      console.error('请求配置错误:', error.message);
    }
    
    return Promise.reject(error);
  }
);

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