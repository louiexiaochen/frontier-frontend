<template>
  <div class="essay-page">
      <div class="background-effects h-full">
          <div class="gradient-orb top-left"></div>
          <div class="gradient-orb bottom-right"></div>
          <div class="grid-overlay"></div>
      </div>

      <!--Essay content-->
      <div class="essay-container">
          <!-- 返回按钮 -->
          <!-- <div class="back-button-container">
              <button class="back-button" @click="$router.push('/home/reading')">
                  返回
              </button>
          </div>
           -->
          <!-- Content Area -->
          <div class="content-area">
              <!-- Essay Content with Split View -->
              <div class="essay-content-container">
                  <!-- Article Section (Left) -->
                  <ArticleSection 
                    :width="leftWidth"
                    :title="essayData.title"
                    :paragraphs="essayData.paragraphs"
                  />
                  
                  <!-- Resizer -->
                  <Resizer @resize-start="startResize" />

                  <!-- Questions Section (Right) -->
                  <QuestionsSection 
                    :width="100 - leftWidth"
                    :questionModules="essayData.questionModules"
                    :initialAnswers="allAnswers"
                    @update:answers="handleAnswerUpdate"
                    @submit="submitAnswers"
                  />
              </div>
          </div>
      </div>
  </div>  
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getArticleDetail, submitArticleAnswers } from '@/api/article';

// 导入拆分后的组件
import ArticleSection from '../components/essay/ArticleSection.vue';
import Resizer from '../components/essay/Resizer.vue';
import QuestionsSection from '../components/essay/QuestionsSection.vue';

const router = useRouter();
const route = useRoute();
const essayId = computed(() => route.params.id || '未知文章');
const isLoading = ref(false);
const apiError = ref(null);

// All answers data
const allAnswers = ref({});

// Handle answers update from any question component
const handleAnswerUpdate = ({ type, answers }) => {
  allAnswers.value[type] = answers;
  console.log('Updated answers:', allAnswers.value);
};

// 提交答案
const submitAnswers = async () => {
  try {
    console.log('提交所有答案:', allAnswers.value);
    
    // 将答案格式转换为API需要的格式
    const formattedAnswers = formatAnswersForSubmission(allAnswers.value);
    
    // 从essayId中提取文章ID（如果是从课程生成的文章，essayId可能包含前缀）
    const articleId = extractArticleId(essayId.value);
    
    // 调用API提交答案
    const response = await submitArticleAnswers(articleId, formattedAnswers);
    
    if (response.code === 0) {
      // 提交成功，显示结果或跳转到结果页面
      alert('答案提交成功！得分：' + response.data.score);
    } else {
      // 提交失败，显示错误信息
      alert('提交失败：' + response.msg);
    }
  } catch (error) {
    console.error('提交答案时出错:', error);
    alert('提交答案时发生错误，请稍后重试');
  }
};

// 将答案转换为API需要的格式
const formatAnswersForSubmission = (answers) => {
  const result = [];
  
  // 遍历所有问题类型
  Object.entries(answers).forEach(([type, typeAnswers]) => {
    // 遍历该类型下的所有问题答案
    Object.entries(typeAnswers).forEach(([questionId, answer]) => {
      result.push({
        question_id: questionId,
        answer: answer,
        type: type
      });
    });
  });
  
  return result;
};

// 从essayId中提取文章ID
const extractArticleId = (id) => {
  // 如果ID格式为 "essay-2-1"，提取数字部分
  if (id.startsWith('essay-')) {
    return id.substring(6); // 返回 "2-1" 或其他ID
  }
  return id; // 如果没有前缀，直接返回
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

// 模拟文章和问题数据（作为备用）
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

// 从API获取文章数据
const fetchEssayData = async () => {
  isLoading.value = true;
  apiError.value = null;
  
  try {
    // 从essayId中提取文章ID
    const articleId = extractArticleId(essayId.value);
    
    // 调用API获取文章详情
    const response = await getArticleDetail(articleId);
    
    if (response.code === 0 && response.data) {
      // 将API返回的数据转换为组件需要的格式
      const apiData = response.data;
      
      // 更新文章数据
      essayData.value = {
        title: apiData.title,
        paragraphs: apiData.content.split('\n\n'), // 假设段落由两个换行符分隔
        questionModules: formatQuestionsFromApi(apiData.questions)
      };
      
      console.log('成功获取文章数据:', essayData.value);
    } else {
      // API请求成功但返回错误
      console.error('获取文章失败:', response.msg || '未知错误');
      apiError.value = response.msg || '获取文章失败，请稍后重试';
      // 保留模板数据作为备用
    }
  } catch (error) {
    // API请求失败
    console.error('获取文章时出错:', error);
    apiError.value = '获取文章时发生错误，请稍后重试';
    // 保留模板数据作为备用
  } finally {
    isLoading.value = false;
    
    // 初始化答案对象结构
    essayData.value.questionModules.forEach(module => {
      allAnswers.value[module.type] = {};
    });
  }
};

// 将API返回的问题数据转换为组件需要的格式
const formatQuestionsFromApi = (apiQuestions) => {
  // 按问题类型分组
  const questionsByType = {};
  
  apiQuestions.forEach(q => {
    if (!questionsByType[q.type]) {
      questionsByType[q.type] = [];
    }
    questionsByType[q.type].push(q);
  });
  
  // 转换为组件需要的格式
  const modules = [];
  
  // 处理判断题
  if (questionsByType['true-false']) {
    modules.push({
      type: 'true-false',
      data: {
        questions: questionsByType['true-false'].map(q => ({
          id: q.id,
          text: q.content
        }))
      }
    });
  }
  
  // 处理单选题
  if (questionsByType['single-choice']) {
    modules.push({
      type: 'single-choice',
      data: {
        questions: questionsByType['single-choice'].map(q => ({
          id: q.id,
          text: q.content,
          options: q.options
        }))
      }
    });
  }
  
  // 处理多选题
  if (questionsByType['multiple-choice']) {
    modules.push({
      type: 'multiple-choice',
      data: {
        questions: questionsByType['multiple-choice'].map(q => ({
          id: q.id,
          text: q.content,
          options: q.options
        }))
      }
    });
  }
  
  // 处理填空题
  if (questionsByType['fill-in-blanks']) {
    modules.push({
      type: 'fill-in-blanks',
      data: {
        questions: questionsByType['fill-in-blanks'].map(q => ({
          id: q.id,
          text: q.content,
          maxWords: q.max_words || 5
        }))
      }
    });
  }
  
  // 处理匹配题
  if (questionsByType['matching']) {
    const matchingQuestions = questionsByType['matching'];
    if (matchingQuestions.length > 0) {
      modules.push({
        type: 'matching',
        data: {
          questions: matchingQuestions.map(q => ({
            id: q.id,
            text: q.content
          })),
          sections: matchingQuestions[0].options || []
        }
      });
    }
  }
  
  // 处理段落标题匹配题
  if (questionsByType['paragraph-heading']) {
    const paragraphQuestions = questionsByType['paragraph-heading'];
    if (paragraphQuestions.length > 0) {
      modules.push({
        type: 'paragraph-heading',
        data: {
          paragraphs: paragraphQuestions.map((q, index) => ({
            id: q.id,
            label: String.fromCharCode(65 + index), // A, B, C...
            preview: q.content.substring(0, 50) + '...'
          })),
          headings: paragraphQuestions[0].options || []
        }
      });
    }
  }
  
  return modules;
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
  fetchEssayData();
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
      padding: 1rem;
      overflow: hidden;
      touch-action: pan-y;
      -webkit-overflow-scrolling: touch;
      margin: 0 auto;
      height: 100%;
      display: flex;
      flex-direction: column;
  }
  
  /* 返回按钮 */
  .back-button-container {
      margin-bottom: 0.5rem;
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
      height: calc(100vh - 5rem);
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
  
  /* 响应式设计 */
  @media (max-width: 768px) {
      .essay-content-container {
          flex-direction: column;
      }
  }
</style>