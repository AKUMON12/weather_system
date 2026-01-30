import { useState } from 'react';
import axios, { AxiosError } from "axios";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Cloud, Mail, Lock, User, ArrowRight } from 'lucide-react';

interface AuthCardProps {
  // Combined the prop names: now it handles the success and passes user data
  onAuthSuccess: (user: any) => void;
}

const AuthCard = ({ onAuthSuccess }: AuthCardProps) => {
  // --- Logic State (From your original code) ---
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // renamed 'name' to 'username' to match your API
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_BASE_URL;

  // --- Handling Submission (The combined logic) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMsg("");

    const endpoint = isLogin ? "/api/login" : "/api/register";
    const payload = isLogin
      ? { email, password }
      : { username, email, password };

    // DEBUG LOGS
    console.log("🚀 URL:", `${API_URL}${endpoint}`);
    console.log("📦 PAYLOAD:", payload);

    try {
      const res = await axios.post(`${API_URL}${endpoint}`, payload);

      if (isLogin) {
        localStorage.setItem("token", res.data.token);
        onAuthSuccess(res.data.user);
      } else {
        setMsg("Registered! Please login.");
        setIsLogin(true);
      }
    } catch (err) {
      const axiosError = err as AxiosError<any>;
      console.error("❌ FULL ERROR:", axiosError);

      // If the response is not JSON, this will fail. Let's catch the raw response text:
      if (typeof axiosError.response?.data === 'string') {
        console.log("⚠️ SERVER RETURNED HTML INSTEAD OF JSON:", axiosError.response.data.substring(0, 100));
      }

      setMsg(axiosError.response?.data?.error || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card p-8 w-full max-w-md animate-scale-in">
      {/* Logo Section */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center animate-glow">
            <Cloud className="w-8 h-8 text-primary" />
          </div>
          <div className="absolute -inset-2 bg-primary/20 rounded-3xl blur-xl -z-10" />
        </div>
        <h1 className="font-display text-3xl font-bold gradient-text">SkyCast OS</h1>
        <p className="text-muted-foreground text-sm mt-1">Your Atmospheric Portal</p>
      </div>

      {/* Login/Register Toggle */}
      <div className="flex bg-muted/50 rounded-lg p-1 mb-6">
        <button
          type="button"
          onClick={() => setIsLogin(true)}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ${isLogin ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground'
            }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => setIsLogin(false)}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ${!isLogin ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground'
            }`}
        >
          Register
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div className="space-y-2 animate-fade-in">
            <Label htmlFor="username" className="text-sm text-muted-foreground">Username</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="username"
                type="text"
                placeholder="sky_walker"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10 bg-muted/30 border-white/10 neon-focus"
                required
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm text-muted-foreground">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 bg-muted/30 border-white/10 neon-focus"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm text-muted-foreground">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 bg-muted/30 border-white/10 neon-focus"
              required
            />
          </div>
        </div>

        {/* Error/Success Message Display */}
        {msg && (
          <p className={`text-xs text-center p-2 rounded-lg ${msg.includes("Registered") ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
            }`}>
            {msg}
          </p>
        )}

        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-6 neon-glow group"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            <>
              {isLogin ? 'Enter the Portal' : 'Create Account'}
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
      </form>

      {/* Divider and Socials remain as decoration */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-[#0f172a] px-2 text-muted-foreground">or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" type="button" className="bg-muted/30 border-white/10 hover:bg-muted/50">Google</Button>
        <Button variant="outline" type="button" className="bg-muted/30 border-white/10 hover:bg-muted/50">GitHub</Button>
      </div>
    </div>
  );
};

export default AuthCard;