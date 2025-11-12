'use client';

import Link from 'next/link';

export default function AppPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Split Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] h-screen">
        {/* Left Panel - Sidebar */}
        <div className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          <div className="p-6">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                PinYourWorld
              </span>
            </Link>

            {/* User Info */}
            <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">U</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Demo User</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">user@example.com</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              <button className="w-full flex items-center space-x-3 px-4 py-3 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg font-medium">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <span>Bản đồ</span>
              </button>
              
              <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Hồ sơ</span>
              </button>
              
              <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span>Bucket List</span>
              </button>
              
              <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Cộng đồng</span>
              </button>
            </nav>

            {/* Stats */}
            <div className="mt-8 p-4 bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Thống kê của bạn</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Quốc gia</span>
                  <span className="font-bold text-primary-600 dark:text-primary-400">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Thành phố</span>
                  <span className="font-bold text-primary-600 dark:text-primary-400">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Địa điểm</span>
                  <span className="font-bold text-primary-600 dark:text-primary-400">0</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Map Area */}
        <div className="relative bg-gray-100 dark:bg-gray-900">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-8">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary-100 to-blue-100 dark:from-primary-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Bản đồ tương tác
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                Đây là nơi hiển thị bản đồ tương tác. Tích hợp Google Maps hoặc Mapbox sẽ được thực hiện ở giai đoạn tiếp theo.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <button className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-all shadow-lg">
                  Thêm ghim mới
                </button>
                <button className="px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition-all shadow-lg border border-gray-200 dark:border-gray-600">
                  Xem danh sách
                </button>
              </div>
            </div>
          </div>

          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Tìm kiếm địa điểm..."
                  className="w-full max-w-md px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
