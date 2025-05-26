/**
 * 用户进度相关API
 */
import { get, post, put } from '@/utils/http';

/**
 * 获取用户进度
 * @returns {Promise} 用户进度信息
 */
export const getUserProgress = () => {
  return get('/user/progress');
};

/**
 * 更新阅读进度
 * @param {String} id - 阅读材料ID
 * @param {Object} data - 进度信息 {completed, answers}
 * @returns {Promise} 更新结果
 */
export const updateReadingProgress = (id, data) => {
  return post(`/user/progress/reading/${id}`, data);
};

/**
 * 更新词汇学习进度
 * @param {String} id - 词汇课程ID
 * @param {Object} data - 进度信息 {newLearnedWords, completed}
 * @returns {Promise} 更新结果
 */
export const updateVocabularyProgress = (id, data) => {
  return post(`/user/progress/vocabulary/${id}`, data);
};

/**
 * 更新文章写作进度
 * @param {String} id - 文章ID
 * @param {Object} data - 进度信息 {completed, content}
 * @returns {Promise} 更新结果
 */
export const updateEssayProgress = (id, data) => {
  return post(`/user/progress/essay/${id}`, data);
};

/**
 * 获取用户统计数据
 * @returns {Promise} 用户统计数据
 */
export const getUserStatistics = () => {
  return get('/user/statistics');
};

/**
 * 更新用户资料
 * @param {Object} data - 用户资料 {username, email}
 * @returns {Promise} 更新结果
 */
export const updateUserProfile = (data) => {
  return put('/user/profile', data);
};

/**
 * 获取单元信息
 * @returns {Promise} 单元信息列表
 */
export const getUnits = () => {
  return get('/user/units');
};

/**
 * 获取课程列表
 * @param {Object} params - 查询参数 {unitId}
 * @returns {Promise} 课程列表
 */
export const getLessons = (params = {}) => {
  return get('/user/lessons', params);
};

/**
 * 获取课程详情
 * @param {String} id - 课程ID
 * @returns {Promise} 课程详情
 */
export const getLesson = (id) => {
  return get(`/user/lessons/${id}`);
};

/**
 * 获取课程进度
 * @param {String} id - 课程ID
 * @returns {Promise} 课程进度
 */
export const getLessonProgress = (id) => {
  return get(`/user/lessons/${id}/progress`);
};