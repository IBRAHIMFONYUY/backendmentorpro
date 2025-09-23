"use client"

import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import React, { useState, useEffect, useRef } from "react"

interface CodeEditorProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
}

// This is a simplified textarea-based editor for now.
// A full Monaco Editor integration would be more complex.
export function CodeEditor({ value, onChange, className, ...props }: CodeEditorProps) {
  const [lineCount, setLineCount] = useState(1);
  const lineCounterRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const lines = value.split('\n').length;
    setLineCount(lines > 0 ? lines : 1);
  }, [value]);

  const handleScroll = () => {
    if (lineCounterRef.current && textareaRef.current) {
      lineCounterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  return (
    <div className={cn("relative h-full w-full font-mono text-sm bg-[#0d1117] rounded-md", className)}>
      <div
        ref={lineCounterRef}
        className="absolute left-0 top-0 h-full w-12 select-none overflow-hidden text-right pr-4 pt-2 text-gray-500"
        aria-hidden="true"
      >
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i} className="h-[1.5em]">
              {i + 1}
            </div>
          ))}
      </div>
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={onChange}
        onScroll={handleScroll}
        className={cn(
          "h-full w-full resize-none border-0 bg-transparent pl-14 font-mono !ring-0 focus:!ring-0 focus-visible:!ring-0",
          "leading-[1.5em]", // Ensure line height matches line numbers
          className
        )}
        spellCheck="false"
        {...props}
      />
    </div>
  )
}
