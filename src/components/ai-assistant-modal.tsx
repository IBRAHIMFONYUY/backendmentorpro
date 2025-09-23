
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Bot, Bug, Lightbulb, Loader2, Rocket, Send, X, User, Paperclip, Mic, Image as ImageIcon } from "lucide-react";
import { mentorChat } from "@/ai/flows/mentor-chat";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "./ui/scroll-area";

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
    type: 'user' | 'ai';
    text: string;
}

export function AiAssistantModal({ isOpen, onClose }: AiAssistantModalProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            type: 'ai',
            text: `👋 Hi! I'm Rahim, your AI mentor. I can help you with debugging, explaining concepts, or just giving you a motivational boost. What's on your mind?`
        }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Auto-scroll to bottom
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
                top: scrollAreaRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!input.trim() && !isLoading) return;

        const userMessage: Message = { type: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput("");
        setIsLoading(true);

        try {
            const result = await mentorChat({ message: currentInput });
            const aiMessage: Message = { type: 'ai', text: result.response };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error("AI chat error:", error);
            toast({
                variant: "destructive",
                title: "AI Error",
                description: "Could not get a response from the AI mentor.",
            });
            const errorMessage: Message = { type: 'ai', text: "Sorry, I'm having trouble connecting right now. Please try again later." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleQuickAction = (text: string) => {
        setInput(text);
        // Use a timeout to ensure the input state is updated before sending
        setTimeout(() => {
            const inputField = document.getElementById('aiInput');
            if (inputField) {
                 (inputField as HTMLInputElement).value = text;
                 handleSendMessage();
            }
        }, 50);
    }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-effect rounded-2xl p-0 max-w-2xl w-full flex flex-col h-[70vh] max-h-[800px]">
        <DialogHeader className="flex-row justify-between items-center p-4 border-b border-border/50 space-y-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                <Bot className="text-white"/>
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-left">Rahim - AI Mentor</DialogTitle>
              <DialogDescription className="text-left text-sm text-muted-foreground">Your personal AI coding assistant</DialogDescription>
            </div>
          </div>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <X />
            </Button>
          </DialogClose>
        </DialogHeader>

        <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
            <div className="space-y-6">
                {messages.map((message, index) => (
                     <div key={index} className={`flex items-start gap-3 ${message.type === 'user' ? 'justify-end' : ''}`}>
                         {message.type === 'ai' && (
                             <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center shrink-0">
                                <Bot className="text-white text-sm" />
                            </div>
                         )}
                         <div className={`rounded-xl px-4 py-3 max-w-md text-sm ${message.type === 'user' ? 'bg-primary/20 text-foreground' : 'glass-effect'}`}>
                             <p dangerouslySetInnerHTML={{ __html: message.text.replace(/\n/g, '<br />') }} />
                         </div>
                         {message.type === 'user' && (
                            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center shrink-0">
                                <User className="text-white text-sm" />
                            </div>
                         )}
                     </div>
                ))}
                {isLoading && (
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center shrink-0">
                           <Bot className="text-white text-sm" />
                       </div>
                       <div className="glass-effect rounded-xl p-4 max-w-md flex items-center">
                           <Loader2 className="h-5 w-5 animate-spin text-primary" />
                       </div>
                    </div>
                )}
            </div>
        </ScrollArea>
        
        <div className="p-4 border-t border-border/50">
             <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
                <Button onClick={() => handleQuickAction("Explain this concept to me.")} variant="outline" className="glass-effect justify-start text-xs hover:border-primary transition-all truncate">
                    <Lightbulb className="mr-2" />
                    Explain concept
                </Button>
                <Button onClick={() => handleQuickAction("Find potential bugs in my code.")} variant="outline" className="glass-effect justify-start text-xs hover:border-primary transition-all truncate">
                    <Bug className="mr-2" />
                    Find bugs
                </Button>
                <Button onClick={() => handleQuickAction("How can I optimize this?")} variant="outline" className="glass-effect justify-start text-xs hover:border-primary transition-all truncate">
                    <Rocket className="mr-2" />
                    Optimize code
                </Button>
                <Button onClick={() => handleQuickAction("What are some best practices for this?")} variant="outline" className="glass-effect justify-start text-xs hover:border-primary transition-all truncate">
                    <Lightbulb className="mr-2" />
                    Best practices
                </Button>
            </div>

            <div className="relative">
                <Input id="aiInput" type="text" placeholder="Ask me anything, like 'What's the difference between REST and GraphQL?'" 
                       className="pr-24 pl-12 h-12 bg-background/50 border-border rounded-xl text-foreground focus:border-primary focus:outline-none"
                       value={input}
                       onChange={(e) => setInput(e.target.value)}
                       onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                       disabled={isLoading} />
                 <div className="absolute left-3 top-1/2 -translate-y-1/2 flex gap-1">
                    <Button onClick={() => toast({title: "File uploads coming soon!"})} variant="ghost" size="icon" className="text-muted-foreground hover:text-primary"><Paperclip/></Button>
                    <Button onClick={() => toast({title: "Image uploads coming soon!"})} variant="ghost" size="icon" className="text-muted-foreground hover:text-primary"><ImageIcon/></Button>
                 </div>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                    <Button onClick={() => toast({title: "Voice input coming soon!"})} variant="ghost" size="icon" className="text-muted-foreground hover:text-primary"><Mic/></Button>
                    <Button id="sendAiMessage" className="btn-primary-gradient text-white rounded-lg w-9 h-9 p-0" onClick={handleSendMessage} disabled={isLoading || !input}>
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}
