import { useState } from 'react';
import AppSidebar from '@/components/AppSidebar';
import Dashboard from '@/components/Dashboard';
import CalendarView from '@/components/CalendarView';
import SubjectManager from '@/components/SubjectManager';
import SettingsPanel from '@/components/SettingsPanel';
import StudyTools from '@/components/StudyTools';
import ProfilePanel from '@/components/ProfilePanel';
import { UserNav } from '@/components/UserNav';
import { useStudyPlanner } from '@/hooks/useStudyPlanner';
import { Search, Bell, Calendar as CalendarIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/components/AuthContext';

type View = 'dashboard' | 'calendar' | 'subjects' | 'settings' | 'tools' | 'profile';

const Index = () => {
  const [view, setView] = useState<View>('dashboard');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const planner = useStudyPlanner();
  const { user } = useAuth();

  const handleCreateClick = () => {
    setView('subjects');
    setShowAddDialog(true);
  };

  const userName = user?.email?.split('@')[0] || "Guest";

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      {/* Slim Left Sidebar */}
      <AppSidebar
        currentView={view}
        onViewChange={setView}
        streak={planner.streak.current_streak}
        onCreateClick={handleCreateClick}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="flex items-center justify-between px-10 py-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Greeting, {userName}!</h1>
              <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="relative w-64 hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search everything..." className="pl-10 bg-card/40 border-none h-10 rounded-xl" />
              </div>
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <button className="p-2.5 rounded-xl bg-card/40 hover:bg-card/60 transition-colors relative">
                  <Bell className="h-5 w-5 text-foreground/80" />
                  <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-primary rounded-full border-2 border-background"></span>
                </button>
                <UserNav onViewChange={setView} />
              </div>
            </div>
          </header>

          {/* Dynamic Content */}
          <div className="flex-1 px-10 pb-10 overflow-y-auto custom-scrollbar">
            {view === 'dashboard' && (
              <Dashboard
                subjects={planner.subjects}
                todayTasks={planner.todayTasks}
                allTasks={planner.tasks}
                streak={planner.streak}
                totalCompleted={planner.totalCompleted}
                totalTasks={planner.totalTasks}
                onCompleteTask={planner.completeTask}
              />
            )}
            {view === 'calendar' && (
              <CalendarView
                tasks={planner.tasks}
                subjects={planner.subjects}
                onCompleteTask={planner.completeTask}
              />
            )}
            {view === 'subjects' && (
              <SubjectManager
                subjects={planner.subjects}
                onAdd={planner.addSubject}
                onDelete={planner.deleteSubject}
                showAddDialog={showAddDialog}
                onShowAddDialog={setShowAddDialog}
              />
            )}
            {view === 'tools' && <StudyTools />}
            {view === 'settings' && (
              <SettingsPanel
                settings={planner.settings}
                onUpdate={planner.updateSettings}
                onGeneratePlan={planner.generatePlan}
                onReschedule={planner.doReschedule}
                hasSubjects={planner.subjects.length > 0}
                hasTasks={planner.tasks.length > 0}
              />
            )}
            {view === 'profile' && <ProfilePanel />}
          </div>
        </main>

        {/* Right Activity Sidebar */}
        <aside className="w-[380px] hidden xl:flex flex-col border-l border-white/5 bg-card/20 backdrop-blur-sm p-8 overflow-y-auto custom-scrollbar">
          <div className="space-y-10">
            {/* User Profile Summary */}
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                   {userName.slice(0, 2).toUpperCase()}
                 </div>
                 <div>
                   <p className="text-sm font-semibold">{userName}</p>
                   <p className="text-xs text-muted-foreground">{user?.email || "Guest Account"}</p>
                 </div>
               </div>
            </div>

            {/* Calendar */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-primary" />
                  Activity Calendar
                </h3>
              </div>
              <div className="p-4 rounded-2xl bg-card/40 border border-white/5">
                <CalendarView
                  tasks={planner.tasks}
                  subjects={planner.subjects}
                  onCompleteTask={planner.completeTask}
                  compact
                />
              </div>
            </div>

            {/* Upcoming Tasks Section */}
            <div className="space-y-6">
              <h3 className="font-semibold">Upcoming Tasks</h3>
              <div className="space-y-4">
                {planner.tasks
                  .filter(t => !t.completed && new Date(t.scheduled_date) >= new Date())
                  .slice(0, 4)
                  .map(task => {
                    const subject = planner.subjects.find(s => s.id === task.subject_id);
                    return (
                      <div key={task.id} className="flex items-center gap-4 p-4 rounded-2xl bg-card/30 border border-white/5 group hover:bg-card/50 transition-colors">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                          <CalendarIcon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{subject?.name || "Topic"} - Part {task.topic_number}</p>
                          <p className="text-xs text-muted-foreground">{task.scheduled_date}</p>
                        </div>
                      </div>
                    );
                  })}
                {planner.tasks.filter(t => !t.completed).length === 0 && (
                  <p className="text-sm text-muted-foreground italic text-center py-4">No upcoming tasks. Relax!</p>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Index;
