import { authAPI } from './api/authApi';
import { httpClient } from './api/httpClient';
import { setStorageItem } from '../services/storage';
import { Alert } from 'react-native';

export const authService = {
  // Login 
  handleLogin: async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      
      // Save token for future requests
      await setStorageItem('auth_token', response.data.accessToken);
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

  // Register 
  handleRegister: async (email: string, password: string, username: string, displayName: string) => {
    try {
      const response = await authAPI.register(email, password, username, displayName );

      // Save token
      await setStorageItem('auth_token', response.data.accessToken);
      await setStorageItem('user_data', response.data.user);
      
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  // Social login 
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