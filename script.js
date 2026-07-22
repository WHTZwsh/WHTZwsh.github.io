(function() {
  // ========== 多语言文本 ==========
  const i18n = {
    zh: {
      join: '加入服务器',
      feedback: '问题反馈',
      sponsor: '赞助',
      copied: '已复制',
      thanks: '感谢简幻欢提供公益服务器',
      title: '🌸 MinecraftBE 服务器',
      navTitle: 'MCBE',
      notDeveloped: '功能未开发，敬请期待'
    },
    en: {
      join: 'Join Server',
      feedback: 'Feedback',
      sponsor: 'Sponsor',
      copied: 'Copied',
      thanks: 'Thanks to JianHuanHuan for the free server',
      title: '🌸 MinecraftBE Server',
      navTitle: 'MCBE',
      notDeveloped: 'Feature not available yet'
    }
  };

  let currentLang = 'zh';

  // 更新页面所有带 data-i18n 属性的元素
  function updateLanguage(lang) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (i18n[lang] && i18n[lang][key]) {
        el.textContent = i18n[lang][key];
      }
    });
    
    // 更新标题
    const titleEl = document.querySelector('h1');
    if (titleEl && i18n[lang].title) {
      titleEl.textContent = i18n[lang].title;
    }
    
    // 更新导航栏文字
    const navTitleEl = document.querySelector('.nav-left span:last-child');
    if (navTitleEl && i18n[lang].navTitle) {
      navTitleEl.textContent = i18n[lang].navTitle;
    }
    
    // 语言按钮文字
    const langTextSpan = document.getElementById('langText');
    if (langTextSpan) {
      langTextSpan.textContent = lang === 'zh' ? '中' : 'EN';
    }
  }

  // 切换语言
  function toggleLanguage() {
    currentLang = currentLang === 'zh' ? 'en' : 'zh';
    updateLanguage(currentLang);
  }

  // ========== 主题切换 ==========
  const themeDots = document.querySelectorAll('.theme-dot');
  
  function setTheme(themeName) {
    if (themeName === 'sakura') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', themeName);
    }
    
    themeDots.forEach(dot => {
      const dotTheme = dot.getAttribute('data-theme');
      if (dotTheme === themeName) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  themeDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const theme = dot.getAttribute('data-theme');
      setTheme(theme);
    });
  });

  // 初始化主题为樱花粉
  if (document.documentElement.hasAttribute('data-theme')) {
    document.documentElement.removeAttribute('data-theme');
  }
  document.querySelector('.theme-dot[data-theme="sakura"]').classList.add('active');

  // ========== 语言切换按钮 ==========
  document.getElementById('langToggle').addEventListener('click', toggleLanguage);

  // ========== 功能按钮逻辑 ==========
  const joinBtn = document.getElementById('joinServerBtn');
  const feedbackBtn = document.getElementById('feedbackBtn');
  const sponsorBtn = document.getElementById('sponsorBtn');
  const copyToast = document.getElementById('copyToast');
  const serverLink = "www.www.www";
  const feedbackUrl = "https://qm.qq.com/q/6FGGOv8uFG";
  let toastTimer = null;

  function showToast(messageKey = 'copied') {
    if (toastTimer) clearTimeout(toastTimer);
    const msg = i18n[currentLang][messageKey] || messageKey;
    copyToast.innerHTML = `<span class="material-icons-outlined">check_circle</span> ${msg}`;
    copyToast.classList.add('show');
    toastTimer = setTimeout(() => {
      copyToast.classList.remove('show');
      toastTimer = null;
    }, 2500);
  }

  async function copyToClipboard(text) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textArea);
        return success;
      }
    } catch (err) {
      return false;
    }
  }

  joinBtn.addEventListener('click', async () => {
    await copyToClipboard(serverLink);
    showToast('copied');
  });

  feedbackBtn.addEventListener('click', () => {
    window.open(feedbackUrl, '_blank', 'noopener,noreferrer');
  });

  sponsorBtn.addEventListener('click', () => {
    const msg = i18n[currentLang].notDeveloped || '功能未开发，敬请期待';
    copyToast.innerHTML = `<span class="material-icons-outlined">info</span> ${msg}`;
    copyToast.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      copyToast.classList.remove('show');
      toastTimer = null;
    }, 2500);
  });

  // 清理定时器
  window.addEventListener('beforeunload', () => {
    if (toastTimer) clearTimeout(toastTimer);
  });

  // 初始语言更新
  updateLanguage('zh');
})();
