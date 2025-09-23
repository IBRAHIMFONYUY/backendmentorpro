
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { FolderPlus } from "lucide-react";

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (path: string) => void;
  basePath: string;
}

export function CreateFolderModal({ isOpen, onClose, onCreate, basePath }: CreateFolderModalProps) {
  const [folderName, setFolderName] = useState("");

  useEffect(() => {
    if (isOpen) {
      setFolderName("");
    }
  }, [isOpen]);

  const handleCreate = () => {
    onCreate(folderName);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-effect modal sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><FolderPlus /> Create New Folder</DialogTitle>
          <DialogDescription>Enter the name for the new folder in <code className="bg-muted px-1 py-0.5 rounded text-foreground">{basePath}</code></DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input 
            placeholder="e.g., services" 
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleCreate} disabled={!folderName}>Create Folder</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
