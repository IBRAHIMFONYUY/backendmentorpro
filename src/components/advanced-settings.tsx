"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Palette,
  Keyboard,
  Brain,
  Monitor,
  Volume2,
  Bell,
  Code,
  Terminal,
  Gamepad2,
  Shield,
  Download,
  Upload,
  RotateCcw,
  Save,
  Eye,
  MousePointer,
  Zap,
  Clock,
  Globe,
  Moon,
  Sun,
  Laptop,
  Smartphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export interface EditorSettings {
  theme: 'vs-dark' | 'vs-light' | 'hc-black';
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  tabSize: number;
  insertSpaces: boolean;
  wordWrap: 'on' | 'off' | 'wordWrapColumn';
  minimap: boolean;
  lineNumbers: 'on' | 'off' | 'relative';
  folding: boolean;
  rulers: number[];
  renderWhitespace: 'none' | 'boundary' | 'selection' | 'trailing' | 'all';
  cursorBlinking: 'blink' | 'smooth' | 'phase' | 'expand' | 'solid';
  cursorStyle: 'line' | 'block' | 'underline' | 'line-thin' | 'block-outline' | 'underline-thin';
  autoClosingBrackets: 'always' | 'languageDefinitions' | 'beforeWhitespace' | 'never';
  autoIndent: 'none' | 'keep' | 'brackets' | 'advanced' | 'full';
  formatOnSave: boolean;
  formatOnPaste: boolean;
  autoSave: 'off' | 'afterDelay' | 'onFocusChange' | 'onWindowChange';
  autoSaveDelay: number;
  bracketPairColorization: boolean;
  smoothScrolling: boolean;
  mouseWheelZoom: boolean;
  quickSuggestions: boolean;
  parameterHints: boolean;
  codeLens: boolean;
}

export interface AISettings {
  enabled: boolean;
  autoSuggest: boolean;
  contextAware: boolean;
  realTimeHelp: boolean;
  codeReview: boolean;
  personality: 'professional' | 'friendly' | 'casual' | 'mentor';
  responseStyle: 'concise' | 'detailed' | 'balanced';
  language: string;
  maxResponseLength: number;
  includeCodeExamples: boolean;
  explainComplexity: boolean;
  suggestOptimizations: boolean;
  privateMode: boolean;
}

export interface UISettings {
  layout: 'default' | 'compact' | 'wide';
  sidebar: 'left' | 'right' | 'hidden';
  panelPosition: 'bottom' | 'right';
  zenMode: boolean;
  showMinimap: boolean;
  showBreadcrumbs: boolean;
  showStatusBar: boolean;
  showActivityBar: boolean;
  iconTheme: 'default' | 'material' | 'vscode-icons' | 'minimal';
  colorTheme: 'dark' | 'light' | 'auto';
  accentColor: string;
  transparency: number;
  animations: boolean;
  transitions: boolean;
  compactMode: boolean;
  fullscreen: boolean;
}

export interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  desktop: boolean;
  achievements: boolean;
  xpGains: boolean;
  levelUps: boolean;
  testResults: boolean;
  aiResponses: boolean;
  fileChanges: boolean;
  errors: boolean;
  warnings: boolean;
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  duration: number;
  maxNotifications: number;
  doNotDisturb: boolean;
  quietHours: { start: string; end: string; enabled: boolean };
}

export interface GamificationSettings {
  enabled: boolean;
  showXP: boolean;
  showLevel: boolean;
  showStreak: boolean;
  showAchievements: boolean;
  showLeaderboard: boolean;
  anonymousMode: boolean;
  shareProgress: boolean;
  celebrateAchievements: boolean;
  motivationalMessages: boolean;
  competitiveMode: boolean;
  streakReminders: boolean;
  weeklyGoals: boolean;
  customGoals: { name: string; target: number; reward: string }[];
}

export interface KeyboardShortcuts {
  [key: string]: {
    keys: string[];
    description: string;
    category: string;
  };
}

export interface AdvancedSettings {
  editor: EditorSettings;
  ai: AISettings;
  ui: UISettings;
  notifications: NotificationSettings;
  gamification: GamificationSettings;
  shortcuts: KeyboardShortcuts;
}

const DEFAULT_SETTINGS: AdvancedSettings = {
  editor: {
    theme: 'vs-dark',
    fontSize: 14,
    fontFamily: 'JetBrains Mono, Fira Code, monospace',
    lineHeight: 1.5,
    tabSize: 2,
    insertSpaces: true,
    wordWrap: 'on',
    minimap: true,
    lineNumbers: 'on',
    folding: true,
    rulers: [80, 120],
    renderWhitespace: 'boundary',
    cursorBlinking: 'blink',
    cursorStyle: 'line',
    autoClosingBrackets: 'always',
    autoIndent: 'advanced',
    formatOnSave: true,
    formatOnPaste: false,
    autoSave: 'afterDelay',
    autoSaveDelay: 1000,
    bracketPairColorization: true,
    smoothScrolling: true,
    mouseWheelZoom: false,
    quickSuggestions: true,
    parameterHints: true,
    codeLens: true
  },
  ai: {
    enabled: true,
    autoSuggest: true,
    contextAware: true,
    realTimeHelp: true,
    codeReview: true,
    personality: 'friendly',
    responseStyle: 'balanced',
    language: 'english',
    maxResponseLength: 500,
    includeCodeExamples: true,
    explainComplexity: true,
    suggestOptimizations: true,
    privateMode: false
  },
  ui: {
    layout: 'default',
    sidebar: 'left',
    panelPosition: 'bottom',
    zenMode: false,
    showMinimap: true,
    showBreadcrumbs: true,
    showStatusBar: true,
    showActivityBar: true,
    iconTheme: 'default',
    colorTheme: 'dark',
    accentColor: '#007ACC',
    transparency: 0,
    animations: true,
    transitions: true,
    compactMode: false,
    fullscreen: false
  },
  notifications: {
    enabled: true,
    sound: true,
    desktop: false,
    achievements: true,
    xpGains: true,
    levelUps: true,
    testResults: true,
    aiResponses: true,
    fileChanges: true,
    errors: true,
    warnings: true,
    position: 'top-right',
    duration: 5000,
    maxNotifications: 5,
    doNotDisturb: false,
    quietHours: { start: '22:00', end: '08:00', enabled: false }
  },
  gamification: {
    enabled: true,
    showXP: true,
    showLevel: true,
    showStreak: true,
    showAchievements: true,
    showLeaderboard: true,
    anonymousMode: false,
    shareProgress: true,
    celebrateAchievements: true,
    motivationalMessages: true,
    competitiveMode: false,
    streakReminders: true,
    weeklyGoals: true,
    customGoals: []
  },
  shortcuts: {
    'editor.action.formatDocument': { keys: ['Ctrl+Shift+I'], description: 'Format Document', category: 'Editor' },
    'workbench.action.quickOpen': { keys: ['Ctrl+P'], description: 'Quick Open', category: 'Navigation' },
    'workbench.action.showCommands': { keys: ['Ctrl+Shift+P'], description: 'Command Palette', category: 'Navigation' },
    'editor.action.commentLine': { keys: ['Ctrl+/'], description: 'Toggle Comment', category: 'Editor' },
    'editor.action.duplicateSelection': { keys: ['Ctrl+D'], description: 'Duplicate Line', category: 'Editor' },
    'workbench.action.terminal.toggleTerminal': { keys: ['Ctrl+`'], description: 'Toggle Terminal', category: 'Terminal' },
    'editor.action.goToDeclaration': { keys: ['F12'], description: 'Go to Definition', category: 'Navigation' },
    'workbench.action.files.save': { keys: ['Ctrl+S'], description: 'Save File', category: 'File' },
    'workbench.action.files.saveAll': { keys: ['Ctrl+K', 'S'], description: 'Save All', category: 'File' },
    'editor.action.findNext': { keys: ['F3'], description: 'Find Next', category: 'Search' },
    'editor.action.startFindReplaceAction': { keys: ['Ctrl+H'], description: 'Replace', category: 'Search' },
    'workbench.action.debug.start': { keys: ['F5'], description: 'Start Debugging', category: 'Debug' },
    'workbench.action.problems.focus': { keys: ['Ctrl+Shift+M'], description: 'Show Problems', category: 'Debug' },
    'workbench.action.toggleZenMode': { keys: ['Ctrl+K', 'Z'], description: 'Toggle Zen Mode', category: 'View' },
    'workbench.action.toggleSidebarVisibility': { keys: ['Ctrl+B'], description: 'Toggle Sidebar', category: 'View' }
  }
};

interface AdvancedSettingsPanelProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  settings: AdvancedSettings;
  onSettingsChange: (settings: AdvancedSettings) => void;
}

export function AdvancedSettingsPanel({ isOpen, onOpenChange, settings, onSettingsChange }: AdvancedSettingsPanelProps) {
  const [localSettings, setLocalSettings] = useState<AdvancedSettings>(settings);
  const [hasChanges, setHasChanges] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importData, setImportData] = useState('');

  useEffect(() => {
    setLocalSettings(settings);
    setHasChanges(false);
  }, [settings, isOpen]);

  const updateSettings = (category: keyof AdvancedSettings, updates: any) => {
    const newSettings = {
      ...localSettings,
      [category]: { ...localSettings[category], ...updates }
    };
    setLocalSettings(newSettings);
    setHasChanges(true);
  };

  const handleSave = () => {
    onSettingsChange(localSettings);
    setHasChanges(false);
    onOpenChange(false);
  };

  const handleReset = () => {
    setLocalSettings(DEFAULT_SETTINGS);
    setHasChanges(true);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(localSettings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'backend-mentor-settings.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    setExportModalOpen(false);
  };

  const handleImport = () => {
    try {
      const imported = JSON.parse(importData);
      setLocalSettings({ ...DEFAULT_SETTINGS, ...imported });
      setHasChanges(true);
      setImportModalOpen(false);
      setImportData('');
    } catch (error) {
      alert('Invalid JSON format. Please check your settings file.');
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Advanced Settings
            </DialogTitle>
            <DialogDescription>
              Customize your coding environment, AI assistant, and more.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="flex-1 p-6">
            <Tabs defaultValue="editor" className="space-y-6">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="editor" className="flex items-center gap-1">
                  <Code className="w-4 h-4" />
                  Editor
                </TabsTrigger>
                <TabsTrigger value="ai" className="flex items-center gap-1">
                  <Brain className="w-4 h-4" />
                  AI
                </TabsTrigger>
                <TabsTrigger value="ui" className="flex items-center gap-1">
                  <Monitor className="w-4 h-4" />
                  UI
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-1">
                  <Bell className="w-4 h-4" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="gamification" className="flex items-center gap-1">
                  <Gamepad2 className="w-4 h-4" />
                  Gaming
                </TabsTrigger>
                <TabsTrigger value="shortcuts" className="flex items-center gap-1">
                  <Keyboard className="w-4 h-4" />
                  Shortcuts
                </TabsTrigger>
              </TabsList>

              {/* Editor Settings */}
              <TabsContent value="editor" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Editor Appearance</CardTitle>
                    <CardDescription>Customize how your code editor looks and feels</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Theme</Label>
                        <Select
                          value={localSettings.editor.theme}
                          onValueChange={(value) => updateSettings('editor', { theme: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="vs-dark">Dark</SelectItem>
                            <SelectItem value="vs-light">Light</SelectItem>
                            <SelectItem value="hc-black">High Contrast</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Font Family</Label>
                        <Select
                          value={localSettings.editor.fontFamily.split(',')[0].trim()}
                          onValueChange={(value) => updateSettings('editor', { fontFamily: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="JetBrains Mono">JetBrains Mono</SelectItem>
                            <SelectItem value="Fira Code">Fira Code</SelectItem>
                            <SelectItem value="Source Code Pro">Source Code Pro</SelectItem>
                            <SelectItem value="Consolas">Consolas</SelectItem>
                            <SelectItem value="Monaco">Monaco</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Font Size ({localSettings.editor.fontSize}px)</Label>
                        <Slider
                          value={[localSettings.editor.fontSize]}
                          onValueChange={([value]) => updateSettings('editor', { fontSize: value })}
                          min={10}
                          max={24}
                          step={1}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Line Height ({localSettings.editor.lineHeight})</Label>
                        <Slider
                          value={[localSettings.editor.lineHeight]}
                          onValueChange={([value]) => updateSettings('editor', { lineHeight: value })}
                          min={1.2}
                          max={2.0}
                          step={0.1}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Tab Size ({localSettings.editor.tabSize})</Label>
                        <Slider
                          value={[localSettings.editor.tabSize]}
                          onValueChange={([value]) => updateSettings('editor', { tabSize: value })}
                          min={2}
                          max={8}
                          step={1}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Editor Behavior</CardTitle>
                    <CardDescription>Configure how the editor behaves</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <Label>Word Wrap</Label>
                        <Switch
                          checked={localSettings.editor.wordWrap === 'on'}
                          onCheckedChange={(checked) => updateSettings('editor', { wordWrap: checked ? 'on' : 'off' })}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label>Format on Save</Label>
                        <Switch
                          checked={localSettings.editor.formatOnSave}
                          onCheckedChange={(checked) => updateSettings('editor', { formatOnSave: checked })}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label>Insert Spaces</Label>
                        <Switch
                          checked={localSettings.editor.insertSpaces}
                          onCheckedChange={(checked) => updateSettings('editor', { insertSpaces: checked })}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label>Auto Save</Label>
                        <Select
                          value={localSettings.editor.autoSave}
                          onValueChange={(value) => updateSettings('editor', { autoSave: value })}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="off">Off</SelectItem>
                            <SelectItem value="afterDelay">After Delay</SelectItem>
                            <SelectItem value="onFocusChange">Focus Change</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* AI Settings */}
              <TabsContent value="ai" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>AI Assistant</CardTitle>
                    <CardDescription>Configure Rahim, your AI coding mentor</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Enable AI Assistant</Label>
                        <p className="text-sm text-muted-foreground">Turn on/off the AI assistant</p>
                      </div>
                      <Switch
                        checked={localSettings.ai.enabled}
                        onCheckedChange={(checked) => updateSettings('ai', { enabled: checked })}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Personality</Label>
                        <Select
                          value={localSettings.ai.personality}
                          onValueChange={(value) => updateSettings('ai', { personality: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="professional">Professional</SelectItem>
                            <SelectItem value="friendly">Friendly</SelectItem>
                            <SelectItem value="casual">Casual</SelectItem>
                            <SelectItem value="mentor">Mentor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Response Style</Label>
                        <Select
                          value={localSettings.ai.responseStyle}
                          onValueChange={(value) => updateSettings('ai', { responseStyle: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="concise">Concise</SelectItem>
                            <SelectItem value="detailed">Detailed</SelectItem>
                            <SelectItem value="balanced">Balanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Max Response Length ({localSettings.ai.maxResponseLength} chars)</Label>
                      <Slider
                        value={[localSettings.ai.maxResponseLength]}
                        onValueChange={([value]) => updateSettings('ai', { maxResponseLength: value })}
                        min={100}
                        max={1000}
                        step={50}
                      />
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">AI Features</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { key: 'autoSuggest', label: 'Auto Suggestions', desc: 'Real-time code suggestions' },
                          { key: 'contextAware', label: 'Context Aware', desc: 'Understand current project context' },
                          { key: 'realTimeHelp', label: 'Real-time Help', desc: 'Instant help as you type' },
                          { key: 'codeReview', label: 'Code Review', desc: 'Automatic code quality feedback' },
                          { key: 'includeCodeExamples', label: 'Code Examples', desc: 'Include examples in responses' },
                          { key: 'suggestOptimizations', label: 'Optimizations', desc: 'Suggest performance improvements' }
                        ].map((feature) => (
                          <div key={feature.key} className="flex items-start justify-between">
                            <div>
                              <Label className="text-sm">{feature.label}</Label>
                              <p className="text-xs text-muted-foreground">{feature.desc}</p>
                            </div>
                            <Switch
                              checked={localSettings.ai[feature.key as keyof AISettings] as boolean}
                              onCheckedChange={(checked) => updateSettings('ai', { [feature.key]: checked })}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* UI Settings */}
              <TabsContent value="ui" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Layout & Appearance</CardTitle>
                    <CardDescription>Customize the overall look and layout</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Layout</Label>
                        <Select
                          value={localSettings.ui.layout}
                          onValueChange={(value) => updateSettings('ui', { layout: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="default">Default</SelectItem>
                            <SelectItem value="compact">Compact</SelectItem>
                            <SelectItem value="wide">Wide</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Color Theme</Label>
                        <Select
                          value={localSettings.ui.colorTheme}
                          onValueChange={(value) => updateSettings('ui', { colorTheme: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="auto">Auto</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Icon Theme</Label>
                        <Select
                          value={localSettings.ui.iconTheme}
                          onValueChange={(value) => updateSettings('ui', { iconTheme: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="default">Default</SelectItem>
                            <SelectItem value="material">Material</SelectItem>
                            <SelectItem value="vscode-icons">VS Code</SelectItem>
                            <SelectItem value="minimal">Minimal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Accent Color</Label>
                      <div className="flex gap-2">
                        {['#007ACC', '#00AA00', '#AA0000', '#AA00AA', '#AAAA00', '#00AAAA'].map((color) => (
                          <Button
                            key={color}
                            variant="outline"
                            className={cn(
                              "w-8 h-8 p-0 rounded-full border-2",
                              localSettings.ui.accentColor === color && "ring-2 ring-white"
                            )}
                            style={{ backgroundColor: color }}
                            onClick={() => updateSettings('ui', { accentColor: color })}
                          />
                        ))}
                        <Input
                          type="color"
                          value={localSettings.ui.accentColor}
                          onChange={(e) => updateSettings('ui', { accentColor: e.target.value })}
                          className="w-8 h-8 p-0 border-0"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { key: 'animations', label: 'Animations', desc: 'Enable smooth animations' },
                        { key: 'transitions', label: 'Transitions', desc: 'Enable smooth transitions' },
                        { key: 'showMinimap', label: 'Show Minimap', desc: 'Show code minimap' },
                        { key: 'showBreadcrumbs', label: 'Breadcrumbs', desc: 'Show file path breadcrumbs' },
                        { key: 'showStatusBar', label: 'Status Bar', desc: 'Show bottom status bar' },
                        { key: 'showActivityBar', label: 'Activity Bar', desc: 'Show activity sidebar' }
                      ].map((setting) => (
                        <div key={setting.key} className="flex items-start justify-between">
                          <div>
                            <Label className="text-sm">{setting.label}</Label>
                            <p className="text-xs text-muted-foreground">{setting.desc}</p>
                          </div>
                          <Switch
                            checked={localSettings.ui[setting.key as keyof UISettings] as boolean}
                            onCheckedChange={(checked) => updateSettings('ui', { [setting.key]: checked })}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notification Settings */}
              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Control when and how you get notified</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Enable Notifications</Label>
                        <p className="text-sm text-muted-foreground">Master notification toggle</p>
                      </div>
                      <Switch
                        checked={localSettings.notifications.enabled}
                        onCheckedChange={(checked) => updateSettings('notifications', { enabled: checked })}
                      />
                    </div>
                    
                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Position</Label>
                        <Select
                          value={localSettings.notifications.position}
                          onValueChange={(value) => updateSettings('notifications', { position: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="top-right">Top Right</SelectItem>
                            <SelectItem value="top-left">Top Left</SelectItem>
                            <SelectItem value="bottom-right">Bottom Right</SelectItem>
                            <SelectItem value="bottom-left">Bottom Left</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Duration ({localSettings.notifications.duration}ms)</Label>
                        <Slider
                          value={[localSettings.notifications.duration]}
                          onValueChange={([value]) => updateSettings('notifications', { duration: value })}
                          min={1000}
                          max={10000}
                          step={500}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">Notification Types</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { key: 'achievements', label: 'Achievements', desc: 'Achievement unlocks' },
                          { key: 'xpGains', label: 'XP Gains', desc: 'Experience point notifications' },
                          { key: 'levelUps', label: 'Level Ups', desc: 'Level advancement alerts' },
                          { key: 'testResults', label: 'Test Results', desc: 'Test pass/fail notifications' },
                          { key: 'aiResponses', label: 'AI Responses', desc: 'AI assistant messages' },
                          { key: 'fileChanges', label: 'File Changes', desc: 'File save/create alerts' },
                          { key: 'errors', label: 'Errors', desc: 'Error notifications' },
                          { key: 'warnings', label: 'Warnings', desc: 'Warning messages' }
                        ].map((notif) => (
                          <div key={notif.key} className="flex items-start justify-between">
                            <div>
                              <Label className="text-sm">{notif.label}</Label>
                              <p className="text-xs text-muted-foreground">{notif.desc}</p>
                            </div>
                            <Switch
                              checked={localSettings.notifications[notif.key as keyof NotificationSettings] as boolean}
                              onCheckedChange={(checked) => updateSettings('notifications', { [notif.key]: checked })}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Gamification Settings */}
              <TabsContent value="gamification" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Gaming Experience</CardTitle>
                    <CardDescription>Configure achievements, XP, and gamification features</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Enable Gamification</Label>
                        <p className="text-sm text-muted-foreground">Turn on/off all gaming features</p>
                      </div>
                      <Switch
                        checked={localSettings.gamification.enabled}
                        onCheckedChange={(checked) => updateSettings('gamification', { enabled: checked })}
                      />
                    </div>
                    
                    <Separator />

                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">Display Options</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { key: 'showXP', label: 'Show XP', desc: 'Display experience points' },
                          { key: 'showLevel', label: 'Show Level', desc: 'Display current level' },
                          { key: 'showStreak', label: 'Show Streak', desc: 'Display coding streak' },
                          { key: 'showAchievements', label: 'Show Achievements', desc: 'Display achievement notifications' },
                          { key: 'showLeaderboard', label: 'Show Leaderboard', desc: 'Display leaderboard rankings' },
                          { key: 'celebrateAchievements', label: 'Celebrate Achievements', desc: 'Special effects for achievements' }
                        ].map((option) => (
                          <div key={option.key} className="flex items-start justify-between">
                            <div>
                              <Label className="text-sm">{option.label}</Label>
                              <p className="text-xs text-muted-foreground">{option.desc}</p>
                            </div>
                            <Switch
                              checked={localSettings.gamification[option.key as keyof GamificationSettings] as boolean}
                              onCheckedChange={(checked) => updateSettings('gamification', { [option.key]: checked })}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">Social Features</h4>
                      <div className="grid grid-cols-1 gap-4">
                        {[
                          { key: 'shareProgress', label: 'Share Progress', desc: 'Allow sharing progress with others' },
                          { key: 'competitiveMode', label: 'Competitive Mode', desc: 'Enable competitive features' },
                          { key: 'anonymousMode', label: 'Anonymous Mode', desc: 'Hide identity in leaderboards' }
                        ].map((option) => (
                          <div key={option.key} className="flex items-start justify-between">
                            <div>
                              <Label className="text-sm">{option.label}</Label>
                              <p className="text-xs text-muted-foreground">{option.desc}</p>
                            </div>
                            <Switch
                              checked={localSettings.gamification[option.key as keyof GamificationSettings] as boolean}
                              onCheckedChange={(checked) => updateSettings('gamification', { [option.key]: checked })}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Keyboard Shortcuts */}
              <TabsContent value="shortcuts" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Keyboard Shortcuts</CardTitle>
                    <CardDescription>View and customize keyboard shortcuts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(
                        Object.entries(localSettings.shortcuts).reduce((acc, [key, shortcut]) => {
                          if (!acc[shortcut.category]) acc[shortcut.category] = [];
                          acc[shortcut.category].push({ key, ...shortcut });
                          return acc;
                        }, {} as Record<string, any[]>)
                      ).map(([category, shortcuts]) => (
                        <div key={category}>
                          <h4 className="text-sm font-semibold mb-2">{category}</h4>
                          <div className="space-y-2">
                            {shortcuts.map(({ key, keys, description }) => (
                              <div key={key} className="flex items-center justify-between py-1">
                                <span className="text-sm">{description}</span>
                                <div className="flex gap-1">
                                  {keys.map((keyStr: string, index: number) => (
                                    <Badge key={index} variant="outline" className="font-mono text-xs">
                                      {keyStr}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </ScrollArea>

          <div className="flex items-center justify-between p-6 border-t">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setExportModalOpen(true)}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={() => setImportModalOpen(true)}>
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
              <Button variant="outline" size="sm" onClick={handleReset}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset to Defaults
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={!hasChanges}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Export Modal */}
      <Dialog open={exportModalOpen} onOpenChange={setExportModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Settings</DialogTitle>
            <DialogDescription>
              Download your settings as a JSON file for backup or sharing.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setExportModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Import Modal */}
      <Dialog open={importModalOpen} onOpenChange={setImportModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Settings</DialogTitle>
            <DialogDescription>
              Paste your settings JSON or upload a settings file.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Paste your settings JSON here..."
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              rows={10}
              className="font-mono"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setImportModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleImport} disabled={!importData.trim()}>
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function useAdvancedSettings() {
  const [settings, setSettings] = useState<AdvancedSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const saved = localStorage.getItem('advancedSettings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } catch (error) {
        console.error('Error loading advanced settings:', error);
      }
    }
  }, []);

  const updateSettings = (newSettings: AdvancedSettings) => {
    setSettings(newSettings);
    localStorage.setItem('advancedSettings', JSON.stringify(newSettings));
  };

  return { settings, updateSettings };
}
