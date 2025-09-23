import { ApiPlaygroundView } from "@/components/api-playground-view";

export default function ApiPlaygroundPage() {
  return (
    <>
      <div className="space-y-1 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">API Playground</h1>
        <p className="text-muted-foreground">
          Test any HTTP endpoint and inspect the response in real-time.
        </p>
      </div>
      <ApiPlaygroundView />
    </>
  );
}
