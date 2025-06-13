<template>
  <div class="question-component">
    <div class="question-instruction">
      <p>The reading passage has {{ paragraphs.length || 7 }} paragraphs, {{ paragraphLabels.join(', ') }}.</p>
      <p>Choose the paragraph that contains the following information.</p>
    </div>
    
    <!-- Table style layout -->
    <div class="table-container">
      <table class="matching-table">
        <thead>
          <tr>
            <th>Question</th>
            <th v-for="(paragraph, index) in paragraphLabels" :key="index" class="align-left">
              {{ paragraph }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(heading, headingIndex) in headings" :key="headingIndex">
            <td class="heading-description">
              {{ headingIndex + 1 }}. {{ heading.heading }}
            </td>
            <td v-for="(paragraph, paragraphIndex) in paragraphLabels" :key="paragraphIndex" class="option-cell">
              <label class="radio-container">
                <input 
                  type="radio" 
                  :name="'heading_' + headingIndex" 
                  :value="paragraphIndex + 1"
                  :checked="heading.user_answer === paragraphIndex + 1"
                  @change="updateAnswer(headingIndex, paragraphIndex + 1)"
                  :disabled="isFinished"
                />
                <span class="checkmark" :class="{
                  'correct-answer': isFinished && isCorrectForHeading(heading, paragraphIndex + 1),
                  'wrong-answer': isFinished && isWrongForHeading(heading, paragraphIndex + 1)
                }"></span>
              </label>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Paragraph Preview Section -->
    <div v-if="paragraphs && paragraphs.length > 0" class="paragraphs-preview">
      <h3 class="preview-title">Original Paragraphs:</h3>
      <div v-for="(paragraph, index) in paragraphs" :key="index" class="paragraph-item">
        <div class="paragraph-label">{{ paragraphLabels[index] }}</div>
        <div class="paragraph-text">
          {{ paragraph.content || paragraph.text || paragraph }}
          <!-- 显示哪些题目选择了这个段落 -->
          <div v-if="getQuestionsForParagraph(index + 1).length > 0" class="selected-questions">
            <div class="selected-heading-title">Selected information:</div>
            <div class="selected-heading-list">
              <div v-for="headingIndex in getQuestionsForParagraph(index + 1)" :key="headingIndex" class="selected-heading-item">
                <span class="selected-heading-number">{{ headingIndex + 1 }}.</span>
                <span class="selected-heading-text">{{ headings[headingIndex].heading }}</span>
                <span v-if="isFinished" class="selected-heading-status">
                  <span v-if="headings[headingIndex].is_correct" class="correct-status">(✓)</span>
                  <span v-else class="wrong-status">(✗)</span>
                </span>
              </div>
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
  paragraphs: {
    type: Array,
    default: () => []
  },
  isFinished: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:answers']);
const route = useRoute();

// 从questions中提取headings数据
const headings = computed(() => {
  if (props.questions && props.questions.length > 0) {
    const question = props.questions[0]; // 段落标题题通常只有一个问题对象
    if (question && question.answer) {
      return question.answer;
    }
  }
  return [];
});

// 获取问题ID
const getQuestionId = () => {
  if (props.questions && props.questions.length > 0) {
    return props.questions[0].id;
  }
  return null;
};

// 生成段落标签 (A, B, C, ...)
const paragraphLabels = computed(() => {
  const count = props.paragraphs.length || 7;
  return Array.from({ length: count }, (_, i) => 
    String.fromCharCode(65 + i) // A, B, C, ...
  );
});

// 从路由参数中提取文章ID
const extractArticleId = (id) => {
  // 如果ID格式为 "essay-2-1"，提取数字部分
  if (id.startsWith('essay-')) {
    return id.substring(6); // 返回 "2-1" 或其他ID
  }
  return id; // 如果没有前缀，直接返回
};

// 更新答案
const updateAnswer = async (headingIndex, paragraphNumber) => {
  // 更新答案
  const heading = headings.value[headingIndex];
  heading.user_answer = paragraphNumber;
  
  // 构建要提交的用户答案数组
  const userAnswersArray = headings.value.map(h => h.user_answer || 0);
  console.log('提交的答案数组:', userAnswersArray);
  
  // 直接提交到API
  try {
    const articleId = extractArticleId(route.params.id);
    const questionId = getQuestionId();
    if (questionId) {
      const params = {
        article_id: articleId,
        type: "paragraph_heading",
        question_id: questionId,
        user_answer: userAnswersArray
      }
      await submitSingleAnswer(params);
      console.log(`已提交段落标题题答案:`, userAnswersArray);
    }
  } catch (error) {
    console.error('提交段落标题题答案失败:', error);
  }
  
  // 同时发送更新事件给父组件
  emit('update:answers', userAnswersArray);
};

// 获取选择了特定段落的所有题目索引
const getQuestionsForParagraph = (paragraphNumber) => {
  const questionIndices = [];
  
  // 遍历所有答案，找出选择了该段落的题目索引
  headings.value.forEach((heading, headingIndex) => {
    if (heading.user_answer === paragraphNumber) {
      questionIndices.push(headingIndex);
    }
  });
  
  return questionIndices;
};

// 检查特定段落是否是某个标题的正确答案
const isCorrectForHeading = (heading, paragraphNumber) => {
  return heading.correct_answer === paragraphNumber;
};

// 检查用户选择的答案是否错误
const isWrongForHeading = (heading, paragraphNumber) => {
  return heading.user_answer === paragraphNumber && heading.user_answer !== heading.correct_answer;
};
</script>

<style scoped>
.question-component {
  @apply py-2;
}

.question-instruction {
  @apply bg-[#f8f9fa] rounded-lg p-4 mb-6 text-[0.95rem];
}

.table-container {
  @apply overflow-x-auto mb-8;
}

.matching-table {
  @apply w-full border-collapse border border-[#ddd];
}

.matching-table th,
.matching-table td {
  @apply border border-[#ddd] p-3 text-left;
}

.matching-table th {
  @apply bg-[#f9f9fa] font-semibold;
}

.matching-table th:first-child {
  @apply text-left w-3/5;
}

.matching-table th:not(:first-child) {
  @apply w-10;
}

.heading-description {
  @apply text-[0.95rem] leading-relaxed text-left;
}

.option-cell {
  @apply text-center;
}

/* Paragraph Preview Section */
.paragraphs-preview {
  @apply mt-8 flex flex-col gap-4 border border-[#ddd] rounded-lg p-4 bg-white;
}

.preview-title {
  @apply text-lg font-semibold mb-4 text-[#333] border-b border-[#eee] pb-2;
}

.paragraph-item {
  @apply flex gap-4 p-3 bg-[#f9f9fa] rounded-lg mb-2;
}

.paragraph-label {
  @apply font-bold min-w-6 text-[#4A99E9];
}

.paragraph-text {
  @apply text-[0.95rem] leading-relaxed flex-1;
}

.selected-questions {
  @apply mt-2 text-sm text-[#4A99E9] italic;
}

.selected-heading-title {
  @apply font-semibold mb-2;
}

.selected-heading-list {
  @apply flex flex-col gap-1 mt-1;
}

.selected-heading-item {
  @apply flex gap-2 items-start leading-snug;
}

.selected-heading-number {
  @apply font-semibold min-w-6;
}

.selected-heading-text {
  @apply flex-1;
}

.selected-heading-status {
  @apply ml-2;
}

.correct-status {
  @apply text-[#4caf50] font-medium;
}

.wrong-status {
  @apply text-[#f44336] font-medium;
}

.align-left {
  @apply text-left !important;
}

/* Custom radio buttons */
.radio-container {
  @apply inline-block relative cursor-pointer text-base select-none w-5 h-5;
}

.radio-container input {
  @apply absolute opacity-0 cursor-pointer h-0 w-0;
}

.checkmark {
  @apply absolute top-0 left-0 h-5 w-5 bg-white border border-[#ddd] rounded-full;
  transition: all 0.2s ease;
}

.radio-container:hover input ~ .checkmark {
  @apply bg-[#f0f0f0];
}

.radio-container input:checked ~ .checkmark {
  @apply bg-[#4A99E9] border-[#4A99E9];
}

.checkmark:after {
  content: "";
  @apply absolute hidden;
}

.radio-container input:checked ~ .checkmark:after {
  @apply hidden;
}

.radio-container .checkmark:after {
  @apply top-[5px] left-[5px] w-[10px] h-[10px] rounded-full bg-[#4A99E9];
}

/* 正确和错误答案的样式 */
.checkmark.correct-answer {
  @apply bg-[#4caf50] border-[#4caf50];
}

.checkmark.wrong-answer {
  @apply bg-[#f44336] border-[#f44336];
}
</style> 