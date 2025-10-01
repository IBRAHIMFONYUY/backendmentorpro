
'use client';

import { useState, useMemo } from 'react';
import { videos, type Video } from '@/lib/video-data';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Search, Loader2, Wand2, Film, Bot } from 'lucide-react';
import { summarizeVideoContent, type SummarizeVideoContentOutput } from '@/ai/flows/summarize-video-content';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReactMarkdown from 'react-markdown';

export default function VideoLabPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(videos[0] || null);
    const [summary, setSummary] = useState<SummarizeVideoContentOutput | null>(null);
    const [isSummarizing, setIsSummarizing] = useState(false);
    const { toast } = useToast();

    const filteredVideos = useMemo(() =>
        videos.filter(video =>
            video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            video.description.toLowerCase().includes(searchTerm.toLowerCase())
        ), [searchTerm]);
    
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
                                        width="100%"
                                        height="100%"
                                        src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}`}
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
                                    <CardHeader><CardTitle className="flex items-center gap-2"><Bot /> AI Summary</CardTitle></CardHeader>
                                    <CardContent className="prose prose-invert max-w-none">
                                        <ReactMarkdown>{summary.summary}</ReactMarkdown>
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
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            placeholder="Search videos..."
                            className="pl-10 h-12"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Card className="glass-effect">
                        <ScrollArea className="h-[calc(100vh-12rem)]">
                            <div className="p-4 space-y-4">
                                {filteredVideos.map(video => (
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
                            </div>
                        </ScrollArea>
                    </Card>
                </div>
            </div>
        </div>
    );
}
