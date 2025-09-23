
import { useState, useRef, useEffect } from 'react';
import { ApiPlaygroundView } from '../api-playground-view';
import { CheckCircle, FlaskConical, Loader2, Terminal as TerminalIcon, TestTube, XCircle } from 'lucide-react';
import { TerminalView } from './terminal-view';
import type { FileSystemNode, TestResult } from '@/lib/ide-data';

interface RightPanelProps {
    testResults: TestResult[];
    files: FileSystemNode;
    onRunCode: (setActiveRightPanelTab: (tab: string) => void, setTerminalOutput: (updater: (prev: any[]) => any[]) => void) => void;
    onSubmit: (setActiveRightPanelTab: (tab: string) => void) => void;
}

export function RightPanel({ testResults, files, onRunCode, onSubmit }: RightPanelProps) {
    const [activeTab, setActiveTab] = useState('output');
    const [terminalOutput, setTerminalOutput] = useState([
        { type: 'output', content: 'Welcome to Backend Mentor Terminal' },
        { type: 'output', content: "Type 'help' for available commands" },
        { type: 'ai', content: '[AI] Rahim is ready to assist you!' },
    ]);

    const handleRunCode = () => {
        onRunCode(setActiveTab, setTerminalOutput);
    }

    const handleSubmit = () => {
        onSubmit(setActiveTab);
    }
    
    return (
        <div className="h-full flex flex-col bg-[#161b22]">
            <div className="flex items-center px-2 border-b border-gray-700 h-10 shrink-0">
                <button onClick={() => setActiveTab('output')} className={`px-4 py-2 text-sm flex items-center gap-2 ${activeTab === 'output' ? 'tab-active' : 'text-gray-400'}`}><TerminalIcon className="h-4 w-4"/>Output</button>
                <button onClick={() => setActiveTab('api')} className={`px-4 py-2 text-sm flex items-center gap-2 ${activeTab === 'api' ? 'tab-active' : 'text-gray-400'}`}><FlaskConical className="h-4 w-4"/>API Test</button>
                <button onClick={() => setActiveTab('tests')} className={`px-4 py-2 text-sm flex items-center gap-2 ${activeTab === 'tests' ? 'tab-active' : 'text-gray-400'}`}><TestTube className="h-4 w-4"/>Tests</button>
            </div>
            
            <div className="flex-grow overflow-y-auto">
                <div className="p-4 h-full">
                  {activeTab === 'tests' && (
                    <div className="space-y-2">
                        {testResults.map(result => (
                            <div key={result.name} className={`flex items-start p-2 rounded-md border ${result.status === 'passed' ? 'border-green-500/20 bg-green-500/10' : result.status === 'failed' ? 'border-red-500/20 bg-red-500/10' : 'border-yellow-500/20 bg-yellow-500/10'}`}>
                                {result.status === 'passed' ? <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" /> : result.status === 'failed' ? <XCircle className="h-5 w-5 text-red-500 mt-0.5" /> : <Loader2 className="h-5 w-5 text-yellow-500 mt-0.5 animate-spin"/>}
                                <div className="ml-3">
                                    <p className={`font-medium text-sm ${result.status === 'passed' ? 'text-green-400' : result.status === 'failed' ? 'text-red-400' : 'text-yellow-400'}`}>{result.name}: {result.status}</p>
                                    <p className="text-xs text-muted-foreground">{result.output}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                  )}
                   {activeTab === 'output' && (
                        <TerminalView 
                            terminalOutput={terminalOutput}
                            setTerminalOutput={setTerminalOutput}
                            files={files}
                            onRunTests={handleSubmit}
                        />
                  )}
                  {activeTab === 'api' && (
                    <div className="h-full">
                      <ApiPlaygroundView />
                    </div>
                  )}
                </div>
            </div>
        </div>
    );
}
