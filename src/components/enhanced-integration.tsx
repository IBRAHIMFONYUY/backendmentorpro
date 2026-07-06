"use client";

import React, { useEffect } from 'react';
import { useGamification } from './gamification';
import { useNotificationPresets, NotificationProvider } from './notifications';
import { useAdvancedSettings } from './advanced-settings';
import { useAIContext } from './enhanced-ai';

/**
 * Integration hook to sync all enhanced components
 */
export function useEnhancedIntegration() {
  const { stats, addXP, trackAction } = useGamification();
  const notifications = useNotificationPresets();
  const { settings } = useAdvancedSettings();
  const [aiContext, updateAIContext] = useAIContext();

  // Sync gamification with notifications
  useEffect(() => {
    if (settings.gamification.enabled && settings.notifications.xpGains) {
      // XP notifications are handled by individual components
    }
  }, [settings]);

  // Sync AI context with current state
  const syncAIContext = (updates: Partial<typeof aiContext>) => {
    updateAIContext(updates);
  };

  // Enhanced action handler that triggers multiple systems
  const handleEnhancedAction = (action: string, data?: any) => {
    switch (action) {
      case 'code_run':
        if (data?.success) {
          const xpResult = addXP(25, 'Ran code successfully');
          if (xpResult.leveledUp) {
            notifications.levelUp(xpResult.stats?.level || 1, xpResult.stats?.rank || 'Novice');
          }
        }
        trackAction('code_execution');
        break;
        
      case 'challenge_complete':
        const xpResult = addXP(100, 'Challenge completed!', 'challenge_completed');
        notifications.challengeCompleted(data?.challengeName || 'Challenge');
        if (xpResult.leveledUp) {
          notifications.levelUp(xpResult.stats?.level || 1, xpResult.stats?.rank || 'Novice');
        }
        break;
        
      case 'file_save':
        if (settings.notifications.fileChanges) {
          notifications.codeSaved(data?.filename || 'file');
        }
        trackAction('file_save');
        break;
        
      case 'ai_suggestion_applied':
        addXP(10, 'Applied AI suggestion');
        trackAction('ai_interaction');
        break;
        
      case 'terminal_command':
        addXP(2, 'Used terminal');
        trackAction('terminal_command_used');
        break;
        
      default:
        trackAction(action);
    }
  };

  return {
    stats,
    addXP,
    trackAction,
    notifications,
    settings,
    aiContext,
    syncAIContext,
    handleEnhancedAction
  };
}

/**
 * HOC to wrap components with enhanced features
 */
export function withEnhancedFeatures<P extends object>(
  Component: React.ComponentType<P>
) {
  return function EnhancedComponent(props: P) {
    return (
      <NotificationProvider>
        <Component {...props} />
      </NotificationProvider>
    );
  };
}

/**
 * Context for sharing enhanced state across components
 */
export const EnhancedContext = React.createContext<ReturnType<typeof useEnhancedIntegration> | null>(null);

export function EnhancedProvider({ children }: { children: React.ReactNode }) {
  const enhancedState = useEnhancedIntegration();
  
  return (
    <EnhancedContext.Provider value={enhancedState}>
      {children}
    </EnhancedContext.Provider>
  );
}

export function useEnhanced() {
  const context = React.useContext(EnhancedContext);
  if (!context) {
    throw new Error('useEnhanced must be used within EnhancedProvider');
  }
  return context;
}
