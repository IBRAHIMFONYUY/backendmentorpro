import { GraduationCap } from "lucide-react";

export default function LearningPathPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-8 text-center">
      <div className="p-6 bg-primary/10 rounded-full mb-6">
        <GraduationCap className="h-12 w-12 text-primary" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-2 font-headline">
        Personalized Learning Paths
      </h1>
      <p className="text-lg text-muted-foreground max-w-lg mb-6">
        This feature is currently under development. Soon, our AI will create custom learning paths based on your skill level, goals, and preferred technologies.
      </p>
      <p className="text-sm text-muted-foreground">Stay tuned for updates!</p>
    </div>
  );
}
