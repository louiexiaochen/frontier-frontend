<template>
  <div class="min-h-screen bg-black text-white w-full relative overflow-hidden">
    <!-- 背景效果 -->
    <div class="absolute top-0 left-0 w-full h-full z-0 overflow-hidden">
      <div class="absolute rounded-full filter blur-[4.5vw] top-[-10%] left-[-10%] w-1/2 h-1/2 bg-gradient-to-br from-blue-500/30 to-blue-800/10 animate-float-slow"></div>
      <div class="absolute rounded-full filter blur-[4.5vw] bottom-[-15%] right-[-15%] w-3/5 h-3/5 bg-gradient-to-br from-blue-500/20 to-purple-800/10 animate-float-reverse"></div>
      <div class="absolute top-0 left-0 w-full h-full bg-grid opacity-40"></div>
    </div>
    
    <div class="w-[85%] max-w-[1600px] mx-auto py-[2%] px-[2%] box-border relative z-10">
      <!-- 返回按钮 -->
      <div class="mb-8">
        <button 
          @click="$router.push('/')" 
          class="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors duration-200 rounded-full px-4 py-2"
        >
          <span class="text-white">返回首页</span>
        </button>
      </div>
      
      <!-- 标题 -->
      <h1 class="text-[clamp(2rem,4vw,5rem)] font-bold mb-[clamp(2rem,4vh,5rem)] text-center bg-gradient-to-r from-white to-blue-500 bg-clip-text text-transparent">
        {{ $t('features.title') }}
      </h1>
      
      <!-- 特点列表 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <!-- 特点卡片 1 -->
        <div class="feature-card">
          <div class="feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 class="feature-title">{{ $t('features.card1.title') }}</h3>
          <p class="feature-description">{{ $t('features.card1.description') }}</p>
        </div>
        
        <!-- 特点卡片 2 -->
        <div class="feature-card">
          <div class="feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          </div>
          <h3 class="feature-title">{{ $t('features.card2.title') }}</h3>
          <p class="feature-description">{{ $t('features.card2.description') }}</p>
        </div>
        
        <!-- 特点卡片 3 -->
        <div class="feature-card">
          <div class="feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h3 class="feature-title">{{ $t('features.card3.title') }}</h3>
          <p class="feature-description">{{ $t('features.card3.description') }}</p>
        </div>
        
        <!-- 特点卡片 4 -->
        <div class="feature-card">
          <div class="feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 class="feature-title">{{ $t('features.card4.title') }}</h3>
          <p class="feature-description">{{ $t('features.card4.description') }}</p>
        </div>
        
        <!-- 特点卡片 5 -->
        <div class="feature-card">
          <div class="feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 class="feature-title">{{ $t('features.card5.title') }}</h3>
          <p class="feature-description">{{ $t('features.card5.description') }}</p>
        </div>
        
        <!-- 特点卡片 6 -->
        <div class="feature-card">
          <div class="feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 class="feature-title">{{ $t('features.card6.title') }}</h3>
          <p class="feature-description">{{ $t('features.card6.description') }}</p>
        </div>
      </div>
      
      <!-- 号召性用语 -->
      <div class="text-center mb-16">
        <h2 class="text-[clamp(1.5rem,3vw,3rem)] font-bold mb-6">{{ $t('features.cta.title') }}</h2>
        <p class="text-[clamp(1rem,1.5vw,1.5rem)] mb-8 max-w-3xl mx-auto opacity-80">{{ $t('features.cta.description') }}</p>
        <button 
          @click="$router.push('/home/reading')" 
          class="bg-gradient-to-r from-white to-gray-200 text-black py-[clamp(0.7rem,1vh,1.2rem)] px-[clamp(2rem,3vw,4rem)] text-[clamp(1rem,1.2vw,1.8rem)] font-bold rounded-full border-none transition-all duration-300 cursor-pointer relative overflow-hidden shadow-blue-500/20 shadow-lg hover:opacity-90 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/30 active:translate-y-0 active:shadow-md active:shadow-blue-500/20"
        >
          {{ $t('features.cta.button') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

// 使用 i18n
const { t } = useI18n();
</script>

<style scoped>
@keyframes float {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(5%, 5%);
  }
}

.animate-float-slow {
  animation: float 15s ease-in-out infinite alternate;
}

.animate-float-reverse {
  animation: float 20s ease-in-out infinite alternate-reverse;
}

.bg-grid {
  background-image: 
    linear-gradient(to right, rgba(48, 51, 54, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(48, 51, 54, 0.1) 1px, transparent 1px);
  background-size: 1.5vw 1.5vw;
}

.feature-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  padding: 2rem;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.feature-card:hover {
  transform: translateY(-10px);
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  border-color: rgba(74, 153, 233, 0.3);
}

.feature-icon {
  background: linear-gradient(135deg, #4A99E9, #5C2797);
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  color: white;
}

.feature-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(90deg, #fff, #4A99E9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.feature-description {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
}

/* 媒体查询 */
@media screen and (min-width: 1366px) and (max-width: 1440px) {
  .w-\[85\%\] {
    width: 85%;
  }
}

@media screen and (min-width: 1441px) and (max-width: 1680px) {
  .w-\[85\%\] {
    width: 80%;
  }
}

@media screen and (min-width: 1681px) and (max-width: 1920px) {
  .w-\[85\%\] {
    width: 75%;
  }
}

@media screen and (min-width: 1921px) and (max-width: 2560px) {
  .w-\[85\%\] {
    width: 70%;
  }
}

@media screen and (min-width: 2561px) {
  .w-\[85\%\] {
    width: 65%;
    max-width: 2200px;
  }
  
  .bg-grid {
    background-size: 2vw 2vw;
  }
}
</style>