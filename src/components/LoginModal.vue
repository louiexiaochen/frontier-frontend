<template>
  <div class="login-modal" v-if="show">
    <div class="modal-backdrop" @click="closeModal"></div>
    <div class="modal-container">
      <div class="login-card">
        <div class="close-button-container">
          <button class="close-button" @click="closeModal">×</button>
        </div>
        
        <h1 class="login-title">{{ $t('login.title') }}</h1>
        <p class="login-subtitle">{{ $t('login.subtitle') }}</p>
        
        <form @submit.prevent="handleLogin">
          <!-- 错误消息显示 -->
          <div class="error-message" v-if="errorMessage">
            {{ errorMessage }}
          </div>
          
          <div class="form-group">
            <label for="username">{{ $t('login.username') }}</label>
            <input 
              id="username" 
              type="text" 
              v-model="username" 
              :placeholder="$t('login.usernamePlaceholder')"
              required
            />
          </div>
          
          <div class="form-group password-group">
            <div class="flex justify-between mb-2">
              <label for="password">{{ $t('login.password') }}</label>
              <div class="forgot-password">
                <a href="#" @click.prevent="handleForgotPassword">{{ $t('login.forgotPassword') }}</a>
              </div>
            </div>
            <div class="relative">
              <input 
                id="password" 
                :type="showPassword ? 'text' : 'password'" 
                v-model="password"
                class="w-full pr-10"
                required
              />
              <button 
                type="button" 
                class="absolute inset-y-0 right-0 flex items-center justify-center px-3 text-gray-400 hover:text-white"
                @click="togglePasswordVisibility"
                @mouseenter="showPasswordTooltip"
                @mouseleave="hidePasswordTooltip"
                aria-label="切换密码可见性"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  stroke-width="2" 
                  stroke-linecap="round" 
                  stroke-linejoin="round"
                >
                  <template v-if="showPassword">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </template>
                  <template v-else>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                    <line x1="3" y1="3" x2="21" y2="21"></line>
                  </template>
                </svg>
              </button>
            </div>
          </div>
          
          <button type="submit" class="login-button" :disabled="isLoading">
            {{ isLoading ? $t('login.loggingIn') : $t('login.loginButton') }}
          </button>
          
          <button type="button" class="google-login-button" @click="handleGoogleLogin">
            {{ $t('login.loginWithGoogle') }}
          </button>
          
          <div class="signup-link">
            {{ $t('login.noAccount') }} <a href="#" @click.prevent="toggleSignup">{{ $t('signup.title') }}</a>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import { login } from '@/api/user';
import message from '@/utils/message';
import { useI18n } from 'vue-i18n';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';

const { t } = useI18n();
const userStore = useUserStore();
const router = useRouter();

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'showSignup']);

const username = ref('');
const password = ref('');
const showPassword = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');
let passwordTooltip = null;

const handleLogin = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = '';
    
    const response = await login({
      username: username.value,
      password: password.value
    });
    
    console.log('登录响应:', response);
    
    // 使用Pinia store处理用户登录状态
    if (response.code==0) {
      // 保存token到store
      userStore.token = response.data.token;
      localStorage.setItem('token', response.data.token);
      
      // 加载用户信息
      await userStore.loadUser();
      
      // 显示成功消息
      message.success(response.message || t('login.successMessage'));
      
      // 登录成功后关闭模态窗
      closeModal();
      
      // 刷新页面以显示登录状态
      window.location.reload();
    } else {
      // 错误消息已经由拦截器处理，这里只需要设置本地错误状态
      errorMessage.value = response.message || t('login.errorMessage');
    }
  } catch (error) {
    console.error('登录失败:', error);
    errorMessage.value = error.message || t('login.errorMessage');
  } finally {
    isLoading.value = false;
  }
};

const handleGoogleLogin = () => {
  // 实现Google登录逻辑
  console.log('Login with Google');
  message.info(t('login.googleRedirect'));
};

const handleForgotPassword = () => {
  // 处理忘记密码
  console.log('Forgot password');
  message.info(t('login.passwordResetSent'), { duration: 5000 });
};

const toggleSignup = () => {
  // 切换到注册模态窗
  emit('showSignup');
};

const closeModal = () => {
  emit('close');
};

// 显示密码提示工具提示
const showPasswordTooltip = (event) => {
  const target = event.target;
  const text = showPassword.value ? t('login.hidePasswordTooltip') : t('login.showPasswordTooltip');
  
  // 计算位置
  const rect = target.getBoundingClientRect();
  
  passwordTooltip = message.tooltip(text, {
    position: 'top',
    customStyle: {
      top: `${rect.top - 40}px`,
      left: `${rect.left + rect.width / 2}px`,
      transform: 'translateX(-50%)'
    }
  });
};

// 隐藏密码提示工具提示
const hidePasswordTooltip = () => {
  if (passwordTooltip) {
    passwordTooltip.close();
    passwordTooltip = null;
  }
};

// 切换密码可见性并隐藏提示
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
  hidePasswordTooltip();
};
</script>

<style scoped>
.login-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
}

.modal-container {
  position: relative;
  z-index: 1001;
  width: 100%;
  max-width: 450px;
  padding: 0 20px;
  animation: modalFadeIn 0.3s ease-out;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-card {
  background-color: rgba(24, 24, 27, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  width: 100%;
  position: relative;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.close-button-container {
  position: absolute;
  top: 15px;
  right: 15px;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.close-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.login-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: white;
}

.login-subtitle {
  font-size: 1rem;
  color: #ccc;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: white;
}

input {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  outline: none;
  transition: border-color 0.3s;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

input:focus {
  border-color: #4A99E9;
  box-shadow: 0 0 0 2px rgba(74, 153, 233, 0.2);
}

.password-group {
  position: relative;
}

.password-label {
  float: left;
}

.forgot-password {
  float: right;
  margin-bottom: 0.5rem;
}

.forgot-password a {
  color: #ccc;
  text-decoration: none;
  font-size: 0.9rem;
}

.forgot-password a:hover {
  text-decoration: underline;
  color: white;
}

.login-button {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  color: #000;
  background-color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: all 0.3s;
}

.login-button:hover {
  background-color: #f0f0f0;
  transform: translateY(-2px);
}

.google-login-button {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 500;
  color: white;
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 1.5rem;
  transition: all 0.3s;
}

.google-login-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.signup-link {
  text-align: center;
  font-size: 0.9rem;
  color: #ccc;
}

.signup-link a {
  color: white;
  text-decoration: none;
  font-weight: 600;
}

.signup-link a:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .login-card {
    padding: 1.5rem;
  }
  
  .login-title {
    font-size: 1.75rem;
  }
}

.error-message {
  background-color: rgba(255, 0, 0, 0.1);
  color: #ff6b6b;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  text-align: center;
}

/* 禁用按钮样式 */
.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}
</style>