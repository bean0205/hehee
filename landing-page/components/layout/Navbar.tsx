'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
       ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl border-b border-gray-200/50 dark:border-gray-700/50'
          : 'bg-white/50 dark:bg-gray-900/50 backdrop-blur-md'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-20 sm:h-24">
          {/* Logo - More Impressive */}
          <Link href="/" className="flex items-center space-x-3 group">
            <motion.div 
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="relative w-12 h-12 sm:w-14 sm:h-14"
            >
              {/* Gradient background with glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-400 via-primary-600 to-blue-700 rounded-2xl shadow-lg group-hover:shadow-2xl group-hover:shadow-primary-500/50 transition-all duration-300" />
              {/* Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </motion.div>
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-primary-600 via-blue-600 to-primary-800 bg-clip-text text-transparent leading-none">
                PinYourWorld
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide">
                Your Travel Diary
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Modern Style */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={() => scrollToSection('features')}
              className="relative px-4 lg:px-5 py-2.5 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all font-semibold text-sm lg:text-base group overflow-hidden rounded-lg"
            >
              <span className="relative z-10">Tính năng</span>
              <span className="absolute inset-0 bg-primary-50 dark:bg-primary-900/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-lg" />
            </button>
            <button
              onClick={() => scrollToSection('social')}
              className="relative px-4 lg:px-5 py-2.5 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all font-semibold text-sm lg:text-base group overflow-hidden rounded-lg"
            >
              <span className="relative z-10">Cộng đồng</span>
              <span className="absolute inset-0 bg-primary-50 dark:bg-primary-900/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-lg" />
            </button>
            <button
              onClick={() => scrollToSection('pro')}
              className="relative px-4 lg:px-5 py-2.5 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all font-semibold text-sm lg:text-base group overflow-hidden rounded-lg"
            >
              <span className="relative z-10 flex items-center space-x-1">
                <span>Gói Pro</span>
                <span className="text-xs px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-white rounded-full font-bold">
                  HOT
                </span>
              </span>
              <span className="absolute inset-0 bg-primary-50 dark:bg-primary-900/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-lg" />
            </button>
          </div>

          {/* CTA Buttons - More Impressive */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            <Link
              href="/login"
              className="px-5 lg:px-6 py-2.5 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-semibold transition-all rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Đăng nhập
            </Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/register"
                className="relative px-6 lg:px-8 py-3 bg-gradient-to-r from-primary-600 via-primary-700 to-blue-600 hover:from-primary-700 hover:via-primary-800 hover:to-blue-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-2xl hover:shadow-primary-500/50 overflow-hidden group"
              >
                <span className="relative z-10">Đăng ký miễn phí</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <motion.span
                animate={isMobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                className="w-full h-0.5 bg-gray-700 dark:bg-gray-300 rounded-full transition-all"
              />
              <motion.span
                animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                className="w-full h-0.5 bg-gray-700 dark:bg-gray-300 rounded-full transition-all"
              />
              <motion.span
                animate={isMobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                className="w-full h-0.5 bg-gray-700 dark:bg-gray-300 rounded-full transition-all"
              />
            </div>
          </motion.button>
        </div>

        {/* Mobile Menu - Improved Animation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-6 px-2 space-y-2 border-t border-gray-200 dark:border-gray-700">
                <motion.button
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  onClick={() => scrollToSection('features')}
                  className="w-full text-left px-5 py-3.5 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 rounded-xl font-semibold transition-all"
                >
                  🎯 Tính năng
                </motion.button>
                <motion.button
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  onClick={() => scrollToSection('social')}
                  className="w-full text-left px-5 py-3.5 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 rounded-xl font-semibold transition-all"
                >
                  👥 Cộng đồng
                </motion.button>
                <motion.button
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  onClick={() => scrollToSection('pro')}
                  className="w-full text-left px-5 py-3.5 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 rounded-xl font-semibold transition-all flex items-center justify-between"
                >
                  <span>👑 Gói Pro</span>
                  <span className="text-xs px-2 py-1 bg-gradient-to-r from-yellow-400 to-amber-500 text-white rounded-full font-bold">
                    HOT
                  </span>
                </motion.button>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 space-y-2">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.25 }}
                  >
                    <Link
                      href="/login"
                      className="block w-full px-5 py-3.5 text-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl font-semibold transition-all"
                    >
                      Đăng nhập
                    </Link>
                  </motion.div>
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Link
                      href="/register"
                      className="block w-full px-5 py-3.5 bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white font-bold rounded-xl text-center shadow-lg transition-all"
                    >
                      Đăng ký miễn phí
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
