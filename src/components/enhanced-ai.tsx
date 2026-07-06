"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  MessageSquare,
  Code,
  Lightbulb,
  Search,
  FileText,
  GitBranch,
  Bug,
  Zap,
  Target,
  BookOpen,
  Users,
  Sparkles,
  Send,
  Mic,
  MicOff,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Star,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  X,
  Minimize2,
  Maximize2,
  Settings,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export interface AIContext {
  projectName: string;
  currentFile: string;
  fileType: string;
  language: string;
  codeContent: string;
  selectedText: string;
  cursorPosition: { line: number; column: number };
  openFiles: string[];
  recentActions: string[];
  errorMessages: string[];
  testResults: any[];
  dependencies: string[];
  framework: string;
  buildTool: string;
  gitBranch: string;
  lastCommit: string;
  workspaceFiles: string[];
}

export interface AISuggestion {
  id: string;
  type: 'code' | 'fix' | 'optimization' | 'explanation' | 'refactor' | 'test';
  title: string;
  description: string;
  code?: string;
  confidence: number;
  context: string;
  priority: 'low' | 'medium' | 'high';
  timeEstimate?: string;
  tags: string[];
  createdAt: Date;
}

export interface AIConversation {
  id: string;
  messages: AIMessage[];
  context: Partial<AIContext>;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  tags: string[];
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  code?: string;
  suggestions?: AISuggestion[];
  timestamp: Date;
  feedback?: 'positive' | 'negative';
  context?: string;
}

interface EnhancedAIProps {
  context: AIContext;
  onSuggestionApply: (suggestion: AISuggestion) => void;
  onCodeInsert: (code: string) => void;
  onFileOpen: (file: string) => void;
  className?: string;
}

export function EnhancedAI({ context, onSuggestionApply, onCodeInsert, onFileOpen, className }: EnhancedAIProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'suggestions' | 'insights'>('chat');
  const [conversations, setConversations] = useState<AIConversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [aiInsights, setAiInsights] = useState<any[]>([]);
  
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev + ' ' + transcript);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        toast({
          title: "Speech Recognition Error",
          description: "Could not process speech input",
          variant: "destructive"
        });
      };

      recognitionRef.current = recognition;
    }
  }, [toast]);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations]);

  // Generate context-aware suggestions
  useEffect(() => {
    generateSuggestions();
  }, [context.codeContent, context.currentFile, context.errorMessages]);

  // Generate AI insights periodically
  useEffect(() => {
    const interval = setInterval(generateInsights, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, [context]);

  const generateSuggestions = useCallback(async () => {
    if (!context.codeContent) return;

    // Simulate AI suggestion generation
    const newSuggestions: AISuggestion[] = [
      {
        id: '1',
        type: 'optimization',
        title: 'Optimize loop performance',
        description: 'Consider using Array.map() instead of forEach for better performance',
        code: `// Optimized version\nconst results = items.map(item => processItem(item));`,
        confidence: 85,
        context: 'Current file contains inefficient loops',
        priority: 'medium',
        timeEstimate: '2 minutes',
        tags: ['performance', 'javascript'],
        createdAt: new Date()
      },
      {
        id: '2',
        type: 'fix',
        title: 'Fix potential memory leak',
        description: 'Missing cleanup in useEffect hook',
        code: `useEffect(() => {\n  // ... existing code\n  return () => {\n    // Cleanup function\n    cleanup();\n  };\n}, []);`,
        confidence: 92,
        context: 'React component with missing cleanup',
        priority: 'high',
        timeEstimate: '1 minute',
        tags: ['react', 'memory', 'bug'],
        createdAt: new Date()
      },
      {
        id: '3',
        type: 'refactor',
        title: 'Extract reusable component',
        description: 'This code pattern appears in multiple places and could be extracted',
        confidence: 78,
        context: 'Repeated code pattern detected',
        priority: 'low',
        timeEstimate: '10 minutes',
        tags: ['refactoring', 'components'],
        createdAt: new Date()
      }
    ];

    setSuggestions(newSuggestions);
  }, [context]);

  const generateInsights = useCallback(() => {
    // Simulate AI insights generation
    const insights = [
      {
        id: '1',
        type: 'productivity',
        title: 'Coding Session Analysis',
        value: '89% efficiency',
        trend: '+12%',
        description: 'Your coding efficiency has improved this week',
        icon: TrendingUp
      },
      {
        id: '2',
        type: 'quality',
        title: 'Code Quality Score',
        value: '8.4/10',
        trend: '+0.3',
        description: 'Code quality metrics show steady improvement',
        icon: Star
      },
      {
        id: '3',
        type: 'learning',
        title: 'New Concepts Learned',
        value: '3 this week',
        trend: 'New!',
        description: 'React Hooks, TypeScript Generics, Performance Optimization',
        icon: BookOpen
      }
    ];

    setAiInsights(insights);
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const messageId = Date.now().toString();
    const userMessage: AIMessage = {
      id: messageId,
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
      context: `File: ${context.currentFile}, Language: ${context.language}`
    };

    // Add to conversation or create new one
    let conversationId = activeConversation;
    if (!conversationId) {
      conversationId = Date.now().toString();
      const newConversation: AIConversation = {
        id: conversationId,
        messages: [userMessage],
        context: context,
        createdAt: new Date(),
        updatedAt: new Date(),
        title: input.slice(0, 50) + '...',
        tags: [context.language, context.fileType]
      };
      setConversations(prev => [newConversation, ...prev]);
      setActiveConversation(conversationId);
    } else {
      setConversations(prev => prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, messages: [...conv.messages, userMessage], updatedAt: new Date() }
          : conv
      ));
    }

    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateAIResponse(input, context),
        timestamp: new Date(),
        suggestions: Math.random() > 0.5 ? [suggestions[0]] : undefined
      };

      setConversations(prev => prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, messages: [...conv.messages, aiResponse] }
          : conv
      ));
      
      setIsLoading(false);
    }, 2000);
  };

  const generateAIResponse = (userInput: string, ctx: AIContext): string => {
    const responses = [
      `I can see you're working on ${ctx.currentFile}. Based on your ${ctx.language} code, I'd suggest focusing on error handling and performance optimization.`,
      `Looking at your current project structure, you might benefit from implementing better separation of concerns. Would you like me to show you some patterns?`,
      `I notice you're using ${ctx.framework}. There are some best practices we could apply to improve your code quality and maintainability.`,
      `Based on your recent changes, I recommend adding some unit tests to ensure your new functionality works correctly.`,
      `Your code looks good! I can help you optimize performance or add better error handling if you'd like.`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Speech Recognition Not Available",
        description: "Your browser doesn't support speech recognition",
        variant: "destructive"
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const handleSuggestionAction = (suggestion: AISuggestion, action: 'apply' | 'dismiss' | 'save') => {
    switch (action) {
      case 'apply':
        onSuggestionApply(suggestion);
        toast({
          title: "Suggestion Applied",
          description: suggestion.title,
        });
        break;
      case 'dismiss':
        setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
        break;
      case 'save':
        // Save for later
        toast({
          title: "Suggestion Saved",
          description: "Saved to your AI suggestions library",
        });
        break;
    }
  };

  const currentConversation = conversations.find(c => c.id === activeConversation);

  if (!isOpen) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setIsOpen(true)}
              className={cn(
                "fixed bottom-4 right-4 w-12 h-12 rounded-full shadow-lg z-50",
                "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600",
                className
              )}
            >
              <Brain className="w-5 h-5 text-white" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Open AI Assistant (Rahim)</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "fixed bottom-4 right-4 z-50",
        isMinimized ? "w-80 h-12" : "w-96 h-[600px]",
        className
      )}
    >
      <Card className="h-full bg-background/95 backdrop-blur-sm border shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between p-3 border-b">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-sm">Rahim AI</CardTitle>
              <CardDescription className="text-xs">Your coding mentor</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-6 w-6 p-0"
            >
              {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[calc(100%-60px)]">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-3 rounded-none border-b">
                <TabsTrigger value="chat" className="text-xs">
                  <MessageSquare className="w-3 h-3 mr-1" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="suggestions" className="text-xs">
                  <Lightbulb className="w-3 h-3 mr-1" />
                  Suggestions
                  {suggestions.length > 0 && (
                    <Badge variant="secondary" className="ml-1 h-4 text-xs">
                      {suggestions.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="insights" className="text-xs">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Insights
                </TabsTrigger>
              </TabsList>

              <TabsContent value="chat" className="flex-1 flex flex-col p-0 mt-0">
                <ScrollArea className="flex-1 p-3">
                  {currentConversation?.messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "mb-4 flex",
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] rounded-lg p-3 text-sm",
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        )}
                      >
                        <p>{message.content}</p>
                        {message.code && (
                          <pre className="mt-2 p-2 bg-background/50 rounded text-xs overflow-x-auto">
                            <code>{message.code}</code>
                          </pre>
                        )}
                        {message.suggestions && (
                          <div className="mt-2 space-y-1">
                            {message.suggestions.map((suggestion) => (
                              <Button
                                key={suggestion.id}
                                variant="outline"
                                size="sm"
                                className="text-xs h-6"
                                onClick={() => handleSuggestionAction(suggestion, 'apply')}
                              >
                                Apply: {suggestion.title}
                              </Button>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                          {message.role === 'assistant' && (
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                                <Copy className="w-3 h-3" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                                <ThumbsUp className="w-3 h-3" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                                <ThumbsDown className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start mb-4">
                      <div className="bg-muted rounded-lg p-3 text-sm">
                        <div className="flex items-center gap-2">
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          <span>Rahim is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </ScrollArea>

                <div className="p-3 border-t">
                  <div className="flex gap-2">
                    <Input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask me anything about your code..."
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="text-sm"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleVoiceInput}
                      className={cn(
                        "h-8 w-8 p-0",
                        isListening && "bg-red-500 text-white"
                      )}
                    >
                      {isListening ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                    </Button>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!input.trim() || isLoading}
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      <Send className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="suggestions" className="flex-1 p-0 mt-0">
                <ScrollArea className="flex-1 p-3">
                  <div className="space-y-3">
                    {suggestions.map((suggestion) => (
                      <Card key={suggestion.id} className="p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              "w-2 h-2 rounded-full",
                              suggestion.priority === 'high' && "bg-red-500",
                              suggestion.priority === 'medium' && "bg-yellow-500",
                              suggestion.priority === 'low' && "bg-green-500"
                            )} />
                            <h4 className="font-medium text-sm">{suggestion.title}</h4>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {suggestion.confidence}%
                          </Badge>
                        </div>
                        
                        <p className="text-xs text-muted-foreground mb-2">{suggestion.description}</p>
                        
                        {suggestion.code && (
                          <pre className="text-xs bg-muted p-2 rounded mb-2 overflow-x-auto">
                            <code>{suggestion.code}</code>
                          </pre>
                        )}
                        
                        <div className="flex flex-wrap gap-1 mb-2">
                          {suggestion.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">
                            {suggestion.timeEstimate && `Est. ${suggestion.timeEstimate}`}
                          </span>
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 text-xs"
                              onClick={() => handleSuggestionAction(suggestion, 'apply')}
                            >
                              Apply
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 text-xs"
                              onClick={() => handleSuggestionAction(suggestion, 'dismiss')}
                            >
                              Dismiss
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                    
                    {suggestions.length === 0 && (
                      <div className="text-center py-8">
                        <Sparkles className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No suggestions yet</p>
                        <p className="text-xs text-muted-foreground">Start coding to get AI-powered suggestions</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="insights" className="flex-1 p-0 mt-0">
                <ScrollArea className="flex-1 p-3">
                  <div className="space-y-3">
                    {aiInsights.map((insight) => (
                      <Card key={insight.id} className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <insight.icon className="w-4 h-4 text-primary" />
                            <h4 className="font-medium text-sm">{insight.title}</h4>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {insight.trend}
                          </Badge>
                        </div>
                        
                        <div className="text-lg font-bold mb-1">{insight.value}</div>
                        <p className="text-xs text-muted-foreground">{insight.description}</p>
                      </Card>
                    ))}

                    <Card className="p-3">
                      <h4 className="font-medium text-sm mb-2">Project Context</h4>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span>Current File:</span>
                          <span className="font-mono">{context.currentFile}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Language:</span>
                          <Badge variant="secondary">{context.language}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Framework:</span>
                          <Badge variant="secondary">{context.framework}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Open Files:</span>
                          <span>{context.openFiles.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Git Branch:</span>
                          <span className="font-mono">{context.gitBranch}</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
}

export function useAIContext(): [AIContext, (updates: Partial<AIContext>) => void] {
  const [context, setContext] = useState<AIContext>({
    projectName: 'Backend Mentor',
    currentFile: '',
    fileType: '',
    language: 'javascript',
    codeContent: '',
    selectedText: '',
    cursorPosition: { line: 1, column: 1 },
    openFiles: [],
    recentActions: [],
    errorMessages: [],
    testResults: [],
    dependencies: [],
    framework: 'Next.js',
    buildTool: 'npm',
    gitBranch: 'main',
    lastCommit: '',
    workspaceFiles: []
  });

  const updateContext = useCallback((updates: Partial<AIContext>) => {
    setContext(prev => ({ ...prev, ...updates }));
  }, []);

  return [context, updateContext];
}
