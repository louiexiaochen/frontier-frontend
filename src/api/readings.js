/**
 * 阅读材料相关API
 */
import { get, post, put, del } from '@/utils/http';

/**
 * 获取阅读材料列表
 * @param {Object} params - 查询参数 {page, limit, sort, order}
 * @returns {Promise} 阅读材料列表
 */
export const getReadings = (params = {}) => {
  return get('/readings', params);
};

/**
 * 获取单个阅读材料
 * @param {String} id - 阅读材料ID
 * @returns {Promise} 阅读材料详情
 */
export const getReading = (id) => {
  return get(`/readings/${id}`);
};

/**
 * 创建阅读材料（仅管理员可用）
 * @param {Object} data - 阅读材料信息 {title, content, level, category}
 * @returns {Promise} 创建结果
 */
export const createReading = (data) => {
  return post('/readings', data);
};

/**
 * 更新阅读材料（仅管理员可用）
 * @param {String} id - 阅读材料ID
 * @param {Object} data - 更新信息 {title, content, level, category}
 * @returns {Promise} 更新结果
 */
export const updateReading = (id, data) => {
  return put(`/readings/${id}`, data);
};

/**
 * 删除阅读材料（仅管理员可用）
 * @param {String} id - 阅读材料ID
 * @returns {Promise} 删除结果
 */
export const deleteReading = (id) => {
  return del(`/readings/${id}`);
};