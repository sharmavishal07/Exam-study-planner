import { StudyTask } from '@/lib/types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface Props {
  tasks: StudyTask[];
}

export default function WeeklyChart({ tasks }: Props) {
  const today = new Date();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get last 7 days
  const data = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toLocaleDateString('en-CA');
    const completed = tasks.filter((t) => t.scheduled_date === dateStr && t.completed).length;
    return {
      day: dayNames[d.getDay()],
      completed,
    };
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(171, 77%, 64%)" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="hsl(171, 77%, 64%)" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
        <XAxis 
          dataKey="day" 
          tick={{ fontSize: 10, fill: '#64748b' }} 
          axisLine={false} 
          tickLine={false} 
        />
        <YAxis 
          allowDecimals={false} 
          tick={{ fontSize: 10, fill: '#64748b' }} 
          axisLine={false} 
          tickLine={false} 
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#0f172a', 
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            fontSize: '12px'
          }}
        />
        <Area 
          type="monotone" 
          dataKey="completed" 
          stroke="hsl(171, 77%, 64%)" 
          strokeWidth={3}
          fillOpacity={1} 
          fill="url(#colorValue)" 
          name="Topics Completed"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
