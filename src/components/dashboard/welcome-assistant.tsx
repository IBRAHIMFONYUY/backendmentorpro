"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { placeholderImages } from "@/lib/placeholder-images";

interface WelcomeAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WelcomeAssistant({ isOpen, onClose }: WelcomeAssistantProps) {
  const assistantImage = placeholderImages.find(p => p.id === 'assistant-avatar');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md glass-effect">
        <DialogHeader>
          <div className="flex justify-center">
            {assistantImage && (
                 <Image
                    src={assistantImage.imageUrl}
                    alt={assistantImage.description}
                    width={150}
                    height={150}
                    className="rounded-full border-4 border-primary/30"
                    data-ai-hint={assistantImage.imageHint}
                />
            )}
          </div>
          <DialogTitle className="text-center text-2xl pt-4">Welcome to BackendMentorAI!</DialogTitle>
          <DialogDescription className="text-center text-base text-muted-foreground">
            I'm your personal AI assistant, here to guide you on your journey to becoming a backend master. Let's start building!
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center">
          <Button type="button" onClick={onClose} className="btn-primary-gradient">
            Let's Go!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
