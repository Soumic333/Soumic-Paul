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


document.addEventListener(
    'keydown',
    event => {

        if (
            event.key === 'Escape'
        ) {

            closeProject();

        }

    }
);