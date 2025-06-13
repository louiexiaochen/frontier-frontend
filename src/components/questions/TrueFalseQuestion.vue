<template>
  <div class="question-component">
    <div class="question-instruction">
      <p>Do the following statements agree with the information given in the passage?</p>
      <p>In boxes 1-6 on your answer sheet, write</p>
      <p><strong>TRUE</strong> if the statement agrees with the information</p>
      <p><strong>FALSE</strong> if the statement contradicts the information</p>
      <p><strong>NOT GIVEN</strong> if there is no information on this</p>
    </div>
    
    <div class="question-list">
      <div 
        v-for="(question, index) in questions" 
        :key="index" 
        class="question-item"
      >
        <div class="question-number">{{ index + 1 }}</div>
        <div class="question-content">
          <div class="question-text">{{ question.text }}</div>
          <div class="answer-options">
            <label 
              v-for="option in options" 
              :key="option.value" 
              class="answer-option"
              :class="{ 
                'selected': selectedAnswers[question.id] === option.text,
                'correct-answer': isFinished && option.text === getTextAnswer(question.correctAnswer),
                'wrong-answer': isFinished && selectedAnswers[question.id] === option.text && option.text !== getTextAnswer(question.correctAnswer)
              }"
            >
              <input 
                type="radio" 
                :name="'question-' + question.id" 
                :value="option.text"
                v-model="selectedAnswers[question.id]"
                @change="handleChange(question.id, option)"
                :disabled="isFinished"
                class="radio-input"
              />
              <span class="radio-custom"></span>
              <span class="option-text">{{ option.text }}</span>
              <span v-if="isFinished && option.text === getTextAnswer(question.correctAnswer)" class="correct-indicator">✓</span>
            </label>
          </div>
          <div v-if="isFinished && selectedAnswers[question.id] !== getTextAnswer(question.correctAnswer)" class="answer-feedback">
            <div class="wrong-feedback">
              ✗ 错误 
            </div>
          </div>
          <div v-else-if="isFinished && selectedAnswers[question.id] === getTextAnswer(question.correctAnswer)" class="answer-feedback">
            <div class="correct-feedback">
              ✓ 正确
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted, watch } from 'vue';
import { submitSingleAnswer } from '@/api/answer';
import { useRoute } from 'vue-router';

const props = defineProps({
  questions: {
    type: Array,
    required: true
  },
  isFinished: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:answers']);
const route = useRoute();

// 定义选项
const options = [
  { text: 'TRUE', value: 2 },
  { text: 'FALSE', value: 3 },
  { text: 'NOT GIVEN', value: 1 }
];

// 将数字答案转换为文本格式
const getTextAnswer = (numericAnswer) => {
  if (numericAnswer === 2) return 'TRUE';
  if (numericAnswer === 3) return 'FALSE';
  if (numericAnswer === 1) return 'NOT GIVEN';
  return '';
};

// 获取正确答案的文本表示
const getCorrectAnswerText = (correctAnswer) => {
  return getTextAnswer(correctAnswer);
};

// 初始化答案对象
const selectedAnswers = ref({});

// 监听props.questions的变化，更新selectedAnswers
watch(() => props.questions, (newQuestions) => {
  if (newQuestions) {
    newQuestions.forEach(question => {
      if (question.user_answer !== undefined) {
        selectedAnswers.value[question.id] = getTextAnswer(question.user_answer);
      }
    });
  }
}, { deep: true, immediate: true });

// 组件挂载时从问题数据中提取用户答案
onMounted(() => {
  // 从问题数据中提取用户答案
  props.questions.forEach(question => {
    if (question.user_answer !== undefined) {
      // 将数字答案转换为文本格式
      selectedAnswers.value[question.id] = getTextAnswer(question.user_answer);
    }
  });
  console.log('TrueFalseQuestion - 从问题数据中提取的用户答案:', selectedAnswers.value);
});

// 从路由参数中提取文章ID
const extractArticleId = (id) => {
  // 如果ID格式为 "essay-2-1"，提取数字部分
  if (id.startsWith('essay-')) {
    return id.substring(6); // 返回 "2-1" 或其他ID
  }
  return id; // 如果没有前缀，直接返回
};

// 处理选项变更
const handleChange = async (questionId, option) => {
  // 如果已完成，不允许再选择答案
  if (props.isFinished) return;
  
  // 更新本地状态
  selectedAnswers.value[questionId] = option.text;
  
  // 直接提交到API
  try {
    const articleId = extractArticleId(route.params.id);
    await submitSingleAnswer({
      article_id: articleId,
      type: "true_false",
      question_id: questionId,
      user_answer: option.value // 提交数字值
    });
    console.log(`已提交判断题答案: ${questionId} = ${option.text}(${option.value})`);
  } catch (error) {
    console.error('提交判断题答案失败:', error);
  }
  
  // 同时发送更新事件给父组件（可选）
  emit('update:answers', {
    ...selectedAnswers.value,
    [`${questionId}_numeric`]: option.value
  });
};
</script>

<style scoped>
.question-component {
  @apply py-2;
  min-height: 100px; /* 确保组件有最小高度 */
}

.question-instruction {
  @apply bg-[#f8f9fa] rounded-lg p-4 mb-6 text-[0.95rem];
}

.question-list {
  @apply flex flex-col gap-6;
}

.question-item {
  @apply flex gap-3;
  min-height: 40px; /* 确保每个问题项有最小高度 */
}

.question-number {
  @apply text-base font-bold w-6 h-6 flex items-center justify-center bg-[#f0f0f0] rounded-full flex-shrink-0;
}

.question-content {
  @apply flex-1;
}

.question-text {
  @apply text-base mb-3 leading-relaxed;
}

.answer-options {
  @apply flex flex-wrap gap-2;
  min-height: 40px; /* 确保选项区域有最小高度 */
}

.answer-option {
  @apply flex items-center py-2 px-4 rounded cursor-pointer transition-all duration-200 border border-transparent relative;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  height: 40px; /* 固定选项高度 */
}

.answer-option:hover {
  @apply bg-[#f5f5f5];
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.answer-option.selected {
  @apply bg-[rgba(74,153,233,0.15)] border-[#4A99E9] text-[#4A99E9] font-semibold;
}

.answer-option.correct-answer {
  @apply bg-[rgba(76,175,80,0.15)] border-[#4caf50] text-[#4caf50] font-semibold;
}

.answer-option.wrong-answer {
  @apply bg-[rgba(244,67,54,0.15)] border-[#f44336] text-[#f44336] font-semibold;
}

.radio-input {
  @apply absolute opacity-0;
}

.radio-custom {
  @apply inline-block w-4 h-4 rounded-full border-2 border-solid border-[#ccc] mr-2 relative;
  transition: all 0.2s ease;
}

.selected .radio-custom {
  @apply border-[#4A99E9];
}

.selected .radio-custom::after {
  content: '';
  @apply absolute w-2 h-2 rounded-full bg-[#4A99E9] top-1/2 left-1/2;
  transform: translate(-50%, -50%);
}

.option-text {
  @apply text-sm;
}

.answer-feedback {
  @apply mt-3 text-sm font-medium;
}

.correct-feedback {
  @apply text-[#4caf50] flex items-center gap-1 bg-[rgba(76,175,80,0.1)] py-1 px-3 rounded-md inline-block;
}

.wrong-feedback {
  @apply text-[#f44336] flex items-center gap-1 bg-[rgba(244,67,54,0.1)] py-1 px-3 rounded-md inline-block;
}

.correct-indicator {
  @apply ml-2 text-[#4caf50] font-bold;
}

.correct-answer-tooltip {
  @apply absolute opacity-0 invisible bg-[#333] text-white text-xs rounded py-1 px-2 left-1/2 -translate-x-1/2 -top-8 whitespace-nowrap;
  transition: opacity 0.3s, visibility 0.3s;
}

.correct-answer-tooltip::after {
  content: '';
  @apply absolute top-full left-1/2 -translate-x-1/2 border-4 border-solid border-transparent;
  border-top-color: #333;
}

.answer-option:hover .correct-answer-tooltip {
  @apply opacity-100 visible;
}
</style> 