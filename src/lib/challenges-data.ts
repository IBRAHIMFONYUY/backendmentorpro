
import { z } from 'zod';

export interface TestCase {
  description: string;
  input: any;
  expectedOutput: any;
}

export interface OtherFile {
    path: string;
    content: string;
}

export interface Challenge {
  id: string;
  title: string;
  description:string;
  difficulty: 'Easy' | 'Intermediate' | 'Hard' | 'Expert';
  tags: string[];
  starterCode: string;
  solution: string;
  mainFile?: string;
  otherFiles?: OtherFile[];
  testCases: TestCase[];
  language: 'javascript' | 'python' | 'go' | 'java' | 'rust' | 'php';
}

const TestCaseSchema = z.object({
  description: z.string().describe('A description of what this test case is checking.'),
  input: z.any().describe('The input to provide to the user\'s function.'),
  expectedOutput: z.any().describe('The expected output from the user\'s function.'),
});

export const RunCodeInputSchema = z.object({
  code: z.string().describe("The user's code to execute."),
  language: z.string().optional().describe('The programming language of the code, e.g., javascript, python.'),
  testCases: z.array(TestCaseSchema).describe('An array of test cases to run against the code.'),
});
export type RunCodeInput = z.infer<typeof RunCodeInputSchema>;


const TestResultSchema = z.object({
    description: z.string().describe('The description of the test case.'),
    passed: z.boolean().describe('Whether the test case passed.'),
    output: z.string().describe('The actual output from the code for this test case.'),
    expected: z.string().describe('The expected output for this test case.'),
});

export const RunCodeOutputSchema = z.object({
  overallOutput: z.string().describe('The console output of the entire code execution.'),
  error: z.string().optional().describe('Any error that occurred during execution.'),
  testResults: z.array(TestResultSchema).describe('The results of each test case.'),
});
export type RunCodeOutput = z.infer<typeof RunCodeOutputSchema>;


export const challenges: Challenge[] = [
    // Easy
    {
        id: 'rest-api-endpoint',
        title: 'Build a REST API Endpoint',
        description: 'Design and build a complete RESTful API endpoint for a simple blog application. The function should take a list of posts and return only the titles.',
        difficulty: 'Easy',
        tags: ['Node.js', 'API', 'Express'],
        language: 'javascript',
        mainFile: 'server.js',
        starterCode: `// Complete the function below to return only the titles of the posts
function getPostTitles(posts) {
  // Your code here
}`,
        solution: `function getPostTitles(posts) {
  return posts.map(post => post.title);
}`,
        testCases: [
            { description: 'should return an array of titles from posts', input: [{ id: 1, title: 'First Post', content: '...' }, { id: 2, title: 'Second Post', content: '...' }], expectedOutput: ['First Post', 'Second Post'] },
            { description: 'should return an empty array for empty input', input: [], expectedOutput: [] },
        ],
    },
    {
        id: 'python-data-cleaner',
        title: 'Python Data Cleaner',
        description: 'Write a Python function to remove null values from a list of dictionaries and convert all keys to lowercase.',
        difficulty: 'Easy',
        tags: ['Python', 'Data Science'],
        language: 'python',
        mainFile: 'main.py',
        starterCode: `def clean_data(data):
    # Your code here`,
        solution: `def clean_data(data):
    cleaned = []
    for item in data:
        new_item = {k.lower(): v for k, v in item.items() if v is not None}
        cleaned.append(new_item)
    return cleaned`,
        testCases: [
            { description: 'should remove nulls and lowercase keys', input: [{'Name': 'Alice', 'Age': 30, 'City': null}], expectedOutput: [{'name': 'Alice', 'age': 30}] },
            { description: 'should handle empty list', input: [], expectedOutput: [] },
        ],
    },
     {
        id: 'java-string-reverser',
        title: 'Java String Reverser',
        description: 'Write a Java method to reverse a string without using the built-in reverse() method.',
        difficulty: 'Easy',
        tags: ['Java', 'Algorithm'],
        language: 'java',
        mainFile: 'Solution.java',
        starterCode: `public class Solution {
    public String reverseString(String s) {
        // Your code here
    }
}`,
        solution: `public class Solution {
    public String reverseString(String s) {
        char[] characters = s.toCharArray();
        int i = 0;
        int j = s.length() - 1;
        while (i < j) {
            char temp = characters[i];
            characters[i] = characters[j];
            characters[j] = temp;
            i++;
            j--;
        }
        return new String(characters);
    }
}`,
        testCases: [
            { description: 'should reverse a standard string', input: 'hello', expectedOutput: 'olleh' },
            { description: 'should handle empty string', input: '', expectedOutput: '' },
        ],
    },
    // Intermediate
    {
        id: 'jwt-middleware',
        title: 'JWT Authentication Middleware',
        description: 'Create an Express.js middleware to verify a JWT token from the Authorization header.',
        difficulty: 'Intermediate',
        tags: ['Node.js', 'Express', 'Security', 'JWT'],
        language: 'javascript',
        mainFile: 'authMiddleware.js',
        starterCode: `const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your-secret-key';

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    // Your code here. Verify the token and attach the decoded payload to req.user
    // If verification fails, send a 401 response.
}`,
        solution: `const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your-secret-key';

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
}`,
        testCases: [
            { description: 'should call next() with valid token', input: { headers: { authorization: `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyMywiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"}` } }, expectedOutput: 'next called' },
            { description: 'should return 401 for missing token', input: { headers: {} }, expectedOutput: { status: 401, body: { error: 'Unauthorized' } } },
            { description: 'should return 401 for invalid token', input: { headers: { authorization: 'Bearer invalidtoken' } }, expectedOutput: { status: 401, body: { error: 'Invalid token' } } },
        ],
    },
    {
        id: 'rust-cli-tool',
        title: 'Build a Simple CLI Tool with Rust',
        description: 'Create a command-line tool in Rust that takes a filename as an argument and prints the number of lines in the file.',
        difficulty: 'Intermediate',
        tags: ['Rust', 'CLI'],
        language: 'rust',
        mainFile: 'src/main.rs',
        starterCode: `use std::env;
use std::fs;

fn main() {
    // Your code here
}`,
        solution: `use std::env;
use std::fs;

fn main() {
    let args: Vec<String> = env::args().collect();
    if args.len() < 2 {
        eprintln!("Usage: line-counter <filename>");
        return;
    }
    let filename = &args[1];
    
    let contents = fs::read_to_string(filename)
        .expect("Something went wrong reading the file");

    println!("{} has {} lines", filename, contents.lines().count());
}`,
        testCases: [
             { description: 'should count lines in a file', input: { filename: 'test.txt', content: 'one\ntwo\nthree' }, expectedOutput: '3 lines' },
        ],
    },
    // Hard
    {
        id: 'caching-layer-redis',
        title: 'Implement a Caching Layer with Redis',
        description: 'Enhance a slow database-fetching function by implementing a caching layer using Redis. If the data is in the cache, return it from there. Otherwise, fetch from the "database," store it in the cache, and then return it.',
        difficulty: 'Hard',
        tags: ['Node.js', 'Performance', 'Redis', 'Caching'],
        language: 'javascript',
        mainFile: 'caching.js',
        starterCode: `const redis = require('redis');
const client = redis.createClient();

// Mock slow DB call
const getFromDB = async (id) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { id, data: \`Data for \${id}\` };
}

async function getCachedData(id) {
  // Your implementation here.
}`,
        solution: `const redis = require('redis');
const { promisify } = require('util');
const client = redis.createClient();

const getAsync = promisify(client.get).bind(client);
const setexAsync = promisify(client.setex).bind(client);

// Mock slow DB call
const getFromDB = async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Fetching from database...');
    return { id, data: \`Data for \${id}\` };
}

async function getCachedData(id) {
  try {
    const cachedData = await getAsync(id);
    if (cachedData) {
      console.log('Fetching from cache...');
      return JSON.parse(cachedData);
    }

    const dbData = await getFromDB(id);
    await setexAsync(id, 60, JSON.stringify(dbData));
    return dbData;
  } catch (error) {
    console.error("Error in getCachedData:", error);
    throw error;
  }
}
`,
        testCases: [
            { description: 'should fetch from DB on first call', input: '123', expectedOutput: 'fetched from db' },
            { description: 'should fetch from cache on second call', input: '123', expectedOutput: 'fetched from cache' },
        ],
    },
    {
        id: 'go-concurrent-fetcher',
        title: 'Go Concurrent URL Fetcher',
        description: 'Write a Go function that fetches multiple URLs concurrently and returns their content.',
        difficulty: 'Hard',
        tags: ['Go', 'Concurrency'],
        language: 'go',
        mainFile: 'main.go',
        starterCode: `package main

import (
	"net/http"
	"sync"
)

func FetchUrls(urls []string) map[string]string {
	// Your code here
}`,
        solution: `package main

import (
	"io/ioutil"
	"net/http"
	"sync"
)

func FetchUrls(urls []string) map[string]string {
	var wg sync.WaitGroup
	results := make(map[string]string)
    resultsChan := make(chan map[string]string, len(urls))
    mu := &sync.Mutex{}

	for _, url := range urls {
		wg.Add(1)
		go func(u string) {
			defer wg.Done()
			resp, err := http.Get(u)
			if err == nil {
                // In a real scenario, you'd handle the body properly.
                // For this test, we'll just use status.
                mu.Lock()
                results[u] = resp.Status
                mu.Unlock()
				resp.Body.Close()
			}
		}(url)
	}

    wg.Wait()
	return results
}`,
        testCases: [
            { description: 'should fetch given URLs', input: ['https://google.com', 'https://bing.com'], expectedOutput: { 'https://google.com': '200 OK', 'https://bing.com': '200 OK' } },
        ],
    },
     {
        id: 'fastapi-ml-model',
        title: 'Deploy ML Model with FastAPI',
        description: 'Create a FastAPI endpoint that takes numerical input, feeds it into a pre-trained machine learning model (simulated), and returns the prediction.',
        difficulty: 'Hard',
        tags: ['Python', 'FastAPI', 'Machine Learning', 'API'],
        language: 'python',
        mainFile: 'main.py',
        starterCode: `from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class PredictionRequest(BaseModel):
    features: list[float]

# Simulate a loaded model
def predict_model(features):
    return sum(features) * 0.42

@app.post("/predict")
def predict(request: PredictionRequest):
    # Your implementation here`,
        solution: `from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class PredictionRequest(BaseModel):
    features: list[float]

# Simulate a loaded model
def predict_model(features):
    return sum(features) * 0.42

@app.post("/predict")
def predict(request: PredictionRequest):
    prediction = predict_model(request.features)
    return {"prediction": prediction}
`,
        testCases: [
            { description: 'should return a prediction', input: { "features": [1, 2, 3] }, expectedOutput: {"prediction": 2.52} },
            { description: 'should work with different inputs', input: { "features": [10, 20] }, expectedOutput: {"prediction": 12.6} },
        ],
    },
    // Expert
    {
        id: 'message-queue-producer',
        title: 'Build a Message Queue Producer',
        description: 'Create a Node.js script that connects to a RabbitMQ instance and sends a message to a specific queue. This is a foundational skill for building distributed systems.',
        difficulty: 'Expert',
        tags: ['Node.js', 'RabbitMQ', 'Microservices', 'System Design'],
        language: 'javascript',
        mainFile: 'producer.js',
        starterCode: `const amqp = require('amqplib/callback_api');

function sendMessage(queue, msg) {
    // Your code here
}
`,
        solution: `const amqp = require('amqplib/callback_api');

function sendMessage(queue, msg) {
    amqp.connect('amqp://localhost', function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }
            channel.assertQueue(queue, {
                durable: false
            });
            channel.sendToQueue(queue, Buffer.from(msg));
            console.log(" [x] Sent %s", msg);
        });
        setTimeout(function() {
            connection.close();
            // In a real app, you wouldn't exit. This is for the test environment.
            // process.exit(0);
        }, 500);
    });
}
`,
        testCases: [
             { description: 'should send a message to the queue', input: { queue: 'task_queue', msg: 'Hello World!' }, expectedOutput: 'sent message' },
        ],
    },
    {
        id: 'fullstack-url-shortener',
        title: 'Full-Stack URL Shortener',
        description: 'Build a complete URL shortener service. The backend should handle creating short URLs, storing them, and redirecting users. The frontend should provide an interface to submit a URL and get the shortened link.',
        difficulty: 'Expert',
        tags: ['Full-Stack', 'Node.js', 'React', 'Database'],
        language: 'javascript',
        mainFile: 'backend/server.js',
        starterCode: `// Backend: server.js
// TODO:
// - Set up an Express server.
// - In-memory database (or connect to a real one).
// - POST /api/shorten: Takes a URL, generates a short code, saves to DB.
// - GET /:shortCode: Looks up the code in the DB and redirects to the original URL.
`,
        solution: `// Backend: server.js
const express = require('express');
const crypto = require('crypto');
const app = express();
app.use(express.json());

const urlDatabase = {}; // Using in-memory store for simplicity

app.post('/api/shorten', (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });

    const shortCode = crypto.randomBytes(3).toString('hex');
    urlDatabase[shortCode] = url;

    res.json({ shortUrl: \`http://localhost:3000/\${shortCode}\` });
});

app.get('/:shortCode', (req, res) => {
    const { shortCode } = req.params;
    const originalUrl = urlDatabase[shortCode];

    if (originalUrl) {
        res.redirect(originalUrl);
    } else {
        res.status(404).send('Not Found');
    }
});
`,
        otherFiles: [
            {
                path: 'frontend/App.js',
                content: `// Frontend: App.js (React)
// TODO:
// - An input field to enter a long URL.
// - A button to submit.
// - A state to hold the shortened URL.
// - Display the shortened URL returned from the backend.
`
            }
        ],
        testCases: [
            { description: 'should create a short URL', input: { url: 'https://google.com' }, expectedOutput: 'short URL created' },
            { description: 'should redirect to the original URL', input: null, expectedOutput: 'redirect successful' },
        ],
    },
    {
        id: 'fullstack-analytics-dashboard',
        title: 'Full-Stack Analytics Dashboard',
        description: 'Build a full-stack application with a Node.js backend and React frontend to display real-time analytics. The backend should provide a WebSocket endpoint that pushes data, and the frontend should consume this data and render charts.',
        difficulty: 'Expert',
        tags: ['Full-Stack', 'Node.js', 'React', 'WebSocket', 'Charts'],
        language: 'javascript',
        mainFile: 'backend/server.js',
        starterCode: `// Backend: server.js
// TODO: Set up a WebSocket server that broadcasts data periodically.
`,
        solution: `// Backend: server.js
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', ws => {
  console.log('Client connected');
  const interval = setInterval(() => {
    ws.send(JSON.stringify({
      timestamp: Date.now(),
      users: Math.floor(Math.random() * 1000),
      revenue: Math.random() * 500
    }));
  }, 2000);

  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(interval);
  });
});
`,
        otherFiles: [
            {
                path: 'frontend/App.js',
                content: `// Frontend: App.js (React)
// TODO: Build the React component to connect to this WebSocket
// and display the data using a charting library like Recharts.
`
            }
        ],
        testCases: [
            { description: 'WebSocket server should start without errors', input: null, expectedOutput: 'server running' },
            { description: 'Frontend should receive WebSocket messages', input: null, expectedOutput: 'message received' },
        ],
    },
];

    