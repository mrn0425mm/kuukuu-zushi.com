/**
 * Animations JavaScript
 * Handles scroll animations and parallax effects
 */

document.addEventListener('DOMContentLoaded', () => {
  // ===================================
  // Scroll Animations
  // ===================================
  initScrollAnimations();

  // ===================================
  // Parallax Effects
  // ===================================
  initParallax();
});

/**
 * Scroll Animations
 * Triggers animations when elements enter viewport
 */
function initScrollAnimations() {
  // Check if Intersection Observer is supported
  if (!('IntersectionObserver' in window)) {
    // Fallback: show all elements immediately
    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(el => el.classList.add('animate-in'));
    return;
  }

  // Intersection Observer options
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -200px 0px'
  };

  // Create observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add animation class
        entry.target.classList.add('animate-in');

        // Optional: unobserve after animation (performance optimization)
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all elements with animate-on-scroll class
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  animatedElements.forEach(element => {
    observer.observe(element);
  });

  // Handle slide animations
  const slideLeftElements = document.querySelectorAll('.animate-slide-left');
  slideLeftElements.forEach(element => {
    observer.observe(element);
  });

  const slideRightElements = document.querySelectorAll('.animate-slide-right');
  slideRightElements.forEach(element => {
    observer.observe(element);
  });

  // Handle scale animations
  const scaleElements = document.querySelectorAll('.animate-scale');
  scaleElements.forEach(element => {
    observer.observe(element);
  });

  // Handle rotate animations
  const rotateElements = document.querySelectorAll('.animate-rotate');
  rotateElements.forEach(element => {
    observer.observe(element);
  });
}

/**
 * Parallax Effects
 * Creates parallax scrolling effect on hero and about sections
 */
function initParallax() {
  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    return; // Skip parallax if user prefers reduced motion
  }

  const heroBackground = document.querySelector('.hero-background');
  const aboutSection = document.querySelector('.about');

  // Throttle parallax updates for performance
  let ticking = false;

  const updateParallax = () => {
    const scrolled = window.pageYOffset;

    // Hero parallax (slower movement)
    if (heroBackground) {
      const heroOffset = scrolled * 0.5;
      heroBackground.style.transform = `translateY(${heroOffset}px)`;
    }

    // About section parallax (even slower)
    if (aboutSection) {
      const aboutRect = aboutSection.getBoundingClientRect();
      const aboutTop = aboutRect.top + scrolled;
      const aboutOffset = (scrolled - aboutTop) * 0.2;

      if (aboutRect.top < window.innerHeight && aboutRect.bottom > 0) {
        aboutSection.style.transform = `translateY(${aboutOffset}px)`;
      }
    }

    ticking = false;
  };

  const requestParallaxUpdate = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  };

  // Listen to scroll events
  window.addEventListener('scroll', requestParallaxUpdate, { passive: true });

  // Initial update
  updateParallax();
}

/**
 * Stagger Animation
 * Adds sequential animation delays to child elements
 */
function staggerAnimation(parentSelector, childSelector, delay = 100) {
  const parents = document.querySelectorAll(parentSelector);

  parents.forEach(parent => {
    const children = parent.querySelectorAll(childSelector);

    children.forEach((child, index) => {
      child.style.animationDelay = `${index * delay}ms`;
    });
  });
}

/**
 * Counter Animation
 * Animates numbers counting up
 */
function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16); // 60fps
  let current = start;

  const updateCounter = () => {
    current += increment;

    if (current < target) {
      element.textContent = Math.floor(current);
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target;
    }
  };

  updateCounter();
}

/**
 * Typewriter Effect
 * Types out text character by character
 */
function typewriterEffect(element, text, speed = 50) {
  let index = 0;
  element.textContent = '';

  const type = () => {
    if (index < text.length) {
      element.textContent += text.charAt(index);
      index++;
      setTimeout(type, speed);
    }
  };

  type();
}

/**
 * Fade In Elements on Load
 * Fades in page content when DOM is loaded
 */
function fadeInOnLoad() {
  const body = document.body;
  body.style.opacity = '0';

  setTimeout(() => {
    body.style.transition = 'opacity 0.5s ease-out';
    body.style.opacity = '1';
  }, 100);
}

/**
 * Scroll Progress Indicator
 * Shows scroll progress at top of page
 */
function initScrollProgress() {
  // Create progress bar
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(to right, #D4202A, #F4C430);
    width: 0;
    z-index: 9999;
    transition: width 0.1s ease-out;
  `;

  document.body.appendChild(progressBar);

  // Update progress on scroll
  let ticking = false;

  const updateProgress = () => {
    const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.pageYOffset / windowHeight) * 100;

    progressBar.style.width = `${scrolled}%`;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }, { passive: true });
}

/**
 * Reveal on Hover
 * Reveals hidden content on hover
 */
function initRevealOnHover(selector) {
  const elements = document.querySelectorAll(selector);

  elements.forEach(element => {
    const hiddenContent = element.querySelector('.hidden-content');

    if (hiddenContent) {
      element.addEventListener('mouseenter', () => {
        hiddenContent.style.opacity = '1';
        hiddenContent.style.transform = 'translateY(0)';
      });

      element.addEventListener('mouseleave', () => {
        hiddenContent.style.opacity = '0';
        hiddenContent.style.transform = 'translateY(20px)';
      });
    }
  });
}

/**
 * Smooth Image Load
 * Fades in images as they load
 */
function initSmoothImageLoad() {
  const images = document.querySelectorAll('img[loading="lazy"]');

  images.forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.5s ease-in';

    if (img.complete) {
      img.style.opacity = '1';
    } else {
      img.addEventListener('load', () => {
        img.style.opacity = '1';
      });
    }
  });
}

/**
 * Infinite Scroll Animation
 * Automatically scrolls elements infinitely
 */
function initInfiniteScroll(selector) {
  const container = document.querySelector(selector);

  if (!container) return;

  const content = container.innerHTML;
  container.innerHTML += content; // Duplicate content

  let scrollAmount = 0;
  const scrollSpeed = 1;

  const scroll = () => {
    scrollAmount += scrollSpeed;

    if (scrollAmount >= container.scrollHeight / 2) {
      scrollAmount = 0;
    }

    container.scrollTop = scrollAmount;
    requestAnimationFrame(scroll);
  };

  scroll();
}

/**
 * Text Shimmer Effect
 * Creates a shimmer effect on text
 */
function addTextShimmer(selector) {
  const elements = document.querySelectorAll(selector);

  elements.forEach(element => {
    element.style.background = 'linear-gradient(90deg, #D4202A 0%, #F4C430 50%, #D4202A 100%)';
    element.style.backgroundSize = '200% auto';
    element.style.backgroundClip = 'text';
    element.style.webkitBackgroundClip = 'text';
    element.style.webkitTextFillColor = 'transparent';
    element.style.animation = 'shimmer 3s linear infinite';
  });

  // Add keyframes if not already present
  if (!document.querySelector('#shimmer-keyframes')) {
    const style = document.createElement('style');
    style.id = 'shimmer-keyframes';
    style.textContent = `
      @keyframes shimmer {
        to {
          background-position: 200% center;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

/**
 * Export functions for use in other scripts
 */
window.animateCounter = animateCounter;
window.typewriterEffect = typewriterEffect;
window.staggerAnimation = staggerAnimation;
window.initScrollProgress = initScrollProgress;
window.initRevealOnHover = initRevealOnHover;
window.addTextShimmer = addTextShimmer;

// Optional: Initialize scroll progress (uncomment if desired)
// initScrollProgress();

// Optional: Initialize smooth image load
initSmoothImageLoad();
