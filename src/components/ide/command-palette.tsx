"use client";

import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { FilePlus, FolderPlus, Play, Rocket, Save, Search, Settings, TestTube } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCommand: (command: string) => void;
}

const commands = [
  { id: 'newProject', label: 'New Project', icon: <Rocket className="mr-2 h-4 w-4" /> },
  { id: 'saveFile', label: 'Save File', icon: <Save className="mr-2 h-4 w-4" /> },
  { id: 'runCode', label: 'Run Code', icon: <Play className="mr-2 h-4 w-4" /> },
  { id: 'runTests', label: 'Run Tests', icon: <TestTube className="mr-2 h-4 w-4" /> },
  { id: 'openSettings', label: 'Open Settings', icon: <Settings className="mr-2 h-4 w-4" /> },
  { id: 'findReplace', label: 'Find & Replace', icon: <Search className="mr-2 h-4 w-4" /> },
  { id: 'createFile', label: 'Create New File', icon: <FilePlus className="mr-2 h-4 w-4" /> },
  { id: 'createFolder', label: 'Create New Folder', icon: <FolderPlus className="mr-2 h-4 w-4" /> },
];

export function CommandPalette({ isOpen, onOpenChange, onCommand }: CommandPaletteProps) {
  const [value, setValue] = useState('');

  const runCommand = useCallback((command: () => void) => {
    onOpenChange(false);
    command();
  }, [onOpenChange]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 shadow-lg modal top-[20%] translate-y-0">
        <Command>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Commands">
              {commands.map(cmd => (
                <CommandItem key={cmd.id} onSelect={() => onCommand(cmd.id)}>
                  {cmd.icon}
                  <span>{cmd.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
