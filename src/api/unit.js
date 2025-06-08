import { get, post, patch } from '@/utils/http/index';

/**
 * 获取所有学习单元列表
 * @returns {Promise} 返回所有学习单元列表和进度信息
 */
export const getAllUnits = () => {
  return get('/unit/list');
};

/**
 * 获取单元详情
 * @param {string} unitId - 单元ID
 * @returns {Promise} 返回单元详情和学习进度
 */
export const getUnitDetail = (unitId) => {
  return get('/unit/detail', { unit_id: String(unitId) });
};

/**
 * 获取单元单词列表
 * @param {string} unitId - 单元ID
 * @returns {Promise} 返回单元包含的所有单词
 */
export const getUnitWords = (unitId) => {
  return get('/unit/words', { unit_id: String(unitId) });
};

export const getCourseWords = (unitId) => {
  return get('/course/words', { unit_id: String(unitId) });
};

/**
 * 创建未学习单元的学习进度
 * @param {string} unitId - 单元ID
 * @returns {Promise}
 */
export const createUnitProgress = (unitId) => {
  return post('/course/progress', { unit_id: String(unitId) });
};

/**
 * 获取单元所有课程
 * @param {string} unitId - 单元ID
 * @returns {Promise} 返回单元的所有课程和学习进度
 */
export const getUnitCourses = (unitId) => {
  return get('/unit/course', { unit_id: unitId });
};

/**
 * 完成单元学习
 * @param {string} courseId - 课程ID
 * @returns {Promise}
 */
export const completeCourse = (courseId) => {
  return patch('/course/complete', { course_id: String(courseId) });
}; 


