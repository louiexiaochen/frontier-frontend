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
              :class="{ 'selected': selectedAnswers[question.id] === optIndex }"
              @click="selectAnswer(question.id, optIndex)"
            >
              <div class="option-label">{{ ['A', 'B', 'C', 'D'][optIndex] }}</div>
              <div class="option-text">{{ option }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  questions: {
    type: Array,
    required: true
  },
  initialAnswers: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['update:answers']);

// Initialize selectedAnswers from props or empty object
const selectedAnswers = ref({...props.initialAnswers});

// Select an answer for a question
const selectAnswer = (questionId, optionIndex) => {
  selectedAnswers.value[questionId] = optionIndex;
  emit('update:answers', selectedAnswers.value);
};
</script>

<style scoped>
.question-component {
  padding: 0.5rem 0;
}

.question-instruction {
  background-color: #f8f9fa;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.question-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.question-item {
  display: flex;
  gap: 0.75rem;
}

.question-number {
  font-size: 1rem;
  font-weight: 700;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  border-radius: 50%;
  flex-shrink: 0;
}

.question-content {
  flex: 1;
}

.question-text {
  font-size: 1rem;
  margin-bottom: 0.75rem;
  line-height: 1.4;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.option-item {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.2s;
  border: 1px solid transparent;
}

.option-item:hover {
  background-color: #f0f0f0;
}

.option-item.selected {
  background-color: rgba(74, 153, 233, 0.15);
  border-color: #4A99E9;
}

.option-label {
  font-weight: 600;
  min-width: 1.5rem;
}

.option-text {
  flex: 1;
}
</style> 