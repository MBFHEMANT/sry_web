
const glow = document.getElementById("glow");
const music = document.getElementById("music");

// BLUE LIGHT FOLLOWING FINGER / MOUSE

let targetX = innerWidth / 2;
let targetY = innerHeight / 2;

let currentX = targetX;
let currentY = targetY;

function updatePointer(x, y) {
  targetX = x;
  targetY = y;
}

window.addEventListener("pointermove", (e) => {
  updatePointer(e.clientX, e.clientY);
}, { passive: true });

function animateGlow() {
  currentX += (targetX - currentX) * 0.16;
  currentY += (targetY - currentY) * 0.16;

  glow.style.left = currentX + "px";
  glow.style.top = currentY + "px";

  requestAnimationFrame(animateGlow);
}

animateGlow();


// MUSIC AUTOPLAY

let musicStarted = false;

async function playMusic() {
  if (musicStarted) return;

  try {
    await music.play();
    musicStarted = true;
  } catch (error) {
    // Browser blocked autoplay.
    // Retry after the visitor interacts with the page.
  }
}

// Attempt immediately on page load.
window.addEventListener("load", playMusic);

// Retry after first user interaction.
function firstInteraction() {
  if (!musicStarted) {
    playMusic();
  }

  if (musicStarted) {
    window.removeEventListener("pointerdown", firstInteraction);
    window.removeEventListener("touchstart", firstInteraction);
    window.removeEventListener("scroll", firstInteraction);
    window.removeEventListener("keydown", firstInteraction);
  }
}

window.addEventListener("pointerdown", firstInteraction, { passive: true });
window.addEventListener("touchstart", firstInteraction, { passive: true });
window.addEventListener("scroll", firstInteraction, { passive: true });
window.addEventListener("keydown", firstInteraction);


// STORY BUTTON

function startStory() {
  document.querySelector(".chapter").scrollIntoView({
    behavior: "smooth"
  });

  playMusic();
}


// REVEAL SECTIONS WHEN SCROLLING

const observer = new IntersectionObserver((entries) => {

  entries.forEach(entry => {

    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }

  });

}, {
  threshold: 0.12
});

document.querySelectorAll(".reveal").forEach(el => {
  observer.observe(el);
});


// FINAL SURPRISE

function showSurprise() {

  const surprise = document.getElementById("surprise");

  surprise.style.display = "block";

  surprise.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });

  createBurst();
}


// PARTICLES

const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

let particles = [];

let width, height;

function resizeCanvas() {

  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  width = window.innerWidth;
  height = window.innerHeight;

  canvas.width = width * dpr;
  canvas.height = height * dpr;

  canvas.style.width = width + "px";
  canvas.style.height = height + "px";

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();


const particleCount = window.innerWidth < 600 ? 22 : 55;


class Particle {

  constructor(x, y, burst = false) {

    this.x = x ?? Math.random() * width;
    this.y = y ?? Math.random() * height;

    this.size = Math.random() * 2 + 0.5;

    this.speedX = burst
      ? (Math.random() - 0.5) * 5
      : (Math.random() - 0.5) * 0.4;

    this.speedY = burst
      ? (Math.random() - 0.5) * 5
      : (Math.random() - 0.5) * 0.4;

    this.life = burst ? 80 : Infinity;

    this.opacity = Math.random() * 0.6 + 0.2;

  }

  update() {

    this.x += this.speedX;
    this.y += this.speedY;

    this.life--;

    if (this.x < 0 || this.x > width) {
      this.speedX *= -1;
    }

    if (this.y < 0 || this.y > height) {
      this.speedY *= -1;
    }

  }

  draw() {

    ctx.beginPath();

    ctx.arc(
      this.x,
      this.y,
      this.size,
      0,
      Math.PI * 2
    );

    ctx.fillStyle = `rgba(55, 155, 255, ${this.opacity})`;

    ctx.shadowBlur = 10;
    ctx.shadowColor = "#168bff";

    ctx.fill();

  }

}


// INITIAL PARTICLES

for (let i = 0; i < particleCount; i++) {
  particles.push(new Particle());
}


// BURST ANIMATION

function createBurst() {

  for (let i = 0; i < 45; i++) {
    particles.push(
      new Particle(width / 2, height / 2, true)
    );
  }

}


// ANIMATION LOOP

function animateParticles() {

  ctx.clearRect(0, 0, width, height);

  particles.forEach(p => {
    p.update();
    p.draw();
  });

  particles = particles.filter(p => p.life > 0);

  requestAnimationFrame(animateParticles);

}

animateParticles();
