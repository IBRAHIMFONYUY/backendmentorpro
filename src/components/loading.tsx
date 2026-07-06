"use client";

import React from 'react';
import { Loader2, Code, Terminal, Brain, Zap, Trophy, Crown, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingProps {
  variant?: 'default' | 'minimal' | 'branded' | 'gaming' | 'terminal' | 'ai';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  fullScreen?: boolean;
  className?: string;
}

const LoadingSpinner = ({ size = 'md', className }: { size?: string; className?: string }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  return (
    <Loader2 
      className={cn('animate-spin text-blue-500', sizeClasses[size as keyof typeof sizeClasses], className)} 
    />
  );
};

const BrandedLoader = ({ size = 'lg' }: { size?: string }) => {
  const icons = [Code, Terminal, Brain, Zap, Trophy];
  const [currentIcon, setCurrentIcon] = React.useState(0);
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIcon((prev) => (prev + 1) % icons.length);
    }, 600);
    return () => clearInterval(interval);
  }, [icons.length]);

  const Icon = icons[currentIcon];
  
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500/20 border-t-blue-500"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className="h-6 w-6 text-blue-500 animate-pulse" />
        </div>
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-white">Backend Mentor</h3>
        <p className="text-sm text-gray-400 animate-pulse">Loading your coding environment...</p>
      </div>
    </div>
  );
};

const GamingLoader = () => {
  const [xp, setXp] = React.useState(0);
  const [level, setLevel] = React.useState(1);
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      setXp(prev => {
        const newXp = prev + 5;
        if (newXp >= 100) {
          setLevel(l => l + 1);
          return 0;
        }
        return newXp;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Crown className="h-12 w-12 text-yellow-400 animate-bounce" />
        <Sparkles className="h-6 w-6 text-blue-400 animate-ping absolute -top-1 -right-1" />
      </div>
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Crown className="h-4 w-4 text-yellow-400" />
          <span className="text-white font-medium">Level {level}</span>
        </div>
        <div className="w-32 bg-gray-700 rounded-full h-2 mb-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${xp}%` }}
          />
        </div>
        <p className="text-sm text-gray-400">{xp}/100 XP</p>
      </div>
    </div>
  );
};

const TerminalLoader = () => {
  const [dots, setDots] = React.useState('');
  const [currentLine, setCurrentLine] = React.useState(0);
  
  const lines = [
    'Initializing workspace...',
    'Loading IDE components...',
    'Setting up AI mentor...',
    'Preparing challenges...',
    'Almost ready!'
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLine(prev => (prev + 1) % lines.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [lines.length]);

  return (
    <div className="bg-gray-900 p-6 rounded-lg font-mono text-sm border border-gray-700 max-w-md">
      <div className="flex items-center space-x-2 mb-4">
        <div className="flex space-x-1">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <span className="text-gray-400">Backend Mentor Terminal</span>
      </div>
      <div className="space-y-2">
        {lines.slice(0, currentLine + 1).map((line, i) => (
          <div key={i} className="flex items-center">
            <span className="text-green-400 mr-2">$</span>
            <span className="text-white">
              {i === currentLine ? `${line}${dots}` : line}
            </span>
            {i < currentLine && <span className="text-green-400 ml-2">✓</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

const AILoader = () => {
  const [thinking, setThinking] = React.useState('');
  
  React.useEffect(() => {
    const thoughts = [
      'Analyzing code patterns',
      'Optimizing suggestions',
      'Loading knowledge base',
      'Preparing AI responses',
      'Synchronizing context'
    ];
    
    let index = 0;
    const interval = setInterval(() => {
      setThinking(thoughts[index]);
      index = (index + 1) % thoughts.length;
    }, 1200);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Brain className="h-12 w-12 text-purple-500 animate-pulse" />
        <div className="absolute -inset-4 bg-purple-500/20 rounded-full animate-ping"></div>
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-white mb-2">Rahim AI</h3>
        <p className="text-sm text-gray-400 animate-pulse min-h-[1.25rem]">
          {thinking}...
        </p>
        <div className="flex justify-center space-x-1 mt-3">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

export function Loading({ 
  variant = 'default', 
  size = 'md', 
  message,
  fullScreen = false,
  className 
}: LoadingProps) {
  const baseClasses = fullScreen 
    ? 'fixed inset-0 bg-gray-900 flex items-center justify-center z-50'
    : 'flex items-center justify-center p-8';

  const content = () => {
    switch (variant) {
      case 'minimal':
        return (
          <div className="flex flex-col items-center space-y-3">
            <LoadingSpinner size={size} />
            {message && <p className="text-sm text-gray-400">{message}</p>}
          </div>
        );
      
      case 'branded':
        return <BrandedLoader size={size} />;
      
      case 'gaming':
        return <GamingLoader />;
      
      case 'terminal':
        return <TerminalLoader />;
      
      case 'ai':
        return <AILoader />;
      
      default:
        return (
          <div className="flex flex-col items-center space-y-4">
            <LoadingSpinner size={size} />
            {message && (
              <p className="text-sm text-gray-400 text-center max-w-xs">
                {message}
              </p>
            )}
          </div>
        );
    }
  };

  return (
    <div className={cn(baseClasses, className)}>
      {content()}
    </div>
  );
}

// Page-level loading components
export function PageLoading({ message }: { message?: string }) {
  return (
    <Loading 
      variant="branded" 
      fullScreen 
      message={message || "Loading page..."} 
    />
  );
}

export function ComponentLoading({ message, className }: { message?: string; className?: string }) {
  return (
    <Loading 
      variant="minimal" 
      size="sm" 
      message={message} 
      className={className}
    />
  );
}

export function ChallengeLoading() {
  return (
    <Loading 
      variant="terminal" 
      fullScreen 
    />
  );
}

export function AILoading() {
  return (
    <Loading 
      variant="ai" 
      fullScreen 
    />
  );
}

export function GamingLoading() {
  return (
    <Loading 
      variant="gaming" 
      fullScreen 
    />
  );
}

// Loading skeleton components
export function SkeletonCard() {
  return (
    <div className="bg-gray-800 rounded-lg p-6 animate-pulse">
      <div className="h-4 bg-gray-700 rounded w-3/4 mb-3"></div>
      <div className="h-3 bg-gray-700 rounded w-1/2 mb-4"></div>
      <div className="space-y-2">
        <div className="h-2 bg-gray-700 rounded"></div>
        <div className="h-2 bg-gray-700 rounded w-5/6"></div>
        <div className="h-2 bg-gray-700 rounded w-4/6"></div>
      </div>
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex space-x-4 animate-pulse">
          <div className="w-12 h-12 bg-gray-700 rounded-lg flex-shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-3 bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Loading;
