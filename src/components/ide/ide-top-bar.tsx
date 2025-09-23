
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bot, ChevronRight, Cog, Loader2, PlusCircle, Send, Share2 } from 'lucide-react';
import type { Challenge } from '@/lib/data';

interface IdeTopBarProps {
    challenge: Challenge;
    onNewProject: () => void;
    onAiClick: () => void;
    onRunCode: () => void;
    onSubmit: () => void;
    isRunning: boolean;
    isSubmitting: boolean;
}

export function IdeTopBar({
    challenge,
    onNewProject,
    onAiClick,
    onRunCode,
    onSubmit,
    isRunning,
    isSubmitting
}: IdeTopBarProps) {
    return (
        <div className="h-12 bg-gray-900 border-b border-blue-500/20 flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" onClick={onNewProject}><PlusCircle className="h-5 w-5"/></Button>
                <Link href="/dashboard" className="text-gray-400 hover:text-white"><ArrowLeft className="h-5 w-5" /></Link>
                <div className="breadcrumb flex items-center space-x-2 text-sm">
                    <span className="text-gray-400">Backend Mentor</span>
                    <ChevronRight className="h-4 w-4 text-gray-600"/>
                    <span className="text-primary">{challenge.title}</span>
                </div>
            </div>
            <div className="flex items-center space-x-4 text-xs text-gray-400">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span>Auto-save enabled</span>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={onAiClick} title="AI Assistant"><Bot className="h-5 w-5"/></Button>
                <Button variant="ghost" size="icon" title="Share Session"><Share2 className="h-5 w-5" /></Button>
                <Button variant="ghost" size="icon" title="Settings"><Cog className="h-5 w-5" /></Button>
                <Button onClick={onRunCode} disabled={isRunning} variant="ghost" className="bg-green-600 text-white hover:bg-green-700 h-8 px-4">
                    {isRunning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />} Run
                </Button>
                <Button onClick={onSubmit} disabled={isSubmitting} size="sm" className="bg-blue-600 text-white hover:bg-blue-700 h-8 px-4">
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                    Submit
                </Button>
            </div>
        </div>
    );
}
