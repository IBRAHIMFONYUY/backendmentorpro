"use client";

import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  AlertCircle, 
  Info, 
  XCircle, 
  X, 
  Trophy, 
  Zap, 
  Code, 
  GitBranch,
  Clock,
  Target,
  Star,
  Flame,
  Brain,
  Save,
  Play,
  TestTube,
  FileText,
  Terminal,
  Sparkles,
  Crown,
  Medal,
  Rocket
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type NotificationType = 
  | 'success' 
  | 'error' 
  | 'warning' 
  | 'info' 
  | 'achievement' 
  | 'xp_gain' 
  | 'level_up'
  | 'streak'
  | 'code_saved'
  | 'test_passed'
  | 'test_failed'
  | 'challenge_completed'
  | 'ai_response'
  | 'file_created'
  | 'command_executed';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  actions?: NotificationAction[];
  data?: any;
  persistent?: boolean;
  sound?: boolean;
}

export interface NotificationAction {
  label: string;
  action: () => void;
  variant?: 'default' | 'primary' | 'secondary';
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  playSound: (type: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

const NOTIFICATION_SOUNDS = {
  success: '/sounds/success.mp3',
  error: '/sounds/error.mp3',
  warning: '/sounds/warning.mp3',
  info: '/sounds/info.mp3',
  achievement: '/sounds/achievement.mp3',
  xp_gain: '/sounds/xp.mp3',
  level_up: '/sounds/levelup.mp3',
  streak: '/sounds/streak.mp3',
  code_saved: '/sounds/save.mp3',
  test_passed: '/sounds/test-pass.mp3',
  test_failed: '/sounds/test-fail.mp3',
  challenge_completed: '/sounds/complete.mp3',
  ai_response: '/sounds/ai.mp3',
  file_created: '/sounds/create.mp3',
  command_executed: '/sounds/command.mp3'
};

const NOTIFICATION_ICONS = {
  success: <CheckCircle className="w-5 h-5" />,
  error: <XCircle className="w-5 h-5" />,
  warning: <AlertCircle className="w-5 h-5" />,
  info: <Info className="w-5 h-5" />,
  achievement: <Trophy className="w-5 h-5" />,
  xp_gain: <Zap className="w-5 h-5" />,
  level_up: <Crown className="w-5 h-5" />,
  streak: <Flame className="w-5 h-5" />,
  code_saved: <Save className="w-5 h-5" />,
  test_passed: <CheckCircle className="w-5 h-5" />,
  test_failed: <XCircle className="w-5 h-5" />,
  challenge_completed: <Medal className="w-5 h-5" />,
  ai_response: <Brain className="w-5 h-5" />,
  file_created: <FileText className="w-5 h-5" />,
  command_executed: <Terminal className="w-5 h-5" />
};

const NOTIFICATION_COLORS = {
  success: 'bg-green-500/20 border-green-500/50 text-green-200',
  error: 'bg-red-500/20 border-red-500/50 text-red-200',
  warning: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-200',
  info: 'bg-blue-500/20 border-blue-500/50 text-blue-200',
  achievement: 'bg-purple-500/20 border-purple-500/50 text-purple-200',
  xp_gain: 'bg-orange-500/20 border-orange-500/50 text-orange-200',
  level_up: 'bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border-yellow-400/50 text-yellow-200',
  streak: 'bg-orange-600/20 border-orange-600/50 text-orange-200',
  code_saved: 'bg-gray-500/20 border-gray-500/50 text-gray-200',
  test_passed: 'bg-green-500/20 border-green-500/50 text-green-200',
  test_failed: 'bg-red-500/20 border-red-500/50 text-red-200',
  challenge_completed: 'bg-gradient-to-r from-green-400/20 to-blue-500/20 border-green-400/50 text-green-200',
  ai_response: 'bg-purple-600/20 border-purple-600/50 text-purple-200',
  file_created: 'bg-blue-600/20 border-blue-600/50 text-blue-200',
  command_executed: 'bg-gray-600/20 border-gray-600/50 text-gray-200'
};

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const playSound = (type: NotificationType) => {
    try {
      const audio = new Audio(NOTIFICATION_SOUNDS[type]);
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Silent fail if audio doesn't work
      });
    } catch {
      // Silent fail if audio doesn't work
    }
  };

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration ?? (notification.persistent ? undefined : getDefaultDuration(notification.type))
    };

    setNotifications(prev => [...prev, newNotification]);

    // Play sound if enabled
    if (notification.sound !== false) {
      playSound(notification.type);
    }

    // Auto-remove after duration
    if (newNotification.duration) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getDefaultDuration = (type: NotificationType): number => {
    switch (type) {
      case 'achievement':
      case 'level_up':
      case 'challenge_completed':
        return 8000;
      case 'xp_gain':
      case 'streak':
        return 4000;
      case 'success':
      case 'test_passed':
      case 'code_saved':
      case 'file_created':
        return 3000;
      case 'info':
      case 'ai_response':
      case 'command_executed':
        return 5000;
      case 'warning':
        return 6000;
      case 'error':
      case 'test_failed':
        return 7000;
      default:
        return 5000;
    }
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      removeNotification,
      clearAll,
      playSound
    }}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
}

function NotificationContainer() {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      <AnimatePresence>
        {notifications.map(notification => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            onRemove={() => removeNotification(notification.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

interface NotificationCardProps {
  notification: Notification;
  onRemove: () => void;
}

function NotificationCard({ notification, onRemove }: NotificationCardProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!notification.duration || notification.persistent) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev - (100 / (notification.duration! / 100));
        return Math.max(0, newProgress);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [notification.duration, notification.persistent]);

  const getIcon = () => {
    if (notification.type === 'achievement' && notification.data?.rarity) {
      const rarity = notification.data.rarity;
      switch (rarity) {
        case 'legendary': return <Crown className="w-5 h-5" />;
        case 'epic': return <Star className="w-5 h-5" />;
        case 'rare': return <Sparkles className="w-5 h-5" />;
        default: return <Trophy className="w-5 h-5" />;
      }
    }
    return NOTIFICATION_ICONS[notification.type];
  };

  const getAnimation = () => {
    switch (notification.type) {
      case 'achievement':
      case 'level_up':
        return {
          initial: { opacity: 0, scale: 0.5, rotate: -10 },
          animate: { opacity: 1, scale: 1, rotate: 0 },
          exit: { opacity: 0, scale: 0.8, x: 300 }
        };
      case 'xp_gain':
        return {
          initial: { opacity: 0, y: -50, scale: 0.8 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: -20, scale: 0.9 }
        };
      case 'error':
        return {
          initial: { opacity: 0, x: 50 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: 300 },
        };
      default:
        return {
          initial: { opacity: 0, x: 300 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: 300 }
        };
    }
  };

  return (
    <motion.div
      {...getAnimation()}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      className={cn(
        "relative rounded-lg border p-4 shadow-lg backdrop-blur-sm",
        NOTIFICATION_COLORS[notification.type],
        notification.type === 'level_up' && "shadow-yellow-400/20 shadow-xl",
        notification.type === 'achievement' && notification.data?.rarity === 'legendary' && "shadow-yellow-400/30 shadow-2xl"
      )}
    >
      {/* Progress bar for timed notifications */}
      {notification.duration && !notification.persistent && (
        <div className="absolute bottom-0 left-0 h-1 bg-current opacity-30 rounded-b-lg transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      )}

      <div className="flex items-start space-x-3">
        <div className={cn(
          "flex-shrink-0 p-1 rounded-full",
          notification.type === 'level_up' && "animate-pulse",
          notification.type === 'achievement' && "animate-bounce"
        )}>
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold truncate">{notification.title}</h4>
            <button
              onClick={onRemove}
              className="flex-shrink-0 ml-2 text-current/60 hover:text-current transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm opacity-90 mt-1">{notification.message}</p>
          
          {/* Special content for different notification types */}
          {notification.type === 'xp_gain' && notification.data && (
            <div className="mt-2 flex items-center gap-2 text-xs">
              <Zap className="w-3 h-3" />
              <span>+{notification.data.amount} XP</span>
              {notification.data.total && <span>• Total: {notification.data.total}</span>}
            </div>
          )}

          {notification.type === 'test_passed' && notification.data && (
            <div className="mt-2 text-xs opacity-75">
              {notification.data.passed}/{notification.data.total} tests passed
            </div>
          )}

          {notification.type === 'test_failed' && notification.data && (
            <div className="mt-2 text-xs opacity-75">
              {notification.data.failed} test(s) failed
            </div>
          )}

          {notification.actions && (
            <div className="flex gap-2 mt-3">
              {notification.actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className={cn(
                    "px-2 py-1 text-xs rounded font-medium transition-colors",
                    action.variant === 'primary' && "bg-blue-500 hover:bg-blue-600 text-white",
                    action.variant === 'secondary' && "bg-gray-500 hover:bg-gray-600 text-white",
                    !action.variant && "bg-current/20 hover:bg-current/30"
                  )}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Preset notification functions for common use cases
export const createNotifications = (addNotification: NotificationContextType['addNotification']) => ({
  success: (title: string, message: string, options?: Partial<Notification>) =>
    addNotification({ type: 'success', title, message, ...options }),

  error: (title: string, message: string, options?: Partial<Notification>) =>
    addNotification({ type: 'error', title, message, ...options }),

  warning: (title: string, message: string, options?: Partial<Notification>) =>
    addNotification({ type: 'warning', title, message, ...options }),

  info: (title: string, message: string, options?: Partial<Notification>) =>
    addNotification({ type: 'info', title, message, ...options }),

  xpGain: (amount: number, reason: string, totalXp?: number) =>
    addNotification({
      type: 'xp_gain',
      title: `+${amount} XP`,
      message: reason,
      data: { amount, total: totalXp }
    }),

  levelUp: (level: number, rank: string) =>
    addNotification({
      type: 'level_up',
      title: '🎉 Level Up!',
      message: `You reached level ${level}! (${rank})`,
      duration: 8000
    }),

  achievement: (name: string, description: string, rarity: string, points: number) =>
    addNotification({
      type: 'achievement',
      title: '🏆 Achievement Unlocked!',
      message: `${name}: ${description}`,
      data: { rarity, points },
      duration: 10000
    }),

  streak: (days: number, isRecord?: boolean) =>
    addNotification({
      type: 'streak',
      title: '🔥 Streak Updated!',
      message: `${days} day streak${isRecord ? ' - New record!' : ''}`,
      data: { days, isRecord }
    }),

  codeSaved: (filename: string) =>
    addNotification({
      type: 'code_saved',
      title: 'File Saved',
      message: `${filename} has been saved`,
      duration: 2000
    }),

  testsPassed: (passed: number, total: number) =>
    addNotification({
      type: 'test_passed',
      title: 'Tests Passed!',
      message: `${passed} out of ${total} tests passed`,
      data: { passed, total }
    }),

  testsFailed: (failed: number, total: number) =>
    addNotification({
      type: 'test_failed',
      title: 'Tests Failed',
      message: `${failed} out of ${total} tests failed`,
      data: { failed, total }
    }),

  challengeCompleted: (name: string, score?: number, time?: number) =>
    addNotification({
      type: 'challenge_completed',
      title: 'Challenge Complete! 🎉',
      message: `You completed "${name}"${score ? ` with a score of ${score}%` : ''}`,
      data: { name, score, time },
      duration: 8000
    }),

  aiResponse: (message: string) =>
    addNotification({
      type: 'ai_response',
      title: 'Rahim AI Assistant',
      message,
      duration: 6000
    }),

  fileCreated: (filename: string) =>
    addNotification({
      type: 'file_created',
      title: 'File Created',
      message: `${filename} has been created`,
      duration: 3000
    }),

  commandExecuted: (command: string, success: boolean = true) =>
    addNotification({
      type: 'command_executed',
      title: success ? 'Command Executed' : 'Command Failed',
      message: `${command}`,
      duration: 2000
    })
});

// Global notification hook that can be used anywhere
let globalNotificationAdd: NotificationContextType['addNotification'] | null = null;

export function setGlobalNotificationAdd(addFn: NotificationContextType['addNotification']) {
  globalNotificationAdd = addFn;
}

export const globalNotify = {
  success: (title: string, message: string) => 
    globalNotificationAdd?.({ type: 'success', title, message }),
  error: (title: string, message: string) => 
    globalNotificationAdd?.({ type: 'error', title, message }),
  info: (title: string, message: string) => 
    globalNotificationAdd?.({ type: 'info', title, message }),
  warning: (title: string, message: string) => 
    globalNotificationAdd?.({ type: 'warning', title, message }),
};

// Hook for easy access to preset notifications
export function useNotificationPresets() {
  const { addNotification } = useNotifications();
  return createNotifications(addNotification);
}
