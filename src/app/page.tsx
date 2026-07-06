
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Code,
  Compass,
  Database,
  Github,
  Network,
  Play,
  Rocket,
  Zap,
  Bot,
  Check,
  Twitter,
  Youtube,
  Users,
  Trophy,
  Server,
  Layers,
  BookOpen,
  Video,
  FileCode,
  Save,
  Share,
  Bug,
  BrainCircuit,
  Coffee,
  Container,
  ServerIcon,
  Code2,
  BookCopy,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { useAuth } from "@/hooks/use-auth";
import React, { useState, useEffect } from "react";

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [apiMethod, setApiMethod] = useState('GET');
  const [apiResponse, setApiResponse] = useState<{status: number, statusText: string, data: any} | null>(null);
  const [isLoadingApi, setIsLoadingApi] = useState(false);
  const [developerCount, setDeveloperCount] = useState(0);
  const [challengeCount, setChallengeCount] = useState(0);
  const [successRate, setSuccessRate] = useState(0);

  useEffect(() => {
    const animateCounter = (setter: React.Dispatch<React.SetStateAction<number>>, target: number, duration = 2000) => {
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                setter(target);
                clearInterval(timer);
            } else {
                setter(Math.floor(start));
            }
        }, 16);
        return timer;
    };

    const devTimer = animateCounter(setDeveloperCount, 52847);
    const challengeTimer = animateCounter(setChallengeCount, 247);
    const successTimer = animateCounter(setSuccessRate, 94);

    return () => {
        clearInterval(devTimer);
        clearInterval(challengeTimer);
        clearInterval(successTimer);
    };
  }, []);

  const handleGetStarted = () => {
    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };
  
  const handleSendRequest = async () => {
    setIsLoadingApi(true);
    setApiResponse(null);
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts/1');
      const data = await res.json();
      setApiResponse({
        status: res.status,
        statusText: res.statusText,
        data: data
      });
    } catch (err) {
      setApiResponse({
        status: 500,
        statusText: "Error",
        data: "Failed to fetch data."
      });
    } finally {
      setIsLoadingApi(false);
    }
  };

  const techIcons = [
    { icon: <Icons.nodejs className="w-8 h-8" />, name: "Node.js" },
    { icon: <Icons.python className="w-8 h-8" />, name: "Python" },
    { icon: <Icons.java className="w-8 h-8" />, name: "Java" },
    { icon: <Icons.mongodb className="w-8 h-8" />, name: "MongoDB" },
    { icon: <Icons.postgresql className="w-8 h-8" />, name: "PostgreSQL" },
    { icon: <Icons.aws className="w-8 h-8" />, name: "AWS" },
    { icon: <Icons.php className="w-8 h-8" />, name: "PHP" },
    { icon: <Icons.docker className="w-8 h-8" />, name: "Docker" },
    { icon: <Icons.graphql className="w-8 h-8" />, name: "GraphQL" },
  ];

  return (
    <div className="bg-dark-bg text-white overflow-x-hidden">
      <div id="matrixBg" className="matrix-bg"></div>

      <nav className="fixed top-0 w-full z-50 glass-effect">
        <div className="container">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-accent-blue to-accent-red rounded-xl flex items-center justify-center">
                <Code className="text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">
                Backend Mentor
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="#challenges" className="hover:text-accent-blue transition-colors cursor-pointer font-medium">Challenges</Link>
              <Link href="#features" className="hover:text-accent-blue transition-colors cursor-pointer font-medium">Features</Link>
              <Link href="#playground" className="hover:text-accent-blue transition-colors cursor-pointer font-medium">Playground</Link>
              <Link href="#pricing" className="hover:text-accent-blue transition-colors cursor-pointer font-medium">Pricing</Link>
              <Link href="#community" className="hover:text-accent-blue transition-colors cursor-pointer font-medium">Community</Link>
            </div>

            <div className="flex items-center space-x-4">
              <Button onClick={() => router.push('/login')} variant="outline" className="border-accent-blue text-accent-blue hover:bg-accent-blue hover:text-white">
                Sign In
              </Button>
              <Button onClick={handleGetStarted} className="btn-primary animate-pulse-glow">
                Start Free
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="container">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8 animate-slide-in-left">
                    <div className="space-y-6">
                        <div className="inline-flex items-center px-4 py-2 rounded-full text-sm glass-effect">
                            <Rocket className="mr-2 text-accent-blue h-5 w-5" />
                            <span className="gradient-text font-semibold">AI-Powered Learning Platform</span>
                        </div>
                        <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                            Practice Real <span className="gradient-text">Backend</span> & <span className="gradient-text">Fullstack</span> Development
                        </h1>
                        <p className="text-lg text-gray-300 leading-relaxed max-w-2xl">
                            Master backend development through real-world challenges with intelligent AI mentorship, live coding environments, and instant feedback. From REST APIs to microservices architecture.
                        </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-6">
                        <Button size="lg" className="btn-primary text-lg" onClick={() => router.push('/challenges')}>
                            <Compass className="mr-2" />
                            Explore Challenges
                        </Button>
                         <Button size="lg" variant="outline" className="btn-secondary text-lg" onClick={handleGetStarted}>
                            <Play className="mr-2" />
                            Start Free
                        </Button>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-8 pt-8">
                        <div className="text-center">
                            <div className="text-3xl font-bold gradient-text">{developerCount.toLocaleString()}</div>
                            <div className="text-sm text-gray-400 font-medium">Active Developers</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold gradient-text">{challengeCount}</div>
                            <div className="text-sm text-gray-400 font-medium">Live Challenges</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold gradient-text">{successRate}%</div>
                            <div className="text-sm text-gray-400 font-medium">Success Rate</div>
                        </div>
                    </div>
                </div>
                
                <div className="relative animate-slide-in-right hidden lg:block">
                    <div className="animate-float">
                        <div className="code-editor shadow-2xl glass-effect">
                            <div className="flex items-center justify-between p-4 bg-dark-surface border-b border-dark-border">
                                <div className="flex items-center space-x-3">
                                    <div className="flex space-x-2">
                                        <div className="w-3 h-3 bg-accent-red rounded-full"></div>
                                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                                        <div className="w-3 h-3 bg-accent-green rounded-full"></div>
                                    </div>
                                    <span className="text-sm text-gray-400 font-mono">backend-api.js</span>
                                </div>
                                 <div className="flex items-center space-x-2">
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-white"><Save className="h-4 w-4"/></Button>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-white"><Share className="h-4 w-4"/></Button>
                                </div>
                            </div>
                            
                            <div className="p-6 font-mono text-sm leading-relaxed">
                                <pre><code>
{`// AI-Guided Backend Development
const express = require('express');
const cors = require('cors');

const app = express();

// AI: Security middleware recommended
app.use(helmet());
app.use(cors());
app.use(express.json());

app.post('/api/users', async (req, res) => {
  // AI: Validate input data
  try {
    const user = await createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error });
  }
});

app.listen(3000, () => {
  console.log('🚀 Server running on port 3000');
});`}
                                </code></pre>
                            </div>
                             <div className="p-4 bg-dark-surface border-t border-dark-border flex justify-between items-center">
                                <div className="flex space-x-3">
                                    <Button className="bg-accent-green text-white hover:bg-green-600"><Play className="mr-2"/>Run Code</Button>
                                    <Button className="bg-accent-purple text-white hover:bg-purple-600"><Bot className="mr-2"/>AI Help</Button>
                                    <Button className="bg-accent-blue text-white hover:bg-blue-600"><Share className="mr-2"/>Share</Button>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-400">
                                    <Check className="text-accent-green" />
                                    <span>Tests: 12/12</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="features" className="py-20 gradient-bg">
        <div className="container">
            <div className="text-center mb-16 animate-fade-in-up">
                <h2 className="text-5xl font-bold mb-6">Revolutionary <span className="gradient-text">Learning Experience</span></h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">AI Assistant, Live Editor, API Playground, and Real-time Collaboration - All in One Innovative Platform</p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8 mb-16">
                <div className="feature-card glass-effect rounded-2xl p-8 cursor-pointer group">
                    <div className="w-20 h-20 bg-gradient-to-r from-accent-blue to-accent-purple rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Bot className="text-white h-10 w-10" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">AI Mentor Assistant</h3>
                    <p className="text-gray-300 mb-6 leading-relaxed">Context-aware AI that provides real-time hints, debugging help, code reviews, and explains complex concepts with personalized learning paths.</p>
                </div>
                
                <div className="feature-card glass-effect rounded-2xl p-8 cursor-pointer group">
                    <div className="w-20 h-20 bg-gradient-to-r from-accent-red to-accent-purple rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Code className="text-white h-10 w-10" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Live Coding Environment</h3>
                    <p className="text-gray-300 mb-6 leading-relaxed">Monaco Editor with IntelliSense, syntax highlighting, real-time collaboration, instant code execution, and integrated debugging tools.</p>
                </div>
                
                <div className="feature-card glass-effect rounded-2xl p-8 cursor-pointer group">
                    <div className="w-20 h-20 bg-gradient-to-r from-accent-purple to-accent-blue rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Network className="text-white h-10 w-10" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">API Playground</h3>
                    <p className="text-gray-300 mb-6 leading-relaxed">Built-in Postman-like interface for testing APIs, viewing responses, debugging endpoints, and generating API documentation automatically.</p>
                </div>
            </div>
        </div>
    </section>

    <section id="playground" className="py-20">
        <div className="container">
            <div className="text-center mb-16">
                <h2 className="text-5xl font-bold mb-6">Experience the <span className="gradient-text">Platform</span></h2>
                <p className="text-xl text-gray-300">Try our interactive features right now - no signup required</p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12">
                <div className="glass-effect rounded-2xl p-8">
                    <h3 className="text-2xl font-bold mb-6">API Testing Playground</h3>
                    <div className="space-y-4">
                         <div>
                            <label className="block text-sm font-medium mb-2">API Endpoint</label>
                            <div className="relative">
                                <input id="apiUrl" type="text" defaultValue="https://jsonplaceholder.typicode.com/posts/1" 
                                       className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-xl text-white focus:border-accent-blue focus:outline-none font-mono"/>
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <Button onClick={handleSendRequest} disabled={isLoadingApi} className="flex-1 btn-primary text-white rounded-xl font-medium">
                                {isLoadingApi ? 'Sending...' : 'Send Request'}
                            </Button>
                        </div>
                        {apiResponse && (
                            <div>
                                <h4 className="font-semibold mt-4">Response</h4>
                                <pre className="text-sm bg-dark-surface p-4 rounded-lg mt-2 overflow-auto">
                                    <p>Status: {apiResponse.status} {apiResponse.statusText}</p>
                                    <p>Data: {JSON.stringify(apiResponse.data, null, 2)}</p>
                                </pre>
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="glass-effect rounded-2xl p-8">
                    <h3 className="text-2xl font-bold mb-6">Your Learning Journey</h3>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <span className="font-medium">Backend Fundamentals</span>
                                <span className="text-accent-blue font-semibold">85%</span>
                            </div>
                            <div className="w-full bg-dark-border rounded-full h-3">
                                <div className="bg-gradient-to-r from-accent-blue to-accent-purple h-3 rounded-full" style={{width: '85%'}}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <span className="font-medium">API Development</span>
                                <span className="text-accent-green font-semibold">72%</span>
                            </div>
                            <div className="w-full bg-dark-border rounded-full h-3">
                                <div className="bg-gradient-to-r from-accent-green to-accent-blue h-3 rounded-full" style={{width: '72%'}}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <span className="font-medium">Database Design</span>
                                <span className="text-accent-purple font-semibold">58%</span>
                            </div>
                            <div className="w-full bg-dark-border rounded-full h-3">
                                <div className="bg-gradient-to-r from-accent-purple to-accent-red h-3 rounded-full" style={{width: '58%'}}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="technologies" className="py-20 relative">
        <div className="container text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Master Modern Tech Stack</h2>
            <p className="text-xl text-gray-400 mb-16 max-w-3xl mx-auto">
                Practice with the technologies that power today's most successful applications
            </p>
            <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-8 mb-16">
                {techIcons.map((tech, index) => (
                    <div key={index} className="tech-icon flex flex-col items-center space-y-3">
                        <div className={`w-16 h-16 rounded-xl flex items-center justify-center`}>
                            {tech.icon}
                        </div>
                        <span className="text-gray-400 text-sm">{tech.name}</span>
                    </div>
                ))}
            </div>
        </div>
    </section>

    <section id="pricing" className="py-20 gradient-bg">
        <div className="container">
            <div className="text-center mb-16">
                <h2 className="text-5xl font-bold mb-6">Choose Your <span className="gradient-text">Learning Path</span></h2>
                <p className="text-xl text-gray-300">Start free, upgrade when you're ready to accelerate</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <div className="glass-effect rounded-2xl p-8 hover:scale-105 transition-transform">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold mb-2">Free</h3>
                        <div className="text-4xl font-bold mb-2">$0</div>
                        <div className="text-gray-400">Forever free</div>
                    </div>
                    <ul className="space-y-3 mb-8">
                        <li className="flex items-center space-x-3"><Check className="text-accent-green" /><span>5 challenges per month</span></li>
                        <li className="flex items-center space-x-3"><Check className="text-accent-green" /><span>Basic AI assistance</span></li>
                        <li className="flex items-center space-x-3"><Check className="text-accent-green" /><span>Community access</span></li>
                        <li className="flex items-center space-x-3"><Check className="text-accent-green" /><span>Progress tracking</span></li>
                    </ul>
                    <Button className="w-full" variant="outline">Get Started Free</Button>
                </div>
                
                <div className="glass-effect rounded-2xl p-8 border-2 border-accent-blue relative hover:scale-105 transition-transform">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-accent-blue text-white rounded-full text-sm font-medium">Most Popular</div>
                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold mb-2">Pro</h3>
                        <div className="text-4xl font-bold mb-2">$29</div>
                        <div className="text-gray-400">per month</div>
                    </div>
                    <ul className="space-y-3 mb-8">
                        <li className="flex items-center space-x-3"><Check className="text-accent-green" /><span>Unlimited challenges</span></li>
                        <li className="flex items-center space-x-3"><Check className="text-accent-green" /><span>Advanced AI mentor</span></li>
                        <li className="flex items-center space-x-3"><Check className="text-accent-green" /><span>Live coding sessions</span></li>
                        <li className="flex items-center space-x-3"><Check className="text-accent-green" /><span>Priority support</span></li>
                        <li className="flex items-center space-x-3"><Check className="text-accent-green" /><span>Certificate of completion</span></li>
                    </ul>
                    <Button className="w-full btn-primary">Start Pro Trial</Button>
                </div>
                
                <div className="glass-effect rounded-2xl p-8 hover:scale-105 transition-transform">
                     <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
                        <div className="text-4xl font-bold mb-2">$99</div>
                        <div className="text-gray-400">per month</div>
                    </div>
                    <ul className="space-y-3 mb-8">
                        <li className="flex items-center space-x-3"><Check className="text-accent-green" /><span>Everything in Pro</span></li>
                        <li className="flex items-center space-x-3"><Check className="text-accent-green" /><span>Team collaboration</span></li>
                        <li className="flex items-center space-x-3"><Check className="text-accent-green" /><span>Custom challenges</span></li>
                        <li className="flex items-center space-x-3"><Check className="text-accent-green" /><span>Analytics dashboard</span></li>
                        <li className="flex items-center space-x-3"><Check className="text-accent-green" /><span>Dedicated support</span></li>
                    </ul>
                    <Button className="w-full" variant="outline">Contact Sales</Button>
                </div>
            </div>
        </div>
    </section>

     <section id="community" className="py-20">
        <div className="container">
            <div className="text-center mb-16">
                <h2 className="text-5xl font-bold mb-6">Join Our <span className="gradient-text">Developer Community</span></h2>
                <p className="text-xl text-gray-300">Connect, learn, and grow with thousands of backend developers</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="glass-effect rounded-xl p-6 text-center hover:scale-105 transition-transform cursor-pointer">
                    <Icons.discord className="text-4xl text-accent-blue mb-4 mx-auto" />
                    <h4 className="font-bold mb-2">Discord Server</h4>
                    <p className="text-sm text-gray-400 mb-4">24/7 community support</p>
                    <div className="text-accent-green font-semibold">15K+ Members</div>
                </div>
                
                <div className="glass-effect rounded-xl p-6 text-center hover:scale-105 transition-transform cursor-pointer">
                    <Github className="text-4xl text-gray-300 mb-4 mx-auto" />
                    <h4 className="font-bold mb-2">GitHub</h4>
                    <p className="text-sm text-gray-400 mb-4">Open source challenges</p>
                    <div className="text-accent-green font-semibold">2K+ Stars</div>
                </div>
                
                <div className="glass-effect rounded-xl p-6 text-center hover:scale-105 transition-transform cursor-pointer">
                    <Youtube className="text-4xl text-accent-red mb-4 mx-auto" />
                    <h4 className="font-bold mb-2">YouTube</h4>
                    <p className="text-sm text-gray-400 mb-4">Video tutorials</p>
                    <div className="text-accent-green font-semibold">50K+ Subs</div>
                </div>
                
                <div className="glass-effect rounded-xl p-6 text-center hover:scale-105 transition-transform cursor-pointer">
                    <Twitter className="text-4xl text-accent-blue mb-4 mx-auto" />
                    <h4 className="font-bold mb-2">Twitter</h4>
                    <p className="text-sm text-gray-400 mb-4">Daily tips & updates</p>
                    <div className="text-accent-green font-semibold">25K+ Followers</div>
                </div>
            </div>
        </div>
    </section>

     <section id="docs" className="py-20 gradient-bg">
        <div className="container">
            <div className="text-center mb-16">
                <h2 className="text-5xl font-bold mb-6">Comprehensive <span className="gradient-text">Documentation</span></h2>
                <p className="text-xl text-gray-300">Everything you need to master backend development</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="glass-effect rounded-xl p-6 hover:scale-105 transition-transform cursor-pointer">
                    <BookOpen className="text-3xl text-accent-blue mb-4"/>
                    <h4 className="text-xl font-bold mb-3">Getting Started</h4>
                    <p className="text-gray-400 mb-4">Complete beginner's guide to backend development</p>
                </div>
                
                <div className="glass-effect rounded-xl p-6 hover:scale-105 transition-transform cursor-pointer">
                    <FileCode className="text-3xl text-accent-green mb-4"/>
                    <h4 className="text-xl font-bold mb-3">API Reference</h4>
                    <p className="text-gray-400 mb-4">Complete API documentation with examples</p>
                </div>
                
                <div className="glass-effect rounded-xl p-6 hover:scale-105 transition-transform cursor-pointer">
                    <Video className="text-3xl text-accent-red mb-4"/>
                    <h4 className="text-xl font-bold mb-3">Video Tutorials</h4>
                    <p className="text-gray-400 mb-4">Step-by-step video guides and walkthroughs</p>
                </div>
            </div>
        </div>
    </section>

    <footer className="bg-dark-surface py-8">
        <div className="container text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Backend Mentor Evolved. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
