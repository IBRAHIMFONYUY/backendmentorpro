
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Edit } from "lucide-react";

interface RenameNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRename: (newName: string) => void;
  currentNodeName: string;
  nodeType: 'file' | 'folder';
}

export function RenameNodeModal({ isOpen, onClose, onRename, currentNodeName, nodeType }: RenameNodeModalProps) {
  const [newName, setNewName] = useState("");

  useEffect(() => {
    if (isOpen) {
      setNewName(currentNodeName);
    }
  }, [isOpen, currentNodeName]);

  const handleRename = () => {
    onRename(newName);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-effect modal sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Edit /> Rename {nodeType}</DialogTitle>
          <DialogDescription>Enter the new name for <code className="bg-muted px-1 py-0.5 rounded text-foreground">{currentNodeName}</code></DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input 
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleRename()}
            autoFocus
            onFocus={(e) => e.target.select()}
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleRename} disabled={!newName || newName === currentNodeName}>Rename</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
