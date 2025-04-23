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
             <home-icon class="icon" @click="$router.push('/')" />
             
             <ai-friend-icon class="icon" @click="$router.push('/home/ai-friend')" />

             <method-icon class="icon" @click="$router.push('/home/method')" />

             <analysis-icon class="icon" @click="$router.push('/home/analysis')" />

             <membership-icon class="icon" @click="$router.push('/home/membership')" />

             <setting-icon class="icon" @click="$router.push('/home/settings')" />
          </div>

          <div class="profile">
              <span class="profile-text">头像</span>
          </div>
      </div>

      <!-- Overlay for sidebar backdrop -->
      <div 
        v-if="sidebarVisible" 
        class="sidebar-overlay"
        @click="closeSidebar"
      ></div>

      <!--Main content-->
      <div class="main-content" @click="handleContentClick">
          <!--Nav tabs-->
          <div class="nav-tabs">
              <div class="sidebar-toggle-wrapper">
                  <SidebarToggle 
                      :isActive="sidebarVisible" 
                      @click="toggleSidebar" 
                  />
              </div>
              <div v-for="(tab, index) in tabs" :key="index" 
                   class="tab" 
                   :class="{'active': isActiveTab(tab.name)}"
                   @click="navigateToTab(tab.name)">
                  <span>{{ tab.name }}</span>
              </div>
          </div>

          <!-- 子路由内容区域 -->
          <router-view />
      </div>
      
      <!-- Right Sidebar (Empty) -->
      <!-- <div class="sidebar right-sidebar">
      </div> -->
  </div>  
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
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

// 侧边栏可见性状态
const sidebarVisible = ref(false);

// 切换侧边栏函数
const toggleSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value;
};

// 关闭侧边栏函数
const closeSidebar = () => {
  sidebarVisible.value = false;
};

// 处理主内容区域的点击
const handleContentClick = (event) => {
  // 如果点击的不是切换按钮且侧边栏可见，则关闭侧边栏
  const isToggleButton = event.target.closest('.sidebar-toggle-icon');
  if (!isToggleButton && sidebarVisible.value) {
    closeSidebar();
  }
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

  .left-sidebar {
      width: 7rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0;
      border-right: 1px solid #303336;
      height: 100vh;
      position: fixed;
      top: 0;
      left: -7rem; /* 初始隐藏 */
      z-index: 100;
      background-color: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(5px);
      overflow: hidden;
      touch-action: none;
      flex-shrink: 0;
      transition: left 0.3s ease;
  }

  .sidebar-visible {
      left: 0; /* 显示时的位置 */
  }
  
  .sidebar-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 90;
      display: block;
  }
  
  .sidebar-toggle-wrapper {
      display: flex;
      align-items: center;
      margin-right: 1rem;
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
  }

  .profile-text {
      font-size: 0.875rem;
      font-weight: 500;
      opacity: 0.7;
      padding: 0.75rem;
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
      padding: 1.5rem 2rem 0;
      gap: 2rem;
      border-bottom: 1px solid #303336;
      margin-bottom: 1.5rem;
      align-items: center;
  }

  .tab {
      padding: 0.5rem 0;
      position: relative;
      cursor: pointer;
      opacity: 0.7;
      transition: opacity 0.3s ease;
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
      background-color: white;
  }
</style>