
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";
import { Slider } from "../ui/slider";
import { useToast } from "@/hooks/use-toast";

interface Settings {
  geminiApiKey: string;
  theme: string;
  fontSize: number;
  tabSize: number;
  autoSave: boolean;
  minimap: boolean;
  wordWrap: boolean;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsChange: (settings: Settings) => void;
}

const initialSettings: Settings = {
    geminiApiKey: "AIzaSyAq6QATs5YOVtHM46Lp9cXVY1c9d1qmr8g",
    theme: "dark",
    fontSize: 14,
    tabSize: 4,
    autoSave: true,
    minimap: true,
    wordWrap: true,
};

export function SettingsModal({ isOpen, onClose, onSettingsChange }: SettingsModalProps) {
  const [settings, setSettings] = useState<Settings>(initialSettings);
  const { toast } = useToast();

  useEffect(() => {
    // Load settings from localStorage if they exist
    const savedSettings = localStorage.getItem('ideSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('ideSettings', JSON.stringify(settings));
    onSettingsChange(settings);
    toast({ title: "Settings Saved!", description: "Your changes have been applied." });
    onClose();
  };

  const handleValueChange = (key: keyof Settings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    // Apply settings in real-time
    onSettingsChange(newSettings);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-effect modal sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Customize your IDE experience. Changes are applied in real-time.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4 max-h-[60vh] overflow-y-auto pr-2">
          <div>
            <Label htmlFor="geminiApiKey">Gemini API Key (for Rahim AI)</Label>
            <Input 
              id="geminiApiKey" 
              type="password" 
              placeholder="AIzaSy..." 
              value={settings.geminiApiKey}
              onChange={(e) => handleValueChange('geminiApiKey', e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Get your key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-primary underline">Google AI Studio</a>.
            </p>
          </div>
          <div>
            <Label htmlFor="themeSelect">Theme</Label>
            <Select 
              value={settings.theme} 
              onValueChange={(value) => handleValueChange('theme', value)}
            >
              <SelectTrigger id="themeSelect"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="high-contrast">High Contrast</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Font Size</Label>
            <div className="flex items-center gap-4">
              <Slider 
                value={[settings.fontSize]} 
                max={24} min={10} step={1} 
                onValueChange={([value]) => handleValueChange('fontSize', value)} 
              />
              <span className="text-sm text-muted-foreground w-12 text-right">{settings.fontSize}px</span>
            </div>
          </div>
          <div>
            <Label htmlFor="tabSizeSelect">Tab Size</Label>
            <Select 
              value={String(settings.tabSize)}
              onValueChange={(value) => handleValueChange('tabSize', Number(value))}
            >
              <SelectTrigger id="tabSizeSelect"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 spaces</SelectItem>
                <SelectItem value="4">4 spaces</SelectItem>
                <SelectItem value="8">8 spaces</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="autoSaveToggle">Auto Save</Label>
            <Switch 
              id="autoSaveToggle" 
              checked={settings.autoSave}
              onCheckedChange={(checked) => handleValueChange('autoSave', checked)}
            />
          </div>
           <div className="flex items-center justify-between">
            <Label htmlFor="minimapToggle">Show Minimap</Label>
            <Switch 
              id="minimapToggle" 
              checked={settings.minimap}
              onCheckedChange={(checked) => handleValueChange('minimap', checked)}
            />
          </div>
           <div className="flex items-center justify-between">
            <Label htmlFor="wordWrapToggle">Word Wrap</Label>
            <Switch 
              id="wordWrapToggle" 
              checked={settings.wordWrap}
              onCheckedChange={(checked) => handleValueChange('wordWrap', checked)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save & Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    