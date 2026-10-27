/* =========================================================
   PROJECT: SOUMIC PAUL — CINEMATIC PORTFOLIO
   Design Direction: Peaky Blinders-inspired Cinematic Archive
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================
     1. GLOBAL CONSTANTS & SECTION DEFINITIONS (8 CONVENTIONAL)
     ========================================================= */
  const NAV_OFFSET = 78;

  const SECTION_REGISTRY = {
    'home': 'CHAPTER 01 // ARCHIVE ADMISSION',
    'about': 'CHAPTER 02 // DOSSIER & GAZETTE',
    'projects': 'CHAPTER 03 // CLASSIFIED PROJECTS',
    'leadership': 'CHAPTER 04 // LEADERSHIP & GUILD',
    'skills': 'CHAPTER 05 // WORKSHOP ARSENAL',
    'education': 'CHAPTER 06 // ACADEMIC RECORD',
    'certificates': 'CHAPTER 07 // THE SCREENING ROOM',
    'contact': 'CHAPTER 08 // SECURE TRANSMISSION'
  };

  /* =========================================================
     2. RAILWAY TRACK PROGRESS ENGINE
     Synchronizes scroll position with railway locomotive track
     ========================================================= */
  const railwayLoco = document.getElementById('railwayLocomotiveGlyph');
  const railwayChapter = document.getElementById('railwayCurrentChapter');
  let tickingScroll = false;

  function updateRailwayProgress() {
    if (!tickingScroll) {
      window.requestAnimationFrame(() => {
        const docElem = document.documentElement;
        const scrollHeight = docElem.scrollHeight - window.innerHeight;
        const percentage = scrollHeight > 0 
          ? Math.min(100, Math.max(0, (window.scrollY / scrollHeight) * 100)) 
          : 0;

        if (railwayLoco) {
          railwayLoco.style.left = `${percentage}%`;
        }
        tickingScroll = false;
      });
      tickingScroll = true;
    }
  }

  window.addEventListener('scroll', updateRailwayProgress, { passive: true });
  updateRailwayProgress();

  /* =========================================================
     3. CLEAN ANCHOR NAVIGATION WITH OFFSET
     Zero-lag smooth native scrolling to target sections
     ========================================================= */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      const topPos = target.getBoundingClientRect().top + window.pageYOffset - NAV_OFFSET;

      window.scrollTo({
        top: topPos,
        behavior: 'smooth'
      });

      if (history.pushState) {
        history.pushState(null, '', targetId);
      }
    });
  });

  /* =========================================================
     4. SCROLL SPY: ACTIVE NAV LINK & CHAPTER READOUT
     Uses IntersectionObserver for 60fps performance
     ========================================================= */
  const navLinks = document.querySelectorAll('.nav-content nav a');
  const chapters = document.querySelectorAll('.archive-chapter');

  if (chapters.length > 0) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');

          // Highlight current navigation link
          navLinks.forEach(link => {
            const href = link.getAttribute('href').replace('#', '');
            if (href === currentId) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });

          // Update railway station progress text
          if (railwayChapter && SECTION_REGISTRY[currentId]) {
            railwayChapter.innerText = SECTION_REGISTRY[currentId];
          }
        }
      });
    }, {
      rootMargin: '-20% 0px -55% 0px',
      threshold: 0
    });

    chapters.forEach(chapter => navObserver.observe(chapter));
  }

  /* =========================================================
     5. MOBILE MENU ACCESSIBILITY & DRAWER
     ========================================================= */
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navWrap = document.querySelector('.nav-wrap');

  if (mobileBtn && navWrap) {
    mobileBtn.addEventListener('click', () => {
      const isOpen = navWrap.classList.toggle('menu-open');
      mobileBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    const mobileLinks = navWrap.querySelectorAll('.nav-content a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        navWrap.classList.remove('menu-open');
        mobileBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* =========================================================
     6. CINEMATIC FIREWORK PARTICLES & SPARKS ENGINE
     Industrial furnace sparks, cursor trails & radial bursts
     ========================================================= */
  const sparksCanvas = document.getElementById('cinematicSparksCanvas');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (sparksCanvas && !prefersReduced) {
    const ctx = sparksCanvas.getContext('2d');
    let width = (sparksCanvas.width = window.innerWidth);
    let height = (sparksCanvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = sparksCanvas.width = window.innerWidth;
      height = sparksCanvas.height = window.innerHeight;
    }, { passive: true });

    // Spark particle pool
    const particles = [];
    const maxParticles = isFinePointer ? 85 : 30;

    // Palette: warm gold, amber, brass, bright ivory
    const sparkPalette = [
      'rgba(232, 220, 194,',  // Ivory #E8DCC2
      'rgba(212, 163, 89,',   // Gold #D4A359
      'rgba(184, 138, 74,',   // Antique Gold #B88A4A
      'rgba(255, 170, 70,',   // Warm Furnace Amber
      'rgba(255, 215, 120,'   // Golden incandescent
    ];

    class Spark {
      constructor(x, y, vx, vy, size, life, colorPrefix) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.size = size;
        this.initialLife = life;
        this.life = life;
        this.colorPrefix = colorPrefix;
        this.gravity = 0.045;
        this.friction = 0.985;
      }

      update() {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.life -= 1;
      }

      draw(c) {
        const progress = this.life / this.initialLife;
        const alpha = Math.max(0, Math.min(1, progress * 0.9));
        c.fillStyle = `${this.colorPrefix} ${alpha})`;
        c.beginPath();
        c.arc(this.x, this.y, Math.max(0.6, this.size * progress), 0, Math.PI * 2);
        c.fill();
      }
    }

    // Ambient floating embers in background
    const ambientEmbers = [];
    const maxEmbers = 22;
    for (let i = 0; i < maxEmbers; i++) {
      ambientEmbers.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -Math.random() * 0.5 - 0.15,
        size: Math.random() * 1.8 + 0.8,
        alpha: Math.random() * 0.55 + 0.2,
        oscillation: Math.random() * Math.PI * 2
      });
    }

    function createSparkTrail(x, y, count = 2) {
      if (particles.length >= maxParticles) return;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1.6 + 0.3;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed - 0.3;
        const size = Math.random() * 2.2 + 0.8;
        const life = Math.floor(Math.random() * 26 + 18);
        const col = sparkPalette[Math.floor(Math.random() * sparkPalette.length)];
        particles.push(new Spark(x, y, vx, vy, size, life, col));
      }
    }

    function triggerSparkBurst(x, y, count = 14) {
      const actualCount = Math.min(count, maxParticles - particles.length + 10);
      for (let i = 0; i < actualCount; i++) {
        const angle = (Math.PI * 2 * i) / actualCount + (Math.random() - 0.5) * 0.4;
        const speed = Math.random() * 3.8 + 1.2;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed - 0.6;
        const size = Math.random() * 2.8 + 1.1;
        const life = Math.floor(Math.random() * 38 + 24);
        const col = sparkPalette[Math.floor(Math.random() * sparkPalette.length)];
        particles.push(new Spark(x, y, vx, vy, size, life, col));
      }
    }

    // Expose trigger globally for interactive elements
    window.triggerCinematicSpark = (x, y, count = 12) => {
      triggerSparkBurst(x, y, count);
    };

    // Mouse movement listener (throttled)
    let lastMoveTime = 0;
    window.addEventListener('mousemove', (e) => {
      const now = performance.now();
      if (now - lastMoveTime > 32) {
        lastMoveTime = now;
        createSparkTrail(e.clientX, e.clientY, 2);

        // Occasional mini radial spark (1 in 40 moves)
        if (Math.random() < 0.025) {
          triggerSparkBurst(e.clientX, e.clientY, 6);
        }
      }
    }, { passive: true });

    // Click burst on document
    window.addEventListener('click', (e) => {
      triggerSparkBurst(e.clientX, e.clientY, 16);
    }, { passive: true });

    // Interactive elements trigger controlled spark burst
    const interactiveElements = document.querySelectorAll(
      'button, a, .screening-tab, .lens-tab, .case-file-dossier, .workshop-panel'
    );
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', (e) => {
        const rect = el.getBoundingClientRect();
        triggerSparkBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 7);
      }, { passive: true });
    });

    // Main animation loop
    let isVisible = true;
    document.addEventListener('visibilitychange', () => {
      isVisible = !document.hidden;
    });

    function renderSparkSystem() {
      if (isVisible) {
        ctx.clearRect(0, 0, width, height);

        // 1. Draw ambient floating embers (Hero & Footer atmosphere)
        for (let i = 0; i < ambientEmbers.length; i++) {
          const emb = ambientEmbers[i];
          emb.oscillation += 0.02;
          emb.x += emb.vx + Math.sin(emb.oscillation) * 0.25;
          emb.y += emb.vy;

          if (emb.y < -10) {
            emb.y = height + 10;
            emb.x = Math.random() * width;
          }
          if (emb.x < -10) emb.x = width + 10;
          if (emb.x > width + 10) emb.x = -10;

          ctx.fillStyle = `rgba(212, 163, 89, ${emb.alpha * 0.55})`;
          ctx.beginPath();
          ctx.arc(emb.x, emb.y, emb.size, 0, Math.PI * 2);
          ctx.fill();
        }

        // 2. Draw and update dynamic spark particles
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.update();
          p.draw(ctx);
          if (p.life <= 0) {
            particles.splice(i, 1);
          }
        }
      }
      requestAnimationFrame(renderSparkSystem);
    }

    renderSparkSystem();
  }

  /* =========================================================
     7. GAZETTE BROADSHEET 3D UNFOLDING
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
    }, { threshold: 0.12 });

    gazetteObserver.observe(gazetteWrapper);
  }

  /* =========================================================
     8. STATS COUNT-UP ANIMATION
     ========================================================= */
  const statNumbers = document.querySelectorAll('.stat-num');
  let statsTriggered = false;

  if (statNumbers.length > 0) {
    const statsContainer = document.getElementById('about-stats');
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !statsTriggered) {
        statsTriggered = true;
        statNumbers.forEach(stat => {
          const rawText = stat.innerText.trim();
          const target = parseInt(rawText, 10);
          const suffix = rawText.replace(/[0-9]/g, '');
          if (isNaN(target)) return;

          let current = 0;
          const duration = 1500;
          const step = Math.max(1, Math.ceil(target / (duration / 20)));

          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              stat.innerText = target + suffix;
              clearInterval(timer);
            } else {
              stat.innerText = current + suffix;
            }
          }, 20);
        });
        statsObserver.unobserve(entries[0].target);
      }
    }, { threshold: 0.3 });

    if (statsContainer) statsObserver.observe(statsContainer);
  }

  /* =========================================================
     9. CHAPTER 04: LEADERSHIP — THE CINEMATIC CAMERA LENS ENGINE
     Transparent high-contrast logo, rotating rings & verified records
     ========================================================= */
  const leadershipRecords = [
    {
      org: "AUST ROBOTICS CLUB",
      role: "Assistant Director – Administration",
      tenure: "JAN 2025 – PRESENT",
      spec: { shutter: "1/1000s", aperture: "f/1.4", focal: "50mm PRIME" },
      img: "assets/AUST_RC_clean.png",
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
      img: "assets/Tickify_clean.png",
      imgAlt: "Tickify Ambassador Emblem",
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

  function renderLeadershipRecord(recIndex) {
    const data = leadershipRecords[recIndex];
    if (!data) return;

    // Optical focus pulse animation
    if (lensSubjectImg) {
      lensSubjectImg.style.transition = 'opacity 0.22s ease, transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)';
      lensSubjectImg.style.opacity = '0.25';
      lensSubjectImg.style.transform = 'scale(0.88)';

      setTimeout(() => {
        lensSubjectImg.src = data.img;
        lensSubjectImg.alt = data.imgAlt;
        lensSubjectImg.style.opacity = '1';
        lensSubjectImg.style.transform = 'scale(1)';
      }, 200);
    }

    // Update technical optical readouts
    if (lensShutterSpec) lensShutterSpec.innerText = `SHUTTER: ${data.spec.shutter}`;
    if (lensApertureSpec) lensApertureSpec.innerText = `APERTURE: ${data.spec.aperture}`;
    if (lensFocalSpec) lensFocalSpec.innerText = `FOCUS: ${data.spec.focal}`;

    // Update dossier text with smooth reveal
    if (activeDossierCard) {
      activeDossierCard.style.transition = 'opacity 0.22s ease, transform 0.22s ease';
      activeDossierCard.style.opacity = '0.35';
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
            <span class="dossier-citation-code">${data.citation}</span>
          </div>
        `;
        activeDossierCard.style.opacity = '1';
        activeDossierCard.style.transform = 'translateY(0)';
      }, 190);
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
        renderLeadershipRecord(index);
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
     10. CHAPTER 05: SKILLS WORKSHOP TELEMETRY & AMBIENT GLOW
     ========================================================= */
  const workshopPanels = document.querySelectorAll('.workshop-panel');
  if (workshopPanels.length > 0) {
    const workshopObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.15 });

    workshopPanels.forEach((panel, i) => {
      panel.style.transition = `opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.14}s, transform 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.14}s`;
      workshopObserver.observe(panel);
    });
  }

  /* =========================================================
     11. CHAPTER 06: THE ROLLING PARCHMENT (EDUCATION)
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
    }, { threshold: 0.16 });

    parchmentObserver.observe(parchmentSheet);
  }

  /* =========================================================
     12. CHAPTER 07: THE ARCHIVE SCREENING ROOM (CERTIFICATES)
     Framed projection display, aspect ratio preservation,
     light-sweep reveal, counter, prev/next & thumbnail tabs
     ========================================================= */
  const CERTIFICATE_DATA = [
    {
      title: "Deputy Executive",
      category: "LEADERSHIP & MANAGEMENT",
      desc: "AUST Robotics Club — Directing administrative governance, coordinating cross-disciplinary engineering teams, vendor procurement, and national robotics symposiums.",
      img: "assets/Certificates/Deputy Executive.png",
      ref: "ARC-DEP-2025"
    },
    {
      title: "Sub Executive",
      category: "OPERATIONAL COMMENDATION",
      desc: "AUST Robotics Club — Foundational operational management, workshop scheduling, and student robotics event logistics.",
      img: "assets/Certificates/Sub_Executive.jpg",
      ref: "ARC-SUB-2024"
    },
    {
      title: "HSBC Business Case Competition 2025",
      category: "STRATEGIC COMPETITION",
      desc: "National Round Qualifier in Bangladesh's premier undergraduate business strategy arena, formulating commercial turnaround blueprints under 6-hour pressure windows.",
      img: "assets/Certificates/HSBC_25.jpg",
      ref: "HSBC-BCC-2025"
    },
    {
      title: "BUP Capitalizer 2025",
      category: "FINANCE & STRATEGY",
      desc: "Competitive achievement in the flagship national financial modeling and investment portfolio analysis arena hosted by BUP Career Club.",
      img: "assets/Certificates/BUP Capitalizer'25.jpg",
      ref: "BUP-CAP-2025"
    },
    {
      title: "Casemotion 1.0",
      category: "BUSINESS CASE ANALYSIS",
      desc: "Intra-AUST business case competition finalist solving operational hurdles, market penetration strategies, and branding solutions.",
      img: "assets/Certificates/Casemotion.jpg",
      ref: "AUST-CASE-2024"
    },
    {
      title: "OSCILLON 1.0 — Line Follower Robot",
      category: "ROBOTICS & AUTONOMY",
      desc: "National robotics competition merit for designing, programming, and racing high-speed autonomous PID-controlled Line Follower Robots.",
      img: "assets/Certificates/OSCILLON.png",
      ref: "OSC-LFR-2024"
    },
    {
      title: "RoboMania 2.0 Circuit Wizardry",
      category: "ELECTRICAL ENGINEERING",
      desc: "Awarded for rapid analog and digital circuit troubleshooting, schematic analysis, and oscilloscope diagnostic mastery under strict time limits.",
      img: "assets/Certificates/RoboMania 2.0 Circuit Wizardry.png",
      ref: "RM-CIRC-2024"
    },
    {
      title: "RoboMania 2.0 Organizer",
      category: "ORGANIZATIONAL LEADERSHIP",
      desc: "Core organizer commendation for leading event logistics, university team registrations, and technical coordination for RoboMania 2.0.",
      img: "assets/Certificates/Robomania 2.0 Organizer.png",
      ref: "RM-ORG-2024"
    },
    {
      title: "ARC 2.0 Organizer",
      category: "NATIONAL EVENT DIRECTION",
      desc: "Executive organizing committee commendation for managing national engineering teams, venue infrastructure, and evaluation panels.",
      img: "assets/Certificates/ARC 2.0_organizer.jpg",
      ref: "ARC-ORG-2024"
    },
    {
      title: "Thesis Thrust 1.0",
      category: "RESEARCH & PRESENTATION",
      desc: "Commended for academic defense and technical research presentation in electrical engineering innovations.",
      img: "assets/Certificates/Thesis Thrust 1.0.jpeg",
      ref: "TT-RES-2024"
    },
    {
      title: "GitHub Foundations",
      category: "DEV & VERSION CONTROL",
      desc: "Verified credentials in Git architecture, distributed version control, GitHub Actions, repository governance, and collaborative engineering workflows.",
      img: "assets/Certificates/GIthub.jpg",
      ref: "GH-FND-2024"
    },
    {
      title: "EEE 3100 — Electrical Services Design",
      category: "ACADEMIC DISTINCTION",
      desc: "Official academic commendation for excellence in Electrical Services Design and high-voltage power distribution modeling at AUST.",
      img: "assets/Certificates/EEE 3100.png",
      ref: "AUST-EEE-3100"
    }
  ];

  let currentCertIndex = 0;
  const totalCerts = CERTIFICATE_DATA.length;

  const projectorMat = document.getElementById('projectorMatBoard');
  const screeningActiveImg = document.getElementById('screeningActiveImg');
  const screeningCounter = document.getElementById('screeningCounterPill');
  const certCatText = document.getElementById('certCatText');
  const certTitleText = document.getElementById('certTitleText');
  const certDescText = document.getElementById('certDescText');
  const screeningTabs = document.querySelectorAll('.screening-tab');
  const prevCertBtn = document.getElementById('prevCertBtn');
  const nextCertBtn = document.getElementById('nextCertBtn');

  function displayCertificate(index) {
    if (index < 0) index = totalCerts - 1;
    if (index >= totalCerts) index = 0;
    currentCertIndex = index;

    const cert = CERTIFICATE_DATA[currentCertIndex];
    if (!cert) return;

    // Projection screen reveal with light-sweep
    if (screeningActiveImg) {
      screeningActiveImg.style.transition = 'opacity 0.22s ease, transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)';
      screeningActiveImg.style.opacity = '0.35';
      screeningActiveImg.style.transform = 'scale(0.97)';

      setTimeout(() => {
        screeningActiveImg.src = cert.img;
        screeningActiveImg.alt = `${cert.title} — ${cert.category}`;
        screeningActiveImg.style.opacity = '1';
        screeningActiveImg.style.transform = 'scale(1)';
      }, 180);
    }

    // Trigger subtle spotlight sweep
    const sweep = document.querySelector('.screening-spotlight-sweep');
    if (sweep) {
      sweep.style.animation = 'none';
      // Force reflow
      void sweep.offsetWidth;
      sweep.style.animation = 'spotlightSweep 1.2s ease-out';
    }

    // Update Counter & Metadata
    const paddedIndex = String(currentCertIndex + 1).padStart(2, '0');
    const paddedTotal = String(totalCerts).padStart(2, '0');
    if (screeningCounter) {
      screeningCounter.innerText = `RECORD ${paddedIndex} OF ${paddedTotal}`;
    }

    if (certCatText) certCatText.innerText = cert.category;
    if (certTitleText) certTitleText.innerText = cert.title;
    if (certDescText) certDescText.innerText = cert.desc;

    // Update Thumbnail Tabs & Scroll into view
    screeningTabs.forEach((tab, i) => {
      if (i === currentCertIndex) {
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        tab.classList.remove('active');
        tab.setAttribute('aria-selected', 'false');
      }
    });
  }

  // Prev / Next button clicks
  if (prevCertBtn) {
    prevCertBtn.addEventListener('click', () => {
      displayCertificate(currentCertIndex - 1);
    });
  }

  if (nextCertBtn) {
    nextCertBtn.addEventListener('click', () => {
      displayCertificate(currentCertIndex + 1);
    });
  }

  // Thumbnail Tab clicks & keyboard navigation
  screeningTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      displayCertificate(index);
    });

    tab.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        displayCertificate(currentCertIndex + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        displayCertificate(currentCertIndex - 1);
      }
    });
  });

  // Clicking projector screen enlarges certificate
  if (projectorMat) {
    projectorMat.addEventListener('click', () => {
      const activeCert = CERTIFICATE_DATA[currentCertIndex];
      if (activeCert) {
        openCertificate(activeCert.img, activeCert.title, activeCert.desc);
      }
    });

    projectorMat.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        projectorMat.click();
      }
    });
  }

  // Keyboard navigation when user is in certificates section
  window.addEventListener('keydown', (e) => {
    // Only intercept if modal is NOT open
    const modal = document.getElementById('certModal');
    if (modal && modal.classList.contains('open')) return;

    const certSection = document.getElementById('certificates');
    if (certSection) {
      const rect = certSection.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight * 0.7 && rect.bottom > window.innerHeight * 0.2;
      if (isInView) {
        if (e.key === 'ArrowLeft') {
          displayCertificate(currentCertIndex - 1);
        } else if (e.key === 'ArrowRight') {
          displayCertificate(currentCertIndex + 1);
        }
      }
    }
  });

  // Initial display setup
  displayCertificate(0);

  /* =========================================================
     13. HIGH-PERFORMANCE AMBIENT SMOKE CANVAS
     Subtle atmospheric mist, pause on hidden tab
     ========================================================= */
  const smokeCanvas = document.getElementById('ambient-smoke');
  if (smokeCanvas && window.innerWidth > 600 && !prefersReduced) {
    const ctx = smokeCanvas.getContext('2d');
    let sWidth = (smokeCanvas.width = window.innerWidth);
    let sHeight = (smokeCanvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      sWidth = smokeCanvas.width = window.innerWidth;
      sHeight = smokeCanvas.height = window.innerHeight;
    }, { passive: true });

    const smokeParticles = [];
    const maxSmoke = 10;

    for (let i = 0; i < maxSmoke; i++) {
      smokeParticles.push({
        x: Math.random() * sWidth,
        y: Math.random() * sHeight,
        radius: Math.random() * 100 + 60,
        vx: (Math.random() - 0.5) * 0.18,
        vy: -Math.random() * 0.24 - 0.06,
        alpha: Math.random() * 0.04 + 0.012
      });
    }

    let isTabActive = true;
    document.addEventListener('visibilitychange', () => {
      isTabActive = !document.hidden;
    });

    function renderSmoke() {
      if (isTabActive) {
        ctx.clearRect(0, 0, sWidth, sHeight);

        for (let i = 0; i < smokeParticles.length; i++) {
          const p = smokeParticles[i];
          p.x += p.vx;
          p.y += p.vy;

          if (p.y < -p.radius * 2) {
            p.y = sHeight + p.radius;
            p.x = Math.random() * sWidth;
          }
          if (p.x < -p.radius) p.x = sWidth + p.radius;
          if (p.x > sWidth + p.radius) p.x = -p.radius;

          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
          grad.addColorStop(0, `rgba(184, 138, 74, ${p.alpha})`);
          grad.addColorStop(0.65, `rgba(23, 21, 17, ${p.alpha * 0.3})`);
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
   14. GLOBAL MODAL CONTROLLERS (CERTIFICATES & BLUEPRINTS)
   ========================================================= */

function openCertificate(imgSrc, title, desc) {
  const modal = document.getElementById('certModal');
  const modalImg = document.getElementById('certModalImg');
  const modalTitle = document.getElementById('certModalTitle');
  const modalDesc = document.getElementById('certModalDesc');

  if (!modal || !modalImg) return;

  if (modalTitle) modalTitle.innerText = title;
  if (modalDesc) modalDesc.innerText = desc;

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  window.requestAnimationFrame(() => {
    modalImg.src = imgSrc;
    modalImg.alt = title;
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