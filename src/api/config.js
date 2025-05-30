/**
 * 配置相关API
 */
import { get } from '@/utils/http/index';

/**
 * 获取导航标签
 * @returns {Promise} 导航标签列表
 */
export const getNavTabs = () => {
  return get('/config/nav-tabs');
};

/**
 * 获取UI文本
 * @param {Object} params - 查询参数 {module}
 * @returns {Promise} UI文本配置
 */
export const getUITexts = (params = {}) => {
  return get('/config/ui-texts', params);
};

/**
 * 获取分类
 * @returns {Promise} 课程分类信息
 */
export const getCategories = () => {
  return get('/config/categories');
};