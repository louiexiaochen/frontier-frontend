import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useModalStore = defineStore('modal', () => {
  const showLoginModal = ref(false)
  const showSignupModal = ref(false)
  
  // 添加通用记忆状态
  const lastUnitId = ref(null)
  const lastCourseId = ref(null)
  const sidebarVisible = ref(true)
  
  // 持久化到 localStorage
  const loadFromStorage = () => {
    try {
      const storedData = localStorage.getItem('user-memory')
      if (storedData) {
        const data = JSON.parse(storedData)
        lastUnitId.value = data.unitId || null
        lastCourseId.value = data.courseId || null
        sidebarVisible.value = data.sidebarVisible !== false // 默认为 true
      }
    } catch (error) {
      console.error('加载用户记忆失败:', error)
    }
  }
  
  const saveToStorage = () => {
    try {
      localStorage.setItem('user-memory', JSON.stringify({
        unitId: lastUnitId.value,
        courseId: lastCourseId.value,
        sidebarVisible: sidebarVisible.value
      }))
    } catch (error) {
      console.error('保存用户记忆失败:', error)
    }
  }
  
  function openLoginModal() {
    showLoginModal.value = true
    showSignupModal.value = false
  }
  
  function closeLoginModal() {
    showLoginModal.value = false
  }

  function openSignupModal() {
    showSignupModal.value = true
    showLoginModal.value = false
  }
  
  function closeSignupModal() {
    showSignupModal.value = false
  }
  
  // 设置最后访问的单元
  function setLastUnit(unitId) {
    lastUnitId.value = unitId
    saveToStorage()
  }
  
  // 设置最后访问的课程
  function setLastCourse(courseId) {
    lastCourseId.value = courseId
    saveToStorage()
  }
  
  // 设置侧边栏可见性
  function setSidebarVisible(visible) {
    sidebarVisible.value = visible
    saveToStorage()
  }
  
  // 初始化
  loadFromStorage()
  
  return {
    showLoginModal,
    showSignupModal,
    openLoginModal,
    closeLoginModal,
    openSignupModal,
    closeSignupModal,
    lastUnitId,
    lastCourseId,
    sidebarVisible,
    setLastUnit,
    setLastCourse,
    setSidebarVisible
  }
}) 