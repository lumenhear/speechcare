document.addEventListener('DOMContentLoaded', function() {
  // Mobile Menu Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const navList = document.getElementById('nav-list');
  
  menuToggle.addEventListener('click', function() {
    navList.classList.toggle('active');
    this.classList.toggle('active');
  });

  // Services Tab Switching
  const tabBtns = document.querySelectorAll('.tab-btn');
  const serviceCategories = document.querySelectorAll('.service-category');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // Remove active class from all buttons and categories
      tabBtns.forEach(b => b.classList.remove('active'));
      serviceCategories.forEach(cat => cat.classList.remove('active'));
      
      // Add active class to clicked button and corresponding category
      this.classList.add('active');
      const tabId = this.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
    });
  });

  // Animate Stats Counting
  const statNumbers = document.querySelectorAll('.stat-number');
  
  function animateStats() {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-count'));
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
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains('stats-container')) {
          animateStats();
        }
        entry.target.classList.add('animate');
      }
    });
  }, { threshold: 0.1 });

  // Observe elements that need animation
  document.querySelectorAll('.stats-container, .service-card, .testimonial-card').forEach(el => {
    observer.observe(el);
  });

  // FAQ Accordion
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
      const answer = this.nextElementSibling;
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      
      // Toggle aria attributes
      this.setAttribute('aria-expanded', !isExpanded);
      answer.setAttribute('aria-hidden', isExpanded);
      
      // Toggle active class
      this.parentElement.classList.toggle('active');
    });
  });

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId !== '#') {
        document.querySelector(targetId).scrollIntoView({
          behavior: 'smooth'
        });
        
        // Close mobile menu if open
        if (navList.classList.contains('active')) {
          navList.classList.remove('active');
          menuToggle.classList.remove('active');
        }
      }
    });
  });

  // Form Submission
  const appointmentForm = document.getElementById('appointment-form');
  if (appointmentForm) {
    appointmentForm.addEventListener('submit', function(e) {
      e.preventDefault();
      // Here you would typically send the form data to your server
      // For now, we'll just show a success message
      const formMessages = document.getElementById('form-messages');
      formMessages.innerHTML = '<div class="success-message">Thank you! Your appointment request has been sent.</div>';
      this.reset();
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
