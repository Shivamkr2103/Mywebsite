const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  menuToggle.textContent = isOpen ? '×' : '☰';
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    menuToggle.textContent = '☰';
  });
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

document.getElementById('year').textContent = new Date().getFullYear();

const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');
const fields = {
  name: document.getElementById('name'),
  email: document.getElementById('email'),
  message: document.getElementById('message')
};
const errors = {
  name: document.getElementById('nameError'),
  email: document.getElementById('emailError'),
  message: document.getElementById('messageError')
};
function validateForm() {
  let valid = true;
  Object.values(errors).forEach(el => el.textContent = '');
  const name = fields.name.value.trim();
  const email = fields.email.value.trim();
  const message = fields.message.value.trim();
  if (name.length < 2) { errors.name.textContent = 'Please enter at least 2 characters.'; valid = false; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { errors.email.textContent = 'Please enter a valid email address.'; valid = false; }
  if (message.length < 10) { errors.message.textContent = 'Please enter at least 10 characters.'; valid = false; }
  return valid;
}
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!validateForm()) {
    status.textContent = 'Please fix the highlighted fields and try again.';
    return;
  }
  // Replace this address with your real email before publishing.
  const recipient = 'Shivamkr2103@gmail.com';
  const subject = encodeURIComponent(`Portfolio contact from ${fields.name.value.trim()}`);
  const body = encodeURIComponent(`Name: ${fields.name.value.trim()}\nReply to: ${fields.email.value.trim()}\n\nMessage:\n${fields.message.value.trim()}`);
  status.textContent = 'Opening your email app. Replace the demo email address in script.js before publishing.';
  window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
});
