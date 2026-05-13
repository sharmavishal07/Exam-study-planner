import { useState } from 'react';
import { Subject, StudyTask } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalendarViewProps {
  tasks: StudyTask[];
  subjects: Subject[];
  onCompleteTask: (id: string) => void;
  compact?: boolean;
}

function toDateStr(d: Date) {
  return d.toLocaleDateString('en-CA');
}

function getSubjectName(subjects: Subject[], id: string) {
  return subjects.find((s) => s.id === id)?.name || 'Unknown';
}

export default function CalendarView({ tasks, subjects, onCompleteTask, compact = false }: CalendarViewProps) {
  const [weekOffset, setWeekOffset] = useState(0);

  const today = new Date();
  const startOfWeek = new Date(today);
  // Start from Sunday (0) like in the reference
  startOfWeek.setDate(today.getDate() - today.getDay() + weekOffset * 7);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  const dayNames = compact ? ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const todayStr = toDateStr(today);

  if (compact) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between text-sm font-bold tracking-tight">
           <span>{months[today.getMonth()]} {today.getFullYear()}</span>
           <div className="flex gap-2">
             <button onClick={() => setWeekOffset(p => p - 1)} className="hover:text-primary"><ChevronLeft className="h-4 w-4" /></button>
             <button onClick={() => setWeekOffset(p => p + 1)} className="hover:text-primary"><ChevronRight className="h-4 w-4" /></button>
           </div>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {dayNames.map((day, i) => (
            <div key={i} className="text-[10px] text-muted-foreground font-bold text-center mb-2">{day}</div>
          ))}
          {weekDays.map((day, i) => {
             const dateStr = toDateStr(day);
             const isToday = dateStr === todayStr;
             return (
               <div key={i} className="flex flex-col items-center">
                 <button 
                  className={cn(
                    "h-8 w-8 rounded-full text-xs font-bold transition-all flex items-center justify-center",
                    isToday ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" : "hover:bg-white/5"
                  )}
                 >
                   {day.getDate()}
                 </button>
               </div>
             )
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">
            {months[startOfWeek.getMonth()]} {startOfWeek.getFullYear()}
          </h2>
          <p className="text-sm text-muted-foreground">Weekly Schedule</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setWeekOffset((p) => p - 1)} className="rounded-xl hover:bg-white/5">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setWeekOffset(0)} className="font-bold hover:text-primary">
            Today
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setWeekOffset((p) => p + 1)} className="rounded-xl hover:bg-white/5">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDays.map((day, i) => {
          const dateStr = toDateStr(day);
          const dayTasks = tasks.filter((t) => t.scheduled_date === dateStr);
          const isToday = dateStr === todayStr;

          return (
            <div key={i} className="space-y-4">
              <div
                className={cn(
                  "text-center p-4 rounded-3xl transition-all border border-white/5",
                  isToday ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20 border-primary" : "bg-card/20"
                )}
              >
                <div className="text-[10px] font-bold uppercase tracking-widest opacity-70">{dayNames[i]}</div>
                <div className="text-2xl font-bold">{day.getDate()}</div>
              </div>
              <div className="space-y-3 min-h-[300px]">
                {dayTasks.map((task) => (
                  <Card
                    key={task.id}
                    className={cn(
                      "glass-card p-4 rounded-2xl cursor-pointer group",
                      task.completed && "opacity-40"
                    )}
                    onClick={() => onCompleteTask(task.id)}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox checked={task.completed} className="mt-1 h-4 w-4 rounded-md border-primary/40 data-[state=checked]:bg-primary" />
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-xs font-bold leading-tight group-hover:text-primary transition-colors", task.completed && "line-through")}>
                          {getSubjectName(subjects, task.subject_id)}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">
                          {task.topic_title || `Topic ${task.topic_number}`}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
