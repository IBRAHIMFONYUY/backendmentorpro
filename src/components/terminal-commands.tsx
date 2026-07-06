"use client";

import React from 'react';

export interface FileSystem {
  type: string;
  name: string;
  children: { [key: string]: any };
}

export interface TerminalState {
  currentWorkingDirectory: string;
  output: string[];
  history: string[];
  environment: { [key: string]: string };
  processes: { [key: string]: any };
  aliases: { [key: string]: string };
}

export interface CommandContext {
  getNode: (path: string) => any;
  getContent: (path: string) => string | null;
  setContent: (path: string, content: string) => void;
  addNode: (path: string, type: 'file' | 'folder', content?: string) => boolean;
  removePath: (path: string) => boolean;
  handleOpenFile: (path: string) => void;
  fileSystem: FileSystem;
  state: TerminalState;
  updateState: (update: Partial<TerminalState>) => void;
  onNotification: (type: string, message: string) => void;
  onXPGain?: (amount: number, reason: string) => void;
  onAchievement?: (action: string, value?: any) => void;
}

export interface Command {
  name: string;
  description: string;
  usage: string;
  category: 'file' | 'navigation' | 'development' | 'git' | 'system' | 'network' | 'text' | 'process' | 'package' | 'docker' | 'utility';
  execute: (args: string[], context: CommandContext) => string[] | Promise<string[]>;
  aliases?: string[];
}

const resolvePath = (base: string, rel: string): string => {
  if (rel.startsWith('/')) return rel;
  const baseParts = base.split('/').filter(p => p);
  const relParts = rel.split('/').filter(p => p);
  
  for (const part of relParts) {
    if (part === '..') {
      baseParts.pop();
    } else if (part !== '.') {
      baseParts.push(part);
    }
  }
  
  return '/' + baseParts.join('/');
};

const formatFileSize = (size: number): string => {
  const units = ['B', 'KB', 'MB', 'GB'];
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(1)}${units[unitIndex]}`;
};

const formatDate = (date: Date = new Date()): string => {
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};

export const TERMINAL_COMMANDS: Command[] = [
  // Navigation Commands
  {
    name: 'cd',
    description: 'Change current directory',
    usage: 'cd [directory]',
    category: 'navigation',
    execute: (args, context) => {
      const newDir = resolvePath(context.state.currentWorkingDirectory, args[0] || '/');
      const dirNode = context.getNode(newDir);
      if (dirNode && dirNode.type === 'folder') {
        context.updateState({ currentWorkingDirectory: newDir });
        return [`Changed directory to ${newDir}`];
      } else {
        return [`<span class="text-red-400">cd: no such file or directory: ${args[0]}</span>`];
      }
    }
  },
  {
    name: 'ls',
    description: 'List directory contents',
    usage: 'ls [-la] [directory]',
    category: 'navigation',
    execute: (args, context) => {
      const showAll = args.includes('-a') || args.includes('-la');
      const showLong = args.includes('-l') || args.includes('-la');
      const targetDir = args.find(arg => !arg.startsWith('-')) || context.state.currentWorkingDirectory;
      const resolvedDir = resolvePath(context.state.currentWorkingDirectory, targetDir);
      
      const node = context.getNode(resolvedDir);
      if (!node || node.type !== 'folder') {
        return [`<span class="text-red-400">ls: cannot access '${targetDir}': No such file or directory</span>`];
      }

      const entries = Object.keys(node.children)
        .filter(name => showAll || !name.startsWith('.'))
        .sort((a, b) => {
          const aType = node.children[a].type;
          const bType = node.children[b].type;
          if (aType === 'folder' && bType !== 'folder') return -1;
          if (aType !== 'folder' && bType === 'folder') return 1;
          return a.localeCompare(b);
        });

      if (showLong) {
        const result = entries.map(name => {
          const child = node.children[name];
          const permissions = child.type === 'folder' ? 'drwxr-xr-x' : '-rw-r--r--';
          const size = child.type === 'file' ? (child.content?.length || 0) : 4096;
          const date = formatDate();
          const displayName = child.type === 'folder' ? `<span class="text-blue-400">${name}/</span>` : name;
          return `${permissions} 1 user user ${size.toString().padStart(8)} ${date} ${displayName}`;
        });
        return result.length > 0 ? result : ['(empty directory)'];
      } else {
        const fileNames = entries.map(name => {
          const child = node.children[name];
          return child.type === 'folder' ? `<span class="text-blue-400">${name}/</span>` : name;
        }).join('  ');
        return [fileNames || '(empty directory)'];
      }
    },
    aliases: ['ll', 'dir']
  },
  {
    name: 'pwd',
    description: 'Print working directory',
    usage: 'pwd',
    category: 'navigation',
    execute: (args, context) => {
      return [context.state.currentWorkingDirectory];
    }
  },
  {
    name: 'tree',
    description: 'Display directory tree structure',
    usage: 'tree [directory]',
    category: 'navigation',
    execute: (args, context) => {
      const targetDir = args[0] || context.state.currentWorkingDirectory;
      const resolvedDir = resolvePath(context.state.currentWorkingDirectory, targetDir);
      
      const buildTree = (node: any, prefix = '', isLast = true): string[] => {
        if (!node.children) return [];
        
        const entries = Object.keys(node.children).sort();
        const lines: string[] = [];
        
        entries.forEach((name, index) => {
          const child = node.children[name];
          const isLastEntry = index === entries.length - 1;
          const connector = isLastEntry ? '└── ' : '├── ';
          const displayName = child.type === 'folder' ? `<span class="text-blue-400">${name}/</span>` : name;
          
          lines.push(`${prefix}${connector}${displayName}`);
          
          if (child.type === 'folder') {
            const childPrefix = prefix + (isLastEntry ? '    ' : '│   ');
            lines.push(...buildTree(child, childPrefix, isLastEntry));
          }
        });
        
        return lines;
      };

      const node = context.getNode(resolvedDir);
      if (!node) {
        return [`<span class="text-red-400">tree: ${targetDir}: No such file or directory</span>`];
      }

      const result = [`<span class="text-blue-400">${resolvedDir}</span>`, ...buildTree(node)];
      return result;
    }
  },

  // File Operations
  {
    name: 'cat',
    description: 'Display file contents',
    usage: 'cat <file>',
    category: 'file',
    execute: (args, context) => {
      if (!args[0]) {
        return [`<span class="text-red-400">cat: missing file operand</span>`];
      }
      const filePath = resolvePath(context.state.currentWorkingDirectory, args[0]);
      const content = context.getContent(filePath);
      if (content !== null) {
        return content.split('\n').map(line => line.replace(/</g, "&lt;").replace(/>/g, "&gt;"));
      } else {
        return [`<span class="text-red-400">cat: ${args[0]}: No such file or directory</span>`];
      }
    }
  },
  {
    name: 'touch',
    description: 'Create empty file or update timestamp',
    usage: 'touch <filename>',
    category: 'file',
    execute: (args, context) => {
      if (!args[0]) {
        return [`<span class="text-red-400">touch: missing operand</span>`];
      }
      const filePath = resolvePath(context.state.currentWorkingDirectory, args[0]);
      if (context.addNode(filePath, 'file')) {
        context.onNotification('success', `File '${args[0]}' created`);
        return [`Created file: ${args[0]}`];
      } else {
        return [`<span class="text-yellow-400">touch: '${args[0]}' already exists</span>`];
      }
    }
  },
  {
    name: 'mkdir',
    description: 'Create directory',
    usage: 'mkdir [-p] <directory>',
    category: 'file',
    execute: (args, context) => {
      if (!args[0] || args[0].startsWith('-')) {
        return [`<span class="text-red-400">mkdir: missing operand</span>`];
      }
      const recursive = args.includes('-p');
      const dirPath = resolvePath(context.state.currentWorkingDirectory, args.find(arg => !arg.startsWith('-')) || '');
      
      if (context.addNode(dirPath, 'folder')) {
        context.onNotification('success', `Directory '${args[0]}' created`);
        return [`Created directory: ${args[0]}`];
      } else {
        return [`<span class="text-red-400">mkdir: cannot create directory '${args[0]}': File exists</span>`];
      }
    }
  },
  {
    name: 'rm',
    description: 'Remove files and directories',
    usage: 'rm [-rf] <file|directory>',
    category: 'file',
    execute: (args, context) => {
      if (!args[0] || args[0].startsWith('-')) {
        return [`<span class="text-red-400">rm: missing operand</span>`];
      }
      const recursive = args.includes('-r') || args.includes('-rf');
      const force = args.includes('-f') || args.includes('-rf');
      const targetPath = resolvePath(context.state.currentWorkingDirectory, args.find(arg => !arg.startsWith('-')) || '');
      
      if (context.removePath(targetPath)) {
        context.onNotification('success', `Removed '${args[0]}'`);
        return [`Removed: ${args[0]}`];
      } else {
        return [`<span class="text-red-400">rm: cannot remove '${args[0]}': No such file or directory</span>`];
      }
    }
  },
  {
    name: 'cp',
    description: 'Copy files or directories',
    usage: 'cp [-r] <source> <destination>',
    category: 'file',
    execute: (args, context) => {
      if (args.length < 2) {
        return [`<span class="text-red-400">cp: missing file operand</span>`];
      }
      const recursive = args.includes('-r');
      const source = args.find(arg => !arg.startsWith('-')) || '';
      const dest = args[args.length - 1];
      
      return [`<span class="text-yellow-400">cp: command not fully implemented</span>`];
    }
  },
  {
    name: 'mv',
    description: 'Move/rename files or directories',
    usage: 'mv <source> <destination>',
    category: 'file',
    execute: (args, context) => {
      if (args.length < 2) {
        return [`<span class="text-red-400">mv: missing file operand</span>`];
      }
      return [`<span class="text-yellow-400">mv: command not fully implemented</span>`];
    }
  },

  // Text Processing
  {
    name: 'grep',
    description: 'Search text patterns in files',
    usage: 'grep [-r] <pattern> [file]',
    category: 'text',
    execute: (args, context) => {
      if (!args[0]) {
        return [`<span class="text-red-400">grep: missing pattern</span>`];
      }
      const pattern = args[0];
      const file = args[1];
      
      if (file) {
        const filePath = resolvePath(context.state.currentWorkingDirectory, file);
        const content = context.getContent(filePath);
        if (content) {
          const matches = content.split('\n').filter(line => line.includes(pattern));
          return matches.length > 0 ? matches : [`<span class="text-gray-400">No matches found</span>`];
        } else {
          return [`<span class="text-red-400">grep: ${file}: No such file or directory</span>`];
        }
      }
      
      return [`<span class="text-yellow-400">grep: recursive search not implemented</span>`];
    }
  },
  {
    name: 'wc',
    description: 'Count lines, words, and characters',
    usage: 'wc [-lwc] [file]',
    category: 'text',
    execute: (args, context) => {
      const file = args.find(arg => !arg.startsWith('-'));
      if (!file) {
        return [`<span class="text-red-400">wc: missing file operand</span>`];
      }
      
      const filePath = resolvePath(context.state.currentWorkingDirectory, file);
      const content = context.getContent(filePath);
      if (content) {
        const lines = content.split('\n').length;
        const words = content.split(/\s+/).filter(w => w).length;
        const chars = content.length;
        
        const showLines = !args.length || args.includes('-l');
        const showWords = !args.length || args.includes('-w');
        const showChars = !args.length || args.includes('-c');
        
        let result = '';
        if (showLines) result += lines.toString().padStart(8);
        if (showWords) result += words.toString().padStart(8);
        if (showChars) result += chars.toString().padStart(8);
        result += ` ${file}`;
        
        return [result];
      } else {
        return [`<span class="text-red-400">wc: ${file}: No such file or directory</span>`];
      }
    }
  },
  {
    name: 'head',
    description: 'Display first lines of a file',
    usage: 'head [-n number] [file]',
    category: 'text',
    execute: (args, context) => {
      const numLines = args.includes('-n') ? parseInt(args[args.indexOf('-n') + 1]) || 10 : 10;
      const file = args.find(arg => !arg.startsWith('-') && arg !== (args[args.indexOf('-n') + 1] || ''));
      
      if (!file) {
        return [`<span class="text-red-400">head: missing file operand</span>`];
      }
      
      const filePath = resolvePath(context.state.currentWorkingDirectory, file);
      const content = context.getContent(filePath);
      if (content) {
        const lines = content.split('\n').slice(0, numLines);
        return lines;
      } else {
        return [`<span class="text-red-400">head: ${file}: No such file or directory</span>`];
      }
    }
  },
  {
    name: 'tail',
    description: 'Display last lines of a file',
    usage: 'tail [-n number] [file]',
    category: 'text',
    execute: (args, context) => {
      const numLines = args.includes('-n') ? parseInt(args[args.indexOf('-n') + 1]) || 10 : 10;
      const file = args.find(arg => !arg.startsWith('-') && arg !== (args[args.indexOf('-n') + 1] || ''));
      
      if (!file) {
        return [`<span class="text-red-400">tail: missing file operand</span>`];
      }
      
      const filePath = resolvePath(context.state.currentWorkingDirectory, file);
      const content = context.getContent(filePath);
      if (content) {
        const lines = content.split('\n').slice(-numLines);
        return lines;
      } else {
        return [`<span class="text-red-400">tail: ${file}: No such file or directory</span>`];
      }
    }
  },

  // Development Commands
  {
    name: 'node',
    description: 'Execute JavaScript files',
    usage: 'node <file>',
    category: 'development',
    execute: (args, context) => {
      if (!args[0]) {
        return [`<span class="text-red-400">node: missing script name</span>`];
      }
      const filePath = resolvePath(context.state.currentWorkingDirectory, args[0]);
      if (context.getContent(filePath)) {
        context.handleOpenFile(filePath);
        context.onXPGain?.(10, 'Executed Node.js script');
        return [`<span class="text-green-400">Executing ${args[0]} with Node.js...</span>`];
      } else {
        return [`<span class="text-red-400">node: cannot open ${args[0]}</span>`];
      }
    }
  },
  {
    name: 'python',
    description: 'Execute Python files',
    usage: 'python <file>',
    category: 'development',
    execute: (args, context) => {
      if (!args[0]) {
        return [`<span class="text-red-400">python: missing script name</span>`];
      }
      const filePath = resolvePath(context.state.currentWorkingDirectory, args[0]);
      if (context.getContent(filePath)) {
        context.handleOpenFile(filePath);
        context.onXPGain?.(10, 'Executed Python script');
        return [`<span class="text-green-400">Executing ${args[0]} with Python...</span>`];
      } else {
        return [`<span class="text-red-400">python: can't open file '${args[0]}'</span>`];
      }
    }
  },
  {
    name: 'run',
    description: 'Run the current challenge solution',
    usage: 'run',
    category: 'development',
    execute: (args, context) => {
      context.onXPGain?.(5, 'Executed code');
      return [`<span class="text-green-400">Running challenge solution...</span>`];
    }
  },
  {
    name: 'test',
    description: 'Run tests for the current challenge',
    usage: 'test',
    category: 'development',
    execute: (args, context) => {
      context.onXPGain?.(5, 'Ran tests');
      return [`<span class="text-blue-400">Running tests...</span>`];
    }
  },
  {
    name: 'build',
    description: 'Build the project',
    usage: 'build [target]',
    category: 'development',
    execute: (args, context) => {
      const target = args[0] || 'default';
      return [
        `<span class="text-blue-400">Building project (${target})...</span>`,
        `<span class="text-green-400">Build completed successfully!</span>`
      ];
    }
  },

  // Git Commands
  {
    name: 'git',
    description: 'Git version control',
    usage: 'git <subcommand> [args]',
    category: 'git',
    execute: (args, context) => {
      const subcommand = args[0];
      
      switch (subcommand) {
        case 'status':
          return [
            `<span class="text-green-400">On branch main</span>`,
            `<span class="text-gray-400">Your branch is up to date with 'origin/main'.</span>`,
            ``,
            `<span class="text-gray-400">nothing to commit, working tree clean</span>`
          ];
        case 'log':
          return [
            `<span class="text-yellow-400">commit abc123def456</span>`,
            `<span class="text-gray-400">Author: Developer &lt;dev@example.com&gt;</span>`,
            `<span class="text-gray-400">Date: ${formatDate()}</span>`,
            ``,
            `    Initial commit`
          ];
        case 'branch':
          return [`<span class="text-green-400">* main</span>`];
        case 'add':
          context.onXPGain?.(5, 'Used git add');
          return [`<span class="text-gray-400">Files staged for commit</span>`];
        case 'commit':
          context.onXPGain?.(10, 'Made git commit');
          return [`<span class="text-green-400">[main abc123d] ${args.slice(2).join(' ') || 'Updated files'}</span>`];
        case 'push':
          context.onXPGain?.(15, 'Pushed to remote');
          return [
            `<span class="text-gray-400">Enumerating objects: 3, done.</span>`,
            `<span class="text-gray-400">Counting objects: 100% (3/3), done.</span>`,
            `<span class="text-green-400">Everything up-to-date</span>`
          ];
        case 'pull':
          return [`<span class="text-gray-400">Already up to date.</span>`];
        default:
          return [`<span class="text-red-400">git: '${subcommand}' is not a git command</span>`];
      }
    }
  },

  // Package Management
  {
    name: 'npm',
    description: 'Node Package Manager',
    usage: 'npm <command> [args]',
    category: 'package',
    execute: (args, context) => {
      const command = args[0];
      
      switch (command) {
        case 'install':
        case 'i':
          const package_ = args[1] || 'dependencies';
          return [
            `<span class="text-gray-400">Installing ${package_}...</span>`,
            `<span class="text-green-400">added 1 package in 2.3s</span>`
          ];
        case 'run':
          const script = args[1];
          return [`<span class="text-blue-400">Running script: ${script}</span>`];
        case 'start':
          return [`<span class="text-green-400">Starting development server...</span>`];
        case 'build':
          return [`<span class="text-blue-400">Building for production...</span>`];
        case 'test':
          return [`<span class="text-blue-400">Running tests...</span>`];
        case 'version':
          return [`<span class="text-gray-400">8.19.3</span>`];
        default:
          return [`<span class="text-red-400">npm: unknown command '${command}'</span>`];
      }
    }
  },
  {
    name: 'yarn',
    description: 'Yarn Package Manager',
    usage: 'yarn [command] [args]',
    category: 'package',
    execute: (args, context) => {
      const command = args[0] || 'install';
      
      switch (command) {
        case 'install':
          return [`<span class="text-blue-400">Installing dependencies with Yarn...</span>`];
        case 'add':
          return [`<span class="text-green-400">Package added successfully</span>`];
        case 'start':
          return [`<span class="text-green-400">Starting with Yarn...</span>`];
        case 'build':
          return [`<span class="text-blue-400">Building with Yarn...</span>`];
        default:
          return [`<span class="text-gray-400">Yarn ${command} executed</span>`];
      }
    }
  },

  // Docker Commands
  {
    name: 'docker',
    description: 'Docker container management',
    usage: 'docker <command> [args]',
    category: 'docker',
    execute: (args, context) => {
      const command = args[0];
      
      switch (command) {
        case 'ps':
          return [
            `<span class="text-gray-400">CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES</span>`
          ];
        case 'images':
          return [
            `<span class="text-gray-400">REPOSITORY   TAG       IMAGE ID      CREATED      SIZE</span>`
          ];
        case 'build':
          return [`<span class="text-blue-400">Building Docker image...</span>`];
        case 'run':
          return [`<span class="text-green-400">Starting Docker container...</span>`];
        case 'stop':
          return [`<span class="text-yellow-400">Stopping container...</span>`];
        default:
          return [`<span class="text-red-400">docker: unknown command '${command}'</span>`];
      }
    }
  },

  // System Commands
  {
    name: 'ps',
    description: 'List running processes',
    usage: 'ps [aux]',
    category: 'system',
    execute: (args, context) => {
      return [
        `<span class="text-gray-400">  PID TTY          TIME CMD</span>`,
        `<span class="text-white"> 1234 pts/0    00:00:01 bash</span>`,
        `<span class="text-white"> 5678 pts/0    00:00:00 node</span>`
      ];
    }
  },
  {
    name: 'top',
    description: 'Display running processes',
    usage: 'top',
    category: 'system',
    execute: (args, context) => {
      return [
        `<span class="text-green-400">Tasks: 3 total, 1 running, 2 sleeping</span>`,
        `<span class="text-gray-400">%Cpu(s): 12.5 us, 2.1 sy, 85.4 id</span>`,
        `<span class="text-gray-400">PID USER      PR  NI    VIRT    RES    SHR S  %CPU %MEM     TIME+ COMMAND</span>`
      ];
    }
  },
  {
    name: 'df',
    description: 'Display filesystem disk space usage',
    usage: 'df [-h]',
    category: 'system',
    execute: (args, context) => {
      return [
        `<span class="text-gray-400">Filesystem      Size  Used Avail Use% Mounted on</span>`,
        `<span class="text-white">/dev/sda1        50G   12G   35G  26% /</span>`
      ];
    }
  },
  {
    name: 'free',
    description: 'Display memory usage',
    usage: 'free [-h]',
    category: 'system',
    execute: (args, context) => {
      return [
        `<span class="text-gray-400">              total        used        free      shared  buff/cache   available</span>`,
        `<span class="text-white">Mem:        8147484     2834124     3421212      156789     1892148     4988936</span>`
      ];
    }
  },
  {
    name: 'uname',
    description: 'System information',
    usage: 'uname [-a]',
    category: 'system',
    execute: (args, context) => {
      if (args.includes('-a')) {
        return [`Linux backend-mentor 5.15.0 #1 SMP x86_64 GNU/Linux`];
      }
      return [`Linux`];
    }
  },
  {
    name: 'whoami',
    description: 'Display current username',
    usage: 'whoami',
    category: 'system',
    execute: (args, context) => {
      return [`developer`];
    }
  },
  {
    name: 'date',
    description: 'Display current date and time',
    usage: 'date',
    category: 'system',
    execute: (args, context) => {
      return [formatDate()];
    }
  },

  // Network Commands
  {
    name: 'curl',
    description: 'Transfer data from servers',
    usage: 'curl [options] <url>',
    category: 'network',
    execute: (args, context) => {
      if (!args[0]) {
        return [`<span class="text-red-400">curl: no URL specified</span>`];
      }
      return [
        `<span class="text-blue-400">Fetching ${args[0]}...</span>`,
        `<span class="text-gray-400">HTTP/1.1 200 OK</span>`,
        `<span class="text-green-400">Request completed</span>`
      ];
    }
  },
  {
    name: 'wget',
    description: 'Download files from web',
    usage: 'wget <url>',
    category: 'network',
    execute: (args, context) => {
      if (!args[0]) {
        return [`<span class="text-red-400">wget: missing URL</span>`];
      }
      return [`<span class="text-green-400">Downloaded ${args[0]}</span>`];
    }
  },
  {
    name: 'ping',
    description: 'Send ICMP echo requests',
    usage: 'ping <host>',
    category: 'network',
    execute: (args, context) => {
      if (!args[0]) {
        return [`<span class="text-red-400">ping: missing hostname</span>`];
      }
      return [
        `<span class="text-gray-400">PING ${args[0]} (127.0.0.1): 56 data bytes</span>`,
        `<span class="text-white">64 bytes from 127.0.0.1: icmp_seq=1 time=0.123ms</span>`
      ];
    }
  },

  // Editor Commands
  {
    name: 'vi',
    description: 'Vi text editor',
    usage: 'vi <file>',
    category: 'text',
    execute: (args, context) => {
      if (!args[0]) {
        return [`<span class="text-red-400">vi: missing filename</span>`];
      }
      const filePath = resolvePath(context.state.currentWorkingDirectory, args[0]);
      if (context.getContent(filePath) !== null) {
        context.handleOpenFile(filePath);
        return [`<span class="text-green-400">Opening ${args[0]} in editor...</span>`];
      } else {
        return [`<span class="text-red-400">vi: cannot access '${args[0]}': No such file</span>`];
      }
    },
    aliases: ['vim', 'nano']
  },

  // Utility Commands
  {
    name: 'clear',
    description: 'Clear terminal screen',
    usage: 'clear',
    category: 'utility',
    execute: (args, context) => {
      return ['<span class="text-gray-500">Terminal cleared.</span>'];
    }
  },
  {
    name: 'history',
    description: 'Show command history',
    usage: 'history',
    category: 'utility',
    execute: (args, context) => {
      return context.state.history.map((cmd, i) => `${(i + 1).toString().padStart(4)} ${cmd}`);
    }
  },
  {
    name: 'which',
    description: 'Locate command',
    usage: 'which <command>',
    category: 'utility',
    execute: (args, context) => {
      if (!args[0]) {
        return [`<span class="text-red-400">which: missing command</span>`];
      }
      const command = TERMINAL_COMMANDS.find(cmd => cmd.name === args[0] || cmd.aliases?.includes(args[0]));
      return command ? [`/usr/bin/${args[0]}`] : [`<span class="text-red-400">${args[0]} not found</span>`];
    }
  },
  {
    name: 'man',
    description: 'Display manual pages',
    usage: 'man <command>',
    category: 'utility',
    execute: (args, context) => {
      if (!args[0]) {
        return [`<span class="text-red-400">man: missing command</span>`];
      }
      const command = TERMINAL_COMMANDS.find(cmd => cmd.name === args[0]);
      if (command) {
        return [
          `<span class="text-bold">${command.name.toUpperCase()}(1)</span>`,
          ``,
          `<span class="text-bold">NAME</span>`,
          `    ${command.name} - ${command.description}`,
          ``,
          `<span class="text-bold">SYNOPSIS</span>`,
          `    ${command.usage}`,
          ``,
          `<span class="text-bold">DESCRIPTION</span>`,
          `    ${command.description}`
        ];
      }
      return [`<span class="text-red-400">No manual entry for ${args[0]}</span>`];
    }
  },
  {
    name: 'help',
    description: 'Show available commands',
    usage: 'help [command]',
    category: 'utility',
    execute: (args, context) => {
      if (args[0]) {
        const command = TERMINAL_COMMANDS.find(cmd => cmd.name === args[0]);
        return command ? [
          `${command.name} - ${command.description}`,
          `Usage: ${command.usage}`,
          `Category: ${command.category}`
        ] : [`<span class="text-red-400">help: no help available for '${args[0]}'</span>`];
      }
      
      const categories = [...new Set(TERMINAL_COMMANDS.map(cmd => cmd.category))].sort();
      const result = [`<span class="text-green-400">Available commands:</span>`, ``];
      
      categories.forEach(category => {
        result.push(`<span class="text-blue-400">${category.toUpperCase()}:</span>`);
        const cmds = TERMINAL_COMMANDS.filter(cmd => cmd.category === category);
        cmds.forEach(cmd => {
          result.push(`  ${cmd.name.padEnd(12)} - ${cmd.description}`);
        });
        result.push(``);
      });
      
      return result;
    }
  },

  // Special Commands
  {
    name: 'submit',
    description: 'Submit challenge solution',
    usage: 'submit',
    category: 'development',
    execute: (args, context) => {
      context.onXPGain?.(50, 'Submitted solution');
      return [`<span class="text-green-400">Submitting solution for review...</span>`];
    }
  },
  {
    name: 'rahim',
    description: 'Start AI mentor chat mode',
    usage: 'rahim',
    category: 'utility',
    execute: (args, context) => {
      return [`<span class="text-purple-400">Switching to AI mentor mode. Type 'exit' to return.</span>`];
    }
  }
];

export function getCommand(name: string): Command | undefined {
  return TERMINAL_COMMANDS.find(cmd => 
    cmd.name === name || (cmd.aliases && cmd.aliases.includes(name))
  );
}

export function executeCommand(
  commandLine: string,
  context: CommandContext
): Promise<string[]> {
  const args = commandLine.trim().split(' ');
  const commandName = args[0].toLowerCase();
  const commandArgs = args.slice(1);

  // Track command usage for achievements
  context.onAchievement?.('terminal_command_used');

  const command = getCommand(commandName);
  if (!command) {
    return Promise.resolve([`<span class="text-red-500">Command not found: ${commandName}</span>`]);
  }

  try {
    const result = command.execute(commandArgs, context);
    return Promise.resolve(result);
  } catch (error) {
    return Promise.resolve([`<span class="text-red-500">Error executing ${commandName}: ${error}</span>`]);
  }
}
