import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Code, Cpu, Github, TestTube, Users } from 'lucide-react';
import Link from 'next/link';
import { FaDiscord } from 'react-icons/fa';

const features = [
  {
    icon: <Bot className="h-10 w-10 text-primary" />,
    title: 'AI Mentor',
    description: 'Get real-time coding assistance, debugging help, and personalized learning paths from our AI-powered mentor.',
  },
  {
    icon: <Code className="h-10 w-10 text-primary" />,
    title: 'Interactive Challenges',
    description: 'Sharpen your skills with hands-on coding challenges designed to simulate real-world backend problems.',
  },
  {
    icon: <Cpu className="h-10 w-10 text-primary" />,
    title: 'In-Browser Code Execution',
    description: 'A sandboxed environment to run your code against test cases without leaving your browser.',
  },
  {
    icon: <TestTube className="h-10 w-10 text-primary" />,
    title: 'API Playground',
    description: 'Test and inspect REST, GraphQL, and other API endpoints with a powerful and intuitive playground.',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bot className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">BackendMentorAI</h1>
        </div>
        <Button asChild>
          <Link href="/dashboard">Launch App</Link>
        </Button>
      </header>

      <main className="flex-grow">
        <section className="text-center py-20 lg:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl lg:text-6xl font-extrabold tracking-tight">
              The Ultimate AI-Powered Backend Development Suite
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              From personalized learning paths to an in-browser code executor, BackendMentorAI provides everything you need to master backend engineering.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/dashboard">Get Started for Free</Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                 <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-5 w-5" />
                  Star on GitHub
                </a>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 lg:py-24 bg-card">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h3 className="text-3xl lg:text-4xl font-bold">All-in-One Toolkit</h3>
              <p className="mt-2 text-muted-foreground">Everything a backend developer needs to learn, build, and debug.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature) => (
                <Card key={feature.title} className="text-center bg-background/50">
                  <CardHeader className="items-center">
                    {feature.icon}
                    <CardTitle className="mt-4">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        <section id="community" className="py-20 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <Users className="mx-auto h-12 w-12 text-primary" />
              <h3 className="mt-4 text-3xl lg:text-4xl font-bold">Join Our Community</h3>
              <p className="mt-2 max-w-xl mx-auto text-muted-foreground">
                Connect with other developers, share your progress, and get help from peers and mentors.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <Button size="lg" variant="secondary" asChild>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <FaDiscord className="mr-2 h-5 w-5" />
                    Join our Discord
                  </a>
                </Button>
                <Button size="lg" variant="secondary" asChild>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-5 w-5" />
                    Follow on GitHub
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-6 border-t bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} BackendMentorAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
