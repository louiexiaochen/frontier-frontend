/**
 * 答案处理工具函数
 */

/**
 * 格式化不同题型的答案
 * @param {String} type - 题目类型
 * @param {any} answer - 原始答案
 * @returns {any} - 格式化后的答案
 */
export const formatAnswer = (type, answer) => {
  switch(type) {
    case 'true_false':
      // 判断题：将TRUE/FALSE/NOT GIVEN转换为数字
      if (typeof answer === 'string') {
        if (answer === 'TRUE') return 1;
        if (answer === 'FALSE') return 0;
        if (answer === 'NOT GIVEN') return -1;
      }
      return answer;
      
    case 'single_choice':
      // 单选题：确保是数字
      return Number(answer);
      
    case 'double_choice':
      // 多选题：确保是数组
      if (!Array.isArray(answer)) {
        return Array.isArray(answer) ? answer : [answer];
      }
      return answer;
      
    case 'fill_in_blanks':
      // 填空题：确保是字符串
      return String(answer);
      
    case 'matching':
    case 'paragraph_heading':
      // 匹配题和段落标题题：确保是对象格式
      if (typeof answer !== 'object' || Array.isArray(answer)) {
        console.error(`${type}题目需要对象格式的答案`);
        return {};
      }
      return answer;
      
    default:
      return answer;
  }
};

/**
 * 标准化题型名称
 * @param {String} type - 原始题型名称
 * @returns {String} - 标准化后的题型名称
 */
export const normalizeQuestionType = (type) => {
  return type.replace('-', '_');
}; 