<template>
  <div class="px-6 py-8 w-full md:w-[90%] lg:w-[80%] m-auto overflow-y-auto h-[calc(100vh-3.5rem)] relative hide-scrollbar">
    <!-- 单元列表 -->
    <div class="space-y-4" v-show="!selectedUnitId">
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

    <!-- 当选择了单元后显示课程列表 -->
    <transition 
      name="fade" 
      enter-active-class="transition-opacity duration-300 ease-out" 
      leave-active-class="transition-opacity duration-200 ease-in"
      enter-from-class="opacity-0" 
      enter-to-class="opacity-100"
      leave-from-class="opacity-100" 
      leave-to-class="opacity-0"
    >
      <div v-if="selectedUnitId && filteredLessons.length > 0">
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
            <div class="text-xl md:text-2xl font-bold text-gray-800 z-10">{{ lesson.id }}</div>
            <div class="w-[70%] h-2 bg-gray-200 rounded-full overflow-hidden z-10 absolute bottom-5">
              <div v-if="!lesson.locked" class="h-full bg-gray-800 rounded-full transition-all duration-500" :style="{ width: `${lesson.progress}%` }"></div>
            </div>
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
  LockedIcon
} from '../components/icons';
import VocabularyIcon from '../components/icons/VocabularyIcon.vue';
import { 
  getAllUnits as getUnits, 
  getUnitDetail,
  getUnitWords
} from '@/api/readings';
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
  { id: 4, title: '第4部分 动物保护', locked: true, progress: 0, words: '0/168' },
  { id: 5, title: '第5部分 学校教育', locked: true, progress: 0, words: '0/401' },
  { id: 6, title: '第6部分 植物研究', locked: true, progress: 0, words: '0/130' },
  { id: 7, title: '第7部分 文化历史', locked: true, progress: 0, words: '0/79' }
]);

// ... existing code ...

// 选择单元
const selectUnit = (unitId) => {
  if (!units.value.find(u => u.id === unitId && !u.locked)) return;
  
  selectedUnitId.value = unitId;
  
  // 更新URL参数
  router.push({ 
    path: '/home/reading', 
    query: { unit: unitId } 
  });
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
  { id: '1-2', unitId: 1, locked: false, progress: 100 },
  { id: '1-3', unitId: 1, locked: false, progress: 100 },
  
  // 第2部分
  { id: '2-1', unitId: 2, locked: false, progress: 100 },
  { id: '2-2', unitId: 2, locked: false, progress: 30 },
  { id: '2-3', unitId: 2, locked: false, progress: 50 },
  { id: '2-4', unitId: 2, locked: false, progress: 20 },
  { id: '2-5', unitId: 2, locked: true, progress: 0 },
  { id: '2-6', unitId: 2, locked: true, progress: 0 },
  { id: '2-7', unitId: 2, locked: true, progress: 0 },
  { id: '2-8', unitId: 2, locked: true, progress: 0 },
  { id: '2-9', unitId: 2, locked: true, progress: 0 },
  { id: '2-10', unitId: 2, locked: true, progress: 0 },
  
  // 第3部分
  { id: '3-1', unitId: 3, locked: false, progress: 0 },
  { id: '3-2', unitId: 3, locked: false, progress: 0 },
  { id: '3-3', unitId: 3, locked: true, progress: 0 },
  { id: '3-4', unitId: 3, locked: true, progress: 0 },
]);

// 根据当前选中的单元筛选课程
const filteredLessons = computed(() => 
  allLessons.value.filter(lesson => lesson.unitId === selectedUnitId.value)
);

// 判断课程卡片是否在左侧
const isLeftSide = index => index % 2 === 0;

// 获取课程卡片的样式
const getCardStyle = index => ({
  top: `${index * (cardSize + verticalGap)}px`
});

// 处理课程卡片点击事件
const handleLessonClick = (lesson) => {
  if (lesson.locked) return;
  
  router.push(`/reading/vocabulary/${lesson.id}`);
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

// 从API获取单元信息和进度数据
const fetchVocabularyProgress = async () => {
  try {
    const response = await getUnits();
    
    if (response.code === 0 && response.data && response.data.units) {
      console.log("获取到的单元数据:", response.data.units);
      
      const formattedUnits = response.data.units.map(unit => ({
        id: unit.id,
        title: unit.name,
        locked: unit.level > 2,
        progress: 0,
        words: `0/${unit.word_count}`,
        description: unit.description,
        level: unit.level,
        order: unit.order
      }));
      
      units.value = formattedUnits;
      await fetchUnitsProgress(formattedUnits);
    } else {
      console.error('获取单元信息失败:', response.msg || '未知错误');
      showToast('获取单元信息失败，显示默认数据', 'error');
    }
  } catch (error) {
    console.error('获取单元信息出错:', error);
    showToast('网络错误，显示默认数据', 'error');
  }
};

// 获取所有单元的学习进度
const fetchUnitsProgress = async (unitsList) => {
  try {
    for (const unit of unitsList) {
      if (unit.locked) continue;
      
      try {
        const progressResponse = await getUnitDetail(unit.id);
        
        if (progressResponse.code === 0 && progressResponse.data) {
          const { progress } = progressResponse.data;
          
          if (progress) {
            unit.progress = Math.round((progress.words_learned / progress.words_total) * 100);
            unit.words = `${progress.words_learned}/${progress.words_total}`;
          }
        }
      } catch (err) {
        console.error(`获取单元 ${unit.id} 进度失败:`, err);
      }
    }
  } catch (error) {
    console.error('获取单元进度出错:', error);
  }
};

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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}</style>
