<template>
    <div class="px-4 overflow-y-auto h-[calc(100vh-3.5rem)] relative hide-scrollbar">
      <!--Section Header with progress bar-->
      <div class="flex items-center py-4 cursor-pointer mb-4 relative z-2" @click="toggleUnitSelector">
        <div class="flex flex-col w-full gap-3">
          <div class="flex items-center text-2xl font-semibold">
            <chevron-down-icon class="mr-2 opacity-70 transition-transform duration-300" />
            <span>{{ currentUnitTitle }}</span>
          </div>
  
          <div class="flex flex-col gap-2">
            <div class="flex items-center text-sm text-white/70">
              <VocabularyIcon class="mr-1.5 align-middle" :size="14" />
              {{ progressText }}
            </div>
            <div class="h-2 bg-white/10 rounded overflow-hidden">
              <div class="h-full bg-gradient-to-r from-blue-500 to-purple-800 rounded relative transition-all duration-500 flex items-center justify-end" :style="progressStyle">
                <span class="text-xs pr-2 text-white">{{ progressPercentage }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- 单元选择器 -->
      <div v-if="showUnitSelector" class="bg-[rgba(30,30,30,0.9)] rounded-lg p-4 mt-2 flex flex-col gap-3 shadow-lg relative z-3 backdrop-blur-md border border-white/10">
        <div 
          v-for="unit in units" 
          :key="unit.id" 
          class="flex items-center p-3 p-4 rounded-md bg-white/5 cursor-pointer transition-all duration-200 relative hover:bg-white/10"
          :class="{'opacity-50 cursor-not-allowed': unit.locked}"
          @click="selectUnit(unit.id)"
        >
          <div class="mr-4">
            <UnlockedIcon v-if="!unit.locked" class="opacity-80" :size="20" />
            <LockedIcon v-else class="opacity-80" :size="20" />
          </div>
          <div class="flex-1 font-medium">{{ unit.title }}</div>
          <div class="flex flex-col gap-1 min-w-[100px]">
            <div class="text-xs text-white/70 flex items-center">
              <VocabularyIcon class="mr-1.5 align-middle" :size="14" />
              {{ unit.words }}
            </div>
            <div class="h-1 bg-white/10 rounded-sm overflow-hidden">
              <div class="h-full bg-gradient-to-r from-blue-500 to-purple-800 rounded-sm transition-all duration-500" :style="{ width: unit.progress + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
  
      <div v-if="!showUnitSelector" class="relative min-h-full pb-8 mt-8">
        <div class="w-[45%] h-40 bg-white/5 rounded-2xl absolute flex flex-col items-center justify-center cursor-pointer transition-all duration-300 overflow-hidden hover:-translate-y-1.5 hover:bg-white/8"
             v-for="(lesson, index) in filteredLessons" 
             :key="lesson.id" 
             :class="{ 'opacity-50 cursor-not-allowed hover:transform-none hover:bg-white/5': lesson.locked, 'left-0': isLeftSide(index), 'right-0': !isLeftSide(index) }" 
             :style="getCardStyle(index)"
             @click="handleLessonClick(lesson)">
          
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 z-0">
            <star-icon class="icon" :size="100" />
          </div>
          <div class="text-2xl font-semibold mb-2 z-10">{{ lesson.id }}</div>
          <div class="w-3/5 h-1 bg-white/10 rounded-sm overflow-hidden z-10">
            <div v-if="!lesson.locked" class="h-full bg-gradient-to-r from-blue-500 to-purple-800 rounded-sm transition-all duration-500" :style="{ width: lesson.progress + '%' }"></div>
          </div>
          
          <!-- 为已完成的章节添加生成文章按钮 -->
          <div v-if="!lesson.locked && lesson.progress === 100" 
               class="absolute bottom-0 right-0 p-2 z-20"
               @click.stop="generateEssayFromLesson(lesson)">
            <div class="flex items-center gap-1 py-1 px-3 rounded-full bg-gradient-to-r from-blue-500/80 to-purple-800/80 text-sm font-medium transition-all duration-300 hover:from-blue-500 hover:to-purple-800">
              <StarIcon class="text-white" :size="14" />
              <span>生成文章</span>
            </div>
          </div>
        </div>
      </div>  
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
  
  const router = useRouter();
  const route = useRoute();
  
  const cardSize = 160; // 课程卡片的高度
  const verticalGap = 50; // 增加垂直间距
  
  // 是否显示单元选择界面
  const showUnitSelector = ref(false);
  
  // 添加进度数据
  const progress = ref({
    current: 135,
    total: 241
  });
  
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
  const currentUnitId = ref(2);
  
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
    
    // 加载各关卡的视觉进度条
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
      
      // 更新URL参数
      router.push({ 
        path: '/home/reading', 
        query: { unit: unitId } 
      });
    }
  };
  
  // 在课程列表中添加Essay入口
  const lessons = ref([
    // 原有课程
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
    
    // 在课程列表中添加Essay入口
    { id: 'essay-1', title: 'AI Essay', type: 'essay', locked: false, progress: 0 }
  ]);
  
  // 处理课程卡片点击事件
  const handleLessonClick = (lesson) => {
    if (!lesson.locked) {
      if (lesson.type === 'essay') {
        router.push(`/essay/${lesson.id}`);
      } else {
        router.push(`/vocabulary/${lesson.id}`);
      }
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
    if (route.path.includes('/home/reading')) {
      loadLessonsVisualProgress();
    }
  });
  
  // 添加生成文章的函数
  const generateEssay = () => {
    // 获取当前单元的ID
    const unitId = currentUnitId.value;
    
    // 创建一个唯一的essay ID，包含单元信息
    const essayId = `essay-unit-${unitId}`;
    
    // 导航到Essay页面
    router.push(`/essay/${essayId}`);
    
    // 关闭单元选择器
    showUnitSelector.value = false;
  };
  
  // 修改生成文章的函数，接收特定课程参数
  const generateEssayFromLesson = (lesson) => {
    // 获取当前单元的ID
    const unitId = currentUnitId.value;
    
    // 创建一个唯一的essay ID，包含单元和课程信息
    const essayId = `essay-${lesson.id}`;
    
    // 导航到Essay页面
    router.push(`/essay/${essayId}`);
    
    // 阻止事件冒泡，防止触发课程点击事件
    event.stopPropagation();
  };
  </script>
    
  <style>
  /* 只保留一些特殊样式，其他都用Tailwind实现 */
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  </style>