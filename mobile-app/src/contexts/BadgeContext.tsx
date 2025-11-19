import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

// Badge/Rank System Configuration
export const BADGE_RANKS = [
  {
    id: 'newbie',
    name: 'Newbie Explorer',
    nameVi: 'Người Mới',
    icon: '🌱',
    minPoints: 0,
    maxPoints: 99,
    color: '#94A3B8', // Gray
    benefits: ['Tạo tối đa 20 ghim', 'Upload 3 ảnh/ghim'],
  },
  {
    id: 'traveler',
    name: 'Traveler',
    nameVi: 'Du Khách',
    icon: '🎒',
    minPoints: 100,
    maxPoints: 499,
    color: '#3B82F6', // Blue
    benefits: ['Tạo tối đa 50 ghim', 'Upload 5 ảnh/ghim', 'Tạo 1 chuyến đi'],
  },
  {
    id: 'explorer',
    name: 'Explorer',
    nameVi: 'Nhà Thám Hiểm',
    icon: '🧭',
    minPoints: 500,
    maxPoints: 1499,
    color: '#8B5CF6', // Purple
    benefits: ['Tạo tối đa 100 ghim', 'Upload 7 ảnh/ghim', 'Tạo 3 chuyến đi', 'Thêm video'],
  },
  {
    id: 'adventurer',
    name: 'Adventurer',
    nameVi: 'Nhà Phiêu Lưu',
    icon: '⛰️',
    minPoints: 1500,
    maxPoints: 3999,
    color: '#F59E0B', // Orange
    benefits: ['Tạo tối đa 300 ghim', 'Upload 10 ảnh/ghim', 'Tạo chuyến đi không giới hạn', 'Priority support'],
  },
  {
    id: 'legend',
    name: 'Legend',
    nameVi: 'Huyền Thoại',
    icon: '👑',
    minPoints: 4000,
    maxPoints: 9999,
    color: '#EF4444', // Red
    benefits: ['Ghim không giới hạn', 'Upload không giới hạn', 'Badge đặc biệt', 'Top ranking'],
  },
  {
    id: 'worldmaster',
    name: 'World Master',
    nameVi: 'Bậc Thầy Thế Giới',
    icon: '🌍',
    minPoints: 10000,
    maxPoints: Infinity,
    color: '#D946EF', // Magenta
    benefits: ['Tất cả quyền hạn', 'Verified badge', 'Influencer status', 'Exclusive features'],
  },
];

// Points configuration for different actions
export const POINTS_CONFIG = {
  // Pin actions
  CREATE_PIN_VISITED: 15,      // Tạo ghim "Đã đến"
  CREATE_PIN_WANT_TO_GO: 5,    // Tạo ghim "Muốn đến"
  ADD_PHOTO: 3,                // Thêm ảnh vào ghim
  ADD_VIDEO: 10,               // Thêm video vào ghim
  WRITE_DETAILED_NOTE: 10,     // Viết ghi chú chi tiết (>100 ký tự)
  RATE_PLACE: 5,               // Đánh giá sao
  
  // Social actions
  FOLLOW_USER: 2,              // Follow người khác
  GET_FOLLOWER: 3,             // Được follow
  LIKE_POST: 1,                // Like bài viết
  GET_LIKE: 2,                 // Được like
  COMMENT: 5,                  // Comment
  GET_COMMENT: 3,              // Được comment
  SHARE_POST: 5,               // Chia sẻ bài viết
  
  // Achievements
  FIRST_PIN: 50,               // Ghim đầu tiên
  VISIT_10_PLACES: 100,        // Ghim 10 địa điểm
  VISIT_50_PLACES: 300,        // Ghim 50 địa điểm
  VISIT_100_PLACES: 500,       // Ghim 100 địa điểm
  VISIT_5_COUNTRIES: 200,      // 5 quốc gia
  VISIT_10_COUNTRIES: 500,     // 10 quốc gia
  VISIT_25_COUNTRIES: 1000,    // 25 quốc gia
  
  // Engagement
  DAILY_LOGIN: 5,              // Đăng nhập hàng ngày
  WEEK_STREAK: 20,             // Streak 7 ngày liên tiếp
  MONTH_STREAK: 100,           // Streak 30 ngày
  COMPLETE_PROFILE: 50,        // Hoàn thiện profile
  
  // Trips
  CREATE_TRIP: 15,             // Tạo chuyến đi
  COMPLETE_TRIP: 50,           // Hoàn thành chuyến đi
  
  // Referral
  INVITE_FRIEND: 30,           // Mời bạn bè
};

// Achievement badges (separate from rank)
export const ACHIEVEMENT_BADGES = [
  {
    id: 'first_pin',
    name: 'Bước Đầu Tiên',
    icon: '🎯',
    description: 'Tạo ghim đầu tiên',
    points: POINTS_CONFIG.FIRST_PIN,
    condition: (stats: any) => stats.totalPins >= 1,
  },
  {
    id: 'explorer_10',
    name: 'Khám Phá 10',
    icon: '🗺️',
    description: 'Ghim 10 địa điểm',
    points: POINTS_CONFIG.VISIT_10_PLACES,
    condition: (stats: any) => stats.totalPins >= 10,
  },
  {
    id: 'explorer_50',
    name: 'Khám Phá 50',
    icon: '🏆',
    description: 'Ghim 50 địa điểm',
    points: POINTS_CONFIG.VISIT_50_PLACES,
    condition: (stats: any) => stats.totalPins >= 50,
  },
  {
    id: 'explorer_100',
    name: 'Bậc Thầy Khám Phá',
    icon: '💎',
    description: 'Ghim 100 địa điểm',
    points: POINTS_CONFIG.VISIT_100_PLACES,
    condition: (stats: any) => stats.totalPins >= 100,
  },
  {
    id: 'countries_5',
    name: 'Công Dân Thế Giới',
    icon: '🌏',
    description: 'Ghim 5 quốc gia',
    points: POINTS_CONFIG.VISIT_5_COUNTRIES,
    condition: (stats: any) => stats.visitedCountries >= 5,
  },
  {
    id: 'countries_10',
    name: 'Vòng Quanh Châu Lục',
    icon: '✈️',
    description: 'Ghim 10 quốc gia',
    points: POINTS_CONFIG.VISIT_10_COUNTRIES,
    condition: (stats: any) => stats.visitedCountries >= 10,
  },
  {
    id: 'countries_25',
    name: 'Vòng Quanh Thế Giới',
    icon: '🌍',
    description: 'Ghim 25 quốc gia',
    points: POINTS_CONFIG.VISIT_25_COUNTRIES,
    condition: (stats: any) => stats.visitedCountries >= 25,
  },
  {
    id: 'social_butterfly',
    name: 'Bướm Xã Hội',
    icon: '🦋',
    description: 'Có 50 followers',
    points: 100,
    condition: (stats: any) => stats.followers >= 50,
  },
  {
    id: 'influencer',
    name: 'Influencer',
    icon: '⭐',
    description: 'Có 500 followers',
    points: 500,
    condition: (stats: any) => stats.followers >= 500,
  },
  {
    id: 'photographer',
    name: 'Nhiếp Ảnh Gia',
    icon: '📸',
    description: 'Upload 100 ảnh',
    points: 200,
    condition: (stats: any) => stats.totalPhotos >= 100,
  },
  {
    id: 'writer',
    name: 'Nhà Văn Du Lịch',
    icon: '✍️',
    description: 'Viết 50 ghi chú chi tiết',
    points: 300,
    condition: (stats: any) => stats.detailedNotes >= 50,
  },
  {
    id: 'week_streak',
    name: 'Kiên Trì',
    icon: '🔥',
    description: 'Đăng nhập 7 ngày liên tiếp',
    points: POINTS_CONFIG.WEEK_STREAK,
    condition: (stats: any) => stats.loginStreak >= 7,
  },
];

interface UserStats {
  totalPoints: number;
  totalPins: number;
  visitedCountries: number;
  visitedCities: number;
  followers: number;
  following: number;
  totalLikes: number;
  totalComments: number;
  totalPhotos: number;
  totalVideos: number;
  detailedNotes: number;
  tripsCreated: number;
  tripsCompleted: number;
  loginStreak: number;
  earnedBadges: string[]; // Array of badge IDs
}

interface BadgeContextType {
  userStats: UserStats;
  currentRank: typeof BADGE_RANKS[0];
  nextRank: typeof BADGE_RANKS[0] | null;
  progressToNextRank: number; // 0-100
  addPoints: (action: keyof typeof POINTS_CONFIG, count?: number) => void;
  updateStats: (updates: Partial<UserStats>) => void;
  checkNewAchievements: () => void;
  getAvailableBadges: () => typeof ACHIEVEMENT_BADGES;
  getEarnedBadges: () => typeof ACHIEVEMENT_BADGES;
}

const BadgeContext = createContext<BadgeContextType | undefined>(undefined);

export const BadgeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Mock user stats - In production, load from API/AsyncStorage
  const [userStats, setUserStats] = useState<UserStats>({
    totalPoints: 250, // Example: Traveler rank
    totalPins: 15,
    visitedCountries: 3,
    visitedCities: 8,
    followers: 12,
    following: 25,
    totalLikes: 45,
    totalComments: 8,
    totalPhotos: 32,
    totalVideos: 2,
    detailedNotes: 5,
    tripsCreated: 1,
    tripsCompleted: 0,
    loginStreak: 3,
    earnedBadges: ['first_pin', 'explorer_10'],
  });

  // Calculate current rank based on points
  const getCurrentRank = (points: number) => {
    return BADGE_RANKS.find(
      rank => points >= rank.minPoints && points <= rank.maxPoints
    ) || BADGE_RANKS[0];
  };

  const currentRank = getCurrentRank(userStats.totalPoints);
  
  const getNextRank = (currentRank: typeof BADGE_RANKS[0]) => {
    const currentIndex = BADGE_RANKS.findIndex(r => r.id === currentRank.id);
    return currentIndex < BADGE_RANKS.length - 1 ? BADGE_RANKS[currentIndex + 1] : null;
  };

  const nextRank = getNextRank(currentRank);

  // Calculate progress to next rank (0-100)
  const calculateProgress = () => {
    if (!nextRank) return 100; // Max rank
    
    const pointsInCurrentRank = userStats.totalPoints - currentRank.minPoints;
    const pointsNeededForNextRank = nextRank.minPoints - currentRank.minPoints;
    
    return Math.min(100, Math.round((pointsInCurrentRank / pointsNeededForNextRank) * 100));
  };

  const progressToNextRank = calculateProgress();

  // Add points for actions
  const addPoints = (action: keyof typeof POINTS_CONFIG, count: number = 1) => {
    const points = POINTS_CONFIG[action] * count;
    
    setUserStats(prev => ({
      ...prev,
      totalPoints: prev.totalPoints + points,
    }));

    // Show notification (TODO: implement toast/notification)
    console.log(`+${points} điểm! (${action})`);
  };

  // Update stats
  const updateStats = (updates: Partial<UserStats>) => {
    setUserStats(prev => ({
      ...prev,
      ...updates,
    }));
  };

  // Check for new achievements
  const checkNewAchievements = useCallback(() => {
    const newBadges: string[] = [];

    ACHIEVEMENT_BADGES.forEach(badge => {
      // Check if badge not earned yet and condition is met
      if (!userStats.earnedBadges.includes(badge.id) && badge.condition(userStats)) {
        newBadges.push(badge.id);

        // Add badge points directly (batch update to avoid re-renders)
        setUserStats(prev => ({
          ...prev,
          totalPoints: prev.totalPoints + badge.points,
          earnedBadges: [...prev.earnedBadges, badge.id],
        }));

        // Show achievement notification
        console.log(`🎉 Thành tựu mới: ${badge.name}! +${badge.points} điểm`);
      }
    });

    return newBadges;
  }, [userStats]);

  // Get all available badges
  const getAvailableBadges = () => {
    return ACHIEVEMENT_BADGES;
  };

  // Get earned badges
  const getEarnedBadges = () => {
    return ACHIEVEMENT_BADGES.filter(badge => 
      userStats.earnedBadges.includes(badge.id)
    );
  };

  // Track previous values to prevent infinite loops
  const prevStatsRef = useRef({
    totalPins: userStats.totalPins,
    visitedCountries: userStats.visitedCountries,
    followers: userStats.followers,
    totalPhotos: userStats.totalPhotos,
  });

  // Auto-check achievements when specific stats change (not points or badges)
  useEffect(() => {
    const prev = prevStatsRef.current;
    const hasChanged =
      prev.totalPins !== userStats.totalPins ||
      prev.visitedCountries !== userStats.visitedCountries ||
      prev.followers !== userStats.followers ||
      prev.totalPhotos !== userStats.totalPhotos;

    if (hasChanged) {
      checkNewAchievements();
      prevStatsRef.current = {
        totalPins: userStats.totalPins,
        visitedCountries: userStats.visitedCountries,
        followers: userStats.followers,
        totalPhotos: userStats.totalPhotos,
      };
    }
  }, [userStats.totalPins, userStats.visitedCountries, userStats.followers, userStats.totalPhotos, checkNewAchievements]);

  const value: BadgeContextType = {
    userStats,
    currentRank,
    nextRank,
    progressToNextRank,
    addPoints,
    updateStats,
    checkNewAchievements,
    getAvailableBadges,
    getEarnedBadges,
  };

  return <BadgeContext.Provider value={value}>{children}</BadgeContext.Provider>;
};

export const useBadge = () => {
  const context = useContext(BadgeContext);
  if (!context) {
    throw new Error('useBadge must be used within a BadgeProvider');
  }
  return context;
};
