
import { forwardRef, useImperativeHandle, useState } from 'react';
import { ApiPlaygroundView } from '../api-playground-view';
import { CheckCircle, FlaskConical, Loader2, Terminal as TerminalIcon, TestTube, XCircle } from 'lucide-react';
import { TerminalView } from './terminal-view';
import type { FileSystemNode, TestResult } from '@/lib/ide-data';
import { ScrollArea } from '../ui/scroll-area';

interface RightPanelProps {
    testResults: TestResult[];
    files: FileSystemNode;
    handleRunCode: (setActiveRightPanelTab: (tab: string) => void, setTerminalOutput: (updater: (prev: any[]) => any[]) => void) => void;
    handleSubmit: (setActiveRightPanelTab: (tab: string) => void) => void;
    addNode: (path: string, type: 'file' | 'folder') => void;
    deleteNode: (path: string) => void;
}

export const RightPanel = forwardRef((props: RightPanelProps, ref) => {
    const { testResults, files, handleRunCode, handleSubmit, addNode, deleteNode } = props;
    const [activeTab, setActiveTab] = useState('output');
    const [terminalOutput, setTerminalOutput] = useState([
        { type: 'output', content: 'Welcome to Backend Mentor Terminal' },
        { type: 'output', content: "Type 'help' for available commands" },
        { type: 'ai', content: '[AI] Rahim is ready to assist you!' },
    ]);

    useImperativeHandle(ref, () => ({
        runCode: () => handleRunCode(setActiveTab, setTerminalOutput),
        submit: () => handleSubmit(setActiveTab),
    }));

    return (
        <div className="h-full flex flex-col bg-[#1e293b]" data-right-panel-ref>
            <div className="flex items-center px-2 border-b border-gray-700 h-10 shrink-0 bg-gray-900">
                <button onClick={() => setActiveTab('output')} className={`px-4 py-2 text-sm flex items-center gap-2 ${activeTab === 'output' ? 'tab-active' : 'text-gray-400'}`}><TerminalIcon className="h-4 w-4"/>Output</button>
                <button onClick={() => setActiveTab('api')} className={`px-4 py-2 text-sm flex items-center gap-2 ${activeTab === 'api' ? 'tab-active' : 'text-gray-400'}`}><FlaskConical className="h-4 w-4"/>API Test</button>
                <button onClick={() => setActiveTab('tests')} className={`px-4 py-2 text-sm flex items-center gap-2 ${activeTab === 'tests' ? 'tab-active' : 'text-gray-400'}`}><TestTube className="h-4 w-4"/>Tests</button>
            </div>
            
            <div className="flex-grow overflow-y-auto">
                <div className="p-4 h-full">
                  {activeTab === 'tests' && (
                    <ScrollArea className="h-full">
                      <div className="space-y-2">
                          {testResults.map(result => (
                              <div key={result.name} className={`flex items-start p-2 rounded-md border ${result.status === 'passed' ? 'border-green-500/20 bg-green-500/10' : result.status === 'failed' ? 'border-red-500/20 bg-red-500/10' : 'border-yellow-500/20 bg-yellow-500/10'}`}>
                                  {result.status === 'passed' ? <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" /> : result.status === 'failed' ? <XCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" /> : <Loader2 className="h-5 w-5 text-yellow-500 mt-0.5 animate-spin shrink-0"/>}
                                  <div className="ml-3">
                                      <p className={`font-medium text-sm ${result.status === 'passed' ? 'text-green-400' : result.status === 'failed' ? 'text-red-400' : 'text-yellow-400'}`}>{result.name}: {result.status}</p>
                                      <p className="text-xs text-muted-foreground">{result.output}</p>
                                  </div>
                              </div>
                          ))}
                      </div>
                    </ScrollArea>
                  )}
                   {activeTab === 'output' && (
                        <TerminalView 
                            files={files}
                            onRunTests={() => handleSubmit(setActiveTab)}
                            addNode={addNode}
                            deleteNode={deleteNode}
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
});

RightPanel.displayName = "RightPanel";
