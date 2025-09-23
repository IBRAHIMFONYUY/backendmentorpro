
import type { FileSystemNode, TestResult } from "./ide-types";

export type Challenge = {
  id: string;
  slug: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  description: string;
  tags: string[];
  readme: string;
  fileSystem: FileSystemNode;
  testCases: TestResult[];
};

export const challenges: Challenge[] = [
  // --- Easy Challenges ---
  {
    id: '1',
    slug: 'node-hello-world',
    title: 'Node.js: Hello World Server',
    difficulty: 'Easy',
    description: 'Create a basic web server using Node.js and Express that responds with "Hello, World!" to incoming requests.',
    tags: ['Node.js', 'Express', 'API'],
    readme: `
# Challenge: Node.js Hello World Server

**Difficulty:** Easy

## 🎯 Goal

Your task is to create a simple web server using Node.js and the Express framework. The server should listen on port 3000 and respond to all GET requests to the root path ('/') with the plain text message "Hello, World!".

## ✅ Requirements

1.  **Create an Express server:** Your \`server.js\` file should import Express and initialize an app.
2.  **Define a route:** Create a GET route for the root path ('/').
3.  **Send a response:** The route handler should send the string "Hello, World!" as the response.
4.  **Start the server:** The server must listen for connections on port 3000.
5.  **Log a message:** When the server starts, it should log "Server is running on port 3000" to the console.

## 💡 Hints

- You'll need to use \`app.get()\` to define the route.
- The response can be sent using \`res.send()\`.
- The server is started with \`app.listen()\`.

Good luck!
`,
    fileSystem: {
      name: 'hello-world-server', type: 'folder', path: '/', children: [
        { name: 'package.json', type: 'file', path: '/package.json', content: '{\n  "name": "hello-world-server",\n  "main": "server.js",\n  "dependencies": {\n    "express": "latest"\n  }\n}' },
        { name: 'server.js', type: 'file', path: '/server.js', content: `const express = require('express');\nconst app = express();\nconst port = 3000;\n\n// Your code here\n\n` },
      ]
    },
    testCases: [
      { name: "Server starts without errors", status: 'pending', output: "Pending" },
      { name: "Responds to GET / with 200 OK", status: 'pending', output: "Pending" },
      { name: "Response body is 'Hello, World!'", status: 'pending', output: "Pending" },
      { name: "Listens on port 3000", status: 'pending', output: "Pending" },
      { name: "Logs startup message to console", status: 'pending', output: "Pending" },
    ]
  },
  {
    id: '2',
    slug: 'palindrome-check-api',
    title: 'API: Palindrome Checker',
    difficulty: 'Easy',
    description: 'Build a simple API endpoint that checks if a given string is a palindrome.',
    tags: ['API', 'Strings', 'Algorithms'],
    readme: `
# Challenge: Palindrome Checker API

**Difficulty:** Easy

## 🎯 Goal

Create a GET endpoint \`/api/check/:string\` that takes a string from the URL path and returns a JSON response indicating whether the string is a palindrome.

A palindrome is a word or phrase that reads the same forwards and backwards (e.g., "racecar", "madam").

## ✅ Requirements

1.  **Set up an Express server** in \`server.js\`.
2.  **Create the dynamic route:** The server must handle GET requests to \`/api/check/:string\`.
3.  **Implement the logic:**
    - Read the string from the request parameters (\`req.params.string\`).
    - The check should be case-insensitive.
    - Ignore non-alphanumeric characters.
4.  **Return a JSON response:**
    - The response should have a status code of 200.
    - The JSON body should look like this: \`{ "isPalindrome": true }\` or \`{ "isPalindrome": false }\`.

## 💡 Example

- A GET request to \`/api/check/RaceCar\` should return \`{ "isPalindrome": true }\`.
- A GET request to \`/api/check/hello\` should return \`{ "isPalindrome": false }\`.

Good luck!`,
    fileSystem: {
      name: 'palindrome-api', type: 'folder', path: '/', children: [
        { name: 'package.json', type: 'file', path: '/package.json', content: '{\n  "name": "palindrome-api",\n  "main": "server.js",\n  "dependencies": {\n    "express": "latest"\n  }\n}' },
        { name: 'server.js', type: 'file', path: '/server.js', content: `const express = require('express');\nconst app = express();\nconst port = 3000;\n\napp.get('/api/check/:string', (req, res) => {\n  // Your implementation here\n});\n\napp.listen(port, () => {\n  console.log(\`Server running on port \${port}\`);\n});\n` },
      ]
    },
    testCases: [
      { name: "Handles simple palindrome ('racecar')", status: 'pending', output: "Pending" },
      { name: "Handles simple non-palindrome ('hello')", status: 'pending', output: "Pending" },
      { name: "Is case-insensitive ('RaceCar')", status: 'pending', output: "Pending" },
      { name: "Returns correct JSON structure", status: 'pending', output: "Pending" },
      { name: "Server responds with 200 OK", status: 'pending', output: "Pending" },
    ]
  },
  {
    id: '3',
    slug: 'simple-jwt-auth',
    title: 'API: Basic JWT Authentication',
    difficulty: 'Easy',
    description: 'Implement a basic JWT authentication system with login and a protected route.',
    tags: ['JWT', 'Security', 'API'],
    readme: `
# Challenge: Basic JWT Authentication

**Difficulty:** Easy

## 🎯 Goal

Create a simple authentication system using JSON Web Tokens (JWT). You need to implement two endpoints:
1.  \`POST /api/login\`: Takes a username and password, and returns a JWT if the credentials are valid.
2.  \`GET /api/protected\`: A route that can only be accessed with a valid JWT.

## ✅ Requirements

1.  **User Validation:** For simplicity, you can hardcode a single user. For example: username \`user\` and password \`password\`.
2.  **Login Endpoint (\`/api/login\`):**
    - It should accept a POST request with a JSON body containing \`username\` and \`password\`.
    - If credentials match the hardcoded user, generate a JWT signed with a secret key (\`your-secret-key\`).
    - The JWT payload should contain the username.
    - Return a JSON response: \`{ "token": "your_jwt_here" }\`.
    - If credentials do not match, return a 401 Unauthorized status with an error message.
3.  **Protected Endpoint (\`/api/protected\`):**
    - It should require an \`Authorization\` header with the format \`Bearer <token>\`.
    - Create a middleware function to verify the JWT.
    - If the token is valid, the route should return a success message like \`{ "message": "Welcome user" }\`.
    - If the token is missing or invalid, the middleware should return a 403 Forbidden status.

## 📦 Dependencies

You'll need \`express\` and \`jsonwebtoken\`. They are already in your \`package.json\`.

Good luck!
`,
    fileSystem: {
      name: 'simple-jwt-auth', type: 'folder', path: '/', children: [
        { name: 'package.json', type: 'file', path: '/package.json', content: '{\n  "name": "simple-jwt-auth",\n  "main": "server.js",\n  "dependencies": {\n    "express": "latest",\n    "jsonwebtoken": "latest"\n  }\n}' },
        { name: 'server.js', type: 'file', path: '/server.js', content: `const express = require('express');\nconst jwt = require('jsonwebtoken');\n\nconst app = express();\napp.use(express.json());\n\nconst JWT_SECRET = 'your-secret-key';\n\n// --- Your code here ---\n\n\napp.listen(3000, () => console.log('Server started on port 3000'));` },
      ]
    },
    testCases: [
      { name: "POST /api/login with valid credentials", status: 'pending', output: "Pending" },
      { name: "POST /api/login with invalid credentials", status: 'pending', output: "Pending" },
      { name: "GET /api/protected without token", status: 'pending', output: "Pending" },
      { name: "GET /api/protected with invalid token", status: 'pending', output: "Pending" },
      { name: "GET /api/protected with valid token", status: 'pending', output: "Pending" },
    ]
  },

  // --- Medium Challenges ---
  {
    id: '4',
    slug: 'api-rate-limiter',
    title: 'Middleware: API Rate Limiter',
    difficulty: 'Medium',
    description: 'Implement a rate limiter that throttles API requests based on IP address.',
    tags: ['System Design', 'Middleware', 'Express'],
    readme: `
# Challenge: API Rate Limiter

**Difficulty:** Medium

## 🎯 Goal

Implement an Express middleware that limits the number of requests an IP address can make to your API within a specific time window.

## ✅ Requirements

1.  **Create a \`rateLimiter\` middleware function.**
2.  The function should take an options object: \`{ windowMs, maxRequests }\`.
    - \`windowMs\`: The time window in milliseconds (e.g., 60000 for 1 minute).
    - \`maxRequests\`: The maximum number of requests allowed per IP in that window.
3.  **Track Requests:** Use an in-memory store (like a \`Map\`) to track the request counts for each IP address (\`req.ip\`).
4.  **Logic:**
    - For each request, check the IP's request count.
    - If the count is under the \`maxRequests\` limit, increment the count and allow the request to proceed by calling \`next()\`.
    - If the count exceeds the limit, block the request by sending a 429 Too Many Requests status with a JSON error message.
    - The request count for an IP should reset after \`windowMs\` has passed since their first request in the window.
5.  **Apply the Middleware:** Apply your rate limiter middleware to a sample API route (e.g., \`/api/limited\`).

## 💡 Hints

- A \`Map\` is a good choice for the in-memory store. You can store objects like \`{ count: 1, startTime: Date.now() }\` for each IP.
- You'll need to check the time elapsed since \`startTime\` to know when to reset the count.
- \`req.ip\` gives you the IP address of the request.

Good luck!
`,
    fileSystem: {
      name: 'api-rate-limiter', type: 'folder', path: '/', children: [
        { name: 'package.json', type: 'file', path: '/package.json', content: '{\n  "name": "api-rate-limiter",\n  "main": "server.js",\n  "dependencies": {\n    "express": "latest"\n  }\n}' },
        { name: 'rateLimiter.js', type: 'file', path: '/rateLimiter.js', content: `// Your middleware implementation here\n\nfunction rateLimiter(options) {\n  // ...\n}\n\nmodule.exports = rateLimiter;\n`},
        { name: 'server.js', type: 'file', path: '/server.js', content: `const express = require('express');\nconst rateLimiter = require('./rateLimiter');\n\nconst app = express();\n\n// Apply the rate limiter\nconst limiter = rateLimiter({\n  windowMs: 60 * 1000, // 1 minute\n  maxRequests: 5,\n});\n\napp.use('/api/limited', limiter);\n\napp.get('/api/limited', (req, res) => {\n  res.send({ message: 'This is a limited resource!' });\n});\n\napp.listen(3000, () => console.log('Server started on port 3000'));` },
      ]
    },
    testCases: [
      { name: "Allows first few requests", status: 'pending', output: "Pending" },
      { name: "Blocks requests exceeding the limit", status: 'pending', output: "Pending" },
      { name: "Sends 429 status code when blocked", status: 'pending', output: "Pending" },
      { name: "Resets count after window expires", status: 'pending', output: "Pending" },
      { name: "Tracks different IPs independently", status: 'pending', output: "Pending" },
    ]
  },
  {
    id: '5',
    slug: 'todo-api-mongodb',
    title: 'Fullstack: To-Do API with MongoDB',
    difficulty: 'Medium',
    description: 'Build a full CRUD API for a To-Do list application using Node.js, Express, and MongoDB.',
    tags: ['CRUD', 'MongoDB', 'API', 'Fullstack'],
    readme: `
# Challenge: To-Do API with MongoDB

**Difficulty:** Medium

## 🎯 Goal

Build a complete RESTful API for a "To-Do" application. The API should support all CRUD (Create, Read, Update, Delete) operations and persist data in a MongoDB database.

## ✅ Requirements

You need to implement the following endpoints:

1.  **\`GET /api/todos\`**
    - Fetches all to-do items from the database.
    - Returns a JSON array of to-do items.

2.  **\`POST /api/todos\`**
    - Creates a new to-do item.
    - The request body should be a JSON object like \`{ "task": "Learn Express", "completed": false }\`.
    - Returns the newly created to-do item with its database ID.

3.  **\`GET /api/todos/:id\`**
    - Fetches a single to-do item by its ID.
    - Returns the corresponding to-do item.
    - If not found, returns a 404 Not Found error.

4.  **\`PUT /api/todos/:id\`**
    - Updates a to-do item by its ID.
    - The request body can contain the \`task\` and/or \`completed\` fields.
    - Returns the updated to-do item.
    - If not found, returns a 404 Not Found error.

5.  **\`DELETE /api/todos/:id\`**
    - Deletes a to-do item by its ID.
    - Returns a 200 OK status with a success message.
    - If not found, returns a 404 Not Found error.

## 📦 Dependencies

- You will need \`express\`, \`mongoose\`, and \`body-parser\`.
- A simple Mongoose schema for the To-Do item should be defined in \`models/Todo.js\`.
- Assume the MongoDB connection string is provided via an environment variable \`MONGO_URI\`. For this challenge, you can mock the database interaction.

Good luck!
`,
    fileSystem: {
      name: 'todo-api', type: 'folder', path: '/', children: [
        { name: 'package.json', type: 'file', path: '/package.json', content: '{\n  "name": "todo-api-mongodb",\n  "main": "server.js",\n  "dependencies": {\n    "express": "latest",\n    "mongoose": "latest",\n    "body-parser": "latest"\n  }\n}' },
        { name: 'models', type: 'folder', path: '/models', children: [
          { name: 'Todo.js', type: 'file', path: '/models/Todo.js', content: `const mongoose = require('mongoose');\n\nconst TodoSchema = new mongoose.Schema({\n  task: {\n    type: String,\n    required: true\n  },\n  completed: {\n    type:Boolean,\n    default: false\n  }\n});\n\nmodule.exports = mongoose.model('Todo', TodoSchema);` }
        ]},
        { name: 'routes', type: 'folder', path: '/routes', children: [
          { name: 'todos.js', type: 'file', path: '/routes/todos.js', content: `const express = require('express');\nconst router = express.Router();\n\n// --- Your CRUD routes here ---\n\nmodule.exports = router;` }
        ]},
        { name: 'server.js', type: 'file', path: '/server.js', content: `const express = require('express');\nconst bodyParser = require('body-parser');\n\nconst app = express();\napp.use(bodyParser.json());\n\n// Mock DB connection\nconsole.log('MongoDB connection would be here.');\n\napp.use('/api/todos', require('./routes/todos'));\n\napp.listen(3000, () => console.log('Server running on port 3000'));` },
      ]
    },
    testCases: [
      { name: "POST /api/todos creates an item", status: 'pending', output: "Pending" },
      { name: "GET /api/todos returns all items", status: 'pending', output: "Pending" },
      { name: "GET /api/todos/:id returns a single item", status: 'pending', output: "Pending" },
      { name: "PUT /api/todos/:id updates an item", status: 'pending', output: "Pending" },
      { name: "DELETE /api/todos/:id removes an item", status: 'pending', output: "Pending" },
      { name: "Handles 404 for non-existent items", status: 'pending', output: "Pending" },
    ]
  },

  // --- Hard Challenges ---
  {
    id: '6',
    slug: 'lru-cache',
    title: 'Data Structures: LRU Cache',
    difficulty: 'Hard',
    description: 'Design and implement a Least Recently Used (LRU) cache from scratch.',
    tags: ['Data Structures', 'Design', 'Algorithms'],
    readme: `
# Challenge: LRU Cache

**Difficulty:** Hard

## 🎯 Goal

Design and implement a Least Recently Used (LRU) cache. It must support two operations: \`get\` and \`put\`.

-   \`get(key)\`: Get the value of the key if it exists in the cache, otherwise return -1. Accessing a key makes it the "most recently used".
-   \`put(key, value)\`: Set or insert the value. If the key is not present, add it. If the cache reaches its capacity, it must invalidate the **least recently used** item before inserting a new one.

## ✅ Requirements

1.  **Implement the \`LRUCache\` class.**
2.  The constructor \`new LRUCache(capacity)\` should initialize the cache with a given positive capacity.
3.  The \`get(key)\` method must have an average time complexity of O(1).
4.  The \`put(key, value)\` method must have an average time complexity of O(1).

## 💡 Hints

-   A combination of a **Hash Map** and a **Doubly Linked List** is a classic and efficient way to solve this problem.
-   The Hash Map provides the O(1) lookup for keys.
-   The Doubly Linked List helps maintain the order of "recency" in O(1) time by moving nodes to the front (most recent) or removing them from the back (least recent).
-   The map can store keys and pointers (or references) to the nodes in the linked list.

Good luck!
`,
    fileSystem: {
      name: 'lru-cache', type: 'folder', path: '/', children: [
        { name: 'LRUCache.js', type: 'file', path: '/LRUCache.js', content: `class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.cache = new Map();\n    // You will likely need another data structure here to track recency.\n  }\n\n  get(key) {\n    // Implement here\n  }\n\n  put(key, value) {\n    // Implement here\n  }\n}\n\nmodule.exports = LRUCache;` },
        { name: 'test.js', type: 'file', path: '/test.js', content: `const LRUCache = require('./LRUCache');\n\nconst cache = new LRUCache(2);\n\ncache.put(1, 1);\ncache.put(2, 2);\nconsole.log(cache.get(1)); // returns 1\ncache.put(3, 3); // evicts key 2\nconsole.log(cache.get(2)); // returns -1 (not found)\ncache.put(4, 4); // evicts key 1\nconsole.log(cache.get(1)); // returns -1 (not found)\nconsole.log(cache.get(3)); // returns 3\nconsole.log(cache.get(4)); // returns 4` }
      ]
    },
    testCases: [
      { name: "Initial put and get works", status: 'pending', output: "Pending" },
      { name: "Evicts least recently used item", status: 'pending', output: "Pending" },
      { name: "Get updates item to most recently used", status: 'pending', output: "Pending" },
      { name: "Put on existing key updates value", status: 'pending', output: "Pending" },
      { name: "Handles capacity of 1", status: 'pending', output: "Pending" },
      { name: "Maintains O(1) complexity", status: 'pending', output: "Pending" },
    ]
  },
  {
    id: '7',
    slug: 'realtime-chat-websockets',
    title: 'Fullstack: Real-time Chat App',
    difficulty: 'Hard',
    description: 'Create a real-time chat application using WebSockets.',
    tags: ['WebSockets', 'Real-time', 'Fullstack'],
    readme: `
# Challenge: Real-time Chat with WebSockets

**Difficulty:** Hard

## 🎯 Goal

Build a simple, real-time, multi-user chat application. The backend should use Node.js and the \`ws\` library for WebSockets, and the frontend should be a basic HTML page that connects to the server and can send/receive messages.

## ✅ Backend Requirements (\`server.js\`)

1.  **Create an HTTP and WebSocket server:** The server should run on port 3000.
2.  **Handle Connections:** When a new client connects, store their WebSocket connection in a set or array.
3.  **Broadcast Messages:** When the server receives a message from one client, it should broadcast that message to **all other connected clients**.
4.  **Handle Disconnections:** When a client disconnects, remove their connection from your stored set to prevent errors.
5.  **Serve Frontend:** The server should also serve the \`index.html\` file when a user navigates to the root URL ('/').

## ✅ Frontend Requirements (\`index.html\`)

1.  **Establish Connection:** Use browser-native \`WebSocket\` API to connect to your server at \`ws://localhost:3000\`.
2.  **Send Messages:** Provide a text input and a "Send" button. When the button is clicked, send the input's value to the WebSocket server.
3.  **Display Messages:** Listen for messages from the server. When a message is received, append it to a list or div on the page.

## 💡 Hints

-   For the backend, you'll use the \`ws\` library. The documentation is a great resource.
-   You will need to iterate over your set of connected clients to broadcast messages.
-   On the frontend, the \`WebSocket\` object has event listeners like \`onopen\`, \`onmessage\`, and \`onclose\`.

Good luck building your real-time app!
`,
    fileSystem: {
      name: 'websocket-chat', type: 'folder', path: '/', children: [
        { name: 'package.json', type: 'file', path: '/package.json', content: '{\n  "name": "websocket-chat",\n  "main": "server.js",\n  "dependencies": {\n    "ws": "latest",\n    "express": "latest"\n  }\n}' },
        { name: 'index.html', type: 'file', path: '/index.html', content: `<!DOCTYPE html>\n<html>\n<head>\n  <title>WebSocket Chat</title>\n</head>\n<body>\n  <h1>Chat</h1>\n  <ul id="messages"></ul>\n  <input id="messageBox" type="text" placeholder="Type message..."/>\n  <button id="sendBtn">Send</button>\n  <script>\n    // Your WebSocket client-side code here\n  </script>\n</body>\n</html>` },
        { name: 'server.js', type: 'file', path: '/server.js', content: `const express = require('express');\nconst http = require('http');\nconst WebSocket = require('ws');\nconst path = require('path');\n\nconst app = express();\nconst server = http.createServer(app);\nconst wss = new WebSocket.Server({ server });\n\n// Serve the frontend\napp.get('/', (req, res) => {\n  res.sendFile(path.join(__dirname, 'index.html'));\n});\n\nwss.on('connection', ws => {\n  console.log('Client connected');\n\n  // Your WebSocket logic here\n\n});\n\nserver.listen(3000, () => {\n  console.log('Server listening on port 3000');\n});\n` },
      ]
    },
    testCases: [
      { name: "Server starts and serves index.html", status: 'pending', output: "Pending" },
      { name: "Client establishes WebSocket connection", status: 'pending', output: "Pending" },
      { name: "Server receives a message from a client", status: 'pending', output: "Pending" },
      { name: "Server broadcasts message to other clients", status: 'pending', output: "Pending" },
      { name: "Server does not echo message to sender", status: 'pending', output: "Pending" },
      { name: "Handles client disconnection gracefully", status: 'pending', output: "Pending" },
    ]
  },
  
  // --- Expert Challenges ---
  {
    id: '8',
    slug: 'microservice-event-bus',
    title: 'System Design: Microservice Event Bus',
    difficulty: 'Expert',
    description: 'Design and implement a basic event bus for communication between microservices.',
    tags: ['System Design', 'Microservices', 'Node.js'],
    readme: `
# Challenge: Microservice Event Bus

**Difficulty:** Expert

## 🎯 Goal

Design and implement a simple, in-memory event bus in Node.js. This event bus will allow different parts of an application (simulating microservices) to communicate asynchronously by publishing events and subscribing to them, without being directly coupled.

## ✅ Requirements

1.  **Implement an \`EventBus\` class in \`EventBus.js\`.**
2.  **\`subscribe(eventName, callback)\` method:**
    -   Allows a "service" to register interest in a specific event.
    -   It should take an event name (string) and a callback function.
    -   Multiple callbacks can be subscribed to the same event.
    -   It should return an object with an \`unsubscribe\` method to allow the subscriber to stop listening.

3.  **\`publish(eventName, data)\` method:**
    -   Allows a "service" to publish an event.
    -   It should take an event name and some data payload.
    -   When an event is published, all subscribed callbacks for that event name must be invoked asynchronously (e.g., using \`setTimeout(..., 0)\` or \`process.nextTick\`) with the provided data.

4.  **Demonstrate its use:** In \`index.js\`, create an instance of the event bus and simulate two services:
    -   **OrderService:** Subscribes to a \`PAYMENT_SUCCESS\` event. When it receives the event, it logs a message like "OrderService: Preparing order #123 for shipment."
    -   **PaymentService:** Publishes a \`PAYMENT_SUCCESS\` event with an order ID after a simulated delay.

## 💡 Hints

-   Use a \`Map\` or an object to store event names as keys and arrays of callback functions as values.
-   The "asynchronous" requirement is key. A simple synchronous loop to call callbacks is not sufficient. This simulates the non-blocking nature of real event-driven systems.
-   Think about how the \`unsubscribe\` function will work. How will it know which specific callback to remove from the array of subscribers?

Good luck with this advanced design pattern!
`,
    fileSystem: {
      name: 'event-bus', type: 'folder', path: '/', children: [
        { name: 'EventBus.js', type: 'file', path: '/EventBus.js', content: `class EventBus {\n  constructor() {\n    this.listeners = {};\n  }\n\n  subscribe(eventName, callback) {\n    // Implement subscribe\n  }\n\n  publish(eventName, data) {\n    // Implement publish\n  }\n}\n\nmodule.exports = new EventBus(); // Export a singleton instance` },
        { name: 'index.js', type: 'file', path: '/index.js', content: `const eventBus = require('./EventBus');\n\n// --- Simulate OrderService ---\nconst orderSubscription = eventBus.subscribe('PAYMENT_SUCCESS', (data) => {\n  console.log(\`OrderService: Preparing order #\${data.orderId} for shipment.\`);\n});\n\n// --- Simulate NotificationService ---\neventBus.subscribe('PAYMENT_SUCCESS', (data) => {\n  console.log(\`NotificationService: Sending email for order #\${data.orderId}.\`);\n});\n\n// --- Simulate PaymentService ---\nfunction processPayment(orderId) {\n  console.log(\`PaymentService: Processing payment for order #\${orderId}...\`);\n  setTimeout(() => {\n    console.log(\`PaymentService: Payment for order #\${orderId} successful.\`);\n    eventBus.publish('PAYMENT_SUCCESS', { orderId });\n  }, 1000);\n}\n\nprocessPayment(123);\n\n// Demonstrate unsubscribe\nsetTimeout(() => {\n  console.log('\\n--- OrderService is unsubscribing ---');\n  orderSubscription.unsubscribe();\n  processPayment(456);\n}, 2000);` },
      ]
    },
    testCases: [
      { name: "Publishes event to a single subscriber", status: 'pending', output: "Pending" },
      { name: "Publishes event to multiple subscribers", status: 'pending', output: "Pending" },
      { name: "Callbacks are executed asynchronously", status: 'pending', output: "Pending" },
      { name: "Unsubscribe prevents future notifications", status: 'pending', output: "Pending" },
      { name: "Data payload is passed correctly", status: 'pending', output: "Pending" },
      { name: "Ignores events with no subscribers", status: 'pending', output: "Pending" },
    ]
  }
];
