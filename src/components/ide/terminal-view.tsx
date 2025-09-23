
"use client";

import { useState, useRef, useEffect } from 'react';
import type { FileSystemNode } from '@/lib/ide-data';

interface TerminalViewProps {
    files: FileSystemNode;
    onRunTests: () => void;
    addNode: (name: string, type: 'file' | 'folder') => void;
    deleteNode: (path: string) => void;
    currentWorkingDirectory: string;
    setCurrentWorkingDirectory: (path: string) => void;
    onOpenFile: (path: string) => void;
}

const findNode = (path: string, root: FileSystemNode): FileSystemNode | null => {
    if (root.path === path) return root;
    if (path === '/') return root;
    if (!root.children) return null;
    const parts = path.split('/').filter(p => p);
    let currentNode: FileSystemNode = root;
    for (const part of parts) {
        const found = currentNode.children?.find(c => c.name === part);
        if (found) {
            currentNode = found;
        } else {
            return null;
        }
    }
    return currentNode;
};


export function TerminalView({ files, onRunTests, addNode, deleteNode, currentWorkingDirectory, setCurrentWorkingDirectory, onOpenFile }: TerminalViewProps) {
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

    const resolvePath = (cwd: string, path: string) => {
        if (path.startsWith('/')) return path;
        const newPath = new URL(path, `file://${cwd.endsWith('/') ? cwd : cwd + '/'}`).pathname;
        return newPath;
    }

    const handleTerminalCommand = (command: string) => {
        setTerminalOutput(prev => [...prev, {type: 'command', content: `> ${command}`}]);
        if (command) {
            setHistory(prev => [command, ...prev]);
        }
        setHistoryIndex(-1);

        const args = command.split(' ').filter(Boolean);
        const cmd = args[0].toLowerCase();
        
        let output: {type: string, content: string}[] = [];
        
        const getNode = (path: string) => findNode(path, files);

        const getContent = (path: string) => {
            const node = getNode(path);
            return node && node.type === 'file' ? node.content : null;
        }
        
        switch(cmd) {
            case 'help':
                output.push({type: 'output', content: `Available commands: ls, cd, pwd, cat, clear, test, node, echo, whoami, mkdir, touch, rm, vi, nano, cp, mv, find, grep, wc, head, tail, dir, date, uname, hostname, env, history, !`});
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
                        output.push({type: 'error', content: `cat: ${args[1]}: No such file`});
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
                       output.push({type: 'output', content: `Executing ${args[1]}...`});
                       if(fileToRun.content.includes("console.log")) {
                           const matches = fileToRun.content.matchAll(/console.log\((.*?)\)/g);
                           let hasOutput = false;
                           for (const match of matches) {
                              output.push({type: 'output', content: match ? match[1].replace(/['"`]/g, '') : "No output"});
                              hasOutput = true;
                           }
                            if (!hasOutput) {
                               output.push({type: 'output', content: 'Execution finished with no output.'});
                            }
                       } else {
                           output.push({type: 'output', content: 'Execution finished with no output.'});
                       }
                   } else {
                       output.push({type: 'error', content: `File not found: ${args[1]}`});
                   }
                } else {
                    output.push({type: 'error', content: 'node: missing file operand. Usage: node <filename>'});
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
                    addNode(args[1], 'folder');
                    output.push({type: 'output', content: `mkdir: created directory '${args[1]}'`});
                } else {
                    output.push({type: 'error', content: 'mkdir: missing operand. Usage: mkdir <directory_name>'});
                }
                break;
            case 'touch':
                 if (args[1]) {
                    addNode(args[1], 'file');
                    output.push({type: 'output', content: `touch: created file '${args[1]}'`});
                } else {
                    output.push({type: 'error', content: 'touch: missing file operand. Usage: touch <filename>'});
                }
                break;
            case 'rm':
                 if (args[1]) {
                    deleteNode(resolvePath(currentWorkingDirectory, args[1]));
                    output.push({type: 'output', content: `rm: removed '${args[1]}'`});
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
                         output.push({type: 'error', content: `${cmd}: ${args[1]}: No such file`});
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
            case 'wc':
                if (args[1]) {
                    const content = getContent(resolvePath(currentWorkingDirectory, args[1]));
                    if (content !== null) {
                        const lines = content.split('\n').length;
                        const words = content.split(/\s+/).filter(Boolean).length;
                        const chars = content.length;
                        output.push({type: 'output', content: `${lines} ${words} ${chars} ${args[1]}`});
                    } else {
                        output.push({type: 'error', content: `wc: ${args[1]}: No such file`});
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
                        output.push({type: 'error', content: `head: ${args[1]}: No such file`});
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
                        output.push({type: 'error', content: `tail: ${args[1]}: No such file`});
                    }
                } else {
                    output.push({type: 'error', content: 'tail: missing file operand. Usage: tail <filename>'});
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
                <span className="text-green-400">{currentWorkingDirectory}$&nbsp;</span>
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

    

    