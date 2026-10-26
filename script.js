/* =========================================================
   PROJECT: SOUMIC PAUL — THE SHELBY CREATIVE ARCHIVE
   INTERACTIVE ARCHIVE ENGINE
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================
     0. SMOOTH SCROLL (LENIS)
     ========================================================= */
  if (typeof Lenis !== 'undefined' && window.matchMedia('(pointer: fine)').matches) {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  /* =========================================================
     1. SCROLL PROGRESS BAR
     ========================================================= */
  const progressBar = document.getElementById('scroll-progress-bar');
  let progressTicking = false;

  function updateProgress() {
    if (!progressTicking) {
      window.requestAnimationFrame(() => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const percentage = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
        if (progressBar) {
          progressBar.style.width = `${percentage}%`;
        }
        progressTicking = false;
      });
      progressTicking = true;
    }
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* =========================================================
     2. MOBILE NAVIGATION MENU
     ========================================================= */
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navWrap = document.querySelector('.nav-wrap');

  if (mobileBtn && navWrap) {
    mobileBtn.addEventListener('click', () => {
      navWrap.classList.toggle('menu-open');
    });

    const navLinks = navWrap.querySelectorAll('.nav-content a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navWrap.classList.remove('menu-open');
      });
    });
  }

  /* =========================================================
     3. SMOOTH IN-PAGE ANCHOR NAVIGATION & ACTIVE LINK
     ========================================================= */
  const NAV_OFFSET = 70;
  const navLinks = document.querySelectorAll('.nav-content nav a');
  const chapters = document.querySelectorAll('.archive-chapter');

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - NAV_OFFSET;
      window.scrollTo({
        top,
        behavior: 'smooth'
      });

      if (history.pushState) {
        history.pushState(null, '', targetId);
      }
    });
  });

  // Active link indicator
  function updateActiveNav() {
    let currentId = '';
    const scrollPos = window.scrollY + window.innerHeight * 0.4;

    chapters.forEach(chapter => {
      const top = chapter.offsetTop;
      const height = chapter.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = chapter.getAttribute('id');
      }
    });

    if (currentId) {
      navLinks.forEach(link => {
        const href = link.getAttribute('href').replace('#', '');
        if (href === currentId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  /* =========================================================
     4. HERO TYPING EFFECT
     ========================================================= */
  const typingElement = document.getElementById('hero-typing-text');
  if (typingElement) {
    const textToType = typingElement.getAttribute('data-text') || typingElement.innerText;
    typingElement.innerText = '';
    let charIndex = 0;

    setTimeout(() => {
      const typeInterval = setInterval(() => {
        if (charIndex < textToType.length) {
          typingElement.innerText += textToType.charAt(charIndex);
          charIndex++;
        } else {
          clearInterval(typeInterval);
        }
      }, 18);
    }, 200);
  }

  /* =========================================================
     5. STATS COUNT-UP ANIMATION
     ========================================================= */
  const counters = document.querySelectorAll('.count-up');
  let hasCounted = false;

  if (counters.length > 0) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !hasCounted) {
        hasCounted = true;
        counters.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          const duration = 1800;
          const increment = target / (duration / 16);

          let current = 0;
          const updateCounter = () => {
            current += increment;
            if (current < target) {
              counter.innerText = Math.ceil(current);
              requestAnimationFrame(updateCounter);
            } else {
              counter.innerText = target;
            }
          };
          updateCounter();
        });
      }
    }, { threshold: 0.2 });

    const statsContainer = document.getElementById('about-stats');
    if (statsContainer) statsObserver.observe(statsContainer);
  }

  /* =========================================================
     6. EDUCATION TIMELINE FILL ON SCROLL
     ========================================================= */
  const eduTimeline = document.getElementById('edu-timeline-container');
  const eduFill = document.getElementById('edu-line-fill');

  if (eduTimeline && eduFill) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const rect = eduTimeline.getBoundingClientRect();
          const start = window.innerHeight * 0.6;
          if (rect.top > start) {
            eduFill.style.height = '0%';
          } else if (rect.bottom < start) {
            eduFill.style.height = '100%';
          } else {
            const total = rect.height;
            const passed = start - rect.top;
            const percentage = Math.max(0, Math.min(100, (passed / total) * 100));
            eduFill.style.height = `${percentage}%`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* =========================================================
     7. THE ACHIEVEMENT DECK: CARD SHUFFLE ENGINE
     ========================================================= */
  const deckContainer = document.getElementById('certificateDeck');
  const shuffleBtn = document.getElementById('shuffleDeckBtn');
  const deckCounter = document.getElementById('deckCounter');

  if (deckContainer) {
    let cards = Array.from(deckContainer.querySelectorAll('.archive-deck-card'));
    const totalCards = cards.length;
    let isShuffling = false;

    // Apply visual stacking positions to each card in the deck
    function renderDeckStack(fanned = false) {
      const isMobile = window.innerWidth <= 768;
      const count = cards.length;

      cards.forEach((card, i) => {
        // i = 0 is the top card, i = count - 1 is the back card
        const depth = i;
        const zIndex = count - i;

        // Visual offsets
        let xOffset = 0;
        let yOffset = 0;
        let rot = 0;
        let scale = 1 - (depth * 0.022);

        if (isMobile) {
          // Horizontal staggered fan on mobile
          const centerIndex = (count - 1) / 2;
          xOffset = (i - centerIndex) * 22;
          yOffset = Math.abs(i - centerIndex) * 6;
          rot = (i - centerIndex) * 1.5;
        } else {
          // 3D archival deck stack on desktop
          if (fanned) {
            // Wide fan outward
            const center = (count - 1) / 2;
            xOffset = (i - center) * 60;
            yOffset = Math.pow(Math.abs(i - center), 1.3) * 6;
            rot = (i - center) * 3;
          } else {
            // Natural archival layered stack with subtle authentic rotations
            const offsets = [
              { x: 0, y: 0, r: 0 },
              { x: 18, y: 10, r: 2.5 },
              { x: -16, y: 18, r: -2 },
              { x: 28, y: 24, r: 3.5 },
              { x: -24, y: 30, r: -3 },
              { x: 36, y: 36, r: 4 },
              { x: -32, y: 42, r: -4 },
              { x: 44, y: 48, r: 5 },
              { x: -40, y: 54, r: -4.5 },
              { x: 50, y: 60, r: 5.5 },
              { x: -46, y: 64, r: -5 },
              { x: 54, y: 68, r: 6 }
            ];
            const preset = offsets[i] || { x: (i % 2 === 0 ? 1 : -1) * i * 4, y: i * 6, r: (i % 2 === 0 ? 1 : -1) * i * 0.5 };
            xOffset = preset.x;
            yOffset = preset.y;
            rot = preset.r;
          }
        }

        card.style.zIndex = zIndex;
        card.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0) rotate(${rot}deg) scale(${scale})`;
        card.style.opacity = Math.max(0.4, 1 - depth * 0.05);
      });

      if (deckCounter && cards[0]) {
        const topTitle = cards[0].querySelector('h4') ? cards[0].querySelector('h4').innerText : 'Archive';
        deckCounter.innerText = `ACTIVE RECORD: ${topTitle.toUpperCase()}`;
      }
    }

    // Initial render
    renderDeckStack(false);

    // Shuffle execution
    function performShuffle() {
      if (isShuffling) return;
      isShuffling = true;

      if (shuffleBtn) {
        shuffleBtn.disabled = true;
        shuffleBtn.style.opacity = '0.7';
      }

      // Step 1: Fan cards wide outward with animation
      cards.forEach((card, idx) => {
        const direction = idx % 2 === 0 ? 1 : -1;
        const spreadX = direction * (window.innerWidth < 768 ? 90 : 180 + Math.random() * 80);
        const spreadY = (Math.random() - 0.5) * 80;
        const spreadRot = direction * (12 + Math.random() * 10);

        card.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
        card.style.transform = `translate3d(${spreadX}px, ${spreadY}px, 0) rotate(${spreadRot}deg) scale(0.95)`;
      });

      // Step 2: Swap the order of cards (cycle top cards to back and promote new cards)
      setTimeout(() => {
        // Move the top 3 cards to the back of the deck
        const moved = cards.splice(0, 3);
        cards = cards.concat(moved);

        // Re-append in DOM so stacking order updates cleanly
        cards.forEach(card => deckContainer.appendChild(card));

        // Step 3: Re-stack into clean archival order
        setTimeout(() => {
          cards.forEach(card => {
            card.style.transition = 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)';
          });
          renderDeckStack(false);

          setTimeout(() => {
            isShuffling = false;
            if (shuffleBtn) {
              shuffleBtn.disabled = false;
              shuffleBtn.style.opacity = '1';
            }
          }, 650);
        }, 120);
      }, 450);
    }

    if (shuffleBtn) {
      shuffleBtn.addEventListener('click', performShuffle);
    }

    // Hover fanning on desktop
    if (window.matchMedia('(pointer: fine)').matches) {
      deckContainer.addEventListener('mouseenter', () => {
        if (!isShuffling) renderDeckStack(true);
      });

      deckContainer.addEventListener('mouseleave', () => {
        if (!isShuffling) renderDeckStack(false);
      });
    }

    // Clicking any card brings it to the top or opens it
    cards.forEach(card => {
      card.addEventListener('click', (e) => {
        // If it's already top card, openCertificate is handled by onclick attribute
        if (cards.indexOf(card) !== 0 && !isShuffling) {
          e.stopPropagation();
          // Move clicked card to top
          const index = cards.indexOf(card);
          cards.splice(index, 1);
          cards.unshift(card);
          cards.forEach(c => deckContainer.appendChild(c));
          renderDeckStack(false);
        }
      });
    });
  }

  /* =========================================================
     8. AMBIENT SMOKE & ATMOSPHERIC FOG CANVAS
     High performance, hardware-accelerated subtle particles
     ========================================================= */
  const canvas = document.getElementById('ambient-smoke');
  if (canvas && window.innerWidth > 600) {
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    window.addEventListener('resize', () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }, { passive: true });

    const particles = [];
    const maxParticles = 24;

    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 120 + 80,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.4 - 0.15,
        alpha: Math.random() * 0.08 + 0.02,
        maxAlpha: Math.random() * 0.07 + 0.03
      });
    }

    function renderSmoke() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < -p.radius * 2) {
          p.y = height + p.radius;
          p.x = Math.random() * width;
        }
        if (p.x < -p.radius) p.x = width + p.radius;
        if (p.x > width + p.radius) p.x = -p.radius;

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        // Warm amber-tinted smoke mist
        grad.addColorStop(0, `rgba(180, 150, 105, ${p.alpha})`);
        grad.addColorStop(0.6, `rgba(28, 26, 23, ${p.alpha * 0.4})`);
        grad.addColorStop(1, 'transparent');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(renderSmoke);
    }

    renderSmoke();
  }

});

/* =========================================================
   9. GLOBAL MODAL CONTROLLERS (CERTIFICATES & BLUEPRINTS)
   ========================================================= */

function openCertificate(imgSrc, title, desc) {
  const modal = document.getElementById('certModal');
  const modalImg = document.getElementById('certModalImg');
  const modalTitle = document.getElementById('certModalTitle');
  const modalDesc = document.getElementById('certModalDesc');

  if (!modal || !modalImg) return;

  if (modalTitle) modalTitle.innerHTML = title;
  if (modalDesc) modalDesc.innerHTML = desc;

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  window.requestAnimationFrame(() => {
    if (modalImg.getAttribute('src') !== imgSrc) {
      modalImg.src = imgSrc;
    }
  });
}

function closeCertificate() {
  const modal = document.getElementById('certModal');
  if (!modal) return;

  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function openImage(imgSrc) {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('imageModalImg');
  if (!modal || !modalImg) return;

  modalImg.src = imgSrc;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeImage() {
  const modal = document.getElementById('imageModal');
  if (!modal) return;

  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeCertificate();
    closeImage();
  }
});