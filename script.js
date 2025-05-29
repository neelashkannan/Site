// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // IMMEDIATELY disable all animations and transitions for minimal design
    const minimalStyle = document.createElement('style');
    minimalStyle.innerHTML = `
        * {
            transition: none !important;
            animation: none !important;
        }
        
        .stars, .twinkling, .star-particle, .star {
            display: none !important;
        }
        
        .hero {
            background-color: #0a0a0a !important;
            transform: none !important;
        }
        
        .highlight {
            color: #3498db !important;
            text-shadow: none !important;
        }
        
        .highlight::after {
            display: none !important;
        }
        
        .btn.primary {
            background-color: #3498db !important;
            box-shadow: none !important;
        }
        
        .feature-card, .feature-card:hover {
            transform: none !important;
            opacity: 1 !important;
            background-color: rgba(25, 25, 30, 0.85) !important;
        }
    `;
    document.head.appendChild(minimalStyle);
    
    // Remove any scroll-based parallax effects
    window.addEventListener('scroll', function() {
        // Prevent any scroll-based animations
        return false;
    }, { passive: true });
    
    // Initialize tabs functionality
    initTabs();
    
    // Initialize accordion functionality
    initAccordion();
    
    // Initialize form submission handling
    initForms();
    
    // Add parallax effect to stars background
    // initParallax(); // DISABLED
    
    // Add smooth scrolling for anchor links
    initSmoothScroll();

    // Handle service links with hash for tab selection
    handleServiceLinks();
    
    // Initialize click animation
    initClickAnimation();
    
    // Initialize material details toggle
    initMaterialDetailsToggle();
    
    // Initialize timeline step detection
    initTimelineSteps();

    // Monochrome toggle functionality
    function toggleMonochrome() {
        const monochromeCss = document.querySelector('link[href="monochrome.css"]');
        
        if (monochromeCss) {
            // If monochrome CSS is present, disable it
            monochromeCss.disabled = !monochromeCss.disabled;
            
            // Save preference to localStorage
            localStorage.setItem('monochromeMode', monochromeCss.disabled ? 'off' : 'on');
            
            // Update the toggle button if it exists
            const toggleButton = document.getElementById('monochrome-toggle');
            if (toggleButton) {
                toggleButton.textContent = monochromeCss.disabled ? 'Enable Monochrome' : 'Disable Monochrome';
            }
        }
    }

    // Check for monochrome preference and set up toggle
    const monochromeCss = document.querySelector('link[href="monochrome.css"]');
    
    if (monochromeCss) {
        // Check saved preference
        const savedPreference = localStorage.getItem('monochromeMode');
        
        // Default is on (since we added the CSS link)
        if (savedPreference === 'off') {
            monochromeCss.disabled = true;
        } else {
            monochromeCss.disabled = false;
        }
        
        // Create toggle button if it doesn't exist
        if (!document.getElementById('monochrome-toggle')) {
            const header = document.querySelector('header .container');
            
            if (header) {
                const toggleButton = document.createElement('button');
                toggleButton.id = 'monochrome-toggle';
                toggleButton.className = 'monochrome-btn';
                toggleButton.textContent = monochromeCss.disabled ? 'Enable Monochrome' : 'Disable Monochrome';
                toggleButton.onclick = toggleMonochrome;
                
                // Style the button
                toggleButton.style.background = '#303030';
                toggleButton.style.color = '#ffffff';
                toggleButton.style.border = 'none';
                toggleButton.style.padding = '8px 12px';
                toggleButton.style.borderRadius = '4px';
                toggleButton.style.cursor = 'pointer';
                toggleButton.style.marginLeft = '10px';
                toggleButton.style.fontSize = '0.8rem';
                
                // Add to header
                header.appendChild(toggleButton);
            }
        }
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });

    // DISABLE parallax effect on the hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = 'none';
        // Remove the scroll listener
        window.removeEventListener('scroll', function() {
            const scrollPosition = window.pageYOffset;
            hero.style.transform = `translateY(${scrollPosition * 0.3}px)`;
        });
    }

    // Remove animations from feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    if (featureCards.length) {
        featureCards.forEach(card => {
            // Force opacity to 1
            card.style.opacity = '1';
            card.style.transform = 'none';
            card.classList.add('animate');
        });
        
        // Remove the scroll animation handler
        window.removeEventListener('scroll', function() {
            featureCards.forEach(card => {
                card.classList.add('animate');
            });
        });
    }
    
    // Create CSS for minimal styling without animations
    function createMinimalStyles() {
        const styleSheet = document.createElement('style');
        styleSheet.innerHTML = `
            /* Disable all animations and transitions */
            * {
                transition: none !important;
                animation: none !important;
            }
            
            /* Override any hover effects that might change layout */
            .feature-card:hover, .feature-card {
                transform: none !important;
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3) !important;
                opacity: 1 !important;
                background-color: rgba(25, 25, 30, 0.85) !important;
            }
            
            /* Ensure features are displayed in a row on desktop, column on mobile */
            .features-row {
                display: flex !important;
            }
            
            @media (min-width: 769px) {
                .features-row {
                    flex-direction: row !important;
                    justify-content: space-between !important;
                }
            }
            
            @media (max-width: 768px) {
                .features-row {
                    flex-direction: column !important;
                }
            }
            
            /* Fix for mobile scrolling */
            html, body {
                overscroll-behavior: none;
            }
            
            /* Ensure consistent card colors */
            .feature-card, .material-showcase-content, .timeline-content, .tab-content {
                background: rgba(20, 20, 20, 0.8) !important;
            }
            
            /* Hide background effects */
            .stars, .twinkling, .star-particle, .star {
                display: none !important;
            }
            
            /* Set solid background for header */
            header {
                background-color: #0a0a0a !important;
                backdrop-filter: none !important;
            }
            
            /* Minimal hero section */
            .hero {
                background-color: #0a0a0a !important;
                transform: none !important;
            }
            
            /* Fixed styles for highlight */
            .highlight {
                color: #3498db !important;
                text-shadow: none !important;
            }
            .highlight::after {
                display: none !important;
            }
            
            /* Fixed button styles */
            .btn.primary {
                background-color: #3498db !important;
                box-shadow: none !important;
            }
        `;
        document.head.appendChild(styleSheet);
    }
    
    createMinimalStyles();

    // Mobile navigation toggle
    const mobileBreakpoint = 768;
    
    function setupMobileNav() {
        if (window.innerWidth <= mobileBreakpoint) {
            const header = document.querySelector('header');
            const nav = document.querySelector('nav');
            
            if (header && nav) {
                // Create mobile menu toggle button if it doesn't exist
                if (!document.querySelector('.mobile-nav-toggle')) {
                    const mobileNavToggle = document.createElement('button');
                    mobileNavToggle.classList.add('mobile-nav-toggle');
                    mobileNavToggle.innerHTML = '<span></span><span></span><span></span>';
                    
                    mobileNavToggle.addEventListener('click', function() {
                        nav.classList.toggle('active');
                        this.classList.toggle('active');
                    });
                    
                    // Insert before nav
                    header.insertBefore(mobileNavToggle, nav);
                }
            }
        }
    }
    
    setupMobileNav();
    
    // Force visibility of all elements
    function forceVisibility() {
        document.querySelectorAll('section, .hero, .features, .mission, .materials-home, .print-services, .how-it-works, .cta-section').forEach(section => {
            section.style.opacity = '1';
            section.style.visibility = 'visible';
        });
    }
      
    forceVisibility();
});

// Initialize tabs functionality
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (tabButtons.length && tabContents.length) {
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                // Remove active class from all buttons and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to current button and content
                this.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }
}

// Initialize accordion functionality
function initAccordion() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    if (accordionHeaders.length) {
        accordionHeaders.forEach(header => {
            header.addEventListener('click', function() {
                this.classList.toggle('active');
                const accordionContent = this.nextElementSibling;
                
                if (accordionContent.style.maxHeight) {
                    accordionContent.style.maxHeight = null;
                } else {
                    accordionContent.style.maxHeight = accordionContent.scrollHeight + 'px';
                }
            });
        });
    }
}

// Initialize form submission handling
function initForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple validation
            let isValid = true;
            const requiredFields = this.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            if (isValid) {
                // For demo purposes, just show a success message
                const formMessage = document.createElement('div');
                formMessage.classList.add('form-message', 'success');
                formMessage.textContent = 'Form submitted successfully!';
                
                // Remove any existing messages
                const existingMessage = form.querySelector('.form-message');
                if (existingMessage) {
                    existingMessage.remove();
                }
                
                form.appendChild(formMessage);
                
                // Reset form
                form.reset();
            }
        });
    });
}

// Initialize click animation
function initClickAnimation() {
    // Basic click ripple effect
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // No animation for minimal design
        });
    });
}

// Initialize material details toggle
function initMaterialDetailsToggle() {
    const materialItems = document.querySelectorAll('.material-timeline-item, .material-showcase-item');
    
    if (materialItems.length) {
        materialItems.forEach(item => {
            const details = item.querySelector('.material-details');
            if (details) {
                item.addEventListener('click', function() {
                    this.classList.toggle('expanded');
                });
            }
        });
    }
}

// Polyfill for mobile navigation
if (window.innerWidth <= 768) {
    const mobileMenu = document.querySelector('.mobile-toggle');
    const nav = document.querySelector('nav ul');
    
    if (mobileMenu && nav) {
        mobileMenu.addEventListener('click', function() {
            nav.classList.toggle('active');
            this.innerHTML = nav.classList.contains('active') ? '✕' : '☰';
        });
    }
} 