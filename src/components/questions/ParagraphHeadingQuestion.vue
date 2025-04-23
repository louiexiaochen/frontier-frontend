<template>
  <div class="question-component">
    <div class="question-instruction">
      <p>The reading passage has six paragraphs, A-F.</p>
      <p>Which paragraph contains the following information?</p>
    </div>
    
    <!-- Table style layout -->
    <div class="table-container">
      <table class="matching-table">
        <thead>
          <tr>
            <th>Column 1</th>
            <th v-for="letter in columnLetters" :key="letter">{{ letter }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(paragraph, index) in paragraphs" :key="index">
            <td class="paragraph-description">
              {{ index + paragraphStartNumber }}. {{ paragraph.preview }}
            </td>
            <td v-for="letter in columnLetters" :key="letter" class="option-cell">
              <label class="radio-container">
                <input 
                  type="radio" 
                  :name="'paragraph_' + paragraph.id" 
                  :value="letter"
                  :checked="selectedAnswers[paragraph.id] === letter"
                  @change="updateAnswer(paragraph.id, letter)"
                />
                <span class="checkmark"></span>
              </label>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed } from 'vue';

const props = defineProps({
  paragraphs: {
    type: Array,
    required: true
  },
  headings: {
    type: Array,
    required: true
  },
  initialAnswers: {
    type: Object,
    default: () => ({})
  },
  paragraphStartNumber: {
    type: Number,
    default: 14
  }
});

const emit = defineEmits(['update:answers']);

// Initialize selectedAnswers from props or empty object
const selectedAnswers = ref({...props.initialAnswers});

// Column letters for the table headers (A-F by default)
const columnLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

// Update answer and emit changes
const updateAnswer = (paragraphId, letter) => {
  selectedAnswers.value[paragraphId] = letter;
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

.table-container {
  overflow-x: auto;
}

.matching-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ddd;
}

.matching-table th,
.matching-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

.matching-table th {
  background-color: #f9f9f9;
  font-weight: 600;
  text-align: center;
}

.matching-table th:first-child {
  text-align: center;
  width: 60%;
}

.matching-table th:not(:first-child) {
  width: 6%;
}

.paragraph-description {
  font-size: 0.95rem;
  line-height: 1.4;
}

.option-cell {
  text-align: center;
}

/* Custom radio buttons */
.radio-container {
  display: inline-block;
  position: relative;
  cursor: pointer;
  font-size: 16px;
  user-select: none;
  width: 20px;
  height: 20px;
}

.radio-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 50%;
}

.radio-container:hover input ~ .checkmark {
  background-color: #f0f0f0;
}

.radio-container input:checked ~ .checkmark {
  background-color: #4A99E9;
  border: 1px solid #4A99E9;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.radio-container input:checked ~ .checkmark:after {
  display: none;
}

.radio-container .checkmark:after {
  top: 5px;
  left: 5px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #4A99E9;
}
</style> 