import { CodeIdeView } from "@/components/code-ide-view";
import { challenges } from "@/lib/data";

export default function DebuggerPage() {
  // Use a default challenge or the first one for the standalone IDE view
  const defaultChallenge = challenges[0];

  return (
    <>
      <div className="space-y-1 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Code Editor</h1>
        <p className="text-muted-foreground">
          A full-featured IDE to build, test, and debug your applications.
        </p>
      </div>
      <CodeIdeView challenge={defaultChallenge} />
    </>
  );
}
