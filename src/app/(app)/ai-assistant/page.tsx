'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bot, Loader2, Send, User, Paperclip, Mic, Image as ImageIcon, StopCircle } from 'lucide-react';
import { mentorChat } from '@/ai/flows/mentor-chat';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { speechToText } from '@/ai/flows/speech-to-text';

interface Message {
  type: 'user' | 'ai';
  text: string;
}

export default function AiAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'ai',
      text: `👋 Hi! I'm Rahim, your AI mentor. I'm here to help you on your journey across the entire BackendMentorAI platform. How can I guide you today?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    // Auto-scroll to bottom
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSendMessage = async (messageText?: string) => {
    const currentInput = typeof messageText === 'string' ? messageText : input;
    if (!currentInput.trim() || isLoading) return;

    const userMessage: Message = { type: 'user', text: currentInput };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await mentorChat({ message: currentInput });
      const aiMessage: Message = { type: 'ai', text: result.response };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI chat error:', error);
      toast({
        variant: 'destructive',
        title: 'AI Error',
        description: 'Could not get a response from the AI mentor.',
      });
      const errorMessage: Message = {
        type: 'ai',
        text: "Sorry, I'm having trouble connecting right now. Please try again later.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result as string;
          setIsLoading(true);
          toast({ title: 'Transcribing audio...' });
          try {
            const {text} = await speechToText({audioDataUri: base64Audio});
            if (text) {
              await handleSendMessage(text);
            } else {
              toast({ variant: 'destructive', title: 'Transcription failed. Please try again.' });
            }
          } catch(e) {
            toast({ variant: 'destructive', title: 'Error transcribing audio.' });
            console.error(e);
          } finally {
             setIsLoading(false);
          }
        };
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      toast({ title: 'Recording started...' });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Microphone access denied',
        description: 'Please enable microphone access in your browser settings.',
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast({ title: 'Recording stopped. Processing...' });
    }
  };

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };


  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Bot className="text-primary" />
          AI Mentor Chat
        </h1>
        <p className="text-muted-foreground">Chat with Rahim for guidance, motivation, and advice.</p>
      </header>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="p-4 space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-4 ${
                  message.type === 'user' ? 'justify-end' : ''
                }`}
              >
                {message.type === 'ai' && (
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center shrink-0">
                    <Bot className="text-white" />
                  </div>
                )}
                <div
                  className={`rounded-xl px-4 py-3 max-w-2xl text-base ${
                    message.type === 'user'
                      ? 'bg-primary/20 text-foreground'
                      : 'glass-effect'
                  }`}
                >
                  <p
                    dangerouslySetInnerHTML={{
                      __html: message.text.replace(/\n/g, '<br />'),
                    }}
                  />
                </div>
                {message.type === 'user' && (
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center shrink-0">
                    <User />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center shrink-0">
                  <Bot className="text-white" />
                </div>
                <div className="glass-effect rounded-xl p-4 max-w-md flex items-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

       <div className="p-4 border-t">
        <div className="max-w-4xl mx-auto bg-background/50 border border-border rounded-xl flex items-center">
           <Button
              onClick={() => toast({ title: 'File uploads coming soon!' })}
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-primary shrink-0"
            >
              <Paperclip />
            </Button>
            <Button
              onClick={() => toast({ title: 'Image uploads coming soon!' })}
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-primary shrink-0"
            >
              <ImageIcon />
            </Button>
          <Input
            id="aiInput"
            type="text"
            placeholder="Ask for advice, like 'How do I handle authentication in a microservices architecture?'"
            className="bg-transparent border-0 h-14 text-base text-foreground focus-visible:ring-0 focus-visible:ring-offset-0 flex-1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={isLoading || isRecording}
          />
           <Button
              onClick={handleMicClick}
              variant="ghost"
              size="icon"
              className={`text-muted-foreground shrink-0 ${isRecording ? 'text-red-500 hover:text-red-600' : 'hover:text-primary'}`}
              disabled={isLoading}
            >
              {isRecording ? <StopCircle /> : <Mic />}
            </Button>
            <Button
              id="sendAiMessage"
              className="btn-primary-gradient text-white rounded-lg w-10 h-10 p-0 mr-2 shrink-0"
              onClick={() => handleSendMessage()}
              disabled={isLoading || !input.trim() || isRecording}
            >
              <Send className="h-5 w-5" />
            </Button>
        </div>
      </div>
    </div>
  );
}
