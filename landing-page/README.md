# PinYourWorld - Landing Page

Ứng dụng Landing Page cho PinYourWorld được xây dựng với Next.js, TypeScript, và Tailwind CSS.

## 🚀 Công nghệ sử dụng

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Deployment:** Vercel (khuyến nghị)

## 📁 Cấu trúc dự án

```
landing-page/
├── app/
│   ├── page.tsx              # Trang chủ Landing Page
│   ├── layout.tsx            # Root layout với SEO metadata
│   ├── globals.css           # Global styles với Tailwind
│   ├── login/
│   │   └── page.tsx          # Trang đăng nhập
│   ├── register/
│   │   └── page.tsx          # Trang đăng ký
│   └── app/
│       └── page.tsx          # Main app (placeholder)
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx        # Navigation bar (sticky, responsive)
│   │   └── Footer.tsx        # Footer
│   └── landing/
│       ├── Hero.tsx          # Hero section
│       ├── Features.tsx      # Features showcase
│       ├── SocialSection.tsx # Community features (V1.5)
│       ├── ProSection.tsx    # Pro features & pricing (V2.0)
│       └── FinalCTA.tsx      # Final call-to-action
│
├── public/
│   └── images/               # Placeholder cho mockup images
│
├── tailwind.config.ts        # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
└── package.json
```

## 🎨 Tính năng đã triển khai

### ✅ Landing Page (Trang chủ)
- ✨ Hero Section với gradient background
- 📱 Responsive design (Mobile-first)
- 🎭 Smooth animations với Framer Motion
- 📊 Features grid (3 cột)
- 👥 Social Section (V1.5)
- 💎 Pro Features Section (V2.0)
- 🎯 Final CTA với trust badges
- 🦶 Footer với 4 cột navigation

### ✅ Navigation
- Sticky navbar với blur effect khi scroll
- Mobile menu (hamburger)
- Smooth scroll đến các sections
- Dark mode support

### ✅ Auth Pages
- Login page với form validation
- Register page với terms checkbox
- Google OAuth placeholder
- Responsive design
- Back to home navigation

### ✅ Main App (Placeholder)
- Split-screen layout
- Sidebar navigation
- User stats placeholder
- Map area placeholder
- Search bar

## 🛠️ Cài đặt và Chạy

### Yêu cầu
- Node.js 18+ 
- npm hoặc yarn

### Bước 1: Cài đặt dependencies

```bash
cd landing-page
npm install
```

### Bước 2: Chạy development server

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem kết quả.

### Bước 3: Build cho production

```bash
npm run build
npm start
```

## 📸 Thêm Mockup Images

Để hiển thị mockup đẹp hơn, hãy thêm các file ảnh sau vào thư mục `public/images/`:

1. `app-mockup-hero.png` - Mockup app cho Hero section
2. `social-feed-mockup.png` - Mockup feed cho Social section  
3. `trip-planner-mockup.png` - Mockup trip planner cho Pro section

## 🎨 Customization

### Màu sắc
Chỉnh sửa `tailwind.config.ts` để thay đổi color scheme.

## 🚀 Deploy lên Vercel

1. Push code lên GitHub repository
2. Truy cập [vercel.com](https://vercel.com)
3. Import project từ GitHub
4. Vercel sẽ tự động detect Next.js và deploy

## 📝 Next Steps

### Cần làm thêm:
1. **Backend Integration:** API đăng nhập/đăng ký, Google OAuth
2. **Map Integration:** Tích hợp Google Maps hoặc Mapbox
3. **Images:** Thêm mockup images chất lượng cao
4. **SEO:** sitemap.xml, robots.txt, Open Graph images
5. **Analytics:** Google Analytics, Conversion tracking

## 📄 License

© 2025 PinYourWorld. All rights reserved.

---

**Happy Coding! 🎉**
