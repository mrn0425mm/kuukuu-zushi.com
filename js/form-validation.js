/**
 * Form Validation & Submission
 * Handles recruit and reservation forms
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize forms
  const recruitForm = document.getElementById('recruit-form');
  const reservationForm = document.getElementById('reservation-form');

  if (recruitForm) {
    initForm(recruitForm, 'recruit');
  }

  if (reservationForm) {
    initForm(reservationForm, 'reservation');
  }
});

/**
 * Initialize Form
 * Sets up validation and submission
 */
function initForm(form, formType) {
  const inputs = form.querySelectorAll('input, select, textarea');

  // Real-time validation
  inputs.forEach(input => {
    // Validate on blur
    input.addEventListener('blur', () => {
      validateField(input);
    });

    // Remove error on input
    input.addEventListener('input', () => {
      const formGroup = input.closest('.form-group');
      if (formGroup.classList.contains('error')) {
        validateField(input);
      }
    });
  });

  // Form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate all fields
    let isValid = true;
    inputs.forEach(input => {
      if (!validateField(input)) {
        isValid = false;
      }
    });

    // If valid, submit form
    if (isValid) {
      submitForm(form, formType);
    } else {
      // Scroll to first error
      const firstError = form.querySelector('.form-group.error');
      if (firstError) {
        firstError.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  });
}

/**
 * Validate Field
 * Validates individual form field
 */
function validateField(input) {
  const formGroup = input.closest('.form-group');
  const errorMessage = formGroup.querySelector('.error-message');

  // Skip if not required and empty
  if (!input.required && !input.value.trim()) {
    clearError(formGroup, errorMessage);
    return true;
  }

  // Check if required field is empty
  if (input.required && !input.value.trim()) {
    showError(formGroup, errorMessage, 'この項目は必須です');
    return false;
  }

  // Validate based on input type
  const inputType = input.type || input.tagName.toLowerCase();
  const value = input.value.trim();

  switch (inputType) {
    case 'email':
      if (!isValidEmail(value)) {
        showError(formGroup, errorMessage, '正しいメールアドレスを入力してください');
        return false;
      }
      break;

    case 'tel':
      if (!isValidPhone(value)) {
        showError(formGroup, errorMessage, '正しい電話番号を入力してください（例：090-1234-5678）');
        return false;
      }
      break;

    case 'number':
      const min = input.getAttribute('min');
      const max = input.getAttribute('max');
      const numValue = parseInt(value);

      if (min && numValue < parseInt(min)) {
        showError(formGroup, errorMessage, `${min}以上の値を入力してください`);
        return false;
      }

      if (max && numValue > parseInt(max)) {
        showError(formGroup, errorMessage, `${max}以下の値を入力してください`);
        return false;
      }
      break;

    case 'date':
      if (!isValidDate(value)) {
        showError(formGroup, errorMessage, '正しい日付を入力してください');
        return false;
      }
      break;

    case 'select':
      if (input.tagName.toLowerCase() === 'select' && !value) {
        showError(formGroup, errorMessage, '選択してください');
        return false;
      }
      break;
  }

  // If we got here, field is valid
  clearError(formGroup, errorMessage);
  return true;
}

/**
 * Show Error
 * Displays error message for a field
 */
function showError(formGroup, errorMessage, message) {
  formGroup.classList.add('error');
  if (errorMessage) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
  }
}

/**
 * Clear Error
 * Removes error message for a field
 */
function clearError(formGroup, errorMessage) {
  formGroup.classList.remove('error');
  if (errorMessage) {
    errorMessage.textContent = '';
    errorMessage.style.display = 'none';
  }
}

/**
 * Validate Email
 * Checks if email format is valid
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate Phone
 * Checks if phone format is valid (Japanese format)
 */
function isValidPhone(phone) {
  // Remove spaces and hyphens
  const cleanPhone = phone.replace(/[\s-]/g, '');

  // Check if it's a valid Japanese phone number
  // Mobile: 070/080/090-XXXX-XXXX (10-11 digits)
  // Landline: 0X-XXXX-XXXX or 0XX-XXX-XXXX (9-10 digits)
  const phoneRegex = /^(0[5-9]0[0-9]{8}|0[1-9][0-9]{8,9})$/;

  return phoneRegex.test(cleanPhone);
}

/**
 * Validate Date
 * Checks if date is valid and not in the past
 */
function isValidDate(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return false;
  }

  // Check if date is not in the past
  if (date < today) {
    return false;
  }

  return true;
}

/**
 * Submit Form
 * Handles form submission via Formspree
 */
async function submitForm(form, formType) {
  const submitButton = form.querySelector('button[type="submit"]');
  const btnText = submitButton.querySelector('.btn-text');
  const spinner = submitButton.querySelector('.spinner');

  // Disable submit button
  submitButton.disabled = true;
  submitButton.classList.add('loading');

  try {
    // Get form action URL
    const formAction = form.getAttribute('action');

    // If action is placeholder, show success modal without actual submission
    if (formAction.includes('YOUR_FORM_ID')) {
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Show success modal
      showSuccessMessage(formType);

      // Reset form
      form.reset();

      // Re-enable submit button
      submitButton.disabled = false;
      submitButton.classList.remove('loading');

      return;
    }

    // Actual Formspree submission
    const formData = new FormData(form);

    const response = await fetch(formAction, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      // Success
      showSuccessMessage(formType);

      // Reset form
      form.reset();
    } else {
      // Error from server
      const data = await response.json();
      showErrorMessage('送信中にエラーが発生しました。もう一度お試しください。');
      console.error('Form submission error:', data);
    }
  } catch (error) {
    // Network or other error
    showErrorMessage('送信中にエラーが発生しました。インターネット接続を確認してください。');
    console.error('Form submission error:', error);
  } finally {
    // Re-enable submit button
    submitButton.disabled = false;
    submitButton.classList.remove('loading');
  }
}

/**
 * Show Success Message
 * Displays success modal
 */
function showSuccessMessage(formType) {
  const modal = document.getElementById('success-modal');
  const modalTitle = modal.querySelector('h3');
  const modalText = modal.querySelector('p');

  if (formType === 'recruit') {
    modalTitle.textContent = '応募完了';
    modalText.innerHTML = 'ご応募いただきありがとうございます。<br>内容を確認次第、ご連絡させていただきます。';
  } else if (formType === 'reservation') {
    modalTitle.textContent = '予約完了';
    modalText.innerHTML = 'ご予約いただきありがとうございます。<br>内容を確認次第、ご連絡させていただきます。';
  }

  // Open modal
  if (window.openModal) {
    window.openModal('success-modal');
  }
}

/**
 * Show Error Message
 * Displays error alert
 */
function showErrorMessage(message) {
  alert(message);
}

/**
 * Utility: Format Phone Number
 * Formats phone number with hyphens
 */
function formatPhoneNumber(phone) {
  const cleaned = phone.replace(/\D/g, '');

  // Format based on length
  if (cleaned.length === 10) {
    // Landline: 0X-XXXX-XXXX
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
  } else if (cleaned.length === 11) {
    // Mobile: 090-XXXX-XXXX
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  }

  return phone;
}

// Auto-format phone numbers on input
document.addEventListener('DOMContentLoaded', () => {
  const phoneInputs = document.querySelectorAll('input[type="tel"]');

  phoneInputs.forEach(input => {
    input.addEventListener('blur', () => {
      input.value = formatPhoneNumber(input.value);
    });
  });
});
