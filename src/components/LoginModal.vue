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
            <label for="email">{{ $t('login.email') }}</label>
            <input 
              id="email" 
              type="email" 
              v-model="email" 
              :placeholder="$t('login.emailPlaceholder')"
              required
            />
          </div>
          
          <div class="form-group password-group">
            <div class="password-label">
              <label for="password">{{ $t('login.password') }}</label>
            </div>
            <div class="forgot-password">
              <a href="#" @click.prevent="handleForgotPassword">{{ $t('login.forgotPassword') }}</a>
            </div>
            <input 
              id="password" 
              :type="showPassword ? 'text' : 'password'" 
              v-model="password"
              required
            />
            <button 
              type="button" 
              class="password-toggle" 
              @click="showPassword = !showPassword"
              @mouseenter="showPasswordTooltip"
              @mouseleave="hidePasswordTooltip"
            >
              {{ showPassword ? $t('login.hidePassword') : $t('login.showPassword') }}
            </button>
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

const { t } = useI18n();

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'showSignup']);

const email = ref('');
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
      email: email.value,
      password: password.value
    });
    
    console.log('登录成功:', response);
    
    // 显示成功消息
    message.success(t('login.successMessage'));
    
    // 登录成功后关闭模态窗
    closeModal();
    
    // 可以在这里添加登录成功后的其他操作，如刷新页面或重定向
    // 例如：window.location.reload();
  } catch (error) {
    console.error('登录失败:', error);
    errorMessage.value = error.message || t('login.errorMessage');
    
    // 显示错误消息
    message.error(errorMessage.value);
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

.password-toggle {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #ccc;
  cursor: pointer;
  font-size: 0.8rem;
  padding: 5px;
}

.password-toggle:hover {
  color: white;
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