<template>
    <div class="Home-page fixed-page">
        <div class="background-effects">
            <div class="gradient-orb top-left"></div>
            <div class="gradient-orb bottom-right"></div>
            <div class="grid-overlay"></div>
        </div>

        <!--Main content-->
        <div class="main-content">
   
            <!--Lesson content-->
            <div class="lesson-container hide-scrollbar">
                <!--Section Header with progress bar-->
                <div class="section-header" @click="toggleUnitSelector">
                    
                    <div class="section-header-content">
                        
                        <div class="section-title">
                            <chevron-down-icon class="chevron-icon" />
                            <span>{{ currentUnitTitle }}</span>
                        </div>

                        <div class="progress-container">
                            <div class="progress-text">
                                <VocabularyIcon class="vocab-icon" :size="14" :style="{ marginRight: '5px', verticalAlign: 'middle' }" />
                                {{ progressText }}
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" :style="progressStyle">
                                    <span class="progress-percentage">{{ progressPercentage }}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 单元选择器 -->
                <div v-if="showUnitSelector" class="unit-selector">
                  啊  
                  <div 
                        v-for="unit in units" 
                        :key="unit.id" 
                        class="unit-item" 
                        :class="{'locked': unit.locked}"
                        @click="selectUnit(unit.id)"
                    >
                        <div class="unit-icon">
                            <UnlockedIcon v-if="!unit.locked" class="lock-icon" :size="20" />
                            <LockedIcon v-else class="lock-icon" :size="20" />
                        </div>
                        <div class="unit-title">{{ unit.title }}</div>
                        <div class="unit-progress-wrapper">
                            <div class="unit-progress-text">
                                <VocabularyIcon class="vocab-icon" :size="14" :style="{ marginRight: '5px', verticalAlign: 'middle' }" />
                                {{ unit.words }}
                            </div>
                            <div class="unit-progress-bar">
                                <div class="unit-progress-fill" :style="{ width: unit.progress + '%' }">
                                    <!-- 移除百分比显示 -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="!showUnitSelector" class="staggered-lesson-container">
                去
                <div class="lesson-card" 
                     v-for="(lesson, index) in filteredLessons" 
                     :key="lesson.id" 
                     :class="{ 'locked': lesson.locked, 'left': isLeftSide(index), 'right': !isLeftSide(index) }" 
                     :style="getCardStyle(index)"
                     @click="handleLessonClick(lesson)">
                   
                    <div class="star-icon">
                     <star-icon class="icon" :size="100" />
                   </div>
                   <div class="lesson-id">{{ lesson.id }}</div>
                   <div class="lesson-progress-bar">
                        <div v-if="!lesson.locked" class="lesson-progress-fill" :style="{ width: lesson.progress + '%' }"></div>
                    </div>
                </div>
            </div>  
        </div>
        
        <!-- Right Sidebar (Empty) -->
    <div class="sidebar right-sidebar">
      <!-- Empty content -->
    </div>
    </div>  
</template>
  
<script setup>
import { ref, computed, onMounted, watch, onActivated } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  HomeIcon,
  AiFriendIcon,
  MethodIcon,
  AnalysisIcon,
  MembershipIcon,
  SettingIcon,
  StarIcon,
  ChevronDownIcon,
  UnlockedIcon,
  LockedIcon
} from '../components/icons';
import VocabularyIcon from '../components/icons/VocabularyIcon.vue';

const router = useRouter();
const route = useRoute();

const cardSize = 160; // 课程卡片的高度
const verticalGap = 50; // 增加垂直间距

const tabs = ref([
  { name: 'Reading', active: true },
  { name: 'Listening', active: false },
  { name: 'Speaking', active: false },
  { name: 'Writing', active: false }
]);

// 添加进度数据
const progress = ref({
  current: 135,
  total: 241
});

// 是否显示单元选择界面
const showUnitSelector = ref(false);

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

// 当前选中的单元ID - 默认设置为第2部分
const currentUnitId = ref(1);

// 获取URL中的单元参数
const getUnitFromUrl = () => {
  if (route.query.unit) {
    const unitId = parseInt(route.query.unit);
    // 检查是否是有效的单元ID且未锁定
    const validUnit = units.value.find(u => u.id === unitId && !u.locked);
    if (validUnit) {
      return unitId;
    }
  }
  return 2; // 默认显示第2部分
};

// 当路由参数变化时更新单元ID
watch(() => route.query.unit, (newUnit) => {
  if (newUnit) {
    const unitId = parseInt(newUnit);
    // 检查是否是有效的单元ID且未锁定
    const validUnit = units.value.find(u => u.id === unitId && !u.locked);
    if (validUnit) {
      currentUnitId.value = unitId;
      updateCurrentUnitDisplay();
    }
  }
});

// 从API获取已学习词汇进度数据
const fetchVocabularyProgress = async () => {
  try {
    // 实际项目中，这里应该调用后端API
    // const response = await fetch('/api/vocabulary/progress');
    // const data = await response.json();
    
    // 模拟后端返回的数据
    const mockApiResponse = {
      totalLearnedWords: 135, // 总已学习单词数
      unitProgress: {
        1: { total: 75, learned: 75 },   // 第1部分
        2: { total: 241, learned: 135 }, // 第2部分
        3: { total: 122, learned: 0 },   // 第3部分
        4: { total: 168, learned: 0 },   // 第4部分
        5: { total: 401, learned: 0 },   // 第5部分
        6: { total: 130, learned: 0 },   // 第6部分
        7: { total: 79, learned: 0 }     // 第7部分
      }
    };
    
    // 使用模拟数据更新UI
    updateProgressFromApi(mockApiResponse);
    
  } catch (error) {
    console.error('Error fetching vocabulary progress:', error);
  }
};

// 使用API返回的数据更新进度
const updateProgressFromApi = (data) => {
  // 更新整体进度
  // progress.value.current = data.totalLearnedWords;
  
  // 更新各单元的进度
  units.value.forEach(unit => {
    const unitData = data.unitProgress[unit.id];
    if (unitData) {
      // 设置进度百分比
      unit.progress = Math.round((unitData.learned / unitData.total) * 100);
      // 更新单词数量显示
      unit.words = `${unitData.learned}/${unitData.total}`;
      
      // 如果是当前选中的单元，更新整体进度显示
      if (unit.id === currentUnitId.value) {
        progress.value.current = unitData.learned;
        progress.value.total = unitData.total;
      }
    }
  });
  
  // 这里可以添加从本地存储加载各关卡的视觉进度条，但不影响总进度
  loadLessonsVisualProgress();
};

// 从本地存储加载各关卡的视觉进度条状态（仅用于UI显示）
const loadLessonsVisualProgress = () => {
  const visibleLessons = filteredLessons.value;
  
  visibleLessons.forEach(lesson => {
    // 优先尝试加载真实的学习进度数据
    const lessonDetails = getLessonDetails(lesson.id);
    if (lessonDetails) {
      // 使用实际学习进度更新视觉进度条
      lesson.progress = Math.round((lessonDetails.learnedWords / lessonDetails.totalWords) * 100);
    }
    
    // 如果本地存储中有视觉进度数据，使用该数据作为备选
    const storedProgress = localStorage.getItem(`lesson_${lesson.id}_visual_progress`);
    if (storedProgress) {
      try {
        const data = JSON.parse(storedProgress);
        // 只有当实际进度为0时才使用本地存储的视觉进度
        if (lesson.progress === 0 && data.progress > 0) {
          lesson.progress = data.progress;
        }
      } catch (e) {
        console.error('Error parsing stored visual progress', e);
      }
    }
  });
};

// 获取特定课程的详细信息（从本地存储或模拟数据）
const getLessonDetails = (id) => {
  // 实际项目中，这里应该从Vuex/Pinia存储或本地存储获取数据
  // 模拟数据
  const lessons = {
    '2-1': { totalWords: 20, learnedWords: 20, progress: 100 },
    '2-2': { totalWords: 30, learnedWords: 9, progress: 30 },
    '2-3': { totalWords: 20, learnedWords: 10, progress: 50 },
    '2-4': { totalWords: 25, learnedWords: 5, progress: 20 },
    '2-5': { totalWords: 22, learnedWords: 0, progress: 0 },
  };
  
  // 检查本地存储中是否有更新的进度数据
  const storedData = localStorage.getItem(`lesson_${id}_progress`);
  if (storedData) {
    try {
      const data = JSON.parse(storedData);
      if (data && data.learnedWords !== undefined) {
        // 使用本地存储的数据更新模拟数据
        if (lessons[id]) {
          lessons[id].learnedWords = data.learnedWords;
          lessons[id].progress = Math.round((data.learnedWords / lessons[id].totalWords) * 100);
        } else {
          // 如果模拟数据中没有这个课程，创建一个新的
          lessons[id] = {
            totalWords: data.totalWords || 20,
            learnedWords: data.learnedWords,
            progress: Math.round((data.learnedWords / (data.totalWords || 20)) * 100)
          };
        }
      }
    } catch (e) {
      console.error('Error parsing stored lesson progress:', e);
    }
  }
  
  return lessons[id] || { totalWords: 20, learnedWords: 0, progress: 0 };
};

// 根据当前选择的单元，更新显示的进度和单元名称
const updateCurrentUnitDisplay = () => {
  const selectedUnit = units.value.find(unit => unit.id === currentUnitId.value);
  if (selectedUnit) {
    // 从单元数据中提取进度信息
    const [learned, total] = selectedUnit.words.split('/');
    progress.value.current = parseInt(learned);
    progress.value.total = parseInt(total);
  }
};

// 计算进度文本和样式
const progressText = computed(() => `${progress.value.current}/${progress.value.total}`);
const progressPercentage = computed(() => Math.round((progress.value.current / progress.value.total) * 100));
const progressStyle = computed(() => ({
  width: `${progressPercentage.value}%`
}));

// 当前选中单元的标题
const currentUnitTitle = computed(() => {
  const unit = units.value.find(u => u.id === currentUnitId.value);
  return unit ? unit.title : '未知单元';
});

// 切换单元选择器的显示状态
const toggleUnitSelector = () => {
  showUnitSelector.value = !showUnitSelector.value;
};

// 选择单元
const selectUnit = (unitId) => {
  if (units.value.find(u => u.id === unitId && !u.locked)) {
    currentUnitId.value = unitId;
    showUnitSelector.value = false;
    updateCurrentUnitDisplay();
  }
};

// 处理课程卡片点击事件
const handleLessonClick = (lesson) => {
  if (!lesson.locked) {
    router.push(`/vocabulary/${lesson.id}`);
  }
};

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
  
  // 其他部分的课程数据...
]);

// 根据当前选中的单元筛选课程
const filteredLessons = computed(() => {
  return allLessons.value.filter(lesson => lesson.unitId === currentUnitId.value);
});

// Methods
const isLeftSide = (index) => {
  return index % 2 === 0; // Even indices on left, odd on right
};

const getCardStyle = (index) => {
  const top = index * (cardSize + verticalGap);
  return {
    top: `${top}px`
  };
};

// 当单元ID变化时，更新显示内容
watch(currentUnitId, () => {
  loadLessonsVisualProgress();
});

// 页面加载时获取最新进度数据
onMounted(() => {
  // 先初始化单元ID，从URL获取
  currentUnitId.value = getUnitFromUrl();
  // 然后获取进度数据
  fetchVocabularyProgress();
});

// 每次组件被激活时刷新显示进度
onActivated(() => {
  loadLessonsVisualProgress();
});

// 页面激活时刷新视觉进度
watch(() => route.path, () => {
  if (route.path === '/reading') {
    loadLessonsVisualProgress();
  }
});

</script>
  
  
<style scoped>
    * {
        touch-action: pan-y;
    }
    
    html, body {
        overflow: hidden !important;
        height: 100% !important;
        width: 100% !important;
        position: fixed !important;
        touch-action: none;
    }
    
    .Home-page {
        display: flex;
        height: 100vh;
        width: 100vw;
        background-color: black;
        color: white;
        overflow: hidden;
        position: relative;
        touch-action: none;
    }

    /* 背景效果 */
    .background-effects {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        overflow: hidden;
        pointer-events: none;
    }

    .gradient-orb {
        position: absolute;
        border-radius: 50%;
        filter: blur(70px);
        pointer-events: none;
    }

    .top-left {
        top: -10%;
        left: -10%;
        width: 45%;
        height: 45%;
        background: linear-gradient(135deg, rgba(74, 153, 233, 0.2) 0%, rgba(49, 89, 163, 0.07) 100%);
        animation: float 15s ease-in-out infinite alternate;
    }

    .bottom-right {
        bottom: -15%;
        right: -15%;
        width: 55%;
        height: 55%;
        background: linear-gradient(225deg, rgba(74, 153, 233, 0.15) 0%, rgba(92, 39, 151, 0.07) 100%);
        animation: float 20s ease-in-out infinite alternate-reverse;
    }

    .grid-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: 
            linear-gradient(to right, rgba(48, 51, 54, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(48, 51, 54, 0.08) 1px, transparent 1px);
        background-size: 25px 25px;
        opacity: 0.3;
        pointer-events: none;
    }

    @keyframes float {
        0% {
            transform: translate(0, 0);
        }
        100% {
            transform: translate(5%, 5%);
        }
    }

    .left-sidebar {
        width: 7rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0;
        border-right: 1px solid #303336;
        height: 100vh;
        position: sticky;
        top: 0;
        z-index: 10;
        background-color: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(5px);
        overflow: hidden;
        touch-action: none;
        flex-shrink: 0;
    }
    
    .right-sidebar {
        width: 6rem;
        border-left: 1px solid #303336;
        position: sticky;
        top: 0;
        height: 100vh;
        z-index: 10;
        background-color: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(5px);
        overflow: hidden;
        touch-action: none;
        flex-shrink: 0;
    }

    @media (max-width: 1024px) {
        .right-sidebar {
            width: 1rem;
        }
    }

    .sidebar-icon {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2.5rem;
        flex: 1;
        padding-top: 3.5rem;
        margin-bottom: 2rem;
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE and Edge */
        touch-action: pan-y;
        -webkit-overflow-scrolling: touch;
    }

    .sidebar-icon::-webkit-scrollbar {
        display: none; /* Chrome, Safari, Opera */
    }

    .icon {
        width: 28px;
        height: 28px;
        opacity: 0.7;
        transition: opacity 0.3s ease, transform 0.3s ease;
        touch-action: none;
        pointer-events: auto;
        cursor: pointer;
    }

    .icon:hover {
        opacity: 1;
        transform: scale(1.1);
    }

    .profile {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-bottom: 2rem;
        margin-top: auto;
        position: relative;
        flex-shrink: 0;
        touch-action: none;
    }

    .profile-text {
        font-size: 0.875rem;
        font-weight: 500;
        opacity: 0.7;
        padding: 0.75rem;
        border-radius: 50%;
        background-color: #303336;
        width: 2.5rem;
        height: 2.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: opacity 0.3s ease, transform 0.3s ease;
        touch-action: none;
        cursor: pointer;
    }

    .profile-text:hover {
        opacity: 1;
        transform: scale(1.05);
    }

    .main-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        overflow-x: hidden;
        height: 100vh;
        position: relative;
        touch-action: pan-y;
        -webkit-overflow-scrolling: touch;
    }

    /* Hide scrollbar for main content */
    .main-content::-webkit-scrollbar {
        width: 0;
        height: 0;
        display: none;
    }

    .main-content {
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
    }

    .nav-tabs {
        display: flex;
        border-bottom: 1px solid #303336;
        font-size: 1.2rem;
        height: 3.5rem;
        position: sticky;
        top: 0;
        background-color: rgba(0, 0, 0, 0.9);
        backdrop-filter: blur(10px);
        z-index: 5;
        touch-action: none;
        pointer-events: auto;
        user-select: none;
    }
    
    .tab {
        width: 25%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0;
        position: relative;
        touch-action: none;
        user-select: none;
        cursor: pointer;
    }

    .tab:hover {
        background-color: rgba(255, 255, 255, 0.151);
    }

    .tab span {
        font-weight: 600;
        transition: all 0.3s ease;
        position: relative;
    }

    .tab:hover span {
        transform: translateY(-2px);
    }

    .tab:not(.active):hover::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 25%;
        height: 2px;
        border-radius: 20px;
        background-color: rgba(74, 153, 233, 0.5);
    }

    .active {
        position: relative;
    }

    .active::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 50%;
        height: 4px;
        border-radius: 20px;
        background-color: #4A99E9;
        right: auto;
        transition: all 0.3s ease;
    }

    .active:hover::after {
        width: 60%;
        background-color: #4A99E9;
        box-shadow: 0 0 10px rgba(74, 153, 233, 0.5);
    }

    /* Lesson Container */
.lesson-container {
  flex: 1;
  padding: 1rem;
  overflow-x: hidden;
  overflow-y: visible;
  touch-action: pan-y;
  -webkit-overflow-scrolling: touch;
}

/* Hide Scrollbar */
.hide-scrollbar::-webkit-scrollbar {
  width: 0;
  height: 0;
  display: none;
}

.hide-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

/* Section Header */
.section-header {
  background-color: rgba(26, 26, 26, 0.7);
  backdrop-filter: blur(5px);
  border-radius: 0.75rem;
  padding: 1rem;
  margin-bottom: 2rem;
  width: 80%;
  align-self: center;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  z-index: 2;
  cursor: pointer;
  transition: all 0.3s ease;
}

.section-header:hover {
  background-color: rgba(26, 26, 26, 0.8);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.section-header-content {
  display: flex;
  align-items: center;
  height: 2.5rem;
  justify-content: flex-start;
}

.section-title {
  display: flex;
  align-items: center;
  width: 50%;
  cursor: pointer;
}

.chevron-icon {
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 0.5rem;
  cursor: pointer;
}

.section-title span {
  font-size: 1.5rem;
  font-weight: 600;
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
  width: 60%;
  margin-left: auto;
}

.progress-text {
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
  white-space: nowrap;
  position: absolute;
  top: -1.2rem;
  right: 0.5rem;
  display: flex;
  align-items: center;
}

.vocab-icon {
  color: white;
  opacity: 0.9;
}

.progress-bar {
  width: 100%;
  height: 1.3rem;
  background-color: #303336;
  border-radius: 9999px;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
}

.progress-fill {
  height: 100%;
  background-color: white;
  border-radius: 9999px;
  transition: width 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: #000;
  font-weight: 600;
  font-size: 0.75rem;
  min-width: 2rem;
}

.progress-percentage {
  padding: 0 0.5rem;
  white-space: nowrap;
  font-size: 1.1rem;
  font-weight: 700;
  margin-left: 0.5rem;
}

/* 单元选择器 */
.unit-selector {
  width: 80%;
  margin: 0 auto 2rem;
  background-color: rgba(26, 26, 26, 0.7);
  backdrop-filter: blur(5px);
  border-radius: 0.75rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  animation: fadeIn 0.3s ease;
  z-index: 3;
  position: relative;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.unit-item {
  display: flex;
  align-items: center;
  padding: 1rem 1rem 1rem;
  background-color: rgba(48, 51, 54, 0.5);
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

.unit-item:hover {
  background-color: rgba(48, 51, 54, 0.8);
  transform: translateY(-2px);
}

.unit-item.locked {
  opacity: 0.3;
  cursor: not-allowed;
  position: relative;
}

.unit-item.locked:hover {
  transform: none;
  background-color: rgba(48, 51, 54, 0.5);
}

.unit-item.locked .unit-progress-bar {
  background-color: rgba(75, 85, 99, 0.5);
}

.unit-icon {
  margin-right: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
}

.lock-icon {
  color: white;
}

.unit-title {
  flex: 1;
  font-weight: 600;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
}

.unit-progress-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 40%;
  position: relative;
  margin-left: auto;
}

.unit-progress-text {
  font-size: 0.875rem;
  margin-bottom: 0.1rem;
  font-weight: 600;
  white-space: nowrap;
  display: flex;
  align-items: center;
  position: absolute;
  top: -1.2rem;
  right: 0.5rem;
}

.unit-progress-bar {
  width: 100%;
  height: 1.3rem;
  background-color: #303336;
  border-radius: 9999px;
  overflow: hidden;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
}

.unit-progress-fill {
  height: 100%;
  background-color: white;
  border-radius: 9999px;
  transition: width 0.3s ease;
}

/* Staggered Lesson Cards */
.staggered-lesson-container {
  position: relative;
  height: 70%;
  margin: 0 auto;
  width: 80%;
  max-width: 50%;
  touch-action: pan-y;
  -webkit-overflow-scrolling: touch;
  pointer-events: auto;
}

.lesson-card {
  width: 10rem;
  height: 10rem;
  border-radius: 0.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 1.5rem;
  position: absolute;
  background-color: rgba(255, 255, 255, 0.95);
  color: black;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(5px);
  touch-action: manipulation;
  user-select: none;
}

.lesson-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
}

.lesson-card.left {
  left: 0;
}

.lesson-card.right {
  right: 0;
}

.lesson-card.locked {
opacity: 0.5;
}

.lesson-card.locked:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
}

.star-icon {
  width: 5rem;
  height: 4rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.lesson-card:hover .star-icon {
  transform: scale(1.1);
}

.star-icon .icon {
  width: 6rem;
  height: 6rem;
}

.lesson-id {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.lesson-progress-bar {
  position: absolute;
  bottom: 1.2rem;
  width: 7rem;
  height: 0.8rem;
  border-radius: 9999px;
  background-color: #000000;
  opacity: 0.5;
  overflow: hidden;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.2), 0 4px 4px rgba(0, 0, 0, 0.25);
}

.lesson-card.locked .lesson-progress-bar {
  background-color: rgba(75, 85, 99, 0.3);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1), 0 4px 4px rgba(0, 0, 0, 0.15);
}

.lesson-card.locked .lesson-progress-fill {
  background-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.15);
}

.lesson-progress-fill {
  height: 100%;
  background-color: white;
  border-radius: 9999px;
  transition: width 0.5s ease;
  box-shadow: 0 0 4px rgba(255, 255, 255, 0.5), 0 4px 4px rgba(0, 0, 0, 0.25);
}

.lesson-card:hover .lesson-progress-bar {
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.2), 0 6px 8px rgba(0, 0, 0, 0.3);
}

.lesson-card:hover .lesson-progress-fill {
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.6), 0 6px 8px rgba(0, 0, 0, 0.3);
}

.lesson-card.locked:hover .lesson-progress-bar {
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1), 0 6px 8px rgba(0, 0, 0, 0.2);
}

.lesson-card.locked:hover .lesson-progress-fill {
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
}

</style>
  
  