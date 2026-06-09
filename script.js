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
        // Add the 'visible' class to trigger the CSS animation
        entry.target.classList.add("visible");
        // Stop observing once it has animated in
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Grab all elements we want to animate (Titles, Cards, and Images)
  const animatedElements = document.querySelectorAll(
    ".reveal-title, .reveal-card, .reveal-image",
  );

  // Attach the observer to each element
  animatedElements.forEach((el) => {
    scrollObserver.observe(el);
  });

  // --- INTERACTION 2: Form Validation & Handling ---
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("form-status");

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault(); // Prevent page reload on submit

      // Gather values using ES6 const
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();

      // Basic validation logic
      if (name === "" || email === "" || message === "") {
        formStatus.textContent = "Please fill out all fields.";
        formStatus.style.color = "var(--accent-red)";
        formStatus.style.display = "block";
        return;
      }

      // Simulate a successful submission
      formStatus.textContent = `Thank you, ${name}! Your message has been sent.`;
      formStatus.style.color = "green";
      formStatus.style.display = "block";

      // Clear the form fields
      contactForm.reset();

      // Hide the success message after 4 seconds
      setTimeout(() => {
        formStatus.style.display = "none";
      }, 4000);
    });
  }

  // --- INTERACTION 3: Hero Flocking Simulation (Interactive) ---
  const canvas = document.getElementById("flockCanvas");
  const heroSection = document.getElementById("hero");

  if (canvas && heroSection) {
    const ctx = canvas.getContext("2d");
    let width, height;

    // Resize canvas to fit the hero section perfectly
    function resize() {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    }
    window.addEventListener("resize", resize);
    resize();

    // Grab the root colors directly from your CSS variables
    const rootStyles = getComputedStyle(document.documentElement);
    const colors = [
      rootStyles.getPropertyValue("--accent-blue").trim(),
      rootStyles.getPropertyValue("--accent-red").trim(),
      rootStyles.getPropertyValue("--text-color").trim(),
    ];

    // Flocking simulation variables
    const numBoids = 100; // Adjust for more or fewer circles
    const visualRange = 75;
    const boids = [];

    // --- NEW: Mouse Interaction Variables ---
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 120, // How far away the circles will start scattering
    };

    // Track mouse movement over the hero section
    heroSection.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    // Move the simulated mouse off-screen when the cursor leaves the hero area
    heroSection.addEventListener("mouseleave", () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    // Initialize the circles (boids)
    for (let i = 0; i < numBoids; i++) {
      boids.push({
        x: Math.random() * width,
        y: Math.random() * height,
        dx: Math.random() * 2 - 1,
        dy: Math.random() * 2 - 1,
        radius: Math.random() * 3 + 2, // Sizes between 2px and 5px
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // Rule 1: Keep distance from other boids (Separation)
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

    // Rule 2: Match velocity with near boids (Alignment)
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

    // Rule 3: Move toward the center of near boids (Cohesion)
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

    // --- NEW: Rule 4: Mouse Repulsion ---
    function mouseInteraction(boid) {
      const dx = boid.x - mouse.x;
      const dy = boid.y - mouse.y;
      const dist = Math.hypot(dx, dy);

      if (dist < mouse.radius) {
        // Calculate the force so it pushes harder the closer the boid is to the center of the mouse
        const force = (mouse.radius - dist) / mouse.radius;
        boid.dx += (dx / dist) * force * 2;
        boid.dy += (dy / dist) * force * 2;
      }
    }

    // Keep boids inside the screen by wrapping them around the edges
    function keepWithinBounds(boid) {
      if (boid.x < -10) boid.x = width + 10;
      if (boid.x > width + 10) boid.x = -10;
      if (boid.y < -10) boid.y = height + 10;
      if (boid.y > height + 10) boid.y = -10;
    }

    // Limit the speed of the boids so they move smoothly
    function limitSpeed(boid) {
      // Increase max speed slightly to allow them to run away from the cursor effectively
      const speedLimit = 2.5;
      const speed = Math.hypot(boid.dx, boid.dy);
      if (speed > speedLimit) {
        boid.dx = (boid.dx / speed) * speedLimit;
        boid.dy = (boid.dy / speed) * speedLimit;
      }
    }

    // Main Animation Loop
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

        // Draw the circle
        ctx.beginPath();
        ctx.arc(boid.x, boid.y, boid.radius, 0, Math.PI * 2);
        ctx.fillStyle = boid.color;
        ctx.fill();
      }

      requestAnimationFrame(animate);
    }

    animate();
  }
});
