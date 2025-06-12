/**
 * Form validation utilities for contact forms
 */

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if email is valid, false otherwise
 */
function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  
  const trimmedEmail = email.trim();
  if (trimmedEmail === '') return false;
  
  // More strict email validation - requires at least one dot in domain
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  
  // Additional checks for common invalid patterns
  if (trimmedEmail.includes('..') || trimmedEmail.startsWith('.') || trimmedEmail.endsWith('.')) {
    return false;
  }
  
  return emailRegex.test(trimmedEmail);
}

/**
 * Validate required fields
 * @param {Object} formData - Object containing form field values
 * @param {Array} requiredFields - Array of required field names
 * @returns {Object} - Validation result with isValid boolean and missing fields array
 */
function validateRequiredFields(formData, requiredFields) {
  if (typeof formData !== 'object' || formData === null) {
    return { isValid: false, missingFields: requiredFields || [] };
  }
  
  if (!Array.isArray(requiredFields)) {
    return { isValid: true, missingFields: [] };
  }
  
  const missingFields = [];
  
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!formData[field] || (typeof formData[field] === 'string' && formData[field].trim() === '')) {
      missingFields.push(field);
    }
  }
  
  return {
    isValid: missingFields.length === 0,
    missingFields: missingFields
  };
}

/**
 * Validate phone number format (basic validation)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if phone number appears valid, false otherwise
 */
function isValidPhone(phone) {
  if (typeof phone !== 'string') return false;
  
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');
  
  // Check if it has a reasonable number of digits (7-15)
  return digitsOnly.length >= 7 && digitsOnly.length <= 15;
}

/**
 * Sanitize input to prevent basic XSS
 * @param {string} input - Input string to sanitize
 * @returns {string} - Sanitized string
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate contact form data
 * @param {Object} formData - Form data object
 * @returns {Object} - Comprehensive validation result
 */
function validateContactForm(formData) {
  const result = {
    isValid: true,
    errors: []
  };
  
  // Check required fields
  const requiredValidation = validateRequiredFields(formData, ['name', 'email']);
  if (!requiredValidation.isValid) {
    result.isValid = false;
    result.errors.push(`Missing required fields: ${requiredValidation.missingFields.join(', ')}`);
  }
  
  // Validate email if provided
  if (formData.email && !isValidEmail(formData.email)) {
    result.isValid = false;
    result.errors.push('Invalid email format');
  }
  
  // Validate phone if provided
  if (formData.phone && !isValidPhone(formData.phone)) {
    result.isValid = false;
    result.errors.push('Invalid phone number format');
  }
  
  // Check name length
  if (formData.name && formData.name.trim().length < 2) {
    result.isValid = false;
    result.errors.push('Name must be at least 2 characters long');
  }
  
  // Check message length if provided
  if (formData.message && formData.message.trim().length > 1000) {
    result.isValid = false;
    result.errors.push('Message must be less than 1000 characters');
  }
  
  return result;
}

/**
 * Format form data for submission
 * @param {Object} formData - Raw form data
 * @returns {Object} - Formatted and sanitized form data
 */
function formatFormData(formData) {
  if (typeof formData !== 'object' || formData === null) {
    return {};
  }
  
  const formatted = {};
  
  // Sanitize and format each field
  Object.keys(formData).forEach(key => {
    if (typeof formData[key] === 'string') {
      formatted[key] = sanitizeInput(formData[key].trim());
    } else {
      formatted[key] = formData[key];
    }
  });
  
  return formatted;
}

// Export functions for testing (if module system is available)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    isValidEmail,
    validateRequiredFields,
    isValidPhone,
    sanitizeInput,
    validateContactForm,
    formatFormData
  };
}