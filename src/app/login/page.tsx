
"use client";

import { useState, useEffect } from "react";
import { Github, VenetianMask, Loader2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Icons } from "@/components/icons";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const router = useRouter();
  const {
    user,
    loading: authHookLoading,
    signInWithGoogle,
    signInWithGitHub,
    signInWithEmail,
    signUpWithEmail,
  } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleAuthAction = async (action: () => Promise<any>) => {
    setIsAuthLoading(true);
    try {
      await action();
      // On success, useEffect will redirect to dashboard
    } catch (error: any) {
      let description = "An unexpected error occurred. Please try again.";
      if (error.code === 'auth/account-exists-with-different-credential') {
        description = "An account with this email already exists. Please sign in with the method you originally used.";
      } else if (error.code === 'auth/unauthorized-domain') {
        description = "This domain is not authorized for authentication. Please contact support.";
      } else if (error.code === 'auth/popup-blocked') {
        description = "The sign-in pop-up was blocked by your browser. Please allow pop-ups for this site and try again.";
      } else if (error.code === 'auth/popup-closed-by-user') {
        description = "The sign-in window was closed before completing the process. Please try again.";
      } else {
        description = error.message;
      }
      toast({
        title: "Authentication Error",
        description: description,
        variant: "destructive",
      });
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleGoogleSignIn = () => handleAuthAction(signInWithGoogle);
  const handleGitHubSignIn = () => handleAuthAction(signInWithGitHub);
  
  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      handleAuthAction(() => signInWithEmail(email, password));
    } else {
      handleAuthAction(() => signUpWithEmail(email, password));
    }
  };

  if (authHookLoading) {
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg text-white">Loading...</p>
          </div>
        </div>
    );
  }

  // Do not render the page if the user is already logged in and redirection is imminent.
  if(user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
        {isAuthLoading && (
         <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-lg text-white">Processing...</p>
            </div>
        </div>
        )}
      <div className="relative modal-content max-w-md w-full glass-effect rounded-2xl p-8 shadow-2xl">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-4 left-4 text-gray-400 hover:text-white"
          onClick={() => router.back()}
          aria-label="Go back"
        >
            <ArrowLeft className="h-6 w-6" />
        </Button>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold gradient-text">
            {isLogin ? "Welcome Back" : "Join Backend Mentor"}
          </h2>
          <p className="text-gray-300 mt-2">
            {isLogin
              ? "Sign in to continue your journey."
              : "Start your backend journey today."}
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={handleGoogleSignIn}
            disabled={isAuthLoading}
            className="w-full bg-white text-gray-900 hover:bg-gray-200 h-12 text-base"
          >
            <Icons.google className="mr-2 h-6 w-6" />
            Continue with Google
          </Button>
          <Button onClick={handleGitHubSignIn} disabled={isAuthLoading} className="w-full bg-gray-800 text-white hover:bg-gray-700 h-12 text-base">
            <Github className="mr-2 h-6 w-6" />
            Continue with GitHub
          </Button>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-dark-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-card px-2 text-gray-400">
              or continue with email
            </span>
          </div>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-4">
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-12 bg-dark-bg border-dark-border rounded-xl focus:border-accent-blue"
            required
            disabled={isAuthLoading}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-12 bg-dark-bg border-dark-border rounded-xl focus:border-accent-blue"
            required
            disabled={isAuthLoading}
          />
          <Button type="submit" disabled={isAuthLoading} className="w-full h-12 btn-primary text-lg">
             {isAuthLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLogin ? "Sign In" : "Create Account"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-accent-blue hover:underline font-medium"
            disabled={isAuthLoading}
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
