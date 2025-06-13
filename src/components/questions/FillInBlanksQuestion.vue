<template>
  <div class="question-component">
    <div class="question-instruction">
      <p>Complete the sentences below.</p>
      <p>Write <strong>NO MORE THAN TWO WORDS</strong> for each answer.</p>
    </div>
    
    <div class="question-list">
      <div 
        v-for="(question, index) in questions" 
        :key="index" 
        class="question-item"
      >
        <div class="question-number">{{ index + 1 }}</div>
        <div class="question-content">
          <div class="question-text">
            <template v-for="(part, partIndex) in splitQuestionByBlank(question.text)" :key="partIndex">
              <span class="text-part">{{ part }}</span>
              <span v-if="partIndex < splitQuestionByBlank(question.text).length - 1" class="input-container">
                <input 
                  type="text" 
                  class="inline-input"
                  v-model="selectedAnswers[question.id]"
                  @input="handleInput(question.id)"
                  @blur="handleBlur(question.id)"
                  :maxlength="question.maxLength || 30"
                  :class="{ 
                    'correct-answer': isFinished && question.is_correct === true, 
                    'wrong-answer': isFinished && question.is_correct === false 
                  }"
                />
              </span>
            </template>
          </div>
          <div v-if="isFinished && question.is_correct !== undefined" class="answer-feedback">
            <div v-if="question.is_correct" class="correct-feedback">
              ✓ 正确
            </div>
            <div v-else class="wrong-feedback">
              ✗ 错误 (正确答案: {{ question.correctAnswer }})
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted } from 'vue';
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

// 初始化答案对象
const selectedAnswers = ref({});

// 组件挂载时从问题数据中提取用户答案
onMounted(() => {
  // 从问题数据中提取用户答案
  props.questions.forEach(question => {
    if (question.user_answer !== undefined) {
      selectedAnswers.value[question.id] = question.user_answer;
    }
  });
  console.log('FillInBlanksQuestion - 从问题数据中提取的用户答案:', selectedAnswers.value);
});

// Split question text by [BLANK] placeholder
const splitQuestionByBlank = (text) => {
  return text.split('[BLANK]');
};

// 存储上一次输入的值，用于比较是否有变化
const previousAnswers = ref({});

// 输入时触发，但不立即提交
const handleInput = (questionId) => {
  // 不做任何操作，只在失焦时提交
};

// 从路由参数中提取文章ID
const extractArticleId = (id) => {
  // 如果ID格式为 "essay-2-1"，提取数字部分
  if (id.startsWith('essay-')) {
    return id.substring(6); // 返回 "2-1" 或其他ID
  }
  return id; // 如果没有前缀，直接返回
};

// 失焦时触发，提交答案
const handleBlur = async (questionId) => {
  const currentAnswer = selectedAnswers.value[questionId];
  // 如果答案为空或与上次相同，不提交
  if (currentAnswer === undefined || currentAnswer === previousAnswers.value[questionId]) {
    return;
  }
  
  // 更新上一次的答案
  previousAnswers.value[questionId] = currentAnswer;
  
  // 直接提交到API
  try {
    const articleId = extractArticleId(route.params.id);
    await submitSingleAnswer({
      article_id: articleId,
      type: "fill_in_blanks",
      question_id: questionId,
      user_answer: currentAnswer
    });
    console.log(`已提交填空题答案: ${questionId} = ${currentAnswer}`);
  } catch (error) {
    console.error('提交填空题答案失败:', error);
  }
  
  // 同时发送更新事件给父组件（可选）
  emit('update:answers', {...selectedAnswers.value});
};
</script>

<style scoped>
.question-component {
  @apply py-2;
}

.question-instruction {
  @apply bg-[#f8f9fa] rounded-lg p-4 mb-6 text-[0.95rem];
}

.question-list {
  @apply flex flex-col gap-6;
}

.question-item {
  @apply flex gap-3;
}

.question-number {
  @apply text-base font-bold w-6 h-6 flex items-center justify-center bg-[#f0f0f0] rounded-full flex-shrink-0;
}

.question-content {
  @apply flex-1;
}

.question-text {
  @apply text-base leading-relaxed;
}

.text-part {
  @apply inline;
}

.input-container {
  @apply inline-block align-middle;
}

.inline-input {
  @apply min-w-[100px] max-w-[150px] h-[30px] border-b-2 border-solid border-[#4A99E9] mx-1 px-2 text-base text-center bg-[rgba(74,153,233,0.1)] rounded;
  transition: all 0.3s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.inline-input:focus {
  @apply outline-none border-[#4A99E9] bg-[rgba(74,153,233,0.15)];
  box-shadow: 0 2px 4px rgba(74, 153, 233, 0.2);
}

.correct-answer {
  @apply border-[#4caf50] bg-[rgba(76,175,80,0.1)];
}

.wrong-answer {
  @apply border-[#f44336] bg-[rgba(244,67,54,0.1)];
}

.answer-feedback {
  @apply mt-2 text-sm;
}

.correct-feedback {
  @apply text-[#4caf50] font-medium;
}

.wrong-feedback {
  @apply text-[#f44336] font-medium;
}
</style> 