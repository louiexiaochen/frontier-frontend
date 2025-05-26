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
    // 检查响应是否成功 - 根据success字段和code字段判断
    // 成功情况：success为true 且 code以2开头（如200, 201等）
    if (res.code !=0 || res.success === false || (res.code && !String(res.code).startsWith('2') && res.code != 0)) {
      // 使用message组件显示错误信息
      message.error(res.message || '请求失败');
      // 返回完整响应，让业务代码决定如何处理
      return res;
    }
    // 如果有msg但没有message字段，使用msg字段
    
    // 成功情况下，可以显示成功消息（如果需要）
    if (res.message && response.config.showSuccessMessage) {
      message.success(res.message);
    }
    
    // 返回完整响应
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
      
      // 处理常见HTTP错误
      let errorMsg = '';
      switch (status) {
        case 401:
          errorMsg = '未授权，请重新登录';
          // 这里可以调用清除token的方法并跳转到登录页
          // removeToken();
          // router.push('/login');
          break;
        case 403:
          errorMsg = '拒绝访问';
          break;
        case 404:
          errorMsg = '请求的资源不存在';
          break;
        case 500:
          errorMsg = '服务器错误';
          break;
        default:
          errorMsg = `请求错误: ${status}`;
      }
      
      // 显示错误消息
      if (error.response.data && error.response.data.message) {
        message.error(error.response.data.message);
      } else {
        message.error(errorMsg);
      }
      
      console.log("响应拦截错误", error.response);
      
      // 返回错误响应数据，让业务代码决定如何处理
      return error.response.data;
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      const errorMsg = '网络错误，请检查您的网络连接';
      message.error(errorMsg);
      console.error(errorMsg);
    } else {
      // 请求配置有误
      const errorMsg = `请求配置错误: ${error.message}`;
      message.error(errorMsg);
      console.error(errorMsg);
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