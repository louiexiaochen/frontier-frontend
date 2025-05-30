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
              <h1 class="text-5xl font-bold mb-2 bg-gradient-to-r from-[#4A99E9] to-[#5C2797] bg-clip-text text-transparent will-change-transform">
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
import { getCourseWords, updateWordStatus } from '@/api/readings';

// ==================== 基础设置 ====================
const router = useRouter();
const route = useRoute();
const lessonId = computed(() => route.params.id || '未知课程');

// ==================== 数据模块 ====================
const wordData = reactive({
  // 认识的单词队列
  knownQueue: [],
  // 待学习的单词队列（包含不认识和模糊的单词）
  learningQueue: [],
  
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
    if (!example?.text || !example?.highlight) return '';
    
    try {
      return example.text.replace(
        example.highlight, 
        `<span class='text-[#4A99E9] font-semibold'>${example.highlight}</span>`
      );
    } catch (error) {
      console.warn('高亮例句处理失败:', error);
      return example.text || '';
    }
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

// ==================== 常量定义 ====================
const WORD_STATUS = {
  UNLEARNED: 0,  // 未学习
  KNOWN: 1,      // 认识
  FUZZY: 2,      // 模糊
  UNKNOWN: 3     // 不认识
};

// ==================== 单词学习模块 ====================
const wordLearning = reactive({
  // 加载单词数据
  async loadWordData() {
    try {
      // 重置队列
      wordData.learningQueue = [];
      wordData.knownQueue = [];
      
      // 重置UI状态
      ui.showDefinition = false;
      
      // 获取课程单词
      const response = await getCourseWords(route.params.id);
      
      if (response.code === 0 && response.data) {
        const words = response.data;
        
        if (!words || words.length === 0) {
          console.log('API返回数据为空');
          return;
        }
        
        // 转换API返回的词汇数据
        const formattedWords = words.map(word => ({
          id: word.id,
          content: word.content,
          phonetic: word.phonetic || '',
          definition: word.meaning || '',
          example: word.example ? {
            text: word.example.trim(),
            translation: (word.translation || '').trim(),
            highlight: word.content
          } : null,
          relatedWords: (word.related_words || []).filter(rw => rw.word && rw.definition),
          wordFamily: word.word_family?.trim() || '',
          status: word.study_status?.status === 1 ? WORD_STATUS.KNOWN : WORD_STATUS.UNLEARNED
        }));
        
        // 直接根据 status 分类到对应队列
        wordData.knownQueue = formattedWords.filter(w => w.status === WORD_STATUS.KNOWN);
        wordData.learningQueue = formattedWords.filter(w => w.status !== WORD_STATUS.KNOWN);
        
        // 更新学习状态
        wordData.learningState = {
          totalWords: formattedWords.length,
          learnedWords: wordData.knownQueue.length,
          currentWordIndex: 0,
          totalVocabularyProgress: {
            totalLearnedWords: wordData.knownQueue.length,
            totalWords: formattedWords.length
          }
        };
        
        console.log('成功加载单词列表:', {
          total: formattedWords.length,
          known: wordData.knownQueue.length,
          learning: wordData.learningQueue.length
        });
      } else {
        console.error('获取单词列表失败:', response.msg || '未知错误');
      }
    } catch (error) {
      console.error('获取单词列表失败:', error);
    }
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
      progress: 1
    }).catch(error => {
      console.error('更新单词状态失败:', error);
    });
    
    // 处理单词队列
    if (type === 'know') {
      // 认识 - 从学习队列移到认识队列
      const word = wordData.learningQueue.shift();
      if (word) {
        word.status = WORD_STATUS.KNOWN; // 更新状态
        wordData.knownQueue.push(word);
        // 更新学习状态
        wordData.learningState.learnedWords = wordData.knownQueue.length;
        wordData.learningState.totalVocabularyProgress.totalLearnedWords = wordData.knownQueue.length;
      }
    } else {
      // 不认识或模糊 - 移到学习队列末尾
      const word = wordData.learningQueue.shift();
      if (word) {
        word.status = status; // 更新状态为模糊或不认识
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
      progress: 1
    }).catch(error => {
      console.error('更新单词状态失败:', error);
    });

    // 如果这个单词在认识队列中，移回学习队列
    const index = wordData.knownQueue.findIndex(w => w.id === currentWord.id);
    if (index !== -1) {
      const word = wordData.knownQueue.splice(index, 1)[0];
      word.status = WORD_STATUS.UNKNOWN; // 更新状态为不认识
      wordData.learningQueue.push(word);
      // 更新学习状态
      wordData.learningState.learnedWords = wordData.knownQueue.length;
      wordData.learningState.totalVocabularyProgress.totalLearnedWords = wordData.knownQueue.length;
    }
    
    // 继续下一个单词
    this.handleNextWord();
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
      wordLearning.loadWordData();
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
      wordLearning.loadWordData();
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
  
  // 加载单词数据
  wordLearning.loadWordData();
});

onBeforeUnmount(() => {
  // 取消任何正在进行的语音合成
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
});

// 计算属性：检查是否有相关单词
const hasRelatedWords = computed(() => {
  return wordData.currentWord?.relatedWords?.length > 0;
});

// 计算属性：检查是否有例句或相关单词
const hasExampleOrRelatedWords = computed(() => {
  return (
    wordData.currentWord?.example?.text || 
    hasRelatedWords.value
  );
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