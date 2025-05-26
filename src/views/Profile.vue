<template>
  <div class="profile-page">
    <div class="background-effects">
      <div class="gradient-orb top-left"></div>
      <div class="gradient-orb bottom-right"></div>
      <div class="grid-overlay"></div>
      <div class="particles-container">
        <div v-for="i in 50" :key="i" class="particle" :style="getParticleStyle()"></div>
      </div>
    </div>

    <div class="content-container">
      <!-- 返回按钮 -->
      <button class="back-button" @click="$router.back()">
        <span class="back-icon">←</span>
        <span>{{ $t('profile.back') }}</span>
      </button>

      <!-- 个人资料卡片 -->
      <div class="profile-card">
        <div class="profile-header">
          <div class="avatar-container">
            <div class="avatar-wrapper">
              <template v-if="userAvatar">
                <img :src="userAvatar" alt="User Avatar" class="avatar-image" />
              </template>
              <template v-else>
                <div class="w-full h-full bg-blue-500 flex items-center justify-center text-white text-5xl">
                  {{ userStore.username ? userStore.username.charAt(0).toUpperCase() : 'U' }}
                </div>
              </template>
              <!-- <div class="avatar-edit">
                <span>+</span>
              </div> -->
            </div>
          </div>
          <h1 class="profile-name">{{ userStore.username || $t('profile.username') }}</h1>
          <p class="profile-email">{{ userStore.user?.email || 'user@example.com' }}</p>
          <div class="membership-badge">
            <span>{{ $t('profile.premiumMember') }}</span>
          </div>
        </div>

        <div class="profile-stats">
          <div class="stat-item">
            <div class="stat-value">{{ userStore.user?.stats?.daysStreak || 42 }}</div>
            <div class="stat-label">{{ $t('profile.daysStreak') }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ userStats?.completedVocabulary || userStore.user?.stats?.wordsLearned || 0 }}</div>
            <div class="stat-label">{{ $t('profile.wordsLearned') }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ userStats?.completedEssays || userStore.user?.stats?.essaysWritten || 0 }}</div>
            <div class="stat-label">{{ $t('profile.essaysWritten') }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ userStats?.completedReadings || 0 }}</div>
            <div class="stat-label">{{ $t('profile.readingsCompleted') }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ userStats?.totalScore || 0 }}</div>
            <div class="stat-label">{{ $t('profile.totalScore') }}</div>
          </div>
        </div>

        <div class="profile-sections">
          <div class="section">
            <h2 class="section-title">{{ $t('profile.personalInfo') }}</h2>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">{{ $t('profile.fullName') }}</div>
                <div class="info-value">{{ userStore.user?.fullName || 'John Doe' }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">{{ $t('profile.email') }}</div>
                <div class="info-value">{{ userStore.user?.email || 'user@example.com' }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">{{ $t('profile.language') }}</div>
                <div class="info-value">
                  <select v-model="currentLanguage" @change="changeLanguage" class="language-select">
                    <option value="en">English</option>
                    <option value="zh">中文</option>
                  </select>
                </div>
              </div>
              <div class="info-item">
                <div class="info-label">{{ $t('profile.memberSince') }}</div>
                <div class="info-value">{{ formatDate(userStore.user?.createdAt) || '2023-09-15' }}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h2 class="section-title">{{ $t('profile.learningGoals') }}</h2>
            <div class="goals-container">
              <div class="goal-item">
                <div class="goal-progress">
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: (userStore.user?.goals?.toefl?.progress || 75) + '%' }"></div>
                  </div>
                  <div class="progress-text">{{ userStore.user?.goals?.toefl?.progress || 75 }}%</div>
                </div>
                <div class="goal-text">{{ $t('profile.toeflGoal') }}</div>
              </div>
              <div class="goal-item">
                <div class="goal-progress">
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: (userStore.user?.goals?.ielts?.progress || 45) + '%' }"></div>
                  </div>
                  <div class="progress-text">{{ userStore.user?.goals?.ielts?.progress || 45 }}%</div>
                </div>
                <div class="goal-text">{{ $t('profile.ieltsGoal') }}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h2 class="section-title">{{ $t('profile.achievements') }}</h2>
            <div class="achievements-grid">
              <div class="achievement-item">
                <div class="achievement-icon">🏆</div>
                <div class="achievement-text">{{ $t('profile.achievement1') }}</div>
              </div>
              <div class="achievement-item">
                <div class="achievement-icon">🔥</div>
                <div class="achievement-text">{{ $t('profile.achievement2') }}</div>
              </div>
              <div class="achievement-item">
                <div class="achievement-icon">📚</div>
                <div class="achievement-text">{{ $t('profile.achievement3') }}</div>
              </div>
              <div class="achievement-item locked">
                <div class="achievement-icon">🌟</div>
                <div class="achievement-text">{{ $t('profile.achievement4') }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useUserStore } from '@/stores/user';
import { getUserStatistics } from '@/api/userProgress';

const { locale } = useI18n();
const currentLanguage = ref(locale.value);
const userStore = useUserStore();
const userStats = ref(null);

// 用户头像，如果用户有自定义头像则使用，否则返回null
const userAvatar = computed(() => {
  return userStore.user?.avatar || null;
});

// 切换语言
const changeLanguage = () => {
  locale.value = currentLanguage.value;
  localStorage.setItem('language', currentLanguage.value);
};

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return null;
  
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // 返回 YYYY-MM-DD 格式
  } catch (error) {
    console.error('日期格式化错误:', error);
    return dateString;
  }
};

// 生成随机粒子样式
const getParticleStyle = () => {
  const size = Math.random() * 4 + 1;
  const posX = Math.random() * 100;
  const posY = Math.random() * 100;
  const duration = Math.random() * 50 + 10;
  const delay = Math.random() * 5;
  const opacity = Math.random() * 0.5 + 0.1;

  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${posX}%`,
    top: `${posY}%`,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`,
    opacity: opacity
  };
};

// 获取用户统计数据
const fetchUserStatistics = async () => {
  try {
    const response = await getUserStatistics();
    if (response && response.success && response.data) {
      userStats.value = response.data;
      console.log('用户统计数据:', userStats.value);
    }
  } catch (error) {
    console.error('获取用户统计数据失败:', error);
  }
};

onMounted(() => {
  // 页面加载动画效果
  document.querySelector('.profile-card').classList.add('animate-in');
  
  // 如果用户已登录但没有加载用户信息，则加载用户信息
  if (userStore.token && !userStore.user) {
    userStore.loadUser();
  }
  
  // 获取用户统计数据
  if (userStore.token) {
    fetchUserStatistics();
  }
});
</script>

<style scoped>
.profile-page {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background-color: black;
  color: white;
  overflow-x: hidden;
}

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
  filter: blur(80px);
  opacity: 0.3;
}

.top-left {
  top: -20vw;
  left: -20vw;
  width: 40vw;
  height: 40vw;
  background: linear-gradient(45deg, #4A99E9, #5C2797);
  animation: float 20s ease-in-out infinite alternate;
}

.bottom-right {
  bottom: -20vw;
  right: -20vw;
  width: 40vw;
  height: 40vw;
  background: linear-gradient(45deg, #5C2797, #4A99E9);
  animation: float 25s ease-in-out infinite alternate-reverse;
}

.grid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 20px 20px;
}

.particles-container {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.particle {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  animation: float-particle linear infinite;
}

@keyframes float-particle {
  0% {
    transform: translateY(0) rotate(0deg);
  }
  100% {
    transform: translateY(-100vh) rotate(360deg);
  }
}

@keyframes float {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(5%, 5%);
  }
}

.content-container {
  position: relative;
  z-index: 1;
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.back-button {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  margin-bottom: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-start;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.back-icon {
  margin-right: 0.5rem;
  font-size: 1.2rem;
}

.profile-card {
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.profile-card.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  position: relative;
}

.avatar-container {
  margin-bottom: 1.5rem;
}

.avatar-wrapper {
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 20px rgba(74, 153, 233, 0.3);
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-edit {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 40px;
  height: 40px;
  background: linear-gradient(45deg, #4A99E9, #5C2797);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.5rem;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
}

.avatar-edit:hover {
  transform: scale(1.1);
}

.profile-name {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(90deg, #4A99E9, #5C2797);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.profile-email {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1rem;
}

.membership-badge {
  background: linear-gradient(90deg, #FFD700, #FFA500);
  padding: 0.3rem 1rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #000;
}

.profile-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(90deg, #4A99E9, #5C2797);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 0.5rem;
}

.profile-sections {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.section:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  border-color: rgba(74, 153, 233, 0.3);
}

.section-title {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.5rem;
}

.info-value {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
}

.language-select {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.3rem 0.5rem;
  border-radius: 0.3rem;
  outline: none;
  cursor: pointer;
}

.goals-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.goal-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.goal-progress {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4A99E9, #5C2797);
  border-radius: 4px;
  transition: width 1s ease;
}

.progress-text {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  min-width: 40px;
}

.goal-text {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.achievement-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.achievement-item:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.1);
}

.achievement-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.achievement-text {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
}

.achievement-item.locked {
  opacity: 0.5;
  position: relative;
}

.achievement-item.locked::after {
  content: '🔒';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.5rem;
}

@media (max-width: 768px) {
  .profile-stats {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .achievements-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>