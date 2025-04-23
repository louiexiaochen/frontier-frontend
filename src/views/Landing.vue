<template>
  <div class="min-h-screen bg-black text-white w-full relative overflow-hidden">
    <div class="absolute top-0 left-0 w-full h-full z-0 overflow-hidden">
      <div class="absolute rounded-full filter blur-[4.5vw] top-[-10%] left-[-10%] w-1/2 h-1/2 bg-gradient-to-br from-blue-500/30 to-blue-800/10 animate-float-slow"></div>
      <div class="absolute rounded-full filter blur-[4.5vw] bottom-[-15%] right-[-15%] w-3/5 h-3/5 bg-gradient-to-br from-blue-500/20 to-purple-800/10 animate-float-reverse"></div>
      <div class="absolute top-0 left-0 w-full h-full bg-grid opacity-40"></div>
    </div>
    
    <div class="w-[85%] max-w-[1600px] mx-auto py-[2%] px-[2%] box-border relative z-10">
      <!-- 顶部导航栏 -->
      <header class="flex justify-between items-center flex-wrap gap-4 w-full py-[0.5%]">
        <div class="flex items-center gap-2">
          <div class="flex items-center justify-center w-[2vw] h-[2vw] min-w-6 min-h-6 overflow-hidden">
            <Logo />
          </div>
          <span class="text-[clamp(1.25rem,1.5vw,2.5rem)] font-bold">FrontierX</span>
        </div>

        <nav class="flex items-center justify-around w-full lg:w-[40%]">
          <a href="#" class="text-white no-underline px-4 py-2 text-[clamp(0.9rem,1vw,1.5rem)] hover:bg-gray-800 hover:rounded">{{ $t('landing.features') }}</a>
          <a href="#" class="text-white no-underline px-4 py-2 text-[clamp(0.9rem,1vw,1.5rem)] hover:bg-gray-800 hover:rounded">{{ $t('landing.pricing') }}</a>
          <a href="#" class="text-white no-underline px-4 py-2 text-[clamp(0.9rem,1vw,1.5rem)] hover:bg-gray-800 hover:rounded">{{ $t('landing.community') }}</a>
          <a href="#" class="text-white no-underline px-4 py-2 text-[clamp(0.9rem,1vw,1.5rem)] hover:bg-gray-800 hover:rounded">{{ $t('landing.jobs') }}</a>
        </nav>

        <div class="flex items-center gap-[clamp(0.5rem,1vw,1.5rem)]">
          <!-- 添加语言切换组件 -->
          <LanguageSwitcher />
          
          <button 
            @click="showLoginModal" 
            class="py-[clamp(0.4rem,0.7vw,1rem)] px-[clamp(0.8rem,1.5vw,2rem)] rounded-md bg-black border border-gray-800 text-white transition-colors duration-200 cursor-pointer text-[clamp(0.9rem,1vw,1.3rem)] hover:bg-gray-800"
          >
            {{ $t('login.title') }}
          </button>
          <button 
            @click="showSignupModal" 
            class="py-[clamp(0.4rem,0.7vw,1rem)] px-[clamp(0.8rem,1.5vw,2rem)] rounded-md bg-white text-black border-none transition-opacity duration-200 cursor-pointer text-[clamp(0.9rem,1vw,1.3rem)] hover:opacity-90"
          >
            {{ $t('signup.title') }}
          </button>
        </div>
      </header>

      <!-- 主内容区域 -->
      <main class="flex flex-col items-center justify-center text-center mt-[clamp(5rem,15vh,15rem)] px-[5%] box-border w-full relative">
        <h1 class="text-[clamp(3rem,8vw,12rem)] font-bold mb-[clamp(1rem,2vh,3rem)] w-full break-words bg-gradient-to-r from-white to-blue-500 bg-clip-text text-transparent leading-tight">
          {{ $t('landing.title') }}
        </h1>
        <p class="text-[clamp(1rem,1.5vw,2.2rem)] mb-[clamp(1.5rem,4vh,4rem)] max-w-[60%] w-full break-words">
          {{ $t('landing.subtitle') }}
        </p>
        <button 
          @click="$router.push('/reading')" 
          class="bg-gradient-to-r from-white to-gray-200 text-black py-[clamp(0.7rem,1vh,1.2rem)] px-[clamp(2rem,3vw,4rem)] text-[clamp(1rem,1.2vw,1.8rem)] font-bold rounded-full border-none transition-all duration-300 cursor-pointer relative overflow-hidden shadow-blue-500/20 shadow-lg hover:opacity-90 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/30 active:translate-y-0 active:shadow-md active:shadow-blue-500/20"
        >
          {{ $t('landing.startButton') }}
        </button>
      </main>
    </div>

    <!-- 登录模态窗口 -->
    <LoginModal 
      :show="loginModalVisible" 
      @close="closeModals" 
      @showSignup="switchToSignup"
    />

    <!-- 注册模态窗口 -->
    <SignupModal 
      :show="signupModalVisible" 
      @close="closeModals" 
      @showLogin="switchToLogin"
    />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Logo from '../components/icons/Logo.vue';
import LoginModal from '../components/LoginModal.vue';
import SignupModal from '../components/SignupModal.vue';
import LanguageSwitcher from '../components/utils/LanguageSwitcher.vue';

// 使用 i18n
const { t } = useI18n();

// 模态窗口可见性状态
const loginModalVisible = ref(false);
const signupModalVisible = ref(false);

// 显示登录模态窗口
const showLoginModal = () => {
  loginModalVisible.value = true;
  signupModalVisible.value = false;
};

// 显示注册模态窗口
const showSignupModal = () => {
  signupModalVisible.value = true;
  loginModalVisible.value = false;
};

// 关闭所有模态窗口
const closeModals = () => {
  loginModalVisible.value = false;
  signupModalVisible.value = false;
};

// 从登录切换到注册
const switchToSignup = () => {
  loginModalVisible.value = false;
  signupModalVisible.value = true;
};

// 从注册切换到登录
const switchToLogin = () => {
  signupModalVisible.value = false;
  loginModalVisible.value = true;
};

onMounted(() => {
  // 不再设置overflow为auto
  // document.documentElement.style.overflow = 'auto'
  // document.body.style.overflow = 'auto'
})
</script>

<style>
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
  
  