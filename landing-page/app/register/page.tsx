'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement registration logic
    console.log('Register:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center space-x-2 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-2xl">P</span>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            PinYourWorld
          </span>
        </Link>

        {/* Register Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">
            Đăng ký
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
            Tạo tài khoản miễn phí ngay!
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Họ và tên
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                placeholder="Nguyễn Văn A"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                placeholder="your@email.com"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mật khẩu
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                placeholder="••••••••"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Xác nhận mật khẩu
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                placeholder="••••••••"
              />
            </div>

            {/* Terms */}
            <div className="flex items-start">
              <input
                id="terms"
                type="checkbox"
                required
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 mt-1"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Tôi đồng ý với{' '}
                <Link href="/terms" className="text-primary-600 hover:text-primary-700">
                  Điều khoản Dịch vụ
                </Link>
                {' '}và{' '}
                <Link href="/privacy" className="text-primary-600 hover:text-primary-700">
                  Chính sách Bảo mật
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Tạo tài khoản
            </button>

            {/* Social Register */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-gray-800 text-gray-500">Hoặc</span>
              </div>
            </div>

            {/* Google Register */}
            <button
              type="button"
              className="w-full px-6 py-3 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 rounded-lg font-medium transition-all flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-gray-700 dark:text-gray-300">Đăng ký với Google</span>
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            Đã có tài khoản?{' '}
            <Link href="/login" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-semibold">
              Đăng nhập ngay
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <Link
          href="/"
          className="flex items-center justify-center space-x-2 mt-6 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Về trang chủ</span>
        </Link>
      </motion.div>
    </div>
  );
}
