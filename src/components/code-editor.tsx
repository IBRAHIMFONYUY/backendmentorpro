"use client"

import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import React, { useState, useEffect, useRef } from "react"

interface CodeEditorProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
}

export function CodeEditor({ value, onChange, className, ...props }: CodeEditorProps) {
  const [lineCount, setLineCount] = useState(1);
  const lineCounterRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const lines = value.split('\n').length;
    setLineCount(lines);
  }, [value]);

  const handleScroll = () => {
    if (lineCounterRef.current && textareaRef.current) {
      lineCounterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  return (
    <div className="relative h-full w-full font-mono text-sm bg-background rounded-md border">
      <div
        ref={lineCounterRef}
        className="absolute left-0 top-0 h-full w-12 select-none overflow-hidden bg-muted/30"
        aria-hidden="true"
      >
        <div className="flex flex-col items-end pr-2 pt-3 text-right text-muted-foreground">
          {Array.from({ length: lineCount }, (_, i) => (
            <span key={i} className="block leading-6">
              {i + 1}
            </span>
          ))}
        </div>
      </div>
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={onChange}
        onScroll={handleScroll}
        className={cn(
          "h-full w-full resize-none border-0 bg-transparent pl-14 font-mono !ring-0 focus:!ring-0 focus-visible:!ring-0",
          "leading-6", // Ensure line height matches line numbers
          className
        )}
        {...props}
      />
    </div>
  )
}
