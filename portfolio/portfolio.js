// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
































/* Marquee bandets kod för att duppliceras*/
document.addEventListener('DOMContentLoaded', function() {
  const track = document.querySelector('.logo-track');
  if (track) {
    const icons = Array.from(track.children);
    // Klona varje ikon och lägg till den i slutet av spåret
    icons.forEach(icon => {
      const clone = icon.cloneNode(true);
      track.appendChild(clone);
    });
  }
});


















/* Smooth scrolling för alla navigation links*/
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});





















/*Function in the footer */
document.addEventListener('DOMContentLoaded', function() {
  const footerText = "Pixels are my paint. Code is my brush";
  const footerEl = document.getElementById('footer-typewriter');
  if (!footerEl) return;
  footerEl.textContent = "";

  function typeFooter(i = 0) {
    if (i < footerText.length) {
      footerEl.textContent += footerText[i];
      setTimeout(() => typeFooter(i + 1), 20);
    } else {
      setTimeout(() => {
        footerEl.textContent = "";
        typeFooter(0); // Starta om loopen
      }, 3000); 
    }
  }

  // Starta typewriter-effekten när footern syns
  let started = false;
  const observer = new IntersectionObserver(function(entries) {
    if (entries[0].isIntersecting && !started) {
      started = true;
      typeFooter();
    }
  }, { threshold: 0.5 });

  observer.observe(footerEl);
});














/* Hamburgarmeny funktionen */
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('nav-menu-list');

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

























/*Video spelning*/ 
window.addEventListener('load', function() {
  // Dölj loader, visa main-content (om du inte redan gör det)
  document.getElementById('loader').style.display = '';
  document.getElementById('main-content').style.display = 'block';

  // Visa och spela videon i loop
  const videoDiv = document.querySelector('.video-intro');
  const video = document.getElementById('intro-video');
  if (videoDiv && video) {
    videoDiv.style.display = 'block';
    video.currentTime = 0;
    video.play();
  }
});



















/* Hela sparkling funktionen*/ 
(function() {
  const SPARKLE_COUNT = 200; // antal prickar totalt
  const MIN_AREA_RATIO = 0.02; // ignorera element som är mindre än 2% av viewport area

  // skapa container
  function createSparkleContainer() {
    const c = document.createElement('div');
    c.id = 'sparkles';
    document.body.appendChild(c);
    for (let i = 0; i < SPARKLE_COUNT; i++) {
      const s = document.createElement('div');
      s.className = 'sparkle';
      // slumpa position (viewport-koord)
      s.style.top = (Math.random() * window.innerHeight) + 'px';
      s.style.left = (Math.random() * window.innerWidth) + 'px';
      s.style.animationDelay = (Math.random() * 3) + 's';
      // lite variation i storlek
      const size = 3 + Math.random() * 6;
      s.style.width = size + 'px';
      s.style.height = size + 'px';
      document.getElementById('sparkles').appendChild(s);
    }
  }

  // parse rgba(...) eller rgb(...)
  function parseRGBA(str) {
    if (!str) return null;
    if (str === 'transparent') return null;
    const m = str.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const parts = m[1].split(',').map(p => parseFloat(p.trim()));
    return {
      r: parts[0],
      g: parts[1],
      b: parts[2],
      a: parts[3] !== undefined ? parts[3] : 1
    };
  }

  function luminance(r,g,b){
    return (0.2126*r + 0.7152*g + 0.0722*b)/255;
  }

  // avgör om ett element bör "maskas" (dölja prickar under det)
  function shouldMaskElement(el) {
    if (!el) return false;
    if (el.classList && el.classList.contains('no-sparkles')) return true;

    const tag = el.tagName ? el.tagName.toLowerCase() : '';
    // vi testar framförallt container-element (section/header/footer/main) för att undvika små knappar
    if (!['section','header','footer','main','aside','nav','.hero','.site-footer','.site-header'].includes(tag) &&
        !el.classList.contains('dark-section') && !el.classList.contains('no-sparkles')) {
      // tillåt ändå om användaren explicit satt klass ovan
      // men annars skippa små okända tags för performance
    }

    const style = window.getComputedStyle(el);
    const bg = parseRGBA(style.backgroundColor);
    const hasBgImage = style.backgroundImage && style.backgroundImage !== 'none';

    // area-filter: ignore tiny elements
    const area = el.offsetWidth * el.offsetHeight;
    const viewportArea = window.innerWidth * window.innerHeight;
    if (area < viewportArea * MIN_AREA_RATIO) {
      // men om användaren explicit har no-sparkles, vi returnerar redan true ovan
      return false;
    }

    if (bg) {
      // om bakgrund har låg alfa -> ignore (transparent)
      if (bg.a < 0.2 && !hasBgImage) return false;
      const lum = luminance(bg.r, bg.g, bg.b);
      // om färgen är mörk eller har bg-image -> maska
      if (lum < 0.6 || hasBgImage) return true;
    } else if (hasBgImage) {
      return true;
    }

    return false;
  }

  // bygg SVG-mask som döljer prickarna under "mask-element"
  function updateMask() {
    const container = document.getElementById('sparkles');
    if (!container) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // välj kandidater: vanliga stora sektioner + manuella markeringar
    const candidates = Array.from(document.querySelectorAll('section, header, footer, main, .hero, .dark-section, .no-sparkles'));
    const rects = [];
    candidates.forEach(el => {
      try {
        if (shouldMaskElement(el)) {
          const r = el.getBoundingClientRect();
          // klipp till viewport
          const left = Math.max(0, Math.min(r.left, vw));
          const top  = Math.max(0, Math.min(r.top, vh));
          const width = Math.max(0, Math.min(r.width, vw));
          const height = Math.max(0, Math.min(r.height, vh));
          if (width > 0 && height > 0) rects.push({left, top, width, height});
        }
      } catch (e) {
        // ignore elements som kastar error (iframe, etc)
      }
    });

    // Skapa SVG: vit hel yta = visa sparkles, svarta rektanglar = dölj sparkles
    let svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${vw}' height='${vh}' viewBox='0 0 ${vw} ${vh}'>`;
    svg += `<rect x='0' y='0' width='${vw}' height='${vh}' fill='white'/>`;
    rects.forEach(r => {
      svg += `<rect x='${r.left}' y='${r.top}' width='${r.width}' height='${r.height}' fill='black'/>`;
    });
    svg += `</svg>`;

    const dataUri = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
    // apply mask (standard + webkit)
    container.style.maskImage = `url("${dataUri}")`;
    container.style.webkitMaskImage = `url("${dataUri}")`;
    container.style.maskRepeat = 'no-repeat';
    container.style.webkitMaskRepeat = 'no-repeat';
    container.style.maskSize = '100% 100%';
    container.style.webkitMaskSize = '100% 100%';
  }

  // init
  function init() {
    createSparkleContainer();
    // tiny delay så layout hinner rendera (fonts/bilder)
    setTimeout(updateMask, 100);
    window.addEventListener('resize', updateMask);
    window.addEventListener('scroll', updateMask);

    // MutationObserver: uppdatera mask vid DOM-ändringar (t.ex. sections läggs till)
    const obs = new MutationObserver(() => {
      // debounce
      if (window._sparkleMaskTimeout) clearTimeout(window._sparkleMaskTimeout);
      window._sparkleMaskTimeout = setTimeout(updateMask, 120);
    });
    obs.observe(document.body, { childList: true, subtree: true, attributes: true });

    // uppdatera igen efter bilder/fonts load
    window.addEventListener('load', () => setTimeout(updateMask, 150));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

























/*Alert function & sending data */
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contact-form');
  const modal = document.getElementById('contact-modal');
  const modalClose = document.getElementById('contact-modal-close');

    if (contactForm && modal && modalClose) {
        contactForm.addEventListener('submit', function (e) {
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





































//Dark theme and Light theme
document.addEventListener('DOMContentLoaded', function() {
  const checkbox = document.getElementById('checkbox');
  const body = document.body;

  // Sätt rätt läge vid laddning
  if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark');
    checkbox.checked = true;
  }

  checkbox.addEventListener('change', function() {
    if (checkbox.checked) {
      body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  });
});














/*Function for the light and dark theme page */
document.querySelectorAll('.view-work-btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    const theme = document.body.classList.contains('dark') ? 'dark' : 'light';
    window.location.href = `/underconst?theme=${theme}`;
  });
});























/* Koden som är ansvarig för att ljustera bild i about section vid olika theme */
document.addEventListener('DOMContentLoaded', function() {
  const aboutImg = document.getElementById('about-img');
  const darkImg = 'Coding picture5.png'; // Bild för dark theme
  const lightImg = 'Coding picture3.png'; // Bild för light theme

  function updateAboutImg() {
    if (document.body.classList.contains('dark')) {
      aboutImg.src = darkImg;
    } else {
      aboutImg.src = lightImg;
    }
  }

  // Byt bild direkt vid laddning
  updateAboutImg();

  // Byt bild när theme ändras (om du har en theme-toggle)
  const checkbox = document.getElementById('checkbox');
  if (checkbox) {
    checkbox.addEventListener('change', updateAboutImg);
  }
});


















// Scroll to top button
document.addEventListener('DOMContentLoaded', function() {
  const scrollBtn = document.getElementById('scrollToTop');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 2500) {
      scrollBtn.style.display = 'flex';
    } else {
      scrollBtn.style.display = 'none';
    }
  });
  scrollBtn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});









// Navbar background on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
    
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.9)';
    }
});
















// Add scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);









// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.service-card, .portfolio-item, .stat-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});








// Portfolio item hover effects
document.querySelectorAll('.portfolio-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});









// Service card hover effects
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px)';
        this.style.boxShadow = '0 25px 50px rgba(99, 102, 241, 0.15)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
    });
});









// Add typing effect to hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}









// Initialize typing effect when page loads
document.addEventListener('DOMContentLoaded', function() {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 50);
        }, 500);
    }
});












/* Add parallax effect to hero section*/
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const heroGradient = document.querySelector('.hero-gradient');
    
    if (heroGradient) {
        const speed = scrolled * 0.5;
        heroGradient.style.transform = `translate(-50%, -50%) translateY(${speed}px)`;
    }
});












// Button click animations
document.querySelectorAll('.primary-button, .secondary-button, .cta-button').forEach(button => {
    button.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});











// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .primary-button, .secondary-button, .cta-button {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);













// Loading Screen
document.addEventListener('DOMContentLoaded', function() {
    // Create loading screen
    const loadingScreen = document.createElement('div');
    loadingScreen.className = 'loading';
    loadingScreen.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(loadingScreen);
    
    // Hide loading screen after page loads
    window.addEventListener('load', function() {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.remove();
            }, 500);
        }, 1000);
    });
});











// Scroll Progress Bar
document.addEventListener('DOMContentLoaded', function() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
});







// Enhanced Scroll Animations
const createObserver = (className, animationClass, threshold = 0.1) => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add(animationClass);
            }
        });
    }, { threshold });
    
    document.querySelectorAll(className).forEach(el => {
        observer.observe(el);
    });
};

document.addEventListener('DOMContentLoaded', function() {
    // Add animation classes to elements
    createObserver('.hero-content', 'animate-fade-in-left');
    createObserver('.hero-visual', 'animate-fade-in-right');
    createObserver('.about-text', 'animate-fade-in-left');
    createObserver('.about-image', 'animate-fade-in-right');
    createObserver('.service-card', 'animate-fade-in-up');
    createObserver('.portfolio-item', 'animate-fade-in-up');
    createObserver('.contact-info', 'animate-fade-in-left');
    createObserver('.contact-form', 'animate-fade-in-right');
});









// Counter Animation for Stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + '+';
        }
    }, 16);
}










// Trigger counter animations when stats come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('h3');
            const targetValue = parseInt(statNumber.textContent);
            animateCounter(statNumber, targetValue);
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.stat-item').forEach(stat => {
        statsObserver.observe(stat);
    });
});














document.addEventListener('DOMContentLoaded', function() {
  if (window.innerWidth <= 768) {
    createMobileMenu();
  }
});








// Lazy Loading for Images (when added)
function lazyLoadImages() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}










// Smooth Reveal Animation for Text
function typewriterEffect(element, text, speed = 50) {
    element.innerHTML = '';
    let i = 0;
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}











// Enhanced Form Validation
function enhanceFormValidation() {
    const form = document.querySelector('form');
    const inputs = form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        // Real-time validation
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
    
    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Remove existing error
        field.classList.remove('error');
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Validation rules
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        } else if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }
        
        if (!isValid) {
            field.classList.add('error');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = errorMessage;
            field.parentNode.appendChild(errorDiv);
        }
        
        return isValid;
    }
    
    // Enhanced form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isFormValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) {
                isFormValid = false;
            }
        });
        
        if (isFormValid) {
            // Show success message
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                submitButton.textContent = 'Message Sent!';
                submitButton.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                
                setTimeout(() => {
                    form.reset();
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                    submitButton.style.background = '';
                }, 2000);
            }, 1500);
        }
    });
}













// Cursor Trail Effect (Optional)
function createCursorTrail() {
    const trail = [];
    const trailLength = 10;
    
    for (let i = 0; i < trailLength; i++) {
        const dot = document.createElement('div');
        dot.className = 'cursor-trail';
        dot.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: rgba(99, 102, 241, ${1 - i / trailLength});
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(dot);
        trail.push(dot);
    }
    
    let mouseX = 0, mouseY = 0;
    
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateTrail() {
        let x = mouseX, y = mouseY;
        
        trail.forEach((dot, index) => {
            dot.style.left = x + 'px';
            dot.style.top = y + 'px';
            
            const nextDot = trail[index + 1] || trail[0];
            x += (parseFloat(nextDot.style.left) - x) * 0.3;
            y += (parseFloat(nextDot.style.top) - y) * 0.3;
        });
        
        requestAnimationFrame(animateTrail);
    }
    
    animateTrail();
}












// Initialize enhanced features
document.addEventListener('DOMContentLoaded', function() {
    enhanceFormValidation();
    lazyLoadImages();
    
    // Optional: Enable cursor trail on desktop
    if (window.innerWidth > 768) {
        createCursorTrail();
    }
    
    // Initialize mobile menu if on mobile
    if (window.innerWidth <= 768) {
        createMobileMenu();
    }
});












// ...existing code...

document.addEventListener('DOMContentLoaded', function() {
    const heroGradient = document.querySelector('.hero-gradient');
    if (heroGradient) {
        let timeout;
        heroGradient.addEventListener('mouseenter', () => {
            timeout = setTimeout(() => {
                heroGradient.classList.add('paused');
            }, 400); // 400 ms för mjuk paus, ändra vid behov
        });
        heroGradient.addEventListener('mouseleave', () => {
            clearTimeout(timeout);
            heroGradient.classList.remove('paused');
        });
    }
});











// Bildslider i hero-cirkeln
document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.image-slider');
    if (!slider) return;
    const images = slider.querySelectorAll('img');
    let current = 0;

    function showImage(index) {
        images.forEach((img, i) => {
            img.classList.toggle('active', i === index);
            img.style.opacity = i === index ? '1' : '0';
            img.style.transition = 'opacity 0.7s';
            img.style.position = 'absolute';
            img.style.top = 0;
            img.style.left = 0;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
        });
    }

    // Gör image-slider till position: relative
    slider.style.position = 'relative';
    slider.style.width = '100%';
    slider.style.height = '100%';

    showImage(current);

    setInterval(() => {
        current = (current + 1) % images.length;
        showImage(current);
    }, 4000);
});












// Loader function
document.addEventListener('DOMContentLoaded', function() {
  const loader = document.querySelector('.content');
  const main = document.getElementById('main-content');
  if (loader && main) {
    setTimeout(() => {
      loader.style.display = 'none';
      main.style.display ='';
    }, 3500); 
  }
});















document.addEventListener('DOMContentLoaded', function() {
  const titleLines = ["Matai Somi for coding &", "Development"];
  const subtitleText = "Hi, have a project in mind and want to create something amazing? You are in the right place. I’m Matai Somi, a system developer with a passion for clean architecture, smart automation, and intuitive user experiences. I love building things that make technology feel simple.";

  const titleEl = document.getElementById('typewriter-title');
  const subtitleEl = document.getElementById('typewriter-subtitle');
  const lineEls = titleEl.querySelectorAll('.title-line');

  // Töm texten
  lineEls[0].textContent = '';
  lineEls[1].textContent = '';
  subtitleEl.textContent = '';

  // Typewriter-funktion för en rad
  function typeLine(element, text, delay, cb) {
    let i = 0;
    function type() {
      element.textContent = text.slice(0, i + 1);
      i++;
      if (i < text.length) {
        setTimeout(type, delay);
      } else if (cb) {
        cb();
      }
    }
    type();
  }

  // Skriv ut första raden, sedan andra raden, sedan beskrivningen
  typeLine(lineEls[0], titleLines[0], 100, () => { // långsammare (80ms per bokstav)
    typeLine(lineEls[1], titleLines[1], 100, () => {
      setTimeout(() => {
        typeLine(subtitleEl, subtitleText, 15);
      }, 4000); // liten paus innan beskrivningen börjar
    });
  });
});










// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}













// Debounced scroll handler
const debouncedScrollHandler = debounce(function() {
    // Any expensive scroll operations can go here
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Add error message styles
const errorStyles = document.createElement('style');
errorStyles.textContent = `
    .error {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2) !important;
    }
    
    .error-message {
        color: #ef4444;
        font-size: 0.8rem;
        margin-top: 0.5rem;
        animation: fadeInUp 0.3s ease;
    }
    
    .mobile-menu-toggle.active span:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    
    .mobile-menu-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .mobile-menu-toggle.active span:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
    
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            top: 100%;
            left: 0;
            width: 100%;
            background: rgba(10, 10, 10, 0.95);
            backdrop-filter: blur(10px);
            flex-direction: column;
            padding: 2rem;
            transform: translateY(-100%);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        
        .nav-menu.mobile-active {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
        }
        
        .nav-menu li {
            margin: 1rem 0;
        }
    }
`;
document.head.appendChild(errorStyles);


















