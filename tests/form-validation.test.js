/**
 * @jest-environment jsdom
 */

// Import the form validation utility functions
const {
  isValidEmail,
  validateRequiredFields,
  isValidPhone,
  sanitizeInput,
  validateContactForm,
  formatFormData
} = require('../js/form-validation.js');

describe('Form Validation Utility Functions', () => {
  describe('isValidEmail', () => {
    test('should validate correct email formats', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('user+tag@example.org')).toBe(true);
      expect(isValidEmail('user123@test-domain.com')).toBe(true);
    });

    test('should reject invalid email formats', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test..test@example.com')).toBe(false);
      expect(isValidEmail('test@example')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });

    test('should handle non-string input', () => {
      expect(isValidEmail(null)).toBe(false);
      expect(isValidEmail(undefined)).toBe(false);
      expect(isValidEmail(123)).toBe(false);
      expect(isValidEmail({})).toBe(false);
    });

    test('should handle emails with whitespace', () => {
      expect(isValidEmail(' test@example.com ')).toBe(true);
      expect(isValidEmail('test @example.com')).toBe(false);
      expect(isValidEmail('test@ example.com')).toBe(false);
    });
  });

  describe('validateRequiredFields', () => {
    test('should validate when all required fields are present', () => {
      const formData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Hello world'
      };
      const requiredFields = ['name', 'email'];
      
      const result = validateRequiredFields(formData, requiredFields);
      
      expect(result.isValid).toBe(true);
      expect(result.missingFields).toEqual([]);
    });

    test('should identify missing required fields', () => {
      const formData = {
        name: 'John Doe',
        message: 'Hello world'
      };
      const requiredFields = ['name', 'email', 'phone'];
      
      const result = validateRequiredFields(formData, requiredFields);
      
      expect(result.isValid).toBe(false);
      expect(result.missingFields).toEqual(['email', 'phone']);
    });

    test('should treat empty strings as missing', () => {
      const formData = {
        name: '',
        email: '   ',
        message: 'Hello world'
      };
      const requiredFields = ['name', 'email'];
      
      const result = validateRequiredFields(formData, requiredFields);
      
      expect(result.isValid).toBe(false);
      expect(result.missingFields).toEqual(['name', 'email']);
    });

    test('should handle null or invalid formData', () => {
      const result1 = validateRequiredFields(null, ['name', 'email']);
      expect(result1.isValid).toBe(false);
      expect(result1.missingFields).toEqual(['name', 'email']);
      
      const result2 = validateRequiredFields('not-an-object', ['name']);
      expect(result2.isValid).toBe(false);
    });

    test('should handle invalid requiredFields parameter', () => {
      const formData = { name: 'John' };
      
      const result1 = validateRequiredFields(formData, null);
      expect(result1.isValid).toBe(true);
      expect(result1.missingFields).toEqual([]);
      
      const result2 = validateRequiredFields(formData, 'not-an-array');
      expect(result2.isValid).toBe(true);
    });

    test('should handle empty required fields array', () => {
      const formData = { name: 'John' };
      const result = validateRequiredFields(formData, []);
      
      expect(result.isValid).toBe(true);
      expect(result.missingFields).toEqual([]);
    });
  });

  describe('isValidPhone', () => {
    test('should validate correct phone number formats', () => {
      expect(isValidPhone('1234567')).toBe(true); // 7 digits
      expect(isValidPhone('123-456-7890')).toBe(true); // US format
      expect(isValidPhone('(123) 456-7890')).toBe(true); // US format with parentheses
      expect(isValidPhone('+1-123-456-7890')).toBe(true); // International format
      expect(isValidPhone('123.456.7890')).toBe(true); // Dot separated
      expect(isValidPhone('12345678901234')).toBe(true); // 14 digits
    });

    test('should reject invalid phone numbers', () => {
      expect(isValidPhone('123456')).toBe(false); // Too short
      expect(isValidPhone('1234567890123456')).toBe(false); // Too long
      expect(isValidPhone('abc-def-ghij')).toBe(false); // No digits
      expect(isValidPhone('')).toBe(false); // Empty string
    });

    test('should handle non-string input', () => {
      expect(isValidPhone(null)).toBe(false);
      expect(isValidPhone(undefined)).toBe(false);
      expect(isValidPhone(1234567890)).toBe(false);
      expect(isValidPhone({})).toBe(false);
    });

    test('should handle edge cases', () => {
      expect(isValidPhone('1234567')).toBe(true); // Minimum valid length
      expect(isValidPhone('123456789012345')).toBe(true); // Maximum valid length
      expect(isValidPhone('+44 20 7946 0958')).toBe(true); // UK format
    });
  });

  describe('sanitizeInput', () => {
    test('should sanitize HTML characters', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
      expect(sanitizeInput('Hello <b>world</b>')).toBe('Hello &lt;b&gt;world&lt;&#x2F;b&gt;');
    });

    test('should sanitize quotes and apostrophes', () => {
      expect(sanitizeInput('He said "Hello"')).toBe('He said &quot;Hello&quot;');
      expect(sanitizeInput("It's a test")).toBe('It&#x27;s a test');
    });

    test('should handle normal text without changes', () => {
      expect(sanitizeInput('Hello world')).toBe('Hello world');
      expect(sanitizeInput('123 ABC xyz')).toBe('123 ABC xyz');
    });

    test('should handle non-string input', () => {
      expect(sanitizeInput(null)).toBe('');
      expect(sanitizeInput(undefined)).toBe('');
      expect(sanitizeInput(123)).toBe('');
      expect(sanitizeInput({})).toBe('');
    });

    test('should handle empty string', () => {
      expect(sanitizeInput('')).toBe('');
    });

    test('should sanitize complex mixed content', () => {
      const input = '<div onclick="alert(\'hack\')" class="test">Content</div>';
      const expected = '&lt;div onclick=&quot;alert(&#x27;hack&#x27;)&quot; class=&quot;test&quot;&gt;Content&lt;&#x2F;div&gt;';
      expect(sanitizeInput(input)).toBe(expected);
    });
  });

  describe('validateContactForm', () => {
    test('should validate complete valid form', () => {
      const formData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        message: 'Hello, this is a test message.'
      };
      
      const result = validateContactForm(formData);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    test('should validate minimal valid form', () => {
      const formData = {
        name: 'John Doe',
        email: 'john@example.com'
      };
      
      const result = validateContactForm(formData);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    test('should catch missing required fields', () => {
      const formData = {
        message: 'Hello world'
      };
      
      const result = validateContactForm(formData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Missing required fields: name, email');
    });

    test('should catch invalid email', () => {
      const formData = {
        name: 'John Doe',
        email: 'invalid-email'
      };
      
      const result = validateContactForm(formData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid email format');
    });

    test('should catch invalid phone', () => {
      const formData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123'
      };
      
      const result = validateContactForm(formData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid phone number format');
    });

    test('should catch short name', () => {
      const formData = {
        name: 'J',
        email: 'john@example.com'
      };
      
      const result = validateContactForm(formData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Name must be at least 2 characters long');
    });

    test('should catch long message', () => {
      const formData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'a'.repeat(1001)
      };
      
      const result = validateContactForm(formData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Message must be less than 1000 characters');
    });

    test('should catch multiple errors', () => {
      const formData = {
        name: 'J',
        email: 'invalid-email',
        phone: '123',
        message: 'a'.repeat(1001)
      };
      
      const result = validateContactForm(formData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });

  describe('formatFormData', () => {
    test('should format and sanitize form data', () => {
      const formData = {
        name: '  John Doe  ',
        email: 'john@example.com',
        message: '<script>alert("test")</script>',
        phone: '123-456-7890'
      };
      
      const result = formatFormData(formData);
      
      expect(result.name).toBe('John Doe');
      expect(result.email).toBe('john@example.com');
      expect(result.message).toBe('&lt;script&gt;alert(&quot;test&quot;)&lt;&#x2F;script&gt;');
      expect(result.phone).toBe('123-456-7890');
    });

    test('should handle empty strings', () => {
      const formData = {
        name: '   ',
        email: '',
        message: 'test'
      };
      
      const result = formatFormData(formData);
      
      expect(result.name).toBe('');
      expect(result.email).toBe('');
      expect(result.message).toBe('test');
    });

    test('should handle non-string values', () => {
      const formData = {
        name: 'John',
        age: 25,
        active: true,
        data: null
      };
      
      const result = formatFormData(formData);
      
      expect(result.name).toBe('John');
      expect(result.age).toBe(25);
      expect(result.active).toBe(true);
      expect(result.data).toBe(null);
    });

    test('should handle null or invalid input', () => {
      expect(formatFormData(null)).toEqual({});
      expect(formatFormData(undefined)).toEqual({});
      expect(formatFormData('not-an-object')).toEqual({});
    });

    test('should handle empty object', () => {
      expect(formatFormData({})).toEqual({});
    });
  });

  describe('Integration tests', () => {
    test('should handle complete form validation and formatting workflow', () => {
      const rawFormData = {
        name: '  Jane Smith  ',
        email: 'jane@example.com',
        phone: '(555) 123-4567',
        message: 'Hello! I\'m interested in <b>your services</b>.'
      };
      
      // First format the data
      const formattedData = formatFormData(rawFormData);
      
      // Then validate it
      const validationResult = validateContactForm(formattedData);
      
      expect(validationResult.isValid).toBe(true);
      expect(formattedData.name).toBe('Jane Smith');
      expect(formattedData.message).toBe('Hello! I&#x27;m interested in &lt;b&gt;your services&lt;&#x2F;b&gt;.');
    });

    test('should handle invalid form data workflow', () => {
      const rawFormData = {
        name: 'J',
        email: 'invalid-email',
        message: '<script>alert("xss")</script>'
      };
      
      const formattedData = formatFormData(rawFormData);
      const validationResult = validateContactForm(formattedData);
      
      expect(validationResult.isValid).toBe(false);
      expect(validationResult.errors.length).toBeGreaterThan(0);
      expect(formattedData.message).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
    });
  });
});