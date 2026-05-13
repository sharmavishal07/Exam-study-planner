import React, { useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { X, Sparkles } from 'lucide-react';
import { useAuth } from './AuthContext';

export const AuthWindow: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const user = await api.signup(email, password);
      toast.success('Signed up successfully!');
      signIn({ id: user.id, email: user.email });
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during sign up');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await api.login(email, password);
      toast.success('Logged in successfully!');
      signIn({ id: user.id, email: user.email });
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background relative overflow-hidden p-4">
      {/* Background Decorative Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-mint/10 blur-[120px] rounded-full" />

      <Card className="w-full max-w-md glass-panel rounded-[2.5rem] border-white/5 relative z-10 p-4 shadow-2xl">
        <button
          onClick={() => {
            localStorage.setItem('guest_mode', 'true');
            window.location.reload();
          }}
          className="absolute right-6 top-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
          title="Close"
        >
          <X className="h-4 w-4" />
        </button>
        
        <CardHeader className="pt-8 text-center">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 text-primary">
            <Sparkles className="h-8 w-8" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">Study Spark</CardTitle>
          <CardDescription className="text-muted-foreground mt-2">Precision planning for your academic success.</CardDescription>
        </CardHeader>

        <CardContent className="pb-8">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/5 rounded-xl p-1 mb-6">
              <TabsTrigger value="login" className="rounded-lg font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Login</TabsTrigger>
              <TabsTrigger value="signup" className="rounded-lg font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white/5 border-none h-12 rounded-xl px-4 font-medium"
                  />
                  <Input
                    type="password"
                    placeholder="Security Key"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-white/5 border-none h-12 rounded-xl px-4 font-medium"
                  />
                </div>
                <Button className="w-full h-14 rounded-xl bg-primary text-primary-foreground font-bold text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform mt-2" type="submit" disabled={loading}>
                  {loading ? 'Authenticating...' : 'Enter Dashboard'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white/5 border-none h-12 rounded-xl px-4 font-medium"
                  />
                  <Input
                    type="password"
                    placeholder="Create Security Key"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-white/5 border-none h-12 rounded-xl px-4 font-medium"
                  />
                </div>
                <Button className="w-full h-14 rounded-xl bg-primary text-primary-foreground font-bold text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform mt-2" type="submit" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Initialize Profile'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-xs text-muted-foreground mb-4 font-medium uppercase tracking-widest">Alternative Access</p>
            <Button
              variant="ghost"
              className="w-full h-12 rounded-xl bg-white/5 hover:bg-white/10 font-bold"
              onClick={() => {
                toast.info("Continuing as Guest. Data remains local.");
                localStorage.setItem('guest_mode', 'true');
                window.location.reload();
              }}
            >
              Continue as Guest
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
