
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
