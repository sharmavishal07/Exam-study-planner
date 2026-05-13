import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from './AuthContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  Mail, 
  User, 
  Lock, 
  Palette, 
  Volume2, 
  Info, 
  LogOut,
  Shield,
  BellRing,
  Monitor
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from 'sonner';

export default function ProfilePanel() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  
  const name = user?.email?.split('@')[0] || "Guest";
  const initials = name.slice(0, 2).toUpperCase();
  const email = user?.email || "Guest User";

  const handleLogout = () => {
    localStorage.removeItem('guest_mode');
    window.location.reload();
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      <div>
        <h2 className="text-3xl font-black tracking-tighter">SETTINGS</h2>
        <p className="text-muted-foreground mt-1 uppercase text-xs font-bold tracking-widest">Manage your account and preferences</p>
      </div>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="bg-card/50 border border-white/5 p-1 rounded-2xl h-14 mb-8">
          <TabsTrigger value="profile" className="rounded-xl px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold">
            <User className="h-4 w-4 mr-2" /> Profile
          </TabsTrigger>
          <TabsTrigger value="account" className="rounded-xl px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold">
            <Shield className="h-4 w-4 mr-2" /> Account
          </TabsTrigger>
          <TabsTrigger value="appearance" className="rounded-xl px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold">
            <Palette className="h-4 w-4 mr-2" /> Appearance
          </TabsTrigger>
          <TabsTrigger value="about" className="rounded-xl px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold">
            <Info className="h-4 w-4 mr-2" /> About
          </TabsTrigger>
        </TabsList>

        {/* Profile Section */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="glass-panel rounded-[2.5rem] border-none overflow-hidden">
            <CardHeader className="flex flex-row items-center gap-6 p-8 bg-white/[0.02]">
              <Avatar className="h-24 w-24 rounded-[2rem] border-4 border-white/5 shadow-2xl">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-black">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <CardTitle className="text-3xl font-bold tracking-tight">{name}</CardTitle>
                <CardDescription className="text-muted-foreground font-medium">{email}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Name</Label>
                <Input value={name} readOnly className="bg-white/5 border-none h-12 rounded-xl px-4 font-semibold" />
              </div>
              <div className="space-y-3">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address</Label>
                <Input value={email} readOnly className="bg-white/5 border-none h-12 rounded-xl px-4 font-semibold" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Section */}
        <TabsContent value="account" className="space-y-6">
          <Card className="glass-panel rounded-[2.5rem] border-none p-8 space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" /> Security
              </h3>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm">Change Password</p>
                  <p className="text-xs text-muted-foreground">Update your account password regularly</p>
                </div>
                <Button variant="outline" className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 font-bold">Update</Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <BellRing className="h-5 w-5 text-primary" /> Alarm Sound
              </h3>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Select Study Alarm</Label>
                <Select defaultValue="chime">
                  <SelectTrigger className="bg-white/10 border-none h-12 rounded-xl">
                    <SelectValue placeholder="Select sound" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-white/5 rounded-xl">
                    <SelectItem value="chime">Elegant Chime</SelectItem>
                    <SelectItem value="digital">Digital Beep</SelectItem>
                    <SelectItem value="zen">Zen Gong</SelectItem>
                    <SelectItem value="none">No Sound</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="pt-4">
              <Button 
                variant="destructive" 
                onClick={handleLogout}
                className="w-full h-14 rounded-2xl font-black text-lg shadow-xl shadow-destructive/10 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
              >
                <LogOut className="h-5 w-5" /> LOG OUT
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Appearance Section */}
        <TabsContent value="appearance" className="space-y-6">
          <Card className="glass-panel rounded-[2.5rem] border-none p-8">
            <div className="flex items-center justify-between p-6 rounded-3xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Monitor className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold">Dark Mode</p>
                  <p className="text-xs text-muted-foreground">Switch between Light and Matte Black</p>
                </div>
              </div>
              <Switch 
                checked={theme === 'dark'} 
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')} 
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </Card>
        </TabsContent>

        {/* About Section */}
        <TabsContent value="about" className="space-y-6">
          <Card className="glass-panel rounded-[2.5rem] border-none p-8 flex flex-col items-center text-center">
            <div className="h-24 w-24 rounded-[2.5rem] bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-2xl shadow-primary/20">
              <BookOpen className="h-12 w-12" />
            </div>
            <h3 className="text-3xl font-black tracking-tighter">StudySpark</h3>
            <p className="text-muted-foreground font-bold text-sm mt-1 uppercase tracking-widest">Version 1.5.0</p>
            
            <div className="mt-8 p-6 rounded-3xl bg-white/5 border border-white/5 max-w-md">
              <p className="text-sm text-muted-foreground leading-relaxed">
                StudySpark is a premium, AI-driven study planner designed to help you crush your exams with minimal stress. Built for students who value both functionality and aesthetics.
              </p>
            </div>

            <p className="mt-12 text-[10px] text-muted-foreground font-bold uppercase tracking-[0.3em]">
              Handcrafted for High Performers
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
