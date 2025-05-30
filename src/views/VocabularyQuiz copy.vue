<template>
  <div class="h-full w-full bg-black text-white overflow-hidden relative touch-none">
    <!-- 背景效果 -->
    <div class="absolute top-0 left-0 w-full h-full z-0 overflow-hidden pointer-events-none">
      <div class="gradient-orb top-left"></div>
      <div class="gradient-orb bottom-right"></div>
      <div class="grid-overlay"></div>
    </div>

    <!-- 主要内容区域 -->
    <div class="flex flex-col relative z-10 h-full">
      <div class="flex-1 flex flex-col px-6 pt-6 mx-auto w-full h-full max-h-screen">
        <!-- 进度条和返回按钮 -->
        <div class="flex items-center mb-4 gap-4">
          <button 
            class="border-none rounded-full w-8 h-8 flex items-center justify-center cursor-pointer transition-colors duration-200" 
            @click="navigation.handleBack"
          >
            <BackIcon :size="10" />
          </button>
          <div class="flex-1">
            <div class="h-4 bg-white/10 rounded overflow-hidden mr-10">
              <div class="progress-fill" :style="ui.progressStyle">
                <span class="text-xl pr-2 text-black">{{ ui.progressText }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 滚动内容区域 -->
        <div class="flex-1 overflow-y-auto custom-scrollbar w-[100%] m-auto pb-20">
          <div class="flex-1 flex flex-col justify-between gap-8 will-change-transform pb-4 max-w-[800px] m-auto">
            <!-- 单词展示区域 -->
            <div class="text-center animate-fadeIn">
              <h1 class="text-5xl font-bold mb-2 bg-gradient-to-r from-[#4A99E9] to-[#5C2797] bg-clip-text text-transparent will-change-transform">
                {{ wordData.currentWord.word }}
              </h1>
              <div class="flex items-center justify-center gap-2 mb-4">
                <EnglishPronunciationButton @click="speech.playPronunciation" />
                <div class="text-lg text-white/70">{{ wordData.currentWord.phonetic }}</div>
              </div>
              <div v-if="!ui.showDefinition" class="flex flex-col items-center gap-2 my-4">
                <div class="w-20 h-0.5 bg-white/30"></div>
                <div class="w-12 h-0.5 bg-white/30"></div>
              </div>
              <div v-else class="text-2xl text-white/90 my-4 animate-fadeIn">
                {{ wordData.currentWord.definition }}
              </div>
            </div>

            <div class="flex-1 flex flex-col gap-6">
              <!-- 例句区域 -->
              <div 
                class="bg-white/5 rounded-lg p-6 mb-4 will-change-transform cursor-pointer" 
                @click="speech.playExampleSentence"
              >
                <p 
                  class="text-lg leading-relaxed mb-2" 
                  v-html="wordData.highlightedExample"
                ></p>
                <p 
                  v-if="ui.showDefinition" 
                  class="text-base text-white/70 animate-fadeIn"
                >
                  {{ wordData.currentWord.example.translation }}
                </p>
              </div>

              <!-- 相关单词区域 -->
              <div 
                v-if="ui.showDefinition" 
                class="bg-white/5 rounded-lg p-6 animate-fadeIn will-change-transform"
              >
                <div class="flex flex-col gap-4">
                  <div 
                    v-for="(relatedWord, index) in wordData.currentWord.relatedWords" 
                    :key="index" 
                    class="border-b border-white/10 pb-3 last:border-b-0 last:pb-0"
                  >
                    <div class="flex items-center gap-2 mb-1">
                      <span 
                        class="font-semibold text-[#4A99E9] cursor-pointer" 
                        @click="() => speech.playRelatedWord(relatedWord.word)"
                      >
                        {{ relatedWord.word }}
                      </span>
                      <span class="text-sm text-white/60">{{ relatedWord.partOfSpeech }}</span>
                    </div>
                    <div class="text-[0.95rem] text-white/80">{{ relatedWord.definition }}</div>
                  </div>
                </div>
                <div class="mt-4 text-right">
                  <span class="inline-block bg-[rgba(92,39,151,0.3)] px-3 py-1 rounded-full text-sm">
                    {{ wordData.currentWord.wordFamily }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 底部按钮区域 - 修改为固定定位 -->
        <div class="fixed bottom-0 left-0 right-0 flex gap-4 justify-center py-4 px-6 bg-black/80 backdrop-blur-sm z-20">
          <!-- 未显示释义时的按钮 -->
          <template v-if="!ui.showDefinition">
            <button 
              class="flex-1 py-2 rounded-lg text-white font-semibold text-lg transition-all duration-300" 
              @click="() => wordLearning.handleResponse('know')"
            >
              认识
            </button>
            <button 
              class="flex-1 py-4 border-none rounded-lg text-white font-semibold text-lg transition-all duration-300" 
              @click="() => wordLearning.handleResponse('unknown')"
            >
              不认识
            </button>
          </template>
          
          <!-- 显示释义且不是最后一个单词时的按钮 -->
          <template v-else-if="!wordLearning.isLastWord">
            <button 
              class="flex-1 py-4 border-none rounded-lg text-white font-semibold text-lg transition-all duration-300" 
              @click="wordLearning.handleNextWord"
            >
              下一词
            </button>
            <button 
              class="flex-1 py-4 border-none rounded-lg text-white font-semibold text-lg transition-all duration-300" 
              @click="wordLearning.handleWrong"
            >
              记错了
            </button>
          </template>
          
          <!-- 学习完成时的按钮 -->
          <template v-else>
            <button 
              class="flex-1 py-4 border-none rounded-lg bg-gradient-to-r from-blue-500 to-purple-800 text-white font-semibold text-lg transition-all duration-300 hover:opacity-90 active:opacity-80"
              @click="navigation.generateEssay"
            >
              <div class="flex items-center justify-center gap-2">
                <span>生成AI文章</span>
              </div>
            </button>
            <button 
              class="flex-1 py-4 border-none rounded-lg bg-[#333] text-white font-semibold text-lg transition-all duration-300 hover:bg-[#444] active:bg-[#555]" 
              @click="navigation.handleBack"
            >
              退出学习
            </button>
          </template>
        </div>
      </div>
    </div>
  </div>  
</template>

<script setup>
import { ref, computed, reactive, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import BackIcon from '../components/icons/BackIcon.vue';
import EnglishPronunciationButton from '../components/icons/EnglishPronunciationButton.vue';
import { getCourseWords, updateWordStatus } from '@/api/readings';

// ==================== 基础设置 ====================
const router = useRouter();
const route = useRoute();
const lessonId = computed(() => route.params.id || '未知课程');

// ==================== 数据模块 ====================
// 单词数据和状态管理
const wordData = reactive({
  wordList: [
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
      wordFamily: '派生',
      // SM-2算法相关属性
      sm2: {
        interval: 1,
        count: 1,
        efactor: 2.5,
        lastReview: null,
        nextReview: null
      }
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
      wordFamily: '派生',
      sm2: {
        interval: 1,
        count: 1,
        efactor: 2.5,
        lastReview: null,
        nextReview: null
      }
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
      wordFamily: '派生',
      sm2: {
        interval: 1,
        count: 1,
        efactor: 2.5,
        lastReview: null,
        nextReview: null
      }
    }
  ],
  
  // 学习状态
  learningState: {
    totalWords: 0,
    learnedWords: 0,
    currentWordIndex: 0,
    totalVocabularyProgress: {
      totalLearnedWords: 0,
      totalWords: 0
    }
  },
  
  // 当前单词的计算属性
  get currentWord() {
    const index = this.learningState.currentWordIndex;
    return index < this.wordList.length ? this.wordList[index] : this.wordList[0];
  },
  
  // 高亮例句的计算属性
  get highlightedExample() {
    const example = this.currentWord.example;
    return example.text.replace(
      example.highlight, 
      `<span class='text-[#4A99E9] font-semibold'>${example.highlight}</span>`
    );
  }
});

// 会话学习记录
const sessionLearned = ref(0);

// ==================== UI状态模块 ====================
const ui = reactive({
  // 是否显示释义
  showDefinition: false,
  
  // 进度相关计算属性
  get progress() {
    const { currentWordIndex, totalWords } = wordData.learningState;
    // 计算完成百分比：(当前索引 + 1) / 总单词数 * 100
    return totalWords === 0 ? 0 : Math.round(((currentWordIndex + 1) / totalWords) * 100);
  },
  
  get progressText() {
    // 显示百分比
    return `${this.progress}%`;
  },
  
  get progressStyle() {
    return {
      width: `${this.progress}%`
    };
  }
});

// ==================== SM-2算法模块 ====================
const sm2Algorithm = {
  // 计算新的E-Factor
  calculateEFactor(efactor, quality) {
    let newEFactor = efactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    
    if (newEFactor > 2.5) return 2.5;
    else if (newEFactor < 1.3) return 1.3;
    else return Number(newEFactor.toFixed(3));
  },
  
  // 计算下一次复习间隔
  calculateInterval(interval, count, efactor) {
    if (count === 1) return 1;
    if (count === 2) return 6;
    return Math.round(interval * efactor);
  },
  
  // 根据用户响应更新单词的SM-2状态
  updateWordSM2State(word, responseType) {
    // 将响应类型转换为质量评分
    let quality;
    switch (responseType) {
      case 'know': quality = 5; break;
      case 'fuzzy': quality = 3; break;
      case 'unknown': quality = 0; break;
      default: quality = 0;
    }
    
    const sm2 = word.sm2;
    const now = new Date();
    
    // 如果质量评分小于3，重置学习进度
    if (quality < 3) {
      sm2.interval = 1;
      sm2.count = 1;
      sm2.efactor = 2.5;
    } else {
      // 更新间隔和计数
      sm2.interval = this.calculateInterval(sm2.interval, sm2.count, sm2.efactor);
      sm2.count += 1;
      sm2.efactor = this.calculateEFactor(sm2.efactor, quality);
    }
    
    // 更新复习日期
    sm2.lastReview = now.toISOString();
    const nextDate = new Date(now);
    nextDate.setDate(nextDate.getDate() + sm2.interval);
    sm2.nextReview = nextDate.toISOString();
    
    // 保存到localStorage
    this.saveWordToLocalStorage(word);
    
    return {
      needRepeat: quality < 4,
      sm2: sm2
    };
  },
  
  // 保存单词学习状态到localStorage
  saveWordToLocalStorage(word) {
    try {
      const storageKey = `vocabulary_${word.word}`;
      localStorage.setItem(storageKey, JSON.stringify(word.sm2));
    } catch (error) {
      console.error('Error saving word to localStorage:', error);
    }
  },
  
  // 从localStorage加载单词学习状态
  loadWordFromLocalStorage(word) {
    try {
      const storageKey = `vocabulary_${word.word}`;
      const savedData = localStorage.getItem(storageKey);
      if (savedData) {
        word.sm2 = JSON.parse(savedData);
      }
    } catch (error) {
      console.error('Error loading word from localStorage:', error);
    }
  },
  
  // 加载所有单词的学习状态
  loadAllWordsFromLocalStorage(wordList) {
    wordList.forEach(word => this.loadWordFromLocalStorage(word));
  }
};

// ==================== 单词学习模块 ====================
const WORD_STATUS = {
  UNLEARNED: 0,  // 未学习
  KNOWN: 1,      // 认识
  FUZZY: 2,      // 模糊
  UNKNOWN: 3     // 不认识
};

const wordLearning = reactive({
  // 是否是最后一个单词
  get isLastWord() {
    return wordData.learningState.currentWordIndex >= wordData.wordList.length - 1;
  },
  
  // 处理用户对单词的响应
  handleResponse(type) {
    console.log(`User responded: ${type}`);
    
    const currentWord = wordData.currentWord;
    // 根据用户响应类型设置相应状态
    const status = type === 'know' ? WORD_STATUS.KNOWN 
                : type === 'fuzzy' ? WORD_STATUS.FUZZY 
                : WORD_STATUS.UNKNOWN;

    // 从路由参数获取course_id
    const courseId = route.params.id;

    // 非阻塞方式更新单词状态
    updateWordStatus({
      status,
      word_id: currentWord.id,
      course_id:  courseId,
      progress: status === WORD_STATUS.KNOWN ? 1 : 3  // 如果认识就设为1，否则为3
    }).catch(error => {
      console.error('更新单词状态失败:', error);
    });
    
    // 如果用户认识或模糊记得这个单词，增加认识的单词计数
    if (type === 'know' || type === 'fuzzy') {
      sessionLearned.value++;
      // 非阻塞方式更新进度
      this.saveVocabularyProgress().catch(error => {
        console.error('保存进度失败:', error);
      });
      this.fetchVocabularyProgress().catch(error => {
        console.error('获取进度失败:', error);
      });
    }
    
    // 立即显示释义界面
    ui.showDefinition = true;
  },
  
  // 处理下一个单词
  async handleNextWord() {
    // 立即更新当前词索引
    wordData.learningState.currentWordIndex++;
    
    // 重置显示释义的标志
    ui.showDefinition = false;
    
    // 使用nextTick确保DOM更新后再执行动画
    await nextTick();
  },
  
  // 处理记错了按钮
  handleWrong() {
    const currentWord = wordData.currentWord;
    const courseId = route.params.id;

    // 非阻塞方式更新单词状态为不认识
    updateWordStatus({
      status: WORD_STATUS.UNKNOWN,
      word_id: currentWord.id,
      course_id:  courseId,
      progress: 0  // 不认识设为0
    }).catch(error => {
      console.error('更新单词状态失败:', error);
    });

    // 如果之前标记为认识，减少计数
    if (sessionLearned.value > 0) {
      sessionLearned.value--;
      // 非阻塞方式更新进度
      this.saveVocabularyProgress().catch(error => {
        console.error('保存进度失败:', error);
      });
      this.fetchVocabularyProgress().catch(error => {
        console.error('获取进度失败:', error);
      });
    }
    
    // 立即继续下一个单词
    this.handleNextWord();
  },
  
  // 获取词汇学习总进度
  async fetchVocabularyProgress() {
    try {
      // 实际项目中替换为真实的API调用
      // const response = await fetch('/api/vocabulary/progress');
      // const data = await response.json();
      // wordData.learningState.totalVocabularyProgress = data;
      // 模拟API返回的数据
      wordData.learningState.totalVocabularyProgress = {
        totalLearnedWords: 135 + sessionLearned.value,
        totalWords: 241
      };
    } catch (error) {
      console.error('Error fetching vocabulary progress:', error);
    }
  },
  
  // 保存词汇学习总进度
  async saveVocabularyProgress() {
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
      wordData.learningState.totalVocabularyProgress.totalLearnedWords += (sessionLearned.value > 0 ? 1 : -1);
      
    } catch (error) {
      console.error('Error saving vocabulary progress:', error);
    }
  },
  
  // 加载单词数据
  async loadWordData() {
    try {
      // 实际项目中替换为真实的API调用
      // const response = await fetch(`/api/vocabulary/${lessonId.value}`);
      // const data = await response.json();
      // wordData.wordList = data;
      
      // 重置显示释义的标志
      ui.showDefinition = false;
      
      // 从localStorage加载单词学习状态
      sm2Algorithm.loadAllWordsFromLocalStorage(wordData.wordList);
      
      // 模拟获取学习状态数据
      const lessonDetails = this.getLessonDetails(lessonId.value);
      if (lessonDetails) {
        wordData.learningState = {
          ...wordData.learningState,
          totalWords: lessonDetails.totalWords,
          learnedWords: lessonDetails.learnedWords
        };
      }
    } catch (error) {
      console.error('Error loading word data:', error);
    }
  },
  
  // 获取特定课程的详细信息
  getLessonDetails(id) {
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
  }
});

// ==================== 语音模块 ====================
const speech = reactive({
  // 播放单词发音
  playPronunciation() {
    this.playSpeech(wordData.currentWord.word);
  },
  
  // 播放例句
  playExampleSentence() {
    this.playSpeech(wordData.currentWord.example.text);
  },
  
  // 播放相关词
  playRelatedWord(word) {
    this.playSpeech(word);
  },
  
  // 通用语音播放函数
  playSpeech(text) {
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
    }
  }
});

// ==================== 导航模块 ====================
const navigation = reactive({
  // 解析lessonId，获取单元ID
  get unitId() {
    const id = lessonId.value;
    // 假设lessonId的格式是 "单元ID-课程序号"，例如"2-3"表示第2单元的第3课
    if (id && id.includes('-')) {
      return parseInt(id.split('-')[0]);
    }
    return null;
  },
  
  // 返回前保存进度并导航到特定单元
  handleBack() {
    // 保存进度到后端（如果有未保存的进度）
    if (sessionLearned.value !== 0) {
      wordLearning.saveVocabularyProgress();
    }
    
    // 重置会话学习计数
    sessionLearned.value = 0;
    
    // 获取单元ID并导航回Home页面，同时传递单元ID
    if (this.unitId) {
      // 使用查询参数传递单元ID
      router.push(`/reading?unit=${this.unitId}`);
    } else {
      router.push('/reading');
    }
  },
  
  // 生成AI文章
  generateEssay() {
    // 创建一个唯一的essay ID，包含单元信息
    const essayId = `essay-unit-${this.unitId}`;
    
    // 保存进度到后端（如果有未保存的进度）
    if (sessionLearned.value !== 0) {
      wordLearning.saveVocabularyProgress();
    }
    
    // 重置会话学习计数
    sessionLearned.value = 0;
    
    // 导航到Essay页面
    router.push(`/reading/essay/${essayId}`);
  }
});

// ==================== 生命周期钩子 ====================
onMounted(() => {
  // 预加载语音合成引擎
  if ('speechSynthesis' in window) {
    window.speechSynthesis.getVoices();
  }
  
  // 获取总体词汇进度
  wordLearning.fetchVocabularyProgress();
  
  // 初始化学习状态
  const lessonDetails = wordLearning.getLessonDetails(lessonId.value);
  if (lessonDetails) {
    wordData.learningState = {
      ...wordData.learningState,
      totalWords: lessonDetails.totalWords,
      learnedWords: lessonDetails.learnedWords,
      currentWordIndex: 0
    };
  }
  
  // 加载单词数据
  wordLearning.loadWordData();
});

onBeforeUnmount(() => {
  // 保存进度到后端（如果有未保存的进度）
  if (sessionLearned.value !== 0) {
    wordLearning.saveVocabularyProgress();
  }
  
  // 重置会话学习计数
  sessionLearned.value = 0;
  
  // 取消任何正在进行的语音合成
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
});

// 获取单元词汇列表
const fetchUnitWords = async () => {
  try {
    // 默认使用固定的unit_id
    const unitId = route.params.id;
    
    const response = await getCourseWords(unitId);
    
    if (response.code === 0 && response.data) {
      const { words } = response.data;
      
      // 转换API返回的词汇数据为组件需要的格式
      const formattedWords = words.map(word => ({
        id: word.id,
        word: word.word,
        phonetic: word.phonetic,
        definition: word.definition,
        example: {
          text: word.example,
          translation: word.translation,
          highlight: word.word // 默认高亮单词本身
        },
        relatedWords: [], // API暂无相关单词数据
        wordFamily: '基础', // API暂无单词家族数据
        sm2: {
          interval: 1,
          count: 1,
          efactor: 2.5,
          lastReview: null,
          nextReview: null
        }
      }));
      
      // 更新单词列表
      wordData.wordList = formattedWords;
      
      // 更新学习状态
      wordData.learningState = {
        totalWords: formattedWords.length,
        learnedWords: 0,
        currentWordIndex: 0,
        totalVocabularyProgress: {
          totalLearnedWords: 0,
          totalWords: formattedWords.length
        }
      };
      
      // 重置UI状态
      ui.showDefinition = false;
      
      console.log('成功加载单元词汇列表:', formattedWords.length, '个单词');
    } else {
      console.error('获取单元词汇列表失败:', response.msg || '未知错误');
    }
  } catch (error) {
    console.error('获取单元词汇列表出错:', error);
  }
};

// 生命周期钩子
onMounted(async () => {
  // 获取单元词汇列表
  await fetchUnitWords();
  
  // 初始化语音合成
  speech.initSpeechSynthesis();
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
  -webkit-overflow-scrolling: touch; /* 增加iOS滚动支持 */
  overscroll-behavior: contain; /* 防止滚动穿透 */
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

/* 背景效果 */
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

/* 进度条样式 */
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4A99E9 0%, #5C2797 100%);
  border-radius: 4rem;
  transition: width 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  
  span {
    margin-right: 10px;
    font-weight: bold;
  }
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

/* 确保内容区域不被底部按钮遮挡 */
.pb-20 {
  padding-bottom: 5rem !important;
}

/* 底部按钮区域样式 */
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
</style>