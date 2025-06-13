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
        <!-- 空状态显示 -->
        <div v-if="units.length === 0" class="flex flex-col items-center justify-center min-h-[400px] bg-[#191919] rounded-[20px] p-8">
          <div class="text-6xl mb-4">📚</div>
          <h3 class="text-2xl text-white font-bold mb-2">暂无学习单元</h3>
          <p class="text-white/60 text-center">目前还没有可用的学习单元<br>请稍后再来查看</p>
        </div>
        
        <!-- 现有的单元列表内容 -->
        <div 
          v-else
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
          <!-- 空状态显示 -->
          <div v-if="filteredLessons.length === 0" class="flex flex-col items-center justify-center min-h-[400px] bg-[#191919] rounded-[20px] p-8">
            <div class="text-6xl mb-4">📖</div>
            <h3 class="text-2xl text-white font-bold mb-2">暂无课程</h3>
            <p class="text-white/60 text-center">该单元还没有任何课程<br>点击下方新建按钮开始学习</p>
            <button 
              @click="createNewCourse"
              class="mt-6 px-6 py-3 bg-white text-gray-800 rounded-full font-bold hover:bg-gray-100 transition-colors"
              :class="{ 'opacity-50 cursor-not-allowed': isNewLessonDisabled }"
            >
              新建课程
            </button>
          </div>

          <!-- 现有的课程列表内容 -->
          <div v-else class="relative" :style="{ height: containerHeight }">
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
              <div class="z-0" :class="lesson.progress >= 100 ? 'opacity-100' : 'opacity-20'">
                <star-icon :color="lesson.progress >= 100 ? '#4A99E9' : '#1f2937'" :size="80" />
              </div>
              <div class="text-xl md:text-2xl font-bold text-gray-800 z-10 my-[5%]">{{ lesson.name }}</div>
              <div class="w-[70%] h-2 bg-gray-200 rounded-full overflow-hidden z-10">
                <div v-if="!lesson.locked" class="h-full bg-gray-800 rounded-full transition-all duration-500" :style="{ width: `${lesson.progress}%` }"></div>
              </div>
            </div>
            
            <!-- 新建课程按钮 -->
            <div 
              v-if="!isNewLessonDisabled"
              class="w-[8rem] md:w-[10rem] h-[8rem] md:h-[10rem] bg-[#191919] rounded-2xl absolute flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg"
              :class="{ 
                'left-0': isLeftSide(filteredLessons.length), 
                'right-0': !isLeftSide(filteredLessons.length) 
              }" 
              :style="getCardStyle(filteredLessons.length)"
              @click="createNewCourse"
            >
              <PlusIcon class="text-white" :size="40" />
              <div class="text-white text-lg mt-2">新建课程</div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
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

// ==================== 路由相关 ====================
const router = useRouter();
const route = useRoute();

// ==================== 常量定义 ====================
const CARD_CONFIG = {
  size: 160,
  verticalGap: 50,
  minProgress: 100
};

// ==================== 状态管理 ====================
const selectedUnitId = ref(null);
const units = ref([]);
const allLessons = ref([]);

// ==================== 计算属性 ====================
const currentUnit = computed(() => units.value.find(unit => unit.id === selectedUnitId.value));
const filteredLessons = computed(() => allLessons.value);
const isNewLessonDisabled = computed(() => {
  // 如果没有课程，允许创建第一个课程
  if (filteredLessons.value.length === 0) {
    return false;
  }
  
  // 检查最后一个课程是否完成（进度为100%）
  const lastLesson = filteredLessons.value[filteredLessons.value.length - 1];
  return lastLesson && lastLesson.progress < 100;
});
const containerHeight = computed(() => {
  // 计算容器的总高度，加上额外的空间用于hover效果
  const totalCards = filteredLessons.value.length + 1; // +1 是为了新建按钮
  return `${totalCards * (CARD_CONFIG.size + CARD_CONFIG.verticalGap) + 24}px`;
});

// ==================== 布局计算函数 ====================
const isLeftSide = index => index % 2 === 0;
const getCardStyle = index => ({
  top: `${index * (CARD_CONFIG.size + CARD_CONFIG.verticalGap)}px`,
  marginBottom: '1.5rem'
});

// ==================== 数据加载函数 ====================
const fetchVocabularyProgress = async () => {
  console.log('开始获取单元数据...');
  try {
    const response = await getAllUnits();
    console.log('获取单元响应:', response);
    if (response.code === 0) {
      units.value = formatUnitsData(response.data);
      console.log('单元数据格式化完成:', units.value);
    } else {
      console.error('获取单元数据失败:', response);
    }
  } catch (error) {
    console.error('获取单元信息出错:', error);
  }
};

const formatUnitsData = (data) => {
  return data.units.map(unit => ({
    id: unit.id.toString(),
    title: unit.name,
    locked: unit.level > 2,
    progress: calculateProgress(unit.progresses?.words_learned, unit.progresses?.words_total),
    words: `${unit.progresses?.words_learned || 0}/${unit.word_count}`,
    description: unit.description,
    level: unit.level,
    order: unit.order
  }));
};

const calculateProgress = (learned = 0, total = 0) => {
  if (!total) return 0;
  // 确保进度不超过100%
  return Math.min(100, Math.round((learned / total) * 100));
};

// ==================== 本地存储功能 ====================
const STORAGE_KEY = 'lastOpenedUnit';

const saveLastOpenedUnit = (unitId) => {
  try {
    localStorage.setItem(STORAGE_KEY, unitId.toString());
  } catch (error) {
    console.error('保存上次打开的单元失败:', error);
  }
};

const getLastOpenedUnit = () => {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    console.error('获取上次打开的单元失败:', error);
    return null;
  }
};

// ==================== 交互处理函数 ====================
const selectUnit = async (unitId) => {
  console.log('选择单元:', unitId);
  const unit = units.value.find(u => u.id === unitId);
  if (!unit || unit.locked) {
    console.warn('单元不存在或已锁定:', unitId);
    return;
  }
  
  try {
    console.log('获取单元课程:', unitId);
    const response = await getUnitCourses(unitId);
    if (response.code === 0) {
      allLessons.value = formatCoursesData(response.data);
      updateSelectedUnit(unitId);
      console.log('成功加载单元课程:', unitId);
    }
  } catch (error) {
    console.error('选择单元失败:', error);
    showToast('选择单元失败，请稍后重试', 'error');
  }
};

const formatCoursesData = (courses) => {
  return courses.map((course, index) => ({
    id: course.course_id,
    name: `第${index + 1}课`,
    unitId: course.unit_id,
    locked: false,
    progress: calculateProgress(course.words_learned, course.words_total),
    words_learned: course.words_learned,
    words_total: course.words_total,
    is_completed: course.is_completed,
    last_studied_at: course.last_studied_at
  }));
};

const updateSelectedUnit = (unitId) => {
  console.log('更新选中的单元:', unitId);
  selectedUnitId.value = unitId;
  router.push({ 
    path: '/home/reading', 
    query: { unit: unitId } 
  });
  console.log('更新路由参数:', { unit: unitId });
  saveLastOpenedUnit(unitId);
};

const createNewCourse = async () => {
  try {
    const response = await createUnitProgress(selectedUnitId.value.toString());
    if (response.code === 0 && response.data) {
      addNewCourse(response.data);
      showToast('成功创建新课程', 'info');
    }
  } catch (error) {
    console.error('创建新课程失败:', error);
    showToast('创建新课程失败，请稍后重试', 'error');
  }
};

const addNewCourse = (courseData) => {
  const newCourse = {
    id: courseData.course_id,
    name: `第${allLessons.value.length + 1}课`,
    unitId: courseData.unit_id,
    locked: false,
    progress: 0,
    words_learned: 0,
    words_total: courseData.words_total || 0,
    is_completed: false,
    last_studied_at: null
  };
  allLessons.value.push(newCourse);
};

const handleLessonClick = async (lesson) => {
  if (lesson.locked) return;
  try {
    router.push(`/reading/vocabulary/${lesson.id}`);
  } catch (error) {
    console.error('处理课程点击失败:', error);
    showToast('操作失败，请稍后重试', 'error');
  }
};

// ==================== 通知函数 ====================
const showToast = (message, type = 'info') => {
  const toast = createToastElement(message, type);
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
  return toast;
};

const createToastElement = (message, type) => {
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
  
  return toast;
};

const closeToast = (toast) => {
  toast?.parentNode?.removeChild(toast);
};

// ==================== 生命周期钩子 ====================
onMounted(async () => {
  console.log('组件挂载，开始初始化...');
  await fetchVocabularyProgress();
  console.log('单元数据加载完成，准备初始化路由');
  initializeFromRoute();
});

const initializeFromRoute = () => {
  // 优先使用URL中的unit参数
  const { unit } = route.query;
  console.log('从URL获取单元参数:', unit, typeof unit);
  
  if (unit) {
    // 确保单元ID为字符串类型
    const unitId = unit;
    console.log('从URL初始化单元:', unitId);
    selectUnitIfValid(unitId);
    return;
  }
  
  // 如果URL中没有unit参数，尝试从本地存储获取
  const lastOpenedUnit = getLastOpenedUnit();
  console.log('从本地存储获取上次打开的单元:', lastOpenedUnit);
  
  if (lastOpenedUnit) {
    // 确保单元ID为字符串类型
    const unitId = lastOpenedUnit;
    console.log('从本地存储初始化单元:', unitId);
    selectUnitIfValid(unitId);
  }
};

const selectUnitIfValid = async (unitId) => {
  // 等待units加载完成
  if (units.value.length === 0) {
    console.log('单元数据尚未加载完成，等待100ms后重试...');
    setTimeout(() => selectUnitIfValid(unitId), 100);
    return;
  }
  
  console.log('尝试打开单元ID:', unitId, '当前可用单元:', units.value);
  // 使用字符串比较，确保ID类型一致
  const validUnit = units.value.find(u => {
    console.log('比较单元:', u.id, typeof u.id, '目标ID:', unitId.toString(), typeof unitId.toString());
    return u.id === unitId.toString() && !u.locked;
  });
  
  if (validUnit) {
    console.log('找到有效单元:', validUnit);
    // 检查当前选中的单元ID是否已经是目标单元ID
    if (selectedUnitId.value === unitId.toString()) {
      console.log('单元已经被选中，无需重新加载:', unitId.toString());
      return;
    }
    
    try {
      // 直接获取课程数据
      const response = await getUnitCourses(unitId.toString());
      if (response.code === 0) {
        allLessons.value = formatCoursesData(response.data);
        // 设置选中的单元ID
        selectedUnitId.value = unitId.toString();
        // 保存到本地存储
        saveLastOpenedUnit(unitId.toString());
        console.log('成功加载单元课程，单元ID:', unitId.toString());
      }
    } catch (error) {
      console.error('加载单元课程失败:', error);
    }
  } else {
    console.warn('未找到有效单元或单元已锁定，ID:', unitId.toString());
  }
};

// ==================== 路由监听 ====================
watch(() => route.query.unit, (newUnit, oldUnit) => {
  console.log('路由参数变化 unit:', newUnit, typeof newUnit, 'oldUnit:', oldUnit);
  if (!newUnit) {
    selectedUnitId.value = null;
    return;
  }
  
  // 如果新旧值相同，不重复加载
  if (newUnit === oldUnit) {
    console.log('单元ID未变化，跳过重新加载');
    return;
  }
  
  // 直接使用字符串类型的单元ID
  const unitId = newUnit;
  console.log('监听到路由变化，准备选择单元:', unitId);
  selectUnitIfValid(unitId);
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');

.font-inter {
  font-family: 'Inter', sans-serif;
}

.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
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


