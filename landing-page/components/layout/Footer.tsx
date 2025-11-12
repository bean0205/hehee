'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }} />

      <div className="relative z-10">
        <div className="container-custom py-16 sm:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
            {/* Column 1: Brand & About - More Impressive */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="flex items-center space-x-3 group">
                <motion.div 
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="relative w-14 h-14"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-400 via-primary-600 to-blue-700 rounded-2xl shadow-lg group-hover:shadow-2xl group-hover:shadow-primary-500/30 transition-all" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </motion.div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black bg-gradient-to-r from-white via-primary-200 to-blue-200 bg-clip-text text-transparent">
                    PinYourWorld
                  </span>
                  <span className="text-xs text-gray-400 font-medium">
                    Your Travel Diary
                  </span>
                </div>
              </div>
              
              <p className="text-sm text-gray-400 leading-relaxed">
                Biến thế giới thành cuốn hộ chiếu số của riêng bạn. Ghim lại mọi kỷ niệm, 
                lên kế hoạch cho mọi hành trình.
              </p>
              
              {/* Social Icons - More Impressive */}
              <div className="flex space-x-3 pt-2">
                {[
                  { icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z', label: 'Facebook', color: 'from-blue-600 to-blue-700' },
                  { icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z', label: 'Instagram', color: 'from-pink-600 to-purple-600' },
                  { icon: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z', label: 'Twitter', color: 'from-blue-400 to-blue-500' },
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href="#"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${social.color} hover:shadow-lg hover:shadow-primary-500/30 flex items-center justify-center transition-all group`}
                    aria-label={social.label}
                  >
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d={social.icon} />
                    </svg>
                  </motion.a>
                ))}
              </div>

              {/* Newsletter Signup */}
              <div className="pt-4">
                <h4 className="text-white font-semibold mb-3 text-sm">Nhận tin tức mới nhất</h4>
                <div className="flex space-x-2">
                  <input
                    type="email"
                    placeholder="Email của bạn"
                    className="flex-1 px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm text-white placeholder-gray-500 transition-all"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2.5 bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all"
                  >
                    →
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Column 2: Product */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3 className="text-white font-bold mb-6 text-lg flex items-center space-x-2">
                <span className="w-8 h-8 bg-gradient-to-br from-primary-500 to-blue-600 rounded-lg flex items-center justify-center text-sm">
                  🚀
                </span>
                <span>Sản phẩm</span>
              </h3>
              <ul className="space-y-3">
                {[
                  { name: 'Tính năng', href: '#features' },
                  { name: 'Gói Pro', href: '#pro' },
                  { name: 'Tải ứng dụng', href: '#' },
                  { name: 'Roadmap', href: '#' },
                ].map((item, index) => (
                  <li key={index}>
                    <a 
                      href={item.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm flex items-center space-x-2 group"
                    >
                      <span className="w-1.5 h-1.5 bg-primary-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span>{item.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Column 3: Company */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-white font-bold mb-6 text-lg flex items-center space-x-2">
                <span className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-sm">
                  🏢
                </span>
                <span>Công ty</span>
              </h3>
              <ul className="space-y-3">
                {[
                  { name: 'Về chúng tôi', href: '/about' },
                  { name: 'Blog', href: '/blog' },
                  { name: 'Liên hệ', href: '/contact' },
                  { name: 'Careers', href: '#' },
                ].map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm flex items-center space-x-2 group"
                    >
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Column 4: Legal & Support */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-white font-bold mb-6 text-lg flex items-center space-x-2">
                <span className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center text-sm">
                  📋
                </span>
                <span>Pháp lý</span>
              </h3>
              <ul className="space-y-3">
                {[
                  { name: 'Điều khoản Dịch vụ', href: '/terms' },
                  { name: 'Quyền riêng tư', href: '/privacy' },
                  { name: 'Chính sách Cookie', href: '#' },
                  { name: 'Hỗ trợ', href: '#' },
                ].map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm flex items-center space-x-2 group"
                    >
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Divider with gradient */}
          <div className="relative my-12">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800"></div>
            </div>
            <div className="relative flex justify-center">
              <div className="h-1 w-32 bg-gradient-to-r from-transparent via-primary-500 to-transparent rounded-full"></div>
            </div>
          </div>

          {/* Bottom Bar - More Impressive */}
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-sm text-gray-400"
            >
              © {currentYear} <span className="text-white font-semibold">PinYourWorld</span>. All rights reserved.
            </motion.p>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center space-x-6"
            >
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Server Status: Online</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400">Made with</span>
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                  className="text-red-500"
                >
                  ❤️
                </motion.span>
                <span className="text-xs text-gray-400">in Vietnam</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
}
