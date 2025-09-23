
"use client";

import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import type { FileSystemNode } from '@/lib/ide-data';
import { mentorChat } from '@/ai/flows/mentor-chat';
import { useToast } from '@/hooks/use-toast';
import { generateDebuggingAssistance } from '@/ai/flows/generate-debugging-assistance';

interface TerminalViewProps {
    files: FileSystemNode;
    onRunTests: () => void;
    addFile: (name: string, path: string) => boolean;
    addFolder: (name: string, path: string) => boolean;
    deleteNode: (path: string) => boolean;
    currentWorkingDirectory: string;
    setCurrentWorkingDirectory: (path: string) => void;
    onOpenFile: (path: string) => void;
}

type TerminalLine = {
    type: 'output' | 'command' | 'error' | 'ai';
    content: string;
}

const findNode = (path: string, root: FileSystemNode): FileSystemNode | null => {
    if (root.path === path) return root;
    // Handle root path check for children
    if (path === '/') return root;

    const parts = path.split('/').filter(p => p);
    let currentNode: FileSystemNode | undefined = root;
    for (const part of parts) {
        currentNode = currentNode?.children?.find(c => c.name === part);
        if (!currentNode) return null;
    }
    return currentNode;
};

export const TerminalView = forwardRef(({ files, onRunTests, addFile, addFolder, deleteNode, currentWorkingDirectory, setCurrentWorkingDirectory, onOpenFile }: TerminalViewProps, ref) => {
    const [terminalInput, setTerminalInput] = useState('');
    const [terminalOutput, setTerminalOutput] = useState<TerminalLine[]>([
        { type: 'output', content: 'Welcome to Backend Mentor Terminal' },
        { type: 'output', content: "Type 'help' for available commands, or 'rahim' to chat with the AI mentor." },
    ]);
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [chatMode, setChatMode] = useState(false);

    const terminalRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    useImperativeHandle(ref, () => ({
      executeCommand(command: string) {
        handleTerminalCommand(command, true);
      },
      async runWithAIDebugger(code: string, language: string) {
        setTerminalOutput(prev => [...prev, { type: 'output', content: `[AI Runner] Simulating execution of ${language} code...`}]);
        try {
            const result = await generateDebuggingAssistance({ code, language });
            const outputLine: TerminalLine = {
                type: result.hasError ? 'error' : 'output',
                content: result.output.replace(/\n/g, '<br/>')
            };
            setTerminalOutput(prev => [...prev, outputLine]);
        } catch(e) {
            setTerminalOutput(prev => [...prev, { type: 'error', content: 'AI runner failed to analyze the code.'}]);
        }
      }
    }));

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [terminalOutput]);
    
    useEffect(() => {
        const handleCtrlC = (e: KeyboardEvent) => {
            if (chatMode && (e.ctrlKey || e.metaKey) && e.key === 'c') {
                e.preventDefault();
                setChatMode(false);
                setTerminalOutput(prev => [...prev, {type: 'ai', content: '[Rahim] Chat session ended. Returning to terminal.'}]);
                setTerminalInput('');
            }
        };

        window.addEventListener('keydown', handleCtrlC);
        return () => window.removeEventListener('keydown', handleCtrlC);
    }, [chatMode]);


    const resolvePath = (cwd: string, path: string) => {
        if (path.startsWith('/')) return path;
        const newPath = new URL(path, `file://${cwd.endsWith('/') ? cwd : cwd + '/'}`).pathname;
        const parts = newPath.split('/').reduce((acc, part) => {
            if (part === '..') {
                acc.pop();
            } else if (part && part !== '.') {
                acc.push(part);
            }
            return acc;
        }, [] as string[]);
        return '/' + parts.join('/');
    }
    
    const getPrompt = () => {
        if (chatMode) return `<span>&gt;&nbsp;</span>`;

        const path = currentWorkingDirectory === '/' ? '~' : currentWorkingDirectory.split('/').pop();
        return `backendmentor@penguin:<span class="text-blue-400">${path}</span>$&nbsp;`;
    }
    
    const getCommandPrompt = (command: string) => {
        const path = currentWorkingDirectory === '/' ? '~' : currentWorkingDirectory.split('/').pop();
        return `backendmentor@penguin:<span class="text-blue-400">${path}</span>$&nbsp;${command}`;
    }

    const handleTerminalCommand = async (command: string, fromCodeRunner = false) => {
        if (chatMode) {
            setTerminalOutput(prev => [...prev, {type: 'command', content: `> ${command}`}]);
            setTerminalInput('');
            try {
                const result = await mentorChat({ message: command });
                setTerminalOutput(prev => [...prev, {type: 'ai', content: `[Rahim] ${result.response}`}]);
            } catch (error) {
                toast({ variant: 'destructive', title: 'AI Mentor Error', description: 'Could not get response from AI.' });
                setTerminalOutput(prev => [...prev, {type: 'error', content: `[Rahim] Sorry, I'm having trouble connecting.`}]);
            }
            return;
        }

        if (!fromCodeRunner) {
            setTerminalOutput(prev => [...prev, {type: 'command', content: getCommandPrompt(command)}]);
        }
        if (command && command.trim()) {
            setHistory(prev => [command, ...prev].filter((v, i, a) => a.indexOf(v) === i).slice(0, 50));
        }
        setHistoryIndex(-1);

        const args = command.split(' ').filter(Boolean);
        const cmd = args[0]?.toLowerCase();
        
        let output: TerminalLine[] = [];
        
        const getNode = (path: string) => findNode(path, files);

        const getContent = (path: string) => {
            const node = getNode(path);
            return node && node.type === 'file' ? node.content : null;
        }
        
        switch(cmd) {
            case 'help':
                output.push({type: 'output', content: `Available commands: ls, cd, pwd, cat, clear, test, node, echo, whoami, mkdir, touch, rm, vi, nano, cp, mv, find, grep, wc, head, tail, dir, date, uname, hostname, env, history, !, rahim`});
                break;
            case 'rahim':
                setChatMode(true);
                output.push({type: 'ai', content: "[Rahim] Hello! I'm Rahim, your AI coding mentor. Ask me anything. (Press Ctrl+C to exit)"});
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
                const children = findNode(currentWorkingDirectory, files)?.children || [];
                const content = children.map(c => c.name + (c.type === 'folder' ? '/' : '')).join('  ');
                output.push({type: 'output', content: content || '(empty)'});
                break;
             case 'cd':
                if (args[1]) {
                    const newPath = resolvePath(currentWorkingDirectory, args[1]);
                    const node = getNode(newPath);
                    if (node && node.type === 'folder') {
                        setCurrentWorkingDirectory(newPath);
                    } else {
                        output.push({type: 'error', content: `cd: ${args[1]}: No such directory`});
                    }
                } else {
                    setCurrentWorkingDirectory('/');
                }
                break;
            case 'cat':
                if (args[1]) {
                    const path_to_cat = resolvePath(currentWorkingDirectory, args[1]);
                    const fileToCat = getNode(path_to_cat);
                    if (fileToCat && fileToCat.type === 'file') {
                        output.push({type: 'output', content: fileToCat.content?.replace(/\n/g, '<br/>') || ''});
                    } else {
                        output.push({type: 'error', content: `cat: ${args[1]}: No such file. Usage: cat <filename>`});
                    }
                } else {
                    output.push({type: 'error', content: 'cat: missing file operand. Usage: cat <filename>'});
                }
                break;
            case 'node':
                 if (args[1]) {
                    const path_to_run = resolvePath(currentWorkingDirectory, args[1]);
                    const fileToRun = getNode(path_to_run);
                    if (fileToRun?.content) {
                       if (!fromCodeRunner) output.push({type: 'output', content: `Executing ${args[1]}...`});
                       const logOutput: string[] = [];
                       const originalConsoleLog = console.log;
                       console.log = (...args: any[]) => {
                           logOutput.push(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' '));
                       };
                       try {
                          // eslint-disable-next-line no-new-func
                          new Function(fileToRun.content)();
                       } catch(e: any) {
                          logOutput.push(`Error: ${e.message}`);
                       }
                       console.log = originalConsoleLog;

                       if (logOutput.length > 0) {
                           output.push({type: 'output', content: logOutput.join('<br/>')});
                       } else if (!fromCodeRunner) {
                           output.push({type: 'output', content: 'Execution finished with no output.'});
                       }
                   } else {
                       output.push({type: 'error', content: `File not found: ${args[1]}`});
                   }
                } else {
                    output.push({type: 'error', content: 'node: missing file operand. Usage: node <filename.js>'});
                }
                break;
            case 'whoami':
                output.push({type: 'output', content: 'developer'});
                break;
            case 'pwd':
                output.push({type: 'output', content: currentWorkingDirectory});
                break;
            case 'echo':
                output.push({type: 'output', content: args.slice(1).join(' ')});
                break;
            case 'mkdir':
                if (args[1]) {
                    if (addFolder(args[1], currentWorkingDirectory)) {
                        output.push({type: 'output', content: `mkdir: created directory '${args[1]}'`});
                    } else {
                         output.push({type: 'error', content: `mkdir: cannot create directory '${args[1]}': File exists`});
                    }
                } else {
                    output.push({type: 'error', content: 'mkdir: missing operand. Usage: mkdir <directory_name>'});
                }
                break;
            case 'touch':
                 if (args[1]) {
                    if(addFile(args[1], currentWorkingDirectory)) {
                        output.push({type: 'output', content: `touch: created file '${args[1]}'`});
                    } else {
                        output.push({type: 'error', content: `touch: cannot create file '${args[1]}': File exists`});
                    }
                } else {
                    output.push({type: 'error', content: 'touch: missing file operand. Usage: touch <filename>'});
                }
                break;
            case 'rm':
                 if (args[1]) {
                    if(deleteNode(resolvePath(currentWorkingDirectory, args[1]))) {
                        output.push({type: 'output', content: `rm: removed '${args[1]}'`});
                    } else {
                        output.push({type: 'error', content: `rm: cannot remove '${args[1]}': No such file or directory`});
                    }
                } else {
                    output.push({type: 'error', content: 'rm: missing operand. Usage: rm <file_or_directory_path>'});
                }
                break;
            case 'vi':
            case 'nano':
                if (args[1]) {
                    const filePath = resolvePath(currentWorkingDirectory, args[1]);
                    const node = getNode(filePath);
                    if (node && node.type === 'file') {
                        onOpenFile(filePath);
                    } else {
                         output.push({type: 'error', content: `${cmd}: ${args[1]}: No such file. Usage: ${cmd} <filename>`});
                    }
                } else {
                    output.push({type: 'error', content: `${cmd}: missing file operand. Usage: ${cmd} <filename>`});
                }
                break;
            case 'date':
                 output.push({type: 'output', content: new Date().toString()});
                 break;
            case 'uname':
                 output.push({type: 'output', content: 'Linux'});
                 break;
            case 'hostname':
                 output.push({type: 'output', content: 'backend-mentor'});
                 break;
            case 'history':
                output.push({type: 'output', content: history.slice().reverse().map((h, i) => `${i + 1}  ${h}`).join('<br/>')});
                break;
            case '!':
                if (args[1]) {
                    const histNum = parseInt(args[1], 10);
                    if (!isNaN(histNum) && histNum > 0 && histNum <= history.length) {
                        const commandToRun = history[history.length - histNum];
                        await handleTerminalCommand(commandToRun);
                    } else {
                         output.push({type: 'error', content: `!: event not found: ${args[1]}`});
                    }
                } else {
                    output.push({type: 'error', content: `!: missing history number. Usage: ! <history_number>`});
                }
                return; // Prevent double output
            case 'wc':
                if (args[1]) {
                    const content = getContent(resolvePath(currentWorkingDirectory, args[1]));
                    if (content !== null) {
                        const lines = content.split('\n').length;
                        const words = content.split(/\s+/).filter(Boolean).length;
                        const chars = content.length;
                        output.push({type: 'output', content: `${lines} ${words} ${chars} ${args[1]}`});
                    } else {
                        output.push({type: 'error', content: `wc: ${args[1]}: No such file. Usage: wc <filename>`});
                    }
                } else {
                    output.push({type: 'error', content: 'wc: missing file operand. Usage: wc <filename>'});
                }
                break;
            case 'head':
                 if (args[1]) {
                    const content = getContent(resolvePath(currentWorkingDirectory, args[1]));
                    if (content !== null) {
                       output.push({type: 'output', content: content.split('\n').slice(0, 10).join('<br/>')});
                    } else {
                        output.push({type: 'error', content: `head: ${args[1]}: No such file. Usage: head <filename>`});
                    }
                } else {
                    output.push({type: 'error', content: 'head: missing file operand. Usage: head <filename>'});
                }
                break;
            case 'tail':
                 if (args[1]) {
                    const content = getContent(resolvePath(currentWorkingDirectory, args[1]));
                    if (content !== null) {
                       output.push({type: 'output', content: content.split('\n').slice(-10).join('<br/>')});
                    } else {
                        output.push({type: 'error', content: `tail: ${args[1]}: No such file. Usage: tail <filename>`});
                    }
                } else {
                    output.push({type: 'error', content: 'tail: missing file operand. Usage: tail <filename>'});
                }
                break;
             case 'dir':
                await handleTerminalCommand('ls ' + args.slice(1).join(' '));
                return;
            case 'env':
                output.push({type: 'output', content: `PWD=${currentWorkingDirectory}<br/>USER=developer<br/>SHELL=/bin/bash`});
                break;
            case '': // Empty command
                break;
            default:
               output.push({type: 'error', content: `Command not found: ${command}. Type 'help'.`});
        }

        setTerminalOutput(prev => [...prev, ...output]);
        setTerminalInput('');
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
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
        } else if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
            e.preventDefault();
            setTerminalOutput([]);
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
            <div ref={terminalRef} className="flex-1 terminal p-2 font-mono text-xs">
              {terminalOutput.map((line, index) => (
                <div key={index} className={line.type === 'command' ? 'text-gray-400' : line.type === 'error' ? 'text-red-400' : line.type === 'ai' ? 'text-purple-400' : 'text-green-400'}>
                   <span dangerouslySetInnerHTML={{ __html: line.content.replace(/ /g, '&nbsp;') }} />
                </div>
              ))}
               <div className="flex">
                <span className="text-green-400" dangerouslySetInnerHTML={{ __html: getPrompt() }} />
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
});

TerminalView.displayName = 'TerminalView';
