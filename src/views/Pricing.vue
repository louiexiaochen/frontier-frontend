<template>
  <div class="min-h-screen bg-black text-white w-full relative overflow-hidden">
    <!-- 背景效果 -->
    <div class="absolute top-0 left-0 w-full h-full z-0 overflow-hidden">
      <div class="absolute rounded-full filter blur-[4.5vw] top-[-10%] left-[-10%] w-1/2 h-1/2 bg-gradient-to-br from-blue-500/30 to-blue-800/10 animate-float-slow"></div>
      <div class="absolute rounded-full filter blur-[4.5vw] bottom-[-15%] right-[-15%] w-3/5 h-3/5 bg-gradient-to-br from-blue-500/20 to-purple-800/10 animate-float-reverse"></div>
      <div class="absolute top-0 left-0 w-full h-full bg-grid opacity-40"></div>
    </div>
    
    <div class="w-[90%] max-w-[1600px] mx-auto py-[5%] px-[2%] box-border relative z-10">
      <!-- 返回按钮 -->
      <div class="mb-8">
        <button 
          @click="$router.push('/')" 
          class="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors duration-200 rounded-full px-4 py-2"
        >
          <span class="text-white">返回</span>
        </button>
      </div>
      
      <!-- 标题 -->
      <h1 class="mb-16 text-[clamp(2rem,4vw,5rem)] font-bold text-center bg-gradient-to-r from-white to-blue-500 bg-clip-text text-transparent">
        价格方案
      </h1>
      
      <!-- 价格卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <!-- 免费版 -->
        <div class="pricing-card">
          <div class="pricing-header">
            <h3 class="pricing-title">免费版</h3>
            <div class="pricing-price">
              <span class="price">¥0</span>
              <span class="period">永久免费</span>
            </div>
          </div>
          <div class="pricing-features">
            <ul>
              <li v-for="(feature, index) in freeFeatures" :key="index">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <span>{{ feature }}</span>
              </li>
            </ul>
          </div>
          <button class="pricing-button free">开始使用</button>
        </div>
        
        <!-- 高级版 -->
        <div class="pricing-card popular">
          <div class="popular-badge">最受欢迎</div>
          <div class="pricing-header">
            <h3 class="pricing-title">高级版</h3>
            <div class="pricing-price">
              <span class="price">¥39</span>
              <span class="period">每月</span>
            </div>
          </div>
          <div class="pricing-features">
            <ul>
              <li v-for="(feature, index) in premiumFeatures" :key="index">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <span>{{ feature }}</span>
              </li>
            </ul>
          </div>
          <button class="pricing-button premium">立即升级</button>
        </div>
        
        <!-- 企业版 -->
        <div class="pricing-card">
          <div class="pricing-header">
            <h3 class="pricing-title">企业版</h3>
            <div class="pricing-price">
              <span class="price">联系我们</span>
              <span class="period">定制方案</span>
            </div>
          </div>
          <div class="pricing-features">
            <ul>
              <li v-for="(feature, index) in enterpriseFeatures" :key="index">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <span>{{ feature }}</span>
              </li>
            </ul>
          </div>
          <button class="pricing-button enterprise">联系我们</button>
        </div>
      </div>
      
      <!-- 常见问题 -->
      <div class="mt-16">
        <h2 class="text-[clamp(1.5rem,3vw,3rem)] font-bold mb-8 text-center">常见问题</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="faq-item" v-for="(item, index) in faqItems" :key="index">
            <h3 class="faq-question">{{ item.question }}</h3>
            <p class="faq-answer">{{ item.answer }}</p>
          </div>
        </div>
      </div>
      
      <!-- 联系我们 -->
      <div class="text-center mt-16 mb-8">
        <p class="text-lg opacity-80 mb-4">有更多问题？请联系我们</p>
        <a href="mailto:contact@frontierx.com" class="text-blue-400 hover:text-blue-300 transition-colors">contact@frontierx.com</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 直接定义功能列表，不使用i18n
const freeFeatures = [
  '基础词汇学习',
  '有限的每日单词量',
  '基本进度跟踪',
  '社区支持',
  '访问基础阅读材料',
  '每周学习总结'
];

const premiumFeatures = [
  '所有免费版功能',
  '无限制单词学习',
  '高级发音练习',
  '个性化学习计划',
  '优先客户支持',
  '无广告体验'
];

const enterpriseFeatures = [
  '所有高级版功能',
  '团队管理控制台',
  '学习进度报告',
  '定制学习内容',
  '专属客户经理',
  'API集成支持'
];

// 常见问题数据
const faqItems = [
  {
    question: '我可以随时取消订阅吗？',
    answer: '是的，您可以随时取消订阅。取消后，您的高级功能将持续到当前计费周期结束。'
  },
  {
    question: '付款方式有哪些？',
    answer: '我们支持支付宝、微信支付、银联卡以及主流信用卡支付。'
  },
  {
    question: '有学生优惠吗？',
    answer: '是的，我们为学生提供特别优惠。请使用您的学校邮箱注册，系统将自动验证并应用学生折扣。'
  },
  {
    question: '企业版如何计费？',
    answer: '企业版根据用户数量和所需功能定制价格。请联系我们的销售团队获取详细报价。'
  }
];
</script>

  <style scoped>
  @keyframes float {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(5%, 5%);
    }
  }
  
  .animate-float-slow {
    animation: float 15s ease-in-out infinite alternate;
  }
  
  .animate-float-reverse {
    animation: float 20s ease-in-out infinite alternate-reverse;
  }
  
  .bg-grid {
    background-image: 
      linear-gradient(to right, rgba(48, 51, 54, 0.1) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(48, 51, 54, 0.1) 1px, transparent 1px);
    background-size: 1.5vw 1.5vw;
  }
  
  .pricing-card {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 1rem;
    padding: clamp(1rem, 3vw, 2rem);
    transition: all 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.1);
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
  
  .pricing-card:hover {
    transform: translateY(-10px);
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
  
  .pricing-card.popular {
    border-color: rgba(74, 153, 233, 0.5);
    background: rgba(74, 153, 233, 0.1);
    transform: scale(1.05);
    z-index: 1;
    box-shadow: 0 8px 30px rgba(74, 153, 233, 0.2);
  }
  
  .pricing-card.popular:hover {
    transform: scale(1.05) translateY(-10px);
    box-shadow: 0 12px 40px rgba(74, 153, 233, 0.3);
  }
  
  .popular-badge {
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(90deg, #4A99E9, #5C2797);
    color: white;
    padding: 0.5rem 1.5rem;
    border-radius: 20px;
    font-weight: bold;
    font-size: 0.9rem;
    box-shadow: 0 4px 10px rgba(74, 153, 233, 0.3);
  }
  
  .pricing-header {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .pricing-title {
    font-size: clamp(1.5rem, 2vw, 1.8rem);
    font-weight: 700;
    margin-bottom: 1rem;
    background: linear-gradient(90deg, #fff, #4A99E9);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .pricing-price {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .price {
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 700;
  }
  
  .period {
    font-size: clamp(0.8rem, 1vw, 1rem);
    color: rgba(255, 255, 255, 0.6);
  }
  
  .pricing-features {
    margin-bottom: 2rem;
    flex-grow: 1;
  }
  
  .pricing-features ul {
    list-style: none;
    padding: 0;
  }
  
  .pricing-features li {
    display: flex;
    align-items: flex-start;
    margin-bottom: 1rem;
    color: rgba(255, 255, 255, 0.8);
    font-size: clamp(0.9rem, 1vw, 1rem);
    line-height: 1.5;
  }
  
  .pricing-features li svg {
    margin-right: 0.75rem;
    flex-shrink: 0;
    margin-top: 0.25rem;
  }
  
  .pricing-button {
    padding: clamp(0.8rem, 1.5vw, 1rem);
    border-radius: 0.5rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: center;
    border: none;
    font-size: clamp(0.9rem, 1vw, 1rem);
  }
  
  .pricing-button.free {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
  
  .pricing-button.free:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  .pricing-button.premium {
    background: linear-gradient(90deg, #4A99E9, #5C2797);
    color: white;
    box-shadow: 0 4px 15px rgba(74, 153, 233, 0.3);
  }
  
  .pricing-button.premium:hover {
    opacity: 0.9;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(74, 153, 233, 0.4);
  }
  
  .pricing-button.enterprise {
    background: rgba(255, 255, 255, 0.9);
    color: #000;
  }
  
  .pricing-button.enterprise:hover {
    background: white;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 255, 255, 0.2);
  }
  
  .faq-item {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 0.75rem;
    padding: clamp(1rem, 2vw, 1.5rem);
    transition: all 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.1);
    height: 100%;
  }
  
  .faq-item:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(74, 153, 233, 0.3);
    transform: translateY(-5px);
  }
  
  .faq-question {
    font-size: clamp(1rem, 1.5vw, 1.2rem);
    font-weight: 600;
    margin-bottom: 0.75rem;
    color: white;
  }
  
  .faq-answer {
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.6;
    font-size: clamp(0.9rem, 1vw, 1rem);
  }
  
  /* 媒体查询 */
  @media screen and (max-width: 768px) {
    .pricing-card.popular {
      transform: scale(1);
      margin: 2rem 0;
    }
    
    .pricing-card.popular:hover {
      transform: translateY(-10px);
    }
    
    .pricing-features li {
      align-items: flex-start;
    }
    
    .pricing-features li svg {
      margin-top: 0.25rem;
    }
  }
  
  @media screen and (max-width: 480px) {
    .pricing-card {
      padding: 1.5rem;
    }
    
    .popular-badge {
      font-size: 0.8rem;
      padding: 0.4rem 1rem;
    }
  }
  </style>