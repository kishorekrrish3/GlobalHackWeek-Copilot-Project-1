const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");
const themeLabel = document.querySelector(".theme-toggle__label");
const contactForm = document.querySelector(".contact-form");

const savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme === "dark" || savedTheme === "light") {
  root.dataset.theme = savedTheme;
}

function updateThemeToggle() {
  const isDark = root.dataset.theme === "dark";
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  themeLabel.textContent = isDark ? "Light mode" : "Dark mode";
}

themeToggle.addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem("portfolio-theme", root.dataset.theme);
  updateThemeToggle();
});

updateThemeToggle();

const fields = [...contactForm.querySelectorAll("input, textarea")];

function validateField(field) {
  const wrapper = field.closest(".form-field");
  const help = wrapper.querySelector(".form-help");
  let message = "";

  if (!field.value.trim()) {
    message = "This field is required. Add a little context so I know how to reply.";
  } else if (field.type === "email" && !field.validity.valid) {
    message = "That email address looks incomplete. Check the spelling and try again.";
  } else if (field.name === "message" && field.value.trim().length < 12) {
    message = "Your note is very short. Add a little more detail about the project.";
  }

  field.setAttribute("aria-invalid", String(Boolean(message)));
  wrapper.classList.toggle("is-error", Boolean(message));
  help.textContent = message || help.dataset.default;
  return !message;
}

fields.forEach((field) => {
  const help = field.closest(".form-field").querySelector(".form-help");
  help.dataset.default = help.textContent;
  field.addEventListener("blur", () => validateField(field));
  field.addEventListener("input", () => {
    if (field.getAttribute("aria-invalid") === "true") validateField(field);
  });
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const isValid = fields.map(validateField).every(Boolean);
  const status = contactForm.querySelector(".form-status");

  if (!isValid) {
    status.textContent = "There’s one more detail to check before this can be sent.";
    status.classList.add("is-error");
    fields.find((field) => field.getAttribute("aria-invalid") === "true")?.focus();
    return;
  }

  status.classList.remove("is-error");
  status.textContent = "Thanks — your note is ready to send. This demo form does not make a network request.";
  contactForm.reset();
  fields.forEach((field) => {
    field.setAttribute("aria-invalid", "false");
    field.closest(".form-field").classList.remove("is-error");
    const help = field.closest(".form-field").querySelector(".form-help");
    help.textContent = help.dataset.default;
  });
});
