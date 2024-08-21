document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling
    const scroll = new SmoothScroll('a[href*="#"]', {
        speed: 800,
        speedAsDuration: true,
        easing: 'easeInOutCubic', // Add easing function for smoother scrolling
        offset: 80 // Offset for fixed header
    });

    // Add active class to navigation links
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section');

    function changeLinkState() {
        let index = sections.length;

        while(--index && window.scrollY + 100 < sections[index].offsetTop) {}
        
        navLinks.forEach((link) => link.classList.remove('active'));
        navLinks[index].classList.add('active');
    }

    changeLinkState();
    window.addEventListener('scroll', changeLinkState);

    // Add click animation to buttons
    const buttons = document.querySelectorAll('.btn, .nav-links a');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            this.classList.add('btn-click');
            setTimeout(() => {
                this.classList.remove('btn-click');
            }, 300);
        });
    });

    // Responsive menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinksContainer.classList.toggle('show');
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
        const isClickInside = navLinksContainer.contains(event.target) || menuToggle.contains(event.target);
        if (!isClickInside && navLinksContainer.classList.contains('show')) {
            navLinksContainer.classList.remove('show');
        }
    });

    // Smooth appearance of elements on scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    // Add this to your existing script.js file or create a new one
    const fadeElements = document.querySelectorAll('.fade-in');

    function checkFade() {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;

            if (elementTop < window.innerHeight && elementBottom > 0) {
                element.classList.add('visible');
            }
        });
    }

    window.addEventListener('scroll', checkFade);
    window.addEventListener('resize', checkFade);
    checkFade(); // Check on initial load

    // Accessibility improvements
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Validate form fields
            let isValid = true;
            
            if (!data.name.trim()) {
                showFormError(form.elements.name, 'Please enter your name');
                isValid = false;
            } else {
                clearFormError(form.elements.name);
            }
            
            if (!data.email.trim() || !isValidEmail(data.email)) {
                showFormError(form.elements.email, 'Please enter a valid email address');
                isValid = false;
            } else {
                clearFormError(form.elements.email);
            }
            
            if (!data.message.trim()) {
                showFormError(form.elements.message, 'Please enter a message');
                isValid = false;
            } else {
                clearFormError(form.elements.message);
            }
            
            if (!isValid) {
                return;
            }
            
            // Proceed with form submission if valid
            // ... (existing submission code)
        });
    }

    function showFormError(inputElement, message) {
        const errorId = `${inputElement.id}-error`;
        let errorElement = document.getElementById(errorId);
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.id = errorId;
            errorElement.className = 'error-message';
            inputElement.parentNode.insertBefore(errorElement, inputElement.nextSibling);
        }
        
        errorElement.textContent = message;
        inputElement.setAttribute('aria-invalid', 'true');
        inputElement.setAttribute('aria-describedby', errorId);
    }

    function clearFormError(inputElement) {
        const errorId = `${inputElement.id}-error`;
        const errorElement = document.getElementById(errorId);
        
        if (errorElement) {
            errorElement.remove();
        }
        
        inputElement.removeAttribute('aria-invalid');
        inputElement.removeAttribute('aria-describedby');
    }

    function isValidEmail(email) {
        // Basic email validation regex
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Add this to your existing script.js file, inside the DOMContentLoaded event listener
    const processSteps = document.querySelectorAll('.process-step');

    const processObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    });

    processSteps.forEach(step => {
        processObserver.observe(step);
    });
});