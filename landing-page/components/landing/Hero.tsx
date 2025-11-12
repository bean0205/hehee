'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-24 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 -z-10" />
      
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Content - Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            {/* H1 - SEO Optimized */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
            >
              Bản đồ ký ức của bạn.
            </motion.h1>

            {/* Paragraph - Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0"
            >
              Ghim lại mọi nơi bạn đã đến. Lên kế hoạch cho mọi nơi bạn muốn đi. 
              Biến thế giới thành cuốn hộ chiếu số (F-STAT) của riêng bạn.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col gap-5 items-center lg:items-start mb-8"
            >
              {/* Primary CTA */}
              <Link
                href="/register"
                className="inline-block px-10 py-4 bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white font-bold text-lg rounded-xl transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                Bắt đầu miễn phí
              </Link>
              
              {/* Store Badges Component */}
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <a
                  href="#"
                  className="flex items-center justify-center px-4 py-2.5 bg-black hover:bg-gray-800 text-white rounded-lg transition-all transform hover:scale-105 shadow-lg"
                  aria-label="Download on the App Store"
                >
                  <svg className="w-7 h-7 mr-2.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-[10px] leading-tight">Download on the</div>
                    <div className="text-sm font-semibold leading-tight">App Store</div>
                  </div>
                </a>
                
                <a
                  href="#"
                  className="flex items-center justify-center px-4 py-2.5 bg-black hover:bg-gray-800 text-white rounded-lg transition-all transform hover:scale-105 shadow-lg"
                  aria-label="Get it on Google Play"
                >
                  <svg className="w-7 h-7 mr-2.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-[10px] leading-tight">GET IT ON</div>
                    <div className="text-sm font-semibold leading-tight">Google Play</div>
                  </div>
                </a>
              </div>
            </motion.div>
          </motion.div>

          {/* Visual Content - Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="relative order-first lg:order-last"
          >
            <div className="relative z-10">
              {/* Placeholder for App Mockup (Screen_MapHome & Screen_Profile) */}
              <div className="relative mx-auto max-w-md lg:max-w-lg">
                <div className="aspect-[9/16] bg-gradient-to-br from-primary-100 to-blue-100 dark:from-gray-800 dark:to-gray-700 rounded-3xl shadow-2xl overflow-hidden border-4 border-gray-300 dark:border-gray-600">
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center p-8">
                      <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 font-semibold text-sm">
                        Mockup: Map Home & Profile
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">
                        Thêm ảnh vào<br />
                        <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-xs">
                          /public/images/app-mockup-hero.png
                        </code>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary-200 dark:bg-primary-900 rounded-full blur-3xl opacity-40 animate-pulse" />
              <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-blue-200 dark:bg-blue-900 rounded-full blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
