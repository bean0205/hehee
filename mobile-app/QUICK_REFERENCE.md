# ⚡ Quick Reference - Cheat Sheet

## 🚀 Commands thường dùng

### Development
```powershell
# Start dev server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Clear cache
npm start -- --clear

# Install dependencies
npm install

# Update dependencies
npm update
```

### Debugging
```powershell
# Show dev menu (on device)
# Shake device OR Press Ctrl+M (Android) / Cmd+D (iOS)

# Reload app
# Press 'r' in terminal OR Double tap R (on device)

# Enable hot reload
# Dev menu → Enable Fast Refresh
```

---

## 📁 File Locations

### Cần sửa thường xuyên
```
src/screens/          # Màn hình
src/components/       # Components
src/contexts/         # State management
src/theme/colors.ts   # Màu sắc
app.json              # App config
package.json          # Dependencies
```

### Cần sửa khi setup
```
app.json              # Google Maps API key
src/config/constants.ts  # API URLs
```

---

## 🎨 Design Tokens Quick Reference

### Colors
```typescript
// Primary
colors.primary.main     // #1E3A8A (Deep Blue)
colors.primary.light    // #3B82F6
colors.primary.dark     // #1E40AF

// Accent
colors.accent.main      // #F59E0B (Orange)
colors.accent.light     // #FCD34D
colors.accent.dark      // #D97706

// Status
colors.status.visited   // #10B981 (Green)
colors.status.wantToGo  // #F59E0B (Orange)

// Text
colors.text.primary     // #111827
colors.text.secondary   // #6B7280
colors.text.inverse     // #FFFFFF
```

### Typography
```typescript
// Font Sizes
typography.fontSize.xs    // 12
typography.fontSize.sm    // 14
typography.fontSize.base  // 16
typography.fontSize.lg    // 18
typography.fontSize.xl    // 20
typography.fontSize['2xl'] // 24
typography.fontSize['3xl'] // 30

// Font Weights
typography.fontWeight.regular  // '400'
typography.fontWeight.medium   // '500'
typography.fontWeight.semiBold // '600'
typography.fontWeight.bold     // '700'
```

### Spacing
```typescript
spacing.xs    // 4
spacing.sm    // 8
spacing.md    // 16
spacing.lg    // 24
spacing.xl    // 32
spacing['2xl'] // 40
spacing['3xl'] // 48
```

### Border Radius
```typescript
borderRadius.sm   // 4
borderRadius.md   // 8
borderRadius.lg   // 12
borderRadius.xl   // 16
borderRadius.full // 9999
```

---

## 🧩 Component Usage

### Button
```tsx
<Button
  title="Click me"
  onPress={() => {}}
  variant="primary"    // primary | secondary | outline | text
  size="medium"        // small | medium | large
  fullWidth
  loading={isLoading}
  disabled={false}
/>
```

### Input
```tsx
<Input
  label="Email"
  placeholder="email@example.com"
  value={email}
  onChangeText={setEmail}
  error={errors.email}
  keyboardType="email-address"
  autoCapitalize="none"
  secureTextEntry={false}
  multiline={false}
/>
```

### Avatar
```tsx
<Avatar
  uri="https://..."
  size={80}
  style={{ marginRight: 10 }}
/>
```

### PinCard
```tsx
<PinCard
  pin={pinObject}
  onPress={() => navigation.navigate('PinDetails', { pinId })}
/>
```

---

## 🧭 Navigation

### Navigate to screen
```tsx
import { useNavigation } from '@react-navigation/native';

const navigation = useNavigation<any>();

// Navigate
navigation.navigate('ScreenName', { param: value });

// Go back
navigation.goBack();

// Replace
navigation.replace('ScreenName');

// Reset stack
navigation.reset({
  index: 0,
  routes: [{ name: 'Home' }],
});
```

### Get params
```tsx
import { useRoute } from '@react-navigation/native';

const route = useRoute<any>();
const { pinId } = route.params;
```

---

## 🔄 Context Usage

### Auth Context
```tsx
import { useAuth } from '../contexts/AuthContext';

const { user, login, logout, isAuthenticated } = useAuth();

// Login
await login(email, password);

// Register
await register(email, password, username);

// Logout
await logout();

// Check auth
if (isAuthenticated) { ... }
```

### Pin Context
```tsx
import { usePin } from '../contexts/PinContext';

const { pins, addPin, updatePin, deletePin } = usePin();

// Add pin
addPin({
  name: 'Location',
  latitude: 21.0285,
  longitude: 105.8542,
  status: 'visited',
  rating: 5,
  notes: 'Great place!',
  images: ['url1', 'url2'],
});

// Update pin
updatePin(pinId, { rating: 4 });

// Delete pin
deletePin(pinId);
```

---

## 🗺️ Map Usage

```tsx
import MapView, { Marker } from 'react-native-maps';

<MapView
  ref={mapRef}
  style={{ flex: 1 }}
  initialRegion={{
    latitude: 21.0285,
    longitude: 105.8542,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }}
  showsUserLocation
  showsMyLocationButton
>
  <Marker
    coordinate={{ latitude: 21.0285, longitude: 105.8542 }}
    title="Title"
    description="Description"
    onPress={() => {}}
  />
</MapView>

// Animate to region
mapRef.current?.animateToRegion({
  latitude: lat,
  longitude: lng,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
});
```

---

## 🖼️ Image Picker (Coming Soon)

```tsx
import * as ImagePicker from 'expo-image-picker';

// Pick image
const result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  aspect: [4, 3],
  quality: 1,
});

if (!result.canceled) {
  const uri = result.assets[0].uri;
}

// Take photo
const result = await ImagePicker.launchCameraAsync({...});
```

---

## 📍 Location (Coming Soon)

```tsx
import * as Location from 'expo-location';

// Request permission
const { status } = await Location.requestForegroundPermissionsAsync();

// Get current location
const location = await Location.getCurrentPositionAsync({});
const { latitude, longitude } = location.coords;
```

---

## 💾 Storage

```tsx
import { storage } from '../services/storage';

// Save
await storage.save('key', value);

// Get
const value = await storage.get('key');

// Remove
await storage.remove('key');

// Clear all
await storage.clear();
```

---

## 🎨 Styling Quick Tips

### Common patterns
```tsx
// Container
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.white,
  },
  
  // Center content
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Row layout
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  // Shadow (iOS + Android)
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
```

---

## 🐛 Debug Tips

### Console.log
```tsx
console.log('Debug:', variable);
console.warn('Warning:', data);
console.error('Error:', error);
```

### React DevTools
```powershell
# Install
npm install -g react-devtools

# Run
react-devtools
```

### Network Debugging
```tsx
// See network requests
// Dev menu → Remote JS Debugging
// Open Chrome DevTools → Network tab
```

---

## ⚡ Performance Tips

### Memo
```tsx
import React, { memo } from 'react';

export const Component = memo(({ data }) => {
  // Component only re-renders if data changes
});
```

### useMemo
```tsx
import { useMemo } from 'react';

const expensiveValue = useMemo(
  () => computeExpensiveValue(a, b),
  [a, b]
);
```

### useCallback
```tsx
import { useCallback } from 'react';

const handlePress = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

---

## 🔒 Type Safety

### Props typing
```tsx
interface Props {
  title: string;
  onPress: () => void;
  optional?: boolean;
}

export const Component: React.FC<Props> = ({ title, onPress }) => {
  // ...
};
```

---

## 📱 Testing on Device

### Android
```powershell
# List devices
adb devices

# Install on device
npm run android

# View logs
adb logcat
```

### iOS
```powershell
# List simulators
xcrun simctl list

# Boot simulator
xcrun simctl boot "iPhone 14"

# Install on device
npm run ios
```

---

## 🚨 Common Errors & Solutions

### "Module not found"
```powershell
rm -rf node_modules
npm install
npm start -- --clear
```

### "Metro bundler error"
```powershell
npm start -- --reset-cache
```

### "Build failed"
```powershell
# Android
cd android && ./gradlew clean && cd ..

# iOS
cd ios && pod install && cd ..
```

---

## 📚 Useful Links

- **Expo Docs**: https://docs.expo.dev/
- **React Navigation**: https://reactnavigation.org/
- **React Native Maps**: https://github.com/react-native-maps/react-native-maps
- **React Native**: https://reactnative.dev/
- **TypeScript**: https://www.typescriptlang.org/

---

**Save this file for quick reference! 📌**
