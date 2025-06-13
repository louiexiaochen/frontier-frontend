<template>
  <div class="questions-section" :style="{ width: width + '%' }">
    <div class="questions-container">
      <h2 class="section-title">问题</h2>
      
      <div class="questions-modules">
        <component 
          v-for="(module, index) in questionModules" 
          :key="index"
          :is="getQuestionComponent(module.type)"
          v-bind="module.data"
          :isFinished="isFinished"
          @update:answers="(answers) => handleAnswerUpdate(module.type, answers)"
        ></component>
      </div>
      
      <div class="submit-button-container" v-if="!isFinished">
        <button class="submit-button" @click="$emit('submit')">提交答案</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

// 导入问题组件
import SingleChoiceQuestion from '../questions/SingleChoiceQuestion.vue';
import MultipleChoiceQuestion from '../questions/MultipleChoiceQuestion.vue';
import TrueFalseQuestion from '../questions/TrueFalseQuestion.vue';
import FillInBlanksQuestion from '../questions/FillInBlanksQuestion.vue';
import MatchingQuestion from '../questions/MatchingQuestion.vue';
import ParagraphHeadingQuestion from '../questions/ParagraphHeadingQuestion.vue';

const props = defineProps({
  width: {
    type: Number,
    default: 50
  },
  questionModules: {
    type: Array,
    default: () => []
  },
  isFinished: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:answers', 'submit']);

// 根据题型获取对应组件
const getQuestionComponent = (type) => {
  const componentMap = {
    'single_choice': SingleChoiceQuestion,
    'multiple_choice': MultipleChoiceQuestion,
    'double_choice': MultipleChoiceQuestion,
    'true_false': TrueFalseQuestion,
    'fill_in_blanks': FillInBlanksQuestion,
    'matching': MatchingQuestion,
    'paragraph_heading': ParagraphHeadingQuestion
  };
  
  return componentMap[type];
};

// 处理答案更新
const handleAnswerUpdate = (type, answers) => {
  // 简化为仅向父组件传递答案更新事件
  emit('update:answers', { type, answers });
};
</script>

<style scoped>
.questions-section {
  @apply bg-[#f8f9fa] text-[#333] rounded-r-lg flex flex-col h-full overflow-hidden;
}

.questions-container {
  @apply p-8 flex flex-col h-full overflow-y-auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

.questions-container::-webkit-scrollbar {
  width: 6px;
}

.questions-container::-webkit-scrollbar-track {
  background: transparent;
}

.questions-container::-webkit-scrollbar-thumb {
  @apply bg-black/20 rounded;
}

.questions-modules {
  @apply flex flex-col gap-10 mb-8 flex-1;
}

.section-title {
  @apply text-2xl font-bold mb-6 text-white;
}

/* Submit Button */
.submit-button-container {
  @apply flex justify-center mt-6;
}

.submit-button {
  @apply bg-gradient-to-r from-[#4A99E9] to-[#5C2797] text-white border-none rounded-lg py-3 px-8 text-lg font-semibold cursor-pointer transition-all duration-300 shadow-md min-w-[180px];
}

.submit-button:hover {
  @apply transform -translate-y-0.5 shadow-lg;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .questions-section {
    @apply w-full rounded-b-lg rounded-t-none;
  }
}
</style>