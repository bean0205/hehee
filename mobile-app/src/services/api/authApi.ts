
import { httpClient, ApiResponse } from './httpClient';

// Re-export ApiResponse type for convenience
export type { ApiResponse };

// Auth API Types
interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  username: string;
  displayName?: string;
}

interface SocialLoginRequest {
  provider: 'google' | 'apple' | 'facebook';
  token: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: any;
}

// Auth APIs
export const authAPI = {
  /**
   * Login with email and password
   */
  login: async (emailOrUsername: string, password: string): Promise<ApiResponse<AuthResponse>> => {
    return httpClient.post<AuthResponse>('/v1/auth/login', {
      emailOrUsername,
      password,
    });
  },

  /**
   * Register new user
   */
  register: async (
    email: string,
    password: string,
    username: string,
    displayName?: string
  ): Promise<ApiResponse<AuthResponse>> => {
    return httpClient.post<AuthResponse>('/v1/auth/register', {
      email,
      password,
      username,
      displayName: displayName || username,
    });
  },

  /**
   * Social login (Google, Apple, Facebook)
   */
  socialLogin: async (
    provider: 'google' | 'apple' | 'facebook',
    token: string
  ): Promise<ApiResponse<AuthResponse>> => {
    return httpClient.post<AuthResponse>('/auth/social-login', {
      provider,
      token,
    });
  },

  /**
   * Logout
   */
  logout: async (): Promise<ApiResponse<void>> => {
    return httpClient.post<void>('/auth/logout');
  },

  /**
   * Refresh token
   */
  refreshToken: async (refreshToken: string): Promise<ApiResponse<{ token: string }>> => {
    return httpClient.post<{ token: string }>('/auth/refresh-token', {
      refreshToken,
    });
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async (): Promise<ApiResponse<AuthResponse['user']>> => {
    return httpClient.get<AuthResponse['user']>('/auth/me');
  },

  /**
   * Forgot password
   */
  forgotPassword: async (email: string): Promise<ApiResponse<void>> => {
    return httpClient.post<void>('/auth/forgot-password', { email });
  },

  /**
   * Reset password
   */
  resetPassword: async (token: string, password: string): Promise<ApiResponse<void>> => {
    return httpClient.post<void>('/auth/reset-password', {
      token,
      password,
    });
  },
};


