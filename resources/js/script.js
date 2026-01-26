// ==================== ORBITAL MENU TOGGLE ====================
const burgerBtn = document.querySelector('label[for="check"]');
const closeBtn = document.querySelector('.menu-close-btn');
const menu = document.querySelector('.orbital-menu');
const menuLinks = document.querySelectorAll('.orbital-menu a');

// Open menu
if (burgerBtn) {
  burgerBtn.addEventListener('click', () => {
    menu.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  });
}

// Close menu
if (closeBtn) {
  closeBtn.addEventListener('click', () => {
    menu.classList.remove('is-active');
    document.body.style.overflow = '';
  });
}

// Close menu when clicking links
menuLinks.forEach(link => {
  link.addEventListener('click', () => {
    menu.classList.remove('is-active');
    document.body.style.overflow = '';
  });
});

// ==================== SHOOTING STARS ANIMATION ====================
const night = document.querySelector('.night');
let numStars = 0;

// Ultra-aggressive reduction for mobile performance
if (screen.width < 480) {
  numStars = 2; // Minimal stars for small phones
} else if (screen.width < 768) {
  numStars = 3; // Still minimal for tablets
} else {
  numStars = 15; // Reduced from 20 for better performance
}

// Hide sparkle animation on all mobile
if (screen.width < 768) {
  const sparkles = document.querySelectorAll('.sparkle');
  sparkles.forEach(sparkle => sparkle.style.display = 'none');
}


for (let i = 0; i < numStars; i++) {
  const star = document.createElement('div');
  star.classList.add('shooting_star');

  // Randomize positions
  const topPosition = Math.random() * 100; // Random percentage for top
  const leftPosition = Math.random() * 100; // Random percentage for left
  const delay = Math.random() * 25; // Random delay between 0-10 seconds

  // Apply the random styles
  star.style.top = `${topPosition}vh`;
  star.style.left = `${leftPosition}vw`;
  star.style.animationDelay = `${delay}s`;
  star.style.animationDuration = `${3 + Math.random()}s`; // Add randomness to animation duration

  night.appendChild(star);
}


const homeCard = document.querySelector('.home-card');

// ==================== TOUCH DEVICE DETECTION ====================
// Only enable 3D tilt on desktop devices with mouse input
const isTouchDevice = () => {
  return (('ontouchstart' in window) ||
     (navigator.maxTouchPoints > 0) ||
     (navigator.msMaxTouchPoints > 0));
};

// CRITICAL: Only attach physics on desktop
if (!isTouchDevice() && homeCard) {
  document.addEventListener('mousemove', (event) => {
    rotateElement(event, homeCard);
  });
}

function rotateElement(event, element) {
    const x = event.clientX;
    const y = event.clientY;

    const middleX = window.innerWidth / 2;
    const middleY = window.innerHeight / 2;

    const offsetX = ((x - middleX) / middleX) * 45;
    const offsetY = ((y - middleY) / middleY) * 45;

    element.style.setProperty("--rotateX", -1 * offsetY + "deg");
    element.style.setProperty("--rotateY", offsetX + "deg");
}

// ==================== CONSTELLATION LOGIC ====================
const canvas = document.getElementById('skillsConstellation');

// PERFORMANCE: Disable constellation on mobile devices
const isMobile = window.innerWidth <= 768;

if (canvas && !isMobile) {
  const ctx = canvas.getContext('2d');

  // Define skill connections (based on CV technology relationships)
  const connections = [
    { from: 'PHP', to: 'Laravel' },
    { from: 'TypeScript', to: 'Next.js' },
    { from: 'JavaScript', to: 'React Native' },
    { from: 'Next.js', to: 'Supabase' },
    { from: 'Python', to: 'Ollama' },
    { from: 'JavaScript', to: 'Next.js' },
    { from: 'Next.js', to: 'React Native' },
    { from: 'Laravel', to: 'MySQL' },
    { from: 'Tailwind CSS', to: 'Next.js' },
    { from: 'Tailwind CSS', to: 'React Native' },
    { from: 'Git', to: 'AWS' },
    { from: 'MySQL', to: 'Supabase' },
    { from: 'Kotlin', to: 'Java' }, 
  ];

  let skillPositions = new Map();
  let hoveredSkill = null;

  function calculateConnections(highlightSkill = null) {
    // Set canvas size to match skills section
    const skillsSection = document.getElementById('skills');
    if (!skillsSection) return;

    canvas.width = skillsSection.offsetWidth;
    canvas.height = skillsSection.offsetHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Get all skill items
    const skillItems = document.querySelectorAll('.skill-item');
    skillPositions.clear();

    // Calculate center positions for each skill
    skillItems.forEach(item => {
      const skillName = item.querySelector('.skill-name').textContent;
      const rect = item.getBoundingClientRect();
      const sectionRect = skillsSection.getBoundingClientRect();

      const centerX = rect.left - sectionRect.left + rect.width / 2;
      const centerY = rect.top - sectionRect.top + rect.height / 2;

      skillPositions.set(skillName, { x: centerX, y: centerY });
    });

    // Draw connections
    connections.forEach(conn => {
      const fromPos = skillPositions.get(conn.from);
      const toPos = skillPositions.get(conn.to);

      if (fromPos && toPos) {
        // Check if this connection should be highlighted
        const isHighlighted = highlightSkill && 
          (conn.from === highlightSkill || conn.to === highlightSkill);

        ctx.strokeStyle = isHighlighted 
          ? 'rgba(105, 255, 240, 0.8)' 
          : 'rgba(105, 255, 240, 0.2)';
        ctx.lineWidth = isHighlighted ? 2 : 1;

        ctx.beginPath();
        ctx.moveTo(fromPos.x, fromPos.y);
        ctx.lineTo(toPos.x, toPos.y);
        ctx.stroke();
      }
    });
  }

  // Initial draw
  setTimeout(() => calculateConnections(), 100);

  // Redraw on window resize - THROTTLED
  let resizeTimeout;
  let lastResizeTime = 0;
  
  window.addEventListener('resize', () => {
    const now = Date.now();
    
    // Throttle: Maximum once every 250ms during resize
    if (now - lastResizeTime < 250) {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        calculateConnections(hoveredSkill);
        lastResizeTime = Date.now();
      }, 250);
    } else {
      calculateConnections(hoveredSkill);
      lastResizeTime = now;
    }
  });

  // Redraw when scrolling into view (for initial load)
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        calculateConnections(hoveredSkill);
      }
    });
  });
  observer.observe(document.getElementById('skills'));

  // Add hover listeners to skill items
  document.querySelectorAll('.skill-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      hoveredSkill = item.querySelector('.skill-name').textContent;
      calculateConnections(hoveredSkill);
    });

    item.addEventListener('mouseleave', () => {
      hoveredSkill = null;
      calculateConnections(null);
    });
  });
}

// ==================== PROJECTS DATA (Source of Truth) ====================
const projects = [
  {
    id: 1,
    title: "LarahBigDeck",
    image: "/images/backgrounds/larahbigdeck-cover.jpg",
    description: "A Flashcard Learning App with AI integration.",
    stack: ["Next.js", "TypeScript", "Supabase", "Google Gemini"],
    links: {
      demo: "#",
      source: "#"
    }
  },
  {
    id: 2,
    title: "Bong Dental Clinic",
    image: "/assets/bongdental-cover.png",
    description: "A web-based booking system for a dental clinic.",
    stack: ["HTML", "CSS", "JavaScript (Vanilla)"],
    links: {
      demo: "https://yatoyataro.github.io/Bong-Dental-Clinic/"
    }
  },
  {
    id: 3,
    title: "Calamansee (Android AI)",
    image: "/assets/calamansee-cover.png",
    description: "On-device disease detection app with custom CameraX backend and TFLite inference.",
    stack: ["Kotlin", "Android Jetpack", "CameraX", "TensorFlow Lite", "Room"],
    links: {
      source: "#"
    }
  }
];

// ==================== PROJECTS RENDERING ====================
function renderProjects() {
  const projectsSection = document.getElementById('projects-section');
  if (!projectsSection) return;

  const projectsGrid = projectsSection.querySelector('.projects-grid');
  if (!projectsGrid) return;

  projectsGrid.innerHTML = '';

  projects.forEach(project => {
    // Create entrance wrapper
    const entranceWrapper = document.createElement('div');
    entranceWrapper.className = 'card-entrance-wrapper';

    const projectCard = document.createElement('article');
    projectCard.className = 'project-card';

    // Card Visual
    const cardVisual = document.createElement('div');
    cardVisual.className = 'card-visual';
    const img = document.createElement('img');
    img.src = project.image;
    img.alt = project.title;
    cardVisual.appendChild(img);

    // Card Content
    const cardContent = document.createElement('div');
    cardContent.className = 'card-content';

    const title = document.createElement('h3');
    title.textContent = project.title;

    const description = document.createElement('p');
    description.textContent = project.description;

    const techStack = document.createElement('div');
    techStack.className = 'tech-stack';
    project.stack.forEach(tech => {
      const techItem = document.createElement('span');
      techItem.className = 'tech-item';
      techItem.textContent = tech;
      techStack.appendChild(techItem);
    });

    cardContent.appendChild(title);
    cardContent.appendChild(description);
    cardContent.appendChild(techStack);

    // Card Actions
    const cardActions = document.createElement('div');
    cardActions.className = 'card-actions';

    if (project.links.demo) {
      const demoBtn = document.createElement('a');
      demoBtn.href = project.links.demo;
      demoBtn.className = 'btn-demo';
      demoBtn.textContent = 'Live Demo';
      demoBtn.target = '_blank';
      cardActions.appendChild(demoBtn);
    }

    if (project.links.source) {
      const sourceBtn = document.createElement('a');
      sourceBtn.href = project.links.source;
      sourceBtn.className = 'btn-source';
      sourceBtn.textContent = 'Source Code';
      sourceBtn.target = '_blank';
      cardActions.appendChild(sourceBtn);
    }

    projectCard.appendChild(cardVisual);
    projectCard.appendChild(cardContent);
    projectCard.appendChild(cardActions);

    entranceWrapper.appendChild(projectCard);
    projectsGrid.appendChild(entranceWrapper);
  });
}

// Initialize projects on page load
document.addEventListener('DOMContentLoaded', () => {
  renderProjects();
  initializeEntranceAnimation();
  initialize3DTilt();
});

// ==================== CINEMATIC ENTRANCE ANIMATION ====================
function initializeEntranceAnimation() {
  const wrappers = document.querySelectorAll('.card-entrance-wrapper');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, {
    threshold: 0.1
  });
  
  // Observe each wrapper with staggered delay
  wrappers.forEach((wrapper, index) => {
    wrapper.style.transitionDelay = (index * 150) + 'ms';
    observer.observe(wrapper);
  });
}

// ==================== 3D TILT PHYSICS ENGINE ====================
function initialize3DTilt() {
  const projectCards = document.querySelectorAll('.project-card');
  const projectsGrid = document.querySelector('.projects-grid');
  
  projectCards.forEach(card => {
    let rafId = null;
    
    // Mouse Enter - Enable instant movement and focus mode
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none';
      card.classList.add('hover-active');
      // Add focus class to grid to trigger blur on other cards
      if (projectsGrid) {
        projectsGrid.classList.add('card-focused');
      }
    });
    
    // Mouse Move - Apply 3D tilt with requestAnimationFrame
    card.addEventListener('mousemove', (e) => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      
      rafId = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        
        // Calculate position relative to card center
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;
        
        // Calculate rotation angles (max 10 degrees)
        const rotateY = (mouseX / (rect.width / 2)) * 10;
        const rotateX = -(mouseY / (rect.height / 2)) * 10;
        
        // Apply 3D transform
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      });
    });
    
    // Mouse Leave - Smooth reset and remove focus mode
    card.addEventListener('mouseleave', () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      
      card.style.transition = 'transform 0.5s ease';
      card.style.transform = 'none';
      card.classList.remove('hover-active');
      
      // Remove focus class from grid
      if (projectsGrid) {
        projectsGrid.classList.remove('card-focused');
      }
    });
  });
}