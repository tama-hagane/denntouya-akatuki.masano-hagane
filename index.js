document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Header Scroll Event
  // ==========================================
  const header = document.getElementById('site-header');
  const scrollThreshold = 50;

  const handleScroll = () => {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check


  // ==========================================
  // 2. Mobile Navigation Toggle
  // ==========================================
  const navToggle = document.getElementById('nav-toggle');
  const siteNav = document.getElementById('site-nav');
  const navLinks = siteNav.querySelectorAll('a');

  const toggleMenu = () => {
    navToggle.classList.toggle('open');
    siteNav.classList.toggle('open');
    document.body.classList.toggle('nav-open'); // Prevent background scrolling
  };

  const closeMenu = () => {
    navToggle.classList.remove('open');
    siteNav.classList.remove('open');
    document.body.classList.remove('nav-open');
  };

  navToggle.addEventListener('click', toggleMenu);
  
  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });


  // ==========================================
  // 3. Hero Video Background Switcher & Mobile Optimization
  // ==========================================
  const videoSwitches = document.querySelectorAll('.btn-switch');
  const heroVideo = document.getElementById('hero-video');

  // 画面幅に基づいてスマホ用軽量動画のパスを返却する
  const getResponsiveVideoPath = (filename) => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      return filename.replace('.mp4', '_mobile.mp4');
    }
    return filename;
  };

  // 動画の再生とフォールバックハンドリング
  const playVideoWithFallback = (videoElement) => {
    const playPromise = videoElement.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        videoElement.classList.remove('autoplay-blocked');
      }).catch(error => {
        console.warn("Video auto-play was prevented. Showing poster/fallback instead:", error);
        videoElement.classList.add('autoplay-blocked');
      });
    }
  };

  // 初期ロード時の動画設定
  const initHeroVideo = () => {
    if (!heroVideo) return;
    const activeBtn = document.querySelector('.btn-switch.active');
    const defaultVideo = activeBtn ? activeBtn.getAttribute('data-video') : 'Video Project 10.mp4';
    const videoSource = heroVideo.querySelector('source');
    
    if (videoSource) {
      videoSource.src = getResponsiveVideoPath(defaultVideo);
      heroVideo.load();
      playVideoWithFallback(heroVideo);
    }
  };

  initHeroVideo();

  // スイッチボタンによる切り替え
  videoSwitches.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetVideo = btn.getAttribute('data-video');
      
      // Active class transition
      videoSwitches.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const videoSource = heroVideo.querySelector('source');
      if (!videoSource) return;
      
      // Fade out effect on video
      heroVideo.style.opacity = 0;
      heroVideo.style.transition = 'opacity 0.5s ease';

      setTimeout(() => {
        videoSource.src = getResponsiveVideoPath(targetVideo);
        heroVideo.load();
        
        // Wait for metadata to load then play and fade in
        heroVideo.addEventListener('loadeddata', () => {
          playVideoWithFallback(heroVideo);
          heroVideo.style.opacity = 1;
        }, { once: true });
      }, 500);
    });
  });


  // ==========================================
  // 4. Scroll Reveal (Intersection Observer)
  // ==========================================
  const revealElements = document.querySelectorAll('.scroll-reveal');

  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Once revealed, no need to observe again
        observer.unobserve(entry.target);
      }
    });
  };

  const revealObserver = new IntersectionObserver(revealCallback, {
    root: null, // viewport
    rootMargin: '0px 0px -10% 0px', // Trigger slightly before element enters view
    threshold: 0.1 // 10% visible
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });


  // ==========================================
  // 5. FAQ Accordion
  // ==========================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionButton = item.querySelector('.faq-question');
    const answerContainer = item.querySelector('.faq-answer');

    questionButton.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      
      // Close all open items first for single accordion behavior
      faqItems.forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-answer').style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('active');
        // Set max-height dynamically to enable CSS transition
        answerContainer.style.maxHeight = answerContainer.scrollHeight + 'px';
      }
    });
  });


  // ==========================================
  // 6. Interactive Color Selector
  // ==========================================
  const colorData = {
    usuzakura: {
      title: '薄桜 — うすざくら —',
      desc: '桜を思わせる、やわらかな色合い。肌なじみが非常によく、耳元に上品でやさしい彩りを添えます。落ち着いたトーンの装いにも、そっと女性らしさを醸し出します。日常に溶け込みつつ、顔周りをパッと明るく見せてくれる人気色です。',
      wearImg: 'model_usuzakura_portrait.png',
      productImg: 'product_usuzakura.jpg',
      gallery: ['model_usuzakura_terrace.png', 'model_usuzakura_terrace_up.png']
    },
    zougeiro: {
      title: '象牙色 — ぞうげいろ —',
      desc: 'やわらかな白を思わせる、落ち着いた色合い。清らかさの中にあたたかみがあり、上品な印象を添えます。どんな洋服のカラーにも合わせやすい万能色で、カジュアルからフォーマル、和装までスタイルを選ばずお使いいただけます。',
      wearImg: 'model_zougeiro_portrait.png',
      productImg: 'product_zougeiro.jpg',
      gallery: ['model_zougeiro_beach_01.png', 'model_zougeiro_beach_02.png', 'model_zougeiro_cafe.png']
    },
    amairo: {
      title: '天色 — あまいろ —',
      desc: '晴れ渡った空を映したような、澄んだ青。軽やかさと涼やかさがあり、耳元に静かな透明感をもたらします。爽やかな夏の日差しにはもちろん、シックな冬のコーディネートのワンポイント差し色としても美しく際立ちます。',
      wearImg: 'model_amairo_portrait.png',
      productImg: 'product_amairo.jpg',
      gallery: ['model_amairo_lobby.png', 'model_amairo_lobby_smile.png', 'model_amairo_wall_up.png']
    },
    aotake: {
      title: '青竹 — あおたけ —',
      desc: 'みずみずしい竹を思わせる、軽やかな緑。爽やかさの中に、凛とした印象を感じる色合いです。和の風情を最も感じさせつつ、ニットやアウターなどの洋装にもスッと馴染んで現代的なお洒落を引き立てます。',
      wearImg: 'model_aotake_portrait.png',
      productImg: 'product_aotake.jpg',
      gallery: ['model_aotake_cafe.png', 'model_aotake_sweater.png']
    },
    benihi: {
      title: '紅緋 — べにひ —',
      desc: '鮮やかで晴れやかな紅緋。装いに凛とした華やかさと、お祝い事のような温かみを添えます。日本人の肌に美しく映える朱赤系の色合いで、シンプルなコーディネートに合わせるだけで、お顔周りがパッと明るく華やぎます。',
      wearImg: 'model_kakiiro_portrait.png',
      productImg: 'product_kakiiro.jpg',
      gallery: ['model_kakiiro_beach.png', 'model_kakiiro_beach_up.png', 'model_kakiiro_cafe.png']
    }
  };

  const colorTabs = document.querySelectorAll('.color-tab');
  const wearImgEl = document.getElementById('wear-img');
  const productImgEl = document.getElementById('product-img');
  const colorTitleEl = document.getElementById('display-color-title');
  const colorDescEl = document.getElementById('display-color-desc');
  const galleryEl = document.getElementById('display-gallery');

  colorTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const selectedColor = tab.getAttribute('data-color');
      const data = colorData[selectedColor];

      if (!data) return;

      // Update active tab state
      colorTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Smooth transition for images and texts
      const elementsToFade = [wearImgEl, productImgEl, colorTitleEl, colorDescEl, galleryEl];
      
      elementsToFade.forEach(el => {
        el.style.opacity = 0;
        el.style.transition = 'opacity 0.35s ease';
      });

      // After fade out completes, change content and fade in
      setTimeout(() => {
        // Change text content
        colorTitleEl.textContent = data.title;
        colorDescEl.textContent = data.desc;
        
        // Change main images
        wearImgEl.src = data.wearImg;
        wearImgEl.alt = `${data.title} 着用イメージ`;
        
        productImgEl.src = data.productImg;
        productImgEl.alt = `${data.title} 商品イメージ`;

        // Rebuild gallery items
        galleryEl.innerHTML = '';
        data.gallery.forEach((imgSrc, index) => {
          const galleryItem = document.createElement('div');
          galleryItem.className = 'gallery-item scroll-reveal revealed'; // Force reveal state for new items
          
          const img = document.createElement('img');
          img.src = imgSrc;
          img.alt = `${data.title} シーンイメージ ${index + 1}`;
          
          galleryItem.appendChild(img);
          galleryEl.appendChild(galleryItem);
        });

        // Fade elements back in
        elementsToFade.forEach(el => {
          el.style.opacity = 1;
        });

      }, 350);
    });
  });

});
