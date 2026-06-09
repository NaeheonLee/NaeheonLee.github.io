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
});
