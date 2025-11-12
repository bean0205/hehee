'use client';

import { motion } from 'framer-motion';

export default function SocialSection() {
  return (
    <section id="social" className="section-padding bg-gradient-to-br from-blue-50 to-primary-50 dark:from-gray-800 dark:to-gray-900">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Visual Content - LEFT Column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Placeholder for Social Feed or User Profile Mockup */}
            <div className="relative mx-auto max-w-md">
              <div className="aspect-[9/16] bg-gradient-to-br from-blue-100 to-primary-100 dark:from-gray-700 dark:to-gray-800 rounded-3xl shadow-2xl overflow-hidden border-4 border-gray-300 dark:border-gray-600">
                <div className="flex items-center justify-center h-full">
                  <div className="text-center p-8">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-600 to-primary-600 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 font-semibold text-sm">
                      Mockup: Feed / User Profile
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">
                      Thêm ảnh vào<br />
                      <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-xs">
                        /public/images/social-feed-mockup.png
                      </code>
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary-300 dark:bg-primary-800 rounded-full blur-3xl opacity-30 animate-pulse" />
              <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-blue-300 dark:bg-blue-800 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
          </motion.div>

          {/* Text Content - RIGHT Column */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Version Badge */}
            <div className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
              <span className="text-blue-700 dark:text-blue-300 font-semibold text-sm">
                📱 V1.5 - Cộng đồng
              </span>
            </div>

            {/* H2 Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Khám phá thế giới qua lăng kính của bạn bè.
            </h2>

            {/* Paragraph Description */}
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Theo dõi (F-SOC-01) hành trình của bạn bè và các travel blogger. Lấy cảm hứng từ 
              Bảng tin (Feed) (F-SOC-03) và xem bản đồ công khai của họ để tìm những địa điểm 
              độc đáo mà bạn chưa từng biết đến.
            </p>

            {/* Features List */}
            <div className="space-y-4">
              {[
                { icon: '👥', text: 'Theo dõi bạn bè và travel bloggers' },
                { icon: '🗺️', text: 'Khám phá bản đồ công khai' },
                { icon: '📰', text: 'Bảng tin cập nhật hành trình mới nhất' },
                { icon: '✨', text: 'Tìm cảm hứng cho chuyến đi tiếp theo' },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="flex items-start space-x-3"
                >
                  <div className="flex-shrink-0 text-2xl mt-0.5">
                    {item.icon}
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                    {item.text}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
