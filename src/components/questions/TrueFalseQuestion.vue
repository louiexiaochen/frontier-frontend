<template>
  <div class="question-component">
    <div class="question-instruction">
      <p>Do the following statements agree with the information given in the passage?</p>
      <ul class="instruction-list">
        <li><strong>TRUE</strong> if the statement agrees with the information</li>
        <li><strong>FALSE</strong> if the statement contradicts the information</li>
        <li><strong>NOT GIVEN</strong> if there is no information on this</li>
      </ul>
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
          <div class="options-container">
            <div 
              v-for="option in ['TRUE', 'FALSE', 'NOT GIVEN']" 
              :key="option"
              class="option-btn"
              :class="{ 'selected': selectedAnswers[question.id] === option }"
              @click="selectAnswer(question.id, option)"
            >
              {{ option }}
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

const selectedAnswers = ref({...props.initialAnswers});

const selectAnswer = (questionId, option) => {
  selectedAnswers.value[questionId] = option;
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

.instruction-list {
  padding-left: 1.5rem;
  margin-top: 0.5rem;
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

.options-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.option-btn {
  padding: 0.5rem 0.75rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
  width: 100%;
  max-width: 200px;
  background-color: white;
  border: none;
}

.option-btn:hover {
  background-color: #f0f0f0;
}

.option-btn.selected {
  background-color: #4A99E9;
  color: white;
  font-weight: 600;
}
</style> 