"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { CodeEditor } from "@/components/code-editor";
import { Loader2, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ResponseData = {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: any;
};

export function ApiPlaygroundView() {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("https://jsonplaceholder.typicode.com/posts/1");
  const [headers, setHeaders] = useState(`{\n  "Content-Type": "application/json"\n}`);
  const [body, setBody] = useState(`{\n  "key": "value"\n}`);
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSend = async () => {
    setIsLoading(true);
    setResponse(null);

    let parsedHeaders = {};
    try {
      if (headers.trim()) parsedHeaders = JSON.parse(headers);
    } catch (e) {
      toast({ variant: "destructive", title: "Invalid Headers", description: "Headers must be valid JSON." });
      setIsLoading(false);
      return;
    }

    let parsedBody = null;
    if (method !== "GET" && method !== "DELETE") {
      try {
        if (body.trim()) parsedBody = JSON.parse(body);
      } catch (e) {
        toast({ variant: "destructive", title: "Invalid Body", description: "Body must be valid JSON." });
        setIsLoading(false);
        return;
      }
    }

    try {
      const res = await fetch(url, {
        method,
        headers: parsedHeaders,
        body: parsedBody ? JSON.stringify(parsedBody) : undefined,
      });

      const resBody = await res.json();
      const resHeaders: Record<string, string> = {};
      res.headers.forEach((value, key) => {
        resHeaders[key] = value;
      });

      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: resHeaders,
        body: resBody,
      });

    } catch (e) {
      const error = e as Error;
      toast({ variant: "destructive", title: "Request Failed", description: error.message });
    }
    setIsLoading(false);
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "text-green-400";
    if (status >= 400 && status < 500) return "text-yellow-400";
    if (status >= 500) return "text-red-400";
    return "text-foreground";
  };

  return (
    <div className="flex flex-col gap-4 h-[calc(100vh-120px)]">
      {/* Request Section */}
      <div className="flex gap-2">
        <Select value={method} onValueChange={setMethod}>
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GET">GET</SelectItem>
            <SelectItem value="POST">POST</SelectItem>
            <SelectItem value="PUT">PUT</SelectItem>
            <SelectItem value="PATCH">PATCH</SelectItem>
            <SelectItem value="DELETE">DELETE</SelectItem>
          </SelectContent>
        </Select>
        <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://api.example.com/data" />
        <Button onClick={handleSend} disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
          Send
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-grow min-h-0">
        <Tabs defaultValue="body" className="flex flex-col">
          <TabsList>
            <TabsTrigger value="body">Body</TabsTrigger>
            <TabsTrigger value="headers">Headers</TabsTrigger>
          </TabsList>
          <TabsContent value="body" className="flex-grow mt-2">
            <CodeEditor value={body} onChange={(e) => setBody(e.target.value)} />
          </TabsContent>
          <TabsContent value="headers" className="flex-grow mt-2">
            <CodeEditor value={headers} onChange={(e) => setHeaders(e.target.value)} />
          </TabsContent>
        </Tabs>

        {/* Response Section */}
        <Card className="flex flex-col">
          <CardContent className="p-0 flex flex-col h-full">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : response ? (
              <div className="flex flex-col h-full">
                <div className="p-4 border-b flex items-center gap-4">
                  <span className="text-sm">Status:</span>
                  <span className={`font-bold ${getStatusColor(response.status)}`}>
                    {response.status} {response.statusText}
                  </span>
                </div>
                <Tabs defaultValue="body" className="flex-grow flex flex-col min-h-0">
                  <TabsList className="m-2">
                    <TabsTrigger value="body">Body</TabsTrigger>
                    <TabsTrigger value="headers">Headers</TabsTrigger>
                  </TabsList>
                  <TabsContent value="body" className="flex-grow mt-0 p-2">
                     <CodeEditor readOnly value={JSON.stringify(response.body, null, 2)} />
                  </TabsContent>
                  <TabsContent value="headers" className="flex-grow mt-0 p-2">
                    <CodeEditor readOnly value={JSON.stringify(response.headers, null, 2)} />
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>Response will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
