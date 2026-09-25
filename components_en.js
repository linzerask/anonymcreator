// components_en.js - Global Header and Footer Injection for English site

const headerHTML = `
    <header class="site-header">
        <div class="header-inner">
            <a href="index.html" class="logo">
                <img src="../Assets/2.webp" alt="AnonymCreator Logo">
                <span class="logo-text"><span class="logo-anonym">ANONYM</span><span class="logo-creator">CREATOR</span></span>
            </a>
            <nav class="desktop-nav">
                <ul class="nav-menu">
                    <li><a href="leistungen.html" class="nav-link">Services</a></li>
                    <li><a href="projekte.html" class="nav-link">Projects</a></li>
                    <li><a href="preise.html" class="nav-link">Pricing</a></li>
                    <li><a href="agentur.html" class="nav-link">Agency</a></li>
                    <li><a href="kontakt.html" class="nav-link">Contact</a></li>
                    <li class="mobile-cta-item" style="margin-top: 1.5rem; width: 100%;">
                        <a href="preise.html" class="btn-primary" style="width: 100%; justify-content: center; font-size: 1.2rem; padding: 1.2rem;">Start a Project</a>
                    </li>
                    <li class="lang-dropdown-container">
                        <div class="lang-dropdown">
                            <div class="lang-globe-icon icon-globe">
                                <div class="globe-ring horizontal"></div>
                                <div class="globe-ring vertical"></div>
                                <div class="globe-ring diagonal"></div>
                            </div>
                            <div class="lang-dropdown-content">
                                <a href="javascript:void(0)" onclick="const fn = window.location.pathname.split('/').pop() || 'index.html'; window.location.href = window.location.protocol === 'file:' ? '../' + fn : '/' + fn;" title="Deutsch"><img src="../Assets/de-flag.svg" alt="DE"> <span>Deutsch</span></a>
                                <a href="javascript:void(0)" onclick="const fn = window.location.pathname.split('/').pop() || 'index.html'; window.location.href = window.location.protocol === 'file:' ? fn : '/en/' + fn;" title="English"><img src="../Assets/en-flag.svg" alt="EN"> <span>English</span></a>
                                <a href="javascript:void(0)" onclick="const fn = window.location.pathname.split('/').pop() || 'index.html'; window.location.href = window.location.protocol === 'file:' ? '../ro/' + fn : '/ro/' + fn;" title="Română"><img src="../Assets/ro-flag.svg" alt="RO"> <span>Română</span></a>
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
                        <a href="javascript:void(0)" onclick="const fn = window.location.pathname.split('/').pop() || 'index.html'; window.location.href = window.location.protocol === 'file:' ? '../' + fn : '/' + fn;" title="Deutsch"><img src="../Assets/de-flag.svg" alt="DE"> <span>Deutsch</span></a>
                        <a href="javascript:void(0)" onclick="const fn = window.location.pathname.split('/').pop() || 'index.html'; window.location.href = window.location.protocol === 'file:' ? fn : '/en/' + fn;" title="English"><img src="../Assets/en-flag.svg" alt="EN"> <span>English</span></a>
                        <a href="javascript:void(0)" onclick="const fn = window.location.pathname.split('/').pop() || 'index.html'; window.location.href = window.location.protocol === 'file:' ? '../ro/' + fn : '/ro/' + fn;" title="Română"><img src="../Assets/ro-flag.svg" alt="RO"> <span>Română</span></a>
                    </div>
                </div>
                <a href="preise.html" class="btn-primary">Start a Project</a>
                <button class="mobile-toggle" aria-label="Open Menu">
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
                    The <span class="accent">digital advertising agency</span> from Linz-Land, Austria.
                </h2>
            </div>

            <div class="footer-bottom">
                <div class="footer-col">
                    <img src="../Assets/2.webp" alt="Logo" class="footer-logo" style="height: 60px; margin-bottom: 1rem;">
                    <p><strong>AnonymCreator - Digitalstudio</strong><br>Cosmin-Cristian Văduva<br>Carl-Anton-Carlone-Straße 7, Tür 6<br>4052 Ansfelden, Austria</p>
                </div>
                <div class="footer-col">
                    <h4>Navigation</h4>
                    <ul>
                        <li><a href="leistungen.html">Services</a></li>
                        <li><a href="projekte.html">Projects</a></li>
                        <li><a href="preise.html">Pricing</a></li>
                        <li><a href="agentur.html">Agency</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Legal</h4>
                    <ul>
                        <li><a href="agb.html">Terms & Conditions</a></li>
                        <li><a href="impressum.html">Imprint</a></li>
                        <li><a href="datenschutz.html">Privacy Policy</a></li>
                    </ul>
                </div>
            </div>
            
            <!-- Copyright Section -->
            <div style="text-align: center; margin-top: 3rem; padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.05); color: rgba(255,255,255,0.5); font-size: 0.9rem;">
                &copy; <span id="current-year"></span> AnonymCreator - Digitalstudio. All rights reserved.
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

    // We do NOT inject the geo prompt in the English site because they are already on the English site
});
