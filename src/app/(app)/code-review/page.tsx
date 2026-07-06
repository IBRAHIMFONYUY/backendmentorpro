"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, FileCheck } from "lucide-react";

import { aiCodeReview, AICodeReviewOutput } from "@/ai/flows/ai-code-review";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  code: z.string().min(20, "Please enter at least 20 characters of code."),
  language: z.string().min(1, "Please select a programming language."),
});

type FormValues = z.infer<typeof formSchema>;

export default function CodeReviewPage() {
  const [result, setResult] = useState<AICodeReviewOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      language: "javascript",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await aiCodeReview(values);
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to get code review from AI. Please try again.",
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
          AI Code Review
        </h1>
        <p className="text-lg text-muted-foreground">
          Get instant feedback on your code's quality, performance, and more.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card>
          <CardHeader>
            <CardTitle>Submit Code for Review</CardTitle>
            <CardDescription>
              Paste your code and select the language to get an AI-powered review.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Paste your code snippet or function here..."
                          className="font-code min-h-[300px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Programming Language</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="javascript">JavaScript</SelectItem>
                          <SelectItem value="python">Python</SelectItem>
                          <SelectItem value="typescript">TypeScript</SelectItem>
                          <SelectItem value="go">Go</SelectItem>
                           <SelectItem value="java">Java</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <FileCheck className="mr-2 h-4 w-4" />
                  )}
                  Review My Code
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Review Results</CardTitle>
            <CardDescription>
              The AI's feedback and suggestions will appear below.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="h-full w-full rounded-md border bg-secondary/30 p-4 min-h-[400px]">
              {isLoading && (
                <div className="flex h-full items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
              {result && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Feedback</h3>
                    <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                      {result.feedback}
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Suggestions for Improvement</h3>
                    <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap font-code">
                      {result.suggestions}
                    </div>
                  </div>
                </div>
              )}
              {!isLoading && !result && (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  Your code review will be shown here.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
