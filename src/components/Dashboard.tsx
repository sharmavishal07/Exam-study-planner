import { Subject, StudyTask, StreakData } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Flame, TrendingUp, BookOpen, MoreVertical, Clock, GraduationCap } from 'lucide-react';
import WeeklyChart from './WeeklyChart';

interface DashboardProps {
  subjects: Subject[];
  todayTasks: StudyTask[];
  allTasks: StudyTask[];
  streak: StreakData;
  totalCompleted: number;
  totalTasks: number;
  onCompleteTask: (id: string) => void;
}

function getSubjectName(subjects: Subject[], id: string) {
  return subjects.find((s) => s.id === id)?.name || 'Unknown';
}

function getDifficultyColor(subjects: Subject[], id: string) {
  const diff = subjects.find((s) => s.id === id)?.difficulty;
  if (diff === 'hard') return 'text-destructive';
  if (diff === 'medium') return 'text-orange-500';
  return 'text-primary';
}

export default function Dashboard({
  subjects,
  todayTasks,
  allTasks,
  streak,
  totalCompleted,
  totalTasks,
  onCompleteTask,
}: DashboardProps) {
  const upcomingExams = subjects
    .filter((s) => new Date(s.exam_date) >= new Date())
    .sort((a, b) => new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime())
    .slice(0, 4);

  const overallProgress = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Stats Section - Matching Reference Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: BookOpen, label: 'Today\'s Topics', value: todayTasks.length.toString().padStart(2, '0'), total: 'Total topics', color: 'text-primary' },
          { icon: GraduationCap, label: 'Overall Progress', value: `${overallProgress}%`, total: 'Total completion', color: 'text-mint' },
          { icon: Flame, label: 'Current Streak', value: streak.current_streak.toString().padStart(2, '0'), total: 'Study days', color: 'text-orange-500' },
          { icon: Clock, label: 'Total Hours', value: Math.round(totalCompleted * 0.5).toString().padStart(2, '0'), total: 'Time spent', color: 'text-blue-400' },
        ].map((stat, i) => (
          <Card key={i} className="glass-panel p-6 rounded-[2rem] border-none flex flex-col gap-4 group hover:bg-card/80 transition-all cursor-default relative overflow-hidden">
             <div className="flex justify-between items-start">
               <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                 <stat.icon className="h-6 w-6" />
               </div>
               <button className="text-muted-foreground hover:text-foreground transition-colors">
                 <MoreVertical className="h-5 w-5" />
               </button>
             </div>
             <div className="space-y-1">
               <p className="text-4xl font-bold tracking-tight">{stat.value}</p>
               <p className="text-sm text-muted-foreground font-medium">{stat.total}</p>
             </div>
             {/* Decorative glow */}
             <div className="absolute -bottom-6 -right-6 h-12 w-12 bg-primary/10 blur-2xl group-hover:bg-primary/20 transition-all"></div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Teaching Lessons Style Task List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">Current Study Sessions</h2>
            <div className="flex gap-4">
               <Badge variant="outline" className="bg-white/5 border-none px-3 py-1 text-xs">Priority</Badge>
               <Badge variant="outline" className="bg-white/5 border-none px-3 py-1 text-xs">Today</Badge>
            </div>
          </div>

          <div className="space-y-4">
            {todayTasks.length === 0 ? (
              <div className="glass-panel p-12 rounded-3xl text-center border-dashed border-white/10">
                <p className="text-muted-foreground">No sessions scheduled for today. Ready for a break?</p>
              </div>
            ) : (
              todayTasks.map((task) => {
                const subject = subjects.find(s => s.id === task.subject_id);
                return (
                  <div key={task.id} className="glass-panel p-5 rounded-3xl flex items-center gap-6 group hover:border-primary/20 transition-all">
                    <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center relative">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => onCompleteTask(task.id)}
                        className="h-6 w-6 rounded-lg border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${getDifficultyColor(subjects, task.subject_id)}`}>
                          {subject?.difficulty}
                        </span>
                        <div className="h-1 w-1 bg-white/20 rounded-full" />
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
                          {task.estimated_minutes} Min
                        </span>
                      </div>
                      <p className={`text-lg font-semibold tracking-tight ${task.completed ? 'line-through opacity-40' : ''}`}>
                         {subject?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {task.topic_title || `Topic ${task.topic_number}`}
                      </p>
                    </div>

                    <div className="hidden sm:flex flex-col items-end gap-2">
                       <button className="px-5 py-2 rounded-full bg-white/5 hover:bg-primary hover:text-primary-foreground text-sm font-semibold transition-all">
                          Session Info
                       </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Attendance Report Style Chart */}
        <div className="space-y-6">
           <div className="flex items-center justify-between">
             <h2 className="text-xl font-bold tracking-tight">Study Activity</h2>
             <select className="bg-white/5 border-none text-xs rounded-lg px-2 py-1 outline-none">
                <option>Weekly</option>
                <option>Monthly</option>
             </select>
           </div>
           
           <Card className="glass-panel p-6 rounded-[2rem] border-none h-[400px]">
              <WeeklyChart tasks={allTasks} />
           </Card>

           <div className="space-y-4">
              <h3 className="font-semibold px-2">Upcoming Exams</h3>
              <div className="space-y-3">
                {upcomingExams.map(s => (
                  <div key={s.id} className="p-4 rounded-2xl bg-white/5 flex items-center justify-between">
                    <div>
                       <p className="text-sm font-bold">{s.name}</p>
                       <p className="text-xs text-muted-foreground">{new Date(s.exam_date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-xs font-bold text-primary">{Math.round((s.completed_topics/s.total_topics)*100)}%</p>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
