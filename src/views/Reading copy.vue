<template>
  <div class="px-6 py-8 w-full md:w-[90%] lg:w-[80%] m-auto overflow-y-auto h-[calc(100vh-3.5rem)] relative hide-scrollbar">
    <!-- 单元列表 -->
    <transition 
      name="fade" 
      mode="out-in"
      enter-active-class="transition-all duration-300 ease-out" 
      leave-active-class="transition-none"
      enter-from-class="opacity-0" 
      enter-to-class="opacity-100"
      leave-from-class="opacity-100" 
      leave-to-class="opacity-0"
    >
      <div class="space-y-4" v-if="!selectedUnitId">
        <div 
          v-for="unit in units" 
          :key="unit.id"
          class="relative w-full h-auto min-h-[103px] bg-[#191919] rounded-[20px] p-4 md:p-6 cursor-pointer transition-all duration-300 hover:bg-[#222222] flex flex-col md:flex-row items-start md:items-center"
          :class="{'opacity-50 cursor-not-allowed': unit.locked}"
          @click="selectUnit(unit.id)"
        >
          <!-- 左侧图标 -->
          <div class="flex items-center mb-2 md:mb-0">
            <div class="w-6 h-6 flex items-center justify-center">
              <UnlockedIcon v-if="!unit.locked" class="text-white" :size="20" />
              <LockedIcon v-else class="text-white/50" :size="20" />
            </div>
          </div>

          <!-- 单元标题 -->
          <div class="ml-2 md:ml-4 mb-3 md:mb-0 flex-grow">
            <h3 class="text-xl md:text-2xl lg:text-[32px] text-white font-bold leading-tight md:leading-[39px] font-inter break-words">{{ unit.title }}</h3>
          </div>

          <!-- 进度条区域 -->
          <div class="w-full md:w-auto md:flex-grow lg:max-w-[566px] h-[31px] mt-2 md:mt-0 md:mx-4">
            <!-- 背景进度条 -->
            <div class="relative w-full h-full">
              <div class="absolute inset-0 bg-white/20 rounded-[20px] shadow-lg"></div>
              
              <!-- 实际进度条 -->
              <div 
                class="absolute top-0 left-0 h-full bg-white rounded-[20px] shadow-lg transition-all duration-500"
                :style="{ width: `${unit.progress}%` }"
              ></div>
              
              <!-- 进度百分比文字 -->
              <div class="absolute left-[11px] top-1/2 transform -translate-y-1/2">
                <span class="text-black text-lg md:text-xl lg:text-[24px] font-bold leading-tight md:leading-[29px] font-inter">{{ unit.progress }}%</span>
              </div>
            </div>
          </div>

          <!-- 右侧单词数量 -->
          <div class="absolute top-3 right-3 md:static md:ml-2">
            <div class="flex items-center gap-2">
              <VocabularyIcon class="text-white" :size="18" />
              <span class="text-white text-base md:text-lg lg:text-[20px] font-bold leading-tight md:leading-[24px] font-inter">{{ unit.words }}</span>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- 当选择了单元后显示课程列表 -->
    <transition 
      name="fade" 
      mode="out-in"
      enter-active-class="transition-all duration-300 ease-out" 
      leave-active-class="transition-none"
      enter-from-class="opacity-0" 
      enter-to-class="opacity-100"
      leave-from-class="opacity-100" 
      leave-to-class="opacity-0"
    >
      <div v-if="selectedUnitId">
        <div 
         @click="selectedUnitId = null"
          class="relative w-full h-auto min-h-[103px] bg-[#191919] rounded-[20px] p-4 md:p-6 cursor-pointer transition-all duration-300 hover:bg-[#222222] flex flex-col md:flex-row items-start md:items-center"
          :class="{'opacity-50 cursor-not-allowed': currentUnit.locked}"
        >
        <!-- 左侧图标 -->
        <div class="flex items-center mb-2 md:mb-0">
          <div class="w-6 h-6 flex items-center justify-center">
            <ChevronDownIcon></ChevronDownIcon>
          </div>
        </div>

        <!-- 单元标题 -->
        <div class="ml-2 md:ml-4 mb-3 md:mb-0 flex-grow">
          <h3 class="text-xl md:text-2xl lg:text-[32px] text-white font-bold leading-tight md:leading-[39px] font-inter break-words">{{ currentUnit.title }}</h3>
        </div>

        <!-- 进度条区域 -->
        <div class="w-full md:w-auto md:flex-grow lg:max-w-[566px] h-[31px] mt-2 md:mt-0 md:mx-4">
          <!-- 背景进度条 -->
          <div class="relative w-full h-full">
            <div class="absolute inset-0 bg-white/20 rounded-[20px] shadow-lg"></div>
            
            <!-- 实际进度条 -->
            <div 
              class="absolute top-0 left-0 h-full bg-white rounded-[20px] shadow-lg transition-all duration-500"
              :style="{ width: `${currentUnit.progress}%` }"
            ></div>
            
            <!-- 进度百分比文字 -->
            <div class="absolute left-[11px] top-1/2 transform -translate-y-1/2">
              <span class="text-black text-lg md:text-xl lg:text-[24px] font-bold leading-tight md:leading-[29px] font-inter">{{ currentUnit.progress }}%</span>
            </div>
          </div>
        </div>

        <!-- 右侧单词数量 -->
        <div class="absolute top-3 right-3 md:static md:ml-2">
          <div class="flex items-center gap-2">
            <VocabularyIcon class="text-white" :size="18" />
            <span class="text-white text-base md:text-lg lg:text-[20px] font-bold leading-tight md:leading-[24px] font-inter">{{ currentUnit.words }}</span>
          </div>
        </div>
      </div>
        <div class="relative min-h-full pb-8 w-full max-w-[600px] m-auto mt-10 md:mt-20">
          <div 
            class="w-[8rem] md:w-[10rem] h-[8rem] md:h-[10rem] bg-white rounded-2xl absolute flex flex-col items-center justify-center cursor-pointer transition-all duration-300 overflow-hidden hover:-translate-y-1.5 hover:shadow-lg"
            v-for="(lesson, index) in filteredLessons" 
            :key="lesson.id" 
            :class="{ 
              'opacity-50 cursor-not-allowed hover:transform-none': lesson.locked, 
              'left-0': isLeftSide(index), 
              'right-0': !isLeftSide(index) 
            }" 
            :style="getCardStyle(index)"
            @click="handleLessonClick(lesson)"
          >
            <div class="opacity-20 z-0">
              <star-icon class="text-gray-800" :size="80" />
            </div>
            <div class="text-xl md:text-2xl font-bold text-gray-800 z-10">{{ lesson.name }}</div>
            <div class="w-[70%] h-2 bg-gray-200 rounded-full overflow-hidden z-10 absolute bottom-5">
              <div v-if="!lesson.locked" class="h-full bg-gray-800 rounded-full transition-all duration-500" :style="{ width: `${lesson.progress}%` }"></div>
            </div>
          </div>

          <!-- 新建关卡卡片 -->
          <div 
            class="w-[8rem] md:w-[10rem] h-[8rem] md:h-[10rem] bg-white rounded-2xl absolute flex flex-col items-center justify-center cursor-pointer transition-all duration-300 overflow-hidden hover:-translate-y-1.5 hover:shadow-lg"
            :class="{ 
              'left-0': isLeftSide(filteredLessons.length), 
              'right-0': !isLeftSide(filteredLessons.length),
              'opacity-50 cursor-not-allowed hover:transform-none': isNewLessonDisabled
            }" 
            :style="getCardStyle(filteredLessons.length)"
            @click="isNewLessonDisabled ? null : createNewCourse"
          >
            <div class="opacity-20 z-0">
              <PlusIcon class="text-gray-800" :size="80" />
            </div>
            <div class="text-xl md:text-2xl font-bold text-gray-800 z-10">新建关卡</div>
            <div v-if="isNewLessonDisabled" class="absolute bottom-2 text-sm text-red-500">需完成上一关卡</div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onActivated } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  StarIcon,
  ChevronDownIcon,
  UnlockedIcon,
  LockedIcon,
  PlusIcon
} from '../components/icons';
import VocabularyIcon from '../components/icons/VocabularyIcon.vue';
import { 
  getAllUnits,
  getUnitCourses,
  createUnitProgress,
} from '@/api/unit';
import { generateArticle } from '@/api/article';

const router = useRouter();
const route = useRoute();

const cardSize = 160;
const verticalGap = 50;

// 选中的单元ID
const selectedUnitId = ref(null);
const currentUnit = computed(() => units.value.find(unit => unit.id === selectedUnitId.value));
// 单元数据
const units = ref([
  { id: 1, title: '第1部分 太空探索', locked: false, progress: 100, words: '75/75' },
  { id: 2, title: '第2部分 自然地理', locked: false, progress: 56, words: '135/241' },
  { id: 3, title: '第3部分 科技发明', locked: false, progress: 0, words: '0/122' },
]);

// ... existing code ...

// 从API获取单元信息和进度数据
const fetchVocabularyProgress = async () => {
  try {
    const response = await getAllUnits();
    
    if (response.code == 0) {
      console.log("获取到的单元数据:", response);
      const formattedUnits = response.data.map(unit => ({
        id: unit.id,
        title: unit.name,
        locked: unit.level > 2, // 根据实际业务逻辑调整
        progress: Math.round((unit.progresses?.words_learned / unit.progresses?.words_total) * 100) || 0,
        words: `0/${unit.word_count}`,
        description: unit.description,
        level: unit.level,
        order: unit.order
      }));
      
      units.value = formattedUnits;
    } else {
      console.error('获取单元信息失败');
      showToast('获取单元信息失败，显示默认数据', 'error');
    }
  } catch (error) {
    console.error('获取单元信息出错:', error);
    showToast('网络错误，显示默认数据', 'error');
  }
};


// 选择单元
const selectUnit = async (unitId) => {
  const unit = units.value.find(u => u.id === unitId);
  if (!unit || unit.locked) return;
  
  try {
    // 获取单元课程
    const response = await getUnitCourses(unitId);
    // 如果没有课程数据，创建新课程
    if (response.code == 0) {
      const coursesData = response.data || [];
      console.log('获取到的单元课程:', coursesData);
      allLessons.value = coursesData.map((course, index) => ({
        id: course.course_id,
        name: `第${index + 1}课`,
        unitId: course.unit_id,
        locked: false,
        progress: Math.round((course.words_learned / course.words_total) * 100) || 0,
        words_learned: course.words_learned,
        words_total: course.words_total,
        is_completed: course.is_completed,
        last_studied_at: course.last_studied_at
      }));
      console.log('更新后的单元课程:', allLessons.value[1]);
      
      // 更新当前单元的总进度
      const totalWordsLearned = coursesData.reduce((sum, course) => sum + course.words_learned, 0);
      const totalWords = coursesData.reduce((sum, course) => sum + course.words_total, 0);
      
      // 更新单元进度
      const unitIndex = units.value.findIndex(u => u.id === unitId);
      if (unitIndex !== -1) {
        units.value[unitIndex] = {
          ...units.value[unitIndex],
          progress: Math.round((totalWordsLearned / totalWords) * 100) || 0,
          words: `${totalWordsLearned}/${totalWords}`
        };
      }
    }
    
    selectedUnitId.value = unitId;
    
    // 更新URL参数
    router.push({ 
      path: '/home/reading', 
      query: { unit: unitId } 
    });
  } catch (error) {
    console.error('选择单元失败:', error);
    showToast('选择单元失败，请稍后重试', 'error');
  }
};

// 创建新课程
const createNewCourse = async () => {
  try {
    if (!selectedUnitId.value) return;
    
    const createResponse = await createUnitProgress(selectedUnitId.value.toString());
    if (createResponse.code === 0 && createResponse.data) {
      // 添加新课程到列表
      const newCourse = {
        id: createResponse.data.course_id,
        name: `第${allLessons.value.length + 1}课`,
        unitId: createResponse.data.unit_id,
        locked: false,
        progress: 0,
        words_learned: 0,
        words_total: createResponse.data.words_total || 0,
        is_completed: false,
        last_studied_at: null
      };
      
      allLessons.value.push(newCourse);
      showToast('成功创建新课程', 'info');
    }
  } catch (error) {
    console.error('创建新课程失败:', error);
    showToast('创建新课程失败，请稍后重试', 'error');
  }
};

// 当前选中单元的标题
const currentUnitTitle = computed(() => {
  const unit = units.value.find(u => u.id === selectedUnitId.value);
  return unit?.title || '未知单元';
});

// 所有关卡数据
const allLessons = ref([
  // 第1部分
  { id: '1-1', unitId: 1, locked: false, progress: 100 },
  
  // 第2部分
  { id: '2-1', unitId: 2, locked: false, progress: 100 },
  
  // 第3部分
  { id: '3-1', unitId: 3, locked: false, progress: 0 },
]);

// 根据当前选中的单元筛选课程
const filteredLessons = computed(() => 
  allLessons.value
);

// 判断课程卡片是否在左侧
const isLeftSide = index => index % 2 === 0;

// 获取课程卡片的样式
const getCardStyle = index => ({
  top: `${index * (cardSize + verticalGap)}px`
});

// 处理课程卡片点击事件
const handleLessonClick = async (lesson) => {
  if (lesson.locked) return;
  
  try {
    // 如果需要，可以在这里调用完成单元的接口
    // if (lesson.progress === 100) {
    //   await completeUnit(selectedUnitId.value);
    // }
    
    router.push(`/reading/vocabulary/${lesson.id}`);
  } catch (error) {
    console.error('处理课程点击失败:', error);
    showToast('操作失败，请稍后重试', 'error');
  }
};

// 从特定课程生成文章
const generateEssayFromLesson = async (lesson) => {
  try {
    const loadingToast = showToast('正在生成文章，请稍候...');
    
    const response = await generateArticle();
    
    closeToast(loadingToast);
    
    if (response.code === 0 && response.data) {
      router.push(`/reading/essay/${response.data.article_id}`);
    } else {
      showToast('生成文章失败：' + (response.msg || '未知错误'), 'error');
      const essayId = `essay-${lesson.id}`;
      router.push(`/reading/essay/${essayId}`);
    }
  } catch (error) {
    console.error('生成文章时出错:', error);
    showToast('生成文章时发生错误，请稍后重试', 'error');
    
    const essayId = `essay-${lesson.id}`;
    router.push(`/reading/essay/${essayId}`);
  }
  
  event.stopPropagation();
};

// 简单的Toast提示函数
const showToast = (message, type = 'info') => {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  
  Object.assign(toast.style, {
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '10px 20px',
    borderRadius: '4px',
    backgroundColor: type === 'error' ? '#f44336' : '#333',
    color: 'white',
    zIndex: '9999',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
  });
  
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 2500);
  return toast;
};

const closeToast = (toast) => {
  if (toast && toast.parentNode) {
    toast.parentNode.removeChild(toast);
  }
};

// 判断是否应该禁用新建课程按钮
const isNewLessonDisabled = computed(() => {
  if (filteredLessons.value.length === 0) return false;
  const lastLesson = filteredLessons.value[filteredLessons.value.length - 1];
  return lastLesson && lastLesson.progress < 100;
});

// 页面加载时获取最新进度数据
onMounted(() => {
  fetchVocabularyProgress();
  
  // 检查URL参数
  const { unit } = route.query;
  if (unit) {
    const unitId = parseInt(unit);
    const validUnit = units.value.find(u => u.id === unitId && !u.locked);
    if (validUnit) {
      selectedUnitId.value = unitId;
    }
  }
});

// 监听路由变化
watch(() => route.query.unit, (newUnit) => {
  if (!newUnit) {
    selectedUnitId.value = null;
    return;
  }
  
  const unitId = parseInt(newUnit);
  const validUnit = units.value.find(u => u.id === unitId && !u.locked);
  if (validUnit) {
    selectedUnitId.value = unitId;
  }
});
</script>
  
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');

.font-inter {
  font-family: 'Inter', sans-serif;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.fade-enter-active {
  transition: opacity 0.3s ease;
}

.fade-leave-active {
  transition: none;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>


