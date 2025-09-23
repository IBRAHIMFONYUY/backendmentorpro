/* eslint-disable react/no-unescaped-entities */
'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaDiscord, FaGithub, FaGoogle, FaNodeJs, FaPython, FaJava, FaAws, FaPhp, FaDocker, FaYoutube, FaTwitter } from 'react-icons/fa';
import { Rocket, Compass, Play, Save, Share, Bot, Terminal, CheckCircle, Trophy, Users, Network, Download, ChartLine, Send, Trash, Bug, Search, Lightbulb, Code, Server, LayerGroup, Cog, Hashtag, Video, Book, Star, Bolt, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Preloader from '@/components/preloader';


export default function Home() {
    const { toast } = useToast();
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [onboardingStep, setOnboardingStep] = useState(false);
    const [aiModalOpen, setAiModalOpen] = useState(false);
    const [apiMethod, setApiMethod] = useState('GET');
    const [requestBodyVisible, setRequestBodyVisible] = useState(false);
    const [apiUrl, setApiUrl] = useState('https://jsonplaceholder.typicode.com/posts');
    const [apiRequestBody, setApiRequestBody] = useState('{"title": "Test Post", "body": "This is a test", "userId": 1}');
    const [apiResponse, setApiResponse] = useState<any>(null);
    const [isApiLoading, setIsApiLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);


    // Smooth scrolling for anchor links
    useEffect(() => {
        if (isLoading) return;
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (!targetId) return;
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });
    }, [isLoading]);

    useEffect(() => {
        // Simulate loading time for the preloader effect
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 14000); // The animation is quite long

        return () => clearTimeout(timer);
    }, []);

    // Animate counters on component mount
    useEffect(() => {
        if (isLoading) return;
        function animateCounter(elementId: string, target: number, duration = 2000, suffix = '') {
            const element = document.getElementById(elementId);
            if (!element) return;

            let start = 0;
            const increment = target / (duration / 16);
            const timer = setInterval(() => {
                start += increment;
                if (start >= target) {
                    element.textContent = target.toLocaleString() + suffix;
                    clearInterval(timer);
                } else {
                    element.textContent = Math.floor(start).toLocaleString() + suffix;
                }
            }, 16);
        }

        toast({ title: 'Loading real-time statistics...', description: "" });
        setTimeout(() => {
            animateCounter('developerCount', 52847);
            animateCounter('challengeCount', 247);
            animateCounter('successRate', 94, 2000, '%');
        }, 1000);

    }, [isLoading, toast]);
    
    const handleAuthModalOpen = () => {
        setOnboardingStep(false);
        setAuthModalOpen(true);
    };

    const handleOAuth = (provider: string) => {
        toast({ title: `Redirecting to ${provider} OAuth...` });
        setTimeout(() => {
            toast({ title: `${provider} authentication successful!` });
            setOnboardingStep(true);
        }, 2000);
    };

    const handleEmailSignup = () => {
        toast({ title: 'Creating your account...' });
        setTimeout(() => {
            toast({ title: 'Account created successfully!' });
            setOnboardingStep(true);
        }, 1500);
    };

    const handleCompleteOnboarding = () => {
        toast({ title: 'Welcome! Starting your journey.' });
        setAuthModalOpen(false);
        setTimeout(() => {
            toast({ title: 'Personalizing your dashboard...' });
             // Redirect to dashboard after a short delay
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 1000);
        }, 1500);
    }
    
    const handleSetApiMethod = (method: string) => {
        setApiMethod(method);
        if (['POST', 'PUT'].includes(method)) {
            setRequestBodyVisible(true);
        } else {
            setRequestBodyVisible(false);
        }
    };

    const handleSendApiRequest = async () => {
        if (!apiUrl) {
            toast({ variant: 'destructive', title: 'Please enter an API endpoint' });
            return;
        }

        setIsApiLoading(true);
        setApiResponse(null);
        toast({ title: 'Sending API request...' });

        const startTime = Date.now();
        try {
            const options: RequestInit = {
                method: apiMethod,
                headers: { 'Content-Type': 'application/json' },
            };

            if (requestBodyVisible && apiRequestBody) {
                try {
                    options.body = JSON.stringify(JSON.parse(apiRequestBody));
                } catch (e) {
                    throw new Error('Invalid JSON in request body');
                }
            }

            const res = await fetch(apiUrl, options);
            const endTime = Date.now();

            const data = await res.json();
            setApiResponse({
                status: res.status,
                statusText: res.statusText,
                time: endTime - startTime,
                body: data
            });
            toast({ title: `API request completed (${res.status})` });

        } catch (error: any) {
            const endTime = Date.now();
            setApiResponse({
                status: 'Error',
                statusText: '',
                time: endTime - startTime,
                body: { error: error.message }
            });
            toast({ variant: 'destructive', title: 'API request failed', description: error.message });
        }
        setIsApiLoading(false);
    };

    const handleClearApi = () => {
        setApiUrl('https://jsonplaceholder.typicode.com/posts');
        setApiRequestBody('{"title": "Test Post", "body": "This is a test", "userId": 1}');
        setApiResponse(null);
        toast({ title: 'Cleared API playground' });
    }

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <div className="bg-dark-bg text-white overflow-x-hidden">
        <div className="matrix-bg" id="matrixBg"></div>
        <nav className="fixed top-0 w-full z-50 glass-effect">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-3">
                         <Link href="/" className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-accent-blue to-accent-red rounded-xl flex items-center justify-center">
                               <Code className="text-white text-lg" />
                            </div>
                            <span className="text-2xl font-bold gradient-text">BackendMentorAI</span>
                        </Link>
                    </div>
                    <div className="hidden md:flex items-center space-x-8">
                        <a href="#challenges" className="hover:text-accent-blue transition-colors cursor-pointer font-medium">Challenges</a>
                        <a href="#features" className="hover:text-accent-blue transition-colors cursor-pointer font-medium">Features</a>
                        <a href="#playground" className="hover:text-accent-blue transition-colors cursor-pointer font-medium">Playground</a>
                        <a href="#pricing" className="hover:text-accent-blue transition-colors cursor-pointer font-medium">Pricing</a>
                        <a href="#community" className="hover:text-accent-blue transition-colors cursor-pointer font-medium">Community</a>
                        <a href="#docs" className="hover:text-accent-blue transition-colors cursor-pointer font-medium">Docs</a>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Button onClick={handleAuthModalOpen} variant="outline" className="px-6 py-2 text-accent-blue border-accent-blue rounded-lg hover:bg-accent-blue hover:text-white transition-all font-medium">
                            Sign In
                        </Button>
                         <Button onClick={handleAuthModalOpen} className="px-6 py-2 btn-primary text-white rounded-lg font-medium animate-pulse-glow">
                            Start Free
                        </Button>
                    </div>
                </div>
            </div>
        </nav>

        <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-10 relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8 animate-slide-in-left">
                        <div className="space-y-6">
                            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm glass-effect">
                                <Rocket className="mr-2 text-accent-blue h-4 w-4" />
                                <span className="gradient-text font-semibold">AI-Powered Learning Platform</span>
                            </div>
                            <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
                                Practice Real <span className="gradient-text">Backend</span> & <span className="gradient-text">Fullstack</span> Development with AI-Powered Guidance
                            </h1>
                            <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
                                Master backend development through real-world challenges with intelligent AI mentorship, live coding environments, and instant feedback. From REST APIs to microservices architecture.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-6">
                             <Button asChild className="px-8 py-4 btn-primary text-white rounded-xl font-semibold text-lg flex items-center justify-center space-x-2 group">
                                <a href="#challenges"><Compass className="group-hover:rotate-180 transition-transform duration-300 h-5 w-5" /><span>Explore Challenges</span></a>
                            </Button>
                             <Button onClick={handleAuthModalOpen} className="px-8 py-4 btn-secondary rounded-xl font-semibold text-lg flex items-center justify-center space-x-2">
                                <Play className="h-5 w-5" /><span>Start Free</span>
                            </Button>
                        </div>
                        <div className="grid grid-cols-3 gap-8 pt-8">
                            <div className="text-center">
                                <div className="text-3xl font-bold gradient-text" id="developerCount">0</div>
                                <div className="text-sm text-gray-400 font-medium">Active Developers</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold gradient-text" id="challengeCount">0</div>
                                <div className="text-sm text-gray-400 font-medium">Live Challenges</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold gradient-text" id="successRate">0%</div>
                                <div className="text-sm text-gray-400 font-medium">Success Rate</div>
                            </div>
                        </div>
                    </div>
                    <div className="relative animate-slide-in-right">
                        <div className="animate-float">
                            <div className="code-editor shadow-2xl">
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
                                        <button className="text-gray-400 hover:text-white transition-colors"><Save className="h-4 w-4" /></button>
                                        <button className="text-gray-400 hover:text-white transition-colors"><Share className="h-4 w-4" /></button>
                                    </div>
                                </div>
                                <div id="liveEditor" className="p-6 font-mono text-sm leading-relaxed">
                                    <div className="text-accent-purple">&#47;&#47; AI-Guided Backend Development</div>
                                    <div><span className="text-accent-red">const</span> <span className="text-accent-blue">express</span> = <span className="text-accent-green">require</span>(<span className="text-yellow-300">'express'</span>);</div>
                                    <div><span className="text-accent-red">const</span> <span className="text-accent-blue">cors</span> = <span className="text-accent-green">require</span>(<span className="text-yellow-300">'cors'</span>);</div>
                                    <div><span className="text-accent-red">const</span> <span className="text-accent-blue">helmet</span> = <span className="text-accent-green">require</span>(<span className="text-yellow-300">'helmet'</span>);</div>
                                    <div></div>
                                    <div><span className="text-accent-red">const</span> <span className="text-accent-blue">app</span> = <span className="text-accent-blue">express</span>();</div>
                                    <div></div>
                                    <div><span className="text-accent-purple">&#47;&#47; AI: Security middleware recommended</span></div>
                                    <div><span className="text-accent-blue">app</span>.<span className="text-yellow-300">use</span>(<span className="text-accent-blue">helmet</span>());</div>
                                    <div><span className="text-accent-blue">app</span>.<span className="text-yellow-300">use</span>(<span className="text-accent-blue">cors</span>());</div>
                                    <div><span className="text-accent-blue">app</span>.<span className="text-yellow-300">use</span>(<span className="text-accent-blue">express</span>.<span className="text-yellow-300">json</span>());</div>
                                    <div></div>
                                    <div><span className="text-accent-blue">app</span>.<span className="text-yellow-300">post</span>(<span className="text-yellow-300">'/api/users'</span>, <span className="text-accent-red">async</span> (<span className="text-accent-blue">req, res</span>) => {'{'}</div>
                                    <div className="pl-4"><span className="text-accent-purple">&#47;&#47; AI: Validate input data</span></div>
                                    <div className="pl-4"><span className="text-accent-red">try</span> {'{'}</div>
                                    <div className="pl-8"><span className="text-accent-red">const</span> <span className="text-accent-blue">user</span> = <span className="text-accent-red">await</span> <span className="text-accent-green">createUser</span>(<span className="text-accent-blue">req.body</span>);</div>
                                    <div className="pl-8"><span className="text-accent-blue">res</span>.<span className="text-yellow-300">status</span>(<span className="text-accent-green">201</span>).<span className="text-yellow-300">json</span>(<span className="text-accent-blue">user</span>);</div>
                                    <div className="pl-4">{'}'} <span className="text-accent-red">catch</span> (<span className="text-accent-blue">error</span>) {'{'}</div>
                                    <div className="pl-8"><span className="text-accent-blue">res</span>.<span className="text-yellow-300">status</span>(<span className="text-accent-red">400</span>).<span className="text-yellow-300">json</span>({'{'} <span className="text-accent-blue">error</span> {'}'});</div>
                                    <div className="pl-4">{'}'}</div>
                                    <div>{'}'});</div>
                                    <div></div>
                                    <div><span className="text-accent-blue">app</span>.<span className="text-yellow-300">listen</span>(<span className="text-accent-green">3000</span>, () => {'{'}</div>
                                    <div className="pl-4"><span className="text-accent-blue">console</span>.<span className="text-yellow-300">log</span>(<span className="text-yellow-300">'🚀 Server running on port 3000'</span>);</div>
                                    <div>{'}'});</div>
                                </div>
                                <div className="p-4 bg-dark-surface border-t border-dark-border flex justify-between items-center">
                                    <div className="flex space-x-3">
                                        <Button onClick={() => toast({ title: 'Code execution simulated!' })} className="px-4 py-2 bg-accent-green text-white rounded-lg text-sm hover:bg-green-600 transition-colors flex items-center space-x-2"><Play className="h-4 w-4" /><span>Run Code</span></Button>
                                        <Button onClick={() => setAiModalOpen(true)} className="px-4 py-2 bg-accent-purple text-white rounded-lg text-sm hover:bg-purple-600 transition-colors flex items-center space-x-2"><Bot className="h-4 w-4" /><span>AI Help</span></Button>
                                        <Button onClick={() => { navigator.clipboard.writeText('https://backendmentor.dev/share/xyz'); toast({ title: 'Share link copied!' })}} className="px-4 py-2 bg-accent-blue text-white rounded-lg text-sm hover:bg-blue-600 transition-colors flex items-center space-x-2"><Share className="h-4 w-4" /><span>Share</span></Button>
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                                        <CheckCircle className="text-accent-green h-4 w-4" /><span>Tests: 12/12</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 gradient-bg">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 animate-fade-in-up">
                    <h2 className="text-5xl font-bold mb-6">Revolutionary <span className="gradient-text">Learning Experience</span></h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">AI Assistant, Live Editor, API Playground, and Real-time Collaboration - All in One Innovative Platform</p>
                </div>
                <div className="grid lg:grid-cols-3 gap-8 mb-16">
                    <div onClick={() => setAiModalOpen(true)} className="feature-card glass-effect rounded-2xl p-8 cursor-pointer group" id="aiFeatureCard">
                        <div className="w-20 h-20 bg-gradient-to-r from-accent-blue to-accent-purple rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Bot className="text-white text-3xl h-10 w-10" /></div>
                        <h3 className="text-2xl font-bold mb-4">AI Mentor Assistant</h3>
                        <p className="text-gray-300 mb-6 leading-relaxed">Context-aware AI that provides real-time hints, debugging help, code reviews, and explains complex concepts with personalized learning paths.</p>
                        <div className="flex items-center justify-between">
                             <Button onClick={(e) => {e.stopPropagation(); setAiModalOpen(true);}} className="px-6 py-3 bg-accent-blue/20 text-accent-blue rounded-xl hover:bg-accent-blue hover:text-white transition-all font-medium">Try AI Assistant</Button>
                            <div className="flex items-center space-x-1 text-sm text-gray-400"><Star className="text-yellow-400 h-4 w-4" /><span>4.9/5</span></div>
                        </div>
                    </div>
                    <div className="feature-card glass-effect rounded-2xl p-8 cursor-pointer group" id="editorFeatureCard">
                        <div className="w-20 h-20 bg-gradient-to-r from-accent-red to-accent-purple rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Code className="text-white text-3xl h-10 w-10" /></div>
                        <h3 className="text-2xl font-bold mb-4">Live Coding Environment</h3>
                        <p className="text-gray-300 mb-6 leading-relaxed">Monaco Editor with IntelliSense, syntax highlighting, real-time collaboration, instant code execution, and integrated debugging tools.</p>
                        <div className="flex items-center justify-between">
                            <Button onClick={() => toast({title: "Live editor coming soon!"})} className="px-6 py-3 bg-accent-red/20 text-accent-red rounded-xl hover:bg-accent-red hover:text-white transition-all font-medium">Open Live Editor</Button>
                            <div className="flex items-center space-x-1 text-sm text-gray-400"><Users className="h-4 w-4" /><span>Real-time</span></div>
                        </div>
                    </div>
                    <div className="feature-card glass-effect rounded-2xl p-8 cursor-pointer group" id="apiFeatureCard">
                        <div className="w-20 h-20 bg-gradient-to-r from-accent-purple to-accent-blue rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Network className="text-white text-3xl h-10 w-10" /></div>
                        <h3 className="text-2xl font-bold mb-4">API Playground</h3>
                        <p className="text-gray-300 mb-6 leading-relaxed">Built-in Postman-like interface for testing APIs, viewing responses, debugging endpoints, and generating API documentation automatically.</p>
                        <div className="flex items-center justify-between">
                             <Button asChild className="px-6 py-3 bg-accent-purple/20 text-accent-purple rounded-xl hover:bg-accent-purple hover:text-white transition-all font-medium">
                                <a href="#playground">Launch Playground</a>
                            </Button>
                            <div className="flex items-center space-x-1 text-sm text-gray-400"><Bolt className="h-4 w-4" /><span>Instant</span></div>
                        </div>
                    </div>
                </div>
                 <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="glass-effect rounded-xl p-6 text-center hover:scale-105 transition-transform">
                        <Trophy className="text-accent-green text-2xl mb-3 mx-auto h-8 w-8" />
                        <h4 className="font-semibold mb-2">Gamified Learning</h4>
                        <p className="text-sm text-gray-400">XP, badges, streaks, leaderboards</p>
                    </div>
                    <div className="glass-effect rounded-xl p-6 text-center hover:scale-105 transition-transform">
                        <Users className="text-accent-blue text-2xl mb-3 mx-auto h-8 w-8" />
                        <h4 className="font-semibold mb-2">Pair Programming</h4>
                        <p className="text-sm text-gray-400">Real-time collaboration</p>
                    </div>
                    <div className="glass-effect rounded-xl p-6 text-center hover:scale-105 transition-transform">
                        <Download className="text-accent-purple text-2xl mb-3 mx-auto h-8 w-8" />
                        <h4 className="font-semibold mb-2">Challenge Packages</h4>
                        <p className="text-sm text-gray-400">Complete project templates</p>
                    </div>
                    <div className="glass-effect rounded-xl p-6 text-center hover:scale-105 transition-transform">
                        <ChartLine className="text-accent-red text-2xl mb-3 mx-auto h-8 w-8" />
                        <h4 className="font-semibold mb-2">Progress Analytics</h4>
                        <p className="text-sm text-gray-400">Detailed learning insights</p>
                    </div>
                </div>
            </div>
        </section>

        <section id="playground" className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-5xl font-bold mb-6">Experience the <span className="gradient-text">Platform</span></h2>
                    <p className="text-xl text-gray-300">Try our interactive features right now - no signup required</p>
                </div>
                <div className="grid lg:grid-cols-2 gap-12">
                    <div className="glass-effect rounded-2xl p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold">API Testing Playground</h3>
                            <div className="flex space-x-2">
                                <Button onClick={() => handleSetApiMethod('GET')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${apiMethod === 'GET' ? 'bg-accent-green text-white' : 'bg-gray-600 hover:bg-green-600'}`}>GET</Button>
                                <Button onClick={() => handleSetApiMethod('POST')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${apiMethod === 'POST' ? 'bg-accent-blue text-white' : 'bg-gray-600 hover:bg-blue-600'}`}>POST</Button>
                                <Button onClick={() => handleSetApiMethod('PUT')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${apiMethod === 'PUT' ? 'bg-accent-purple text-white' : 'bg-gray-600 hover:bg-purple-600'}`}>PUT</Button>
                                <Button onClick={() => handleSetApiMethod('DELETE')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${apiMethod === 'DELETE' ? 'bg-accent-red text-white' : 'bg-gray-600 hover:bg-red-600'}`}>DELETE</Button>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">API Endpoint</label>
                                <div className="relative">
                                    <input value={apiUrl} onChange={(e) => setApiUrl(e.target.value)} type="text" className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-xl text-white focus:border-accent-blue focus:outline-none font-mono" />
                                </div>
                            </div>
                             {requestBodyVisible && (
                                <div id="requestBody">
                                    <label className="block text-sm font-medium mb-2">Request Body (JSON)</label>
                                    <textarea value={apiRequestBody} onChange={(e) => setApiRequestBody(e.target.value)} className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-xl text-white focus:border-accent-blue focus:outline-none font-mono h-24" placeholder='{"title": "Test Post", "body": "This is a test", "userId": 1}'></textarea>
                                </div>
                            )}
                            <div className="flex space-x-3">
                                 <Button onClick={handleSendApiRequest} disabled={isApiLoading} className="flex-1 px-6 py-3 btn-primary text-white rounded-xl font-medium flex items-center justify-center space-x-2"><Send className="h-4 w-4" /><span>Send Request</span></Button>
                                <Button onClick={handleClearApi} variant="secondary" className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"><Trash className="h-4 w-4" /></Button>
                            </div>
                           {apiResponse && (
                                <div id="apiResponse">
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="block text-sm font-medium">Response</label>
                                        <div className="flex items-center space-x-2">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${apiResponse.status >= 200 && apiResponse.status < 300 ? 'bg-accent-green text-white' : 'bg-accent-red text-white'}`}>{apiResponse.status} {apiResponse.statusText}</span>
                                            <span className="text-xs text-gray-400">{apiResponse.time}ms</span>
                                        </div>
                                    </div>
                                    <div className="bg-dark-bg border border-dark-border rounded-xl p-4 max-h-64 overflow-y-auto">
                                        <pre className="text-sm font-mono text-gray-300">{JSON.stringify(apiResponse.body, null, 2)}</pre>
                                    </div>
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
                                    <div className="bg-gradient-to-r from-accent-blue to-accent-purple h-3 rounded-full transition-all duration-1000" style={{width: '85%'}}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="font-medium">API Development</span>
                                    <span className="text-accent-green font-semibold">72%</span>
                                </div>
                                <div className="w-full bg-dark-border rounded-full h-3">
                                    <div className="bg-gradient-to-r from-accent-green to-accent-blue h-3 rounded-full transition-all duration-1000" style={{width: '72%'}}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="font-medium">Database Design</span>
                                    <span className="text-accent-purple font-semibold">58%</span>
                                </div>
                                <div className="w-full bg-dark-border rounded-full h-3">
                                    <div className="bg-gradient-to-r from-accent-purple to-accent-red h-3 rounded-full transition-all duration-1000" style={{width: '58%'}}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="font-medium">DevOps & Deployment</span>
                                    <span className="text-accent-red font-semibold">34%</span>
                                </div>
                                <div className="w-full bg-dark-border rounded-full h-3">
                                    <div className="bg-gradient-to-r from-accent-red to-accent-purple h-3 rounded-full transition-all duration-1000" style={{width: '34%'}}></div>
                                </div>
                            </div>
                            <div className="pt-6 border-t border-dark-border">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <div className="text-3xl font-bold gradient-text">Level 15</div>
                                        <div className="text-sm text-gray-400">Senior Backend Developer</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-bold">3,750 XP</div>
                                        <div className="text-sm text-gray-400">250 to next level</div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-3 p-3 bg-dark-bg rounded-lg">
                                        <Trophy className="text-accent-green" />
                                        <div>
                                            <div className="text-sm font-medium">API Master</div>
                                            <div className="text-xs text-gray-400">Completed 10 API challenges</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section id="technologies" className="py-20 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">
                    <span className="text-white">Master</span>
                    <span className="gradient-text"> Modern Tech Stack</span>
                </h2>
                <p className="text-xl text-gray-400 mb-16 max-w-3xl mx-auto">Practice with the technologies that power today's most successful applications</p>
                <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-8 mb-16">
                    <div className="tech-icon flex flex-col items-center space-y-3">
                        <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center"><FaNodeJs className="text-white text-2xl h-8 w-8" /></div>
                        <span className="text-gray-400 text-sm">Node.js</span>
                    </div>
                    <div className="tech-icon flex flex-col items-center space-y-3">
                        <div className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center"><FaPython className="text-white text-2xl h-8 w-8" /></div>
                        <span className="text-gray-400 text-sm">Python</span>
                    </div>
                    <div className="tech-icon flex flex-col items-center space-y-3">
                        <div className="w-16 h-16 bg-red-500 rounded-xl flex items-center justify-center"><FaJava className="text-white text-2xl h-8 w-8" /></div>
                        <span className="text-gray-400 text-sm">Java</span>
                    </div>
                    <div className="tech-icon flex flex-col items-center space-y-3">
                        <div className="w-16 h-16 bg-purple-500 rounded-xl flex items-center justify-center"><Server className="text-white text-2xl h-8 w-8" /></div>
                        <span className="text-gray-400 text-sm">MongoDB</span>
                    </div>
                    <div className="tech-icon flex flex-col items-center space-y-3">
                        <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center"><Server className="text-white text-2xl h-8 w-8" /></div>
                        <span className="text-gray-400 text-sm">PostgreSQL</span>
                    </div>
                    <div className="tech-icon flex flex-col items-center space-y-3">
                        <div className="w-16 h-16 bg-orange-500 rounded-xl flex items-center justify-center"><FaAws className="text-white text-2xl h-8 w-8" /></div>
                        <span className="text-gray-400 text-sm">AWS</span>
                    </div>
                    <div className="tech-icon flex flex-col items-center space-y-3">
                        <div className="w-16 h-16 bg-orange-500 rounded-xl flex items-center justify-center"><FaPhp className="text-white text-2xl h-8 w-8" /></div>
                        <span className="text-gray-400 text-sm">PHP</span>
                    </div>
                    <div className="tech-icon flex flex-col items-center space-y-3">
                        <div className="w-16 h-16 bg-blue-400 rounded-xl flex items-center justify-center"><FaDocker className="text-white text-2xl h-8 w-8" /></div>
                        <span className="text-gray-400 text-sm">Docker</span>
                    </div>
                </div>
            </div>
        </section>

        <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 gradient-bg">
            <div className="max-w-7xl mx-auto">
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
                            <li className="flex items-center space-x-3"><CheckCircle className="text-accent-green h-5 w-5" /><span>5 challenges per month</span></li>
                            <li className="flex items-center space-x-3"><CheckCircle className="text-accent-green h-5 w-5" /><span>Basic AI assistance</span></li>
                            <li className="flex items-center space-x-3"><CheckCircle className="text-accent-green h-5 w-5" /><span>Community access</span></li>
                            <li className="flex items-center space-x-3"><CheckCircle className="text-accent-green h-5 w-5" /><span>Progress tracking</span></li>
                        </ul>
                        <Button onClick={handleAuthModalOpen} className="w-full" variant="outline">Get Started Free</Button>
                    </div>
                    <div className="glass-effect rounded-2xl p-8 border-2 border-accent-blue relative hover:scale-105 transition-transform">
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-accent-blue text-white rounded-full text-sm font-medium">Most Popular</div>
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold mb-2">Pro</h3>
                            <div className="text-4xl font-bold mb-2">$29</div>
                            <div className="text-gray-400">per month</div>
                        </div>
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-center space-x-3"><CheckCircle className="text-accent-green h-5 w-5" /><span>Unlimited challenges</span></li>
                            <li className="flex items-center space-x-3"><CheckCircle className="text-accent-green h-5 w-5" /><span>Advanced AI mentor</span></li>
                            <li className="flex items-center space-x-3"><CheckCircle className="text-accent-green h-5 w-5" /><span>Live coding sessions</span></li>
                            <li className="flex items-center space-x-3"><CheckCircle className="text-accent-green h-5 w-5" /><span>Priority support</span></li>
                            <li className="flex items-center space-x-3"><CheckCircle className="text-accent-green h-5 w-5" /><span>Certificate of completion</span></li>
                        </ul>
                        <Button onClick={handleAuthModalOpen} className="w-full btn-primary">Start Pro Trial</Button>
                    </div>
                    <div className="glass-effect rounded-2xl p-8 hover:scale-105 transition-transform">
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
                            <div className="text-4xl font-bold mb-2">$99</div>
                            <div className="text-gray-400">per month</div>
                        </div>
                        <ul className="space-y-3 mb-8">
                             <li className="flex items-center space-x-3"><CheckCircle className="text-accent-green h-5 w-5" /><span>Everything in Pro</span></li>
                             <li className="flex items-center space-x-3"><CheckCircle className="text-accent-green h-5 w-5" /><span>Team collaboration</span></li>
                             <li className="flex items-center space-x-3"><CheckCircle className="text-accent-green h-5 w-5" /><span>Custom challenges</span></li>
                             <li className="flex items-center space-x-3"><CheckCircle className="text-accent-green h-5 w-5" /><span>Analytics dashboard</span></li>
                             <li className="flex items-center space-x-3"><CheckCircle className="text-accent-green h-5 w-5" /><span>Dedicated support</span></li>
                        </ul>
                        <Button onClick={handleAuthModalOpen} className="w-full" variant="outline">Contact Sales</Button>
                    </div>
                </div>
            </div>
        </section>

        <section id="community" className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-5xl font-bold mb-6">Join Our <span className="gradient-text">Developer Community</span></h2>
                    <p className="text-xl text-gray-300">Connect, learn, and grow with thousands of backend developers</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <div className="glass-effect rounded-xl p-6 text-center hover:scale-105 transition-transform cursor-pointer">
                        <FaDiscord className="text-4xl text-accent-blue mb-4 mx-auto" />
                        <h4 className="font-bold mb-2">Discord Server</h4>
                        <p className="text-sm text-gray-400 mb-4">24/7 community support</p>
                        <div className="text-accent-green font-semibold">15K+ Members</div>
                    </div>
                    <div className="glass-effect rounded-xl p-6 text-center hover:scale-105 transition-transform cursor-pointer">
                        <FaGithub className="text-4xl text-gray-300 mb-4 mx-auto" />
                        <h4 className="font-bold mb-2">GitHub</h4>
                        <p className="text-sm text-gray-400 mb-4">Open source challenges</p>
                        <div className="text-accent-green font-semibold">2K+ Stars</div>
                    </div>
                    <div className="glass-effect rounded-xl p-6 text-center hover:scale-105 transition-transform cursor-pointer">
                        <FaYoutube className="text-4xl text-accent-red mb-4 mx-auto" />
                        <h4 className="font-bold mb-2">YouTube</h4>
                        <p className="text-sm text-gray-400 mb-4">Video tutorials</p>
                        <div className="text-accent-green font-semibold">50K+ Subs</div>
                    </div>
                    <div className="glass-effect rounded-xl p-6 text-center hover:scale-105 transition-transform cursor-pointer">
                        <FaTwitter className="text-4xl text-accent-blue mb-4 mx-auto" />
                        <h4 className="font-bold mb-2">Twitter</h4>
                        <p className="text-sm text-gray-400 mb-4">Daily tips & updates</p>
                        <div className="text-accent-green font-semibold">25K+ Followers</div>
                    </div>
                </div>
                <div className="text-center">
                    <Button onClick={() => toast({ title: 'Joining community...' })} className="px-8 py-4 btn-primary text-white rounded-xl font-semibold text-lg">
                        <Users className="mr-2 h-5 w-5" />Join Community
                    </Button>
                </div>
            </div>
        </section>

        <section id="docs" className="py-20 px-4 sm:px-6 lg:px-8 gradient-bg">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-5xl font-bold mb-6">Comprehensive <span className="gradient-text">Documentation</span></h2>
                    <p className="text-xl text-gray-300">Everything you need to master backend development</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="glass-effect rounded-xl p-6 hover:scale-105 transition-transform cursor-pointer">
                        <Book className="text-3xl text-accent-blue mb-4 h-8 w-8" />
                        <h4 className="text-xl font-bold mb-3">Getting Started</h4>
                        <p className="text-gray-400 mb-4">Complete beginner's guide to backend development</p>
                        <div className="flex items-center text-accent-blue"><span className="text-sm font-medium">Read Guide</span><Play className="ml-2 h-4 w-4" /></div>
                    </div>
                    <div className="glass-effect rounded-xl p-6 hover:scale-105 transition-transform cursor-pointer">
                        <Code className="text-3xl text-accent-green mb-4 h-8 w-8" />
                        <h4 className="text-xl font-bold mb-3">API Reference</h4>
                        <p className="text-gray-400 mb-4">Complete API documentation with examples</p>
                        <div className="flex items-center text-accent-green"><span className="text-sm font-medium">View API</span><Play className="ml-2 h-4 w-4" /></div>
                    </div>
                    <div className="glass-effect rounded-xl p-6 hover:scale-105 transition-transform cursor-pointer">
                        <Video className="text-3xl text-accent-red mb-4 h-8 w-8" />
                        <h4 className="text-xl font-bold mb-3">Video Tutorials</h4>
                        <p className="text-gray-400 mb-4">Step-by-step video guides and walkthroughs</p>
                        <div className="flex items-center text-accent-red"><span className="text-sm font-medium">Watch Now</span><Play className="ml-2 h-4 w-4" /></div>
                    </div>
                </div>
            </div>
        </section>

        {/* Auth Modal */}
        {authModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                <div className="modal-content glass-effect rounded-2xl p-8 max-w-md w-full relative">
                    <Button onClick={() => setAuthModalOpen(false)} variant="ghost" size="icon" className="absolute top-4 right-4 text-gray-400 hover:text-white">
                        <X />
                    </Button>
                    {!onboardingStep ? (
                        <div id="authStep1" className="space-y-6">
                            <h2 className="text-3xl font-bold gradient-text text-center">Join Backend Mentor</h2>
                            <div className="space-y-4">
                                <Button onClick={() => handleOAuth('GitHub')} className="w-full bg-gray-800 hover:bg-gray-700 text-white py-6 text-base"><FaGithub className="mr-2" /> Continue with GitHub</Button>
                                <Button onClick={() => handleOAuth('Google')} className="w-full bg-white hover:bg-gray-200 text-gray-900 py-6 text-base"><FaGoogle className="mr-2" /> Continue with Google</Button>
                            </div>
                            <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-dark-border" /></div><div className="relative flex justify-center text-sm"><span className="px-2 bg-dark-surface text-gray-400">or</span></div></div>
                            <div className="space-y-4">
                                <input type="email" placeholder="Enter your email" className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-xl text-white focus:border-accent-blue focus:outline-none" />
                                <Button onClick={handleEmailSignup} className="w-full py-6 btn-primary">Create Account</Button>
                            </div>
                        </div>
                    ) : (
                         <div id="onboardingStep" className="space-y-6">
                            <h3 className="text-2xl font-bold text-center">Customize Your Experience</h3>
                             {/* Simplified onboarding for brevity */}
                            <Button onClick={handleCompleteOnboarding} className="w-full py-6 bg-gradient-to-r from-accent-blue to-accent-red">🚀 Start My Journey</Button>
                        </div>
                    )}
                </div>
            </div>
        )}

         {/* AI Modal */}
        {aiModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                 <div className="modal-content glass-effect rounded-2xl p-6 max-w-lg w-full relative">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold flex items-center gap-2"><Bot />AI Mentor Assistant</h2>
                        <Button onClick={() => setAiModalOpen(false)} variant="ghost" size="icon" className="absolute top-4 right-4 text-gray-400 hover:text-white"><X /></Button>
                    </div>
                    {/* Simplified AI chat for brevity */}
                    <div className="h-64 bg-dark-bg rounded-lg p-4 text-gray-400">AI chat placeholder...</div>
                     <div className="mt-4 flex gap-2">
                        <input type="text" placeholder="Ask the AI..." className="flex-grow bg-dark-bg border border-dark-border rounded-lg px-4" />
                        <Button className="btn-primary">Send</Button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
}
