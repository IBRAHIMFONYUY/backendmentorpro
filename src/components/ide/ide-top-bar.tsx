
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bot, ChevronRight, Cog, Loader2, Play, PlusCircle, Send, Share2 } from 'lucide-react';
import type { Challenge } from '@/lib/data';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface IdeTopBarProps {
    challenge: Challenge;
    onNewProject: () => void;
    onAiClick: () => void;
    onSettingsClick: () => void;
    onRunCode: () => void;
    onSubmit: () => void;
    isRunning: boolean;
    isSubmitting: boolean;
}

export function IdeTopBar({
    challenge,
    onNewProject,
    onAiClick,
    onSettingsClick,
    onRunCode,
    onSubmit,
    isRunning,
    isSubmitting
}: IdeTopBarProps) {
    return (
        <div className="h-12 bg-gray-900 border-b border-blue-500/20 flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center space-x-4">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={onNewProject}>
                            <PlusCircle className="h-5 w-5"/>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>New Project</p></TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                         <Link href="/dashboard" className="text-gray-400 hover:text-white">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent><p>Back to Dashboard</p></TooltipContent>
                </Tooltip>
               
                <div className="breadcrumb flex items-center space-x-2 text-sm">
                    <span className="text-gray-400">Backend Mentor</span>
                    <ChevronRight className="h-4 w-4 text-gray-600"/>
                    <span className="text-primary">{challenge.title}</span>
                </div>
            </div>
            <div className="hidden md:flex items-center space-x-4 text-xs text-gray-400">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span>Auto-save enabled</span>
                </div>
            </div>
            <div className="flex items-center gap-2">
                 <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={onAiClick}><Bot className="h-5 w-5"/></Button>
                    </TooltipTrigger>
                    <TooltipContent><p>AI Assistant (Ctrl+/)</p></TooltipContent>
                </Tooltip>
                 <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon"><Share2 className="h-5 w-5" /></Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Share Session</p></TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={onSettingsClick}><Cog className="h-5 w-5" /></Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Settings (Ctrl+,)</p></TooltipContent>
                </Tooltip>
                 <Tooltip>
                    <TooltipTrigger asChild>
                        <Button onClick={onRunCode} disabled={isRunning} variant="ghost" className="bg-green-600 text-white hover:bg-green-700 h-8 px-4">
                            {isRunning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />} Run
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Run Code (F5)</p></TooltipContent>
                </Tooltip>
                 <Tooltip>
                    <TooltipTrigger asChild>
                         <Button onClick={onSubmit} disabled={isSubmitting} size="sm" className="bg-blue-600 text-white hover:bg-blue-700 h-8 px-4">
                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                            Submit
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Submit Solution (Ctrl+Enter)</p></TooltipContent>
                </Tooltip>
            </div>
        </div>
    );
}

    

    