"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Lightbulb, Code } from "lucide-react";

import { generateProjectIdeas, ProjectIdeaOutput } from "@/ai/flows/ai-project-ideas";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  technologies: z.string().min(2, "Please enter at least one technology."),
  skillLevel: z.string().min(1, "Please select your skill level."),
});

type FormValues = z.infer<typeof formSchema>;

export default function ProjectIdeasPage() {
  const [result, setResult] = useState<ProjectIdeaOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      technologies: "React, Node.js, Firebase",
      skillLevel: "intermediate",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await generateProjectIdeas(values);
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to generate project ideas. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-1 font-headline">
          AI Project Idea Generator
        </h1>
        <p className="text-lg text-muted-foreground">
          Never run out of project ideas again. Get inspired for your next build.
        </p>
      </div>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Define Your Project</CardTitle>
          <CardDescription>
            Tell us your skill level and preferred technologies to get tailored ideas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="skillLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Skill Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your skill level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="technologies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Technologies</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., React, Python, Docker"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Lightbulb className="mr-2 h-4 w-4" />
                )}
                Generate Ideas
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {isLoading && (
         <div className="flex justify-center items-center py-16">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      )}

      {result && result.projectIdeas && (
        <div>
            <h2 className="text-2xl font-bold tracking-tight mb-4 font-headline">Generated Ideas</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {result.projectIdeas.map((idea, index) => (
              <Card key={index} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{idea.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground mb-4">{idea.description}</p>
                   <div className="flex flex-wrap gap-2">
                    {idea.suggestedTechStack.split(',').map((tech) => (
                      <Badge key={tech.trim()} variant="secondary">{tech.trim()}</Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                    <Button variant="outline" className="w-full">
                        <Code className="mr-2 h-4 w-4"/> View Challenge
                    </Button>
                </CardFooter>
              </Card>
            ))}
            </div>
        </div>
      )}
    </div>
  );
}
