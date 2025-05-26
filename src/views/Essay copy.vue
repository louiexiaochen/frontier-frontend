<template>
  <div class="essay-page">
      <div class="background-effects">
          <div class="gradient-orb top-left"></div>
          <div class="gradient-orb bottom-right"></div>
          <div class="grid-overlay"></div>
      </div>

      <!--Essay content-->
      <div class="essay-container">
          <!-- 返回按钮 -->
          <div class="back-button-container">
              <button class="back-button" @click="$router.push('/home/reading')">
                  返回
              </button>
          </div>
          
          <!-- Content Area -->
          <div class="content-area">
              <!-- Essay Content with Split View -->
              <div class="essay-content-container">
                  <!-- Article Section (Left) -->
                  <div class="article-section" :style="{ width: leftWidth + '%' }">
                      <div class="article-title">{{ essayData.title }}</div>
                      <div class="article-content">
                          <p v-for="(paragraph, index) in essayData.paragraphs" :key="index" class="paragraph">
                              {{ paragraph }}
                          </p>
                      </div>
                  </div>
                  
                  <!-- Resizer -->
                  <div 
                      class="resizer" 
                      @mousedown="startResize" 
                      @touchstart="startResize"
                  ></div>

                  <!-- Questions Section (Right) -->
                  <div class="questions-section" :style="{ width: (100 - leftWidth) + '%' }">
                      <!-- Dynamic Question Modules -->
                      <div class="questions-modules">
                          <component 
                              v-for="(module, index) in essayData.questionModules"
                              :key="index"
                              :is="questionComponentMap[module.type]"
                              v-bind="module.data"
                              :initialAnswers="allAnswers[module.type] || {}"
                              @update:answers="answers => updateAnswers(module.type, answers)"
                          ></component>
                      </div>
                      
                      <!-- Submit Button -->
                      <div class="submit-button-container">
                          <button class="submit-button" @click="submitAnswers">提交答案</button>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </div>  
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter, useRoute } from 'vue-router';

// Import all question components
import TrueFalseQuestion from '../components/questions/TrueFalseQuestion.vue';
import MultipleChoiceQuestion from '../components/questions/MultipleChoiceQuestion.vue';
import FillInBlanksQuestion from '../components/questions/FillInBlanksQuestion.vue';
import MatchingQuestion from '../components/questions/MatchingQuestion.vue';
import ParagraphHeadingQuestion from '../components/questions/ParagraphHeadingQuestion.vue';
import SingleChoiceQuestion from '../components/questions/SingleChoiceQuestion.vue';

const router = useRouter();
const route = useRoute();
const essayId = computed(() => route.params.id || '未知文章');

// All answers data
const allAnswers = ref({});

// Handle answers update from any question component
const updateAnswers = (questionType, answers) => {
allAnswers.value[questionType] = answers;
console.log('Updated answers:', allAnswers.value);
};

// 提交答案
const submitAnswers = () => {
console.log('提交所有答案:', allAnswers.value);
// 实际项目中应将答案提交到后端
// saveUserAnswers();
};

// 用于调整左右面板宽度的变量和函数
const leftWidth = ref(50); // 默认左侧宽度50%
let isResizing = false;

// 调整面板大小的函数
const startResize = (event) => {
isResizing = true;

// 添加事件监听器
window.addEventListener('mousemove', handleResize);
window.addEventListener('touchmove', handleResize);
window.addEventListener('mouseup', stopResize);
window.addEventListener('touchend', stopResize);

// 阻止默认行为和冒泡
event.preventDefault();
event.stopPropagation();
};

const handleResize = (event) => {
if (!isResizing) return;

// 获取容器宽度和鼠标/触摸位置
const container = document.querySelector('.essay-content-container');
if (!container) return;

const containerRect = container.getBoundingClientRect();
const containerWidth = containerRect.width;

// 计算鼠标/触摸位置相对于容器的百分比
let clientX;
if (event.type === 'touchmove') {
  clientX = event.touches[0].clientX;
} else {
  clientX = event.clientX;
}

const relativeX = clientX - containerRect.left;
let newLeftWidth = (relativeX / containerWidth) * 100;

// 限制最小和最大宽度
newLeftWidth = Math.max(30, Math.min(70, newLeftWidth));

// 更新左侧宽度
leftWidth.value = newLeftWidth;
};

const stopResize = () => {
isResizing = false;

// 移除事件监听器
window.removeEventListener('mousemove', handleResize);
window.removeEventListener('touchmove', handleResize);
window.removeEventListener('mouseup', stopResize);
window.removeEventListener('touchend', stopResize);
};

// 模拟文章和问题数据
const essayData = ref({
title: "The Future of Artificial Intelligence",
paragraphs: [
  "Artificial Intelligence (AI) has rapidly evolved from a niche research field to a transformative force across various industries. With advancements in machine learning, natural language processing, and neural networks, AI systems can now perform tasks that once required human intelligence.",
  
  "The healthcare sector has witnessed significant AI integration, from diagnostic tools that can identify diseases from medical images to predictive analytics that forecast patient outcomes. AI algorithms can analyze vast amounts of medical data at unprecedented speeds, potentially leading to earlier disease detection and more personalized treatment plans.",
  
  "In education, AI-powered adaptive learning platforms tailor educational content to individual students' needs, identifying knowledge gaps and adjusting difficulty levels accordingly. This personalization can make learning more effective and engaging for students of different abilities and learning styles.",
  
  "The transportation industry is undergoing a revolution with autonomous vehicles and AI-optimized logistics systems. Self-driving cars promise to reduce accidents caused by human error, while smart traffic management systems can alleviate congestion and reduce emissions in urban areas.",
  
  "However, the rapid advancement of AI also raises important ethical considerations. Issues surrounding data privacy, algorithmic bias, job displacement, and the potential misuse of AI for surveillance or autonomous weapons require careful consideration and regulatory frameworks.",
  
  "Furthermore, as AI systems become more capable, questions about transparency and explainability become increasingly important. Understanding how AI reaches its conclusions is vital, especially in critical applications like healthcare, criminal justice, and finance.",
  
  "Looking ahead, the development of artificial general intelligence (AGI) – AI systems with human-level cognitive abilities across a wide range of tasks – remains a long-term goal with profound implications. While AGI might still be decades away, it underscores the importance of establishing robust safety measures and ethical guidelines now.",
  
  "In conclusion, AI presents tremendous opportunities to address complex challenges in healthcare, education, transportation, and beyond. Realizing this potential while mitigating risks will require collaboration among technologists, policymakers, ethicists, and the public to ensure that AI development proceeds in a manner that benefits humanity."
],
// Definition of the question types to render
questionModules: [
  {
    type: 'true-false',
    data: {
      questions: [
        { id: 'tf1', text: 'AI systems can perform tasks that once required human intelligence.' },
        { id: 'tf2', text: 'The healthcare sector has seen little benefit from AI integration.' },
        { id: 'tf3', text: 'AI-powered learning platforms can personalize content for different students.' }
      ]
    }
  },
  {
    type: 'single-choice',
    data: {
      questions: [
        { 
          id: 'sc1', 
          text: 'According to the passage, what is a benefit of AI in healthcare?',
          options: [
            'Replacing all healthcare workers',
            'Analyzing medical data at high speeds',
            'Reducing the cost of medical equipment',
            'Eliminating the need for medical research'
          ]
        },
        {
          id: 'sc2',
          text: 'What does the author suggest about AGI?',
          options: [
            'It already exists in limited forms',
            'It will never be achieved',
            'It could have profound implications and is a long-term goal',
            'It should be the immediate focus of AI research'
          ]
        }
      ]
    }
  },
  {
    type: 'multiple-choice',
    data: {
      questions: [
        {
          id: 'mc1',
          text: 'Which TWO areas of concern does the author mention regarding AI development?',
          options: [
            'Data privacy',
            'Environmental impact',
            'Job displacement',
            'Algorithmic bias',
            'Cultural differences'
          ]
        }
      ]
    }
  },
  {
    type: 'fill-in-blanks',
    data: {
      questions: [
        {
          id: 'fb1',
          text: "AI systems can now perform tasks that once required [BLANK] intelligence.",
          maxWords: 2
        },
        {
          id: 'fb2',
          text: "Self-driving cars promise to reduce [BLANK] caused by human error.",
          maxWords: 2
        }
      ]
    }
  },
  {
    type: 'matching',
    data: {
      questions: [
        { id: 'match1', text: 'A field where AI can analyze medical data at high speeds' },
        { id: 'match2', text: 'A field where AI personalizes content for different students' },
        { id: 'match3', text: 'A field where self-driving vehicles can reduce human error' }
      ],
      sections: [
        { text: 'Healthcare' },
        { text: 'Education' },
        { text: 'Transportation' },
        { text: 'Finance' }
      ]
    }
  },
  {
    type: 'paragraph-heading',
    data: {
      paragraphs: [
        { 
          id: 'p1', 
          label: 'A', 
          preview: 'Artificial Intelligence has rapidly evolved from a niche research field...' 
        },
        { 
          id: 'p2', 
          label: 'B', 
          preview: 'The healthcare sector has witnessed significant AI integration...' 
        },
        { 
          id: 'p3', 
          label: 'C', 
          preview: 'In education, AI-powered adaptive learning platforms tailor...' 
        }
      ],
      headings: [
        { text: 'Introduction to AI Development' },
        { text: 'Medical Applications of AI' },
        { text: 'Personalized Learning Through AI' },
        { text: 'Ethical Concerns in AI Implementation' }
      ]
    }
  }
]
});

// Map of component types to their corresponding component
const questionComponentMap = {
'true-false': TrueFalseQuestion,
'multiple-choice': MultipleChoiceQuestion,
'fill-in-blanks': FillInBlanksQuestion,
'matching': MatchingQuestion,
'paragraph-heading': ParagraphHeadingQuestion,
'single-choice': SingleChoiceQuestion,
};

// 清理事件监听器
onBeforeUnmount(() => {
window.removeEventListener('mousemove', handleResize);
window.removeEventListener('touchmove', handleResize);
window.removeEventListener('mouseup', stopResize);
window.removeEventListener('touchend', stopResize);
});

// 页面加载时初始化
onMounted(() => {
// 从后端加载文章和问题数据
// fetchEssayData();

// Initialize answers object structure
essayData.value.questionModules.forEach(module => {
  allAnswers.value[module.type] = {};
});
});
</script>

<style scoped>
  /* 背景效果 */
  .essay-page {
      position: relative;
      width: 100%;
      background-color: #121212;
      color: white;
      overflow: hidden;
  }
  
  .background-effects {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
      overflow: hidden;
  }
  
  .gradient-orb {
      position: absolute;
      width: 40vw;
      height: 40vw;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.3;
  }
  
  .top-left {
      top: -20vw;
      left: -20vw;
      background: linear-gradient(45deg, #4A99E9, #5C2797);
  }
  
  .bottom-right {
      bottom: -20vw;
      right: -20vw;
      background: linear-gradient(45deg, #5C2797, #4A99E9);
  }
  
  .grid-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: 
          linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
      background-size: 20px 20px;
  }

  /* Essay Container */
  .essay-container {
      position: relative;
      z-index: 1;
      padding: 1.5rem;
      overflow: hidden;
      touch-action: pan-y;
      -webkit-overflow-scrolling: touch;
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
  }
  
  .back-button {
      background-color: #4A99E9;
      color: white;
      border: none;
      border-radius: 0.5rem;
      padding: 0.5rem 1.2rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .back-button:hover {
      background-color: #3d7fbf;
      transform: translateY(-2px);
      box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }

  /* Content Area */
  .content-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      width: 100%;
      overflow: hidden;
  }

  /* Essay Content with Split View */
  .essay-content-container {
      display: flex;
      flex: 1;
      gap: 0;
      overflow: hidden;
      position: relative;
      border-radius: 0.75rem;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  }

  /* Resizer */
  .resizer {
      width: 8px;
      cursor: col-resize;
      background-color: rgba(255, 255, 255, 0.1);
      transition: background-color 0.2s;
      z-index: 10;
  }
  
  .resizer:hover {
      background-color: rgba(74, 153, 233, 0.5);
  }

  /* Article Section (Left) */
  .article-section {
      background-color: white;
      color: #333;
      border-radius: 0.5rem 0 0 0.5rem;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      max-height: 100%;
      transition: width 0.2s ease;
      scrollbar-width: thin;
      scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
  }

  .article-section::-webkit-scrollbar {
      width: 6px;
  }
  
  .article-section::-webkit-scrollbar-track {
      background: transparent;
  }
  
  .article-section::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 3px;
  }

  .article-title {
      font-size: 1.8rem;
      font-weight: 700;
      margin-bottom: 2rem;
      text-align: center;
      color: #222;
  }

  .article-content {
      font-size: 1.05rem;
      line-height: 1.7;
  }

  .paragraph {
      margin-bottom: 1.2rem;
      text-align: justify;
  }

  /* Questions Section (Right) */
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
      .essay-content-container {
          flex-direction: column;
      }
      
      .article-section, .questions-section {
          width: 100% !important;
          border-radius: 0.5rem 0.5rem 0 0;
          max-height: 50vh;
      }
      
      .questions-section {
          border-radius: 0 0 0.5rem 0.5rem;
      }
      
      .resizer {
          display: none;
      }
  }
</style>