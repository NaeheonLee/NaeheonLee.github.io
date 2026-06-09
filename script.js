// Ensure the DOM is fully loaded before running scripts
document.addEventListener("DOMContentLoaded", () => {
  // --- INTERACTION 1: Scroll Animations ---
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.15,
  };

  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll(
    ".reveal-title, .reveal-card, .reveal-image",
  );

  animatedElements.forEach((el) => {
    scrollObserver.observe(el);
  });

  // --- INTERACTION 2: Form Validation & Handling ---
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("form-status");

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();

      if (name === "" || email === "" || message === "") {
        formStatus.textContent = "Please fill out all fields.";
        formStatus.style.color = "var(--accent-red)";
        formStatus.style.display = "block";
        return;
      }

      formStatus.textContent = `Thank you, ${name}! Your message has been sent.`;
      formStatus.style.color = "green";
      formStatus.style.display = "block";
      contactForm.reset();

      setTimeout(() => {
        formStatus.style.display = "none";
      }, 4000);
    });
  }

  // --- INTERACTION 3: Hero Flocking Simulation ---
  const canvas = document.getElementById("flockCanvas");
  const heroSection = document.getElementById("hero");

  if (canvas && heroSection) {
    const ctx = canvas.getContext("2d");
    let width, height;

    function resize() {
      width = canvas.width = canvas.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.offsetHeight || window.innerHeight;
    }
    window.addEventListener("resize", resize);
    resize();

    const rootStyles = getComputedStyle(document.documentElement);
    const colors = [
      rootStyles.getPropertyValue("--accent-blue").trim() || "#6ec6d3",
      rootStyles.getPropertyValue("--accent-red").trim() || "#d94b4b",
      rootStyles.getPropertyValue("--text-color").trim() || "#30103a",
    ];

    const numBoids = 60;
    const visualRange = 75;
    const boids = [];

    const mouse = {
      x: -1000,
      y: -1000,
      radius: 120,
    };

    function updateInteractionPosition(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      mouse.x = clientX - rect.left;
      mouse.y = clientY - rect.top;
    }

    function resetInteractionPosition() {
      mouse.x = -1000;
      mouse.y = -1000;
    }

    heroSection.addEventListener("mousemove", updateInteractionPosition);
    heroSection.addEventListener("mouseleave", resetInteractionPosition);
    heroSection.addEventListener("touchmove", updateInteractionPosition, {
      passive: true,
    });
    heroSection.addEventListener("touchend", resetInteractionPosition);
    heroSection.addEventListener("touchcancel", resetInteractionPosition);

    for (let i = 0; i < numBoids; i++) {
      boids.push({
        x: Math.random() * width,
        y: Math.random() * height,
        dx: Math.random() * 2 - 1,
        dy: Math.random() * 2 - 1,
        radius: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    function separation(boid) {
      let moveX = 0;
      let moveY = 0;
      const minDistance = 20;
      for (let otherBoid of boids) {
        if (otherBoid !== boid) {
          const dist = Math.hypot(boid.x - otherBoid.x, boid.y - otherBoid.y);
          if (dist < minDistance) {
            moveX += boid.x - otherBoid.x;
            moveY += boid.y - otherBoid.y;
          }
        }
      }
      boid.dx += moveX * 0.05;
      boid.dy += moveY * 0.05;
    }

    function alignment(boid) {
      let avgDX = 0;
      let avgDY = 0;
      let neighbors = 0;
      for (let otherBoid of boids) {
        if (otherBoid !== boid) {
          const dist = Math.hypot(boid.x - otherBoid.x, boid.y - otherBoid.y);
          if (dist < visualRange) {
            avgDX += otherBoid.dx;
            avgDY += otherBoid.dy;
            neighbors += 1;
          }
        }
      }
      if (neighbors > 0) {
        avgDX = avgDX / neighbors;
        avgDY = avgDY / neighbors;
        boid.dx += (avgDX - boid.dx) * 0.05;
        boid.dy += (avgDY - boid.dy) * 0.05;
      }
    }

    function cohesion(boid) {
      let centerX = 0;
      let centerY = 0;
      let neighbors = 0;
      for (let otherBoid of boids) {
        if (otherBoid !== boid) {
          const dist = Math.hypot(boid.x - otherBoid.x, boid.y - otherBoid.y);
          if (dist < visualRange) {
            centerX += otherBoid.x;
            centerY += otherBoid.y;
            neighbors += 1;
          }
        }
      }
      if (neighbors > 0) {
        centerX = centerX / neighbors;
        centerY = centerY / neighbors;
        boid.dx += (centerX - boid.x) * 0.005;
        boid.dy += (centerY - boid.y) * 0.005;
      }
    }

    function mouseInteraction(boid) {
      const dx = boid.x - mouse.x;
      const dy = boid.y - mouse.y;
      const dist = Math.hypot(dx, dy);

      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        boid.dx += (dx / dist) * force * 2;
        boid.dy += (dy / dist) * force * 2;
      }
    }

    // Edge wrapping logic to let boids reappear on the opposite side
    function keepWithinBounds(boid) {
      if (boid.x < -10) boid.x = width + 10;
      if (boid.x > width + 10) boid.x = -10;
      if (boid.y < -10) boid.y = height + 10;
      if (boid.y > height + 10) boid.y = -10;
    }

    function limitSpeed(boid) {
      const speedLimit = 2.5;
      const speed = Math.hypot(boid.dx, boid.dy);
      if (speed > speedLimit) {
        boid.dx = (boid.dx / speed) * speedLimit;
        boid.dy = (boid.dy / speed) * speedLimit;
      }
    }

    setTimeout(() => {
      function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let boid of boids) {
          separation(boid);
          alignment(boid);
          cohesion(boid);
          mouseInteraction(boid);
          limitSpeed(boid);
          keepWithinBounds(boid);

          boid.x += boid.dx;
          boid.y += boid.dy;

          ctx.beginPath();
          ctx.arc(boid.x, boid.y, boid.radius, 0, Math.PI * 2);
          ctx.fillStyle = boid.color;
          ctx.fill();
        }
        requestAnimationFrame(animate);
      }
      animate();
    }, 100);
  }

  // --- INTERACTION 4: Professional Zero-Jitter Lerp (3D Tilt & Magnetic Button) ---
  const projectCards = document.querySelectorAll("#projects .card");

  projectCards.forEach((card) => {
    const button = card.querySelector(".btn-github-full");

    // Target values (where your mouse actually is)
    let targetX = 0,
      targetY = 0;

    // Current values (where the card and button currently are during the animation)
    let cardRotX = 0,
      cardRotY = 0;
    let btnX = 0,
      btnY = 0;
    let isHovering = false;

    card.addEventListener("mouseenter", () => {
      isHovering = true;
      card.style.transition = "none";
      if (button) button.style.transition = "none";

      // Kick off the buttery smooth animation loop
      animate();
    });

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      // Calculate mouse position relative to the center of the card
      targetX = e.clientX - rect.left - rect.width / 2;
      targetY = e.clientY - rect.top - rect.height / 2;
    });

    card.addEventListener("mouseleave", () => {
      isHovering = false;

      // Restore the CSS transitions for a graceful snap-back to the center
      card.style.transition =
        "transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)";
      card.style.transform = "";
      card.style.boxShadow = "";

      if (button) {
        button.style.transition =
          "transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)";
        button.style.transform = "";
      }

      // Reset targets for the next hover
      targetX = 0;
      targetY = 0;
    });

    function animate() {
      if (!isHovering) return;

      // --- 1. The 3D Card Tilt ---
      // Divide by 30 for a subtle maximum tilt
      let targetCardRotX = -(targetY / 30);
      let targetCardRotY = targetX / 30;

      // Lerp formula: smoothly glide the current rotation 10% closer to the target rotation per frame
      cardRotX += (targetCardRotX - cardRotX) * 0.1;
      cardRotY += (targetCardRotY - cardRotY) * 0.1;

      card.style.transform = `perspective(1000px) rotateX(${cardRotX}deg) rotateY(${cardRotY}deg) translateY(-2px)`;
      card.style.boxShadow = "0 15px 30px rgba(0, 0, 0, 0.08)";

      // --- 2. The Lazy Magnetic Button ---
      if (button) {
        // Multiply by 0.08 to severely limit how far the button is allowed to travel
        let targetBtnX = targetX * 0.08;
        let targetBtnY = targetY * 0.08;

        // Glide the button 5% closer to the target per frame
        btnX += (targetBtnX - btnX) * 0.05;
        btnY += (targetBtnY - btnY) * 0.05;

        button.style.transform = `translate(${btnX}px, ${btnY}px) scale(1.02)`;
      }

      // Loop the animation perfectly in sync with the user's screen refresh rate
      requestAnimationFrame(animate);
    }
  });
});
