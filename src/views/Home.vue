<template>
  <div class="Home-page fixed-page">
      <div class="background-effects">
          <div class="gradient-orb top-left"></div>
          <div class="gradient-orb bottom-right"></div>
          <div class="grid-overlay"></div>
      </div>
      <!--Left sidebar-->
      <div class="left-sidebar" :class="{ 'sidebar-visible': sidebarVisible }">
          <div class="sidebar-icon">
             <home-icon class="icon" @click="$router.push('/home/reading')" />
             
             <ai-friend-icon class="icon" @click="$router.push('/home/ai-friend')" />

             <method-icon class="icon" @click="$router.push('/home/method')" />

             <analysis-icon class="icon" @click="$router.push('/home/analysis')" />

             <membership-icon class="icon" @click="$router.push('/home/membership')" />

             <setting-icon class="icon" @click="$router.push('/home/settings')" />
          </div>

          <div class="profile flex-col" @click="navigateToProfile">
              <div class="avatar-circle">
                <div class="w-full h-full bg-blue-500 flex items-center justify-center text-white">
                  {{ userStore.username ? userStore.username.charAt(0).toUpperCase() : 'U' }}
                </div>
                <!-- <div class="avatar-status"></div> -->
              </div>
              <span class="profile-text">{{ $t('home.sidebar.profile') }}</span>
          </div>
      </div>

      <!-- Overlay for sidebar backdrop -->
      <div 
        v-if="sidebarVisible" 
        class="sidebar-overlay"
      ></div>

      <!--Main content-->
      <div class="main-content" @click="handleContentClick">
          <!--Nav tabs-->
          <div class="flex flex-row w-full border-b border-[#303336]">
              <div class="sidebar-toggle-wrapper w-[40px] ml-[5vw]">
                  <SidebarToggle 
                      :isActive="sidebarVisible" 
                      @click="toggleSidebar" 
                  />
              </div>
              <div class="nav-tabs flex-1 overflow-x-auto">
                  <div v-for="(tab, index) in tabs" :key="index" 
                       class="tab" 
                       :class="{'active': isActiveTab(tab.name)}"
                       @click="navigateToTab(tab.name)">
                      <span>{{ tab.name }}</span>
                  </div>
              </div>
          </div>

          <!-- 子路由内容区域 -->
          <keep-alive>
            <router-view />
          </keep-alive>
          
      </div>
      
      <!-- Right Sidebar (Empty) -->
      <div class="right-sidebar" :class="{ 'sidebar-visible': sidebarVisible }">

      </div>
  </div>  
</template>

<script setup>
import { ref, computed, provide, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useModalStore } from '@/stores/modal';
import {
HomeIcon,
AiFriendIcon,
MethodIcon,
AnalysisIcon,
MembershipIcon,
SettingIcon
} from '../components/icons';
import SidebarToggle from '../components/icons/SidebarToggle.vue';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const modalStore = useModalStore();

const tabs = ref([
{ name: 'Reading', path: '/home/reading' },
{ name: 'Listening', path: '/home/listening' },
{ name: 'Speaking', path: '/home/speaking' },
{ name: 'Writing', path: '/home/writing' }
]);

// 判断当前激活的标签
const isActiveTab = (tabName) => {
const currentPath = route.path;
return currentPath.includes(tabName.toLowerCase());
};

// 导航到不同的标签页
const navigateToTab = (tabName) => {
const tab = tabs.value.find(t => t.name === tabName);
if (tab) {
  router.push(tab.path);
}
};

// 导航到个人资料页面
const navigateToProfile = () => {
  router.push('/home/profile');
};

// 侧边栏可见性状态，从 modalStore 获取
const sidebarVisible = computed({
  get: () => modalStore.sidebarVisible,
  set: (value) => modalStore.setSidebarVisible(value)
});

// 提供侧边栏状态给子组件
provide('sidebarVisible', sidebarVisible);

// 切换侧边栏函数 - 只在点击 sidebar-toggle-wrapper 时调用
const toggleSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value;
};

// 处理主内容区域的点击 - 移除自动关闭侧边栏的逻辑
const handleContentClick = () => {
  // 不再自动关闭侧边栏
};
</script>

<style scoped>
  * {
      touch-action: pan-y;
  }
  
  html, body {
      overflow: hidden !important;
      height: 100% !important;
      width: 100% !important;
      position: fixed !important;
      touch-action: none;
  }
  
  .Home-page {
      display: flex;
      height: 100vh;
      width: 100vw;
      background-color: black;
      color: white;
      overflow: hidden;
      position: relative;
      touch-action: none;
  }

  /* 背景效果 */
  .background-effects {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
      overflow: hidden;
      pointer-events: none;
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
  .right-sidebar {
    width: 6rem;
    border-left: 2px solid #303336;
  }
  .left-sidebar {
      width: 6rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0;
      border-right: 1px solid #303336;
      height: 100vh;
      position: relative; /* 修改为相对定位 */
      z-index: 100;
      background-color: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(5px);
      overflow: hidden;
      touch-action: none;
      flex-shrink: 0;
      transition: width 0.3s ease; /* 修改过渡效果 */
  }

  .left-sidebar:not(.sidebar-visible) {
      width: 0; /* 隐藏时宽度为0 */
      border-right: none;
  }
  
  .right-sidebar {
      width: 6rem;
      border-left: 1px solid #303336;
      position: sticky;
      top: 0;
      height: 100vh;
      z-index: 10;
      background-color: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(5px);
      overflow: hidden;
      touch-action: none;
      flex-shrink: 0;
      transition: width 0.3s ease; /* 添加过渡效果 */
  }
  
  .right-sidebar:not(.sidebar-visible) {
      width: 0; /* 隐藏时宽度为0 */
      border-left: none;
  }
  
  .sidebar-toggle-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
  }
  
  
  @media (max-width: 768px) {
      .mobile-only {
          display: flex;
      }
  }

  @media (max-width: 1024px) {
      .right-sidebar {
          width: 1rem;
      }
  }

  .sidebar-icon {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2.5rem;
      flex: 1;
      padding-top: 3.5rem;
      margin-bottom: 2rem;
      overflow-y: auto;
      overflow-x: hidden;
      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none; /* IE and Edge */
      touch-action: pan-y;
      -webkit-overflow-scrolling: touch;
  }

  .sidebar-icon::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera */
  }

  .icon {
      width: 28px;
      height: 28px;
      opacity: 0.7;
      transition: opacity 0.3s ease, transform 0.3s ease;
      touch-action: none;
      pointer-events: auto;
      cursor: pointer;
  }

  .icon:hover {
      opacity: 1;
      transform: scale(1.1);
  }

  .profile {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-bottom: 2rem;
      margin-top: auto;
      position: relative;
      flex-shrink: 0;
      touch-action: none;
      cursor: pointer;
  }

  .avatar-circle {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
      position: relative;
      border: 2px solid rgba(255, 255, 255, 0.2);
      transition: border-color 0.3s ease;
  }

  .profile:hover .avatar-circle {
      border-color: rgba(74, 153, 233, 0.6);
  }

  .avatar-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
  }

  .avatar-status {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: #4CAF50;
      border: 2px solid rgba(0, 0, 0, 0.8);
  }

  .profile-text {
      font-size: 0.875rem;
      font-weight: 500;
      opacity: 0.7;
      padding: 0.75rem;
      transition: opacity 0.3s ease;
  }

  .profile:hover .profile-text {
      opacity: 1;
  }

  .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
      z-index: 1;
      touch-action: pan-y;
  }

  .nav-tabs {
    display: flex;
    padding: .8rem;
    gap: 2rem;
    align-items: center;
    justify-content: space-around;
  }

  .tab {
      padding: 0.3rem 0;
      position: relative;
      cursor: pointer;
      opacity: 0.7;
      transition: opacity 0.3s ease;
      & > span {
        font-size: large;
        font-weight: bolder;
      }
  }

  .tab:hover {
      opacity: 1;
  }

  .tab.active {
      opacity: 1;
  }

  .tab.active::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: #4A99E9;
  }
</style>