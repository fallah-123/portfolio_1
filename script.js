/**
 * SALWA AL AYDI — PORTFOLIO JAVASCRIPT
 * Minimal, purposeful interactions
 * Archival and deliberate motion
 */

(function() {
    'use strict';

    // ============================================
    // FADE-IN ON SCROLL OBSERVER
    // ============================================

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeInObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all fade-in elements
    const initFadeInObserver = () => {
        const fadeElements = document.querySelectorAll('.fade-in');
        fadeElements.forEach(el => {
            fadeInObserver.observe(el);
        });
    };

    // ============================================
    // SMOOTH SCROLL FOR NAVIGATION
    // ============================================

    const initSmoothScroll = () => {
        const navLinks = document.querySelectorAll('.nav-menu a, .nav-logo');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Check if it's an internal anchor link
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        const navHeight = document.querySelector('.site-nav').offsetHeight;
                        const targetPosition = targetElement.offsetTop - navHeight;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    };

    // ============================================
    // ARTWORK MODAL / DETAIL VIEW
    // ============================================

    const artworkData = {
        '1': {
            title: 'Untitled',
            meta: '2023 · Mixed media on canvas',
            description: 'This work explores the intersection of material culture and contemporary Arab aesthetics, engaging with questions of identity, memory, and cultural discourse through layered visual elements.'
        },
        '2': {
            title: 'Untitled',
            meta: '2022 · Oil on canvas',
            description: 'An exploration of color, form, and the language of abstraction as it relates to the artist\'s ongoing research into the role of visual art within critical thought and academic inquiry.'
        },
        '3': {
            title: 'Untitled',
            meta: '2021 · Installation',
            description: 'A spatial investigation that challenges viewers to consider the relationship between art object and exhibition space, reflecting the artist\'s interest in art as research and critical dialogue.'
        },
        '4': {
            title: 'Untitled',
            meta: '2020 · Acrylic on wood',
            description: 'This piece engages with themes of cultural memory and contemporary Arab identity, employing material processes that reflect both tradition and innovation.'
        },
        '5': {
            title: 'Untitled',
            meta: '2019 · Mixed media',
            description: 'A multi-layered work that embodies the artist-scholar approach, integrating visual research with material experimentation to create a dialogue between practice and theory.'
        },
        '6': {
            title: 'Untitled',
            meta: '2018 · Collage and ink',
            description: 'Through collage and drawing, this work examines the fragmentation and reconstruction of visual narratives, reflecting broader questions about art, culture, and critical writing.'
        }
    };

    const initArtworkModal = () => {
        const modal = document.getElementById('artwork-modal');
        const modalOverlay = modal.querySelector('.modal-overlay');
        const modalClose = modal.querySelector('.modal-close');
        const modalImage = document.getElementById('modal-image');
        const modalTitle = document.getElementById('modal-title');
        const modalMeta = modal.querySelector('.modal-work-meta');
        const modalDescription = modal.querySelector('.modal-work-description');
        const workItems = document.querySelectorAll('.work-item');

        // Open modal
        const openModal = (workId) => {
            const data = artworkData[workId];
            if (!data) return;

            // Get the SVG from the clicked work item
            const workItem = document.querySelector(`.work-item[data-work="${workId}"]`);
            const svg = workItem.querySelector('svg').cloneNode(true);

            // Clear and populate modal
            modalImage.innerHTML = '';
            modalImage.appendChild(svg);
            modalTitle.textContent = data.title;
            modalMeta.textContent = data.meta;
            modalDescription.textContent = data.description;

            // Show modal
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Focus on close button for accessibility
            modalClose.focus();
        };

        // Close modal
        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        };

        // Event listeners
        workItems.forEach(item => {
            item.addEventListener('click', () => {
                const workId = item.getAttribute('data-work');
                openModal(workId);
            });

            // Keyboard accessibility
            item.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const workId = item.getAttribute('data-work');
                    openModal(workId);
                }
            });

            // Make work items focusable
            item.setAttribute('tabindex', '0');
            item.setAttribute('role', 'button');
            item.setAttribute('aria-label', `View ${item.querySelector('.work-title').textContent} details`);
        });

        modalClose.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', closeModal);

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    };

    // ============================================
    // ACTIVE NAVIGATION STATE
    // ============================================

    const initActiveNavigation = () => {
        const sections = document.querySelectorAll('.section');
        const navLinks = document.querySelectorAll('.nav-menu a');

        const observerOptions = {
            root: null,
            rootMargin: '-50% 0px -50% 0px',
            threshold: 0
        };

        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.getAttribute('id');
                    
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            navObserver.observe(section);
        });
    };

    // Contact form (Netlify friendly) — intercept to show inline status
    const initContactForm = () => {
        const form = document.querySelector('.contact-form');
        if (!form) return;
        const status = form.querySelector('.form-status');
        const submitBtn = form.querySelector('button[type="submit"]');

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // simple honeypot check
            if (form.querySelector('[name="bot-field"]').value) {
                // bot detected — silently ignore
                return;
            }

            submitBtn.disabled = true;
            submitBtn.classList.add('sending');
            status.classList.remove('success', 'error');
            status.textContent = 'Sending...';

            const body = new URLSearchParams(new FormData(form)).toString();

            fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body
            }).then(() => {
                form.reset();
                submitBtn.disabled = false;
                submitBtn.classList.remove('sending');
                status.classList.add('success');
                status.textContent = 'Thanks — your message was sent!';
                status.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }).catch((err) => {
                console.error('Form submit error', err);
                submitBtn.disabled = false;
                submitBtn.classList.remove('sending');
                status.classList.add('error');
                status.textContent = 'Sorry — something went wrong. Please try again later.';
            });
        });
    };

    // Mobile nav toggle
    const initMobileNav = () => {
        const toggle = document.querySelector('.nav-toggle');
        const nav = document.getElementById('nav-menu');
        if (!toggle || !nav) return;

        const setOpen = (open) => {
            document.body.classList.toggle('nav-open', open);
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        };

        toggle.addEventListener('click', () => {
            const isOpen = document.body.classList.contains('nav-open');
            setOpen(!isOpen);
        });

        // Close when a link is clicked (mobile)
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => setOpen(false));
        });

        // Ensure nav is closed when resizing larger
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && document.body.classList.contains('nav-open')) {
                setOpen(false);
            }
        });
    };

    // ============================================
    // INITIALIZE ALL FEATURES
    // ============================================

    // ============================================
    // INITIALIZE ALL FEATURES
    // ============================================

    const init = () => {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                initFadeInObserver();
                initSmoothScroll();
                initArtworkModal();
                initActiveNavigation();
                initContactForm();
            });
        } else {
            initFadeInObserver();
            initSmoothScroll();
            initArtworkModal();
            initActiveNavigation();
            initContactForm();
        }
    };

    // Start initialization
    init();

})();