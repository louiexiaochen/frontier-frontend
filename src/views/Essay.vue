<template>
  <div class="essay-page">
      <div class="background-effects h-full">
          <div class="gradient-orb top-left"></div>
          <div class="gradient-orb bottom-right"></div>
          <div class="grid-overlay"></div>
      </div>

      <!--Essay content-->
      <div class="essay-container">
          <!-- Loading State -->
          <div v-if="isLoading" class="loading-container">
              <div class="loading-spinner"></div>
              <p class="loading-text">加载中...</p>
          </div>
          
          <!-- Error State -->
          <div v-else-if="apiError" class="error-container">
              <div class="error-icon">❌</div>
              <h2 class="error-title">加载失败</h2>
              <p class="error-message">{{ apiError }}</p>
              <div class="error-actions">
                <button class="retry-button" @click="fetchEssayData">重试</button>
                <button class="regenerate-button ml-4" @click="handleArticle">重新生成</button>
              </div>
          </div>
          
          <!-- 文章生成中 -->
          <div v-else-if="articleStatus === ARTICLE_STATUS.GENERATING" class="status-container">
              <div class="status-icon">⏳</div>
              <h2 class="status-title">{{ getStatusDescription(articleStatus) }}</h2>
              <p class="status-message">请稍候，系统正在生成文章内容...</p>
          </div>
          
          <!-- 文章生成错误 -->
          <div v-else-if="articleStatus === ARTICLE_STATUS.ERROR" class="status-container">
              <div class="status-icon">⚠️</div>
              <h2 class="status-title">{{ getStatusDescription(articleStatus) }}</h2>
              <p class="status-message">很抱歉，文章生成过程中出现错误</p>
              <button class="regenerate-button" @click="handleArticle">重新生成</button>
          </div>
          
          <!-- 文章正在重新生成 -->
          <div v-else-if="articleStatus === ARTICLE_STATUS.REGENERATING" class="status-container">
              <div class="status-icon">🔄</div>
              <h2 class="status-title">{{ getStatusDescription(articleStatus) }}</h2>
              <p class="status-message">请稍候，系统正在重新生成文章内容...</p>
          </div>
          
          <!-- Empty State -->
          <div v-else-if="!essayData.title && !isLoading" class="empty-container">
              <div class="empty-icon">📝</div>
              <h2 class="empty-title">暂无文章内容</h2>
              <p class="empty-message">当前没有可用的文章内容</p>
          </div>
          
          <!-- Content Area -->
          <div v-else class="content-area">
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
                    :is-finished="isFinished"
                    @submit="submitAnswers"
                  />
              </div>
          </div>
      </div>
  </div>  
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getArticleDetail, submitArticleAnswers, regenerateArticle } from '@/api/article';
import { normalizeQuestionType } from '@/utils/answerUtils';
import { useModalStore } from '@/stores/modal';

// 导入拆分后的组件
import ArticleSection from '../components/essay/ArticleSection.vue';
import Resizer from '../components/essay/Resizer.vue';
import QuestionsSection from '../components/essay/QuestionsSection.vue';

// 获取 modal store
const modalStore = useModalStore();

// 文章状态常量
const ARTICLE_STATUS = {
  UNKNOWN: 0,    // 未知状态
  GENERATING: 1, // 文章正在生成中
  ERROR: 2,      // 文章生成错误
  REGENERATING: 3, // 文章正在重新生成中
  COMPLETED: 4,  // 文章生成完成
  STUDIED: 5     // 文章已学习完成
};

// 获取状态描述
const getStatusDescription = (status) => {
  switch (status) {
    case ARTICLE_STATUS.GENERATING:
      return '文章生成中';
    case ARTICLE_STATUS.ERROR:
      return '文章生成错误';
    case ARTICLE_STATUS.REGENERATING:
      return '文章重新生成中';
    case ARTICLE_STATUS.COMPLETED:
      return '文章生成完成';
    case ARTICLE_STATUS.STUDIED:
      return '文章已学习完成';
    default:
      return '未知状态';
  }
};

const router = useRouter();
const route = useRoute();
const essayId = computed(() => route.params.id || '未知文章');
const isLoading = ref(true);
const apiError = ref(null);
const isFinished = ref(false);
const articleStatus = ref(ARTICLE_STATUS.UNKNOWN);

// 用于控制API请求的状态
const isComponentMounted = ref(true);
const pollingTimerId = ref(null);
const isPolling = ref(false);

// 清除轮询定时器
const clearPollingTimer = () => {
  if (pollingTimerId.value) {
    clearTimeout(pollingTimerId.value);
    pollingTimerId.value = null;
  }
};

// 重新生成文章
const handleArticle = async () => {
  if (!isComponentMounted.value) return;
  
  // 防止重复点击
  if (isLoading.value) return;
  
  try {
    isLoading.value = true;
    clearPollingTimer();
    
    const articleId = extractArticleId(essayId.value);
    
    if (!articleId) {
      apiError.value = '无效的文章ID，无法重新生成';
      isLoading.value = false;
      return;
    }
    // 调用重新生成接口
    const response = await regenerateArticle({
      article_id: articleId
    });
    
    if (!isComponentMounted.value) return;
    
    if (response && response.code === 0) {
      // 更新状态为"文章正在重新生成"
      articleStatus.value = ARTICLE_STATUS.REGENERATING;
      apiError.value = null;
      // 启动轮询
      startPolling();
    } else {
      apiError.value = response?.msg || '重新生成请求失败';
    }
  } catch (error) {
    if (!isComponentMounted.value) return;
    apiError.value = '重新生成文章时发生错误，请稍后再试';
  } finally {
    if (isComponentMounted.value) {
      isLoading.value = false;
    }
  }
};

// 提交答案
const submitAnswers = async () => {
  if (!isComponentMounted.value) return;
  
  // 防止重复提交
  if (isLoading.value) return;
  
  try {
    isLoading.value = true;
    const articleId = extractArticleId(essayId.value);
        if (!articleId) {
      return;
    }
        // 调用API提交答案
    const response = await submitArticleAnswers(articleId);
        if (!isComponentMounted.value) return;
    
    if (response.code === 0) {
      // 提交成功，设置已完成状态，显示正确答案
      isFinished.value = true;
      
      // 重新获取文章详情，获取最新的答案状态
      await fetchEssayData();
    } else {
      // 提交失败，显示错误信息
      apiError.value = response.msg || '提交答案失败，请稍后重试';
    }
  } catch (error) {
    if (isComponentMounted.value) {
      console.error('提交答案时出错:', error);
      apiError.value = '提交答案时发生错误，请稍后重试';
    }
  } finally {
    if (isComponentMounted.value) {
      isLoading.value = false;
    }
  }
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

// 启动轮询
const startPolling = () => {
  if (isPolling.value || !isComponentMounted.value) return;
  isPolling.value = true;
    // 确保先清除之前的定时器
  clearPollingTimer();
  
  pollingTimerId.value = setTimeout(async () => {
    if (!isComponentMounted.value) {
      isPolling.value = false;
      return;
    }
    
    try {
      isPolling.value = false;
      await fetchEssayData();
    } catch (error) {
      console.error('轮询过程中出错:', error);
      
      if (isComponentMounted.value) {
        // 如果出错，延迟后重试
        pollingTimerId.value = setTimeout(() => {
          if (isComponentMounted.value) {
            startPolling();
          }
        }, 5000); // 出错后等待5秒再重试
      }
    }
  }, 3000);
};

// 从API获取文章数据
const fetchEssayData = async () => {
  if (!isComponentMounted.value) return;
  
  clearPollingTimer();
  isLoading.value = true;
  apiError.value = null;
  
  try {
    const articleId = extractArticleId(essayId.value);
    
    if (!articleId) {
      apiError.value = '无效的文章ID';
      isLoading.value = false;
      return;
    }
        console.log('获取文章数据:', articleId);
    
    // 调用API获取文章详情
    const response = await getArticleDetail(articleId);
    
    if (!isComponentMounted.value) return;
    
    if (processApiResponse(response)) {
      console.log('成功获取文章数据');
    }
  } catch (error) {
    // API请求失败
    if (!isComponentMounted.value) return;
    
    console.error('获取文章时出错:', error);
    apiError.value = '获取文章时发生错误，请稍后重试';
  } finally {
    if (isComponentMounted.value) {
      isLoading.value = false;
    }
  }
};

// 处理API返回的数据
const processApiResponse = (response) => {
  if (response.code === 0 && response.data) {
    const apiData = response.data;
    
    // 保存文章状态
    articleStatus.value = apiData.status || ARTICLE_STATUS.UNKNOWN;
    
    // 根据文章状态处理
    switch (apiData.status) {
      case ARTICLE_STATUS.COMPLETED:
      case ARTICLE_STATUS.STUDIED:
        try {
          processArticleData(apiData);
        } catch (formatError) {
          handleDataFormatError(formatError);
        }
        break;
        
      case ARTICLE_STATUS.GENERATING:
      case ARTICLE_STATUS.REGENERATING:
        startPolling();
        break;
        
      case ARTICLE_STATUS.ERROR:
        apiError.value = '文章生成失败，请尝试重新生成';
        break;
        
      default:
        apiError.value = `未知的文章状态: ${apiData.status}`;
        break;
    }
    return true;
  } else {
    handleApiError(response);
    return false;
  }
};

// 处理API错误
const handleApiError = (response) => {
  console.error('获取文章失败:', response.msg || '未知错误');
  apiError.value = response.msg || '获取文章失败，请稍后重试';
};

// 处理数据格式错误
const handleDataFormatError = (error) => {
  console.error('文章数据格式错误:', error);
  apiError.value = '文章数据格式错误，请尝试重新生成';
  articleStatus.value = ARTICLE_STATUS.ERROR; // 设置为错误状态
};

// 处理文章数据
const processArticleData = (apiData) => {
  essayData.value = {
    title: apiData.title || '',
    paragraphs: Array.isArray(apiData.paragraphs) ? apiData.paragraphs : [],
    questionModules: formatQuestionsFromApi(apiData.questions || [])
  };
  
  // 设置是否已完成状态
  isFinished.value = apiData.is_finished || apiData.status === ARTICLE_STATUS.STUDIED;
  
  console.log('成功获取文章数据');
};

// 将API返回的问题数据转换为组件需要的格式
const formatQuestionsFromApi = (apiQuestions) => {
  // 确保apiQuestions是数组
  if (!Array.isArray(apiQuestions)) {
    console.error('问题数据格式错误：不是数组', apiQuestions);
    return [];
  }
  
  try {
    // 按问题类型分组
    const questionsByType = apiQuestions.reduce((acc, q) => {
      // 跳过无效的问题数据
      if (!q || typeof q !== 'object') {
        console.warn('跳过无效的问题数据', q);
        return acc;
      }
      
      const type = q.type || 'unknown';
      
      if (!acc[type]) {
        acc[type] = [];
      }
      
      acc[type].push(q);
      return acc;
    }, {});
    
    // 转换为组件需要的格式
    return Object.entries(questionsByType).map(([type, questions]) => {
      try {
        // 标准化题型名称
        const normalizedType = normalizeQuestionType(type);
        
        // 创建题型模块
        return {
          type: normalizedType,
          data: {
            // 直接传递原始问题数据，让各组件自行处理
            questions: questions.map(q => ({
              ...q,
              id: q.id || `temp-${Math.random().toString(36).substring(2, 10)}`,
              text: q.text || q.content || '问题内容缺失',
              correctAnswer: q.correct_answer,
              is_correct: q.is_correct,
              user_answer: q.user_answer
            }))
          }
        };
      } catch (error) {
        return null;
      }
    }).filter(Boolean); // 过滤掉null值
  } catch (error) {
    return [];
  }
};

// 模拟文章和问题数据（作为备用）
const essayData = ref({
  title: "",
  paragraphs: [],
  questionModules: []
});

// 清理事件监听器和定时器
onBeforeUnmount(() => {
  // 标记组件已卸载
  isComponentMounted.value = false;
  
  // 清理resize事件监听器
  window.removeEventListener('mousemove', handleResize);
  window.removeEventListener('touchmove', handleResize);
  window.removeEventListener('mouseup', stopResize);
  window.removeEventListener('touchend', stopResize);
  
  // 清理定时器
  clearPollingTimer();
});

// 监听路由变化，如果路由改变，停止所有请求和轮询
watch(() => route.path, (newPath, oldPath) => {
  // 只有当路径真正改变且不再是当前文章页面时才清理
  if (newPath !== oldPath && !newPath.includes(`/essay/${essayId.value}`)) {
    isComponentMounted.value = false;
    clearPollingTimer();
  }
});

// 页面加载时初始化
onMounted(() => {
  isComponentMounted.value = true;
  // 自动收缩侧边栏
  modalStore.setSidebarVisible(false);
  // 从后端加载文章和问题数据
  fetchEssayData();
});
</script>

<style scoped>
  /* 背景效果 */
  .essay-page {
    @apply relative w-full bg-[#121212] text-white overflow-hidden min-h-screen;
  }
  
  .background-effects {
    @apply absolute top-0 left-0 w-full h-full z-0 overflow-hidden;
  }
  
  .gradient-orb {
    @apply absolute w-[40vw] h-[40vw] rounded-full opacity-30;
    filter: blur(80px);
  }
  
  .top-left {
    @apply -top-[20vw] -left-[20vw];
    background: linear-gradient(45deg, #4A99E9, #5C2797);
  }
  
  .bottom-right {
    @apply -bottom-[20vw] -right-[20vw];
    background: linear-gradient(45deg, #5C2797, #4A99E9);
  }
  
  .grid-overlay {
    @apply absolute top-0 left-0 w-full h-full;
    background-image: 
        linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    background-size: 20px 20px;
  }

  /* Essay Container */
  .essay-container {
    @apply relative z-10 p-4 overflow-hidden touch-pan-y m-auto h-[94%] flex flex-col;
    -webkit-overflow-scrolling: touch;
  }
  
  /* Content Area */
  .content-area {
    @apply flex-1 flex flex-col w-full h-[calc(100vh-5rem)] overflow-hidden;
  }

  /* Essay Content with Split View */
  .essay-content-container {
    @apply flex flex-1 gap-0 overflow-hidden relative rounded-xl shadow-xl h-full;
  }
  
  /* Loading State */
  .loading-container {
    @apply flex flex-col items-center justify-center h-[calc(100vh-8rem)] w-full;
  }
  
  .loading-spinner {
    @apply w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4;
  }
  
  .loading-text {
    @apply text-xl text-white/80 font-medium;
  }
  
  /* Error State */
  .error-container {
    @apply flex flex-col items-center justify-center h-[calc(100vh-8rem)] w-full;
  }
  
  .error-icon {
    @apply text-5xl mb-4;
  }
  
  .error-title {
    @apply text-2xl font-bold mb-2;
  }
  
  .error-message {
    @apply text-white/70 mb-6 text-center;
  }
  
  .error-actions {
    @apply flex flex-wrap gap-3 justify-center;
  }
  
  .retry-button {
    @apply bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full transition-colors;
  }
  
  /* Status Container (用于显示文章状态) */
  .status-container {
    @apply flex flex-col items-center justify-center h-[calc(100vh-8rem)] w-full;
  }
  
  .status-icon {
    @apply text-6xl mb-4;
  }
  
  .status-title {
    @apply text-2xl font-bold mb-2;
  }
  
  .status-message {
    @apply text-white/70 text-center mb-6;
  }
  
  .regenerate-button {
    @apply bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full transition-colors;
  }
  
  /* Empty State */
  .empty-container {
    @apply flex flex-col items-center justify-center h-[calc(100vh-8rem)] w-full;
  }
  
  .empty-icon {
    @apply text-6xl mb-4;
  }
  
  .empty-title {
    @apply text-2xl font-bold mb-2;
  }
  
  .empty-message {
    @apply text-white/70 text-center;
  }
  
  /* 响应式设计 */
  @media (max-width: 768px) {
    .essay-content-container {
      @apply flex-col;
    }
  }
</style>