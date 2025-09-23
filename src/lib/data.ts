export type Challenge = {
  id: string;
  slug: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  starterCode: string;
  tags: string[];
};

export const challenges: Challenge[] = [
  {
    id: '1',
    slug: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    description: `Given an array of integers 'nums' and an integer 'target', return indices of the two numbers such that they add up to 'target'. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.`,
    starterCode: `function twoSum(nums, target) {\n  // Write your code here\n}`,
    tags: ['Arrays', 'Hash Table'],
  },
  {
    id: '2',
    slug: 'palindrome-check',
    title: 'Palindrome Check',
    difficulty: 'Easy',
    description: `Write a function that takes a non-empty string and returns a boolean representing whether the string is a palindrome. A palindrome is defined as a string that's written the same forward and backward. Note that single-character strings are palindromes.`,
    starterCode: `function isPalindrome(string) {\n  // Write your code here\n}`,
    tags: ['Strings'],
  },
  {
    id: '3',
    slug: 'api-rate-limiter',
    title: 'API Rate Limiter',
    difficulty: 'Medium',
    description: `Implement a rate limiter that throttles API requests. The rate limiter should allow a certain number of requests from an IP address in a given time window. For example, 100 requests per minute.`,
    starterCode: `class RateLimiter {\n  constructor(limit, windowMs) {\n    this.limit = limit;\n    this.windowMs = windowMs;\n    this.store = new Map();\n  }\n\n  isAllowed(ip) {\n    // Write your code here\n  }\n}`,
    tags: ['System Design', 'Algorithms'],
  },
  {
    id: '4',
    slug: 'lru-cache',
    title: 'LRU Cache',
    difficulty: 'Hard',
    description: 'Design and implement a Least Recently Used (LRU) cache. It should support the following operations: get and put. `get(key)` - Get the value (will always be positive) of the key if the key exists in the cache, otherwise return -1. `put(key, value)` - Set or insert the value if the key is not already present. When the cache reached its capacity, it should invalidate the least recently used item before inserting a new item.',
    starterCode: `class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.cache = new Map();\n  }\n\n  get(key) {\n    // Write your code here\n  }\n\n  put(key, value) {\n    // Write your code here\n  }\n}`,
    tags: ['Data Structures', 'Design'],
  },
];

export const analyticsData = {
  completionRate: 68,
  skills: [
    { name: 'Arrays', value: 90 },
    { name: 'Strings', value: 85 },
    { name: 'Hash Tables', value: 75 },
    { name: 'System Design', value: 50 },
    { name: 'Data Structures', value: 40 },
    { name: 'Algorithms', value: 60 },
  ],
  weeklyActivity: [
    { day: 'Mon', challenges: 2 },
    { day: 'Tue', challenges: 3 },
    { day: 'Wed', challenges: 1 },
    { day: 'Thu', challenges: 4 },
    { day: 'Fri', challenges: 2 },
    { day: 'Sat', challenges: 5 },
    { day: 'Sun', challenges: 1 },
  ],
  rawSummary: JSON.stringify({
    completed_challenges: ["Two Sum", "Palindrome Check"],
    attempted_challenges: { "API Rate Limiter": "50% progress", "LRU Cache": "10% progress" },
    common_errors: ["Off-by-one errors in loops", "Incorrect hash key usage"],
    time_spent_per_topic: { "Arrays": "3 hours", "Strings": "2 hours", "System Design": "4 hours" },
  })
};
