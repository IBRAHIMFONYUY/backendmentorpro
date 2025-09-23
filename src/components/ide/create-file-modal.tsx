
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { FilePlus } from "lucide-react";

interface CreateFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (path: string) => void;
}

export function CreateFileModal({ isOpen, onClose, onCreate }: CreateFileModalProps) {
  const [fileName, setFileName] = useState("");

  const handleCreate = () => {
    onCreate(fileName);
    setFileName("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-effect modal sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><FilePlus /> Create New File</DialogTitle>
          <DialogDescription>Enter the name of the new file. You can include a path (e.g., `src/components/button.js`).</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input 
            placeholder="e.g., utils/helpers.js" 
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
