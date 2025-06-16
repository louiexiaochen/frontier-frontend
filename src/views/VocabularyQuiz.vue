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
            <div v-if="wordData.currentWord" class="text-center animate-fadeIn">
              <h1 class="text-4xl font-bold mb-2 bg-gradient-to-r from-[#4A99E9] to-[#5C2797] bg-clip-text text-transparent will-change-transform leading-relaxed py-2">
                {{ wordData.currentWord.content }}
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
            <div v-else class="text-center py-20">
              <h2 class="text-2xl text-white/70">恭喜！你已完成所有单词学习</h2>
              <p class="mt-4 text-white/50">可以选择退出学习或生成AI文章</p>
            </div>

            <div v-if="wordData.currentWord" class="flex-1 flex flex-col gap-6">
              <!-- 例句区域 -->
              <div 
                v-if="wordData.currentWord?.example?.text"
                class="bg-white/5 rounded-lg p-6 mb-4 will-change-transform cursor-pointer" 
                @click="speech.playExampleSentence"
              >
                <p 
                  class="text-lg leading-relaxed mb-2" 
                  v-html="wordData.highlightedExample"
                ></p>
                <p 
                  v-if="ui.showDefinition && wordData.currentWord?.example?.translation" 
                  class="text-base text-white/70 animate-fadeIn"
                >
                  {{ wordData.currentWord.example.translation }}
                </p>
              </div>

              <!-- 相关单词区域 -->
              <div 
                v-if="ui.showDefinition && hasRelatedWords" 
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
                      <span v-if="relatedWord.partOfSpeech" class="text-sm text-white/60">{{ relatedWord.partOfSpeech }}</span>
                    </div>
                    <div v-if="relatedWord.definition" class="text-[0.95rem] text-white/80">{{ relatedWord.definition }}</div>
                  </div>
                </div>
                <div v-if="wordData.currentWord.wordFamily" class="mt-4 text-right">
                  <span class="inline-block bg-[rgba(92,39,151,0.3)] px-3 py-1 rounded-full text-sm">
                    {{ wordData.currentWord.wordFamily }}
                  </span>
                </div>
              </div>

              <!-- 空内容提示 -->
              <div 
                v-if="ui.showDefinition && !hasExampleOrRelatedWords" 
                class="bg-white/5 rounded-lg p-6 text-center text-white/50"
              >
                暂无更多补充内容
              </div>
            </div>
          </div>
        </div>

        <!-- 底部按钮区域 - 修改为固定定位 -->
        <div class="fixed bottom-0 left-0 right-0 flex gap-4 justify-center py-4 px-6 bg-black/80 backdrop-blur-sm z-20">
          <!-- 未显示释义时的按钮 -->
          <template v-if="wordData.currentWord && !ui.showDefinition">
            <button 
              class="flex-1 py-4 border-none rounded-lg bg-green-500/20 hover:bg-green-500/30 text-white font-semibold text-lg transition-all duration-300" 
              @click="() => wordLearning.handleResponse('know')"
            >
              认识
            </button>
            <button 
              class="flex-1 py-4 border-none rounded-lg bg-yellow-500/20 hover:bg-yellow-500/30 text-white font-semibold text-lg transition-all duration-300" 
              @click="() => wordLearning.handleResponse('fuzzy')"
            >
              模糊
            </button>
            <button 
              class="flex-1 py-4 border-none rounded-lg bg-red-500/20 hover:bg-red-500/30 text-white font-semibold text-lg transition-all duration-300" 
              @click="() => wordLearning.handleResponse('unknown')"
            >
              不认识
            </button>
          </template>
          
          <!-- 显示释义且不是最后一个单词时的按钮 -->
          <template v-else-if="wordData.currentWord && ui.showDefinition">
            <button 
              class="flex-1 py-4 border-none rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-white font-semibold text-lg transition-all duration-300" 
              @click="wordLearning.handleNextWord"
            >
              下一词
            </button>
            <button 
              class="flex-1 py-4 border-none rounded-lg bg-red-500/20 hover:bg-red-500/30 text-white font-semibold text-lg transition-all duration-300" 
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
import { getCourseWords, updateWordStatus, completeCourse } from '@/api/readings';
import { useReadingStore } from '@/stores/reading';

// ==================== 常量定义 ====================
const WORD_STATUS = {
  UNLEARNED: 0,
  KNOWN: 1,
  FUZZY: 2,
  UNKNOWN: 3
};

// ==================== 状态管理 ====================
const router = useRouter();
const route = useRoute();
const lessonId = computed(() => route.params.id || '未知课程');
const readingStore = useReadingStore();

const wordData = reactive({
  knownQueue: [],
  learningQueue: [],
  currentWord: null,
  
  learningState: {
    totalWords: 0,
    learnedWords: 0,
    currentWordIndex: 0,
    totalVocabularyProgress: {
      totalLearnedWords: 0,
      totalWords: 0
    }
  },
  
  get highlightedExample() {
    const { example } = this.currentWord ?? {};
    if (!example?.text || !example?.highlight) return '';
    
    try {
    return example.text.replace(
      example.highlight, 
      `<span class='text-[#4A99E9] font-semibold'>${example.highlight}</span>`
    );
    } catch {
      return example.text;
    }
  },

  get progress() {
    const total = this.knownQueue.length + this.learningQueue.length;
    return total ? (this.knownQueue.length / total * 100) : 0;
  }
});

const ui = reactive({
  showDefinition: false,
  progress: computed(() => wordData.progress),
  progressText: computed(() => `${Math.round(wordData.progress)}%`),
  progressStyle: computed(() => ({ width: `${wordData.progress}%` }))
});

// ==================== 计算属性 ====================
const hasRelatedWords = computed(() => wordData.currentWord?.relatedWords?.length > 0);
const hasExampleOrRelatedWords = computed(() => 
  Boolean(wordData.currentWord?.example?.text || hasRelatedWords.value)
);

// ==================== 工具函数 ====================
const formatWord = (word, studyIds = []) => ({
  id: word.id,
  content: word.content,
  phonetic: word.phonetic?.trim() ?? '',
  definition: word.meaning?.trim() ?? '',
  example: word.example ? {
    text: word.example.trim(),
    translation: word.translation?.trim() ?? '',
    highlight: word.content
  } : null,
  relatedWords: (word.related_words ?? [])
    .filter(rw => rw.word && rw.definition)
    .map(rw => ({
      word: rw.word.trim(),
      definition: rw.definition.trim(),
      partOfSpeech: rw.partOfSpeech?.trim()
    })),
  wordFamily: word.word_family?.trim() ?? '',
  status: studyIds.includes(word.id) ? WORD_STATUS.KNOWN : WORD_STATUS.UNLEARNED
});

// ==================== 单词学习模块 ====================
const wordLearning = {
  // 当前响应类型（know/fuzzy/unknown）
  currentResponse: null,
  
  async loadWordData() {
    try {
      const response = await getCourseWords(route.params.id);
      if (response.code !== 0 || !response.data) {
        throw new Error(response.msg || '获取单词列表失败');
      }
        
      const formattedWords = response.data.words.map(word => 
        formatWord(word, response.data.study_ids)
      );
      
      [wordData.knownQueue, wordData.learningQueue] = formattedWords.reduce(
        (acc, word) => {
          acc[word.status === WORD_STATUS.KNOWN ? 0 : 1].push(word);
          return acc;
        },
        [[], []]
      );

      wordData.currentWord = wordData.learningQueue[0] ?? null;
      wordData.learningState = {
        totalWords: formattedWords.length,
        learnedWords: wordData.knownQueue.length,
        currentWordIndex: 0,
        totalVocabularyProgress: {
          totalLearnedWords: wordData.knownQueue.length,
          totalWords: formattedWords.length
        }
      };
    } catch (error) {
      console.error('获取单词列表失败:', error);
      showToast('获取单词列表失败，请稍后重试', 'error');
    }
  },
  
  // 第一阶段：处理用户对单词熟悉度的选择
  async handleResponse(type) {
    if (!wordData.currentWord) return;

    const status = {
      know: WORD_STATUS.KNOWN,
      fuzzy: WORD_STATUS.FUZZY,
      unknown: WORD_STATUS.UNKNOWN
    }[type];

    // 记录当前选择的类型，用于第二阶段操作
    this.currentResponse = type;
    
    // 更新单词状态
    await this.updateWordStatus(status);
    
    // 显示释义，进入第二阶段，但不切换单词
    ui.showDefinition = true;
  },
  
  async updateWordStatus(status) {
    try {
      await updateWordStatus({
        status,
        word_id: wordData.currentWord.id,
        course_id: route.params.id,
        progress: 1
      });
    } catch (error) {
      console.error('更新单词状态失败:', error);
    }
  },

  moveToKnownQueue() {
    const word = wordData.learningQueue.shift();
    if (!word) return;

    word.status = WORD_STATUS.KNOWN;
    wordData.knownQueue.push(word);
    wordData.currentWord = wordData.learningQueue[0] ?? null;
    
    const { learningState } = wordData;
    learningState.learnedWords = wordData.knownQueue.length;
    learningState.totalVocabularyProgress.totalLearnedWords = wordData.knownQueue.length;
  },

  moveToEndOfLearningQueue() {
    const word = wordData.learningQueue.shift();
    if (!word) return;

    word.status = WORD_STATUS.UNKNOWN;
    wordData.learningQueue.push(word);
    wordData.currentWord = wordData.learningQueue[0] ?? null;
  },

  // 第二阶段：处理"下一词"按钮点击
  async handleNextWord() {
    // 根据第一阶段的选择执行相应的队列操作
    if (this.currentResponse === 'know') {
      this.moveToKnownQueue();
      // 更新会话进度
      sessionProgress.learned++;
      sessionProgress.needsSaving = true;
    } else {
      this.moveToEndOfLearningQueue();
    }
    
    // 重置UI状态，准备下一个单词的第一阶段
    ui.showDefinition = false;
    this.currentResponse = null;
    await nextTick();
  },
  
  // 第二阶段：处理"记错了"按钮点击
  async handleWrong() {
    // 用户发现自己对单词的熟悉程度判断错误
    // 重置UI状态，返回到第一阶段重新选择
    ui.showDefinition = false;
    this.currentResponse = null;
  }
};

// ==================== 语音模块 ====================
const speech = {
  playPronunciation() {
    this.playSpeech(wordData.currentWord?.content);
  },
  
  playExampleSentence() {
    this.playSpeech(wordData.currentWord?.example?.text);
  },
  
  playRelatedWord(word) {
    this.playSpeech(word);
  },
  
  playSpeech(text) {
    if (!text || !('speechSynthesis' in window)) return;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(voice => 
        voice.lang.includes('en') && voice.name.includes('Female')
    ) ?? voices.find(voice => voice.lang.includes('en'));
      
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
      
    Object.assign(utterance, {
      volume: 1,
      rate: 0.9,
      pitch: 1
    });
    
      window.speechSynthesis.speak(utterance);
  }
};

// ==================== 生命周期钩子 ====================
onMounted(() => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.getVoices();
  }
  
  // 保存当前课程 ID 到 Pinia store
  if (route.params.id) {
    readingStore.setLastCourse(route.params.id);
  }
  
  wordLearning.loadWordData();
});

onBeforeUnmount(() => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
});

// ==================== 导航模块 ====================
const navigation = {
  async handleBack() {
    try {
      if (sessionProgress.needsSaving) {
        await wordLearning.loadWordData();
        sessionProgress.needsSaving = false;
      }
      window.history.back();
    } catch (error) {
      console.error('返回时出错:', error);
      router.push('/home/reading');
    }
  },
  
  async generateEssay() {
    try {
      if (sessionProgress.needsSaving) {
        await wordLearning.loadWordData();
        sessionProgress.needsSaving = false;
      }
      try {
        await completeCourse(route.params.id);
      } catch (error) {
        console.error('完成课程失败:', error);
      }
      const response = await getCourseWords(route.params.id);
      if (response.code==0 && response.data) {
        router.push(`/reading/essay/${response.data.article_id}`);
      }
    } catch (error) {
      
    }
  }
};

// 添加会话学习记录
const sessionProgress = reactive({
  learned: 0,
  needsSaving: false
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