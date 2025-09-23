
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { FolderPlus } from "lucide-react";

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (path: string) => void;
}

export function CreateFolderModal({ isOpen, onClose, onCreate }: CreateFolderModalProps) {
  const [folderName, setFolderName] = useState("");

  const handleCreate = () => {
    onCreate(folderName);
    setFolderName("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-effect modal sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><FolderPlus /> Create New Folder</DialogTitle>
          <DialogDescription>Enter the name of the new folder. You can create nested folders (e.g., `src/components`).</DialogDescription>
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
