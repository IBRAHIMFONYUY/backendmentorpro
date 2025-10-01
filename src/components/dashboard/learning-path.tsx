
'use client';

import type { GeneratePersonalizedLearningPathOutput } from "@/ai/flows/generate-personalized-learning-path";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { BookOpen, BrainCircuit, CheckCircle, Code, Film, FileText, Lightbulb, ListTodo, Projector, Rocket } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface LearningPathProps {
    path: GeneratePersonalizedLearningPathOutput;
}

const getStepIcon = (type: string) => {
    switch (type) {
        case 'Challenge': return <Code className="h-4 w-4 text-primary" />;
        case 'Article': return <FileText className="h-4 w-4 text-secondary" />;
        case 'Video': return <Film className="h-4 w-4 text-accent" />;
        case 'Quiz': return <Lightbulb className="h-4 w-4 text-green-400" />;
        case 'Project': return <Projector className="h-4 w-4 text-yellow-400" />;
        default: return <BookOpen className="h-4 w-4 text-muted-foreground" />;
    }
}

export function LearningPath({ path }: LearningPathProps) {
    const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

    const handleStepToggle = (stepId: string) => {
        setCompletedSteps(prev => {
            const newSet = new Set(prev);
            if (newSet.has(stepId)) {
                newSet.delete(stepId);
            } else {
                newSet.add(stepId);
            }
            return newSet;
        });
    }

    const totalSteps = path.modules.reduce((acc, module) => acc + module.steps.length, 0);
    const progress = totalSteps > 0 ? (completedSteps.size / totalSteps) * 100 : 0;

    return (
        <Card className="glass-effect w-full animate-fade-in-up">
            <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-3 text-2xl">
                           <BrainCircuit className="text-primary"/> Your Learning Path: <span className="gradient-text">{path.title}</span>
                        </CardTitle>
                        <CardDescription>
                           Your personalized curriculum to achieve your goals.
                        </CardDescription>
                    </div>
                    <div className="mt-4 md:mt-0 text-right">
                        <div className="text-lg font-bold">{Math.round(progress)}% Complete</div>
                        <p className="text-sm text-muted-foreground">{completedSteps.size} of {totalSteps} steps completed</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="w-full bg-muted rounded-full h-2.5 mb-6">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.5s ease-in-out' }}></div>
                </div>
                <Accordion type="single" collapsible defaultValue={path.modules[0]?.title} className="w-full">
                    {path.modules.map((module, moduleIndex) => (
                        <AccordionItem key={moduleIndex} value={module.title}>
                            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${completedSteps.size >= (moduleIndex * module.steps.length + module.steps.length) ? 'bg-green-500' : 'bg-primary/50'}`}>
                                        {completedSteps.size >= (moduleIndex * module.steps.length + module.steps.length) ? <CheckCircle /> : moduleIndex + 1}
                                    </div>
                                    {module.title}
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-3 pl-11">
                                    {module.steps.map((step, stepIndex) => {
                                        const stepId = `${moduleIndex}-${stepIndex}`;
                                        const isCompleted = completedSteps.has(stepId);
                                        const labUrl = `/lab/${encodeURIComponent(step.title.toLowerCase().replace(/ /g, '-'))}/${step.type}`;
                                        return (
                                            <div key={stepId} className="flex items-start gap-4 p-3 rounded-lg bg-background/50">
                                                <Checkbox 
                                                    id={stepId} 
                                                    checked={isCompleted}
                                                    onCheckedChange={() => handleStepToggle(stepId)}
                                                    className="mt-1"
                                                />
                                                <div className="grid gap-1.5 leading-none">
                                                    <label
                                                        htmlFor={stepId}
                                                        className={`text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${isCompleted ? 'line-through text-muted-foreground' : ''}`}
                                                    >
                                                        {step.title}
                                                    </label>
                                                    <p className={`text-sm text-muted-foreground ${isCompleted ? 'line-through' : ''}`}>
                                                        {step.description}
                                                    </p>
                                                     <div className="flex items-center gap-4 mt-2">
                                                        <Badge variant="outline" className="flex items-center gap-1">
                                                            {getStepIcon(step.type)} {step.type}
                                                        </Badge>
                                                         <Button asChild variant="link" size="sm" className="p-0 h-auto">
                                                            <Link href={labUrl}>Start Now <Rocket className="ml-2 h-3 w-3" /></Link>
                                                        </Button>
                                                     </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    )
}
