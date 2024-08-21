// Implement animation logic for the AI demo infographic

// Get the infographic container element
const infographicContainer = document.querySelector('.ai-infographic');

// Define the animation steps
const animationSteps = [
  {
    // Step 1: Fade in the background
    selector: '.background',
    animation: 'fadeIn',
    duration: 1000
  },
  {
    // Step 2: Animate the AI agent
    selector: '.ai-agent',
    animation: 'moveFromLeft',
    duration: 1500
  },
  {
    // Step 3: Animate the data points
    selector: '.data-point',
    animation: 'fadeIn',
    duration: 1000,
    delay: 500
  },
  {
    // Step 4: Animate the decision-making process
    selector: '.decision-process',
    animation: 'fadeIn',
    duration: 1000,
    delay: 1000
  },
  {
    // Step 5: Animate the output
    selector: '.output',
    animation: 'fadeIn',
    duration: 1000,
    delay: 1500
  }
];

// Define the animation functions
function fadeIn(element) {
  element.style.opacity = 0;
  element.style.animation = 'fadeIn 1s forwards';
}

function moveFromLeft(element) {
  element.style.transform = 'translateX(-100%)';
  element.style.animation = 'moveFromLeft 1.5s forwards';
}

// Start the animation
animationSteps.forEach((step) => {
  const elements = infographicContainer.querySelectorAll(step.selector);
  elements.forEach((element) => {
    switch (step.animation) {
      case 'fadeIn':
        fadeIn(element);
        break;
      case 'moveFromLeft':
        moveFromLeft(element);
        break;
    }
  });
});

// Header scroll effect
const header = document.querySelector('header');
const headerHeight = header.offsetHeight;

window.addEventListener('scroll', () => {
  if (window.scrollY > headerHeight) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('show');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (event) => {
  const isClickInside = navLinks.contains(event.target) || menuToggle.contains(event.target);
  if (!isClickInside && navLinks.classList.contains('show')) {
    navLinks.classList.remove('show');
  }
});

// Update active link on scroll
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= sectionTop - headerHeight) {
      current = section.getAttribute('id');
    }
  });

  navItems.forEach((item) => {
    item.classList.remove('active');
    if (item.getAttribute('href').slice(1) === current) {
      item.classList.add('active');
    }
  });
});