
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
  name: 'rest-api-auth', type: 'folder', path: '/', children: [
    { name: '.env', type: 'file', path: '/.env', content: 'JWT_SECRET=your-secret-key' },
    { name: 'package.json', type: 'file', path: '/package.json', content: '{\n  "name": "rest-api-auth",\n  "main": "server.js",\n  "dependencies": {\n    "express": "latest",\n    "jsonwebtoken": "latest"\n  }\n}' },
    { name: 'README.md', type: 'file', path: '/README.md', content: '# REST API Auth Challenge' },
    { name: 'server.js', type: 'file', path: '/server.js', content: `const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
` },
  ]
};

export const initialTestResults: TestResult[] = [
    { name: "Basic server setup", status: 'passed', output: "Completed" },
    { name: "JWT implementation", status: 'passed', output: "Completed" },
    { name: "Login endpoint", status: 'passed', output: "Completed" },
    { name: "Protected routes", status: 'pending', output: "Pending implementation" },
    { name: "Error handling", status: 'pending', output: "Not started" },
];
