document.addEventListener('DOMContentLoaded', function() {
  // ===== Preloader =====
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    window.addEventListener('load', function() {
      setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
      }, 500);
    });
  }

  // ===== Mobile Navigation =====
  const menuToggle = document.getElementById('menu-toggle');
  const navList = document.getElementById('nav-list');
  
  if (menuToggle && navList) {
    menuToggle.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
      navList.classList.toggle('active');
      
      // Animate hamburger icon
      const spans = this.querySelectorAll('.menu-line');
      spans.forEach((span, index) => {
        if (!isExpanded) {
          if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
          if (index === 1) span.style.opacity = '0';
          if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
          span.style.transform = 'none';
          span.style.opacity = '1';
        }
      });
    });
  }

  // Close mobile menu when clicking on links
  const navLinks = document.querySelectorAll('.nav-list a');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (navList.classList.contains('active')) {
        navList.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        const spans = menuToggle.querySelectorAll('.menu-line');
        spans.forEach(span => {
          span.style.transform = 'none';
          span.style.opacity = '1';
        });
      }
    });
  });

  // ===== Smooth Scrolling =====
  const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
  smoothScrollLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Update URL without jumping
        history.pushState(null, null, targetId);
      }
    });
  });

  // ===== Header Scroll Effect =====
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', function() {
      const scrollPosition = window.scrollY;
      
      if (scrollPosition > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.backdropFilter = 'blur(15px)';
        header.style.boxShadow = '0 2px 25px rgba(74, 144, 226, 0.15)';
      } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
        header.style.boxShadow = '0 2px 20px rgba(74, 144, 226, 0.1)';
      }
    });
  }

  // ===== Services Tabs =====
  const tabButtons = document.querySelectorAll('.tab-btn');
  const serviceCategories = document.querySelectorAll('.service-category');
  
  if (tabButtons.length && serviceCategories.length) {
    tabButtons.forEach(button => {
      button.addEventListener('click', function() {
        const tabId = this.getAttribute('data-tab');
        
        // Update active tab
        tabButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        // Show corresponding content
        serviceCategories.forEach(content => {
          content.classList.remove('active');
        });
        document.getElementById(tabId).classList.add('active');
      });
    });
  }

  // ===== FAQ Accordion =====
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
      
      const answer = this.nextElementSibling;
      const icon = this.querySelector('i');
      
      if (isExpanded) {
        answer.style.maxHeight = '0';
        icon.style.transform = 'rotate(0deg)';
      } else {
        answer.style.maxHeight = answer.scrollHeight + 'px';
        icon.style.transform = 'rotate(180deg)';
      }
    });
  });

  // ===== Animated Statistics =====
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          statNumbers.forEach(stat => {
            const target = +stat.getAttribute('data-count');
            const duration = 2000;
            const step = target / (duration / 16);
            let count = 0;
            
            const counter = setInterval(() => {
              count += step;
              if (count >= target) {
                clearInterval(counter);
                count = target;
              }
              stat.textContent = Math.floor(count);
            }, 16);
          });
          observer.disconnect();
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(document.querySelector('.stats-container'));
  }

  // ===== Testimonial Slider =====
  const testimonialSlider = document.querySelector('.testimonials-slider');
  if (testimonialSlider) {
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID;
    
    testimonialSlider.addEventListener('mousedown', dragStart);
    testimonialSlider.addEventListener('touchstart', dragStart);
    testimonialSlider.addEventListener('mouseup', dragEnd);
    testimonialSlider.addEventListener('mouseleave', dragEnd);
    testimonialSlider.addEventListener('touchend', dragEnd);
    testimonialSlider.addEventListener('mousemove', drag);
    testimonialSlider.addEventListener('touchmove', drag);
    
    function dragStart(e) {
      if (e.type === 'touchstart') {
        startPos = e.touches[0].clientX;
      } else {
        startPos = e.clientX;
        e.preventDefault();
      }
      isDragging = true;
      animationID = requestAnimationFrame(animation);
    }
    
    function drag(e) {
      if (isDragging) {
        const currentPosition = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        currentTranslate = prevTranslate + currentPosition - startPos;
      }
    }
    
    function dragEnd() {
      isDragging = false;
      cancelAnimationFrame(animationID);
      
      // Snap to nearest card
      const cards = document.querySelectorAll('.testimonial-card');
      const cardWidth = cards[0].offsetWidth + 32; // width + gap
      const movedBy = Math.round(currentTranslate / cardWidth) * cardWidth;
      
      currentTranslate = movedBy;
      prevTranslate = currentTranslate;
      setSliderPosition();
    }
    
    function animation() {
      setSliderPosition();
      if (isDragging) requestAnimationFrame(animation);
    }
    
    function setSliderPosition() {
      testimonialSlider.style.transform = `translateX(${currentTranslate}px)`;
    }
  }

  // ===== Back to Top Button =====
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 300) {
        backToTop.style.opacity = '1';
        backToTop.style.visibility = 'visible';
      } else {
        backToTop.style.opacity = '0';
        backToTop.style.visibility = 'hidden';
      }
    });
    
    backToTop.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ===== Form Validation =====
  const appointmentForm = document.getElementById('appointment-form');
  if (appointmentForm) {
    appointmentForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const phoneInput = document.getElementById('phone');
      const serviceSelect = document.getElementById('service');
      
      clearErrorStates([nameInput, emailInput, phoneInput, serviceSelect]);
      
      let isValid = true;
      let errors = [];
      
      // Name validation
      if (!nameInput.value.trim()) {
        showFieldError(nameInput, 'Name is required');
        errors.push('Name is required');
        isValid = false;
      } else if (nameInput.value.trim().length < 2) {
        showFieldError(nameInput, 'Name must be at least 2 characters');
        errors.push('Name must be at least 2 characters');
        isValid = false;
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim()) {
        showFieldError(emailInput, 'Email is required');
        errors.push('Email is required');
        isValid = false;
      } else if (!emailRegex.test(emailInput.value.trim())) {
        showFieldError(emailInput, 'Please enter a valid email');
        errors.push('Please enter a valid email');
        isValid = false;
      }
      
      // Phone validation
      const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
      if (!phoneInput.value.trim()) {
        showFieldError(phoneInput, 'Phone number is required');
        errors.push('Phone number is required');
        isValid = false;
      } else if (!phoneRegex.test(phoneInput.value.trim())) {
        showFieldError(phoneInput, 'Please enter a valid phone number');
        errors.push('Please enter a valid phone number');
        isValid = false;
      }
      
      // Service validation
      if (!serviceSelect.value) {
        showFieldError(serviceSelect, 'Please select a service');
        errors.push('Please select a service');
        isValid = false;
      }
      
      if (isValid) {
        showSuccessMessage('Thank you! We will contact you shortly.');
        setTimeout(() => {
          appointmentForm.reset();
        }, 3000);
        
        // In a real implementation, you would submit the form here
        // appointmentForm.submit();
      } else {
        showErrorSummary(errors);
      }
    });
    
    // Real-time validation feedback
    const formInputs = document.querySelectorAll('#appointment-form input, #appointment-form select');
    formInputs.forEach(input => {
      input.addEventListener('input', function() {
        if (this.classList.contains('error')) {
          this.classList.remove('error');
          const formGroup = this.closest('.form-group');
          if (formGroup) formGroup.classList.remove('has-error');
          const errorMsg = formGroup.querySelector('.error-message');
          if (errorMsg) errorMsg.remove();
        }
      });
    });
  }

  // ===== Scroll Animations =====
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.service-card, .testimonial-card, .feature-item, .member-info');
    elements.forEach(el => {
      const elementTop = el.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (elementTop < windowHeight * 0.75) {
        el.classList.add('fade-in');
      }
    });
  };
  
  window.addEventListener('scroll', animateOnScroll);
  animateOnScroll(); // Initialize

  // ===== Utility Functions =====
  function showFieldError(field, message) {
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;
    
    field.classList.add('error');
    formGroup.classList.add('has-error');
    
    // Remove existing error
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) existingError.remove();
    
    // Create new error
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    formGroup.appendChild(errorDiv);
  }

  function clearErrorStates(fields) {
    fields.forEach(field => {
      field.classList.remove('error');
      const formGroup = field.closest('.form-group');
      if (formGroup) {
        formGroup.classList.remove('has-error');
        const errorMsg = formGroup.querySelector('.error-message');
        if (errorMsg) errorMsg.remove();
      }
    });
    
    // Clear error summary
    const errorSummary = document.querySelector('.error-summary');
    if (errorSummary) errorSummary.remove();
  }

  function showErrorSummary(errors) {
    // Remove existing summary
    const existingSummary = document.querySelector('.error-summary');
    if (existingSummary) existingSummary.remove();
    
    const summaryDiv = document.createElement('div');
    summaryDiv.className = 'error-summary';
    
    const summaryTitle = document.createElement('strong');
    summaryTitle.textContent = 'Please fix these issues:';
    summaryDiv.appendChild(summaryTitle);
    
    const errorList = document.createElement('ul');
    errorList.className = 'error-list';
    
    errors.forEach(error => {
      const item = document.createElement('li');
      item.textContent = error;
      errorList.appendChild(item);
    });
    
    summaryDiv.appendChild(errorList);
    
    const formMessages = document.getElementById('form-messages') || appointmentForm;
    formMessages.appendChild(summaryDiv);
    
    summaryDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function showSuccessMessage(message) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.error-summary, .success-message');
    existingMessages.forEach(msg => msg.remove());
    
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
      <i class="fas fa-check-circle"></i>
      <span>${message}</span>
    `;
    
    const formMessages = document.getElementById('form-messages') || appointmentForm;
    formMessages.appendChild(successDiv);
    
    successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // ===== Service Worker Registration =====
  if ('serviceWorker' in navigator && window.location.hostname !== 'localhost') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('ServiceWorker registration successful');
        })
        .catch(err => {
          console.log('ServiceWorker registration failed: ', err);
        });
    });
  }

  console.log('LUMEN website initialized');
});
