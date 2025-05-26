export default {
  common: {
    back: '返回',
    submit: '提交',
    cancel: '取消',
    confirm: '确认',
    loading: '加载中...',
    success: '成功',
    error: '错误',
    warning: '警告',
    info: '信息'
  },
  login: {
    title: '登录',
    username: '用户名',
    subtitle: '欢迎回来！请登录您的账户',
    email: '邮箱',
    password: '密码',
    loginButton: '登录',
    forgotPassword: '忘记密码？',
    noAccount: '没有账户？',
    loginWithGoogle: '使用谷歌登录',
    successMessage: '登录成功！',
    errorMessage: '登录失败。请重试。',
    googleRedirect: '正在重定向到谷歌认证...',
    signUp: '注册',
    // 新增配置项
    emailPlaceholder: '输入您的邮箱地址',
    usernamePlaceholder: '请输入您的用户名',  // 新增用户名占位符
    loggingIn: '登录中...',
    hidePasswordTooltip: '隐藏密码',
    showPasswordTooltip: '显示密码',
    passwordResetSent: '密码重置链接已发送到您的邮箱'
  },
  signup: {
    title: '注册',
    subtitle: '创建您的账户开始学习',
    username: '用户名',
    email: '邮箱',
    password: '密码',
    confirmPassword: '确认密码',
    signupButton: '注册',
    hasAccount: '已有账户？',
    login: '登录',
    fullName: '全名',
    fullNamePlaceholder: '输入您的全名',
    emailPlaceholder: '输入您的邮箱地址',
    usernamePlaceholder: '请输入您的用户名',  // 新增用户名占位符
    passwordPlaceholder: '输入您的密码',
    hidePassword: '隐藏',
    showPassword: '显示',
    creating: '创建中...',
    createAccount: '创建账户',
    signupWithGoogle: '使用谷歌注册',
    haveAccount: '已有账户？',
    successMessage: '账户创建成功！',
    errorMessage: '创建账户失败。请重试。',
    googleRedirect: '正在重定向到谷歌认证...'
  },
  home: {
    tabs: {
      reading: '阅读',
      listening: '听力',
      speaking: '口语',
      writing: '写作'
    },
    sidebar: {
      home: '首页',
      aiFriend: 'AI 伙伴',
      method: '学习方法',
      analysis: '学习分析',
      membership: '会员',
      settings: '设置',
      profile: '个人资料'
    }
  },
  profile: {
    back: '返回',
    username: '用户名',
    premiumMember: '高级会员',
    daysStreak: '连续学习天数',
    wordsLearned: '已学单词',
    essaysWritten: '已写文章',
    readingsCompleted: '已完成阅读',
    totalScore: '总分数',
    personalInfo: '个人信息',
    fullName: '姓名',
    email: '邮箱',
    language: '语言',
    memberSince: '注册时间',
    learningGoals: '学习目标',
    toeflGoal: 'TOEFL 分数 100+',
    ieltsGoal: 'IELTS 分数 7.5+',
    achievements: '成就',
    achievement1: '连续学习7天',
    achievement2: '连续学习30天',
    achievement3: '学习1000个单词',
    achievement4: '完成所有课程'
  },
  reading: {
    unitSelector: '选择单元',
    progress: '进度',
    words: '单词',
    generateEssay: '生成文章',
    exitLearning: '退出学习'
  },
  vocabulary: {
    exitLearning: '退出学习',
    nextWord: '下一个',
    previousWord: '上一个',
    markAsLearned: '标记为已学'
  },
  essay: {
    back: '返回',
    submitAnswers: '提交答案'
  },
  landing: {
    title: 'AI 托福 & 雅思学习',
    subtitle: '单词记忆 + 场景应用，解锁英语学习新方式',
    startButton: '开始使用',
    features: '特点',
    pricing: '价格',
    community: '社区',
    jobs: '工作'
  },
  features: {
    title: '我们的特点',
    card1: {
      title: '智能词汇学习',
      description: '通过智能算法，根据您的学习进度和记忆曲线，为您提供个性化的词汇学习计划。'
    },
    card2: {
      title: '发音练习',
      description: '使用先进的语音识别技术，帮助您纠正发音，提高口语能力。'
    },
    card3: {
      title: '互动对话',
      description: '与AI助手进行真实对话，提高您的英语交流能力和自信心。'
    },
    card4: {
      title: '智能测评',
      description: '定期评估您的学习进度，找出需要加强的领域，确保学习效果。'
    },
    card5: {
      title: '多平台同步',
      description: '在任何设备上学习，您的进度将自动同步，随时随地继续学习。'
    },
    card6: {
      title: '隐私保护',
      description: '我们重视您的隐私，所有学习数据都经过加密处理，确保安全。'
    },
    cta: {
      title: '准备好开始您的英语学习之旅了吗？',
      description: '立即注册，开始体验FrontierX带来的全新英语学习方式。',
      button: '立即开始'
    }
  },
  pricing: {
    title: '选择适合您的计划',
    popular: '最受欢迎',
    free: {
      title: '免费版',
      price: '¥0',
      period: '永久免费',
      features: [
        '基础词汇学习',
        '有限的每日单词量',
        '基本进度跟踪',
        '社区支持',
        '访问基础阅读材料',
        '每周学习总结'
      ],
      button: '开始使用'
    },
    premium: {
      title: '高级版',
      price: '¥39',
      period: '每月',
      features: [
        '所有免费版功能',
        '无限制单词学习',
        '高级发音练习',
        '个性化学习计划',
        '优先客户支持',
        '无广告体验'
      ],
      button: '立即升级'
    },
    enterprise: {
      title: '企业版',
      price: '联系我们',
      period: '定制方案',
      features: [
        '所有高级版功能',
        '团队管理控制台',
        '学习进度报告',
        '定制学习内容',
        '专属客户经理',
        'API集成支持'
      ],
      button: '联系销售'
    },
    faq: {
      title: '常见问题',
      items: [
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
      ]
    },
    contact: {
      text: '有更多问题？请联系我们',
      email: 'contact@frontierx.com'
    }
  }
}