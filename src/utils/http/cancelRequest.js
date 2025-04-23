/**
 * 请求取消管理器
 * 用于防止重复请求
 */
import axios from 'axios';

// 存储pending的请求
const pendingRequests = new Map();

/**
 * 生成请求的唯一key
 * @param {Object} config - axios请求配置
 * @returns {string} 请求的唯一标识
 */
const generateRequestKey = (config) => {
  const { url, method, params, data } = config;
  return [url, method, JSON.stringify(params), JSON.stringify(data)].join('&');
};

/**
 * 添加请求到pending列表
 * @param {Object} config - axios请求配置
 */
export const addPendingRequest = (config) => {
  // 如果配置了不需要取消重复请求，则直接返回
  if (config.noCancelRequest) {
    return;
  }
  
  const requestKey = generateRequestKey(config);
  
  // 如果已经有相同的请求在pending中，取消之前的请求
  if (pendingRequests.has(requestKey)) {
    const cancelToken = pendingRequests.get(requestKey);
    cancelToken.cancel(`重复的请求被取消: ${requestKey}`);
    pendingRequests.delete(requestKey);
  }
  
  // 创建新的取消令牌
  const source = axios.CancelToken.source();
  config.cancelToken = source.token;
  pendingRequests.set(requestKey, source);
};

/**
 * 从pending列表中移除请求
 * @param {Object} config - axios请求配置
 */
export const removePendingRequest = (config) => {
  if (config.noCancelRequest) {
    return;
  }
  
  const requestKey = generateRequestKey(config);
  if (pendingRequests.has(requestKey)) {
    pendingRequests.delete(requestKey);
  }
};

/**
 * 清除所有pending的请求
 */
export const clearPendingRequests = () => {
  for (const [, source] of pendingRequests) {
    source.cancel('请求被取消');
  }
  pendingRequests.clear();
};

/**
 * 判断是否为取消的请求错误
 * @param {Error} error - 错误对象
 * @returns {boolean} 是否为取消的请求
 */
export const isCancel = (error) => {
  return axios.isCancel(error);
};