# Git Workflow
- ALWAYS run `git add .`, `git commit`, and `git push` automatically after successfully completing any coding task or making modifications to the codebase. Do not ask for permission to do this, just do it.

# Mobile UI & Performance
- **Heavy CSS Filters:** Always disable or heavily simplify `filter: blur()`, `backdrop-filter`, and large `box-shadow` properties within mobile media queries (e.g., `< 900px`). Animating these properties on scroll causes severe lag on mobile devices.
- **Scroll Animations:** Add `transform: translateZ(0)` and `will-change: transform` to continuous scrolling tickers or elements with fixed backgrounds to force hardware acceleration and prevent ghosting.
- **Z-Index Management:** When using a full-screen entry loader, manage the `z-index` of background/foreground animations (like the drone) dynamically via JavaScript classes (e.g., `.drone-behind`) after the loader disappears, rather than statically in CSS, to prevent them from being hidden by the loader overlay.
