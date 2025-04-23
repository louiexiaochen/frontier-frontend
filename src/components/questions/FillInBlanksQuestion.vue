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
            <span v-for="(part, partIndex) in splitQuestionByBlank(question.text)" :key="partIndex">
              {{ part }}
              <input 
                v-if="partIndex < splitQuestionByBlank(question.text).length - 1"
                type="text" 
                class="inline-input"
                v-model="selectedAnswers[question.id]"
                @input="updateAnswer(question.id)"
                :maxlength="question.maxLength || 30"
              />
            </span>
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

// Split question text by [BLANK] placeholder
const splitQuestionByBlank = (text) => {
  return text.split('[BLANK]');
};

// Update answer and emit changes
const updateAnswer = (questionId) => {
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
  line-height: 1.6;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.inline-input {
  min-width: 100px;
  max-width: 150px;
  height: 30px;
  border: none;
  border-bottom: 1px solid #333;
  margin: 0 4px;
  padding: 0 4px;
  font-size: 1rem;
  text-align: center;
  background-color: transparent;
}

.inline-input:focus {
  outline: none;
  border-color: #4A99E9;
}
</style> 