export const API_BASE_URL = __DEV__
  ? 'http://localhost:3000/api'
  : 'https://api.pinyourword.com';

export const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';

export const MAX_IMAGES_PER_PIN = 5;

export const FREE_TIER_MAX_PINS = 100;

export const SOCIAL_LOGIN = {
  GOOGLE_CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID',
  APPLE_CLIENT_ID: 'YOUR_APPLE_CLIENT_ID',
};

export const STORAGE_KEYS = {
  USER_TOKEN: '@pinyourword:user_token',
  USER_DATA: '@pinyourword:user_data',
  HAS_SEEN_WALKTHROUGH: '@pinyourword:has_seen_walkthrough',
  OFFLINE_PINS: '@pinyourword:offline_pins',
};
