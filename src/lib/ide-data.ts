
export type TestResult = {
  name: string;
  status: 'passed' | 'failed' | 'pending' | 'running';
  output: string;
};

export type FileSystemNode = {
  type: 'file' | 'folder';
  name: string;
  path: string;
  content?: string;
  children?: FileSystemNode[];
};

export const initialFiles: FileSystemNode = { 
  name: 'rest-api-auth', type: 'folder', path: 'rest-api-auth', children: [
    { name: '.env', type: 'file', path: 'rest-api-auth/.env', content: 'JWT_SECRET=your-secret-key' },
    { name: 'package.json', type: 'file', path: 'rest-api-auth/package.json', content: '{ "name": "rest-api-auth" }' },
    { name: 'README.md', type: 'file', path: 'rest-api-auth/README.md', content: '# REST API Auth Challenge' },
    { name: 'server.js', type: 'file', path: 'rest-api-auth/server.js', content: `const express = require('express');\nconsole.log('hello from server.js')` },
  ]
};

export const initialTestResults: TestResult[] = [
    { name: "Basic server setup", status: 'passed', output: "Completed" },
    { name: "JWT implementation", status: 'passed', output: "Completed" },
    { name: "Login endpoint", status: 'passed', output: "Completed" },
    { name: "Protected routes", status: 'failed', output: "Pending implementation" },
    { name: "Error handling", status: 'pending', output: "Not started" },
];
