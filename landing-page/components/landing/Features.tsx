'use client';

import { motion } from 'framer-motion';

const features = [
  {
    icon: '✍️',
    title: 'Lưu giữ Kỷ niệm',
    subtitle: 'Nhật ký Bản đồ',
    code: 'F-MAP-05',
    description: 'Không chỉ là một cái ghim. Thêm ghi chú, nhật ký cá nhân, đánh giá (1-5 sao), và thư viện ảnh (tối đa 5 ảnh/ghim) cho mỗi địa điểm.',
    color: 'from-amber-500 to-orange-600',
    bgGradient: 'from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20',
    highlights: ['📝 Nhật ký cá nhân', '⭐ Đánh giá 1-5 sao', '📸 5 ảnh/ghim'],
  },
  {
    icon: '🚩',
    title: 'Lên Kế hoạch & Mơ ước',
    subtitle: 'Lên Kế hoạch',
    code: 'F-MAP-04',
    description: 'Phân biệt rõ ràng giữa các ghim "Đã đến" (Visited) và "Muốn đến" (Want to Go). Xây dựng bucket list của bạn chưa bao giờ dễ dàng hơn.',
    color: 'from-blue-500 to-cyan-600',
    bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
    highlights: ['✅ Đã đến', '🎯 Muốn đến', '📋 Bucket List'],
  },
  {
    icon: '📊',
    title: 'Thống kê Hành trình',
    subtitle: 'Hộ chiếu Số',
    code: 'F-STAT-02',
    description: 'Xem hồ sơ cá nhân của bạn tự động đếm số Quốc gia, Thành phố, và % Thế giới bạn đã khám phá.',
    color: 'from-purple-500 to-pink-600',
    bgGradient: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
    highlights: ['🌍 Quốc gia', '🏙️ Thành phố', '📈 % Thế giới'],
  },
];

export default function Features() {
  return (
    <section id="features" className="section-padding relative overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-850 dark:to-gray-900">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-200/30 dark:bg-primary-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-200/30 dark:bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          {/* <div className="inline-block px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 rounded-full mb-6 shadow-lg shadow-primary-500/30">
            <span className="text-white font-bold text-sm flex items-center gap-2">
              <span className="text-lg">⭐</span>
              TÍNH NĂNG V1.0
            </span>
          </div> */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6">
            Tính năng
            <span className="block mt-2 bg-gradient-to-r from-primary-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Đột phá & Nổi bật
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Khám phá những công cụ mạnh mẽ giúp bạn ghi lại và lên kế hoạch cho mọi hành trình
          </p>
        </motion.div>

        {/* Features Grid - Modern Card Design */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.7 }}
              className="group relative"
            >
              {/* Glow Effect on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-20 rounded-3xl blur-xl transition-all duration-500`}></div>
              
              {/* Main Card */}
              <div className={`relative h-full bg-gradient-to-br ${feature.bgGradient} backdrop-blur-sm p-8 lg:p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border-2 border-transparent group-hover:border-white dark:group-hover:border-gray-700 overflow-hidden`}>
                {/* Top Corner Badge */}
                <div className="absolute top-4 right-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md">
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{feature.code}</span>
                </div>

                {/* Icon with Gradient Background */}
                <div className={`inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-br ${feature.color} rounded-2xl shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                  <span className="text-4xl filter drop-shadow-lg">{feature.icon}</span>
                </div>

                {/* Subtitle Badge */}
                <div className="mb-3">
                  <span className={`inline-block px-3 py-1 bg-gradient-to-r ${feature.color} text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-md`}>
                    {feature.subtitle}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 text-base">
                  {feature.description}
                </p>

                {/* Highlights - Key Points */}
                <div className="space-y-2.5 pt-4 border-t-2 border-gray-200/50 dark:border-gray-700/50">
                  {feature.highlights.map((highlight, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.2 + idx * 0.1, duration: 0.4 }}
                      className="flex items-center gap-2"
                    >
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${feature.color}`}></div>
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        {highlight}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Bottom Shine Effect */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-20 text-center"
        >
          {/* <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-gradient-to-r from-primary-50 via-blue-50 to-purple-50 dark:from-primary-900/30 dark:via-blue-900/30 dark:to-purple-900/30 px-8 py-5 rounded-2xl shadow-xl border-2 border-primary-100 dark:border-primary-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  Hoàn toàn miễn phí
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Không cần thẻ tín dụng • Bắt đầu ngay
                </div>
              </div>
            </div>
          </div> */}
        </motion.div>
      </div>
    </section>
  );
}
