// ==========================================================================
// NAEHEON LEE PORTFOLIO - MAIN SCRIPT
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  // === 1. SMART SCROLLING NAVBAR ===
  const navbar = document.getElementById("navbar");
  let lastScrollTop = 0;

  window.addEventListener(
    "scroll",
    () => {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      // Hide if scrolling DOWN and past the header, show if scrolling UP
      if (scrollTop > lastScrollTop && scrollTop > 80) {
        navbar.classList.add("nav-hidden");
      } else {
        navbar.classList.remove("nav-hidden");
      }
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    },
    { passive: true },
  );

  // === 2. SCROLL REVEAL ANIMATIONS ===
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

  document
    .querySelectorAll(".reveal-title, .reveal-card, .reveal-image")
    .forEach((el) => {
      scrollObserver.observe(el);
    });

  // === 3. CONTACT FORM HANDLING ===
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

  // === 4. ZERO-JITTER LERP (3D TILT) ===
  const projectCards = document.querySelectorAll("#projects .card");

  projectCards.forEach((card) => {
    let targetX = 0,
      targetY = 0;
    let cardRotX = 0,
      cardRotY = 0;
    let isHovering = false;

    card.addEventListener("mouseenter", () => {
      isHovering = true;
      card.style.transition = "none";
      animateCard();
    });

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      targetX = e.clientX - rect.left - rect.width / 2;
      targetY = e.clientY - rect.top - rect.height / 2;
    });

    card.addEventListener("mouseleave", () => {
      isHovering = false;
      card.style.transition =
        "transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)";
      card.style.transform = "";
      card.style.boxShadow = "";
      targetX = 0;
      targetY = 0;
    });

    function animateCard() {
      if (!isHovering) return;

      let targetCardRotX = -(targetY / 30);
      let targetCardRotY = targetX / 30;

      cardRotX += (targetCardRotX - cardRotX) * 0.1;
      cardRotY += (targetCardRotY - cardRotY) * 0.1;

      card.style.transform = `perspective(1000px) rotateX(${cardRotX}deg) rotateY(${cardRotY}deg) translateY(-2px)`;
      card.style.boxShadow = "0 15px 30px rgba(0, 0, 0, 0.08)";

      requestAnimationFrame(animateCard);
    }
  });

  // === 5. HERO FLOCKING SIMULATION (CANVAS) ===
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
    const mouse = { x: -1000, y: -1000, radius: 120 };

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

    function animateBoids() {
      ctx.clearRect(0, 0, width, height);

      for (let boid of boids) {
        // Flocking Math Calculation
        let moveX = 0,
          moveY = 0,
          avgDX = 0,
          avgDY = 0,
          centerX = 0,
          centerY = 0,
          neighbors = 0;

        for (let otherBoid of boids) {
          if (otherBoid !== boid) {
            const dist = Math.hypot(boid.x - otherBoid.x, boid.y - otherBoid.y);
            if (dist < 20) {
              moveX += boid.x - otherBoid.x;
              moveY += boid.y - otherBoid.y;
            }
            if (dist < visualRange) {
              avgDX += otherBoid.dx;
              avgDY += otherBoid.dy;
              centerX += otherBoid.x;
              centerY += otherBoid.y;
              neighbors += 1;
            }
          }
        }

        boid.dx += moveX * 0.05;
        boid.dy += moveY * 0.05;

        if (neighbors > 0) {
          boid.dx += (avgDX / neighbors - boid.dx) * 0.05;
          boid.dy += (avgDY / neighbors - boid.dy) * 0.05;
          boid.dx += (centerX / neighbors - boid.x) * 0.005;
          boid.dy += (centerY / neighbors - boid.y) * 0.005;
        }

        // Mouse Interaction
        const dist = Math.hypot(boid.x - mouse.x, boid.y - mouse.y);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          boid.dx += ((boid.x - mouse.x) / dist) * force * 2;
          boid.dy += ((boid.y - mouse.y) / dist) * force * 2;
        }

        // Limit Speed & Handle Edge Wrapping
        const speed = Math.hypot(boid.dx, boid.dy);
        if (speed > 2.5) {
          boid.dx = (boid.dx / speed) * 2.5;
          boid.dy = (boid.dy / speed) * 2.5;
        }

        if (boid.x < -10) boid.x = width + 10;
        if (boid.x > width + 10) boid.x = -10;
        if (boid.y < -10) boid.y = height + 10;
        if (boid.y > height + 10) boid.y = -10;

        boid.x += boid.dx;
        boid.y += boid.dy;

        // Draw Boid
        ctx.beginPath();
        ctx.arc(boid.x, boid.y, boid.radius, 0, Math.PI * 2);
        ctx.fillStyle = boid.color;
        ctx.fill();
      }
      requestAnimationFrame(animateBoids);
    }

    // Slight delay before starting animation to let initial layout settle
    setTimeout(() => {
      requestAnimationFrame(animateBoids);
    }, 100);
  }
});
