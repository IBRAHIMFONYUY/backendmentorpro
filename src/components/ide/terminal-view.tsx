
import { useState, useRef, useEffect } from 'react';
import type { FileSystemNode } from '@/lib/ide-data';

interface TerminalViewProps {
    terminalOutput: { type: string, content: string }[];
    setTerminalOutput: (updater: (prev: any[]) => any[]) => void;
    files: FileSystemNode;
    onRunTests: () => void;
}

export function TerminalView({ terminalOutput, setTerminalOutput, files, onRunTests }: TerminalViewProps) {
    const [terminalInput, setTerminalInput] = useState('');
    const terminalRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [terminalOutput]);

    const handleTerminalCommand = (command: string) => {
        setTerminalOutput(prev => [...prev, {type: 'command', content: `> ${command}`}]);
        const args = command.split(' ');
        const cmd = args[0].toLowerCase();
        
        // Simulate command execution
        let output: {type: string, content: string}[] = [];
        
        if (command.toLowerCase() === 'help') {
            output.push({type: 'output', content: 'Available commands: ls, clear, test, node, echo, whoami, pwd, cd'});
        } else if (command.toLowerCase() === 'clear') {
            setTerminalOutput([]);
            return;
        } else if (command.toLowerCase() === 'test') {
            output.push({type: 'output', content: 'Running tests...'});
            onRunTests();
        } else if (cmd === 'ls') {
            const node = files.children?.find(f => f.type === 'folder');
            if (node && node.children) {
                 output.push({type: 'output', content: node.children.map(f => f.name).join('  ') || ''});
            } else {
                 output.push({type: 'output', content: ''});
            }
        } else if (cmd === 'node') {
             const fileName = command.split(' ')[1];
             const fileToRun = files.children?.find(f => f.name === fileName);
             if (fileToRun?.content) {
                output.push({type: 'output', content: `Executing ${fileName}...`});
                // This is a simple simulation
                if(fileToRun.content.includes("console.log")) {
                    const match = fileToRun.content.match(/console.log\((.*)\)/);
                    output.push({type: 'output', content: match ? match[1].replace(/['"`]/g, '') : "No output"});
                }
            } else {
                output.push({type: 'error', content: `File not found: ${fileName}`});
            }
        } else if (cmd === 'whoami') {
            output.push({type: 'output', content: 'developer'});
        } else if (cmd === 'pwd') {
            output.push({type: 'output', content: '/'});
        } else if (cmd === 'echo') {
            output.push({type: 'output', content: args.slice(1).join(' ')});
        }
        else {
           output.push({type: 'error', content: `Command not found: ${command}`});
        }

        setTerminalOutput(prev => [...prev, ...output]);
        setTerminalInput('');
    };

    return (
        <div className="h-full flex flex-col bg-[#0a0a0a] rounded-md" onClick={() => inputRef.current?.focus()}>
            <div className="p-2 border-b border-gray-700 text-xs flex justify-between items-center shrink-0">
              <span>Terminal</span>
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
              </div>
            </div>
            <div ref={terminalRef} className="flex-1 terminal p-2 font-mono text-xs overflow-y-auto">
              {terminalOutput.map((line, index) => (
                <div key={index} className={line.type === 'command' ? 'text-gray-400' : line.type === 'error' ? 'text-red-400' : 'text-green-400'}>
                  {line.type === 'ai' ? <span className="text-purple-400">{line.content}</span> : <span dangerouslySetInnerHTML={{ __html: line.content.replace(/ /g, '&nbsp;') }} />}
                </div>
              ))}
               <div className="flex">
                <span className="text-green-400">&gt;&nbsp;</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleTerminalCommand(terminalInput);
                  }}
                  className="terminal-input"
                  spellCheck="false"
                />
              </div>
            </div>
         </div>
    );
}
