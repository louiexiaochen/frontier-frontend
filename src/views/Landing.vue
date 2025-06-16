<template>
  <div class="min-h-screen text-white w-full relative overflow-hidden" style="background-color: #000000;">
    <!-- 大LOGO背景 -->
    <div class="absolute top-9 left-0 w-full h-full z-0 flex items-center justify-center select-none pointer-events-none">
      <div class="w-[90vw] h-[90vh] max-w-[1000px] max-h-[1000px] opacity-60 flex items-center justify-center select-none pointer-events-none">
        <Logo />
      </div>
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
          <router-link to="/features" class="text-white no-underline px-4 py-2 text-[clamp(0.9rem,1vw,1.5rem)] hover:bg-gray-800 hover:rounded">{{ $t('landing.features') }}</router-link>
          <router-link to="/pricing" class="text-white no-underline px-4 py-2 text-[clamp(0.9rem,1vw,1.5rem)] hover:bg-gray-800 hover:rounded">{{ $t('landing.pricing') }}</router-link>
          <a href="#" class="text-white no-underline px-4 py-2 text-[clamp(0.9rem,1vw,1.5rem)] hover:bg-gray-800 hover:rounded">{{ $t('landing.community') }}</a>
          <a href="#" class="text-white no-underline px-4 py-2 text-[clamp(0.9rem,1vw,1.5rem)] hover:bg-gray-800 hover:rounded">{{ $t('landing.jobs') }}</a>
        </nav>

        <div class="flex items-center gap-[clamp(0.5rem,1vw,1.5rem)]">
          <!-- 未登录状态显示登录/注册按钮 -->
          <template v-if="!userStore.isAuthenticated">
            <button 
              @click="modalStore.openLoginModal()" 
              class="py-[clamp(0.4rem,0.7vw,1rem)] px-[clamp(0.8rem,1.5vw,2rem)] rounded-md bg-black border border-gray-800 text-white transition-colors duration-200 cursor-pointer text-[clamp(0.9rem,1vw,1.3rem)] hover:bg-gray-800"
            >
              {{ $t('login.title') }}
            </button>
            <button 
              @click="modalStore.openSignupModal()" 
              class="py-[clamp(0.4rem,0.7vw,1rem)] px-[clamp(0.8rem,1.5vw,2rem)] rounded-md bg-white text-black border-none transition-opacity duration-200 cursor-pointer text-[clamp(0.9rem,1vw,1.3rem)] hover:opacity-90"
            >
              {{ $t('signup.title') }}
            </button>
          </template>
          
          <!-- 已登录状态显示用户信息 -->
          <template v-else>
            <div class="relative" ref="userMenuContainer">
              <div 
                class="flex items-center gap-2 cursor-pointer"
                @click="toggleUserMenu"
              >
                <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {{ userStore.username ? userStore.username.charAt(0).toUpperCase() : 'U' }}
                </div>
                <span class="text-white">{{ userStore.username }}</span>
              </div>
              
              <!-- 下拉菜单 - 使用v-show而不是CSS隐藏 -->
              <div 
                v-show="userMenuVisible" 
                class="absolute top-full right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50"
              >
                <router-link to="/home/profile" class="block px-4 py-2 text-sm text-white hover:bg-gray-700">个人资料</router-link>
                <router-link to="/settings" class="block px-4 py-2 text-sm text-white hover:bg-gray-700">设置</router-link>
                <a href="#" @click.prevent="handleLogout" class="block px-4 py-2 text-sm text-white hover:bg-gray-700">退出登录</a>
              </div>
            </div>
          </template>
        </div>
      </header>

      <!-- 主内容区域 -->
      <main class="flex flex-col items-center justify-center text-center mt-[clamp(10rem,24vh,24rem)] px-[5%] box-border w-full relative">
        <h1 class="text-[clamp(2.5rem,6.5vw,8rem)] font-bold mb-[clamp(2rem,4vh,6rem)] w-full break-words text-white leading-tight">
          AI重塑你的英语学习
        </h1>
        <p class="text-[clamp(1.2rem,1.5vw,2.2rem)] mb-[clamp(1.5rem,4vh,4rem)] max-w-[60%] w-full break-words">
          {{ $t('landing.subtitle') }}
        </p>
                  <button 
            @click="$router.push('/reading')" 
            class="mt-5 bg-gradient-to-r from-white to-gray-200 text-black py-[clamp(0.7rem,2vh,1.2rem)] px-[clamp(2rem,4vw,4rem)] text-[clamp(1rem,1.2vw,1.8rem)] font-bold rounded-[20px] border-none transition-all duration-300 cursor-pointer relative overflow-hidden shadow-blue-500/20 shadow-lg hover:opacity-90 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/30 active:translate-y-0 active:shadow-md active:shadow-blue-500/20"
          >
          {{ $t('landing.startButton') }}
        </button>
      </main>
    </div>

    <!-- 注册模态窗口 -->
    <SignupModal 
      :show="signupModalVisible" 
      @close="closeModals" 
      @showLogin="switchToLogin"
    />
  </div>
</template>

<script setup>
import { onMounted, ref, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';
import Logo from '../components/icons/Logo.vue';
import SignupModal from '../components/SignupModal.vue';
import { useUserStore } from '@/stores/user';
import { useModalStore } from '@/stores/modal';
import message from '@/utils/message';

// 使用 i18n
const { t } = useI18n();

// 使用 store
const userStore = useUserStore();
const modalStore = useModalStore();

// 注册模态窗口可见性状态
const signupModalVisible = ref(false);

// 用户菜单状态
const userMenuVisible = ref(false);
const userMenuContainer = ref(null);

// 显示注册模态窗口
const showSignupModal = () => {
  signupModalVisible.value = true;
};

// 关闭所有模态窗口
const closeModals = () => {
  signupModalVisible.value = false;
};

// 从注册切换到登录
const switchToLogin = () => {
  signupModalVisible.value = false;
  modalStore.openLoginModal();
};

// 切换用户菜单显示状态
const toggleUserMenu = () => {
  userMenuVisible.value = !userMenuVisible.value;
};

// 点击外部关闭用户菜单
const handleClickOutside = (event) => {
  if (userMenuContainer.value && !userMenuContainer.value.contains(event.target)) {
    userMenuVisible.value = false;
  }
};

// 处理退出登录
const handleLogout = async () => {
  await userStore.logout();
  message.success('退出登录成功');
  window.location.reload();
};

onMounted(() => {
  // 添加点击外部关闭菜单的事件监听
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  // 移除事件监听
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style>
/* 防止背景LOGO被选中和复制 */
.select-none {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
}

.pointer-events-none {
  pointer-events: none;
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
}
</style>
  
  