<template>
  <div class="questions-section" :style="{ width: width + '%' }">
    <!-- Dynamic Question Modules -->
    <div class="questions-modules">
      <component 
        v-for="(module, index) in questionModules"
        :key="index"
        :is="questionComponentMap[module.type]"
        v-bind="module.data"
        :initialAnswers="initialAnswers[module.type] || {}"
        @update:answers="answers => updateAnswers(module.type, answers)"
      ></component>
    </div>
    
    <!-- Submit Button -->
    <div class="submit-button-container">
      <button class="submit-button" @click="$emit('submit')">提交答案</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import TrueFalseQuestion from '../questions/TrueFalseQuestion.vue';
import MultipleChoiceQuestion from '../questions/MultipleChoiceQuestion.vue';
import FillInBlanksQuestion from '../questions/FillInBlanksQuestion.vue';
import MatchingQuestion from '../questions/MatchingQuestion.vue';
import ParagraphHeadingQuestion from '../questions/ParagraphHeadingQuestion.vue';
import SingleChoiceQuestion from '../questions/SingleChoiceQuestion.vue';

const props = defineProps({
  width: {
    type: Number,
    required: true
  },
  questionModules: {
    type: Array,
    required: true
  },
  initialAnswers: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update:answers', 'submit']);

// Map of component types to their corresponding component
const questionComponentMap = {
  'true-false': TrueFalseQuestion,
  'multiple-choice': MultipleChoiceQuestion,
  'fill-in-blanks': FillInBlanksQuestion,
  'matching': MatchingQuestion,
  'paragraph-heading': ParagraphHeadingQuestion,
  'single-choice': SingleChoiceQuestion,
};

// Handle answers update from any question component
const updateAnswers = (questionType, answers) => {
  emit('update:answers', { type: questionType, answers });
};
</script>

<style scoped>
.questions-section {
  background-color: #f8f9fa;
  color: #333;
  border-radius: 0 0.5rem 0.5rem 0;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  max-height: 100%;
  transition: width 0.2s ease;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

.questions-section::-webkit-scrollbar {
  width: 6px;
}

.questions-section::-webkit-scrollbar-track {
  background: transparent;
}

.questions-section::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.questions-modules {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  margin-bottom: 2rem;
}

/* Submit Button */
.submit-button-container {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}

.submit-button {
  background: linear-gradient(90deg, #4A99E9, #5C2797);
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  min-width: 180px;
}

.submit-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .questions-section {
    width: 100% !important;
    border-radius: 0 0 0.5rem 0.5rem;
  }
}
</style>