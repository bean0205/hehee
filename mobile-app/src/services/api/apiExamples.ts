/**
 * API Usage Examples
 * Demonstrates how to use the HTTP Client and API services
 */

import { authAPI, pinAPI, postAPI, uploadAPI, searchAPI, userAPI } from './api/api';
import { httpClient } from './api/httpClient';
import { setStorageItem } from '../services/storage';
import { Alert } from 'react-native';

/**
 * Example 1: User Authentication
 */
export const authExamples = {
  // Login example
  handleLogin: async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      
      // Save token for future requests
      await setStorageItem('auth_token', response.data.token);
      await setStorageItem('user_data', response.data.user);
      
      console.log('Login successful:', response.data.user);
      return response.data;
    } catch (error: any) {
      if (error.statusCode === 401) {
        Alert.alert('Error', 'Invalid email or password');
      } else if (error.statusCode === 422) {
        Alert.alert('Error', 'Please check your input');
      } else {
        Alert.alert('Error', error.message || 'Login failed');
      }
      throw error;
    }
  },

  // Register example
  handleRegister: async (email: string, password: string, username: string) => {
    try {
      const response = await authAPI.register(email, password, username);
      
      // Save token
      await setStorageItem('auth_token', response.data.token);
      await setStorageItem('user_data', response.data.user);
      
      return response.data;
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Registration failed');
      throw error;
    }
  },

  // Social login example
  handleGoogleLogin: async (googleToken: string) => {
    try {
      const response = await authAPI.socialLogin('google', googleToken);
      
      await setStorageItem('auth_token', response.data.token);
      await setStorageItem('user_data', response.data.user);
      
      return response.data;
    } catch (error: any) {
      Alert.alert('Error', 'Google login failed');
      throw error;
    }
  },
};

/**
 * Example 2: Managing Pins
 */
export const pinExamples = {
  // Create a new pin with loading state
  createPin: async (pinData: any, setLoading: (loading: boolean) => void) => {
    setLoading(true);
    try {
      const response = await pinAPI.createPin(pinData);
      
      Alert.alert('Success', 'Pin created successfully!');
      return response.data;
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create pin');
      throw error;
    } finally {
      setLoading(false);
    }
  },

  // Fetch pins with pagination
  fetchPins: async (page: number = 1, limit: number = 20) => {
    try {
      const response = await pinAPI.getPins({
        page,
        limit,
        status: 'visited',
      });
      
      return response.data.pins;
    } catch (error: any) {
      console.error('Failed to fetch pins:', error);
      return [];
    }
  },

  // Update pin with optimistic UI
  updatePinRating: async (pinId: string, newRating: number) => {
    try {
      const response = await pinAPI.updatePin(pinId, {
        rating: newRating,
      });
      
      return response.data;
    } catch (error: any) {
      Alert.alert('Error', 'Failed to update rating');
      throw error;
    }
  },

  // Delete pin with confirmation
  deletePin: async (pinId: string) => {
    return new Promise((resolve, reject) => {
      Alert.alert(
        'Delete Pin',
        'Are you sure you want to delete this pin?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => reject(new Error('Cancelled')),
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              try {
                await pinAPI.deletePin(pinId);
                Alert.alert('Success', 'Pin deleted successfully');
                resolve(true);
              } catch (error: any) {
                Alert.alert('Error', 'Failed to delete pin');
                reject(error);
              }
            },
          },
        ]
      );
    });
  },
};

/**
 * Example 3: Image Upload
 */
export const uploadExamples = {
  // Upload single image with progress
  uploadSingleImage: async (imageUri: string) => {
    try {
      console.log('Uploading image...');
      const response = await uploadAPI.uploadImage(imageUri);
      
      console.log('Upload successful:', response.data.url);
      return response.data.url;
    } catch (error: any) {
      Alert.alert('Error', 'Failed to upload image');
      throw error;
    }
  },

  // Upload multiple images
  uploadMultipleImages: async (imageUris: string[]) => {
    try {
      console.log(`Uploading ${imageUris.length} images...`);
      const response = await uploadAPI.uploadImages(imageUris);
      
      const urls = response.data.map(img => img.url);
      console.log('All images uploaded successfully');
      return urls;
    } catch (error: any) {
      Alert.alert('Error', 'Failed to upload images');
      throw error;
    }
  },

  // Upload with retry on failure
  uploadWithRetry: async (imageUri: string) => {
    try {
      // httpClient will automatically retry on network failures
      const response = await httpClient.upload('/upload/image', 
        createFormData(imageUri),
        { retry: 3 }  // Retry up to 3 times
      );
      
      return response.data.url;
    } catch (error: any) {
      Alert.alert('Error', 'Failed to upload image after 3 retries');
      throw error;
    }
  },
};

/**
 * Example 4: Search Functionality
 */
export const searchExamples = {
  // Search places with debounce
  searchPlaces: async (query: string, currentLocation?: any) => {
    if (query.trim().length < 2) {
      return [];
    }

    try {
      const response = await searchAPI.searchPlaces(query, currentLocation);
      return response.data;
    } catch (error: any) {
      console.error('Search failed:', error);
      return [];
    }
  },

  // Search users
  searchUsers: async (query: string) => {
    try {
      const response = await searchAPI.searchUsers(query, {
        page: 1,
        limit: 20,
      });
      
      return response.data;
    } catch (error: any) {
      console.error('User search failed:', error);
      return [];
    }
  },
};

/**
 * Example 5: Feed and Posts
 */
export const feedExamples = {
  // Load feed with pagination
  loadFeed: async (page: number = 1) => {
    try {
      const response = await postAPI.getFeed({
        page,
        limit: 20,
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Failed to load feed:', error);
      return [];
    }
  },

  // Like a post with optimistic update
  likePost: async (
    postId: string,
    currentLikes: number,
    setLikes: (likes: number) => void,
    setIsLiked: (liked: boolean) => void
  ) => {
    // Optimistic update
    setIsLiked(true);
    setLikes(currentLikes + 1);

    try {
      await postAPI.likePost(postId);
    } catch (error: any) {
      // Revert on error
      setIsLiked(false);
      setLikes(currentLikes);
      Alert.alert('Error', 'Failed to like post');
    }
  },

  // Add comment
  addComment: async (postId: string, text: string) => {
    if (text.trim().length === 0) {
      return null;
    }

    try {
      const response = await postAPI.addComment(postId, text);
      return response.data;
    } catch (error: any) {
      Alert.alert('Error', 'Failed to post comment');
      throw error;
    }
  },

  // Load comments with pagination
  loadComments: async (postId: string, page: number = 1) => {
    try {
      const response = await postAPI.getComments(postId, {
        page,
        limit: 20,
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Failed to load comments:', error);
      return [];
    }
  },
};

/**
 * Example 6: User Profile Operations
 */
export const profileExamples = {
  // Load user profile
  loadProfile: async (userId: string) => {
    try {
      const response = await userAPI.getProfile(userId);
      return response.data;
    } catch (error: any) {
      console.error('Failed to load profile:', error);
      return null;
    }
  },

  // Update profile
  updateProfile: async (updates: any) => {
    try {
      const response = await userAPI.updateProfile(updates);
      
      Alert.alert('Success', 'Profile updated successfully');
      return response.data;
    } catch (error: any) {
      Alert.alert('Error', 'Failed to update profile');
      throw error;
    }
  },

  // Follow user with optimistic update
  followUser: async (
    userId: string,
    setIsFollowing: (following: boolean) => void
  ) => {
    // Optimistic update
    setIsFollowing(true);

    try {
      await userAPI.followUser(userId);
    } catch (error: any) {
      // Revert on error
      setIsFollowing(false);
      Alert.alert('Error', 'Failed to follow user');
    }
  },
};

/**
 * Example 7: Custom Interceptor Usage
 */
export const customInterceptorExamples = {
  // Add custom request interceptor
  addCustomHeaders: () => {
    httpClient.addRequestInterceptor(async (config) => {
      config.headers = {
        ...config.headers,
        'X-App-Version': '1.0.0',
        'X-Platform': 'mobile',
      };
      return config;
    });
  },

  // Add analytics interceptor
  addAnalytics: () => {
    httpClient.addRequestInterceptor(async (config) => {
      console.log('📊 API Call:', config.method, config.url);
      // Send to analytics service
      return config;
    });

    httpClient.addResponseInterceptor(async (response) => {
      console.log('📊 API Response:', response.status);
      return response;
    });
  },

  // Add error tracking
  addErrorTracking: () => {
    httpClient.addErrorInterceptor(async (error) => {
      // Send to error tracking service (e.g., Sentry)
      console.error('🚨 API Error:', {
        message: error.message,
        statusCode: error.statusCode,
        timestamp: new Date().toISOString(),
      });
      
      throw error;
    });
  },
};

/**
 * Helper function to create FormData
 */
function createFormData(uri: string) {
  const formData = new FormData();
  formData.append('file', {
    uri,
    type: 'image/jpeg',
    name: `photo_${Date.now()}.jpg`,
  } as any);
  return formData;
}

/**
 * Example 8: Error Handling Patterns
 */
export const errorHandlingExamples = {
  // Comprehensive error handling
  handleApiCall: async (apiCall: () => Promise<any>) => {
    try {
      const response = await apiCall();
      return { success: true, data: response.data };
    } catch (error: any) {
      let errorMessage = 'An error occurred';
      
      switch (error.statusCode) {
        case 400:
          errorMessage = 'Invalid request';
          break;
        case 401:
          errorMessage = 'Please login again';
          // Navigate to login screen
          break;
        case 403:
          errorMessage = 'Access denied';
          break;
        case 404:
          errorMessage = 'Resource not found';
          break;
        case 422:
          errorMessage = 'Validation failed';
          if (error.errors) {
            // Show validation errors
            console.log('Validation errors:', error.errors);
          }
          break;
        case 500:
          errorMessage = 'Server error, please try again later';
          break;
        default:
          errorMessage = error.message || 'Something went wrong';
      }
      
      return { success: false, error: errorMessage };
    }
  },
};

/**
 * Example 9: Concurrent Requests
 */
export const concurrentRequestExamples = {
  // Load multiple resources in parallel
  loadDashboardData: async () => {
    try {
      const [feedResponse, pinsResponse, userResponse] = await Promise.all([
        postAPI.getFeed({ page: 1, limit: 10 }),
        pinAPI.getPins({ page: 1, limit: 10 }),
        authAPI.getCurrentUser(),
      ]);

      return {
        feed: feedResponse.data,
        pins: pinsResponse.data,
        user: userResponse.data,
      };
    } catch (error: any) {
      console.error('Failed to load dashboard data:', error);
      throw error;
    }
  },
};

export default {
  authExamples,
  pinExamples,
  uploadExamples,
  searchExamples,
  feedExamples,
  profileExamples,
  customInterceptorExamples,
  errorHandlingExamples,
  concurrentRequestExamples,
};
