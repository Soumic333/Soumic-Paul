/* =========================================================
   PROJECT: SOUMIC PAUL — THE SHELBY CREATIVE ARCHIVE
   HIGH-PERFORMANCE INTERACTION ENGINE
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================
     1. NATURAL, RESPONSIVE SCROLLING & PROGRESS
     Zero-latency native scrolling without heavy library locks
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
     2. ANCHOR NAVIGATION — NATIVE SMOOTH JUMPS
     ========================================================= */

  const NAV_OFFSET = 72;

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();

      // Calculate destination taking header offset into account
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
     3. ZERO-REFLOW ACTIVE NAV INDICATOR
     Uses IntersectionObserver to avoid layout thrashing on scroll
     ========================================================= */

  const navLinks = document.querySelectorAll('.nav-content nav a');
  const chapters = document.querySelectorAll('.archive-chapter');

  if (chapters.length > 0 && navLinks.length > 0) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const href = link.getAttribute('href').replace('#', '');
            if (href === currentId) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, {
      rootMargin: '-20% 0px -65% 0px',
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
     4B. ARCHIVE INDEX DROPDOWN
     ========================================================= */

  const navDropdown = document.getElementById('navDropdown');
  const dropdownBtn = document.getElementById('dropdownBtn');

  if (navDropdown && dropdownBtn) {
    dropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navDropdown.classList.toggle('open');
      dropdownBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!navDropdown.contains(e.target)) {
        navDropdown.classList.remove('open');
        dropdownBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navDropdown.classList.contains('open')) {
        navDropdown.classList.remove('open');
        dropdownBtn.setAttribute('aria-expanded', 'false');
        dropdownBtn.focus();
      }
    });

    // Close on dropdown link click
    const dropdownLinks = navDropdown.querySelectorAll('.dropdown-menu a');
    dropdownLinks.forEach(link => {
      link.addEventListener('click', () => {
        navDropdown.classList.remove('open');
        dropdownBtn.setAttribute('aria-expanded', 'false');
      });
    });
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
     5B. PROJECT CASE FILES: CATEGORY FILTER
     ========================================================= */

  const caseFilterButtons = document.querySelectorAll('.case-filter-btn');
  const caseDossiers = document.querySelectorAll('.case-file-dossier');

  if (caseFilterButtons.length > 0 && caseDossiers.length > 0) {
    caseFilterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const selectedFilter = btn.getAttribute('data-filter');

        // Update active filter button state
        caseFilterButtons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        // Filter case files with subtle transition
        caseDossiers.forEach(dossier => {
          const dossierCategory = dossier.getAttribute('data-category');
          if (selectedFilter === 'all' || dossierCategory === selectedFilter) {
            dossier.classList.remove('is-hidden');
          } else {
            dossier.classList.add('is-hidden');
          }
        });
      });
    });
  }

  /* =========================================================
     5C. CAMERA-LENS VIEWFINDER & INVESTIGATION ROOM
     Mechanical aperture iris animation, focal defocus/focus, HUD readouts
     ========================================================= */

  const investigationRecords = [
    {
      org: "AUST Robotics Club",
      role: "Assistant Director – Administration",
      tenure: "2024 — Present",
      spec: { shutter: "1/250s", aperture: "f/1.4", focal: "LOCKED 50mm" },
      img: "assets/ARC.png",
      imgAlt: "AUST Robotics Club Emblem",
      index: "REC // 01",
      seal: "CENTRAL COMMAND RECORD",
      narrative: "Commanding administrative coordination, financial allocations, institutional approvals, and cross-functional taskforces for premier inter-university engineering challenges.",
      points: [
        "Directed multi-tier operational logistics for over 200 participants across national hackathons and robotics symposiums.",
        "Managed institutional liaisons with department heads, ensuring timely funding disbursements and venue authorizations.",
        "Mentored junior executive boards in administrative documentation and crisis containment protocols."
      ],
      actionText: "INSPECT ROBOTICS LOGS",
      actionLink: "#contact",
      citation: "REF: ARC-ADM-2024-SP"
    },
    {
      org: "Tickify",
      role: "Student Ambassador",
      tenure: "2024 — Present",
      spec: { shutter: "1/500s", aperture: "f/2.0", focal: "LOCKED 35mm" },
      img: "assets/tickify.jpg",
      imgAlt: "Tickify Corporate Emblem",
      index: "REC // 02",
      seal: "CAMPUS AMBASSADOR DOSSIER",
      narrative: "Orchestrating campus outreach, corporate branding initiatives, and strategic penetration for digital ticketing infrastructure.",
      points: [
        "Drove brand affinity across university networks, elevating event ticketing adoption rates.",
        "Structured digital marketing campaigns and community engagement nodes targeting engineering student cohorts.",
        "Delivered weekly analytical feedback on user onboarding friction to core product engineering leads."
      ],
      actionText: "VIEW TICKIFY RECORD",
      actionLink: "https://tickify.live",
      citation: "REF: TCK-AMB-2024-SP"
    },
    {
      org: "HSBC Business Case Competition",
      role: "National Round Qualifier",
      tenure: "2025 // National Stage",
      spec: { shutter: "1/1000s", aperture: "f/2.8", focal: "LOCKED 85mm" },
      img: "assets/HSBC.png",
      imgAlt: "HSBC Business Case Emblem",
      index: "REC // 03",
      seal: "STRATEGIC COMPETITION RECORD",
      narrative: "Competed in Bangladesh's foremost undergraduate business strategy arena, formulating high-impact turnaround blueprints under strict time-lock constraints.",
      points: [
        "Synthesized multi-tiered financial models and corporate risk mitigation frameworks under 6-hour pressure windows.",
        "Architected boardroom-grade pitch decks delivered before senior banking executives and management consultants.",
        "Advanced through rigorous university preliminaries to represent AUST on the national qualifying stage."
      ],
      actionText: "INSPECT BUSINESS CASE",
      actionLink: "assets/Certificates/HSBC_25.jpg",
      citation: "REF: HSBC-BC-2025-NAT"
    },
    {
      org: "PRISM AI Creative Awards",
      role: "Worldwide Top 15 Finalist",
      tenure: "2024 // Global Stage",
      spec: { shutter: "1/125s", aperture: "f/1.2", focal: "LOCKED 24mm" },
      img: "assets/PRISM.png",
      imgAlt: "PRISM AI Creative Awards Emblem",
      index: "REC // 04",
      seal: "CREATIVE TECH COMMENDATION",
      narrative: "Global creative competition honoring groundbreaking visual direction, neural rendering workflows, and generative film architecture.",
      points: [
        "Recognized worldwide among top 15 entries for pioneering cinematic generative direction and narrative coherence.",
        "Integrated cutting-edge AI diffusion models with high-precision post-production color grading and sound design.",
        "Demonstrated the fusion of engineering discipline with instinctual cinematic worldbuilding."
      ],
      actionText: "VIEW PRISM CITATION",
      actionLink: "assets/Certificates/PRISM_TOP15.jpg",
      citation: "REF: PRM-TOP15-2024-GLB"
    }
  ];

  const lensTabs = document.querySelectorAll('.lens-select-tab');
  const apertureIris = document.getElementById('apertureIris');
  const lensSubjectImg = document.getElementById('lensSubjectImg');
  const lensShutterSpec = document.getElementById('lensShutterSpec');
  const lensApertureSpec = document.getElementById('lensApertureSpec');
  const lensFocalSpec = document.getElementById('lensFocalSpec');
  const activeDossierCard = document.getElementById('activeDossierCard');

  function renderInvestigationRecord(recIndex) {
    const data = investigationRecords[recIndex];
    if (!data) return;

    // Trigger lens aperture cycling animation
    if (apertureIris) {
      apertureIris.classList.add('iris-cycling');
    }

    // Defocus subject image
    if (lensSubjectImg) {
      lensSubjectImg.classList.add('defocus');
      setTimeout(() => {
        lensSubjectImg.src = data.img;
        lensSubjectImg.alt = data.imgAlt;
        lensSubjectImg.classList.remove('defocus');
      }, 250);
    }

    // Reset aperture iris rotation after pulse
    setTimeout(() => {
      if (apertureIris) {
        apertureIris.classList.remove('iris-cycling');
      }
    }, 600);

    // Update HUD readouts
    if (lensShutterSpec) lensShutterSpec.innerText = `SHUTTER: ${data.spec.shutter}`;
    if (lensApertureSpec) lensApertureSpec.innerText = `APERTURE: ${data.spec.aperture}`;
    if (lensFocalSpec) lensFocalSpec.innerText = `FOCUS: ${data.spec.focal}`;

    // Update dossier card content with fade
    if (activeDossierCard) {
      activeDossierCard.style.opacity = '0.4';
      activeDossierCard.style.transform = 'translateY(6px)';

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
            <a href="${data.actionLink}" ${data.actionLink.startsWith('http') || data.actionLink.endsWith('.jpg') ? 'target="_blank" rel="noreferrer"' : ''} class="archive-btn secondary-brass lens-trigger-btn">
              <span>${data.actionText}</span>
              <span class="btn-arrow">→</span>
            </a>
            <span class="dossier-citation-code">${data.citation}</span>
          </div>
        `;
        activeDossierCard.style.opacity = '1';
        activeDossierCard.style.transform = 'translateY(0)';
      }, 200);
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
     5D. GAZETTE BROADSHEET UNFOLDING ANIMATION
     Triggers unfolding perspective transform upon entering viewport
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
     6. CACHED EDUCATION TIMELINE FILL
     Cached dimensions avoid synchronous layout reflows
     ========================================================= */

  const eduTimeline = document.getElementById('edu-timeline-container');
  const eduFill = document.getElementById('edu-line-fill');

  if (eduTimeline && eduFill) {
    let timelineTop = 0;
    let timelineHeight = 0;

    function cacheTimelineMetrics() {
      const rect = eduTimeline.getBoundingClientRect();
      timelineTop = rect.top + window.pageYOffset;
      timelineHeight = rect.height;
    }

    cacheTimelineMetrics();
    window.addEventListener('resize', cacheTimelineMetrics, { passive: true });

    let eduTicking = false;
    window.addEventListener('scroll', () => {
      if (!eduTicking) {
        window.requestAnimationFrame(() => {
          const viewportMid = window.pageYOffset + (window.innerHeight * 0.55);
          if (viewportMid <= timelineTop) {
            eduFill.style.height = '0%';
          } else if (viewportMid >= timelineTop + timelineHeight) {
            eduFill.style.height = '100%';
          } else {
            const passed = viewportMid - timelineTop;
            const pct = Math.max(0, Math.min(100, (passed / timelineHeight) * 100));
            eduFill.style.height = `${pct}%`;
          }
          eduTicking = false;
        });
        eduTicking = true;
      }
    }, { passive: true });
  }

  /* =========================================================
     7. THE ACHIEVEMENT DECK: CARD SHUFFLE ENGINE
     Controlled staggered sequence, physical fanning, and riffle shuffle
     ========================================================= */

  const deckStage = document.getElementById('achievementDeckStage');
  const deckContainer = document.getElementById('certificateDeck');
  const shuffleBtn = document.getElementById('shuffleDeckBtn');
  const deckCounter = document.getElementById('deckCounter');

  if (deckContainer) {
    let cards = Array.from(deckContainer.querySelectorAll('.archive-deck-card'));
    const totalCards = cards.length;
    let isShuffling = false;
    let hasEntered = false;

    // Fanned resting arrangement coordinates (desktop and tablet)
    const fannedCoordinates = [
      { x: 0, y: 0, r: 0 },          // Top card: center, straight
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

    // Mobile horizontal staggered offset
    function getCardOffset(index, isMobile) {
      if (isMobile) {
        const center = (cards.length - 1) / 2;
        const x = (index - center) * 18;
        const y = Math.min(24, Math.abs(index - center) * 4);
        const r = (index - center) * 1.2;
        return { x, y, r };
      }
      return fannedCoordinates[index] || {
        x: (index % 2 === 0 ? 1 : -1) * (index * 16),
        y: index * 6,
        r: (index % 2 === 0 ? 1 : -1) * (index * 0.7)
      };
    }

    // Render cards into physical archival stack
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

      // Update counter text with the top active record
      if (deckCounter && cards[0]) {
        const titleEl = cards[0].querySelector('h4');
        const activeTitle = titleEl ? titleEl.innerText : 'Archive Credential';
        deckCounter.innerText = `ACTIVE RECORD: ${activeTitle.toUpperCase()} (N° 1 OF ${count})`;
      }
    }

    // Initial staggered entrance on scroll into view
    if (deckStage) {
      const deckObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !hasEntered) {
          hasEntered = true;
          deckObserver.unobserve(deckStage);

          // Stagger cards into place
          cards.forEach((card, i) => {
            card.style.opacity = '0';
            card.style.transform = `translate3d(0, 60px, 0) scale(0.9)`;

            setTimeout(() => {
              card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease';
              const offset = getCardOffset(i, window.innerWidth <= 768);
              const zIndex = cards.length - i;
              const scale = 1 - (i * 0.018);
              card.style.zIndex = zIndex;
              card.style.opacity = Math.max(0.45, 1 - (i * 0.04));
              card.style.transform = `translate3d(${offset.x}px, ${offset.y}px, 0) rotate(${offset.r}deg) scale(${scale})`;

              // Clean inline transitions after entrance so CSS hover transitions take over
              setTimeout(() => {
                card.style.transition = '';
              }, 650);
            }, i * 45);
          });
        }
      }, { threshold: 0.2 });

      deckObserver.observe(deckStage);
    } else {
      updateDeckArrangement();
    }

    // Physical card shuffle execution
    function shuffleArchiveDeck() {
      if (isShuffling) return;
      isShuffling = true;

      if (shuffleBtn) {
        shuffleBtn.disabled = true;
        shuffleBtn.style.opacity = '0.7';
      }

      // Step 1: Smoothly split and fan cards into two physical packets (left & right)
      cards.forEach((card, idx) => {
        const direction = idx % 2 === 0 ? 1 : -1;
        const spreadX = direction * (window.innerWidth < 768 ? 80 : 160 + (idx * 6));
        const spreadY = (idx % 3 - 1) * 20;
        const spreadRot = direction * (10 + (idx * 0.8));

        card.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        card.style.transform = `translate3d(${spreadX}px, ${spreadY}px, 0) rotate(${spreadRot}deg) scale(0.96)`;
      });

      // Step 2: Cycle cards in array (promote new documents to top)
      setTimeout(() => {
        const cycleCount = Math.floor(cards.length / 3) || 3;
        const moved = cards.splice(0, cycleCount);
        cards = cards.concat(moved);

        // Re-append in DOM for clean stacking hierarchy
        cards.forEach(card => deckContainer.appendChild(card));

        // Step 3: Slide back together smoothly into resting archival fan
        setTimeout(() => {
          cards.forEach(card => {
            card.style.transition = 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease';
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
          }, 600);
        }, 100);
      }, 420);
    }

    if (shuffleBtn) {
      shuffleBtn.addEventListener('click', shuffleArchiveDeck);
    }

    // Keyboard accessibility for cards
    cards.forEach(card => {
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    });

    // Handle window resize cleanly
    window.addEventListener('resize', () => {
      if (!isShuffling && hasEntered) {
        updateDeckArrangement();
      }
    }, { passive: true });
  }

  /* =========================================================
     8. HIGH-PERFORMANCE AMBIENT SMOKE CANVAS
     Throttled particles that automatically sleep when inactive
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
    const maxParticles = 14;

    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 110 + 70,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -Math.random() * 0.35 - 0.1,
        alpha: Math.random() * 0.06 + 0.02
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
          grad.addColorStop(0, `rgba(196, 154, 99, ${p.alpha})`);
          grad.addColorStop(0.65, `rgba(26, 25, 23, ${p.alpha * 0.35})`);
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