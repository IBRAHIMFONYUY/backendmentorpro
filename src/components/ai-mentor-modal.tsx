
"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, X, Minus, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { aiMentorChat } from "@/ai/flows/ai-mentor-chat";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const quickActions = [
    { label: "Explain this code", prompt: "Can you explain the current code in the editor?" },
    { label: "Find bugs", prompt: "Can you find any bugs in my current code?" },
    { label: "Best practices", prompt: "What are the best practices for the code I'm writing?" },
    { label: "Optimize this", prompt: "How can I optimize my current code?" },
    { label: "Give me a hint", prompt: "I'm stuck, can you give me a small hint?" },
];

type AIMentorModalProps = {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    codeContext?: string;
};

type Message = {
    role: 'user' | 'model' | 'loading';
    content: string;
};

export function AIMentorModal({ isOpen, onOpenChange, codeContext }: AIMentorModalProps) {
    const { user } = useAuth();
    const { toast } = useToast();
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'model',
            content: "Hey there! I'm Rahim, your AI Backend Mentor. I specialize in Node.js, Express, and API security. How can I help you level up today? 🚀"
        }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (messageText?: string) => {
        const message = messageText || inputValue;
        if (message.trim() === "" || isLoading) return;

        const newMessages: Message[] = [...messages, { role: 'user', content: message }];
        setMessages(newMessages);
        setInputValue("");
        setIsLoading(true);

        try {
            const response = await aiMentorChat({
                message,
                history: newMessages.filter(m => m.role !== 'loading' && (m.role === 'user' || m.role === 'model')).map(m => ({ role: m.role as 'user' | 'model', content: m.content })),
                user: {
                    name: user?.displayName || "User",
                },
                context: {
                    currentCode: codeContext
                }
            });
            setMessages(prev => [...prev, { role: 'model', content: response.response }]);
        } catch (error) {
            console.error("AI chat error:", error);
            toast({
                title: "Error",
                description: "Failed to get a response from Rahim. Please try again.",
                variant: "destructive"
            });
             setMessages(prev => [...prev.filter(m => m.role !== 'loading')]);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="fixed bottom-4 right-4 max-w-md w-full bg-gray-800/80 backdrop-blur-md border-purple-600 shadow-lg flex flex-col p-0 gap-0 ai-panel !rounded-lg md:w-[32rem] lg:w-[36rem] h-[80vh] max-h-[52rem]">
                <DialogHeader className="p-4 flex flex-row items-center justify-between border-b border-purple-600/20">
                     <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-r from-accent-blue to-accent-purple">
                            <Bot className="text-white h-6 w-6" />
                        </div>
                        <div>
                            <DialogTitle className="text-base font-semibold text-purple-300 text-left">Rahim</DialogTitle>
                            <DialogDescription asChild>
                               <div className="text-xs text-gray-400 flex items-center">
                                 Backend Mentor AI
                                <div className="w-2 h-2 ml-2 bg-green-500 rounded-full animate-pulse" title="Online"></div>
                               </div>
                            </DialogDescription>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-white" onClick={() => onOpenChange(false)}>
                             <Minus className="h-4 w-4" />
                        </Button>
                    </div>
                </DialogHeader>

                <div ref={chatContainerRef} className="p-4 overflow-y-auto flex-1 bg-gray-900/50">
                    <div className="space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={cn('flex items-start space-x-3', msg.role === 'user' ? 'justify-end' : '')}>
                                {msg.role !== 'user' && (
                                     <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-gradient-to-r from-accent-blue to-accent-purple">
                                        <Bot className="text-white h-5 w-5" />
                                    </div>
                                )}
                                <div className={cn(
                                    "rounded-lg p-3 text-sm text-gray-200 max-w-[85%]", 
                                    msg.role === 'model' && 'bg-gray-700/80',
                                    msg.role === 'user' && 'bg-blue-600 text-white',
                                    msg.role === 'loading' && 'bg-gray-700/80 flex items-center justify-center'
                                )}>
                                    {msg.role === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : msg.content}
                                </div>
                                 {msg.role === 'user' && (
                                    <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-gray-600">
                                        <span className="text-sm font-bold">{user?.displayName?.charAt(0) || 'U'}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                         {isLoading && (
                            <div className="flex items-start space-x-3">
                                <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-gradient-to-r from-accent-blue to-accent-purple">
                                    <Bot className="text-white h-5 w-5" />
                                </div>
                                <div className="rounded-lg p-3 text-sm text-gray-200 bg-gray-700/80 flex items-center justify-center">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="p-4 border-t border-purple-600/20">
                     <div className="flex space-x-3 mb-3">
                        <Input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            className="flex-1 bg-gray-700 text-white text-sm rounded-lg px-4 py-2 border border-gray-600 h-10"
                            placeholder="Ask Rahim anything..."
                            disabled={isLoading}
                        />
                        <Button
                            onClick={() => handleSendMessage()}
                            className="bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded-lg text-white"
                            size="icon"
                            disabled={isLoading}
                        >
                           {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                        </Button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {quickActions.map(action => (
                            <button
                                key={action.label}
                                onClick={() => handleSendMessage(action.prompt)}
                                disabled={isLoading}
                                className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded-md text-xs text-gray-300 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {action.label}
                            </button>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
