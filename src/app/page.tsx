/* eslint-disable react/no-unescaped-entities */
'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaDiscord, FaGithub, FaGoogle, FaNodeJs, FaPython, FaJava, FaAws, FaPhp, FaDocker, FaYoutube, FaTwitter } from 'react-icons/fa';
import { Rocket, Compass, Play, Save, Share, Bot, Terminal, CheckCircle, Trophy, Users, Network, Download, ChartLine, Send, Trash, Bug, Search, Lightbulb, Code, Server, LayerGroup, Cog, Hashtag, Video, Book, Star, Bolt, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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


    // Smooth scrolling for anchor links
    useEffect(() => {
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
    }, []);

    // Animate counters on component mount
    useEffect(() => {
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

        toast({ title: <div className="flex items-center gap-2"><ChartLine/> Loading real-time statistics...</div> });
        setTimeout(() => {
            animateCounter('developerCount', 52847);
            animateCounter('challengeCount', 247);
            animateCounter('successRate', 94, 2000, '%');
        }, 1000);

    }, [toast]);
    
    const handleAuthModalOpen = () => {
        setOnboardingStep(false);
        setAuthModalOpen(true);
    };

    const handleOAuth = (provider: string) => {
        toast({ title: <div className="flex items-center gap-2">{provider === 'GitHub' ? <FaGithub/> : <FaGoogle/>} Redirecting to {provider} OAuth...</div> });
        setTimeout(() => {
            toast({ title: <div className="flex items-center gap-2"><CheckCircle/>{provider} authentication successful!</div> });
            setOnboardingStep(true);
        }, 2000);
    };

    const handleEmailSignup = () => {
        toast({ title: <div className="flex items-center gap-2"><Users/>Creating your account...</div> });
        setTimeout(() => {
            toast({ title: <div className="flex items-center gap-2"><CheckCircle/>Account created successfully!</div> });
            setOnboardingStep(true);
        }, 1500);
    };

    const handleCompleteOnboarding = () => {
        toast({ title: <div className="flex items-center gap-2"><Rocket/>Welcome! Starting your journey.</div> });
        setAuthModalOpen(false);
        setTimeout(() => {
            toast({ title: <div className="flex items-center gap-2"><Cog className="animate-spin" />Personalizing your dashboard...</div> });
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
            toast({ variant: 'destructive', title: <div className="flex items-center gap-2"><Bug/>Please enter an API endpoint</div> });
            return;
        }

        setIsApiLoading(true);
        setApiResponse(null);
        toast({ title: <div className="flex items-center gap-2"><Send/>Sending API request...</div> });

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
            toast({ title: <div className="flex items-center gap-2"><CheckCircle/>API request completed ({res.status})</div> });

        } catch (error: any) {
            const endTime = Date.now();
            setApiResponse({
                status: 'Error',
                statusText: '',
                time: endTime - startTime,
                body: { error: error.message }
            });
            toast({ variant: 'destructive', title: <div className="flex items-center gap-2"><Bug/>API request failed</div>, description: error.message });
        }
        setIsApiLoading(false);
    };

    const handleClearApi = () => {
        setApiUrl('https://jsonplaceholder.typicode.com/posts');
        setApiRequestBody('{"title": "Test Post", "body": "This is a test", "userId": 1}');
        setApiResponse(null);
        toast({ title: <div className="flex items-center gap-2"><Trash/>Cleared API playground</div> });
    }

  return (
    <div className="bg-background text-foreground overflow-x-hidden">
        <nav className="fixed top-0 w-full z-50 glass-effect">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-3">
                         <Link href="/" className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center">
                               <Code className="text-white text-lg" />
                            </div>
                            <span className="text-2xl font-bold gradient-text">BackendMentorAI</span>
                        </Link>
                    </div>
                    <div className="hidden md:flex items-center space-x-8">
                        <a href="#challenges" className="hover:text-primary transition-colors cursor-pointer font-medium">Challenges</a>
                        <a href="#features" className="hover:text-primary transition-colors cursor-pointer font-medium">Features</a>
                        <a href="#playground" className="hover:text-primary transition-colors cursor-pointer font-medium">Playground</a>
                        <a href="#pricing" className="hover:text-primary transition-colors cursor-pointer font-medium">Pricing</a>
                        <a href="#community" className="hover:text-primary transition-colors cursor-pointer font-medium">Community</a>
                        <a href="#docs" className="hover:text-primary transition-colors cursor-pointer font-medium">Docs</a>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Button onClick={handleAuthModalOpen} variant="outline" className="text-primary border-primary hover:bg-primary hover:text-primary-foreground transition-all font-medium">
                            Sign In
                        </Button>
                         <Button onClick={handleAuthModalOpen} className="btn-primary-gradient text-white font-medium animate-pulse-glow">
                            Start Free
                        </Button>
                    </div>
                </div>
            </div>
        </nav>

        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-10 relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8 animate-slide-in-left">
                        <div className="space-y-6">
                            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm glass-effect">
                                <Rocket className="mr-2 text-primary h-4 w-4" />
                                <span className="gradient-text font-semibold">AI-Powered Learning Platform</span>
                            </div>
                            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                                Practice Real <span className="gradient-text">Backend</span> & <span className="gradient-text">Fullstack</span> Development with AI-Powered Guidance
                            </h1>
                            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                                Master backend development through real-world challenges with intelligent AI mentorship, live coding environments, and instant feedback. From REST APIs to microservices architecture.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-6">
                             <Button size="lg" asChild className="btn-primary-gradient text-primary-foreground font-semibold text-lg flex items-center justify-center space-x-2 group">
                                <a href="#challenges"><Compass className="group-hover:rotate-180 transition-transform duration-300 h-5 w-5" /><span>Explore Challenges</span></a>
                            </Button>
                             <Button size="lg" onClick={handleAuthModalOpen} variant="secondary" className="font-semibold text-lg flex items-center justify-center space-x-2">
                                <Play className="h-5 w-5" /><span>Start Free</span>
                            </Button>
                        </div>
                        <div className="grid grid-cols-3 gap-8 pt-8">
                            <div className="text-center">
                                <div className="text-3xl font-bold gradient-text" id="developerCount">0</div>
                                <div className="text-sm text-muted-foreground font-medium">Active Developers</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold gradient-text" id="challengeCount">0</div>
                                <div className="text-sm text-muted-foreground font-medium">Live Challenges</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold gradient-text" id="successRate">0%</div>
                                <div className="text-sm text-muted-foreground font-medium">Success Rate</div>
                            </div>
                        </div>
                    </div>
                    <div className="relative animate-slide-in-right">
                        <div className="animate-float">
                            <div className="glass-effect rounded-lg shadow-2xl">
                                <div className="flex items-center justify-between p-4 border-b border-border">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex space-x-2">
                                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        </div>
                                        <span className="text-sm text-muted-foreground font-mono">backend-api.js</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button className="text-muted-foreground hover:text-foreground transition-colors"><Save className="h-4 w-4" /></button>
                                        <button className="text-muted-foreground hover:text-foreground transition-colors"><Share className="h-4 w-4" /></button>
                                    </div>
                                </div>
                                <div id="liveEditor" className="p-6 font-mono text-sm leading-relaxed bg-background/50">
                                    <div className="text-secondary">&#47;&#47; AI-Guided Backend Development</div>
                                    <div><span className="text-accent">const</span> <span className="text-primary">express</span> = <span className="text-green-400">require</span>(<span className="text-yellow-300">'express'</span>);</div>
                                    <div><span className="text-accent">const</span> <span className="text-primary">cors</span> = <span className="text-green-400">require</span>(<span className="text-yellow-300">'cors'</span>);</div>
                                    <div><span className="text-accent">const</span> <span className="text-primary">helmet</span> = <span className="text-green-400">require</span>(<span className="text-yellow-300">'helmet'</span>);</div>
                                    <br/>
                                    <div><span className="text-accent">const</span> <span className="text-primary">app</span> = <span className="text-primary">express</span>();</div>
                                    <br/>
                                    <div><span className="text-secondary">&#47;&#47; AI: Security middleware recommended</span></div>
                                    <div><span className="text-primary">app</span>.<span className="text-yellow-300">use</span>(<span className="text-primary">helmet</span>());</div>
                                    <div><span className="text-primary">app</span>.<span className="text-yellow-300">use</span>(<span className="text-primary">cors</span>());</div>
                                    <div><span className="text-primary">app</span>.<span className="text-yellow-300">use</span>(<span className="text-primary">express</span>.<span className="text-yellow-300">json</span>());</div>
                                    <br/>
                                    <div><span className="text-primary">app</span>.<span className="text-yellow-300">post</span>(<span className="text-yellow-300">'/api/users'</span>, <span className="text-accent">async</span> (<span className="text-primary">req, res</span>) => {'{'}</div>
                                    <div className="pl-4"><span className="text-secondary">&#47;&#47; AI: Validate input data</span></div>
                                    <div className="pl-4"><span className="text-accent">try</span> {'{'}</div>
                                    <div className="pl-8"><span className="text-accent">const</span> <span className="text-primary">user</span> = <span className="text-accent">await</span> <span className="text-green-400">createUser</span>(<span className="text-primary">req.body</span>);</div>
                                    <div className="pl-8"><span className="text-primary">res</span>.<span className="text-yellow-300">status</span>(<span className="text-green-400">201</span>).<span className="text-yellow-300">json</span>(<span className="text-primary">user</span>);</div>
                                    <div className="pl-4">{'}'} <span className="text-accent">catch</span> (<span className="text-primary">error</span>) {'{'}</div>
                                    <div className="pl-8"><span className="text-primary">res</span>.<span className="text-yellow-300">status</span>(<span className="text-red-400">400</span>).<span className="text-yellow-300">json</span>({'{'} <span className="text-primary">error</span> {'}'});</div>
                                    <div className="pl-4">{'}'}</div>
                                    <div>{'}'});</div>
                                    <br/>
                                    <div><span className="text-primary">app</span>.<span className="text-yellow-300">listen</span>(<span className="text-green-400">3000</span>, () => {'{'}</div>
                                    <div className="pl-4"><span className="text-primary">console</span>.<span className="text-yellow-300">log</span>(<span className="text-yellow-300">'🚀 Server running on port 3000'</span>);</div>
                                    <div>{'}'});</div>
                                </div>
                                <div className="p-4 border-t border-border flex justify-between items-center">
                                    <div className="flex space-x-3">
                                        <Button onClick={() => toast({ title: <div className="flex items-center gap-2"><Play/>Code execution simulated!</div> })} variant="secondary"><Play /><span>Run Code</span></Button>
                                        <Button onClick={() => setAiModalOpen(true)} variant="secondary"><Bot /><span>AI Help</span></Button>
                                        <Button onClick={() => { navigator.clipboard.writeText('https://backendmentor.dev/share/xyz'); toast({ title: <div className="flex items-center gap-2"><Share/>Share link copied!</div> })}} variant="secondary"><Share /><span>Share</span></Button>
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm text-green-400">
                                        <CheckCircle /><span>Tests: 12/12</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 animate-fade-in-up">
                    <h2 className="text-5xl font-bold mb-6">Revolutionary <span className="gradient-text">Learning Experience</span></h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">AI Assistant, Live Editor, API Playground, and Real-time Collaboration - All in One Innovative Platform</p>
                </div>
                <div className="grid lg:grid-cols-3 gap-8 mb-16">
                    <div onClick={() => setAiModalOpen(true)} className="glass-effect rounded-2xl p-8 cursor-pointer group" id="aiFeatureCard">
                        <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Bot className="text-white h-8 w-8" /></div>
                        <h3 className="text-2xl font-bold mb-4">AI Mentor Assistant</h3>
                        <p className="text-muted-foreground mb-6 leading-relaxed">Context-aware AI that provides real-time hints, debugging help, code reviews, and explains complex concepts with personalized learning paths.</p>
                        <div className="flex items-center justify-between">
                             <Button onClick={(e) => {e.stopPropagation(); setAiModalOpen(true);}} variant="secondary">Try AI Assistant</Button>
                            <div className="flex items-center space-x-1 text-sm text-muted-foreground"><Star className="text-yellow-400 h-4 w-4" /><span>4.9/5</span></div>
                        </div>
                    </div>
                    <div className="feature-card glass-effect rounded-2xl p-8 cursor-pointer group" id="editorFeatureCard">
                        <div className="w-16 h-16 bg-gradient-to-r from-accent to-secondary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Code className="text-white h-8 w-8" /></div>
                        <h3 className="text-2xl font-bold mb-4">Live Coding Environment</h3>
                        <p className="text-muted-foreground mb-6 leading-relaxed">Monaco Editor with IntelliSense, syntax highlighting, real-time collaboration, instant code execution, and integrated debugging tools.</p>
                        <div className="flex items-center justify-between">
                            <Button onClick={() => toast({title: <div className="flex items-center gap-2"><Code/>Live editor coming soon!</div>})} variant="secondary">Open Live Editor</Button>
                            <div className="flex items-center space-x-1 text-sm text-muted-foreground"><Users className="h-4 w-4" /><span>Real-time</span></div>
                        </div>
                    </div>
                    <div className="feature-card glass-effect rounded-2xl p-8 cursor-pointer group" id="apiFeatureCard">
                        <div className="w-16 h-16 bg-gradient-to-r from-secondary to-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Network className="text-white h-8 w-8" /></div>
                        <h3 className="text-2xl font-bold mb-4">API Playground</h3>
                        <p className="text-muted-foreground mb-6 leading-relaxed">Built-in Postman-like interface for testing APIs, viewing responses, debugging endpoints, and generating API documentation automatically.</p>
                        <div className="flex items-center justify-between">
                             <Button asChild variant="secondary">
                                <a href="#playground">Launch Playground</a>
                            </Button>
                            <div className="flex items-center space-x-1 text-sm text-muted-foreground"><Bolt className="h-4 w-4" /><span>Instant</span></div>
                        </div>
                    </div>
                </div>
                 <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="glass-effect rounded-xl p-6 text-center hover:scale-105 transition-transform">
                        <Trophy className="text-green-400 text-2xl mb-3 mx-auto h-8 w-8" />
                        <h4 className="font-semibold mb-2">Gamified Learning</h4>
                        <p className="text-sm text-muted-foreground">XP, badges, streaks, leaderboards</p>
                    </div>
                    <div className="glass-effect rounded-xl p-6 text-center hover:scale-105 transition-transform">
                        <Users className="text-primary text-2xl mb-3 mx-auto h-8 w-8" />
                        <h4 className="font-semibold mb-2">Pair Programming</h4>
                        <p className="text-sm text-muted-foreground">Real-time collaboration</p>
                    </div>
                    <div className="glass-effect rounded-xl p-6 text-center hover:scale-105 transition-transform">
                        <Download className="text-secondary text-2xl mb-3 mx-auto h-8 w-8" />
                        <h4 className="font-semibold mb-2">Challenge Packages</h4>
                        <p className="text-sm text-muted-foreground">Complete project templates</p>
                    </div>
                    <div className="glass-effect rounded-xl p-6 text-center hover:scale-105 transition-transform">
                        <ChartLine className="text-accent text-2xl mb-3 mx-auto h-8 w-8" />
                        <h4 className="font-semibold mb-2">Progress Analytics</h4>
                        <p className="text-sm text-muted-foreground">Detailed learning insights</p>
                    </div>
                </div>
            </div>
        </section>

        <section id="playground" className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-5xl font-bold mb-6">Experience the <span className="gradient-text">Platform</span></h2>
                    <p className="text-xl text-muted-foreground">Try our interactive features right now - no signup required</p>
                </div>
                <div className="grid lg:grid-cols-2 gap-12">
                    <div className="glass-effect rounded-2xl p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold">API Testing Playground</h3>
                            <div className="flex space-x-2">
                                <Button onClick={() => handleSetApiMethod('GET')} size="sm" variant={apiMethod === 'GET' ? 'default' : 'secondary'}>GET</Button>
                                <Button onClick={() => handleSetApiMethod('POST')} size="sm" variant={apiMethod === 'POST' ? 'default' : 'secondary'}>POST</Button>
                                <Button onClick={() => handleSetApiMethod('PUT')} size="sm" variant={apiMethod === 'PUT' ? 'default' : 'secondary'}>PUT</Button>
                                <Button onClick={() => handleSetApiMethod('DELETE')} size="sm" variant={apiMethod === 'DELETE' ? 'destructive' : 'secondary'}>DELETE</Button>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">API Endpoint</label>
                                <div className="relative">
                                    <input value={apiUrl} onChange={(e) => setApiUrl(e.target.value)} type="text" className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:border-primary focus:outline-none font-mono" />
                                </div>
                            </div>
                             {requestBodyVisible && (
                                <div id="requestBody">
                                    <label className="block text-sm font-medium mb-2">Request Body (JSON)</label>
                                    <textarea value={apiRequestBody} onChange={(e) => setApiRequestBody(e.target.value)} className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:border-primary focus:outline-none font-mono h-24" placeholder='{"title": "Test Post", "body": "This is a test", "userId": 1}'></textarea>
                                </div>
                            )}
                            <div className="flex space-x-3">
                                 <Button onClick={handleSendApiRequest} disabled={isApiLoading} className="flex-1 btn-primary-gradient text-primary-foreground font-medium"><Send /><span>Send Request</span></Button>
                                <Button onClick={handleClearApi} variant="destructive" size="icon"><Trash /></Button>
                            </div>
                           {apiResponse && (
                                <div id="apiResponse">
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="block text-sm font-medium">Response</label>
                                        <div className="flex items-center space-x-2">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${apiResponse.status >= 200 && apiResponse.status < 300 ? 'bg-green-500' : 'bg-red-500'}`}>{apiResponse.status} {apiResponse.statusText}</span>
                                            <span className="text-xs text-muted-foreground">{apiResponse.time}ms</span>
                                        </div>
                                    </div>
                                    <div className="bg-background border border-border rounded-xl p-4 max-h-64 overflow-y-auto">
                                        <pre className="text-sm font-mono text-muted-foreground">{JSON.stringify(apiResponse.body, null, 2)}</pre>
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
                                    <span className="text-primary font-semibold">85%</span>
                                </div>
                                <div className="w-full bg-border rounded-full h-3">
                                    <div className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-1000" style={{width: '85%'}}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="font-medium">API Development</span>
                                    <span className="text-green-400 font-semibold">72%</span>
                                </div>
                                <div className="w-full bg-border rounded-full h-3">
                                    <div className="bg-gradient-to-r from-green-400 to-primary h-3 rounded-full transition-all duration-1000" style={{width: '72%'}}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="font-medium">Database Design</span>
                                    <span className="text-secondary font-semibold">58%</span>
                                </div>
                                <div className="w-full bg-border rounded-full h-3">
                                    <div className="bg-gradient-to-r from-secondary to-accent h-3 rounded-full transition-all duration-1000" style={{width: '58%'}}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="font-medium">DevOps & Deployment</span>
                                    <span className="text-accent font-semibold">34%</span>
                                </div>
                                <div className="w-full bg-border rounded-full h-3">
                                    <div className="bg-gradient-to-r from-accent to-secondary h-3 rounded-full transition-all duration-1000" style={{width: '34%'}}></div>
                                </div>
                            </div>
                            <div className="pt-6 border-t border-border">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <div className="text-3xl font-bold gradient-text">Level 15</div>
                                        <div className="text-sm text-muted-foreground">Senior Backend Developer</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-bold">3,750 XP</div>
                                        <div className="text-sm text-muted-foreground">250 to next level</div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-3 p-3 bg-card rounded-lg">
                                        <Trophy className="text-green-400" />
                                        <div>
                                            <div className="text-sm font-medium">API Master</div>
                                            <div className="text-xs text-muted-foreground">Completed 10 API challenges</div>
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
                    Master the <span className="gradient-text">Modern Tech Stack</span>
                </h2>
                <p className="text-xl text-muted-foreground mb-16 max-w-3xl mx-auto">Practice with the technologies that power today's most successful applications</p>
                <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-8 mb-16">
                    <div className="flex flex-col items-center space-y-3 opacity-80 hover:opacity-100 transition-opacity">
                        <div className="w-16 h-16 glass-effect rounded-xl flex items-center justify-center"><FaNodeJs className="text-green-400 h-8 w-8" /></div>
                        <span className="text-muted-foreground text-sm">Node.js</span>
                    </div>
                    <div className="flex flex-col items-center space-y-3 opacity-80 hover:opacity-100 transition-opacity">
                        <div className="w-16 h-16 glass-effect rounded-xl flex items-center justify-center"><FaPython className="text-blue-400 h-8 w-8" /></div>
                        <span className="text-muted-foreground text-sm">Python</span>
                    </div>
                    <div className="flex flex-col items-center space-y-3 opacity-80 hover:opacity-100 transition-opacity">
                        <div className="w-16 h-16 glass-effect rounded-xl flex items-center justify-center"><FaJava className="text-red-400 h-8 w-8" /></div>
                        <span className="text-muted-foreground text-sm">Java</span>
                    </div>
                    <div className="flex flex-col items-center space-y-3 opacity-80 hover:opacity-100 transition-opacity">
                        <div className="w-16 h-16 glass-effect rounded-xl flex items-center justify-center"><Server className="text-purple-400 h-8 w-8" /></div>
                        <span className="text-muted-foreground text-sm">MongoDB</span>
                    </div>
                    <div className="flex flex-col items-center space-y-3 opacity-80 hover:opacity-100 transition-opacity">
                        <div className="w-16 h-16 glass-effect rounded-xl flex items-center justify-center"><Server className="text-blue-500 h-8 w-8" /></div>
                        <span className="text-muted-foreground text-sm">PostgreSQL</span>
                    </div>
                    <div className="flex flex-col items-center space-y-3 opacity-80 hover:opacity-100 transition-opacity">
                        <div className="w-16 h-16 glass-effect rounded-xl flex items-center justify-center"><FaAws className="text-orange-400 h-8 w-8" /></div>
                        <span className="text-muted-foreground text-sm">AWS</span>
                    </div>
                    <div className="flex flex-col items-center space-y-3 opacity-80 hover:opacity-100 transition-opacity">
                        <div className="w-16 h-16 glass-effect rounded-xl flex items-center justify-center"><FaPhp className="text-indigo-400 h-8 w-8" /></div>
                        <span className="text-muted-foreground text-sm">PHP</span>
                    </div>
                    <div className="flex flex-col items-center space-y-3 opacity-80 hover:opacity-100 transition-opacity">
                        <div className="w-16 h-16 glass-effect rounded-xl flex items-center justify-center"><FaDocker className="text-sky-400 h-8 w-8" /></div>
                        <span className="text-muted-foreground text-sm">Docker</span>
                    </div>
                </div>
            </div>
        </section>

        <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-5xl font-bold mb-6">Choose Your <span className="gradient-text">Learning Path</span></h2>
                    <p className="text-xl text-muted-foreground">Start free, upgrade when you're ready to accelerate</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <div className="glass-effect rounded-2xl p-8 hover:scale-105 transition-transform">
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold mb-2">Free</h3>
                            <div className="text-4xl font-bold mb-2">$0</div>
                            <div className="text-muted-foreground">Forever free</div>
                        </div>
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-center space-x-3"><CheckCircle className="text-green-400 h-5 w-5" /><span>5 challenges per month</span></li>
                            <li className="flex items-center space-x-3"><CheckCircle className="text-green-400 h-5 w-5" /><span>Basic AI assistance</span></li>
                            <li className="flex items-center space-x-3"><CheckCircle className="text-green-400 h-5 w-5" /><span>Community access</span></li>
                            <li className="flex items-center space-x-3"><CheckCircle className="text-green-400 h-5 w-5" /><span>Progress tracking</span></li>
                        </ul>
                        <Button onClick={handleAuthModalOpen} className="w-full" variant="outline">Get Started Free</Button>
                    </div>
                    <div className="glass-effect rounded-2xl p-8 border-2 border-primary relative hover:scale-105 transition-transform">
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium">Most Popular</div>
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold mb-2">Pro</h3>
                            <div className="text-4xl font-bold mb-2">$29</div>
                            <div className="text-muted-foreground">per month</div>
                        </div>
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-center space-x-3"><CheckCircle className="text-green-400 h-5 w-5" /><span>Unlimited challenges</span></li>
                            <li className="flex items-center space-x-3"><CheckCircle className="text-green-400 h-5 w-5" /><span>Advanced AI mentor</span></li>
                            <li className="flex items-center space-x-3"><CheckCircle className="text-green-400 h-5 w-5" /><span>Live coding sessions</span></li>
                            <li className="flex items-center space-x-3"><CheckCircle className="text-green-400 h-5 w-5" /><span>Priority support</span></li>
                            <li className="flex items-center space-x-3"><CheckCircle className="text-green-400 h-5 w-5" /><span>Certificate of completion</span></li>
                        </ul>
                        <Button onClick={handleAuthModalOpen} className="w-full btn-primary-gradient">Start Pro Trial</Button>
                    </div>
                    <div className="glass-effect rounded-2xl p-8 hover:scale-105 transition-transform">
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
                            <div className="text-4xl font-bold mb-2">$99</div>
                            <div className="text-muted-foreground">per month</div>
                        </div>
                        <ul className="space-y-3 mb-8">
                             <li className="flex items-center space-x-3"><CheckCircle className="text-green-400 h-5 w-5" /><span>Everything in Pro</span></li>
                             <li className="flex items-center space-x-3"><CheckCircle className="text-green-400 h-5 w-5" /><span>Team collaboration</span></li>
                             <li className="flex items-center space-x-3"><CheckCircle className="text-green-400 h-5 w-5" /><span>Custom challenges</span></li>
                             <li className="flex items-center space-x-3"><CheckCircle className="text-green-400 h-5 w-5" /><span>Analytics dashboard</span></li>
                             <li className="flex items-center space-x-3"><CheckCircle className="text-green-400 h-5 w-5" /><span>Dedicated support</span></li>
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
                    <p className="text-xl text-muted-foreground">Connect, learn, and grow with thousands of backend developers</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <div className="glass-effect rounded-xl p-6 text-center hover:scale-105 transition-transform cursor-pointer">
                        <FaDiscord className="text-4xl text-primary mb-4 mx-auto" />
                        <h4 className="font-bold mb-2">Discord Server</h4>
                        <p className="text-sm text-muted-foreground mb-4">24/7 community support</p>
                        <div className="text-green-400 font-semibold">15K+ Members</div>
                    </div>
                    <div className="glass-effect rounded-xl p-6 text-center hover:scale-105 transition-transform cursor-pointer">
                        <FaGithub className="text-4xl text-foreground mb-4 mx-auto" />
                        <h4 className="font-bold mb-2">GitHub</h4>
                        <p className="text-sm text-muted-foreground mb-4">Open source challenges</p>
                        <div className="text-green-400 font-semibold">2K+ Stars</div>
                    </div>
                    <div className="glass-effect rounded-xl p-6 text-center hover:scale-105 transition-transform cursor-pointer">
                        <FaYoutube className="text-4xl text-accent mb-4 mx-auto" />
                        <h4 className="font-bold mb-2">YouTube</h4>
                        <p className="text-sm text-muted-foreground mb-4">Video tutorials</p>
                        <div className="text-green-400 font-semibold">50K+ Subs</div>
                    </div>
                    <div className="glass-effect rounded-xl p-6 text-center hover:scale-105 transition-transform cursor-pointer">
                        <FaTwitter className="text-4xl text-primary mb-4 mx-auto" />
                        <h4 className="font-bold mb-2">Twitter</h4>
                        <p className="text-sm text-muted-foreground mb-4">Daily tips & updates</p>
                        <div className="text-green-400 font-semibold">25K+ Followers</div>
                    </div>
                </div>
                <div className="text-center">
                    <Button size="lg" onClick={() => toast({ title: <div className="flex items-center gap-2"><Users /> Joining community...</div> })} className="btn-primary-gradient text-primary-foreground font-semibold">
                        <Users className="mr-2 h-5 w-5" />Join Community
                    </Button>
                </div>
            </div>
        </section>

        <section id="docs" className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-5xl font-bold mb-6">Comprehensive <span className="gradient-text">Documentation</span></h2>
                    <p className="text-xl text-muted-foreground">Everything you need to master backend development</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="glass-effect rounded-xl p-6 hover:scale-105 transition-transform cursor-pointer">
                        <Book className="text-3xl text-primary mb-4 h-8 w-8" />
                        <h4 className="text-xl font-bold mb-3">Getting Started</h4>
                        <p className="text-muted-foreground mb-4">Complete beginner's guide to backend development</p>
                        <div className="flex items-center text-primary"><span className="text-sm font-medium">Read Guide</span><Play className="ml-2 h-4 w-4" /></div>
                    </div>
                    <div className="glass-effect rounded-xl p-6 hover:scale-105 transition-transform cursor-pointer">
                        <Code className="text-3xl text-green-400 mb-4 h-8 w-8" />
                        <h4 className="text-xl font-bold mb-3">API Reference</h4>
                        <p className="text-muted-foreground mb-4">Complete API documentation with examples</p>
                        <div className="flex items-center text-green-400"><span className="text-sm font-medium">View API</span><Play className="ml-2 h-4 w-4" /></div>
                    </div>
                    <div className="glass-effect rounded-xl p-6 hover:scale-105 transition-transform cursor-pointer">
                        <Video className="text-3xl text-accent mb-4 h-8 w-8" />
                        <h4 className="text-xl font-bold mb-3">Video Tutorials</h4>
                        <p className="text-muted-foreground mb-4">Step-by-step video guides and walkthroughs</p>
                        <div className="flex items-center text-accent"><span className="text-sm font-medium">Watch Now</span><Play className="ml-2 h-4 w-4" /></div>
                    </div>
                </div>
            </div>
        </section>

        {/* Auth Modal */}
        {authModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                <div className="glass-effect rounded-2xl p-8 max-w-md w-full relative">
                    <Button onClick={() => setAuthModalOpen(false)} variant="ghost" size="icon" className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
                        <X />
                    </Button>
                    {!onboardingStep ? (
                        <div id="authStep1" className="space-y-6">
                            <h2 className="text-3xl font-bold gradient-text text-center">Join BackendMentorAI</h2>
                            <div className="space-y-4">
                                <Button onClick={() => handleOAuth('GitHub')} className="w-full bg-gray-800 hover:bg-gray-700 text-white py-6 text-base"><FaGithub className="mr-2" /> Continue with GitHub</Button>
                                <Button onClick={() => handleOAuth('Google')} className="w-full bg-white hover:bg-gray-200 text-gray-900 py-6 text-base"><FaGoogle className="mr-2" /> Continue with Google</Button>
                            </div>
                            <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div><div className="relative flex justify-center text-sm"><span className="px-2 bg-card text-muted-foreground">or</span></div></div>
                            <div className="space-y-4">
                                <input type="email" placeholder="Enter your email" className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:border-primary focus:outline-none" />
                                <Button onClick={handleEmailSignup} className="w-full py-6 btn-primary-gradient">Create Account</Button>
                            </div>
                        </div>
                    ) : (
                         <div id="onboardingStep" className="space-y-6">
                            <h3 className="text-2xl font-bold text-center">Customize Your Experience</h3>
                             {/* Simplified onboarding for brevity */}
                            <Button onClick={handleCompleteOnboarding} className="w-full py-6 bg-gradient-to-r from-primary to-accent">🚀 Start My Journey</Button>
                        </div>
                    )}
                </div>
            </div>
        )}

         {/* AI Modal */}
        {aiModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                 <div className="glass-effect rounded-2xl p-6 max-w-lg w-full relative">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold flex items-center gap-2"><Bot />AI Mentor Assistant</h2>
                        <Button onClick={() => setAiModalOpen(false)} variant="ghost" size="icon" className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"><X /></Button>
                    </div>
                    {/* Simplified AI chat for brevity */}
                    <div className="h-64 bg-background rounded-lg p-4 text-muted-foreground">AI chat placeholder...</div>
                     <div className="mt-4 flex gap-2">
                        <input type="text" placeholder="Ask the AI..." className="flex-grow bg-background border border-border rounded-lg px-4" />
                        <Button className="btn-primary-gradient">Send</Button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
}
