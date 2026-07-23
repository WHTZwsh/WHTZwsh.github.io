(function() {
  const i18n = {
    zh: {
      join: '加入服务器',
      feedback: '问题反馈',
      sponsor: '赞助',
      copied: '已复制',
      thanks: '感谢简幻欢提供公益服务器',
      title: 'MinecraftBE 服务器',
      navTitle: 'MCBE',
      notDeveloped: '功能未开发，敬请期待'
    },
    en: {
      join: 'Join Server',
      feedback: 'Feedback',
      sponsor: 'Sponsor',
      copied: 'Copied',
      thanks: 'Thanks to JianHuanHuan for the free server',
      title: 'MinecraftBE Server',
      navTitle: 'MCBE',
      notDeveloped: 'Feature not available yet'
    }
  };

  let currentLang = 'zh';

  function updateLanguage(lang) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (i18n[lang] && i18n[lang][key]) {
        el.textContent = i18n[lang][key];
      }
    });
    
    const titleEl = document.querySelector('h1');
    if (titleEl && i18n[lang].title) {
      titleEl.textContent = i18n[lang].title;
    }
    
    const navTitleEl = document.querySelector('.nav-left span:last-child');
    if (navTitleEl && i18n[lang].navTitle) {
      navTitleEl.textContent = i18n[lang].navTitle;
    }
    
    const langTextSpan = document.getElementById('langText');
    if (langTextSpan) {
      langTextSpan.textContent = lang === 'zh' ? '中' : 'EN';
    }
  }

  function toggleLanguage() {
    currentLang = currentLang === 'zh' ? 'en' : 'zh';
    updateLanguage(currentLang);
  }

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

  if (document.documentElement.hasAttribute('data-theme')) {
    document.documentElement.removeAttribute('data-theme');
  }
  document.querySelector('.theme-dot[data-theme="sakura"]').classList.add('active');

  document.getElementById('langToggle').addEventListener('click', toggleLanguage);

  const joinBtn = document.getElementById('joinServerBtn');
  const feedbackBtn = document.getElementById('feedbackBtn');
  const sponsorBtn = document.getElementById('sponsorBtn');
  const copyToast = document.getElementById('copyToast');
  const serverLink = "www.www.www";
  const feedbackUrl = "https://qm.qq.com/q/6FGGOv8uFG";
  let toastTimer = null;

  const imageModal = document.createElement('div');
  imageModal.className = 'image-modal';
  imageModal.innerHTML = `
    <div class="image-modal-overlay"></div>
    <div class="image-modal-content">
      <button class="image-modal-close">&times;</button>
      <img src="weixinshoukuai.png" alt="微信收款码">
    </div>
  `;
  document.body.appendChild(imageModal);

  function closeImageModal() {
    imageModal.classList.remove('show');
  }

  imageModal.querySelector('.image-modal-overlay').addEventListener('click', closeImageModal);
  imageModal.querySelector('.image-modal-close').addEventListener('click', closeImageModal);

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
    imageModal.classList.add('show');
  });

  window.addEventListener('beforeunload', () => {
    if (toastTimer) clearTimeout(toastTimer);
  });

  updateLanguage('zh');
})();
