document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        const target = targetId ? document.querySelector(targetId) : null;

        if (!target) {
            return;
        }

        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

(function() {
    const sparkleCount = window.innerWidth < 768 ? 34 : 72;
    let sparkleContainer = null;
    let rebuildTimeout = null;

    function ensureContainer() {
        sparkleContainer = document.getElementById('sparkles') || document.createElement('div');
        sparkleContainer.id = 'sparkles';

        if (!sparkleContainer.parentNode) {
            document.body.appendChild(sparkleContainer);
        }
    }

    function applyTheme() {
        if (!sparkleContainer) {
            return;
        }

        sparkleContainer.dataset.theme = document.body.classList.contains('dark') ? 'dark' : 'light';
    }

    function buildSparkles() {
        ensureContainer();
        sparkleContainer.innerHTML = '';

        const count = document.body.classList.contains('dark')
            ? Math.max(24, Math.floor(sparkleCount * 0.72))
            : sparkleCount;

        for (let index = 0; index < count; index += 1) {
            const sparkle = document.createElement('div');
            const size = 2 + Math.random() * 3;

            sparkle.className = 'sparkle';
            sparkle.style.top = `${Math.random() * window.innerHeight}px`;
            sparkle.style.left = `${Math.random() * window.innerWidth}px`;
            sparkle.style.width = `${size}px`;
            sparkle.style.height = `${size}px`;
            sparkle.style.animationDelay = `${Math.random() * 3}s`;
            sparkle.style.animationDuration = `${2.4 + Math.random() * 2.8}s`;
            sparkleContainer.appendChild(sparkle);
        }

        applyTheme();
    }

    function scheduleRebuild() {
        if (rebuildTimeout) {
            clearTimeout(rebuildTimeout);
        }

        rebuildTimeout = window.setTimeout(buildSparkles, 120);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            buildSparkles();
            window.addEventListener('resize', scheduleRebuild, { passive: true });
            window.addEventListener('themechange', applyTheme);
        });
    } else {
        buildSparkles();
        window.addEventListener('resize', scheduleRebuild, { passive: true });
        window.addEventListener('themechange', applyTheme);
    }
})();

document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.logo-track');
    if (track && !track.dataset.cloned) {
        Array.from(track.children).forEach(item => {
            track.appendChild(item.cloneNode(true));
        });
        track.dataset.cloned = 'true';
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const footerEl = document.getElementById('footer-typewriter');
    const footerText = 'Pixels are my paint. Code is my brush';

    if (!footerEl) {
        return;
    }

    let index = 0;
    let direction = 1;

    function step() {
        footerEl.textContent = footerText.slice(0, index);

        if (direction === 1) {
            index += 1;
            if (index > footerText.length) {
                direction = -1;
                window.setTimeout(step, 1800);
                return;
            }
        } else {
            index -= 1;
            if (index < 0) {
                direction = 1;
                index = 0;
            }
        }

        window.setTimeout(step, direction === 1 ? 28 : 14);
    }

    step();
});

document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu-list');

    if (!menuToggle || !navMenu) {
        return;
    }

    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('mobile-active');
        menuToggle.classList.toggle('active');
    });

    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('mobile-active');
            menuToggle.classList.remove('active');
        });
    });
});

window.addEventListener('load', function() {
    const videoDiv = document.querySelector('.video-intro');
    const video = document.querySelector('.video-intro video');

    if (videoDiv && video) {
        videoDiv.style.display = 'block';

        const playVideo = () => video.play().catch(() => {});

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        playVideo();
                    } else {
                        video.pause();
                    }
                });
            }, {
                threshold: 0.2
            });

            observer.observe(videoDiv);
        } else {
            playVideo();
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const modal = document.getElementById('contact-modal');
    const modalClose = document.getElementById('contact-modal-close');

    if (contactForm && modal && modalClose) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            fetch('/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: contactForm.name.value,
                    email: contactForm.email.value,
                    subject: contactForm.subject.value,
                    message: contactForm.message.value
                })
            })
                .then(res => res.text())
                .then(() => {
                    modal.style.display = 'flex';
                    contactForm.reset();
                });
        });

        modalClose.addEventListener('click', function() {
            modal.style.display = 'none';
        });

        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const checkbox = document.getElementById('checkbox');
    const body = document.body;
    const aboutImg = document.getElementById('about-img');
    const darkImg = 'Coding picture5.png';
    const lightImg = 'Coding picture3.png';
    const scrollBtn = document.getElementById('scrollToTop');
    const navbar = document.querySelector('.navbar');
    const heroGradient = document.querySelector('.hero-gradient');
    const progressBar = document.createElement('div');
    const loader = document.querySelector('.content');
    const main = document.getElementById('main-content');
    let ticking = false;
    let scrollButtonVisible = false;
    let navbarSolid = false;
    let lastProgress = -1;

    function updateAboutImg() {
        if (!aboutImg) {
            return;
        }

        aboutImg.src = body.classList.contains('dark') ? darkImg : lightImg;
    }

    if (checkbox && localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark');
        checkbox.checked = true;
    }

    if (checkbox) {
        checkbox.addEventListener('change', function() {
            if (checkbox.checked) {
                body.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            } else {
                body.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            }

            updateAboutImg();
            window.dispatchEvent(new CustomEvent('themechange'));
            requestScrollUpdate();
        });
    }

    updateAboutImg();
    window.dispatchEvent(new CustomEvent('themechange'));

    if (loader && main) {
        window.setTimeout(() => {
            loader.style.display = 'none';
            main.style.display = 'block';
        }, 250);
    }

    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    function updateScrollEffects() {
        ticking = false;
        const scrollTop = window.pageYOffset;
        const shouldShowScrollButton = scrollTop > 2500;
        const shouldUseSolidNavbar = scrollTop > 50;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? Math.max(0, Math.min(100, (scrollTop / docHeight) * 100)) : 0;

        if (scrollBtn && shouldShowScrollButton !== scrollButtonVisible) {
            scrollButtonVisible = shouldShowScrollButton;
            scrollBtn.style.display = shouldShowScrollButton ? 'flex' : 'none';
        }

        if (navbar && shouldUseSolidNavbar !== navbarSolid) {
            navbarSolid = shouldUseSolidNavbar;
            navbar.style.background = shouldUseSolidNavbar ? 'rgba(10, 10, 10, 0.95)' : 'rgba(10, 10, 10, 0.9)';
        }

        if (heroGradient && window.innerWidth > 768) {
            const speed = Math.min(scrollTop * 0.18, 160);
            heroGradient.style.transform = `translate(-50%, -50%) translateY(${speed}px)`;
        }

        if (Math.abs(progress - lastProgress) > 0.2) {
            lastProgress = progress;
            progressBar.style.width = `${progress}%`;
        }
    }

    function requestScrollUpdate() {
        if (ticking) {
            return;
        }

        ticking = true;
        window.requestAnimationFrame(updateScrollEffects);
    }

    window.addEventListener('scroll', requestScrollUpdate, { passive: true });
    window.addEventListener('resize', requestScrollUpdate, { passive: true });

    if (scrollBtn) {
        scrollBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    updateScrollEffects();
});

document.querySelectorAll('.view-work-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const theme = document.body.classList.contains('dark') ? 'dark' : 'light';
        window.location.href = `/underconst?theme=${theme}`;
    });
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

const classObserver = (selector, animationClass, threshold = 0.1) => {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add(animationClass);
            }
        });
    }, { threshold });

    document.querySelectorAll(selector).forEach(el => {
        observer.observe(el);
    });
};

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.service-card, .portfolio-item, .stat-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(el);
    });

    classObserver('.hero-content', 'animate-fade-in-left');
    classObserver('.hero-visual', 'animate-fade-in-right');
    classObserver('.about-text', 'animate-fade-in-left');
    classObserver('.about-image', 'animate-fade-in-right');
    classObserver('.service-card', 'animate-fade-in-up');
    classObserver('.portfolio-item', 'animate-fade-in-up');
    classObserver('.contact-info', 'animate-fade-in-left');
    classObserver('.contact-form', 'animate-fade-in-right');
});

function animateCounter(element, target, duration = 1400) {
    let start = 0;
    const increment = target / (duration / 16);

    const timer = window.setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = `${target}+`;
            clearInterval(timer);
        } else {
            element.textContent = `${Math.floor(start)}+`;
        }
    }, 16);
}

const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        }

        const statNumber = entry.target.querySelector('h3');
        if (statNumber) {
            animateCounter(statNumber, parseInt(statNumber.textContent, 10));
        }
        statsObserver.unobserve(entry.target);
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.stat-item').forEach(stat => {
        statsObserver.observe(stat);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.image-slider');
    if (!slider) {
        return;
    }

    const images = slider.querySelectorAll('img');
    let current = 0;

    function showImage(index) {
        images.forEach((img, imgIndex) => {
            img.classList.toggle('active', imgIndex === index);
        });
    }

    showImage(current);
    window.setInterval(() => {
        current = (current + 1) % images.length;
        showImage(current);
    }, 4000);
});
