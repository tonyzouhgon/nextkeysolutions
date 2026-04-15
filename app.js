document.addEventListener("DOMContentLoaded", () => {
  const serviceForm = document.getElementById("serviceForm");
  const formStatus = document.getElementById("formStatus");
  const photosInput = document.getElementById("photos");
  const serviceType = document.getElementById("serviceType");
  const preferredLanguage = document.getElementById("preferredLanguage");
  const btnEn = document.getElementById("lang-en");
  const btnEs = document.getElementById("lang-es");
  const whatsappBtn = document.getElementById("whatsappBtn");
  const submitBtn = document.getElementById("submitBtn");

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
        hvac: "Please include details like: not cooling, not turning on, leaking, strange noise, or poor airflow.",
        plumbing: "Please include details like: leak location, clogged drain, toilet issue, water heater issue, or low pressure.",
        electrical: "Please include details like: outlet not working, breaker issue, flickering lights, or burning smell.",
        handyman: "Please describe the repair, installation, or maintenance task as clearly as possible.",
        "property-maintenance": "Please include the property name, unit number if applicable, and type of maintenance needed.",
        general: "Please describe the issue in as much detail as possible."
      },
      validation: {
        fullName: "Full name is required.",
        phone: "Phone number is required.",
        serviceType: "Please select a service type.",
        message: "Please describe the problem.",
        consent: "You must agree to be contacted regarding your service request."
      },
      status: {
        sending: "Sending your request...",
        success: "Your request has been submitted successfully.",
        error: "There was a problem sending your request. Please try again.",
        validation: "Please review the form and correct the required fields."
      },
      whatsappMessage: (name, service, message, phone) =>
        `Hi, my name is ${name}. I need help with ${service}. ${message}. My phone number is ${phone}`
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
        hvac: "Por favor incluye detalles como: no enfría, no enciende, fuga, ruido extraño o poco flujo de aire.",
        plumbing: "Por favor incluye detalles como: ubicación de la fuga, drenaje tapado, problema de inodoro, calentador de agua o baja presión.",
        electrical: "Por favor incluye detalles como: contacto sin funcionar, problema de breaker, luces parpadeando o olor a quemado.",
        handyman: "Por favor describe la reparación, instalación o tarea de mantenimiento lo más claro posible.",
        "property-maintenance": "Por favor incluye el nombre de la propiedad, número de unidad si aplica y el tipo de mantenimiento necesario.",
        general: "Por favor describe el problema con la mayor cantidad de detalle posible."
      },
      validation: {
        fullName: "El nombre completo es obligatorio.",
        phone: "El número de teléfono es obligatorio.",
        serviceType: "Por favor selecciona un tipo de servicio.",
        message: "Por favor describe el problema.",
        consent: "Debes aceptar ser contactado con respecto a tu solicitud de servicio."
      },
      status: {
        sending: "Enviando su solicitud...",
        success: "Su solicitud fue enviada correctamente.",
        error: "Hubo un problema al enviar su solicitud. Inténtelo de nuevo.",
        validation: "Por favor revise el formulario y complete los campos requeridos."
      },
      whatsappMessage: (name, service, message, phone) =>
        `Hola, mi nombre es ${name}. Necesito ayuda con ${service}. ${message}. Mi teléfono es ${phone}`
    }
  };

  function t() {
    return translations[currentLanguage] || translations.en;
  }

  function updateSelectOptions(selectElement, defaultText, valuesMap) {
    if (!selectElement) return;

    const currentValue = selectElement.value;
    const options = Array.from(selectElement.options);

    options.forEach((option, index) => {
      if (index === 0) {
        option.textContent = defaultText;
      } else if (valuesMap[option.value]) {
        option.textContent = valuesMap[option.value];
      }
    });

    if ([...selectElement.options].some((opt) => opt.value === currentValue)) {
      selectElement.value = currentValue;
    }
  }

  function setLanguage(language) {
    currentLanguage = language === "es" ? "es" : "en";
    localStorage.setItem("siteLanguage", currentLanguage);

    const enTexts = document.querySelectorAll(".lang.en");
    const esTexts = document.querySelectorAll(".lang.es");

    if (currentLanguage === "es") {
      enTexts.forEach((el) => (el.style.display = "none"));
      esTexts.forEach((el) => (el.style.display = "inline"));
      btnEn?.classList.remove("active");
      btnEs?.classList.add("active");
    } else {
      enTexts.forEach((el) => (el.style.display = "inline"));
      esTexts.forEach((el) => (el.style.display = "none"));
      btnEs?.classList.remove("active");
      btnEn?.classList.add("active");
    }

    updateDynamicTexts();
    updateHelperText();
    updateWhatsAppButton();
  }

  function updateDynamicTexts() {
    const lang = t();

    const fullName = document.getElementById("fullName");
    const phone = document.getElementById("phone");
    const email = document.getElementById("email");
    const zipCode = document.getElementById("zipCode");
    const message = document.getElementById("message");

    if (fullName) fullName.placeholder = lang.placeholders.fullName;
    if (phone) phone.placeholder = lang.placeholders.phone;
    if (email) email.placeholder = lang.placeholders.email;
    if (zipCode) zipCode.placeholder = lang.placeholders.zipCode;
    if (message) message.placeholder = lang.placeholders.message;
    if (submitBtn) submitBtn.textContent = lang.buttons.submit;

    updateSelectOptions(serviceType, lang.selects.serviceDefault, lang.selects.service);
    updateSelectOptions(document.getElementById("urgency"), lang.selects.urgencyDefault, lang.selects.urgency);
    updateSelectOptions(preferredLanguage, lang.selects.languageDefault, lang.selects.language);
  }

  function updateWhatsAppButton() {
    if (!whatsappBtn) return;
    whatsappBtn.textContent = t().buttons.whatsapp;
  }

  // Preview container
  let previewContainer = document.getElementById("photoPreviewContainer");

  if (!previewContainer && photosInput?.parentNode) {
    previewContainer = document.createElement("div");
    previewContainer.id = "photoPreviewContainer";
    previewContainer.style.marginTop = "15px";
    photosInput.parentNode.appendChild(previewContainer);
  }

  // Image preview
  photosInput?.addEventListener("change", () => {
    if (!previewContainer) return;
    previewContainer.innerHTML = "";

    const files = Array.from(photosInput.files || []);
    if (!files.length) return;

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) return;

      const reader = new FileReader();

      reader.onload = (e) => {
        const imgWrapper = document.createElement("div");
        imgWrapper.style.display = "inline-block";
        imgWrapper.style.marginRight = "10px";
        imgWrapper.style.marginBottom = "10px";

        const img = document.createElement("img");
        img.src = e.target?.result;
        img.alt = file.name;
        img.style.width = "90px";
        img.style.height = "90px";
        img.style.objectFit = "cover";
        img.style.borderRadius = "8px";
        img.style.border = "1px solid #ccc";

        imgWrapper.appendChild(img);
        previewContainer.appendChild(imgWrapper);
      };

      reader.readAsDataURL(file);
    });
  });

  // Helper text
  let helperText = document.getElementById("serviceHelperText");

  if (!helperText && serviceType?.parentNode) {
    helperText = document.createElement("p");
    helperText.id = "serviceHelperText";
    helperText.style.marginTop = "8px";
    helperText.style.fontSize = "0.9rem";
    helperText.style.color = "#555";
    serviceType.parentNode.appendChild(helperText);
  }

  function updateHelperText() {
    if (!helperText || !serviceType) return;
    helperText.textContent = t().helper[serviceType.value] || "";
  }

  serviceType?.addEventListener("change", updateHelperText);

  function validateForm(data) {
    const errors = [];
    const lang = t();

    if (!data.fullName.trim()) errors.push(lang.validation.fullName);
    if (!data.phone.trim()) errors.push(lang.validation.phone);
    if (!data.serviceType.trim()) errors.push(lang.validation.serviceType);
    if (!data.message.trim()) errors.push(lang.validation.message);
    if (!data.contactConsent) errors.push(lang.validation.consent);

    return errors;
  }

  function setFormStatus(type) {
    if (!formStatus) return;

    formStatus.textContent = t().status[type] || "";

    if (type === "success") {
      formStatus.style.color = "green";
    } else if (type === "sending") {
      formStatus.style.color = "#0077ff";
    } else {
      formStatus.style.color = "red";
    }
  }

  serviceForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(serviceForm);

    const payload = {
      fullName: String(formData.get("fullName") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      zipCode: String(formData.get("zipCode") || "").trim(),
      serviceType: String(formData.get("serviceType") || "").trim(),
      urgency: String(formData.get("urgency") || "").trim(),
      preferredLanguage: String(formData.get("preferredLanguage") || "").trim(),
      message: String(formData.get("message") || "").trim(),
      contactConsent: formData.get("contactConsent") === "on"
    };

    const validationErrors = validateForm(payload);

    if (validationErrors.length > 0) {
      setFormStatus("validation");
      console.warn("Validation errors:", validationErrors);
      return;
    }

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

      const result = await response.text();
      console.log("Server response:", result);

      setFormStatus("success");
      serviceForm.reset();

      if (previewContainer) previewContainer.innerHTML = "";
      if (helperText) helperText.textContent = "";

      updateDynamicTexts();
      updateWhatsAppButton();
    } catch (error) {
      console.error("Submission error:", error);
      setFormStatus("error");
    }
  });

  whatsappBtn?.addEventListener("click", function () {
    const fullName = document.querySelector('[name="fullName"]')?.value?.trim() || "";
    const phone = document.querySelector('[name="phone"]')?.value?.trim() || "";
    const serviceValue = document.querySelector('[name="serviceType"]')?.value || "";
    const message = document.querySelector('[name="message"]')?.value?.trim() || "";

    const serviceLabel =
      t().selects.service[serviceValue] ||
      serviceValue ||
      (currentLanguage === "es" ? "servicio" : "service");

    const text = t().whatsappMessage(fullName, serviceLabel, message, phone);
    this.href = "https://wa.me/17024434470?text=" + encodeURIComponent(text);
  });

  btnEn?.addEventListener("click", () => setLanguage("en"));
  btnEs?.addEventListener("click", () => setLanguage("es"));

  setLanguage(currentLanguage);
});