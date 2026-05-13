import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  LayoutGrid,
  CalendarDays,
  BookOpen,
  CalendarClock,
  Flame,
  Plus,
  Timer,
  Bell,
  MessageSquare,
  FileText,
  Users,
  ChevronRight,
  Menu
} from 'lucide-react';

type View = 'dashboard' | 'calendar' | 'subjects' | 'settings' | 'tools' | 'profile';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  streak: number;
  onCreateClick: () => void;
}

const navItems: { view: View; icon: React.ElementType; label: string }[] = [
  { view: 'dashboard', icon: LayoutGrid, label: 'Dashboard' },
  { view: 'calendar', icon: CalendarDays, label: 'Calendar' },
  { view: 'subjects', icon: BookOpen, label: 'Subjects' },
  { view: 'tools', icon: Timer, label: 'Tools' },
  { view: 'settings', icon: CalendarClock, label: 'Time Table Generator' },
];

export default function AppSidebar({ currentView, onViewChange, streak, onCreateClick }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <aside 
      className={cn(
        "flex flex-col h-full bg-card border-r border-white/5 py-8 transition-all duration-500 ease-in-out z-50 overflow-hidden",
        isExpanded ? "w-64 px-6" : "w-20 px-0 items-center"
      )}
    >
      {/* Brand Icon / Toggle */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "flex items-center justify-center h-12 w-12 rounded-2xl bg-primary/10 text-primary hover:bg-primary/20 transition-all mb-10 shrink-0",
          isExpanded && "w-full justify-start px-3 gap-3"
        )}
      >
        <BookOpen className="h-7 w-7" />
        {isExpanded && <span className="font-bold text-lg tracking-tight truncate text-foreground">StudySpark</span>}
      </button>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-4 w-full">
        {navItems.map(({ view, icon: Icon, label }) => (
          <button
            key={view}
            onClick={() => onViewChange(view)}
            className={cn(
              'h-12 flex items-center transition-all duration-300 relative group rounded-2xl shrink-0',
              isExpanded ? "w-full px-3 gap-4" : "w-12 justify-center mx-auto",
              currentView === view
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
            )}
          >
            <Icon className="h-6 w-6 shrink-0" />
            
            {isExpanded ? (
              <span className="font-semibold text-sm truncate">{label}</span>
            ) : (
              <span className="absolute left-16 bg-popover text-popover-foreground px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[100] border border-border">
                {label}
              </span>
            )}
          </button>
        ))}

        <div className={cn("h-[1px] bg-white/5 my-2 mx-auto", isExpanded ? "w-full" : "w-8")} />
        
        {[
          { icon: MessageSquare, label: 'Messages' },
          { icon: FileText, label: 'Notes' },
          { icon: Users, label: 'Community' }
        ].map((item, i) => (
          <button 
            key={i}
            className={cn(
              "h-12 flex items-center text-muted-foreground hover:bg-white/5 transition-all rounded-2xl shrink-0",
              isExpanded ? "w-full px-3 gap-4" : "w-12 justify-center mx-auto"
            )}
          >
            <item.icon className="h-6 w-6 shrink-0" />
            {isExpanded && <span className="font-semibold text-sm truncate">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="flex flex-col gap-4 w-full">
        <div className={cn(
          "flex items-center gap-1 group relative rounded-2xl bg-orange-500/10 text-orange-500 p-1 transition-all",
          isExpanded ? "px-3 py-2 gap-3" : "h-12 w-12 justify-center mx-auto"
        )}>
          <Flame className="h-6 w-6 shrink-0" />
          {isExpanded ? (
             <div className="flex flex-col">
               <span className="text-xs font-bold leading-none">STREAK</span>
               <span className="text-sm font-black">{streak} DAYS</span>
             </div>
          ) : (
            <span className="absolute -top-1 -right-1 bg-background rounded-full px-1 text-[8px] font-bold border border-orange-500/20">{streak}</span>
          )}
        </div>

        <button
          onClick={onCreateClick}
          className={cn(
            "h-12 flex items-center bg-primary text-primary-foreground hover:scale-105 transition-transform shadow-lg shadow-primary/20 rounded-2xl shrink-0",
            isExpanded ? "w-full px-3 gap-4" : "w-12 justify-center mx-auto"
          )}
        >
          <Plus className="h-6 w-6 shrink-0" />
          {isExpanded && <span className="font-bold text-sm">Add Subject</span>}
        </button>
      </div>
    </aside>
  );
}
