
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Bot, Bug, Lightbulb, Loader2, Rocket, Send, X, Code, Search, User } from "lucide-react";
import { mentorChat } from "@/ai/flows/mentor-chat";
import { useToast } from "@/hooks/use-toast";

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
            text: `👋 Hi! I'm Rahim, your AI mentor. I can help you with:
<ul class="text-sm mt-2 space-y-1 list-disc list-inside">
    <li>Code reviews and debugging</li>
    <li>Concept explanations</li>
    <li>Best practices and optimization</li>
    <li>Learning path recommendations</li>
</ul>
<p class="text-sm mt-2">What would you like to work on today?</p>`
        }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMessage: Message = { type: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const result = await mentorChat({ message: input });
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
        setTimeout(() => handleSendMessage(), 0);
    }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-effect rounded-2xl p-6 max-w-lg w-full flex flex-col">
        <DialogHeader className="flex flex-row justify-between items-center mb-4 text-left">
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                <Bot className="text-white"/>
            </div>
            <span className="text-2xl font-bold">Rahim - AI Mentor</span>
          </DialogTitle>
          <Button onClick={onClose} variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <X />
          </Button>
        </DialogHeader>

        <div className="flex-grow space-y-6 overflow-y-auto pr-4">
            <div className="bg-background rounded-xl p-4 max-h-80 space-y-4" id="aiChat">
                {messages.map((message, index) => (
                     <div key={index} className={`flex items-start space-x-3 ${message.type === 'user' ? 'justify-end' : ''}`}>
                         {message.type === 'ai' && (
                             <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center shrink-0">
                                <Bot className="text-white text-sm" />
                            </div>
                         )}
                         <div className={`glass-effect rounded-xl p-4 max-w-md ${message.type === 'user' ? 'bg-primary/20' : ''}`}>
                             <div className="text-sm" dangerouslySetInnerHTML={{ __html: message.text.replace(/\n/g, '<br />') }} />
                         </div>
                         {message.type === 'user' && (
                            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center shrink-0">
                                <User className="text-white text-sm" />
                            </div>
                         )}
                     </div>
                ))}
                {isLoading && (
                    <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center shrink-0">
                           <Bot className="text-white text-sm" />
                       </div>
                       <div className="glass-effect rounded-xl p-4 max-w-md flex items-center">
                           <Loader2 className="h-5 w-5 animate-spin" />
                       </div>
                    </div>
                )}
            </div>
        </div>
        
        <div className="pt-4">
            <div className="grid grid-cols-2 gap-3 mb-3">
                <Button onClick={() => handleQuickAction("Explain this code to me like I'm five.")} variant="outline" className="glass-effect justify-start text-sm hover:border-primary transition-all">
                    <Search className="mr-2" />
                    Explain this code
                </Button>
                <Button onClick={() => handleQuickAction("Find potential bugs in the active file.")} variant="outline" className="glass-effect justify-start text-sm hover:border-primary transition-all">
                    <Bug className="mr-2" />
                    Find bugs
                </Button>
                <Button onClick={() => handleQuickAction("How can I optimize this code for performance?")} variant="outline" className="glass-effect justify-start text-sm hover:border-primary transition-all">
                    <Rocket className="mr-2" />
                    Optimize performance
                </Button>
                <Button onClick={() => handleQuickAction("What are the best practices for error handling in Node.js?")} variant="outline" className="glass-effect justify-start text-sm hover:border-primary transition-all">
                    <Lightbulb className="mr-2" />
                    Best practices
                </Button>
            </div>

            <div className="flex space-x-3">
                <Input id="aiInput" type="text" placeholder="Ask me anything..." 
                       className="flex-1 px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:border-primary focus:outline-none"
                       value={input}
                       onChange={(e) => setInput(e.target.value)}
                       onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                       disabled={isLoading} />
                <Button id="sendAiMessage" className="px-6 py-3 btn-primary-gradient text-white rounded-xl" onClick={handleSendMessage} disabled={isLoading}>
                    <Send />
                </Button>
            </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}
