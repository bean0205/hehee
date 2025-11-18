/**
 * HTTP Client with Interceptors
 * Centralized API client for the application
 */

import { API_BASE_URL } from '../../config/constants';
import { getStorageItem, removeStorageItem } from '../storage';

// Types
export interface RequestConfig extends RequestInit {
  url: string;
  params?: Record<string, any>;
  requiresAuth?: boolean;
  retry?: number;
  timeout?: number;
}

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  statusCode: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

// Request/Response Interceptors
type RequestInterceptor = (config: RequestConfig) => Promise<RequestConfig>;
type ResponseInterceptor = (response: Response) => Promise<Response>;
type ErrorInterceptor = (error: any) => Promise<any>;

class HttpClient {
  private baseURL: string;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private errorInterceptors: ErrorInterceptor[] = [];
  private defaultTimeout = 30000; // 30 seconds

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.setupDefaultInterceptors();
  }

  /**
   * Setup default interceptors
   */
  private setupDefaultInterceptors() {
    // Add auth token to requests
    this.addRequestInterceptor(async (config) => {
      if (config.requiresAuth !== false) {
        const token = await getStorageItem('auth_token');
        if (token) {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
          };
        }
      }
      return config;
    });

    // Add default headers (skip Content-Type for FormData)
    this.addRequestInterceptor(async (config) => {
      const headers = config.headers as Record<string, any> || {};
      const skipContentType = headers['__skip_content_type__'];
      
      if (skipContentType) {
        delete headers['__skip_content_type__'];
      }
      
      config.headers = {
        ...(skipContentType ? {} : { 'Content-Type': 'application/json' }),
        Accept: 'application/json',
        ...headers,
      };
      return config;
    });

    // Log requests in development
    if (process.env.NODE_ENV === 'development') {
      this.addRequestInterceptor(async (config) => {
        console.log('🚀 API Request:', {
          method: config.method,
          url: config.url,
          headers: config.headers,
          body: config.body,
        });
        return config;
      });

      this.addResponseInterceptor(async (response) => {
        console.log('✅ API Response:', {
          status: response.status,
          url: response.url,
        });
        return response;
      });
    }

    // Handle common errors
    this.addErrorInterceptor(async (error) => {
      if (error.statusCode === 401) {
        // Unauthorized - clear token and redirect to login
        await removeStorageItem('auth_token');
        await removeStorageItem('user_data');
        // You can emit an event here to navigate to login screen
        console.log('⚠️ Session expired, please login again');
      }

      if (error.statusCode === 403) {
        console.log('⚠️ Access forbidden');
      }

      if (error.statusCode >= 500) {
        console.log('⚠️ Server error occurred');
      }

      throw error;
    });
  }

  /**
   * Add request interceptor
   */
  addRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * Add response interceptor
   */
  addResponseInterceptor(interceptor: ResponseInterceptor) {
    this.responseInterceptors.push(interceptor);
  }

  /**
   * Add error interceptor
   */
  addErrorInterceptor(interceptor: ErrorInterceptor) {
    this.errorInterceptors.push(interceptor);
  }

  /**
   * Build URL with query parameters
   */
  private buildURL(url: string, params?: Record<string, any>): string {
    const fullURL = url.startsWith('http') ? url : `${this.baseURL}${url}`;

    if (!params || Object.keys(params).length === 0) {
      return fullURL;
    }

    const queryString = Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');

    return `${fullURL}${fullURL.includes('?') ? '&' : '?'}${queryString}`;
  }

  /**
   * Execute request interceptors
   */
  private async executeRequestInterceptors(config: RequestConfig): Promise<RequestConfig> {
    let modifiedConfig = { ...config };

    for (const interceptor of this.requestInterceptors) {
      modifiedConfig = await interceptor(modifiedConfig);
    }

    return modifiedConfig;
  }

  /**
   * Execute response interceptors
   */
  private async executeResponseInterceptors(response: Response): Promise<Response> {
    let modifiedResponse = response;

    for (const interceptor of this.responseInterceptors) {
      modifiedResponse = await interceptor(modifiedResponse);
    }

    return modifiedResponse;
  }

  /**
   * Execute error interceptors
   */
  private async executeErrorInterceptors(error: any): Promise<any> {
    let modifiedError = error;

    for (const interceptor of this.errorInterceptors) {
      try {
        modifiedError = await interceptor(modifiedError);
      } catch (err) {
        modifiedError = err;
      }
    }

    return modifiedError;
  }

  /**
   * Make HTTP request with timeout
   */
  private async fetchWithTimeout(url: string, config: RequestInit, timeout: number): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw {
          message: 'Request timeout',
          statusCode: 408,
        } as ApiError;
      }
      throw error;
    }
  }

  /**
   * Core request method with retry logic
   */
  private async makeRequest<T>(config: RequestConfig): Promise<ApiResponse<T>> {
    const maxRetries = config.retry || 0;
    let lastError: any;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // Execute request interceptors
        const modifiedConfig = await this.executeRequestInterceptors(config);

        // Build full URL
        const fullURL = this.buildURL(modifiedConfig.url, modifiedConfig.params);

        // Make request with timeout
        const timeout = modifiedConfig.timeout || this.defaultTimeout;
        let response = await this.fetchWithTimeout(fullURL, modifiedConfig, timeout);

        // Execute response interceptors
        response = await this.executeResponseInterceptors(response);

        // Parse response
        const contentType = response.headers.get('content-type');
        let responseData: any;

        if (contentType && contentType.includes('application/json')) {
          responseData = await response.json();
        } else {
          responseData = await response.text();
        }

        // Handle error responses
        if (!response.ok) {
          const error: ApiError = {
            message: responseData?.message || response.statusText || 'Request failed',
            statusCode: response.status,
            errors: responseData?.errors,
          };
          throw error;
        }

        // Return successful response
        return {
          data: responseData?.data || responseData,
          message: responseData?.message,
          success: true,
          statusCode: response.status,
        };
      } catch (error: any) {
        lastError = error;
        // Execute error interceptors
        await this.executeErrorInterceptors(error);

        // Don't retry on client errors (4xx) except 408 (timeout)
        if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500 && error.statusCode !== 408) {
          throw error;
        }

        // Retry if not the last attempt
        if (attempt < maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, attempt), 10000); // Exponential backoff, max 10s
          await new Promise(resolve => setTimeout(resolve, delay));
          console.log(`🔄 Retrying request (${attempt + 1}/${maxRetries})...`);
          continue;
        }

        // Throw error if all retries failed
        throw error;
      }
    }

    throw lastError;
  }

  /**
   * GET request
   */
  async get<T = any>(url: string, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      url,
      method: 'GET',
      ...config,
    });
  }

  /**
   * POST request
   */
  async post<T = any>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      url,
      method: 'POST',
      body: JSON.stringify(data),
      ...config,
    });
  }

  /**
   * PUT request
   */
  async put<T = any>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      url,
      method: 'PUT',
      body: JSON.stringify(data),
      ...config,
    });
  }

  /**
   * PATCH request
   */
  async patch<T = any>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      url,
      method: 'PATCH',
      body: JSON.stringify(data),
      ...config,
    });
  }

  /**
   * DELETE request
   */
  async delete<T = any>(url: string, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      url,
      method: 'DELETE',
      ...config,
    });
  }

  /**
   * Upload file/form data
   */
  async upload<T = any>(url: string, formData: FormData, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      url,
      method: 'POST',
      body: formData as any,
      ...config,
      // Set a special flag to skip Content-Type in interceptor
      headers: {
        ...config?.headers,
        '__skip_content_type__': 'true',
      },
    });
  }
}

// Create and export singleton instance
export const httpClient = new HttpClient(API_BASE_URL);

// Export class for testing or creating custom instances
export default HttpClient;
