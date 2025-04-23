import { createVNode, render } from 'vue';
import MessageToast from '@/components/MessageToast.vue';

// 用于存储消息实例的容器
const messageInstances = [];

// 创建DOM容器
const createContainer = () => {
  const container = document.createElement('div');
  container.className = 'message-container';
  document.body.appendChild(container);
  return container;
};

// 创建消息实例
const createMessage = (options) => {
  // 创建容器
  const container = createContainer();
  
  // 创建VNode
  const vnode = createVNode(MessageToast, options);
  
  // 渲染到容器
  render(vnode, container);
  
  // 获取组件实例
  const instance = vnode.component;
  
  // 添加关闭方法
  const close = () => {
    instance.exposed.hide();
    setTimeout(() => {
      render(null, container);
      document.body.removeChild(container);
      const index = messageInstances.indexOf(instance);
      if (index !== -1) {
        messageInstances.splice(index, 1);
      }
    }, 300); // 等待动画结束
  };
  
  // 添加到实例列表
  messageInstances.push(instance);
  
  return {
    close
  };
};

// 消息类型快捷方法
const message = {
  info(message, options = {}) {
    return createMessage({ message, type: 'info', ...options });
  },
  success(message, options = {}) {
    return createMessage({ message, type: 'success', ...options });
  },
  warning(message, options = {}) {
    return createMessage({ message, type: 'warning', ...options });
  },
  error(message, options = {}) {
    return createMessage({ message, type: 'error', ...options });
  },
  // 创建hover提示
  tooltip(message, options = {}) {
    return createMessage({ 
      message, 
      type: 'info', 
      isHover: true, 
      duration: 0, // hover提示不自动关闭
      ...options 
    });
  },
  // 关闭所有消息
  closeAll() {
    messageInstances.forEach(instance => {
      instance.exposed.hide();
    });
  }
};

export default message;