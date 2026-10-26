document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const $$ = (selector, root = document) =>
    [...root.querySelectorAll(selector)];

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // 1. MOBILE NAVIGATION
  const menuToggle = $(".menu-toggle");
  const navLinks = $(".nav-links");

  function closeMenu() {
    if (!menuToggle || !navLinks) return;

    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    menuToggle.textContent = "☰";
  }

  if (menuToggle && navLinks) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");

    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
      );
      menuToggle.textContent = isOpen ? "×" : "☰";
    });

    $$(".nav-links a").forEach(link => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeMenu();
    });

    document.addEventListener("click", event => {
      if (
        navLinks.classList.contains("open") &&
        !navLinks.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });
  }

  // 2. SCROLL REVEAL ANIMATIONS
  const revealElements = $$(".reveal");

  if ("IntersectionObserver" in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealElements.forEach(element => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach(element => {
      element.classList.add("visible");
    });
  }

  // 3. ACTIVE NAVIGATION LINK
  const sections = $$("section[id]");
  const navItems = $$(".nav-links a[href^='#']");

  if ("IntersectionObserver" in window && sections.length) {
    const sectionObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          navItems.forEach(link => {
            const isActive =
              link.getAttribute("href") === `#${entry.target.id}`;

            if (isActive) {
              link.setAttribute("aria-current", "location");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      { rootMargin: "-25% 0px -60% 0px" }
    );

    sections.forEach(section => {
      sectionObserver.observe(section);
    });
  }

  // 4. AUTOMATIC COPYRIGHT YEAR
  const yearElement = $("#year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 5. CONTACT FORM VALIDATION
  const form = $("#contactForm");
  const status = $("#formStatus");

  if (form) {
    const fields = {
      name: $("#name", form),
      email: $("#email", form),
      message: $("#message", form)
    };

    const errors = {
      name: $("#nameError"),
      email: $("#emailError"),
      message: $("#messageError")
    };

    function validateForm() {
      let valid = true;

      Object.values(errors).forEach(error => {
        if (error) error.textContent = "";
      });

      Object.values(fields).forEach(field => {
        if (field) field.removeAttribute("aria-invalid");
      });

      const name = fields.name?.value.trim() || "";
      const email = fields.email?.value.trim() || "";
      const message = fields.message?.value.trim() || "";

      function setError(field, errorElement, text) {
        if (errorElement) errorElement.textContent = text;

        if (field) {
          field.setAttribute("aria-invalid", "true");
          if (valid) field.focus();
        }

        valid = false;
      }

      if (!fields.name || name.length < 2) {
        setError(
          fields.name,
          errors.name,
          "Please enter at least 2 characters."
        );
      }

      if (
        !fields.email ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ) {
        setError(
          fields.email,
          errors.email,
          "Please enter a valid email address."
        );
      }

      if (!fields.message || message.length < 10) {
        setError(
          fields.message,
          errors.message,
          "Please enter at least 10 characters."
        );
      }

      return valid;
    }

    Object.values(fields).forEach(field => {
      if (!field) return;

      field.addEventListener("input", () => {
        field.removeAttribute("aria-invalid");
      });
    });

    form.addEventListener("submit", event => {
      event.preventDefault();

      if (!validateForm()) {
        if (status) {
          status.textContent =
            "Please fix the highlighted fields and try again.";
        }
        return;
      }

      // Keep your existing recipient address.
      const recipient = "Shivamkr2103@gmail.com";

      const subject = encodeURIComponent(
        `Portfolio contact from ${fields.name.value.trim()}`
      );

      const body = encodeURIComponent(
        `Name: ${fields.name.value.trim()}\n` +
        `Reply to: ${fields.email.value.trim()}\n\n` +
        `Message:\n${fields.message.value.trim()}`
      );

      if (status) {
        status.textContent =
          "Opening your email app. Send the message from there.";
      }

      window.location.href =
        `mailto:${recipient}?subject=${subject}&body=${body}`;
    });
  }

  console.info("Portfolio initialized successfully.");
});
