/**
 * 答案提交相关API
 */
import { post } from '@/utils/http/index';

/**
 * 提交单个问题的答案
 * @param {String} articleId - 文章ID
 * @param {String} questionId - 问题ID
 * @param {String} type - 题目类型
 * @param {any} userAnswer - 用户答案，根据题型不同格式不同
 * @returns {Promise} 提交结果
 */
export const submitSingleAnswer = (params) => {
  return post('/article/submit', params);
};

/**
 * 提交单个题目的答案
 * @param {Object} params - 答案参数
 * @param {string} params.article_id - 文章ID
 * @param {string} params.type - 题目类型
 * @param {string} params.question_id - 题目ID
 * @param {any} params.user_answer - 用户答案
 * @returns {Promise} - 返回API请求的Promise
 */
export function submitSingleAnswerByParams(params) {
  return post('/article/submit', params);
}

/**
 * 提交单个题目的答案 - 简化版接口
 * @param {string} articleId - 文章ID
 * @param {string} questionId - 题目ID
 * @param {string} type - 题目类型
 * @param {any} userAnswer - 用户答案
 * @returns {Promise} - 返回API请求的Promise
 */
export function submitAnswer(articleId, questionId, type, userAnswer) {
  return post('/article/submit', {
    article_id: articleId,
    question_id: questionId,
    type: type,
    user_answer: userAnswer
  });
} 