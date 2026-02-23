/**
 * Main JavaScript File
 * Handles core functionality: smooth scroll, sticky header, hamburger menu, back-to-top
 */

document.addEventListener('DOMContentLoaded', () => {
  // ===================================
  // Smooth Scroll
  // ===================================
  initSmoothScroll();

  // ===================================
  // Sticky Header
  // ===================================
  initStickyHeader();

  // ===================================
  // Hamburger Menu
  // ===================================
  initHamburgerMenu();

  // ===================================
  // Back to Top Button
  // ===================================
  initBackToTop();

  // ===================================
  // Modal
  // ===================================
  initModal();

  // ===================================
  // Image Slider
  // ===================================
  initImageSlider();

  // ===================================
  // Hero Slider
  // ===================================
  initHeroSlider();
});

/**
 * Smooth Scroll Navigation
 * Handles smooth scrolling to anchor links
 */
function initSmoothScroll() {
  // Select all anchor links with hash
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');

      // Ignore empty hash
      if (href === '#') {
        e.preventDefault();
        return;
      }

      const target = document.querySelector(href);

      if (target) {
        e.preventDefault();

        // Close mobile menu if open
        const nav = document.getElementById('nav');
        const hamburger = document.getElementById('hamburger');
        if (nav && nav.classList.contains('active')) {
          nav.classList.remove('active');
          hamburger.classList.remove('active');
        }

        // Calculate offset (header + notice bar height)
        const header = document.getElementById('header');
        const noticeBar = document.querySelector('.notice-bar');
        let offset = 0;

        if (header) {
          offset += header.offsetHeight;
        }
        if (noticeBar) {
          offset += noticeBar.offsetHeight;
        }

        // Get target position
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

        // Smooth scroll to target
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Sticky Header
 * Adds/removes scrolled class based on scroll position
 */
function initStickyHeader() {
  const header = document.getElementById('header');

  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  // Initial check
  handleScroll();

  // Listen to scroll events (throttled for performance)
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (scrollTimeout) {
      window.cancelAnimationFrame(scrollTimeout);
    }

    scrollTimeout = window.requestAnimationFrame(() => {
      handleScroll();
    });
  });
}

/**
 * Hamburger Menu
 * Toggles mobile navigation menu
 */
function initHamburgerMenu() {
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');

  if (!hamburger || !nav) return;

  // Toggle menu on hamburger click
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    nav.classList.toggle('active');

    // Prevent body scroll when menu is open
    if (nav.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  // Close menu when clicking outside
  nav.addEventListener('click', (e) => {
    if (e.target === nav) {
      hamburger.classList.remove('active');
      nav.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // Close menu on window resize (if switching to desktop)
  window.addEventListener('resize', () => {
    if (window.innerWidth > 767) {
      hamburger.classList.remove('active');
      nav.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/**
 * Back to Top Button
 * Shows/hides button based on scroll position
 */
function initBackToTop() {
  const backToTopButton = document.getElementById('back-to-top');

  if (!backToTopButton) return;

  // Show/hide button based on scroll position
  const handleScroll = () => {
    if (window.scrollY > 500) {
      backToTopButton.classList.add('visible');
    } else {
      backToTopButton.classList.remove('visible');
    }
  };

  // Initial check
  handleScroll();

  // Listen to scroll events
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (scrollTimeout) {
      window.cancelAnimationFrame(scrollTimeout);
    }

    scrollTimeout = window.requestAnimationFrame(() => {
      handleScroll();
    });
  });

  // Scroll to top on click
  backToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * Modal Functions
 * Opens and closes modal
 */
function initModal() {
  const modal = document.getElementById('success-modal');
  if (!modal) return;

  const closeButtons = modal.querySelectorAll('.modal-close');

  closeButtons.forEach(button => {
    button.addEventListener('click', () => {
      closeModal();
    });
  });

  // Close modal when clicking outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/**
 * Open Modal
 */
function openModal(modalId = 'success-modal') {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

/**
 * Close Modal
 */
function closeModal(modalId = 'success-modal') {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/**
 * Utility: Throttle Function
 * Limits the rate at which a function can fire
 */
function throttle(func, delay) {
  let timeoutId;
  let lastExecTime = 0;

  return function(...args) {
    const currentTime = Date.now();

    if (currentTime - lastExecTime < delay) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        lastExecTime = currentTime;
        func.apply(this, args);
      }, delay);
    } else {
      lastExecTime = currentTime;
      func.apply(this, args);
    }
  };
}

/**
 * Utility: Debounce Function
 * Delays execution until after a period of inactivity
 */
function debounce(func, delay) {
  let timeoutId;

  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

/**
 * Image Slider
 * Handles the image slideshow in About section
 */
function initImageSlider() {
  const slider = document.querySelector('.image-slider');
  if (!slider) return;

  const images = slider.querySelectorAll('.slider-image');
  const dots = slider.querySelectorAll('.dot');
  const prevButton = slider.querySelector('.slider-prev');
  const nextButton = slider.querySelector('.slider-next');

  let currentIndex = 0;
  let autoPlayInterval;

  // Show specific slide
  function showSlide(index) {
    // Remove active class from all
    images.forEach(img => img.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    // Wrap around
    if (index >= images.length) {
      currentIndex = 0;
    } else if (index < 0) {
      currentIndex = images.length - 1;
    } else {
      currentIndex = index;
    }

    // Add active class to current
    images[currentIndex].classList.add('active');
    dots[currentIndex].classList.add('active');
  }

  // Next slide
  function nextSlide() {
    showSlide(currentIndex + 1);
  }

  // Previous slide
  function prevSlide() {
    showSlide(currentIndex - 1);
  }

  // Auto play
  function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlide, 4000); // Change every 4 seconds
  }

  function stopAutoPlay() {
    clearInterval(autoPlayInterval);
  }

  // Event listeners
  if (nextButton) {
    nextButton.addEventListener('click', () => {
      nextSlide();
    });
  }

  if (prevButton) {
    prevButton.addEventListener('click', () => {
      prevSlide();
    });
  }

  // Dot navigation
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
    });
  });

  // Touch support for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  slider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  slider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
      // Swipe left
      nextSlide();
    }
    if (touchEndX > touchStartX + 50) {
      // Swipe right
      prevSlide();
    }
  }
}

/**
 * Hero Slider
 * Handles the image slideshow in Hero section (click only, no auto-play)
 */
function initHeroSlider() {
  const slider = document.querySelector('.hero-slider');
  if (!slider) return;

  const images = slider.querySelectorAll('.hero-slider-image');
  const dots = slider.querySelectorAll('.hero-dot');
  const prevButton = slider.querySelector('.hero-slider-prev');
  const nextButton = slider.querySelector('.hero-slider-next');

  let currentIndex = 0;

  // Show specific slide
  function showSlide(index) {
    // Remove active class from all
    images.forEach(img => img.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    // Wrap around
    if (index >= images.length) {
      currentIndex = 0;
    } else if (index < 0) {
      currentIndex = images.length - 1;
    } else {
      currentIndex = index;
    }

    // Add active class to current
    images[currentIndex].classList.add('active');
    dots[currentIndex].classList.add('active');
  }

  // Next slide
  function nextSlide() {
    showSlide(currentIndex + 1);
  }

  // Previous slide
  function prevSlide() {
    showSlide(currentIndex - 1);
  }

  // Event listeners
  if (nextButton) {
    nextButton.addEventListener('click', () => {
      nextSlide();
    });
  }

  if (prevButton) {
    prevButton.addEventListener('click', () => {
      prevSlide();
    });
  }

  // Dot navigation
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
    });
  });

  // Touch support for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  slider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  slider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
      // Swipe left
      nextSlide();
    }
    if (touchEndX > touchStartX + 50) {
      // Swipe right
      prevSlide();
    }
  }
}

// Export functions for use in other scripts
window.openModal = openModal;
window.closeModal = closeModal;
window.throttle = throttle;
window.debounce = debounce;
