
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { FilePlus } from "lucide-react";

interface CreateFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (path: string) => void;
  basePath: string;
}

export function CreateFileModal({ isOpen, onClose, onCreate, basePath }: CreateFileModalProps) {
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    if (isOpen) {
      setFileName("");
    }
  }, [isOpen]);

  const handleCreate = () => {
    onCreate(fileName);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-effect modal sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><FilePlus /> Create New File</DialogTitle>
          <DialogDescription>Enter the name for the new file in <code className="bg-muted px-1 py-0.5 rounded text-foreground">{basePath}</code></DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input 
            placeholder="e.g., helpers.js" 
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleCreate} disabled={!fileName}>Create File</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
