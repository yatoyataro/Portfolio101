const night = document.querySelector('.night');
let numStars = 0;

if (screen.width <700) {
  numStars = 15;
  if (screen.width <480) {
    const sparkle = document.querySelector('.sparkle');
    sparkle.style.display = 'none';
  }
}else{
  numStars = 20;
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

document.addEventListener('mousemove', (event) => {
    rotateElement(event, homeCard);
});
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
if (canvas) {
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

  // Redraw on window resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => calculateConnections(hoveredSkill), 150);
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