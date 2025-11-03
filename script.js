document.addEventListener("DOMContentLoaded", function () {
  // Form selectors
  const forms = {
    contact: document.getElementById("contactForm"),
    volunteer: document.getElementById("volunteerForm"),
    donation: document.getElementById("donationForm"),
  };

  // Form configurations
  const formConfig = {
    contact: {
      successMessage: "Your message has been sent successfully!",
      buttonText: "Send Message",
    },
    volunteer: {
      successMessage:
        "Thank you for signing up to volunteer! We will contact you soon.",
      buttonText: "Sign Up to Volunteer",
    },
    donation: {
      successMessage: "Thank you for your donation! Redirecting to payment...",
      buttonText: "Proceed to Payment",
    },
  };

  // Attach submit handlers to all forms
  Object.entries(forms).forEach(([formType, form]) => {
    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        await handleFormSubmission(form, formType);
      });
    }
  });

  const supportForm = document.getElementById("supportForm");
  const supportType = document.getElementById("support_type");
  const volunteerFields = document.querySelector(".volunteer-fields");
  const donationFields = document.querySelector(".donation-fields");
  const submitBtn = supportForm?.querySelector(".btn-text");

  if (supportType) {
    supportType.addEventListener("change", function () {
      const selectedType = this.value;
      updateFormFields(selectedType);
      updateSubmitButtonText(selectedType);
    });
  }

  function updateFormFields(type) {
    if (volunteerFields && donationFields) {
      volunteerFields.classList.toggle("hidden", type !== "volunteer");
      donationFields.classList.toggle("hidden", type !== "donation");

      // Update required attributes based on type
      volunteerFields.querySelectorAll("[data-required]").forEach((field) => {
        field.required = type === "volunteer";
      });
      donationFields.querySelectorAll("[data-required]").forEach((field) => {
        field.required = type === "donation";
      });
    }
  }

  function updateSubmitButtonText(type) {
    if (submitBtn) {
      submitBtn.textContent =
        type === "volunteer"
          ? "Sign Up to Volunteer"
          : type === "donation"
          ? "Proceed to Payment"
          : "Submit";
    }
  }

  if (supportForm) {
    supportForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const type = supportType.value;
      if (!type) {
        showError(supportType, "Please select how you want to help");
        return;
      }

      await handleFormSubmission(supportForm, type);
    });
  }

  async function handleFormSubmission(form, type) {
    if (!validateForm(form, type)) return;

    const submitBtn = form.querySelector(".submit-btn");
    const spinner = form.querySelector(".spinner");
    const btnText = form.querySelector(".btn-text");
    const responseDiv = document.getElementById("supportResponse");

    updateSubmitButtonState(submitBtn, spinner, btnText, true, "Processing...");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const successMessage =
        type === "volunteer"
          ? "Thank you for signing up to volunteer! We will contact you soon."
          : "Thank you for your donation! Redirecting to payment...";

      showResponse(responseDiv, successMessage, "success");
      form.reset();
      updateFormFields("");
      updateSubmitButtonText("");

      if (type === "donation") {
        handleDonationRedirect();
      }
    } catch (error) {
      showResponse(
        responseDiv,
        "Sorry, there was an error. Please try again.",
        "error"
      );
    } finally {
      updateSubmitButtonState(
        submitBtn,
        spinner,
        btnText,
        false,
        type === "volunteer"
          ? "Sign Up to Volunteer"
          : type === "donation"
          ? "Proceed to Payment"
          : "Submit"
      );
    }
  }

  function validateForm(form, type) {
    let isValid = true;
    clearErrors(form);

    // Validate common fields
    form.querySelectorAll("[required]").forEach((field) => {
      if (!validateField(field)) {
        isValid = false;
      }
    });

    // Type-specific validations
    if (type === "volunteer") {
      const skills = form.querySelector("#volunteer_skills");
      const reason = form.querySelector("#volunteer_reason");
      if (!skills.value.trim()) {
        showError(skills, "Please list your skills or interests");
        isValid = false;
      }
      if (!reason.value.trim()) {
        showError(reason, "Please tell us why you want to volunteer");
        isValid = false;
      }
    } else if (type === "donation") {
      isValid = validateDonationAmount(form) && isValid;
      const paymentMethod = form.querySelector("#payment_method");
      if (!paymentMethod.value) {
        showError(paymentMethod, "Please select a payment method");
        isValid = false;
      }
    }

    return isValid;
  }

  function validateField(field) {
    const value = field.value.trim();

    if (!value) {
      showError(field, `${formatFieldName(field.name)} is required`);
      return false;
    }

    switch (field.type) {
      case "email":
        if (!isValidEmail(value)) {
          showError(field, "Please enter a valid email address");
          return false;
        }
        break;
      case "tel":
        if (!isValidPhone(value)) {
          showError(field, "Please enter a valid phone number");
          return false;
        }
        break;
      case "text":
        if (field.minLength && value.length < field.minLength) {
          showError(field, `Minimum ${field.minLength} characters required`);
          return false;
        }
        break;
    }

    return true;
  }

  function validateDonationAmount(form) {
    const amountField = form.querySelector("#donation_amount");
    if (amountField && parseFloat(amountField.value) < 10) {
      showError(amountField, "Minimum donation amount is R10");
      return false;
    }
    return true;
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isValidPhone(phone) {
    return /^[\d\s+-]+$/.test(phone);
  }

  function formatFieldName(name) {
    return name
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  }

  function showError(field, message) {
    const errorSpan = document.getElementById(`${field.id}-error`);
    if (errorSpan) {
      errorSpan.textContent = message;
      errorSpan.style.display = "block";
      field.classList.add("error");
    }
  }

  function clearErrors(form) {
    form.querySelectorAll(".error-message").forEach((span) => {
      span.style.display = "none";
    });
    form.querySelectorAll(".error").forEach((field) => {
      field.classList.remove("error");
    });
  }

  function showResponse(element, message, type) {
    if (!element) return;
    element.textContent = message;
    element.className = `response-message ${type}`;
    element.classList.remove("hidden");
    element.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function updateSubmitButtonState(
    button,
    spinner,
    textElement,
    isLoading,
    text
  ) {
    button.disabled = isLoading;
    spinner?.classList.toggle("hidden", !isLoading);
    if (textElement) textElement.textContent = text;
  }

  function handleDonationRedirect() {
    setTimeout(() => {
      alert("Redirecting to secure payment gateway...");
      // Add actual payment gateway redirect logic here
    }, 2000);
  }
});