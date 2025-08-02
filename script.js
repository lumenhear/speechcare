document.addEventListener('DOMContentLoaded', function() {
    // Preloader
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
            }, 500);
        });
    }

    // Mobile Navigation Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navList = document.getElementById('nav-list');
    
    if (menuToggle && navList) {
        menuToggle.addEventListener('click', function() {
            navList.classList.toggle('active');
            this.setAttribute('aria-expanded', navList.classList.contains('active'));
            
            // Animate hamburger menu
            const spans = this.querySelectorAll('.menu-line');
            spans.forEach((span, index) => {
                if (navList.classList.contains('active')) {
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

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-list a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navList && navList.classList.contains('active')) {
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

    // Smooth scrolling for navigation links
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.hash !== "") {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update URL without jumping
                    if (history.pushState) {
                        history.pushState(null, null, targetId);
                    } else {
                        window.location.hash = targetId;
                    }
                }
            }
        });
    });

    // Header scroll effect
    const header = document.querySelector('.header');
    if (header) {
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.backdropFilter = 'blur(15px)';
                header.style.boxShadow = '0 2px 25px rgba(74, 144, 226, 0.15)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
                header.style.boxShadow = '0 2px 20px rgba(74, 144, 226, 0.1)';
            }
            
            lastScrollTop = scrollTop;
        });
    }

    // Service Tabs
    const serviceTabs = document.querySelectorAll('.tab-btn');
    if (serviceTabs.length > 0) {
        serviceTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                // Update active tab
                serviceTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // Show corresponding content
                document.querySelectorAll('.service-category').forEach(content => {
                    content.classList.remove('active');
                });
                document.getElementById(tabId).classList.add('active');
            });
        });
    }

    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            
            const answer = this.nextElementSibling;
            if (isExpanded) {
                answer.style.maxHeight = '0';
            } else {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
            
            // Rotate icon
            const icon = this.querySelector('i');
            icon.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(180deg)';
        });
    });

    // Animated Statistics
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    statNumbers.forEach(stat => {
                        const target = parseInt(stat.getAttribute('data-count'));
                        const duration = 2000;
                        const start = 0;
                        const increment = target / (duration / 16);
                        
                        let current = start;
                        const timer = setInterval(() => {
                            current += increment;
                            if (current >= target) {
                                clearInterval(timer);
                                current = target;
                            }
                            stat.textContent = Math.floor(current);
                        }, 16);
                    });
                    observer.disconnect();
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(document.querySelector('.stats-container'));
    }

    // Back to Top Button
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
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

    // Form Validation and Submission
    const appointmentForm = document.getElementById('appointment-form');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form elements
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const phoneInput = document.getElementById('phone');
            const serviceSelect = document.getElementById('service');
            const messageTextarea = document.getElementById('message');
            
            // Clear previous error states
            clearErrorStates([nameInput, emailInput, phoneInput, serviceSelect]);
            
            let isValid = true;
            let errors = [];
            
            // Validate name
            if (!nameInput.value.trim()) {
                showFieldError(nameInput, 'Name is required');
                errors.push('Name is required');
                isValid = false;
            } else if (nameInput.value.trim().length < 2) {
                showFieldError(nameInput, 'Name must be at least 2 characters');
                errors.push('Name must be at least 2 characters');
                isValid = false;
            }
            
            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim()) {
                showFieldError(emailInput, 'Email is required');
                errors.push('Email is required');
                isValid = false;
            } else if (!emailRegex.test(emailInput.value.trim())) {
                showFieldError(emailInput, 'Please enter a valid email address');
                errors.push('Please enter a valid email address');
                isValid = false;
            }
            
            // Validate phone
            const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
            if (!phoneInput.value.trim()) {
                showFieldError(phoneInput, 'Phone number is required');
                errors.push('Phone number is required');
                isValid = false;
            } else if (!phoneRegex.test(phoneInput.value.trim())) {
                showFieldError(phoneInput, 'Please enter a valid phone number (minimum 10 digits)');
                errors.push('Please enter a valid phone number');
                isValid = false;
            }
            
            // Validate service selection
            if (!serviceSelect.value) {
                showFieldError(serviceSelect, 'Please select a service');
                errors.push('Please select a service');
                isValid = false;
            }
            
            if (isValid) {
                // Show success message
                showSuccessMessage(this, 'Thank you for your appointment request! We will contact you within 24 hours to confirm your appointment.');
                
                // Submit form data (using FormSubmit.co)
                this.submit();
                
                // Reset form after a delay
                setTimeout(() => {
                    this.reset();
                    hideSuccessMessage(this);
                }, 8000);
            } else {
                // Show error summary
                showErrorSummary(this, errors);
            }
        });
    }

    // Scroll animations
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.service-card, .testimonial-card, .contact-item, .about-text, .member-info');
        elements.forEach(el => {
            const elementPosition = el.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                el.classList.add('fade-in');
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on load

    // Utility Functions
    function showFieldError(field, message) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;
        
        field.classList.add('error');
        formGroup.classList.add('has-error');
        
        // Remove existing error message
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
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
                
                const errorMessage = formGroup.querySelector('.error-message');
                if (errorMessage) {
                    errorMessage.remove();
                }
            }
        });
        
        // Clear error summary
        const errorSummary = document.querySelector('.error-summary');
        if (errorSummary) {
            errorSummary.remove();
        }
    }

    function showErrorSummary(form, errors) {
        // Remove existing error summary
        const existingErrorSummary = form.querySelector('.error-summary');
        if (existingErrorSummary) {
            existingErrorSummary.remove();
        }
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-summary';
        
        const errorTitle = document.createElement('strong');
        errorTitle.textContent = 'Please correct the following errors:';
        errorDiv.appendChild(errorTitle);
        
        const errorList = document.createElement('ul');
        errorList.className = 'error-list';
        
        errors.forEach(error => {
            const listItem = document.createElement('li');
            listItem.textContent = error;
            errorList.appendChild(listItem);
        });
        
        errorDiv.appendChild(errorList);
        
        const formMessages = document.getElementById('form-messages');
        if (formMessages) {
            formMessages.appendChild(errorDiv);
        } else {
            form.appendChild(errorDiv);
        }
        
        // Scroll to error summary
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function showSuccessMessage(form, message) {
        // Remove existing messages
        const existingMessages = form.querySelectorAll('.error-summary, .success-message');
        existingMessages.forEach(msg => msg.remove());
        
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        
        const formMessages = document.getElementById('form-messages');
        if (formMessages) {
            formMessages.appendChild(successDiv);
        } else {
            form.appendChild(successDiv);
        }
        
        // Scroll to success message
        successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function hideSuccessMessage(form) {
        const successMessage = form.querySelector('.success-message');
        if (successMessage) {
            successMessage.style.opacity = '0';
            successMessage.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                successMessage.remove();
            }, 500);
        }
    }

    console.log('LUMEN Speech and Hearing Care website initialized successfully');
});

// Service Worker registration
if ('serviceWorker' in navigator && window.location.hostname !== 'localhost') {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('Service Worker registered'))
            .catch(err => console.error('Service Worker registration failed:', err));
    });
}
