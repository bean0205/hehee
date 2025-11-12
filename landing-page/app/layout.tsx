import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PinYourWorld - Bản đồ ký ức của bạn',
  description: 'Ghim lại mọi nơi bạn đã đến. Lên kế hoạch cho mọi nơi bạn muốn đi. Biến thế giới thành cuốn hộ chiếu số của riêng bạn.',
  keywords: ['travel', 'map', 'pin', 'bucket list', 'travel planning', 'du lịch', 'bản đồ'],
  authors: [{ name: 'PinYourWorld Team' }],
  openGraph: {
    title: 'PinYourWorld - Bản đồ ký ức của bạn',
    description: 'Ghim lại mọi nơi bạn đã đến. Lên kế hoạch cho mọi nơi bạn muốn đi.',
    type: 'website',
    locale: 'vi_VN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PinYourWorld - Bản đồ ký ức của bạn',
    description: 'Ghim lại mọi nơi bạn đã đến. Lên kế hoạch cho mọi nơi bạn muốn đi.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
