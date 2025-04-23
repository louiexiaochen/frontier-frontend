<template>
  <div class="signup-modal" v-if="show">
    <div class="modal-backdrop" @click="closeModal"></div>
    <div class="modal-container">
      <div class="signup-card">
        <div class="close-button-container">
          <button class="close-button" @click="closeModal">×</button>
        </div>
        
        <h1 class="signup-title">{{ $t('signup.title') }}</h1>
        <p class="signup-subtitle">{{ $t('signup.subtitle') }}</p>
        
        <form @submit.prevent="handleSignup">
          <!-- 错误信息显示 -->
          <div class="error-message" v-if="errorMessage">
            {{ errorMessage }}
          </div>
          
          <div class="form-group">
            <label for="name">{{ $t('signup.fullName') }}</label>
            <input 
              id="name" 
              type="text" 
              v-model="name" 
              :placeholder="$t('signup.fullNamePlaceholder')"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="signup-email">{{ $t('signup.email') }}</label>
            <input 
              id="signup-email" 
              type="email" 
              v-model="email" 
              :placeholder="$t('signup.emailPlaceholder')"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="signup-password">{{ $t('signup.password') }}</label>
            <input 
              id="signup-password" 
              :type="showPassword ? 'text' : 'password'" 
              v-model="password"
              :placeholder="$t('signup.passwordPlaceholder')"
              required
            />
            <button 
              type="button" 
              class="password-toggle" 
              @click="showPassword = !showPassword"
            >
              {{ showPassword ? $t('signup.hidePassword') : $t('signup.showPassword') }}
            </button>
          </div>
          
          <button type="submit" class="signup-button" :disabled="isLoading">
            {{ isLoading ? $t('signup.creating') : $t('signup.createAccount') }}
          </button>
          
          <button type="button" class="google-signup-button" @click="handleGoogleSignup">
            {{ $t('signup.signupWithGoogle') }}
          </button>
          
          <div class="login-link">
            {{ $t('signup.haveAccount') }} <a href="#" @click.prevent="toggleLogin">{{ $t('login.title') }}</a>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import { register } from '@/api/user';
import { useI18n } from 'vue-i18n';
import message from '@/utils/message';

const { t } = useI18n();

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'showLogin']);

const name = ref('');
const email = ref('');
const password = ref('');
const showPassword = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');

const handleSignup = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = '';
    
    const response = await register({
      username: name.value,
      email: email.value,
      password: password.value,
      level: 'beginner' // 默认级别，可以根据需要修改
    });
    
    console.log('注册成功:', response);
    
    // 显示成功消息
    message.success(t('signup.successMessage'));
    
    // 注册成功后关闭模态窗
    closeModal();
    
    // 可以在这里添加注册成功后的其他操作，如刷新页面或重定向
    // 例如：window.location.reload();
  } catch (error) {
    console.error('注册失败:', error);
    errorMessage.value = error.message || t('signup.errorMessage');
    
    // 显示错误消息
    message.error(errorMessage.value);
  } finally {
    isLoading.value = false;
  }
};

const handleGoogleSignup = () => {
  // 实现Google注册逻辑
  console.log('Sign up with Google');
  message.info(t('signup.googleRedirect'));
};

const toggleLogin = () => {
  // 切换到登录模态窗
  emit('showLogin');
};

const closeModal = () => {
  emit('close');
};
</script>

<style scoped>
.signup-modal {
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

.signup-card {
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

.signup-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: white;
}

.signup-subtitle {
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

.signup-button {
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

.signup-button:hover {
  background-color: #f0f0f0;
  transform: translateY(-2px);
}

.google-signup-button {
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

.google-signup-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.login-link {
  text-align: center;
  font-size: 0.9rem;
  color: #ccc;
}

.login-link a {
  color: white;
  text-decoration: none;
  font-weight: 600;
}

.login-link a:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .signup-card {
    padding: 1.5rem;
  }
  
  .signup-title {
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
.signup-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}
</style>