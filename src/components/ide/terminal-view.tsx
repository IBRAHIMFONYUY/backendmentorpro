
import { useState, useRef, useEffect } from 'react';
import type { FileSystemNode } from '@/lib/ide-data';

interface TerminalViewProps {
    files: FileSystemNode;
    onRunTests: () => void;
    addNode: (path: string) => void;
    deleteNode: (path: string) => void;
}

export function TerminalView({ files, onRunTests, addNode, deleteNode }: TerminalViewProps) {
    const [terminalInput, setTerminalInput] = useState('');
    const [terminalOutput, setTerminalOutput] = useState([
        { type: 'output', content: 'Welcome to Backend Mentor Terminal' },
        { type: 'output', content: "Type 'help' for available commands" },
    ]);
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    const terminalRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [terminalOutput]);

    const handleTerminalCommand = (command: string) => {
        setTerminalOutput(prev => [...prev, {type: 'command', content: `> ${command}`}]);
        if (command) {
            setHistory(prev => [command, ...prev]);
        }
        setHistoryIndex(-1);

        const args = command.split(' ');
        const cmd = args[0].toLowerCase();
        
        let output: {type: string, content: string}[] = [];
        
        switch(cmd) {
            case 'help':
                output.push({type: 'output', content: `Available commands: ls, cd, cat, clear, test, node, echo, whoami, pwd, mkdir, touch, rm`});
                break;
            case 'clear':
                setTerminalOutput([]);
                setTerminalInput('');
                return;
            case 'test':
                output.push({type: 'output', content: 'Running tests...'});
                onRunTests();
                break;
            case 'ls':
                const children = files.children || [];
                const content = children.map(c => c.name + (c.type === 'folder' ? '/' : '')).join('  ');
                output.push({type: 'output', content: content || '(empty)'});
                break;
             case 'cd':
                output.push({type: 'error', content: 'cd: Not implemented yet'});
                break;
            case 'cat':
                const fileToCat = files.children?.find(f => f.name === args[1] && f.type === 'file');
                if (fileToCat) {
                    output.push({type: 'output', content: fileToCat.content?.replace(/\n/g, '<br/>') || ''});
                } else {
                    output.push({type: 'error', content: `cat: ${args[1]}: No such file`});
                }
                break;
            case 'node':
                 const fileToRun = files.children?.find(f => f.name === args[1]);
                 if (fileToRun?.content) {
                    output.push({type: 'output', content: `Executing ${args[1]}...`});
                    if(fileToRun.content.includes("console.log")) {
                        const match = fileToRun.content.match(/console.log\((.*)\)/);
                        output.push({type: 'output', content: match ? match[1].replace(/['"`]/g, '') : "No output"});
                    } else {
                        output.push({type: 'output', content: 'Execution finished with no output.'});
                    }
                } else {
                    output.push({type: 'error', content: `File not found: ${args[1]}`});
                }
                break;
            case 'whoami':
                output.push({type: 'output', content: 'developer'});
                break;
            case 'pwd':
                output.push({type: 'output', content: '/'});
                break;
            case 'echo':
                output.push({type: 'output', content: args.slice(1).join(' ')});
                break;
            case 'mkdir':
                if (args[1]) {
                    addNode(args[1] + '/'); // Not quite right, needs to be a folder
                    output.push({type: 'output', content: `mkdir: created directory '${args[1]}'`});
                } else {
                    output.push({type: 'error', content: 'mkdir: missing operand'});
                }
                break;
            case 'touch':
                 if (args[1]) {
                    addNode(args[1]);
                    output.push({type: 'output', content: `touch: created file '${args[1]}'`});
                } else {
                    output.push({type: 'error', content: 'touch: missing operand'});
                }
                break;
            case 'rm':
                 if (args[1]) {
                    deleteNode(args[1]);
                    output.push({type: 'output', content: `rm: removed '${args[1]}'`});
                } else {
                    output.push({type: 'error', content: 'rm: missing operand'});
                }
                break;
            default:
               output.push({type: 'error', content: `Command not found: ${command}. Type 'help'.`});
        }

        setTerminalOutput(prev => [...prev, ...output]);
        setTerminalInput('');
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleTerminalCommand(terminalInput);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (history.length > 0 && historyIndex < history.length - 1) {
                const newIndex = historyIndex + 1;
                setHistoryIndex(newIndex);
                setTerminalInput(history[newIndex]);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex > 0) {
                const newIndex = historyIndex - 1;
                setHistoryIndex(newIndex);
                setTerminalInput(history[newIndex]);
            } else if (historyIndex <= 0) {
                setHistoryIndex(-1);
                setTerminalInput("");
            }
        }
    }

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
                  onKeyDown={handleKeyDown}
                  className="terminal-input"
                  spellCheck="false"
                  autoFocus
                />
              </div>
            </div>
         </div>
    );
}
