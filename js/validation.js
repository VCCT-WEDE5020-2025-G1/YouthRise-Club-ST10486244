document.addEventListener('DOMContentLoaded', () => {
    const volunteerForm = document.getElementById('volunteerForm');
    const donationForm = document.getElementById('donationForm');

    // Validation patterns
    const patterns = {
        name: /^[A-Za-z\s]{2,}$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phone: /^[\d\s+-]{10,}$/,
        amount: /^\d+$/
    };

    // Error messages
    const errorMessages = {
        name: {
            pattern: 'Please enter a valid name (letters and spaces only)',
            required: 'Name is required',
            minlength: 'Name must be at least 2 characters'
        },
        email: {
            pattern: 'Please enter a valid email address',
            required: 'Email is required'
        },
        phone: {
            pattern: 'Please enter a valid phone number'
        },
        skills: {
            required: 'Please list your skills',
            minlength: 'Please provide more detail about your skills'
        },
        reason: {
            required: 'Please tell us why you want to volunteer',
            minlength: 'Please provide more detail about your motivation'
        },
        amount: {
            required: 'Please enter an amount',
            min: 'Minimum donation amount is R10'
        },
        payment: {
            required: 'Please select a payment method'
        }
    };

    // Add validation to Volunteer Form
    if (volunteerForm) {
        volunteerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateVolunteerForm()) {
                handleVolunteerSubmission();
            }
        });

        // Real-time validation
        volunteerForm.querySelectorAll('input, textarea').forEach(field => {
            field.addEventListener('blur', () => validateField(field));
            field.addEventListener('input', () => {
                if (field.classList.contains('error')) {
                    validateField(field);
                }
            });
        });
    }

    // Add validation to Donation Form
    if (donationForm) {
        // Add real-time email validation
        const emailInput = donationForm.querySelector('#donor_email');
        emailInput.addEventListener('input', function() {
            validateEmail(this);
        });

        donationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateDonationForm()) {
                handleDonationSubmission();
            }
        });

        // Real-time validation
        donationForm.querySelectorAll('input, select').forEach(field => {
            field.addEventListener('blur', () => validateField(field));
            field.addEventListener('input', () => {
                if (field.classList.contains('error')) {
                    validateField(field);
                }
            });
        });
    }

    function validateField(field) {
        const errorElement = document.getElementById(`${field.id}-error`);
        let isValid = true;

        // Clear previous errors
        field.classList.remove('error');
        errorElement.textContent = '';
        errorElement.style.display = 'none';

        // Required field validation
        if (field.required && !field.value.trim()) {
            showError(field, errorMessages[field.name.split('_')[1]].required);
            isValid = false;
        }

        // Pattern validation for text inputs
        if (field.value && field.pattern) {
            const regex = new RegExp(field.pattern);
            if (!regex.test(field.value)) {
                showError(field, errorMessages[field.name.split('_')[1]].pattern);
                isValid = false;
            }
        }

        // Minimum length validation
        if (field.minLength && field.value.length < field.minLength) {
            showError(field, errorMessages[field.name.split('_')[1]].minlength);
            isValid = false;
        }

        // Amount validation for donation
        if (field.id === 'donation_amount' && field.value < 10) {
            showError(field, errorMessages.amount.min);
            isValid = false;
        }

        return isValid;
    }

    function validateEmail(emailInput) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const errorElement = document.getElementById('donor_email-error');

        if (!emailInput.value) {
            showError(emailInput, errorElement, 'Email is required');
            return false;
        } else if (!emailRegex.test(emailInput.value)) {
            showError(emailInput, errorElement, 'Please enter a valid email address');
            return false;
        } else {
            clearError(emailInput, errorElement);
            return true;
        }
    }

    function validatePaymentMethod(selectElement) {
        const errorElement = document.getElementById('payment_method-error');

        if (!selectElement.value) {
            showError(selectElement, errorElement, 'Please select a payment method');
            return false;
        } else {
            clearError(selectElement, errorElement);
            return true;
        }
    }

    function validateVolunteerForm() {
        let isValid = true;
        const fields = volunteerForm.querySelectorAll('input, textarea');

        fields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    function validateDonationForm() {
        const form = document.getElementById('donationForm');
        let isValid = true;

        // Validate email
        isValid = validateEmail(form.querySelector('#donor_email')) && isValid;

        // Validate payment method
        isValid = validatePaymentMethod(form.querySelector('#payment_method')) && isValid;

        // Validate amount
        const amountInput = form.querySelector('#donation_amount');
        if (!amountInput.value || amountInput.value < 10) {
            showError(
                amountInput,
                document.getElementById('donation_amount-error'),
                'Minimum donation amount is R10'
            );
            isValid = false;
        }

        return isValid;
    }

    function showError(field, message) {
        const errorElement = document.getElementById(`${field.id}-error`);
        field.classList.add('error');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    function showError(element, errorSpan, message) {
        element.classList.add('error');
        errorSpan.textContent = message;
        errorSpan.style.display = 'block';
    }

    function clearError(element, errorSpan) {
        element.classList.remove('error');
        errorSpan.textContent = '';
        errorSpan.style.display = 'none';
    }

    async function handleVolunteerSubmission() {
        const submitBtn = volunteerForm.querySelector('.submit-btn');
        const spinner = volunteerForm.querySelector('.spinner');
        const responseDiv = document.getElementById('volunteerResponse');

        try {
            // Disable submit button and show spinner
            submitBtn.disabled = true;
            spinner.classList.remove('hidden');

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success message
            showResponse(responseDiv, 'Thank you for signing up to volunteer! We will contact you soon.', 'success');
            volunteerForm.reset();
        } catch (error) {
            showResponse(responseDiv, 'An error occurred. Please try again.', 'error');
        } finally {
            submitBtn.disabled = false;
            spinner.classList.add('hidden');
        }
    }

    async function handleDonationSubmission() {
        const form = document.getElementById('donationForm');
        const submitBtn = form.querySelector('.submit-btn');
        const spinner = form.querySelector('.spinner');
        const btnText = submitBtn.querySelector('.btn-text');
        const responseDiv = document.getElementById('donationResponse');

        try {
            // Disable submit button and show spinner
            submitBtn.disabled = true;
            spinner.classList.remove('hidden');
            btnText.textContent = 'Processing...';

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success and redirect
            showResponse(responseDiv, 'Donation validated! Redirecting to payment...', 'success');

            // Simulate redirect to payment gateway
            setTimeout(() => {
                alert('Redirecting to payment gateway...');
                // Add actual payment gateway redirect here
            }, 2000);
        } catch (error) {
            showResponse(responseDiv, 'An error occurred. Please try again.', 'error');
        } finally {
            submitBtn.disabled = false;
            spinner.classList.add('hidden');
            btnText.textContent = 'Proceed to Payment';
        }
    }

    function showResponse(element, message, type) {
        element.textContent = message;
        element.className = `response-message ${type}`;
        element.classList.remove('hidden');
        element.scrollIntoView({ behavior: 'smooth' });
    }
});