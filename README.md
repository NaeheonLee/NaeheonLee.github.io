# Naeheon Lee | Personal Portfolio

**CS 463/563 - Intro to Web Development Final Project**

A responsive, single-page professional portfolio website built to highlight my background, previous work, and projects as a Data Engineer.

## Live Deployment

The project is deployed via GitHub Pages and can be viewed here:
**[https://naeheonlee.github.io]**

---

## How to Run the Code Locally

This project is built purely with vanilla web technologies. There are no build tools, dependencies, or package managers required to run it.

1. Clone this repository to your local machine:
   `git clone [https://github.com/NaeheonLee/NaeheonLee.github.io.git]`
2. Navigate into the project directory.
3. Open the `index.html` file to run it in your default web browser.

---

## Libraries & Frameworks

This project was built entirely from scratch using **Vanilla HTML5, CSS3, and JavaScript (ES6)**.
No external CSS frameworks (like Bootstrap or Tailwind) or external JavaScript libraries (like jQuery, React, or Three.js) were used in the making of this site.

---

## Outside Sources & Attributions

To fulfill the final project requirement of implementing "elements, styles, or interactions that we have not learned in class", I utilized many outside sources and Google Gemini as a tool to help me conceptualize, learn, and implement several highly advanced JavaScript techniques.

The core HTML structure, CSS layout, responsive design, and content are my own. The AI was specifically consulted to assist with the complex mathematical logic and DOM manipulation for the following advanced interactive features:

1. **Hero Flocking Simulation (Canvas API):** \* Used AI to understand and implement a 2D HTML `<canvas>` simulation using the Boids algorithm, originally developed by Craig Reynolds in 1986.
   - Learned how to calculate separation, alignment, cohesion, and mouse repulsion physics, animated via `requestAnimationFrame`.
   - _Reference:_ Reynolds, C. W. (1986). "Flocks, Herds, and Schools: A Distributed Behavioral Model."
   - _Reference:_ [MDN Web Docs: Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

2. **Zero-Jitter Lerp (3D Tilt):** \* Used AI to solve CSS transition performance issues (stuttering) by replacing them with a JavaScript animation loop.
   - Implemented Linear Interpolation (Lerp) to smoothly calculate 3D perspective tilts (`rotateX` / `rotateY`) based on mouse coordinates.
   - _Reference:_ [MDN Web Docs: window.requestAnimationFrame()](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
   - _Reference:_ Concepts adapted from the open-source logic of [Vanilla-tilt.js](https://micku7zu.github.io/vanilla-tilt.js/)

3. **Scroll Reveal Animations:** \* Learned how to use the modern `IntersectionObserver` API to detect when elements enter the viewport and trigger CSS opacity/transform reveals, rather than relying on heavy scroll event listeners.
   - _Reference:_ [MDN Web Docs: Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

4. **Smart Scrolling Navbar:** \* Assisted in writing an optimized, passive window scroll listener that dynamically hides the navbar when scrolling down and reveals it when scrolling up to save screen real estate on devices.
   - _Reference:_ Logic adapted from the "Hide Menu on Scroll" pattern via [W3Schools](https://www.w3schools.com/howto/howto_js_navbar_hide_scroll.asp).

All generated code was heavily reviewed, modified, organized, and commented by me to ensure complete understanding of the mechanics behind these interactions.
