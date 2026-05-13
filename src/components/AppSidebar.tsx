import { cn } from '@/lib/utils';
import {
  LayoutGrid,
  CalendarDays,
  BookOpen,
  Settings,
  Flame,
  Plus,
  Timer,
  Bell,
  MessageSquare,
  FileText,
  Users
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
  { view: 'settings', icon: Settings, label: 'Time Table Generator' },
];

export default function AppSidebar({ currentView, onViewChange, streak, onCreateClick }: SidebarProps) {
  return (
    <aside className="flex flex-col w-20 h-full bg-card border-r border-white/5 items-center py-8 gap-10 z-50">
      {/* Brand Icon */}
      <div className="flex items-center justify-center h-12 w-12 rounded-2xl bg-primary/10 text-primary">
        <BookOpen className="h-7 w-7" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-4">
        {navItems.map(({ view, icon: Icon, label }) => (
          <button
            key={view}
            onClick={() => onViewChange(view)}
            title={label}
            className={cn(
              'h-12 w-12 flex items-center justify-center rounded-2xl transition-all duration-300 relative group',
              currentView === view
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
            )}
          >
            <Icon className="h-6 w-6" />
            
            {/* Tooltip appearance hint */}
            <span className="absolute left-16 bg-popover text-popover-foreground px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[100] border border-border">
               {label}
            </span>
          </button>
        ))}

        {/* Mock extra icons from reference */}
        <div className="w-8 h-[1px] bg-white/5 my-2 mx-auto" />
        
        <button className="h-12 w-12 flex items-center justify-center rounded-2xl text-muted-foreground hover:bg-white/5 transition-all">
          <MessageSquare className="h-6 w-6" />
        </button>
        <button className="h-12 w-12 flex items-center justify-center rounded-2xl text-muted-foreground hover:bg-white/5 transition-all">
          <FileText className="h-6 w-6" />
        </button>
        <button className="h-12 w-12 flex items-center justify-center rounded-2xl text-muted-foreground hover:bg-white/5 transition-all">
          <Users className="h-6 w-6" />
        </button>
      </nav>

      {/* Bottom Actions */}
      <div className="flex flex-col gap-4 items-center">
        <div className="flex flex-col items-center gap-1 group relative">
          <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500 transition-transform group-hover:scale-110">
            <Flame className="h-6 w-6" />
          </div>
          <span className="text-[10px] font-bold text-orange-500">{streak}d</span>
        </div>

        <button
          onClick={onCreateClick}
          className="h-12 w-12 flex items-center justify-center rounded-2xl bg-primary text-primary-foreground hover:scale-110 transition-transform shadow-lg shadow-primary/20"
          title="Add Subject"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>
    </aside>
  );
}
