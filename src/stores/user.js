import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as apiLogin, register as apiRegister, logout as apiLogout, getUserInfo } from '@/api/user'

export const useUserStore = defineStore('user', () => {
  // 状态
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const isLoading = ref(false)
  const error = ref(null)

  // 计算属性
  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const userLevel = computed(() => user.value?.level || 'beginner')
  const username = computed(() => user.value?.username || '')

  // 加载用户信息
  async function loadUser() {
    if (!token.value) return

    try {
      isLoading.value = true
      error.value = null
      
      const response = await getUserInfo()
      user.value = response.data
    } catch (err) {
      error.value = err.response?.data?.message || '加载用户信息失败'
      // 如果令牌无效，清除它
      if (err.response?.status === 401) {
        logout()
      }
    } finally {
      isLoading.value = false
    }
  }

  // 登录
  async function login(email, password) {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await apiLogin({
        username:email,
        password
      })
      
      // 检查响应是否成功
      if (response.success && String(response.code).startsWith('2')) {
        // 适配新的响应格式，token在data字段中
        token.value = response.data.token
        localStorage.setItem('token', token.value)
        
        // 登录后加载用户信息
        await loadUser()
        
        return true
      } else {
        error.value = response.message || '登录失败'
        return false
      }
    } catch (err) {
      error.value = err.message || '登录失败'
      return false
    } finally {
      isLoading.value = false
    }
  }

  // 注册
  async function register(userData) {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await apiRegister(userData)
      
      // 检查响应是否成功
      if (response.success && String(response.code).startsWith('2')) {
        // 适配新的响应格式，token在data字段中
        token.value = response.data.token
        localStorage.setItem('token', token.value)
        
        // 注册后加载用户信息
        await loadUser()
        
        return true
      } else {
        error.value = response.message || '注册失败'
        return false
      }
    } catch (err) {
      error.value = err.message || '注册失败'
      return false
    } finally {
      isLoading.value = false
    }
  }

  // 登出
  async function logout() {
    try {
      if (token.value) {
        await apiLogout()
      }
    } catch (err) {
      console.error('登出时发生错误:', err)
    } finally {
      user.value = null
      token.value = null
      localStorage.removeItem('token')
    }
  }

  // 更新用户信息
  async function updateProfile(userData) {
    if (!token.value) return false

    try {
      isLoading.value = true
      error.value = null
      
      // 注意：API中没有提供updateProfile方法，这里仍使用axios
      // 如果后续添加了相应的API方法，可以替换为API调用
      const response = await axios.put('/api/user/profile', userData, {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
      
      user.value = response.data
      return true
    } catch (err) {
      error.value = err.response?.data?.message || '更新用户信息失败'
      return false
    } finally {
      isLoading.value = false
    }
  }

  // 更新密码
  async function updatePassword(currentPassword, newPassword) {
    if (!token.value) return false

    try {
      isLoading.value = true
      error.value = null
      
      // 注意：API中没有提供updatePassword方法，这里仍使用axios
      await axios.put('/api/user/password', 
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token.value}`
          }
        }
      )
      
      return true
    } catch (err) {
      error.value = err.response?.data?.message || '更新密码失败'
      return false
    } finally {
      isLoading.value = false
    }
  }

  // 更新用户级别
  async function updateLevel(level) {
    if (!token.value || !user.value) return false
    
    try {
      isLoading.value = true
      error.value = null
      
      // 注意：API中没有提供updateLevel方法，这里仍使用axios
      const response = await axios.put('/api/user/level', 
        { level },
        {
          headers: {
            Authorization: `Bearer ${token.value}`
          }
        }
      )
      
      user.value.level = response.data.level
      return true
    } catch (err) {
      error.value = err.response?.data?.message || '更新用户级别失败'
      return false
    } finally {
      isLoading.value = false
    }
  }

  // 检查令牌是否有效
  async function checkAuth() {
    if (!token.value) return false
    
    try {
      // 注意：API中没有提供checkAuth方法，这里仍使用axios
      const response = await axios.get('/api/user/check-auth', {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
      
      return response.data.valid
    } catch (err) {
      logout()
      return false
    }
  }

  // 初始化 - 如果有令牌则加载用户
  function init() {
    if (token.value) {
      loadUser()
    }
  }

  return { 
    // 状态
    user, 
    token, 
    isLoading, 
    error,
    
    // 计算属性
    isAuthenticated,
    isAdmin,
    userLevel,
    username,
    
    // 方法
    login,
    register,
    logout,
    loadUser,
    updateProfile,
    updatePassword,
    updateLevel,
    checkAuth,
    init
  }
})