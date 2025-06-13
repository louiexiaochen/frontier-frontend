<template>
  <div class="question-component">
    <div class="question-instruction">
      <p>Choose <strong>TWO</strong> letters, A-E.</p>
      <p>Select your answers from the options below.</p>
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
                'selected': isOptionSelected(question.id, optIndex),
                'correct-option': isFinished && question.is_correct === true && isOptionSelected(question.id, optIndex),
                'wrong-option': isFinished && question.is_correct === false && isOptionSelected(question.id, optIndex)
              }"
              @click="toggleAnswer(question.id, optIndex)"
            >
              <div class="option-label">{{ ['A', 'B', 'C', 'D', 'E', 'F'][optIndex] }}</div>
              <div class="option-text">{{ option }}</div>
              <div v-if="isOptionSelected(question.id, optIndex)" class="check-icon">✓</div>
            </div>
          </div>
          <div v-if="isFinished && question.is_correct !== undefined" class="answer-feedback">
            <div v-if="question.is_correct" class="correct-feedback">
              ✓ 正确
            </div>
            <div v-else class="wrong-feedback">
              ✗ 错误 (正确答案: {{ formatCorrectAnswer(question.correctAnswer) }})
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed, onMounted } from 'vue';
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
  },
  maxSelections: {
    type: Number,
    default: 2
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
      // 确保答案是数组格式
      if (Array.isArray(question.user_answer)) {
        selectedAnswers.value[question.id] = question.user_answer;
      } else {
        // 如果不是数组，尝试解析或创建单元素数组
        try {
          const parsedAnswer = JSON.parse(question.user_answer);
          selectedAnswers.value[question.id] = Array.isArray(parsedAnswer) ? parsedAnswer : [question.user_answer];
        } catch (e) {
          selectedAnswers.value[question.id] = [question.user_answer];
        }
      }
    } else {
      // 初始化为空数组
      selectedAnswers.value[question.id] = [];
    }
  });
  console.log('MultipleChoiceQuestion - 从问题数据中提取的用户答案:', selectedAnswers.value);
});

// 从路由参数中提取文章ID
const extractArticleId = (id) => {
  // 如果ID格式为 "essay-2-1"，提取数字部分
  if (id.startsWith('essay-')) {
    return id.substring(6); // 返回 "2-1" 或其他ID
  }
  return id; // 如果没有前缀，直接返回
};

const isOptionSelected = (questionId, optionIndex) => {
  return selectedAnswers.value[questionId] && 
         selectedAnswers.value[questionId].includes(optionIndex);
};

const toggleAnswer = async (questionId, optionIndex) => {
  if (!selectedAnswers.value[questionId]) {
    selectedAnswers.value[questionId] = [];
  }
  
  const currentAnswers = [...selectedAnswers.value[questionId]];
  
  // If already selected, remove it
  if (currentAnswers.includes(optionIndex)) {
    const index = currentAnswers.indexOf(optionIndex);
    currentAnswers.splice(index, 1);
  } 
  // Otherwise add it if we haven't reached the max
  else if (currentAnswers.length < props.maxSelections) {
    currentAnswers.push(optionIndex);
  }
  
  // Update local state
  selectedAnswers.value[questionId] = currentAnswers;
  
  // 直接提交到API
  try {
    const articleId = extractArticleId(route.params.id);
    await submitSingleAnswer({
      article_id: articleId,
      type: "double_choice",
      question_id: questionId,
      user_answer: currentAnswers
    });
    console.log(`已提交多选题答案: ${questionId} = [${currentAnswers.join(', ')}]`);
  } catch (error) {
    console.error('提交多选题答案失败:', error);
  }
  
  // 同时发送更新事件给父组件（可选）
  emit('update:answers', selectedAnswers.value);
};

// 格式化正确答案显示
const formatCorrectAnswer = (correctAnswer) => {
  if (!correctAnswer) return '';
  
  // 如果是数组，格式化为字母选项
  if (Array.isArray(correctAnswer)) {
    return correctAnswer.map(idx => ['A', 'B', 'C', 'D', 'E', 'F'][idx]).join(', ');
  }
  
  // 尝试解析JSON字符串
  try {
    const parsed = JSON.parse(correctAnswer);
    if (Array.isArray(parsed)) {
      return parsed.map(idx => ['A', 'B', 'C', 'D', 'E', 'F'][idx]).join(', ');
    }
  } catch (e) {
    // 不是有效的JSON
  }
  
  // 如果是单个数字
  if (typeof correctAnswer === 'number') {
    return ['A', 'B', 'C', 'D', 'E', 'F'][correctAnswer];
  }
  
  return correctAnswer.toString();
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