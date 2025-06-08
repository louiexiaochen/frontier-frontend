import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useModalStore = defineStore('modal', () => {
  const showLoginModal = ref(false)
  const showSignupModal = ref(false)
  
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
  
  return {
    showLoginModal,
    showSignupModal,
    openLoginModal,
    closeLoginModal,
    openSignupModal,
    closeSignupModal
  }
}) 