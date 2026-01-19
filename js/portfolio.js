/**
 * Portfolio JavaScript
 * Handles animations, navigation, and interactive elements
 */

(function () {
  "use strict";

  // ==========================================================================
  // DOM Elements
  // ==========================================================================

  const nav = document.getElementById("main-nav");
  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.getElementById("nav-links");
  const fadeElements = document.querySelectorAll(".fade-in");
  const countUpElements = document.querySelectorAll(".count-up");

  // ==========================================================================
  // Navigation
  // ==========================================================================

  /**
   * Handle scroll-based navigation styling
   */
  function handleNavScroll() {
    if (window.scrollY > 50) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  }

  /**
   * Toggle mobile navigation
   */
  function toggleMobileNav() {
    navLinks.classList.toggle("open");
    const icon = navToggle.querySelector("i");
    if (navLinks.classList.contains("open")) {
      icon.classList.remove("fa-bars");
      icon.classList.add("fa-times");
    } else {
      icon.classList.remove("fa-times");
      icon.classList.add("fa-bars");
    }
  }

  /**
   * Close mobile nav when clicking a link
   */
  function closeMobileNav() {
    navLinks.classList.remove("open");
    const icon = navToggle.querySelector("i");
    icon.classList.remove("fa-times");
    icon.classList.add("fa-bars");
  }

  /**
   * Smooth scroll to section
   */
  function smoothScroll(e) {
    const href = e.currentTarget.getAttribute("href");
    if (href.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const navHeight = nav.offsetHeight;
        const targetPosition =
          target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
        closeMobileNav();
      }
    }
  }

  // ==========================================================================
  // Scroll Animations
  // ==========================================================================

  /**
   * Check if element is in viewport
   */
  function isInViewport(element, offset = 0.85) {
    const rect = element.getBoundingClientRect();
    return rect.top <= window.innerHeight * offset;
  }

  /**
   * Handle fade-in animations on scroll
   */
  function handleFadeAnimations() {
    fadeElements.forEach((element) => {
      if (isInViewport(element) && !element.classList.contains("visible")) {
        element.classList.add("visible");
      }
    });
  }

  // ==========================================================================
  // Count-Up Animation
  // ==========================================================================

  /**
   * Animate counting up to target number
   */
  function countUp(element) {
    const target = parseInt(element.getAttribute("data-target"), 10);
    const duration = 2000; // 2 seconds
    const frameDuration = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      // Ease out quad
      const easeProgress = 1 - (1 - progress) * (1 - progress);
      const currentValue = Math.round(easeProgress * target);

      element.textContent = currentValue;

      if (frame === totalFrames) {
        clearInterval(counter);
        element.textContent = target;
      }
    }, frameDuration);
  }

  /**
   * Handle count-up animations on scroll
   */
  function handleCountUpAnimations() {
    countUpElements.forEach((element) => {
      if (isInViewport(element) && !element.hasAttribute("data-counted")) {
        element.setAttribute("data-counted", "true");
        countUp(element);
      }
    });
  }

  // ==========================================================================
  // Active Navigation Link
  // ==========================================================================

  /**
   * Update active navigation link based on scroll position
   */
  function updateActiveNavLink() {
    const sections = document.querySelectorAll("section[id]");
    const navHeight = nav.offsetHeight;

    let currentSection = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - navHeight - 100;
      const sectionHeight = section.offsetHeight;

      if (
        window.scrollY >= sectionTop &&
        window.scrollY < sectionTop + sectionHeight
      ) {
        currentSection = section.getAttribute("id");
      }
    });

    document.querySelectorAll(".nav-link").forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentSection}`) {
        link.classList.add("active");
      }
    });
  }

  // ==========================================================================
  // Reduced Motion Check
  // ==========================================================================

  /**
   * Check if user prefers reduced motion
   */
  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  // ==========================================================================
  // Initialize
  // ==========================================================================

  function init() {
    // Navigation events
    window.addEventListener("scroll", handleNavScroll, { passive: true });

    if (navToggle) {
      navToggle.addEventListener("click", toggleMobileNav);
    }

    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", smoothScroll);
    });

    // Scroll animations (skip if user prefers reduced motion)
    if (!prefersReducedMotion()) {
      // Initial check for elements already in viewport
      handleFadeAnimations();
      handleCountUpAnimations();

      // Scroll event for animations
      window.addEventListener(
        "scroll",
        () => {
          handleFadeAnimations();
          handleCountUpAnimations();
        },
        { passive: true },
      );
    } else {
      // If reduced motion, make all elements visible immediately
      fadeElements.forEach((element) => {
        element.classList.add("visible");
      });
      countUpElements.forEach((element) => {
        const target = element.getAttribute("data-target");
        if (target) {
          element.textContent = target;
        }
      });
    }

    // Active navigation link
    window.addEventListener("scroll", updateActiveNavLink, { passive: true });
    updateActiveNavLink();

    // Initial nav state
    handleNavScroll();

    console.log("Portfolio initialized");
  }

  // Run when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
