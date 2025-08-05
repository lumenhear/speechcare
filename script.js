document.addEventListener('DOMContentLoaded', function() {
  // Mobile Menu Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const navList = document.getElementById('nav-list');
  
  if (menuToggle && navList) {
    menuToggle.addEventListener('click', function() {
      navList.classList.toggle('active');
      this.classList.toggle('active');
      this.setAttribute('aria-expanded', this.classList.contains('active'));
    });
  }

  // Services Tab Switching
  const tabBtns = document.querySelectorAll('.tab-btn');
  const serviceCategories = document.querySelectorAll('.service-category');
  
  if (tabBtns.length && serviceCategories.length) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        // Remove active class from all buttons and categories
        tabBtns.forEach(b => b.classList.remove('active'));
        serviceCategories.forEach(cat => cat.classList.remove('active'));
        
        // Add active class to clicked button and corresponding category
        this.classList.add('active');
        const tabId = this.getAttribute('data-tab');
        if (tabId) {
          const targetCategory = document.getElementById(tabId);
          if (targetCategory) targetCategory.classList.add('active');
        }
      });
    });
  }

  // Animate Stats Counting
  const statNumbers = document.querySelectorAll('.stat-number');
  
  function animateStats() {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-count')) || 0;
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;
      
      const counter = setInterval(() => {
        current += step;
        if (current >= target) {
          clearInterval(counter);
          current = target;
        }
        stat.textContent = Math.floor(current);
      }, 16);
    });
  }

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains('stats-container')) {
          animateStats();
          observer.unobserve(entry.target); // Stop observing after animation
        }
        entry.target.classList.add('animate');
      }
    });
  }, observerOptions);

  // Observe elements that need animation
  const animateElements = document.querySelectorAll('.stats-container, .service-card, .testimonial-card, .feature');
  animateElements.forEach(el => {
    if (el) observer.observe(el);
  });

  // FAQ Accordion
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
      const answer = this.nextElementSibling;
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      
      // Toggle aria attributes
      this.setAttribute('aria-expanded', !isExpanded);
      if (answer) answer.setAttribute('aria-hidden', isExpanded);
      
      // Toggle active class on parent
      const parent = this.parentElement;
      if (parent) parent.classList.toggle('active');
    });
  });

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth'
          });
          
          // Close mobile menu if open
          if (navList && navList.classList.contains('active')) {
            navList.classList.remove('active');
            if (menuToggle) {
              menuToggle.classList.remove('active');
              menuToggle.setAttribute('aria-expanded', 'false');
            }
          }
        }
      }
    });
  });

  // Form Submission
  const appointmentForm = document.getElementById('appointment-form');
  if (appointmentForm) {
    appointmentForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const formMessages = document.getElementById('form-messages');
      if (formMessages) {
        formMessages.innerHTML = '<div class="success-message">Thank you! Your appointment request has been sent. We will contact you shortly.</div>';
      }
      this.reset();
      
      // In a real implementation, you would add AJAX/fetch code here
      // For now, we'll simulate a successful submission
      setTimeout(() => {
        if (formMessages) {
          formMessages.innerHTML = '';
        }
      }, 5000);
    });
  }

  // Back to Top Button
  const backToTopButton = document.querySelector('.back-to-top');
  if (backToTopButton) {
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
        backToTopButton.classList.add('visible');
      } else {
        backToTopButton.classList.remove('visible');
      }
    });
    
    backToTopButton.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Preloader
  window.addEventListener('load', function() {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 500);
    }
  });
});
