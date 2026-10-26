document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Automatically update the footer year
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  // Mobile navigation
  const menuToggle = $(".menu-toggle");
  const navLinks = $("#navLinks");

  function closeMenu() {
    if (!menuToggle || !navLinks) return;

    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }

  if (menuToggle && navLinks) {
    menuToggle.setAttribute("aria-expanded", "false");

    menuToggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(open));
    });

    $$("#navLinks a").forEach(link => {
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

    window.addEventListener("resize", () => {
      if (window.innerWidth > 680) closeMenu();
    });
  }

  // Reveal sections and cards when scrolling
  const revealElements = $$(".reveal");

  if ("IntersectionObserver" in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
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

  // Highlight the current navigation section
  const sections = $$("main section[id]");
  const navItems = $$("#navLinks a[href^='#']");

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          navItems.forEach(link => {
            const active =
              link.getAttribute("href") === `#${entry.target.id}`;

            link.classList.toggle("active", active);

            if (active) {
              link.setAttribute("aria-current", "location");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      { rootMargin: "-30% 0px -55% 0px" }
    );

    sections.forEach(section => sectionObserver.observe(section));
  }

  // Back-to-top button
  let backToTop = $(".back-top");

  if (!backToTop) {
    backToTop = document.createElement("button");
    backToTop.className = "back-top";
    backToTop.type = "button";
    backToTop.textContent = "↑";
    backToTop.setAttribute("aria-label", "Back to top");
    document.body.appendChild(backToTop);
  }

  function updateBackToTop() {
    backToTop.classList.toggle("show", window.scrollY > 450);
  }

  window.addEventListener("scroll", updateBackToTop, {
    passive: true
  });

  updateBackToTop();

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: reducedMotion ? "auto" : "smooth"
    });
  });

  // Contact form validation
  const form = $("#contactForm");

  if (form) {
    const name = $("#name", form);
    const email = $("#email", form);
    const message = $("#message", form);

    const nameError = $("#nameError");
    const emailError = $("#emailError");
    const messageError = $("#messageError");
    const formStatus = $("#formStatus");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function showError(input, element, text) {
      if (element) element.textContent = text;

      if (input) {
        input.setAttribute("aria-invalid", String(Boolean(text)));
      }
    }

    function validateName() {
      const valid = (name?.value.trim().length || 0) >= 2;

      showError(
        name,
        nameError,
        valid ? "" : "Enter your name (at least 2 characters)."
      );

      return valid;
    }

    function validateEmail() {
      const valid = emailPattern.test(email?.value.trim() || "");

      showError(
        email,
        emailError,
        valid ? "" : "Enter a valid email address."
      );

      return valid;
    }

    function validateMessage() {
      const valid = (message?.value.trim().length || 0) >= 10;

      showError(
        message,
        messageError,
        valid ? "" : "Message must contain at least 10 characters."
      );

      return valid;
    }

    name?.addEventListener("input", validateName);
    email?.addEventListener("input", validateEmail);
    message?.addEventListener("input", validateMessage);

    form.addEventListener("submit", event => {
      event.preventDefault();

      if (formStatus) formStatus.textContent = "";

      const validName = validateName();
      const validEmail = validateEmail();
      const validMessage = validateMessage();

      if (!validName || !validEmail || !validMessage) {
        if (!validName) name?.focus();
        else if (!validEmail) email?.focus();
        else message?.focus();

        if (formStatus) {
          formStatus.textContent = "Please correct the highlighted fields.";
        }

        return;
      }

      const recipient = "Shivamkr2103@gmail.com";

      const subject = encodeURIComponent(
        `Portfolio enquiry from ${name.value.trim()}`
      );

      const body = encodeURIComponent(
        `Name: ${name.value.trim()}\n` +
        `Email: ${email.value.trim()}\n\n` +
        `Message:\n${message.value.trim()}`
      );

      if (formStatus) {
        formStatus.textContent =
          "Opening your email app. Please send the prepared message there.";
      }

      window.location.href =
        `mailto:${recipient}?subject=${subject}&body=${body}`;
    });
  }
});
