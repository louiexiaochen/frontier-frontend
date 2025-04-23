import { createI18n } from 'vue-i18n'
import zh from './locales/zh'
import en from './locales/en'

// 获取浏览器语言设置或从本地存储中获取
const getLocale = () => {
  const cachedLocale = localStorage.getItem('language')
  if (cachedLocale) {
    return cachedLocale
  }
  
  // 默认使用浏览器语言，如果是中文则使用中文，否则使用英文
  const browserLang = navigator.language.toLowerCase()
  return browserLang.includes('zh') ? 'zh' : 'en'
}

const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: getLocale(),
  fallbackLocale: 'zh', // 回退语言
  messages: {
    zh,
    en
  }
})

export default i18n

// 提供一个切换语言的函数
export function setLocale(locale) {
  i18n.global.locale.value = locale
  localStorage.setItem('language', locale)
  document.querySelector('html').setAttribute('lang', locale)
}