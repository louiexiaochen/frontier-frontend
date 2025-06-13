<template>
  <div class="question-component">
    <div class="question-instruction">
      <p>Choose the correct letter, A, B, C or D.</p>
      <p>Select only ONE answer for each question.</p>
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
          <div class="options-list">
            <div 
              v-for="(option, optIndex) in question.options" 
              :key="optIndex" 
              class="option-item"
              :class="{ 
                'selected': selectedAnswers[question.id] === optIndex,
                'correct-option': isFinished && question.is_correct === true && selectedAnswers[question.id] === optIndex,
                'wrong-option': isFinished && question.is_correct === false && selectedAnswers[question.id] === optIndex
              }"
              @click="selectAnswer(question.id, optIndex)"
            >
              <div class="option-label">{{ ['A', 'B', 'C', 'D'][optIndex] }}</div>
              <div class="option-text">{{ option }}</div>
              <div v-if="selectedAnswers[question.id] === optIndex" class="check-icon">✓</div>
            </div>
          </div>
          <div v-if="isFinished && question.is_correct !== undefined" class="answer-feedback">
            <div v-if="question.is_correct" class="correct-feedback">
              ✓ 正确
            </div>
            <div v-else class="wrong-feedback">
              ✗ 错误 (正确答案: {{ ['A', 'B', 'C', 'D'][question.correctAnswer] }})
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
  console.log('SingleChoiceQuestion - 从问题数据中提取的用户答案:', selectedAnswers.value);
});

// 从路由参数中提取文章ID
const extractArticleId = (id) => {
  // 如果ID格式为 "essay-2-1"，提取数字部分
  if (id.startsWith('essay-')) {
    return id.substring(6); // 返回 "2-1" 或其他ID
  }
  return id; // 如果没有前缀，直接返回
};

// Select an answer for a question
const selectAnswer = async (questionId, optionIndex) => {
  // 如果已完成，不允许再选择答案
  if (props.isFinished) return;
  
  selectedAnswers.value[questionId] = optionIndex;
  
  // 直接提交到API
  try {
    const articleId = extractArticleId(route.params.id);
    await submitSingleAnswer({
      article_id: articleId,
      type: "single_choice",
      question_id: questionId,
      user_answer: optionIndex
    });
    console.log(`已提交单选题答案: ${questionId} = ${optionIndex}`);
  } catch (error) {
    console.error('提交单选题答案失败:', error);
  }
  
  // 同时发送更新事件给父组件（可选）
  emit('update:answers', selectedAnswers.value);
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
  @apply text-base mb-3 leading-relaxed;
}

.options-list {
  @apply flex flex-col gap-2;
}

.option-item {
  @apply flex items-center gap-2 p-3 rounded cursor-pointer transition-all duration-200 border border-transparent relative;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.option-item:hover {
  @apply bg-[#f5f5f5];
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.option-item.selected {
  @apply bg-[rgba(74,153,233,0.15)] border-[#4A99E9];
}

.option-item.correct-option {
  @apply bg-[rgba(76,175,80,0.15)] border-[#4caf50];
}

.option-item.wrong-option {
  @apply bg-[rgba(244,67,54,0.15)] border-[#f44336];
}

.option-label {
  @apply font-semibold min-w-6 h-6 w-6 flex items-center justify-center bg-[#4A99E9] text-white rounded-full text-sm;
}

.option-text {
  @apply flex-1;
}

.check-icon {
  @apply text-[#4A99E9] font-bold text-lg absolute right-3;
}

.answer-feedback {
  @apply mt-3 text-sm;
}

.correct-feedback {
  @apply text-[#4caf50] font-medium;
}

.wrong-feedback {
  @apply text-[#f44336] font-medium;
}
</style> 