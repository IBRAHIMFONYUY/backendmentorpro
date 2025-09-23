
import { CodeIdeView } from "@/components/code-ide-view";
import { challenges } from "@/lib/data";

export default function DebuggerPage() {
  // This page is deprecated and will be removed. Redirect or show a message.
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="text-muted-foreground">The Code Editor has been moved to a new location.</p>
        <p className="text-muted-foreground">Please use the navigation to go to the new Code Editor page.</p>
    </div>
  );
}

    