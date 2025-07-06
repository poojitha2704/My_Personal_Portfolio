// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation
    const navLinks = document.querySelectorAll('a[href^="#"]');
    const navMenu = document.getElementById('nav-menu'); // Get the nav menu element
    const hamburger = document.getElementById('hamburger-menu'); // Get the hamburger menu element

    // Function to close the mobile menu
    function closeMobileMenu() {
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                closeMobileMenu(); // Close mobile menu after clicking a link
            }
        });
    });

    // Hamburger menu toggle
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Active navigation highlighting
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-menu a');

    function highlightNavigation() {
        let current = '';
        sections.forEach(section => {
            // Adjust offset for fixed header
            const headerOffset = document.querySelector('.navbar').offsetHeight + 20; // Navbar height + a little extra
            const sectionTop = section.offsetTop - headerOffset;
            const sectionHeight = section.offsetHeight;
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', highlightNavigation);
    highlightNavigation(); // Call on load to set initial active link

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: '0px 0px -50px 0px' // Shrink the bottom of the viewport by 50px
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Apply general animation styles (opacity and transform for sections)
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';

                // Animate skill bars specifically when the skill-category comes into view
                if (entry.target.classList.contains('skill-category')) {
                    animateSkillBars(entry.target);
                }
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    // Observe elements for general animation (timeline items, project cards, skill categories)
    const animatedElements = document.querySelectorAll('.timeline-item, .project-card, .skill-category');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Toggle percentage visibility on skill bar click
    document.querySelectorAll('.skill-bar').forEach(skillBar => {
        skillBar.addEventListener('click', function() {
            const percentageSpan = this.querySelector('.percentage');
            if (percentageSpan) {
                percentageSpan.classList.toggle('visible');
            }
        });
    });


    // Contact form handling with mailto (EmailJS setup is more robust for production)
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');

        if (name && email && message) {
            const subject = `Portfolio Contact from ${name}`;
            const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0AMessage:%0D%0A${message}`;
            const mailtoLink = `mailto:poojithagawni@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

            // Open mailto link
            window.location.href = mailtoLink;

            showNotification('Redirecting to your email client...', 'success');
            this.reset();
        } else {
            showNotification('Please fill in all fields.', 'error');
        }
    });
});

// Scroll to section function (global for onclick in HTML)
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        // Calculate offset for fixed header
        const headerOffset = document.querySelector('.navbar').offsetHeight;
        const elementPosition = section.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Animate skill bars (called by Intersection Observer)
function animateSkillBars(skillCategory) {
    const progressBars = skillCategory.querySelectorAll('.progress');
    progressBars.forEach((bar, index) => {
        const percent = bar.getAttribute('data-percent');
        // Reset width to 0% to ensure re-animation if scrolled away and back
        bar.style.width = '0%';
        // Use a small setTimeout to allow the browser to register the 0% width before animating
        setTimeout(() => {
            bar.style.width = percent + '%';
        }, 50 + (index * 150)); // Small initial delay + staggered effect
    });
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(400px);
        opacity: 0; /* Start hidden */
        transition: transform 0.3s ease, opacity 0.3s ease;
        ${type === 'success' ? 'background: linear-gradient(45deg, #3b82f6, #60a5fa);' : 'background: #ef4444;'}
        box-shadow: 0 10px 25px rgba(0,0,0,0.3);
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 100);

    // Animate out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300); // Wait for fade-out transition to complete
    }, 4000);
}

// Smooth scroll behavior for older browsers (no changes needed here, as the modern scrollIntoView is prioritized)
if (!('scrollBehavior' in document.documentElement.style)) {
    const scrollToElement = (element) => {
        const start = window.pageYOffset;
        // Adjust target for fixed header in older browser fallback
        const headerOffset = document.querySelector('.navbar').offsetHeight;
        const target = element.offsetTop - headerOffset;
        const distance = target - start;
        const duration = 1000;
        let timeStart = null;

        function animation(currentTime) {
            if (timeStart === null) timeStart = currentTime;
            const timeElapsed = currentTime - timeStart;
            const run = ease(timeElapsed, start, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    };

    // Override scroll behavior for older browsers
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                scrollToElement(targetSection);
            }
        });
    });
}