'use client';

import { useState } from 'react';
import { getTechAdvice, type GetTechAdviceOutput } from '@/ai/flows/tech-advisor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, BrainCircuit, Wand2, CheckCircle, Database, Code, Rocket, Boxes } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

function getCategoryIcon(category: string) {
    switch(category.toLowerCase()) {
        case 'programming language':
            return <Code className="h-5 w-5 text-primary"/>
        case 'database':
            return <Database className="h-5 w-5 text-green-400"/>
        case 'framework':
            return <Boxes className="h-5 w-5 text-secondary"/>
        case 'deployment':
            return <Rocket className="h-5 w-5 text-accent"/>
        default:
            return <BrainCircuit className="h-5 w-5 text-muted-foreground"/>
    }
}

export default function TechAdvisorPage() {
    const [projectDescription, setProjectDescription] = useState('');
    const [teamSize, setTeamSize] = useState('solo');
    const [mainGoals, setMainGoals] = useState('');
    const [result, setResult] = useState<GetTechAdviceOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleGetAdvice = async () => {
        if (!projectDescription.trim() || !mainGoals.trim()) {
            toast({
                variant: 'destructive',
                title: 'Missing Information',
                description: 'Please describe your project and its main goals.',
            });
            return;
        }

        setIsLoading(true);
        setResult(null);

        try {
            const response = await getTechAdvice({
                projectDescription,
                teamSize,
                mainGoals,
            });
            setResult(response);
            toast({
                title: 'Advice Generated!',
                description: "Here's a recommended tech stack for your project.",
            });
        } catch (error) {
            console.error('Tech advice error:', error);
            toast({
                variant: 'destructive',
                title: 'Generation Failed',
                description: 'Could not get a response from the AI advisor.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-8 space-y-8">
            <header>
                <h1 className="text-3xl font-bold flex items-center gap-3"><BrainCircuit className="text-primary" />AI Tech Advisor</h1>
                <p className="text-muted-foreground mt-1">Get an expert opinion on the best tech stack for your next project.</p>
            </header>

            <div className="grid lg:grid-cols-2 gap-8">
                 <Card className="glass-effect">
                    <CardHeader>
                        <CardTitle>Describe Your Project</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Project Description</label>
                            <Textarea
                                placeholder="e.g., A real-time collaborative whiteboard application with user authentication and persistent storage."
                                value={projectDescription}
                                onChange={(e) => setProjectDescription(e.target.value)}
                                className="h-32"
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium mb-2">Primary Goals</label>
                            <Input
                                placeholder="e.g., High performance, real-time updates, scalability"
                                value={mainGoals}
                                onChange={(e) => setMainGoals(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Team Size</label>
                             <Select value={teamSize} onValueChange={setTeamSize}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="solo">Solo Developer</SelectItem>
                                    <SelectItem value="small-team">Small Team (2-5)</SelectItem>
                                    <SelectItem value="large-team">Large Team (5+)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={handleGetAdvice} disabled={isLoading} size="lg" className="w-full btn-primary-gradient">
                            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Wand2 className="mr-2 h-5 w-5" />}
                            Get Advice
                        </Button>
                    </CardContent>
                </Card>

                 <Card className="glass-effect">
                    <CardHeader>
                        <CardTitle>Recommended Tech Stack</CardTitle>
                        <CardDescription>Rahim's expert recommendations will appear here.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading && (
                            <div className="flex items-center justify-center h-64">
                                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                            </div>
                        )}
                        {result ? (
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    {result.recommendations.map((rec, index) => (
                                        <div key={index} className="p-3 bg-background/50 rounded-lg">
                                            <h4 className="font-bold text-md flex items-center gap-2 mb-2">
                                                {getCategoryIcon(rec.category)}
                                                {rec.name}
                                                <Badge variant="outline" className="ml-2">{rec.category}</Badge>
                                            </h4>
                                            <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{rec.justification}</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-semibold">Alternatives:</span>
                                                {rec.alternatives.map(alt => <Badge key={alt} variant="secondary">{alt}</Badge>)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg mb-2">Stack Summary</h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{result.summary}</p>
                                </div>
                            </div>
                        ) : !isLoading && (
                            <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                                <BrainCircuit className="h-12 w-12 mb-4" />
                                <h3 className="text-lg font-semibold">Waiting for project details...</h3>
                                <p>Your personalized tech stack advice will appear here.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
