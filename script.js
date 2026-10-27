/* =========================================================
   PROJECT: SP — THE CINEMATIC CREATIVE ARCHIVE
   Complete Portfolio Redesign & Motion Graphics Experience
   Direction: Peaky Blinders × British Industrial Revolution × Vintage Cinema
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================
     1. NATURAL, RESPONSIVE SCROLLING & RAILWAY PROGRESS TRACK
     Steel rails + sleepers with miniature brass locomotive
     ========================================================= */

  const railwayLoco = document.getElementById('railwayLocomotiveGlyph');
  const railwayChapter = document.getElementById('railwayCurrentChapter');
  let progressTicking = false;

  const chapterNames = {
    'home': 'CHAPTER 01 // THE ARRIVAL',
    'about': 'CHAPTER 02 // THE DOSSIER',
    'work': 'CHAPTER 03 // CASE FILES',
    'reels': 'CHAPTER 04 // THE NEXT REEL',
    'gazette': 'CHAPTER 05 // THE GAZETTE',
    'experience': 'CHAPTER 06 // THE GUILD',
    'education': 'CHAPTER 07 // ACADEMIC RECORD',
    'skills': 'CHAPTER 08 // THE ARSENAL',
    'certificates': 'CHAPTER 09 // THE DECORATIONS',
    'contact': 'CHAPTER 10 // THE TRANSMISSION'
  };

  function updateRailwayProgress() {
    if (!progressTicking) {
      window.requestAnimationFrame(() => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const percentage = scrollHeight > 0 ? Math.min(100, Math.max(0, (window.scrollY / scrollHeight) * 100)) : 0;

        if (railwayLoco) {
          railwayLoco.style.left = `${percentage}%`;
        }
        progressTicking = false;
      });
      progressTicking = true;
    }
  }

  window.addEventListener('scroll', updateRailwayProgress, { passive: true });
  updateRailwayProgress();

  /* =========================================================
     2. ANCHOR NAVIGATION — NATIVE SMOOTH JUMPS
     Zero-latency browser scrolling with navigation offset
     ========================================================= */

  const NAV_OFFSET = 76;

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

  /* =========================================================
     3. ZERO-REFLOW ACTIVE NAV & CHAPTER INDICATOR
     Uses IntersectionObserver to avoid layout thrashing on scroll
     ========================================================= */

  const navLinks = document.querySelectorAll('.nav-content nav a');
  const chapters = document.querySelectorAll('.archive-chapter');

  if (chapters.length > 0) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          
          // Update navigation active states
          navLinks.forEach(link => {
            const href = link.getAttribute('href').replace('#', '');
            if (href === currentId) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });

          // Update railway station progress readout
          if (railwayChapter && chapterNames[currentId]) {
            railwayChapter.innerText = chapterNames[currentId];
          }
        }
      });
    }, {
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    });

    chapters.forEach(chapter => navObserver.observe(chapter));
  }

  /* =========================================================
     4. MOBILE MENU ACCESSIBILITY
     ========================================================= */

  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navWrap = document.querySelector('.nav-wrap');

  if (mobileBtn && navWrap) {
    mobileBtn.addEventListener('click', () => {
      navWrap.classList.toggle('menu-open');
    });

    const navItems = navWrap.querySelectorAll('.nav-content a');
    navItems.forEach(link => {
      link.addEventListener('click', () => {
        navWrap.classList.remove('menu-open');
      });
    });
  }

  /* =========================================================
     5. BRITISH STEAM LOCOMOTIVE OPENING SEQUENCE (SCENE A)
     Atmospheric arrival, reveals hero, skippable, session-cached
     ========================================================= */

  const trainScene = document.getElementById('trainOpeningScene');
  const enterBtn = document.getElementById('enterArchiveBtn');

  function completeTrainSequence() {
    if (!trainScene || trainScene.classList.contains('train-finished')) return;
    trainScene.classList.add('train-finished');
    sessionStorage.setItem('sp_train_arrival_seen', 'true');
    setTimeout(() => {
      trainScene.style.display = 'none';
    }, 850);
  }

  if (trainScene) {
    // If previously seen or prefers reduced motion, skip automatically
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (sessionStorage.getItem('sp_train_arrival_seen') === 'true' || prefersReducedMotion) {
      trainScene.classList.add('train-finished');
      trainScene.style.display = 'none';
    } else {
      // Auto-dissolve into hero scene after 3.8s
      const autoTimer = setTimeout(completeTrainSequence, 4000);

      if (enterBtn) {
        enterBtn.addEventListener('click', () => {
          clearTimeout(autoTimer);
          completeTrainSequence();
        });
      }

      // Allow Escape key or user scrolling to bypass intro
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          clearTimeout(autoTimer);
          completeTrainSequence();
        }
      });

      window.addEventListener('wheel', () => {
        if (window.scrollY > 40) {
          clearTimeout(autoTimer);
          completeTrainSequence();
        }
      }, { passive: true });
    }
  }

  /* =========================================================
     6. DESKTOP CINEMATIC FOCUS CURSOR
     Precision brass focus crosshair with smooth tracking
     ========================================================= */

  const cursor = document.getElementById('cinematicCursor');
  if (cursor && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    function renderCursor() {
      currentX += (mouseX - currentX) * 0.22;
      currentY += (mouseY - currentY) * 0.22;
      cursor.style.left = `${currentX}px`;
      cursor.style.top = `${currentY}px`;
      requestAnimationFrame(renderCursor);
    }
    renderCursor();

    const hoverables = document.querySelectorAll('a, button, .archive-deck-card, .news-clipping, .lens-tab, .arsenal-card');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });
  }

  /* =========================================================
     7. STATS COUNT-UP ANIMATION
     ========================================================= */

  const counters = document.querySelectorAll('.count-up');
  let hasCounted = false;

  if (counters.length > 0) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !hasCounted) {
        hasCounted = true;
        counters.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          const duration = 1600;
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
        statsObserver.unobserve(entries[0].target);
      }
    }, { threshold: 0.25 });

    const statsContainer = document.getElementById('about-stats');
    if (statsContainer) statsObserver.observe(statsContainer);
  }

  /* =========================================================
     8. GAZETTE BROADSHEET 3D UNFOLDING ENGINE
     Triggers perspective unfolding when entering viewport
     ========================================================= */

  const gazetteWrapper = document.getElementById('gazetteWrapper');
  if (gazetteWrapper) {
    const gazetteObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          gazetteWrapper.classList.add('newspaper-unfolded');
          gazetteObserver.unobserve(gazetteWrapper);
        }
      });
    }, { threshold: 0.15 });

    gazetteObserver.observe(gazetteWrapper);
  }

  /* =========================================================
     9. CHAPTER 06: THE GUILD — THE CINEMATIC LENS ENGINE
     Viewfinder optics, aperture adjustments & verified case logs
     ========================================================= */

  const leadershipRecords = [
    {
      org: "AUST ROBOTICS CLUB",
      role: "Assistant Director – Administration",
      tenure: "JAN 2025 – PRESENT",
      spec: { shutter: "1/1000s", aperture: "f/1.4", focal: "50mm PRIME" },
      img: "assets/AUST_RC.png",
      imgAlt: "AUST Robotics Club Official Insignia",
      index: "REC // 01",
      seal: "OFFICIAL DISPATCH RECORD",
      narrative: "Oversee high-stakes administrative operations, coordinate cross-team engineering workflows, govern schedules, and drive large-scale organizational initiatives across the university.",
      points: [
        "Led end-to-end planning and flawless execution of 2 major national robotics events.",
        "Coordinated 200+ event participants and 70+ operational volunteers on the ground.",
        "Managed vendor negotiations, equipment procurement, and comprehensive event logistics.",
        "Engineered cross-functional frameworks for prompt conflict resolution and execution."
      ],
      citation: "REF: ARC-ADM-2025-SP"
    },
    {
      org: "TICKIFY",
      role: "Student Ambassador",
      tenure: "SEPT 2026 – PRESENT",
      spec: { shutter: "1/500s", aperture: "f/2.0", focal: "35mm WIDE" },
      img: "assets/Tickify.jpg",
      imgAlt: "Tickify Insignia",
      index: "REC // 02",
      seal: "CAMPUS LIAISON DOSSIER",
      narrative: "Representing Tickify within the university ecosystem — driving strategic awareness, successfully onboarding student creators, and channeling vital user feedback directly back to the engineering team.",
      points: [
        "Spearheading campus-wide outreach to onboard engineering & tech creator cohorts.",
        "Formulating viral promotional blueprints for university events and student festivals.",
        "Synthesizing bi-weekly user friction telemetry for core product leads."
      ],
      citation: "REF: TCK-AMB-2026-SP"
    },
    {
      org: "HSBC BUSINESS CASE COMPETITION",
      role: "National Round Qualifier",
      tenure: "2025 // NATIONAL STAGE",
      spec: { shutter: "1/1000s", aperture: "f/2.8", focal: "85mm TELE" },
      img: "assets/HSBC_Logo.svg",
      imgAlt: "HSBC Business Case Emblem",
      index: "REC // 03",
      seal: "STRATEGIC COMPETITION RECORD",
      narrative: "Competed in Bangladesh's foremost undergraduate business strategy arena, formulating high-impact turnaround blueprints under strict time-lock constraints.",
      points: [
        "Synthesized multi-tiered financial models and corporate risk mitigation frameworks under 6-hour pressure windows.",
        "Architected boardroom-grade pitch decks delivered before senior banking executives and management consultants.",
        "Advanced through rigorous university preliminaries to represent AUST on the national qualifying stage."
      ],
      citation: "REF: HSBC-BC-2025-NAT"
    },
    {
      org: "PRISM AI CREATIVE AWARDS",
      role: "Worldwide Top 15 Finalist",
      tenure: "2026 // GLOBAL STAGE",
      spec: { shutter: "1/250s", aperture: "f/1.2", focal: "24mm CINE" },
      img: "assets/Prism_Logo.png",
      imgAlt: "PRISM AI Creative Awards Emblem",
      index: "REC // 04",
      seal: "CREATIVE TECH COMMENDATION",
      narrative: "Selected into the Top 15 Finalist cohort out of more than 4,000+ international participants in the flagship AI Advertisement discipline. Developed a cinematic narrative utilizing leading generative video synthesis.",
      points: [
        "Recognized worldwide among top 15 entries for pioneering cinematic generative direction and narrative coherence.",
        "Integrated cutting-edge AI diffusion models with high-precision post-production color grading and sound design.",
        "Demonstrated the fusion of engineering discipline with instinctual cinematic worldbuilding."
      ],
      citation: "REF: PRM-TOP15-2026-GLB"
    }
  ];

  const lensTabs = document.querySelectorAll('.lens-tab');
  const lensSubjectImg = document.getElementById('lensSubjectImg');
  const lensShutterSpec = document.getElementById('lensShutterSpec');
  const lensApertureSpec = document.getElementById('lensApertureSpec');
  const lensFocalSpec = document.getElementById('lensFocalSpec');
  const activeDossierCard = document.getElementById('lensActiveDossier');

  function renderInvestigationRecord(recIndex) {
    const data = leadershipRecords[recIndex];
    if (!data) return;

    // Optical blur & refocus transition
    if (lensSubjectImg) {
      lensSubjectImg.classList.add('defocus');
      setTimeout(() => {
        lensSubjectImg.src = data.img;
        lensSubjectImg.alt = data.imgAlt;
        lensSubjectImg.classList.remove('defocus');
      }, 220);
    }

    // Update camera calibration readouts
    if (lensShutterSpec) lensShutterSpec.innerText = `SHUTTER: ${data.spec.shutter}`;
    if (lensApertureSpec) lensApertureSpec.innerText = `APERTURE: ${data.spec.aperture}`;
    if (lensFocalSpec) lensFocalSpec.innerText = `FOCUS: ${data.spec.focal}`;

    // Update dossier card content with smooth opacity transition
    if (activeDossierCard) {
      activeDossierCard.style.opacity = '0.35';
      activeDossierCard.style.transform = 'translateY(4px)';

      setTimeout(() => {
        activeDossierCard.innerHTML = `
          <div class="dossier-card-masthead">
            <span class="dossier-index-mark">${data.index}</span>
            <span class="dossier-stamp-seal">${data.seal}</span>
          </div>
          <div class="dossier-lead-row">
            <div>
              <p class="dossier-org-name">${data.org}</p>
              <h3 class="dossier-position-title">${data.role}</h3>
            </div>
            <span class="dossier-tenure-badge">${data.tenure}</span>
          </div>
          <p class="dossier-body-narrative">${data.narrative}</p>
          <ul class="dossier-verified-points">
            ${data.points.map(pt => `<li>${pt}</li>`).join('')}
          </ul>
          <div class="dossier-action-bar">
            <span class="dossier-citation-code">${data.citation}</span>
          </div>
        `;
        activeDossierCard.style.opacity = '1';
        activeDossierCard.style.transform = 'translateY(0)';
      }, 180);
    }
  }

  if (lensTabs.length > 0) {
    lensTabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        lensTabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        renderInvestigationRecord(index);
      });

      // Keyboard arrow navigation
      tab.addEventListener('keydown', (e) => {
        let targetIndex = -1;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          targetIndex = (index + 1) % lensTabs.length;
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          targetIndex = (index - 1 + lensTabs.length) % lensTabs.length;
        }

        if (targetIndex !== -1) {
          e.preventDefault();
          lensTabs[targetIndex].focus();
          lensTabs[targetIndex].click();
        }
      });
    });
  }

  /* =========================================================
     10. THE ROLLING PARCHMENT: EDUCATION TIMELINE UNROLL
     ========================================================= */

  const parchmentSheet = document.getElementById('parchmentSheet');
  if (parchmentSheet) {
    const parchmentObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          parchmentSheet.classList.add('parchment-unrolled');
          parchmentObserver.unobserve(parchmentSheet);
        }
      });
    }, { threshold: 0.18 });

    parchmentObserver.observe(parchmentSheet);
  }

  /* =========================================================
     11. THE ACHIEVEMENT DECK: CARD SHUFFLE ENGINE
     Physical fanning, riffle shuffle, and modal credential inspection
     ========================================================= */

  const deckStage = document.getElementById('achievementDeckStage');
  const deckContainer = document.getElementById('certificateDeck');
  const shuffleBtn = document.getElementById('shuffleDeckBtn');
  const deckCounter = document.getElementById('deckCounter');

  if (deckContainer) {
    let cards = Array.from(deckContainer.querySelectorAll('.archive-deck-card'));
    let isShuffling = false;
    let hasEntered = false;

    // Fanned resting coordinates for desktop & tablet
    const fannedCoordinates = [
      { x: 0, y: 0, r: 0 },
      { x: 42, y: 12, r: 2.5 },
      { x: -38, y: 18, r: -2.2 },
      { x: 78, y: 26, r: 4 },
      { x: -74, y: 32, r: -3.8 },
      { x: 112, y: 40, r: 5.5 },
      { x: -108, y: 46, r: -5 },
      { x: 142, y: 52, r: 6.8 },
      { x: -138, y: 58, r: -6.2 },
      { x: 168, y: 64, r: 7.8 },
      { x: -164, y: 70, r: -7.2 },
      { x: 188, y: 76, r: 8.5 }
    ];

    function getCardOffset(index, isMobile) {
      if (isMobile) {
        const center = (cards.length - 1) / 2;
        const x = (index - center) * 16;
        const y = Math.min(22, Math.abs(index - center) * 4);
        const r = (index - center) * 1.2;
        return { x, y, r };
      }
      return fannedCoordinates[index] || {
        x: (index % 2 === 0 ? 1 : -1) * (index * 16),
        y: index * 6,
        r: (index % 2 === 0 ? 1 : -1) * (index * 0.7)
      };
    }

    function updateDeckArrangement() {
      const isMobile = window.innerWidth <= 768;
      const count = cards.length;

      cards.forEach((card, index) => {
        const offset = getCardOffset(index, isMobile);
        const zIndex = count - index;
        const scale = isMobile ? 1 - (index * 0.015) : 1 - (index * 0.018);
        const opacity = Math.max(0.45, 1 - (index * 0.04));

        card.style.zIndex = zIndex;
        card.style.opacity = opacity;
        card.style.transform = `translate3d(${offset.x}px, ${offset.y}px, 0) rotate(${offset.r}deg) scale(${scale})`;
      });

      if (deckCounter && cards[0]) {
        const titleEl = cards[0].querySelector('h4');
        const activeTitle = titleEl ? titleEl.innerText : 'Archive Credential';
        deckCounter.innerText = `ACTIVE RECORD: ${activeTitle.toUpperCase()} (N° 1 OF ${count})`;
      }
    }

    if (deckStage) {
      const deckObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !hasEntered) {
          hasEntered = true;
          deckObserver.unobserve(deckStage);

          cards.forEach((card, i) => {
            card.style.opacity = '0';
            card.style.transform = `translate3d(0, 50px, 0) scale(0.92)`;

            setTimeout(() => {
              card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease';
              const offset = getCardOffset(i, window.innerWidth <= 768);
              const zIndex = cards.length - i;
              const scale = 1 - (i * 0.018);
              card.style.zIndex = zIndex;
              card.style.opacity = Math.max(0.45, 1 - (i * 0.04));
              card.style.transform = `translate3d(${offset.x}px, ${offset.y}px, 0) rotate(${offset.r}deg) scale(${scale})`;

              setTimeout(() => {
                card.style.transition = '';
              }, 650);
            }, i * 40);
          });
        }
      }, { threshold: 0.2 });

      deckObserver.observe(deckStage);
    } else {
      updateDeckArrangement();
    }

    function shuffleArchiveDeck() {
      if (isShuffling) return;
      isShuffling = true;

      if (shuffleBtn) {
        shuffleBtn.disabled = true;
        shuffleBtn.style.opacity = '0.7';
      }

      // Step 1: Physical riffle split
      cards.forEach((card, idx) => {
        const direction = idx % 2 === 0 ? 1 : -1;
        const spreadX = direction * (window.innerWidth < 768 ? 70 : 150 + (idx * 5));
        const spreadY = (idx % 3 - 1) * 16;
        const spreadRot = direction * (8 + (idx * 0.7));

        card.style.transition = 'transform 0.38s cubic-bezier(0.16, 1, 0.3, 1)';
        card.style.transform = `translate3d(${spreadX}px, ${spreadY}px, 0) rotate(${spreadRot}deg) scale(0.96)`;
      });

      // Step 2: Cycle cards
      setTimeout(() => {
        const cycleCount = Math.floor(cards.length / 3) || 3;
        const moved = cards.splice(0, cycleCount);
        cards = cards.concat(moved);

        cards.forEach(card => deckContainer.appendChild(card));

        // Step 3: Re-combine smoothly
        setTimeout(() => {
          cards.forEach(card => {
            card.style.transition = 'transform 0.52s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease';
          });

          updateDeckArrangement();

          setTimeout(() => {
            cards.forEach(card => {
              card.style.transition = '';
            });
            isShuffling = false;
            if (shuffleBtn) {
              shuffleBtn.disabled = false;
              shuffleBtn.style.opacity = '1';
            }
          }, 550);
        }, 100);
      }, 400);
    }

    if (shuffleBtn) {
      shuffleBtn.addEventListener('click', shuffleArchiveDeck);
    }

    cards.forEach(card => {
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    });

    window.addEventListener('resize', () => {
      if (!isShuffling && hasEntered) {
        updateDeckArrangement();
      }
    }, { passive: true });
  }

  /* =========================================================
     12. HIGH-PERFORMANCE AMBIENT SMOKE CANVAS
     Hardware-accelerated, auto-sleeping on hidden tabs
     ========================================================= */

  const smokeCanvas = document.getElementById('ambient-smoke');
  if (smokeCanvas && window.innerWidth > 600) {
    const ctx = smokeCanvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    smokeCanvas.width = width;
    smokeCanvas.height = height;

    window.addEventListener('resize', () => {
      width = window.innerWidth;
      height = window.innerHeight;
      smokeCanvas.width = width;
      smokeCanvas.height = height;
    }, { passive: true });

    const particles = [];
    const maxParticles = 12;

    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 110 + 70,
        vx: (Math.random() - 0.5) * 0.22,
        vy: -Math.random() * 0.3 - 0.08,
        alpha: Math.random() * 0.05 + 0.015
      });
    }

    let isDocumentVisible = true;
    document.addEventListener('visibilitychange', () => {
      isDocumentVisible = !document.hidden;
    });

    function renderSmoke() {
      if (isDocumentVisible) {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;

          if (p.y < -p.radius * 2) {
            p.y = height + p.radius;
            p.x = Math.random() * width;
          }
          if (p.x < -p.radius) p.x = width + p.radius;
          if (p.x > width + p.radius) p.x = -p.radius;

          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
          grad.addColorStop(0, `rgba(166, 124, 69, ${p.alpha})`);
          grad.addColorStop(0.65, `rgba(20, 37, 30, ${p.alpha * 0.35})`);
          grad.addColorStop(1, 'transparent');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      requestAnimationFrame(renderSmoke);
    }

    renderSmoke();
  }

});

/* =========================================================
   13. GLOBAL MODAL CONTROLLERS (CERTIFICATES & BLUEPRINTS)
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