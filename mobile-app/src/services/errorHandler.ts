/**
 * Unified Error Handling Service
 * Centralized error handling, logging, and user feedback
 */

import { Alert } from 'react-native';

export interface AppError {
  code: string;
  message: string;
  details?: any;
  statusCode?: number;
  isOperational?: boolean; // true for expected errors, false for programmer errors
}

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorListeners: Array<(error: AppError) => void> = [];

  private constructor() {}

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * Register a listener for all errors
   * Useful for analytics, crash reporting, etc.
   */
  onError(listener: (error: AppError) => void) {
    this.errorListeners.push(listener);
  }

  /**
   * Handle error and show user feedback
   */
  handle(error: any, context?: string): AppError {
    const appError = this.normalizeError(error, context);

    // Notify listeners (for logging, analytics, etc.)
    this.errorListeners.forEach(listener => {
      try {
        listener(appError);
      } catch (err) {
        console.error('Error in error listener:', err);
      }
    });

    // Log to console in development
    if (__DEV__) {
      console.error(`[Error${context ? ` in ${context}` : ''}]:`, appError);
    }

    return appError;
  }

  /**
   * Handle error with user alert
   */
  handleWithAlert(
    error: any,
    options?: {
      title?: string;
      context?: string;
      onRetry?: () => void;
      onCancel?: () => void;
    }
  ): AppError {
    const appError = this.handle(error, options?.context);

    const buttons: any[] = [];

    if (options?.onRetry) {
      buttons.push({
        text: 'Retry',
        onPress: options.onRetry,
      });
    }

    buttons.push({
      text: 'OK',
      onPress: options?.onCancel,
      style: 'cancel',
    });

    Alert.alert(
      options?.title || 'Error',
      this.getUserFriendlyMessage(appError),
      buttons
    );

    return appError;
  }

  /**
   * Convert any error to AppError
   */
  private normalizeError(error: any, context?: string): AppError {
    // Already an AppError
    if (error && typeof error === 'object' && 'code' in error) {
      return error as AppError;
    }

    // Network errors
    if (error?.name === 'AbortError') {
      return {
        code: 'NETWORK_TIMEOUT',
        message: 'Request timeout',
        isOperational: true,
      };
    }

    if (error?.message?.includes('Network request failed')) {
      return {
        code: 'NETWORK_ERROR',
        message: 'Network connection failed',
        isOperational: true,
      };
    }

    // API errors
    if (error?.statusCode) {
      return {
        code: `HTTP_${error.statusCode}`,
        message: error.message || `Request failed with status ${error.statusCode}`,
        statusCode: error.statusCode,
        details: error.errors || error.data,
        isOperational: true,
      };
    }

    // Validation errors
    if (error?.errors && typeof error.errors === 'object') {
      return {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: error.errors,
        isOperational: true,
      };
    }

    // Generic Error object
    if (error instanceof Error) {
      return {
        code: 'UNKNOWN_ERROR',
        message: error.message,
        details: error.stack,
        isOperational: false,
      };
    }

    // String error
    if (typeof error === 'string') {
      return {
        code: 'UNKNOWN_ERROR',
        message: error,
        isOperational: false,
      };
    }

    // Unknown error type
    return {
      code: 'UNKNOWN_ERROR',
      message: 'An unexpected error occurred',
      details: error,
      isOperational: false,
    };
  }

  /**
   * Get user-friendly error message
   */
  private getUserFriendlyMessage(error: AppError): string {
    const errorMessages: Record<string, string> = {
      NETWORK_TIMEOUT: 'The request took too long. Please check your connection and try again.',
      NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection.',
      HTTP_401: 'Your session has expired. Please log in again.',
      HTTP_403: 'You don\'t have permission to perform this action.',
      HTTP_404: 'The requested resource was not found.',
      HTTP_429: 'Too many requests. Please wait a moment and try again.',
      HTTP_500: 'Server error. Please try again later.',
      VALIDATION_ERROR: 'Please check your input and try again.',
    };

    return errorMessages[error.code] || error.message || 'An unexpected error occurred';
  }

  /**
   * Create an operational error
   */
  static createError(code: string, message: string, details?: any): AppError {
    return {
      code,
      message,
      details,
      isOperational: true,
    };
  }
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance();

// Common error creators
export const errors = {
  validation: (message: string, details?: any) =>
    ErrorHandler.createError('VALIDATION_ERROR', message, details),

  notFound: (message: string = 'Resource not found') =>
    ErrorHandler.createError('NOT_FOUND', message),

  unauthorized: (message: string = 'Unauthorized access') =>
    ErrorHandler.createError('UNAUTHORIZED', message),

  forbidden: (message: string = 'Access forbidden') =>
    ErrorHandler.createError('FORBIDDEN', message),

  network: (message: string = 'Network error') =>
    ErrorHandler.createError('NETWORK_ERROR', message),

  timeout: (message: string = 'Request timeout') =>
    ErrorHandler.createError('NETWORK_TIMEOUT', message),
};
