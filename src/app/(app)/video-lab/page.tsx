
'use client';

import { useState, useMemo, useRef, useCallback } from 'react';
import { videos, type Video } from '@/lib/video-data';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Search, Loader2, Wand2, Film, Bot, Clock } from 'lucide-react';
import { summarizeVideoContent, type SummarizeVideoContentOutput } from '@/ai/flows/summarize-video-content';
import { smartVideoSearch } from '@/ai/flows/smart-video-search';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReactMarkdown from 'react-markdown';

export default function VideoLabPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [videoList, setVideoList] = useState<Video[]>(videos);
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(videos[0] || null);
    const [summary, setSummary] = useState<SummarizeVideoContentOutput | null>(null);
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const { toast } = useToast();
    const playerRef = useRef<HTMLIFrameElement>(null);

    const handleSelectVideo = (video: Video) => {
        setSelectedVideo(video);
        setSummary(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const handleSummarize = async () => {
        if (!selectedVideo) return;

        setIsSummarizing(true);
        setSummary(null);
        toast({ title: 'Generating summary...', description: 'Rahim is analyzing the video content.' });

        try {
            const result = await summarizeVideoContent({
                title: selectedVideo.title,
                description: selectedVideo.description
            });
            setSummary(result);
            toast({ title: 'Summary Ready!', description: 'The AI-powered summary has been generated.' });
        } catch (error) {
            console.error('Failed to generate summary:', error);
            toast({ variant: 'destructive', title: 'Summarization Failed', description: 'Could not get a response from the AI.' });
        } finally {
            setIsSummarizing(false);
        }
    }

    const handleSearch = useCallback(async () => {
        if (!searchTerm.trim()) {
            setVideoList(videos);
            return;
        }

        setIsSearching(true);
        toast({ title: 'Performing smart search...', description: 'Rahim is finding the best videos for you.' });
        try {
            const results = await smartVideoSearch({ query: searchTerm });
            setVideoList(results.videos);
        } catch (error) {
            console.error('Smart search failed:', error);
            toast({ variant: 'destructive', title: 'Search Failed', description: 'Could not perform AI-powered search.' });
        } finally {
            setIsSearching(false);
        }
    }, [searchTerm, toast]);
    
    const timeToSeconds = (time: string) => {
        const parts = time.split(':').map(Number);
        if (parts.length === 2) {
            return parts[0] * 60 + parts[1];
        }
        if (parts.length === 3) {
            return parts[0] * 3600 + parts[1] * 60 + parts[2];
        }
        return 0;
    }
    
    const seekTo = (time: string) => {
        const seconds = timeToSeconds(time);
        if (playerRef.current && playerRef.current.src) {
             const newSrc = new URL(playerRef.current.src);
             newSrc.searchParams.set('start', String(seconds));
             playerRef.current.src = newSrc.toString();
        }
    }

    return (
        <div className="container mx-auto p-4 md:p-8">
            <header className="mb-8">
                <h1 className="text-4xl font-bold flex items-center gap-3"><Film className="text-primary" /> Video Lab</h1>
                <p className="text-muted-foreground mt-2 text-lg">Explore curated video courses and get AI-powered insights.</p>
            </header>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    {selectedVideo ? (
                        <div className="space-y-6">
                            <Card className="glass-effect">
                                <div className="aspect-video bg-black rounded-t-lg">
                                     <iframe
                                        ref={playerRef}
                                        key={selectedVideo.youtubeId} // Force re-render on video change
                                        width="100%"
                                        height="100%"
                                        src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?enablejsapi=1&autoplay=0`}
                                        title={selectedVideo.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="rounded-t-lg"
                                    ></iframe>
                                </div>
                                <CardHeader>
                                    <CardTitle className="text-2xl">{selectedVideo.title}</CardTitle>
                                    <p className="text-sm text-muted-foreground font-medium">{selectedVideo.channel}</p>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground leading-relaxed">{selectedVideo.description}</p>
                                     <Button onClick={handleSummarize} disabled={isSummarizing} className="mt-4 btn-primary-gradient">
                                        {isSummarizing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                                        Summarize with AI
                                    </Button>
                                </CardContent>
                            </Card>

                            {isSummarizing && (
                                <Card className="glass-effect">
                                    <CardHeader><CardTitle className="flex items-center gap-2"><Bot /> AI Summary</CardTitle></CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="h-4 bg-muted rounded-full animate-pulse w-3/4"></div>
                                        <div className="h-4 bg-muted rounded-full animate-pulse w-full"></div>
                                        <div className="h-4 bg-muted rounded-full animate-pulse w-1/2"></div>
                                    </CardContent>
                                </Card>
                            )}

                            {summary && (
                                 <Card className="glass-effect">
                                    <CardHeader><CardTitle className="flex items-center gap-2"><Bot /> AI Analysis</CardTitle></CardHeader>
                                    <CardContent className="grid md:grid-cols-3 gap-6">
                                        <div className="md:col-span-2 prose prose-invert max-w-none">
                                            <h4 className='text-lg font-semibold mb-2 text-foreground'>Summary</h4>
                                            <ReactMarkdown>{summary.summary}</ReactMarkdown>
                                        </div>
                                        <div>
                                            <h4 className='text-lg font-semibold mb-2'>Key Moments</h4>
                                            <div className="space-y-2">
                                                {summary.keyMoments.map((moment, index) => (
                                                    <button key={index} onClick={() => seekTo(moment.timestamp)} className="w-full text-left p-2 rounded-md hover:bg-muted transition-colors flex items-start gap-2">
                                                        <Clock className="h-4 w-4 mt-1 text-primary shrink-0"/>
                                                        <div>
                                                            <p className="font-mono text-sm text-primary">{moment.timestamp}</p>
                                                            <p className="text-xs text-muted-foreground">{moment.description}</p>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full bg-card rounded-lg border-2 border-dashed">
                            <p className="text-muted-foreground">Select a video to start learning</p>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                     <div className="relative">
                        <Input
                            placeholder="Ask Rahim to find videos, e.g., 'GraphQL vs REST'"
                            className="pl-4 pr-10 h-12"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                         <Button
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                            onClick={handleSearch}
                            disabled={isSearching}
                          >
                            {isSearching ? <Loader2 className="h-4 w-4 animate-spin"/> : <Search className="h-4 w-4" />}
                          </Button>
                    </div>
                    <Card className="glass-effect">
                        <ScrollArea className="h-[calc(100vh-12rem)]">
                            <div className="p-4 space-y-4">
                                {videoList.map(video => (
                                    <div
                                        key={video.id}
                                        className="flex items-start gap-4 cursor-pointer p-2 rounded-lg hover:bg-muted"
                                        onClick={() => handleSelectVideo(video)}
                                    >
                                        <Image
                                            src={video.thumbnailUrl}
                                            alt={video.title}
                                            width={160}
                                            height={90}
                                            className="rounded-md aspect-video object-cover"
                                            data-ai-hint="video thumbnail"
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-semibold leading-tight line-clamp-2">{video.title}</h4>
                                            <p className="text-xs text-muted-foreground mt-1">{video.channel}</p>
                                        </div>
                                    </div>
                                ))}
                                {videoList.length === 0 && !isSearching && (
                                     <div className="text-center text-muted-foreground py-10">
                                        <p>No videos found for your search.</p>
                                     </div>
                                )}
                            </div>
                        </ScrollArea>
                    </Card>
                </div>
            </div>
        </div>
    );
}
