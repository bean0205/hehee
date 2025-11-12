# 🌙 Dark Mode Implementation Guide

## Tổng quan

Dark Mode đã được tích hợp hoàn chỉnh vào ứng dụng PinYourWord với 3 chế độ:
- **Sáng (Light)**: Giao diện sáng
- **Tối (Dark)**: Giao diện tối
- **Tự động (Auto)**: Theo hệ thống

## Cấu trúc

### 1. ThemeContext (`src/contexts/ThemeContext.tsx`)

Context quản lý theme cho toàn bộ ứng dụng:

```typescript
const { isDarkMode, themeMode, setThemeMode, toggleTheme, colors } = useTheme();
```

**Properties:**
- `isDarkMode`: Boolean - Kiểm tra có đang ở chế độ tối không
- `themeMode`: 'light' | 'dark' | 'auto' - Chế độ hiện tại
- `setThemeMode`: Function - Đặt chế độ theme
- `toggleTheme`: Function - Chuyển đổi giữa sáng/tối
- `colors`: Object - Bộ màu động theo theme

### 2. Color Palette

#### Light Mode Colors
```typescript
{
  primary: { main: '#1E3A8A', light: '#3B82F6', dark: '#1E40AF' },
  background: { main: '#FFFFFF', secondary: '#F9FAFB', card: '#FFFFFF' },
  text: { primary: '#111827', secondary: '#6B7280', disabled: '#9CA3AF' },
  border: { main: '#E5E7EB', light: '#F3F4F6', dark: '#D1D5DB' },
  // ... và nhiều màu khác
}
```

#### Dark Mode Colors
```typescript
{
  primary: { main: '#60A5FA', light: '#93C5FD', dark: '#3B82F6' },
  background: { main: '#0F172A', secondary: '#1E293B', card: '#1E293B' },
  text: { primary: '#F8FAFC', secondary: '#CBD5E1', disabled: '#64748B' },
  border: { main: '#334155', light: '#1E293B', dark: '#475569' },
  // ... và nhiều màu khác
}
```

### 3. Cách sử dụng trong Components

#### Bước 1: Import useTheme
```typescript
import { useTheme } from '../../contexts/ThemeContext';
```

#### Bước 2: Lấy colors từ theme
```typescript
const { colors, isDarkMode } = useTheme();
```

#### Bước 3: Tạo dynamic styles
```typescript
const styles = React.useMemo(() => createStyles(colors), [colors]);
```

#### Bước 4: Định nghĩa createStyles function
```typescript
const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
  text: {
    color: colors.text.primary,
  },
  // ... styles khác
});
```

### 4. Màn hình đã tích hợp Dark Mode

✅ **SettingsScreen**: Cài đặt với toggle Dark Mode
✅ **ProfileScreen**: Hồ sơ người dùng
✅ **MapScreen**: Bản đồ với custom dark style

### 5. Cách thêm Dark Mode vào màn hình mới

**Ví dụ: NewScreen.tsx**

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export const NewScreen = () => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello Dark Mode!</Text>
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.main,
    padding: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
});
```

## Tính năng trong Settings

Trong màn hình **Cài đặt**, người dùng có thể:

1. Nhấn vào **"🌙 Giao diện"**
2. Chọn một trong 3 chế độ:
   - **Sáng**: Luôn dùng giao diện sáng
   - **Tối**: Luôn dùng giao diện tối
   - **Tự động**: Theo cài đặt hệ thống

Lựa chọn được lưu vào AsyncStorage và áp dụng ngay lập tức.

## Map Dark Mode

MapScreen sử dụng custom map style cho Dark Mode:
- Đường phố, địa hình, nước được tô màu tối
- Tự động chuyển đổi khi thay đổi theme
- Tương thích với Google Maps

```typescript
<MapView
  customMapStyle={isDarkMode ? darkMapStyle : []}
  // ... other props
/>
```

## Best Practices

### ✅ DO
- Luôn sử dụng `colors` từ `useTheme()` thay vì import trực tiếp
- Sử dụng semantic colors: `colors.text.primary` thay vì `colors.neutral.gray900`
- Wrap styles trong `useMemo` để tối ưu performance
- Test cả Light và Dark mode khi phát triển

### ❌ DON'T
- Không hardcode màu sắc trong styles
- Không import `colors` trực tiếp từ `theme/colors.ts`
- Không quên cập nhật cả hai bộ màu (light & dark)

## Kiểm tra Dark Mode

### Trong Settings
1. Mở app
2. Vào tab **Cài đặt**
3. Nhấn **"🌙 Giao diện"**
4. Chọn **"Tối"**
5. Giao diện sẽ chuyển sang tối ngay lập tức

### Theo hệ thống
1. Trong Settings chọn **"Tự động"**
2. Vào Settings hệ thống iOS/Android
3. Bật/tắt Dark Mode
4. App sẽ tự động thay đổi theo

## Màu sắc Semantic

Sử dụng semantic colors để code dễ đọc và bảo trì:

| Semantic Name | Light Mode | Dark Mode | Sử dụng cho |
|--------------|------------|-----------|-------------|
| `background.main` | #FFFFFF | #0F172A | Màu nền chính |
| `background.secondary` | #F9FAFB | #1E293B | Màu nền phụ |
| `background.card` | #FFFFFF | #1E293B | Màu nền card |
| `text.primary` | #111827 | #F8FAFC | Text chính |
| `text.secondary` | #6B7280 | #CBD5E1 | Text phụ |
| `text.disabled` | #9CA3AF | #64748B | Text disabled |
| `text.inverse` | #FFFFFF | #0F172A | Text ngược |
| `border.main` | #E5E7EB | #334155 | Border chính |
| `border.light` | #F3F4F6 | #1E293B | Border nhạt |
| `border.dark` | #D1D5DB | #475569 | Border đậm |

## Troubleshooting

### Màu không đổi khi chuyển theme
- Kiểm tra có sử dụng `useMemo` với dependency `[colors]` không
- Đảm bảo component re-render khi colors thay đổi

### Performance issues
- Đảm bảo styles được memo với `useMemo`
- Không tạo styles mới mỗi lần render

### Colors undefined
- Kiểm tra component có được wrap trong `ThemeProvider` không
- Đảm bảo đã import `useTheme` đúng cách

## Future Enhancements

- [ ] Thêm animation khi chuyển đổi theme
- [ ] Tùy chỉnh màu sắc cá nhân
- [ ] Theme presets (Ocean, Forest, Sunset, etc.)
- [ ] Schedule dark mode (tự động vào ban đêm)

---

**Note**: Dark Mode đã được test trên cả iOS và Android simulators/emulators.
