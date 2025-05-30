/**
 * 文章相关API
 * 基于文档中的API接口实现
 */
import { get, post } from '@/utils/http/index';

/**
 * 获取文章详情
 * @param {Number} articleId - 文章ID
 * @returns {Promise} 文章详情及对应的问题列表
 */
export const getArticleDetail = (articleId) => {
  return get('/article/detail', { article_id: articleId });
};

/**
 * 生成文章
 * 根据用户学习情况自动生成适合的英语阅读文章及对应练习题
 * @returns {Promise} 生成的文章及相关问题
 */
export const generateArticle = () => {
  return post('/article/generate');
};

/**
 * 获取文章列表
 * 获取当前用户的所有文章列表
 * @returns {Promise} 文章列表和总数
 */
export const getArticleList = () => {
  return get('/article/list');
};

/**
 * 更新文章完成状态
 * @param {Number} articleId - 文章ID
 * @param {Boolean} isFinished - 是否已完成学习
 * @returns {Promise} 更新后的状态
 */
export const updateArticleStatus = (articleId, isFinished) => {
  return post('/article/status', {
    article_id: articleId,
    is_finished: isFinished
  });
};

/**
 * 提交文章问题答案
 * @param {Number} articleId - 文章ID
 * @param {Array} answers - 用户回答的答案列表，格式为[{question_id: 问题ID, answer: 用户选择的答案索引}]
 * @returns {Promise} 评分结果
 */
export const submitArticleAnswers = (articleId, answers) => {
  return post('/article/submit', {
    article_id: articleId,
    answers: answers
  });
};