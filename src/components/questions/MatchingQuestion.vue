<template>
  <div class="question-component">
    <div class="question-instruction">
      <p>Complete the text below by choosing the correct option from the box.</p>
      <p>Drag each option into the correct gap in the passage.</p>
    </div>
    
    <!-- Paragraph with gaps -->
    <div class="passage-container">
      <h3 class="passage-title">{{ passageTitle || title }}</h3>
      <div class="passage-content">
        <template v-for="(part, index) in parsedPassage" :key="index">
          <span v-if="part.type === 'text'">{{ part.content }}</span>
          <div 
            v-else-if="part.type === 'gap'"
            class="gap-container"
            :class="{ 
              'filled': getUserAnswer(part.id) !== '',
              'correct-answer': isFinished && isCorrectForGap(part.id),
              'wrong-answer': isFinished && isWrongForGap(part.id)
            }"
            @dragover.prevent
            @drop="onDrop($event, part.id)"
          >
            <div v-if="getUserAnswer(part.id) !== ''" class="filled-answer">
              {{ getUserAnswer(part.id) }}
              <button v-if="!isFinished" class="remove-btn" @click="removeAnswer(part.id)">×</button>
            </div>
            <div v-else class="gap-placeholder">
              {{ part.id + 1 }}
            </div>
            <div v-if="isFinished && isWrongForGap(part.id)" class="correct-answer-tooltip">
              正确答案: {{ getCorrectAnswer(part.id) }}
            </div>
          </div>
        </template>
      </div>
    </div>
    
    <!-- Options box -->
    <div class="options-box">
      <div 
        v-for="option in availableOptions" 
        :key="option"
        class="option-item"
        :draggable="!isFinished"
        @dragstart="onDragStart($event, option)"
      >
        {{ option }}
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
  passageTitle: {
    type: String,
    default: ""
  },
  title: {
    type: String,
    default: ""
  },
  passage: {
    type: String,
    default: ""
  },
  text: {
    type: String,
    default: ""
  },
  passageParts: {
    type: Array,
    default: () => []
  },
  options: {
    type: Array,
    default: () => []
  },
  words: {
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

// 获取问题数据
const questionData = computed(() => {
  if (props.questions && props.questions.length > 0) {
    return props.questions[0]; // 匹配题通常只有一个问题对象
  }
  return null;
});

// 获取答案列表
const answerList = computed(() => {
  if (questionData.value && questionData.value.answer) {
    return questionData.value.answer;
  }
  return [];
});

// 获取单词列表
const wordsList = computed(() => {
  if (questionData.value && questionData.value.words) {
    return questionData.value.words;
  }
  return [];
});

// 从路由参数中提取文章ID
const extractArticleId = (id) => {
  // 如果ID格式为 "essay-2-1"，提取数字部分
  if (id.startsWith('essay-')) {
    return id.substring(6); // 返回 "2-1" 或其他ID
  }
  return id; // 如果没有前缀，直接返回
};

// 获取问题ID
const getQuestionId = () => {
  if (questionData.value) {
    return questionData.value.id;
  }
  return null;
};

// 解析文本，支持多种格式
const parsedPassage = computed(() => {
  // 优先使用questions中的数据
  if (questionData.value && questionData.value.text) {
    const passageText = questionData.value.text;
    const parts = [];
    const gapRegex = /\[GAP\]/g;
    let lastIndex = 0;
    let match;
    let gapCounter = 0;
    
    while ((match = gapRegex.exec(passageText)) !== null) {
      // 添加空缺前的文本
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: passageText.slice(lastIndex, match.index)
        });
      }
      
      // 添加空缺，使用递增计数器作为ID
      parts.push({
        type: 'gap',
        id: gapCounter
      });
      
      gapCounter++;
      lastIndex = match.index + match[0].length;
    }
    
    // 添加最后剩余的文本
    if (lastIndex < passageText.length) {
      parts.push({
        type: 'text',
        content: passageText.slice(lastIndex)
      });
    }
    
    return parts;
  }
  
  // 如果questions中没有数据，使用直接传入的数据
  const passageText = props.passage || props.text;
  if (passageText) {
    const parts = [];
    const gapRegex = /\[GAP\]/g;
    let lastIndex = 0;
    let match;
    let gapCounter = 0;
    
    while ((match = gapRegex.exec(passageText)) !== null) {
      // 添加空缺前的文本
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: passageText.slice(lastIndex, match.index)
        });
      }
      
      // 添加空缺，使用递增计数器作为ID
      parts.push({
        type: 'gap',
        id: gapCounter
      });
      
      gapCounter++;
      lastIndex = match.index + match[0].length;
    }
    
    // 添加最后剩余的文本
    if (lastIndex < passageText.length) {
      parts.push({
        type: 'text',
        content: passageText.slice(lastIndex)
      });
    }
    
    return parts;
  }
  
  // 向后兼容：使用旧格式（passageParts）
  if (props.passageParts && props.passageParts.length > 0) {
    const parts = [];
    props.passageParts.forEach((part, index) => {
      parts.push({
        type: 'text',
        content: part
      });
      
      // 在除最后一个元素外的每个元素后添加空缺
      if (index < props.passageParts.length - 1) {
        parts.push({
          type: 'gap',
          id: index
        });
      }
    });
    return parts;
  }
  
  return [];
});

// 获取用户答案
const getUserAnswer = (gapId) => {
  if (answerList.value && answerList.value[gapId]) {
    return answerList.value[gapId].user_answer || '';
  }
  return '';
};

// 获取可用选项
const availableOptions = computed(() => {
  // 获取所有可能的选项
  const allWords = wordsList.value;
  
  // 过滤出仍然可用的选项
  return allWords.filter(word => {
    // 检查该选项在答案中使用的次数
    const usedCount = answerList.value.filter(answer => 
      answer.user_answer === word
    ).length;
    
    // 检查该选项在所有选项中出现的次数
    const totalCount = allWords.filter(w => w === word).length;
    
    return usedCount < totalCount || props.isFinished;
  });
});

// 拖拽开始
const onDragStart = (event, option) => {
  if (props.isFinished) {
    event.preventDefault();
    return;
  }
  event.dataTransfer.setData("text/plain", option);
};

// 放置选项
const onDrop = async (event, gapId) => {
  if (props.isFinished) return; // 如果已完成，不允许修改
  
  const option = event.dataTransfer.getData("text/plain");
  
  // 检查选项是否可用
  if (!availableOptions.value.includes(option)) return;
  
  // 更新答案
  if (answerList.value && answerList.value[gapId]) {
    answerList.value[gapId].user_answer = option;
  }
  
  // 构建要提交的用户答案数组
  const userAnswersArray = answerList.value.map(answer => answer.user_answer || '');
  
  // 直接提交到API
  try {
    const articleId = extractArticleId(route.params.id);
    const questionId = getQuestionId();
    if (questionId) {
      await submitSingleAnswer({
        article_id: articleId,
        type: "matching",
        question_id: questionId,
        user_answer: userAnswersArray
      });
      console.log(`已提交单词匹配题答案:`, userAnswersArray);
    }
  } catch (error) {
    console.error('提交单词匹配题答案失败:', error);
  }
  
  // 同时发送更新事件给父组件
  emit('update:answers', userAnswersArray);
};

// 移除已放置的答案
const removeAnswer = async (gapId) => {
  if (props.isFinished) return; // 如果已完成，不允许修改
  
  // 更新答案
  if (answerList.value && answerList.value[gapId]) {
    delete answerList.value[gapId].user_answer;
  }
  
  // 构建要提交的用户答案数组
  const userAnswersArray = answerList.value.map(answer => answer.user_answer || '');
  
  // 直接提交到API
  try {
    const articleId = extractArticleId(route.params.id);
    const questionId = getQuestionId();
    if (questionId) {
      await submitSingleAnswer({
        article_id: articleId,
        type: "matching",
        question_id: questionId,
        user_answer: userAnswersArray
      });
      console.log(`已提交单词匹配题答案(移除):`, userAnswersArray);
    }
  } catch (error) {
    console.error('提交单词匹配题答案失败:', error);
  }
  
  // 同时发送更新事件给父组件
  emit('update:answers', userAnswersArray);
};

// 检查特定空格的答案是否正确
const isCorrectForGap = (gapId) => {
  if (answerList.value && answerList.value[gapId]) {
    return answerList.value[gapId].is_correct === true;
  }
  return false;
};

// 检查特定空格的答案是否错误
const isWrongForGap = (gapId) => {
  if (answerList.value && answerList.value[gapId]) {
    // 如果明确标记为错误
    if (answerList.value[gapId].is_correct === false) return true;
    
    // 如果有用户答案但没有is_correct字段，检查与正确答案是否一致
    if (answerList.value[gapId].user_answer && answerList.value[gapId].is_correct === undefined) {
      return answerList.value[gapId].user_answer !== answerList.value[gapId].correct_answer;
    }
  }
  return false;
};

// 获取正确答案
const getCorrectAnswer = (gapId) => {
  if (answerList.value && answerList.value[gapId]) {
    return answerList.value[gapId].correct_answer || '';
  }
  return '';
};
</script>

<style scoped>
.question-component {
  @apply py-2;
}

.question-instruction {
  @apply bg-[#f8f9fa] rounded-lg p-4 mb-6 text-[0.95rem];
}

.passage-container {
  @apply mb-8;
}

.passage-title {
  @apply text-center mb-6 text-xl font-semibold;
}

.passage-content {
  @apply text-base leading-relaxed flex flex-wrap items-center;
}

.gap-container {
  @apply inline-flex min-w-[120px] h-9 border border-dashed border-[#888] rounded mx-1 my-1 items-center justify-center bg-[#f9f9f9] relative;
}

.gap-container.filled {
  @apply border border-solid border-[#4A99E9] bg-[rgba(74,153,233,0.1)];
}

.gap-container.correct-answer {
  @apply border border-solid border-[#4caf50] bg-[rgba(76,175,80,0.1)];
}

.gap-container.wrong-answer {
  @apply border border-solid border-[#f44336] bg-[rgba(244,67,54,0.1)];
}

.gap-placeholder {
  @apply text-[#666] font-medium;
}

.filled-answer {
  @apply font-medium text-[#333] px-2.5 w-full h-full flex items-center justify-center relative;
}

.remove-btn {
  @apply absolute right-0.5 top-0.5 w-4 h-4 bg-white/80 border-none rounded-full text-sm flex items-center justify-center cursor-pointer text-[#666] opacity-0 transition-opacity duration-200;
}

.filled-answer:hover .remove-btn {
  @apply opacity-100;
}

.options-box {
  @apply flex flex-wrap gap-4 p-4 bg-[#f0f8ff] rounded-lg;
}

.option-item {
  @apply py-2 px-4 bg-white border border-[#ddd] rounded cursor-grab select-none shadow-sm transition-all duration-200;
}

.option-item:hover {
  @apply transform -translate-y-0.5 shadow-md;
}

.option-item:active {
  @apply cursor-grabbing;
}

.correct-answer-text {
  @apply absolute -bottom-6 left-0 text-xs text-[#4caf50] font-medium;
}

.correct-answer-tooltip {
  @apply absolute opacity-0 invisible bg-[#333] text-white text-xs rounded py-1 px-2 left-1/2 -translate-x-1/2 -top-8 whitespace-nowrap z-10;
  transition: opacity 0.3s, visibility 0.3s;
}

.correct-answer-tooltip::after {
  content: '';
  @apply absolute top-full left-1/2 -translate-x-1/2 border-4 border-solid border-transparent;
  border-top-color: #333;
}

.gap-container:hover .correct-answer-tooltip {
  @apply opacity-100 visible;
}
</style> 