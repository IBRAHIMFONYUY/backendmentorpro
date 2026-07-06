
"use client";

import { useState } from 'react';
import { Bot } from 'lucide-react';
import { AIMentorModal } from './ai-mentor-modal';
import { Button } from './ui/button';

export function AIMentorFab() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="icon"
          className="rounded-full w-14 h-14 bg-gradient-to-r from-accent-blue to-accent-purple text-white shadow-lg animate-pulse-glow hover:scale-110 transition-transform"
          onClick={() => setIsOpen(true)}
        >
          <Bot className="h-7 w-7" />
        </Button>
      </div>
      <AIMentorModal isOpen={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
