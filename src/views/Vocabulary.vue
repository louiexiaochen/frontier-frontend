<template>
    <div class="h-screen w-screen bg-black text-white overflow-hidden relative touch-none">
      <div class="absolute top-0 left-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <div class="gradient-orb top-left"></div>
        <div class="gradient-orb bottom-right"></div>
        <div class="grid-overlay"></div>
      </div>
  
      <!--Vocabulary content-->
      <div class="flex flex-col relative z-10 h-full">
        <!-- Content Area -->
        <div class="flex-1 flex flex-col p-4 max-w-[800px] mx-auto w-full h-full">
          <!-- Progress Bar and Back Button -->
          <div class="flex items-center mb-8 gap-4">
            <button class="bg-white/10 border-none rounded-full w-8 h-8 flex items-center justify-center cursor-pointer transition-colors duration-200 hover:bg-white/20" @click="handleBack">
              <BackIcon :size="10" />
            </button>
            <div class="flex-1">
              <div class="h-2 bg-white/10 rounded overflow-hidden">
                <div class="progress-fill" :style="progressStyle">
                  <span class="text-xs pr-2 text-white">{{ progressText }}</span>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Scrollable Content Area -->
          <div class="flex-1 overflow-y-auto custom-scrollbar">
            <div class="flex-1 flex flex-col justify-between gap-8 will-change-transform pb-4">
              <div class="text-center animate-fadeIn">
                <h1 class="text-5xl font-bold mb-2 bg-gradient-to-r from-[#4A99E9] to-[#5C2797] bg-clip-text text-transparent will-change-transform">{{ currentWord.word }}</h1>
                <div class="flex items-center justify-center gap-2 mb-4">
                  <EnglishPronunciationButton @click="playPronunciation" />
                  <div class="text-lg text-white/70">{{ currentWord.phonetic }}</div>
                </div>
                <div v-if="!showDefinition" class="flex flex-col items-center gap-2 my-4">
                  <div class="w-20 h-0.5 bg-white/30"></div>
                  <div class="w-12 h-0.5 bg-white/30"></div>
                </div>
                <div v-else class="text-2xl text-white/90 my-4 animate-fadeIn">
                  {{ currentWord.definition }}
                </div>
              </div>
    
              <div class="flex-1 flex flex-col gap-6">
                <!-- Example Sentence -->
                <div class="bg-white/5 rounded-lg p-6 mb-4 will-change-transform cursor-pointer" @click="playExampleSentence">
                  <p class="text-lg leading-relaxed mb-2" v-html="
                  currentWord.example.text.replace(
                      currentWord.example.highlight, 
                      `<span class='text-[#4A99E9] font-semibold'>${currentWord.example.highlight}</span>`
                  )
                  "></p>
                  <p v-if="showDefinition" class="text-base text-white/70 animate-fadeIn">{{ currentWord.example.translation }}</p>
                </div>
    
                <!-- Related Words -->
                <div v-if="showDefinition" class="bg-white/5 rounded-lg p-6 animate-fadeIn will-change-transform">
                  <div class="flex flex-col gap-4">
                    <div v-for="(relatedWord, index) in currentWord.relatedWords" :key="index" class="border-b border-white/10 pb-3 last:border-b-0 last:pb-0">
                      <div class="flex items-center gap-2 mb-1">
                        <span class="font-semibold text-[#4A99E9] cursor-pointer" @click="playRelatedWord(relatedWord.word)">{{ relatedWord.word }}</span>
                        <span class="text-sm text-white/60">{{ relatedWord.partOfSpeech }}</span>
                      </div>
                      <div class="text-[0.95rem] text-white/80">{{ relatedWord.definition }}</div>
                    </div>
                  </div>
                  <div class="mt-4 text-right">
                    <span class="inline-block bg-[rgba(92,39,151,0.3)] px-3 py-1 rounded-full text-sm">{{ currentWord.wordFamily }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Fixed Bottom Buttons -->
          <div class="flex gap-4 mt-4 justify-center py-4">
            <template v-if="!showDefinition">
              <button class="flex-1 py-4 border-none rounded-lg bg-[#4A99E9] text-white font-semibold text-lg transition-all duration-300 hover:bg-[#3a89d9] active:bg-[#2a79c9]" @click="handleResponse('know')">认识</button>
              <button class="flex-1 py-4 border-none rounded-lg bg-[#8e44ad] text-white font-semibold text-lg transition-all duration-300 hover:bg-[#7e349d] active:bg-[#6e249d]" @click="handleResponse('fuzzy')">模糊</button>
              <button class="flex-1 py-4 border-none rounded-lg bg-[#333] text-white font-semibold text-lg transition-all duration-300 hover:bg-[#444] active:bg-[#555]" @click="handleResponse('unknown')">不认识</button>
            </template>
            <template v-else-if="learningState.currentWordIndex < wordList.length - 1">
              <button class="flex-1 py-4 border-none rounded-lg bg-[#4A99E9] text-white font-semibold text-lg transition-all duration-300 hover:bg-[#3a89d9] active:bg-[#2a79c9]" @click="handleNextWord">下一词</button>
              <button class="flex-1 py-4 border-none rounded-lg bg-[#e74c3c] text-white font-semibold text-lg transition-all duration-300 hover:bg-[#d73c2c] active:bg-[#c72c1c]" @click="handleWrong">记错了</button>
            </template>
            <template v-else>
              <button class="flex-1 py-4 border-none rounded-lg bg-gradient-to-r from-blue-500 to-purple-800 text-white font-semibold text-lg transition-all duration-300 hover:opacity-90 active:opacity-80"
              @click="generateEssay">
                <div class="flex items-center justify-center gap-2">
                  <span>生成AI文章</span>
                </div>
              </button>
              <button class="flex-1 py-4 border-none rounded-lg bg-[#333] text-white font-semibold text-lg transition-all duration-300 hover:bg-[#444] active:bg-[#555]" @click="handleBack">退出学习</button>
            </template>
          </div>
        </div>
      </div>
    </div>  
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import BackIcon from '../components/icons/BackIcon.vue';
  import EnglishPronunciationButton from '../components/icons/EnglishPronunciationButton.vue';
  import { StarIcon } from '../components/icons'; // 导入 StarIcon 组件
  
  const router = useRouter();
  const route = useRoute();
  const lessonId = computed(() => route.params.id || '未知课程');
  
  // 当前学习状态
  const learningState = ref({
    totalWords: 0,
    learnedWords: 0,
    currentWordIndex: 0,
    totalVocabularyProgress: {
      totalLearnedWords: 0,
      totalWords: 0
    }
  });
  
  // 记录本次学习过程中认识的单词数
  const sessionLearned = ref(0);
  
  // 显示释义界面标志
  const showDefinition = ref(false);
  
  // 单词列表
  const wordList = ref([
    {
      word: 'parasite',
      phonetic: '/pærəsaɪt/',
      definition: 'n. 寄生虫，寄生动植物',
      example: {
        text: 'Many diseases are caused by parasites.',
        translation: '许多疾病都是由寄生虫引起的。',
        highlight: 'parasites'
      },
      relatedWords: [
        { word: 'parasitic', partOfSpeech: 'adj.', definition: '寄生的；由寄生虫引起的' },
        { word: 'parasitize', partOfSpeech: 'v.', definition: '寄生于；侵害；使寄生' },
        { word: 'parasitism', partOfSpeech: 'n.', definition: '寄生现象；寄生状态' }
      ],
      wordFamily: '派生'
    },
    {
      word: 'abundant',
      phonetic: '/əˈbʌndənt/',
      definition: 'adj. 丰富的；充裕的；大量的',
      example: {
        text: 'The region has abundant natural resources.',
        translation: '该地区拥有丰富的自然资源。',
        highlight: 'abundant'
      },
      relatedWords: [
        { word: 'abundance', partOfSpeech: 'n.', definition: '丰富，充裕；大量' },
        { word: 'abundantly', partOfSpeech: 'adv.', definition: '丰富地；大量地' }
      ],
      wordFamily: '派生'
    },
    {
      word: 'crucial',
      phonetic: '/ˈkruːʃl/',
      definition: 'adj. 关键的；决定性的；至关重要的',
      example: {
        text: 'Getting enough sleep is crucial for good health.',
        translation: '获得充足的睡眠对健康至关重要。',
        highlight: 'crucial'
      },
      relatedWords: [
        { word: 'crucially', partOfSpeech: 'adv.', definition: '至关重要地；决定性地' }
      ],
      wordFamily: '派生'
    }
  ]);
  
  // 当前单词
  const currentWord = computed(() => {
    const index = learningState.value.currentWordIndex;
    return index < wordList.value.length ? wordList.value[index] : wordList.value[0];
  });
  
  // 获取词汇学习总进度（从后端API）
  const fetchVocabularyProgress = async () => {
    try {
      // 实际项目中替换为真实的API调用
      // const response = await fetch('/api/vocabulary/progress');
      // const data = await response.json();
      // learningState.value.totalVocabularyProgress = data;
      
      // 模拟API返回的数据
      learningState.value.totalVocabularyProgress = {
        totalLearnedWords: 135 + sessionLearned.value,
        totalWords: 241
      };
    } catch (error) {
      console.error('Error fetching vocabulary progress:', error);
    }
  };
  
  // 加载单词数据的函数
  const loadWordData = async () => {
    try {
      // 实际项目中替换为真实的API调用
      // const response = await fetch(`/api/vocabulary/${lessonId.value}`);
      // const data = await response.json();
      // wordList.value = data;
      
      // 重置显示释义的标志
      showDefinition.value = false;
      
      // 模拟获取学习状态数据
      const lessonDetails = getLessonDetails(lessonId.value);
      if (lessonDetails) {
        learningState.value = {
          ...learningState.value,
          totalWords: lessonDetails.totalWords,
          learnedWords: lessonDetails.learnedWords
        };
      }
    } catch (error) {
      console.error('Error loading word data:', error);
    }
  };
  
  // 播放发音的函数 - 使用Web Speech API
  const playPronunciation = () => {
    playSpeech(currentWord.value.word);
  };
  
  // 播放例句的函数
  const playExampleSentence = () => {
    playSpeech(currentWord.value.example.text);
  };
  
  // 播放相关词的函数
  const playRelatedWord = (word) => {
    playSpeech(word);
  };
  
  // 通用语音播放函数
  const playSpeech = (text) => {
    // 检查浏览器是否支持语音合成
    if ('speechSynthesis' in window) {
      // 创建一个新的SpeechSynthesisUtterance实例
      const utterance = new SpeechSynthesisUtterance(text);
      
      // 设置语言为英语
      utterance.lang = 'en-US';
      
      // 获取可用的语音
      const voices = window.speechSynthesis.getVoices();
      
      // 尝试找到一个英语女声
      const englishVoice = voices.find(voice => 
        voice.lang.includes('en') && voice.name.includes('Female')
      ) || voices.find(voice => voice.lang.includes('en'));
      
      // 如果找到了英语语音，则使用它
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
      
      // 设置音量、语速和音调
      utterance.volume = 1; // 0到1
      utterance.rate = 0.9; // 0.1到10
      utterance.pitch = 1; // 0到2
      
      // 播放语音
      window.speechSynthesis.speak(utterance);
      
      console.log(`Playing pronunciation for: ${text}`);
    } else {
      console.warn('当前浏览器不支持语音合成API');
      // 可以在这里添加一个提示或回退方案
    }
  };
  
  // 进度数据 - 仅显示本课程的视觉进度，不影响总体进度
  const progress = computed(() => {
    // 使用后端返回的总体词汇进度，而不是基于本地认识/不认识的计算
    const totalProgress = learningState.value.totalVocabularyProgress;
    if (totalProgress.totalWords === 0) return 0;
    return Math.round((totalProgress.totalLearnedWords / totalProgress.totalWords) * 100);
  });
  
  const progressText = computed(() => `${progress.value}%`);
  const progressStyle = computed(() => ({
    width: `${progress.value}%`
  }));
  
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
    
    return lessons[id] || { totalWords: 20, learnedWords: 0, progress: 0 };
  };
  
  // 保存词汇学习总进度（发送到后端API）
  const saveVocabularyProgress = async () => {
    try {
      // 实际项目中应调用API将数据保存到后端
      // const response = await fetch('/api/vocabulary/progress', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     newLearnedWords: sessionLearned.value,
      //     lessonId: lessonId.value
      //   })
      // });
      
      console.log(`Saving vocabulary progress to backend for lesson ${lessonId.value}`);
      
      // 这里只是模拟后端更新
      learningState.value.totalVocabularyProgress.totalLearnedWords += (sessionLearned.value > 0 ? 1 : -1);
      
    } catch (error) {
      console.error('Error saving vocabulary progress:', error);
    }
  };
  
  // 用户回答的处理函数
  const handleResponse = async (type) => {
    console.log(`User responded: ${type}`);
    
    // 如果用户认识或模糊记得这个单词，增加认识的单词计数
    if (type === 'know' || type === 'fuzzy') {
      sessionLearned.value++;
      
      // 保存进度到后端
      await saveVocabularyProgress();
      
      // 刷新进度数据（在实际项目中会调用后端API）
      await fetchVocabularyProgress();
    }
    
    // 显示释义界面
    showDefinition.value = true;
  };
  
  // 添加生成文章的函数
  const generateEssay = () => {
    // 获取当前单元的ID
    const unitId = getUnitIdFromLessonId.value;
    
    // 创建一个唯一的essay ID，包含单元信息
    const essayId = `essay-unit-${unitId}`;
    
    // 保存进度到后端（如果有未保存的进度）
    if (sessionLearned.value !== 0) {
      saveVocabularyProgress();
    }
    
    // 重置会话学习计数
    sessionLearned.value = 0;
    
    // 导航到Essay页面
    router.push(`/essay/${essayId}`);
  };
  
  // 处理下一个单词
  const handleNextWord = async () => {
    // 更新当前词索引
    learningState.value = {
      ...learningState.value,
      currentWordIndex: learningState.value.currentWordIndex + 1
    };
    
    // 重置显示释义的标志
    showDefinition.value = false;
    
    // 使用nextTick确保DOM更新后再执行动画
    await nextTick();
  };
  
  // 处理记错了按钮
  const handleWrong = async () => {
    // 如果之前标记为认识，减少计数
    if (sessionLearned.value > 0) {
      sessionLearned.value--;
      
      // 更新进度到后端
      await saveVocabularyProgress();
      
      // 刷新进度数据
      await fetchVocabularyProgress();
    }
    
    // 继续下一个单词
    await handleNextWord();
  };
  
  // 解析lessonId，获取单元ID
  const getUnitIdFromLessonId = computed(() => {
    const id = lessonId.value;
    // 假设lessonId的格式是 "单元ID-课程序号"，例如"2-3"表示第2单元的第3课
    if (id && id.includes('-')) {
      return parseInt(id.split('-')[0]);
    }
    return null;
  });
  
  // 返回前保存进度并导航到特定单元
  const handleBack = () => {
    // 保存进度到后端（如果有未保存的进度）
    if (sessionLearned.value !== 0) {
      saveVocabularyProgress();
    }
    
    // 重置会话学习计数
    sessionLearned.value = 0;
    
    // 获取单元ID并导航回Home页面，同时传递单元ID
    const unitId = getUnitIdFromLessonId.value;
    if (unitId) {
      // 使用查询参数传递单元ID
      router.push(`/reading?unit=${unitId}`);
    } else {
      router.push('/reading');
    }
  };
  
  // 页面加载时获取单词数据和课程信息
  onMounted(() => {
    // 预加载语音合成引擎
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
    
    // 获取总体词汇进度
    fetchVocabularyProgress();
    
    // 初始化学习状态
    const lessonDetails = getLessonDetails(lessonId.value);
    if (lessonDetails) {
      learningState.value = {
        ...learningState.value,
        totalWords: lessonDetails.totalWords,
        learnedWords: lessonDetails.learnedWords,
        currentWordIndex: 0
      };
    }
    
    // 加载单词数据
    loadWordData();
  });
  
  // 离开页面前保存进度
  onBeforeUnmount(() => {
    // 保存进度到后端（如果有未保存的进度）
    if (sessionLearned.value !== 0) {
      saveVocabularyProgress();
    }
    
    // 重置会话学习计数
    sessionLearned.value = 0;
    
    // 取消任何正在进行的语音合成
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  });
  </script>
  
  <style scoped>
  * {
    touch-action: pan-y;
  }
  
  /* 自定义滚动条样式 */
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
  }
  
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
  
  /* 背景效果 - 保留原样，因为这些效果在Tailwind中较难实现 */
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
  
  /* 进度条样式 - 保留原样，因为渐变效果在Tailwind中需要自定义 */
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #4A99E9 0%, #5C2797 100%);
    border-radius: 0.25rem;
    transition: width 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  
  /* 动画效果 */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-in-out;
  }
  </style>