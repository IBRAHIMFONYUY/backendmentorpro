"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Flame, Target, Zap, Medal, Crown, Rocket, Heart, Brain, Code, GitBranch, Terminal, CheckCircle, Award, TrendingUp, Calendar, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'coding' | 'learning' | 'social' | 'milestone';
  points: number;
  requirement: number;
  progress: number;
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
}

export interface UserStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalXp: number;
  streak: number;
  longestStreak: number;
  lastActiveDate: string;
  challengesSolved: number;
  linesOfCode: number;
  timeSpent: number; // in minutes
  achievementsUnlocked: number;
  rank: string;
  weeklyXp: number;
  monthlyXp: number;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_code',
    name: 'First Steps',
    description: 'Write your first line of code',
    icon: <Code className="w-5 h-5" />,
    category: 'coding',
    points: 50,
    requirement: 1,
    progress: 0,
    unlocked: false,
    rarity: 'common'
  },
  {
    id: 'streak_3',
    name: 'Getting Started',
    description: 'Maintain a 3-day streak',
    icon: <Flame className="w-5 h-5" />,
    category: 'learning',
    points: 100,
    requirement: 3,
    progress: 0,
    unlocked: false,
    rarity: 'common'
  },
  {
    id: 'streak_7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: <Flame className="w-5 h-5" />,
    category: 'learning',
    points: 250,
    requirement: 7,
    progress: 0,
    unlocked: false,
    rarity: 'rare'
  },
  {
    id: 'streak_30',
    name: 'Consistency Master',
    description: 'Maintain a 30-day streak',
    icon: <Crown className="w-5 h-5" />,
    category: 'learning',
    points: 1000,
    requirement: 30,
    progress: 0,
    unlocked: false,
    rarity: 'legendary'
  },
  {
    id: 'challenges_10',
    name: 'Problem Solver',
    description: 'Complete 10 challenges',
    icon: <Target className="w-5 h-5" />,
    category: 'coding',
    points: 300,
    requirement: 10,
    progress: 0,
    unlocked: false,
    rarity: 'common'
  },
  {
    id: 'challenges_50',
    name: 'Code Ninja',
    description: 'Complete 50 challenges',
    icon: <Zap className="w-5 h-5" />,
    category: 'coding',
    points: 1500,
    requirement: 50,
    progress: 0,
    unlocked: false,
    rarity: 'epic'
  },
  {
    id: 'challenges_100',
    name: 'Grandmaster',
    description: 'Complete 100 challenges',
    icon: <Medal className="w-5 h-5" />,
    category: 'milestone',
    points: 5000,
    requirement: 100,
    progress: 0,
    unlocked: false,
    rarity: 'legendary'
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Complete a challenge in under 5 minutes',
    icon: <Rocket className="w-5 h-5" />,
    category: 'coding',
    points: 200,
    requirement: 1,
    progress: 0,
    unlocked: false,
    rarity: 'rare'
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Get 100% test coverage 5 times',
    icon: <Star className="w-5 h-5" />,
    category: 'coding',
    points: 500,
    requirement: 5,
    progress: 0,
    unlocked: false,
    rarity: 'epic'
  },
  {
    id: 'terminal_master',
    name: 'Terminal Master',
    description: 'Use 25 different terminal commands',
    icon: <Terminal className="w-5 h-5" />,
    category: 'learning',
    points: 350,
    requirement: 25,
    progress: 0,
    unlocked: false,
    rarity: 'rare'
  },
  {
    id: 'ai_collaborator',
    name: 'AI Collaborator',
    description: 'Have 10 conversations with Rahim',
    icon: <Brain className="w-5 h-5" />,
    category: 'learning',
    points: 400,
    requirement: 10,
    progress: 0,
    unlocked: false,
    rarity: 'rare'
  },
  {
    id: 'marathon_coder',
    name: 'Marathon Coder',
    description: 'Code for 4 hours in a single day',
    icon: <Clock className="w-5 h-5" />,
    category: 'milestone',
    points: 800,
    requirement: 240, // 4 hours in minutes
    progress: 0,
    unlocked: false,
    rarity: 'epic'
  }
];

const LEVEL_REQUIREMENTS = [
  0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, // Levels 1-10
  5500, 6600, 7800, 9100, 10500, 12000, 13600, 15300, 17100, 19000, // Levels 11-20
  21000, 23100, 25300, 27600, 30000, 32500, 35100, 37800, 40600, 43500 // Levels 21-30
];

const RANKS = ['Beginner', 'Novice', 'Apprentice', 'Intermediate', 'Advanced', 'Expert', 'Master', 'Grandmaster'];

export function useGamification() {
  const [stats, setStats] = useState<UserStats>({
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    totalXp: 0,
    streak: 0,
    longestStreak: 0,
    lastActiveDate: '',
    challengesSolved: 0,
    linesOfCode: 0,
    timeSpent: 0,
    achievementsUnlocked: 0,
    rank: 'Beginner',
    weeklyXp: 0,
    monthlyXp: 0
  });

  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);
  const { toast } = useToast();

  const loadStats = () => {
    try {
      const savedStats = localStorage.getItem('userStats');
      const savedAchievements = localStorage.getItem('userAchievements');
      
      if (savedStats) {
        const parsed = JSON.parse(savedStats);
        setStats(parsed);
      }
      
      if (savedAchievements) {
        const parsed = JSON.parse(savedAchievements);
        setAchievements(parsed);
      }
    } catch (error) {
      console.error('Error loading gamification stats:', error);
    }
  };

  const saveStats = (newStats: UserStats, newAchievements?: Achievement[]) => {
    try {
      localStorage.setItem('userStats', JSON.stringify(newStats));
      if (newAchievements) {
        localStorage.setItem('userAchievements', JSON.stringify(newAchievements));
      }
    } catch (error) {
      console.error('Error saving gamification stats:', error);
    }
  };

  const calculateLevel = (totalXp: number): [number, number] => {
    let level = 1;
    let remainingXp = totalXp;
    
    for (let i = 1; i < LEVEL_REQUIREMENTS.length; i++) {
      const requiredForLevel = LEVEL_REQUIREMENTS[i] - LEVEL_REQUIREMENTS[i - 1];
      if (remainingXp >= requiredForLevel) {
        remainingXp -= requiredForLevel;
        level = i + 1;
      } else {
        break;
      }
    }
    
    const nextLevelRequirement = level < LEVEL_REQUIREMENTS.length ? 
      LEVEL_REQUIREMENTS[level] - LEVEL_REQUIREMENTS[level - 1] : 1000;
    
    return [level, nextLevelRequirement - remainingXp];
  };

  const getRank = (level: number): string => {
    const rankIndex = Math.min(Math.floor((level - 1) / 4), RANKS.length - 1);
    return RANKS[rankIndex];
  };

  const updateStreak = () => {
    const today = new Date().toDateString();
    const lastActive = new Date(stats.lastActiveDate || today);
    const daysDiff = Math.floor((new Date().getTime() - lastActive.getTime()) / (1000 * 3600 * 24));
    
    let newStreak = stats.streak;
    if (daysDiff === 1) {
      newStreak = stats.streak + 1;
    } else if (daysDiff > 1) {
      newStreak = 1;
    }
    
    return {
      streak: newStreak,
      longestStreak: Math.max(stats.longestStreak, newStreak),
      lastActiveDate: today
    };
  };

  const checkAchievements = (newStats: UserStats, action: string, value?: number) => {
    const updatedAchievements = [...achievements];
    const newlyUnlocked: Achievement[] = [];

    updatedAchievements.forEach(achievement => {
      if (!achievement.unlocked) {
        let shouldUnlock = false;
        let newProgress = achievement.progress;

        switch (achievement.id) {
          case 'first_code':
            if (action === 'code_written' && newStats.linesOfCode >= 1) {
              newProgress = newStats.linesOfCode;
              shouldUnlock = true;
            }
            break;
          case 'streak_3':
            newProgress = newStats.streak;
            shouldUnlock = newStats.streak >= 3;
            break;
          case 'streak_7':
            newProgress = newStats.streak;
            shouldUnlock = newStats.streak >= 7;
            break;
          case 'streak_30':
            newProgress = newStats.streak;
            shouldUnlock = newStats.streak >= 30;
            break;
          case 'challenges_10':
            newProgress = newStats.challengesSolved;
            shouldUnlock = newStats.challengesSolved >= 10;
            break;
          case 'challenges_50':
            newProgress = newStats.challengesSolved;
            shouldUnlock = newStats.challengesSolved >= 50;
            break;
          case 'challenges_100':
            newProgress = newStats.challengesSolved;
            shouldUnlock = newStats.challengesSolved >= 100;
            break;
          case 'speed_demon':
            if (action === 'challenge_completed' && value && value < 5) {
              newProgress = 1;
              shouldUnlock = true;
            }
            break;
          case 'perfectionist':
            if (action === 'perfect_test_coverage') {
              newProgress = Math.min(achievement.progress + 1, achievement.requirement);
              shouldUnlock = newProgress >= achievement.requirement;
            }
            break;
          case 'terminal_master':
            if (action === 'terminal_command_used') {
              newProgress = Math.min(achievement.progress + 1, achievement.requirement);
              shouldUnlock = newProgress >= achievement.requirement;
            }
            break;
          case 'ai_collaborator':
            if (action === 'ai_conversation') {
              newProgress = Math.min(achievement.progress + 1, achievement.requirement);
              shouldUnlock = newProgress >= achievement.requirement;
            }
            break;
          case 'marathon_coder':
            if (action === 'daily_time_check' && value && value >= 240) {
              newProgress = value;
              shouldUnlock = true;
            }
            break;
        }

        achievement.progress = newProgress;

        if (shouldUnlock) {
          achievement.unlocked = true;
          achievement.unlockedAt = new Date();
          newlyUnlocked.push(achievement);
        }
      }
    });

    if (newlyUnlocked.length > 0) {
      setAchievements(updatedAchievements);
      return newlyUnlocked;
    }

    setAchievements(updatedAchievements);
    return [];
  };

  const addXP = (amount: number, reason: string, action?: string, actionValue?: number) => {
    const streakData = updateStreak();
    const newTotalXp = stats.totalXp + amount;
    const [newLevel, xpToNext] = calculateLevel(newTotalXp);
    const newRank = getRank(newLevel);
    
    const today = new Date();
    const isToday = stats.lastActiveDate === today.toDateString();
    
    const newStats: UserStats = {
      ...stats,
      ...streakData,
      xp: stats.xp + amount,
      totalXp: newTotalXp,
      level: newLevel,
      xpToNextLevel: xpToNext,
      rank: newRank,
      weeklyXp: isToday ? stats.weeklyXp + amount : amount,
      monthlyXp: isToday ? stats.monthlyXp + amount : amount,
    };

    if (action === 'challenge_completed') {
      newStats.challengesSolved = stats.challengesSolved + 1;
    }

    const leveledUp = newLevel > stats.level;
    const newAchievements = checkAchievements(newStats, action || '', actionValue);
    
    setStats(newStats);
    saveStats(newStats, achievements);

    // Show XP gain notification
    toast({
      title: `+${amount} XP`,
      description: reason,
      duration: 3000,
    });

    // Show level up notification
    if (leveledUp) {
      toast({
        title: `🎉 Level Up!`,
        description: `You reached level ${newLevel}! (${newRank})`,
        duration: 5000,
      });
    }

    // Show achievement notifications
    newAchievements.forEach(achievement => {
      toast({
        title: `🏆 Achievement Unlocked!`,
        description: `${achievement.name}: ${achievement.description}`,
        duration: 5000,
      });
    });

    return { leveledUp, newAchievements, stats: newStats };
  };

  const trackAction = (action: string, value?: number) => {
    checkAchievements(stats, action, value);
    saveStats(stats, achievements);
  };

  useEffect(() => {
    loadStats();
  }, []);

  return {
    stats,
    achievements,
    addXP,
    trackAction,
    loadStats
  };
}

interface XPFloatingNotificationProps {
  amount: number;
  reason: string;
  onComplete: () => void;
}

export function XPFloatingNotification({ amount, reason, onComplete }: XPFloatingNotificationProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onComplete, 300);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 0, scale: 0.5 }}
          animate={{ opacity: 1, y: -100, scale: 1 }}
          exit={{ opacity: 0, y: -150, scale: 0.5 }}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
        >
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-lg shadow-lg font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            +{amount} XP
            <span className="text-sm font-normal">- {reason}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface AchievementPopupProps {
  achievement: Achievement;
  onClose: () => void;
}

export function AchievementPopup({ achievement, onClose }: AchievementPopupProps) {
  const [show, setShow] = useState(true);

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'from-gray-500 to-gray-600';
      case 'rare': return 'from-blue-500 to-blue-600';
      case 'epic': return 'from-purple-500 to-purple-600';
      case 'legendary': return 'from-yellow-400 to-orange-500';
    }
  };

  const getRarityGlow = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'shadow-gray-500/50';
      case 'rare': return 'shadow-blue-500/50';
      case 'epic': return 'shadow-purple-500/50';
      case 'legendary': return 'shadow-yellow-400/50';
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onClose, 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: -100 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <Card className={`w-80 bg-gradient-to-br ${getRarityColor(achievement.rarity)} text-white shadow-xl ${getRarityGlow(achievement.rarity)} shadow-2xl border-0`}>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  {achievement.icon}
                </div>
                <div>
                  <CardTitle className="text-lg">Achievement Unlocked!</CardTitle>
                  <Badge variant="outline" className="text-xs mt-1 border-white/30 text-white/90">
                    {achievement.rarity.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="font-bold text-xl mb-1">{achievement.name}</h3>
              <p className="text-white/90 text-sm mb-3">{achievement.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-yellow-200 font-bold">+{achievement.points} XP</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShow(false)}
                  className="text-white hover:bg-white/20"
                >
                  Dismiss
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface StatsDisplayProps {
  stats: UserStats;
  compact?: boolean;
}

export function StatsDisplay({ stats, compact = false }: StatsDisplayProps) {
  const progressPercentage = ((stats.xpToNextLevel - stats.xp) / stats.xpToNextLevel) * 100;

  if (compact) {
    return (
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Crown className="w-4 h-4 text-yellow-400" />
          <span>Level {stats.level}</span>
        </div>
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-blue-400" />
          <span>{stats.xp} XP</span>
        </div>
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-400" />
          <span>{stats.streak} day streak</span>
        </div>
      </div>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 border-blue-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-yellow-400" />
          Level {stats.level} {stats.rank}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Experience</span>
            <span>{stats.totalXp - stats.xp} / {stats.totalXp} XP</span>
          </div>
          <Progress value={100 - progressPercentage} className="h-2" />
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400" />
            <div>
              <div className="font-semibold">{stats.streak} days</div>
              <div className="text-gray-400">Current Streak</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-green-400" />
            <div>
              <div className="font-semibold">{stats.challengesSolved}</div>
              <div className="text-gray-400">Challenges</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <div>
              <div className="font-semibold">{stats.achievementsUnlocked}</div>
              <div className="text-gray-400">Achievements</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <div>
              <div className="font-semibold">{Math.floor(stats.timeSpent / 60)}h</div>
              <div className="text-gray-400">Time Coding</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface AchievementsGridProps {
  achievements: Achievement[];
  showLocked?: boolean;
}

export function AchievementsGrid({ achievements, showLocked = true }: AchievementsGridProps) {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'border-gray-500/50 bg-gray-500/10';
      case 'rare': return 'border-blue-500/50 bg-blue-500/10';
      case 'epic': return 'border-purple-500/50 bg-purple-500/10';
      case 'legendary': return 'border-yellow-400/50 bg-yellow-400/10';
    }
  };

  const filteredAchievements = showLocked ? achievements : achievements.filter(a => a.unlocked);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredAchievements.map(achievement => (
          <Card 
            key={achievement.id}
            className={cn(
              "cursor-pointer transition-all hover:scale-105",
              getRarityColor(achievement.rarity),
              !achievement.unlocked && "opacity-50 grayscale"
            )}
            onClick={() => setSelectedAchievement(achievement)}
          >
            <CardContent className="p-4 text-center">
              <div className={cn(
                "w-12 h-12 mx-auto mb-2 rounded-lg flex items-center justify-center",
                achievement.unlocked ? "bg-white/20" : "bg-gray-500/20"
              )}>
                {achievement.icon}
              </div>
              <h3 className="font-semibold text-sm mb-1">{achievement.name}</h3>
              <Badge variant="outline" className="text-xs">
                {achievement.rarity.toUpperCase()}
              </Badge>
              {achievement.unlocked && (
                <div className="mt-2 text-xs text-green-400 flex items-center justify-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Unlocked
                </div>
              )}
              {!achievement.unlocked && achievement.progress > 0 && (
                <div className="mt-2">
                  <Progress 
                    value={(achievement.progress / achievement.requirement) * 100} 
                    className="h-1"
                  />
                  <div className="text-xs text-gray-400 mt-1">
                    {achievement.progress}/{achievement.requirement}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedAchievement} onOpenChange={() => setSelectedAchievement(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                {selectedAchievement?.icon}
              </div>
              <div>
                <div>{selectedAchievement?.name}</div>
                <Badge variant="outline" className="text-xs mt-1">
                  {selectedAchievement?.rarity.toUpperCase()}
                </Badge>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-300">{selectedAchievement?.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-yellow-400 font-bold">+{selectedAchievement?.points} XP</span>
              <span className="text-sm text-gray-400">
                Category: {selectedAchievement?.category}
              </span>
            </div>
            {selectedAchievement?.unlocked && selectedAchievement.unlockedAt && (
              <div className="text-sm text-green-400">
                Unlocked on {selectedAchievement.unlockedAt.toLocaleDateString()}
              </div>
            )}
            {selectedAchievement && !selectedAchievement.unlocked && (
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>{selectedAchievement.progress}/{selectedAchievement.requirement}</span>
                </div>
                <Progress value={(selectedAchievement.progress / selectedAchievement.requirement) * 100} />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
