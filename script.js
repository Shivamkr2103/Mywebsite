document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Footer year
  const year = $("#year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // Mobile navigation
  const menuToggle = $(".menu-toggle");
  const navLinks = $("#navLinks");

  function closeMenu() {
    if (!menuToggle || !navLinks) return;

    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  }

  if (menuToggle && navLinks) {
    menuToggle.setAttribute("aria-expanded", "false");

    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      document.body.classList.toggle("menu-open", isOpen);
    });

    // Close after selecting a navigation link
    $$("#navLinks a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Close with Escape
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    // Close when clicking outside the navigation
    document.addEventListener("click", (event) => {
      if (
        navLinks.classList.contains("open") &&
        !navLinks.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });

    // Close the mobile menu when returning to desktop width
    window.addEventListener("resize", () => {
      if (window.innerWidth > 680) {
        closeMenu();
      }
    });
  }

  // Scroll reveal animations
  const revealElements = $$(".reveal");

  if ("IntersectionObserver" in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }

  // Active navigation link based on visible section
  const sections = $$("main section[id]");
  const navigationAnchors = $$("#navLinks a[href^='#']");

  if ("IntersectionObserver" in window && sections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const sectionId = entry.target.id;

          navigationAnchors.forEach((link) => {
            const isActive =
              link.getAttribute("href") === `#${sectionId}`;

            link.classList.toggle("active", isActive);

            if (isActive) {
              link.setAttribute("aria-current", "location");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      {
        rootMargin: "-30% 0px -55% 0px",
        threshold: 0
      }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  // Back-to-top button
  let backToTop = $(".back-top");

  // Create the button if it is not already in index.html
  if (!backToTop) {
    backToTop = document.createElement("button");
    backToTop.className = "back-top";
    backToTop.type = "button";
    backToTop.setAttribute("aria-label", "Back to top");
    backToTop.textContent = "↑";
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
  const contactForm = $("#contactForm");

  if (contactForm) {
    const nameInput = $("#name", contactForm);
    const emailInput = $("#email", contactForm);
    const messageInput = $("#message", contactForm);

    const nameError = $("#nameError");
    const emailError = $("#emailError");
    const messageError = $("#messageError");
    const formStatus = $("#formStatus");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function showError(input, errorElement, message) {
      if (errorElement) {
        errorElement.textContent = message;
      }

      if (input) {
        input.setAttribute(
          "aria-invalid",
          message ? "true" : "false"
        );
      }
    }

    function validateName() {
      const value = nameInput?.value.trim() || "";
      const valid = value.length >= 2;

      showError(
        nameInput,
        nameError,
        valid ? "" : "Please enter your name (at least 2 characters)."
      );

      return valid;
    }

    function validateEmail() {
      const value = emailInput?.value.trim() || "";
      const valid = emailPattern.test(value);

      showError(
        emailInput,
        emailError,
        valid ? "" : "Please enter a valid email address."
      );

      return valid;
    }

    function validateMessage() {
      const value = messageInput?.value.trim() || "";
      const valid = value.length >= 10;

      showError(
        messageInput,
        messageError,
        valid ? "" : "Please enter at least 10 characters."
      );

      return valid;
    }

    // Validate fields as the visitor types
    nameInput?.addEventListener("input", validateName);
    emailInput?.addEventListener("input", validateEmail);
    messageInput?.addEventListener("input", validateMessage);

    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (formStatus) {
        formStatus.textContent = "";
      }

      const isNameValid = validateName();
      const isEmailValid = validateEmail();
      const isMessageValid = validateMessage();

      if (!isNameValid || !isEmailValid || !isMessageValid) {
        if (!isNameValid) {
          nameInput?.focus();
        } else if (!isEmailValid) {
          emailInput?.focus();
        } else {
          messageInput?.focus();
        }

        if (formStatus) {
          formStatus.textContent =
            "Please correct the highlighted fields.";
        }

        return;
      }

      const recipient = "Shivamkr2103@gmail.com";
      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const message = messageInput.value.trim();

      const subject = encodeURIComponent(
        `Portfolio enquiry from ${name}`
      );

      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
      );

      const mailtoLink =
        `mailto:${recipient}?subject=${subject}&body=${body}`;

      if (formStatus) {
        formStatus.textContent =
          "Opening your email app. Please send the prepared message there.";
      }

      // Opens the visitor's configured email application
      window.location.href = mailtoLink;
    });
  }
});
