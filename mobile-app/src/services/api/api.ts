/**
 * API Service Layer
 * All API calls should go through this service using httpClient
 */

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
  token: string;
  refreshToken?: string;
  user: {
    id: string;
    email: string;
    username: string;
    displayName: string;
    avatar?: string;
  };
}

// Auth APIs
export const authAPI = {
  /**
   * Login with email and password
   */
  login: async (email: string, password: string): Promise<ApiResponse<AuthResponse>> => {
    return httpClient.post<AuthResponse>('/auth/login', {
      email,
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
    return httpClient.post<AuthResponse>('/auth/register', {
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

// Pin API Types
interface Pin {
  id: string;
  userId: string;
  locationName: string;
  locationCity: string;
  locationCountry: string;
  latitude: number;
  longitude: number;
  photos: string[];
  caption?: string;
  status: 'visited' | 'want_to_go';
  rating?: number;
  visitDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface CreatePinRequest {
  locationName: string;
  locationCity: string;
  locationCountry: string;
  latitude: number;
  longitude: number;
  photos?: string[];
  caption?: string;
  status: 'visited' | 'want_to_go';
  rating?: number;
  visitDate?: string;
}

interface UpdatePinRequest extends Partial<CreatePinRequest> {}

interface PinListResponse {
  pins: Pin[];
  total: number;
  page: number;
  limit: number;
}

// Pin APIs
export const pinAPI = {
  /**
   * Get all pins for current user
   */
  getPins: async (params?: {
    page?: number;
    limit?: number;
    status?: 'visited' | 'want_to_go';
    country?: string;
  }): Promise<ApiResponse<PinListResponse>> => {
    return httpClient.get<PinListResponse>('/pins', { params });
  },

  /**
   * Get a single pin by ID
   */
  getPin: async (id: string): Promise<ApiResponse<Pin>> => {
    return httpClient.get<Pin>(`/pins/${id}`);
  },

  /**
   * Create a new pin
   */
  createPin: async (pinData: CreatePinRequest): Promise<ApiResponse<Pin>> => {
    return httpClient.post<Pin>('/pins', pinData);
  },

  /**
   * Update a pin
   */
  updatePin: async (id: string, pinData: UpdatePinRequest): Promise<ApiResponse<Pin>> => {
    return httpClient.put<Pin>(`/pins/${id}`, pinData);
  },

  /**
   * Delete a pin
   */
  deletePin: async (id: string): Promise<ApiResponse<void>> => {
    return httpClient.delete<void>(`/pins/${id}`);
  },

  /**
   * Get pins for a specific user (public profile)
   */
  getUserPins: async (userId: string, params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<PinListResponse>> => {
    return httpClient.get<PinListResponse>(`/users/${userId}/pins`, { params });
  },

  /**
   * Get pins by country
   */
  getPinsByCountry: async (countryCode: string): Promise<ApiResponse<Pin[]>> => {
    return httpClient.get<Pin[]>('/pins/by-country', {
      params: { country: countryCode },
    });
  },
};

// Upload API Types
interface UploadResponse {
  url: string;
  publicId?: string;
  format?: string;
  size?: number;
}

// Upload APIs
export const uploadAPI = {
  /**
   * Upload a single image
   */
  uploadImage: async (uri: string, filename?: string): Promise<ApiResponse<UploadResponse>> => {
    const formData = new FormData();
    
    // Create file object from URI
    const file = {
      uri,
      type: 'image/jpeg',
      name: filename || `photo_${Date.now()}.jpg`,
    } as any;
    
    formData.append('file', file);
    
    return httpClient.upload<UploadResponse>('/upload/image', formData);
  },

  /**
   * Upload multiple images
   */
  uploadImages: async (uris: string[]): Promise<ApiResponse<UploadResponse[]>> => {
    const formData = new FormData();
    
    uris.forEach((uri, index) => {
      const file = {
        uri,
        type: 'image/jpeg',
        name: `photo_${Date.now()}_${index}.jpg`,
      } as any;
      
      formData.append('files', file);
    });
    
    return httpClient.upload<UploadResponse[]>('/upload/images', formData);
  },

  /**
   * Delete an uploaded image
   */
  deleteImage: async (publicId: string): Promise<ApiResponse<void>> => {
    return httpClient.delete<void>(`/upload/image/${publicId}`);
  },
};

// Search API Types
interface PlaceResult {
  id: string;
  name: string;
  address: string;
  city?: string;
  country?: string;
  latitude: number;
  longitude: number;
  placeId?: string;
  photos?: string[];
}

interface UserSearchResult {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  pinsCount: number;
  countriesCount: number;
}

// Search APIs
export const searchAPI = {
  /**
   * Search for places using Google Places API
   */
  searchPlaces: async (query: string, location?: {
    latitude: number;
    longitude: number;
  }): Promise<ApiResponse<PlaceResult[]>> => {
    return httpClient.get<PlaceResult[]>('/search/places', {
      params: {
        q: query,
        lat: location?.latitude,
        lng: location?.longitude,
      },
    });
  },

  /**
   * Get place details by place ID
   */
  getPlaceDetails: async (placeId: string): Promise<ApiResponse<PlaceResult>> => {
    return httpClient.get<PlaceResult>(`/search/places/${placeId}`);
  },

  /**
   * Search for users
   */
  searchUsers: async (query: string, params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<UserSearchResult[]>> => {
    return httpClient.get<UserSearchResult[]>('/search/users', {
      params: { q: query, ...params },
    });
  },

  /**
   * Search pins by location or caption
   */
  searchPins: async (query: string, params?: {
    page?: number;
    limit?: number;
    country?: string;
  }): Promise<ApiResponse<Pin[]>> => {
    return httpClient.get<Pin[]>('/search/pins', {
      params: { q: query, ...params },
    });
  },
};

// Post/Feed API Types
interface Post {
  id: string;
  userId: string;
  user: {
    id: string;
    username: string;
    displayName: string;
    avatar?: string;
  };
  pinId?: string;
  type: 'pin' | 'achievement';
  photos: string[];
  caption?: string;
  location?: {
    name: string;
    city: string;
    country: string;
  };
  status?: 'visited' | 'want_to_go';
  rating?: number;
  visitDate?: string;
  achievement?: {
    badge: string;
    title: string;
    count: string;
  };
  likes: number;
  comments: number;
  isLiked: boolean;
  createdAt: string;
  timestamp: string;
}

interface Comment {
  id: string;
  postId: string;
  userId: string;
  user: {
    id: string;
    username: string;
    displayName: string;
    avatar?: string;
    badge?: {
      icon: string;
      color: string;
    };
  };
  text: string;
  likes: number;
  isLiked: boolean;
  createdAt: string;
  timestamp: string;
  replies: Comment[];
}

// Feed/Post APIs
export const postAPI = {
  /**
   * Get feed posts
   */
  getFeed: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<Post[]>> => {
    return httpClient.get<Post[]>('/posts/feed', { params });
  },

  /**
   * Get a single post
   */
  getPost: async (id: string): Promise<ApiResponse<Post>> => {
    return httpClient.get<Post>(`/posts/${id}`);
  },

  /**
   * Like a post
   */
  likePost: async (id: string): Promise<ApiResponse<void>> => {
    return httpClient.post<void>(`/posts/${id}/like`);
  },

  /**
   * Unlike a post
   */
  unlikePost: async (id: string): Promise<ApiResponse<void>> => {
    return httpClient.delete<void>(`/posts/${id}/like`);
  },

  /**
   * Get comments for a post
   */
  getComments: async (postId: string, params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<Comment[]>> => {
    return httpClient.get<Comment[]>(`/posts/${postId}/comments`, { params });
  },

  /**
   * Add a comment to a post
   */
  addComment: async (postId: string, text: string): Promise<ApiResponse<Comment>> => {
    return httpClient.post<Comment>(`/posts/${postId}/comments`, { text });
  },

  /**
   * Reply to a comment
   */
  replyToComment: async (
    postId: string,
    commentId: string,
    text: string
  ): Promise<ApiResponse<Comment>> => {
    return httpClient.post<Comment>(`/posts/${postId}/comments/${commentId}/replies`, {
      text,
    });
  },

  /**
   * Like a comment
   */
  likeComment: async (postId: string, commentId: string): Promise<ApiResponse<void>> => {
    return httpClient.post<void>(`/posts/${postId}/comments/${commentId}/like`);
  },

  /**
   * Unlike a comment
   */
  unlikeComment: async (postId: string, commentId: string): Promise<ApiResponse<void>> => {
    return httpClient.delete<void>(`/posts/${postId}/comments/${commentId}/like`);
  },

  /**
   * Delete a comment
   */
  deleteComment: async (postId: string, commentId: string): Promise<ApiResponse<void>> => {
    return httpClient.delete<void>(`/posts/${postId}/comments/${commentId}`);
  },
};

// User Profile APIs
export const userAPI = {
  /**
   * Get user profile
   */
  getProfile: async (userId: string): Promise<ApiResponse<any>> => {
    return httpClient.get(`/users/${userId}`);
  },

  /**
   * Update current user profile
   */
  updateProfile: async (data: {
    displayName?: string;
    bio?: string;
    avatar?: string;
  }): Promise<ApiResponse<any>> => {
    return httpClient.put('/users/me', data);
  },

  /**
   * Follow a user
   */
  followUser: async (userId: string): Promise<ApiResponse<void>> => {
    return httpClient.post<void>(`/users/${userId}/follow`);
  },

  /**
   * Unfollow a user
   */
  unfollowUser: async (userId: string): Promise<ApiResponse<void>> => {
    return httpClient.delete<void>(`/users/${userId}/follow`);
  },

  /**
   * Get user's followers
   */
  getFollowers: async (userId: string, params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<any[]>> => {
    return httpClient.get(`/users/${userId}/followers`, { params });
  },

  /**
   * Get user's following
   */
  getFollowing: async (userId: string, params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<any[]>> => {
    return httpClient.get(`/users/${userId}/following`, { params });
  },
};

// Badge APIs
export const badgeAPI = {
  /**
   * Get all available badges
   */
  getBadges: async (): Promise<ApiResponse<any[]>> => {
    return httpClient.get('/badges');
  },

  /**
   * Get user's earned badges
   */
  getUserBadges: async (userId?: string): Promise<ApiResponse<any[]>> => {
    const endpoint = userId ? `/users/${userId}/badges` : '/badges/me';
    return httpClient.get(endpoint);
  },

  /**
   * Set active badge
   */
  setActiveBadge: async (badgeId: string): Promise<ApiResponse<void>> => {
    return httpClient.post<void>(`/badges/${badgeId}/activate`);
  },
};
