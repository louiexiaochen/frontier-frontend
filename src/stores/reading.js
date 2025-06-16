import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useReadingStore = defineStore('reading', () => {
  // 状态
  const lastUnitId = ref(null)
  const lastCourseId = ref(null)
  
  // 持久化到 localStorage
  const loadFromStorage = () => {
    try {
      const storedData = localStorage.getItem('reading-memory')
      if (storedData) {
        const data = JSON.parse(storedData)
        lastUnitId.value = data.unitId || null
        lastCourseId.value = data.courseId || null
      }
    } catch (error) {
      console.error('加载阅读记忆失败:', error)
    }
  }
  
  const saveToStorage = () => {
    try {
      localStorage.setItem('reading-memory', JSON.stringify({
        unitId: lastUnitId.value,
        courseId: lastCourseId.value
      }))
    } catch (error) {
      console.error('保存阅读记忆失败:', error)
    }
  }
  
  // 设置最后访问的单元
  const setLastUnit = (unitId) => {
    lastUnitId.value = unitId
    saveToStorage()
  }
  
  // 设置最后访问的课程
  const setLastCourse = (courseId) => {
    lastCourseId.value = courseId
    saveToStorage()
  }
  
  // 初始化
  loadFromStorage()
  
  return {
    lastUnitId,
    lastCourseId,
    setLastUnit,
    setLastCourse
  }
}) 