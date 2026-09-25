// AnonymCreator Scripts (sus.digital style interactions)

document.addEventListener("DOMContentLoaded", () => {
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if(targetId === "#") return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Smart Header (Hide on scroll down, show on scroll up)
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const header = document.querySelector('.site-header');
        if (!header) return;
        
        const currentScroll = window.scrollY;
        
        // Add pill styling when scrolled past 50px
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Dynamically get the hero section height (fallback to 400 if not found)
        const hero = document.querySelector('.hero');
        const hideThreshold = hero ? hero.offsetHeight - 50 : 400;

        // Hide/Show based on scroll direction (only hide past the hero section)
        if (currentScroll > hideThreshold && currentScroll > lastScrollY) {
            // Scrolling down -> hide
            header.classList.add('hidden');
        } else {
            // Scrolling up -> show
            header.classList.remove('hidden');
        }
        
        // Parallax background shapes
        const parallaxWrapper = document.querySelector('.bg-parallax-wrapper');
        if (parallaxWrapper) {
            // Slower scroll speed for the background to create 3D depth
            // Add a subtle zoom-in effect and shift it slightly left so it doesn't get pushed off-screen
            const scaleFactor = 1 + (currentScroll * 0.0002);
            parallaxWrapper.style.transform = `translate(${currentScroll * -0.1}px, ${currentScroll * -0.15}px) scale(${scaleFactor})`;
        }
        
        lastScrollY = currentScroll;
    });

    // 3D Tilt Hover Effect for all cards and the hero logo
    const tiltElements = document.querySelectorAll('.service-card, .project-item, .testimonial-card, .agentur-card, .benefit-card, .interactive-card, .hero-logo-img');
    
    tiltElements.forEach(el => {
        if (el.classList.contains('no-tilt')) return;
        
        el.addEventListener('mouseenter', () => {
            // Keep a smooth transition active even during mousemove for a slower, smoother tilt
            el.style.transition = 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.3s ease-out, filter 0.3s ease-out';
        });

        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -7; // Max 7 deg rotation
            const rotateY = ((x - centerX) / centerX) * 7;
            
            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            el.style.zIndex = '10';
            
            // Add a subtle glow effect matching the rotation (drop-shadow for images, box-shadow for cards)
            if (el.classList.contains('hero-logo-img')) {
                el.style.filter = `drop-shadow(${-rotateY}px ${rotateX}px 30px rgba(0, 240, 255, 0.4))`;
            } else {
                el.style.boxShadow = `${-rotateY}px ${rotateX}px 30px rgba(0, 240, 255, 0.1)`;
            }
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            el.style.transition = 'all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';
            el.style.zIndex = '1';
            
            if (el.classList.contains('hero-logo-img')) {
                el.style.filter = `drop-shadow(0 0 40px rgba(0, 240, 255, 0.15))`;
            } else {
                el.style.boxShadow = 'none';
            }
        });
    });

    // --- Reveal on Scroll Effect ---
    // Automatically add the reveal class to all text blocks and cards outside the hero section
    const elementsToReveal = document.querySelectorAll(`
        section:not(.hero) h2, 
        section:not(.hero) h3, 
        section:not(.hero) p, 
        .service-card, 
        .project-item, 
        .testimonial-card,
        .agentur-card,
        .benefit-card,
        .interactive-card
    `);
    
    elementsToReveal.forEach((el, index) => {
        el.classList.add('reveal-on-scroll');
        // Add a slight stagger delay based on the element's index if they are in the same block (optional polish)
        el.style.transitionDelay = `${(index % 3) * 0.1}s`; 
    });

    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, revealOptions);

    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
        revealObserver.observe(el);
    });

    // --- Scroll Statement Effect ---
    const statement = document.getElementById('scroll-statement');
    if (statement) {
        const words = statement.querySelectorAll('.word');
        
        const handleStatementScroll = () => {
            const rect = statement.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Adjust to control when the text starts and finishes revealing
            const startReveal = windowHeight * 0.85; 
            const endReveal = windowHeight * 0.35;
            
            let progress = (startReveal - rect.top) / (startReveal - endReveal);
            progress = Math.max(0, Math.min(1, progress));
            
            // The +1 ensures the last word lights up completely before the scroll ends
            const activeCount = Math.floor(progress * (words.length + 1));
            
            words.forEach((word, index) => {
                if (index < activeCount) {
                    word.classList.add('active');
                } else {
                    word.classList.remove('active');
                }
            });
        };

        window.addEventListener('scroll', handleStatementScroll);
        // Add a slight delay on initial load to ensure layout is complete
        setTimeout(handleStatementScroll, 100); 
    }

    // --- Pricing Billing Toggle Logic ---
    const billingToggle = document.getElementById('billing-toggle');
    if (billingToggle) {
        const labelMonthly = document.getElementById('label-monthly');
        const labelYearly = document.getElementById('label-yearly');
        const wartungCards = document.querySelectorAll('.wartung-card');

        // Initial state styling
        labelMonthly.classList.add('active');

        billingToggle.addEventListener('change', function() {
            const isYearly = this.checked;

            if (isYearly) {
                labelYearly.classList.add('active');
                labelMonthly.classList.remove('active');
            } else {
                labelMonthly.classList.add('active');
                labelYearly.classList.remove('active');
            }

            wartungCards.forEach(card => {
                const priceValueEl = card.querySelector('.price-value');
                const yearlyInfoEl = card.querySelector('.yearly-billing-info');
                const btnEl = card.querySelector('.btn-primary'); // Get the button
                
                const monthlyPrice = card.getAttribute('data-monthly');
                const yearlyPrice = card.getAttribute('data-yearly'); // discounted monthly price
                const idMonthly = card.getAttribute('data-monthly-id');
                const idYearly = card.getAttribute('data-yearly-id');
                
                // Fade out text
                priceValueEl.style.opacity = 0;
                
                setTimeout(() => {
                    if (isYearly) {
                        // Format to comma if needed (German), keep dot for English
                        const isEnglish = window.location.pathname.startsWith('/en');
                        priceValueEl.textContent = isEnglish ? yearlyPrice : yearlyPrice.replace('.', ',');
                        if(yearlyInfoEl) yearlyInfoEl.style.display = 'block';
                        if(btnEl && idYearly) btnEl.setAttribute('data-package-id', idYearly);
                    } else {
                        priceValueEl.textContent = monthlyPrice;
                        if(yearlyInfoEl) yearlyInfoEl.style.display = 'none';
                        if(btnEl && idMonthly) btnEl.setAttribute('data-package-id', idMonthly);
                    }
                    // Fade in text
                    priceValueEl.style.opacity = 1;
                }, 300); // Wait for fade out to complete before swapping
            });
        });
    }

    // --- Stripe Checkout Logic ---
    const checkoutButtons = document.querySelectorAll('.checkout-btn');
    checkoutButtons.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const originalText = btn.textContent;
            btn.textContent = "Wird geladen...";
            btn.disabled = true;

            const packageId = btn.getAttribute('data-package-id');
            
            try {
                // Adjust URL based on your Firebase Region if necessary
                const functionUrl = 'https://us-central1-anonymcreator---dashboard.cloudfunctions.net/createStripeCheckout';
                
                let successPath = '/danke.html';
                if (window.location.pathname.startsWith('/en')) {
                    successPath = '/en/danke.html';
                } else if (window.location.pathname.startsWith('/ro')) {
                    successPath = '/ro/danke.html';
                }

                const response = await fetch(functionUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        packageId: packageId,
                        successUrl: 'https://anonymcreator.com' + successPath,
                        cancelUrl: window.location.href
                    })
                });

                if (!response.ok) {
                    throw new Error('Checkout Fehler');
                }

                const data = await response.json();
                if (data.url) {
                    window.location.href = data.url;
                }
            } catch (error) {
                console.error(error);
                alert("Es gab einen Fehler beim Aufbau der Verbindung zu Stripe. Bitte versuchen Sie es später erneut.");
                btn.textContent = originalText;
                btn.disabled = false;
            }
        });
    });

});

// Restart GIF exactly when it becomes visible
document.addEventListener("DOMContentLoaded", () => {
    const gifImgs = document.querySelectorAll('.loop-3');
    gifImgs.forEach(gif => {
        let wasHidden = true;
        setInterval(() => {
            const opacity = parseFloat(window.getComputedStyle(gif).opacity);
            if (opacity > 0.01 && wasHidden) {
                const originalSrc = gif.src.split('?')[0];
                gif.src = originalSrc + "?t=" + new Date().getTime();
                wasHidden = false;
            } else if (opacity <= 0.01) {
                wasHidden = true;
            }
        }, 100);
    });

    // Interactive Category Filters for Project Showcase
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.projects-grid .project-item');

    if (filterButtons.length > 0 && projectItems.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const filter = btn.getAttribute('data-filter');

                // Update active state
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Filter projects with smooth transitions
                projectItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    const shouldShow = (filter === 'all' || itemCategory === filter);

                    if (shouldShow) {
                        item.classList.remove('filter-hide');
                        requestAnimationFrame(() => {
                            item.classList.remove('fade-out');
                            item.classList.add('fade-in');
                        });
                    } else {
                        item.classList.remove('fade-in');
                        item.classList.add('fade-out');
                        setTimeout(() => {
                            if (item.classList.contains('fade-out')) {
                                item.classList.add('filter-hide');
                            }
                        }, 300);
                    }
                });
            });
        });
    }
});

