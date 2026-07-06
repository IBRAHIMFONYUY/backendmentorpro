import { Users } from "lucide-react";

export default function CollaborationPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-8 text-center">
       <div className="p-6 bg-primary/10 rounded-full mb-6">
        <Users className="h-12 w-12 text-primary" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-2 font-headline">
        Collaborative Coding Environments
      </h1>
      <p className="text-lg text-muted-foreground max-w-lg mb-6">
        Coming soon! Work together on challenges in real-time with integrated voice and video chat. The perfect tool for pair programming and team practice.
      </p>
       <p className="text-sm text-muted-foreground">This feature is under construction.</p>
    </div>
  );
}
