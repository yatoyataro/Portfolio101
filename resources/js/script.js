const night = document.querySelector('.night');

// Generate 20 shooting stars with random positions and delays
for (let i = 0; i < 25; i++) {
  const star = document.createElement('div');
  star.classList.add('shooting_star');

  // Randomize positions
  const topPosition = Math.random() * 100; // Random percentage for top
  const leftPosition = Math.random() * 100; // Random percentage for left
  const delay = Math.random() * 9; // Random delay between 0-5 seconds

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
