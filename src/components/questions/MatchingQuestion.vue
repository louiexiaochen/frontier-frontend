<template>
  <div class="question-component">
    <div class="question-instruction">
      <p>Complete the text below by choosing the correct option from the box.</p>
      <p>Drag each option into the correct gap in the passage.</p>
    </div>
    
    <!-- Paragraph with gaps -->
    <div class="passage-container">
      <h3 class="passage-title">{{ passageTitle }}</h3>
      <div class="passage-content">
        <template v-for="(part, index) in passageParts" :key="index">
          <span>{{ part }}</span>
          <div 
            v-if="index < passageParts.length - 1"
            class="gap-container"
            :class="{ 'filled': selectedAnswers[index + 1] }"
            @dragover.prevent
            @drop="onDrop($event, index + 1)"
          >
            <div v-if="selectedAnswers[index + 1]" class="filled-answer">
              {{ selectedAnswers[index + 1] }}
              <button class="remove-btn" @click="removeAnswer(index + 1)">×</button>
            </div>
            <div v-else class="gap-placeholder">
              {{ index + 1 }}
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
        draggable="true"
        @dragstart="onDragStart($event, option)"
      >
        {{ option }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed } from 'vue';

const props = defineProps({
  passageTitle: {
    type: String,
    default: "The Future of Artificial Intelligence"
  },
  passageParts: {
    type: Array,
    required: true,
    default: () => [
      "Artificial Intelligence has evolved from a ",
      " research field to a transformative force across industries. In healthcare, AI can ",
      " medical data at unprecedented speeds, potentially leading to earlier disease detection. In education, AI creates ",
      " learning platforms that adapt to individual students' needs. The transportation industry is utilizing AI for ",
      " vehicles that could reduce accidents caused by human error. However, AI advancement raises ethical concerns about ",
      " and algorithmic bias. As AI systems become more sophisticated, ",
      " becomes increasingly important, especially in critical applications. Looking ahead, the development of ",
      " remains a long-term goal with profound implications for humanity."
    ]
  },
  options: {
    type: Array,
    required: true,
    default: () => [
      "A. niche",
      "B. analyze", 
      "C. personalized", 
      "D. autonomous",
      "E. data privacy",
      "F. transparency",
      "G. artificial general intelligence",
      "H. machine learning",
      "I. neural networks",
      "J. predictive analytics"
    ]
  },
  initialAnswers: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['update:answers']);

// Initialize selectedAnswers from props or convert to needed format
const selectedAnswers = ref({...props.initialAnswers});

// 计算未被选择的选项
const availableOptions = computed(() => {
  const selectedValues = Object.values(selectedAnswers.value);
  return props.options.filter(option => !selectedValues.includes(option));
});

// 拖拽开始
const onDragStart = (event, option) => {
  event.dataTransfer.setData("text/plain", option);
};

// 放置选项
const onDrop = (event, gapId) => {
  const option = event.dataTransfer.getData("text/plain");
  
  // 检查选项是否已被使用
  if (!availableOptions.value.includes(option)) return;
  
  // 检查这个空是否已有选项
  if (selectedAnswers.value[gapId]) {
    removeAnswer(gapId);
  }
  
  // 设置新答案
  selectedAnswers.value[gapId] = option;
  emit('update:answers', selectedAnswers.value);
};

// 移除已放置的答案
const removeAnswer = (gapId) => {
  delete selectedAnswers.value[gapId];
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

.passage-container {
  margin-bottom: 2rem;
}

.passage-title {
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.passage-content {
  font-size: 1rem;
  line-height: 1.8;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.gap-container {
  display: inline-flex;
  min-width: 120px;
  height: 36px;
  border: 1px dashed #888;
  border-radius: 4px;
  margin: 0 4px;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
  position: relative;
}

.gap-container.filled {
  border: 1px solid #4A99E9;
  background-color: rgba(74, 153, 233, 0.1);
}

.gap-placeholder {
  color: #666;
  font-weight: 500;
}

.filled-answer {
  font-weight: 500;
  color: #333;
  padding: 0 10px;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.remove-btn {
  position: absolute;
  right: 3px;
  top: 3px;
  width: 16px;
  height: 16px;
  background-color: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 50%;
  font-size: 14px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #666;
  opacity: 0;
  transition: opacity 0.2s;
}

.filled-answer:hover .remove-btn {
  opacity: 1;
}

.options-box {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1rem;
  background-color: #f0f8ff;
  border-radius: 0.5rem;
}

.option-item {
  padding: 0.5rem 1rem;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: grab;
  user-select: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}

.option-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.option-item:active {
  cursor: grabbing;
}
</style> 