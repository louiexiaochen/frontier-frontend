<template>
  <div class="login-page">
    <div class="background-effects">
      <div class="gradient-orb top-left"></div>
      <div class="gradient-orb bottom-right"></div>
      <div class="grid-overlay"></div>
    </div>
    
    <div class="login-container">
      <div class="login-card">
        <h1 class="login-title">Login</h1>
        <p class="login-subtitle">Enter your email below to login to your account</p>
        
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              id="email" 
              type="email" 
              v-model="email" 
              placeholder="m@example.com"
              required
            />
          </div>
          
          <div class="form-group password-group">
            <div class="password-label">
              <label for="password">Password</label>
            </div>
            <div class="forgot-password">
              <a href="#" @click.prevent="handleForgotPassword">Forgot your password?</a>
            </div>
            <input 
              id="password" 
              :type="showPassword ? 'text' : 'password'" 
              v-model="password"
              required
            />
          </div>
          
          <button type="submit" class="login-button">Login</button>
          
          <button type="button" class="google-login-button" @click="handleGoogleLogin">
            Login with Google
          </button>
          
          <div class="signup-link">
            Don't have an account? <a href="#" @click.prevent="goToSignup">Sign up</a>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');
const showPassword = ref(false);

const handleLogin = () => {
  // 这里实现登录逻辑
  console.log('Login with:', email.value, password.value);
  // 登录成功后重定向到主页
  // router.push('/reading');
};

const handleGoogleLogin = () => {
  // 实现Google登录逻辑
  console.log('Login with Google');
};

const handleForgotPassword = () => {
  // 跳转到忘记密码页面
  console.log('Forgot password');
};

const goToSignup = () => {
  // 跳转到注册页面
  router.push('/signup');
};
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  position: relative;
  width: 100%;
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
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
}

.top-left {
  top: -10%;
  left: -10%;
  width: 50%;
  height: 50%;
  background: linear-gradient(135deg, rgba(74, 153, 233, 0.1) 0%, rgba(49, 89, 163, 0.05) 100%);
  animation: float 15s ease-in-out infinite alternate;
}

.bottom-right {
  bottom: -15%;
  right: -15%;
  width: 60%;
  height: 60%;
  background: linear-gradient(225deg, rgba(74, 153, 233, 0.1) 0%, rgba(92, 39, 151, 0.05) 100%);
  animation: float 20s ease-in-out infinite alternate-reverse;
}

.grid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(to right, rgba(48, 51, 54, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(48, 51, 54, 0.05) 1px, transparent 1px);
  background-size: 25px 25px;
  opacity: 0.4;
}

@keyframes float {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(5%, 5%);
  }
}

.login-container {
  width: 100%;
  max-width: 450px;
  padding: 0 20px;
  z-index: 1;
  position: relative;
}

.login-card {
  background-color: white;
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  width: 100%;
}

.login-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: #000;
}

.login-subtitle {
  font-size: 1rem;
  color: #666;
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
  color: #000;
}

input {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.3s;
}

input:focus {
  border-color: #4A99E9;
  box-shadow: 0 0 0 2px rgba(74, 153, 233, 0.1);
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
  color: #000;
  text-decoration: none;
  font-size: 0.9rem;
}

.forgot-password a:hover {
  text-decoration: underline;
}

.login-button {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  background-color: #1a1a1a;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #333;
}

.google-login-button {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 1.5rem;
  transition: background-color 0.3s;
}

.google-login-button:hover {
  background-color: #f5f5f5;
}

.signup-link {
  text-align: center;
  font-size: 0.9rem;
  color: #333;
}

.signup-link a {
  color: #000;
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
</style> 