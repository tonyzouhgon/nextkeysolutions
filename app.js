document.addEventListener("DOMContentLoaded", () => {
const serviceForm = document.getElementById("serviceForm");
const formStatus = document.getElementById("formStatus");
const photosInput = document.getElementById("photos");
const serviceType = document.getElementById("serviceType");
const preferredLanguage = document.getElementById("preferredLanguage");
const urgencySelect = document.getElementById("urgency");
const btnEn = document.getElementById("lang-en");
const btnEs = document.getElementById("lang-es");
const whatsappBtn = document.getElementById("whatsappBtn");
const submitBtn = document.getElementById("submitBtn");
const header = document.querySelector(".site-header");
const progressBar = document.getElementById("scrollProgressBar");
const navLinks = Array.from(document.querySelectorAll(".main-nav a[href^='#']"));
const revealElements = Array.from(document.querySelectorAll(".reveal"));
const faqItems = Array.from(document.querySelectorAll(".faq-item"));
const galleryCards = Array.from(document.querySelectorAll(".gallery-card"));

let currentLanguage = localStorage.getItem("siteLanguage") || "en";

const translations = {
en: {
placeholders: {
fullName: "Your full name",
phone: "Your phone number",
email: "Your email address",
zipCode: "Your ZIP code",
message: "Tell us what is happening..."
},
selects: {
serviceDefault: "Select a service",
service: {
hvac: "HVAC",
plumbing: "Plumbing",
electrical: "Electrical",
handyman: "Handyman",
"property-maintenance": "Property Maintenance",
general: "General Repair"
},
urgencyDefault: "Select urgency",
urgency: {
low: "Low",
normal: "Normal",
urgent: "Urgent",
emergency: "Emergency"
},
languageDefault: "Select language",
language: {
english: "English",
spanish: "Spanish"
}
},
buttons: {
submit: "Submit Request",
whatsapp: "Chat on WhatsApp"
},
helper: {
hvac: "Please include details like: not cooling, not turning on, leaking, strange noise, poor airflow, thermostat issue, or recent repairs.",
plumbing: "Please include details like: leak location, clogged drain, toilet issue, water heater issue, low pressure, or when the problem started.",
electrical: "Please include details like: outlet not working, breaker issue, flickering lights, no power, burning smell, or affected area.",
handyman: "Please describe the repair, installation, assembly, touch-up, or maintenance task as clearly as possible.",
"property-maintenance": "Please include the property name, unit number if applicable, and the type of maintenance needed.",
general: "Please describe the issue in as much detail as possible."
},
validation: {
fullName: "Full name is required.",
phone: "Phone number is required.",
phoneFormat: "Please enter a valid phone number.",
emailFormat: "Please enter a valid email address.",
serviceType: "Please select a service type.",
message: "Please describe the problem.",
consent: "You must agree to be contacted regarding your service request."
},
status: {
sending: "Sending your request...",
success: "Your request has been submitted successfully.",
error: "There was a problem sending your request. Please try again.",
validation: "Please review the form and correct the highlighted fields."
},
stripePlaceholder:
"Stripe payment is not configured yet. Replace the current placeholders with your real Buy Button ID and publishable key.",
faq: {
open: "Open answer",
close: "Close answer"
},
whatsappMessage: (name, service, message, phone) =>
`Hi, my name is ${name}. I need help with ${service}. ${message}. My phone number is ${phone}.`
},
es: {
placeholders: {
fullName: "Tu nombre completo",
phone: "Tu número de teléfono",
email: "Tu correo electrónico",
zipCode: "Tu código postal",
message: "Cuéntanos qué está pasando..."
},
selects: {
serviceDefault: "Selecciona un servicio",
service: {
hvac: "HVAC",
plumbing: "Plomería",
electrical: "Electricidad",
handyman: "Handyman",
"property-maintenance": "Mantenimiento de Propiedades",
general: "Reparación General"
},
urgencyDefault: "Selecciona urgencia",
urgency: {
low: "Baja",
normal: "Normal",
urgent: "Urgente",
emergency: "Emergencia"
},
languageDefault: "Selecciona idioma",
language: {
english: "Inglés",
spanish: "Español"
}
},
buttons: {
submit: "Enviar Solicitud",
whatsapp: "Chatear por WhatsApp"
},
helper: {
hvac: "Por favor incluye detalles como: no enfría, no enciende, fuga, ruido extraño, poco flujo de aire, problema con termostato o reparaciones recientes.",
plumbing: "Por favor incluye detalles como: ubicación de la fuga, drenaje tapado, problema de inodoro, calentador de agua, baja presión o cuándo empezó el problema.",
electrical: "Por favor incluye detalles como: contacto sin funcionar, problema de breaker, luces parpadeando, falta de energía, olor a quemado o área afectada.",
handyman: "Por favor describe la reparación, instalación, ensamblaje, retoque o tarea de mantenimiento lo más claro posible.",
"property-maintenance": "Por favor incluye el nombre de la propiedad, número de unidad si aplica y el tipo de mantenimiento necesario.",
general: "Por favor describe el problema con la mayor cantidad de detalle posible."
},
validation: {
fullName: "El nombre completo es obligatorio.",
phone: "El número de teléfono es obligatorio.",
phoneFormat: "Por favor ingresa un número de teléfono válido.",
emailFormat: "Por favor ingresa un correo electrónico válido.",
serviceType: "Por favor selecciona un tipo de servicio.",
message: "Por favor describe el problema.",
consent: "Debes aceptar ser contactado con respecto a tu solicitud de servicio."
},
status: {
sending: "Enviando su solicitud...",
success: "Su solicitud fue enviada correctamente.",
error: "Hubo un problema al enviar su solicitud. Inténtelo de nuevo.",
validation: "Por favor revise el formulario y corrija los campos marcados."
},
stripePlaceholder:
"Stripe aún no está configurado. Reemplaza los placeholders con tu Buy Button ID y tu publishable key reales.",
faq: {
open: "Abrir respuesta",
close: "Cerrar respuesta"
},
whatsappMessage: (name, service, message, phone) =>
`Hola, mi nombre es ${name}. Necesito ayuda con ${service}. ${message}. Mi teléfono es ${phone}.`
}
};

function t() {
return translations[currentLanguage] || translations.en;
}

function getField(id) {
return document.getElementById(id);
}

function normalizePhone(value) {
return value.replace(/[^\d+]/g, "").trim();
}

function isValidPhone(value) {
const cleaned = value.replace(/[^\d]/g, "");
return cleaned.length >= 10;
}

function isValidEmail(value) {
if (!value.trim()) return true;
return /^[^\s@]+@[^\s@]+.[^\s@]+$/.test(value.trim());
}

function updateSelectOptions(selectElement, defaultText, valuesMap) {
if (!selectElement) return;

```
const currentValue = selectElement.value;
const options = Array.from(selectElement.options);

options.forEach((option, index) => {
  if (index === 0) {
    option.textContent = defaultText;
  } else if (valuesMap[option.value]) {
    option.textContent = valuesMap[option.value];
  }
});

if (Array.from(selectElement.options).some((opt) => opt.value === currentValue)) {
  selectElement.value = currentValue;
}
```

}

function clearFieldError(field) {
if (!field) return;
field.classList.remove("input-error");

```
const existing = field.parentElement?.querySelector(".field-error");
if (existing) {
  existing.remove();
}
```

}

function setFieldError(field, message) {
if (!field) return;
clearFieldError(field);
field.classList.add("input-error");

```
const error = document.createElement("p");
error.className = "field-error";
error.textContent = message;
field.parentElement?.appendChild(error);
```

}

function clearAllFieldErrors() {
const fields = serviceForm?.querySelectorAll("input, select, textarea") || [];
fields.forEach((field) => clearFieldError(field));
}

function validateForm(data) {
const errors = {};
const lang = t();

```
if (!data.fullName.trim()) {
  errors.fullName = lang.validation.fullName;
}

if (!data.phone.trim()) {
  errors.phone = lang.validation.phone;
} else if (!isValidPhone(data.phone)) {
  errors.phone = lang.validation.phoneFormat;
}

if (data.email.trim() && !isValidEmail(data.email)) {
  errors.email = lang.validation.emailFormat;
}

if (!data.serviceType.trim()) {
  errors.serviceType = lang.validation.serviceType;
}

if (!data.message.trim()) {
  errors.message = lang.validation.message;
}

if (!data.contactConsent) {
  errors.contactConsent = lang.validation.consent;
}

return errors;
```

}

function showValidationErrors(errors) {
clearAllFieldErrors();

```
if (errors.fullName) setFieldError(getField("fullName"), errors.fullName);
if (errors.phone) setFieldError(getField("phone"), errors.phone);
if (errors.email) setFieldError(getField("email"), errors.email);
if (errors.serviceType) setFieldError(getField("serviceType"), errors.serviceType);
if (errors.message) setFieldError(getField("message"), errors.message);
if (errors.contactConsent) setFieldError(getField("contactConsent"), errors.contactConsent);
```

}

function setFormStatus(type) {
if (!formStatus) return;
formStatus.textContent = t().status[type] || "";

```
if (type === "success") {
  formStatus.style.color = "#15803d";
} else if (type === "sending") {
  formStatus.style.color = "#0f6fff";
} else {
  formStatus.style.color = "#dc2626";
}
```

}

function updateWhatsAppButton() {
if (!whatsappBtn) return;
whatsappBtn.textContent = t().buttons.whatsapp;
}

function updateHelperText() {
if (!serviceType) return;

```
let helperText = document.getElementById("serviceHelperText");

if (!helperText && serviceType.parentNode) {
  helperText = document.createElement("p");
  helperText.id = "serviceHelperText";
  helperText.className = "service-helper-text";
  serviceType.parentNode.appendChild(helperText);
}

if (helperText) {
  helperText.textContent = t().helper[serviceType.value] || "";
}
```

}

function updateDynamicTexts() {
const lang = t();

```
const fullName = getField("fullName");
const phone = getField("phone");
const email = getField("email");
const zipCode = getField("zipCode");
const message = getField("message");

if (fullName) fullName.placeholder = lang.placeholders.fullName;
if (phone) phone.placeholder = lang.placeholders.phone;
if (email) email.placeholder = lang.placeholders.email;
if (zipCode) zipCode.placeholder = lang.placeholders.zipCode;
if (message) message.placeholder = lang.placeholders.message;
if (submitBtn) submitBtn.textContent = lang.buttons.submit;

updateSelectOptions(serviceType, lang.selects.serviceDefault, lang.selects.service);
updateSelectOptions(urgencySelect, lang.selects.urgencyDefault, lang.selects.urgency);
updateSelectOptions(preferredLanguage, lang.selects.languageDefault, lang.selects.language);
```

}

function setLanguage(language) {
currentLanguage = language === "es" ? "es" : "en";
localStorage.setItem("siteLanguage", currentLanguage);

```
document.querySelectorAll(".lang.en").forEach((el) => {
  el.style.display = currentLanguage === "en" ? "inline" : "none";
});

document.querySelectorAll(".lang.es").forEach((el) => {
  el.style.display = currentLanguage === "es" ? "inline" : "none";
});

btnEn?.classList.toggle("active", currentLanguage === "en");
btnEs?.classList.toggle("active", currentLanguage === "es");

updateDynamicTexts();
updateHelperText();
updateWhatsAppButton();
updateStripePlaceholder();
updateFaqAccessibilityText();
```

}

function setupPhotoPreview() {
if (!photosInput) return;

```
let previewContainer = document.getElementById("photoPreviewContainer");

if (!previewContainer && photosInput.parentNode) {
  previewContainer = document.createElement("div");
  previewContainer.id = "photoPreviewContainer";
  previewContainer.className = "photo-preview-container";
  photosInput.parentNode.appendChild(previewContainer);
}

photosInput.addEventListener("change", () => {
  if (!previewContainer) return;

  previewContainer.innerHTML = "";
  const files = Array.from(photosInput.files || []);

  files.forEach((file) => {
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const wrapper = document.createElement("div");
      wrapper.className = "photo-preview-item";

      const img = document.createElement("img");
      img.src = String(e.target?.result || "");
      img.alt = file.name;

      wrapper.appendChild(img);
      previewContainer.appendChild(wrapper);
    };

    reader.readAsDataURL(file);
  });
});
```

}

function updateHeaderOnScroll() {
if (!header) return;
header.classList.toggle("header-scrolled", window.scrollY > 20);
}

function updateScrollProgress() {
if (!progressBar) return;

```
const scrollTop = window.scrollY;
const docHeight = document.documentElement.scrollHeight - window.innerHeight;
const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
progressBar.style.width = `${Math.min(progress, 100)}%`;
```

}

function setupActiveNav() {
const sections = navLinks
.map((link) => {
const href = link.getAttribute("href");
if (!href || !href.startsWith("#")) return null;
const section = document.querySelector(href);
if (!section) return null;
return { link, section };
})
.filter(Boolean);

```
if (!sections.length) return;

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const match = sections.find((item) => item.section === entry.target);
      if (!match) return;

      if (entry.isIntersecting) {
        navLinks.forEach((link) => link.classList.remove("is-active"));
        match.link.classList.add("is-active");
      }
    });
  },
  {
    threshold: 0.45
  }
);

sections.forEach((item) => observer.observe(item.section));
```

}

function setupRevealAnimations() {
if (!revealElements.length) return;

```
const observer = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        obs.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.14
  }
);

revealElements.forEach((el) => observer.observe(el));
```

}

function setupFaq() {
if (!faqItems.length) return;

```
faqItems.forEach((item, index) => {
  const answerCandidates = Array.from(item.children).filter((child) => child.tagName === "P");
  if (!answerCandidates.length) return;

  const answer = answerCandidates[0];
  const answerId = `faq-answer-${index + 1}`;

  answer.classList.add("faq-answer");
  answer.id = answerId;

  item.setAttribute("tabindex", "0");
  item.setAttribute("role", "button");
  item.setAttribute("aria-expanded", "false");
  item.setAttribute("aria-controls", answerId);

  function toggleFaq() {
    const isOpen = item.classList.toggle("is-open");
    item.setAttribute("aria-expanded", String(isOpen));
    item.setAttribute("aria-label", isOpen ? t().faq.close : t().faq.open);
  }

  item.addEventListener("click", toggleFaq);
  item.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleFaq();
    }
  });
});

updateFaqAccessibilityText();
```

}

function updateFaqAccessibilityText() {
faqItems.forEach((item) => {
const isOpen = item.classList.contains("is-open");
item.setAttribute("aria-label", isOpen ? t().faq.close : t().faq.open);
});
}

function updateStripePlaceholder() {
const stripeButton = document.querySelector("stripe-buy-button");
if (!stripeButton) return;

```
const buyButtonId = stripeButton.getAttribute("buy-button-id");
const publishableKey = stripeButton.getAttribute("publishable-key");
const isPlaceholder =
  !buyButtonId ||
  !publishableKey ||
  buyButtonId.includes("TU_ID") ||
  publishableKey.includes("TU_PUBLIC");

const paymentBox = stripeButton.closest(".payment-box");
if (!paymentBox) return;

let placeholder = paymentBox.querySelector(".payment-placeholder");

if (isPlaceholder) {
  stripeButton.style.display = "none";

  if (!placeholder) {
    placeholder = document.createElement("div");
    placeholder.className = "payment-placeholder";
    paymentBox.appendChild(placeholder);
  }

  placeholder.textContent = t().stripePlaceholder;
} else {
  stripeButton.style.display = "block";
  if (placeholder) placeholder.remove();
}
```

}

function buildWhatsAppMessage() {
const fullName = getField("fullName")?.value?.trim() || "";
const phone = getField("phone")?.value?.trim() || "";
const serviceValue = getField("serviceType")?.value || "";
const message = getField("message")?.value?.trim() || "";

```
const serviceLabel =
  t().selects.service[serviceValue] ||
  serviceValue ||
  (currentLanguage === "es" ? "servicio" : "service");

return t().whatsappMessage(fullName || (currentLanguage === "es" ? "cliente" : "client"), serviceLabel, message || (currentLanguage === "es" ? "Necesito información" : "I need information"), phone || "");
```

}

function setupWhatsApp() {
if (!whatsappBtn) return;

```
whatsappBtn.addEventListener("click", function () {
  this.href = "https://wa.me/17024434470?text=" + encodeURIComponent(buildWhatsAppMessage());
});
```

}

function setupFormLiveValidation() {
if (!serviceForm) return;

```
["fullName", "phone", "email", "serviceType", "message"].forEach((id) => {
  const field = getField(id);
  if (!field) return;

  field.addEventListener("input", () => {
    clearFieldError(field);
  });

  field.addEventListener("change", () => {
    clearFieldError(field);
  });
});

const consent = getField("contactConsent");
consent?.addEventListener("change", () => clearFieldError(consent));
```

}

function setupFormSubmit() {
if (!serviceForm) return;

```
serviceForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = {
    fullName: String(getField("fullName")?.value || "").trim(),
    phone: String(getField("phone")?.value || "").trim(),
    email: String(getField("email")?.value || "").trim(),
    zipCode: String(getField("zipCode")?.value || "").trim(),
    serviceType: String(getField("serviceType")?.value || "").trim(),
    urgency: String(getField("urgency")?.value || "").trim(),
    preferredLanguage: String(getField("preferredLanguage")?.value || "").trim(),
    message: String(getField("message")?.value || "").trim(),
    contactConsent: getField("contactConsent")?.checked === true
  };

  payload.phone = normalizePhone(payload.phone);

  const errors = validateForm(payload);

  if (Object.keys(errors).length > 0) {
    showValidationErrors(errors);
    setFormStatus("validation");
    return;
  }

  clearAllFieldErrors();
  setFormStatus("sending");

  try {
    const response = await fetch("https://hook.us2.make.com/ucvv3upj9ym80knwea1d8z34gtyjrjlt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Failed to submit form. Status: ${response.status}`);
    }

    setFormStatus("success");
    serviceForm.reset();

    const previewContainer = document.getElementById("photoPreviewContainer");
    if (previewContainer) previewContainer.innerHTML = "";

    updateHelperText();
    updateDynamicTexts();
  } catch (error) {
    console.error(error);
    setFormStatus("error");
  }
});
```

}

function setupSmoothScroll() {
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
anchor.addEventListener("click", function (e) {
const href = this.getAttribute("href");
if (!href || href === "#") return;

```
    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });
});
```

}

function setupGalleryTilt() {
if (!galleryCards.length || window.matchMedia("(pointer: coarse)").matches) return;

```
galleryCards.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateY = ((x / rect.width) - 0.5) * 6;
    const rotateX = ((y / rect.height) - 0.5) * -6;

    card.style.transform = `translateY(-6px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});
```

}

btnEn?.addEventListener("click", () => setLanguage("en"));
btnEs?.addEventListener("click", () => setLanguage("es"));
serviceType?.addEventListener("change", updateHelperText);

setupPhotoPreview();
setupWhatsApp();
setupFormLiveValidation();
setupFormSubmit();
setupSmoothScroll();
setupRevealAnimations();
setupActiveNav();
setupFaq();
setupGalleryTilt();
setLanguage(currentLanguage);
updateHeaderOnScroll();
updateScrollProgress();

window.addEventListener("scroll", () => {
updateHeaderOnScroll();
updateScrollProgress();
});
});
