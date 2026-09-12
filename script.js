/* =========================================================
   SOUMIC PORTFOLIO — INTERACTION ENGINE
   ========================================================= */


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
   5. HERO CIRCUIT CONSTELLATION
   Mouse-reactive vector field
   ========================================================= */

const hero =
    document.querySelector('.hero');

const vector =
    document.querySelector('.space-vector');


if (
    hero &&
    vector &&
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


            vector.style.transform =
                `translate(
                    ${x * 10}px,
                    ${y * 10}px
                )`;

        }
    );


    hero.addEventListener(
        'pointerleave',
        () => {

            vector.style.transform =
                'translate(0,0)';

        }
    );

}


/* =========================================================
   5b. HERO NEON GLOW PARALLAX
   ========================================================= */

const glow1 =
    document.querySelector('.hero-glow-1');

const glow2 =
    document.querySelector('.hero-glow-2');


if (
    hero &&
    (glow1 || glow2) &&
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

            if (glow1) {
                glow1.style.transform =
                    `translate(
                        ${x * 40}px,
                        ${y * 40}px
                    )`;
            }

            if (glow2) {
                glow2.style.transform =
                    `translate(
                        ${x * -50}px,
                        ${y * -50}px
                    )`;
            }

        }
    );


    hero.addEventListener(
        'pointerleave',
        () => {

            if (glow1) glow1.style.transform = '';
            if (glow2) glow2.style.transform = '';

        }
    );

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
   9. ENTRY SCREEN ANIMATION LOGIC
   ========================================================= */

window.addEventListener('load', () => {
    const entryScreen = document.getElementById('entry-screen');
    const spectatorDrone = document.getElementById('spectator-drone');
    
    if (entryScreen && spectatorDrone) {
        const positionDroneAt = (padId, scale, flip) => {
            const pad = document.getElementById(padId);
            if (pad) {
                const rect = pad.getBoundingClientRect();
                // Use viewport-relative coords since drone is position:fixed
                const x = rect.left + rect.width / 2;
                const y = rect.top + rect.height / 2;
                spectatorDrone.style.transform = `translate(${x}px, ${y}px) scale(${scale}) scaleX(${flip})`;
            }
        };

        // Initial setup for Loader
        document.body.style.overflow = 'hidden';
        spectatorDrone.classList.add('visible');
        positionDroneAt('pad-loader', 4.5, 1);
        
        let isEntryAnimating = true;
        let activePad = 'pad-hero';
        let activeFlip = 1;

        setTimeout(() => {
            entryScreen.classList.add('slide-up');
            document.body.style.overflow = '';
            
            // Fly out of loader to activePad (might be pad-hero or something else if they scrolled during load)
            positionDroneAt(activePad, 0.9, activeFlip);
            
            setTimeout(() => {
                entryScreen.style.display = 'none';
                isEntryAnimating = false;
            }, 800);
            
        }, 4200);
        
        // Reposition on resize (debounced) and scroll to handle zoom/layout changes
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                positionDroneAt(activePad, 0.9, activeFlip);
            }, 50);
        });

        window.addEventListener('scroll', () => {
            positionDroneAt(activePad, 0.9, activeFlip);
        }, { passive: true });

        // Scroll Tracking Logic for the Drone
        const sections = document.querySelectorAll('section[id]');
        const droneObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    
                    if (id === 'home') {
                        activePad = 'pad-hero';
                        activeFlip = 1;
                    } else {
                        activePad = 'pad-' + id;
                        const padEl = document.getElementById(activePad);
                        if (padEl && padEl.classList.contains('pad-left')) {
                            activeFlip = -1;
                        } else {
                            activeFlip = 1;
                        }
                    }
                    
                    if (!isEntryAnimating) {
                        positionDroneAt(activePad, 0.9, activeFlip);
                    }
                }
            });
        }, { threshold: 0.35 });

        sections.forEach(sec => droneObserver.observe(sec));
    }
});

/* =========================================================
   10. CYBERPUNK CUSTOM CURSOR
   ========================================================= */

const cursor = document.getElementById('cyber-cursor');
const trail = document.getElementById('cyber-cursor-trail');

if (cursor && trail && window.matchMedia('(pointer:fine)').matches) {
    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Instant cursor update
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    // Smooth trailing update using requestAnimationFrame
    function animateTrail() {
        trailX += (mouseX - trailX) * 0.15;
        trailY += (mouseY - trailY) * 0.15;
        
        trail.style.left = trailX + 'px';
        trail.style.top = trailY + 'px';
        
        requestAnimationFrame(animateTrail);
    }
    animateTrail();

    // Hover effect on interactables
    const interactables = document.querySelectorAll('a, button, input, .bento-item, .project-card, .activity-card');
    
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });
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
    }, 4200);
}

/* =========================================================
   ACTIVE NAV INDICATOR
   ========================================================= */
(function() {
    const navLinks = document.querySelectorAll('.nav-wrap nav a');
    const sections = Array.from(document.querySelectorAll('section[id], main[id]'));

    function setActive() {
        const scrollY = window.scrollY + 100;
        let current = '';

        // Check from bottom up to find current section
        sections.forEach(sec => {
            if (sec.offsetTop <= scrollY) {
                current = sec.id;
            }
        });

        navLinks.forEach(link => {
            const href = link.getAttribute('href').replace('#', '');
            link.classList.toggle('active', href === current || (href === 'top' && current === 'top'));
        });
    }

    window.addEventListener('scroll', setActive, { passive: true });
    setActive();
})();