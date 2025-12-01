document.addEventListener('DOMContentLoaded', () => {

    // ======================================================
    // 1. MENU MOBILE (Hambúrguer)
    // ======================================================
    const mobileBtn = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.main-header nav');
    const navLinksMobile = document.querySelectorAll('.main-header nav a');

    if (mobileBtn && navMenu) {
        mobileBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');

            // Troca o ícone de "Barras" para "X"
            const icon = mobileBtn.querySelector('i');
            if (icon) {
                if (navMenu.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });

        // Fecha o menu ao clicar em qualquer link
        navLinksMobile.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = mobileBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }

                if (ScrollTrigger) {
                    setTimeout(() => {
                        ScrollTrigger.refresh(true);
                    }, 50);
                }
            });
        });
    }

    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    const scrollTarget = document.getElementById('scroll-content-height');
    const spotlightOverlay = document.getElementById('spotlight-overlay');

    const navAboutUs = document.getElementById('nav-about-us');
    const aboutUsPage = document.getElementById('about-us-page');
    const aboutUsClose = document.getElementById('about-us-close');
    const allNavLinks = document.querySelectorAll('nav a');
    
    let isAboutUsActive = false;
    let masterTL; // Variável global da timeline
    let savedScrollPosition = 0;

    const bottle1 = document.getElementById('bottle-image-placeholder-1');
    const bottle2 = document.getElementById('bottle-image-placeholder-2');
    const logoLink = document.querySelector('.logo-link');

    // ======================================================
    // LOGO LINK
    // ======================================================
    if (logoLink) {
        logoLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (isAboutUsActive) {
                handleSlide(false);
                setTimeout(() => scrollToSection('#scene-1'), 800);
            } else {
                scrollToSection('#scene-1');
            }
            const navMenu = document.querySelector('.main-header nav');
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        });
    }

    // ======================================================
    // Funções Auxiliares (Travar Scroll / Navegação)
    // ======================================================
    const disableScrollAndTimeline = () => {
        savedScrollPosition = window.scrollY || document.documentElement.scrollTop;
        ScrollTrigger.getAll().forEach(trigger => trigger.disable());
        if (masterTL) masterTL.pause();
        document.body.classList.add('scroll-locked');
        document.body.style.top = `-${savedScrollPosition}px`;
    }

    const enableScrollAndTimeline = () => {
        document.body.classList.remove('scroll-locked');
        document.body.style.top = '';
        window.scrollTo(0, savedScrollPosition);

        setTimeout(() => {
            const scrollHeight = scrollTarget ? scrollTarget.offsetHeight : document.documentElement.scrollHeight;
            const progress = (scrollHeight - window.innerHeight) > 0 ? (savedScrollPosition / (scrollHeight - window.innerHeight)) : 0;

            if (masterTL && typeof masterTL.duration === 'function') {
                masterTL.seek(progress * masterTL.duration());
            }

            ScrollTrigger.getAll().forEach(trigger => trigger.enable());
            ScrollTrigger.refresh(true);
        }, 10);
    };

    const scrollToSection = (targetId) => {
        if (!targetId || targetId === '#' || !masterTL) return;
        const label = targetId.replace('#', '');
        let scrollPos;
        try {
             scrollPos = masterTL.scrollTrigger.labelToScroll(label);
        } catch(e) {
             if(label === 'scene-1') {
                 gsap.to(window, { duration: 1, scrollTo: 0, ease: "power2.inOut" });
             }
             return; 
        }

        if (scrollPos !== null && scrollPos !== undefined) {
            gsap.to(window, {
                duration: 1.5,
                scrollTo: scrollPos,
                ease: "power2.inOut"
            });
        }
    };

    // ======================================================
    // 2. CURSOR & SPOTLIGHT (Geralmente desligado em touch, mas mantido aqui)
    // ======================================================
    const cursor = document.querySelector('.custom-cursor');
    let mouseX = 0, mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    gsap.to({}, 0.016, {
        repeat: -1,
        onRepeat: () => {
            // Se quiser desativar o cursor no mobile, use CSS media query (display: none)
            if (cursor) {
                gsap.set(cursor, { css: { left: mouseX, top: mouseY } });
            }
            if (spotlightOverlay) {
                spotlightOverlay.style.setProperty('--x', `${mouseX}px`);
                spotlightOverlay.style.setProperty('--y', `${mouseY}px`);
            }
        }
    });

    // ======================================================
    // 3. QUEM SOMOS — SLIDE
    // ======================================================
    const handleSlide = (open) => {
        if (open === isAboutUsActive) return;
        isAboutUsActive = open;
        const targetX = open ? "0%" : "100%";
        const duration = 0.8;
        if (!aboutUsPage) return;

        gsap.to(aboutUsPage, {
            x: targetX,
            duration,
            ease: "power3.inOut",
            onStart: () => {
                if (open) {
                    disableScrollAndTimeline();
                    aboutUsPage.setAttribute('aria-hidden', 'false');
                    aboutUsPage.classList.add('active');
                }
            },
            onComplete: () => {
                if (!open) {
                    aboutUsPage.setAttribute('aria-hidden', 'true');
                    aboutUsPage.classList.remove('active');
                    enableScrollAndTimeline();
                }
            }
        });
    };

    if (aboutUsPage) {
        aboutUsPage.addEventListener('click', (e) => {
            if (e.target === aboutUsPage && isAboutUsActive) {
                handleSlide(false);
            }
        });
    }

    if (allNavLinks && allNavLinks.length) {
        allNavLinks.forEach(link => {
            const targetHref = link.getAttribute('href');
            link.addEventListener('click', (e) => {
                e.preventDefault();
                if (link.id === 'nav-about-us') {
                    handleSlide(true);
                    return;
                }
                if (!targetHref || targetHref === '#') return;
                if (isAboutUsActive) {
                    handleSlide(false);
                    setTimeout(() => scrollToSection(targetHref), 800);
                } else {
                    scrollToSection(targetHref);
                }
            });
        });
    }

    if (aboutUsClose) {
        aboutUsClose.addEventListener('click', () => {
            handleSlide(false);
        });
    }

    // ======================================================
    // 4. HOVER DOS FRASCOS
    // ======================================================
    const setupBottleHover = (bottleElement) => {
        if (!bottleElement) return;
        gsap.set(bottleElement, { rotateY: 0, scale: 1.0 });
        bottleElement.addEventListener('mouseenter', () => {
            gsap.to(bottleElement, { rotateY: 15, scale: 1.05, duration: 0.5, ease: "power2.out" });
        });
        bottleElement.addEventListener('mouseleave', () => {
            gsap.to(bottleElement, { rotateY: 0, scale: 1.0, duration: 0.5, ease: "power2.out" });
        });
    };
    setupBottleHover(bottle1);
    setupBottleHover(bottle2);
    if (bottle1) gsap.set(bottle1, { opacity: 1 });
    if (bottle2) gsap.set(bottle2, { opacity: 1 });


    // ======================================================
    // 5. TIMELINE RESPONSIVA (GSAP MatchMedia)
    // ======================================================
    let mm = gsap.matchMedia();

    // ------------------------------------------------------
    // A) DESKTOP (Largura > 768px)
    // ------------------------------------------------------
    mm.add("(min-width: 769px)", () => {
        
        // Recria a timeline específica para Desktop
        masterTL = gsap.timeline({
            scrollTrigger: {
                trigger: scrollTarget || document.body,
                start: "top top",
                end: "bottom bottom",
                scrub: true,
            }
        });

        // --- HOME (Scene 1) ---
        masterTL.addLabel("scene-1", 0); 
        masterTL.fromTo('#scene-1',
            { opacity: 1, y: 0 },
            { opacity: 0, y: -50, duration: 0.3 }, 0.2);

        // --- Scene 2 ---
        masterTL.fromTo('#scene-2',
            { opacity: 0 },
            { opacity: 1, duration: 0.3 }, 0.5)
            .to('#scene-2', { opacity: 0, y: -50, duration: 0.2 }, 1.9);

        // --- Scene 3 (Dark Pulse) ---
        masterTL.addLabel("scene-3", 2.7);

        masterTL.fromTo('#scene-3',
            { autoAlpha: 0, zIndex: 0 }, 
            { autoAlpha: 1, zIndex: 100, duration: 0.4 }, 2.1) 
            .fromTo('#bottle-image-placeholder-1',
                { yPercent: 40, rotateZ: 0, scale: 0.8 }, 
                { yPercent: -15, rotateZ: -10, scale: 1, duration: 0.6 }, 2.2)
            .to('#scene-3', { autoAlpha: 0, zIndex: 0, duration: 0.5 }, 3.0); 

        // --- Scene 4 (Deep Desire Intense) ---
        const scene4StartTime = 3.3;
        masterTL.addLabel("scene-4", scene4StartTime + 0.2);

        masterTL.fromTo('#scene-4',
            { autoAlpha: 0, zIndex: 0 }, 
            { autoAlpha: 1, zIndex: 100, duration: 0.4 }, scene4StartTime) 
            .fromTo('#bottle-image-placeholder-2',
                { yPercent: 40, rotateZ: 0, scale: 0.8 }, 
                { yPercent: -15, rotateZ: -10, scale: 1, duration: 0.6 }, scene4StartTime + 0.1)
            .to('#scene-4', { autoAlpha: 0, zIndex: 0, duration: 0.5 }, scene4StartTime + 1.2); 

        // --- Scene 5 ---
        const scene5StartTime = scene4StartTime + 1.5;
        masterTL.fromTo('#scene-5',
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 0.7 }, scene5StartTime)
            .to('#scene-5', { opacity: 0, y: -50, duration: 0.5 }, scene5StartTime + 1.0);

        // --- CONTATO (Scene 6) ---
        const scene6StartTime = scene5StartTime + 1.3;
        masterTL.addLabel("scene-6", scene6StartTime + 0.8);

        masterTL.fromTo('#scene-6',
            { opacity: 0, y: 50 }, 
            { opacity: 1, y: 0, duration: 0.7, pointerEvents: 'auto' }, scene6StartTime); 

        return () => { 
            // Limpeza opcional se necessário quando sai do breakpoint
        };
    });

    // ------------------------------------------------------
    // B) MOBILE (Largura <= 768px)
    // ------------------------------------------------------
    mm.add("(max-width: 768px)", () => {
        console.log("GSAP: Modo Mobile Ativado");

        // ⚠️ AQUI ESTÃO AS CONFIGURAÇÕES APENAS PARA CELULAR ⚠️
        // Você pode mudar scale, duration, yPercent aqui sem afetar o desktop.
        
        masterTL = gsap.timeline({
            scrollTrigger: {
                trigger: scrollTarget || document.body,
                start: "top top",
                end: "bottom bottom",
                scrub: true, // No mobile, as vezes scrub: 0.5 fica mais suave
            }
        });

        // --- HOME (Scene 1 - Mobile) ---
        masterTL.addLabel("scene-1", 0); 
        masterTL.fromTo('#scene-1',
            { opacity: 1, y: 0 },
            { opacity: 0, y: -30, duration: 0.3 }, 0.2); // Ex: Mudei y para -30

        // --- Scene 2 - Mobile ---
        masterTL.fromTo('#scene-2',
            { opacity: 0 },
            { opacity: 1, duration: 0.3 }, 0.5)
            .to('#scene-2', { opacity: 0, y: -30, duration: 0.2 }, 1.9);

        // --- Scene 3 (Dark Pulse) - Mobile ---
        masterTL.addLabel("scene-3", 2.7);

        masterTL.fromTo('#scene-3',
            { autoAlpha: 0, zIndex: 0 }, 
            { autoAlpha: 1, zIndex: 100, duration: 0.4 }, 2.1) 
            .fromTo('#bottle-image-placeholder-1',
                // DICA: No mobile, talvez você queira o frasco menor (scale: 0.8)
                { yPercent: 40, rotateZ: 0, scale: 0.6 }, 
                { yPercent: -10, rotateZ: -5, scale: 0.8, duration: 0.6 }, 2.2)
            .to('#scene-3', { autoAlpha: 0, zIndex: 0, duration: 0.5 }, 3.0); 

        // --- Scene 4 (Deep Desire Intense) - Mobile ---
        const scene4StartTime = 3.3;
        masterTL.addLabel("scene-4", scene4StartTime + 0.2);

        masterTL.fromTo('#scene-4',
            { autoAlpha: 0, zIndex: 0 }, 
            { autoAlpha: 1, zIndex: 100, duration: 0.4 }, scene4StartTime) 
            .fromTo('#bottle-image-placeholder-2',
                 // Ajustes Mobile para o segundo frasco
                { yPercent: 40, rotateZ: 0, scale: 0.6 }, 
                { yPercent: -10, rotateZ: -5, scale: 0.8, duration: 0.6 }, scene4StartTime + 0.1)
            .to('#scene-4', { autoAlpha: 0, zIndex: 0, duration: 0.5 }, scene4StartTime + 1.2); 

        // --- Scene 5 - Mobile ---
        const scene5StartTime = scene4StartTime + 1.5;
        masterTL.fromTo('#scene-5',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.7 }, scene5StartTime)
            .to('#scene-5', { opacity: 0, y: -30, duration: 0.5 }, scene5StartTime + 1.0);

        // --- CONTATO (Scene 6) - Mobile ---
        const scene6StartTime = scene5StartTime + 1.3;
        masterTL.addLabel("scene-6", scene6StartTime + 0.8);

        masterTL.fromTo('#scene-6',
            { opacity: 0, y: 30 }, 
            { opacity: 1, y: 0, duration: 0.7 }, scene6StartTime); 
    });


    // ======================================================
    // 6. SISTEMA DE ABAS
    // ======================================================
    const tabButtons = document.querySelectorAll('.tab-button');
    const switchTab = (targetId, currentButton) => {
        const parentContainer = currentButton.closest('.product-info');
        if (!parentContainer) return;

        parentContainer.querySelectorAll('.tab-content.active').forEach(content => {
            gsap.to(content, {
                opacity: 0,
                duration: 0.2,
                onComplete: () => {
                    content.classList.remove('active');
                    content.setAttribute('hidden', true);
                }
            });
        });

        parentContainer.querySelectorAll('.tab-button').forEach(btn => {
            const isSelected = (btn === currentButton);
            btn.classList.toggle('active', isSelected);
            btn.setAttribute('aria-selected', isSelected);
        });

        setTimeout(() => {
            const activeContent = document.getElementById(targetId);
            if (activeContent) {
                activeContent.removeAttribute('hidden');
                activeContent.classList.add('active');
                gsap.fromTo(activeContent,
                    { opacity: 0, y: 10 },
                    { opacity: 1, y: 0, duration: 0.4 }
                );
            }
            ScrollTrigger.refresh(true); 
        }, 200);
    };

    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault(); 
                if (event.currentTarget.id === 'about-us-close') return;

                const scene = event.currentTarget.dataset.scene;
                const tab = event.currentTarget.dataset.tab;
                if(scene && tab) {
                    const targetId = `tab-${scene}-${tab}`;
                    switchTab(targetId, event.currentTarget);
                }
            });
        });
    }

}); // Fim do DOMContentLoaded