
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { generateLabContent, type GenerateLabContentOutput } from '@/ai/flows/generate-lab-content';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Check, CheckCircle, Code, Lightbulb, Loader2, Send, Sparkles, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type QuizQuestion = GenerateLabContentOutput['quiz']['questions'][0];

// Notes Component
const Notes = ({ notes }: { notes: string }) => (
    <Card className="glass-effect">
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><BookOpen/> Notes</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-invert max-w-none">
             <ReactMarkdown
                components={{
                    h1: ({node, ...props}) => <h1 className="text-2xl font-bold mb-4 gradient-text" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-xl font-semibold mb-3 border-b border-border pb-2" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-lg font-semibold mb-2" {...props} />,
                    p: ({node, ...props}) => <p className="leading-relaxed mb-4" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 space-y-2" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4 space-y-2" {...props} />,
                    li: ({node, ...props}) => <li className="mb-2" {...props} />,
                    code: ({node, inline, className, children, ...props}) => {
                        const match = /language-(\w+)/.exec(className || '')
                        return !inline ? (
                          <pre className="bg-background/80 p-4 rounded-md overflow-x-auto"><code className={className} {...props}>{children}</code></pre>
                        ) : (
                          <code className="bg-muted text-foreground px-1.5 py-1 rounded-md" {...props}>{children}</code>
                        )
                    }
                }}
            >{notes}</ReactMarkdown>
        </CardContent>
    </Card>
);


// Quiz Component
const Quiz = ({ questions }: { questions: QuizQuestion[] }) => {
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [submitted, setSubmitted] = useState(false);
    const { toast } = useToast();

    const handleAnswerChange = (questionIndex: number, optionIndex: number) => {
        setAnswers(prev => ({ ...prev, [questionIndex]: optionIndex }));
    };

    const handleSubmit = () => {
        if (Object.keys(answers).length !== questions.length) {
            toast({ variant: 'destructive', title: 'Please answer all questions before submitting.' });
            return;
        }
        setSubmitted(true);
    };

    const score = questions.reduce((acc, q, i) => {
        return acc + (answers[i] === q.correctAnswerIndex ? 1 : 0);
    }, 0);

    return (
        <Card className="glass-effect">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Lightbulb/> Knowledge Check</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {questions.map((q, qIndex) => (
                    <div key={qIndex}>
                        <p className="font-semibold mb-3">{qIndex + 1}. {q.questionText}</p>
                        <RadioGroup
                            onValueChange={(value) => handleAnswerChange(qIndex, parseInt(value))}
                            disabled={submitted}
                        >
                            {q.options.map((opt, oIndex) => {
                                const isCorrect = oIndex === q.correctAnswerIndex;
                                const isSelected = answers[qIndex] === oIndex;
                                return (
                                    <div 
                                        key={oIndex} 
                                        className={cn(
                                            "flex items-center space-x-2 p-3 rounded-md border",
                                            submitted && isCorrect && "bg-green-500/20 border-green-500",
                                            submitted && !isCorrect && isSelected && "bg-red-500/20 border-red-500",
                                        )}
                                    >
                                        <RadioGroupItem value={String(oIndex)} id={`q${qIndex}o${oIndex}`} />
                                        <Label htmlFor={`q${qIndex}o${oIndex}`}>{opt}</Label>
                                         {submitted && isSelected && (isCorrect ? <Check className="ml-auto text-green-500" /> : <X className="ml-auto text-red-500" />)}
                                    </div>
                                );
                            })}
                        </RadioGroup>
                        {submitted && <p className="text-sm mt-2 text-muted-foreground bg-background/50 p-2 rounded-md"><strong>Explanation:</strong> {q.explanation}</p>}
                    </div>
                ))}
                {!submitted ? (
                     <Button onClick={handleSubmit} className="w-full btn-primary-gradient"><Send className="mr-2"/>Submit Quiz</Button>
                ) : (
                    <div className="text-center p-4 bg-muted rounded-lg">
                        <h3 className="text-xl font-bold">Quiz Complete!</h3>
                        <p className="text-2xl font-bold my-2">Your Score: <span className={cn(score / questions.length > 0.7 ? "text-green-400" : "text-yellow-400")}>{score} / {questions.length}</span></p>
                         <Button onClick={() => { setSubmitted(false); setAnswers({}); }} variant="outline">Try Again</Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

// Assignment Component
const Assignment = ({ title, description }: { title: string, description: string }) => (
    <Card className="glass-effect">
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><Code/> Practical Assignment</CardTitle>
            <CardDescription>{title}</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="mb-4">{description}</p>
            <Button asChild>
                <Link href="/challenges">Go to IDE</Link>
            </Button>
        </CardContent>
    </Card>
);

export default function LabPage() {
    const params = useParams();
    const { slug, type } = {
        slug: Array.isArray(params.slug) ? params.slug[0] : '',
        type: Array.isArray(params.slug) ? params.slug[1] : 'Article'
    };
    const topic = decodeURIComponent(slug.replace(/-/g, ' '));
    const [labContent, setLabContent] = useState<GenerateLabContentOutput | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (!topic) return;

        async function fetchLabContent() {
            setIsLoading(true);
            setError(null);
            toast({ title: 'Generating your learning lab...', description: 'Rahim is preparing your materials.' });
            try {
                const content = await generateLabContent({ topic, resourceType: type });
                setLabContent(content);
                toast({ title: 'Lab Ready!', description: `Your lab on "${content.title}" has been generated.` });
            } catch (e) {
                console.error("Failed to generate lab content:", e);
                setError("Could not generate the learning lab. The AI might be busy. Please try again later.");
                toast({ variant: 'destructive', title: 'Generation Failed', description: 'Could not get a response from the AI.' });
            } finally {
                setIsLoading(false);
            }
        }

        fetchLabContent();
    }, [topic, type, toast]);

    const renderSkeleton = () => (
        <div className="space-y-8">
            <Card>
                <CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </CardContent>
            </Card>
            <Card>
                <CardHeader><Skeleton className="h-8 w-1/3" /></CardHeader>
                <CardContent className="space-y-4">
                     <Skeleton className="h-10 w-full" />
                     <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
        </div>
    );

    return (
        <div className="container mx-auto py-8 px-4">
            {isLoading ? (
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-3 mb-6">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <div>
                             <h1 className="text-3xl font-bold capitalize gradient-text">Generating Lab: {topic}</h1>
                             <p className="text-muted-foreground">Please wait while Rahim prepares your personalized learning materials...</p>
                        </div>
                    </div>
                    {renderSkeleton()}
                </div>
            ) : error ? (
                <div className="text-center py-20">
                    <h1 className="text-2xl font-bold text-destructive mb-4">An Error Occurred</h1>
                    <p className="text-muted-foreground">{error}</p>
                    <Button asChild variant="link" className="mt-4"><Link href="/dashboard">Back to Dashboard</Link></Button>
                </div>
            ) : labContent ? (
                 <div className="max-w-4xl mx-auto">
                     <h1 className="text-4xl font-bold mb-2 flex items-center gap-3"><Sparkles className="text-primary"/> Lab: <span className="gradient-text">{labContent.title}</span></h1>
                     <p className="text-muted-foreground text-lg mb-8">Your AI-generated learning environment.</p>
                     <div className="space-y-8">
                         <Notes notes={labContent.notes} />
                         <Quiz questions={labContent.quiz.questions} />
                         <Assignment title={labContent.assignment.title} description={labContent.assignment.description} />
                     </div>
                 </div>
            ) : null}
        </div>
    );
}
