"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Wrench } from "lucide-react";

import { getTechStackRecommendation } from "@/ai/flows/tech-stack-recommendation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  projectDescription: z.string().min(20, "Please provide a more detailed project description."),
});

type FormValues = z.infer<typeof formSchema>;

export default function TechStackPage() {
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectDescription: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await getTechStackRecommendation(values);
      setResult(response.techStackRecommendation);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to get tech stack recommendation. Please try again.",
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
          AI Tech Stack Advisor
        </h1>
        <p className="text-lg text-muted-foreground">
          Describe your project, and let our AI recommend the best technologies for the job.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card>
          <CardHeader>
            <CardTitle>Describe Your Project</CardTitle>
            <CardDescription>
              Be as detailed as possible. Mention key features, target audience, and scalability needs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="projectDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., 'A real-time collaborative whiteboard app with user authentication and payment processing...'"
                          className="min-h-[250px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Wrench className="mr-2 h-4 w-4" />
                  )}
                  Get Recommendation
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Recommended Tech Stack</CardTitle>
            <CardDescription>
              The AI's recommendation will appear below.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="h-full w-full rounded-md border bg-secondary/30 p-4 min-h-[300px]">
              {isLoading && (
                <div className="flex h-full items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
              {result && (
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                  {result}
                </div>
              )}
              {!isLoading && !result && (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  Your recommendation will be shown here.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
