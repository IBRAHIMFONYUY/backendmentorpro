
"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Bot, Bug, Lightbulb, Rocket, Send, X, Code, Search } from "lucide-react";

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AiAssistantModal({ isOpen, onClose }: AiAssistantModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-effect rounded-2xl p-6 max-w-lg w-full">
        <DialogHeader className="flex flex-row justify-between items-center mb-4 text-left">
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                <Bot className="text-white"/>
            </div>
            <span className="text-2xl font-bold">AI Mentor Assistant</span>
          </DialogTitle>
          <Button onClick={onClose} variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <X />
          </Button>
        </DialogHeader>

        <div className="space-y-6">
            <div className="bg-background rounded-xl p-4 max-h-80 overflow-y-auto" id="aiChat">
                <div className="flex items-start space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center shrink-0">
                        <Bot className="text-white text-sm" />
                    </div>
                    <div className="glass-effect rounded-xl p-4 max-w-md">
                        <p className="text-sm">👋 Hi! I'm your AI mentor. I can help you with:</p>
                        <ul className="text-sm mt-2 space-y-1 list-disc list-inside">
                            <li>Code reviews and debugging</li>
                            <li>Concept explanations</li>
                            <li>Best practices and optimization</li>
                            <li>Learning path recommendations</li>
                        </ul>
                        <p className="text-sm mt-2">What would you like to work on today?</p>
                    </div>
                </div>
            </div>
            
            <div className="flex space-x-3">
                <Input id="aiInput" type="text" placeholder="Ask me anything about backend development..." 
                       className="flex-1 px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:border-primary focus:outline-none" />
                <Button id="sendAiMessage" className="px-6 py-3 btn-primary-gradient text-white rounded-xl">
                    <Send />
                </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="glass-effect justify-start text-sm hover:border-primary transition-all">
                    <Search className="mr-2" />
                    Explain this code
                </Button>
                <Button variant="outline" className="glass-effect justify-start text-sm hover:border-primary transition-all">
                    <Bug className="mr-2" />
                    Find bugs
                </Button>
                <Button variant="outline" className="glass-effect justify-start text-sm hover:border-primary transition-all">
                    <Rocket className="mr-2" />
                    Optimize performance
                </Button>
                <Button variant="outline" className="glass-effect justify-start text-sm hover:border-primary transition-all">
                    <Lightbulb className="mr-2" />
                    Best practices
                </Button>
            </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}
