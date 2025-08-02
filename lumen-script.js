document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navList = document.getElementById('nav-list');
    
    if (menuToggle && navList) {
        menuToggle.addEventListener('click', function() {
            navList.classList.toggle('active');
            
            // Animate hamburger menu
            const spans = menuToggle.querySelectorAll('span');
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
                const spans = menuToggle.querySelectorAll('span');
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
            }
        });
    });

    // Header scroll effect
    const header = document.querySelector('.header');
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
                
                // Log form data (in real implementation, this would be sent to server)
                console.log('Appointment form submitted successfully:', {
                    name: nameInput.value.trim(),
                    email: emailInput.value.trim(),
                    phone: phoneInput.value.trim(),
                    service: serviceSelect.value,
                    message: messageTextarea.value.trim(),
                    timestamp: new Date().toISOString()
                });
                
                // Reset form after a delay
                setTimeout(() => {
                    this.reset();
                    hideSuccessMessage(this);
                }, 8000);
                
                // Send notification email (simulated)
                simulateEmailNotification({
                    name: nameInput.value.trim(),
                    email: emailInput.value.trim(),
                    phone: phoneInput.value.trim(),
                    service: serviceSelect.value,
                    message: messageTextarea.value.trim()
                });
            } else {
                // Show error summary
                showErrorSummary(this, errors);
            }
        });
    }

    // Utility Functions
    function showFieldError(field, message) {
        field.style.borderColor = '#dc3545';
        field.style.backgroundColor = '#fff5f5';
        
        // Remove existing error message
        const existingError = field.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        field.parentElement.appendChild(errorDiv);
    }

    function clearErrorStates(fields) {
        fields.forEach(field => {
            field.style.borderColor = '#e0e0e0';
            field.style.backgroundColor = '#fff';
            
            const errorMessage = field.parentElement.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
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
        errorList.style.marginTop = '0.5rem';
        errorList.style.marginBottom = '0';
        errorList.style.paddingLeft = '1.5rem';
        
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
            <i class="fas fa-check-circle" style="margin-right: 0.5rem; color: #28a745;"></i>
            ${message}
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

    function simulateEmailNotification(formData) {
        // Simulate sending email notification to clinic
        console.log('Email notification sent to clinic:', {
            to: 'drdk2025@gmail.com',
            subject: `New Appointment Request - ${formData.service}`,
            body: `
                New appointment request received:
                
                Name: ${formData.name}
                Email: ${formData.email}
                Phone: ${formData.phone}
                Service: ${formData.service}
                Message: ${formData.message || 'No additional message'}
                
                Please contact the patient to confirm the appointment.
            `,
            timestamp: new Date().toISOString()
        });
    }

    // ... (Keep all other existing functions like trackEvent, etc.)

    console.log('LUMEN Speech and Hearing Care website initialized successfully');
});

// Service Worker registration (only if you have sw.js)
if ('serviceWorker' in navigator && window.location.hostname !== 'localhost') {
    navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('Service Worker registered'))
        .catch(err => console.error('Service Worker registration failed:', err));
}
