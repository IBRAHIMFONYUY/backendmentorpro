import { DebuggerView } from "@/components/debugger-view";

export default function DebuggerPage() {
  return (
    <>
      <div className="space-y-1 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">AI Debugger</h1>
        <p className="text-muted-foreground">
          Stuck on a bug? Let our AI mentor help you find and fix it.
        </p>
      </div>
      <DebuggerView />
    </>
  );
}
