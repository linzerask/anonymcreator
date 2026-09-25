// components.js - Global Header and Footer Injection

const headerHTML = `
    <header class="site-header">
        <div class="header-inner">
            <a href="index.html" class="logo">
                <img src="Assets/2.webp" alt="AnonymCreator Logo">
                <span class="logo-text"><span class="logo-anonym">ANONYM</span><span class="logo-creator">CREATOR</span></span>
            </a>
            <nav class="desktop-nav">
                <ul class="nav-menu">
                    <li><a href="leistungen.html" class="nav-link">Leistungen</a></li>
                    <li><a href="projekte.html" class="nav-link">Projekte</a></li>
                    <li><a href="preise.html" class="nav-link">Preise</a></li>
                    <li><a href="agentur.html" class="nav-link">Agentur</a></li>
                    <li><a href="kontakt.html" class="nav-link">Kontakt</a></li>
                    <li class="mobile-cta-item" style="margin-top: 1.5rem; width: 100%;">
                        <a href="preise.html" class="btn-primary" style="width: 100%; justify-content: center; font-size: 1.2rem; padding: 1.2rem;">Projekt starten</a>
                    </li>
                    <li class="lang-dropdown-container">
                        <div class="lang-dropdown">
                            <div class="lang-globe-icon icon-globe">
                                <div class="globe-ring horizontal"></div>
                                <div class="globe-ring vertical"></div>
                                <div class="globe-ring diagonal"></div>
                            </div>
                            <div class="lang-dropdown-content">
                                <a href="javascript:void(0)" onclick="const fn = window.location.pathname.split('/').pop() || 'index.html'; window.location.href = window.location.protocol === 'file:' ? fn : '/' + fn;" title="Deutsch"><img src="Assets/de-flag.svg" alt="DE"> <span>Deutsch</span></a>
                                <a href="javascript:void(0)" onclick="const fn = window.location.pathname.split('/').pop() || 'index.html'; window.location.href = window.location.protocol === 'file:' ? 'en/' + fn : '/en/' + fn;" title="English"><img src="Assets/en-flag.svg" alt="EN"> <span>English</span></a>
                                <a href="javascript:void(0)" onclick="const fn = window.location.pathname.split('/').pop() || 'index.html'; window.location.href = window.location.protocol === 'file:' ? 'ro/' + fn : '/ro/' + fn;" title="Română"><img src="Assets/ro-flag.svg" alt="RO"> <span>Română</span></a>
                            </div>
                        </div>
                    </li>
                </ul>
            </nav>
            <div class="header-right">
                <div class="lang-dropdown desktop-lang-dropdown">
                    <div class="lang-globe-icon icon-globe">
                        <div class="globe-ring horizontal"></div>
                        <div class="globe-ring vertical"></div>
                        <div class="globe-ring diagonal"></div>
                    </div>
                    <div class="lang-dropdown-content">
                        <a href="javascript:void(0)" onclick="const fn = window.location.pathname.split('/').pop() || 'index.html'; window.location.href = window.location.protocol === 'file:' ? fn : '/' + fn;" title="Deutsch"><img src="Assets/de-flag.svg" alt="DE"> <span>Deutsch</span></a>
                        <a href="javascript:void(0)" onclick="const fn = window.location.pathname.split('/').pop() || 'index.html'; window.location.href = window.location.protocol === 'file:' ? 'en/' + fn : '/en/' + fn;" title="English"><img src="Assets/en-flag.svg" alt="EN"> <span>English</span></a>
                        <a href="javascript:void(0)" onclick="const fn = window.location.pathname.split('/').pop() || 'index.html'; window.location.href = window.location.protocol === 'file:' ? 'ro/' + fn : '/ro/' + fn;" title="Română"><img src="Assets/ro-flag.svg" alt="RO"> <span>Română</span></a>
                    </div>
                </div>
                <a href="preise.html" class="btn-primary">Projekt starten</a>
                <button class="mobile-toggle" aria-label="Menü öffnen">
                    <span class="line"></span>
                    <span class="line"></span>
                    <span class="line"></span>
                </button>
            </div>
        </div>
    </header>
`;

const footerHTML = `
    <footer class="site-footer">
        <div class="container">
            <!-- Global Footer Slogan -->
            <div class="global-slogan" style="padding: 4rem 0; border-top: 1px solid rgba(255,255,255,0.05);">
                <h2 class="skills-heading reveal-on-scroll" style="font-size: clamp(1.8rem, 3.5vw, 2.5rem); font-weight: 500; margin: 0; letter-spacing: -0.02em; text-align: center;">
                    Die <span class="accent">digitale Werbeagentur</span> aus Linz-Land, Österreich.
                </h2>
            </div>

            <div class="footer-bottom">
                <div class="footer-col">
                    <img src="Assets/2.webp" alt="Logo" class="footer-logo" style="height: 60px; margin-bottom: 1rem;">
                    <p><strong>AnonymCreator - Digitalstudio</strong><br>Cosmin-Cristian Văduva<br>Carl-Anton-Carlone-Straße 7, Tür 6<br>4052 Ansfelden, Österreich</p>
                </div>
                <div class="footer-col">
                    <h4>Navigation</h4>
                    <ul>
                        <li><a href="leistungen.html">Leistungen</a></li>
                        <li><a href="projekte.html">Projekte</a></li>
                        <li><a href="preise.html">Preise</a></li>
                        <li><a href="agentur.html">Agentur</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Rechtliches</h4>
                    <ul>
                        <li><a href="agb.html">AGB</a></li>
                        <li><a href="impressum.html">Impressum</a></li>
                        <li><a href="datenschutz.html">Datenschutz</a></li>
                    </ul>
                </div>
            </div>
            
            <!-- Copyright Section -->
            <div style="text-align: center; margin-top: 3rem; padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.05); color: rgba(255,255,255,0.5); font-size: 0.9rem;">
                &copy; <span id="current-year"></span> AnonymCreator - Digitalstudio. Alle Rechte vorbehalten.
            </div>
        </div>
    </footer>
`;

document.addEventListener("DOMContentLoaded", () => {
    // Inject Google Analytics
    const gaScript1 = document.createElement('script');
    gaScript1.async = true;
    gaScript1.src = 'https://www.googletagmanager.com/gtag/js?id=G-W3JZM9ZB3V';
    document.head.appendChild(gaScript1);

    const gaScript2 = document.createElement('script');
    gaScript2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-W3JZM9ZB3V');
    `;
    document.head.appendChild(gaScript2);

    // Inject Background Shapes
    const bgContainer = document.createElement('div');
    bgContainer.innerHTML = `
        <div class="bg-shapes-container">
            <div class="bg-parallax-wrapper">
                <div class="bg-shape shape-1"></div>
                <div class="bg-shape shape-2"></div>
                <div class="bg-shape shape-3"></div>
                <div class="bg-shape shape-4"></div>
                <div class="bg-shape shape-5"></div>
            </div>
        </div>
    `;
    document.body.prepend(bgContainer);

    // Inject Header
    const headerPlaceholder = document.getElementById("header-placeholder");
    if (headerPlaceholder) {
        headerPlaceholder.innerHTML = headerHTML;
    }

    // Inject Footer
    const footerPlaceholder = document.getElementById("footer-placeholder");
    if (footerPlaceholder) {
        footerPlaceholder.innerHTML = footerHTML;
        
        // Set current year
        const yearSpan = document.getElementById('current-year');
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }
    }

    // Initialize Mobile Menu Logic (After injection)
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            // Toggle hamburger animation class if needed
            mobileToggle.classList.toggle('open');
        });
    }

    // Active state mapping
    const currentPath = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.style.color = 'var(--accent-color)';
        }
    });

    // Language Dropdown Click Logic for Mobile/Touch
    document.querySelectorAll('.lang-globe-icon').forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.stopPropagation();
            const dropdown = icon.closest('.lang-dropdown');
            dropdown.classList.toggle('active');
        });
    });
    document.addEventListener('click', () => {
        document.querySelectorAll('.lang-dropdown').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    });

    // Geolocation Script Logic
    if (!localStorage.getItem('geoPromptShown') && !window.location.pathname.startsWith('/en') && !window.location.pathname.startsWith('/ro')) {
        fetch('https://ipapi.co/json/')
            .then(res => res.json())
            .then(data => {
                const dachCountries = ['AT', 'DE', 'CH'];
                if (data.country_code && !dachCountries.includes(data.country_code)) {
                    showGeoPopup();
                }
            })
            .catch(err => console.error('Geo IP fetch failed', err));
    }

    function showGeoPopup() {
        const overlay = document.createElement('div');
        overlay.id = 'geo-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        overlay.style.backdropFilter = 'blur(10px)';
        overlay.style.zIndex = '99999';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';

        const popup = document.createElement('div');
        popup.style.background = 'rgba(255, 255, 255, 0.05)';
        popup.style.border = '1px solid rgba(255, 255, 255, 0.1)';
        popup.style.borderRadius = '20px';
        popup.style.padding = '3rem 2rem';
        popup.style.maxWidth = '450px';
        popup.style.width = '90%';
        popup.style.textAlign = 'center';
        popup.style.backdropFilter = 'blur(20px)';
        popup.style.boxShadow = '0 25px 50px rgba(0,0,0,0.5)';
        popup.style.fontFamily = 'Inter, sans-serif';

        popup.innerHTML = `
            <div style="font-size: 3.5rem; margin-bottom: 1.5rem; filter: drop-shadow(0 4px 10px rgba(0,0,0,0.3));"><img src="Assets/en-flag.svg" style="width: 48px; border-radius: 4px;"></div>
            <h3 style="color: #fff; margin-bottom: 1rem; font-size: 1.8rem; font-weight: 600;">View in English?</h3>
            <p style="color: rgba(255,255,255,0.7); margin-bottom: 2.5rem; line-height: 1.6; font-size: 1.05rem;">It looks like you are visiting from outside the DACH region. Would you like to switch to the English version of this site?</p>
            <div style="display: flex; gap: 1rem; justify-content: center; flex-direction: column;">
                <button id="btn-geo-yes" class="btn-primary" style="justify-content: center; width: 100%; font-size: 1.1rem; padding: 1rem;">Yes, switch to English</button>
                <button id="btn-geo-no" style="background: transparent; border: 1px solid rgba(255,255,255,0.2); color: rgba(255,255,255,0.8); padding: 1rem; border-radius: 50px; cursor: pointer; transition: all 0.3s; font-size: 1.1rem; font-weight: 500;" onmouseover="this.style.background='rgba(255,255,255,0.05)'; this.style.color='#fff';" onmouseout="this.style.background='transparent'; this.style.color='rgba(255,255,255,0.8)';">No, stay in German</button>
            </div>
        `;

        overlay.appendChild(popup);
        document.body.appendChild(overlay);

        document.getElementById('btn-geo-yes').addEventListener('click', () => {
            localStorage.setItem('geoPromptShown', 'true');
            const fn = window.location.pathname.split('/').pop() || 'index.html';
            window.location.href = window.location.protocol === 'file:' ? 'en/' + fn : '/en/' + fn;
        });

        document.getElementById('btn-geo-no').addEventListener('click', () => {
            localStorage.setItem('geoPromptShown', 'true');
            overlay.style.opacity = '0';
            overlay.style.transition = 'opacity 0.4s ease';
            setTimeout(() => overlay.remove(), 400);
        });
    }
});
