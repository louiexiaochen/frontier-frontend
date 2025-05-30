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
      <div class="flex-1 flex flex-col px-6 pt-6 mx-auto w-full h-full">
        <!-- 进度条和返回按钮 -->
        <div class="flex items-center mb-8 gap-4">
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
        <div class="flex-1 overflow-y-auto custom-scrollbar w-[100%] m-auto">
          <div class="flex-1 flex flex-col justify-between gap-8 will-change-transform pb-4 max-w-[800px] m-auto">
            <!-- 单词展示区域 -->
            <div class="text-center animate-fadeIn">
              <h1 class="text-5xl font-bold mb-2 bg-gradient-to-r from-[#4A99E9] to-[#5C2797] bg-clip-text text-transparent will-change-transform">
                {{ quizData.currentQuestion.correctWord }}
              </h1>
              <div class="flex items-center justify-center gap-2 mb-4">
                <EnglishPronunciationButton @click="speech.playPronunciation" />
                <div class="text-lg text-white/70">{{ quizData.currentQuestion.phonetic }}</div>
              </div>
              <div v-if="!ui.showAnswer" class="flex flex-col items-center gap-2 my-4">
                <div class="w-20 h-0.5 bg-white/30"></div>
                <div class="w-12 h-0.5 bg-white/30"></div>
              </div>
              <div v-else class="text-2xl text-white/90 my-4 animate-fadeIn">
                {{ quizData.currentQuestion.definition }}
              </div>
            </div>

            <div class="flex-1 flex flex-col gap-6">
              <!-- 选项区域 -->
              <div v-if="!ui.showAnswer" class="grid grid-cols-1 gap-4">
                <button 
                  v-for="(option, index) in quizData.currentQuestion.options" 
                  :key="index"
                  class="bg-white/5 rounded-lg p-6 text-center hover:bg-white/10 transition-all duration-200"
                  @click="() => quizHandler.checkAnswer(option)"
                >
                  <span class="text-xl font-semibold">{{ option }}</span>
                </button>
              </div>

              <!-- 例句区域 -->
              <div 
                v-if="ui.showAnswer"
                class="bg-white/5 rounded-lg p-6 mb-4 will-change-transform cursor-pointer" 
                @click="speech.playExampleSentence"
              >
                <p 
                  class="text-lg leading-relaxed mb-2" 
                  v-html="quizData.highlightedExample"
                ></p>
                <p class="text-base text-white/70 animate-fadeIn">
                  {{ quizData.currentQuestion.example.translation }}
                </p>
              </div>

              <!-- 相关单词区域 -->
              <div 
                v-if="ui.showAnswer" 
                class="bg-white/5 rounded-lg p-6 animate-fadeIn will-change-transform"
              >
                <div class="flex flex-col gap-4">
                  <div 
                    v-for="(relatedWord, index) in quizData.currentQuestion.relatedWords" 
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
                    {{ quizData.currentQuestion.wordFamily }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 底部按钮区域 -->
        <div class="flex gap-4 mt-4 justify-center py-4">
          <!-- 显示答案后且不是最后一个问题时的按钮 -->
          <template v-if="ui.showAnswer && !quizHandler.isLastQuestion">
            <button 
              class="flex-1 py-4 border-none rounded-lg text-white font-semibold text-lg transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-800 hover:opacity-90 active:opacity-80" 
              @click="quizHandler.handleNextQuestion"
            >
              下一题
            </button>
          </template>
          
          <!-- 学习完成时的按钮 -->
          <template v-else-if="ui.showAnswer && quizHandler.isLastQuestion">
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

const router = useRouter();
const route = useRoute();
const lessonId = computed(() => route.params.id || '未知课程');

const quizData = reactive({
  questionList: [
    {
      correctWord: 'parasite',
      phonetic: '/pærəsaɪt/',
      definition: 'n. 寄生虫，寄生动植物',
      options: [
        'n. 寄生虫，寄生动植物', 
        'n. 天堂；乐园；极乐世界', 
        'n. 典范；模范；完美的例子', 
        'n. 范例；范式；思维模式'
      ],
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
      correctWord: 'abundant',
      phonetic: '/əˈbʌndənt/',
      definition: 'adj. 丰富的；充裕的；大量的',
      options: [
        'adj. 丰富的；充裕的；大量的', 
        'adj. 突然的；意外的；唐突的', 
        'adj. 缺席的；不在场的；心不在焉的', 
        'adj. 荒谬的；不合理的；荒唐的'
      ],
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
      correctWord: 'crucial',
      phonetic: '/ˈkruːʃl/',
      definition: 'adj. 关键的；决定性的；至关重要的',
      options: [
        'adj. 关键的；决定性的；至关重要的', 
        'adj. 批评的；挑剔的；评论的', 
        'adj. 可信的；可靠的；有说服力的', 
        'v. 崩溃；瓦解；粉碎'
      ],
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
  ],
  
  quizState: {
    totalQuestions: 0,
    correctAnswers: 0,
    currentQuestionIndex: 0,
    totalProgress: {
      totalCompletedQuestions: 0,
      totalQuestions: 0
    }
  },
  
  get currentQuestion() {
    const index = this.quizState.currentQuestionIndex;
    return index < this.questionList.length ? this.questionList[index] : this.questionList[0];
  },
  
  get highlightedExample() {
    const example = this.currentQuestion.example;
    return example.text.replace(
      example.highlight, 
      `<span class='text-[#4A99E9] font-semibold'>${example.highlight}</span>`
    );
  }
});

const sessionCorrect = ref(0);

const ui = reactive({
  showAnswer: false,
  
  get progress() {
    const totalProgress = quizData.quizState.totalProgress;
    if (totalProgress.totalQuestions === 0) return 0;
    return Math.round((totalProgress.totalCompletedQuestions / totalProgress.totalQuestions) * 100);
  },
  
  get progressText() {
    return `${this.progress}%`;
  },
  
  get progressStyle() {
    return {
      width: `${this.progress}%`
    };
  }
});

const quizHandler = reactive({
  get isLastQuestion() {
    return quizData.quizState.currentQuestionIndex >= quizData.questionList.length - 1;
  },
  
  async checkAnswer(selectedDefinition) {
    const currentQuestion = quizData.currentQuestion;
    const isCorrect = selectedDefinition === currentQuestion.definition;
    
    console.log(`User selected: ${selectedDefinition}, Correct: ${isCorrect}`);
    
    if (isCorrect) {
      sessionCorrect.value++;
      
      await this.saveQuizProgress();
      
      await this.fetchQuizProgress();
    }
    
    ui.showAnswer = true;
  },
  
  async handleNextQuestion() {
    quizData.quizState.currentQuestionIndex++;
    
    ui.showAnswer = false;
    
    await nextTick();
  },
  
  async fetchQuizProgress() {
    try {
      quizData.quizState.totalProgress = {
        totalCompletedQuestions: 135 + sessionCorrect.value,
        totalQuestions: 241
      };
    } catch (error) {
      console.error('Error fetching quiz progress:', error);
    }
  },
  
  async saveQuizProgress() {
    try {
      console.log(`Saving quiz progress to backend for lesson ${lessonId.value}`);
      
      quizData.quizState.totalProgress.totalCompletedQuestions += 1;
      
    } catch (error) {
      console.error('Error saving quiz progress:', error);
    }
  },
  
  async loadQuizData() {
    try {
      ui.showAnswer = false;
      
      const lessonDetails = this.getLessonDetails(lessonId.value);
      if (lessonDetails) {
        quizData.quizState = {
          ...quizData.quizState,
          totalQuestions: lessonDetails.totalQuestions,
          correctAnswers: lessonDetails.correctAnswers
        };
      }
    } catch (error) {
      console.error('Error loading quiz data:', error);
    }
  },
  
  getLessonDetails(id) {
    const lessons = {
      '2-1': { totalQuestions: 20, correctAnswers: 20, progress: 100 },
      '2-2': { totalQuestions: 30, correctAnswers: 9, progress: 30 },
      '2-3': { totalQuestions: 20, correctAnswers: 10, progress: 50 },
      '2-4': { totalQuestions: 25, correctAnswers: 5, progress: 20 },
      '2-5': { totalQuestions: 22, correctAnswers: 0, progress: 0 },
    };
    
    return lessons[id] || { totalQuestions: 20, correctAnswers: 0, progress: 0 };
  }
});

const speech = reactive({
  playPronunciation() {
    this.playSpeech(quizData.currentQuestion.correctWord);
  },
  
  playExampleSentence() {
    this.playSpeech(quizData.currentQuestion.example.text);
  },
  
  playRelatedWord(word) {
    this.playSpeech(word);
  },
  
  playSpeech(text) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.lang = 'en-US';
      
      const voices = window.speechSynthesis.getVoices();
      
      const englishVoice = voices.find(voice => 
        voice.lang.includes('en') && voice.name.includes('Female')
      ) || voices.find(voice => voice.lang.includes('en'));
      
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
      
      utterance.volume = 1;
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      window.speechSynthesis.speak(utterance);
      
      console.log(`Playing pronunciation for: ${text}`);
    } else {
      console.warn('当前浏览器不支持语音合成API');
    }
  },
  
  initSpeechSynthesis() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
  }
});

const navigation = reactive({
  get unitId() {
    const id = lessonId.value;
    if (id && id.includes('-')) {
      return parseInt(id.split('-')[0]);
    }
    return null;
  },
  
  handleBack() {
    if (sessionCorrect.value !== 0) {
      quizHandler.saveQuizProgress();
    }
    
    sessionCorrect.value = 0;
    
    if (this.unitId) {
      router.push(`/reading?unit=${this.unitId}`);
    } else {
      router.push('/reading');
    }
  },
  
  generateEssay() {
    const essayId = `essay-unit-${this.unitId}`;
    
    if (sessionCorrect.value !== 0) {
      quizHandler.saveQuizProgress();
    }
    
    sessionCorrect.value = 0;
    
    router.push(`/reading/essay/${essayId}`);
  }
});

onMounted(() => {
  speech.initSpeechSynthesis();
  
  quizHandler.fetchQuizProgress();
  
  const lessonDetails = quizHandler.getLessonDetails(lessonId.value);
  if (lessonDetails) {
    quizData.quizState = {
      ...quizData.quizState,
      totalQuestions: lessonDetails.totalQuestions,
      correctAnswers: lessonDetails.correctAnswers,
      currentQuestionIndex: 0
    };
  }
  
  quizHandler.loadQuizData();
});

onBeforeUnmount(() => {
  if (sessionCorrect.value !== 0) {
    quizHandler.saveQuizProgress();
  }
  
  sessionCorrect.value = 0;
  
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
});
</script>

<style scoped>
* {
  touch-action: pan-y;
}

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

.progress-fill {
  height: 100%;
  background: white;
  border-radius: 4rem;
  transition: width 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

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