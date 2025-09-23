
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

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [terminalOutput]);

    const handleTerminalCommand = (command: string) => {
        const newOutput = [...terminalOutput, {type: 'command', content: `> ${command}`}];
        const args = command.split(' ');
        const cmd = args[0].toLowerCase();
        
        // Simulate command execution
        if (command.toLowerCase() === 'help') {
            newOutput.push({type: 'output', content: 'Available commands: ls, clear, test, node'});
        } else if (command.toLowerCase() === 'clear') {
            setTerminalOutput([]);
            return;
        } else if (command.toLowerCase() === 'test') {
            newOutput.push({type: 'output', content: 'Running tests...'});
            onRunTests();
        } else if (command.toLowerCase() === 'ls') {
            newOutput.push({type: 'output', content: files.children?.map(f => f.name).join('  ') || ''});
        } else if (command.toLowerCase().startsWith('node ')) {
            const fileName = command.split(' ')[1];
            const fileToRun = files.children?.find(f => f.name === fileName);
            if (fileToRun) {
                newOutput.push({type: 'output', content: `Executing ${fileName}...`});
                newOutput.push({type: 'output', content: fileToRun.content?.split('\n')[1] || ''});
            } else {
                newOutput.push({type: 'error', content: `File not found: ${fileName}`});
            }
        }
        else {
           newOutput.push({type: 'error', content: `Command not found: ${command}`});
        }

        setTerminalOutput(newOutput);
        setTerminalInput('');
    };

    return (
        <div className="h-full flex flex-col">
            <div className="p-2 border-b border-gray-700 text-xs flex justify-between items-center">
              <span>Terminal</span>
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
              </div>
            </div>
            <div ref={terminalRef} className="flex-1 terminal p-2 font-mono text-xs">
              {terminalOutput.map((line, index) => (
                <div key={index} className={line.type === 'command' ? 'text-gray-400' : line.type === 'error' ? 'text-red-400' : 'text-green-400'}>
                  {line.type === 'ai' ? <span className="text-purple-400">{line.content}</span> : line.content}
                </div>
              ))}
            </div>
            <div className="flex bg-[#0d1117] p-1">
                <span className="text-green-400">{'>'}</span>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleTerminalCommand(terminalInput);
                  }}
                  className="terminal-input ml-2"
                  placeholder="Type command..."
                />
              </div>
         </div>
    );
}
