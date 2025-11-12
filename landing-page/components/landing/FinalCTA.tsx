'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function FinalCTA() {
  return (
    <section className="section-padding bg-gradient-to-br from-primary-600 via-primary-700 to-blue-700 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Decorative Blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400 rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-400 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1.5s' }} />

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
            className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full mb-8 shadow-2xl"
          >
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </motion.div>

          {/* H2 Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6"
          >
            Hành trình của bạn bắt đầu từ đây.
          </motion.h2>

          {/* Paragraph Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl text-white/95 mb-10 leading-relaxed max-w-2xl mx-auto"
          >
            Tạo tài khoản miễn phí và bắt đầu ghim bản đồ thế giới của bạn ngay hôm nay.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col items-center gap-6 mb-10"
          >
            {/* Primary Button - "Đăng ký miễn phí ngay" */}
            <Link
              href="/register"
              className="inline-block px-12 py-5 bg-white hover:bg-gray-100 text-primary-700 font-bold text-lg rounded-xl transition-all transform hover:scale-105 shadow-2xl hover:shadow-3xl"
            >
              Đăng ký miễn phí ngay
            </Link>

            {/* Store Badges Component */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="#"
                className="flex items-center justify-center px-5 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-lg transition-all transform hover:scale-105 border border-white/20"
                aria-label="Download on the App Store"
              >
                <svg className="w-7 h-7 mr-2.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div className="text-left">
                  <div className="text-[10px] leading-tight opacity-90">Download on the</div>
                  <div className="text-sm font-semibold leading-tight">App Store</div>
                </div>
              </a>
              
              <a
                href="#"
                className="flex items-center justify-center px-5 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-lg transition-all transform hover:scale-105 border border-white/20"
                aria-label="Get it on Google Play"
              >
                <svg className="w-7 h-7 mr-2.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                <div className="text-left">
                  <div className="text-[10px] leading-tight opacity-90">GET IT ON</div>
                  <div className="text-sm font-semibold leading-tight">Google Play</div>
                </div>
              </a>
            </div>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-6 text-white/90 text-sm"
          >
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Miễn phí 100%</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Không cần thẻ tín dụng</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Hủy bất cứ lúc nào</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
