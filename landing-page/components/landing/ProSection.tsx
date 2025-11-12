'use client';

import { motion } from 'framer-motion';

export default function ProSection() {
  return (
    <section id="pro" className="section-padding bg-white dark:bg-gray-900">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Content - LEFT Column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* PRO Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 rounded-full mb-6 border-2 border-yellow-300 dark:border-yellow-700">
              <span className="text-2xl">👑</span>
              <span className="text-yellow-700 dark:text-yellow-300 font-bold text-sm uppercase tracking-wide">
                PRO
              </span>
            </div>

            {/* H2 Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Từ ước mơ đến kế hoạch chi tiết.
            </h2>

            {/* Paragraph Description */}
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Nâng cấp lên Pro để mở khóa <strong>Lập Kế hoạch Chuyến đi (Trip Planner)</strong> (F-UTIL-02). 
              Tổ chức các ghim "Muốn đến" của bạn thành một lịch trình theo ngày (Ngày 1, Ngày 2...) 
              và đồng bộ offline hoàn toàn.
            </p>

            {/* Checklist - Pro Features */}
            <div className="space-y-3 mb-8">
              {[
                { icon: '🎥', text: 'Upload Video cho Ghim (F-MAP-08)' },
                { icon: '📍', text: 'Ghim không giới hạn (Vượt mốc 100 ghim)' },
                { icon: '🔥', text: 'Bản đồ nhiệt (Heatmap) cá nhân (F-STAT-05)' },
                { icon: '🏆', text: 'Huy hiệu (Badges) độc quyền (F-GAME)' },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="flex items-center space-x-3"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 rounded-lg flex items-center justify-center text-xl border border-yellow-200 dark:border-yellow-700">
                    ✅
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{item.text}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pricing Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 p-6 rounded-2xl border-2 border-yellow-200 dark:border-yellow-800 shadow-lg"
            >
              <div className="flex items-baseline space-x-2 mb-2">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">$4.99</span>
                <span className="text-gray-600 dark:text-gray-400">/tháng</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                hoặc $49.99/năm (Tiết kiệm 17%)
              </p>
              <button className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl">
                Nâng cấp lên Pro
              </button>
            </motion.div>
          </motion.div>

          {/* Visual Content - RIGHT Column */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              {/* Placeholder for Trip Planner / Itinerary Mockup */}
              <div className="aspect-[4/3] bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-gray-700 dark:to-gray-800 rounded-3xl shadow-2xl overflow-hidden border-4 border-gray-300 dark:border-gray-600">
                <div className="flex items-center justify-center h-full">
                  <div className="text-center p-8">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 font-semibold text-sm">
                      Mockup: Trip Planner
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">
                      Screen_TripDetails / ItineraryList<br />
                      <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-xs">
                        /public/images/trip-planner-mockup.png
                      </code>
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-yellow-300 dark:bg-yellow-800 rounded-full blur-3xl opacity-30 animate-pulse" />
              <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-amber-300 dark:bg-amber-800 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
