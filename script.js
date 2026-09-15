/* =========================================================
   SOUMIC PORTFOLIO — INTERACTION ENGINE
   ========================================================= */


/* =========================================================
   0. MOBILE MENU TOGGLE
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
   0. IN-PAGE ANCHOR NAVIGATION
   Explicit smooth-scroll (more reliable across browsers/
   embedded previews than relying on default '#anchor' jump)
   ========================================================= */

const NAV_OFFSET = 90;

document
    .querySelectorAll('a[href^="#"]')
    .forEach(link => {

        link.addEventListener(
            'click',
            event => {

                const targetId =
                    link.getAttribute('href');

                if (
                    !targetId ||
                    targetId === '#'
                ) {
                    return;
                }

                const target =
                    document.querySelector(targetId);

                if (!target) return;

                event.preventDefault();

                const top =
                    target.getBoundingClientRect().top +
                    window.pageYOffset -
                    NAV_OFFSET;

                window.scrollTo({
                    top,
                    behavior: 'smooth'
                });

                history.pushState(
                    null,
                    '',
                    targetId
                );

            }
        );

    });


/* =========================================================
   1. SCROLL PROGRESS
   ========================================================= */

const progress =
    document.querySelector('.progress span');

function updateProgress() {

    const scrollHeight =
        document.documentElement.scrollHeight -
        window.innerHeight;

    const percentage =
        scrollHeight > 0
            ? (window.scrollY / scrollHeight) * 100
            : 0;

    if (progress) {

        progress.style.width =
            `${percentage}%`;

    }

}

window.addEventListener(
    'scroll',
    updateProgress,
    { passive: true }
);

updateProgress();


/* =========================================================
   2. STAGGERED BLUR REVEAL
   ========================================================= */

const revealObserver =
    new IntersectionObserver(

        entries => {

            entries.forEach(entry => {

                if (
                    entry.isIntersecting
                ) {

                    entry.target
                        .classList
                        .add('visible');

                    revealObserver
                        .unobserve(entry.target);

                }

            });

        },

        {
            threshold: 0.12,

            rootMargin:
                '0px 0px -50px 0px'
        }

    );


document
    .querySelectorAll('.reveal')
    .forEach(element => {

        revealObserver.observe(element);

    });


/* =========================================================
   3. SPOTLIGHT CARD HOVER
   ========================================================= */

const spotlightElements =
    document.querySelectorAll(
        '.project-card, .skill-group, .certificate, .activity-card, .education-card'
    );


if (
    window.matchMedia(
        '(pointer:fine)'
    ).matches
) {

    spotlightElements.forEach(card => {

        card.addEventListener(
            'pointermove',
            event => {

                const rect =
                    card.getBoundingClientRect();

                const x =
                    ((event.clientX - rect.left)
                    / rect.width) * 100;

                const y =
                    ((event.clientY - rect.top)
                    / rect.height) * 100;

                card.style.setProperty(
                    '--spot-x',
                    `${x}%`
                );

                card.style.setProperty(
                    '--spot-y',
                    `${y}%`
                );

            }
        );


        card.addEventListener(
            'pointerleave',
            () => {

                card.style.setProperty(
                    '--spot-x',
                    '50%'
                );

                card.style.setProperty(
                    '--spot-y',
                    '50%'
                );

            }
        );

    });

}


/* =========================================================
   4. MAGNETIC BUTTONS
   ========================================================= */

const magneticElements =
    document.querySelectorAll(
        '.hero-btn, .pill, .nav-cta, .big-email'
    );


if (
    window.matchMedia(
        '(pointer:fine)'
    ).matches
) {

    magneticElements.forEach(element => {

        element.addEventListener(
            'pointermove',
            event => {

                const rect =
                    element.getBoundingClientRect();

                const x =
                    event.clientX -
                    (rect.left + rect.width / 2);

                const y =
                    event.clientY -
                    (rect.top + rect.height / 2);

                const strength = 0.12;

                element.style.transform =
                    `translate(
                        ${x * strength}px,
                        ${y * strength}px
                    )`;

            }
        );


        element.addEventListener(
            'pointerleave',
            () => {

                element.style.transform =
                    '';

            }
        );

    });

}


/* =========================================================
   5. HERO CIRCUIT CONSTELLATION & GLOW PARALLAX
   Mouse-reactive high-performance vector field
   ========================================================= */

const hero = document.querySelector('.hero');
const vector = document.querySelector('.space-vector');
const glow1 = document.querySelector('.hero-glow-1');
const glow2 = document.querySelector('.hero-glow-2');

if (hero && window.matchMedia('(pointer:fine)').matches) {
    let heroRect = hero.getBoundingClientRect();
    let heroMouseX = 0, heroMouseY = 0;
    let isHeroHovered = false;
    let heroTicking = false;

    // Cache rect on scroll/resize for accurate coords
    window.addEventListener('resize', () => { heroRect = hero.getBoundingClientRect(); }, { passive: true });
    window.addEventListener('scroll', () => { heroRect = hero.getBoundingClientRect(); }, { passive: true });

    hero.addEventListener('pointerenter', () => {
        isHeroHovered = true;
        heroRect = hero.getBoundingClientRect();
    });
    
    hero.addEventListener('pointerleave', () => {
        isHeroHovered = false;
        if (vector) vector.style.transform = 'translate3d(0,0,0)';
        if (glow1) glow1.style.transform = 'translate3d(0,0,0)';
        if (glow2) glow2.style.transform = 'translate3d(0,0,0)';
    });

    hero.addEventListener('pointermove', event => {
        heroMouseX = event.clientX;
        heroMouseY = event.clientY;

        if (!heroTicking && isHeroHovered) {
            window.requestAnimationFrame(() => {
                const x = (heroMouseX - heroRect.left) / heroRect.width - 0.5;
                const y = (heroMouseY - heroRect.top) / heroRect.height - 0.5;

                if (vector) vector.style.transform = `translate3d(${x * 10}px, ${y * 10}px, 0)`;
                if (glow1) glow1.style.transform = `translate3d(${x * -20}px, ${y * -20}px, 0)`;
                if (glow2) glow2.style.transform = `translate3d(${x * 30}px, ${y * 30}px, 0)`;

                heroTicking = false;
            });
            heroTicking = true;
        }
    });
}


/* =========================================================
   6. HERO PORTRAIT PARALLAX
   Very subtle
   ========================================================= */

const portrait =
    document.querySelector(
        '.hero-portrait'
    );


if (
    hero &&
    portrait &&
    window.matchMedia(
        '(pointer:fine)'
    ).matches
) {

    hero.addEventListener(
        'pointermove',
        event => {

            const rect =
                hero.getBoundingClientRect();

            const x =
                (event.clientX -
                rect.left) /
                rect.width -
                0.5;

            const y =
                (event.clientY -
                rect.top) /
                rect.height -
                0.5;


            portrait.style.setProperty(
                '--tilt-x',
                `${y * -2}deg`
            );

            portrait.style.setProperty(
                '--tilt-y',
                `${x * 2}deg`
            );

        }
    );


    hero.addEventListener(
        'pointerleave',
        () => {

            portrait.style.setProperty(
                '--tilt-x',
                '0deg'
            );

            portrait.style.setProperty(
                '--tilt-y',
                '0deg'
            );

        }
    );

}


/* =========================================================
   7. PROJECT IMAGE MICRO PARALLAX
   ========================================================= */

const projectCard =
    document.querySelector(
        '.project-card'
    );

const projectImage =
    document.querySelector(
        '.project-photo'
    );


if (
    projectCard &&
    projectImage &&
    window.matchMedia(
        '(pointer:fine)'
    ).matches
) {

    projectCard.addEventListener(
        'pointermove',
        event => {

            const rect =
                projectCard.getBoundingClientRect();

            const x =
                (event.clientX -
                rect.left) /
                rect.width -
                0.5;

            const y =
                (event.clientY -
                rect.top) /
                rect.height -
                0.5;


            projectImage.style.transform =
                `scale(1.035)
                 translate(
                    ${x * -5}px,
                    ${y * -5}px
                 )`;

        }
    );


    projectCard.addEventListener(
        'pointerleave',
        () => {

            projectImage.style.transform =
                '';

        }
    );

}


/* =========================================================
   8. PROJECT MODAL
   ========================================================= */

function openProject() {

    const modal =
        document.getElementById(
            'projectModal'
        );

    if (!modal) return;

    modal.classList.add('open');

    modal.setAttribute(
        'aria-hidden',
        'false'
    );

    document.body.style.overflow =
        'hidden';
}


function closeProject() {

    const modal =
        document.getElementById(
            'projectModal'
        );

    if (!modal) return;

    modal.classList.remove('open');

    modal.setAttribute(
        'aria-hidden',
        'true'
    );

    document.body.style.overflow =
        '';
}


function openCertificate(imgSrc, title, desc) {
    const modal = document.getElementById('certModal');
    const modalImg = document.getElementById('certModalImg');
    const modalTitle = document.getElementById('certModalTitle');
    const modalDesc = document.getElementById('certModalDesc');
    
    if (!modal || !modalImg) return;
    
    modalImg.style.opacity = '0';
    
    modalImg.onload = () => {
        modalImg.style.opacity = '1';
    };
    
    modalImg.src = imgSrc;
    modalTitle.innerHTML = title;
    modalDesc.innerHTML = desc;
    
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeCertificate() {
    const modal = document.getElementById('certModal');
    if (!modal) return;
    
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
        closeProject();
        closeCertificate();
    }
});



/* =========================================================
   10. STAR TRAIL CURSOR
   ========================================================= */

const canvas = document.getElementById('star-trail');
if (canvas && window.matchMedia('(pointer:fine)').matches) {
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
    });

    const particles = [];
    const colors = ['#00f0ff', '#a000ff', '#ff2bd6']; // Cyan, Purple, Pink

    document.addEventListener('mousemove', e => {
        // Spawn particles on mouse move
        const particleCount = Math.random() > 0.5 ? 2 : 1;
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: e.clientX,
                y: e.clientY,
                size: Math.random() * 2.5 + 1,
                color: colors[Math.floor(Math.random() * colors.length)],
                velocityX: (Math.random() - 0.5) * 1.5,
                velocityY: (Math.random() - 0.5) * 1.5 + 0.5, // Slight gravity effect
                life: 1,
                decay: Math.random() * 0.02 + 0.015
            });
        }
    });

    function animateStars() {
        ctx.clearRect(0, 0, width, height);
        
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.velocityX;
            p.y += p.velocityY;
            p.life -= p.decay;
            
            if (p.size > 0.1) p.size -= 0.02;

            if (p.life <= 0 || p.size <= 0) {
                particles.splice(i, 1);
                i--;
                continue;
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.life;
            ctx.shadowBlur = 8;
            ctx.shadowColor = p.color;
            ctx.fill();
        }
        
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
        requestAnimationFrame(animateStars);
    }
    
    animateStars();
}

/* =========================================================
   11. NUMBER COUNTING ANIMATION (STATS)
   ========================================================= */

const counters = document.querySelectorAll('.count-up');
let hasCounted = false;

if (counters.length > 0) {
    const statsObserver = new IntersectionObserver((entries) => {
        if(entries[0].isIntersecting && !hasCounted) {
            hasCounted = true;
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                const duration = 2000; 
                const increment = target / (duration / 16); 
                
                let current = 0;
                const updateCounter = () => {
                    current += increment;
                    if(current < target) {
                        counter.innerText = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCounter();
            });
        }
    }, { threshold: 0.1 });
    
    const statsContainer = document.getElementById('about-stats');
    if(statsContainer) statsObserver.observe(statsContainer);
}

/* =========================================================
   12. HERO TYPING ANIMATION
   ========================================================= */
const typingElement = document.getElementById('hero-typing-text');
if (typingElement) {
    const textToType = typingElement.getAttribute('data-text');
    typingElement.innerText = '';
    let typeIndex = 0;
    
    setTimeout(() => {
        const typeInterval = setInterval(() => {
            if (typeIndex < textToType.length) {
                typingElement.innerText += textToType.charAt(typeIndex);
                typeIndex++;
            } else {
                clearInterval(typeInterval);
            }
        }, 20); 
    }, 100);
}

/* =========================================================
   EDUCATION TIMELINE SCROLL ANIMATION
   ========================================================= */
(function() {
    const nodes = document.querySelectorAll('.edu-node');
    const timeline = document.getElementById('edu-timeline-container');
    const lineFill = document.getElementById('edu-line-fill');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.25 });

    nodes.forEach(n => observer.observe(n));

    // Dynamic scroll-based line fill
    if (timeline && lineFill) {
        let lineTicking = false;
        window.addEventListener('scroll', () => {
            if (!lineTicking) {
                window.requestAnimationFrame(() => {
                    const rect = timeline.getBoundingClientRect();
                    const start = window.innerHeight / 2;
                    
                    if (rect.top > start) {
                        lineFill.style.height = '0%';
                    } else if (rect.bottom < start) {
                        lineFill.style.height = '100%';
                    } else {
                        const total = rect.height;
                        const passed = start - rect.top;
                        const percentage = Math.max(0, Math.min(100, (passed / total) * 100));
                        lineFill.style.height = `${percentage}%`;
                    }
                    lineTicking = false;
                });
                lineTicking = true;
            }
        }, { passive: true });
    }
})();

/* =========================================================
   ACTIVE NAV INDICATOR
   ========================================================= */
(function() {
    const navLinks = document.querySelectorAll('.nav-wrap nav a');
    const sections = document.querySelectorAll('section[id], main[id]');
    
    // Default to 'home' active on load
    navLinks.forEach(link => {
        if (link.getAttribute('href') === '#home') link.classList.add('active');
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const current = entry.target.id;
                
                navLinks.forEach(link => {
                    const href = link.getAttribute('href').replace('#', '');
                    if (href === current) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, {
        // Trigger when the section reaches the middle of the viewport
        rootMargin: '-30% 0px -70% 0px' 
    });

    sections.forEach(sec => {
        if (sec.id !== 'top') {
            observer.observe(sec);
        }
    });
})();