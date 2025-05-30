<template>
  <div class="vocabulary-quiz-container bg-black text-white">
    <!-- 背景效果 -->
    <div class="background-effects">
      <div class="gradient-orb-top"></div>
      <div class="gradient-orb-bottom"></div>
      <div class="grid-pattern"></div>
    </div>

    <!-- 主要内容区域 -->
    <div class="quiz-wrapper">
      <div class="quiz-content">
        <!-- 进度条和返回按钮 -->
        <div class="flex items-center mb-4 gap-4">
          <button 
            class="back-button"
            @click.stop="navigation.handleBack"
          >
            <BackIcon :size="10" />
          </button>
          <div class="flex-1">
            <div class="progress-bar">
              <div class="progress-fill" :style="ui.progressStyle">
                <span class="progress-text">{{ ui.progressText }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 滚动内容区域 -->
        <div class="word-content">
          <div class="word-section">
            <!-- 单词展示区域 -->
            <div class="word-display">
              <h1 class="word-text">
                {{ wordData.currentWord.word }}
              </h1>
              <div class="phonetic-section">
                <EnglishPronunciationButton @click.stop="speech.playPronunciation" />
                <div class="phonetic-text">{{ wordData.currentWord.phonetic }}</div>
              </div>
              <div v-if="!ui.showDefinition" class="divider">
                <div class="divider-line"></div>
                <div class="divider-line-short"></div>
              </div>
              <div v-else class="definition-text">
                {{ wordData.currentWord.definition }}
              </div>
            </div>

            <!-- 例句和相关单词区域 -->
            <div class="examples-section">
              <!-- 例句区域 -->
              <div 
                class="example-card"
                @click.stop="speech.playExampleSentence"
              >
                <p 
                  class="example-text"
                  v-html="wordData.highlightedExample"
                ></p>
                <p 
                  v-if="ui.showDefinition" 
                  class="translation-text"
                >
                  {{ wordData.currentWord.example.translation }}
                </p>
              </div>

              <!-- 相关单词区域 -->
              <div 
                v-if="ui.showDefinition" 
                class="related-words-card"
              >
                <div class="related-words-list">
                  <div 
                    v-for="(relatedWord, index) in wordData.currentWord.relatedWords" 
                    :key="index" 
                    class="related-word-item"
                  >
                    <div class="related-word-header">
                      <span 
                        class="related-word-text"
                        @click.stop="() => speech.playRelatedWord(relatedWord.word)"
                      >
                        {{ relatedWord.word }}
                      </span>
                      <span class="part-of-speech">{{ relatedWord.partOfSpeech }}</span>
                    </div>
                    <div class="related-definition">{{ relatedWord.definition }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 底部按钮区域 -->
        <div class="button-container">
          <!-- 未显示释义时的按钮 -->
          <template v-if="!ui.showDefinition">
            <button 
              class="action-button know-button"
              @click.stop="() => wordLearning.handleResponse('know')"
            >
              认识
            </button>
            <button 
              class="action-button fuzzy-button"
              @click.stop="() => wordLearning.handleResponse('fuzzy')"
            >
              模糊
            </button>
            <button 
              class="action-button unknown-button"
              @click.stop="() => wordLearning.handleResponse('unknown')"
            >
              不认识
            </button>
          </template>
          
          <!-- 显示释义且不是最后一个单词时的按钮 -->
          <template v-else-if="!wordLearning.isLastWord">
            <button 
              class="action-button next-button"
              @click.stop="wordLearning.handleNextWord"
            >
              下一词
            </button>
            <button 
              class="action-button wrong-button"
              @click.stop="wordLearning.handleWrong"
            >
              记错了
            </button>
          </template>
          
          <!-- 学习完成时的按钮 -->
          <template v-else>
            <button 
              class="action-button generate-button"
              @click.stop="navigation.generateEssay"
            >
              生成AI文章
            </button>
            <button 
              class="action-button exit-button"
              @click.stop="navigation.handleBack"
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

// ==================== 常量定义 ====================
const WORD_STATUS = {
  UNLEARNED: 0,  // 未学习
  KNOWN: 1,      // 认识
  FUZZY: 2,      // 模糊
  UNKNOWN: 3     // 不认识
};

// ==================== 默认数据 ====================
const defaultWords = [
  {
    id: 1,
    word: 'explore',
    phonetic: '/ɪkˈsplɔːr/',
    definition: '探索；考察；探究',
    example: {
      text: 'Scientists continue to explore the mysteries of space.',
      translation: '科学家们继续探索太空的奥秘。',
      highlight: 'explore'
    },
    relatedWords: [],
    wordFamily: '基础',
    status: WORD_STATUS.UNLEARNED
  },
  {
    id: 2,
    word: 'universe',
    phonetic: '/ˈjuːnɪvɜːs/',
    definition: '宇宙；万物；世界',
    example: {
      text: 'The universe is constantly expanding.',
      translation: '宇宙在不断膨胀。',
      highlight: 'universe'
    },
    relatedWords: [],
    wordFamily: '基础',
    status: WORD_STATUS.UNLEARNED
  },
  {
    id: 3,
    word: 'galaxy',
    phonetic: '/ˈɡæləksi/',
    definition: '星系；银河系',
    example: {
      text: 'Our solar system is part of the Milky Way galaxy.',
      translation: '我们的太阳系是银河系的一部分。',
      highlight: 'galaxy'
    },
    relatedWords: [],
    wordFamily: '基础',
    status: WORD_STATUS.UNLEARNED
  }
];

// ==================== 数据模块 ====================
const wordData = reactive({
  // 认识的单词队列
  knownQueue: [],
  // 待学习的单词队列（包含不认识和模糊的单词）
  learningQueue: defaultWords,
  
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
    // 优先从学习队列中获取单词
    if (this.learningQueue.length > 0) {
      return this.learningQueue[0];
    }
    return null;
  },
  
  // 高亮例句的计算属性
  get highlightedExample() {
    const example = this.currentWord?.example;
    if (!example) return '';
    return example.text.replace(
      example.highlight, 
      `<span class='text-[#4A99E9] font-semibold'>${example.highlight}</span>`
    );
  },

  // 计算学习进度
  get progress() {
    return this.knownQueue.length / (this.knownQueue.length + this.learningQueue.length) * 100 || 0;
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
    return wordData.progress;
  },
  
  get progressText() {
    return `${Math.round(this.progress)}%`;
  },
  
  get progressStyle() {
    return {
      width: `${this.progress}%`
    };
  }
});

// ==================== 单词学习模块 ====================
const wordLearning = reactive({
  // 是否是最后一个单词
  get isLastWord() {
    return wordData.learningQueue.length === 0;
  },
  
  // 处理用户对单词的响应
  handleResponse(type) {
    console.log(`User responded: ${type}`);
    
    const currentWord = wordData.currentWord;
    if (!currentWord) return;

    // 根据用户响应类型设置相应状态
    const status = type === 'know' ? WORD_STATUS.KNOWN 
                : type === 'fuzzy' ? WORD_STATUS.FUZZY 
                : WORD_STATUS.UNKNOWN;

    // 从路由参数获取course_id
    const courseId = route.params.id;

    // 更新单词状态到后端
    updateWordStatus({
      status,
      word_id: currentWord.id,
      course_id: courseId,
      progress: type === 'know' ? 1 : 0  // 只有认识才增加进度
    }).catch(error => {
      console.error('更新单词状态失败:', error);
    });
    
    // 处理单词队列
    if (type === 'know') {
      // 认识 - 从学习队列移到认识队列
      const word = wordData.learningQueue.shift();
      if (word) {
        wordData.knownQueue.push(word);
      }
    } else {
      // 不认识或模糊 - 移到学习队列末尾
      const word = wordData.learningQueue.shift();
      if (word) {
        wordData.learningQueue.push(word);
      }
    }
    
    // 显示释义界面
    ui.showDefinition = true;
  },
  
  // 处理下一个单词
  async handleNextWord() {
    // 重置显示释义的标志
    ui.showDefinition = false;
    
    // 使用nextTick确保DOM更新后再执行动画
    await nextTick();
  },
  
  // 处理记错了按钮
  handleWrong() {
    const currentWord = wordData.currentWord;
    if (!currentWord) return;

    const courseId = route.params.id;

    // 更新单词状态为不认识
    updateWordStatus({
      status: WORD_STATUS.UNKNOWN,
      word_id: currentWord.id,
      course_id: courseId,
      progress: 0
    }).catch(error => {
      console.error('更新单词状态失败:', error);
    });

    // 如果这个单词在认识队列中，移回学习队列
    const index = wordData.knownQueue.findIndex(w => w.id === currentWord.id);
    if (index !== -1) {
      const word = wordData.knownQueue.splice(index, 1)[0];
      wordData.learningQueue.push(word);
    }
    
    // 继续下一个单词
    this.handleNextWord();
  },
  
  // 获取词汇学习总进度
  async fetchVocabularyProgress() {
    try {
      // 实际项目中替换为真实的API调用
      const total = wordData.learningQueue.length + wordData.knownQueue.length;
      wordData.learningState.totalVocabularyProgress = {
        totalLearnedWords: wordData.knownQueue.length,
        totalWords: total
      };
    } catch (error) {
      console.error('Error fetching vocabulary progress:', error);
    }
  },
  
  // 加载单词数据
  loadWordData() {
    // 首先使用默认数据
    wordData.learningQueue = defaultWords;
    wordData.knownQueue = [];
    
    // 重置UI状态
    ui.showDefinition = false;
    
    // 发起API请求获取真实数据
    getCourseWords(route.params.id)
      .then(response => {
        if (response.code === 0 && response.data) {
          const { words } = response.data;
          
          if (!words || words.length === 0) {
            console.log('API返回数据为空，继续使用默认数据');
            return;
          }
          
          // 转换API返回的词汇数据
          const formattedWords = words.map(word => ({
            id: word.id,
            word: word.word,
            phonetic: word.phonetic,
            definition: word.definition,
            example: {
              text: word.example,
              translation: word.translation,
              highlight: word.word
            },
            relatedWords: [],
            wordFamily: '基础',
            status: word.status || WORD_STATUS.UNLEARNED
          }));
          
          // 更新队列
          wordData.knownQueue = formattedWords.filter(w => w.status === WORD_STATUS.KNOWN);
          wordData.learningQueue = formattedWords.filter(w => w.status !== WORD_STATUS.KNOWN);
          
          console.log('成功加载单元词汇列表:', formattedWords.length, '个单词');
        } else {
          console.error('获取单元词汇列表失败:', response.msg || '未知错误');
          console.log('继续使用默认数据');
        }
      })
      .catch(error => {
        console.error('获取单元词汇列表失败:', error);
        console.log('继续使用默认数据');
      });
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
      wordLearning.fetchVocabularyProgress();
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
      wordLearning.fetchVocabularyProgress();
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
    wordLearning.fetchVocabularyProgress();
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
.vocabulary-quiz-container {
  @apply relative h-full w-full overflow-hidden isolate;
}

.background-effects {
  @apply absolute inset-0 overflow-hidden pointer-events-none isolate -z-10;
}

.gradient-orb-top {
  @apply absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full blur-[70px];
  background: linear-gradient(135deg, rgba(74, 153, 233, 0.2) 0%, rgba(49, 89, 163, 0.07) 100%);
  animation: float 15s ease-in-out infinite alternate;
}

.gradient-orb-bottom {
  @apply absolute bottom-[-15%] right-[-15%] w-[55%] h-[55%] rounded-full blur-[70px];
  background: linear-gradient(225deg, rgba(74, 153, 233, 0.15) 0%, rgba(92, 39, 151, 0.07) 100%);
  animation: float 20s ease-in-out infinite alternate-reverse;
}

.grid-pattern {
  @apply absolute inset-0 opacity-30 pointer-events-none;
  background-image: 
    linear-gradient(to right, rgba(48, 51, 54, 0.08) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(48, 51, 54, 0.08) 1px, transparent 1px);
  background-size: 25px 25px;
}

.quiz-wrapper {
  @apply relative h-full overflow-y-auto;
}

.quiz-content {
  @apply px-6 pt-6 mx-auto w-full max-w-[800px] pb-32;
}

.back-button {
  @apply w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 bg-white/10 hover:bg-white/20;
}

.progress-bar {
  @apply h-4 bg-white/10 rounded overflow-hidden mr-10;
}

.progress-fill {
  @apply h-full bg-gradient-to-r from-[#4A99E9] to-[#5C2797] rounded-full flex items-center justify-end transition-all duration-300;
}

.progress-text {
  @apply text-xl pr-2 text-black font-bold;
}

.word-content {
  @apply overflow-y-auto;
}

.word-section {
  @apply flex flex-col gap-8;
}

.word-display {
  @apply text-center;
}

.word-text {
  @apply text-5xl font-bold mb-2 bg-gradient-to-r from-[#4A99E9] to-[#5C2797] bg-clip-text text-transparent;
}

.phonetic-section {
  @apply flex items-center justify-center gap-2 mb-4;
}

.phonetic-text {
  @apply text-lg text-white/70;
}

.divider {
  @apply flex flex-col items-center gap-2 my-4;
}

.divider-line {
  @apply w-20 h-0.5 bg-white/30;
}

.divider-line-short {
  @apply w-12 h-0.5 bg-white/30;
}

.definition-text {
  @apply text-2xl text-white/90 my-4 animate-fade-in;
}

.examples-section {
  @apply flex flex-col gap-6;
}

.example-card {
  @apply bg-white/5 rounded-lg p-6 mb-4 cursor-pointer hover:bg-white/10 transition-colors duration-200;
}

.example-text {
  @apply text-lg leading-relaxed mb-2;
}

.translation-text {
  @apply text-base text-white/70 animate-fade-in;
}

.related-words-card {
  @apply bg-white/5 rounded-lg p-6 animate-fade-in;
}

.related-words-list {
  @apply flex flex-col gap-4;
}

.related-word-item {
  @apply border-b border-white/10 pb-3 last:border-b-0 last:pb-0;
}

.related-word-header {
  @apply flex items-center gap-2 mb-1;
}

.related-word-text {
  @apply font-semibold text-[#4A99E9] cursor-pointer hover:text-[#5C2797] transition-colors duration-200;
}

.part-of-speech {
  @apply text-sm text-white/60;
}

.related-definition {
  @apply text-[0.95rem] text-white/80;
}

.button-container {
  @apply fixed bottom-0 left-0 right-0 flex gap-4 justify-center py-4 px-6 bg-black/80 backdrop-blur z-10;
}

.action-button {
  @apply flex-1 py-4 rounded-lg font-semibold text-lg transition-all duration-300;
}

.know-button {
  @apply bg-green-500/20 hover:bg-green-500/30 text-white;
}

.fuzzy-button {
  @apply bg-yellow-500/20 hover:bg-yellow-500/30 text-white;
}

.unknown-button {
  @apply bg-red-500/20 hover:bg-red-500/30 text-white;
}

.next-button {
  @apply bg-blue-500/20 hover:bg-blue-500/30 text-white;
}

.wrong-button {
  @apply bg-red-500/20 hover:bg-red-500/30 text-white;
}

.generate-button {
  @apply bg-gradient-to-r from-blue-500 to-purple-800 text-white hover:opacity-90 active:opacity-80;
}

.exit-button {
  @apply bg-[#333] text-white hover:bg-[#444] active:bg-[#555];
}

@keyframes float {
  0% { transform: translate(0, 0); }
  100% { transform: translate(5%, 5%); }
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-in-out;
}
</style>