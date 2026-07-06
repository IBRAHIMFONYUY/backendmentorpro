
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from 'next/navigation';
import { getChallenge, Challenge } from "@/services/challenges";
import { Loader2, Play, FlaskConical, CheckCircle, XCircle, Code, Settings, Share, Bot, Trash, Plus, FolderPlus, RefreshCcw, ChevronsLeft, Minimize2, Maximize2, Save, Columns, Eye, Send, File, Folder, Terminal, ChevronRight, ChevronDown, Paperclip, Trophy, Zap, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { runCode, RunCodeOutput } from "@/ai/flows/run-code-flow";
import { aiCodeReview } from "@/ai/flows/ai-code-review";
import { AIMentorModal } from "@/components/ai-mentor-modal";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { aiMentorChat } from "@/ai/flows/ai-mentor-chat";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Enhanced components
import { useGamification, StatsDisplay, AchievementPopup, XPFloatingNotification, Achievement } from "@/components/gamification";
import { NotificationProvider, useNotificationPresets } from "@/components/notifications";
import { executeCommand, CommandContext } from "@/components/terminal-commands";
import { AdvancedSettingsPanel, useAdvancedSettings } from "@/components/advanced-settings";
import { EnhancedAI, useAIContext, AISuggestion } from "@/components/enhanced-ai";

// Monaco Editor Component (enhanced)
const Editor = ({ value, language, options, onMount, onChange, onCursorChange }: { value: string, language: string, options: any, onMount: (editor: any, monaco: any) => void, onChange: (value: string) => void, onCursorChange: (position: any) => void }) => {
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const editorInstanceRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !monacoRef.current) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/monaco-editor@0.44.0/min/vs/loader.js';
      
      script.onload = () => {
        // @ts-ignore
        if (!window.require) {
          setError("Failed to load Monaco Editor's loader. Please check your internet connection and try refreshing the page.");
          return;
        }
        // @ts-ignore
        window.require.config({ paths: { 'vs': 'https://unpkg.com/monaco-editor@0.44.0/min/vs' }});
        // @ts-ignore
        window.require(['vs/editor/editor.main'], (monaco) => {
          monacoRef.current = monaco;
          if (editorRef.current && !editorInstanceRef.current) {
            const editor = monaco.editor.create(editorRef.current!, {
                value: value,
                language: language,
                theme: 'vs-dark',
                automaticLayout: true,
                fontFamily: "JetBrains Mono",
                minimap: { enabled: true },
                scrollBeyondLastLine: true,
                ...options
            });
            editor.onDidChangeModelContent(() => {
                const val = editor.getValue();
                onChange(val);
            });
             editor.onDidChangeCursorPosition((e: any) => {
              onCursorChange(e.position);
            });
            editorInstanceRef.current = editor;
            onMount(editor, monaco);
          }
        }, (err: any) => {
            console.error("Monaco loader error:", err);
            setError("Failed to load Monaco Editor. Please refresh the page.");
        });
      };
      
      script.onerror = (err) => {
          console.error("Script load error:", err);
          setError("Failed to load Monaco Editor script. Please check your ad-blocker or network and refresh.");
      };

      document.body.appendChild(script);
    }
    
    return () => {
        if (editorInstanceRef.current) {
            editorInstanceRef.current.dispose();
            editorInstanceRef.current = null;
        }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
      if(editorInstanceRef.current) {
          if (value !== null && editorInstanceRef.current.getValue() !== value) {
             editorInstanceRef.current.setValue(value);
          }
          if (language) {
             monacoRef.current?.editor.setModelLanguage(editorInstanceRef.current.getModel(), language);
          }
          if(options){
            editorInstanceRef.current.updateOptions(options);
          }
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, language, options]);

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-red-900/20 text-red-300 p-4">
        <div className="text-center">
            <h3 className="font-bold text-lg mb-2">Editor Error</h3>
            <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return <div ref={editorRef} className="h-full w-full" />;
};

interface FileNode {
  type: 'file';
  name: string;
  content: string;
}

interface FolderNode {
  type: 'folder';
  name: string;
  children: Node[];
}

type Node = FileNode | FolderNode;

const initializeVFSFromChallenge = (challenge: Challenge) => {
    const fs: any = { type: 'folder', name: '', children: {} };

    const addNode = (path: string, type: 'file' | 'folder', content = '') => {
        let current = fs;
        const parts = path.split('/').filter(p => p);
        if (parts.length === 0) return;
        for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            if (!current.children[part]) {
                current.children[part] = { type: 'folder', name: part, children: {} };
            }
            current = current.children[part];
        }

        const nodeName = parts[parts.length - 1];
        if (!current.children[nodeName]) {
            current.children[nodeName] = type === 'file'
              ? { type: 'file', name: nodeName, content }
              : { type: 'folder', name: nodeName, children: {} };
        }
    }
    
    const mainFile = challenge.mainFile || (challenge.language === 'python' ? 'main.py' : 'index.js');
    addNode(mainFile, 'file', challenge.starterCode);

    if (challenge.otherFiles) {
        for (const file of challenge.otherFiles) {
            addNode(file.path, 'file', file.content);
        }
    }

    addNode('README.md', 'file', `# ${challenge.title}\n\n${challenge.description}`);
    return fs;
}

export default function EnhancedChallengePage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Enhanced features
  const { stats, achievements, addXP, trackAction } = useGamification();
  const notifications = useNotificationPresets();
  const { settings, updateSettings } = useAdvancedSettings();
  const [aiContext, updateAIContext] = useAIContext();
  
  // State for popups and notifications
  const [xpNotifications, setXpNotifications] = useState<Array<{id: string, amount: number, reason: string}>>([]);
  const [achievementPopups, setAchievementPopups] = useState<Achievement[]>([]);
  
  const [fileSystem, setFileSystem] = useState<{type: string, name: string, children: any}>({ type: 'folder', name: '', children: {} });
  const [openFiles, setOpenFiles] = useState<Set<string>>(new Set());
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [editorInstance, setEditorInstance] = useState<any>(null);
  const [monacoInstance, setMonacoInstance] = useState<any>(null);
  const [fileContent, setFileContent] = useState("");
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set(['/']));
  
  const [rightPanel, setRightPanel] = useState<'output' | 'tests' | 'api'>('output');
  const [output, setOutput] = useState<RunCodeOutput | null>(null);

  const [terminalOutput, setTerminalOutput] = useState<string[]>(['<span class="text-green-400">Welcome to Backend Mentor Enhanced Terminal!</span> Type \'help\' for 50+ available commands.']);
  const [terminalHistory, setTerminalHistory] = useState<string[]>([]);
  const [currentWorkingDirectory, setCurrentWorkingDirectory] = useState("/");
  const [terminalMode, setTerminalMode] = useState<'normal' | 'ai'>('normal');
  const terminalInputRef = useRef<HTMLInputElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  
  const [isAIMentorOpen, setAIMentorOpen] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [newPath, setNewPath] = useState('');
  const [cursorPosition, setCursorPosition] = useState({ lineNumber: 1, column: 1 });
  const [fileSize, setFileSize] = useState(0);
  const [editorOptions, setEditorOptions] = useState({
      theme: 'vs-dark',
      wordWrap: 'on',
      fontSize: 14,
  });
  const [autoSave, setAutoSave] = useState(true);

  const [apiRequest, setApiRequest] = useState({
    method: 'GET',
    url: 'https://jsonplaceholder.typicode.com/posts/1',
    headers: [{key: 'Content-Type', value: 'application/json'}],
    body: ''
  });
  const [apiResponse, setApiResponse] = useState<{status: number, statusText: string, data: any, time: number, size: number} | null>(null);
  const [isApiLoading, setIsApiLoading] = useState(false);

  // Enhanced Terminal Command Context
  const createCommandContext = useCallback((): CommandContext => ({
    getNode,
    getContent,
    setContent,
    addNode,
    removePath,
    handleOpenFile,
    fileSystem,
    state: {
      currentWorkingDirectory,
      output: terminalOutput,
      history: terminalHistory,
      environment: {},
      processes: {},
      aliases: {}
    },
    updateState: (updates) => {
      if (updates.currentWorkingDirectory) setCurrentWorkingDirectory(updates.currentWorkingDirectory);
      if (updates.output) setTerminalOutput(updates.output);
      if (updates.history) setTerminalHistory(updates.history);
    },
    onNotification: (type, message) => {
      notifications.success("Terminal", message);
    },
    onXPGain: (amount, reason) => {
      const result = addXP(amount, reason, 'terminal_command_used');
      if (result.newAchievements.length > 0) {
        setAchievementPopups(prev => [...prev, ...result.newAchievements]);
      }
    },
    onAchievement: trackAction
  }), [fileSystem, currentWorkingDirectory, terminalOutput, terminalHistory, notifications, addXP, trackAction]);

  const getNode = useCallback((path: string, fs = fileSystem) => {
    if (path === '/') return fs;
    const parts = path.split('/').filter(p => p);
    let current = fs;
    for (const part of parts) {
      if (!current.children || !current.children[part]) return null;
      current = current.children[part];
    }
    return current;
  }, [fileSystem]);

  const getContent = useCallback((path: string): string | null => {
    const node = getNode(path);
    if (node && node.type === 'file' && 'content' in node) {
      return node.content as string;
    }
    return null;
  }, [getNode]);

  const setContent = useCallback((path: string, content: string) => {
    setFileSystem(fs => {
        const newFs = JSON.parse(JSON.stringify(fs));
        const parts = path.split('/').filter(p => p);
        let current = newFs;
        for (let i = 0; i < parts.length - 1; i++) {
            if (!current.children[parts[i]]) return fs;
            current = current.children[parts[i]];
        }
        const fileName = parts[parts.length - 1];
        if (current.children[fileName] && current.children[fileName].type === 'file') {
            current.children[fileName].content = content;
        }
        return newFs;
    });
  }, []);

  const handleOpenFile = useCallback((path: string) => {
    const content = getContent(path);
    if (content !== null) {
      if(currentFile && editorInstance) {
        const currentContent = editorInstance.getValue();
        if (currentContent !== getContent(currentFile)) {
           setContent(currentFile, currentContent);
        }
      }
      setCurrentFile(path);
      setFileContent(typeof content === 'string' ? content : "");
      setOpenFiles(prev => new Set(prev).add(path));
      
      // Update AI context
      updateAIContext({
        currentFile: path,
        codeContent: typeof content === 'string' ? content : "",
        fileType: path.split('.').pop() || '',
        openFiles: Array.from(openFiles)
      });
    }
  }, [getContent, currentFile, editorInstance, setContent, updateAIContext, openFiles]);

  const removePath = useCallback((path: string) => {
    let success = false;
    setFileSystem(fs => {
        const newFs = JSON.parse(JSON.stringify(fs));
        const parts = path.split('/').filter(p => p);
        if (parts.length === 0) return fs;
        let current = newFs;
        for (let i = 0; i < parts.length - 1; i++) {
            if (!current.children[parts[i]]) return fs;
            current = current.children[parts[i]];
        }
        const name = parts[parts.length - 1];
        if (current.children[name]) {
            delete current.children[name];
            success = true;
        }
        return newFs;
    });
    if (success) {
      setOpenFiles(prev => {
          const newOpen = new Set(prev);
          newOpen.delete(path);
          if (currentFile === path) {
              const nextFile = Array.from(newOpen)[0] || null;
              if (nextFile) {
                handleOpenFile(nextFile as string);
              } else {
                setCurrentFile(null);
                setFileContent('');
              }
          }
          return newOpen;
      });
    }
    return success;
  }, [currentFile, handleOpenFile]);

  const addNode = useCallback((path: string, type: 'file' | 'folder', content = '') => {
    let success = false;
    setFileSystem(fs => {
        const newFs = JSON.parse(JSON.stringify(fs));
        const parts = path.split('/').filter(p => p);
        if (parts.length === 0) return fs;
        let current = newFs;
        for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            if (!current.children[part] || current.children[part].type !== 'folder') {
                return fs;
            }
            current = current.children[part];
        }
        const nodeName = parts[parts.length - 1];
        if (!current.children[nodeName]) {
            current.children[nodeName] = type === 'file'
              ? { type: 'file', name: nodeName, content }
              : { type: 'folder', name: nodeName, children: {} };
            success = true;
        }
        return newFs;
    });
    return success;
  }, []);

  // Enhanced terminal command handler
  const handleTerminalCommand = useCallback(async (command: string) => {
    const displayCommand = command.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    
    if (terminalMode === 'ai') {
        setTerminalOutput(prev => [...prev, `<span class="text-purple-400">rahim></span> <span class="text-white">${displayCommand}</span>`]);
        setTerminalHistory(prev => [...prev, command]);

        if (command.trim().toLowerCase() === 'exit') {
            setTerminalMode('normal');
            setTerminalOutput(prev => [...prev, '<span class="text-green-400">Exited AI mode.</span>']);
            return;
        }

        setRunning(true);
        try {
            const response = await aiMentorChat({
             message: command,
             history: [],
             context: {
                challengeTitle: challenge?.title,
                challengeDescription: challenge?.description,
                currentCode: fileContent
             }
           });
           setTerminalOutput(prev => [...prev, `[<span class="text-purple-400">Rahim</span>]: ${response.response.replace(/\n/g, '<br/>')}`]);
        } catch (e: any) {
           console.error("AI Mentor chat error:", e);
           setTerminalOutput(prev => [...prev, `[<span class="text-red-500">Rahim</span>]: I'm having trouble connecting right now. (${e.message})`]);
        } finally {
            setRunning(false);
        }
        return;
    }

    // Use enhanced terminal commands
    try {
      const context = createCommandContext();
      const result = await executeCommand(command, context);
      setTerminalOutput(prev => [...prev, ...result]);
      setTerminalHistory(prev => [...prev, command]);
    } catch (error: any) {
      setTerminalOutput(prev => [...prev, `<span class="text-red-500">Error: ${error.message}</span>`]);
    }
  }, [terminalMode, challenge, fileContent, createCommandContext]);

  const handleRunCode = useCallback(async () => {
    if (!challenge || currentFile === null) {
       notifications.error("Error", "No file selected to run");
       return;
    }
    
    setRunning(true);
    setOutput(null);
    setTerminalOutput(prev => [...prev, `$ <span class="text-white">node ${currentFile.split('/').pop()}</span>`]);
    
    try {
      const currentCode = editorInstance?.getValue() || fileContent;
      if (autoSave) setContent(currentFile, currentCode);

      const response = await runCode({
        code: currentCode,
        language: challenge.language,
        testCases: challenge.testCases,
      });
      
      setOutput(response);
      const coloredOutput = response.overallOutput ? response.overallOutput.replace(/\n/g, '<br/>') : '<span class="text-gray-500">Code executed with no output.</span>';
      setTerminalOutput(prev => [...prev, coloredOutput]);
      setRightPanel('tests');
      
      const allTestsPassed = response.testResults.every(r => r.passed);
      const passedCount = response.testResults.filter(r => r.passed).length;
      
      if (allTestsPassed) {
          const xpGained = 25;
          const result = addXP(xpGained, 'All tests passed!', 'perfect_test_coverage');
          
          notifications.testsPassed(passedCount, response.testResults.length);
          setXpNotifications(prev => [...prev, { id: Date.now().toString(), amount: xpGained, reason: 'Perfect test score!' }]);
          
          if (result.newAchievements.length > 0) {
            setAchievementPopups(prev => [...prev, ...result.newAchievements]);
          }
          
          setTerminalOutput(prev => [...prev, '<span class="text-green-400">All tests passed! +25 XP</span>']);
      } else {
          const failedCount = response.testResults.filter(r => !r.passed).length;
          notifications.testsFailed(failedCount, response.testResults.length);
          setTerminalOutput(prev => [...prev, `<span class="text-red-400">${failedCount} test(s) failed.</span>`]);
      }
    } catch (error: any) {
        console.error("Failed to run code:", error);
        let errorMessage = "An error occurred while running your code.";
        if (typeof error.message === 'string' && error.message.includes('503')) {
            errorMessage = "The code execution service is currently overloaded. Please try again in a few moments.";
        }
        setOutput({ overallOutput: '', testResults: [], error: errorMessage });
        setTerminalOutput(prev => [...prev, `<span class="text-red-400">Error: ${errorMessage}</span>`]);
        notifications.error("Execution Error", errorMessage);
    } finally {
      setRunning(false);
    }
  }, [challenge, currentFile, fileContent, editorInstance, autoSave, setContent, addXP, notifications]);

  const handleSubmitCode = useCallback(async () => {
    if (!challenge || !currentFile) return;

    setSubmitting(true);
    setTerminalOutput(prev => [...prev, `$ <span class="text-white">submit</span>`]);
    notifications.info("Submitting...", "Running tests and AI code review");

    try {
      const currentCode = editorInstance?.getValue() || fileContent;
      const [runResult, reviewResult] = await Promise.all([
        runCode({ code: currentCode, language: challenge.language, testCases: challenge.testCases }),
        aiCodeReview({ code: currentCode, language: challenge.language, solution: challenge.solution })
      ]);

      setOutput(runResult);
      setRightPanel('tests');

      const allTestsPassed = runResult.testResults.every(r => r.passed);
      
      setTerminalOutput(prev => [...prev, `<span class="text-purple-400">AI Review Score: ${reviewResult.score}/100</span>`]);
      setTerminalOutput(prev => [...prev, `<span class="text-purple-400">AI Feedback: ${reviewResult.feedback}</span>`]);

      if (allTestsPassed) {
        const xpGained = 100;
        const result = addXP(xpGained, 'Challenge completed!', 'challenge_completed');
        
        notifications.challengeCompleted(challenge.title, reviewResult.score);
        setXpNotifications(prev => [...prev, { id: Date.now().toString(), amount: xpGained, reason: 'Challenge completed!' }]);
        
        if (result.leveledUp) {
          notifications.levelUp(result.stats?.level || 1, result.stats?.rank || 'Novice');
        }
        
        if (result.newAchievements.length > 0) {
          setAchievementPopups(prev => [...prev, ...result.newAchievements]);
        }

        setTerminalOutput(prev => [...prev, '<span class="text-green-400">Challenge Complete! +100 XP 🎉</span>']);
        setTimeout(() => router.push('/dashboard'), 3000);
      } else {
        notifications.error("Submission Incomplete", "Some tests failed. Check the results and AI feedback for hints.");
        setTerminalOutput(prev => [...prev, '<span class="text-red-400">Submission failed. Some tests did not pass.</span>']);
      }

    } catch (error: any) {
        console.error("Failed to submit code:", error);
        notifications.error("Submission Error", "An error occurred during submission. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [challenge, currentFile, editorInstance, fileContent, router, addXP, notifications]);

  // Handle AI suggestions
  const handleSuggestionApply = useCallback((suggestion: AISuggestion) => {
    if (suggestion.code && editorInstance) {
      const selection = editorInstance.getSelection();
      const range = selection || {
        startLineNumber: cursorPosition.lineNumber,
        startColumn: cursorPosition.column,
        endLineNumber: cursorPosition.lineNumber,
        endColumn: cursorPosition.column
      };
      
      editorInstance.executeEdits("ai-suggestion", [{
        range: range,
        text: suggestion.code
      }]);
      
      addXP(10, 'Applied AI suggestion');
      notifications.success("Suggestion Applied", suggestion.title);
    }
  }, [editorInstance, cursorPosition, addXP, notifications]);

  // Initialize challenge
  useEffect(() => {
    async function fetchChallenge() {
      if (!id) return;
      try {
        const fetchedChallenge = await getChallenge(id);
        if (fetchedChallenge) {
          setChallenge(fetchedChallenge);
          
          const fileSystemToUse = initializeVFSFromChallenge(fetchedChallenge);
          setFileSystem(fileSystemToUse);
          
          const mainFile = `/${fetchedChallenge.mainFile || (fetchedChallenge.language === 'python' ? 'main.py' : 'index.js')}`;
          handleOpenFile(mainFile);
          
          // Update AI context
          updateAIContext({
            projectName: fetchedChallenge.title,
            language: fetchedChallenge.language,
            framework: 'Challenge Environment',
            workspaceFiles: Object.keys(fileSystemToUse.children)
          });
        } else {
          notifications.error("Error", "Challenge not found");
        }
      } catch (error) {
        console.error("Failed to fetch challenge:", error);
        notifications.error("Error", "Failed to load the challenge");
      } finally {
        setLoading(false);
      }
    }
    fetchChallenge();
  }, [id, handleOpenFile, updateAIContext, notifications]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalOutput]);

  const handleApiRequest = async () => {
    setIsApiLoading(true);
    const startTime = Date.now();
    try {
        const res = await fetch(apiRequest.url, {
            method: apiRequest.method,
            headers: apiRequest.headers.reduce((acc, h) => {
                if (h.key && h.value) acc[h.key] = h.value;
                return acc;
            }, {} as Record<string, string>),
            body: ['POST', 'PUT'].includes(apiRequest.method) ? apiRequest.body : undefined
        });

        const data = await res.json();
        const size = new Blob([JSON.stringify(data)]).size;
        setApiResponse({
            status: res.status,
            statusText: res.statusText,
            data,
            time: Date.now() - startTime,
            size
        });
        notifications.success("API Success", `Status: ${res.status}`);
    } catch (error: any) {
        setApiResponse({
            status: 500,
            statusText: 'Client Error',
            data: { error: "Failed to fetch. Check the URL and your network connection.", message: error.message },
            time: Date.now() - startTime,
            size: 0
        });
        notifications.error("API Request Error", `Could not fetch from the URL. ${error.message}`);
    } finally {
        setIsApiLoading(false);
    }
  }

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  const updateFileSize = useCallback(() => {
    if(currentFile) {
        const content = getContent(currentFile);
        const contentStr = typeof content === 'string' ? content : "";
        setFileSize(new Blob([contentStr]).size);
    }
  }, [currentFile, getContent]);

  useEffect(() => {
      updateFileSize();
  }, [fileContent, updateFileSize]);

  const handleCreateFile = () => {
    if (addNode(newPath, 'file')) {
      handleOpenFile(`/${newPath}`);
      setIsFileModalOpen(false);
      setNewPath('');
      notifications.success("Success", "File created successfully");
    } else {
      notifications.error("Error", "File already exists or invalid path");
    }
  }

  const handleCreateFolder = () => {
    if (addNode(newPath, 'folder')) {
      setIsFolderModalOpen(false);
      setNewPath('');
      notifications.success("Success", "Folder created successfully");
    } else {
      notifications.error("Error", "Folder already exists or invalid path");
    }
  }

  const FileTree = ({ node, path }: { node: any; path: string }) => {
    const isFolderOpen = openFolders.has(path);

    const toggleFolder = (e: React.MouseEvent) => {
        e.stopPropagation();
        setOpenFolders(prev => {
            const newSet = new Set(prev);
            if (newSet.has(path)) {
                newSet.delete(path);
            } else {
                newSet.add(path);
            }
            return newSet;
        });
    }

    if (!node.children) return null;

    return (
        <div className="space-y-1">
        {Object.keys(node.children).sort((a,b) => {
            const aType = node.children[a].type;
            const bType = node.children[b].type;
            if (aType === 'folder' && bType !== 'folder') return -1;
            if (aType !== 'folder' && bType === 'folder') return 1;
            return a.localeCompare(b);
        }).map(name => {
            const child = node.children[name];
            const newPath = `${path === '/' ? '' : path}/${name}`;
            return (
                <div key={newPath}>
                    {child.type === 'folder' ? (
                        <div>
                            <div className="flex items-center space-x-2 cursor-pointer p-1 rounded hover:bg-blue-500/10" onClick={toggleFolder}>
                                {isFolderOpen ? <ChevronDown className="w-4 h-4 text-gray-500"/> : <ChevronRight className="w-4 h-4 text-gray-500"/>}
                                <Folder className="w-4 h-4 text-blue-400"/>
                                <span>{name}</span>
                            </div>
                            {isFolderOpen && (
                                <div className="pl-4">
                                    <FileTree node={child} path={newPath} />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className={cn("flex items-center space-x-2 cursor-pointer p-1 rounded hover:bg-blue-500/10", currentFile === newPath && "bg-blue-500/20")} onClick={() => handleOpenFile(newPath)}>
                           <File className="w-4 h-4 text-gray-400 ml-4"/>
                           <span>{name}</span>
                        </div>
                    )}
                </div>
            )
        })}
        </div>
    )
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-8 bg-dark-bg">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="flex h-full items-center justify-center p-8 bg-dark-bg">
        <h1 className="text-xl text-destructive">Challenge not found.</h1>
      </div>
    );
  }

  const passedTests = output?.testResults.filter(r => r.passed).length || 0;
  const totalTests = challenge.testCases.length;
  const progress = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

  return (
    <NotificationProvider>
      <div className="h-screen max-h-screen flex flex-col text-white bg-gray-900 relative">
        {/* XP Floating Notifications */}
        {xpNotifications.map((notif) => (
          <XPFloatingNotification
            key={notif.id}
            amount={notif.amount}
            reason={notif.reason}
            onComplete={() => setXpNotifications(prev => prev.filter(n => n.id !== notif.id))}
          />
        ))}

        {/* Achievement Popups */}
        {achievementPopups.map((achievement) => (
          <AchievementPopup
            key={achievement.id}
            achievement={achievement}
            onClose={() => setAchievementPopups(prev => prev.filter(a => a.id !== achievement.id))}
          />
        ))}

        {/* Header with enhanced stats */}
        <div className="h-12 bg-gray-900 border-b border-blue-500/20 flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center space-x-4">
            <a href="/dashboard" className="text-gray-400 hover:text-blue-400 transition-colors" title="Back to Dashboard">
              <ChevronsLeft />
            </a>
            <div className="breadcrumb hidden sm:flex items-center space-x-2 text-sm">
              <span className="text-gray-400">Backend Mentor</span>
              <span className="text-gray-600 text-xs">&gt;</span>
              <span className="active">{challenge.title}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Stats Display */}
            <StatsDisplay stats={stats} compact />
            
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-blue-400 transition-colors" title="Share Session">
              <Share className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-400 hover:text-blue-400 transition-colors" 
              title="Advanced Settings" 
              onClick={() => setIsSettingsOpen(true)}
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-400 hover:text-purple-400 transition-colors" 
              title="Rahim AI Assistant" 
              onClick={() => setAIMentorOpen(true)}
            >
              <Bot className="h-4 w-4" />
            </Button>
            <Button onClick={handleRunCode} disabled={running} className="bg-green-600 hover:bg-green-700 px-4 py-1 rounded text-sm font-medium transition-colors">
              {running ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
              Run
            </Button>
            <Button onClick={handleSubmitCode} disabled={submitting} className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded text-sm font-medium transition-colors">
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Paperclip className="mr-2 h-4 w-4" />}
              Submit
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className={cn("flex flex-1 overflow-hidden", isZenMode ? "flex-row" : "flex-col md:flex-row")}>
          {/* Left Sidebar */}
          <div className={cn("w-full md:w-64 bg-gray-900/50 flex flex-col transition-all duration-300", isZenMode ? 'w-0 p-0 hidden' : 'block')}>
            <div className="p-3 border-b border-gray-700 flex items-center justify-between flex-shrink-0">
              <h3 className="text-sm font-semibold text-gray-300">PROJECT</h3>
              <div className="flex space-x-2">
                 <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-blue-400" title="New File" onClick={() => setIsFileModalOpen(true)}><Plus /></Button>
                 <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-blue-400" title="New Folder" onClick={() => setIsFolderModalOpen(true)}><FolderPlus/></Button>
                 <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-blue-400" title="Refresh Files" onClick={() => notifications.info("Info", "Files Refreshed")}><RefreshCcw /></Button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div>
                  <h2 className="text-lg font-bold mb-2">{challenge.title}</h2>
                  <p className="text-sm text-gray-400 mb-4">{challenge.description}</p>
                  <div className="flex flex-wrap gap-2">
                      {challenge.tags.map(tag => (
                          <div key={tag} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">{tag}</div>
                      ))}
                  </div>
                </div>
                
                <div className="border-t border-gray-700 pt-4">
                  <h3 className="text-sm font-semibold text-gray-300 mb-2">FILES</h3>
                  <div className="text-sm text-gray-400 bg-gray-800 p-2 rounded">
                    <FileTree node={fileSystem} path="/" />
                  </div>
                </div>
                
                {/* Enhanced progress section */}
                <div className="border-t border-gray-700 pt-4">
                  <h3 className="text-sm font-semibold text-gray-300 mb-2">PROGRESS</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>Tests</span>
                      <span>{passedTests}/{totalTests}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                          className="bg-green-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-400 mt-3">
                      <span>XP Today</span>
                      <span className="text-yellow-400">+{stats.weeklyXp}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>Streak</span>
                      <span className="text-orange-400">{stats.streak} days</span>
                    </div>
                  </div>
                </div>
            </div>
          </div>

          {/* Editor and Right Panel */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Open Files Tabs */}
            <div className="h-10 bg-gray-800 border-b border-gray-700 flex items-center justify-between flex-shrink-0">
              <div className="flex overflow-x-auto">
                  {Array.from(openFiles).map(file => (
                       <div key={file} onClick={() => handleOpenFile(file as string)} className={cn("px-4 py-2 text-sm flex items-center space-x-2 border-r border-gray-700 cursor-pointer whitespace-nowrap", currentFile === file ? 'tab-active text-white' : 'text-gray-400')}>
                          <File className="w-4 h-4" />
                          <span>{(file as string).split('/').pop()}</span>
                          <button onClick={(e) => {
                              e.stopPropagation();
                              removePath(file as string);
                          }} className="hover:bg-gray-700 rounded-full p-0.5"><XCircle className="w-3 h-3" /></button>
                     </div>
                  ))}
              </div>
               <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white mr-2" title={isZenMode ? "Exit Zen Mode" : "Enter Zen Mode"} onClick={() => setIsZenMode(!isZenMode)}>
                {isZenMode ? <Minimize2 /> : <Maximize2 />}
              </Button>
            </div>

            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              {/* Editor */}
              <div className="flex-1 relative overflow-auto">
                <Editor 
                  value={fileContent} 
                  language={challenge.language}
                  options={editorOptions}
                  onChange={(value) => {
                    setFileContent(value);
                    updateAIContext({ codeContent: value });
                    if (autoSave && currentFile) setContent(currentFile, value);
                  }}
                  onMount={(editor, monaco) => { 
                    setEditorInstance(editor); 
                    setMonacoInstance(monaco); 
                  }}
                  onCursorChange={setCursorPosition}
                />
              </div>

              {/* Right Panel */}
              <div className={cn("w-full md:w-1/2 lg:w-2/5 bg-gray-800 border-l border-gray-700 flex flex-col overflow-hidden transition-all duration-300", isZenMode ? 'w-0 hidden' : 'flex')}>
                  <div className="h-10 bg-gray-900 border-b border-gray-700 flex flex-shrink-0">
                      <button onClick={() => setRightPanel('output')} className={cn("flex-1 text-sm text-gray-400 hover:text-white border-r border-gray-700 flex items-center justify-center gap-1", rightPanel === 'output' && 'tab-active')}>
                         <Terminal className="h-4 w-4"/> Terminal
                      </button>
                      <button onClick={() => setRightPanel('api')} className={cn("flex-1 text-sm text-gray-400 hover:text-white border-r border-gray-700 flex items-center justify-center gap-1", rightPanel === 'api' && 'tab-active')}>
                         <FlaskConical className="h-4 w-4"/> API Test
                      </button>
                      <button onClick={() => setRightPanel('tests')} className={cn("flex-1 text-sm text-gray-400 hover:text-white flex items-center justify-center gap-1", rightPanel === 'tests' && 'tab-active')}>
                         <CheckCircle className="h-4 w-4"/> Tests
                      </button>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {rightPanel === 'output' && (
                      <div className="flex-1 flex flex-col h-full">
                        <div className="flex-grow terminal p-4 overflow-y-auto font-mono text-sm" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                            {terminalOutput.map((line, index) => (
                                <div key={index} dangerouslySetInnerHTML={{__html: line}}></div>
                            ))}
                            {running && <div><Loader2 className="h-4 w-4 animate-spin inline-block mr-2" /> Running...</div>}
                            <div ref={terminalEndRef} />
                        </div>
                        <div className="border-t border-gray-700 p-2 flex items-center space-x-2 flex-shrink-0">
                            { terminalMode === 'normal' ? (
                                <span className="text-sm whitespace-nowrap" dangerouslySetInnerHTML={{ __html: `<span class="text-green-400">user@bme</span>:<span class="text-blue-400">~${currentWorkingDirectory}</span>$` }} />
                            ) : (
                                <span className="text-purple-400 text-sm whitespace-nowrap">rahim&gt;</span>
                            )}
                            <input
                                ref={terminalInputRef}
                                type="text"
                                className="terminal-input w-full bg-transparent border-none outline-none text-white font-mono text-sm"
                                placeholder="Type 'help' for 50+ commands"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        handleTerminalCommand(e.currentTarget.value);
                                        e.currentTarget.value = '';
                                    }
                                }}
                            />
                        </div>
                      </div>
                    )}
                    {rightPanel === 'api' && (
                        <div className="p-4 space-y-4">
                            <div className="flex items-center space-x-2">
                                <Select value={apiRequest.method} onValueChange={(m) => setApiRequest({...apiRequest, method: m})}>
                                    <SelectTrigger className="w-[100px] bg-gray-700 border-gray-600">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="GET">GET</SelectItem>
                                        <SelectItem value="POST">POST</SelectItem>
                                        <SelectItem value="PUT">PUT</SelectItem>
                                        <SelectItem value="DELETE">DELETE</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Input value={apiRequest.url} onChange={(e) => setApiRequest({...apiRequest, url: e.target.value})} className="bg-gray-700 border-gray-600" placeholder="https://api.example.com" />
                            </div>
                            <div>
                                <Label className="text-xs">Headers</Label>
                                {apiRequest.headers.map((h, i) => (
                                    <div key={i} className="flex items-center space-x-2 mt-1">
                                        <Input value={h.key} onChange={(e) => { const newH = [...apiRequest.headers]; newH[i].key = e.target.value; setApiRequest({...apiRequest, headers: newH}) }} className="bg-gray-700 border-gray-600 h-8 text-xs" placeholder="Key" />
                                        <Input value={h.value} onChange={(e) => { const newH = [...apiRequest.headers]; newH[i].value = e.target.value; setApiRequest({...apiRequest, headers: newH}) }} className="bg-gray-700 border-gray-600 h-8 text-xs" placeholder="Value" />
                                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setApiRequest({...apiRequest, headers: apiRequest.headers.filter((_, idx) => i !== idx)})}><Trash className="h-4 w-4 text-red-500" /></Button>
                                    </div>
                                ))}
                                <Button size="sm" variant="link" className="text-xs p-0 mt-1" onClick={() => setApiRequest({...apiRequest, headers: [...apiRequest.headers, {key: '', value: ''}]})}>+ Add Header</Button>
                            </div>
                            <div>
                                <Label className="text-xs">Body</Label>
                                <Textarea value={apiRequest.body} onChange={(e) => setApiRequest({...apiRequest, body: e.target.value})} className="bg-gray-700 border-gray-600 font-mono text-xs" rows={5}/>
                            </div>
                            <Button onClick={handleApiRequest} disabled={isApiLoading} className="w-full">
                                {isApiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Send className="mr-2 h-4 w-4"/>} Send Request
                            </Button>
                            {apiResponse && (
                                <div className="border-t border-gray-700 pt-4">
                                    <h3 className="text-sm font-semibold">Response</h3>
                                    <div className={cn("text-sm mt-2 font-bold", apiResponse.status >= 200 && apiResponse.status < 300 ? 'text-green-400' : 'text-red-400')}>Status: {apiResponse.status} {apiResponse.statusText}</div>
                                    <div className="text-xs text-gray-400">Time: {apiResponse.time}ms | Size: {formatBytes(apiResponse.size)}</div>
                                    <pre className="mt-2 text-xs bg-gray-900 p-2 rounded overflow-x-auto">
                                        {JSON.stringify(apiResponse.data, null, 2)}
                                    </pre>
                                </div>
                            )}
                        </div>
                    )}
                    {rightPanel === 'tests' && (
                        <div className="p-4 space-y-3">
                            <h3 className="text-sm font-semibold text-white">Test Results</h3>
                            {running && <div className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Running tests...</div>}
                            {!running && !output && <div className="text-gray-500 text-sm">Run code to see test results.</div>}
                            {output?.testResults?.map((result, index) => (
                                <div key={index} className={cn("flex items-start space-x-3 p-2 rounded text-sm", result.passed ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20')}>
                                    {result.passed ? <CheckCircle className="h-4 w-4 mt-0.5 text-green-500"/> : <XCircle className="h-4 w-4 mt-0.5 text-red-500"/>}
                                    <div className="flex-1">
                                    <div className="text-white">{result.description}</div>
                                    {!result.passed && (
                                        <div className="mt-2 text-xs font-mono space-y-1 bg-gray-900 p-2 rounded">
                                            <p><strong className="text-gray-400">Expected:</strong> {String(result.expected)}</p>
                                            <p><strong className="text-gray-400">Got:</strong> <span className="text-red-400">{String(result.output)}</span></p>
                                        </div>
                                    )}
                                    </div>
                                    <div className={cn("text-xs", result.passed ? 'text-green-400' : 'text-red-400')}>{result.passed ? 'Passed' : 'Failed'}</div>
                                </div>
                            ))}
                        </div>
                    )}
                  </div>
              </div>
            </div>

            {/* Status Bar */}
            <div className="status-bar h-6 flex items-center justify-between px-4 text-xs bg-gray-900 border-t border-blue-500/20 flex-shrink-0">
                <div className="flex items-center space-x-4">
                    <span>Ln {cursorPosition.lineNumber}, Col {cursorPosition.column}</span>
                    <span>{challenge.language}</span>
                    <span>Enhanced Mode</span>
                    <span>{formatBytes(fileSize)}</span>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center gap-1">
                      <Crown className="w-3 h-3 text-yellow-400" />
                      <span>Level {stats.level}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-blue-400" />
                      <span>{stats.totalXp} XP</span>
                    </div>
                    <span><Bot className="inline h-3 w-3" /> Rahim Ready</span>
                </div>
            </div>
          </div>
        </div>

        {/* Enhanced AI Assistant */}
        <EnhancedAI
          context={aiContext}
          onSuggestionApply={handleSuggestionApply}
          onCodeInsert={(code) => {
            if (editorInstance) {
              editorInstance.trigger('keyboard', 'type', { text: code });
            }
          }}
          onFileOpen={handleOpenFile}
        />

        {/* Advanced Settings Panel */}
        <AdvancedSettingsPanel
          isOpen={isSettingsOpen}
          onOpenChange={setIsSettingsOpen}
          settings={settings}
          onSettingsChange={updateSettings}
        />

        <AIMentorModal isOpen={isAIMentorOpen} onOpenChange={setAIMentorOpen} codeContext={fileContent} />

        <Dialog open={isFileModalOpen} onOpenChange={setIsFileModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New File</DialogTitle>
            </DialogHeader>
             <div className="py-4">
              <Label htmlFor="filePath">File Path</Label>
              <Input id="filePath" value={newPath} onChange={(e) => setNewPath(e.target.value)} placeholder="e.g., utils/helpers.js" />
             </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsFileModalOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateFile}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

         <Dialog open={isFolderModalOpen} onOpenChange={setIsFolderModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Folder</DialogTitle>
            </DialogHeader>
             <div className="py-4">
              <Label htmlFor="folderPath">Folder Path</Label>
              <Input id="folderPath" value={newPath} onChange={(e) => setNewPath(e.target.value)} placeholder="e.g., services" />
             </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsFolderModalOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateFolder}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </NotificationProvider>
  );
}
