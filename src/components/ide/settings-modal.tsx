"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";
import { Slider } from "../ui/slider";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [fontSize, setFontSize] = useState([14]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-effect modal sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Customize your IDE experience.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div>
            <Label htmlFor="geminiApiKey">Gemini API Key (for Rahim AI)</Label>
            <Input id="geminiApiKey" type="password" placeholder="AIzaSy..." defaultValue="AIzaSyAq6QATs5YOVtHM46Lp9cXVY1c9d1qmr8g" />
            <p className="text-xs text-muted-foreground mt-1">
              Get your key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-primary underline">Google AI Studio</a>.
            </p>
          </div>
          <div>
            <Label htmlFor="themeSelect">Theme</Label>
            <Select defaultValue="dark">
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
              <Slider value={fontSize} max={24} min={10} step={1} onValueChange={setFontSize} />
              <span className="text-sm text-muted-foreground w-12 text-right">{fontSize[0]}px</span>
            </div>
          </div>
          <div>
            <Label htmlFor="tabSizeSelect">Tab Size</Label>
            <Select defaultValue="4">
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
            <Switch id="autoSaveToggle" defaultChecked />
          </div>
           <div className="flex items-center justify-between">
            <Label htmlFor="minimapToggle">Show Minimap</Label>
            <Switch id="minimapToggle" defaultChecked />
          </div>
           <div className="flex items-center justify-between">
            <Label htmlFor="wordWrapToggle">Word Wrap</Label>
            <Switch id="wordWrapToggle" defaultChecked />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
