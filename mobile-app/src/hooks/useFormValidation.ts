import { useState, useCallback, useRef } from 'react';
import { Validator, FormValidator } from '../utils/validation';

export interface ValidationRules<T> {
  [key: string]: (value: any) => { valid: boolean; error?: string };
}

export interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValidating: boolean;
  isValid: boolean;
}

export interface UseFormValidationReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValidating: boolean;
  isValid: boolean;
  setValue: (field: keyof T, value: any) => void;
  setError: (field: keyof T, error: string) => void;
  setTouched: (field: keyof T, touched: boolean) => void;
  validateField: (field: keyof T) => boolean;
  validateForm: () => boolean;
  resetForm: () => void;
  handleChange: (field: keyof T) => (value: any) => void;
  handleBlur: (field: keyof T) => () => void;
}

export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validationRules: ValidationRules<T>
): UseFormValidationReturn<T> {
  const [formState, setFormState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
    isValidating: false,
    isValid: false,
  });

  const validationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Set value for a field
  const setValue = useCallback((field: keyof T, value: any) => {
    setFormState((prev) => ({
      ...prev,
      values: { ...prev.values, [field]: value },
    }));
  }, []);

  // Set error for a field
  const setError = useCallback((field: keyof T, error: string) => {
    setFormState((prev) => ({
      ...prev,
      errors: { ...prev.errors, [field]: error },
    }));
  }, []);

  // Set touched for a field
  const setTouched = useCallback((field: keyof T, touched: boolean) => {
    setFormState((prev) => ({
      ...prev,
      touched: { ...prev.touched, [field]: touched },
    }));
  }, []);

  // Validate a single field
  const validateField = useCallback(
    (field: keyof T): boolean => {
      const validator = validationRules[field as string];
      if (!validator) return true;

      const result = validator(formState.values[field]);

      setFormState((prev) => ({
        ...prev,
        errors: {
          ...prev.errors,
          [field]: result.valid ? undefined : result.error,
        },
      }));

      return result.valid;
    },
    [formState.values, validationRules]
  );

  // Validate entire form
  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(validationRules).forEach((field) => {
      const validator = validationRules[field];
      const result = validator(formState.values[field]);

      if (!result.valid) {
        newErrors[field as keyof T] = result.error;
        isValid = false;
      }
    });

    setFormState((prev) => ({
      ...prev,
      errors: newErrors,
      isValid,
    }));

    return isValid;
  }, [formState.values, validationRules]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormState({
      values: initialValues,
      errors: {},
      touched: {},
      isValidating: false,
      isValid: false,
    });
  }, [initialValues]);

  // Handle change with debounced validation
  const handleChange = useCallback(
    (field: keyof T) => (value: any) => {
      setValue(field, value);

      // Clear previous timeout
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current);
      }

      // Debounce validation (300ms)
      validationTimeoutRef.current = setTimeout(() => {
        if (formState.touched[field]) {
          validateField(field);
        }
      }, 300);
    },
    [setValue, validateField, formState.touched]
  );

  // Handle blur
  const handleBlur = useCallback(
    (field: keyof T) => () => {
      setTouched(field, true);
      validateField(field);
    },
    [setTouched, validateField]
  );

  return {
    values: formState.values,
    errors: formState.errors,
    touched: formState.touched,
    isValidating: formState.isValidating,
    isValid: formState.isValid,
    setValue,
    setError,
    setTouched,
    validateField,
    validateForm,
    resetForm,
    handleChange,
    handleBlur,
  };
}

// ============================================================================
// PRE-BUILT VALIDATION RULES
// ============================================================================

export const ValidationPresets = {
  email: (value: string) => Validator.email(value),
  password: (value: string) => Validator.password(value, { requireStrong: false }),
  strongPassword: (value: string) => Validator.password(value, { requireStrong: true }),
  username: (value: string) => Validator.username(value),
  required: (fieldName: string) => (value: any) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return { valid: false, error: `${fieldName} là bắt buộc` };
    }
    return { valid: true };
  },
  minLength: (min: number) => (value: string) => {
    if (value && value.length < min) {
      return { valid: false, error: `Ít nhất ${min} ký tự` };
    }
    return { valid: true };
  },
  maxLength: (max: number) => (value: string) => {
    if (value && value.length > max) {
      return { valid: false, error: `Tối đa ${max} ký tự` };
    }
    return { valid: true };
  },
  match: (fieldName: string, otherValue: any) => (value: any) => {
    if (value !== otherValue) {
      return { valid: false, error: `${fieldName} không khớp` };
    }
    return { valid: true };
  },
};
