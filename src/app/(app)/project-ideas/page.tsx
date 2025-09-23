'use client';

import { useState } from 'react';
import { generateProjectIdeas, type GenerateProjectIdeasOutput } from '@/ai/flows/generate-project-ideas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Lightbulb, Wand2, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ProjectIdeasPage() {
    const [interests, setInterests] = useState('');
    const [technologies, setTechnologies] = useState('');
    const [difficulty, setDifficulty] = useState('intermediate');
    const [result, setResult] = useState<GenerateProjectIdeasOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleGenerateIdeas = async () => {
        if (!interests.trim() || !technologies.trim()) {
            toast({
                variant: 'destructive',
                title: 'Missing Information',
                description: 'Please describe your interests and preferred technologies.',
            });
            return;
        }

        setIsLoading(true);
        setResult(null);

        try {
            const response = await generateProjectIdeas({
                interests,
                technologies,
                difficulty: difficulty as any,
            });
            setResult(response);
            toast({
                title: 'Ideas Generated!',
                description: 'Here are some project ideas tailored for you.',
            });
        } catch (error) {
            console.error('Project idea generation error:', error);
            toast({
                variant: 'destructive',
                title: 'Generation Failed',
                description: 'Could not get a response from the AI.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-8 space-y-8">
            <header>
                <h1 className="text-3xl font-bold flex items-center gap-3"><Lightbulb className="text-primary" />AI Project Idea Generator</h1>
                <p className="text-muted-foreground mt-1">Stuck on what to build next? Get some inspiration from Rahim.</p>
            </header>

            <Card className="glass-effect max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle>Tell us what you like</CardTitle>
                    <CardDescription>The more detail you provide, the better the suggestions will be.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Your Interests</label>
                            <Input
                                placeholder="e.g., Music, finance, video games, fitness"
                                value={interests}
                                onChange={(e) => setInterests(e.target.value)}
                            />
                        </div>
                        <div>
                             <label className="block text-sm font-medium mb-2">Preferred Technologies</label>
                            <Input
                                placeholder="e.g., Node.js, Python, Serverless, GraphQL"
                                value={technologies}
                                onChange={(e) => setTechnologies(e.target.value)}
                            />
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium mb-2">Difficulty Level</label>
                        <Select value={difficulty} onValueChange={setDifficulty}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="beginner">Beginner</SelectItem>
                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                <SelectItem value="advanced">Advanced</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={handleGenerateIdeas} disabled={isLoading} size="lg" className="w-full btn-primary-gradient">
                        {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Wand2 className="mr-2 h-5 w-5" />}
                        Generate Ideas
                    </Button>
                </CardContent>
            </Card>

            {isLoading && (
                <div className="flex items-center justify-center pt-16">
                    <Loader2 className="h-12 w-12 text-primary animate-spin" />
                </div>
            )}

            {result && (
                <div className="grid lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                    {result.ideas.map((idea, index) => (
                        <Card key={index} className="glass-effect flex flex-col">
                            <CardHeader>
                                <CardTitle>{idea.title}</CardTitle>
                                <CardDescription>{idea.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 flex-grow">
                                <div>
                                    <h4 className="font-semibold mb-2 text-sm">Recommended Tech:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {idea.technologies.map(tech => <Badge key={tech} variant="secondary">{tech}</Badge>)}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2 text-sm">Core Features:</h4>
                                    <ul className="space-y-2 text-muted-foreground text-sm">
                                        {idea.features.map(feature => (
                                            <li key={feature} className="flex items-start gap-2">
                                                <Check className="h-4 w-4 mt-0.5 text-primary shrink-0"/>
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
