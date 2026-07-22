// script.js - 交互逻辑与主题切换功能

(function() {
  // 获取DOM元素
  const joinBtn = document.getElementById('joinServerBtn');
  const feedbackBtn = document.getElementById('feedbackBtn');
  const sponsorBtn = document.getElementById('sponsorBtn');
  const copyToast = document.getElementById('copyToast');
  
  // 主题按钮
  const themeButtons = document.querySelectorAll('.theme-btn');
  
  // 要复制的链接
  const serverLink = "www.www.www";
  
  // 反馈链接
  const feedbackUrl = "https://qm.qq.com/q/6FGGOv8uFG";
  
  // 计时器用于隐藏toast
  let toastTimer = null;

  // 显示Toast消息
  function showToast(message = "已复制") {
    // 清除之前的定时器
    if (toastTimer) {
      clearTimeout(toastTimer);
    }
    
    // 更新文字
    copyToast.innerHTML = `<span class="material-icons-outlined">check_circle</span> ${message}`;
    copyToast.classList.add('show');
    
    // 2.5秒后自动隐藏
    toastTimer = setTimeout(() => {
      copyToast.classList.remove('show');
      toastTimer = null;
    }, 2500);
  }

  // 复制文本到剪贴板
  async function copyToClipboard(text) {
    try {
      // 优先使用现代 clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // 降级方案：使用传统的 execCommand
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.style.top = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        return successful;
      }
    } catch (err) {
      console.error('复制失败:', err);
      return false;
    }
  }

  // 加入服务器按钮点击事件
  joinBtn.addEventListener('click', async () => {
    const success = await copyToClipboard(serverLink);
    if (success) {
      showToast('已复制');
    } else {
      showToast('复制失败，请手动复制');
    }
  });

  // 问题反馈按钮点击事件
  feedbackBtn.addEventListener('click', () => {
    // 在新标签页打开反馈链接
    window.open(feedbackUrl, '_blank', 'noopener,noreferrer');
  });

  // 赞助按钮点击事件
  sponsorBtn.addEventListener('click', () => {
    // 提示功能未开发
    showToast('功能未开发，敬请期待');
  });

  // 主题切换逻辑
  function setTheme(themeName) {
    // 移除所有主题属性，恢复默认(樱花粉通过:root定义)
    if (themeName === 'sakura') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', themeName);
    }
    
    // 更新按钮激活状态
    themeButtons.forEach(btn => {
      const btnTheme = btn.getAttribute('data-theme');
      if (btnTheme === themeName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // 绑定主题按钮事件
  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-theme');
      setTheme(theme);
    });
  });

  // 初始化：确保樱花粉主题激活
  if (document.documentElement.hasAttribute('data-theme')) {
    document.documentElement.removeAttribute('data-theme');
  }
  
  // 激活樱花粉按钮样式
  themeButtons.forEach(btn => {
    if (btn.getAttribute('data-theme') === 'sakura') {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // 页面卸载时清除定时器
  window.addEventListener('beforeunload', () => {
    if (toastTimer) {
      clearTimeout(toastTimer);
    }
  });

})();
