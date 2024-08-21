document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Form submission
    const form = document.getElementById('contact-form');
    const contactMessage = document.getElementById('contact-message');
    const contactFollowup = document.querySelector('.contact-followup');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Collect form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Simulate form submission (replace with actual form submission logic)
            fetch('/submit-form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then(handleErrors)
            .then(response => response.json())
            .then(result => {
                form.reset();
                showMessage('Thank you for your message. We will get in touch soon!', 'success');
            })
            .catch(error => {
                console.error('Error:', error);
                showMessage('An error occurred: ' + error.message, 'error');
            });
        });
    }

    function handleErrors(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }

    function showMessage(message, type) {
        if (contactMessage) {
            contactMessage.textContent = message;
            contactMessage.className = type;
            contactMessage.style.display = 'block';
            
            if (type === 'success' && contactFollowup) {
                contactFollowup.style.display = 'block';
                contactFollowup.style.opacity = '1';
            }
            
            // Scroll to the contact message
            contactMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            setTimeout(() => {
                contactMessage.style.display = 'none';
                if (type === 'success' && contactFollowup) {
                    contactFollowup.style.opacity = '0';
                    setTimeout(() => {
                        contactFollowup.style.display = 'none';
                    }, 1000);
                }
            }, 5000);
        }
    }

    // Initialize AOS if it's being used
    if (typeof AOS !== 'undefined') {
        AOS.init();
    }
});