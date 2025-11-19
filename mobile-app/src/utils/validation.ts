/**
 * Input Validation Utilities
 * Client-side validation for forms and user input
 */

import { errors } from '../services/errorHandler';

// ============================================================================
// VALIDATION RULES
// ============================================================================

export const ValidationRules = {
  // Email
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  EMAIL_MAX_LENGTH: 255,

  // Password
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,

  // Username
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
  USERNAME_REGEX: /^[a-zA-Z0-9_]+$/,

  // Pin/Place name
  PLACE_NAME_MIN_LENGTH: 2,
  PLACE_NAME_MAX_LENGTH: 200,

  // Notes
  NOTES_MAX_LENGTH: 2000,

  // Rating
  RATING_MIN: 0,
  RATING_MAX: 5,

  // Images
  MAX_IMAGES_PER_PIN: 10,
  MAX_IMAGE_SIZE_MB: 10,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
};

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

export class Validator {
  /**
   * Validate email address
   */
  static email(email: string): { valid: boolean; error?: string } {
    if (!email || !email.trim()) {
      return { valid: false, error: 'Email is required' };
    }

    if (email.length > ValidationRules.EMAIL_MAX_LENGTH) {
      return { valid: false, error: 'Email is too long' };
    }

    if (!ValidationRules.EMAIL_REGEX.test(email)) {
      return { valid: false, error: 'Invalid email format' };
    }

    return { valid: true };
  }

  /**
   * Validate password
   */
  static password(
    password: string,
    options?: { requireStrong?: boolean }
  ): { valid: boolean; error?: string } {
    if (!password) {
      return { valid: false, error: 'Password is required' };
    }

    if (password.length < ValidationRules.PASSWORD_MIN_LENGTH) {
      return {
        valid: false,
        error: `Password must be at least ${ValidationRules.PASSWORD_MIN_LENGTH} characters`,
      };
    }

    if (password.length > ValidationRules.PASSWORD_MAX_LENGTH) {
      return { valid: false, error: 'Password is too long' };
    }

    if (options?.requireStrong && !ValidationRules.PASSWORD_REGEX.test(password)) {
      return {
        valid: false,
        error: 'Password must contain uppercase, lowercase, and number',
      };
    }

    return { valid: true };
  }

  /**
   * Validate username
   */
  static username(username: string): { valid: boolean; error?: string } {
    if (!username || !username.trim()) {
      return { valid: false, error: 'Username is required' };
    }

    const trimmed = username.trim();

    if (trimmed.length < ValidationRules.USERNAME_MIN_LENGTH) {
      return {
        valid: false,
        error: `Username must be at least ${ValidationRules.USERNAME_MIN_LENGTH} characters`,
      };
    }

    if (trimmed.length > ValidationRules.USERNAME_MAX_LENGTH) {
      return { valid: false, error: 'Username is too long' };
    }

    if (!ValidationRules.USERNAME_REGEX.test(trimmed)) {
      return {
        valid: false,
        error: 'Username can only contain letters, numbers, and underscores',
      };
    }

    return { valid: true };
  }

  /**
   * Validate place name
   */
  static placeName(name: string): { valid: boolean; error?: string } {
    if (!name || !name.trim()) {
      return { valid: false, error: 'Place name is required' };
    }

    const trimmed = name.trim();

    if (trimmed.length < ValidationRules.PLACE_NAME_MIN_LENGTH) {
      return { valid: false, error: 'Place name is too short' };
    }

    if (trimmed.length > ValidationRules.PLACE_NAME_MAX_LENGTH) {
      return { valid: false, error: 'Place name is too long' };
    }

    return { valid: true };
  }

  /**
   * Validate notes
   */
  static notes(notes: string): { valid: boolean; error?: string } {
    if (!notes) {
      return { valid: true }; // Notes are optional
    }

    if (notes.length > ValidationRules.NOTES_MAX_LENGTH) {
      return {
        valid: false,
        error: `Notes cannot exceed ${ValidationRules.NOTES_MAX_LENGTH} characters`,
      };
    }

    return { valid: true };
  }

  /**
   * Validate rating
   */
  static rating(rating: number): { valid: boolean; error?: string } {
    if (rating < ValidationRules.RATING_MIN || rating > ValidationRules.RATING_MAX) {
      return {
        valid: false,
        error: `Rating must be between ${ValidationRules.RATING_MIN} and ${ValidationRules.RATING_MAX}`,
      };
    }

    return { valid: true };
  }

  /**
   * Validate image file
   */
  static image(file: {
    uri: string;
    type?: string;
    size?: number;
  }): { valid: boolean; error?: string } {
    if (!file || !file.uri) {
      return { valid: false, error: 'Invalid image file' };
    }

    // Check file type
    if (file.type && !ValidationRules.ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: 'Only JPEG, PNG, and WebP images are allowed',
      };
    }

    // Check file size
    if (file.size) {
      const maxSizeBytes = ValidationRules.MAX_IMAGE_SIZE_MB * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        return {
          valid: false,
          error: `Image size must not exceed ${ValidationRules.MAX_IMAGE_SIZE_MB}MB`,
        };
      }
    }

    return { valid: true };
  }

  /**
   * Validate image array
   */
  static images(images: any[]): { valid: boolean; error?: string } {
    if (images.length > ValidationRules.MAX_IMAGES_PER_PIN) {
      return {
        valid: false,
        error: `Maximum ${ValidationRules.MAX_IMAGES_PER_PIN} images allowed`,
      };
    }

    return { valid: true };
  }
}

// ============================================================================
// SANITIZATION FUNCTIONS
// ============================================================================

export class Sanitizer {
  /**
   * Sanitize string input (prevent XSS)
   */
  static string(input: string): string {
    if (!input) return '';

    return input
      .trim()
      .replace(/[<>]/g, '') // Remove < and >
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, ''); // Remove event handlers
  }

  /**
   * Sanitize email
   */
  static email(email: string): string {
    return email.toLowerCase().trim();
  }

  /**
   * Sanitize username
   */
  static username(username: string): string {
    return username.trim().replace(/[^a-zA-Z0-9_]/g, '');
  }

  /**
   * Truncate text to max length
   */
  static truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength);
  }
}

// ============================================================================
// FORM VALIDATION HELPER
// ============================================================================

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export class FormValidator {
  private errors: Record<string, string> = {};

  /**
   * Add validation for a field
   */
  field(
    fieldName: string,
    value: any,
    validator: (value: any) => { valid: boolean; error?: string }
  ): this {
    const result = validator(value);
    if (!result.valid && result.error) {
      this.errors[fieldName] = result.error;
    }
    return this;
  }

  /**
   * Get validation result
   */
  result(): ValidationResult {
    return {
      valid: Object.keys(this.errors).length === 0,
      errors: this.errors,
    };
  }

  /**
   * Throw error if validation failed
   */
  throwIfInvalid(): void {
    if (!this.result().valid) {
      throw errors.validation('Validation failed', this.errors);
    }
  }
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/*
Example 1: Simple validation

const emailValidation = Validator.email('test@example.com');
if (!emailValidation.valid) {
  Alert.alert('Error', emailValidation.error);
}
*/

/*
Example 2: Form validation

const validateLoginForm = (email: string, password: string) => {
  const validator = new FormValidator();

  validator
    .field('email', email, Validator.email)
    .field('password', password, Validator.password);

  return validator.result();
};

const result = validateLoginForm(email, password);
if (!result.valid) {
  setErrors(result.errors);
}
*/

/*
Example 3: Sanitization

const sanitizedInput = Sanitizer.string(userInput);
const sanitizedEmail = Sanitizer.email(emailInput);
*/
