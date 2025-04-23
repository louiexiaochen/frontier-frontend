/**
 * 词汇相关API
 */
import { get, post, put, del } from '@/utils/http';

/**
 * 获取词汇列表
 * @param {Object} params - 查询参数 {page, limit, sort, category, random}
 * @returns {Promise} 词汇列表
 */
export const getVocabularies = (params = {}) => {
  return get('/vocabularies', params);
};

/**
 * 获取随机词汇
 * @param {Number} count - 要获取的词汇数量
 * @returns {Promise} 随机词汇列表
 */
export const getRandomVocabularies = (count = 5) => {
  return get('/vocabularies/random', { count });
};

/**
 * 获取词汇分类
 * @returns {Promise} 词汇分类列表
 */
export const getVocabularyCategories = () => {
  return get('/vocabularies/categories');
};

/**
 * 获取单个词汇
 * @param {String} id - 词汇ID
 * @returns {Promise} 词汇详情
 */
export const getVocabulary = (id) => {
  return get(`/vocabularies/${id}`);
};

/**
 * 创建词汇（需要认证）
 * @param {Object} data - 词汇信息 {word, definition, translation, example, category}
 * @returns {Promise} 创建结果
 */
export const createVocabulary = (data) => {
  return post('/vocabularies', data);
};

/**
 * 更新词汇（需要认证）
 * @param {String} id - 词汇ID
 * @param {Object} data - 更新信息 {word, definition, translation, example, category}
 * @returns {Promise} 更新结果
 */
export const updateVocabulary = (id, data) => {
  return put(`/vocabularies/${id}`, data);
};

/**
 * 删除词汇（需要认证）
 * @param {String} id - 词汇ID
 * @returns {Promise} 删除结果
 */
export const deleteVocabulary = (id) => {
  return del(`/vocabularies/${id}`);
};