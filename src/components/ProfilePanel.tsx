import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from './AuthContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Mail, 
  User, 
  Lock, 
  Palette, 
  Info, 
  LogOut,
  Shield,
  BellRing,
  Monitor,
  BookOpen,
  Sun,
  Moon,
  Cloud
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

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

  const themes = [
    { id: 'light', label: 'Light', icon: Sun, color: 'bg-white' },
    { id: 'comfort-blue', label: 'Comfort Blue', icon: Cloud, color: 'bg-[#1a2333]' },
    { id: 'dark', label: 'Matte Black', icon: Moon, color: 'bg-[#09090b]' }
  ];

  return (
    <div className="space-y-10 animate-fade-in max-w-4xl pb-20">
      <div>
        <h2 className="text-4xl font-black tracking-tighter">SETTINGS</h2>
        <p className="text-muted-foreground mt-1 uppercase text-xs font-bold tracking-widest opacity-60">Manage your account and preferences</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <Card className="glass-panel lg:col-span-2 rounded-[2.5rem] border-none overflow-hidden">
          <CardHeader className="flex flex-row items-center gap-6 p-8 bg-white/[0.02]">
            <Avatar className="h-20 w-20 rounded-[1.5rem] border-4 border-white/5 shadow-2xl">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-black">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold tracking-tight">{name}</CardTitle>
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

        {/* Appearance & Theme */}
        <Card className="glass-panel rounded-[2.5rem] border-none p-8">
          <div className="space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" /> Appearance
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-2xl border transition-all duration-300",
                    theme === t.id 
                      ? "bg-primary/20 border-primary shadow-lg shadow-primary/10" 
                      : "bg-white/5 border-white/5 hover:bg-white/10"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <t.icon className={cn("h-4 w-4", theme === t.id ? "text-primary" : "text-muted-foreground")} />
                    <span className={cn("text-sm font-bold", theme === t.id ? "text-primary" : "text-foreground")}>
                      {t.label}
                    </span>
                  </div>
                  <div className={cn("h-4 w-4 rounded-full border border-white/20", t.color)} />
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Account & Security */}
        <Card className="glass-panel lg:col-span-2 rounded-[2.5rem] border-none p-8 space-y-6">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" /> Account Security
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
              <div>
                <p className="font-bold text-sm">Change Password</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-tight">Security Level: High</p>
              </div>
              <Button variant="outline" size="sm" className="rounded-lg border-white/10 bg-white/5 hover:bg-white/10 font-bold">Update</Button>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
              <div>
                <p className="font-bold text-sm">Alarm Sound</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-tight">Current: Chime</p>
              </div>
              <BellRing className="h-5 w-5 text-primary opacity-50" />
            </div>
          </div>
        </Card>

        {/* About & Logout */}
        <div className="space-y-4">
          <Card className="glass-panel rounded-[2.5rem] border-none p-8 text-center flex flex-col items-center">
             <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                <BookOpen className="h-8 w-8" />
             </div>
             <h4 className="font-black text-xl">StudySpark</h4>
             <p className="text-[10px] font-bold text-muted-foreground tracking-[0.2em] mt-1">V1.5.0</p>
          </Card>
          
          <Button 
            variant="destructive" 
            onClick={handleLogout}
            className="w-full h-16 rounded-[1.5rem] font-black text-lg shadow-xl shadow-destructive/10 hover:scale-[1.02] transition-transform flex items-center justify-center gap-3"
          >
            <LogOut className="h-5 w-5" /> LOG OUT
          </Button>
        </div>
      </div>
    </div>
  );
}
