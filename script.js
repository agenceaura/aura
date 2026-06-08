document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // STAGGERED NAV REVEAL (The Tubik Detail)
    // ==========================================
    const staggeredLinks = document.querySelectorAll('.nav-link-staggered');
    
    staggeredLinks.forEach(link => {
        const text = link.getAttribute('data-text');
        link.innerHTML = ''; // Clear original text
        
        [...text].forEach((char, index) => {
            const letterWrap = document.createElement('span');
            letterWrap.className = 'letter-wrap';
            letterWrap.style.transitionDelay = `${index * 0.03}s`;
            
            const top = document.createElement('span');
            top.className = 'letter-top';
            top.textContent = char === ' ' ? '\u00A0' : char;
            
            const bottom = document.createElement('span');
            bottom.className = 'letter-bottom';
            bottom.textContent = char === ' ' ? '\u00A0' : char;
            
            letterWrap.appendChild(top);
            letterWrap.appendChild(bottom);
            link.appendChild(letterWrap);
        });
    });


    // ==========================================
    // LENIS SMOOTH SCROLL (The Tubik Engine)
    // ==========================================
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Integrate with manual scroll events if needed
    lenis.on('scroll', (e) => {
        handleScrollReveal();
        handlePortfolioParallax();
    });


    // ==========================================
    // SCROLL REVEAL ENGINE (Fade-in + Slide-up)
    // ==========================================
    const revealItems = document.querySelectorAll('.reveal-item');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } else {
                // Remove if you want to re-animate on scroll up
                // entry.target.classList.remove('is-visible');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealItems.forEach((item, index) => {
        // Optional: staggered delay
        // item.style.transitionDelay = `${index * 0.1}s`;
        revealObserver.observe(item);
    });

    function handleScrollReveal() {
        // Redefined for backward compatibility with Lenis listener
        // But logic is now mostly handled by revealObserver
    }

    
    // ==========================================
    // AURA CANVAS ENGINE (Cross-Browser Mobile Friendly)
    // ==========================================
    const canvas = document.getElementById('aura-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let time = 0;
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        function resize() {
            const dpr = window.devicePixelRatio || 1;
            // Adaptive size based on screen width
            const winW = window.innerWidth;
            const size = winW < 768 ? Math.min(winW * 1.5, 500) : 1100;
            
            canvas.style.width = `${size}px`;
            canvas.style.height = `${size}px`;
            canvas.width = size * dpr;
            canvas.height = size * dpr;
            ctx.scale(dpr, dpr);
            
            // Set container perspective
            canvas.parentElement.style.perspective = "1200px";
        }
        window.addEventListener('resize', resize);
        resize();

        window.addEventListener('mousemove', (e) => {
            // Factor de "Magnetismo" y 3D
            targetX = (window.innerWidth / 2 - e.pageX) / 18; // Stronger move
            targetY = (window.innerHeight / 2 - e.pageY) / 18;

            // Apply 3D tilt to the canvas element itself
            const tiltX = (e.pageY / window.innerHeight - 0.5) * 20; // Deg
            const tiltY = (e.pageX / window.innerWidth - 0.5) * -20;
            canvas.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        });

        // Touch support for parallax
        window.addEventListener('touchmove', (e) => {
            if (e.touches[0]) {
                targetX = (window.innerWidth / 2 - e.touches[0].pageX) / 15;
                targetY = (window.innerHeight / 2 - e.touches[0].pageY) / 15;
            }
        });

        function animate() {
            time += 0.015;
            
            // Smooth mouse interpolation
            mouseX += (targetX - mouseX) * 0.05;
            mouseY += (targetY - mouseY) * 0.05;

            const w = canvas.width / (window.devicePixelRatio || 1);
            const h = canvas.height / (window.devicePixelRatio || 1);
            
            // MAGIC: Different movement speeds for layers (Parallax Depth)
            const centerX = w / 2 + mouseX;
            const centerY = h / 2 + mouseY;
            const centerDeepX = w / 2 + mouseX * 0.7; // Brinda profundidad
            const centerDeepY = h / 2 + mouseY * 0.7;

            ctx.clearRect(0, 0, w, h);

            // 0. LAYER: Deep Background Bloom (Static / Slow)
            ctx.save();
            const deepBloom = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, 400);
            deepBloom.addColorStop(0, 'rgba(41, 121, 255, 0.1)');
            deepBloom.addColorStop(1, 'transparent');
            ctx.fillStyle = deepBloom;
            ctx.fillRect(0,0,w,h);
            ctx.restore();

            // Breathing & Wobble factors
            const pulse = Math.sin(time) * 0.08 + 1.0;
            const wobbleX = Math.sin(time * 0.7) * 10;
            const wobbleY = Math.cos(time * 0.8) * 10;

            // 1. Layer: Outer Glow Blue (Warped)
            ctx.save();
            ctx.fillStyle = 'rgba(0, 229, 255, 0.4)';
            drawWarpedCircle(ctx, centerX + wobbleX, centerY + wobbleY, 300 * pulse, time, true);
            ctx.restore();

            // 2. Layer: Main Neon Orb (Turbulent Energy)
            ctx.save();
            const mainGrad = ctx.createConicGradient(time * 0.4, centerX, centerY);
            mainGrad.addColorStop(0, '#00E5FF');
            mainGrad.addColorStop(0.2, '#2979FF');
            mainGrad.addColorStop(0.5, '#D500F9');
            mainGrad.addColorStop(0.8, '#2979FF');
            mainGrad.addColorStop(1, '#00E5FF');
            
            ctx.fillStyle = mainGrad;
            drawWarpedCircle(ctx, centerX, centerY, 220 * pulse, time * 1.5, true);
            ctx.restore();

            // Additional Layer: Turbulence
            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            const purpleGrad = ctx.createRadialGradient(centerX - 50, centerY - 50, 0, centerX - 50, centerY - 50, 200);
            purpleGrad.addColorStop(0, 'rgba(213, 0, 249, 0.4)');
            purpleGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = purpleGrad;
            drawWarpedCircle(ctx, centerX - 50, centerY - 50, 150, time * 2, true);
            ctx.restore();

            // 3. Layer: Hollow Core
            ctx.save();
            ctx.fillStyle = '#030305';
            ctx.beginPath();
            ctx.arc(centerX, centerY, 95 * pulse, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            // 4. Layer: Subtle Center Spark
            ctx.save();
            ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
            ctx.beginPath();
            ctx.arc(centerX - 40, centerY - 40, 30, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            requestAnimationFrame(animate);
        }

        function drawWarpedCircle(ctx, x, y, radius, t, fillStyle) {
            ctx.beginPath();
            const segments = 120; // High quality segments
            for (let i = 0; i <= segments; i++) {
                const angle = (i / segments) * Math.PI * 2;
                
                // Noise-like distortion logic
                const distortion = 
                    Math.sin(angle * 4 + t) * (radius * 0.08) + 
                    Math.sin(angle * 7 - t * 0.8) * (radius * 0.04) +
                    Math.cos(angle * 3 + t * 1.2) * (radius * 0.03);
                
                const r = radius + distortion;
                const px = x + Math.cos(angle) * r;
                const py = y + Math.sin(angle) * r;
                
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();
            if (fillStyle) {
                ctx.fill();
            }
        }

        animate();
    }

    // ==========================================
    // PORTFOLIO PARALLAX (Tubik Inspired)
    // ==========================================
    const portfolioImages = document.querySelectorAll('.card-image img');
    
    function handlePortfolioParallax() {
        portfolioImages.forEach(img => {
            const rect = img.parentElement.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // If the card is in view
            if (rect.top < windowHeight && rect.bottom > 0) {
                // Calculate position relative to viewport (0 = top, 1 = bottom)
                const relativePos = (rect.top + rect.height / 2) / windowHeight;
                // Subtle move and scale
                const moveY = (relativePos - 0.5) * 30; // Move up to 30px
                const scale = 1.1 + (Math.abs(relativePos - 0.5) * 0.1); // Scale slightly on edges
                
                img.style.transform = `scale(${scale}) translateY(${moveY}px)`;
            }
        });
    }

    // Initial check
    handlePortfolioParallax();

    // ==========================================
    // CUSTOM CURSOR ENGINE (Zero-Delay)
    // ==========================================
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    let curX = 0;
    let curY = 0;
    let folX = 0;
    let folY = 0;
    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function updateCursor() {
        // Instant follow for the small dot
        curX = mouseX;
        curY = mouseY;
        
        // High response follow for the ring
        folX += (mouseX - folX) * 0.3;
        folY += (mouseY - folY) * 0.3;

        if (cursor) cursor.style.transform = `translate3d(${curX}px, ${curY}px, 0)`;
        if (follower) follower.style.transform = `translate3d(${folX - 20}px, ${folY - 20}px, 0)`;

        requestAnimationFrame(updateCursor);
    }
    updateCursor();

    const links = document.querySelectorAll('a, button, .portfolio-card');
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            if (follower) {
                follower.style.transform += ' scale(2)';
                follower.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            }
        });
        link.addEventListener('mouseleave', () => {
            if (follower) {
                follower.style.transform = follower.style.transform.replace(' scale(2)', '');
                follower.style.backgroundColor = 'transparent';
            }
        });
    });

    // ==========================================
    // TYPEWRITER ENGINE (Scroll-Linked)
    // ==========================================
    const typeP1 = document.querySelector('#type-p1');
    const typeP2 = document.querySelector('#type-p2');
    const highlightWrapper = document.querySelector('.highlight-wrapper');
    const typingSection = document.querySelector('.typing-section');

    let textPart1 = "TU MARCA MERECE UNA ";
    let textPart2 = "AGENCIA CREATIVA";
    let fullText = textPart1 + textPart2;

    function handleTypewriter() {
        if (!typingSection) return;
        
        const rect = typingSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Calculate progress within the typing section
        // Extended the denominator (0.8) to make it feel slower and more "delicate"
        let progress = (windowHeight * 0.8 - rect.top) / (windowHeight * 0.8);
        progress = Math.max(0, Math.min(1, progress));

        const charCount = Math.floor(progress * fullText.length);
        
        if (charCount <= textPart1.length) {
            typeP1.textContent = textPart1.substring(0, charCount);
            typeP2.textContent = "";
            highlightWrapper.classList.remove('is-selected');
        } else {
            typeP1.textContent = textPart1;
            typeP2.textContent = textPart2.substring(0, charCount - textPart1.length);
            
            // Trigger selection at the very end
            if (progress > 0.95) {
                highlightWrapper.classList.add('is-selected');
            } else {
                highlightWrapper.classList.remove('is-selected');
            }
        }
    }

    // ==========================================
    // KINETIC SLICE ENGINE
    // ==========================================
    const kineticSection = document.querySelector('.kinetic-manifesto');
    const slices = document.querySelectorAll('.slice-layer');
    
    // Asymmetrical velocity vectors for each slice layer
    const sliceSpeeds = [-0.15, 0.25, -0.05, 0.20, -0.12];

    function handleSliceParallax() {
        if (!kineticSection || slices.length === 0) return;
        
        const rect = kineticSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (rect.top <= windowHeight && rect.bottom >= 0) {
            // Normalized progress
            const progress = (rect.top + rect.height / 2 - windowHeight / 2) / windowHeight;
            
            // Reduce intensity on mobile
            const isMobile = window.innerWidth < 768;
            const multiplier = isMobile ? 0.3 : 1; 

            slices.forEach((slice, index) => {
                const speed = (sliceSpeeds[index] || 0.1) * multiplier;
                const moveY = progress * speed * windowHeight;
                slice.style.transform = `translateY(${moveY}px)`;
            });
        }
    }

    // Connect to Lenis scroll
    lenis.on('scroll', () => {
        handleScrollReveal();
        handlePortfolioParallax();
        handleTypewriter();
        handleSliceParallax();
    });

    // Initial check
    handleTypewriter();
    handleSliceParallax();

    // ==========================================
    // EXPERIMENTAL SWITCH PHYSICS & CURIOUS OVERLAY
    // ==========================================
    const physicsSwitch = document.getElementById('physics-switch');
    const curiousSwitch = document.getElementById('curious-physics-switch');
    const curiousOverlay = document.getElementById('curious-overlay');

    function toggleSwitchState(isActive) {
        if (isActive) {
            if(physicsSwitch) physicsSwitch.classList.add('is-active');
            if(curiousSwitch) curiousSwitch.classList.add('is-active');
            if(curiousOverlay) curiousOverlay.classList.add('is-visible');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        } else {
            if(physicsSwitch) physicsSwitch.classList.remove('is-active');
            if(curiousSwitch) curiousSwitch.classList.remove('is-active');
            if(curiousOverlay) curiousOverlay.classList.remove('is-visible');
            document.body.style.overflow = '';
        }
    }

    function setupSwitch(switchEl) {
        if (!switchEl) return;
        let isDragging = false;
        let startY = 0;

        switchEl.addEventListener('click', (e) => {
            if (!isDragging) {
                toggleSwitchState(!switchEl.classList.contains('is-active'));
            }
        });

        switchEl.addEventListener('pointerdown', (e) => {
            isDragging = true;
            startY = e.clientY;
            switchEl.style.cursor = 'grabbing';
            e.preventDefault(); 
        });

        window.addEventListener('pointermove', (e) => {
            if (!isDragging) return;
            const deltaY = e.clientY - startY;

            if (deltaY > 20 && !switchEl.classList.contains('is-active')) {
                toggleSwitchState(true);
                isDragging = false;
                switchEl.style.cursor = 'pointer';
            } else if (deltaY < -20 && switchEl.classList.contains('is-active')) {
                toggleSwitchState(false);
                isDragging = false;
                switchEl.style.cursor = 'pointer';
            }
        });

        window.addEventListener('pointerup', () => {
            isDragging = false;
            switchEl.style.cursor = 'pointer';
        });
    }

    setupSwitch(physicsSwitch);
    setupSwitch(curiousSwitch);

    // ==========================================
    // KINETIC OBSERVER (Snap Typography)
    // ==========================================
    const goodDesignSection = document.getElementById('good-design');
    if (goodDesignSection) {
        const gdObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                } else {
                    // Remove to re-trigger the pop effect on every scroll
                    entry.target.classList.remove('is-revealed');
                }
            });
        }, {
            threshold: 0.35 // Triggers when 35% of the white block is visible
        });
        
        gdObserver.observe(goodDesignSection);
    }

    // ==========================================
    // LANGUAGE SELECTOR & i18N LOGIC
    // ==========================================
    const monopoLangTrigger = document.getElementById('monopo-lang-trigger');
    const langActiveEl = document.getElementById('lang-active');
    const langNextEl = document.getElementById('lang-next');
    const langStack = document.querySelector('.lang-stack');
    
    const mobileLangOptions = document.querySelectorAll('.mobile-lang-wrap span:not(.active)');
    const mobileActiveLang = document.querySelector('.mobile-lang-wrap .active');
    
    const langCycle = [
        { code: 'ES', label: 'ESPAÑOL' },
        { code: 'EN', label: 'ENGLISH' },
        { code: 'FR', label: 'FRANÇAIS' },
        { code: 'AL', label: 'DEUTSCH' }
    ];
    let currentLangIndex = 0;

    const translations = {
        ES: {
            navWork: "TRABAJO", navService: "SERVICIOS", navAbout: "NOSOTROS", navContact: "Contáctanos",
            mobileContact: "CONTACTO", explore: "Explora Agence Aura",
            // Hero Typo
            introP1: "PARA <span class='text-purple'>MARCAS</span>", introC: "C", introN: "N UNA",
            introS1: "Que hacen", introS2: "cosas que", introS3: "cambian las cosas",
            introM: "MISIÓN <span class='text-purple mission-arrow'><i class='fa-solid fa-arrow-down'></i></span>",
            mani: "Sueña.<br>Crea.<br>Inspira.", switchLbl: "BOTÓN", curiousMsg: "Si sos curioso, no dudes en trabajar con nosotros.", switchBack: "VOLVER A LA PÁGINA",
            gd1: "EL BUEN", gd2: "DISEÑO", gd3: "ES BUEN", gd4: "NEGOCIO*",
            type1: "TU MARCA MERECE UNA ", type2: "AGENCIA CREATIVA",
            p1T: "BRANDING & IDENTITY", p1D: "Creamos identidades visuales que trascienden el tiempo.", p1B: "Ver Detalles →",
            p2T: "UI/UX DESIGN", p2D: "Interfaces intuitivas diseñadas para la conversión.", p2B: "Ver Detalles →",
            p3T: "WEB DEVELOPMENT", p3D: "Código de alto rendimiento con tecnologías modernas.", p3B: "Ver Detalles →",
            p4T: "DIGITAL STRATEGY", p4D: "Crecimiento escalable basado en datos reales.", p4B: "Ver Detalles →",
            fHead: "Hablemos de tu próximo movimiento.", fEmailPh: "Correo electrónico", fSubmit: "Enviar",
            fCol2: "Correo Electrónico", fCol3: "Legales", fPriv: "Privacidad", fAcc: "Accesibilidad", fTerm: "Términos Legales", fCook:"Cookies",
            fCol4: "Contacto", fCH: "Suiza (CH)", fAR: "Argentina (AR)",
            fCopy: "Copyright © 2026 Agence Aura. Todos los derechos reservados.", fTop: "Subir ↑",
            mSpecs: "Especificaciones Técnicas", mBadge: "PROYECTO SELECCIONADO: AGENCIA AURA v1.0", mSheet: "FICHA TÉCNICA", mInquire: "CONSULTAR"
        },
        EN: {
            navWork: "WORK", navService: "SERVICE", navAbout: "ABOUT US", navContact: "Contact us",
            mobileContact: "CONTACT", explore: "Explore Agence Aura",
            // Hero Typo
            introP1: "FOR <span class='text-purple'>BRANDS</span>", introC: "", introN: "N A",
            introS1: "Do Things", introS2: "That", introS3: "Change Things",
            introM: "MISSION <span class='text-purple mission-arrow'><i class='fa-solid fa-arrow-down'></i></span>",
            mani: "Dream.<br>Create.<br>Inspire.", switchLbl: "BUTTON", curiousMsg: "If you are curious, don't hesitate to work with us.", switchBack: "RETURN TO PAGE",
            gd1: "GOOD", gd2: "DESIGN", gd3: "IS GOOD", gd4: "BUSINESS*",
            type1: "YOUR BRAND DESERVES A ", type2: "CREATIVE AGENCY",
            p1T: "BRANDING & IDENTITY", p1D: "We create visual identities that transcend time.", p1B: "View Details →",
            p2T: "UI/UX DESIGN", p2D: "Intuitive interfaces designed for conversion.", p2B: "View Details →",
            p3T: "WEB DEVELOPMENT", p3D: "High-performance code with modern technologies.", p3B: "View Details →",
            p4T: "DIGITAL STRATEGY", p4D: "Scalable growth based on real-world data.", p4B: "View Details →",
            fHead: "Let's talk about your next move.", fEmailPh: "Email address", fSubmit: "Submit",
            fCol2: "Email", fCol3: "Legal", fPriv: "Privacy", fAcc: "Accessibility", fTerm: "Legal Terms", fCook:"Cookies",
            fCol4: "Contact", fCH: "Switzerland (CH)", fAR: "Argentina (AR)",
            fCopy: "Copyright © 2026 Agence Aura. All rights reserved.", fTop: "Top ↑",
            mSpecs: "Technical Specifications", mBadge: "SELECTED PROJECT: AGENCE AURA v1.0", mSheet: "TECHNICAL SHEET", mInquire: "INQUIRE NOW"
        },
        FR: {
            navWork: "TRAVAIL", navService: "SERVICES", navAbout: "À PROPOS", navContact: "Contactez-nous",
            mobileContact: "CONTACT", explore: "Explorez Agence Aura",
            introP1: "POUR LES <span class='text-purple'>MARQUES</span>", introC: "", introN: "UNE",
            introS1: "Qui font", introS2: "des choses qui", introS3: "changent les choses",
            introM: "MISSION <span class='text-purple mission-arrow'><i class='fa-solid fa-arrow-down'></i></span>",
            mani: "Rêve.<br>Crée.<br>Inspire.", switchLbl: "BOUTON", curiousMsg: "Si vous êtes curieux, n'hésitez pas à travailler avec nous.", switchBack: "RETOURNER À LA PAGE",
            gd1: "LE BON", gd2: "DESIGN", gd3: "EST UNE BONNE", gd4: "AFFAIRE*",
            type1: "VOTRE MARQUE MÉRITE UNE ", type2: "AGENCE CRÉATIVE",
            p1T: "BRANDING & IDENTITÉ", p1D: "Nous créons des identités visuelles intemporelles.", p1B: "Voir les détails →",
            p2T: "DESIGN UI/UX", p2D: "Interfaces intuitives conçues pour la conversion.", p2B: "Voir les détails →",
            p3T: "DÉVELOPPEMENT WEB", p3D: "Code haute performance avec des technologies modernes.", p3B: "Voir les détails →",
            p4T: "STRATÉGIE DIGITALE", p4D: "Croissance évolutive basée sur des données réelles.", p4B: "Voir les détails →",
            fHead: "Parlons de votre prochain mouvement.", fEmailPh: "Adresse e-mail", fSubmit: "Envoyer",
            fCol2: "E-mail", fCol3: "Légal", fPriv: "Confidentialité", fAcc: "Accessibilité", fTerm: "Termes", fCook:"Cookies",
            fCol4: "Contact", fCH: "Suisse (CH)", fAR: "Argentine (AR)",
            fCopy: "Copyright © 2026 Agence Aura. Tous droits réservés.", fTop: "Haut ↑",
            mSpecs: "Spécifications Techniques", mBadge: "PROJET SÉLECTIONNÉ: AGENCE AURA v1.0", mSheet: "FICHE TECHNIQUE", mInquire: "CONSULTER"
        },
        AL: {
            navWork: "ARBEIT", navService: "DIENSTLEISTUNGEN", navAbout: "ÜBER UNS", navContact: "Kontakt",
            mobileContact: "KONTAKT", explore: "Entdecken Sie Agence Aura",
            introP1: "FÜR <span class='text-purple'>MARKEN</span>", introC: "", introN: "EINE",
            introS1: "Die Dinge", introS2: "tun, die", introS3: "Dinge verändern",
            introM: "MISSION <span class='text-purple mission-arrow'><i class='fa-solid fa-arrow-down'></i></span>",
            mani: "Träume.<br>Erschaffe.<br>Inspiriere.", switchLbl: "KNOPF", curiousMsg: "Wenn Sie neugierig sind, zögern Sie nicht, mit uns zu arbeiten.", switchBack: "ZURÜCK ZUR SEITE",
            gd1: "GUTES", gd2: "DESIGN", gd3: "IST GUTES", gd4: "GESCHÄFT*",
            type1: "IHRE MARKE VERDIENT EINE ", type2: "KREATIVAGENTUR",
            p1T: "BRANDING & IDENTITÄT", p1D: "Wir kreieren visuelle Identitäten, die die Zeit überdauern.", p1B: "Details ansehen →",
            p2T: "UI/UX DESIGN", p2D: "Intuitive Benutzeroberflächen, konzipiert für Konversion.", p2B: "Details ansehen →",
            p3T: "WEB-ENTWICKLUNG", p3D: "Hochleistungscode mit modernen Technologien.", p3B: "Details ansehen →",
            p4T: "DIGITALE STRATEGIE", p4D: "Skalierbares Wachstum basierend auf realen Daten.", p4B: "Details ansehen →",
            fHead: "Lassen Sie uns über Ihren nächsten Schritt sprechen.", fEmailPh: "E-Mail-Adresse", fSubmit: "Senden",
            fCol2: "E-Mail", fCol3: "Rechtliches", fPriv: "Datenschutz", fAcc: "Barrierefreiheit", fTerm: "Bedingungen", fCook:"Cookies",
            fCol4: "Kontakt", fCH: "Schweiz (CH)", fAR: "Argentinien (AR)",
            fCopy: "Copyright © 2026 Agence Aura. Alle Rechte vorbehalten.", fTop: "Nach oben ↑",
            mSpecs: "Technische Spezifikationen", mBadge: "AUSGEWÄHLTES PROJEKT: AGENCE AURA v1.0", mSheet: "DATENBLATT", mInquire: "ANFRAGEN"
        }
    };

    function updateLanguage(lang) {
        const t = translations[lang] || translations['ES'];

        // Desktop Nav (Updating staggered effect dataset as well)
        const navLinks = document.querySelectorAll('.nav-links .nav-link-staggered');
        if(navLinks[0]) { navLinks[0].textContent = t.navWork; navLinks[0].dataset.text = t.navWork; }
        if(navLinks[1]) { navLinks[1].textContent = t.navService; navLinks[1].dataset.text = t.navService; }
        if(navLinks[2]) { navLinks[2].textContent = t.navAbout; navLinks[2].dataset.text = t.navAbout; }
        const navCta = document.querySelector('.nav-cta-outline');
        if(navCta) navCta.textContent = t.navContact;

        // Mobile Nav
        const mLinks = document.querySelectorAll('.mobile-nav .mobile-link');
        if(mLinks[0]) mLinks[0].textContent = t.navWork;
        if(mLinks[1]) mLinks[1].textContent = t.navService;
        if(mLinks[2]) mLinks[2].textContent = t.navAbout;
        if(mLinks[3]) mLinks[3].textContent = t.mobileContact;

        // Hero Setup
        const exploreSpan = document.querySelector('.scroll-indicator span');
        if(exploreSpan) exploreSpan.textContent = t.explore;
        
        const i_p1 = document.getElementById('intro-p1'); if(i_p1) i_p1.innerHTML = t.introP1;
        const i_c = document.getElementById('intro-c'); if(i_c) i_c.textContent = t.introC;
        const i_n = document.getElementById('intro-n'); if(i_n) i_n.textContent = t.introN;
        const i_s1 = document.getElementById('intro-s1'); if(i_s1) i_s1.textContent = t.introS1;
        const i_s2 = document.getElementById('intro-s2'); if(i_s2) i_s2.textContent = t.introS2;
        const i_s3 = document.getElementById('intro-s3'); if(i_s3) i_s3.textContent = t.introS3;
        const i_m = document.getElementById('intro-m'); if(i_m) i_m.innerHTML = t.introM;

        document.querySelectorAll('.mani-text').forEach(el => el.innerHTML = t.mani);
        const sLbl = document.getElementById('switch-lbl'); if(sLbl) sLbl.textContent = t.switchLbl;

        const cMsg = document.getElementById('curious-msg'); if(cMsg) cMsg.textContent = t.curiousMsg;
        const cLbl = document.getElementById('curious-lbl'); if(cLbl) cLbl.textContent = t.switchBack;

        const g1 = document.getElementById('gd-1'); if(g1) g1.textContent = t.gd1;
        const g2 = document.getElementById('gd-2'); if(g2) g2.textContent = t.gd2;
        const g3 = document.getElementById('gd-3'); if(g3) g3.textContent = t.gd3;
        const g4 = document.getElementById('gd-4'); if(g4) g4.textContent = t.gd4;

        // Reset Typewriter Text
        textPart1 = t.type1;
        textPart2 = t.type2;
        fullText = textPart1 + textPart2;
        if(typeof handleTypewriter === 'function') handleTypewriter();

        // Portfolio Grid
        const pItems = document.querySelectorAll('.portfolio-flex-item');
        if(pItems[0]) { pItems[0].querySelector('.flex-title').textContent = t.p1T; pItems[0].querySelector('.flex-description').textContent = t.p1D; pItems[0].querySelector('.flex-btn').textContent = t.p1B; }
        if(pItems[1]) { pItems[1].querySelector('.flex-title').textContent = t.p2T; pItems[1].querySelector('.flex-description').textContent = t.p2D; pItems[1].querySelector('.flex-btn').textContent = t.p2B; }
        if(pItems[2]) { pItems[2].querySelector('.flex-title').textContent = t.p3T; pItems[2].querySelector('.flex-description').textContent = t.p3D; pItems[2].querySelector('.flex-btn').textContent = t.p3B; }
        if(pItems[3]) { pItems[3].querySelector('.flex-title').textContent = t.p4T; pItems[3].querySelector('.flex-description').textContent = t.p4D; pItems[3].querySelector('.flex-btn').textContent = t.p4B; }

        // Footer
        const fHead = document.querySelector('.footer-headline'); if(fHead) fHead.textContent = t.fHead;
        const fInput = document.querySelector('.footer-input'); if(fInput) fInput.placeholder = t.fEmailPh;
        const fSubmit = document.querySelector('.footer-submit'); if(fSubmit) fSubmit.textContent = t.fSubmit;
        
        const fCols = document.querySelectorAll('.footer-col');
        if(fCols[1]) fCols[1].querySelector('.footer-label').textContent = t.fCol2;
        if(fCols[2]) {
            fCols[2].querySelector('.footer-label').textContent = t.fCol3;
            const fLinks = fCols[2].querySelectorAll('li a');
            if(fLinks[0]) fLinks[0].textContent = t.fPriv;
            if(fLinks[1]) fLinks[1].textContent = t.fAcc;
            if(fLinks[2]) fLinks[2].textContent = t.fTerm;
            if(fLinks[3]) fLinks[3].textContent = t.fCook;
        }
        if(fCols[3]) {
            fCols[3].querySelector('.footer-label').textContent = t.fCol4;
            const regions = fCols[3].querySelectorAll('.region-label');
            if(regions[0]) regions[0].textContent = t.fCH;
            if(regions[1]) regions[1].textContent = t.fAR;
        }
        const fCopy = document.querySelector('.copyright'); if(fCopy) fCopy.textContent = t.fCopy;
        const fTop = document.querySelector('.back-to-top'); if(fTop) fTop.textContent = t.fTop;

        // Modal Statics
        const modSpecs = document.querySelector('.specs-title'); if(modSpecs) modSpecs.textContent = t.mSpecs;
        const modBadge = document.querySelector('.modal-project-badge'); if(modBadge) modBadge.textContent = t.mBadge;
        const modBtns = document.querySelectorAll('.modal-btn');
        if(modBtns[0]) modBtns[0].textContent = t.mSheet;
        if(modBtns[1]) modBtns[1].textContent = t.mInquire;

        // Also switch the modal data dictionary language state:
        window.currentAppLanguage = lang;
    }

    const switchLanguage = (newLangCode) => {
        if (!['EN', 'ES', 'FR', 'AL'].includes(newLangCode)) return;
        
        if(mobileActiveLang) mobileActiveLang.textContent = newLangCode;
        
        // Execute Translation
        updateLanguage(newLangCode);
    };

    if (monopoLangTrigger) {
        monopoLangTrigger.addEventListener('click', () => {
            if (langStack.classList.contains('is-switching')) return;
            
            // Start animation
            langStack.classList.add('is-switching');
            
            setTimeout(() => {
                // Update Index
                currentLangIndex = (currentLangIndex + 1) % langCycle.length;
                const nextIndex = (currentLangIndex + 1) % langCycle.length;
                
                const activeLang = langCycle[currentLangIndex];
                const nextLang = langCycle[nextIndex];
                
                // Update text
                langActiveEl.textContent = activeLang.label;
                langNextEl.textContent = nextLang.label;
                
                // Disable transition to reset instantly
                langActiveEl.style.transition = 'none';
                langNextEl.style.transition = 'none';
                
                langStack.classList.remove('is-switching');
                
                // Force reflow
                void langStack.offsetWidth;
                
                // Restore transition
                langActiveEl.style.transition = '';
                langNextEl.style.transition = '';
                
                // Switch content
                switchLanguage(activeLang.code);
            }, 400); // Matches CSS transition duration
        });
    }

    // Listeners for Mobile Interface
    mobileLangOptions.forEach(option => {
        option.addEventListener('click', () => {
             switchLanguage(option.textContent.trim());
        });
    });


    // ==========================================
    // MOBILE MENU LOGIC
    // ==========================================
    const burgerTrigger = document.getElementById('burger-trigger');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (burgerTrigger && mobileMenu) {
        burgerTrigger.addEventListener('click', () => {
            burgerTrigger.classList.toggle('is-active');
            mobileMenu.classList.toggle('is-active');
            
            // Lock/Unlock scroll
            if (mobileMenu.classList.contains('is-active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close menu on link click
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                burgerTrigger.classList.remove('is-active');
                mobileMenu.classList.remove('is-active');
                document.body.style.overflow = '';
            });
        });
    }

    // ==========================================
    // PORTFOLIO MODAL LOGIC & DATA
    // ==========================================
    const portfolioData = {
        ES: {
            branding: {
                title: "Branding & Identity",
                tagline: "Identidades visuales que trascienden el tiempo.",
                image: "https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=1500&auto=format&fit=crop",
                specs: [
                    "<strong>Entrega:</strong> Manual de marca completo (PDF Interactivo).",
                    "<strong>Timeline:</strong> 3 a 5 semanas.",
                    "<strong>Formatos:</strong> Vectorial, Web, Print & Motion."
                ],
                description: "Diseñamos el ADN de tu marca. Desde la creación de logotipos minimalistas hasta la arquitectura visual completa, como lo hicimos para el lanzamiento de FLOT BURGER, asegurando que cada punto de contacto respire profesionalismo."
            },
            uiux: {
                title: "UI/UX Design",
                tagline: "Interfaces intuitivas diseñadas para la conversión.",
                image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1500&auto=format&fit=crop",
                specs: [
                    "<strong>Herramientas:</strong> Figma / Adobe XD / Prototipado.",
                    "<strong>Metodología:</strong> User-Centric Design & Testing.",
                    "<strong>Resultado:</strong> Prototipo 100% interactivo."
                ],
                description: "Creamos experiencias digitales fluidas. Nos enfocamos en la jerarquía visual y la psicología del color para que tu producto no solo sea estético, sino funcional, optimizando flujos de trabajo complejos como el dashboard de gestión de BioMatch."
            },
            webdev: {
                title: "Web Development",
                tagline: "Código de alto rendimiento con tecnologías modernas.",
                image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1500&auto=format&fit=crop",
                specs: [
                    "<strong>Stack:</strong> Flutter Web / Next.js.",
                    "<strong>Backend:</strong> Supabase (Realtime Database & Auth).",
                    "<strong>Performance:</strong> 95+ Score en Google Lighthouse."
                ],
                description: "Desarrollamos plataformas web robustas y escalables. Especialistas en Progressive Web Apps (PWA) para asegurar que tu sitio funcione sin conexión y con tiempos de carga mínimos, garantizando una experiencia inmersiva para el usuario."
            },
            strategy: {
                title: "Digital Strategy",
                tagline: "Crecimiento escalable basado en datos reales.",
                image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1500&auto=format&fit=crop",
                specs: [
                    "<strong>Canales:</strong> LinkedIn Ads, Meta ADS, Google Search.",
                    "<strong>Enfoque:</strong> ROI & Growth Consulting.",
                    "<strong>Reportes:</strong> Dashboards personalizados."
                ],
                description: "Potenciamos tu presencia digital mediante pauta estratégica y posicionamiento de marca. Analizamos el comportamiento de tu audiencia en Misiones y el mundo para captar leads de alta calidad y maximizar tu inversión publicitaria."
            }
        },
        EN: {
            branding: {
                title: "Branding & Identity",
                tagline: "Visual identities that transcend time.",
                image: "https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=1500&auto=format&fit=crop",
                specs: [
                    "<strong>Delivery:</strong> Complete brand manual (Interactive PDF).",
                    "<strong>Timeline:</strong> 3 to 5 weeks.",
                    "<strong>Formats:</strong> Vector, Web, Print & Motion."
                ],
                description: "We design the DNA of your brand. From minimalist logo creation to complete visual architecture, just as we did for the launch of FLOT BURGER, ensuring every touchpoint breathes professionalism."
            },
            uiux: {
                title: "UI/UX Design",
                tagline: "Intuitive interfaces designed for conversion.",
                image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1500&auto=format&fit=crop",
                specs: [
                    "<strong>Tools:</strong> Figma / Adobe XD / High-fidelity prototyping.",
                    "<strong>Methodology:</strong> User-Centric Design & Testing.",
                    "<strong>Result:</strong> 100% interactive prototype."
                ],
                description: "We create fluid digital experiences. We focus on visual hierarchy and color psychology so your product is not just aesthetic but functional, optimizing complex workflows like the BioMatch management dashboard."
            },
            webdev: {
                title: "Web Development",
                tagline: "High-performance code with modern technologies.",
                image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1500&auto=format&fit=crop",
                specs: [
                    "<strong>Stack:</strong> Flutter Web / Next.js.",
                    "<strong>Backend:</strong> Supabase (Realtime Database & Auth).",
                    "<strong>Performance:</strong> 95+ Score on Google Lighthouse."
                ],
                description: "We develop robust and scalable web platforms. Specialists in Progressive Web Apps (PWA) to ensure your site works offline with minimal load times, guaranteeing an immersive user experience."
            },
            strategy: {
                title: "Digital Strategy",
                tagline: "Scalable growth based on real-world data.",
                image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1500&auto=format&fit=crop",
                specs: [
                    "<strong>Channels:</strong> LinkedIn Ads, Meta ADS, Google Search.",
                    "<strong>Focus:</strong> ROI & Growth Consulting.",
                    "<strong>Reporting:</strong> Custom real-time dashboards."
                ],
                description: "We boost your digital presence through strategic media buying and brand positioning. We analyze your audience's behavior worldwide to capture high-quality leads and maximize your advertising investment."
            }
        },
        FR: {
            branding: {
                title: "Branding & Identité",
                tagline: "Des identités visuelles qui transcendent le temps.",
                image: "https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=1500&auto=format&fit=crop",
                specs: [
                    "<strong>Livrable:</strong> Manuel de marque complet (PDF Interactif).",
                    "<strong>Délai:</strong> 3 à 5 semaines.",
                    "<strong>Formats:</strong> Vectoriel, Web, Print & Motion."
                ],
                description: "Nous concevons l'ADN de votre marque. De la création de logos minimalistes à l'architecture visuelle complète, comme nous l'avons fait pour le lancement de FLOT BURGER, en veillant à ce que chaque point de contact respire le professionnalisme."
            },
            uiux: {
                title: "Design UI/UX",
                tagline: "Interfaces intuitives conçues pour la conversion.",
                image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1500&auto=format&fit=crop",
                specs: [
                    "<strong>Outils:</strong> Figma / Adobe XD / Prototypage haute fidélité.",
                    "<strong>Méthodologie:</strong> User-Centric Design & Testing.",
                    "<strong>Résultat:</strong> Prototype 100% interactif."
                ],
                description: "Nous créons des expériences numériques fluides. Nous nous concentrons sur la hiérarchie visuelle et la psychologie des couleurs pour que votre produit soit non seulement esthétique mais fonctionnel, en optimisant des flux de travail complexes comme le tableau de bord de BioMatch."
            },
            webdev: {
                title: "Développement Web",
                tagline: "Code haute performance avec des technologies modernes.",
                image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1500&auto=format&fit=crop",
                specs: [
                    "<strong>Stack:</strong> Flutter Web / Next.js.",
                    "<strong>Backend:</strong> Supabase (Realtime Database & Auth).",
                    "<strong>Performance:</strong> Score de 95+ sur Google Lighthouse."
                ],
                description: "Nous développons des plateformes web robustes et évolutives. Spécialistes des applications web progressives (PWA) pour garantir que votre site fonctionne hors ligne avec des temps de chargement minimaux, assurant une expérience immersive."
            },
            strategy: {
                title: "Stratégie Digitale",
                tagline: "Croissance évolutive basée sur des données réelles.",
                image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1500&auto=format&fit=crop",
                specs: [
                    "<strong>Canaux:</strong> LinkedIn Ads, Meta ADS, Google Search.",
                    "<strong>Focus:</strong> Consulting ROI & Croissance.",
                    "<strong>Rapports:</strong> Tableaux de bord personnalisés."
                ],
                description: "Nous boostons votre présence numérique grâce à des campagnes stratégiques et au positionnement de la marque. Nous analysons le comportement de votre audience dans le monde entier pour capturer des prospects de haute qualité et maximiser votre investissement publicitaire."
            }
        },
        AL: {
            branding: {
                title: "Branding & Identität",
                tagline: "Visuelle Identitäten, die die Zeit überdauern.",
                image: "https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=1500&auto=format&fit=crop",
                specs: [
                    "<strong>Lieferung:</strong> Komplettes Markenhandbuch (Interaktives PDF).",
                    "<strong>Zeitrahmen:</strong> 3 bis 5 Wochen.",
                    "<strong>Formate:</strong> Vektor, Web, Print & Motion."
                ],
                description: "Wir entwerfen die DNA Ihrer Marke. Von der Kreation minimalistischer Logos bis hin zur kompletten visuellen Architektur, genau wie beim Start von FLOT BURGER, und stellen sicher, dass jeder Kontaktpunkt Professionalität ausstrahlt."
            },
            uiux: {
                title: "UI/UX Design",
                tagline: "Intuitive Benutzeroberflächen, konzipiert für Konversion.",
                image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1500&auto=format&fit=crop",
                specs: [
                    "<strong>Werkzeuge:</strong> Figma / Adobe XD / Prototyping.",
                    "<strong>Methodik:</strong> Nutzerzentriertes Design & Testing.",
                    "<strong>Ergebnis:</strong> 100% interaktiver Prototyp."
                ],
                description: "Wir schaffen fließende digitale Erlebnisse. Unser Fokus liegt auf visueller Hierarchie und Farbpsychologie, damit Ihr Produkt nicht nur ästhetisch, sondern auch funktional ist und komplexe Workflows wie das BioMatch-Dashboard optimiert werden."
            },
            webdev: {
                title: "Web-Entwicklung",
                tagline: "Hochleistungscode mit modernen Technologien.",
                image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1500&auto=format&fit=crop",
                specs: [
                    "<strong>Stack:</strong> Flutter Web / Next.js.",
                    "<strong>Backend:</strong> Supabase (Echtzeit-Datenbank & Auth).",
                    "<strong>Performance:</strong> 95+ Score bei Google Lighthouse."
                ],
                description: "Wir entwickeln robuste und skalierbare Webplattformen. Wir sind Spezialisten für Progressive Web Apps (PWA), um sicherzustellen, dass Ihre Website mit minimalen Ladezeiten auch offline funktioniert und ein immersives Erlebnis bietet."
            },
            strategy: {
                title: "Digitale Strategie",
                tagline: "Skalierbares Wachstum basierend auf realen Daten.",
                image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1500&auto=format&fit=crop",
                specs: [
                    "<strong>Kanäle:</strong> LinkedIn Ads, Meta ADS, Google Search.",
                    "<strong>Fokus:</strong> ROI & Growth Consulting.",
                    "<strong>Berichte:</strong> Maßgeschneiderte Dashboards."
                ],
                description: "Wir stärken Ihre digitale Präsenz durch strategische Werbung und Markenpositionierung. Wir analysieren das Verhalten Ihrer Zielgruppe weltweit, um hochwertige Leads zu generieren und Ihre Werbeinvestitionen zu maximieren."
            }
        }
    };

    const modalWrapper = document.getElementById('portfolio-modal');
    const modalCloseBtn = document.getElementById('modal-close');
    const modalBg = document.getElementById('modal-bg-image');
    
    // Content endpoints
    const mTitle = document.getElementById('modal-title');
    const mTagline = document.getElementById('modal-tagline');
    const mSpecs = document.getElementById('modal-specs');
    const mDesc = document.getElementById('modal-desc');

    const openModal = (projectId) => {
        const lang = window.currentAppLanguage || 'ES';
        const data = portfolioData[lang] ? portfolioData[lang][projectId] : portfolioData['ES'][projectId];
        if(!data) return;

        // Populate Data
        mTitle.textContent = data.title;
        mTagline.textContent = data.tagline;
        modalBg.style.backgroundImage = `url('${data.image}')`;
        mDesc.innerHTML = data.description;
        
        mSpecs.innerHTML = '';
        data.specs.forEach(spec => {
            const li = document.createElement('li');
            li.innerHTML = spec;
            mSpecs.appendChild(li);
        });

        // Show Modal
        modalWrapper.classList.add('is-active');
        document.body.style.overflow = 'hidden'; // lock background scroll

        // Suspend lenis scroll if required
        if(typeof lenis !== 'undefined') lenis.stop();
    };

    const closeModal = () => {
        modalWrapper.classList.remove('is-active');
        document.body.style.overflow = '';
        if(typeof lenis !== 'undefined') lenis.start();
    };

    if(modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }
    
    const portfolioItems = document.querySelectorAll('.portfolio-flex-item');
    portfolioItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const projectId = this.dataset.project;

            if (window.innerWidth <= 768) {
                if (!this.classList.contains('mobile-active')) {
                    portfolioItems.forEach(other => {
                        if (other !== this) other.classList.remove('mobile-active');
                    });
                    this.classList.add('mobile-active');
                } else {
                    openModal(projectId); // Second tap opens
                }
            } else {
                openModal(projectId); // First click opens on desktop
            }
        });
    });
});
